# Daily Report Quality Rules

Use these rules to convert notes or repository activity into a natural, specific, paste-ready daily report.

## Historical Style Calibration

When historical reports, scores, or reviewer feedback are available:

1. Extract the stable form: heading names, icons, numbering style, paragraph density, and ordinary fallback wording.
2. Extract repeated quality expectations, especially specific results, clear problem boundaries, actionable plans, and useful reflection.
3. Match the proven style without copying old facts or reproducing evaluator comments.
4. Treat an “AI 改进建议” block shown by a reporting system as evaluator output, not as part of the user's report, unless the user asks to generate it.
5. Keep all calibration internal. The report must not mention scores, screenshots, historical examples, or the drafting process.

When the user asks for a likely score, give an estimate or range outside the report and explain likely deductions without adding unsupported claims.

## Repository-Backed Task Collection

When repository-backed mode applies, repository activity is a first-class task source rather than something to discuss in the final wording.

### Determine today's work

- Use the user's local date and timezone.
- For “my commits”, identify the current Git user and prefer same-day commits authored with that identity. Avoid importing other contributors' work.
- Inspect commit subjects, bodies, changed-file summaries, and only the targeted diff needed to understand the affected behavior.
- Inspect staged and unstaged changes. Inspect relevant untracked files cautiously; do not expose secrets or unrelated local files.
- Include user-supplied non-repository tasks alongside development work.

### Interpret status

- A same-day `feat`, `fix`, or equivalent completed commit normally supports “完成”, “新增”, “修复”, or “优化” for the implemented behavior.
- Investigation, documentation, experiment, revert, or explicitly partial commits must retain that narrower status.
- Staged or unstaged work counts as today's work, but normally use “推进”, “完善”, “调整中”, or another status supported by the current state.
- A test file supports “补充测试”; it does not by itself prove that tests passed. Claim passing tests, deployment, acceptance, or production effect only when directly supplied or observed.

### Consolidate into report items

- Group related commits, fixes, and files into one outcome when they serve the same user-visible or system behavior.
- Split unrelated outcomes even if they appear in one commit.
- Prefer affected behavior and observable capability over filenames, functions, endpoints, or line counts.
- Keep technical details only when needed to make the scope or result clear to the report's reader.

## Never Expose the Evidence Process

The report should sound like the author reporting their work, not an assistant auditing a repository.

Do not write source-oriented phrases such as:

- “根据今天的 Git 提交……”
- “提交记录中没有……”
- “工作区改动显示……”
- “从现有信息无法确认……”
- “提交未记录明日计划……”
- “以下计划为保守建议……”

Do not use lack of repository evidence as report content:

- Missing test evidence is not automatically “测试不完整”.
- Missing blocker evidence is not “记录中没有阻塞”.
- Missing plan evidence is not a reason to add a drafting disclaimer.
- Missing release evidence means omitting a release claim, not writing that release cannot be confirmed.

Only strict-verification mismatches may be reported, and they belong outside the report body.

## Audience and Readability

Unless the user, form, or stable historical style identifies a technical audience, write for a manager or business stakeholder who does not know the repository's internal planning system.

For a manager-facing report, describe the work result rather than the implementation method. A sentence should remain understandable without knowledge of the codebase, system architecture, or testing vocabulary. Preserve a technical term only when it is necessary to identify the affected product capability or when the user explicitly wants technical detail.

Repository and task language is evidence, not automatically suitable report copy. Translate implementation and planning labels into the affected business capability or user-visible result. By default, do not expose:

- phase or milestone labels such as “阶段 05” or “M2”;
- acceptance labels such as “Gate”, “WCD-G05”, or internal status codes;
- planning artifacts such as “spec”, “specs”, task-file names, or capability-matrix names;
- ticket IDs, commit types, branch names, file paths, function names, routes, table names, and similar repository identifiers;
- unexplained implementation shorthand such as “快照收敛”, “软删除恢复”, “租户隔离”, or “接通链路”.

Keep an internal term only when the user explicitly wants it in the report, the supplied form requires it, or the intended readers are known to use it. Do not merely replace one internal label with another; describe the work in ordinary business language.

Examples:

| Internal source wording | Audience-ready wording |
| --- | --- |
| 完成阶段 05 / 通过 WCD-G05 Gate | 完善客户管理相关功能并完成验证 |
| 继续后面的 specs 任务 | 继续推进后续功能，按计划完成开发和验证 |
| 修复快照收敛与软删除恢复 | 修复数据同步和历史数据恢复问题 |
| 强化租户隔离 | 确保不同企业的数据互不串用 |
| 接通代开发链路 | 完善代开发模式下的功能流程 |

Write for the selected reader:

- Start completed items with concrete verbs such as “完成”, “新增”, “修复”, “优化”, or “梳理”.
- Describe what changed and the resulting behavior in one readable sentence.
- Prefer familiar workplace language over stacked implementation terms.
- Avoid repeating the same task as implementation, optimization, and value in separate bullets.
- Keep the report concise enough to scan while retaining concrete scope and results.

Prefer clear wording:

| Avoid when unexplained | Prefer |
| --- | --- |
| 统计口径 / 数据口径 | 统计范围和计算方式 |
| 请求竞态 / 加载竞态 | 旧请求覆盖最新结果 |
| 链路 | 流程，或直接说明涉及的前后端步骤 |
| 降级策略 | 正常数据不可用时的处理方式 |
| 生产化 | 达到可在正式环境稳定使用的条件 |
| iframe / 嵌入容器 | 融合展示，或直接说明页面如何使用 |
| postMessage / 标签通信 / 受控渲染 | 统一页面管理，或直接说明用户可完成的操作 |
| 多标签、窄窗口回归 | 确认多页面切换及不同窗口尺寸下展示正常 |

### Audience rewrite pass

For a manager or business reader, perform a separate rewrite pass after the factual draft:

1. Replace architecture, code, protocol, and testing terms with the affected capability, corrected problem, or observable result.
2. Remove implementation mechanisms that do not change the reader's understanding of what was completed.
3. Express observed validation as a visible outcome, such as “确认多页面切换正常”, instead of a test method such as “完成多标签回归”.
4. Keep necessary product names, but honor any user request to omit or generalize a name throughout the full report.
5. Preserve completion boundaries and evidence strength while simplifying the wording; audience translation must not turn progress into completion or imply unobserved business value.

### Revision feedback

When the user corrects wording, terminology, audience level, or tone, apply that feedback to the entire next draft unless they explicitly identify a one-sentence edit. Examples include requests such as “不要提某个系统名称”, “不要写回归”, or “这是给领导看的”. Do not fix only the quoted sentence while leaving equivalent wording elsewhere. When the user asks to rewrite the whole report, regenerate every section under the accumulated constraints.

## Field Requirements

### 📌 今日工作总结

State the completed or progressed work and its concrete result. Prefer:

```text
action + object + affected scope + resulting behavior
```

Good:

```text
完成会话记录卡片与详情展示优化，支持查看消息预览和完整内容，并在返回列表后恢复原消息位置。
```

Avoid:

```text
处理会话记录相关功能。
```

Rules:

- Number multiple distinct outcomes.
- Preserve actual status: completed commits may use completion language; unfinished work must not be upgraded to completed.
- Mention validation only when supplied or observed.
- Do not invent counts, percentages, effort, affected users, or quantified value.
- Do not mention Git, commits, diffs, branches, worktrees, or files unless the user explicitly wants technical activity details.

### ⚠️ 哪些事情没有做好

Record a real gap, incomplete scenario, deferred validation, or process weakness only when it is explicit or directly supported.

Prefer:

```text
concrete scenario + current gap + impact or next correction
```

Do not turn ordinary follow-up work, an unrelated TODO, or absent evidence into today's deficiency. Tomorrow's plan is not automatically today's failure.

Work intentionally scheduled for a later phase is not a deficiency merely because it has not started. Mention it here only when it was due today, blocked today's result, or the user explicitly identifies it as unfinished work.

When no clear deficiency is known, use a natural statement such as:

```text
今日工作整体按计划推进，暂未发现明显的执行不足。
```

If a small known follow-up exists, it may be stated naturally:

```text
核心功能已完成，部分边界场景仍需进一步回归确认。
```

Use the second form only when those remaining scenarios are actually supported.

### ❓ 哪些事情解决不了

Describe only a real blocker, dependency, decision, or external assistance need. State its impact and required next action when known.

When no blocker is known, use:

```text
目前没有影响后续工作推进的明确阻塞问题。
```

Do not say that the repository or records failed to show a blocker.

### 📅 明日计划

Use explicit user plans first, but treat internal shorthand as intent rather than final copy. Rewrite phrases such as “继续后面的 specs 任务”, “推进下一阶段”, or “完成后续 Gate” into the business capability or ordinary work outcome the reader can understand. Preserve exact internal wording only when the user explicitly asks for it in the report.

Otherwise derive conservative next steps in this order:

1. Continue clearly unfinished work from staged or unstaged changes.
2. Complete directly related integration, regression, or boundary verification for today's implementation.
3. Continue an adjacent task only when today's work or project context clearly supports it.
4. Follow a stable personal convention visible in historical reports, such as stating a rest day when no work is planned.

Each item should be reviewable:

```text
action + scope + intended completion or verification condition
```

Choose the presentation by goal structure, not by the number of verbs:

- Use one compact paragraph when the actions advance one outcome or form a continuous sequence, such as discussing an integration approach, agreeing on boundaries, and starting implementation.
- Use numbered items only when the plans are genuinely independent, need separate follow-up, or the supplied form or stable historical style uses numbering for that situation.
- Do not split one coherent objective into artificial bullets merely because it contains several actions.

Do not invent unrelated features, dates, priorities, owners, metrics, or a full project backlog. Do not introduce the plan as a suggestion or explain that it was inferred.

When no specific next step can be supported and asking would not materially improve the report, use a restrained continuation such as:

```text
继续完善今日相关功能，确认主要使用流程和不同操作场景表现正常。
```

When the only known plan is to continue an internally named backlog and its business scope cannot be established safely, use a neutral audience-ready continuation such as:

```text
继续推进后续功能，按计划完成相关功能的开发和验证。
```

### 💡 今日思考

Write one compact insight grounded in the day's actual work. Prefer:

```text
specific lesson + reusable action for similar work
```

Useful sources include:

- a repeated root cause;
- a data, permission, tenant, or ownership boundary that became clearer;
- a reusable diagnostic or verification method;
- a design decision that reduces future risk;
- a process step that should happen earlier next time.

Avoid generic slogans. The reflection should be easier to understand than the implementation details and should not mention how the report was generated.

## Safe Transformations

| Evidence | Safe report framing |
| --- | --- |
| Completed feature commit | State the capability that now exists, within the implemented scope. |
| Completed fix commit | State the affected behavior and corrected result. |
| Optimization commit | State the optimized area and only the improvement supported by the change. |
| Investigation or experiment | State the investigated scope and confirmed finding; do not present it as fixed. |
| Staged or unstaged change | State progress without automatically claiming completion. |
| Added tests | State that tests were added; claim passing only with a result. |
| User-stated validation | State the supplied validation scope and result. |

Safe qualitative value framing includes:

- clearer identity display → improves recognition;
- complete message rendering → reduces missing conversation context;
- search or filtering → improves retrieval efficiency;
- consistent tenant context → reduces cross-tenant mismatches;
- restored position or focus → reduces repeated navigation.

Do not add quantified gains without data.

## Project Context Boundaries

An optional `.codex/daily-report-context.md` may define stable project terminology, module boundaries, data relationships, common validation concerns, and prohibited wording. Use it to interpret work, never to import unrelated tasks.

Repository evidence must remain scoped:

- Do not convert every changed file into a separate task.
- Do not import other authors' commits, the full backlog, old limitations, or neighboring module requirements.
- Do not infer charts, filters, metrics, APIs, or edge cases merely because another page has them.
- Do not treat environment notes as today's blocker unless they actually blocked today's work.

## Default Chinese Presentation

Unless a supplied form or stable historical style says otherwise, output exactly these five sections:

```text
📌 今日工作总结
⚠️ 哪些事情没有做好
❓ 哪些事情解决不了
📅 明日计划
💡 今日思考
```

- Use numbered items for multiple independent completed tasks. Keep tomorrow's plan as one paragraph when its actions share one goal; number only genuinely independent plans.
- Use a plain paragraph for fallbacks and reflection.
- Do not add a generation note before the first heading or commentary after the final section.
- Do not add “AI 改进建议” unless requested.

## Final Checklist

Before returning the report, confirm:

- The correct source mode and local report date were used.
- Same-day commits belong to the current user when the request says “my commits”.
- Staged, unstaged, and relevant untracked changes were considered in repository-backed mode.
- Related technical changes were consolidated into distinct work outcomes.
- Wording matches the intended audience; manager-facing reports do not expose unexplained phase, Gate, spec, ticket, or repository labels.
- Every manager-facing sentence is understandable without codebase, architecture, or testing knowledge.
- Technical validation methods were translated into observable results when the method itself was not important to the reader.
- The user's naming exclusions, technical-detail preference, and revision feedback were applied across the full report.
- Completion and progress wording match the evidence.
- Every summary item has a specific object, scope, and supported result when available.
- No test, release, acceptance, metric, effort, ownership, or production claim was invented.
- No source-analysis or evidence-disclaimer wording appears in the report.
- Missing evidence was not turned into a shortcoming or blocker.
- Work planned for a later phase was not presented as today's deficiency unless it was actually due or blocking.
- Fallback statements sound like normal workplace reporting.
- Tomorrow's plan is directly related, actionable, and not an invented backlog.
- Explicit plans written in internal shorthand were translated into audience-ready outcomes instead of echoed verbatim.
- Tomorrow's plan uses a paragraph or numbering according to goal structure and historical style, not merely the number of actions.
- The reflection contains a concrete, reusable lesson.
- Stable historical headings, numbering, density, and personal conventions were followed.
- All required fields are present and the result can be pasted directly into the target form.
