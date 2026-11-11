# 05 Prioritized Backlog (RICE)

> Example run. Reach = share of the 4 interviewed customers whose pains the story addresses. Effort: S=1, M=2, L=4.

| Rank | Story | Reach | Impact | Confidence | Effort | RICE |
|------|-------|-------|--------|------------|--------|------|
| 1 | A2 Group-size guard | 0.75 | 3 | 100% | 1 | 0.75 x 3 x 1.0 / 1 = **2.25** |
| 2 | C2 Champion credits | 0.50 | 2 | 80% | 1 | 0.50 x 2 x 0.8 / 1 = **0.80** |
| 3 | A1 Team dashboard | 0.75 | 2 | 100% | 2 | 0.75 x 2 x 1.0 / 2 = **0.75** |
| 4 | C1 Publish a workflow | 0.75 | 2 | 80% | 2 | 0.75 x 2 x 0.8 / 2 = **0.60** |
| 5 | B1 Value report | 0.50 | 3 | 50% | 4 | 0.50 x 3 x 0.5 / 4 = **0.19** |
| 6 | C3 Personal insights | 0.25 | 1 | 50% | 2 | 0.25 x 1 x 0.5 / 2 = **0.06** |
| Spike | A3 Metadata discovery | n/a | n/a | n/a | 2 | Prerequisite for A1 and B1 |

## Release cut
- **Release 1 (MVP):** A3 spike first, then A2, A1, C1, C2.
- **Later:** B1 (after the spike confirms data), C3.

## Validate before building
- B1 and C3, at 50% confidence.

## Stakeholder summary
1. We build trust first: privacy guardrails and team-level views ship before any value reporting.
2. The workflow library with credited contributors is the fastest route to spreading adoption.
3. The value report waits on a two-week data spike, so we don't promise numbers we can't measure.
