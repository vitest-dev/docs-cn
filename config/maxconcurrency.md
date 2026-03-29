---
title: maxConcurrency | Config
outline: deep
---

# maxConcurrency

- **类型:** `number`
- **默认值:** `5`
- **命令行终端:** `--max-concurrency=10`, `--maxConcurrency=10`

The maximum number of tests and hooks that can run at the same time when using `test.concurrent` or `describe.concurrent`.

The hook execution order within a single group is also controlled by [`sequence.hooks`](/config/sequence#sequence-hooks). With `sequence.hooks: 'parallel'`, the execution is bounded by the same limit of [`maxConcurrency`](/config/maxconcurrency).
