# Uplift: an agentic product development pipeline in Claude Code

A working demonstration of AI-native product management. Four customer interviews go in; a cited research synthesis, a PRD, an independent critic review, user stories with acceptance criteria, and a RICE-ranked backlog come out, with a human approval gate in the middle.

The product is fictional: **Uplift**, AI adoption analytics for knowledge-worker organizations. All interview data is invented.

Live page: [/uplift](./index.html)

## How it works
| Stage | Component | Output |
|-------|-----------|--------|
| Research synthesis | `.claude/skills/research-synthesis` | `output/01_research_synthesis.md` |
| PRD | `.claude/skills/prd-writer` | `output/02_prd.md` |
| Critic review | `.claude/agents/prd-critic` (subagent) | `output/03_prd_review.md` |
| Human approval | `/run-pipeline` stops and waits | |
| User stories | `.claude/skills/story-writer` | `output/04_user_stories.md` |
| Backlog | `.claude/skills/backlog-prioritizer` | `output/05_backlog.md` |

Team standards live in `CLAUDE.md` and the skills: every insight cites its source, every Must requirement traces to evidence, acceptance criteria use Given/When/Then, and prioritization shows its arithmetic.

## Run it yourself
1. Copy this `uplift/` folder to your machine.
2. Open it in Claude Code (`claude` in a terminal, or the Code tab in the Claude desktop app).
3. Clear `output/`, then type `/run-pipeline`.

The files in `output/` are an example run. Your results will differ.

## Design principles
- Humans decide; agents draft and challenge.
- Evidence over assertion: no uncited research claims.
- Privacy by design: team-level aggregation, opt-in personal insights, no content monitoring.
- Model-agnostic: skills are plain markdown, portable to other agent platforms.

## Rebuilding the page
`python3 build_site.py` regenerates `index.html` from the project files.

Built by [Alexander Logan](https://lloydstrategy.com/).
