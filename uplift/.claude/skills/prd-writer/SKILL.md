---
name: prd-writer
description: Write a product requirements document grounded in research synthesis. Use when asked to draft, write, or update a PRD or product spec.
---

# PRD Writer

## Input
output/01_research_synthesis.md (required). If it is missing, stop and say so.

## Sections
1. Problem statement: who, what pain, evidence (cite themes from the synthesis)
2. Goals and success metrics: 2 to 4 measurable metrics with baselines marked "TBD" where unknown
3. Non-goals: what we are explicitly NOT doing in this release
4. Users and personas: drawn only from interviewees' roles
5. Requirements: numbered, each tagged Must / Should / Could and traced to a theme
6. User experience notes: key flows in plain language
7. Risks and assumptions: including compliance and security risks
8. Open questions: carried over from the synthesis plus new ones

## Rules
- Stay at the problem and requirement level; no implementation design.
- Every Must requirement traces to at least one research theme.
- Keep it under 2 pages of markdown.

## Output
Write output/02_prd.md, then ask the prd-critic subagent to review it.
