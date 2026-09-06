---
title: 命令行界面 | 指南
outline: deep
---

# 命令行界面 {#command-line-interface}

## 命令 {#commands}

### `vitest` {#vitest}

在当前目录启动 Vitest。在开发环境中会自动进入监听模式，而在 CI 环境（或非交互式终端）中会自动运行测试模式。

你可以通过添加参数作为过滤器来运行测试文件，比如：

```bash
vitest foobar
```

将仅运行路径中包含 `foobar` 的测试文件。 此过滤器仅检查包含，不支持正则表达式或 glob 模式（除非你的终端在 Vitest 接收过滤器之前对其进行处理）。

自 vitest 3 起，你还可以通过文件名和行号指定测试：

```bash
$ vitest basic/foo.test.ts:10
```

::: warning
请注意，Vitest 需要完整的文件名才能使此功能正常工作。它可以是相对于当前工作目录的路径，也可以是绝对文件路径。

```bash
$ vitest basic/foo.js:10 # ✅
$ vitest ./basic/foo.js:10 # ✅
$ vitest /users/project/basic/foo.js:10 # ✅
$ vitest foo:10 # ❌
$ vitest ./basic/foo:10 # ❌
```

目前，Vitest 还不支持范围：

```bash
$ vitest basic/foo.test.ts:10, basic/foo.test.ts:25 # ✅
$ vitest basic/foo.test.ts:10-25 # ❌
```
:::

### `vitest run`

在没有监听模式的情况下执行单次运行。

### `vitest watch`

运行所有测试套件，监听变化并在变化时重新运行测试。与没有参数的情况下调用 `vitest` 一样。在 CI 环境中，此命令将回退到 `vitest run`。

### `vitest dev`

`vitest watch` 的别名。

### `vitest related`

仅运行涵盖源文件列表的测试。 适用于静态惰性导入(例如, `import('./index.ts')` 或者 `import index from './index.ts`)，但不适用于动态导入(例如, `import(filepath)`)。 所有文件都应该相对于根文件夹。

与 [`lint-staged`](https://github.com/okonet/lint-staged) 或你的 CI 设置一起运行很有用。

```bash
vitest related /src/index.ts /src/hello-world.js
```

::: tip
不要忘记 Vitest 默认情况下以启用的监视模式运行。如果你使用的是 `lint-staged` 之类的工具，你还应该传递 `--run` 选项，以便该命令可以正常退出。

```js [.lintstagedrc.js]
export default {
  '*.{js,ts}': 'vitest related --run',
}
```
:::

### `vitest bench`

仅运行 [基准](/guide/features.html#benchmarking) 测试，用于比较性能结果。

### `vitest init`

`vitest init <name>` 可以用于设置项目配置。目前，它只支持 [`browser`](/guide/browser/) 值：

```bash
vitest init browser
```

### `vitest list`

`vitest list` 命令继承所有的 `vitest` 选项以打印所有匹配测试的列表。此命令忽略 `reporters` 选项。默认情况下，它将打印与文件过滤器和名称模式匹配的所有测试的名称：

```shell
vitest list filename.spec.ts -t="some-test"
```

```txt
describe > some-test
describe > some-test > test 1
describe > some-test > test 2
```

你可以传递 `--json` 参数以 JSON 格式打印测试，也可以将其保存在单独的文件中：

```bash
vitest list filename.spec.ts -t="some-test" --json=./file.json
```

如果 `--json` 参数没有接收到值，它将把 JSON 输出到 stdout 中。

你还可以传递 `--filesOnly` 参数来仅打印测试文件：

```bash
vitest list --filesOnly
```

```txt
tests/test1.test.ts
tests/test2.test.ts
```

自 Vitest 5 起，你可以传入 `--static-parse` 来 [解析测试文件](/api/advanced/vitest#parsespecifications)，而无需运行它们来收集测试。Vitest 以有限的并发数解析测试文件，默认为 `os.availableParallelism()`。你可以通过 `--static-parse-concurrency` 选项来修改此值。

### `vitest doctor`

`vitest doctor` 会分别在不同配置下运行测试套件，来评估在不同配置下测试套件能快多少。候选配置基于当前配置自动选取：

```bash
vitest doctor
```

```
Results (min of 3 runs each)

  baseline (pool: forks · isolate: true)  4.08s
  pool: 'threads'                         3.64s (-11%)
  pool: 'vmThreads'                       1.33s (-67%)
  isolate: false                          1.28s (-69%)

Recommendation: pool: 'vmThreads' (-67%)

  // vitest.config.ts
  import { defineConfig } from 'vitest/config'

  export default defineConfig({
    test: {
      pool: 'vmThreads', // measured -67% on this suite
    },
  })
```

`isolate: false` 候选配置还会通过打乱文件顺序运行两次测试套件来验证：如果某个测试依赖隔离，该候选配置会被报告为失败，而不会被推荐。当多个候选配置的速度接近最快值时，doctor 会优先选择保留文件级隔离的配置。

doctor 还会在胜出配置的基础上探测更低的 [`maxWorkers`](/config/maxworkers) 值：每个工作线程都会通过唯一的主线程 Vite 服务器处理转换请求，因此工作线程超过一定数量后，增加线程反而会让运行变慢。从当前工作线程数的一半开始，只要测试套件的速度至少提升 5%，doctor 就会继续将数量减半，并在推荐中包含最终胜出的值。

运行 DOM 环境的测试套件会在两个虚拟机池 `vmThreads` 和 `vmForks` 下分别测量：它们通过在保持每个工作线程一个环境的同时，让每个文件仍然获得全新的 VM 上下文，来摊销环境创建成本。`vmForks` 使用子进程而不是工作线程：每个子进程都有自己的堆和垃圾回收器，因此哪个池更快取决于具体的测试套件。对于无法在工作线程中运行的测试套件，应使用 `vmForks` 这个选项。

安装了 `happy-dom` 软件包后，使用 `jsdom` 环境的项目也会在 `environment: 'happy-dom'` 配置下进行测量。替换按项目单独应用；使用其他环境的项目不会受到影响。由于 happy-dom 与 jsdom 的 DOM 实现不同，采用这一替换前，应先验证依赖布局或导航行为的测试。关闭 [fs 模块缓存](/config/fsmodulecache) 时，doctor 会先执行一次不计时的预热运行以填充缓存，再测量 `fsModuleCache: true`,因此报告的耗时反映了后续重复运行的实际开销。

每次测量都会运行完整的测试套件，包括浏览器项目；`isolate: false` 同样会影响浏览器模式。对于不会影响浏览器项目的候选配置（`pool`、`environment` 和 fs 模块缓存），doctor 仅根据 Node 端项目进行选择。

失败的候选配置会附带错误摘要。如果测试套件在当前配置下失败，doctor 会中止并显示错误，因为它需要一个通过的基线作为比较依据。

对于较短的测试套件，doctor 会重复测量多次并报告最佳耗时，使比较结果更能反映预热后的稳定状态。由于 doctor 会多次运行完整测试套件，整个过程的耗时约为普通运行的数倍。有关各候选配置的权衡，请参阅 [性能优化](/guide/improving-performance)。

即使没有候选配置可供比较，doctor 也会测量并报告基线。使用 `vm` 池的配置还会与 ` pool: 'threads'` 且 `isolate: false` 的配置进行比较；该配置同样会复用工作线程，但会在不同文件之间共享模块状态。已经使用某个 VM 池的配置，仍会在另一个 VM 池下进行测量。

## Shell 自动补全 {#shell-autocompletions}

Vitest 通过 [`@bomb.sh/tab`](https://github.com/bombshell-dev/tab) 提供命令、选项及选项值的 Shell 自动补全功能。

### 初始化 {#setup}

如需在 zsh 中永久启用自动补全，请将以下内容添加至 `~/.zshrc` 文件：

```bash
# 将此行加入 ~/.zshrc 实现永久自动补全（其他 shell 配置方式类似）
source <(vitest complete zsh)
```

### 包管理器集成 {#package-manager-integration}

`@bomb.sh/tab` 与 [包管理器](https://github.com/bombshell-dev/tab?tab=readme-ov-file#package-manager-completions) 集成。直接运行 vitest 时自动补全即可生效：

::: code-group
```bash [npm]
npm vitest <Tab>
```

```bash [npm]
npm exec vitest <Tab>
```

```bash [pnpm]
pnpm vitest <Tab>
```

```bash [yarn]
yarn vitest <Tab>
```

```bash [bun]
bun vitest <Tab>
```
:::

对于包管理器自动补全，需单独安装 [tab 的包管理器补全组件](https://github.com/bombshell-dev/tab?tab=readme-ov-file#package-manager-completions)。

## 选项 {#options}

::: tip
Vitest 同时支持 [CLI 参数](https://github.com/cacjs/cac#dot-nested-options) 的驼峰式(`--passWithNoTests`)和短横线式(`--pass-with-no-tests`)写法（例外情况：`--no-color` 和 `--inspect-brk` 必须使用短横线式）。

Vitest 还支持不同的指定值的方式：`--reporter dot` 和 `--reporter=dot` 都是有效的。

如果选项支持值数组，则需要多次传递选项：

```bash
vitest --reporter=dot --reporter=default
```

布尔值选项可以用 `no-` 前缀来否定。将值指定为 `false` 也有效：

```bash
vitest --no-api
vitest --api=false
```
:::

<!--@include: ./cli-generated.md-->

### shard

- **类型:** `string`
- **默认值:** disabled

  测试套件分片，格式为 `<index>/<count>`，其中

  - `count` 是正整数，表示分割的部分数
  - `index` 是正整数，表示当前分片的索引

  该命令将将所有测试分成 `count` 个相等的部分，并只运行位于 `index` 部分的测试。例如，要将测试套件分成三个部分，请使用以下命令：

```sh
vitest run --shard=1/3
vitest run --shard=2/3
vitest run --shard=3/3
```

::: warning 警告
无法在启用 `--watch`（默认情况下在开发中启用）时使用此选项。
:::

::: tip
如果使用 `--reporter=blob` 时未指定输出文件，默认路径将包含当前分片配置以及来自 `VITEST_BLOB_LABEL` 或 blob 报告器的 `label` 选项的 blob 标签，以避免与其他 Vitest 进程发生冲突。
:::

### merge-reports

- **类型:** `boolean | string`

合并指定文件夹（默认为 `.vitest/blob/`）中的所有 blob 报告。你可以对该命令使用任何报告器（[`blob`](/guide/reporters#blob-reporter) 报告器除外）：

```sh
vitest --merge-reports --reporter=junit
```
