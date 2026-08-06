---
name: generate-daily-report
description: Generate or improve structured daily work reports from brief task notes, tomorrow plans, screenshots, report forms, historical reports, or review feedback. Use when the user asks to write, organize, polish, or improve a daily report, 日报, or daily work summary and needs factual completion results, gaps, blockers, actionable next steps, reflections, or project-aware wording.
metadata:
  version: '0.1.0'
---

# Generate Daily Report

Turn sparse work notes into a concise, factual report that explains what changed, what remains, and what happens next.

## Use When

- The user provides completed tasks and tomorrow's plan and wants a ready-to-submit daily report.
- A report form, screenshot, historical report, or reviewer feedback defines the required structure or quality bar.
- Brief task names need clearer results, progress, business value, gaps, or acceptance criteria.
- Project terminology should improve the wording without inventing project facts.

## Do Not Use

- Do not use for weekly, monthly, performance-review, or project-retrospective writing unless the user explicitly wants a daily-report structure.
- Do not inspect a repository when the user requests input-only drafting.
- Do not treat repository changes as proof that the user completed, tested, released, or owned the work.

## Read the Quality Rules

Read [references/report-quality.md](references/report-quality.md) before drafting. Use its field requirements, transformation rules, and final checklist. Treat its examples as structural guidance only.

## Calibrate from Feedback

When historical reports, scores, or reviewer feedback are available, apply the feedback-calibration rules in the quality reference before drafting.

## Select the Context Mode

Choose one mode from the user's wording and available context:

1. **Input-only**: Use only the user's notes and supplied artifacts when requested, when no project is available, or when the report spans unrelated projects.
2. **Project-aware**: Use this by default when the notes contain project-specific terms and a relevant workspace is available. Read only the context needed to understand terminology and impact.
3. **Strict verification**: Use only when the user explicitly asks to verify the report against current project changes. Report mismatches separately; never silently replace the user's stated facts.

For project-aware mode, prefer this order:

1. Read `.codex/daily-report-context.md` if it exists.
2. Read applicable `AGENTS.md`, README files, and targeted project documentation.
3. Inspect relevant code or read-only Git evidence only when needed to clarify a term or verify an explicitly requested claim.

Treat `.codex/daily-report-context.md` as optional. Continue normally when it is absent. Do not require every task to belong to the current repository, and do not import unrelated repository facts into the report.

## Apply Source Priority

Use sources in this order:

1. The user's explicit completion status, results, blockers, and plan.
2. User-provided forms, screenshots, historical reports, and review feedback.
3. Optional project context and targeted project documentation.
4. Read-only repository evidence.
5. General domain knowledge for cautious, non-quantified value framing.

Resolve conflicts in favor of the user's explicit statement, but mention a material evidence mismatch outside the report when strict verification was requested.

Classify each planned sentence internally:

- **Confirmed fact**: explicitly supplied by the user or source artifact.
- **Supported interpretation**: a conservative explanation of capability or value supported by the task wording or project context.
- **Unsupported claim**: a test, release, metric, scope, ownership, or outcome not supported by a source. Exclude it.

## Workflow

1. Identify the report language, target form, required fields, and requested level of detail.
2. Calibrate from supplied historical scores or feedback when available.
3. Extract completed work, scope, progress, validation, gaps, blockers, tomorrow's work, and lessons.
4. Select the context mode and gather only the minimum relevant context.
5. Draft every required field using the field requirements and safe transformations in the quality reference.
6. Run its final checklist, then output content that can be pasted directly into the target form.

## Key Rules

- Treat the source priority and sentence classification above as binding for every report statement.
- Stay within the selected context mode, and keep strict-verification mismatches outside the report.
- Apply the quality reference without weakening its factuality, field, or checklist requirements.
- Ask a brief question only when missing information would materially change the report. Otherwise draft conservatively.

## Output

Follow the user's form exactly when provided. Otherwise, default to these sections in the user's language:

```text
Today's Work Summary
What Was Not Done Well
What Could Not Be Resolved
Tomorrow's Plan
Today's Reflection
```

For a concise request without a required form, return only the requested sections, usually today's summary and tomorrow's plan. Never omit a field required by a supplied form. Do not include source analysis, confidence labels, or drafting commentary inside the report unless the user asks for them.
