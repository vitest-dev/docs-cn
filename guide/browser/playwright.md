# 配置 Playwright

<<<<<<< HEAD
默认情况下，TypeScript 无法识别提供者选项和额外的 `expect` 属性。请确保引用 `@vitest/browser/providers/playwright`，以便 TypeScript 可以获取自定义选项的定义：

```ts [vitest.shims.d.ts]
/// <reference types="@vitest/browser/providers/playwright" />
```

或者，我们也可以将其添加到 `tsconfig.json` 文件中的 `compilerOptions.types` 字段。请注意，在此字段中指定任何内容将禁用 `@types/*` 包的 [自动加载](https://www.typescriptlang.org/tsconfig/#types)。

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["@vitest/browser/providers/playwright"]
  }
}
```

Vitest 会在一个页面中执行同一文件里的所有测试。你可以通过 instances 配置项中的 `launch` 、`connect` 和 `context` 属性来自定义行为：

```ts{9-11} [vitest.config.ts]
=======
To run tests using playwright, you need to specify it in the `test.browser.provider` property in your config:

```ts [vitest.config.js]
import { playwright } from '@vitest/browser/providers/playwright'
>>>>>>> b501ecd0debd5606e62449a1497228ef2ab3be97
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

Vitest opens a single page to run all tests in the same file. You can configure the `launch`, `connect` and `context` when calling `playwright` at the top level or inside instances:

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

<<<<<<< HEAD
::: warning
在 Vitest 3 之前，这些选项位于 `test.browser.providerOptions` 属性中：

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    browser: {
      providerOptions: {
        launch: {},
        context: {},
      },
    },
  },
})
```

`providerOptions` 已被弃用，推荐使用 `instances`。
:::

## launch
=======
## launchOptions
>>>>>>> b501ecd0debd5606e62449a1497228ef2ab3be97

这些选项直接传递给 `playwright[browser].launch` 命令。我们可以在 [Playwright 文档](https://playwright.dev/docs/api/class-browsertype#browser-type-launch) 中阅读有关该命令和可用参数的更多信息。

::: warning
Vitest 将忽略 `launch.headless` 选项。请改用 [`test.browser.headless`](/guide/browser/config#browser-headless)。

请注意，如果启用了 [`--inspect`](/guide/cli#inspect)，Vitest 会将调试标志推送到 `launch.args`。
:::

## connectOptions

These options are directly passed down to `playwright[browser].connect` command. You can read more about the command and available arguments in the [Playwright documentation](https://playwright.dev/docs/api/class-browsertype#browser-type-connect).

::: warning
Since this command connects to an existing Playwright server, any `launch` options will be ignored.
:::

## contextOptions

<<<<<<< HEAD
Vitest 通过调用 [`browser.newContext()`](https://playwright.dev/docs/api/class-browsercontext) 为每个测试文件创建一个新的上下文。我们可以通过指定 [自定义参数](https://playwright.dev/docs/api/class-apirequest#api-request-new-context) 来配置此行为。
=======
Vitest creates a new context for every test file by calling [`browser.newContext()`](https://playwright.dev/docs/api/class-browsercontext). You can configure this behaviour by specifying [custom arguments](https://playwright.dev/docs/api/class-browser#browser-new-context).
>>>>>>> b501ecd0debd5606e62449a1497228ef2ab3be97

::: tip
请注意，上下文是为每个 _测试文件_ 创建的，而不是像 Playwright 测试运行器那样为每个 _测试_ 创建。
:::

::: warning
如果我们的服务器通过 HTTPS 提供服务，Vitest 始终将 `ignoreHTTPSErrors` 设置为 `true`，并将 `serviceWorkers` 设置为 `'allow'`，以支持通过 [MSW](https://mswjs.io) 进行模块模拟。

建议使用 [`test.browser.viewport`](/guide/browser/config#browser-headless) 而不是在此处指定它，因为在无头模式下运行测试时会丢失该设置。
:::

## `actionTimeout`

<<<<<<< HEAD
- **默认值：** 无超时，3.0.0 之前为 1 秒
=======
- **Default:** no timeout
>>>>>>> b501ecd0debd5606e62449a1497228ef2ab3be97

此值配置 Playwright 等待所有可访问性检查通过并 [操作](/guide/browser/interactivity-api) 实际完成的默认超时时间。

我们还可以为每个操作配置操作超时：

```ts
import { page, userEvent } from '@vitest/browser/context'

await userEvent.click(page.getByRole('button'), {
  timeout: 1_000,
})
```
