---
title: 性能优化 | 指南
---

# 性能优化

## 测试隔离

默认情况下，Vitest 在基于[pool](/config/#pool) 的隔离环境中运行每个测试文件：

- `threads` 池在单独的 [`Worker`](https://nodejs.org/api/worker_threads.html#class-worker) 中运行每个测试文件
- `forks` 池在单独的 [forked child process](https://nodejs.org/api/child_process.html#child_processforkmodulepath-args-options) 中运行每个测试文件
- `vmThreads` 池在单独的 [VM context](https://nodejs.org/api/vm.html#vmcreatecontextcontextobject-options) 中运行每个测试文件，但它并行工作

这大大增加了测试时间，这对于不依赖副作用并正确清理其状态的项目来说可能是不可取的（对于具有 `node` 环境的项目来说通常是这样）。在这种情况下，禁用隔离将提高测试的速度。要做到这一点，你可以向 CLI 提供 `--no-isolate` 标志，或者将 config 中的[`test.isolate`](/config/#isolate) 属性设置为 `false`。如果你使用 `poolMatchGlobs` 同时使用多个池，你还可以禁用正在使用的特定池的隔离。

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

:::tip
如果使用的是 `vmThreads` 池，则不能禁用隔离。请改用 `threads` 池来提高测试性能。
:::

对于某些项目，可能还需要禁用并行性以缩短启动时间。为此，请向 CLI 提供 `--no-file-parallelism` 标志，或将 config 中的[`test.fileParallelism`](/config/#fileParallelism) 属性设置为 `false`。

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

## Pool

默认情况下，Vitest 在 `pool: 'forks'` 中运行测试。虽然 `'forks'` 池更适合解决兼容性问题（[hanging process](/guide/common-errors.html#failed-to-terminate-worker) 和[segfaults](/guide/common-errors.html#segfaults-and-native-code-errors)），但在较大的项目中，它可能比 `pool: 'threads'` 稍慢。

你可以尝试通过切换配置中的 `pool` 选项来改善测试运行时间：

::: code-group

```bash [CLI]
vitest --pool=threads
```

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'threads',
  },
})
```

:::

## Sharding

Test sharding means running a small subset of test cases at a time. It can be useful when you have multiple machines that could be used to run tests simultaneously.

To split Vitest tests on multiple different runs, use [`--shard`](/guide/cli#shard) option with [`--reporter=blob`](/guide/reporters#blob-reporter) option:

```sh
vitest run --reporter=blob --shard=1/3 # 1st machine
vitest run --reporter=blob --shard=2/3 # 2nd machine
vitest run --reporter=blob --shard=3/3 # 3rd machine
```

Collect the results stored in `.vitest-reports` directory from each machine and merge them with [`--merge-reports`](/guide/cli#merge-reports) option:

```sh
vitest --merge-reports
```

<details>
  <summary>Github action example</summary>

This setup is also used at https://github.com/vitest-tests/test-sharding.

```yaml
# Inspired from https://playwright.dev/docs/test-sharding
name: Tests
on:
  push:
    branches:
      - main
jobs:
  tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install pnpm
        uses: pnpm/action-setup@v4

      - name: Install dependencies
        run: pnpm i

      - name: Run tests
        run: pnpm run test --reporter=blob --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

      - name: Upload blob report to GitHub Actions Artifacts
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: blob-report-${{ matrix.shardIndex }}
          path: .vitest-reports/*
          retention-days: 1

  merge-reports:
    if: ${{ !cancelled() }}
    needs: [tests]

    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install pnpm
        uses: pnpm/action-setup@v4

      - name: Install dependencies
        run: pnpm i

      - name: Download blob reports from GitHub Actions Artifacts
        uses: actions/download-artifact@v4
        with:
          path: .vitest-reports
          pattern: blob-report-*
          merge-multiple: true

      - name: Merge reports
        run: npx vitest --merge-reports
```

</details>

:::tip
Test sharding can also become useful on high CPU-count machines.

Vitest will run only a single Vite server in its main thread. Rest of the threads are used to run test files.
In a high CPU-count machine the main thread can become a bottleneck as it cannot handle all the requests coming from the threads. For example in 32 CPU machine the main thread is responsible to handle load coming from 31 test threads.

To reduce the load from main thread's Vite server you can use test sharding. The load can be balanced on multiple Vite server.

```sh
# Example for splitting tests on 32 CPU to 4 shards.
# As each process needs 1 main thread, there's 7 threads for test runners (1+7)*4 = 32
# Use VITEST_MAX_THREADS or VITEST_MAX_FORKS depending on the pool:
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=1/4 & \
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=2/4 & \
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=3/4 & \
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=4/4 & \
wait # https://man7.org/linux/man-pages/man2/waitpid.2.html

vitest --merge-reports
```

:::
