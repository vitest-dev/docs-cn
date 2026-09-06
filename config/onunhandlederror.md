---
title: onUnhandledError | 配置
outline: deep
---

# onUnhandledError <CRoot /> <Version>4.0.0</Version>

- **类型:**

```ts
function onUnhandledError(
  error: (TestError | Error) & { type: string }
): boolean | void
```

用于过滤不应上报的未处理错误的自定义回调函数。当错误被过滤后，将不再影响测试运行结果。

如需上报未处理错误但不影响测试结果，请改用 [`dangerouslyIgnoreUnhandledErrors`](/config/dangerouslyignoreunhandlederrors) 选项。

::: tip
此回调函数在主线程调用，无法访问你的测试上下文。
:::

## 示例 {#example}

```ts
import type { ParsedStack } from 'vitest'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    onUnhandledError(error): boolean | void {
      // 忽略所有名称为 "MySpecialError" 的报错
      if (error.name === 'MySpecialError') {
        return false
      }
    },
  },
})
```
