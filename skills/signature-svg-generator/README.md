# Signature SVG Generator 输出说明

该 skill 基于真实字体文件生成签名风格 SVG 和 Vue 组件。输出目录始终是目标项目根目录下的 `signatures/<签名文本slug>/`，并保持扁平结构。

## 默认输出

以 `Ting Note`、`id=tingnote-caveat`、`component=TingNoteSignatureCaveat` 为例：

```text
signatures/
└── ting-note/
    ├── tingnote-caveat.svg                    # 静态 SVG，原始字体轮廓
    ├── tingnote-caveat.animated.svg           # 动画 SVG，原始字体轮廓
    ├── tingnote-caveat.bold.svg               # 静态 SVG，加粗轮廓
    ├── tingnote-caveat.animated.bold.svg      # 动画 SVG，加粗轮廓
    ├── TingNoteSignatureCaveat.vue            # 静态 Vue 组件，原始字体轮廓
    ├── TingNoteSignatureCaveatAnimated.vue    # 动画 Vue 组件，原始字体轮廓
    ├── TingNoteSignatureCaveatBold.vue        # 静态 Vue 组件，加粗轮廓
    ├── TingNoteSignatureCaveatAnimatedBold.vue # 动画 Vue 组件，加粗轮廓
    ├── TingNoteSignatureCaveatStrokeGuide.vue # 手写路径参考 Vue 组件
    ├── tingnote-caveat.stroke-guide.svg       # 手写路径参考 SVG
    └── tingnote-caveat.strokes.template.json  # 无 handwritingStrokes 时生成的模板
```

## 默认规则

- 静态 SVG、动画 SVG、Vue 组件和 stroke guide 使用同一份字体 path 数据。
- SVG 文件和 Vue 组件使用一致的根节点 `width`、`height` 和 `viewBox`。
- 未传 `width` 和 `height` 时，显示尺寸来自生成后的 `viewBox`。
- 只传 `width` 或只传 `height` 时，另一边按 `viewBox` 比例自动推导。
- 同时传 `width` 和 `height` 时，所有 SVG/Vue 产物都使用这两个显示尺寸。
- 普通产物只使用 `fill="currentColor"`，保持字体原始轮廓粗细。
- bold 产物在同一份 path 上增加 `stroke="currentColor"`、`stroke-width` 和 `paint-order="stroke fill"`，用于视觉加粗。
- 动画产物始终保留最终完整轮廓层；没有 `handwritingStrokes` 时使用 `fallback-wipe` 预览。
- `stroke-guide` 产物只用于绘制或校对手写中心线，不作为最终签名组件使用。
- 输出目录不复制字体文件、license 文件，也不创建 `fonts/`、`generated/`、`components/` 或 `authoring/` 子目录。

## 可调参数

- `--text "<text>"`：签名文本，必填。
- `--font-name <name>`：字体名，会按项目字体、内置字体、Google Fonts 顺序解析。
- `--font <file>`：显式使用本地 `.ttf` 或 `.otf` 字体文件。
- `--id <id>`：输出 SVG 文件名前缀。
- `--component-name <PascalCase>`：输出 Vue 组件名前缀。
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
