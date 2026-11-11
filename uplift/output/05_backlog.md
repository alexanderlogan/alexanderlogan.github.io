# 05 Prioritized Backlog: Uplift v1

> Fictional product for a demo. Inputs: 04_user_stories.md and 01_research_synthesis.md.

## Scoring rules
- **Reach:** share of the 4 interviews affected, from the frequency of the story's primary theme (4/4 = 1.0, 3/4 = 0.75, 2/4 = 0.5, 1/4 = 0.25).
- **Impact:** from theme severity. T1 and T2 (High) = 3; T3 and T4 (Medium-High) = 2; T5 (Medium) = 1. A weak signal uses the impact of the theme it supports.
- **Confidence:** 100% when an interviewee asked for it directly; 80% when it comes from the critic or from legal obligations rather than a direct quote; 50% when the data source or method is unverified, or only one interviewee said it.
- **Effort:** S = 1, M = 2, L = 4.
- **RICE** = Reach × Impact × Confidence ÷ Effort.

## Ranked backlog
| Rank | Story | Req | Primary evidence | Reach | Impact | Conf. | Effort | RICE arithmetic | RICE | Flag |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | S5 Retention and deletion | R3b | T1 (4/4) | 1.0 | 3 | 80% | 1 | 1.0 × 3 × 0.8 ÷ 1 | **2.40** | |
| 1 | S6 Break-glass vendor access | R3c | T1 (4/4) | 1.0 | 3 | 80% | 1 | 1.0 × 3 × 0.8 ÷ 1 | **2.40** | |
| 1 | S7 Deletion on departure | R3d | T1 (4/4) | 1.0 | 3 | 80% | 1 | 1.0 × 3 × 0.8 ÷ 1 | **2.40** | |
| 1 | S11 Transparency page | R9 | T1 (4/4) | 1.0 | 3 | 80% | 1 | 1.0 × 3 × 0.8 ÷ 1 | **2.40** | |
| 5 | S1 Team aggregation floor | R1a | T1 (4/4) | 1.0 | 3 | 100% | 2 | 1.0 × 3 × 1.0 ÷ 2 | **1.50** | |
| 5 | S3 No content captured | R2 | T1 (4/4) | 1.0 | 3 | 100% | 2 | 1.0 × 3 × 1.0 ÷ 2 | **1.50** | |
| 5 | S12 Privacy summary export | R10 | Councils [01], [04] | 0.5 | 3 | 100% | 1 | 0.5 × 3 × 1.0 ÷ 1 | **1.50** | |
| 5 | S14 Admin API data check | R0 | T3 (3/4) | 0.75 | 2 | 100% | 1 | 0.75 × 2 × 1.0 ÷ 1 | **1.50** | |
| 9 | S4 Pseudonymised records | R3a | T1 (4/4) | 1.0 | 3 | 80% | 2 | 1.0 × 3 × 0.8 ÷ 2 | **1.20** | |
| 9 | S9 Private view, revocable opt-in | R3 | T1 (4/4) | 1.0 | 3 | 80% | 2 | 1.0 × 3 × 0.8 ÷ 2 | **1.20** | |
| 9 | S19 Private reuse counts, no ranking | R6a | [02] leaderboards, [03] credit | 0.5 | 3 | 80% | 1 | 0.5 × 3 × 0.8 ÷ 1 | **1.20** | |
| 12 | S10 DPIA and works-agreement pack | R3e | Councils [01], [04] | 0.5 | 3 | 100% | 2 | 0.5 × 3 × 1.0 ÷ 2 | **0.75** | |
| 13 | S2 Suppression that holds up against subtraction | R1b | T1 (4/4) | 1.0 | 3 | 80% | 4 | 1.0 × 3 × 0.8 ÷ 4 | **0.60** | |
| 13 | S18 Publish workflow | R6 | T4 (3/4) | 0.75 | 2 | 80% | 2 | 0.75 × 2 × 0.8 ÷ 2 | **0.60** | |
| 15 | S13 Acceptable-use commitment | R14 | Replacement fear [03] | 0.25 | 3 | 50% | 1 | 0.25 × 3 × 0.5 ÷ 1 | **0.375** | Validate before building |
| 15 | S21 Private peer suggestions | R7 | T4 (3/4); asked for only by [03] | 0.75 | 2 | 50% | 2 | 0.75 × 2 × 0.5 ÷ 2 | **0.375** | Validate before building |
| 17 | S20 Anonymity warning, withdrawal, moderation | R6b | Confidentiality [03] | 0.25 | 3 | 80% | 2 | 0.25 × 3 × 0.8 ÷ 2 | **0.30** | |
| 18 | S16 Value report with outcomes | R5 | T2 (3/4) | 0.75 | 3 | 50% | 4 | 0.75 × 3 × 0.5 ÷ 4 | **0.28** | Validate before building |
| 19 | S17 Cross-tool normalized view | R8 | Weak signal [04] | 0.25 | 2 | 80% | 2 | 0.25 × 2 × 0.8 ÷ 2 | **0.20** | |
| 20 | S8 EU data residency | R12 | [04] hard requirement | 0.25 | 3 | 100% | 4 | 0.25 × 3 × 1.0 ÷ 4 | **0.19** | |
| 20 | S15 Adoption by function and workflow | R4 | T3 (3/4) | 0.75 | 2 | 50% | 4 | 0.75 × 2 × 0.5 ÷ 4 | **0.19** | Validate before building |

**What the ranking shows:** the leader-facing value (S15, S16) ranks near the bottom. Demand for it is not low. Its score is cut in half because the data source and the value method are unverified. S14 is cheap and ranks high because it resolves that uncertainty.

## Release cut

### Release 1: council-approvable foundation plus validation (26 points)
S5, S6, S7, S11, S1, S3, S12, S14, S4, S9, S19, S10, S2, S18, plus:
- **S13** (RICE 0.375): pulled in because S11, the transparency page, depends on it.
- **S20** (RICE 0.30): pulled in as a risk guard, because S18 would otherwise launch a library of free-text workflows with no way to remove leaked client content [03, Aisha].

### Release 1b: leader insights, unlocked by S14 (8 points)
S15, then S16. Start once S14 confirms what the admin APIs expose, and once one pilot finance team has validated the S16 method. That brings their confidence up from 50%.

### Later
- S21 (validate demand with more end-user interviews first)
- S17 (cross-tool view, a single-interview signal)
- **S8 EU residency:** a Must from the human gate, but RICE is 0.19 with one interview. Pull it into Release 1 the moment an EU or German pilot is signed; otherwise schedule it later.

### Validate before building (50% confidence)
S13, S15, S16, S21.

## Stakeholder summary
1. Release 1 ships the privacy and trust foundation an employee council or works council can approve, plus a cheap technical check of what data the AI tools expose. RICE ranks this work highest because privacy came up in all 4 interviews.
2. The leader dashboard and value report (S15, S16) follow in Release 1b, once that check confirms the data exists and a finance team has validated the method. Until then they are 50% confidence bets.
3. EU residency is gated on signing an EU pilot. Four stories need more customer evidence before we build them.
