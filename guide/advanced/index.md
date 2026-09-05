---
title: 高级 API
---

# 快速起步 <Badge type="danger">advanced</Badge> {#getting-started}

::: warning
本指南列出了通过 Node.js 脚本运行测试的高级 API。如果你只是想 [运行测试](/guide/)，你可能不需要这些内容。这些 API 主要用于库作者。
:::

你可以从 `vitest/node` 入口点导入任何方法。

## startVitest

```ts
function startVitest(
  cliFilters: string[] = [],
  options: CliOptions = {},
  viteOverrides?: ViteUserConfig,
  vitestOptions?: VitestOptions,
): Promise<Vitest>
```

你可以使用 Vitest 的 Node API 开始运行测试：

```js
import { startVitest } from 'vitest/node'

const vitest = await startVitest()

await vitest.close()
```

`startVitest` 函数如果可以启动测试，将返回一个 [`Vitest`](/api/advanced/vitest) 实例。

如果未启用监视模式，Vitest 将自动调用 `close` 方法。

如果启用了监视模式且终端支持 TTY，Vitest 将注册控制台快捷键。

你可以将过滤器列表作为第二个参数传递。Vitest 将仅运行文件路径中包含至少一个传递字符串的测试。

此外，你可以使用第三个参数传递 CLI 参数，这些参数将覆盖任何测试配置选项。或者，你可以将完整的 Vite 配置作为第四个参数传递，这将优先于任何其他用户定义的选项。

运行测试后，你可以从 [`state.getTestModules`](/api/advanced/test-module) API 获取结果：

```ts
import type { TestModule } from 'vitest/node'

const vitest = await startVitest()

console.log(vitest.state.getTestModules()) // [TestModule]
```

::: tip
[“运行测试”](/guide/advanced/tests#startvitest) 指南中有使用示例。
:::

## createVitest

```ts
function createVitest(
  options: CliOptions,
  viteOverrides: ViteUserConfig = {},
  vitestOptions: VitestOptions = {},
): Promise<Vitest>
```

你可以使用 `createVitest` 函数创建一个 Vitest 实例。它返回与 `startVitest` 相同的 [`Vitest`](/api/advanced/vitest) 实例，但不会启动测试也不会验证已安装的包。

```js
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test', {
  watch: false,
})
```

::: tip
[“运行测试”](/guide/advanced/tests#createvitest) 指南中有使用示例。
:::

## resolveConfig

```ts
function resolveConfig(
  options: UserConfig = {},
  viteOverrides: ViteUserConfig = {},
  harness?: PluginHarness,
): Promise<ResolvedViteConfig>
```

此方法使用自定义参数解析配置，而不会创建 Vite 服务器。如果未提供任何参数，root 将设为 process.cwd()。

该方法返回解析后的 Vite 配置。其 `test` 属性包含完整解析后的 Vitest 配置，其中包括所有项目。

```ts
import { resolveConfig } from 'vitest/node'

const viteConfig = await resolveConfig({
  mode: 'custom',
  configFile: false,
  resolve: {
    conditions: ['custom']
  },
  test: {
    setupFiles: ['/my-setup-file.js'],
    pool: 'threads',
  },
})

viteConfig.test.pool // 'threads'
```

::: info
由于 Vite 的 `createServer` 工作方式， Vitest 必须在插件的 `configResolve` 钩子中解析配置。因此，此方法实际上并未在内部使用，而是仅作为公共 API 暴露。如果你将配置传递给 `startVitest` 或 `createVitest` API ， Vitest 仍然会重新解析配置。
:::

::: warning
`resolveConfig` 不会解析 `workspace`。要解析工作区配置， Vitest 需要一个已建立的 Vite 服务器。

另外请注意，`viteConfig.test` 不会被完全解析。如果你需要 Vitest 配置，请使用 `vitestConfig` 代替。
:::

## 解析项目配置 {#project-configuration-resolution}

本节说明 `startVitest`、`createVitest` 和 `resolveConfig` 的参数如何影响 [测试项目](/guide/projects)。在没有项目配置的情况下，解析后的所有选项都会应用于唯一的顶级项目，因此无须考虑以下规则。

顶级配置由以下三类输入解析而成，优先级从低到高依次为：

1. 顶级配置文件
2. `viteOverrides`，其内容会覆盖配置文件中的对应值
3. CLI 选项（`options`），其优先级高于其他所有配置

每个项目随后独立解析其自身的 Vite 配置：

- 通过配置文件或目录引用的项目只解析自身的配置文件，不会继承顶级配置中的任何选项。
- 默认情况下，内联项目会继承顶级配置（参阅 [`extends`](/guide/projects#configuration)）。会为该项目重新执行顶级配置文件，然后合并 `viteOverrides`，最后再合并项目自身的选项。即使不存在顶级配置文件，继承仍然有效，因为 `viteOverrides` 也属于最终生效的顶级配置。
- 设置 `extends: false` 后，内联项目只解析自身的选项。设置 `extends: './path'` 后，会重新执行所引用的文件，而不是顶级配置文件，并且不会合并 `viteOverrides`。

以下选项不会按常规规则继承：

- 永远不会继承 `viteOverrides` 中的 `plugins`。配置文件会为每个项目重新执行，从而创建新的插件实例；但通过 `viteOverrides` 传入的插件实例属于顶级 Vite 服务器，无法与项目服务器共享。
- 永远不会继承 `viteOverrides` 中的 `test.browser` 和 `test.tagsFilter`。`browser` 描述单个项目的浏览器实例，而 `tagsFilter` 作用于整次测试运行。
- 永远不会继承 `name` 和 `projects`。顶级配置中的 `globalSetup` 也不会被继承，因为它已经会在每次测试运行时执行一次。
- 项目自身的 `tags` 始终会替换从被继承配置中合并而来的 `tags` 数组，而不是与其拼接，因此可以重新定义同名标签。

独立与 `extends` 机制，以下两组选项都会应用于每个项目：

- 一组用于控制测试运行方式的固定 CLI 选项，例如 `--testTimeout`、`--retry` 和 `--pool`，会以最高优先级应用于每个项目，与顶级配置的解析方式一致。
- 运行级选项只对整次测试运行有意义，因此每个项目都会使用顶级配置解析后的 `coverage`、`attachmentsDir` 和 `mergeReportsLabel` 值。

## parseCLI

```ts
function parseCLI(argv: string | string[], config: CliParseOptions = {}): {
  filter: string[]
  options: CliOptions
}
```

你可以使用此方法来解析 CLI 参数。它接受一个字符串（其中参数以单个空格分隔）或一个与 Vitest CLI 使用的格式相同的 CLI 参数字符串数组。它返回一个过滤器和 `options`，你可以在稍后传递给 `createVitest` 或 `startVitest` 方法。

```ts
import { parseCLI } from 'vitest/node'

const result = parseCLI('vitest ./files.ts --coverage --browser=chrome')

result.options
// {
//   coverage: { enabled: true },
//   browser: { name: 'chrome', enabled: true }
// }

result.filter
// ['./files.ts']
```

## createCLI

```ts
function createCLI(options?: CliParseOptions): CAC
```

创建 Vitest 命令行界面，返回一个注册了 Vitest 全部命令和选项的 [`cac`](https://github.com/cacjs/cac) 实例。[`parseCLI`](#parsecli) 基于该实例实现；如果需要直接使用原始解析器，请调用 `createCLI`。

```ts
import { createCLI } from 'vitest/node'

const cli = createCLI()
```

## PluginHarness

```ts
class PluginHarness {
  vitest?: Vitest
  version: string
  logger: Logger
  packageInstaller: VitestPackageInstaller
  getVitest(): Vitest
}
```

这是一个容器，在配置解析期间、[`Vitest`](/api/advanced/vitest) 会将此容器传递给内部插件。它保存 [`Logger`](#logger)、包安装器和解析后的版本，并在 `Vitest` 实例创建后通过 `getVitest()` 提供该实例（如果提前调用此方法，则会抛出错误）。

这是一个面向插件的高级 API。通常有很少机会直接实现它。但你可以向 [`resolveConfig`](#resolveconfig) 传递一个共享实例，以复用日志记录器和包安装器。

## Logger

```ts
class Logger {
  constructor(
    outputStream?: Writable,
    errorStream?: Writable,
  )
}
```

Vitest 的终端日志记录器，通过 [`vitest.logger`](/api/advanced/vitest) 暴露。它负责格式化输出、错误摘要、运行横幅和终端清屏。以编程方式运行 Vitest 时，可以使用自定义的 `stdout`/`stderr` 流创建 `Logger`，以捕获或重定向 Vitest 的输出。

```ts
import { Logger } from 'vitest/node'

const logger = new Logger(process.stdout, process.stderr)
```
