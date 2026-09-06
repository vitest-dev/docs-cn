---
title: 性能优化 | 指南
---

# 性能优化 {#improving-performance}

## 性能剖析 {#profile-first}

摘要中的 `Duration` 行会将本次运行分解为多个阶段，并显示各阶段占所有已跟踪时间的百分比：

```
Duration  3.76s (environment 79%, import 13%, transform 6%, tests 1%, setup 1%)
```

这些百分比是相对于所有已跟踪阶段的总和，而不是实际经过时间：各阶段会在并行 worker 中运行，因此它们的总和通常会大于整个运行时长。在多项目配置中，百分比会汇总所有 [项目](/guide/projects) 的数据，因此某个项目中占主导地位的阶段可能会被其他项目稀释；下面的性能提示会分别分析每个项目。

这些阶段对应以下配置选项：

- `environment` - 为测试文件创建测试环境（例如 `jsdom`、`happy-dom`）。参见 [测试环境](#test-environments)。
- `transform` - 等待 Vite 解析并转换导入的模块。参见 [重新运行间的缓存机制](#caching-between-reruns)。
- `import` - 评估测试文件及其模块，不包括上文统计的转换等待时间。当文件主要导入相同的模块时（barrel 文件导入的典型情况），隔离机制会为每个文件重新评估这张共享依赖图。参见 [测试隔离](#test-isolation)。
- `setup` - 运行 [`setupFiles`](/config/setupfiles)。
- `worker` - 在每个 worker 中准备测试运行器。启用隔离时，每个测试文件都会产生这项开销。参见 [测试隔离](#test-isolation)。
- `tests` - 实际运行测试。如果运行时间主要消耗在此阶段，修改配置几乎不会带来收益。

如果收集到的计时结果表明调整配置可以显著缩短运行时间，Vitest 会在摘要后打印一条提示（参见 [`experimental.diagnostics`](/config/experimental#experimental-diagnostics)）。提示不会建议修改已经明确设置的选项。

[`vitest doctor`](/guide/cli#vitest-doctor) 不会估算候选配置的效果，而是逐一使用这些配置运行测试套件并报告对比结果，其中也包括测试能否在 `isolate: false` 下通过。

## 测试隔离 {#test-isolation}

默认情况下，Vitest 在基于 [pool](/config/pool) 的隔离环境中运行每个测试文件：

- `threads` 线程池：每个测试文件在独立的 [`Worker`](https://nodejs.org/api/worker_threads.html#class-worker) 中运行
- `forks` 进程池：每个测试文件在独立的 [子进程分支](https://nodejs.org/api/child_process.html#child_processforkmodulepath-args-options) 中运行。
- `vmThreads` 虚拟线程池：每个测试文件在独立的 [VM 上下文](https://nodejs.org/api/vm.html#vmcreatecontextcontextobject-options) 中运行，但通过 Worker 实现并行执行。

对于那些不依赖副作用并且能够正确清理其状态的项目来说，这可能不是所期望的（对于拥有 `node` 环境的项目来说，这通常是正确的），这会大大增加测试时间。在这种情况下，禁用隔离将提高测试速度。要做到这一点，我们可以在 CLI 中提供 `--no-isolate` 参数，或者在配置文件中将 [`test.isolate`](/config/isolate) 属性设置为 `false`。

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

你也可以仅通过 `projects` 为特定文件禁用隔离：

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'Isolated',
          isolate: true, // （默认值）
          exclude: ['**.non-isolated.test.ts'],
        },
      },
      {
        test: {
          name: 'Non-isolated',
          isolate: false,
          include: ['**.non-isolated.test.ts'],
        },
      },
    ],
  },
})
```

::: tip
如果使用的是 `vmThreads` 池，则不能禁用隔离。请改用 `threads` 池来提高测试性能。
:::

对于某些项目，可能还需要禁用并行性以缩短启动时间。为此，请向 CLI 提供 `--no-file-parallelism` 参数，或将 config 中的 [`test.fileParallelism`](/config/fileparallelism) 属性设置为 `false`。

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

## 测试环境 {#test-environments}

DOM 环境的创建成本很高：每次导入 `jsdom` 大约需要 200-500 毫秒，`happy-dom` 大约需要 90-200 毫秒，此外还要加上构造 window 的时间。使用隔离池（默认设置）时，每个测试文件都会产生这笔开销，因为每个文件都会获得一个全新的 worker。对于大量使用 DOM 的测试套件，这通常是运行耗时中占比最大的部分；它会显示在 `Duration` 分解中的 `environment` 部分。

以下三种配置可以降低这项成本：

| 配置                                                  | 环境创建频率     | 隔离方式                                        | 权衡                                                                                                                                                 |
| ----------------------------------------------------- | ---------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pool: 'forks'`/`'threads'` + `isolate: true`（默认） | 每个文件一次     | 每个文件使用全新的进程/线程和环境               | 最安全，但速度最慢                                                                                                                                   |
| `pool: 'vmThreads'`                                   | 每个 worker 一次 | 每个文件使用全新的 VM 上下文和 `window`         | 测试代码在 VM realm 中运行：外部化包可能出现跨 realm 的 `instanceof` 边界问题，而且内存回收不够可靠（参见 [`vmMemoryLimit`](/config/vmmemorylimit)） |
| `isolate: false`                                      | 每个 worker 一次 | 无隔离 - 同一 worker 中的文件共享环境和模块状态 | 测试不能依赖干净的 `window` 或模块状态；运行 `vitest doctor` 进行检查                                                                                |

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    pool: 'vmThreads', // 每个 worker 一个环境，每个文件使用全新的 window
  },
})
```

如果测试能够容忍共享状态，优先在 `threads` 中使用 `isolate: false`：这是最快的选项，而且内存行为更简单。当每个文件都需要全新的 `window`，并且每个文件的环境创建成本占据主要运行时间时，使用 `vmThreads`。在所有配置下，初始化 `happy-dom` 的成本都低于 `jsdom`。

## 限制搜索目录 {#limiting-directory-search}

你可以通过 [`test.dir`](/config/dir) 选项限制 Vitest 搜索文件的工作目录。如果根目录中存在不相关的文件夹和文件，这将加快搜索速度。

## 重新运行间的缓存机制 {#caching-between-reruns}

在监听模式下，Vitest 会将所有转换后的文件缓存在内存中，从而实现快速重新运行。不过该缓存会在测试运行结束后被清除。通过启用 [`fsModuleCache`](/config/fsmodulecache) 配置，Vitest 会将此缓存持久化到文件系统，使其能在多次重运行间复用。

当重新运行少量依赖大型模块图的测试时，这种优化效果最为显著。对于完整测试套件，由于并行化机制会在早期测试仍在运行时通过其他测试填充内存缓存，其性能损耗已得到缓解。例如运行一个依赖庞大模块图（>900 个模块）的测试文件时：

```shell
# 第一次运行
Duration  8.75s (import 43%, transform 32%, tests 20%, setup 5%)

# 第二次运行
Duration  5.90s (tests 44%, import 35%, transform 13%, setup 8%)
```

## Node 编译缓存 {#node-compile-cache}

Vitest 支持 Node 的 [磁盘编译缓存](https://nodejs.org/api/cli.html#node_compile_cachedir)。将 `NODE_COMPILE_CACHE` 环境变量设置为一个目录后，Vitest 自身模块和外部化依赖项的 V8 字节码会写入磁盘，后续运行时可以直接复用，无须重新编译。Vitest 会将该环境变量传递给每个 worker；worker 关闭时，会把它所编译的模块持久化到磁盘。

```shell
NODE_COMPILE_CACHE=node_modules/.cache/node-compile-cache vitest
```

首次使用空目录时，序列化已编译模块会产生额外开销。因此，只有缓存目录能在多次运行之间保留，启用编译缓存才有收益。这适用于本地运行，也适用于会缓存该目录的 CI 流水线。设置 `NODE_DISABLE_COMPILE_CACHE=1` 可完全禁用编译缓存，其优先级高于 `NODE_COMPILE_CACHE`。

请注意，启用 `v8` 覆盖率 provider 后，Vitest 会自动禁用 worker 中的编译缓存。这是因为 V8 序列化缓存脚本时不会保留精确覆盖率所需的源码位置信息。

## 运行池 {#pool}

默认情况下，Vitest 在 `pool: 'forks'` 中运行测试。虽然 `'forks'` 池更适合解决兼容性问题（[hanging process](/guide/common-errors.html#failed-to-terminate-worker) 和 [segfaults](/guide/common-errors.html#segfaults-and-native-code-errors)），但在较大的项目中，它可能比 `pool: 'threads'` 稍慢。

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

在各台机器上收集保存在 `.vitest/blob/` 目录中的结果文件，然后通过 [`--merge-reports`](/guide/cli#merge-reports) 选项将这些结果合并：

```sh
vitest run --merge-reports
```

在多个环境中运行相同的分片时，设置 `VITEST_BLOB_LABEL` 环境变量，以便合并的报告可以区分显示：

```sh
VITEST_BLOB_LABEL=linux vitest run --reporter=blob --shard=1/3
```

::: details GitHub Actions 示例
此配置也用于 https://github.com/vitest-tests/test-sharding。

```yaml
# 灵感来至于 https://playwright.dev/docs/test-sharding
name: Tests
on:
  push:
    branches:
      - main
jobs:
  tests:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Install pnpm
        uses: pnpm/action-setup@a7487c7e89a18df4991f7f222e4898a00d66ddda # v4.1.0

      - name: Install dependencies
        run: pnpm i

      - name: Run tests
        run: pnpm run test --reporter=blob --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
        env:
          VITEST_BLOB_LABEL: ${{ matrix.os }}

      - name: Upload Vitest results GitHub Actions Artifacts
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: vitest-results-${{ matrix.os }}-${{ matrix.shardIndex }}
          path: .vitest
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
          node-version: 24

      - name: Install pnpm
        uses: pnpm/action-setup@a7487c7e89a18df4991f7f222e4898a00d66ddda # v4.1.0

      - name: Install dependencies
        run: pnpm i

      - name: Download Vitest results from GitHub Actions Artifacts
        uses: actions/download-artifact@v4
        with:
          path: .vitest
          merge-multiple: true

      - name: Merge reports
        run: npx vitest --merge-reports
```

如果你的测试会创建基于文件的附件（例如通过 `context.annotate` 或自定义测试产物），请在合并任务中按上文所示上传并还原 [`attachmentsDir`](/config/attachmentsdir)。
:::

::: tip
测试分片在多核心 CPU 机器上也很有用。

Vitest 将只在其主线程中运行一个 Vite 服务器。其余的线程用于运行测试文件。
在多核心 CPU 机器中，主线程可能会成为瓶颈，因为它无法处理来自其余线程的所有请求。例如，在 32 核 CPU 机器中，主线程负责处理来自 31 个测试线程的负载。

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
