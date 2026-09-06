---
title: browser.enabled | 配置
---

# browser.enabled

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--browser`, `--browser.enabled=false`

启用此参数后，Vitest 默认会在 [浏览器](/guide/browser/) 中运行所有测试。如哦需通过命令行配置其他浏览器选项，可使用 `--browser.enabled` 参数替代 `--browser` 与其他选项搭配使用。

```sh
vitest --browser.enabled --browser.headless
```

::: warning
要启用 [浏览器模式](/guide/browser/)，必须同时指定 [`provider`](/config/browser/provider) 和至少一个 [`instance`](/config/browser/instances)。可用的提供驱动包括：

- [playwright](/config/browser/playwright)
- [webdriverio](/config/browser/webdriverio)
- [preview](/config/browser/preview)
:::

## 示例 {#example}

```js{7} [vitest.config.js]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
})
```

如果使用 TypeScript，`instances` 中的 `browser` 字段会根据你选择的提供程序自动提供代码补全功能。
