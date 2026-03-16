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

::: warning
Be aware that this option may cause problems with async [concurrent tests](/api/test#test-concurrent). If enabled, the completion of one test will restore all the values changed with [`vi.stubEnv`](/api/vi#vi-stubenv), including those currently being used by other tests in progress.
:::
