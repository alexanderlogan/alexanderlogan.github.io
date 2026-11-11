---
description: Run the full discovery-to-backlog pipeline with a human approval gate
---

Run the PDLC pipeline on the interviews in data/interviews/.

Timing is part of the output. Around every stage, record the clock with `python3 scripts/runlog.py <start|end> <stage>` (use `python` if `python3` is not available). Run the start line immediately before the stage's work and the end line immediately after its file is written. Never type or estimate timestamps yourself.

0. Run `python3 scripts/runlog.py reset`.
1. Stage `research`: use the research-synthesis skill. Write output/01_research_synthesis.md.
2. Stage `prd`: use the prd-writer skill. Write output/02_prd.md.
3. Stage `critic`: delegate review to the prd-critic subagent. It writes output/03_prd_review.md.
4. Stage `gate`: run `start gate`, then STOP. Show me the critic's verdict and top 3 issues in a short summary, and ask me to approve, edit, or reject the PRD, and which of the critic's fixes I accept. Wait for my answer. As soon as I answer, run `end gate --decision <approve|edit|reject> --raised <issues in the review> --accepted <fixes I accepted>`. If I reject, stop here.
5. Stage `stories`: use the story-writer skill. Write output/04_user_stories.md.
6. Stage `backlog`: use the backlog-prioritizer skill. Write output/05_backlog.md.
7. Finish with a 5-line summary: files produced, number of themes, stories, the proposed Release 1, and the cycle time (interviews to approved PRD, and human time at the gate) read from output/run_log.jsonl.
