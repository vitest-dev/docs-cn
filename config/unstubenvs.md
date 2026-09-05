---
title: unstubEnvs | 配置
outline: deep
---

# unstubEnvs

- **类型:** `boolean`
- **默认值:** `false`

是否应在每个测试前自动调用 [`vi.unstubAllEnvs()`](/api/vi#vi-unstuballenvs)。

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    unstubEnvs: true,
  },
})
```

::: warning
需要注意的是此选项可能会影响异步 [并发测试](/api/test#test-concurrent) 的正常运行。启用后，当某个测试执行完成时，会恢复所有通过 [`vi.stubEnv`](/api/vi#vi-stubenv) 修改的值，包括当前正在执行的其他测试正在使用的值。
:::
