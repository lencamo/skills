# Daily Report Quality Rules

Use these rules to turn task lists into reports that are specific, traceable, and useful for follow-up.

## Feedback Calibration

When the user supplies historical reports, scores, or reviewer feedback:

1. Extract required fields, recurring deductions, preferred specificity, and expected detail.
2. Prioritize repeated feedback and explicit form requirements over one-off stylistic suggestions.
3. Use feedback to shape the report, but never treat a previous report or score as evidence for today's completion, validation, scope, or blocker.
4. Keep the calibration internal unless the user asks to see the analysis.

## Field Requirements

### Today's Work Summary

State what was completed and the observable result. When supported, include the actual scope, such as the affected module, scenario, data type, or user group. Add workload, progress, validation, or value only when supplied or evidenced.

Prefer this structure while omitting unsupported components:

```text
action + object + supported scope + supported result + validation or value
```

Prefer:

```text
Completed the category-based message search for conversation archives, enabling users to narrow historical messages by message category.
```

Avoid:

```text
Worked on message search.
```

Do not invent counts, percentages, effort, affected users, test results, or impact scope to make an item look substantial.

### What Was Not Done Well

Record a real gap, incomplete edge case, missing validation, or process improvement. Prefer `concrete scenario + gap + impact + follow-up` when those parts are known. Replace vague phrases such as "edge cases still need improvement" with named scenarios only when they are supplied or supported. Do not fabricate criticism to fill the field, and do not automatically classify tomorrow's planned work as today's failure.

When the field is required but no gap was supplied, use a restrained statement such as:

```text
Based on the available information, no clear execution gap was identified today.
```

Adapt the wording to the evidence. Do not invent a validation result or follow-up action.

### What Could Not Be Resolved

Describe an explicit blocker, dependency, unanswered question, or decision needed. Include impact and required assistance when known.

When no blocker was supplied and the field is required, state:

```text
There is currently no unresolved issue blocking progress.
```

Do not promote ordinary follow-up work into a blocker.

### Tomorrow's Plan

Make each item actionable and reviewable:

```text
action + scope + intended completion or verification condition
```

Example:

```text
Implement date-range filtering for each message category and verify that date, category, and keyword conditions work correctly in combination.
```

This is a planned verification criterion, not a claim that verification is complete.

When a plan uses a broad verb such as "optimize", "improve", "investigate", or "handle", split it into concrete substeps if the source provides enough detail. Keep distinct actions separate when combining them would hide reviewable outcomes. Include priority, owner, or expected timing only when supplied or explicitly required by the form.

### Today's Reflection

Write one concrete insight tied to the day's work. Useful sources include:

- a repeated root cause;
- a data or ownership boundary that became clearer;
- a reusable diagnostic method;
- a decision that reduces future risk;
- a process step that should change next time.

Avoid generic statements such as "communication is important" unless the report explains the specific decision or behavior that follows.

Prefer a reflection that leaves behind a reusable decision, diagnostic method, risk response, or process change. Mention collaboration or risk synchronization only when the day's facts support it.

## Safe Transformations

Transform task verbs conservatively:

| Input verb | Safe report framing |
| --- | --- |
| Fixed | State the affected behavior and the corrected observable result. |
| Implemented | State the capability that now exists, limited to the user's wording. |
| Optimized | State the optimized area; add the improvement only if supported. |
| Investigated | State the scope and confirmed finding; do not present it as fixed. |
| Coordinated | State the dependency or agreed next action only when supplied. |
| Tested | State the tested scope and result only when supplied. |

Safe value framing is qualitative and directly connected to the capability:

- clearer identity display -> improves recognition;
- complete message rendering -> reduces missing conversation context;
- search or filtering -> improves retrieval efficiency;
- relationship mapping -> improves data consistency and reduces mismatches.

Do not add quantified gains without data.

## Project Context Boundaries

An optional `.codex/daily-report-context.md` may provide stable project facts such as:

- project purpose and audience;
- module boundaries;
- approved terminology;
- relationships between data sources;
- common validation concerns;
- project-specific value language;
- prohibited or sensitive wording.

It must not be required, and it must not contain daily task lists, secrets, volatile implementation details, or unsupported claims. Use it to interpret a task, never to assert that the task happened today.

## Language and Completeness

- Preserve every field required by the supplied form. When a required gap or blocker has no source content, use the restrained fallback defined above instead of omitting the field.
- Match the user's language and keep terminology consistent across sections.
- Correct obvious spelling, wording, punctuation, and mixed-language errors without changing the intended facts.
- Keep completion statements in completed form and plans in future or intended form.
- Remove duplicated points and vague management wording that adds no traceable information.

## Final Checklist

Before returning the report, confirm:

- Supplied scoring feedback and form requirements were applied without importing old facts.
- Every required field is present.
- Every completed item has a specific object, supported result, and supported scope when available.
- Progress and validation statements have a source.
- Workload, scope, priority, timing, ownership, and impact were not inferred from task titles.
- Gaps are real, sufficiently specific when evidence allows, and not invented from tomorrow's plan.
- Blockers are distinguished from ordinary follow-up work.
- Broad tomorrow tasks were split when the source supported concrete substeps.
- Tomorrow's items have an action and reviewable condition.
- Reflection contains a concrete lesson, decision, method, risk response, or process change.
- Project terminology is accurate when project context was used.
- Spelling, punctuation, language, and terminology are consistent.
- No release, test, metric, scope, ownership, or stability claim was invented.
- The result matches the user's requested fields and can be pasted directly.
