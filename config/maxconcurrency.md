---
title: maxConcurrency | 配置
outline: deep
---

# maxConcurrency

- **类型:** `number`
- **默认值:** `5`
- **命令行终端:** `--max-concurrency=10`, `--maxConcurrency=10`

使用 `test.concurrent` 或 `describe.concurrent` 时，可以同时运行的测试和钩子的最大并发数量。

单个组内的钩子执行顺序也由 [`sequence.hooks`](/config/sequence#sequence-hooks) 控制。当 `sequence.hooks: 'parallel'` 时，执行也会受到 [`maxConcurrency`](/config/maxconcurrency) 相同限制的约束。
