---
title: update | 配置
outline: deep
---

# update <CRoot /> {#update}

- **类型:** `boolean | 'new' | 'all' | 'none'`
- **默认值:** `false`
- **命令行终端:** `-u`, `--update`, `--update=false`, `--update=new`, `--update=none`

定义快照更新行为：

- `true` 或 `'all'`：更新所有变更的快照并删除已废弃的快照
- `'new'`：生成新快照但不修改或删除已废弃的快照
- `'none'`：不写入快照，并在快照不匹配、快照缺失或存在废弃快照时使测试失败

当 `update` 为 `false`（默认值）时，Vitest 根据运行环境自动决定更新模式：

- 本地运行（非 CI 环境）：等同于 `'new'` 模式
- CI 运行（`process.env.CI` 为 true 时）：等同于 `'none'` 模式
