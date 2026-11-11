---
description: Run the full discovery-to-backlog pipeline with a human approval gate
---

Run the PDLC pipeline on the interviews in data/interviews/:

1. Use the research-synthesis skill. Write output/01_research_synthesis.md.
2. Use the prd-writer skill. Write output/02_prd.md.
3. Delegate review to the prd-critic subagent. It writes output/03_prd_review.md.
4. STOP. Show me the critic's verdict and top 3 issues in a short summary, and ask me to approve, edit, or reject the PRD. Wait for my answer.
5. After approval, use the story-writer skill. Write output/04_user_stories.md.
6. Use the backlog-prioritizer skill. Write output/05_backlog.md.
7. Finish with a 5-line summary: files produced, number of themes, stories, and the proposed Release 1.
