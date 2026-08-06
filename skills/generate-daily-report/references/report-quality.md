# Daily Report Quality Rules

Use these rules to turn task lists into reports that are specific, traceable, and useful for follow-up.

## Feedback Calibration

When the user supplies historical reports, scores, or reviewer feedback:

1. Extract required fields, recurring deductions, preferred specificity, and expected detail.
2. Prioritize repeated feedback and explicit form requirements over one-off stylistic suggestions.
3. Use feedback to shape the report, but never treat a previous report or score as evidence for today's completion, validation, scope, or blocker.
4. Infer a compact quality rubric from the evidence, usually covering field completeness, specific results, supported validation, honest gaps, reviewable plans, useful reflection, and readability.
5. Match stable presentation conventions such as heading names, numbering, density, and icons when they are visible in the examples.
6. Keep the calibration internal unless the user asks to see the analysis.

When the user asks for a likely score, provide an estimate or range rather than false precision. Explain the strongest supported reasons, likely deductions, and the smallest changes that would improve the result. Never add unsupported claims merely to optimize for the evaluator.

## Audience and Readability

Write for the likely reader of the report, not for the codebase:

- Prefer concrete workplace language over stacked implementation terms.
- Describe technical work through the affected behavior and observable result when that preserves accuracy.
- Keep a technical term when the user, historical reports, form, or audience uses it; otherwise replace it with a familiar phrase or explain it briefly in context.
- Avoid sentences that require the reader to decode several concepts at once. Split the sentence or keep only the decision that matters.
- Run a first-read check: a teammate outside the implementation should understand what changed, what remains, and what happens next without asking what the terminology means.

Examples of safe simplification:

| Technical phrasing | Clearer phrasing when detail is unnecessary |
| --- | --- |
| aggregation definition | calculation rule |
| statistical or data definition | what is counted and how it is calculated |
| non-additive metric | a metric that cannot be directly added or averaged |
| request race | an older request overwriting the latest result |
| degradation strategy | what the system shows or uses when the normal data source fails |

For Chinese reports, apply the same rule explicitly:

| Avoid when unexplained | Prefer |
| --- | --- |
| 统计口径 / 数据口径 | 统计范围和计算方式 |
| 请求竞态 / 加载竞态 | 旧请求覆盖最新结果 |
| 链路 | 流程, or name the affected front-end and back-end steps |
| 生产化 | 达到可在正式环境稳定使用的条件 |

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

Keep completed items distinct. If investigation and implementation describe the same change, combine them unless the investigation produced a separate finding or follow-up. Each bullet should add a new result rather than restating another bullet in broader language.

### What Was Not Done Well

Record a real gap, incomplete edge case, missing validation, or process improvement. Prefer `concrete scenario + gap + impact + follow-up` when those parts are known. Replace vague phrases such as "edge cases still need improvement" with named scenarios only when they are supplied or supported. Do not fabricate criticism to fill the field, and do not automatically classify tomorrow's planned work as today's failure.

An open repository task or documented limitation is not automatically something the user failed to do today. Use it only when the user's notes or a daily-work artifact identifies that exact gap as part of today's scope.

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

Do not infer a current blocker solely from repository setup notes, platform limitations, or an old progress document. Include it only when the user or today's source material says it blocked or deferred today's work.

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

Preserve the scope of the user's plan. Repository evidence may clarify one or two relevant completion conditions, but it must not turn a short plan such as "complete customer statistics" into every known roadmap, migration, caching, observability, and deployment task unless the user explicitly places that scope in tomorrow's work.

Do not copy expected features from a neighboring module. If the intended remaining behavior is not evidenced, use the known task and a conservative verification condition instead of inventing charts, filters, metrics, APIs, or edge cases.

### Today's Reflection

Write one concrete insight tied to the day's work. Useful sources include:

- a repeated root cause;
- a data or ownership boundary that became clearer;
- a reusable diagnostic method;
- a decision that reduces future risk;
- a process step that should change next time.

Avoid generic statements such as "communication is important" unless the report explains the specific decision or behavior that follows.

Prefer a reflection that leaves behind a reusable decision, diagnostic method, risk response, or process change. Mention collaboration or risk synchronization only when the day's facts support it.

Prefer one clear lesson followed by one practical next-time action. Rewrite or explain specialist terms that the likely reader may not understand; a reflection should be easier to read than the implementation summary, not more technical.

Treat standalone words such as "definition", "pipeline", "fallback", and "race"—and their Chinese equivalents such as "口径", "链路", "降级", and "竞态"—as jargon unless the user's examples use them naturally. Prefer phrases such as "calculation rule", "front-to-back process", "failure handling", or the concrete behavior that occurred.

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

Repository evidence is supporting context, not an automatic source of workload:

- Do not convert every changed file, open task, design decision, or known limitation into a report item.
- Do not upgrade a code change into completed testing, deployment, ownership, or business impact.
- Do not import the full project backlog into "What Was Not Done Well" or "Tomorrow's Plan".
- Do not turn repository environment notes into today's blocker without current evidence.
- Do not infer one module's intended UI or metrics from a neighboring module.
- Prefer the smallest repository detail that makes the user's wording accurate and understandable.

## Language and Completeness

- Preserve every field required by the supplied form. When a required gap or blocker has no source content, use the restrained fallback defined above instead of omitting the field.
- Match the user's language and keep terminology consistent across sections.
- Match stable formatting from historical reports when supplied, but do not add decorative structure that makes the report harder to paste or read.
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
- Repository limitations were not presented as today's gap or blocker without current evidence.
- Broad tomorrow tasks were split when the source supported concrete substeps.
- Tomorrow's plan was not silently expanded into the repository's full backlog.
- No charts, filters, metrics, APIs, or edge cases were inferred from an adjacent feature.
- Tomorrow's items have an action and reviewable condition.
- Reflection contains a concrete lesson, decision, method, risk response, or process change.
- Distinct bullets do not repeat the same work under different labels.
- A non-specialist teammate can understand the outcome, remaining work, and next action on first read.
- Project terminology is accurate when project context was used.
- Spelling, punctuation, language, and terminology are consistent.
- No release, test, metric, scope, ownership, or stability claim was invented.
- The result matches the user's requested fields and can be pasted directly.
