---
title: onStackTrace | Config
outline: deep
---

# onStackTrace <CRoot />

- **类型**: `(error: Error, frame: ParsedStack) => boolean | void`

在处理错误时，对每个堆栈跟踪的每一帧应用过滤函数。此功能不适用于 [`printConsoleTrace`](/config/printconsoletrace#printconsoletrace) 打印的堆栈跟踪。第一个参数 `error` 是一个 `TestError` 类型。

可用于过滤掉来自第三方库的堆栈跟踪帧。

::: tip
堆栈跟踪的总大小通常也受到 V8 的 [`Error.stackTraceLimit`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stackTraceLimit) 数值限制。你可以在测试设置函数中将其设为较大值，以防止堆栈被截断。
:::

```ts
import type { ParsedStack, TestError } from 'vitest'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    onStackTrace(error: TestError, { file }: ParsedStack): boolean | void {
      // 如果遇到 ReferenceError，则显示完整堆栈
      if (error.name === 'ReferenceError') {
        return
      }

      // 拒绝所有来自第三方库的帧
      if (file.includes('node_modules')) {
        return false
      }
    },
  },
})
```
