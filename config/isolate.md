---
title: isolate | 配置
outline: deep
---

# isolate

- **类型:** `boolean`
- **默认值:** `true`
- **命令行终端:** `--no-isolate`, `--isolate=false`

在隔离环境中运行测试。此选项对 `vmThreads` 和 `vmForks` 线程池没有影响。

如果你的代码不依赖副作用（通常适用于 `node` 环境的项目），禁用此选项可能 [提升性能](/guide/improving-performance)。

::: tip
可通过 Vitest 工作区为特定测试文件禁用隔离，或按项目单独配置隔离设置。
:::
