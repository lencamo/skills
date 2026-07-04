> 中文翻译文档，仅供人阅读。真实 agent 执行规则以 ../SKILL.md 为准。

# git-smart-commit

## 元数据

- name: `git-smart-commit`
- description: 当用户想要提交信息或想优化提交信息时使用。先检测当前项目的提交约定，再生成匹配的 header；当一个意图跨多个区域时包含简短正文。
- version: `0.2.1`

# Git Smart Commit

生成符合仓库真实规则的 commit message。默认对内聚变更输出一个简短 header；当一个意图跨多个区域时包含简短 body。

## 使用场景

- 用户要求 commit message。
- 用户想优化草稿 commit header。
- 用户想基于 staged 或 working tree changes 生成 commit title。

## 不使用场景

- changelog、PR title 或 release notes。
- 用户已经给出确切的最终 commit header。

## 工作流

1. 先检查 staged changes：
   - `git diff --cached --name-only`
   - `git diff --cached --stat`
2. 如果没有 staged 内容，检查 working tree changes：
   - `git status --short`
   - `git diff --name-only`
3. 按顺序发现提交规则：
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
   - contribution 或 git workflow docs
   - `git log --oneline -20`
4. 如果文档和可执行配置冲突，遵循可执行配置。
5. 评估内聚性：
   - 一个逻辑变更
   - 一个主导变更加上附带波及
   - 多个无关变更
6. 把 formatting、lockfile、generated-file churn，以及随被覆盖代码移除的 tests 视为附带波及。
7. 从主要意图编写 subject，而不是从文件最多的区域编写。

## 硬规则

- 优先使用 `type(scope): subject`。
- 只有当仓库不要求 scope 或没有清晰有效 scope 时，才使用 `type: subject`。
- 如果仓库配置了最大 header 长度，遵守它。否则保持在 `72` 以内，最好在 `60` 以内。
- subject 优先 `2-6` 个词。除非必要，避免超过 `8` 个词。
- 不以句号结尾。
- 避免 `update code`、`fix issue`、`minor changes`、`optimize` 等模糊 subject。
- 当最近提交的主导语言明显时，匹配该语言。
- 如果仓库没有提交历史且没有明确语言规则，默认英文。
- 除非仓库明确允许，否则不要编造自定义 type 或 scope。
- 对 docs、config、lint、CI、types、tests、build 或 release 工作，使用匹配的非 feature type。不要默认 `feat`。
- 如果没有明确 type 规则，使用常见 Conventional Commit types：`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`revert`。

## Scope 规则

- 如果 scopes 已枚举，只使用这些值和精确拼写。
- 如果仓库使用 package names 作为 scopes，优先使用最近的 `package.json.name`。
- 如果仓库没有 scope 约定且 scope 价值不大，省略。
- 对根级混合或无关变更，如果存在广义 allowed scope，使用它。否则省略 scope。

## 输出

默认一行：推荐的 commit header。

### 何时添加结构

- 如果一个意图跨多个区域，返回 header、一个空行，然后最多 `5` 条简短 bullet body。
- 如果存在多个无关变更，先建议拆分 commit，然后按路径或意图提供简洁的一行 headers。

### 通用规则

- 如果 `type` 或 `scope` 确实模糊，最多返回 `3` 个一行候选，最佳优先。
- 不管是否有 body，header 都保持在同样长度限制内。
- 不要为了内聚变更补充 bullets。
- 普通一行 header 不添加标签或解释。多行 message 可以用单个代码块提升可读性。
- 只要仓库信号清晰，优先给出一个最佳答案。

## 示例

- `fix(api): trim login payload`
- `docs: update setup guide`
- `chore(lint): tune oxlint config`
- `refactor(core): simplify init flow`

一个意图跨多个区域：

```text
chore(lint): align shared lint rules

- update shared eslint config
- adjust affected package scripts
- refresh lint docs
```

无关变更：

```text
拆分这个 changeset：

- `fix(auth): handle expired sessions` for `src/auth/**`
- `docs: update setup guide` for `README.md`
```
