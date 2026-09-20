# ZCode Skills Sync（中文说明）

> 本文件是 [SKILL.md](../SKILL.md) 的忠实中文翻译，供人阅读，不是可执行的 skill 文件。

CC Switch 没有 ZCode 导入目标，这个 skill 就是两者的桥：它把 `~/.zcode/skills`
重建为指向 `~/.cc-switch/skills` 的符号链接。

## 触发策略（仅手动）

这个 skill 绝不能被自动触发。

- 只在显式点名时运行：`$zcode-skills-sync`，或用户说"运行 zcode-skills-sync" /
  "use zcode-skills-sync" / "用 zcode-skills-sync 同步"。
- "同步技能"、"sync skills"、"同步 ZCode 技能"这类泛化说法**不触发**；
  CC Switch 里加了/改了 skill 也不触发，只有点名才运行。
- 用户要求同步但没有点名时，提示他显式调用 `$zcode-skills-sync`，不要静默执行。

## 运行方式

在本 skill 的安装位置运行脚本（默认路径按 ZCode 标准技能目录写死）：

```bash
python3 ~/.zcode/skills/zcode-skills-sync/scripts/sync_zcode_skills.py
```

如果 ZCode 的技能目录变了（例如大版本更新后），显式传入：

```bash
python3 <本skill路径>/scripts/sync_zcode_skills.py --zcode-dir ~/.zcode/skills
```

然后把那行输出原样报告，例如：

```
zcode skills synced: removed=26 added=26 total=27
```

## ZCode 重装后的恢复流程

本 skill 保存在 `lencamo/skills` 仓库里，ZCode 卸载不影响它。重新装好 ZCode 后：

1. 从 CC Switch 把本 skill 导入 ZCode，或把这个文件夹拷进 ZCode 的技能目录。
2. 在 ZCode 里调用 `$zcode-skills-sync`。agent 执行脚本后，启用的 skill 集合
   会以符号链接的形式全部恢复指向 CC Switch。

其余 skill 不要用 ZCode 自带的"从 Claude 导入技能"功能（见下方规则）。

## 原则

1. **CC Switch 是唯一真源。** 真实 skill 文件夹都在 `~/.cc-switch/skills/`。
2. **ZCode 只发现 `~/.zcode/skills/`。** 里面的每个条目都是指向 CC Switch
   文件夹的符号链接，内容更新自动生效。
3. **同步就是先清后建：** 删掉 `~/.zcode/skills` 下所有符号链接，再按 CC Switch
   对 opencode 的启用集（`enabled_opencode=1`）逐个重建，排除 owner 为
   `stablyai` 的 skill。
   - 真实目录永不触碰，只清符号链接，所以本 skill 自己的文件夹安然无恙。
   - 本 skill 自己的符号链接永不被删除，所以以符号链接方式导入本 skill 再运行
     同步是安全的。
4. **Orca 的 skill 被排除**（`stablyai/orca`）：它们启用 opencode 只是为了在
   Orca 内工作，它们的 `computer-use` 会和 ZCode 自带的 CUA 冲突。
5. **内容更新走符号链接自动生效**，只有增删 skill 才需要本 skill。

## 规则

- 不要手工增删 `~/.zcode/skills`；在 CC Switch（opencode 目标）里改启用集，
  再运行本 skill。
- 不要用 ZCode 自带的"从 Claude 导入技能"功能；它会把链接指到
  `~/.claude/skills`。
- 要换目标应用或放开 Orca skill，改 `scripts/sync_zcode_skills.py` 里的
  `FLAG` / `EXCLUDE_OWNER`。

## 故障排查

- 某个 skill 缺失：在 CC Switch 里为 opencode 目标启用它，重跑。
- 意外出现 Orca 的 skill：检查脚本里的 `EXCLUDE_OWNER`。
- 链接指向了 `~/.claude/skills`：重跑本 skill。
- 报 `CC Switch database not found`：确认 `~/.cc-switch/cc-switch.db` 存在。
