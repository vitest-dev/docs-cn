---
title: fileParallelism | Config
outline: deep
---

# fileParallelism

- **类型:** `boolean`
- **默认值:** `true`
- **命令行终端:** `--no-file-parallelism`, `--fileParallelism=false`

所有测试文件应该并行运行。 将其设置为 `false` 将覆盖 `maxWorkers` 选项为 `1`。

::: tip
此选项不会影响在同一文件中运行的测试。如果你想并行运行这些程序，使用 `concurrent` 选项 [describe](/api/describe#describe-concurrent) 或通过 [配置](#sequence-concurrent)。
:::
