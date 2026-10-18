---
name: amo-detail
description: Use when the user asks to understand an existing proposal's overall flow, impact scope, frontend changes, backend data flow, storage, or scheduled tasks. Focus on presenting proposal details, not initial solution design, challenges to the chosen approach, direct implementation, or code review.
metadata:
  version: '0.3.0'
---

# Amo Detail

Present an existing proposal through its overall flow, impact, and frontend and backend changes.

## Shared Output Marker

Prefix the first output line inline with `🔎 [amo-detail]`. Do not put the marker in a separate paragraph.

## Use When

- A proposal exists, supplied by the user or formed through `amo-feature`, `amo-improve`, `amo-fix`, `amo-refactor`, or `amo-best`.
- The user wants to understand the overall flow and which features or modules are affected.
- The user asks what changes on the frontend or how backend data, storage, and scheduled tasks work.

## Do Not Use

- No approach exists yet; use `amo-feature`, `amo-improve`, `amo-fix`, or `amo-refactor`.
- The user wants to challenge the proposal; use `amo-best`.
- The user wants code implementation or review of implemented code.

## Workflow

1. Establish the proposal from the discussion and inspect relevant code to verify its current context.
2. Connect the flow from trigger to result and identify affected features and modules.
3. Explain frontend component reuse and changes, displayed data and its sources, state transitions, and page changes.
4. Explain backend processing and data flow, affected database tables and fields, and any scheduled tasks with their timing, work, and results.
5. Present the details using the output structure, distinguishing current behavior from planned changes.

## Key Rules

- Follow the existing approach and decision criteria; do not reopen solution selection.
- Ground current-state claims in the discussion and code; distinguish existing behavior from proposed changes.
- Cover only changes within the proposal; do not add features, states, or architecture to fill the output.
- Mark unaffected areas as not involved and unresolved details as pending confirmation.
- Explain the proposal without implementing it; include implementation order or verification only when requested.

## Output

Use the user's language for output labels and content.

```text
🔎 [amo-detail] Scenario: proposal details
Proposal:
- Flow:
- Impact scope:

Frontend:
- Component reuse and changes:
- Data display:
- State transitions:
- Page changes:

Backend:
- Data flow:
- Database changes:
- Scheduled tasks:
```
