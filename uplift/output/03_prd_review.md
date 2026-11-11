# 03 PRD Review (prd-critic subagent)

> Example run. Reviewed output/02_prd.md against output/01_research_synthesis.md.

## Verdict: Ready with changes

## Top issues
1. **R3 can quietly become individual performance measurement.** (Privacy and employee relations) Customers choose outcome metrics; nothing stops them from picking one that maps to a single person. **Fix:** apply the same minimum group size to outcome metrics, and block metrics configured on groups below the threshold.
2. **R1 workflow categories are untestable as written.** (Engineering) The PRD assumes workflows can be inferred from metadata, but the research gives no evidence that admin APIs expose this. **Fix:** add a discovery spike before committing R2 and R3; define a fallback of tool-level and feature-level categories.
3. **The opt-in target has no mechanism.** (End user) The 40% target relies on employees trusting the product, but R5 alone gives them little reason to opt in. Aisha's motivator was recognition [03]. **Fix:** move R8 champion credits from Could to Should, and tie it to R5.
4. **The works-council path is a document, not a feature.** (Privacy) R6 lists documentation, but Lukas asked for fast approval [04]. **Fix:** add a "privacy configuration summary" export that a works council can review directly.

## Questions the PM must answer before engineering starts
- What is the default minimum group size, and can customers lower it? (Recommend: no lowering below 5.)
- Which two AI tools have admin APIs good enough for R1?
- Who in the customer organization can see the value report?
