# PDLC Agentic Demo: Project Context

## Purpose
A working demonstration of AI-native, agentic product development: how a product team can encode its standards as reusable skills, keep humans at the decision gates, and move from raw customer research to a prioritized backlog in one session.

## The pipeline
Raw customer interviews -> research synthesis -> PRD -> critic review -> human approval -> user stories with acceptance criteria -> prioritized backlog.
Each step is a reusable skill. A critic subagent challenges the PRD before a human approves it.
Principle: encode the team's standards as skills, keep humans at the decision gates, and measure the cycle time.

## Fictional product used in the demo
"Uplift", AI adoption analytics for knowledge-worker organizations.
Problem space: companies have bought AI licenses (Claude, Copilot, Gemini) but cannot see which workflows people actually use AI for, where adoption stalls, how much time is saved, or who the internal champions are. Employees fear surveillance and replacement.
Core tension: leadership wants measurement and ROI; employees want privacy, trust, and credit for what they learn.
Why this product: measuring and accelerating AI adoption is the problem every organization rolling out AI tools faces right now.
All data in /data is invented. Never present it as real customer data.

## Project layout
- data/interviews/        mock customer interview transcripts (input)
- .claude/skills/         research-synthesis, prd-writer, story-writer, backlog-prioritizer
- .claude/agents/         prd-critic (subagent)
- .claude/commands/       /run-pipeline runs the whole flow with an approval gate
- output/                 everything the pipeline produces (safe to delete and rerun)
- scripts/runlog.py       records stage timings to output/run_log.jsonl
- server/, web/, replay/  the live web version of this pipeline (see README.md)

## Working rules
- Every insight in the synthesis must cite the interview file and speaker it came from. No uncited claims.
- Stop and ask the human to approve the PRD before writing stories. Never skip the gate.
- Acceptance criteria use Given / When / Then.
- Prioritization uses RICE; show the arithmetic.
- Privacy by design: team-level aggregation, opt-in for individual insights, no keystroke or content monitoring. The critic must test every requirement against this.
- Write outputs as markdown files in /output, one file per stage, numbered 01_ to 05_.
- Model-agnostic by design: skills are plain markdown, portable to any agent platform.
