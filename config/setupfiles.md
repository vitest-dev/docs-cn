---
title: setupFiles | 配置
outline: deep
---

# setupFiles

- **类型:** `string | string[]`

相对于 [项目根目录](/config/root) 的初始化文件路径。它们会在每个 _测试文件_ 之前的同一进程中运行。默认情况下，所有测试文件并行运行，但你可以通过 [`sequence.setupFiles`](/config/sequence#sequence-setupfiles) 选项进行配置。

Vitest 会忽略这些文件的任何导出。

:::warning
注意，初始化文件与测试在同一个进程中执行，这与 [`globalSetup`](/config/globalsetup) 不同，后者会在任何测试工作线程创建之前，在主线程中仅执行一次。
:::

:::info
编辑设置文件将自动触发所有测试的重新运行。
:::

如果后台运行了高负载进程，可在内部使用 `process.env.VITEST_POOL_ID`（类整数字符串）区分不同工作线程以分配负载。

:::warning
如果禁用了 [隔离模式](/config/isolate)，导入的模块会被缓存，但初始化文件本身会在每个测试文件之前重新运行，这意味着每次测试前你访问的都是同一个全局对象。请确保不会执行不必要的重复操作。

比如，你可能依赖于一个全局变量：

```ts
import { config } from '@some-testing-lib'

if (!globalThis.setupInitialized) {
  config.plugins = [myCoolPlugin]
  computeHeavyThing()
  globalThis.setupInitialized = true
}

// 在每个套件之前重置 Hook
afterEach(() => {
  cleanup()
})

globalThis.resetBeforeEachTest = true
```
:::
