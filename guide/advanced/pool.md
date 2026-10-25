# 自定义池 <Badge type="danger">高级</Badge> {#custom-pool}

::: warning
这是一个高级用法的实验性底层 API，主要供库作者使用。如果你只是想 [运行测试](/guide/)，通常不需要使用它。
:::

Vitest 在池中运行测试。默认提供以下几种池运行器：

- `threads`：使用 `node:worker_threads` 运行测试，通过创建新的工作线程上下文实现隔离。
- `forks`：使用 `node:child_process` 运行测试，通过 `child_process.fork` 创建新的进程实现隔离。
- `vmThreads`：使用 `node:worker_threads` 运行测试，通过 `vm` 模块实现隔离，而不是创建新的工作线程上下文。
- `browser`：使用浏览器 provider 运行测试。
- `typescript`：对测试进行类型检查

::: tip
自定义池运行器的实现示例，请参阅 [`vitest-pool-example`](https://npmx.dev/package/vitest-pool-example)。
:::

## 用法 {#usage}

你可以编写一个返回 `PoolRunnerInitializer` 的函数，提供自定义池运行器。

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
import customPool from './my-custom-pool.ts'

export default defineConfig({
  test: {
    // 默认使用自定义池运行所有文件
    pool: customPool({
      customProperty: true,
    })
  },
})
```

如果需要在不同的 pool 中运行测试，可以使用 [`projects`](/guide/projects) 功能。

```ts [vitest.config.ts]
import customPool from './my-custom-pool.ts'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          pool: 'threads',
        },
      },
      {
        test: {
          pool: customPool({
            customProperty: true,
          })
        }
      }
    ],
  },
})
```

## API

要使用自定义池运行器，可以将一个 `PoolRunnerInitializer` 对象传给 pool 选项。该对象的 `name` 属性表示池运行器的名称，须与 worker 的 `name` 属性一致。

```ts [my-custom-pool.ts]
import type { PoolRunnerInitializer } from 'vitest/node'

export function customPool(customOptions: CustomOptions): PoolRunnerInitializer {
  return {
    name: 'custom-pool',
    createPoolWorker: options => new CustomPoolWorker(options, customOptions),
  }
}
```

In your `CustomPoolWorker` you need to define all required methods:

```ts [my-custom-pool.ts]
import type { PoolOptions, PoolWorker, WorkerRequest } from 'vitest/node'

class CustomPoolWorker implements PoolWorker {
  name = 'custom-pool'
  private customOptions: CustomOptions

  constructor(options: PoolOptions, customOptions: CustomOptions) {
    this.customOptions = customOptions
  }

  send(message: WorkerRequest): void {
    // 向 worker 发送消息
  }

  on(event: string, callback: (arg: any) => void): void {
    // 监听 worker 事件的方式，例如 message、error 和 exi
  }

  off(event: string, callback: (arg: any) => void): void {
    // 移除通过 `on` 注册的监听器
  }

  async start() {
    // 在 worker 启动时执行操作
  }

  async stop() {
    // 清理状态
  }

  deserialize(data) {
    return data
  }
}
```

`CustomPoolRunner` 负责管理自定义测试运行器 worker 的生命周期和通信通道。例如，`CustomPoolRunner` 可以启动一个 `node:worker_threads` 的 `Worker`，并通过 `Worker.postMessage` 和 `parentPort` 进行通信。

在 worker 文件中，你可以从 `vitest/worker` 导入工具函数

```ts [my-worker.ts]
import { init, runBaseTests, setupEnvironment } from 'vitest/worker'

init({
  post: (response) => {
    // 将这条消息以 message 事件的形式传给 CustomPoolRunner 的 onWorker
  },
  on: (callback) => {
    // 监听 CustomPoolRunner 的 "postMessage" 调用
  },
  off: (callback) => {
    // 可选，移除通过 "on" 注册的监听器
  },
  teardown: () => {
    // 可选：清理 worker，例如移除所有通过 `on` 注册的监听器
  },
  serialize: (value) => {
    // 可选：自定义 `post` 调用的序列化方式
  },
  deserialize: (value) => {
    // 可选：自定义传给 `on` 回调的数据的反序列化方式
  },
  runTests: (state, traces) => runBaseTests('run', state, traces),
  collectTests: (state, traces) => runBaseTests('collect', state, traces),
  setup: setupEnvironment,
})
```
