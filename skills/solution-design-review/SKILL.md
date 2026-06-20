---
name: solution-design-review
description: Use when the user asks for an implementation plan, bug-fix approach, best solution, root-cause analysis, refactor strategy, tradeoff discussion, or wants to discuss how to solve a problem before coding.
metadata:
  version: '0.1.0'
---

# Solution Design Review

Use this skill before proposing or implementing a solution when the user asks for a plan, diagnosis, implementation approach, best solution, root-cause analysis, refactor strategy, or tradeoff discussion.

## Use When

- The user asks "how would you implement this?"
- The user asks for the best solution, not just a minimal patch
- The user asks why a bug happens and how to fix it
- The user wants to compare implementation options
- The task involves UI consistency, interaction state, component boundaries, architecture, or refactoring
- A quick local patch may work but could hide a deeper ownership or design issue

## Do Not Use

- When the user clearly asks for a direct small edit and no discussion is needed
- For purely mechanical file changes with no design decision
- For commit message generation
- For user-facing documentation writing

## Workflow

1. **Classify the problem**
   - Bug fix
   - Feature implementation
   - Refactor
   - UI/design consistency
   - Interaction or state ownership
   - Architecture or module boundary
   - Platform or runtime behavior

2. **Inspect the relevant context first**
   - Read the relevant code, config, or existing patterns before proposing a solution.
   - Distinguish symptoms from root cause.
   - Do not infer from class names or surface behavior alone when rendered output, event flow, or ownership boundaries matter.

3. **Separate quick fixes from durable solutions**
   - If a quick fix exists, label it as such.
   - If a better long-term solution exists, explain why it is better.
   - Do not present a workaround as the best solution.

4. **Recommend one approach**
   - State the recommended solution clearly.
   - Explain the tradeoffs and blast radius.
   - Avoid overengineering small changes, but do not default to minimal edits when the user asks for the best solution.

5. **State implementation impact**
   - Files or modules likely affected
   - Behavior changes
   - Compatibility or migration concerns
   - Verification plan

6. **When approved, implement the recommended approach**
   - Do not silently downgrade to a quicker patch.
   - If implementation reveals a better approach, pause and explain the change before switching strategy.

## Key Rules

- Root cause before fix.
- Ownership boundary before patch.
- Rendered behavior before class-name assumptions.
- Tradeoffs before recommendation.
- Best solution means durable, maintainable, and appropriate to the project, not necessarily the largest refactor.

## Output

For small cases, answer with:

```text
原因：
方案：
影响范围：
验证方式：
```

For larger cases, include:

```text
问题类型：
根因判断：
可选方案：
推荐方案：
实施范围：
验证计划：
```
