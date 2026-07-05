> 中文翻译文档，仅供人阅读。真实 agent 执行规则以 ../SKILL.md 为准。

# brand-asset-generator

## 元数据

- name: `brand-asset-generator`
- description: 当需要从用户提供的 logo、mark 或 icon 源图片生成或接入项目可用的品牌图片资产时使用，包括透明 source mark、favicon、PWA 图标、apple touch 图标、桌面应用图标、托盘图标、ICO 和 ICNS 输出。
- version: `0.1.3`

# Brand Asset Generator

从一个 logo、mark 或 icon 源图片生成可复用的图片资产包。

## 工作流

1. 确认源图片路径和预期输出目标。
2. 如果用户希望接入已有应用，先检查项目并识别预期的 public/static/icon 路径。
3. 使用内置脚本把资产生成到临时目录或显式输出目录。
4. 只有当用户要求集成，或项目明显已有匹配图标路径时，才把生成文件复制到应用路径。
5. 验证生成尺寸、透明/背景行为，以及任何已复制的项目引用。

## 使用场景

- 用户提供源图片，并希望生成项目可用的品牌或 logo 资产。
- 用户需要不同 padding 的透明 app/web source mark。
- 用户需要 favicon、PWA、apple touch、桌面应用、托盘、`.ico` 或 `.icns` 输出。
- 用户希望为不应保持透明的输出配置背景色。
- 用户希望把生成资产放入已有 web、PWA、Electron、Tauri 或桌面应用项目。

## 不使用场景

- 不用于从零设计新 logo。
- 检查目标项目前，不要假设项目特定输出路径。
- 除非用户要求集成或已有匹配路径，否则不要把生成文件复制进应用目录。
- 不要为了运行这个本地生成器而向目标项目添加图片处理依赖。

## 必要输入

需要：

- `--input <file>`：源图片路径。
- `--output-dir <dir>`：生成资产根目录。

当 source mark 需要稳定前缀时使用 `--name <name>`。如果省略，则从输入文件名派生。

## 脚本

运行内置脚本：

```bash
python3 <skill-dir>/scripts/generate_brand_assets.py \
  --input path/to/source.png \
  --output-dir path/to/output \
  --name brand \
  --profile all \
  --background "#ffffff"
```

选项：

- `--profile source|web|desktop|all`：选择输出组；默认是 `all`。
- `--background "#rrggbb"`：非透明输出的默认背景；默认是 `#ffffff`。
- `--web-fill <0..1>`：web source mark 的可见主体比例；默认是 `0.86`。
- `--app-fill <0..1>`：app/desktop source mark 的可见主体比例；默认是 `0.68`。
- `--favicon-corner-radius <0..0.5>`：favicon 输出的圆角背景半径比例；默认是 `0.18`。
- `--web-corner-radius <0..0.5>`：常规 PWA web 图标的圆角背景半径比例；默认是 `0.22`。
- `--favicon-container-inset <0..0.4>`：覆盖 favicon PNG 输出的透明外边距；默认按尺寸决定。
- `--web-container-inset <0..0.4>`：常规 PWA web 图标的透明外边距；默认是 `0.08`。
- `--line-width-ratio <0..0.2>`：fill 派生 line source mark 的描边粗细；默认是 `0.035`。
- `--background-threshold <n>`：RGB 边缘背景移除容差；默认是 `28`。
- `--force-background`：对所有生成的 PNG 和 ICO/ICNS 输出应用背景。
- `--transparent-background`：即使通常会使用默认背景，也保持输出透明。

如果缺少 Pillow，在当前 Python 环境中安装：

```bash
python3 -m pip install --user pillow
```

## 项目放置

把生成资产接入项目时，优先遵循既有约定，而不是创建新路径：

- Web/static 应用：把 favicons 和 PWA 图标放入已配置的 public/static 根目录，常见为 `public/`、`static/` 或应用特定资产目录。
- Next.js/App Router：添加文件前检查 `app/icon.*`、`app/apple-icon.*`、`public/` 和 metadata 配置。
- Vite/React/Vue/Svelte 应用：替换 favicon 前检查 `public/`、`index.html` 和任何 manifest 文件。
- PWA 项目：只有当图标路径需要变更时，才更新既有 `manifest.json` 或 `site.webmanifest`。
- Electron/Tauri/桌面项目：复制 `desktop/icon.*` 或托盘图片前检查 builder 配置中的图标路径。

如果没有既有约定，且用户没有要求直接集成，报告生成输出目录，而不是自行选择应用路径。

## 输出契约

脚本写入：

```text
<output-dir>/
  source/
    <name>-mark-app.png
    <name>-mark-web.png
    <name>-mark-app-line.png    # 仅当输入源被检测为 fill 时生成
    <name>-mark-web-line.png    # 仅当输入源被检测为 fill 时生成
  web/
    favicon-16x16.png
    favicon-32x32.png
    favicon-48x48.png
    favicon.png
    favicon.ico
    icon-192.png
    icon-512.png
    icon-192-maskable.png
    icon-512-maskable.png
    apple-touch-icon.png
  desktop/
    icon.icns
    icon.ico
    icon.png
    icons/
      16x16.png
      24x24.png
      32x32.png
      48x48.png
      64x64.png
      96x96.png
      128x128.png
      256x256.png
      512x512.png
      1024x1024.png
    tray.ico
    tray.png
    trayTemplate.png
    trayTemplate@2x.png
  preview.png
```

## 生成规则

- 对 RGB 源图只移除与边缘连通的背景；保留同色内部细节。
- 输入已经有透明度时，保留既有 alpha。
- source mark 写为 512x512 RGBA 透明 PNG。
- 当源主体被检测为 fill mark 时，同时写入 512x512 RGBA 透明 line 变体：`mark-app-line` 和 `mark-web-line`。
- 使用 `--line-width-ratio` 控制 fill 派生 line 的粗细；该值会乘以裁剪后源主体的最长边。
- 不为 line mark 输入创建 fill 变体。
- favicon、常规 PWA 图标和托盘图标使用 `mark-web`。
- apple touch、maskable PWA 图标、桌面应用图标、`.ico` 和 `.icns` 使用 `mark-app`。
- 默认给 web favicon、常规 PWA 图标、maskable PWA 图标、`apple-touch-icon.png`、`desktop/icon.png`、`desktop/icons/*.png`、`desktop/icon.ico` 和 `desktop/icon.icns` 添加背景。
- 默认给 web favicon 输出和常规 PWA 图标应用圆角背景，因为这些上下文不会一致地自动遮罩图标。
- 默认给较大的圆角 web PNG 添加透明外边距：`favicon-48x48.png` 使用 `0.04`，`favicon.png` 使用 `0.06`，常规 PWA 图标使用 `0.08`；`favicon-16x16.png`、`favicon-32x32.png` 和 `favicon.ico` 不使用外边距，以保持小尺寸清晰度。
- `apple-touch-icon.png`、maskable PWA 图标和桌面应用图标保持完整方形背景，因为这些上下文可能应用平台遮罩，或需要完整图标资源。
- 托盘图标和 source mark 默认保持透明。
- 创建 macOS 托盘模板图片为带透明 alpha 的黑色 template PNG。

## 验证

生成后验证：

- source mark 是 `RGBA`、512x512，并且角落透明。
- fill mark 输入会额外生成 `mark-app-line` 和 `mark-web-line`；line mark 输入不会生成。
- web PNG 尺寸与文件名匹配。
- web favicon 输出和常规 PWA 图标默认有透明圆角和预期外边距。
- maskable PWA 图标和 `apple-touch-icon.png` 默认有不透明背景角。
- `favicon.ico` 包含 16x16、32x32 和 48x48。
- desktop PNG 尺寸与文件名匹配。
- `icon.ico` 和 `tray.ico` 包含 16、24、32、48、64、128 和 256 尺寸。
- 方形默认背景输出的角落使用请求的背景色。
- `preview.png` 存在。

报告输出目录、生成组、关键文件和验证摘要。
