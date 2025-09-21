# 配置 Playwright

要使用 playwright 运行测试，你需要在配置中的 `test.browser.provider` 属性中指定它：

```ts [vitest.config.js]
import { playwright } from '@vitest/browser/providers/playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    },
  },
})
```

Vitest 在单个页面中运行同一文件中的所有测试。你可以在顶层或实例内部调用 `playwright` 时配置 `launch`、`connect` 和 `context`：

```ts{7-15,22-27} [vitest.config.js]
import { playwright } from '@vitest/browser/providers/playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      // shared provider options between all instances
      provider: playwright({
        launchOptions: {
          slowMo: 50,
          channel: 'chrome-beta',
        },
        actionTimeout: 5_000,
      }),
      instances: [
        { browser: 'chromium' },
        {
          browser: 'firefox',
          // overriding options only for a single instance
          // this will NOT merge options with the parent one
          provider: playwright({
            launchOptions: {
              firefoxUserPrefs: {
                'browser.startup.homepage': 'https://example.com',
              },
            },
          })
        }
      ],
    },
  },
})
```

## launchOptions

这些选项直接传递给 `playwright[browser].launch` 命令。我们可以在 [Playwright 文档](https://playwright.dev/docs/api/class-browsertype#browser-type-launch) 中阅读有关该命令和可用参数的更多信息。

::: warning
Vitest 将忽略 `launch.headless` 选项。请改用 [`test.browser.headless`](/guide/browser/config#browser-headless)。

请注意，如果启用了 [`--inspect`](/guide/cli#inspect)，Vitest 会将调试标志推送到 `launch.args`。
:::

## connectOptions

这些选项直接传递给 `playwright[browser].connect` 命令。你可以在 [Playwright 文档](https://playwright.dev/docs/api/class-browsertype#browser-type-connect) 中了解更多关于该命令和可用参数的信息。

::: warning
由于此命令连接到现有的 Playwright 服务器，任何 `launch` 选项都将被忽略。
:::

## contextOptions

Vitest 通过调用 [`browser.newContext()`](https://playwright.dev/docs/api/class-browsercontext) 为每个测试文件创建一个新的上下文。你可以通过指定 [自定义参数](https://playwright.dev/docs/api/class-browser#browser-new-context) 来配置此行为。

::: tip
请注意，上下文是为每个 _测试文件_ 创建的，而不是像 Playwright 测试运行器那样为每个 _测试_ 创建。
:::

::: warning
如果我们的服务器通过 HTTPS 提供服务，Vitest 始终将 `ignoreHTTPSErrors` 设置为 `true`，并将 `serviceWorkers` 设置为 `'allow'`，以支持通过 [MSW](https://mswjs.io) 进行模块模拟。

建议使用 [`test.browser.viewport`](/guide/browser/config#browser-headless) 而不是在此处指定它，因为在无头模式下运行测试时会丢失该设置。
:::

## `actionTimeout`

- **Default:** no timeout

此值配置 Playwright 等待所有可访问性检查通过并 [操作](/guide/browser/interactivity-api) 实际完成的默认超时时间。

我们还可以为每个操作配置操作超时：

```ts
import { page, userEvent } from '@vitest/browser/context'

await userEvent.click(page.getByRole('button'), {
  timeout: 1_000,
})
```
