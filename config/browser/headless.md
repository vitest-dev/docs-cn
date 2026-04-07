---
title: browser.headless | 配置
outline: deep
---

# browser.headless

- **类型:** `boolean`
- **默认值:** `process.env.CI`
- **命令行终端:** `--browser.headless`, `--browser.headless=false`

以 `无头模式` 运行浏览器。如果在 CI 环境中执行 Vitest，该模式将默认启用。
