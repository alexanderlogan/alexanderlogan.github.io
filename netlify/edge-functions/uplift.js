// Live runner for the Uplift demo: runs one pipeline stage per request and streams
// Claude's summarized thinking and output to the page as server-sent events.
//
// Not a general proxy: the browser only names a stage and, at the approval gate, the
// critic fixes it accepts. Prompts, model and token limits are fixed here. Run state
// lives in Netlify Blobs, and spend is capped per visitor per day and per month.
//
// Settings (Netlify environment variables):
//   ANTHROPIC_API_KEY         required for live mode; without it the page uses replay
//   UPLIFT_MODEL              default claude-sonnet-5-5
//   UPLIFT_EFFORT             default medium
//   UPLIFT_MONTHLY_CAP_USD    default 20
//   UPLIFT_RUNS_PER_DAY       default 3 (per visitor)

import Anthropic from "@anthropic-ai/sdk";
import { getStore } from "@netlify/blobs";
import PROMPTS from "../../uplift/server/prompts.generated.js";
import { buildRequest, parseCritic, costUSD, canRun, nextAfter, MAX_PATHS } from "../../uplift/server/core.js";

const env = (key, fallback) => Netlify.env.get(key) || fallback;
// $ per million tokens, Claude Sonnet 5.5. Update if UPLIFT_MODEL changes.
const PRICE = { input: 2, output: 10, cacheRead: 0.1 };
const RUN_RESERVE_USD = 1.5; // worst case for one run with a retried gate, kept free under the cap
const RUN_TTL_MS = 2 * 60 * 60 * 1000;
const MAX_TOKENS = 16000;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

async function sha256(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export default async (req, context) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  // Same-origin only: the page on this site is the only intended caller.
  const origin = req.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(req.url).host) return json({ error: "Forbidden" }, 403);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad request" }, 400);
  }
  const store = getStore({ name: "uplift", consistency: "strong" });
  if (body.action === "start") return start(store, context);
  if (body.action === "stage") return stage(store, body);
  return json({ error: "Unknown action" }, 400);
};

export const config = { path: "/api/uplift" };

async function start(store, context) {
  if (!Netlify.env.get("ANTHROPIC_API_KEY")) return json({ mode: "replay", reason: "Live mode is not configured on this site." });
  const day = new Date().toISOString().slice(0, 10);
  const month = day.slice(0, 7);
  const cap = Number(env("UPLIFT_MONTHLY_CAP_USD", "20"));
  const perDay = Number(env("UPLIFT_RUNS_PER_DAY", "3"));

  const spent = (await store.get(`spend/${month}`, { type: "json" }))?.usd ?? 0;
  if (spent + RUN_RESERVE_USD > cap) return json({ mode: "replay", reason: "This month's budget for live runs is used up." });

  // Visitors are counted by a salted hash of their IP; raw IPs are never stored.
  const visitor = await sha256(`${context.ip}|${month}|uplift`);
  const vkey = `visitors/${day}/${visitor}`;
  const used = (await store.get(vkey, { type: "json" }))?.runs ?? 0;
  if (used >= perDay) return json({ mode: "replay", reason: `You've used today's ${perDay} live runs.` });
  await store.setJSON(vkey, { runs: used + 1 });

  const runId = crypto.randomUUID();
  await store.setJSON(`runs/${runId}`, { created: Date.now(), next: "research", paths: 0, outputs: {}, issues: [] });
  return json({ mode: "live", runId, model: env("UPLIFT_MODEL", "claude-sonnet-5-5"), runsLeft: perDay - used - 1, maxPaths: MAX_PATHS });
}

async function stage(store, body) {
  const key = `runs/${String(body.runId).slice(0, 64)}`;
  const run = await store.get(key, { type: "json" });
  if (!run) return json({ error: "Run not found" }, 404);
  if (Date.now() - run.created > RUN_TTL_MS) return json({ error: "This run has expired. Start a new one." }, 410);
  const name = body.stage;
  if (!canRun(run, name)) return json({ error: `Stage ${name} can't run now (next is ${run.next}).` }, 409);

  let accepted = [];
  if (name === "stories") {
    const ids = new Set(run.issues.map((i) => i.id));
    accepted = Array.isArray(body.accepted) ? [...new Set(body.accepted)].filter((id) => ids.has(id)) : [];
  }

  // Claim the stage before calling the model, so a double click can't start it twice.
  run.next = "busy:" + name;
  await store.setJSON(key, run);

  const model = env("UPLIFT_MODEL", "claude-sonnet-5-5");
  const { system, messages } = buildRequest(name, PROMPTS, run, accepted);
  const client = new Anthropic({ apiKey: Netlify.env.get("ANTHROPIC_API_KEY") });
  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(ctrl) {
      const send = (event, data) => ctrl.enqueue(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      const t0 = Date.now();
      try {
        const s = client.beta.messages.stream({
          model,
          max_tokens: MAX_TOKENS,
          thinking: { type: "adaptive", display: "summarized" },
          output_config: { effort: env("UPLIFT_EFFORT", "medium") },
          // If a safety classifier declines, the API re-runs the request on a fallback model.
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          system,
          messages,
        });
        for await (const ev of s) {
          if (ev.type !== "content_block_delta") continue;
          if (ev.delta.type === "thinking_delta") send("thinking", { t: ev.delta.thinking });
          else if (ev.delta.type === "text_delta") send("text", { t: ev.delta.text });
        }
        const msg = await s.finalMessage();
        if (msg.stop_reason === "refusal") throw new Error("The model declined this request.");
        const text = msg.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();

        const done = { stage: name, ms: Date.now() - t0, model: msg.model, truncated: msg.stop_reason === "max_tokens" };
        if (name === "critic") {
          const c = parseCritic(text);
          run.outputs.critic = c.markdown;
          run.issues = c.issues;
          Object.assign(done, { output: c.markdown, verdict: c.verdict, issues: c.issues });
        } else {
          run.outputs[name] = text;
          done.output = text;
        }
        if (name === "stories") done.accepted = accepted;
        if (name === "backlog") run.paths += 1;
        run.next = nextAfter(name);
        done.paths = run.paths;
        await store.setJSON(key, run);

        const month = new Date().toISOString().slice(0, 7);
        const spend = (await store.get(`spend/${month}`, { type: "json" })) || { usd: 0, calls: 0 };
        spend.usd += costUSD(msg.usage, PRICE);
        spend.calls += 1;
        await store.setJSON(`spend/${month}`, spend);

        send("done", done);
      } catch (err) {
        // Let the PM retry the stage; the page offers replay if it keeps failing.
        run.next = name === "stories" && run.paths > 0 ? "done" : name === "stories" ? "gate" : name;
        await store.setJSON(key, run).catch(() => {});
        const status = err?.status;
        send("error", {
          message: status === 429 || status === 529 ? "Claude is busy right now." : err?.message?.slice(0, 200) || "Live run failed.",
        });
      }
      ctrl.close();
    },
  });
  return new Response(stream, {
    headers: { "content-type": "text/event-stream", "cache-control": "no-store", "x-accel-buffering": "no" },
  });
}
