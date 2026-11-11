# 02 PRD: Uplift v1, Trusted AI Adoption Insights

> Fictional product for a demo. Based on fictional interviews in /data.
> **Status:** Approved with edits at the human gate. Critic fixes #1, #2, #3, #4, #6, #10 applied (see 03_prd_review.md). Fixes #5, #7, #8, #9, #11, #12, #13 were not accepted for v1 and stay open.

## 1. Problem statement
Organizations have bought enterprise AI licenses but cannot see what they get from them. Leaders (L&D, Product, IT) can report logins but not which workflows AI is used for, how much value it creates, or who the internal experts are (T2, T3, T4). Employees use AI quietly because visible gains bring more work instead of credit, and because they fear surveillance and replacement (T1, T5). Formal bodies (employee councils, German works councils) will block any tool that evaluates individuals (T1). Uplift has to deliver leader-grade insight that employees and councils trust.

## 2. Goals and success metrics
| Goal | Metric | Baseline | Target (v1 pilots) |
|---|---|---|---|
| Credible value reporting (T2) | % of pilot buyers who use an Uplift report in a renewal or board review | TBD (0 today; logins only) | ≥ 60% |
| Workflow-level visibility (T3) | % of active AI usage attributed to a workflow category (as defined in R4) at team level | TBD | ≥ 70% |
| Knowledge spreads (T4, T5) | Teams adopting at least one shared workflow within 60 days | TBD | ≥ 30% of pilot teams |
| Trust (T1) | Time from works-council / employee-council submission to approval | TBD (Lukas: "a few months" if privacy-first) | ≤ 90 days, with 0 privacy-related rejections |

## 3. Non-goals (v1)
- No individual-level performance scoring, rankings, or leaderboards (T1; [02, Tom] on gaming). This includes ranking or sorting library contributors.
- No capture of prompt text, documents, outputs, or keystrokes. No content-based classification of prompts, even in transit (fix #1).
- No productivity-based workforce or headcount recommendations.
- No presenting team time saved as "capacity available for reallocation" (fix #10).
- No mandatory recognition: contributor credit is opt-in.
- Not a prompt-engineering training platform.

## 4. Users and personas
- **Enablement leader** (VP L&D, insurance): targets training and defends renewal spend.
- **Functional leader** (VP Product, SaaS): spreads proven workflows; measures outcomes such as cycle time.
- **IT / CIO** (EU manufacturer): needs a cross-tool view, license utilization, and works-council approval.
- **Knowledge worker** (Senior Analyst, advisory): wants useful tips back and credit, never content monitoring.

## 5. Requirements
| ID | Requirement | Priority | Theme |
|---|---|---|---|
| R0 | **Gate before R4/R5:** a time-boxed technical check lists the exact fields each candidate tool's admin API returns, with their granularity. R4 and R5 stories start only after it confirms the R4 definition is feasible. (fix #1) | Must | T3 |
| R1a | Leader-facing insights are aggregated to "team", meaning an HRIS org unit. A vendor-enforced minimum group size (floor 5) applies; customers can raise it but never lower it. (fix #2) | Must | T1 |
| R1b | Suppression applies to every filter combination and time slice, with complementary suppression so hidden groups cannot be derived by subtraction. No views of membership changes below the threshold. Counts are banded, not exact. (fix #2) | Must | T1 |
| R2 | The product never collects or stores prompt text, documents, or outputs; only usage metadata and workflow categories. | Must | T1 |
| R3 | Individual-level insights are visible only to the individual unless that person explicitly opts in to share them; opt-in is revocable. | Must | T1, T5 |
| R3a | Per-person records are pseudonymised and cannot be queried through any customer-facing UI, API, or export, including by admins. (fix #3) | Must | T1 |
| R3b | Raw per-person events are aggregated and then deleted after a fixed retention period, stated on the transparency page (R9). (fix #3) | Must | T1 |
| R3c | Any access to raw data by Uplift staff is logged and needs a break-glass approval. (fix #3) | Must | T1 |
| R3d | An employee's individual data is deleted when they leave, and the deletion is verified. (fix #3) | Must | T1 |
| R3e | The product ships with a DPIA template and a draft works agreement (Betriebsvereinbarung). (fix #3) | Must | T1 |
| R4 | Leaders see adoption by function and by workflow category over time. **Workflow category** = the tool's app surface or feature (e.g. "drafting in documents", "spreadsheet analysis"), plus library workflows that employees self-report using (R6). (fix #1) | Must | T3 |
| R5 | A value report combines adoption with outcome measures the customer defines (e.g. spec cycle time) and shows methodology and confidence, beyond self-reported time saved. | Must | T2 |
| R6 | Employees can publish a workflow (description, steps, tool) to an internal library, with attribution they control (named or anonymous). | Must | T4, T5 |
| R6a | Reuse counts are visible only to the contributor; leaders see reuse only as team-level aggregates under R1. The library never sorts or ranks by contributor. (fix #6) | Must | T1, T5 |
| R6b | Choosing anonymous publishing shows a warning about being identified from the title or details. Contributors can withdraw a workflow. Any user can report a workflow that contains confidential content, and a moderator can remove it. (fix #6) | Must | T1, T4 |
| R7 | Employees get personal, private suggestions of workflows that peers in similar roles use. (promoted from Should, fix #10) | Must | T4, T1 |
| R8 | Usage from at least two AI tools is shown on one normalized view. | Should | Weak signal (cross-tool) |
| R9 | A transparency page shows employees exactly what is collected, who sees what, the retention period, and the customer's acceptable-use commitment (R14). (promoted, fix #4) | Must | T1 |
| R10 | Admin exports a privacy and data-processing summary for council or DPO review. (promoted, fix #4) | Must | T1 |
| R11 | License utilization shows seats unused for N days, at team level. | Could | Weak signal |
| R12 | Customer can choose EU data residency. (promoted, fix #4) | Must | T1; [04, Lukas] |
| R13 | Contributors can export a record of their published workflows and reuse counts for performance reviews. | Could | T5 |
| R14 | Before go-live, the customer accepts an acceptable-use commitment that Uplift data will not be used for headcount, individual performance, or disciplinary decisions. It is shown on R9. (fix #10) | Must | T1, T5 |

## 6. User experience notes
- **Leader:** opens a dashboard; sees adoption by function and workflow category; drills into a team (if above threshold); generates a value report for finance with methodology notes.
- **Employee:** sees a private "your AI use" view and a "what works for people like you" feed; can publish a workflow and choose whether their name shows; sees reuse of their own workflows privately.
- **Admin / DPO:** accepts the acceptable-use commitment, connects AI tools, picks EU residency if needed, can raise (never lower) the threshold, exports the privacy summary, DPIA template, and draft works agreement for council review.

## 7. Risks and assumptions
- **Compliance:** works councils may class reuse counts or opt-in individual views as performance evaluation (Germany, BetrVG §87(1) no. 6). Mitigation: R1–R3e, R6a, R10, R14; validate with a council early.
- **Re-identification:** mitigated by R1b. A test that tries to subtract one view from another to expose a person is required.
- **Data source:** R0 may show admin APIs give only app-surface data. Then R4 categories stay coarse and the 70% metric is restated against what is available.
- **Credibility:** outcome-based value (R5) depends on customer outcome data that may not exist. (Critic #7 not accepted for v1; scope risk remains.)
- **Gaming:** reduced by R6a (no visible per-person counts for leaders).
- **Security:** usage metadata is still personal data under GDPR. R3a–R3d cover access, retention, and deletion; the lawful basis is still undecided.
- **Cultural:** replacement fear [03, Aisha] is addressed in part by R7, R14, and the capacity-reallocation non-goal. The customer could still breach R14, and enforcement is contractual.

## 8. Open questions
- Which metadata does each admin API actually expose? (answered by R0)
- What does a CFO accept as credible value? (from synthesis)
- Is a floor of 5 enough for councils, or should it be higher? (from synthesis; critic Q2)
- Who is the primary buyer: L&D, Product, or IT? (from synthesis)
- Does opt-in recognition in reviews count as performance evaluation? (from synthesis; gates R13)
- What is the GDPR lawful basis and the retention period for R3b? (critic Q3)
- Which two AI tools do we integrate first?
- How do we validate R5 methodology before a buyer takes it to a board?
- Who moderates the library, and what happens to people using a withdrawn workflow? (critic Q11)
