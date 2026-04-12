# skills

[English](./README.md) | 中文

面向实际工程场景的通用 Agent Skills 集合。

仓库地址：`https://github.com/lencamo/skills`

## Skills

| Skill                                                  | 适用场景                         | 功能说明                                                |
| :----------------------------------------------------- | :------------------------------- | :------------------------------------------------------ |
| [`doc-feat-desc`](skills/doc-feat-desc/SKILL.md)       | 已有功能需要补充面向用户的文档时 | 基于真实实现生成 `doc/<requirement-name>/` 下的三类文档 |
| [`git-smart-commit`](skills/git-smart-commit/SKILL.md) | 需要生成符合仓库约定的提交信息时 | 检测仓库提交规范并产出匹配的简短 commit 标题            |

每个 skill 都是一个独立目录，不只是单个 Markdown 文件。按需可以携带 `references/` 等辅助资源。

## 安装

本仓库遵循标准 `skills` 目录结构，可通过 `skills` CLI 安装到多个 agent。`-a <agent>` 的常见取值包括 `codex`、`claude-code`、`cursor`、`opencode`、`gemini-cli`、`continue`、`windsurf`、`trae` 等；完整支持列表请以当前 `skills` CLI 文档或 `npx skills --help` 为准。

查看可安装列表：

```bash
npx skills add lencamo/skills --list
```

为 Codex 安装全部 skills：

```bash
npx skills add lencamo/skills -a codex -g -y
```

为 Claude Code 安装全部 skills：

```bash
npx skills add lencamo/skills -a claude-code -g -y
```

按需为指定 agent 安装指定 skill：

```bash
npx skills add lencamo/skills -a codex -g -y -s doc-feat-desc
npx skills add lencamo/skills -a claude-code -g -y -s git-smart-commit
```

本地开发时使用当前仓库：

```bash
git clone git@github.com:lencamo/skills.git
cd skills
npx skills add . -a codex -g -y
```

## 许可证

本仓库采用 MIT License。完整条款见 [LICENSE](./LICENSE)。

## 目录结构

```text
.
├── AGENTS.md
├── CLAUDE.md
├── LICENSE
├── marketplace.json
├── README.md
├── README.zh-CN.md
└── skills
    ├── doc-feat-desc
    │   ├── references
    │   └── SKILL.md
    └── git-smart-commit
        └── SKILL.md
```
