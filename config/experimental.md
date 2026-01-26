---
title: 实验性 | Config
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

<!-- TODO: translation -->

::: tip 功能反馈
请将关于此功能反馈提交至 [GitHub Discussion](https://github.com/vitest-dev/vitest/discussions/9224)。
:::

- **Type:**

```ts
interface ImportDurationsOptions {
  /**
   * Print import breakdown to CLI terminal after tests finish.
   */
  print?: boolean
  /**
   * Maximum number of imports to collect and display.
   */
  limit?: number
}
```

- **Default:** `{ print: false, limit: 0 }` (`limit` is 10 if `print` or UI is enabled)

Configure import duration collection and display.

The `print` option controls CLI terminal output. The `limit` option controls how many imports to collect and display. [Vitest UI](/guide/ui#import-breakdown) can always toggle the breakdown display regardless of the `print` setting.

- Self：模块导入耗时，不包括静态导入；
- Total：模块导入耗时，包括静态导入。请注意，这不包括当前模块的 `transform` 时间。

<img alt="终端中导入耗时明细的示例" src="/reporter-import-breakdown.png" />

请注意，如果文件路径太长，Vitest 会从开头截断它，最多显示 45 个字符。

### experimental.importDurations.print {#experimental-importdurationsprint}

- **Type:** `boolean`
- **Default:** `false`

Print import breakdown to CLI terminal after tests finish. This only works with [`default`](/guide/reporters#default), [`verbose`](/guide/reporters#verbose), or [`tree`](/guide/reporters#tree) reporters.

### experimental.importDurations.limit {#experimental-importdurationslimit}

- **Type:** `number`
- **Default:** `0` (or `10` if `print` or UI is enabled)

Maximum number of imports to collect and display in CLI output, [Vitest UI](/guide/ui#import-breakdown), and third-party reporters.

::: info
[Vitest UI](/guide/ui#import-breakdown) 会在至少一个文件加载时间超过 500 毫秒时自动显示导入耗时分析。你可手动将此选项设为 `false` 来禁用该功能。
:::

<!-- TODO: translation -->

## experimental.viteModuleRunner <Version type="experimental">4.1.0</Version> {#experimental-vitemodulerunner}

- **Type:** `boolean`
- **Default:** `true`

Controls whether Vitest uses Vite's [module runner](https://vite.dev/guide/api-environment-runtimes#modulerunner) to run the code or fallback to the native `import`.

If this option is defined in the root config, all [projects](/guide/projects) will inherit it automatically.

Consider disabling the module runner if you are running tests in the same environment as your code (server backend or simple scripts, for example). However, we still recommend running `jsdom`/`happy-dom` tests with Vite's module runner or in [the browser](/guide/browser/) since it doesn't require any additional configuration.

Disabling this flag will disable _all_ file transforms:

- test files and your source code are not processed by Vite
- your global setup files are not processed
- your custom runner/pool/environment files are not processed
- your config file is still processed by Vite (this happens before Vitest knows the `viteModuleRunner` flag)

::: warning
At the moment, Vitest still requires Vite for certain functionality like the module graph or watch mode.

Also note that this option only works with `forks` or `threads` [pools](/config/pool).
:::

### Module Runner

By default, Vitest runs tests in a very permissive module runner sandbox powered by Vite's [Environment API](https://vite.dev/guide/api-environment.html#environment-api). Every file is categorized as either an "inline" module or an "external" module.

Module runner runs all "inlined" modules. It provides `import.meta.env`, `require`, `__dirname`, `__filename`, static `import`, and has its own module resolution mechanism. This makes it very easy to run code when you don't want to configure the environment and just need to test that the bare JavaScript logic you wrote works as intended.

All "external" modules run in native mode, meaning they are executed outside of the module runner sandbox. If you are running tests in Node.js, these files are imported with the native `import` keyword and processed by Node.js directly.

While running JSDOM/happy-dom tests in a permissive fake environment might be justified, running Node.js tests in a non-Node.js environment can hide and silence potential errors you may encounter in production, especially if your code doesn't require any additional transformations provided by Vite plugins.

### Known Limitations

Some Vitest features rely on files being transformed. Vitest uses synchronous [Node.js Loaders API](https://nodejs.org/api/module.html#customization-hooks) to transform test files and setup files to support these features:

- [`import.meta.vitest`](/guide/in-source)
- [`vi.mock`](/api/vi#vi-mock)
- [`vi.hoisted`](/api/vi#vi-hoisted)

::: warning
This means that Vitest requires at least Node 22.15 for those features to work. At the moment, they also do not work in Deno or Bun.

Vitest will only detect `vi.mock` and `vi.hoisted` inside of test files, they will not be hoisted inside imported modules.
:::

This could affect performance because Vitest needs to read the file and process it. If you do not use these features, you can disable the transforms by setting `experimental.nodeLoader` to `false`. Vitest only reads test files and setup files while looking for `vi.mock` or `vi.hoisted`. Using these in other files won't hoist them to the top of the file and can lead to unexpected behavior.

Some features will not work due to the nature of `viteModuleRunner`, including:

- no `import.meta.env`: `import.meta.env` is a Vite feature, use `process.env` instead
- no `plugins`: plugins are not applied because there is no transformation phase, use [customization hooks](https://nodejs.org/api/module.html#customization-hooks) via [`execArgv`](/config/execargv) instead
- no `alias`: aliases are not applied because there is no transformation phase
- `istanbul` coverage provider doesn't work because there is no transformation phase, use `v8` instead

::: warning Coverage Support
At the momemnt Vitest supports coverage via `v8` provider as long as files can be transformed into JavaScript. To transform TypeScript, Vitest uses [`module.stripTypeScriptTypes`](https://nodejs.org/api/module.html#modulestriptypescripttypescode-options) which is available in Node.js since v22.13. If you are using a custom [module loader](https://nodejs.org/api/module.html#customization-hooks), Vitest is not able to reuse it to transform files for analysis.
:::

With regards to mocking, it is also important to point out that ES modules do not support property override. This means that code like this won't work anymore:

```ts
import * as fs from 'node:fs'
import { vi } from 'vitest'

vi.spyOn(fs, 'readFileSync').mockImplementation(() => '42') // ❌
```

However, Vitest supports auto-spying on modules without overriding their implementation. When `vi.mock` is called with a `spy: true` argument, the module is mocked in a way that preserves original implementations, but all exported functions are wrapped in a `vi.fn()` spy:

```ts
import * as fs from 'node:fs'
import { vi } from 'vitest'

vi.mock('node:fs', { spy: true })

fs.readFileSync.mockImplementation(() => '42') // ✅
```

Factory mocking is implemented using a top-level await. This means that mocked modules cannot be loaded with `require()` in your source code:

```ts
vi.mock('node:fs', async (importOriginal) => {
  return {
    ...await importOriginal(),
    readFileSync: vi.fn(),
  }
})

const fs = require('node:fs') // throws an error
```

This limitation exists because factories can be asynchronous. This should not be a problem because Vitest doesn't mock builtin modules inside `node_modules`, which is simillar to how Vitest works by default.

### TypeScript

If you are using Node.js 22.18/23.6 or higher, TypeScript will be [transformed natively](https://nodejs.org/en/learn/typescript/run-natively) by Node.js.

::: warning TypeScript with Node.js 22.6-22.18
If you are using Node.js version between 22.6 and 22.18, you can also enable native TypeScript support via `--experimental-strip-types` flag:

```shell
NODE_OPTIONS="--experimental-strip-types" vitest
```

If you are using TypeScript and Node.js version lower than 22.6, then you will need to either:

- build your test files and source code and run those files directly
- import a [custom loader](https://nodejs.org/api/module.html#customization-hooks) via `execArgv` flag

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

If you are running tests in Deno, TypeScript files are processed by the runtime without any additional configurations.
:::

## experimental.nodeLoader <Version type="experimental">4.1.0</Version> {#experimental-nodeloader}

- **Type:** `boolean`
- **Default:** `true`

If module runner is disabled, Vitest uses a native [Node.js module loader](https://nodejs.org/api/module.html#customization-hooks) to transform files to support `import.meta.vitest`, `vi.mock` and `vi.hoisted`.

If you don't use these features, you can disable this to improve performance.
