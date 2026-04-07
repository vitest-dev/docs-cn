---
title: 实验性 | 配置
outline: deep
---

# experimental

## experimental.fsModuleCache <Version type="experimental">4.0.11</Version> {#experimental-fsmodulecache}

::: tip 功能反馈
请将关于此功能反馈提交至 [GitHub Discussion](https://github.com/vitest-dev/vitest/discussions/9221)。
:::

- **类型:** `boolean`
- **默认值:** `false`

启用此选项后， Vitest 会将缓存的模块保存在文件系统上，从而在重新运行测试时获得更快的执行速度。

你可以通过运行 [`vitest --clearCache`](/guide/cli#clearcache) 来删除旧缓存。

::: warning 浏览器支持
目前，此选项不会影响 [浏览器模式](/guide/browser/)。
:::

在运行 vitest 你可以设置 `DEBUG=vitest:cache:fs` 环境变量，来调试模块是否被缓存：

```shell
DEBUG=vitest:cache:fs vitest --experimental.fsModuleCache
```

### 已知问题 {#known-issues}

Vitest 基于文件内容、文件 id、vite 的环境配置及覆盖率状态生成持久性文件哈希值。虽然 Vitest 会尽可能利用所有可获取的配置信息，但目前仍存在局限性。由于缺乏标准接口支持，当前无法追踪插件选项的变更情况。

如果你的插件依赖文件内容或公开配置之外的因素（例如读取其他文件或目录），则可能出现缓存失效的情况。要解决这个问题，你可以定义一个 [缓存键生成器](/api/advanced/plugin#definecachekeygenerator) 来指定动态选项，或选择对该模块禁用缓存：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'vitest-cache',
      configureVitest({ experimental_defineCacheKeyGenerator }) {
        experimental_defineCacheKeyGenerator(({ id, sourceCode }) => {
          // 从不缓存此 id
          if (id.includes('do-not-cache')) {
            return false
          }

          // 根据动态变量的值缓存该文件
          if (sourceCode.includes('myDynamicVar')) {
            return process.env.DYNAMIC_VAR_VALUE
          }
        })
      }
    }
  ],
  test: {
    experimental: {
      fsModuleCache: true,
    },
  },
})
```
如果你是插件作者，当你的插件可以通过不同配置选项影响转换结果时，建议在插件中定义 [缓存键生成器](/api/advanced/plugin#definecachekeygenerator)。

另一方面，如果你的插件不应该影响缓存键，你可以通过将 `api.vitest.experimental.ignoreFsModuleCache` 设置为 `true` 来退出缓存机制：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'vitest-cache',
      api: {
        vitest: {
          experimental: {
            ignoreFsModuleCache: true,
          },
        },
      },
    },
  ],
  test: {
    experimental: {
      fsModuleCache: true,
    },
  },
})
```

请注意，即使插件选择禁用缓存模块，你仍然可以定义缓存键生成器。

## experimental.fsModuleCachePath <Version type="experimental">4.0.11</Version> {#experimental-fsmodulecachepath}

- **类型:** `string`
- **默认值:** `'node_modules/.experimental-vitest-cache'`

文件系统缓存所在的目录。

默认情况下，Vitest 会尝试查找工作区根目录，并将缓存存储在 `node_modules` 文件夹中。根目录的确定基于你所使用的包管理器的锁文件（例如，`.package-lock.json`、`.yarn-state.yml`、`.pnpm/lock.yaml` 等）。

目前，Vitest 会完全忽略 [test.cache.dir](/config/cache) 或 [cacheDir](https://vite.dev/config/shared-options#cachedir) 配置选项，并创建一个单独的缓存文件夹。

## experimental.openTelemetry <Version type="experimental">4.0.11</Version> {#experimental-opentelemetry}

::: tip 功能反馈
请将关于此功能反馈提交至 [GitHub Discussion](https://github.com/vitest-dev/vitest/discussions/9222)。
:::

- **类型:**

```ts
interface OpenTelemetryOptions {
  enabled: boolean
  /**
   * 暴露 Node.js OpenTelemetry SDK 的文件路径
   */
  sdkPath?: string
  /**
   * 暴露浏览器 OpenTelemetry SDK 的文件路径
   */
  browserSdkPath?: string
}
```

- **默认值:** `{ enabled: false }`

此选项控制 [OpenTelemetry](https://opentelemetry.io/) 支持。当 `enabled` 设置为 `true`，Vitest 会在主线程中以及每个测试文件之前导入 SDK 文件。

::: danger 性能警告
OpenTelemetry 可能会显著影响 Vitest 性能；建议仅在本地调试时启用它。
:::

你可以将 [自定义服务](/guide/open-telemetry) 与 Vitest 一起使用，以精确定位正在拖慢测试套件执行速度的测试或文件。

对于浏览器模式，请参阅 OpenTelemetry 指南的 [浏览器模式](/guide/open-telemetry#browser-mode) 部分。

`sdkPath` 的路径解析相对于项目的 [`root`](/config/root) 解析，应指向一个默认导出已初始化 SDK 实例的模块。例如：

::: code-group
```js [otel.js]
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { NodeSDK } from '@opentelemetry/sdk-node'

const sdk = new NodeSDK({
  serviceName: 'vitest',
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
})

sdk.start()
export default sdk
```
```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    experimental: {
      openTelemetry: {
        enabled: true,
        sdkPath: './otel.js',
      },
    },
  },
})
```
:::

::: warning
请注意 Node 必须能够直接处理 `sdkPath` 指向的内容，因为它不会被 Vitest 转换。了解如何在 Vitest 中使用 OpenTelemetry ，详情参阅 [指南](/guide/open-telemetry)。
:::

## experimental.importDurations <Version type="experimental">4.1.0</Version> {#experimental-importdurations}

::: tip 功能反馈
请将关于此功能反馈提交至 [GitHub Discussion](https://github.com/vitest-dev/vitest/discussions/9224)。
:::

- **类型:**

```ts
interface ImportDurationsOptions {
  /**
   * 何时在 CLI 终端打印导入耗时明细
   * - false: 从不打印（默认值）
   * - true: 总是打印
   * - 'on-warn': 仅当有导入超过警告阈值时打印
   */
  print?: boolean | 'on-warn'
  /**
   * 当任何导入超过危险阈值时使测试运行失败
   * 启用后若超过阈值，将始终打印明细
   * @default false
   */
  failOnDanger?: boolean
  /**
   * 收集并显示的最大导入数量
   */
  limit?: number
  /**
   * 持续时间阈值（毫秒），用于控制着色显示和警告触发。
   */
  thresholds?: {
    /** 黄色/警告颜色的阈值 @default 100 */
    warn?: number
    /** 红色/危险颜色及触发 failOnDanger 的阈值 @default 500 */
    danger?: number
  }
}
```

- **默认值:** `{ print: false, failOnDanger: false, limit: 0, thresholds: { warn: 100, danger: 500 } }` (`limit` is 10 if `print` or UI is enabled)

配置导入耗时收集与显示功能。

`print` 选项控制 CLI 终端的输出行为，`limit` 选项控制收集和显示的导入数量上限。[UI 模式](/guide/ui#import-breakdown) 始终可切换明细显示视图（不受 `print` 设置影响）。

- Self：模块导入耗时，不包括静态导入；
- Total：模块导入耗时，包括静态导入。请注意，这不包括当前模块的 `transform` 时间。

<img alt="终端中导入耗时明细的示例" src="/reporter-import-breakdown.png" />
<img alt="终端中导入耗时明细的示例" src="/reporter-import-breakdown-light.png" />

请注意，如果文件路径太长，Vitest 会从开头截断它，最多显示 45 个字符。

### experimental.importDurations.print {#experimental-importdurationsprint}

- **类型:** `boolean | 'on-warn'`
- **默认值:** `false`

控制测试结束后何时在 CLI 打印导入耗时分析。该功能仅适用于 [`default`](/guide/reporters#default)、[`verbose`](/guide/reporters#verbose) 或 [`tree`](/guide/reporters#tree) 报告器。

- `false`: 从不打印分析结果
- `true`: 总是打印分析结果
- `'on-warn'`: 仅当任何导入耗时超过 `thresholds.warn` 阈值时打印

### experimental.importDurations.failOnDanger {#experimental-importdurationsfailondanger}

- **类型:** `boolean`
- **默认值:** `false`

当任何导入操作耗时超过 `thresholds.danger` 阈值时，测试将会运行失败。启用该选项且超过阈值时，无论 `print` 如何设置，始终会打印性能分析报告。

该功能适用于在 CI 环境中确保导入操作符合性能预期：

```bash
vitest --experimental.importDurations.failOnDanger
```

### experimental.importDurations.limit {#experimental-importdurationslimit}

- **类型:** `number`
- **默认值:** `0`（如果启用 `print`、`failOnDanger` 或 UI 模式时默认为`10`）

在 CLI 输出、[UI 模式](/guide/ui#import-breakdown) 及第三方报告器中收集和显示的导入操作最大数量限制。

### experimental.importDurations.thresholds {#experimental-importdurationsthresholds}

- **类型:** `{ warn?: number; danger?: number }`
- **默认值:** `{ warn: 100, danger: 500 }`

用于着色和警告的耗时阈值（单位：毫秒）：

- `warn`：触发黄色/警告颜色的阈值（默认值：100毫秒）
- `danger`：触发红色/危险颜色及 `failOnDanger` 的阈值（默认值：500毫秒）

::: info
[UI 模式](/guide/ui#import-breakdown) 会在至少一个文件的加载时间超过 `danger` 阈值时，自动显示导入耗时分析。
:::

## experimental.viteModuleRunner <Version type="experimental">4.1.0</Version> {#experimental-vitemodulerunner}

::: tip 反馈
通过 [GitHub 讨论区](https://github.com/vitest-dev/vitest/discussions/9501) 提交关于此功能的反馈。
:::

- **类型:** `boolean`
- **默认值:** `true`

控制 Vitest 是否使用 Vite 的 [模块运行器](https://cn.vite.dev/guide/api-environment-runtimes#modulerunner) 执行代码，或回退至原生 `import` 方式。

如果在根配置中定义此选项，所有 [项目](/guide/projects) 将自动继承该设置。

当测试运行环境与代码执行环境相同时（例如服务端后端或简单脚本），可考虑禁用模块运行器。但对于 `jsdom`/`happy-dom` 测试，我们仍建议使用 Vite 模块运行器或在 [浏览器模式](/guide/browser/) 中运行，因为这样无需添加额外的配置。

禁用此选项将导致 _所有_ 文件转换失效：

- 测试文件及源码不会经过 Vite 处理
- 全局初始化文件不会被处理
- 自定义运行器 / 池 / 环境文件不会被处理
- 配置文件仍由 Vite 处理（该过程发生在 Vitest 获知 `viteModuleRunner` 标志之前执行）

::: warning
当前 Vitest 仍需依赖 Vite 实现某些功能，如模块图或监视模式。

另外请注意，此选项仅适用于`forks`或`threads`[执行池](/config/pool)。
:::

### 模块运行器 {#module-runner}

Vitest 默认在由 Vite [环境 API](https://cn.vite.dev/guide/api-environment.html#environment-api) 提供非常宽松的模块运行器沙箱中执行测试。所有文件被归类为 "inline" 模块或 "external" 模块。

模块运行器负责执行所有 "inline" 模块。它提供 `import.meta.env` 环境变量、`require` 函数、`__dirname` 和 `__filename` 路径变量、静态 `import` 语法，并具备独立的模块解析机制。这使得在不配置环境的情况下运行代码变得非常简单，只需要测试你编写的纯 JavaScript 逻辑是否按预期工作即可。

所有 "external" 模块均以原生模式运行，这意味着它们会在模块运行器的沙箱环境之外执行。当在 Node.js 环境中运行测试时，这些文件将通过原生 `import` 关键字导入，并由 Node.js 直接处理。

虽然在宽松的模拟环境中运行 JSDOM / happy-dom 测试可能具有合理性，但在非 Node.js 环境下运行 Node.js 测试可能会隐藏并抑制你在生产环境中可能遇到的潜在错误，尤其是当你的代码不需要 Vite 插件提供的任何额外转换时。

### 已知限制 {#known-limitations}

部分 Vitest 功能依赖于文件转换机制。Vitest 采用同步的 [Node.js Loaders API](https://nodejs.org/api/module.html#customization-hooks) 来转换测试文件和配置文件，以实现以下功能支持：

- [`import.meta.vitest`](/guide/in-source)
- [`vi.mock`](/api/vi#vi-mock)
- [`vi.hoisted`](/api/vi#vi-hoisted)

::: warning
这意味着 Vitest 至少需要 Node 22.15 才能使这些功能工作。目前，它们也不适用于 Deno 或 Bun。

Vitest 只会在测试文件中检测 `vi.mock` 和 `vi.hoisted`，它们不会在导入的模块中被提升。
:::

这可能会影响性能，因为 Vitest 需要读取文件并处理它。如果你不使用这些功能，可以通过将 `experimental.nodeLoader` 设置为 `false` 来禁用转换。Vitest 只在查找 `vi.mock` 或 `vi.hoisted` 时读取测试文件和全局初始化文件。在其他文件中使用它们不会将它们提升到文件顶部，并可能导致意外行为。

由于 `viteModuleRunner` 的性质，某些功能将不起作用，包括：

- 不支持 `import.meta.env`：`import.meta.env` 是 Vite 特性，使用 `process.env` 替代
- 不支持 `plugins`：由于不存在转换阶段，插件不会生效，通过 [`execArgv`](/config/execargv) 使用 [自定义钩子](https://nodejs.org/api/module.html#customization-hooks) 替代
- 不支持 `alias`：由于不存在转换阶段，路径别名不会生效
- `istanbul` 覆盖率工具无法工作（因缺少转换阶段），请改用 `v8` 覆盖率工具

::: warning 覆盖率支持
当前 Vitest 通过 `v8` 提供程序支持覆盖率分析，前提是文件能够被转换为 JavaScript。对于 TypeScript 转换，Vitest 使用 Node.js v22.13 版本起提供的 [`module.stripTypeScriptTypes`](https://nodejs.org/api/module.html#modulestriptypescripttypescode-options) 功能。如果你使用自定义 [模块加载器](https://nodejs.org/api/module.html#customization-hooks)，Vitest 将无法复用该加载器进行覆盖率分析所需的文件转换。
:::

关于模拟对象功能，需要特别指出的是 ES 模块不支持属性重写。这意味着以下代码将无法正常工作：

```ts
import * as fs from 'node:fs'
import { vi } from 'vitest'

vi.spyOn(fs, 'readFileSync').mockImplementation(() => '42') // ❌
```

但 Vitest 支持在不覆盖模块实现的情况下进行自动监听。当调用 `vi.mock` 并传入 `spy: true` 参数时，模块会以保留原始实现的方式被模拟，同时所有导出的函数都会被包裹在 `vi.fn()` 监听器中：

```ts
import * as fs from 'node:fs'
import { vi } from 'vitest'

vi.mock('node:fs', { spy: true })

fs.readFileSync.mockImplementation(() => '42') // ✅
```

工厂模拟功能通过顶层 await 实现。这意味着在你的源代码中无法使用 `require()` 加载被模拟的模块：

```ts
vi.mock('node:fs', async (importOriginal) => {
  return {
    ...await importOriginal(),
    readFileSync: vi.fn(),
  }
})

const fs = require('node:fs') // 报错
```

这种限制源自于工厂函数可以是异步的。不过这不构成问题，因为 Vitest 默认不会模拟 `node_modules` 中的内置模块，这类似于 Vitest 默认的工作方式。

### TypeScript

如果你使用的是 Node.js 22.18/23.6 或更高版本，TypeScript 将由 Node.js [原生支持转换](https://nodejs.org/en/learn/typescript/run-natively)。

::: warning  在 Node.js 22.6-22.18 环境中的使用 TypeScript
如果您使用的 Node.js 版本介于 22.6 至 22.18 之间，还可通过 `--experimental-strip-types` 参数启用原生 TypeScript 支持：

```shell
NODE_OPTIONS="--experimental-strip-types" vitest
```

如果你使用的是 TypeScript 且 Node.js 版本低于 22.6，则需要执行以下任一操作：

- 构建测试文件和源代码并直接运行这些文件
- 通过 `execArgv` 参数导入 [自定义加载器](https://nodejs.org/api/module.html#customization-hooks)

```ts
import { defineConfig } from 'vitest/config'

const tsxApi = import.meta.resolve('tsx/esm/api')

export default defineConfig({
  test: {
    execArgv: [
      `--import=data:text/javascript,import * as tsx from "${tsxApi}";tsx.register()`,
    ],
    experimental: {
      viteModuleRunner: false,
    },
  },
})
```

如果你在 Deno 中运行测试，TypeScript 文件由运行时处理，无需任何额外配置。
:::

## experimental.vcsProvider <Version type="experimental">4.1.1</Version> {#experimental-vcsprovider}

- **类型:** `VCSProvider | string`

```ts
interface VCSProvider {
  findChangedFiles(options: VCSProviderOptions): Promise<string[]>
}

interface VCSProviderOptions {
  root: string
  changedSince?: string | boolean
}
```

- **默认值:** `'git'`

用于检测更改文件的自定义驱动。与 [`--changed`](/guide/cli#changed) 标志配合使用，用于确定哪些文件已被修改。

默认情况下，Vitest 使用 Git 检测更改的文件。你可以提供 `VCSProvider` 接口的自定义实现以使用不同的版本控制系统：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    experimental: {
      vcsProvider: {
        async findChangedFiles({ root, changedSince }) {
          // 返回已变更的文件路径
          return []
        },
      },
    },
  },
})
```

你也可以传入一个字符串路径，指向包含实现 `VCSProvider` 接口的默认导出模块：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    experimental: {
      vcsProvider: './my-vcs-provider.js',
    },
  },
})
```

```js [my-vcs-provider.js]
export default {
  async findChangedFiles({ root, changedSince }) {
    // 返回已变更的文件路径
    return []
  },
}
```

## experimental.nodeLoader <Version type="experimental">4.1.0</Version> {#experimental-nodeloader}

- **类型:** `boolean`
- **默认值:** `true`

如果禁用模块运行器，Vitest 会使用原生 [Node.js 模块加载器](https://nodejs.org/api/module.html#customization-hooks) 来转换文件，以支持 `import.meta.vitest`、`vi.mock` 和 `vi.hoisted` 功能。

<<<<<<< HEAD
如果你不使用这些特性，可禁用此功能以提升性能。
=======
If you don't use these features, you can disable this to improve performance.

## experimental.preParse <Version type="experimental">4.1.3</Version> {#experimental-preparse}

- **Type:** `boolean`
- **Default:** `false`

Parses test specifications before running them. This applies the [`.only`](/api/test#test-only) modifier, the [`-t`](/config/testnamepattern) test name pattern, [`--tags-filter`](/guide/test-tags#syntax), [test lines](/api/advanced/test-specification#testlines), and [test IDs](/api/advanced/test-specification#testids) across all files without executing them. For example, if only a single test is marked with `.only`, Vitest will skip all other tests in all files.

::: tip
This option is recommended when using [`.only`](/api/test#test-only), the [`-t`](/config/testnamepattern) flag, or [`--tags-filter`](/guide/test-tags#syntax).

Enabling it unconditionally may slow down your test runs due to the additional parsing step.
:::

::: warning
Pre-parsing uses static analysis (AST parsing) instead of executing your test files. This means that test names, tags, and modifiers (`.only`, `.skip`, `.todo`) must be statically analyzable. Dynamic test names (e.g., names stored in variables or returned from function calls) and non-literal tags will not be resolved correctly.

```ts
// ✅ works — static string literal
test('adds numbers', () => {})

// ✅ works — static tags
test('my test', { tags: ['unit'] }, () => {})

// ❌ won't match correctly — dynamic name
const name = getName()
test(name, () => {})

// ❌ won't match correctly — dynamic tags
const tags = getTags()
test('my test', { tags }, () => {})
```
:::
>>>>>>> fc4848519eb94e3429e973de7a38d3c4a8e841f5
