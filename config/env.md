---
title: env | 配置
outline: deep
---

# env

- **类型:** `Partial<NodeJS.ProcessEnv>`

测试期间在 `process.env` 和 `import.meta.env` 中可用的环境变量。这些变量在主进程中不可用（例如在 `globalSetup` 中）。

::: warning
在此处设置的 `TZ` 不会更改 `threads` 和 `vmThreads` 池中的时区。详情参阅 [不会更改工作线程中的时区](/guide/common-errors#time-zone-does-not-change-in-worker-threads)。
:::
