---
name: research-synthesis
description: Synthesize customer interview transcripts into evidence-backed themes, jobs-to-be-done, and opportunities. Use when asked to analyze, synthesize, or summarize customer research or interviews.
---

# Research Synthesis

## Input
All files in data/interviews/.

## Steps
1. Read every transcript fully. Note each speaker's role and company type.
2. Extract atomic observations: one pain, need, workaround, or quote per observation, each tagged with [file, speaker].
3. Cluster observations into 3 to 6 themes. A theme needs evidence from at least two different interviews; otherwise list it under "Weak signals".
4. For each theme write:
   - Theme name
   - Job-to-be-done: "When ___, I want to ___, so I can ___."
   - Evidence: 2 to 4 short quotes with [file, speaker]
   - Frequency: how many of the interviews mention it
   - Severity: High / Medium / Low, with one line of reasoning
5. Turn the top themes into opportunity statements ("How might we ...").
6. List open questions the research did not answer.

## Rules
- No claim without a citation. If you infer something, label it "Inference".
- Do not invent customers, numbers, or quotes.

## Output
Write output/01_research_synthesis.md.
