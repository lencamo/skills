> 中文翻译文档，仅供人阅读。真实 agent 执行规则以 ../SKILL.md 为准。

# draft-to-project

## 元数据

- name: `draft-to-project`
- description: 把截图、HTML 草稿、本地 `file://` 原型页或 mockup 等 UI 草稿转换成既有项目中的前端页面。复用既有组件和样式，并在用户未要求重新设计时，让提供的布局结构尽量贴近源草稿。
- version: `0.2.0`

# Draft to Project

把 UI 草稿转换成适配当前项目的前端页面。

## 使用场景

- 用户提供截图或 HTML mockup，并希望实现它。
- 用户提供本地 `file://...html` 草稿或原型页，并希望基于它生成真实项目页面。
- 用户希望页面复用既有项目组件。
- 用户希望页面遵循项目颜色、间距、表格、表单和 modal 风格。

## 不使用场景

- 纯后端任务。
- 文案或文档工作。
- 用户明确希望新的设计系统。
- 用户要求完整重新设计，而不是实现提供的草稿。

## 核心规则

**不要重新发明项目 UI**。写任何代码之前：

1. 找到与 mockup 元素匹配的既有组件（按钮、输入框、表格、卡片、modal）。
2. 匹配项目颜色、spacing tokens、排版和 border radius。
3. 复用既有表格、表单和 modal 模式。
4. 只有当没有既有组件或局部模式适合时，才编写新样式。

## 布局约束

当用户提供截图、HTML 草稿或本地 `file://` 页面时，默认把它当成布局基线。

- 除非用户明确要求重新设计，否则保留草稿结构。
- 可把视觉风格适配到项目，但不要添加会实质改变页面结构的额外 summary block、wrapper 或控制区域，除非用户要求。
- 为既有组件约束、响应式行为和可访问性做必要调整。

## 工作流

1. 分析截图/HTML：同时识别 UI 元素和固定布局结构。
2. 在项目中搜索与每种元素类型匹配的既有组件。
3. 对每个元素：
   - 如果找到：直接复用。
   - 如果相似但需要调整：最小化扩展。
   - 如果未找到：检查附近模式是否可以适配。
4. 应用项目样式 token：颜色、间距、排版、圆角。
5. 使用最少的新样式实现。
6. 完成前验证：没有重复样式，所有组件都存在于项目中，已实现布局仍匹配草稿结构，并且可用检查通过。

## 样式匹配清单

根据既有项目模式检查：

- **颜色**：可用时使用既有 color tokens；避免一次性硬编码颜色。
- **间距**：匹配既有 padding/margin 值（8px、12px、16px、24px...）。
- **排版**：使用既有字号和字重。
- **按钮**：匹配按钮变体（primary、secondary、ghost、danger）。
- **输入框**：匹配表单输入样式和校验反馈。
- **表格**：匹配表头/表体/行样式。
- **卡片**：匹配 card padding、border、shadow 模式。
- **Modal/Popup**：匹配 modal wrapper、backdrop、header、footer 样式。

## 输出

在非平凡实现前，说明：

- 将复用哪些既有组件（带文件路径）。
- 将对齐哪些项目样式 token。
- 是否需要任何新组件或样式，以及原因。

示例：

```text
复用：
- Button: src/components/ui/button.tsx（primary 变体）
- Input: src/components/ui/input.tsx
- Table: src/components/data-table.tsx
- Card: src/components/ui/card.tsx

样式对齐：
- 颜色：使用 src/styles/variables.css 中的项目 tokens
- 间距：16px padding（匹配既有 cards）
- 排版：14px 正文，16px 标题（匹配项目）

新样式：无，所有元素都由既有组件覆盖
```
