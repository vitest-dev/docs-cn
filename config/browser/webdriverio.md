# 配置 WebdriverIO {#configuring-webdriverio}

::: info 由社区维护
WebdriverIO provider（[`@vitest/browser-webdriverio`](https://github.com/vitest-community/vitest-webdriverio)）由 [`vitest-community`](https://github.com/vitest-community) 组织中的 Vitest 社区负责维护，与 Vitest 核心包分开开发。如果遇到该 provider 特有的问题，请提交到对应的仓库。
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

## CI 中的有头模式 Chrome {#headful-chrome-in-ci}

Vitest 在 CI 中会自动启用 [`browser.headless`](/config/browser/headless)。如果你在 Linux CI 运行器上为 Chrome 显式设置了 `headless: false`，Chrome 仍然需要一个显示服务器。如果没有，WebDriverIO 或 ChromeDriver 可能会失败，并出现误导性错误，例如 `session not created: probably user data directory is already in use`。

当你在 GitHub Actions 或其他 Linux CI 环境中需要使用有头模式的 Chrome 时，请通过 `xvfb-run` 运行测试命令：

```bash
xvfb-run npm test
```

或者，在 CI 中保持启用 `browser.headless`，仅在本地调试时使用有头模式。
