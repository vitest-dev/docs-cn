---
title: watch | 配置
outline: deep
---

# watch <CRoot /> {#watch}

<<<<<<< HEAD
- **类型:** `boolean`
- **默认值:** `!process.env.CI && process.stdin.isTTY`
- **命令行终端:** `-w`, `--watch`, `--watch=false`
=======
- **Type:** `boolean`
- **Default:** `!process.env.CI && process.stdin.isTTY`, and `false` when Vitest detects an AI coding agent
- **CLI:** `-w`, `--watch`, `--watch=false`
>>>>>>> 9090f1432b6c7b03dcae1dfd84f09caaf62fb933

启动监听模式

交互式环境中，默认启用监听模式，除非显式传入 `--run`。

在 CI 或非交互式 shell 中，监听模式默认关闭，但可通过该参数显式启用。
