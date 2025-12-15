---
title: unstubEnvs | Config
outline: deep
---

# unstubEnvs

- **类型:** `boolean`
- **默认值:** `false`

将在每次测试前调用 [`vi.unstubAllEnvs()`](/api/vi#vi-unstuballenvs)。

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    unstubEnvs: true,
  },
})
```
