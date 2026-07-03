---
name: amo-review
description: Use when the user asks to review implemented code for code style, redundancy, unnecessary abstractions, wrappers, helpers, adapters, parsers, type guards, TypeScript type noise, or composable usage clarity. Do not use for solution design, bug diagnosis, refactor planning, or commit messages.
metadata:
  version: '0.1.0'
---

# Amo Review

Review implemented code for style, redundancy, unnecessary abstraction, and TypeScript type clarity.

## Shared Output Marker

Prefix the first output line inline with `🧹 [amo-review]`. Do not put the marker in a separate paragraph.

## Use When

- The user asks for code style review, redundancy review, or cleanup suggestions.
- The code has already been implemented or a diff/file is available to review.
- The review should focus on unnecessary abstractions, TypeScript type noise, composable usage clarity, or maintainability issues.

## Do Not Use

- No implementation exists yet; use `amo-feature`, `amo-improve`, `amo-fix`, or `amo-refactor`.
- A proposal needs best-solution pressure testing; use `amo-best`.
- The user asks for bug root-cause analysis; use `amo-fix`.
- The user asks for commit message generation.

## Workflow

1. Inspect the real code or diff before judging.
2. Identify only issues with concrete maintenance, readability, type-safety, or behavior-source impact.
3. Prefer fewer, higher-confidence findings over broad style opinions.
4. Separate must-fix issues from optional cleanup.
5. Provide exact file/line references when available.

## 代码规范

- 禁止为单一调用点、单行逻辑创建或保留 helper / wrapper / adapter / parser / 类型守卫等中间抽象；移动代码位置、提升作用域、导出 API 或重构后也必须按调用点重新审查，除非它显著提升错误边界、可测试性或可读性，否则直接内联表达。
- 使用 composable 返回值时，展示用的 ref/computed 变量可以按需解构；会触发状态变更或副作用的函数默认保留 composable 命名空间调用，以保持行为来源清晰。

## TypeScript 类型约定

- 优先依赖 TS 推断，避免为中间变量、内部函数和简单返回值补冗余类型。
- 公共边界显式声明类型：DTO、组件 props、导出函数入参、公共协议、请求 payload、响应 data 结构。
- 不重复表达已由泛型或封装确定的类型，例如业务 API、Controller、Store 不手写 `Promise<ApiResponse<T>>`、`Promise<ApiResult<T>>`。
- 第三方库或工厂函数已能可靠推导的返回类型，不手写复杂泛型重复描述；需要复用时优先使用 `ReturnType<typeof fn>` 等简单工具类型。
- 类型设计保持简单，优先使用直接的 `interface` / `type`；避免为了少量代码引入复杂泛型、条件类型、映射类型或过度抽象。
- 不为了“语义化命名”“未来扩展”或“通用化”添加没有当前收益的别名、包装函数、动态 key 解析器或中间抽象；自己维护且结构明确的代码优先直接访问和直接调用，让类型和值的来源保持单一、可追踪。
- TypeScript 类型收窄优先用直接表达和已有数据结构完成；不要为了收窄新增只被一个地方使用的类型守卫函数。只有当判断逻辑复杂、被多处复用、或作为公共边界 API 时，才允许提取类型守卫。
- 共享类型按需抽取：只有多个 app/package 稳定复用同一批类型时，才考虑新增共享类型包。

## Key Rules

- Do not ask for abstraction removal unless the abstraction is single-use, redundant, misleading, or hiding behavior source.
- Do not demand explicit types where TypeScript inference is already clear and local.
- Do not rewrite style preferences into findings unless they improve maintainability or correctness.
- Do not propose large refactors from a style review; if the issue is architectural, say it belongs in `amo-refactor`.

## Output

```text
🧹 [amo-review] 当前场景：代码风格审查
结论：
必须修改：
建议清理：
无需修改：
验证方式：
```
