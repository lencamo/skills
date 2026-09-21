---
name: operate-worktree
description: >-
  MANUAL-ONLY git worktree skill. Run it ONLY when the user explicitly invokes
  it by name: "$operate-worktree", "/operate-worktree", "运行 operate-worktree",
  "用 operate-worktree", "操作工作树", "收编工作树", or "合并工作树". Do NOT
  trigger on generic git requests such as "合并分支" or "rebase 一下". Absorbs a
  git worktree branch back into the main checkout: rebases its commits onto the
  main checkout's current branch (linear history, every commit preserved, no
  merge commit) and fast-forwards a personal target branch. Never deletes the
  worktree directory or the branch name; never touches remotes.
metadata:
  version: '0.1.0'
---

# Operate Worktree

Absorb a git worktree's commits into the main checkout, rebase-style: linear
history, every commit preserved, no merge commit, and nothing gets deleted —
cleanup stays under the user's manual control.

## Trigger policy (manual-only)

This skill must never be auto-triggered.

- Run **only** on an explicit named invocation: `$operate-worktree`,
  `/operate-worktree`, or the user naming this skill with phrases like
  "操作工作树" / "收编工作树" / "合并工作树" / "运行 operate-worktree".
- Do **not** run on generic git requests ("合并分支", "rebase 一下",
  "sync worktrees") that do not name this skill; if unsure, ask first.

## When to use / not to use

**Use when** the user wants a worktree branch's commits moved onto the main
checkout's current branch as ordinary linear commits.

**Do not use when** the user wants a squash merge, a merge commit, a push/PR
flow, or worktree/branch deletion — explain the boundary and stop.

## Terminology

- **Main checkout**: the primary repository directory (first row of `git worktree list`).
- **Worktree**: the target worktree (directory plus its checked-out branch).
- `<target>`: the main checkout's current branch. `<worktree-branch>`: the worktree's branch.

## Target resolution

1. The user names a branch or path → resolve it via `git worktree list`.
2. The session cwd is inside a worktree → default to that worktree.
3. The session cwd is the main checkout and nothing is named → list all
   worktrees and let the user pick.

## Preflight checks (any hit → stop, never improvise)

| Check | Action |
| --- | --- |
| Main checkout is mid-rebase / mid-merge / has unresolved conflicts | Refuse; ask the user to finish that state first |
| Worktree has uncommitted changes (including untracked files) | Stop and ask: discard / stash / commit first; continue only per the user's choice |
| `git rev-list --count <target>..<worktree-branch>` is `0` | Report "nothing to absorb"; done |
| Worktree is in detached HEAD | Ask which branch to check out, or abort |

## Scenario detection

- `<target>` is `main`/`master`, **or** a branch with no commits of its own
  pointing at the same commit as `main`/`master` → **Scenario A**
- Anything else, including repositories without `main`/`master` → **Scenario B**

## Scenario A — main checkout on main/master (or a parallel fresh branch)

1. In the worktree: `git rebase <target>`.
2. Stop here. `<target>` does NOT move and no merge runs; the branch name and
   the worktree directory stay untouched.

Effect: the commits now read as if a branch had been cut from the tip of main
and developed there. Merging it onward is the user's own decision.

## Scenario B — main checkout on its own branch

1. Only if the main checkout has uncommitted changes (dirty files can block the
   fast-forward): `git stash push -u -m "operate-worktree: 主工作区(<target>)未提交改动 <YYYYMMDD>"`
   and record the entry for the final report. This is the only permitted
   automatic stash, and it applies to the main checkout only.
2. In the worktree: `git rebase <target>`; on conflict see Conflict handling.
3. In the main checkout: `git merge --ff-only <worktree-branch>` to absorb the
   commits. If it fails for any reason, stop and report; never force.

Effect: `<target>` gains the worktree's commits as a linear sequence; main and
the remote are untouched.

## Conflict handling

On a rebase conflict: stop immediately, list the conflicted files
(`git status --short`), and offer exactly two options:

- the user resolves the conflicts and the skill continues with
  `git rebase --continue` (repeated per conflicted commit), or
- `git rebase --abort` restores the original state.

Never resolve conflicts on the user's behalf.

## Hard rules (never violate)

- Never delete the worktree directory — no `git worktree remove`, no `orca worktree rm`.
- Never delete the worktree's branch name — no `git branch -d`/`-D`, no
  `git switch --detach` tricks.
- Never touch remotes: no push, no pull, no fetch. Local operations only.
- Never use `--force` / `--hard`.
- Never auto-stash the worktree's changes; that decision belongs to the user
  (the Scenario B step-1 stash of the main checkout is the only exception).
- Before any git write operation, present the plan — scenario, exact commands,
  expected before/after — and wait for explicit confirmation.

## Output (final report)

1. Before/after commit lists (`git log --oneline` excerpt of `<target>`).
2. Scenario called and the commands executed.
3. Stash entries created (if any), with their messages.
4. What was intentionally left in place: the branch name, the worktree directory
   (including session files), and the untouched remote.
5. Manual cleanup hint (a hint only, never executed by this skill):

```bash
# 1) remove the worktree directory — from the main checkout or another session,
#    never from a session living inside that directory
orca worktree rm --worktree <selector>   # or: git worktree remove <path>
# 2) then delete the branch name; -d deliberately refuses unmerged branches
git branch -d <worktree-branch>
```
