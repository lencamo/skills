> 中文翻译文档，仅供人阅读。真实 agent 执行规则以 ../SKILL.md 为准。

# split-pencil-file

## 元数据

- name: `split-pencil-file`
- description: 把导入后的 Pencil `.pen` 设计文件拆成每个顶层 Frame 一个目录，包括通过节点 ID 精确拆分当前 Pencil 选择，每个目录包含 `index.pen` 和该 Frame 引用的本地图片资产。
- version: `0.2.0`

# Split Pencil File

把大型 Pencil `.pen` 文件拆分为可复用的逐 Frame 目录。

## 使用场景

- `.fig` 文件已经导入 Pencil，并保存为一个大型 `.pen`。
- 用户希望每个顶层 Layer/Frame 都成为单独的 Pencil 文件。
- 用户希望精确拆分当前 Pencil 选择。
- 用户描述选中的模块、选中的区域或选中的范围，并期望精确拆分这些被选中的 Pencil 节点。
- 期望输出是：
  - `output-dir/<frame-name>/index.pen`
  - 复制到该 `index.pen` 旁边的本地图片资产
- 用户希望重复的 `Container` 或重复名称保留为带编号的文件夹。

## 不使用场景

- 编辑视觉设计本身。
- 拆分每个嵌套文本、图标、按钮或子图层。
- 源 Figma 文件尚未导入 Pencil。
- 用户需要在 Figma 中确认多页面 Figma 导入行为，而不是在 `.pen` 文件中确认。

## 核心规则

- 拆分前确认真实 `.pen` 结构。不要假设 Page 或 Frame 结构。
- 默认只拆分顶层 `frame` 节点。
- 如果用户说“当前选择”、“选中的模块”、“选中的区域”或“选中的范围”，先使用 Pencil MCP `get_editor_state`，并把选中的 frame ids 传给 `--node-ids`。
- 不要把当前 Pencil 选择转换成矩形边界。Pencil 选择可以包含多个独立 frame；按 node id 拆分才能保持精确选择意图。
- 跳过非 frame 的顶层节点，例如背景矩形和注释组，除非用户明确要求。
- 原样保留每个 frame 节点；不要重写 child layout、样式、文本、图片引用、ids 或坐标。
- 为本地文件系统清理文件夹名，并对重复名称追加 `-2`、`-3` 等。
- 只把每个 frame 引用的本地图片文件复制进该 frame 文件夹。
- 如果 `.pen` 包含多个页面，按精确名称或索引选择请求的页面后再拆分。如果目标页面不清晰，先询问。

## 脚本

使用内置脚本进行确定性拆分：

```bash
node skills/split-pencil-file/scripts/split-pencil-file.js \
  --input dev_design/source.pen \
  --output-dir dev_design \
  --node-ids frameA,frameB \
  --force
```

常用选项：

- `--input <file>`：必填源 `.pen`。
- `--output-dir <dir>`：输出根目录；默认是源文件目录。
- `--page <name-or-index>`：当 `.pen` 有顶层 `pages` 数组时的目标页面。
- `--node-ids <id,id>`：只拆分 ID 在这个逗号分隔列表里的顶层 frame；输出顺序遵循 ID 顺序。
- `--force`：覆盖既有生成的 frame 文件夹。
- `--try-run`：打印计划，不写文件。

### 当前 Pencil 选择

当用户要求拆分当前 Pencil 选择时：

1. 对活动编辑器使用 Pencil MCP `get_editor_state`。
2. 确认活动编辑器文件与请求的 `.pen` 路径匹配。
3. 从 `Selected Elements` 读取选中元素 IDs。
4. 把顶层选中 frame ids 传给 `--node-ids`。
5. 如果选择包含嵌套子节点或非 frame 节点，使用 `batch_get` 或 `jq` 检查；除非用户明确要求，否则只拆分顶层 frame。

示例：

```bash
node skills/split-pencil-file/scripts/split-pencil-file.js \
  --input dev_design/source.pen \
  --output-dir dev_design/selected \
  --node-ids rRd0Z,zVChy \
  --try-run
```

## 工作流

1. 检查源文件：

   ```bash
   jq -r 'keys_unsorted[]' <source.pen>
   jq -r '.children | to_entries[] | "\(.key)\t\(.value.type)\t\(.value.id)\t\(.value.name // "")"' <source.pen>
   ```

2. 如果文件有 `pages`，检查页面并明确选择目标页面：

   ```bash
   jq -r '.pages | to_entries[] | "\(.key)\t\(.value.name // "")\t\((.value.children // []) | length)"' <source.pen>
   ```

3. 对当前 Pencil 选择，使用 Pencil MCP 读取 selected ids，并带 `--node-ids` 运行。
4. 如果输出结构或数量不确定，先使用 `--try-run` 运行脚本。
5. 真正运行脚本。
6. 验证：
   - 生成文件夹数量等于选中的顶层 frames 数量
   - 每个文件夹都有 `index.pen`
   - 每个 `index.pen` 都能作为 JSON 解析，并包含一个顶层 frame
   - 本地图片引用存在于对应 `index.pen` 旁边
7. 报告：
   - 输出根目录
   - 生成 frame 数量
   - 如果使用了 selected node ids，报告它们
   - 被跳过的非 frame 顶层节点
   - manifest 路径
   - 任何已复制的图片资产

## 输出

脚本写入：

```text
<output-dir>/
  <frame-name>/
    index.pen
    image-import.png
  <frame-name-2>/
    index.pen
  frame-split-manifest.json
```

manifest 记录 selected node ids、原始 frame names、ids、输出目录、`index.pen` 路径、复制的图片、过滤后的 frames 和跳过的顶层节点。
