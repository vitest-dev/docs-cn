# 性能测试分析 {#profiling-test-performance}

当你运行 Vitest 时，会显示你的多个时间指标：

> ```bash
> RUN  v2.1.1 /x/vitest/examples/profiling
>
> ✓ test/prime-number.test.ts (1) 4517ms
>   ✓ generate prime number 4517ms
>
> Test Files  1 passed (1)
>      Tests  1 passed (1)
>   Start at  09:32:53
>   Duration  4.80s (transform 44ms, setup 0ms, import 35ms, tests 4.52s, environment 0ms)
>   # Time metrics ^^
> ```

- Transform：转换文件所用的时间。详情请参阅 [文件转换](#file-transform)。
- Setup：执行 [`setupFiles`](/config/setupfiles) 文件所花费的时间。
- Import：导入测试文件及其依赖项所花费的时间。这也包括收集所有测试所花费的时间。注意，这不包括测试内部的动态导入。
- Tests：实际执行测试用例所用的时间。
- Environment：[`配置测试`](/config/environment) 环境（比如 JSDOM）所需的时间。

## 测试运行器 {#test-runner}

当测试执行时间较长的时候，可以生成测试运行器的性能分析报告。可以参考 NodeJS 文档来了解和使用这些选项：

- [`--cpu-prof`](https://nodejs.org/api/cli.html#--cpu-prof)
- [`--heap-prof`](https://nodejs.org/api/cli.html#--heap-prof)
- [`--prof`](https://nodejs.org/api/cli.html#--prof)

:::warning
由于 `node:worker_threads` 的限制，`--prof` 不能与 `pool: 'threads'` 一起使用。
:::

要将这些选项传递给 Vitest 的测试运行器，请在 Vitest 配置中定义 `execArgv`：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    fileParallelism: false,
    execArgv: [
      '--cpu-prof',
      '--cpu-prof-dir=test-runner-profile',
      '--heap-prof',
      '--heap-prof-dir=test-runner-profile'
    ],
  },
})
```

测试运行后，应该会生成 `test-runner-profile/*.cpuprofile` 和 `test-runner-profile/*.heapprofile` 文件。想要知道如何分析这些文件，可以仔细查看 [性能分析记录](#inspecting-profiling-records)。

也可以看看 [性能分析 | 示例](https://github.com/vitest-dev/vitest/tree/main/examples/profiling)。

## 主线程 {#main-thread}

对主线程进行性能分析有助于调试 Vitest 的 Vite 使用情况和 [`globalSetup`](/config/globalsetup) 文件。
这也是 Vite 插件运行的地方。

:::tip
可以查看 [性能 | Vite](https://cn.vitejs.dev/guide/performance) 以获取更多关于 Vite 特定性能分析的提示。

我们推荐使用 [`vite-plugin-inspect`](https://github.com/antfu-collective/vite-plugin-inspect) 来分析你的 Vite 插件性能。
:::

要执行此操作，需要向运行 Vitest 的 Node 进程传递参数。

```bash
$ node --cpu-prof --cpu-prof-dir=main-profile ./node_modules/vitest/vitest.mjs --run
#      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^                                  ^^^^^
#               NodeJS arguments                                           Vitest arguments
```

测试运行后会生成一个 `main-profile/*.cpuprofile` 文件。有关如何分析这些文件的说明，可以查看 [检查分析记录](#inspecting-profiling-records)。

## 文件转换 {#file-transform}

种分析策略有助于识别由 [桶文件](https://cn.vitejs.dev/guide/performance.html#avoid-barrel-files) 引起的不必要转换。如果这些日志包含在运行测试时不应加载的文件，你可能有一些桶文件在导入不必要的文件。

也可以使用 [UI 模式](/guide/ui) 来调试由打包文件引起的缓慢问题。
下面的例子展示了不使用打包文件导入文件可以减少约 85% 的转换文件数量。

::: code-group

```[File tree]
├── src
│   └── utils
│       ├── currency.ts
│       ├── formatters.ts  <-- File to test
│       ├── index.ts
│       ├── location.ts
│       ├── math.ts
│       ├── time.ts
│       └── users.ts
├── test
│   └── formatters.test.ts
└── vitest.config.ts
```

```ts [example.test.ts]
import { expect, test } from 'vitest'
import { formatter } from '../src/utils' // [!code --]
import { formatter } from '../src/utils/formatters' // [!code ++]

test('formatter works', () => {
  expect(formatter).not.toThrow()
})
```

:::

<img src="/module-graph-barrel-file.png" alt="Vitest UI 模式展示桶文件问题" />

要查看文件是如何被转换的，你可以在 UI 模式 中打开 "模块信息" 视图：

<img alt="The module info view for an inlined module" img-light src="/ui/light-module-info.png">
<img alt="The module info view for an inlined module" img-dark src="/ui/dark-module-info.png">

## 文件导入 {#file-import}

有些模块加载时间较长。要识别哪些模块最慢，请在配置中启用 [`experimental.importDurations`](/config/experimental#experimental-importdurations)：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    experimental: {
      importDurations: {
        print: true,
      },
    },
  },
})
```

这将在测试完成后打印最慢导入的详情：

```bash
Import Duration Breakdown (Top 10)

Module                      Self     Total
my-test.test.ts              5ms    620ms [████████████████████]
date-fns/index.js          500ms    500ms [████████████████░░░░] # [!code error]
src/utils/helpers.ts        10ms    120ms [████████░░░░░░░░░░░░]
```

你也可以在不更改配置的情况下，在 CLI 传递 `--experimental.importDurations.print` 参数：

```bash
vitest --experimental.importDurations.print
```

一旦识别出慢速模块，有几种策略可以加速导入：

### 使用特定入口 {#use-specific-entry-points}

许多库提供了多个入口点。导入主入口点（通常是 [桶文件](https://cn.vitejs.dev/guide/performance.html#avoid-barrel-files)）可能会引入比你所需多得多的代码。

例如，`date-fns` 从其主入口点重新导出了数百个函数。与其从顶层模块导入，不如直接从特定入口导入：

```ts
import { format } from 'date-fns' // [!code --]
import { format } from 'date-fns/format' // [!code ++]
```

### 使用 `resolve.alias` 重定向导入 {#use-resolve-alias-to-redirect-imports}

如果一个依赖没有提供细粒度的入口，或者第三方代码导入了重量级入口点，你可以使用 [`resolve.alias`](https://cn.vite.dev/config/shared-options#resolve-alias) 将导入重定向到更轻量的替代方案：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^date-fns$/,
        replacement: join(dirname(require.resolve('date-fns/package.json')), 'index.cjs'),
      },
    ]
  },
})
```

### 使用依赖优化器 {#use-the-dependency-optimizer}

Vitest 可以使用 [`deps.optimizer`](/config/deps#deps-optimizer) 将外部库打包到单个文件中，这减少了导入具有许多内部模块的包的开销：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    deps: {
      optimizer: {
        ssr: {
          enabled: true,
          include: ['date-fns'],
        },
      },
    },
  },
})
```

这对于 UI 库和具有深层导入树的包极其有效。对于 `node`/`edge` 环境使用 `optimizer.ssr`，对于 `jsdom`/`happy-dom` 环境使用 `optimizer.client`。

## 代码覆盖率 {#code-coverage}

如果你的项目中代码覆盖率生成较慢，你可以使用 `DEBUG=vitest:coverage` 环境变量来启用性能日志记录。

```bash
$ DEBUG=vitest:coverage vitest --run --coverage

 RUN  v3.1.1 /x/vitest-example

  vitest:coverage Reading coverage results 2/2
  vitest:coverage Converting 1/2
  vitest:coverage 4 ms /x/src/multiply.ts
  vitest:coverage Converting 2/2
  vitest:coverage 552 ms /x/src/add.ts
  vitest:coverage Uncovered files 1/2
  vitest:coverage File "/x/src/large-file.ts" is taking longer than 3s # [!code error]
  vitest:coverage 3027 ms /x/src/large-file.ts
  vitest:coverage Uncovered files 2/2
  vitest:coverage 4 ms /x/src/untested-file.ts
  vitest:coverage Generate coverage total time 3521 ms
```

这种性能分析方法非常适合检测被覆盖率提供程序意外包含的大文件。
例如，如果你的配置意外地将大型构建压缩后的 JavaScript 文件包含在代码覆盖率中，这些文件应该会出现在日志中。
在这种情况下，你可能需要调整 [`coverage.include`](/config/coverage#coverage-include) 和 [`coverage.exclude`](/config/coverage#coverage-exclude) 选项。

## 性能记录分析 {#inspecting-profiling-records}

可以使用各种工具检查 `*.cpuprofile` 和 `*.heapprofile` 的内容。下面是一些示例。

- [Speedscope](https://www.speedscope.app/)
- [在 Visual Studio Code 中对 JavaScript 进行性能分析](https://code.visualstudio.com/docs/nodejs/profiling#_analyzing-a-profile)
- [使用性能面板分析 Node.js 性能 | developer.chrome.com](https://developer.chrome.com/docs/devtools/performance/nodejs#analyze)
- [内存面板概览 | developer.chrome.com](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots#view_snapshots)
