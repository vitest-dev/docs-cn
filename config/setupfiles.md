---
title: setupFiles | Config
outline: deep
---

<!-- TODO: translation reference history -->

# setupFiles

- **类型:** `string | string[]`

Paths to setup files resolved relative to the [`root`](/config/root). They will run before each _test file_ in the same process. By default, all test files run in parallel, but you can configure it with [`sequence.setupFiles`](/config/sequence#sequence-setupfiles) option.

Vitest will ignore any exports from these files.

:::warning
Note that setup files are executed in the same process as tests, unlike [`globalSetup`](/config/globalsetup) that runs once in the main thread before any test worker is created.
:::

:::info
编辑设置文件将自动触发所有测试的重新运行。
:::

If you have a heavy process running in the background, you can use `process.env.VITEST_POOL_ID` (integer-like string) inside to distinguish between workers and spread the workload.

:::warning
If [isolation](/config/isolate) is disabled, imported modules are cached, but the setup file itself is executed again before each test file, meaning that you are accessing the same global object before each test file. Make sure you are not doing the same thing more than necessary.

比如，你可能依赖于一个全局变量：

```ts
import { config } from '@some-testing-lib'

if (!globalThis.setupInitialized) {
  config.plugins = [myCoolPlugin]
  computeHeavyThing()
  globalThis.setupInitialized = true
}

// hooks reset before each test file
afterEach(() => {
  cleanup()
})

globalThis.resetBeforeEachTest = true
```
:::
