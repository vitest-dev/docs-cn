# 配置 WebdriverIO

::: info Playwright 与 WebdriverIO
如果我们的项目尚未使用 WebdriverIO，我们建议从 [Playwright](/guide/browser/playwright) 开始，因为它更易于配置且 API 更灵活。
:::

要使用 WebdriverIO 运行测试，你需要在配置中的 `test.browser.provider` 属性中指定它：

```ts [vitest.config.js]
import { webdriverio } from '@vitest/browser/providers/webdriverio'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      provider: webdriverio(),
      instances: [{ browser: 'chrome' }]
    },
  },
})
```

Vitest 打开一个页面以在同一文件中运行所有测试。你可以配置 [`remote`](https://webdriver.io/docs/api/modules/#remoteoptions-modifier) 函数接受的所有参数：

```ts{8-12,19-23} [vitest.config.js]
import { webdriverio } from '@vitest/browser/providers/webdriverio'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      // shared provider options between all instances
      provider: webdriverio({
        capabilities: {
          browserVersion: '82',
        },
      }),
      instances: [
        { browser: 'chrome' },
        {
          browser: 'firefox',
          // overriding options only for a single instance
          // this will NOT merge options with the parent one
          provider: webdriverio({
            'moz:firefoxOptions': {
              args: ['--disable-gpu'],
            },
          })
        }
      ],
    },
  },
})
```

你可以在 [WebdriverIO 文档](https://webdriver.io/docs/configuration/) 中找到大多数可用选项。请注意，Vitest 将忽略所有测试运行器选项，因为我们仅使用 `webdriverio` 的浏览器功能。

::: tip
最有用的选项位于 `capabilities` 对象上。WebdriverIO 允许嵌套功能，但 Vitest 将忽略这些选项，因为我们依赖于不同的机制来生成多个浏览器。

请注意，Vitest 将忽略 `capabilities.browserName`。请改用 [`test.browser.instances.browser`](/guide/browser/config#browser-capabilities-name)。
:::
