---
name: generate-daily-report
description: Generate or improve ready-to-submit daily work reports from task notes, screenshots, forms, historical reports, review feedback, or the current repository's same-day Git commits and worktree changes. Use when the user asks to write, organize, polish, or improve a 日报 or daily work summary, including requests based on today's development record.
metadata:
  version: '0.5.0'
---

# Generate Daily Report

Turn the day's real work into a concise report that can be pasted directly into the user's reporting form.

## Use When

- The user provides completed work, unfinished work, blockers, reflections, or tomorrow's plan.
- The user asks for a report based on today's commits, code changes, or development record.
- A relevant repository is available and the user asks for a daily report without supplying enough task notes; use the current user's same-day commits and worktree changes as the default task input.
- Screenshots, historical reports, scores, or reviewer feedback establish the required form and writing style.

## Do Not Use

- Do not use for weekly, monthly, performance-review, or retrospective writing unless the user explicitly wants a daily-report structure.
- Do not inspect a repository when the user requests input-only drafting.
- Do not claim testing, deployment, acceptance, metrics, or production results merely because code exists.

## Read the Quality Rules

Read [references/report-quality.md](references/report-quality.md) completely before drafting. It defines repository evidence handling, audience-aware terminology translation, field requirements, historical-style calibration, natural fallback text, and the final checklist.

## Choose the Source Mode

Choose one primary mode from the request and available context:

1. **Input-only**: Use only the user's notes and supplied artifacts when requested, when no relevant repository is available, or when the report spans unrelated projects.
2. **Repository-backed**: Use when the user mentions Git, commits, code changes, the worktree, or asks for today's report while working in a relevant repository without providing a complete task list.
3. **Strict verification**: Apply only when the user explicitly asks to verify their stated work against the repository. Keep material mismatches outside the report body.

In repository-backed mode:

- Treat same-day commits authored by the current Git user as completed development work unless their wording or diff clearly indicates investigation or partial progress.
- Treat staged, unstaged, and relevant untracked work as today's work too, but describe its actual status; uncommitted work is normally “推进中” or “完善中”, not automatically completed.
- Add any extra tasks the user explicitly supplies, even when they are outside the repository.
- Group related commits and files by work outcome instead of producing one item per commit or file.

Use `.codex/daily-report-context.md`, applicable `AGENTS.md`, README files, and targeted project documentation only when needed to interpret project terminology or impact. Do not turn the wider project backlog into today's work.

## Evidence and Writing Boundary

Use evidence internally, but write the report as a normal first-person workplace update. Unless the user asks for an audit trail:

- Never write phrases such as “根据 Git 提交”, “提交记录显示”, “工作区中”, “现有信息未体现”, or “无法从记录确认” in the report.
- Do not turn missing evidence into a shortcoming, blocker, or disclaimer. In particular, absence of recorded tests does not prove that testing was omitted.
- Do not include commit hashes, file counts, diff statistics, confidence labels, source analysis, or drafting notes.
- Do not preface the report with how it was generated. Return only the paste-ready report.

The user's explicit status and plans override repository interpretation. Exclude unsupported claims about validation, release, metrics, effort, ownership, and business outcome.

## Workflow

1. Identify the report date, language, required form, intended audience, and source mode. Unless the user or supplied form indicates otherwise, assume the reader is a manager or business stakeholder who does not know the repository's internal planning vocabulary.
2. Capture the user's naming exclusions, preferred level of technical detail, tone corrections, and other revision feedback. When revising a report, treat this feedback as report-wide unless the user clearly limits it to one sentence.
3. If historical reports or scores are supplied, extract their stable headings, density, fallback wording, and recurring quality feedback.
4. Gather the minimum evidence needed for today's tasks. In repository-backed mode, inspect same-day commits and current worktree changes, then read only targeted diffs needed to understand outcomes.
5. Merge related implementation details into distinct task results, translate internal planning and implementation vocabulary for the intended audience, and preserve the evidenced completion state.
6. Draft every required field. Use natural fallback wording when no shortcoming or blocker is known; do not explain why information is absent.
7. Derive tomorrow's plan conservatively from explicit plans, unfinished current work, and directly related follow-up validation. Do not invent a new feature backlog.
8. Write one concrete reflection tied to the day's work, perform the audience rewrite pass, then run the quality checklist.

## Output

Follow a supplied form exactly. Otherwise, for a Chinese report use this default structure and heading style:

```text
📌 今日工作总结
⚠️ 哪些事情没有做好
❓ 哪些事情解决不了
📅 明日计划
💡 今日思考
```

Number multiple independent work-summary items. For tomorrow's plan, use one compact paragraph when several actions serve the same goal or form a sequence such as discussion, decision, and implementation; use numbering only for genuinely independent plans or when the supplied form or historical style prefers it. Use a short paragraph for a single item or a natural no-issue statement. Do not add an “AI 改进建议” section unless the user explicitly asks for it.

For a concise request that clearly asks for only selected fields, return only those fields. Otherwise preserve all five default fields so the result can be submitted directly.
