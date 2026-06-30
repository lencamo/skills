# Brand Asset Generator 输出说明

默认背景色为 `#ffffff`。除非传入 `--transparent-background`，下列带背景输出都会使用该背景色。

## 默认输出

```text
source/
  <name>-mark-app.png       # 透明，用于 app/desktop/maskable 图标源
  <name>-mark-web.png       # 透明，用于 web/favicon/tray 图标源

web/
  favicon-16x16.png         # 白底圆角，无外层透明边距
  favicon-32x32.png         # 白底圆角，无外层透明边距
  favicon-48x48.png         # 白底圆角，4% 外层透明边距
  favicon.png               # 白底圆角，6% 外层透明边距
  favicon.ico               # 白底圆角，多尺寸：16、32、48，无外层透明边距
  icon-192.png              # 白底圆角，8% 外层透明边距
  icon-512.png              # 白底圆角，8% 外层透明边距
  icon-192-maskable.png     # 白底方形，不裁圆角
  icon-512-maskable.png     # 白底方形，不裁圆角
  apple-touch-icon.png      # 白底方形，不裁圆角

desktop/
  icon.png                  # 白底方形
  icon.ico                  # 白底方形，多尺寸：16、24、32、48、64、128、256
  icon.icns                 # 白底方形
  icons/
    16x16.png               # 白底方形
    24x24.png               # 白底方形
    32x32.png               # 白底方形
    48x48.png               # 白底方形
    64x64.png               # 白底方形
    96x96.png               # 白底方形
    128x128.png             # 白底方形
    256x256.png             # 白底方形
    512x512.png             # 白底方形
    1024x1024.png           # 白底方形
  tray.ico                  # 透明，多尺寸：16、24、32、48、64、128、256
  tray.png                  # 透明
  trayTemplate.png          # 透明 template
  trayTemplate@2x.png       # 透明 template

preview.png                 # 预览图
```

## 默认规则

- `favicon*.png`、`favicon.ico` 默认白底圆角，因为浏览器和书签场景不保证自动裁圆角。
- 小尺寸 favicon 优先清晰：`favicon-16x16.png`、`favicon-32x32.png`、`favicon.ico` 默认不留外层透明边距。
- 大一点的 favicon 更接近 app icon 视觉：`favicon-48x48.png` 默认 `4%` 外层透明边距，`favicon.png` 默认 `6%` 外层透明边距。
- `icon-192.png`、`icon-512.png` 默认白底圆角，并保留 `8%` 外层透明边距，因为普通 PWA 图标不保证自动裁圆角。
- 有外层透明边距时，logo 会跟随白底圆角容器一起缩进，避免压到白底外。
- `icon-192-maskable.png`、`icon-512-maskable.png` 默认白底方形，交给支持 maskable icon 的平台裁切。
- `apple-touch-icon.png` 默认白底方形，交给 iOS/iPadOS 主屏幕图标机制处理形状。
- `desktop/icon.*` 和 `desktop/icons/*.png` 默认白底方形，优先保证桌面平台和安装器的多尺寸兼容性。
- `tray.*` 和 `trayTemplate*.png` 默认透明，适合系统托盘和 macOS template icon。
- `source/*` 默认透明，作为后续图标生成的中间源图。

## 可调参数

- `--background "#rrggbb"`：设置默认背景色，默认 `#ffffff`。
- `--favicon-corner-radius <0..0.5>`：设置 favicon 圆角比例，默认 `0.18`。
- `--web-corner-radius <0..0.5>`：设置普通 PWA 图标圆角比例，默认 `0.22`。
- `--favicon-container-inset <0..0.4>`：覆盖 favicon PNG 的外层透明边距；不传时按尺寸使用默认值。
- `--web-container-inset <0..0.4>`：设置普通 PWA 图标外层透明边距，默认 `0.08`。
- `--force-background`：强制给通常透明的输出也加背景。
- `--transparent-background`：所有输出尽量保持透明，覆盖默认背景规则。
