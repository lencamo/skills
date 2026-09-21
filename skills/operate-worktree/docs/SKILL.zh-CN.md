# 操作工作树（Operate Worktree）

> 本文件是 [`SKILL.md`](../SKILL.md) 的中文对照翻译，仅供人阅读；可执行规则以 `SKILL.md` 为准。

把一个 git 工作树的提交收编进主工作区：rebase 方式、线性历史、逐条保留提交、不产生 merge commit，并且**什么都不删除**——清理工作完全由用户手动掌控。

## 触发策略（仅手动）

本 skill 绝不允许被自动触发。

- 只在用户**点名**时运行：`$operate-worktree`、`/operate-worktree`，或用户说出
  "操作工作树" / "收编工作树" / "合并工作树" / "运行 operate-worktree" 等点名本 skill 的话。
- 不要在泛化的 git 请求（"合并分支"、"rebase 一下"、"sync worktrees"）时运行；
  拿不准就先问。

## 适用 / 不适用

**适用**：用户想把工作树分支上的提交以普通线性提交的形式落到主工作区当前分支上。

**不适用**：用户想要 squash 合并、merge commit、push/PR 流程，或想删除工作树/分支——说明边界后停止。

## 术语

- **主工作区（main checkout）**：仓库主目录（`git worktree list` 的第一行）。
- **工作树（worktree）**：待收编的目标工作树（目录 + 其检出的分支）。
- `<target>`：主工作区当前分支。`<worktree-branch>`：工作树分支。

## 目标解析

1. 用户指定了分支名或路径 → 用 `git worktree list` 定位。
2. 当前会话 cwd 就在某个工作树里 → 默认收编该工作树。
3. cwd 在主工作区且未指定 → 列出所有工作树让用户选。

## 体检（任一命中即停止，不得自行变通）

| 检查 | 处理 |
| --- | --- |
| 主工作区正处于 rebase / merge / 未解决冲突的半途状态 | 拒绝执行，请用户先处理完现场 |
| 工作树有未提交改动（含 untracked 文件） | 停下询问：丢弃 / stash / 先提交；按用户选择继续 |
| `git rev-list --count <target>..<worktree-branch>` 为 `0` | 报告"没有可收编的提交"，结束 |
| 工作树处于 detached HEAD | 询问要检出到哪个分支，或放弃 |

## 场景判定

- `<target>` 是 `main`/`master`，**或**是与 `main`/`master` 指向同一提交、自身无提交的空分支 → **场景A**
- 其他情况（包括没有 `main`/`master` 的仓库）→ **场景B**

## 场景A —— 主工作区在 main/master（或平级空分支）上

1. 在工作树里执行：`git rebase <target>`。
2. 到此为止。`<target>` 不移动、不做任何合并；分支名与工作树目录保持原样。

效果：这些提交看起来就像"从 main 顶端拉了个分支在上面开发"。后续是否继续合并由用户自行决定。

## 场景B —— 主工作区在自己的分支上

1. 仅当主工作区有未提交内容时（脏文件可能阻挡快进合并）：
   `git stash push -u -m "operate-worktree: 主工作区(<target>)未提交改动 <YYYYMMDD>"`，
   并把该条目记入最终报告。这是唯一允许的自动 stash，且只针对主工作区。
2. 在工作树里执行：`git rebase <target>`；遇冲突见"冲突处理"。
3. 在主工作区执行：`git merge --ff-only <worktree-branch>` 吸收提交。
   任何原因失败都立即停止并报告；绝不 force。

效果：`<target>` 以线性序列收下工作树的全部提交；main 与远程不受影响。

## 冲突处理

rebase 冲突时：立即停止，列出冲突文件（`git status --short`），只提供两个选项：

- 用户自行解决冲突，skill 用 `git rebase --continue` 继续（每个冲突提交重复一次）；或
- `git rebase --abort` 恢复原状。

绝不代替用户解决冲突。

## 硬性禁令（任何时候不得违反）

- 永不删除工作树目录——不做 `git worktree remove`，不做 `orca worktree rm`。
- 永不删除工作树分支名——不做 `git branch -d`/`-D`，不玩 `git switch --detach` 变体。
- 永不碰远程：不 push、不 pull、不 fetch，只做本地操作。
- 永不使用 `--force` / `--hard`。
- 绝不自动 stash 工作树的改动——这是用户的决定权（场景B 第 1 步对主工作区的 stash 是唯一例外）。
- 任何 git 写操作执行前，先报告完整计划——场景、确切命令、预期前后对比——并等用户明确确认。

## 输出（最终报告）

1. 前后提交列表（`<target>` 的 `git log --oneline` 摘录）。
2. 判定的场景与执行的命令。
3. 产生的 stash 条目（如有），附消息原文。
4. 有意保留原样的东西：分支名、工作树目录（含会话文件）、未触碰的远程。
5. 手动清理提示（仅提示，本 skill 永不代为执行）：

```bash
# 1) 删除工作树目录——在主工作区或其他会话执行，
#    绝不在身处该目录的会话里执行
orca worktree rm --worktree <selector>   # 或: git worktree remove <路径>
# 2) 再删分支名；-d 会刻意拒绝删除未合并的分支（这是保护）
git branch -d <worktree-branch>
```
