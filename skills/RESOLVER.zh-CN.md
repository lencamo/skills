# Amo 工作流路由

[English](./RESOLVER.md) | 中文

这个文件只服务于 `amo-*` 工作流路由。

README 是公开目录：列出所有 skill、安装命令和简短说明。
这个 resolver 是维护文档，用于处理多个 `amo-*` skill 都可能匹配同一个请求的场景。

运行时触发来源仍然是每个 `skills/amo-*/SKILL.md` frontmatter 里的 `description`。保持这个文件简短，只在 `amo-*` 触发边界变化时更新。

## 共享输出标记

所有 `amo-*` 工作流 skill 都需要在输出第一行以内联方式带上自己的 skill 标记：

| Skill | 标记 |
| :---- | :--- |
| `amo-feature` | `🧩 [amo-feature]` |
| `amo-improve` | `🧰 [amo-improve]` |
| `amo-fix` | `🛠️ [amo-fix]` |
| `amo-refactor` | `🧱 [amo-refactor]` |
| `amo-best` | `🏆 [amo-best]` |
| `amo-research` | `🔬 [amo-research]` |
| `amo-detail` | `🔎 [amo-detail]` |
| `amo-implement` | `🔨 [amo-implement]` |
| `amo-review` | `🧹 [amo-review]` |
| `amo-draft` | `📝 [amo-draft]` |

标记必须和第一行内容放在同一行，不要单独成段。

## 主路由

| 用户意图 | 使用 |
| :------- | :--- |
| 构建当前不存在的新行为 | `amo-feature` |
| 有意改变、扩展、优化或重新设计已有行为 | `amo-improve` |
| 解释并修复错误、异常、不稳定、回归或失败的已有行为 | `amo-fix` |
| 调整结构、职责归属、耦合、状态/数据流、模块边界或组件边界 | `amo-refactor` |
| 挑战已有方案：“这是最佳方案吗？”“有没有更好方案？”“取舍/范围是否正确？” | `amo-best` |
| 调研竞品、社区实践或开源实现，寻找成熟、可复用的方案 | `amo-research` |
| 了解已有方案的整体链路、影响范围及前后端变化 | `amo-detail` |
| 实施已明确的方案并验证结果 | `amo-implement` |
| 审查已实现代码是否存在冗余、不必要抽象、TypeScript 类型噪音或 composable 行为来源不清晰 | `amo-review` |
| 编写或编辑目标聚焦的页面文案、需求说明、实施记录、版本说明、发布说明或临时项目文档 | `amo-draft` |

## 最佳标准路由

方案类 `amo-*` skill 在推荐方案前都必须先选择一个主要最佳标准。`amo-research`、`amo-detail` 和 `amo-implement` 沿用已有决策，不选择新的最佳标准。`amo-review` 和 `amo-draft` 不选择最佳标准。

| 用户信号 | 标准 |
| :------- | :--- |
| 没有明确约束、开发阶段代码、用户想要正确设计 | 目标态最佳 |
| “快”、“最小修改”、“少改”、“兼容”、“先上线”、短期交付、范围受限 | 约束内最佳 |
| 目标设计正确，但一次性落地范围过大或风险过高 | 演进式最佳 |
| 生产、数据、安全、认证/权限、支付、迁移、回滚、不可逆影响 | 风险最低最佳 |

没有明确约束时默认使用目标态最佳。不要在没有代码证据或用户明确要求时发明兼容路径、fallback 或遗留逻辑。

## 歧义场景

1. 新行为 + 现有代码混乱：使用 `amo-feature`，在方案里明确指出重构部分。
2. 已有行为需要有意改变：使用 `amo-improve`，不要用 `amo-fix`。
3. 已有行为错误或失败：使用 `amo-fix`；只有根因需要边界调整时才在修复方案里说明重构。
4. 没有行为变化，只有结构问题：使用 `amo-refactor`。
5. 已经有候选方案，用户询问是否最佳：使用 `amo-best`。
6. 已有实现代码，用户要求审查冗余、风格或 TypeScript 类型表达：使用 `amo-review`。
7. 用户要求基于上下文、参考风格、示例或实施过程写出干净的目标内容：使用 `amo-draft`。
8. 实施已明确的方案：使用 `amo-implement`；直接小改、生成资产和 commit message 不要求经过 amo 方案设计链路。

## 串联

Skill 不会自动串联。

典型手动链路：

```text
amo-feature / amo-improve / amo-fix / amo-refactor
-> amo-best
-> amo-detail
-> amo-implement
-> amo-review
-> amo-draft
```

只有在已有具体方案后，才把 `amo-best` 作为二次压力测试使用。
`amo-research` 可以独立使用，也可按需开展外部实现调研，支持 `amo-feature`、`amo-improve`、`amo-fix`、`amo-refactor` 和 `amo-best` 做方案判断；它提供证据及复用建议，不会自动调用其他 skill。
`amo-detail` 呈现已有方案的链路、影响范围和前后端变化；方案可以由用户提供，也可以来自主方案类 skill，并按需经过 `amo-best` 复核。
`amo-implement` 对已有方案进行编码与验证，同时约束注释噪音、前端内容污染和范围蔓延。
只有在已有代码后，才使用 `amo-review`。
当下一步产物是内容而不是代码时，使用 `amo-draft`。

## 维护规则

不要在这里重复每个 skill 的完整规则。这个文件只回答一个问题：

```text
面对这个用户请求，应该先使用哪个 amo 工作流 skill？
```
