# Open Telemetry 支持 <Experimental /> {#open-telemetry-support}

::: tip 功能反馈
请将关于此功能反馈提交至 [GitHub Discussion](https://github.com/vitest-dev/vitest/discussions/9222)。
:::

::: tip 示例项目
[GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/opentelemetry)
:::

[OpenTelemetry](https://opentelemetry.io/) 跟踪是一个非常实用的工具，能帮助我们在测试过程中更轻松地了解和调试应用程序的性能与行为表现。

启用后，Vitest 集成会生成与测试工作线程作用域绑定的追踪区间 (spans)。

::: warning
除非 Vitest 在关闭 [隔离](/config/isolate) 模式下运行，否则 OpenTelemetry 初始化会延长每个测试的启动时间。你可在 `vitest.worker.start` 中查看名为 `vitest.runtime.traces` 的追踪跨度。
:::

要在 Vitest 中使用 OpenTelemetry，需通过 [`experimental.openTelemetry.sdkPath`](/config/experimental#experimental-opentelemetry) 指定 SDK 模块路径，并将 `experimental.openTelemetry.enabled` 设为 `true`。Vitest 将自动为整个进程及每个独立测试工作线程添加监测。

确保将 SDK 作为默认导出，以便 Vitest 在进程关闭前能刷新网络请求。注意 Vitest 不会自动调用 `start` 方法。

## 快速开始 {#quickstart}

在预览应用程序追踪数据前，请先安装所需依赖包并在配置中指定检测文件路径。

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
如果你正在使用假计时器（fake timers），务必在测试结束前重置它们，否则可能导致追踪数据记录异常。
:::

Vitest 不会处理 `sdkPath` 模块的转译，因此该 SDK 必须能在 Node.js 环境中直接导入。建议使用 `.js` 扩展名的文件，其他扩展名会降低测试速度并可能需要额外配置 Node.js 参数。

如果你想使用 TypeScript 文件，请提前阅读 Node.js 文档中的 [TypeScript](https://nodejs.org/api/typescript.html#type-stripping) 章节了解类型剥离机制。

## 自定义追踪 {#custom-traces}

你可以自己使用 OpenTelemetry API 来跟踪代码中的某些操作。自定义追踪会自动继承 Vitest 的 OpenTelemetry 上下文：

```ts
import { trace } from '@opentelemetry/api'
import { test } from 'vitest'
import { db } from './src/db'

const tracer = trace.getTracer('vitest')

test('db connects properly', async () => {
  // 该操作会显示在 `vitest.test.runner.test.callback` 跨度中
  await tracer.startActiveSpan('db.connect', () => db.connect())
})
```

## 浏览器模式 {#browser-mode}

在 [浏览器模式](/guide/browser/) 下运行测试时，Vitest 会在 Node.js 和浏览器之间传播追踪上下文。Node.js 端的追踪信息（测试编排、浏览器驱动程序通信）无需额外配置即可获取。

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
与 Node.js 不同，浏览器不具备自动的异步上下文传播能力。Vitest 在内部为测试执行处理这一点，但对于深度嵌套的异步代码中的自定义跨度，上下文可能不会自动传播。
:::

## 查看追踪 {#view-traces}

生成追踪数据时，请像往常一样运行 Vitest，无论是 watch 模式还是运行模式均可。Vitest 会在所有操作完成后手动调用 `sdk.shutdown()` 以确保追踪数据得到正确处理。

你可以使用任何支持 OpenTelemetry API 的开源或商业产品来查看追踪。。如果是初次接触 OpenTelemetry，我们推荐从 [Jaeger](https://www.jaegertracing.io/docs/2.11/getting-started/#all-in-one) 开始，因为它真的很容易设置。

<img src="/otel-jaeger.png" />

## `@opentelemetry/api` {#opentelemetry-api}

Vitest 将 `@opentelemetry/api` 声明为可选的对等依赖项，内部使用该库生成跨度。当未启用追踪收集功能时，Vitest 不会尝试使用此依赖项。

在配置 Vitest 使用 OpenTelemetry 时，你通常会安装 `@opentelemetry/sdk-node`，它包含 `@opentelemetry/api` 作为传递依赖项，从而满足 Vitest 的对等依赖项要求。如果出现 `@opentelemetry/api` 未找到的错误，通常意味着未启用追踪收集功能。若正确配置后问题仍然存在，可能需要显式安装 `@opentelemetry/api`。

## 进程间上下文传播 {#inter-process-context-propagation}

Vitest 支持通过 `TRACEPARENT` 和 `TRACESTATE` 环境变量从父进程的自动上下文传播，其遵循 [OpenTelemetry 规范](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/context/env-carriers.md) 中所定义。这在将 Vitest 作为大型分布式追踪系统的一部分运行时尤为实用（例如，具有 OpenTelemetry 检测的 CI/CD 管道）。
