# Open Telemetry 支持 <Experimental /> {#open-telemetry-support}

::: tip 功能反馈
请将关于此功能反馈提交至 [GitHub Discussion](https://github.com/vitest-dev/vitest/discussions/9222)。
:::

::: tip 示例项目
[GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/opentelemetry)
:::

[OpenTelemetry](https://opentelemetry.io/) 追踪可以成为调试测试中应用程序性能和行为的有用工具。

如果启用，Vitest 集成会生成作用域限定在测试工作者的跨度（spans）。

::: warning
OpenTelemetry 初始化会增加每个测试的启动时间，除非 Vitest 在没有 [隔离](/config/isolate) 的情况下运行。你可以在 `vitest.worker.start` 内部看到它作为 `vitest.runtime.traces` 跨度。
:::

要在 Vitest 中开始使用 OpenTelemetry，请通过 [`experimental.openTelemetry.sdkPath`](/config/experimental#experimental-opentelemetry) 指定 SDK 模块路径，并将 `experimental.openTelemetry.enabled` 设置为 `true`。Vitest 将自动检测整个进程和每个单独的测试工作者。

确保将 SDK 作为默认导出导出，以便 Vitest 可以在进程关闭之前刷新网络请求。请注意，Vitest 不会自动调用 `start`。

## 快速开始 {#quickstart}

在预览应用程序追踪之前，请安装所需的包并在配置中指定检测文件的路径。

```shell
npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-proto
```

::: code-group
```js{12} [otel.js]
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

::: danger 假计时器
如果你正在使用假计时器（fake timers），在测试结束前重置它们很重要，否则追踪可能无法正确跟踪。
:::

Vitest 不会处理 `sdkPath` 模块，因此 SDK 能够在你的 Node.js 环境中导入很重要。理想情况下，为此文件使用 `.js` 扩展名。使用其他扩展名会减慢测试速度，并可能需要提供额外的 Node.js 参数。

如果你想提供 TypeScript 文件，请确保熟悉 Node.js 文档中的 [TypeScript](https://nodejs.org/api/typescript.html#type-stripping) 页面。

## 自定义追踪 {#custom-traces}

你可以自己使用 OpenTelemetry API 来跟踪代码中的某些操作。自定义追踪会自动继承 Vitest OpenTelemetry 上下文：

```ts
import { trace } from '@opentelemetry/api'
import { test } from 'vitest'
import { db } from './src/db'

const tracer = trace.getTracer('vitest')

test('db connects properly', async () => {
  // 这会显示在 `vitest.test.runner.test.callback` 跨度内部
  await tracer.startActiveSpan('db.connect', () => db.connect())
})
```

## 浏览器模式 {#browser-mode}

在[浏览器模式](/guide/browser/)下运行测试时，Vitest 会在 Node.js 和浏览器之间传播追踪上下文。Node.js 端的追踪（测试编排、浏览器驱动程序通信）无需额外配置即可使用。

要从浏览器运行时捕获追踪，请通过 `browserSdkPath` 提供与浏览器兼容的 SDK：

```shell
npm i @opentelemetry/sdk-trace-web @opentelemetry/exporter-trace-otlp-proto
```

::: code-group
```js [otel-browser.js]
import {
  BatchSpanProcessor,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

const provider = new WebTracerProvider({
  spanProcessors: [
    new BatchSpanProcessor(new OTLPTraceExporter()),
  ],
})

provider.register()
export default provider
```
```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }],
    },
    experimental: {
      openTelemetry: {
        enabled: true,
        sdkPath: './otel.js',
        browserSdkPath: './otel-browser.js',
      },
    },
  },
})
```
:::

::: warning 异步上下文
与 Node.js 不同，浏览器没有自动的异步上下文传播。Vitest 在内部为测试执行处理这一点，但深度嵌套异步代码中的自定义跨度可能不会自动传播上下文。
:::

## 查看追踪 {#view-traces}

要生成追踪，请像往常一样运行 Vitest。你可以在观察模式或运行模式下运行 Vitest。Vitest 会在一切完成后手动调用 `sdk.shutdown()`，以确保追踪得到正确处理。

你可以使用任何支持 OpenTelemetry API 的开源或商业产品来查看追踪。如果你之前没有使用过 OpenTelemetry，我们建议从 [Jaeger](https://www.jaegertracing.io/docs/2.11/getting-started/#all-in-one) 开始，因为它真的很容易设置。

<img src="/otel-jaeger.png" />

## `@opentelemetry/api` {#opentelemetry-api}

Vitest 将 `@opentelemetry/api` 声明为可选的对等依赖项，它在内部使用它来生成跨度。当未启用追踪收集时，Vitest 不会尝试使用此依赖项。

在配置 Vitest 使用 OpenTelemetry 时，你通常会安装 `@opentelemetry/sdk-node`，它包含 `@opentelemetry/api` 作为传递依赖项，从而满足 Vitest 的对等依赖项要求。如果你遇到指示找不到 `@opentelemetry/api` 的错误，这通常意味着未启用追踪收集。如果在正确配置后错误仍然存在，你可能需要显式安装 `@opentelemetry/api`。

## 进程间上下文传播 {#inter-process-context-propagation}

Vitest 支持通过 `TRACEPARENT` 和 `TRACESTATE` 环境变量从父进程自动传播上下文，如 [OpenTelemetry 规范](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/context/env-carriers.md)中所定义。这在将 Vitest 作为更大的分布式追踪系统的一部分运行时特别有用（例如，具有 OpenTelemetry 检测的 CI/CD 管道）。
