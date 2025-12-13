---
title: watch | Config
outline: deep
---

# watch <CRoot /> {#watch}

- **类型:** `boolean`
- **默认值:** `!process.env.CI && process.stdin.isTTY`
- **命令行终端:** `-w`, `--watch`, `--watch=false`

启动监听模式

交互式环境中，默认启用监听模式，除非显式传入 `--run`。

在 CI 或非交互式 shell 中，监听模式默认关闭，但可通过该标志显式启用。
