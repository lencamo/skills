# skills

[English](./README.md) | 中文

面向实际工程场景的通用 Agent Skills 集合。

仓库地址：`https://github.com/lencamo/skills`

## 工作流类 Skills

| Skill                                            | 目标                                      | 触发方式                                      |
| :----------------------------------------------- | :---------------------------------------- | :-------------------------------------------- |
| [`amo-feature`](skills/amo-feature/docs/SKILL.zh-CN.md)     | 新功能方案设计，并选择最佳标准            | “新增一个功能怎么做？”“这个需求怎么实现？”   |
| [`amo-improve`](skills/amo-improve/docs/SKILL.zh-CN.md)     | 已有功能改造，并选择最佳标准              | “现有功能要改成这样，怎么改最好？”           |
| [`amo-fix`](skills/amo-fix/docs/SKILL.zh-CN.md)             | Bug 根因分析，并选择修复标准              | “这个 bug 为什么出现？”“怎么修才对？”        |
| [`amo-refactor`](skills/amo-refactor/docs/SKILL.zh-CN.md)   | 按标准规划重构、模块边界、职责归属        | “这块是不是该重构？”“边界怎么拆？”           |
| [`amo-best`](skills/amo-best/docs/SKILL.zh-CN.md)           | 复核最佳标准，并对已有方案做压力测试      | “这是最佳方案吗？”“有没有更优方案？”         |
| [`amo-research`](skills/amo-research/docs/SKILL.zh-CN.md)   | 调研实现证据与可复用方案，辅助方案判断 | “竞品或开源项目是怎么实现这个功能的？”     |
| [`amo-review`](skills/amo-review/docs/SKILL.zh-CN.md)       | 审查已实现代码的风格、冗余和 TS 类型表达  | “帮我看看这段代码是否冗余、风格是否合理？”   |
| [`amo-draft`](skills/amo-draft/docs/SKILL.zh-CN.md)         | 编写目标聚焦的文档和文案，避免上下文污染  | “基于这些上下文写一份干净的页面文案/需求文档。” |

典型链路：

```text
amo-feature / amo-improve / amo-fix / amo-refactor
→ amo-best
→ implement
→ amo-review
→ amo-draft
```

主方案类工作流 skill 会先选择最佳标准：目标态最佳、约束内最佳、演进式最佳或风险最低最佳。`amo-best` 只用于对已有方案做二次复核。`amo-review` 用于已实现代码的风格审查。`amo-draft` 用于目标聚焦的内容草稿。

`amo-research` 调研竞品、社区实践和开源实现，为 `amo-feature`、`amo-improve`、`amo-fix`、`amo-refactor` 和 `amo-best` 提供实现证据及复用建议。它可以独立使用，是可选步骤，不是设计的固定前置步骤。

`amo-*` 工作流的详细路由和歧义场景规则见 [`skills/RESOLVER.zh-CN.md`](skills/RESOLVER.zh-CN.md)。

## 工具类 Skills

| Skill                                                                | 适用场景                                                                         | 功能说明                                                                        |
| :------------------------------------------------------------------- | :------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| [`brand-asset-generator`](skills/brand-asset-generator/docs/SKILL.zh-CN.md)     | 需要把源 logo 图片生成通用 web、PWA、桌面应用、托盘、ICO 或 ICNS 资产并接入项目时 | 生成透明 source mark，输出带背景和形状规则的 `web/` 与 `desktop/` 图片资产包 |
| [`doc-feat-desc`](skills/doc-feat-desc/docs/SKILL.zh-CN.md)                     | 已有功能需要补充面向用户的文档时                                                 | 基于真实实现生成 `doc/<requirement-name>/` 下的三类文档                         |
| [`draft-to-project`](skills/draft-to-project/docs/SKILL.zh-CN.md)               | 需要把截图、HTML 草图、本地 `file://` 原型页或设计稿等 UI 草稿落到真实项目页面时 | 复用已有组件和样式，同时让最终实现的布局结构贴近提供的草图                      |
| [`git-smart-commit`](skills/git-smart-commit/docs/SKILL.zh-CN.md)               | 需要生成符合仓库约定的提交信息时                                                 | 检测仓库提交规范并产出简短 commit 标题，仅在需要时补充正文或拆分建议            |
| [`global-project-rules`](skills/global-project-rules/docs/SKILL.zh-CN.md)       | 需要为项目启用全局 Agent 行为规则时                                              | 固定中文回复、资深工程师风格、简单可维护方案，并保护 git 状态变更               |
| [`operate-worktree`](skills/operate-worktree/docs/SKILL.zh-CN.md)               | 需要把工作树的提交以 rebase 方式收编到主工作区分支、且清理完全由自己掌控时       | 判定场景后重放工作树提交（个人分支则快进吸收）并输出报告；永不删除目录或分支名、不碰远程 |
| [`signature-svg-generator`](skills/signature-svg-generator/docs/SKILL.zh-CN.md) | 需要基于字体生成可复用签名 SVG、Vue 组件或 React 组件时                          | 基于真实字体路径默认输出到 `signatures/<签名文本slug>/` 下的静态和动画 SVG/Vue/React 产物 |
| [`solution-design-review`](skills/solution-design-review/docs/SKILL.zh-CN.md)   | 需要在编码前讨论实施方案、bug 修复方案、根因分析、最佳方案或取舍时               | 在实施前区分根因、快速修复、长期方案、影响范围和验证计划                        |
| [`split-pencil-file`](skills/split-pencil-file/docs/SKILL.zh-CN.md)             | 需要把导入后的大型 Pencil `.pen` 按顶层 Frame 拆成独立目录时                     | 生成 `<frame-name>/index.pen` 目录，并复制该 Frame 引用的本地图片资源           |

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
npx skills add lencamo/skills -a codex -g -y -s amo-feature
npx skills add lencamo/skills -a codex -g -y -s amo-improve
npx skills add lencamo/skills -a codex -g -y -s amo-fix
npx skills add lencamo/skills -a codex -g -y -s amo-refactor
npx skills add lencamo/skills -a codex -g -y -s amo-best
npx skills add lencamo/skills -a codex -g -y -s amo-research
npx skills add lencamo/skills -a codex -g -y -s amo-review
npx skills add lencamo/skills -a codex -g -y -s amo-draft
npx skills add lencamo/skills -a codex -g -y -s brand-asset-generator
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
        ├── docs
        │   └── SKILL.zh-CN.md
        ├── agents
        ├── references
        ├── scripts
        └── templates
```

## 参考

- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- [tw93/Waza](https://github.com/tw93/Waza)
- [Animated SVG Logo](https://antfu.me/posts/animated-svg-logo)
