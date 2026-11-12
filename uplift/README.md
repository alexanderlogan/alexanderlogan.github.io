# Uplift: an agentic product development pipeline

A working demonstration of AI-native product management. Four customer interviews go in; a cited research synthesis, a PRD, an independent critic review, user stories with acceptance criteria, and a RICE-ranked backlog come out, with a human approval gate in the middle.

It runs two ways from one playbook: in **Claude Code** with `/run-pipeline`, and as a **live web page** where visitors watch each stage stream and make the approval decision themselves.

The product is fictional: **Uplift**, AI adoption analytics for knowledge-worker organizations. All interview data is invented.

Live page: [alexander-logan.netlify.app/uplift](https://alexander-logan.netlify.app/uplift/)

## The business problem

Most enterprises have now procured AI licenses at scale (Claude, Copilot, Gemini), and most are approaching the first renewal cycle without a credible answer to the question the CFO will ask: what are we getting for it? Leaders can report how many people logged in. What they have no way to see is which workflows people actually use AI for, where adoption stalls, how much time it saves, and who the internal champions are whose methods everyone else should be learning from. Self-reported time savings do not survive a finance review, so the renewal decision ends up resting on anecdote. In the interviews behind this demo, an L&D leader at an insurance carrier admits she can tell her executives how many people logged in and nothing more, and a CIO at a German manufacturer describes a board that wants one number he has no way to produce.

The obvious remedy, measuring individuals, deepens the problem it is meant to solve. Employees read individual measurement as surveillance and, more pointedly, as a mechanism for converting their productivity gains into more work rather than recognition. A senior analyst in the research says as much, observing that if her manager sees she finishes in two hours what used to take eight, she gets six more hours of work, not credit. In Europe the constraint becomes formal, because a works council must approve any system capable of evaluating employee performance, and the data must remain in the EU. A tool that reads as monitoring suppresses the adoption it was procured to measure, and in some markets it never clears procurement at all.

Uplift's mandate is therefore narrower and harder than adoption analytics in the usual sense: prove the value of AI by workflow without measuring individuals. In practice that means team-level views with minimum group sizes so that no one can be singled out, a way to package and spread what the few power users have already worked out (one VP of Product estimates that fifteen of his 120 product managers have built real workflows while the rest mostly use it to rewrite emails), recognition that employees control and choose to share, and privacy designed in from the start so that works councils and regulators can approve it quickly rather than eventually.

### Why this product, for this demo

The demo itself addresses a related but distinct problem. Product teams adopting AI tools tend to get faster at producing documents without getting better at the decisions those documents exist to support. Uplift was chosen as the subject because it is the problem most organizations rolling out AI are living through right now, and because the tension between what leaders want to measure and what employees will accept gives the critic and the human approval gate real decisions to make rather than approvals to wave through. The product is fictional and every interview is invented. The tension is not.

## How it works
| Stage | Component | Output |
|-------|-----------|--------|
| Research synthesis | `.claude/skills/research-synthesis` | `output/01_research_synthesis.md` |
| PRD | `.claude/skills/prd-writer` | `output/02_prd.md` |
| Critic review | `.claude/agents/prd-critic` (subagent) | `output/03_prd_review.md` |
| Human approval | the PM accepts or rejects each critic fix | |
| User stories | `.claude/skills/story-writer` | `output/04_user_stories.md` |
| Backlog | `.claude/skills/backlog-prioritizer` | `output/05_backlog.md` |

Team standards live in `CLAUDE.md` and the skills: every insight cites its source, every Must requirement traces to evidence, acceptance criteria use Given/When/Then, and prioritization shows its arithmetic. Change those files and both the CLI and the web page follow.

## Run it in Claude Code
1. Copy this `uplift/` folder to your machine.
2. Open it in Claude Code (`claude` in a terminal, or the Code tab in the Claude desktop app).
3. Type `/run-pipeline`. It stops after the critic review for your decision.

Stage timings are recorded by `scripts/runlog.py` to `output/run_log.jsonl` from the system clock. The files in `output/` are the reference run shown on the page; yours will differ.

## Run it as a web page
The page (`index.html`, `web/runner.js`) calls a Netlify Edge Function, `netlify/edge-functions/uplift.js` at the repository root, which runs one stage per request and streams Claude's summarized thinking and output back.

- **One playbook.** The function builds its prompts from the same `CLAUDE.md`, skills and subagent files (`server/core.js`, plus `server/prompts.generated.js` generated by `build_site.py`). It adds only a short note on output format.
- **Your choices drive the outcome.** The critic returns numbered fixes; the visitor ticks the ones they accept. Accepted fixes are passed to the story writer as binding changes, rejected ones as out of scope, and stories cite the fix they came from. Visitors can go back to the gate and try different choices (up to three paths per run).
- **Reasoning depth.** A "Show reasoning" checkbox picks high effort (Claude reasons before each step and the page streams a summary of it) or medium effort (faster, often no reasoning). The server accepts only those two values.
- **Not an open proxy.** The browser only names a stage and the accepted fix numbers. Prompts, model and token limits are fixed on the server, and calls must come from the same site.
- **Spend caps.** Netlify Blobs keeps a per-visitor daily run count (visitors are identified by a salted hash of their IP; raw IPs are not stored) and a monthly dollar total from the API's reported usage. When a cap is hit or the API fails, the page plays a recorded run from `replay/` instead.

To deploy your own copy:
1. Deploy the repository to Netlify. `package.json` at the root brings in `@anthropic-ai/sdk` and `@netlify/blobs`.
2. Set environment variables: `ANTHROPIC_API_KEY` (required for live mode), and optionally `UPLIFT_MODEL` (default `claude-sonnet-5-5`), `UPLIFT_EFFORT` (default `high`), `UPLIFT_MONTHLY_CAP_USD` (default `20`), `UPLIFT_RUNS_PER_DAY` (default `10`).
3. After editing a skill, run `python build_site.py` so the page and the web runner use the new playbook.

### Recording replays
Open the page with `?record` (for example `/uplift/?record`), do a live run, try two or three different choices at the gate, then press **Download recording**. Save the file in `replay/` and list it in `replay/index.json`:

```json
{ "runs": [ { "file": "uplift-run-2026-11-12T100000.json" } ] }
```

The first listed run is used. In replay mode, the visitor's gate choice plays the recorded path closest to it, and the page says so.

## Design principles
- Humans decide; agents draft and challenge.
- Evidence over assertion: no uncited research claims.
- Privacy by design: team-level aggregation, opt-in personal insights, no content monitoring.
- Model-agnostic: skills are plain markdown, portable to other agent platforms.

## License
MIT. See [LICENSE](./LICENSE).

Built by [Alexander Logan](https://lloydstrategy.com/).
