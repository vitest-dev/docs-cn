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

请注意，即使插件选择退出模块缓存机制，你仍然可以定义缓存键生成器。

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

## experimental.printImportBreakdown <Version type="experimental">4.0.15</Version> {#experimental-printimportbreakdown}

::: tip 功能反馈
请将关于此功能反馈提交至 [GitHub Discussion](https://github.com/vitest-dev/vitest/discussions/9224)。
:::

- **类型:** `boolean`
- **默认值:** `false`

在测试运行完成后显示导入耗时明细。此选项仅适用于 [`default`](/guide/reporters#default)、[`verbose`](/guide/reporters#verbose) 或 [`tree`](/guide/reporters#tree) 报告器。

- Self：模块导入耗时，不包括静态导入；
- Total：模块导入耗时，包括静态导入。请注意，这不包括当前模块的 `transform` 时间。

<img alt="终端中导入耗时明细的示例" src="/reporter-import-breakdown.png" />

请注意，如果文件路径太长，Vitest 会从开头截断它，最多显示 45 个字符。

::: info
[Vitest UI](/guide/ui#import-breakdown) 会在至少一个文件加载时间超过 500 毫秒时自动显示导入耗时分析。你可手动将此选项设为 `false` 来禁用该功能。
:::
