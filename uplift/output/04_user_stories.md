# 04 User Stories

> Example run. Human approved the PRD with critic fixes 1, 2 and 3 accepted. Fix 4 deferred.

## Epic A: Trustworthy adoption insights

**A1. Team-level adoption dashboard** (R2, size M)
As a functional leader, I want adoption by team and tool category, so that I know where to focus coaching.
- Given a team of 5 or more people, when I open the dashboard, then I see weekly active usage by tool category.
- Given a team below the minimum group size, when I open the dashboard, then its data is merged into the parent group and labeled "aggregated for privacy."
- Given any view, when I look for an individual's name, then none is displayed.

**A2. Group-size guard on outcome metrics** (R3, critic fix 1, size S)
As an employee, I want outcome metrics protected by the same group-size rule, so that they cannot single me out.
- Given an admin configuring an outcome metric, when the target group is below the threshold, then the save is blocked with an explanation.
- Given the threshold setting, when an admin tries to set it below 5, then the system refuses.

**A3. Metadata discovery spike** (R1, critic fix 2, size M)
As the product team, we want to verify what two tools' admin APIs expose, so that workflow categories rest on real data.
- Given two candidate tools, when the spike completes, then we document available fields and a category model, or the tool-level fallback.

## Epic B: Proving value

**B1. Value report** (R3, size L, depends on A2, A3)
As an executive buyer, I want usage shown next to an outcome metric I choose, so that I can defend renewal with evidence.
- Given usage data and a configured outcome metric, when I generate the report, then I see both trends by function for the last 90 days.
- Given missing outcome data, when I generate the report, then the gap is shown explicitly, not estimated.

## Epic C: Spreading what works

**C1. Publish a workflow** (R4, size M)
As an employee, I want to publish a workflow with my name on it, so that I get credit for what I figured out.
- Given a workflow description and steps, when I publish, then it appears in the library with my attribution.
- Given a published workflow, when I view it, then I can see how many teams adopted it.

**C2. Champion credits** (R8, promoted to Should, size S)
As an employee, I want to export my contribution record, so that I can use it in my review.
- Given published workflows, when I export, then I get a summary of adoptions, visible only to me until I share it.

**C3. Opt-in personal insights** (R5, size M)
As an employee, I want private suggestions based on my own usage, so that measurement helps me.
- Given I have not opted in, when my data is processed, then it is used only in aggregates.
- Given I opt in, when I view insights, then no one else can see them.
