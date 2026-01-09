---
title: 性能优化 | 指南
---

## 测试隔离 {#test-isolation}

默认情况下，Vitest 在基于[pool](/config/#pool) 的隔离环境中运行每个测试文件：

对于那些不依赖副作用并且能够正确清理其状态的项目来说，这可能不是所期望的（对于拥有 `node` 环境的项目来说，这通常是正确的），这会大大增加测试时间。在这种情况下，禁用隔离将提高测试速度。要做到这一点，我们可以在 CLI 中提供 `--no-isolate` 标志，或者在配置文件中将 [`test.isolate`](/config/#isolate) 属性设置为 `false`。

::: code-group

```bash [CLI]
vitest --no-isolate
```

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    isolate: false,
  },
})
```

:::

You can also disable isolation for specific files only by using `projects`:

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        name: 'Isolated',
        isolate: true, // (default value)
        exclude: ['**.non-isolated.test.ts'],
      },
      {
        name: 'Non-isolated',
        isolate: false,
        include: ['**.non-isolated.test.ts'],
      }
    ]
  },
})
```

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

## 限制搜索目录 {#limiting-directory-search}

你可以通过 [`test.dir`](/config/#test-dir) 选项限制 Vitest 搜索文件的工作目录。如果根目录中存在不相关的文件夹和文件，这将加快搜索速度。

## 运行池 {#pool}

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

## 分片 {#sharding}

测试分片是将你的测试套件拆分成多个组或分片的过程。当你拥有大量的测试用例，并且有多台机器可以同时运行这些测试的不同子集时，这个功能会非常有用。

要在多个不同的运行中拆分 Vitest 测试，请将 [`--shard`](/guide/cli#shard) 选项与 [`--reporter=blob`](/guide/reporters#blob-reporter) 选项一起使用：

```sh
vitest run --reporter=blob --shard=1/3 # 1st machine
vitest run --reporter=blob --shard=2/3 # 2nd machine
vitest run --reporter=blob --shard=3/3 # 3rd machine
```

> Vitest 对 _测试文件_（而非单个测试用例）进行分片。如果你有 1000 个测试文件，使用 `--shard=1/4` 时会运行其中的 250 个文件，而不会根据文件内的用例数量做进一步切分。

在各台机器上收集保存在 `.vitest-reports` 目录中的结果文件，然后通过 [`--merge-reports`](/guide/cli#merge-reports) 选项将这些结果合并：

```sh
vitest run --merge-reports
```

::: details GitHub Actions 示例
同样方案也应用于 https://github.com/vitest-tests/test-sharding 仓库。

```yaml
# 灵感来至于 https://playwright.dev/docs/test-sharding
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
        uses: pnpm/action-setup@a7487c7e89a18df4991f7f222e4898a00d66ddda # v4.1.0

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
          include-hidden-files: true
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
        uses: pnpm/action-setup@a7487c7e89a18df4991f7f222e4898a00d66ddda # v4.1.0

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

:::

:::tip
测试分片在多核心 CPU 机器上也很有用。

Vitest 将只在其主线程中运行一个 Vite 服务器。其余的线程用于运行测试文件。
在多核心 CPU 机器中，主线程可能会成为瓶颈，因为它无法处理来自其余线程的所有请求。例如，在 32核 CPU 机器中，主线程负责处理来自 31 个测试线程的负载。

为了减少主线程的 Vite 服务器的负载，可以使用测试分片。将负载平均到多个 Vite 服务器上。

```sh
# 以 32 核心 CPU 拆分成 4 个分片为例。
# 每个分片需要一个主线程，因此每个分片可以分配7个测试线程 (1+7) *4 =32
# 使用 VITEST_MAX_THREADS 进行分配:
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=1/4 & \
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=2/4 & \
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=3/4 & \
VITEST_MAX_THREADS=7 vitest run --reporter=blob --shard=4/4 & \
wait # https://man7.org/linux/man-pages/man2/waitpid.2.html

vitest run --merge-reports
```

:::
