# skills

[English](./README.md) | 中文

面向实际工程场景的通用 Agent Skills 集合。

仓库地址：`https://github.com/lencamo/skills`

## Skills

| Skill                                                    | 适用场景                                                                         | 功能说明                                                              |
| :------------------------------------------------------- | :------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| [`doc-feat-desc`](skills/doc-feat-desc/SKILL.md)         | 已有功能需要补充面向用户的文档时                                                 | 基于真实实现生成 `doc/<requirement-name>/` 下的三类文档               |
| [`draft-to-project`](skills/draft-to-project/SKILL.md)   | 需要把截图、HTML 草图、本地 `file://` 原型页或设计稿等 UI 草稿落到真实项目页面时 | 复用已有组件和样式，同时让最终实现的布局结构贴近提供的草图            |
| [`git-smart-commit`](skills/git-smart-commit/SKILL.md)   | 需要生成符合仓库约定的提交信息时                                                 | 检测仓库提交规范并产出简短 commit 标题，仅在需要时补充正文或拆分建议    |
| [`global-project-rules`](skills/global-project-rules/SKILL.md) | 需要为项目启用全局 Agent 行为规则时                                              | 固定中文回复、资深工程师风格、简单可维护方案，并保护 git 状态变更      |
| [`signature-svg-generator`](skills/signature-svg-generator/SKILL.md) | 需要基于字体生成可复用签名 SVG 或 Vue 组件时                                    | 基于真实字体路径输出到 `signatures/<签名文本slug>/` 下的静态和动画 SVG/Vue 产物 |
| [`solution-design-review`](skills/solution-design-review/SKILL.md) | 需要在编码前讨论实施方案、bug 修复方案、根因分析、最佳方案或取舍时              | 在实施前区分根因、快速修复、长期方案、影响范围和验证计划              |
| [`split-pencil-file`](skills/split-pencil-file/SKILL.md) | 需要把导入后的大型 Pencil `.pen` 按顶层 Frame 拆成独立目录时                     | 生成 `<frame-name>/index.pen` 目录，并复制该 Frame 引用的本地图片资源 |

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
npx skills add lencamo/skills -a codex -g -y -s draft-to-project
npx skills add lencamo/skills -a codex -g -y -s global-project-rules
npx skills add lencamo/skills -a codex -g -y -s signature-svg-generator
npx skills add lencamo/skills -a codex -g -y -s solution-design-review
npx skills add lencamo/skills -a claude-code -g -y -s git-smart-commit
npx skills add lencamo/skills -a claude-code -g -y -s split-pencil-file
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
    └── example-skill
        ├── SKILL.md
        ├── agents
        ├── references
        ├── scripts
        └── templates
```

## 参考

- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- [tw93/Waza](https://github.com/tw93/Waza)
