---
title: clearMocks | 配置
outline: deep
---

# clearMocks

- **类型:** `boolean`
- **默认值:** `false`

是否应在每个测试前自动调用 [`vi.clearAllMocks()`](/api/vi#vi-clearallmocks)。

此操作会清空 mock 调用记录，但不会影响 mock 的实现逻辑。

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    clearMocks: true,
  },
})
```

::: warning
需要注意的是此选项可能会影响异步 [并发测试](/api/test#test-concurrent) 的正常运行。启用后，当某个测试执行完成时，会清除所有模拟函数的调用历史记录，包括其他并发测试正在使用的模拟函数。
:::
