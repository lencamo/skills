---
name: amo-research
description: Use when the user asks to research how competitor products, communities, or open-source projects implement a feature, find mature reusable approaches, or verify implementation alternatives with external evidence to support solution decisions. Do not use for general market analysis or solution design without external implementation research.
metadata:
  version: '0.2.0'
---

# Amo Research

Research how others implement a relevant capability, why their approach fits their situation, and what the current project can reuse.

## Shared Output Marker

Prefix the first output line inline with `🔬 [amo-research]`. Do not put the marker in a separate paragraph.

## Use When

- The user wants to learn how competitor products, communities, or open-source projects implement a relevant feature.
- An implementation choice needs external evidence, or the user wants to check for mature alternatives before building it.
- External implementation research would support decisions in `amo-feature`, `amo-improve`, `amo-fix`, `amo-refactor`, or `amo-best`.

## Do Not Use

- The user only needs solution design, diagnosis, or proposal review without external implementation research.
- The task is general industry, market, or marketing-oriented competitor analysis.
- The user wants code implementation or review of implemented code.

## Workflow

1. Clarify the implementation question, project context, existing decision criteria, and any candidate proposal.
2. Find comparable implementations in competitor products, open-source projects, official docs, or community discussions as needed.
3. Inspect relevant source code, docs, issues, or maintainer discussions to explain implementation mechanisms, conditions, and tradeoffs.
4. Assess adoption, reuse of part of an implementation, design borrowing, or rejection based on project fit and adaptation cost.
5. Recommend a reuse approach with its effect on the current decision, remaining validation, and evidence gaps.

## Key Rules

- Inspect actual sources; memory and search snippets are not verified research.
- Prefer primary evidence and link it near the claim; identify source revisions when available.
- Separate facts, inferences, and advice; visible behavior does not prove internal architecture.
- Judge maturity by relevant usage, maintenance, and limitations, not popularity; check version and license before recommending code or dependencies.
- Assess project fit and reuse cost; do not import unnecessary architecture.
- Stop when evidence is sufficient or searches yield no new information; state uncertainty without claiming an exhaustive search.
- Research only; do not change code, install dependencies, or automatically invoke other skills.

## Output

Use the user's language for output labels and content.

```text
🔬 [amo-research] Scenario: implementation research
Research conclusion:
Reference implementations and evidence:
Recommendation for the current project:
Remaining validation:
```
