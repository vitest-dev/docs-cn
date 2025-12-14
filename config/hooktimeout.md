---
title: hookTimeout | Config
outline: deep
---

# hookTimeout

- **类型:** `number`
- **默认值:** 在 Node.js 环境下为 `10_000`，当 `browser.enabled` 为 `true` 时为 `30_000`
- **命令行终端:** `--hook-timeout=10000`，`--hookTimeout=10000`

钩子 (`hook`) 的默认超时时间 （以毫秒为单位）。使用 `0` 完全禁用超时。
