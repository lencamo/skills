> 中文翻译文档，仅供人阅读。真实 agent 执行规则以 ../SKILL.md 为准。

# doc-feat-desc

## 元数据

- name: `doc-feat-desc`
- description: 当用户希望为已实现功能生成面向用户的文档时使用。先检查真实实现，然后在 `doc/{requirement-name}/` 下写入 help-center、site-copy 和 in-product docs。
- version: `0.1.0`

# Doc Feat Desc

为已经实现的功能生成三份面向用户的文档，并写入磁盘。

读取 [references/workspace-projects.md](../references/workspace-projects.md)，了解仓库定位和需求命名。  
读取 [references/doc-variants.md](../references/doc-variants.md)，了解结构、语气和质量检查。

## 使用场景

- 用户希望为真实功能、组件、页面、API 或模块生成文档。
- 需要全部三份输出：
  - `help-center-full.md`
  - `official-site-copy.md`
  - `in-product-short.md`
- 文档必须来自真实实现。
- 结果应保存到 `doc/<requirement-name>/`。

## 不使用场景

- 内部架构文档、ADR、迁移计划或仅开发者文档。
- 只基于 specs 生成 API reference。
- 为尚未存在的功能写猜测性文案。
- 一次性 README 编辑、release notes 或单个短段落。

## 核心规则

- 除非明确要求另一种语言，否则遵循用户语言。
- 三份文档使用同一种语言。
- 写作前读取实现。
- 不编造能力，也不隐藏不确定性。
- 使用真实产品标签、入口名称和术语。
- 保持文档面向用户且简洁。

## 工作流

1. 确定目标仓库、主题、需求名和输出语言。
2. 读取主要实现和足够的相邻代码或 UI 文案，以确认行为。
3. 如果文档已经存在，先读取并保留正确命名。
4. 如果 `doc/<requirement-name>/` 不存在，则创建它。
5. 创建或更新：
   - `help-center-full.md`
   - `official-site-copy.md`
   - `in-product-short.md`
6. 把三份 Markdown 文件写入 `doc/<requirement-name>/`。
7. 回复仓库、目录、文件路径和关键假设。

## 输出规则

- 除非用户明确要求，否则保持固定文件名。
- 不创建额外 README、notes、changelog 或 process 文件。
- 使用简单 Markdown 格式。
- 不把内部实现细节写成面向用户的语言。
