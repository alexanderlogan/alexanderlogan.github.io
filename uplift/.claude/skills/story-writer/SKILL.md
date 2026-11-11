---
name: story-writer
description: Break an approved PRD into user stories with Given/When/Then acceptance criteria. Use when asked to create user stories, tickets, or acceptance criteria from a PRD.
---

# Story Writer

## Precondition
The human must have approved the PRD in this session. If not, stop and ask.

## Input
output/02_prd.md and output/03_prd_review.md (apply accepted changes).

## Steps
1. Group requirements into 2 to 4 epics.
2. For each Must and Should requirement write stories:
   "As a <persona>, I want <capability>, so that <outcome>."
3. For each story write 2 to 4 acceptance criteria in Given / When / Then form, including at least one negative or edge case.
4. Add a size estimate (S / M / L) and dependencies.
5. Tag each story with the requirement number it implements.

## Rules
- Stories follow INVEST: independent, negotiable, valuable, estimable, small, testable.
- No story without acceptance criteria.

## Output
Write output/04_user_stories.md.
