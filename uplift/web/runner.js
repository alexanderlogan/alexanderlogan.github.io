// Uplift live runner: drives the pipeline from the page, one stage at a time.
// Live mode streams from /api/uplift (netlify/edge-functions/uplift.js).
// Replay mode plays a recorded real run from replay/*.json when live mode is unavailable.
(function () {
  "use strict";

  const STEPS = [
    { id: "research", n: "01", name: "Synthesize research", kind: "skill", actor: "Agent" },
    { id: "prd", n: "02", name: "Draft the PRD", kind: "skill", actor: "Agent" },
    { id: "critic", n: "03", name: "Critic review", kind: "subagent", actor: "Agent" },
    { id: "gate", n: "04", name: "Human approval", kind: "gate", actor: "You" },
    { id: "stories", n: "05", name: "Write stories", kind: "skill", actor: "Agent" },
    { id: "backlog", n: "06", name: "Prioritize", kind: "skill", actor: "Agent" },
  ];
  const API = "/api/uplift";
  const RECORD = /[?&]record\b/.test(location.search);

  // ---------- helpers ----------
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  if (window.marked) marked.use({ renderer: { html: (t) => esc(typeof t === "string" ? t : t.text) } });
  const md = (t) => (window.marked ? marked.parse(t || "") : `<pre>${esc(t)}</pre>`);
  const dur = (ms) => {
    const s = Math.max(0, Math.round(ms / 1000));
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  };
  // Hide the critic's machine-readable JSON block from the rendered review.
  const visible = (id, text) => (id === "critic" ? text.replace(/```json[\s\S]*$/, "").trim() : text);

  // ---------- state ----------
  let S;
  function reset() {
    S = {
      mode: null, runId: null, model: null, replay: null, speed: 4,
      stage: {}, // id -> {status, ms, t0, thinking, text, output, events}
      issues: [], verdict: null,
      paths: [], // [{accepted, gateMs, rejected, stories, backlog}]
      gateT0: null, selected: "research", busy: false, maxPaths: 3,
    };
    STEPS.forEach((s) => (S.stage[s.id] = { status: "pending", thinking: "", text: "", events: [] }));
  }
  const curPath = () => S.paths[S.paths.length - 1];
  const stageData = (id) => (id === "stories" || id === "backlog") && curPath()?.[id] ? curPath()[id] : S.stage[id];

  // ---------- rendering ----------
  function renderTrack() {
    $("lrTrack").innerHTML = STEPS.map((s) => {
      const d = s.id === "gate" ? gateState() : stageData(s.id);
      const st = d.status;
      const label = st === "running" ? `<span class="lr-live">${dur(Date.now() - d.t0)}</span>`
        : st === "done" ? `&#10003; ${dur(d.ms)}`
        : st === "waiting" ? "Your decision"
        : st === "failed" ? "Failed" : st === "rejected" ? "Rejected" : "Waiting";
      return `<li><button class="lr-step ${st} ${s.kind === "gate" ? "is-gate" : ""} ${S.selected === s.id ? "sel" : ""}" data-id="${s.id}" ${st === "pending" ? "disabled" : ""}>
        <span class="n">${s.n}</span><span class="nm">${s.name}</span><span class="kd">${s.kind}</span><span class="st">${label}</span></button></li>`;
    }).join("");
  }
  function gateState() {
    const p = curPath();
    if (S.gateT0) return { status: "waiting", ms: 0 };
    if (p && p.rejected) return { status: "rejected", ms: p.gateMs };
    if (p) return { status: "done", ms: p.gateMs };
    return { status: "pending" };
  }

  let renderQueued = false;
  function render() {
    if (renderQueued) return;
    renderQueued = true;
    setTimeout(() => { renderQueued = false; renderNow(); }, 120);
  }
  function renderNow() {
    renderTrack();
    const step = STEPS.find((s) => s.id === S.selected);
    $("lrTitle").textContent = `${step.n} · ${step.name}`;
    const gateOpen = S.selected === "gate";
    $("lrGate").hidden = !gateOpen;
    $("lrThinkWrap").hidden = gateOpen;
    $("lrOut").hidden = gateOpen;
    if (gateOpen) return renderGate();
    const d = stageData(S.selected);
    $("lrTimer").textContent = d.status === "running" ? `running · ${dur(Date.now() - d.t0)}` : d.status === "done" ? `took ${dur(d.ms)}` : "";
    const think = $("lrThink");
    const atBottom = think.scrollHeight - think.scrollTop - think.clientHeight < 40;
    think.textContent = d.thinking || (d.status === "running" ? "Thinking…" : S.effort === "medium" ? "Fast mode: Claude skipped extended reasoning on this step. Tick \"Show reasoning\" for the next run." : "No reasoning recorded for this step.");
    if (atBottom) think.scrollTop = think.scrollHeight;
    const text = d.output || d.text;
    // A failed step says why at the top of its own panel, where the person is looking.
    const failNote = d.status === "failed" ? `<p class="lr-fail">This step failed: ${esc(d.error || "unknown error")} Use <b>Retry this step</b> above the stages.</p>` : "";
    $("lrOut").innerHTML = failNote + (text ? md(visible(S.selected, text)) : `<p class="lr-empty">${d.status === "running" ? "Writing…" : "Output appears here."}</p>`);
    if (d.status === "running") $("lrOut").scrollTop = $("lrOut").scrollHeight;
  }

  function renderGate() {
    const p = curPath();
    const waiting = !!S.gateT0;
    $("lrTimer").textContent = waiting ? `your review time · ${dur(Date.now() - S.gateT0)}` : p ? `took ${dur(p.gateMs)}` : "";
    // Build the fix list once per decision. The page re-renders every second to tick the
    // review timer; rebuilding the list then would wipe the person's checkbox choices.
    const key = waiting ? `wait:${S.gateT0}` : `done:${S.paths.length}`;
    if ($("lrGate").dataset.key === key) return;
    $("lrGate").dataset.key = key;
    const chosen = waiting ? (S.paths.length ? curPath().accepted : []) : p ? p.accepted : [];
    const replayNote = S.mode === "replay"
      ? `<p class="lr-note">Replay: stories come from the recorded path closest to your choices. In live mode Claude writes them for your exact choices.</p>` : "";
    $("lrGate").innerHTML = `
      <p class="lr-verdict">Critic verdict: <b>${esc(S.verdict || "see review")}</b></p>
      <p>Accept the fixes you agree with. Accepted fixes become binding changes to the PRD before stories are written; rejected ones are left out.</p>
      <ol class="lr-issues">${S.issues.map((i) => `<li><label>
        <input type="checkbox" value="${i.id}" ${chosen.includes(i.id) ? "checked" : ""} ${waiting ? "" : "disabled"}>
        <span><b>Fix ${i.id}. ${esc(i.title)}</b>${i.lens ? ` <span class="lr-lens">${esc(i.lens)}</span>` : ""}<br>${esc(i.fix)}</span></label></li>`).join("")}</ol>
      ${S.issues.length ? "" : `<p class="lr-note">The critic raised no numbered fixes. You can still approve or reject the PRD.</p>`}
      ${replayNote}
      ${waiting ? `<div class="lr-actions"><button class="lr-btn primary" id="lrApprove">Approve PRD and write stories</button>
        <button class="lr-btn" id="lrReject">Reject PRD</button></div>` : ""}`;
    if (waiting) {
      $("lrApprove").onclick = () => decide(true);
      $("lrReject").onclick = () => decide(false);
    }
  }

  function setMsg(html) { $("lrMsg").innerHTML = html; }
  function setMode() {
    $("lrMode").className = "lr-mode " + S.mode;
    $("lrMode").textContent = S.mode === "live"
      ? `Live · ${S.model} · ${S.effort === "medium" ? "fast" : "high effort"}`
      : `Replay · recorded run${S.replay?.recordedAt ? " of " + S.replay.recordedAt.slice(0, 10) : ""} · ${S.speed}× speed`;
  }
  setInterval(() => { if (S && (S.busy || S.gateT0)) render(); }, 1000);

  // ---------- live mode ----------
  async function post(body) {
    const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    return r;
  }

  async function startRun() {
    reset();
    $("lrResult").hidden = true;
    $("lrStart").disabled = true;
    setMsg("Starting…");
    let info;
    try {
      const r = await post({ action: "start", effort: $("lrDeep").checked ? "high" : "medium" });
      info = await r.json();
    } catch {
      info = { mode: "replay", reason: "The live runner can't be reached." };
    }
    if (info.mode === "live") {
      Object.assign(S, { mode: "live", runId: info.runId, model: info.model, effort: info.effort, maxPaths: info.maxPaths || 3 });
      setMode();
      setMsg(info.runsLeft >= 0 ? `${info.runsLeft} more live run${info.runsLeft === 1 ? "" : "s"} available to you today.` : "");
      runChain(["research", "prd", "critic"]);
    } else {
      startReplay(info.reason);
    }
  }

  async function runChain(ids, accepted) {
    for (const id of ids) {
      const ok = S.mode === "live" ? await liveStage(id, accepted) : await replayStage(id);
      if (!ok) return;
    }
    if (ids.includes("critic")) openGate();
    if (ids.includes("backlog")) finish();
  }

  async function liveStage(id, accepted) {
    const d = beginStage(id);
    try {
      const r = await post({ action: "stage", runId: S.runId, stage: id, accepted });
      if (!r.ok || !r.body) throw new Error((await r.json().catch(() => ({}))).error || "Live run failed.");
      const reader = r.body.pipeThrough(new TextDecoderStream()).getReader();
      let buf = "", done = null;
      for (;;) {
        const { value, done: end } = await reader.read();
        if (end) break;
        buf += value;
        let i;
        while ((i = buf.indexOf("\n\n")) >= 0) {
          const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
          const ev = (chunk.match(/^event: (.+)$/m) || [])[1];
          const data = JSON.parse((chunk.match(/^data: (.+)$/m) || [])[1] || "{}");
          if (ev === "thinking" || ev === "text") stream(d, ev, data.t);
          else if (ev === "done") done = data;
          else if (ev === "reset") {
            // The server is retrying after Claude was busy; drop the partial stream.
            d.thinking = ""; d.text = ""; d.events = []; d.t0 = Date.now();
            setMsg(esc(data.message)); render();
          }
          else if (ev === "error") throw new Error(data.message);
        }
      }
      if (!done) throw new Error("The connection closed before the step finished.");
      endStage(id, d, done);
      return true;
    } catch (e) {
      failStage(id, d, e.message);
      return false;
    }
  }

  function beginStage(id) {
    let d;
    if (id === "stories") {
      d = curPath().stories = { status: "running", t0: Date.now(), thinking: "", text: "", events: [] };
    } else if (id === "backlog") {
      d = curPath().backlog = { status: "running", t0: Date.now(), thinking: "", text: "", events: [] };
    } else {
      d = S.stage[id] = { status: "running", t0: Date.now(), thinking: "", text: "", events: [] };
    }
    S.busy = true;
    S.selected = id;
    render();
    return d;
  }
  function stream(d, kind, t) {
    if (kind === "thinking") d.thinking += t; else d.text += t;
    if (RECORD || S.mode === "live") d.events.push([Date.now() - d.t0, kind === "thinking" ? "th" : "tx", t]);
    render();
  }
  function endStage(id, d, info) {
    d.status = "done";
    d.ms = info.ms ?? Date.now() - d.t0;
    d.output = info.output ?? d.text;
    if (id === "critic") { S.issues = info.issues || []; S.verdict = info.verdict; }
    S.busy = false;
    render();
  }
  function failStage(id, d, message) {
    d.status = "failed";
    d.error = message;
    S.busy = false;
    $("lrStart").disabled = false;
    $("lrStart").textContent = "Start over";
    const canReplay = S.mode === "live";
    setMsg(`<span class="lr-err">${esc(message)}</span> <button class="lr-btn" id="lrRetry">Retry this step</button>
      ${canReplay ? `<button class="lr-btn" id="lrToReplay">Watch a recorded run instead</button>` : ""}`);
    $("lrRetry").onclick = () => {
      setMsg("");
      const accepted = id === "stories" || id === "backlog" ? curPath().accepted : undefined;
      const rest = id === "stories" ? ["stories", "backlog"] : id === "backlog" ? ["backlog"] : ["research", "prd", "critic"].slice(["research", "prd", "critic"].indexOf(id));
      runChain(rest, accepted);
    };
    if (canReplay) $("lrToReplay").onclick = () => { reset(); startReplay("Switched to a recorded run."); };
    render();
  }

  // ---------- the gate ----------
  function openGate() {
    S.gateT0 = Date.now();
    S.selected = "gate";
    setMsg("Your turn: review the critic's fixes and decide.");
    render();
    $("live").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function decide(approve) {
    const accepted = [...$("lrGate").querySelectorAll("input:checked")].map((x) => Number(x.value));
    const path = { accepted, gateMs: Date.now() - S.gateT0, rejected: !approve };
    S.gateT0 = null;
    S.paths.push(path);
    setMsg("");
    if (!approve) return finish();
    if (S.mode === "live") runChain(["stories", "backlog"], accepted);
    else replayPath(accepted);
  }
  function retryGate() {
    $("lrResult").hidden = true;
    S.gateT0 = Date.now();
    S.selected = "gate";
    setMsg("Try different choices: change which fixes you accept, and watch how the stories and backlog change.");
    render();
    $("live").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- replay mode ----------
  async function startReplay(reason) {
    S.mode = "replay";
    let list = [];
    try { list = (await (await fetch("replay/index.json", { cache: "no-store" })).json()).runs || []; } catch {}
    if (!list.length) {
      $("lrStart").disabled = false;
      setMsg(`${esc(reason || "")} No recorded runs are available yet, so see the reference run below.`);
      return;
    }
    try { S.replay = await (await fetch("replay/" + list[0].file)).json(); } catch {
      $("lrStart").disabled = false;
      return setMsg("The recorded run couldn't be loaded. See the reference run below.");
    }
    S.model = S.replay.model;
    setMode();
    setMsg(`${esc(reason || "")} Playing a recorded live run instead; step durations shown are the original measured times.`);
    runChain(["research", "prd", "critic"]);
  }
  function play(d, rec) {
    return new Promise((resolve) => {
      const evs = rec.events || [];
      let i = 0;
      const start = Date.now();
      (function tick() {
        const t = (Date.now() - start) * S.speed;
        while (i < evs.length && evs[i][0] <= t) { const [, k, x] = evs[i++]; if (k === "th") d.thinking += x; else d.text += x; }
        render();
        if (i < evs.length) setTimeout(tick, 60); else resolve();
      })();
    });
  }
  async function replayStage(id) {
    const rec = id === "stories" || id === "backlog" ? S.replayPath[id] : S.replay.stages[id];
    const d = beginStage(id);
    await play(d, rec);
    endStage(id, d, { ms: rec.ms, output: rec.output, issues: rec.issues, verdict: rec.verdict });
    return true;
  }
  function replayPath(accepted) {
    const want = new Set(accepted);
    const jac = (p) => {
      const a = new Set(p.accepted); const u = new Set([...a, ...want]);
      return u.size ? [...a].filter((x) => want.has(x)).length / u.size : 1;
    };
    S.replayPath = [...S.replay.paths].sort((a, b) => jac(b) - jac(a))[0];
    const same = jac(S.replayPath) === 1;
    const a = S.replayPath.accepted;
    curPath().playedAs = a; // the backlog shown is this recorded path's, so label it that way
    const which = a.length === 0 ? "no fixes were" : a.length === 1 ? `fix ${a[0]} was` : `fixes ${a.join(", ")} were`;
    if (!same) setMsg(`Replay: playing the recorded path where ${which} accepted, the closest to your choice.`);
    runChain(["stories", "backlog"]);
  }

  // ---------- result ----------
  function count(re, text) { return ((text || "").match(re) || []).length; }
  function oneLine(id, d, path) {
    const t = d?.output || "";
    switch (id) {
      case "research": { const n = count(/^#{2,4}\s*(Theme\b|T\d+[.:])/gim, t); return n ? `${n} themes, every claim cited` : "Themes and evidence"; }
      case "prd": return `PRD drafted (${t.split(/\s+/).length} words)`;
      case "critic": return `Verdict: ${S.verdict || "n/a"} · ${S.issues.length} fixes proposed`;
      case "gate": return path.rejected ? "Rejected the PRD; the run stopped"
        : `Accepted ${path.accepted.length} of ${S.issues.length} fixes${path.accepted.length ? " (" + path.accepted.map((x) => "#" + x).join(", ") + ")" : ""}`;
      case "stories": {
        // Every story carries a size estimate; fall back to "As a ..." lines.
        const n = count(/Size:?[*_]*\s*(S|M|L)\b/g, t) || count(/\bAs an?\b/g, t);
        const f = count(/Source:?[*_]*\s*critic fix/gi, t);
        return `${n} stories${f ? `, ${f} traced to critic fixes` : ""}`;
      }
      case "backlog": { const m = t.split("\n").find((l) => /Release 1/i.test(l)); return m ? m.replace(/^[\s>#|*-]+/, "").replace(/\*\*|__|\|/g, " ").replace(/\s+/g, " ").trim().slice(0, 160) : "RICE-ranked backlog"; }
    }
  }
  function finish() {
    S.busy = false;
    $("lrStart").disabled = false;
    $("lrStart").textContent = "Run again";
    const path = curPath();
    const agent = ["research", "prd", "critic"].reduce((a, id) => a + (S.stage[id].ms || 0), 0);
    const rows = [];
    ["research", "prd", "critic"].forEach((id) => rows.push({ id, ms: S.stage[id].ms, d: S.stage[id] }));
    S.paths.forEach((p, k) => {
      rows.push({ id: "gate", ms: p.gateMs, p, k });
      if (p.stories) rows.push({ id: "stories", ms: p.stories.ms, d: p.stories, p, k });
      if (p.backlog) rows.push({ id: "backlog", ms: p.backlog.ms, d: p.backlog, p, k });
    });
    const p1 = S.paths[0];
    const toPrd = agent + p1.gateMs;
    const toBacklog = p1.rejected ? null : toPrd + (p1.stories?.ms || 0) + (p1.backlog?.ms || 0);
    const human = S.paths.reduce((a, p) => a + p.gateMs, 0);
    const agentAll = rows.filter((r) => r.id !== "gate").reduce((a, r) => a + (r.ms || 0), 0);
    const total = rows.reduce((a, r) => a + (r.ms || 0), 0) || 1;
    const name = (id) => STEPS.find((s) => s.id === id).name;
    const tries = S.paths.length > 1;

    $("lrResult").innerHTML = `
      <div class="eyebrow">Outcome${S.mode === "replay" ? " · replay" : ""}</div>
      <h2>${path.rejected ? "PRD rejected" : "The prioritized backlog"}</h2>
      ${tries ? `<div class="tabs" id="lrPathTabs">${S.paths.filter((p) => !p.rejected).map((p, i) => `<button class="tab" data-k="${S.paths.indexOf(p)}" aria-selected="${i === S.paths.filter((x) => !x.rejected).length - 1}"><small>Try ${S.paths.indexOf(p) + 1}</small>Fixes ${(p.playedAs || p.accepted).join(", ") || "none"}</button>`).join("")}</div>` : ""}
      ${path.rejected ? `<p class="sub">You rejected the PRD, so no stories were written. That's the gate working: nothing becomes engineering work without a human yes.</p>` : `<div class="panel md" id="lrBacklog">${md(path.backlog.output)}</div>`}
      <h3 class="lr-h3">Every step, in the order it ran</h3>
      <div class="stats">
        <div class="stat"><div class="v">${dur(toPrd)}</div><div class="k">Interviews to ${p1.rejected ? "PRD decision" : "approved PRD"}</div></div>
        <div class="stat"><div class="v">${toBacklog ? dur(toBacklog) : "—"}</div><div class="k">Interviews to ranked backlog</div></div>
        <div class="stat"><div class="v">${dur(agentAll)}</div><div class="k">Agent time</div></div>
        <div class="stat human"><div class="v">${dur(human)}</div><div class="k">Human time at the gate${tries ? ` (${S.paths.length} decisions)` : ""}</div></div>
      </div>
      <div class="timeline" role="img" aria-label="${rows.map((r) => name(r.id) + " " + dur(r.ms || 0)).join(", ")}">${rows.map((r) => `<div class="seg ${r.id === "gate" ? "gate" : ""}" style="flex:${Math.max(r.ms || 0, total / 120)}" title="${name(r.id)}: ${dur(r.ms || 0)}"></div>`).join("")}</div>
      <ol class="lr-summary">${rows.map((r) => `<li class="${r.id === "gate" ? "gate" : ""}">
        <span class="who">${STEPS.find((s) => s.id === r.id).actor}</span>
        <span class="what"><b>${name(r.id)}</b>${tries && r.k !== undefined ? ` <span class="lr-lens">try ${r.k + 1}</span>` : ""}<br>${esc(oneLine(r.id, r.d, r.p))}</span>
        <span class="t">${dur(r.ms || 0)}</span></li>`).join("")}</ol>
      <p class="method">Times come from the page's clock as each step streamed${S.mode === "replay" ? " in the original recorded run" : ""}. Gate time is how long the person took to decide.${S.model ? ` Model: ${esc(S.model)}.` : ""}</p>
      <div class="lr-actions">
        ${!path.rejected && S.paths.length < S.maxPaths && (S.mode === "live" || (S.replay?.paths.length || 0) > 1) ? `<button class="lr-btn primary" id="lrRetryGate">Try different choices at the gate</button>` : ""}
        ${RECORD && S.mode === "live" ? `<button class="lr-btn" id="lrDownload">Download recording</button>` : ""}
      </div>`;
    $("lrResult").hidden = false;
    if ($("lrRetryGate")) $("lrRetryGate").onclick = retryGate;
    if ($("lrDownload")) $("lrDownload").onclick = download;
    if (tries) $("lrPathTabs").onclick = (e) => {
      const b = e.target.closest(".tab"); if (!b) return;
      $("lrPathTabs").querySelectorAll(".tab").forEach((x) => x.setAttribute("aria-selected", x === b));
      $("lrBacklog").innerHTML = md(S.paths[+b.dataset.k].backlog.output);
    };
    setMsg("");
    render();
    $("lrResult").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function download() {
    const pick = (d) => ({ ms: d.ms, output: d.output, events: d.events });
    const rec = {
      version: 1, recordedAt: new Date().toISOString(), model: S.model,
      stages: {
        research: pick(S.stage.research), prd: pick(S.stage.prd),
        critic: { ...pick(S.stage.critic), verdict: S.verdict, issues: S.issues },
      },
      paths: S.paths.filter((p) => !p.rejected && p.backlog).map((p) => ({ accepted: p.accepted, gateMs: p.gateMs, stories: pick(p.stories), backlog: pick(p.backlog) })),
    };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(rec)], { type: "application/json" }));
    a.download = `uplift-run-${rec.recordedAt.slice(0, 19).replace(/:/g, "")}.json`;
    a.click();
  }

  // ---------- wire up ----------
  reset();
  renderNow();
  $("lrStart").onclick = () => { if (!S.busy) startRun(); };
  $("lrTrack").onclick = (e) => {
    const b = e.target.closest(".lr-step"); if (!b || b.disabled) return;
    S.selected = b.dataset.id; renderNow();
  };
})();
