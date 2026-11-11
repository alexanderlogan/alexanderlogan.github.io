# 04 User Stories: Uplift v1

> Fictional product for a demo. Source: 02_prd.md, approved with edits at the human gate (critic fixes #1, #2, #3, #4, #6, #10 applied).
> Scope: every Must and Should requirement. R11 and R13 are Could and get no stories in v1.

## Epics
| Epic | Requirements | Stories |
|---|---|---|
| E1. Privacy foundation | R1a, R1b, R2, R3a, R3b, R3c, R3d, R12 | S1 to S8 |
| E2. Trust and governance | R3, R3e, R9, R10, R14 | S9 to S13 |
| E3. Leader insights | R0, R4, R5, R8 | S14 to S17 |
| E4. Workflow library and employee value | R6, R6a, R6b, R7 | S18 to S21 |

---

## E1. Privacy foundation

### S1. Enforced team aggregation floor (R1a). Size M. Depends on: none
As an **IT / CIO**, I want leader views aggregated to HRIS org units with a minimum group size the vendor enforces, so that no individual can be singled out and my works council can approve the product.
- **Given** an org unit has 4 members and the floor is 5, **when** a leader opens its adoption view, **then** the data is suppressed and labelled "group too small".
- **Given** an admin sets the threshold to 8, **when** they save, **then** groups below 8 are suppressed.
- **Given** an admin tries to set the threshold to 3 (edge), **when** they save, **then** the change is rejected with "cannot go below the vendor floor of 5".

### S2. Suppression that holds up against subtraction (R1b). Size L. Depends on: S1
As an **IT / CIO**, I want suppression applied across filter combinations and time periods, so that nobody can expose an individual by comparing views.
- **Given** a department of 6 and a sub-team of 5, **when** a leader views both, **then** complementary suppression prevents deriving the 1-person remainder.
- **Given** one person joins a team between week N and week N+1 (edge), **when** a leader compares the two weeks, **then** no view shows the change for that single person.
- **Given** a leader stacks filters (function × location × tool × week), **when** any resulting group falls below the threshold, **then** it is suppressed.
- **Given** any visible count, **when** it is displayed, **then** it is shown as a band (e.g. "10–19"), not an exact number.

### S3. No content captured (R2). Size M. Depends on: S14
As a **knowledge worker**, I want Uplift never to collect my prompts, documents, or outputs, so that client-confidential work stays private.
- **Given** a tool connector receives an event, **when** it is processed, **then** only allowlisted metadata fields are kept and any content field is dropped before storage.
- **Given** a vendor API payload contains prompt text (edge), **when** it is ingested, **then** the text is discarded, never written to storage or logs, and an alert is raised.

### S4. Pseudonymised per-person records (R3a). Size M. Depends on: none
As a **knowledge worker**, I want my individual records pseudonymised and unreachable by admins, so that my employer cannot look up my usage.
- **Given** a customer super-admin, **when** they query any UI, API, or export, **then** no record identifies a person.
- **Given** a legal hold request from the customer (edge), **when** it is received, **then** it goes through the documented process in the works agreement, not a product export.

### S5. Retention and deletion of raw events (R3b). Size S. Depends on: S4
As a **DPO**, I want raw per-person events aggregated and then deleted after a fixed period, so that we hold no more data than necessary.
- **Given** the retention period is N days, **when** an event is older than N days, **then** it has been rolled into aggregates and the raw event is deleted.
- **Given** the aggregation job fails (edge), **when** the retention deadline passes, **then** raw events are still deleted and the failure is reported.

### S6. Break-glass access for Uplift staff (R3c). Size S. Depends on: S4
As a **DPO**, I want every Uplift staff access to raw data logged and approved, so that the vendor cannot quietly access employee data.
- **Given** an engineer needs raw data, **when** they request it, **then** access requires a second approver and is time-limited.
- **Given** access without approval is attempted (edge), **when** it runs, **then** it is denied and logged.
- **Given** a customer DPO, **when** they open the access log, **then** they see every access to their tenant's data.

### S7. Deletion when an employee leaves (R3d). Size S. Depends on: S4
As a **knowledge worker**, I want my individual data deleted when I leave, so that nothing about me lingers.
- **Given** HRIS marks an employee as departed, **when** the sync runs, **then** their individual records are deleted within the stated window and the deletion is verified.
- **Given** the departed employee published library workflows (edge), **when** deletion runs, **then** their attribution becomes anonymous and the workflows stay unless withdrawn earlier.

### S8. EU data residency (R12). Size L. Depends on: none
As an **IT / CIO** at an EU company, I want all data stored and processed in the EU, so that we meet our data-location requirement.
- **Given** a tenant chooses EU residency, **when** any data is stored or processed, **then** it stays in EU regions.
- **Given** an EU tenant (edge), **when** a support engineer outside the EU tries to access its data, **then** access is blocked unless break-glass rules (S6) allow it.

---

## E2. Trust and governance

### S9. Private "your AI use" view with revocable opt-in (R3). Size M. Depends on: S4
As a **knowledge worker**, I want to see my own AI use privately and choose whether to share it, so that I benefit without being monitored.
- **Given** I am signed in, **when** I open "your AI use", **then** I see my own data and nobody else can see it.
- **Given** I opt in to share, **when** I confirm, **then** only the recipients named on the opt-in screen can see my data.
- **Given** I revoke my opt-in (edge), **when** I confirm, **then** recipients lose access immediately.

### S10. Council-ready document pack (R3e). Size M. Depends on: none
As an **IT / CIO**, I want a DPIA template and a draft works agreement included, so that I can start council approval on day one.
- **Given** an admin, **when** they open Governance, **then** they can download the DPIA template and the draft works agreement.
- **Given** the product's data fields change (edge), **when** a release ships, **then** the templates are updated and versioned to match.

### S11. Transparency page (R9). Size S. Depends on: S5, S13
As a **knowledge worker**, I want one page showing what is collected, who sees it, how long it is kept, and what my employer has committed to, so that I can trust the product.
- **Given** any employee, **when** they open the transparency page, **then** it lists the metadata fields, who can see what, the retention period, and the acceptable-use commitment.
- **Given** the configuration changes (e.g. the threshold is raised) (edge), **when** it is saved, **then** the page updates and shows the date of the change.

### S12. Privacy summary export (R10). Size S. Depends on: S1, S5
As a **DPO**, I want to export a privacy and data-processing summary of our setup, so that the council can review it quickly.
- **Given** an admin, **when** they click export, **then** they get a document showing the threshold, retention period, residency, connected tools, and data fields.
- **Given** no tool is connected yet (edge), **when** they export, **then** the summary still generates and notes "no data sources connected".

### S13. Acceptable-use commitment (R14). Size S. Depends on: none
As a **knowledge worker**, I want my employer to commit that Uplift data won't be used for headcount, performance, or disciplinary decisions, so that adopting AI doesn't put my job at risk.
- **Given** a new tenant, **when** an admin tries to go live, **then** go-live is blocked until a named customer signatory accepts the commitment.
- **Given** the commitment is accepted, **when** an employee opens the transparency page, **then** it shows the commitment, who accepted it, and when.

---

## E3. Leader insights

### S14. Technical check of admin API data (R0). Size S (time-boxed). Depends on: none
As a **product team**, I want a documented list of the fields each candidate tool's admin API returns, so that we only build workflow views the data can support.
- **Given** two candidate tools, **when** the check finishes, **then** a field list with granularity exists for each one, and the R4 definition is confirmed feasible or revised.
- **Given** a tool exposes no app-surface or feature data (edge), **when** the check finishes, **then** that tool is flagged and R4 for it falls back to library self-reporting only.

### S15. Adoption by function and workflow category (R4). Size L. Depends on: S14, S1, S2
As an **enablement leader**, I want adoption by function and workflow category over time, so that I can target training where AI sticks.
- **Given** connected tools and HRIS data, **when** I open the dashboard, **then** I see adoption by function and category, per week, at team level.
- **Given** employees self-report using a library workflow, **when** I view categories, **then** library workflows appear as categories.
- **Given** a category's team group is under the threshold (edge), **when** I view it, **then** it is suppressed.

### S16. Value report with outcomes (R5). Size L. Depends on: S15
As an **enablement leader**, I want a report linking adoption to outcomes we define, with the method stated, so that I can defend the renewal to the CFO.
- **Given** team-level outcome data provided by the customer (e.g. spec cycle time), **when** I generate the report, **then** it shows adoption next to the outcome, with a methodology section and a confidence statement.
- **Given** outcome data for a team below the threshold (edge), **when** the report is generated, **then** that team is suppressed.
- **Given** no outcome data (edge), **when** I generate the report, **then** it shows adoption only and states that no value claim is made.

### S17. Cross-tool normalized view (R8, Should). Size M. Depends on: S15
As an **IT / CIO**, I want usage from at least two AI tools on one normalized view, so that I can stop reconciling three admin consoles.
- **Given** two tools are connected, **when** I open the cross-tool view, **then** I see adoption by function using the shared definitions, with the definition of "active user" shown.
- **Given** one tool's sync fails (edge), **when** I view the page, **then** that tool is marked stale with its last sync time and is not counted as zero.

---

## E4. Workflow library and employee value

### S18. Publish a workflow with controlled attribution (R6). Size M. Depends on: none
As a **knowledge worker**, I want to publish a workflow to the library under my name or anonymously, so that I get credit when I choose to.
- **Given** I complete a description, steps, and tool, **when** I publish with my name, **then** the workflow appears in the library attributed to me.
- **Given** I choose to publish anonymously, **when** I publish, **then** no identity is shown to anyone.
- **Given** required fields are missing (edge), **when** I try to publish, **then** publishing is blocked with field-level errors.

### S19. Private reuse counts, no ranking (R6a). Size S. Depends on: S18, S1
As a **knowledge worker**, I want my workflow's reuse count visible only to me, so that sharing doesn't turn into a leaderboard.
- **Given** my workflow is reused, **when** I view it, **then** I see the reuse count.
- **Given** a leader views the library, **when** they browse, **then** they see no per-workflow reuse counts and no sort or filter by contributor.
- **Given** a leader views team reuse (edge), **when** the team is under the threshold, **then** it is suppressed.

### S20. Anonymity warning, withdrawal, and moderation (R6b). Size M. Depends on: S18
As a **knowledge worker**, I want to be warned if my anonymous workflow could identify me, to withdraw it, and to report leaked content, so that the library stays safe.
- **Given** I pick anonymous, **when** I review before publishing, **then** I see a warning that the title and details might identify me.
- **Given** I withdraw my workflow, **when** I confirm, **then** it is removed from the library and search.
- **Given** a user reports a workflow for confidential content (edge), **when** a moderator confirms, **then** it is removed and the author is notified privately.

### S21. Private peer workflow suggestions (R7). Size M. Depends on: S18, S9
As a **knowledge worker**, I want private suggestions of workflows that people in similar roles use, so that I save time without asking anyone.
- **Given** library workflows used by my role, **when** I open "what works for people like you", **then** I see suggestions only I can see.
- **Given** my role group is under the threshold (edge), **when** suggestions are computed, **then** they come from a broader group so no small group's behaviour is exposed.
- **Given** I dismiss a suggestion, **when** I return, **then** it does not reappear.

---

## Coverage check
| Req | Stories | Req | Stories |
|---|---|---|---|
| R0 | S14 | R5 | S16 |
| R1a | S1 | R6 | S18 |
| R1b | S2 | R6a | S19 |
| R2 | S3 | R6b | S20 |
| R3 | S9 | R7 | S21 |
| R3a | S4 | R8 | S17 |
| R3b | S5 | R9 | S11 |
| R3c | S6 | R10 | S12 |
| R3d | S7 | R12 | S8 |
| R3e | S10 | R14 | S13 |
| R4 | S15 | R11, R13 | Could, not in v1 |

21 stories in total: 20 Must and 1 Should.
