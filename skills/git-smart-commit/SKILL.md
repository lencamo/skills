---
name: git-smart-commit
description: Use when the user wants a git commit message or wants to refine one. Detect the current project's commit convention first, then generate a very short conventional commit header that matches the repo.
metadata:
  version: "0.1.0"
---

# Git Smart Commit

Generate commit messages for any project.

## Rule discovery order

1. Executable config:
   - `.commitlintrc.*`
   - `commitlint.config.*`
   - `package.json`
   - `.cz-config.*`
   - `.czrc*`
   - `lefthook.yml`
   - `.husky/*`
2. Project docs:
   - `AGENTS.md`
   - `README*`
   - `CONTRIBUTING*`
   - docs about contribution or git workflow
3. Recent history:
   - `git log --oneline -20`
4. Fallback:
   - Conventional Commits common defaults

If docs and config disagree, follow executable config.

## Workflow

1. Inspect staged changes first with `git diff --cached --name-only` and `git diff --cached --stat`.
2. If nothing is staged, inspect `git status --short` and `git diff --name-only`, then generate the message from the working tree changes.
3. Discover the repo's allowed `type` and `scope` values before writing anything.
4. If the repo has no explicit rules, default to:
   - `feat`
   - `fix`
   - `docs`
   - `style`
   - `refactor`
   - `perf`
   - `test`
   - `build`
   - `ci`
   - `chore`
   - `revert`
5. Infer `scope` from the dominant module, package, app, service, or directory.
6. Write one short subject that describes the actual change.

## Hard rules

- Prefer `type(scope): subject`.
- Use `type: subject` only when the repo does not require scope or no valid scope is clear.
- Obey the repo's max header length if configured. Otherwise keep it under `72` and preferably under `60`.
- Make the subject short. Prefer `2-6` words. Avoid more than `8` unless required.
- No ending period.
- Avoid vague subjects such as `update code`, `fix issue`, `minor changes`, `optimize`.
- Match the dominant language of the repo's recent commits when it is obvious.
- Use the repo's exact scope spelling when scope is enumerated.
- When multiple unrelated areas changed, omit scope or use the repo's broad fallback scope if one exists.
- For docs, config, lint, CI, types, or release work, use the matching non-feature type. Do not default to `feat`.
- Do not invent custom types or scopes unless the repo explicitly allows them.

## Scope rules

- If the repo enumerates scopes, only use those values.
- If the repo uses package names as scopes, prefer the nearest `package.json.name`.
- If the repo has no scope convention and scope adds little value, omit it.
- For root-level mixed changes, use the repo's broad scope if one exists. Otherwise omit scope.

## Output

- Default: return one line only, the recommended commit header.
- If `type` or `scope` is genuinely ambiguous, return at most `3` one-line candidates, best first.
- Do not add bullets, labels, explanations, or code fences unless the user asks.
- Do not add body or footer unless the user explicitly asks for a full commit message.

## Quick mapping

- feature -> `feat`
- bug fix -> `fix`
- refactor without behavior change -> `refactor`
- performance improvement -> `perf`
- docs or comments -> `docs`
- formatting only -> `style`
- tests -> `test`
- build tooling or dependency pipeline -> `build` or `chore`
- CI or hooks -> `ci`
- rollback -> `revert`

## Examples

- `fix(api): trim login payload`
- `docs: update setup guide`
- `chore(lint): tune oxlint config`
- `refactor(core): simplify init flow`
