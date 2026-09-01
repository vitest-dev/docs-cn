---
title: env | 配置
outline: deep
---

# env

- **类型:** `Partial<NodeJS.ProcessEnv>`

<<<<<<< HEAD
测试期间在 `process.env` 和 `import.meta.env` 中可用的环境变量。这些变量在主进程中不可用（例如在 `globalSetup` 中）。
=======
Environment variables available on `process.env` and `import.meta.env` during tests. These variables will not be available in the main process (in `globalSetup`, for example).

::: warning
`TZ` set here does not change the time zone in `threads` and `vmThreads` pools. See [Time Zone Does Not Change in Worker Threads](/guide/common-errors#time-zone-does-not-change-in-worker-threads).
:::
>>>>>>> a41164cabca74cb90d641ff5b118fa10f2190094
