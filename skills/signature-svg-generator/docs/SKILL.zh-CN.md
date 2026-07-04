> 中文翻译文档，仅供人阅读。真实 agent 执行规则以 ../SKILL.md 为准。

# signature-svg-generator

## 元数据

- name: `signature-svg-generator`
- description: 当需要从字体文件生成可复用的签名风格 SVG 资产或 Vue 组件时使用，包括个人签名、手写 wordmark、字体生成的 SVG paths，或基于 mask 的手写动画。只在用户想要基于字体的输出时使用，不用于通用 logo 设计。
- version: `0.3.0`

# Signature SVG Generator

## 目的

从真实字体文件生成可复用的签名风格 SVG 和 Vue 组件资产。使用内置脚本作为字体解析、SVG 输出和 Vue 组件输出的事实来源。

## 不使用场景

- 不用于手绘定制 logo，除非用户明确想把字体生成的 SVG paths 作为起点。
- 不要把字体文件复制进运行时应用目录。
- 除非用户要求，否则不要创建产品化字体选择器或预览 UI。

## 必要输入

生成前需要这些输入：

1. 签名文本，例如 `Avery Stone` 或 `Mira Chen`。
2. 字体输入，使用以下方式之一：
   - 内置字体名，例如 `Caveat`
   - 本地 `.ttf` 或 `.otf` 路径
   - 用于下载的 Google Fonts family 名称

不要编造缺失的必要输入。如果缺少多个必要输入，在一次回复中询问所有缺失输入。

## 缺失输入处理

使用用户的语言回复。

如果用户只提供签名文本，说明仍然需要字体输入。展示支持的字体输入方式，并在可能时运行 `--list-fonts` 展示真实内置字体列表。

如果用户提供文本但没有字体，展示支持的字体输入方式，并在可能时运行 `--list-fonts` 展示真实内置字体列表。

如果所有必要输入都可用，立即生成。

询问缺失输入时，回复保持简短：确认已提供的输入，只列出缺失输入，展示支持的字体输入方式，并包含一个具体示例。

## 内置字体

内置字体文件位于 `assets/fonts/`。字体别名按文件名 token 匹配，因此 `Caveat` 会解析为 `Caveat[wght].ttf`，`Sacramento` 会解析为 `Sacramento-Regular.ttf`。

使用脚本列出项目字体、已有生成候选和内置字体：

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs --list-fonts
```

为 `<skill-dir>` 使用真实 skill 目录，例如 `skills/signature-svg-generator`。

如果一个字体名匹配多个文件，使用列出的精确字体名重新运行，不要猜测。

## 字体解析

按以下顺序解析字体：

1. `--font <file>`：使用显式本地字体路径，不把它复制进输出。
2. `--font-name <name>`：从项目根目录下的 `signatures/fonts` 搜索旧项目字体，以保持向后兼容。
3. 搜索 `<skill-dir>/assets/fonts` 中的内置字体。
4. 如果仍然缺失，把请求的 family 从 Google Fonts 下载到 OS 临时缓存。

不要因为商业状态未知就阻塞生成。生成后始终报告状态。如果需要 Google Fonts 下载，必须有网络访问。

## 生成一个签名

从目标项目根目录运行：

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs \
  --text "Avery Stone" \
  --font-name Sacramento \
  --id avery-stone-sacramento \
  --component-name AveryStoneSignatureSacramento \
  --label Sacramento \
  --width 106 \
  --height 27 \
  --font-size 52 \
  --bold-stroke-width 1.4
```

对于显式本地字体路径，使用 `--font <file>` 代替 `--font-name <name>`。

生成的 SVG 文件和 Vue 组件使用相同的 root `width`、`height` 和 `viewBox`。如果省略 `width` 和 `height`，显示尺寸从生成的 `viewBox` 推导。如果只提供一个尺寸，另一个尺寸从 `viewBox` 按比例推导。如果两个尺寸都提供，SVG 和 Vue 产物都使用这些精确显示尺寸。

`fontSize` 控制生成的字体轮廓 path。旧的 `strokeWidth` / `--stroke-width` 输入不会改变静态 glyph 厚度；手写 mask strokes 应在 `handwritingStrokes` 内指定自己的 `strokeWidth`。

脚本也会输出加粗 SVG 和 Vue 产物。加粗产物使用相同字体轮廓 path，并添加同色 outline stroke。`boldStrokeWidth` / `--bold-stroke-width` 控制该 outline stroke，默认是 `1.4`。

## 批量生成

生成或比较多个变体时使用 JSON config：

```json
{
  "text": "Avery Stone",
  "variants": [
    {
      "id": "avery-stone-sacramento",
      "label": "Sacramento",
      "component": "AveryStoneSignatureSacramento",
      "fontName": "Sacramento",
      "width": 106,
      "height": 27,
      "fontSize": 52,
      "boldStrokeWidth": 1.4,
      "handwritingStrokes": []
    }
  ]
}
```

运行：

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs --config signature-batch.json
```

## 手写动画

脚本始终输出静态和动画产物。旧的 `handwritingAnimation` flag 仍被接受，但不再必需。

```bash
node <skill-dir>/scripts/generate_signature_svgs.mjs \
  --text "Mira Chen" \
  --font-name Caveat \
  --id mira-chen-caveat \
  --component-name MiraChenSignatureCaveat
```

生成输出始终包含 static SVG、fallback-wipe animated SVG、bold SVG、fallback-wipe animated bold SVG、static Vue component、fallback-wipe animated Vue component、bold Vue component、fallback-wipe animated bold Vue component、stroke guide SVG 和 stroke guide Vue component。

最佳质量的签名回放需要 `handwritingStrokes`：按人类书写顺序绘制的 centerline paths。脚本把这些 strokes 用作 `Handwriting` 输出的 mask timeline。

脚本始终在生成资产旁边写入 flat stroke guide SVG 和匹配的 Vue component。脚本也会在生成资产旁边写入 flat stroke authoring HTML page。在浏览器中打开 `<id>.stroke-author.html`，即可直接在 guide 上绘制 centerline strokes，并导出 `handwritingStrokes` JSON。authoring page 使用独立编辑比例，默认 4x，因此小尺寸生产签名更容易描摹，而且不会改变导出的 SVG/Vue 尺寸或 stroke 坐标。对话式使用时，告诉用户绘制后点击 `Copy for Agent`，并把复制的消息粘回聊天。用户不需要知道 batch config 在哪里，也不需要手动合并 `handwritingStrokes`。

即使提供了真实 strokes，`*.animated.svg`、`*.animated.bold.svg`、`*Animated.vue` 和 `*AnimatedBold.vue` 文件仍保留给 fallback-wipe 预览，并保持 `data-handwriting-mode="fallback-wipe"`。

当提供 `handwritingStrokes` 时，脚本会额外写入 `*.handwriting.svg`、`*.handwriting.bold.svg`、`*Handwriting.vue` 和 `*HandwritingBold.vue`，作为真正的 stroke-timeline 动画输出。最终生产签名回放应使用这些 `Handwriting` 产物。

`Handwriting` 输出有意不添加最终未遮罩的 outline 层。动画结束时保持 stroke mask 结果，因此不会从较细的 mask-revealed 形状闪变为完整 glyph outline。fallback-wipe `Animated` 输出保留其最终 outline 层。

没有 `handwritingStrokes` 时，脚本只写入 fallback-wipe animated 产物，并同时写入 flat stroke template。

字体轮廓不包含真实笔画顺序。若要从头到尾真实回放签名，绘制或提供 `handwritingStrokes`。旧的 `handwritingPaths` 字段作为别名被接受，但优先使用 `handwritingStrokes`。

把 `fallback-wipe` 当成视觉占位，而不是真实手写。真实签名动作需要提供 `handwritingStrokes`。

stroke timing 默认按 path length 自动计算，除非 stroke 提供 `durationMs` 或 `delayMs`。只有当用户要求固定 fallback 总时长时，才使用 `--animation-duration-ms <ms>` 或 `animationDurationMs`。

对于 `stroke-timeline` 输出，每个 mask stroke 必须使用带小保护长度的 path-length dashoffset timeline：`stroke-dasharray="<length> <length>"`、`stroke-dashoffset="<length>"`，以及匹配的 `--path-length` style variable。不要用 `pathLength="1"` 或动画 `stroke-dasharray` 替代；那会改变渲染出来的签名行为。

为了高保真，在 config variant 上以数组形式提供 `handwritingStrokes`：

```json
{
  "text": "Mira Chen",
  "variants": [
    {
      "id": "mira-chen-caveat",
      "component": "MiraChenSignatureCaveat",
      "fontName": "Caveat",
      "handwritingStrokes": [
        {
          "d": "M17 15 C15.5 21 13.5 31 10.2 46",
          "strokeWidth": 8,
          "durationMs": 190,
          "delayMs": 0
        }
      ]
    }
  ]
}
```

推荐 authoring 工作流：

1. 先在没有 strokes 的情况下生成一次。
2. 打开 `signatures/<signature-text-slug>/<id>.stroke-author.html`。
3. 按自然书写顺序在 glyphs 上绘制 centerline strokes。每次 pointer down/up 手势都会成为一个 `handwritingStrokes` item。
4. 只把 author scale slider 用于编辑舒适度；它不会改变导出坐标。
5. 使用 stroke width slider，让 mask stroke 覆盖 glyph body，同时避免过早露出相邻 strokes。
6. 点击 `Copy for Agent`，并把复制的 handoff message 粘回对话。
7. agent 把包含的 `handwritingStrokes` 合并到匹配的签名 config，重新生成，并在保留 fallback-wipe `Animated` 文件的同时，验证新的 `Handwriting` SVG/Vue 动画。

只有在使用 Inkscape、Figma 或 Illustrator 等外部矢量工具 authoring 时，才使用 `stroke-guide.svg`。

## 输出契约

生成成功时，脚本会在 `signatures/` 下写入一个根据签名文本命名的 flat folder。例如，`Ting Note!` 会变成 `signatures/ting-note/`。

```text
signatures/
└── ting-note/
    ├── tingnote-caveat.svg
    ├── tingnote-caveat.animated.svg
    ├── tingnote-caveat.handwriting.svg
    ├── tingnote-caveat.bold.svg
    ├── tingnote-caveat.animated.bold.svg
    ├── tingnote-caveat.handwriting.bold.svg
    ├── TingNoteSignatureCaveat.vue
    ├── TingNoteSignatureCaveatAnimated.vue
    ├── TingNoteSignatureCaveatHandwriting.vue
    ├── TingNoteSignatureCaveatBold.vue
    ├── TingNoteSignatureCaveatAnimatedBold.vue
    ├── TingNoteSignatureCaveatHandwritingBold.vue
    ├── TingNoteSignatureCaveatStrokeGuide.vue
    ├── tingnote-caveat.stroke-guide.svg
    ├── tingnote-caveat.stroke-author.html
    └── tingnote-caveat.strokes.template.json
```

每个生成变体必须把以下内容保持在一起：

- static SVG
- fallback-wipe animated SVG
- 提供 `handwritingStrokes` 时的 handwriting SVG
- bold SVG
- fallback-wipe animated bold SVG
- 提供 `handwritingStrokes` 时的 handwriting bold SVG
- static Vue component
- fallback-wipe animated Vue component
- 提供 `handwritingStrokes` 时的 handwriting Vue component
- bold Vue component
- fallback-wipe animated bold Vue component
- 提供 `handwritingStrokes` 时的 handwriting bold Vue component
- stroke guide SVG
- stroke guide Vue component
- stroke authoring HTML
- 未提供 `handwritingStrokes` 时的 stroke template

不要把字体文件或 license 文件复制进输出文件夹。

## Vue 用法

用于比较时，把生成组件导入本地 preview UI，并通过 `<component :is="...">` 渲染。

最终生产使用时，只保留选定的 SVG/component 产物。除非用户要求产品化设置，否则不要创建全局字体选择器。

## 验证

声明完成前：

1. 确认预期的 static SVG、fallback-wipe animated SVG、bold SVG、fallback-wipe animated bold SVG、static Vue component、fallback-wipe animated Vue component、bold Vue component、fallback-wipe animated bold Vue component、stroke guide SVG、stroke guide Vue component 和 stroke authoring HTML 存在。提供 `handwritingStrokes` 时，还要确认 `Handwriting` SVG/Vue 产物存在。
2. 确认生成文件非空，并包含真实 SVG path data。
3. 确认 bold 产物包含同色 outline stroke styling，而 normal 产物不包含。
4. 确认 stroke authoring HTML 包含 guide path、author scale control，并能导出 `handwritingStrokes`。
5. 确认输出文件夹是 flat 的，并且不包含复制的 `fonts/`、`generated/`、`components/` 或 `authoring/` 子文件夹。
6. 报告使用的字体路径、来源（`explicit`、`project`、`bundled` 或 `downloaded`）、输出文件夹、商业使用状态，以及任何跳过的字体。把缺失本地字体 license 视为未知状态，而不是生成失败。

## 依赖

脚本使用内置的 `scripts/opentype.js`，来源为 `opentype.js@1.3.4`。它不会安装依赖、修改目标项目的 `package.json`，也不会假设目标项目使用特定包管理器。
