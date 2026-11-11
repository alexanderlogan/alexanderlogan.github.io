# 01 Research Synthesis: Uplift

> All interviews are fictional mock data created for this demo. Nothing here is real customer data.

## Sources

| File | Speaker | Role | Company type |
|---|---|---|---|
| 01_ld_leader_insurance.md | Rachel M. | VP Learning & Development | Global insurance carrier, ~9,000 employees |
| 02_vp_product_saas.md | Tom K. | VP Product | B2B software, ~120 PMs across 6 BUs |
| 03_senior_analyst_advisory.md | Aisha B. | Senior Analyst | Accounting & advisory firm, ~2,000 employees |
| 04_cio_eu_manufacturer.md | Lukas W. | CIO | Industrial manufacturer, Germany HQ, ~5,000 office staff EU/US |

Three buyers (L&D, Product, IT) and one end user (analyst).

## Atomic observations

| # | Observation | Source |
|---|---|---|
| O1 | Bought 4,000 licenses; renewal in March; finance asks what they got. Can only report logins. | [01, Rachel] |
| O2 | Wants to know which workflows people use AI for, to target training. | [01, Rachel] |
| O3 | Generic prompt workshop for everyone; attendance falling. | [01, Rachel] |
| O4 | Time saved measured by self-reported survey that nobody believes; needs something CFO-credible. | [01, Rachel] |
| O5 | Best users found anecdotally ("claims team in Ohio... found out by accident"); wants to find champions systematically. | [01, Rachel] |
| O6 | Employee council will push back on monitoring individuals; surveillance perception lowers adoption. | [01, Rachel] |
| O7 | ~15 of ~120 PMs have real workflows; the rest mostly rewrite emails. | [02, Tom] |
| O8 | Good users figured it out alone; shared knowledge (40-page prompt doc) goes unread. | [02, Tom] |
| O9 | Wants a library of proven, packaged workflows with credit to the builder. | [02, Tom] |
| O10 | Success = cycle time discovery-to-approved-spec and spec bounce-back rate, not logins. | [02, Tom] |
| O11 | Leaderboards ranking individuals by usage will be gamed with junk prompts. | [02, Tom] |
| O12 | Uses AI quietly and does not advertise it. | [03, Aisha] |
| O13 | Visible productivity gain leads to more work, not credit. | [03, Aisha] |
| O14 | Fear of "training the thing that replaces us"; shared by half her team. | [03, Aisha] |
| O15 | Individual measurement makes her nervous; team-level anonymized is fine. | [03, Aisha] |
| O16 | Would use useful feedback back ("people in your role save time with this workflow"). | [03, Aisha] |
| O17 | Would share workflows if it counted in her performance review. | [03, Aisha] |
| O18 | Dealbreaker: reading prompts or documents (client confidential). | [03, Aisha] |
| O19 | Runs three AI tools; usage sits in three admin consoles with different definitions. | [04, Lukas] |
| O20 | Board wants one number: is it paying off? | [04, Lukas] |
| O21 | Wants adoption and value by function and workflow, normalized across tools, plus license utilization. | [04, Lukas] |
| O22 | Works council must approve anything that could evaluate performance; individual-level is a non-starter without agreement. | [04, Lukas] |
| O23 | Data must stay in the EU; aggregation thresholds so no one is identifiable in a five-person team. | [04, Lukas] |
| O24 | Privacy-by-design gets approval in months; otherwise never. Cross-tool + quick works-council sign-off wins Europe. | [04, Lukas] |

## Themes

### T1. Privacy and trust decide whether any of this works
- **JTBD:** When my organization starts measuring AI use, I want it to be aggregated and to never touch my content, so I can keep using AI without fearing surveillance or replacement.
- **Evidence:**
  - "If this turns into 'the AI is watching you,' adoption goes down, not up." [01, Rachel]
  - "If it's at team level, anonymized, fine." [03, Aisha]
  - "Reading my prompts or documents. That's client confidential. Absolutely not." [03, Aisha]
  - "If it's designed for privacy from day one, a few months. If not, never." [04, Lukas]
- **Frequency:** 4 of 4 (Tom's leaderboard warning, O11, is the same concern from a gaming angle).
- **Severity:** High. Two buyers name a formal veto body (employee council, works council); without its approval there is no deployment.

### T2. Leaders cannot prove ROI with credible numbers
- **JTBD:** When renewal or a board review comes up, I want a credible measure of value from our AI licenses, so I can defend the spend.
- **Evidence:**
  - "I can tell them how many people logged in. That's it." [01, Rachel]
  - "People either ignore it or say 'it saves me five hours a week,' which nobody believes." [01, Rachel]
  - "If those move, I don't care about logins." [02, Tom]
  - "The board wants one number: is it paying off? I can't give it." [04, Lukas]
- **Frequency:** 3 of 4.
- **Severity:** High. It is tied to a dated budget decision (March renewal [01, Rachel]) and board scrutiny [04, Lukas].

### T3. No visibility into which workflows AI actually sticks in
- **JTBD:** When planning enablement, I want to see adoption by function and workflow, so I can put training and investment where it will stick.
- **Evidence:**
  - "Which workflows people actually use it for. Underwriting summaries? Claims letters? Email?" [01, Rachel]
  - "Maybe fifteen of them have built real workflows... The other hundred mostly use it to rewrite emails." [02, Tom]
  - "Adoption and value by function and by workflow, across all tools, normalized." [04, Lukas]
- **Frequency:** 3 of 4.
- **Severity:** Medium-High. Without it, enablement stays generic and declines (O3). Inference: T3 is the data foundation for T2.

### T4. Know-how stays with a few power users and does not spread
- **JTBD:** When someone figures out a high-value AI workflow, I want it found, packaged, and reused by peers, so the whole team gets the gain.
- **Evidence:**
  - "There's a claims team in Ohio that apparently built their own prompt library. I found out by accident." [01, Rachel]
  - "The good ones figured it out alone and nobody else knows how." [02, Tom]
  - "Like 'people in your role save time with this workflow, here's how,' I'd actually use that." [03, Aisha]
- **Frequency:** 3 of 4.
- **Severity:** Medium-High. Tom reports a ~15-of-120 gap [02, Tom]; the value is concentrated and not compounding.

### T5. Contributors need credit, not more work
- **JTBD:** When I share a workflow that saves time, I want it recognized as a contribution, so sharing pays off for me rather than costing me.
- **Evidence:**
  - "A library of proven workflows, with the person who built it getting credit." [02, Tom]
  - "If my manager sees I finish in two hours what used to take eight, I get six more hours of work, not credit." [03, Aisha]
  - "If sharing a good workflow showed up in my review as a contribution, I'd share everything." [03, Aisha]
- **Frequency:** 2 of 4 (Rachel's "turn them into champions" [01, Rachel] is related).
- **Severity:** Medium. Without this incentive, T4 fails: Aisha says "right now there's no upside."
- **Tension with T1:** credit means identifying the contributor. Inference: credit has to be opt-in and initiated by the contributor, not inferred from monitoring.

## Weak signals (single interview)
- **Cross-tool normalization:** three tools, three consoles, different definitions [04, Lukas].
- **License utilization:** "stop paying for seats nobody uses" [04, Lukas].
- **EU data residency** [04, Lukas].
- **Gaming risk of usage metrics:** leaderboards invite junk prompts [02, Tom]. Inference: activity counts are both gameable and weak as proof of value.
- **Replacement fear** is a cultural barrier separate from privacy [03, Aisha].

## Opportunities
1. **HMW** measure AI adoption and value in a way employees, councils, and works councils trust from day one? (T1)
2. **HMW** give leaders a value number credible enough for a CFO or board, without relying on self-reported surveys or logins? (T2, T3)
3. **HMW** show adoption by function and workflow so enablement can be targeted? (T3)
4. **HMW** let power users package and share proven workflows, with credit they control? (T4, T5)

## Open questions
- What data source can show workflow-level usage without reading prompts or content (Aisha's dealbreaker)? Do vendor admin APIs expose enough metadata?
- What counts as "credible" time saved for a CFO? Outcome metrics like Tom's cycle time, sampling, or benchmarks?
- What minimum aggregation threshold do works councils accept? Lukas mentions a five-person team; is that a floor or an example?
- Who buys and owns the product: L&D, Product/Ops, or IT? All three appeared.
- Does recognition in reviews (Aisha) itself count as "evaluating performance" under works-council rules (Lukas)?
- Only four interviews, all fictional, and one end user. End-user perspectives are under-sampled.
