---
name: backlog-prioritizer
description: Prioritize user stories into a ranked backlog using RICE with visible arithmetic. Use when asked to prioritize, rank, or plan a backlog or release.
---

# Backlog Prioritizer

## Input
output/04_user_stories.md and output/01_research_synthesis.md.

## Steps
1. For each story estimate:
   - Reach: share of interviewed customers affected (from synthesis frequency)
   - Impact: 3 / 2 / 1 / 0.5 / 0.25 (from theme severity)
   - Confidence: 100% / 80% / 50% (lower when evidence is thin)
   - Effort: S=1, M=2, L=4
2. Compute RICE = Reach x Impact x Confidence / Effort. Show the arithmetic in a table.
3. Rank stories. Propose Release 1 (MVP) and Later.
4. Flag any story where confidence is 50% as "validate before building".

## Output
Write output/05_backlog.md with the ranked table, the release cut, and a 3-line summary for stakeholders.
