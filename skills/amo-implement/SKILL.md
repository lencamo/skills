---
name: amo-implement
description: Use when the user asks to implement an already defined proposal and verify the result, keeping changes focused, comments useful, and frontend content free of conversation or implementation notes. Do not use for solution design, proposal explanation, or standalone code review.
metadata:
  version: '0.2.0'
---

# Amo Implement

Implement a defined proposal while preventing comment noise, frontend content pollution, and scope creep.

## Shared Output Marker

Prefix the first output line inline with `🔨 [amo-implement]`. Do not put the marker in a separate paragraph.

## Use When

- A proposal and its implementation scope are already defined.
- The user asks to implement the proposal and verify the result.

## Do Not Use

- The user wants solution design or proposal review.
- The user wants proposal details; use `amo-detail`.
- The user wants review of implemented code; use `amo-review`.

## Workflow

1. Identify the existing proposal and implementation scope.
2. Inspect relevant code and project conventions.
3. Make the changes needed to complete the proposal.
4. Run relevant verification and check the diff for comment noise, frontend content pollution, and scope creep.
5. Report actual changes, verification results, and unfinished work.

## Key Rules

### Comments

- Comment only on non-obvious reasons, constraints, or behavior; avoid code repetition, step-by-step narration, decorative separators, vague TODOs, or long implementation explanations.
- Preserve useful business, API-contract, and license comments; limit comment cleanup to code touched by this task.

### Frontend Content

- Show only the requested business content. Do not turn conversation, proposal explanations, development history, technical limitations, or precautionary advice into unsolicited UI elements; keep explanations in the chat.
- Preserve existing UI states and initial values unless the proposal requires changing them.

### Implementation Scope

- Make only changes required by the proposal or necessary to complete it; do not add unrelated features, cleanup, or refactors.
- Reuse existing patterns; do not add abstractions, dependencies, configuration, or defensive branches for hypothetical needs.
- Keep debugging within scope; report unrelated issues separately and obtain approval before expanding the agreed scope.

## Output

Use the user's language for output labels and content.

```text
🔨 [amo-implement] Scenario: proposal implementation
Implementation result:
Main changes:
Verification results:
Unfinished work:
```
