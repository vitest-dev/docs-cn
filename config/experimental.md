---
title: experimental | Config
outline: deep
---

# experimental

## experimental.fsModuleCache <Version type="experimental">4.0.11</Version> {#experimental-fsmodulecache}

::: tip 功能反馈
请将关于此功能反馈提交至 [GitHub Discussion](https://github.com/vitest-dev/vitest/discussions/9221)。
:::

- **类型:** `boolean`
- **默认值:** `false`

启用此选项允许 Vitest 将缓存的模块保存在文件系统上，使测试在重新运行之间运行得更快。

你可以通过运行 [`vitest --clearCache`](/guide/cli#clearcache) 来删除旧缓存。

::: warning 浏览器支持
目前，此选项不影响[浏览器](/guide/browser/)。
:::

你可以通过使用 `DEBUG=vitest:cache:fs` 环境变量运行 vitest 来调试模块是否被缓存：

```shell
DEBUG=vitest:cache:fs vitest --experimental.fsModuleCache
```

### 已知问题 {#known-issues}

Vitest 基于文件内容、其 id、vite 的环境配置和覆盖率状态创建持久文件哈希。Vitest 尝试使用它拥有的关于配置的尽可能多的信息，但它仍然不完整。目前，无法跟踪你的插件选项，因为没有标准接口。

如果你有一个依赖于文件内容或公共配置之外的内容（如读取另一个文件或文件夹）的插件，缓存可能会变得陈旧。要解决这个问题，你可以定义一个[缓存键生成器](/api/advanced/plugin#definecachekeygenerator)来指定动态选项或选择不缓存该模块：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'vitest-cache',
      configureVitest({ experimental_defineCacheKeyGenerator }) {
        experimental_defineCacheKeyGenerator(({ id, sourceCode }) => {
          // 永不缓存此 id
          if (id.includes('do-not-cache')) {
            return false
          }

          // 基于动态变量的值缓存此文件
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

如果你是插件作者，如果你的插件可以使用影响转换结果的不同选项进行注册，请考虑在插件中定义一个[缓存键生成器](/api/advanced/plugin#definecachekeygenerator)。

另一方面，如果你的插件不应该影响缓存键，你可以通过将 `api.vitest.experimental.ignoreFsModuleCache` 设置为 `true` 来选择退出：

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

请注意，即使插件选择退出模块缓存，你仍然可以定义缓存键生成器。

## experimental.fsModuleCachePath <Version type="experimental">4.0.11</Version> {#experimental-fsmodulecachepath}

- **类型:** `string`
- **默认值:** `'node_modules/.experimental-vitest-cache'`

文件系统缓存所在的目录。

默认情况下，Vitest 会尝试找到工作区根目录并将缓存存储在 `node_modules` 文件夹中。根目录基于你的包管理器的锁文件（例如，`.package-lock.json`、`.yarn-state.yml`、`.pnpm/lock.yaml` 等）。

目前，Vitest 完全忽略 [test.cache.dir](/config/cache) 或 [cacheDir](https://vite.dev/config/shared-options#cachedir) 选项，并创建一个单独的文件夹。

## experimental.openTelemetry <Version type="experimental">4.0.11</Version> {#experimental-opentelemetry}

::: tip 功能反馈
请将关于此功能反馈提交至 [GitHub Discussion](https://github.com/vitest-dev/vitest/discussions/9222)。
:::

- **类型:**

```ts
interface OpenTelemetryOptions {
  enabled: boolean
  /**
   * 暴露 Node.js OpenTelemetry SDK 的文件路径。
   */
  sdkPath?: string
  /**
   * 暴露浏览器 OpenTelemetry SDK 的文件路径。
   */
  browserSdkPath?: string
}
```

- **默认值:** `{ enabled: false }`

此选项控制 [OpenTelemetry](https://opentelemetry.io/) 支持。如果 `enabled` 设置为 `true`，Vitest 会在主线程中以及每个测试文件之前导入 SDK 文件。

::: danger 性能注意事项
OpenTelemetry 可能会显著影响 Vitest 性能；仅在本地调试时启用它。
:::

你可以将[自定义服务](/guide/open-telemetry)与 Vitest 一起使用，以精确定位哪些测试或文件正在拖慢你的测试套件。

对于浏览器模式，请参阅 OpenTelemetry 指南的[浏览器模式](/guide/open-telemetry#browser-mode)部分。

`sdkPath` 相对于项目的 [`root`](/config/root) 解析，应指向一个将已启动的 SDK 实例作为默认导出暴露的模块。例如：

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
重要的是 Node 能够处理 `sdkPath` 内容，因为它不会被 Vitest 转换。请参阅[指南](/guide/open-telemetry)了解如何在 Vitest 中使用 OpenTelemetry。
:::

## experimental.printImportBreakdown <Version type="experimental">4.0.15</Version> {#experimental-printimportbreakdown}

::: tip 功能反馈
请将关于此功能反馈提交至 [GitHub Discussion](https://github.com/vitest-dev/vitest/discussions/9224)。
:::

- **类型:** `boolean`
- **默认值:** `false`

在测试运行完成后显示导入耗时分解。此选项仅适用于 [`default`](/guide/reporters#default)、[`verbose`](/guide/reporters#verbose) 或 [`tree`](/guide/reporters#tree) 报告器。

- Self：导入模块所花费的时间，不包括静态导入；
- Total：导入模块所花费的时间，包括静态导入。请注意，这不包括当前模块的 `transform` 时间。

<img alt="终端中导入分解的示例" src="/reporter-import-breakdown.png" />

请注意，如果文件路径太长，Vitest 会从开头截断它，直到它符合 45 个字符的限制。

::: info
如果至少有一个文件加载时间超过 500 毫秒，[Vitest UI](/guide/ui#import-breakdown) 会自动显示导入分解。你可以手动将此选项设置为 `false` 来禁用此功能。
:::
