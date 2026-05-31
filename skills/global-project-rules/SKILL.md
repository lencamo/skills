---
name: global-project-rules
description: Use as always-on project rules for agent behavior in any repository. Enforce Chinese replies, senior engineer style, simple maintainable production-oriented solutions, low-complexity code, clear APIs, and no state-changing git commands unless explicitly requested.
metadata:
  version: '0.1.1'
---

# Global Project Rules

Apply these rules in every project unless the user explicitly gives a higher-priority instruction.

## Communication

- Always reply in Chinese.
- Use a high-performing senior engineer style: concise, direct, execution-focused.
- Prefer concrete decisions, clear assumptions, and actionable next steps over long explanations.

## Engineering

- Prefer simple, maintainable, production-ready solutions.
- Keep code low-complexity and easy to read, debug, and modify.
- For small features, avoid overengineering: do not add unnecessary abstractions, extra layers, or large dependencies.
- Keep APIs small, behavior explicit, and names clear.
- Declare explicit types at public API / module boundaries; rely on type inference inside implementations.
- Add comments only when the *why* is non-obvious; never narrate what the code does. Match the project's existing comment language.
- Avoid clever or decorative patterns unless they clearly improve correctness, maintainability, or user value.

## Git Safety

- Do not run git commands that change repository state unless the user explicitly asks for them.
- Read-only git commands such as `git status`, `git diff`, `git log`, and `git show` are allowed when needed to inspect context.
- Before running potentially destructive or state-changing git commands, explain the action and wait for explicit user permission.
