---
title: fileParallelism | 配置
outline: deep
---

# fileParallelism

- **类型:** `boolean`
- **默认值:** `true`
- **命令行终端:** `--no-file-parallelism`, `--fileParallelism=false`

是否允许所有测试文件并行运行。若设为 `false`，将强制 `maxWorkers` 选项降为 `1`。

::: tip
此选项不会影响同一文件内的测试运行。如需并行执行同一文件内的测试，请在 [describe](/api/describe#describe-concurrent) 块中使用 `concurrent` 选项或通过 [配置文件](/config/sequence#sequence-concurrent) 设置。
:::
