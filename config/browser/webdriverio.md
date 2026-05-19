# 配置 WebdriverIO {#configuring-webdriverio}

::: info Playwright 与 WebdriverIO
如果我们的项目尚未使用 WebdriverIO，我们建议从 [Playwright](/config/browser/playwright) 开始，因为它更易于配置且 API 更灵活。
:::

要使用 WebdriverIO 运行测试，你需要安装 [`@vitest/browser-webdriverio`](https://npmx.dev/package/@vitest/browser-webdriverio) npm 包，并在配置中的 `test.browser.provider` 属性中指定其 `webdriverio` 导出：

```ts [vitest.config.js]
import { webdriverio } from '@vitest/browser-webdriverio'
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

你可以配置 [`remote`](https://webdriver.io/docs/api/modules/#remoteoptions-modifier) 函数接受的所有参数：

```ts{8-12,19-25} [vitest.config.js]
import { webdriverio } from '@vitest/browser-webdriverio'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      // 所有实例之间共享提供者选项
      provider: webdriverio({
        capabilities: {
          browserVersion: '82',
        },
      }),
      instances: [
        { browser: 'chrome' },
        {
          browser: 'firefox',
          // 仅为单个实例覆盖选项
          // 这不会将选项与父选项合并
          provider: webdriverio({
            capabilities: {
              'moz:firefoxOptions': {
                args: ['--disable-gpu'],
              },
            },
          })
        },
      ],
    },
  },
})
```

你可以在 [WebdriverIO 文档](https://webdriver.io/docs/configuration/) 中找到大多数可用选项。请注意，Vitest 将忽略所有测试运行器选项，因为我们仅使用 `webdriverio` 的浏览器功能。

::: tip
最有用的选项位于 `capabilities` 对象上。WebdriverIO 允许嵌套功能，但 Vitest 将忽略这些选项，因为我们依赖于不同的机制来生成多个浏览器。

请注意，Vitest 将忽略 `capabilities.browserName` — 请改用 [`test.browser.instances.browser`](/config/browser/instances#browser)。
:::
<!-- TODO: translation -->
## Headful Chrome in CI

Vitest enables [`browser.headless`](/config/browser/headless) automatically in CI.
If you explicitly set `headless: false` for Chrome on a Linux CI runner, Chrome
still needs a display server. Without one, WebDriverIO or ChromeDriver can fail
with a misleading error such as `session not created: probably user data
directory is already in use`.

Run the test command through `xvfb-run` when you need headful Chrome in GitHub
Actions or another Linux CI environment:

```bash
xvfb-run npm test
```

Alternatively, keep `browser.headless` enabled in CI and use headful mode only
for local debugging.
