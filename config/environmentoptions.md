---
title: environmentOptions | 配置
---

# environmentOptions

- **类型:** `Record<'jsdom' | 'happyDOM' | string, unknown>`
- **默认值:** `{}`

这些选项会被传递到当前 [环境](/config/environment) 的初始化方法中。默认情况下，只能为 `jsdom` 或 `happyDOM` 这两个测试环境配置选项。

## 示例 {#example}

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000',
      },
      happyDOM: {
        width: 300,
        height: 400,
      },
    },
  },
})
```

::: warning
选项被限定在各自的环境范围内。例如，将 jsdom 选项放在 `jsdom` 键下，happy-dom 选项放在 `happyDOM` 键下。这使你能够在同一项目中同时使用多个环境。
:::
