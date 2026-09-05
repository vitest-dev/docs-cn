---
title: restoreMocks | 配置
outline: deep
---

# restoreMocks

- **类型:** `boolean`
- **默认值:** `false`

是否应在每个测试前自动调用 [`vi.restoreAllMocks()`](/api/vi#vi-restoreallmocks)。

此操作会恢复所有通过 [`vi.spyOn`](/api/vi#vi-spyon) 手动创建的 spy 函数的原始实现。

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    restoreMocks: true,
  },
})
```

::: warning
需要注意的是此选项可能会影响异步 [并发测试](/api/test#test-concurrent) 的正常运行。启用后，当某个测试执行完成时，会重置所有 spy 函数的实现，包括其他并发测试正在使用的 spy 函数。
:::
