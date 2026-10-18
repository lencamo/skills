---
name: amo-detail
description: Use when the user asks to expand an existing proposal into concrete module or file changes, interfaces, data flow, and implementation order before coding. Do not use for initial solution design, challenges to the chosen approach, direct implementation, or code review.
metadata:
  version: '0.2.0'
---

# Amo Detail

Expand an existing proposal into concrete implementation details before coding.

## Shared Output Marker

Prefix the first output line inline with `🔎 [amo-detail]`. Do not put the marker in a separate paragraph.

## Use When

- A proposal exists, supplied by the user or formed through `amo-feature`, `amo-improve`, `amo-fix`, `amo-refactor`, or `amo-best`.
- The user asks what specifically changes, how the parts interact, or in what order to implement them.
- The proposal needs concrete module, file, interface, or data-flow details.

## Do Not Use

- No approach exists yet; use `amo-feature`, `amo-improve`, `amo-fix`, or `amo-refactor`.
- The user wants to challenge the proposal; use `amo-best`.
- The user wants code implementation or review of implemented code.

## Workflow

1. Confirm the proposal's goal, scope, and constraints.
2. Inspect relevant code to locate changes and reusable capabilities.
3. Explain module responsibilities, call relationships, and relevant interfaces, data structures, or state transitions.
4. Describe implementation order and the concrete changes in each step.
5. Define verification and identify unresolved decisions that affect implementation.

## Key Rules

- Follow the existing approach and decision criteria; do not reopen solution selection.
- Ground details in real code; distinguish existing files and APIs from proposed additions.
- Detail only the current proposal; do not add unrelated refactors or extensions.
- Use short code snippets or pseudocode when needed to explain key logic; do not implement changes.
- If a critical issue requires changing the proposal, flag it before proceeding rather than silently replacing the approach.

## Output

Use the user's language for output labels and content.

```text
🔎 [amo-detail] Scenario: implementation detail
Proposal goal:
Change scope:
Implementation details:
Implementation order:
Verification:
```
