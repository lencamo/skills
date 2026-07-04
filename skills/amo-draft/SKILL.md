---
name: amo-draft
description: Use when the user asks to write or edit development-time content, website or page copy, requirement notes, implementation docs, version notes, release notes, or temporary project documentation, especially when reference material, examples, chat history, or implementation process could pollute the target artifact.
metadata:
  version: '0.1.0'
---

# Amo Draft

Write target-focused content by classifying context before drafting.

## Shared Output Marker

Prefix the first output line inline with `📝 [amo-draft]`. Do not put the marker in a separate paragraph.

## Use When

- The user asks to write or edit page copy, website content, requirement docs, implementation notes, version notes, release notes, or temporary development docs.
- The user provides a reference project, example text, style source, previous conversation, or implementation history that may be confused with the target content.
- The user wants a clean final artifact, not a record of the conversation or implementation process.

## Do Not Use

- For solution design before coding; use `amo-feature`, `amo-improve`, `amo-fix`, or `amo-refactor`.
- For second-pass solution pressure testing; use `amo-best`.
- For implemented-code style review; use `amo-review`.
- For generated user-facing docs based on real implementation; use `doc-feat-desc`.
- For commit messages; use `git-smart-commit`.

## Context Triage

Classify available context before writing:

- **Target context**: facts, requirements, audience, product identity, feature boundaries, accepted decisions, and constraints that belong in the final artifact.
- **Reference context**: style, tone, structure, format, layout pattern, or writing convention to imitate without copying subject matter.
- **Process context**: implementation history, debugging notes, temporary tradeoffs, conversation traces, rejected ideas, and agent workflow details.
- **Excluded context**: unrelated details, accidental examples, reference-project facts that do not belong to the target, and unsupported model assumptions.

Use target context as content. Use reference context only as form. Exclude process and excluded context unless the user explicitly asks to include them.

## Key Rules

- Keep the target artifact centered on the user's target subject.
- Do not let reference-project facts become target-product facts.
- Do not mention the conversation, the agent, implementation struggles, debugging path, rejected options, or writing process unless requested.
- Do not add notes, risks, limitations, implementation problems, or attention sections unless the user asks for them.
- Do not invent product claims, business facts, dates, metrics, scope, or constraints.
- If required target context is missing, ask briefly or write with explicit placeholders.
- If editing an existing file, preserve its intended structure and remove off-target content.
- Only write to a file when the user explicitly provides a path and asks to write, update, or replace it.

## Workflow

1. Identify the target artifact and target audience.
2. Classify context into target, reference, process, and excluded context.
3. Decide whether missing target context blocks a clean draft.
4. Write the artifact in the requested format and style.
5. Remove off-target content before final output.
6. Write to disk only when explicitly asked.

## Output

Use the user's language for output labels and content.

For simple drafting, output only the final artifact:

```text
📝 [amo-draft] <title or first heading>
...
```

For complex or polluted context, include a short triage summary first:

```text
📝 [amo-draft] Scenario: target-focused content draft
Context triage:
- Included:
- Reference only:
- Excluded:
Draft:
```
