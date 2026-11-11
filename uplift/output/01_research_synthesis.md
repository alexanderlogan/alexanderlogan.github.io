# 01 Research Synthesis: Uplift

> Example run. Input: 4 fictional interviews in data/interviews/. Every claim cites [file, speaker].

## Participants
| # | Role | Organization |
|---|------|--------------|
| 01 | VP Learning & Development (Rachel M.) | Global insurance carrier, ~9,000 employees |
| 02 | VP Product (Tom K.) | B2B software, ~120 PMs |
| 03 | Senior Analyst (Aisha B.) | Accounting and advisory firm, ~2,000 employees |
| 04 | CIO (Lukas W.) | Industrial manufacturer, Germany, ~5,000 office staff |

## Theme 1: Leaders cannot prove AI is paying off
**Job-to-be-done:** When AI licenses come up for renewal, I want credible evidence of value by workflow, so I can defend or cut the spend.
**Evidence**
- "I can tell them how many people logged in. That's it." [01, Rachel M.]
- "The board wants one number: is it paying off? I can't give it." [04, Lukas W.]
- Self-reported time savings are not believed by finance. [01, Rachel M.]
**Frequency:** 2 of 4 directly; 02 implies it through outcome metrics. **Severity:** High. Renewal decisions are imminent and budget is at risk.

## Theme 2: Know-how stays with a few power users
**Job-to-be-done:** When a few people discover workflows that work, I want to package and spread them, so the rest of the organization catches up.
**Evidence**
- "Maybe fifteen of them have built real workflows... The other hundred mostly use it to rewrite emails." [02, Tom K.]
- A claims team's prompt library was found "by accident." [01, Rachel M.]
- "If sharing a good workflow showed up in my review as a contribution, I'd share everything." [03, Aisha B.]
**Frequency:** 3 of 4. **Severity:** High. This is where most of the value gap sits.

## Theme 3: Employees fear surveillance and replacement
**Job-to-be-done:** When my AI use is measured, I want it aggregated and on my terms, so it helps me rather than being used against me.
**Evidence**
- "If this turns into 'the AI is watching you,' adoption goes down, not up." [01, Rachel M.]
- "If my manager sees I finish in two hours what used to take eight, I get six more hours of work, not credit." [03, Aisha B.]
- "Reading my prompts or documents... Absolutely not." [03, Aisha B.]
**Frequency:** 3 of 4. **Severity:** High. A design failure here blocks adoption and purchase.

## Theme 4: Privacy and regulatory approval gate the purchase
**Job-to-be-done:** When I evaluate an employee analytics tool, I want privacy designed in from day one, so works councils and regulators approve it quickly.
**Evidence**
- "The works council must approve any system that could evaluate employee performance." [04, Lukas W.]
- Data must stay in the EU; aggregation thresholds for small teams. [04, Lukas W.]
- The employee council "will push back hard" on individual monitoring. [01, Rachel M.]
**Frequency:** 2 of 4. **Severity:** High for EU buyers, Medium elsewhere.

## Theme 5: Usage data is fragmented across tools
**Job-to-be-done:** When we run several AI tools, I want one normalized view, so I can compare adoption and cut unused seats.
**Evidence**
- "Usage data sits in three admin consoles with different definitions." [04, Lukas W.]
- License utilization to "stop paying for seats nobody uses." [04, Lukas W.]
**Frequency:** 1 of 4. **Severity:** Medium. Listed as a strong theme only because of buyer weight; otherwise a weak signal.

## Weak signals
- Vanity metrics get gamed: "The moment I rank PMs by AI usage, people will game it." [02, Tom K.]
- Generic training is failing: "attendance is falling." [01, Rachel M.]

## Opportunities
1. How might we show AI value by workflow credibly enough for a CFO, without measuring individuals?
2. How might we turn power users' workflows into a reusable, credited library?
3. How might we earn employee trust so they opt in to sharing?
4. How might we make works-council approval fast by design?

## Open questions
- Which data sources can we access without reading content (admin APIs, metadata only)?
- What outcome metrics beyond time saved do buyers accept (cycle time, rework)? [02, Tom K.] suggests cycle time.
- Minimum team size for aggregation? Inference: likely 5 or more, to be validated with works councils.
