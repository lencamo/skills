# Signature SVG Generator 输出说明

该 skill 基于真实字体文件生成签名风格 SVG、Vue 组件和 React 组件。默认输出目录是目标项目根目录下的 `signatures/<签名文本slug>/`；传入 `--output-dir <dir>` 时，输出到 `<dir>/<签名文本slug>/`。输出目录保持扁平结构。

## 默认输出（未提供 handwritingStrokes）

以 `Avery Stone`、`id=avery-stone-caveat`、`component=AveryStoneSignatureCaveat` 为例：

```text
signatures/
└── avery-stone/
    ├── avery-stone-caveat.svg                     # 静态 SVG，原始字体轮廓
    ├── avery-stone-caveat.animated.svg            # fallback-wipe 动画 SVG
    ├── avery-stone-caveat.bold.svg                # 静态 SVG，加粗轮廓
    ├── avery-stone-caveat.animated.bold.svg       # fallback-wipe 动画 SVG，加粗轮廓
    ├── AveryStoneSignatureCaveat.vue              # 静态 Vue 组件，原始字体轮廓
    ├── AveryStoneSignatureCaveatAnimated.vue      # fallback-wipe 动画 Vue 组件
    ├── AveryStoneSignatureCaveatBold.vue          # 静态 Vue 组件，加粗轮廓
    ├── AveryStoneSignatureCaveatAnimatedBold.vue  # fallback-wipe 动画 Vue 组件，加粗轮廓
    ├── AveryStoneSignatureCaveatStrokeGuide.vue   # 手写路径参考 Vue 组件
    ├── AveryStoneSignatureCaveat.tsx              # 静态 React 组件，原始字体轮廓
    ├── AveryStoneSignatureCaveatAnimated.tsx      # fallback-wipe 动画 React 组件
    ├── AveryStoneSignatureCaveatBold.tsx          # 静态 React 组件，加粗轮廓
    ├── AveryStoneSignatureCaveatAnimatedBold.tsx  # fallback-wipe 动画 React 组件，加粗轮廓
    ├── AveryStoneSignatureCaveatStrokeGuide.tsx   # 手写路径参考 React 组件
    ├── avery-stone-caveat.stroke-guide.svg        # 手写路径参考 SVG
    ├── avery-stone-caveat.stroke-author.html      # 手写中心线绘制页面
    └── avery-stone-caveat.strokes.template.json   # handwritingStrokes 模板
```

## 提供 handwritingStrokes 后的额外输出

`*.animated.*`、`*Animated*.vue` 和 `*Animated*.tsx` 始终保留为 `fallback-wipe` 预览。提供 `handwritingStrokes` 后，脚本会额外生成真正按手写中心线播放的 `Handwriting` 产物：

```text
signatures/
└── avery-stone/
    ├── avery-stone-caveat.handwriting.svg
    ├── avery-stone-caveat.handwriting.bold.svg
    ├── AveryStoneSignatureCaveatHandwriting.vue
    ├── AveryStoneSignatureCaveatHandwritingBold.vue
    ├── AveryStoneSignatureCaveatHandwriting.tsx
    └── AveryStoneSignatureCaveatHandwritingBold.tsx
```

## 默认规则

- 静态 SVG、动画 SVG、Vue 组件、React 组件和 stroke guide 使用同一份字体 path 数据。
- SVG 文件、Vue 组件和 React 组件使用一致的根节点 `width`、`height` 和 `viewBox`。
- 未传 `width` 和 `height` 时，显示尺寸来自生成后的 `viewBox`。
- 只传 `width` 或只传 `height` 时，另一边按 `viewBox` 比例自动推导。
- 同时传 `width` 和 `height` 时，所有 SVG/Vue/React 产物都使用这两个显示尺寸。
- 普通产物只使用 `fill="currentColor"`，保持字体原始轮廓粗细。
- bold 产物在同一份 path 上增加 `stroke="currentColor"`、`stroke-width` 和 `paint-order="stroke fill"`，用于视觉加粗。
- `Animated` 产物始终是 `fallback-wipe` 预览；真正手写动画使用 `Handwriting` 产物。
- 没有 `handwritingStrokes` 时不生成 `Handwriting` 产物，只生成模板和 `fallback-wipe` 预览。
- `stroke-guide` 产物只用于绘制或校对手写中心线，不作为最终签名组件使用。
- `stroke-author.html` 用于在浏览器里描中心线并导出 `handwritingStrokes`。
- 输出目录不复制字体文件、license 文件，也不创建 `fonts/`、`generated/`、`components/` 或 `authoring/` 子目录。

## 可调参数

- `--text "<text>"`：签名文本，必填。
- `--font-name <name>`：字体名，会按项目字体、内置字体、Google Fonts 顺序解析。
- `--font <file>`：显式使用本地 `.ttf` 或 `.otf` 字体文件。
- `--output-dir <dir>`：覆盖输出父目录，实际输出到 `<dir>/<签名文本slug>/`。
- `--id <id>`：输出 SVG 文件名前缀。
- `--component-name <PascalCase>`：输出 Vue/React 组件名前缀。
- `--label <label>`：写入 SVG title 的字体或变体标签。
- `--width <number>`：显示宽度；只传宽度时高度按比例推导。
- `--height <number>`：显示高度；只传高度时宽度按比例推导。
- `--font-size <number>`：生成字体轮廓 path 时使用的字号。
- `--bold-stroke-width <number>`：bold 产物的同色描边宽度，默认 `1.4`。
- `--animation-duration-ms <ms>`：固定 fallback 或自动手写动画总时长。
- `--config <file>`：使用 JSON 批量生成多个变体。
- `--list-fonts`：列出可用项目字体、已有候选组件和内置字体。

## 参数关系

- `fontSize` 改变生成 path 的自然尺寸和字体轮廓。
- `width` / `height` 改变最终显示尺寸，不改变 path 数据。
- `boldStrokeWidth` 只影响 bold 产物的视觉加粗，不改变普通产物。
- `handwritingStrokes[].strokeWidth` 只影响手写 mask 的揭示路径，不改变最终字体轮廓。
- `animationDurationMs` / `--animation-duration-ms` 只用于固定 fallback 或自动手写动画总时长。

## 手写动画流程

1. 先不提供 `handwritingStrokes` 生成一次。
2. 打开 `<输出目录>/<id>.stroke-author.html`；默认是 `signatures/<签名文本slug>/<id>.stroke-author.html`。
3. 按自然书写顺序描中心线，每次按下和抬起会生成一条 stroke。
4. 点击 `Copy for Agent`，把复制内容交回给 agent。
5. agent 将 `handwritingStrokes` 合并到同一签名配置后重新生成。
6. 最终使用 `*.handwriting.svg`、`*.handwriting.bold.svg`、`*Handwriting.vue`、`*HandwritingBold.vue`、`*Handwriting.tsx` 或 `*HandwritingBold.tsx`。
