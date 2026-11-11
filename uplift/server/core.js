// Pipeline logic shared by the web runner (netlify/edge-functions/uplift.js) and its tests.
// Prompts are built from the same CLAUDE.md, SKILL.md and subagent files that Claude Code
// runs, so the web and CLI versions of the pipeline follow one playbook.
// Plain ESM with web-standard APIs only: runs on Netlify Edge (Deno) and on Node.

export const STAGES = ["research", "prd", "critic", "stories", "backlog"];

export const OUTPUT_FILE = {
  research: "output/01_research_synthesis.md",
  prd: "output/02_prd.md",
  critic: "output/03_prd_review.md",
  stories: "output/04_user_stories.md",
  backlog: "output/05_backlog.md",
};

// What each stage may run after. "gate" is the human approval step (no model call).
// After a finished run the PM may go back to the gate and try different choices.
export const MAX_PATHS = 3;
export function canRun(run, stage) {
  if (stage === "stories") {
    return run.next === "gate" || (run.next === "done" && run.paths < MAX_PATHS);
  }
  return run.next === stage;
}
export function nextAfter(stage) {
  return { research: "prd", prd: "critic", critic: "gate", stories: "backlog", backlog: "done" }[stage];
}

const WEB_RUNNER = `## Web runner
You are running one stage of this pipeline inside a web page, not in Claude Code. You have no file tools.
- Where a skill says to read a file, the file's contents are given to you in the user message.
- Where a skill says to write a file, reply with that file's full markdown contents only: no preamble before it and no remarks after it.
- The web page runs the next stage and the human approval gate itself. Ignore instructions to hand off to another skill or subagent, and do not ask questions or wait for approval.`;

const file = (path, text) => `<file path="${path}">\n${text.trim()}\n</file>`;
const skill = (name, text) => `<skill name="${name}">\n${text.trim()}\n</skill>`;

/**
 * Build the Messages API system prompt and user message for one stage.
 * @param {string} stage one of STAGES
 * @param {object} p prompts.generated.js default export
 * @param {object} run stored run state ({outputs, issues})
 * @param {number[]} accepted critic fix ids the PM accepted (stories stage only)
 */
export function buildRequest(stage, p, run, accepted = []) {
  const o = run.outputs || {};
  const system = `${p.claudeMd.trim()}\n\n${WEB_RUNNER}`;
  let parts;
  switch (stage) {
    case "research":
      parts = [
        "Run the research-synthesis skill.",
        skill("research-synthesis", p.skills["research-synthesis"]),
        ...p.interviews.map((iv) => file(`data/interviews/${iv.file}`, iv.text)),
      ];
      break;
    case "prd":
      parts = [
        "Run the prd-writer skill.",
        skill("prd-writer", p.skills["prd-writer"]),
        file(OUTPUT_FILE.research, o.research),
      ];
      break;
    case "critic":
      parts = [
        "You are the prd-critic subagent. Review the PRD.",
        skill("prd-critic", p.critic),
        file(OUTPUT_FILE.research, o.research),
        file(OUTPUT_FILE.prd, o.prd),
        `Number every top issue (1, 2, 3, ...). The human PM will accept or reject each fix by its number.
After the review, end your reply with one fenced \`\`\`json block in exactly this shape, matching the issues above:
{"verdict": "Ready" | "Ready with changes" | "Not ready", "issues": [{"id": 1, "title": "short issue title", "lens": "Engineering" | "Privacy" | "End user", "fix": "the concrete suggested fix"}]}`,
      ];
      break;
    case "stories": {
      const issues = run.issues || [];
      const yes = issues.filter((i) => accepted.includes(i.id));
      const no = issues.filter((i) => !accepted.includes(i.id));
      const list = (xs) => (xs.length ? xs.map((i) => `- Fix ${i.id}: ${i.title}. ${i.fix}`).join("\n") : "- None");
      parts = [
        "Run the story-writer skill.",
        skill("story-writer", p.skills["story-writer"]),
        file(OUTPUT_FILE.prd, o.prd),
        file(OUTPUT_FILE.critic, o.critic),
        `<approval>
The human PM approved the PRD in this session, with these decisions on the critic's fixes.
Accepted fixes. Apply each as a binding change to the PRD before writing stories:
${list(yes)}
Rejected fixes. Do not apply these; the PRD stands as written on these points:
${list(no)}
Wherever a story exists or changed because of an accepted fix, add a line "Source: critic fix N" to that story.
</approval>`,
      ];
      break;
    }
    case "backlog":
      parts = [
        "Run the backlog-prioritizer skill.",
        skill("backlog-prioritizer", p.skills["backlog-prioritizer"]),
        file(OUTPUT_FILE.stories, o.stories),
        file(OUTPUT_FILE.research, o.research),
      ];
      break;
    default:
      throw new Error(`unknown stage ${stage}`);
  }
  parts.push(`Reply with the contents of ${OUTPUT_FILE[stage]}.`);
  return { system, messages: [{ role: "user", content: parts.join("\n\n") }] };
}

const VERDICTS = ["Ready", "Ready with changes", "Not ready"];
const clip = (s, n) => String(s ?? "").trim().slice(0, n);

/** Split the critic's reply into the review markdown and its numbered fixes. */
export function parseCritic(text) {
  const blocks = [...text.matchAll(/```json\s*([\s\S]*?)```/g)];
  const last = blocks[blocks.length - 1];
  let markdown = text.trim();
  let verdict = null;
  let issues = [];
  if (last) {
    markdown = (text.slice(0, last.index) + text.slice(last.index + last[0].length)).trim();
    try {
      const j = JSON.parse(last[1]);
      if (VERDICTS.includes(j.verdict)) verdict = j.verdict;
      if (Array.isArray(j.issues)) {
        issues = j.issues
          .filter((i) => Number.isInteger(i?.id) && i.id > 0 && i.title)
          .slice(0, 15)
          .map((i) => ({ id: i.id, title: clip(i.title, 200), lens: clip(i.lens, 40), fix: clip(i.fix, 600) }));
      }
    } catch {
      /* fall through to the markdown parse below */
    }
  }
  if (!verdict) {
    const m = markdown.match(/Verdict:?\**\s*:?\s*(Ready with changes|Not ready|Ready)/i);
    if (m) verdict = VERDICTS.find((v) => v.toLowerCase() === m[1].toLowerCase());
  }
  if (!issues.length) {
    // Only look inside the "Top issues" section, so numbered questions aren't taken as fixes.
    const top = markdown.match(/^#{1,3}[^\n]*Top issues[^\n]*\n([\s\S]*?)(?=^#{1,2}\s|(?![\s\S]))/im);
    const section = top ? top[1] : markdown;
    // Fallback: headings like "### 1. Title", else top-level items like "1. **Title.** ... **Fix:** ..."
    const headed = [...section.matchAll(/^#{3,4}\s*(\d+)\.\s+()()(.+)$/gm)];
    const listed = [...section.matchAll(/^(\d+)\.\s+(?:\*\*(.+?)\*\*(.*)|(.+))$/gm)];
    for (const m of headed.length ? headed : listed) {
      if (!m[2]) { m[2] = m[4]; m[3] = ""; }
      const fix = (m[3].match(/\*\*Fix:\*\*\s*(.+)$/) || [])[1] || m[3];
      issues.push({ id: Number(m[1]), title: clip(m[2].replace(/[.:]$/, ""), 200), lens: "", fix: clip(fix, 600) });
      if (issues.length >= 15) break;
    }
  }
  return { markdown, verdict, issues };
}

/** Dollar cost of one response, from its usage block. Prices are per million tokens. */
export function costUSD(usage, price) {
  const u = usage || {};
  return (
    ((u.input_tokens || 0) * price.input +
      (u.cache_creation_input_tokens || 0) * price.input * 1.25 +
      (u.cache_read_input_tokens || 0) * price.cacheRead +
      (u.output_tokens || 0) * price.output) /
    1e6
  );
}
