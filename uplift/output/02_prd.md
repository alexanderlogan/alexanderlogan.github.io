# 02 PRD: Uplift Release 1 "Adoption Insights"

> Example run. Traces to themes in 01_research_synthesis.md.

## 1. Problem statement
Organizations have bought AI tools at scale but cannot show value by workflow (Theme 1), know-how stays with a few power users (Theme 2), and employees resist anything that feels like surveillance (Theme 3). Buyers in regulated markets cannot purchase without privacy-by-design (Theme 4).

## 2. Goals and success metrics
| Goal | Metric | Baseline |
|------|--------|----------|
| Prove value to finance | Customers using the value report in a renewal decision | TBD |
| Spread proven workflows | Share of teams adopting at least one library workflow within 90 days | TBD |
| Earn employee trust | Opt-in rate for personal insights | TBD, target 40% |
| Fast approval | Median days to works-council or privacy sign-off | TBD |

## 3. Non-goals (Release 1)
- No individual rankings or leaderboards (Theme 3; [02, Tom K.]).
- No reading of prompts, documents, or outputs (Theme 3; [03, Aisha B.]).
- No performance-review integration.
- No self-built AI assistant; we measure tools customers already own.

## 4. Personas
- **Executive buyer:** L&D or transformation leader proving ROI (01).
- **Functional leader:** VP who wants to spread workflows (02).
- **Employee:** knowledge worker who decides whether to opt in (03).
- **IT and privacy approver:** CIO with works-council obligations (04).

## 5. Requirements
| # | Requirement | Priority | Theme |
|---|-------------|----------|-------|
| R1 | Ingest usage metadata from at least two AI tools' admin APIs, normalized to a common schema | Must | 1, 5 |
| R2 | Adoption dashboard by function and workflow category, team level only, minimum group size enforced | Must | 1, 3, 4 |
| R3 | Value report combining usage with customer-chosen outcome metrics (e.g., cycle time) | Must | 1 |
| R4 | Workflow library: employees publish workflows with attribution; others adopt with one click | Must | 2 |
| R5 | Opt-in personal insights visible only to the employee | Should | 3 |
| R6 | Privacy pack: data processing documentation, EU data residency option, configurable aggregation threshold | Must | 4 |
| R7 | License utilization view (unused seats) | Should | 5 |
| R8 | Champion recognition: contribution credits exportable by the employee | Could | 2, 3 |

## 6. UX notes
- The executive view opens on "value by workflow," not on logins.
- The employee view opens on "what's useful to me," and states what is never collected.

## 7. Risks and assumptions
- Assumption: admin APIs expose enough metadata to infer workflow categories without content. Must validate.
- Risk: small teams make aggregation re-identifiable.
- Risk: customers configure outcome metrics that become individual performance measures.

## 8. Open questions
- How do we categorize workflows from metadata alone?
- Which two tools to integrate first?
