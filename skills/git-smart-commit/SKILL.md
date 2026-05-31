---
name: git-smart-commit
description: Use when the user wants a git commit message or wants to refine one. Detect the current project's commit convention first, then generate a matching short header; add a body or split suggestion only when the request or changeset requires it.
metadata:
  version: '0.2.0'
---

# Git Smart Commit

Generate a commit message that matches the repository's actual rules. Default to one short header; add extra structure only when the user asks for a full message or the changeset is clearly not suitable for one commit.

## Use When

- The user asks for a commit message
- The user wants to refine a draft commit header
- The user wants a commit title based on staged or working tree changes

## Do Not Use

- For changelogs, PR titles, or release notes
- When the user already gave the exact final commit header

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
3. Assess cohesion: decide whether the changes form (a) one logical change, (b) one dominant change plus incidental ripple, or (c) several unrelated changes. Treat formatting, lockfile, and generated-file churn — and tests removed alongside the code they covered — as incidental ripple, not separate areas.
4. Discover the repo's allowed `type` and `scope` values before writing anything.
5. If the repo has no explicit rules, default to:
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
6. Infer `scope` from the dominant module, package, app, service, or directory.
7. Write the subject from the primary intent, not from the area with the most files. Then choose the output shape from the cohesion result (see Output).

## Hard rules

- Prefer `type(scope): subject`.
- Use `type: subject` only when the repo does not require scope or no valid scope is clear.
- Obey the repo's max header length if configured. Otherwise keep it under `72` and preferably under `60`.
- Make the subject short. Prefer `2-6` words. Avoid more than `8` unless required.
- No ending period.
- Avoid vague subjects such as `update code`, `fix issue`, `minor changes`, `optimize`.
- Match the dominant language of the repo's recent commits when it is obvious.
- If the repo has no commit history and no explicit language rule, default to English.
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

Default to one line: the recommended commit header.

Use extra structure only in these cases:

- If the user asks for a full commit message and one intent spans several areas, return the header, one blank line, then a short body of up to `5` bullets.
- If several unrelated changes are present, recommend splitting the commit first, then provide up to `3` one-line headers grouped by path or intent.

- If `type` or `scope` is genuinely ambiguous, return at most `3` one-line candidates, best first.
- Keep the header within the same length limits whether or not a body follows.
- Never pad a cohesive change with bullets.
- Do not add labels or explanations for a normal one-line header. A multi-line message may use a single code block for readability.
- Prefer a single best answer whenever the repo signals are clear.

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
- Multi-area under one intent:

  ```
  chore(lint): roll out shared eslint config across monorepo

  - add explicit return types in utils/ui for the new rule
  - relax explicit-function-return-type to module boundaries
  - drop obsolete utils unit tests
  ```
