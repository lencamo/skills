---
name: git-smart-commit
description: Use when the user wants a git commit message or wants to refine one. Detect the current project's commit convention first, then generate a matching header; include a short body when one intent spans multiple areas.
metadata:
  version: '0.2.1'
---

# Git Smart Commit

Generate a commit message that matches the repository's actual rules. Default to one short header for cohesive changes; include a short body when one intent spans multiple areas.

## Use When

- The user asks for a commit message
- The user wants to refine a draft commit header
- The user wants a commit title based on staged or working tree changes

## Do Not Use

- For changelogs, PR titles, or release notes
- When the user already gave the exact final commit header

## Workflow

1. Inspect staged changes first:
   - `git diff --cached --name-only`
   - `git diff --cached --stat`
2. If nothing is staged, inspect working tree changes:
   - `git status --short`
   - `git diff --name-only`
3. Discover commit rules, in order:
   - `.commitlintrc.*`
   - `commitlint.config.*`
   - `package.json`
   - `.cz-config.*`
   - `.czrc*`
   - `lefthook.yml`
   - `.husky/*`
   - `AGENTS.md`
   - `README*`
   - `CONTRIBUTING*`
   - contribution or git workflow docs
   - `git log --oneline -20`
4. If docs and executable config disagree, follow executable config.
5. Assess cohesion:
   - one logical change
   - one dominant change plus incidental ripple
   - several unrelated changes
6. Treat formatting, lockfile, generated-file churn, and tests removed with covered code as incidental ripple.
7. Write the subject from the primary intent, not from the area with the most files.

## Hard rules

- Prefer `type(scope): subject`.
- Use `type: subject` only when the repo does not require scope or no valid scope is clear.
- Obey the repo's max header length if configured. Otherwise keep it under `72` and preferably under `60`.
- Prefer `2-6` subject words. Avoid more than `8` unless required.
- No ending period.
- Avoid vague subjects such as `update code`, `fix issue`, `minor changes`, `optimize`.
- Match the dominant language of the repo's recent commits when it is obvious.
- If the repo has no commit history and no explicit language rule, default to English.
- Do not invent custom types or scopes unless the repo explicitly allows them.
- For docs, config, lint, CI, types, tests, build, or release work, use the matching non-feature type. Do not default to `feat`.
- If no explicit type rules exist, use common Conventional Commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Scope rules

- If scopes are enumerated, only use those values and exact spelling.
- If the repo uses package names as scopes, prefer the nearest `package.json.name`.
- If the repo has no scope convention and scope adds little value, omit it.
- For root-level mixed or unrelated changes, use a broad allowed scope if one exists. Otherwise omit scope.

## Output

Default to one line: the recommended commit header.

### When to add structure

- If one intent spans several areas, return the header, one blank line, then a short body of up to `5` bullets.
- If several unrelated changes are present, recommend splitting the commit first, then provide concise one-line headers grouped by path or intent.

### General rules

- If `type` or `scope` is genuinely ambiguous, return at most `3` one-line candidates, best first.
- Keep the header within the same length limits whether or not a body follows.
- Never pad a cohesive change with bullets.
- Do not add labels or explanations for a normal one-line header. A multi-line message may use a single code block for readability.
- Prefer a single best answer whenever the repo signals are clear.

## Examples

- `fix(api): trim login payload`
- `docs: update setup guide`
- `chore(lint): tune oxlint config`
- `refactor(core): simplify init flow`

One intent across areas:

```text
chore(lint): align shared lint rules

- update shared eslint config
- adjust affected package scripts
- refresh lint docs
```

Unrelated changes:

```text
Split this changeset:

- `fix(auth): handle expired sessions` for `src/auth/**`
- `docs: update setup guide` for `README.md`
```
