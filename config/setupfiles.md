---
title: setupFiles | Config
outline: deep
---

# setupFiles

- **类型:** `string | string[]`

setup 文件的路径。它们将在每个测试文件之前运行。

:::info
编辑设置文件将自动触发所有测试的重新运行。
:::

你可以在全局设置文件中使用 `process.env.VITEST_POOL_ID`（类似整数的字符串）来区分不同的线程。

:::tip
请注意，如果运行 [`--isolate=false`](#isolate)，这个配置文件将在全局范围内多次运行。这意味着每次测试前都要访问同一个全局对象，因此请确保不要重复做同一件事。
:::

比如，你可能依赖于一个全局变量：

```ts
import { config } from '@some-testing-lib'

if (!globalThis.defined) {
  config.plugins = [myCoolPlugin]
  computeHeavyThing()
  globalThis.defined = true
}

// 钩子函数会在每个测试套件前重置
afterEach(() => {
  cleanup()
})

globalThis.resetBeforeEachTest = true
```
