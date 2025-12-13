---
title: testTimeout | Config
outline: deep
---

# testTimeout

- **类型:** `number`
- **默认值:** 在 Node.js 环境下为 `5_000`，当 `browser.enabled` 为 `true` 时为 `15_000`
- **命令行终端:** `--test-timeout=5000`, `--testTimeout=5000`

测试的默认超时时间（以毫秒为单位）。 使用 `0` 完全禁用超时。
