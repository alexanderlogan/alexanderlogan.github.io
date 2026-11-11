# 03 PRD Review: Uplift v1, Trusted AI Adoption Insights

> Critic review of output/02_prd.md against output/01_research_synthesis.md. All source material is fictional demo data. This review proposes fixes; it does not rewrite the PRD. The human decides which fixes to accept, by issue number.

## Verdict: Ready with changes

The PRD is well structured. Every Must traces to a research theme, the non-goals are explicit, and the privacy principles from the research (team aggregation, no content, opt-in) appear as Must requirements. However, four issues block engineering: **#1, #2, #3, #4**. The first is the unverified data source under R4, which the T2 and T3 goals depend on. The other three are privacy gaps that a works council or DPO would find in the first review. If the PM accepts fixes for those four, the remaining issues can be fixed in parallel with story writing.

---

## Top issues (ranked)

### 1. [Blocking] The core data source for R4 (and so R5) is unverified, and "workflow category" is undefined
- **Perspective:** Engineering manager
- **Problem:** R4 (Must) needs usage broken down "by workflow category". R2 forbids reading content. Section 7 admits it is unverified whether vendor admin APIs expose enough metadata. In practice, vendor admin and usage reporting surfaces mostly provide per-user activity counts, active days, and the host app or feature used (e.g. "used in Word", "chat"). They do not provide task intent. "Underwriting summaries vs claims letters vs email" [01, Rachel] cannot be inferred from that without content. The 70% attribution metric in section 2 therefore cannot be tested, and the T2 value report rests on the same foundation (synthesis: "T3 is the data foundation for T2"). R2 also has a hidden ambiguity. If categories are derived by classifying content in transit (even when the content is never stored), that is still content processing. Aisha and a works council would treat it as reading prompts [03, Aisha].
- **Suggested fix:**
  1. Add a time-boxed technical spike as a gate before R4 and R5 stories: for each candidate tool, list the exact fields its admin API returns and their granularity.
  2. Define "workflow category" explicitly and choose one source: (a) host app or feature only (e.g. "drafting in Word", "spreadsheet analysis"), (b) self-tagging by employees, or (c) workflows from the R6 library that employees self-report using. State that content-based classification is out of scope, or that it needs separate council approval.
  3. Restate the 70% metric against whichever definition you choose.

### 2. [Blocking] R1 aggregation is not robust against re-identification, and "configurable" lets admins weaken it
- **Perspective:** Privacy and ER lead
- **Problem:** Several gaps:
  - A minimum group size of 5 can be defeated by differencing. Compare a department of 6 with its 5-person sub-team, compare week N with week N+1 after one person joins or leaves, or stack filters (function x location x tool x week). Section 7 names this risk, but no requirement mitigates it.
  - "Configurable" with no floor means a customer admin could set the threshold to 2.
  - Lukas cited a five-person team as an example of what must *not* be identifiable [04, Lukas]. That arguably means 5 is too low, not that it is the floor. The synthesis lists this as an open question, yet the PRD treats it as settled.
  - "Team level or higher" is undefined: is it the org chart, a manager's direct reports, or a cost centre?
- **Suggested fix:** Split R1 into testable sub-requirements:
  - (a) A vendor-enforced hard floor that customers can raise but not lower.
  - (b) Suppression applies to every filter combination and every time slice, with complementary suppression so hidden cells cannot be derived by subtraction.
  - (c) No views of membership deltas below the threshold.
  - (d) Counts are rounded or banded, not exact.
  - (e) "Team" is defined by a named source (e.g. HRIS org unit).

  Each needs a Given/When/Then test, including a differencing attack test.

### 3. [Blocking] Individual-level data still exists, and nothing governs who can reach it
- **Perspective:** Privacy and ER lead; Engineering manager
- **Problem:** R3 (private "your AI use" view) and R7 (peer suggestions) require Uplift to collect and store per-person usage records. Under German co-determination law (BetrVG §87(1) no. 6), what matters is whether a system is *technically suitable* to monitor behaviour or performance, not whether the vendor intends to. A database of per-employee usage data is in scope even if no leader dashboard shows it. Section 7 lists lawful basis, retention, and access controls as risks, but no requirement covers them. Missing:
  - who at the customer can access raw records (super-admins, IT, legal discovery)
  - who at Uplift can access them
  - a retention period
  - pseudonymisation
  - audit logging
  - deletion when an employee leaves
- **Suggested fix:** Add Must requirements:
  - (a) Per-person records are pseudonymised and cannot be queried through any customer-facing UI, API, or export, including by admins.
  - (b) A fixed retention period for individual-level records (e.g. aggregate and then delete raw events after N days), stated in the transparency page.
  - (c) Access to raw data by Uplift staff is logged and needs a break-glass process.
  - (d) Individual data is deleted when an employee leaves, and the deletion is verified.
  - (e) A DPIA template and a draft works agreement (Betriebsvereinbarung) ship with the product.

  Also define a metadata allowlist (see #9).

### 4. [Blocking] R9 and R10 are rated Should, but the Trust goal and the EU go-to-market depend on them
- **Perspective:** Privacy and ER lead; Executive buyer
- **Problem:** T1 is the highest-severity theme (4 of 4, with a formal veto body). Lukas: "If it's designed for privacy from day one, a few months. If not, never." [04, Lukas]. The Trust metric (council approval in 90 days or less) cannot be met without the council summary (R10). Employee opt-in is unlikely without the transparency page (R9). R12 (EU residency) is a Could, but Lukas states "Data must stay in the EU" as a requirement, not a preference [04, Lukas]. As written, the PRD's own success metric depends on requirements it has rated optional.
- **Suggested fix:** Promote R9 and R10 to Must. For R12, choose explicitly: either make EU residency Must, or state in the non-goals that v1 pilots exclude EU and German customers. If you exclude them, drop or rewrite the Trust metric. Do not leave this inconsistent.

### 5. Consent-based opt-in (R3, R6, R13) is fragile in an employment relationship
- **Perspective:** Privacy and ER lead; Employee
- **Problem:** EU data protection guidance generally treats employee consent as rarely "freely given" because of the power imbalance. If a manager asks "can you opt in so I can see your usage?", the opt-in is effectively coerced. R3 does not say *who* an individual can share insights with (their manager? HR? everyone?). R13 sends contributor data into performance reviews. The synthesis flags this as possibly counting as "performance evaluation" under works-council rules (open question; [03, Aisha] vs [04, Lukas]). The PRD lists it as a Could anyway, without depending on that answer. The revocation in R3 is also unspecified: does revoking it remove data that was already seen or exported?
- **Suggested fix:**
  - In R3, name the allowed recipients and state that no product surface lets a manager request or prompt someone to opt in.
  - Define what revocation does to past shares and exports.
  - Put R13 behind the outcome of the council validation in section 7, and make it a pure employee-initiated export (the employee downloads it), not a feed into HR systems.
  - Do not treat consent as the lawful basis. Record that the basis is to be decided by legal (likely legitimate interest plus a works agreement).

### 6. R6 attribution and reuse counts bring back individual metrics, against the PRD's own non-goal
- **Perspective:** Privacy and ER lead; Engineering manager
- **Problem:** A named workflow in the library with a visible reuse count is a per-person performance-adjacent number visible to leaders. That is exactly the gaming vector Tom warned about [02, Tom], and it is close to the "no individual scoring or leaderboards" non-goal. Anonymous publishing is also weak in small teams: a workflow titled "Ohio claims letter generator" identifies its author. R6 does not say whether leaders see reuse counts, whether contributors can be sorted or ranked, or whether a published workflow can be edited, withdrawn, or forked.
- **Suggested fix:**
  - State that reuse counts are visible only to the contributor (and to leaders only as team-level aggregates above the R1 threshold).
  - The library never sorts or ranks by contributor.
  - Warn the author about re-identification when they choose anonymous publishing.
  - Define withdrawal (does the workflow disappear for people already using it?) and moderation (who removes a workflow that leaks client data inside its "steps"?). Note that workflow steps are free text, which can contain the confidential content R2 promises never to store. This needs a content policy and a reporting flow.

### 7. R5 (value report) has hidden integration scope and an untestable acceptance bar
- **Perspective:** Engineering manager; Executive buyer
- **Problem:**
  - "Outcome measures the customer defines" implies importing data from Jira, Workday, claims systems, and so on. That is unbounded integration work hidden inside a single Must.
  - "Shows methodology and confidence" cannot be tested without a defined method.
  - Comparing adoption with outcomes at team level invites causal claims the data cannot support. A board will challenge that, which defeats T2.
  - Outcome data at team level is also subject to R1. If a team's spec bounce-back rate sits next to its AI adoption, that is a team performance evaluation, which works councils also regulate.
  - Lukas wants "one number" [04, Lukas]; R5 does not say whether it produces one.
- **Suggested fix:** Scope v1 R5 to:
  - (a) manual CSV upload of team-level outcome series
  - (b) one named method (e.g. before/after with a comparison group of lower-adoption teams), with a fixed confidence statement template
  - (c) the R1 threshold applied to outcome data as well
  - (d) standard wording that labels results as correlational

  Make "validate methodology with 1-2 pilot finance teams" an explicit exit criterion (it is open question 7 in the PRD).

### 8. Success metrics are not measurable as written, and nothing measures employee trust
- **Perspective:** Engineering manager; Employee
- **Problem:**
  - Every baseline is "TBD", including two that are zero by definition.
  - The number of pilots and the pilot duration are not stated, so "≥ 60% of pilot buyers" could mean 2 of 3.
  - The Trust metric (council approval in 90 days or less) probably falls outside a pilot window and depends on the customer's process.
  - "0 privacy-related rejections" with n=2 says little.
  - No metric captures the employee side, even though employee opt-in is what makes R3, R6, and R7 work.
  - There are no guardrail metrics. The research says surveillance perception *lowers* adoption [01, Rachel], so a falling active-user rate after rollout is a key failure signal.
- **Suggested fix:**
  - State the pilot count and window.
  - Replace "TBD" with "measured in week 1 of pilot".
  - Add employee metrics: library publish rate, R7 suggestion usefulness rating, a pulse survey item ("I trust how Uplift uses my data"), and an opt-out or complaint rate as a guardrail.
  - Add the guardrail "AI active-user rate does not fall after Uplift rollout".
  - Measure the Trust goal as "council submission pack accepted without privacy-related change requests" if approval time falls outside the pilot.

### 9. "Usage metadata" is unbounded, and some metadata is surveillance on its own
- **Perspective:** Privacy and ER lead; Employee
- **Problem:** R2 permits "usage metadata" without listing it. Per-person timestamps reveal working hours, breaks, and after-hours activity. Prompt length, session counts, and tool switching make activity profiles. That is the "AI is watching you" outcome [01, Rachel] without any content being read.
- **Suggested fix:** Replace "usage metadata" in R2 with an explicit allowlist (e.g. tool, app surface, date at day granularity, category). Name what is excluded (e.g. time of day, session duration per person, prompt length, IP and device). Publish the allowlist on the R9 transparency page. Any new field needs a privacy review.

### 10. Replacement fear and the "more work, not credit" pain are not addressed for the employee
- **Perspective:** Employee; Privacy and ER lead
- **Problem:** Aisha's core fears are "six more hours of work, not credit" [03, Aisha] and "training the thing that replaces us" [03, Aisha]. Team-level time savings data still lets a leader conclude "this team saves 20%, cut one role" or "give them more work". The non-goal "no headcount recommendations" only stops the *product* from recommending; it does not stop a customer from using the data that way. The only direct value employees get is R7, which is a Should. So the trade looks like this: employees give data, leaders get value. That is a weak basis for opt-in. The PRD admits the gap under Risks ("not solved by privacy design alone") but proposes nothing.
- **Suggested fix:**
  - Promote R7 to Must, or make the private "your AI use" view clearly useful.
  - Add a customer acceptable-use commitment (contract or in-product attestation) that Uplift data will not be used for headcount, individual performance, or disciplinary decisions, and show it on the transparency page.
  - State as an explicit non-goal that Uplift does not present time saved as capacity available for reallocation at team level, or decide deliberately that it does.

### 11. Missing edge cases that will surface in stories
- **Perspective:** Engineering manager
- **Problem:** Not covered:
  - employees who move teams (does their history move with them and change past aggregates?)
  - reorgs that push a team below the threshold
  - people in more than one team
  - managers who are a team of one
  - contractors and guests on licenses
  - leavers (deletion, see #3)
  - users of tools that are not connected
  - license holders with zero usage (R11 shows them at team level, but a team of 5 with 1 unused seat identifies a person by elimination)
  - historical data from before the employee saw the transparency page
  - a customer connecting only one tool when R8 assumes two
- **Suggested fix:** Add an "Edge cases" section listing each with the intended behaviour, or make each one an acceptance criterion on the relevant requirement. R11 in particular needs R1 suppression applied explicitly.

### 12. Key terms are undefined: "adoption", "active", "normalized"
- **Perspective:** Engineering manager
- **Problem:** R4 and R8 use "adoption" and "normalized" without definitions. Lukas's pain is exactly that three consoles use three different definitions [04, Lukas]. If Uplift does not set one definition, it reproduces the problem.
- **Suggested fix:** Add a glossary: "active user = at least one qualifying event in a rolling 28-day window", "adoption rate = active users / licensed seats", and the event mapping per tool. Include it in R8's acceptance criteria.

### 13. The evidence base for the employee-facing Musts is thin
- **Perspective:** Employee; Engineering manager
- **Problem:** R3 and R6 are Must, and their employee behaviour assumptions (people will publish, people will opt in) rest on one end-user interview [03, Aisha]. The synthesis notes this under-sampling; the PRD does not carry it into Risks.
- **Suggested fix:** Add it to section 7 as an assumption. Add a validation step (e.g. 5 to 8 employee interviews or a concept test with council representatives) before building R6 and R13.

---

## Checklist results

| Check | Result | Notes |
|---|---|---|
| Every Must traces to a research theme | Pass | R1 to R6 cite T1 to T5 correctly. R3 and R6 rest on a single end-user source (#13). |
| Success metrics are measurable | Fail | Baselines TBD, pilot n undefined, no employee or guardrail metric, 70% attribution depends on an undefined category (#1, #8). |
| Non-goals are explicit | Pass, with gaps | Missing: no time-of-day or activity profiling, no team-level capacity reallocation, no use of data to train models, no manager-initiated opt-in requests, no disciplinary use (#5, #9, #10). |
| Privacy by design: team-level aggregation | Partial | Principle present, implementation open to differencing and admin override (#2). |
| Privacy by design: opt-in for individual insights | Partial | Present, but recipients, revocation, and consent validity are undefined (#5). |
| Privacy by design: no keystroke or content monitoring | Partial | R2 is strong on storage, silent on in-transit classification (#1) and on free-text workflow steps (#6). Metadata is unbounded (#9). |

## Requirement-by-requirement privacy test

| ID | Passes privacy test? | Note |
|---|---|---|
| R1 | Partial | See #2. |
| R2 | Partial | See #1, #9. |
| R3 | Partial | See #3, #5. |
| R4 | Yes, if R1 is fixed | Data source risk is #1. |
| R5 | Partial | Team-level outcome data is a team performance evaluation; apply R1 (#7). |
| R6 | Partial | Reuse counts and free-text steps (#6). |
| R7 | Yes, if computed on pseudonymised data | Make sure suggestions cannot reveal a specific peer ("the one other analyst in your role uses X"). Apply the threshold to "people like you". |
| R8 | Yes | |
| R9 | Yes | Should be Must (#4). |
| R10 | Yes | Should be Must (#4). |
| R11 | Partial | Unused seats in small teams identify individuals (#11). |
| R12 | Yes | Priority conflicts with Lukas's requirement (#4). |
| R13 | At risk | Possible performance evaluation under BetrVG; depends on the open question (#5). |

---

## Questions the PM must answer before engineering starts

1. **Data source:** For the first two tools, which exact fields does each admin API return, and which "workflow category" definition will v1 use (app surface, self-tag, library-based, or content classification)? (#1)
2. **Threshold:** What minimum group size will the vendor enforce as a non-overridable floor, and has a works council or DPO confirmed it? Is Lukas's "five-person team" a floor or an example of a team that needs protecting? (#2)
3. **Lawful basis:** What is the GDPR lawful basis for per-person usage records (consent, legitimate interest, works agreement), and what is the retention period? (#3, #5)
4. **Access:** Can anyone at the customer, including super-admins and legal, ever see individual-level records? Can anyone at Uplift? (#3)
5. **EU scope:** Are EU or German customers in the v1 pilots? If yes, EU residency and the council pack are Must. If no, what does the Trust metric measure? (#4)
6. **Opt-in recipients:** When an employee opts in under R3, who exactly can see the data, and what happens to it on revocation? (#5)
7. **Performance review link:** Before R13 or any review-related feature ships, does recognition in reviews count as performance evaluation? Who will get that answer, and by when? (#5)
8. **Value method:** Which single method will R5 use to link adoption to outcomes, and which pilot finance stakeholder will validate it? Does v1 produce Lukas's "one number"? (#7)
9. **Pilots:** How many pilots, for how long, and which buyer persona leads them (L&D, Product, or IT)? The answer changes which Must matters most. (#8)
10. **Employee value:** What does an employee get in v1 that makes opting in and publishing worth it, and what commitment will customers make about not using the data for headcount or performance decisions? (#10)
11. **Library moderation:** Who moderates published workflows that contain confidential client text, and how does a contributor withdraw one? (#6)
