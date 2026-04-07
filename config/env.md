---
title: env | 配置
outline: deep
---

# env

- **类型:** `Partial<NodeJS.ProcessEnv>`

测试期间在 `process.env` 和 `import.meta.env` 中可用的环境变量。这些变量在主进程中不可用（例如在 `globalSetup` 中）。
