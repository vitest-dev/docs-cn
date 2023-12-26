---
title: 性能 | 指南
---

# 性能

默认情况下，Vitest 在基于[pool](/config/#pool) 的隔离环境中运行每个测试文件：

- `threads` 池在单独的 [`Worker`](https://nodejs.org/api/worker_threads.html#class-worker) 中运行每个测试文件
- `forks` 池在单独的 [forked child process](https://nodejs.org/api/child_process.html#child_processforkmodulepath-args-options) 中运行每个测试文件
- `vmThreads` 池在单独的 [VM context](https://nodejs.org/api/vm.html#vmcreatecontextcontextobject-options) 中运行每个测试文件，但它并行工作

这大大增加了测试时间，这对于不依赖副作用并正确清理其状态的项目来说可能是不可取的（对于具有 `node` 环境的项目来说通常是这样）。在这种情况下，禁用隔离将提高测试的速度。要做到这一点，你可以向 CLI 提供 `--no-isolate` 标志，或者将 config 中的[`test.sisolate`](/config/#isolate) 属性设置为 `false`。如果你使用 `poolMatchGlobs` 同时使用多个池，你还可以禁用正在使用的特定池的隔离。

::: code-group

```bash [CLI]
vitest --no-isolate
```

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    isolate: false,
    // 你还可以仅对特定池禁用隔离
    poolOptions: {
      forks: {
        isolate: false,
      },
    },
  },
})
```

:::

::: note
如果使用的是 `vmThreads` 池，则不能禁用隔离。请改用 `threads` 池来提高测试性能。
:::

对于某些项目，可能还需要禁用并行性以缩短启动时间。为此，请向 CLI 提供 `--no-file-parallelism` 标志，或将 config 中的[`test.fileParallelism`](/config/#fileParallelism)属性设置为 `false`。

::: code-group

```bash [CLI]
vitest --no-file-parallelism
```

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    fileParallelism: false,
  },
})
```

:::
