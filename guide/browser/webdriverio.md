# 配置 WebdriverIO

::: info Playwright 与 WebdriverIO
如果我们的项目尚未使用 WebdriverIO，我们建议从 [Playwright](/guide/browser/playwright) 开始，因为它更易于配置且 API 更灵活。
:::

<<<<<<< HEAD
默认情况下，TypeScript 无法识别提供者选项和额外的 `expect` 属性。请确保引用 `@vitest/browser/providers/webdriverio`，以便 TypeScript 可以获取自定义选项的定义：

```ts [vitest.shims.d.ts]
/// <reference types="@vitest/browser/providers/webdriverio" />
```

或者，我们也可以将其添加到 `tsconfig.json` 文件中的 `compilerOptions.types` 字段。请注意，在此字段中指定任何内容将禁用 `@types/*` 包的 [自动加载](https://www.typescriptlang.org/tsconfig/#types)。

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["@vitest/browser/providers/webdriverio"]
  }
}
```

Vitest 打开一个页面以在同一文件中运行所有测试。我们可以在 `instances` 中配置 `RemoteOptions` 中指定的任何属性：

```ts{9-12} [vitest.config.ts]
=======
To run tests using WebdriverIO, you need to specify it in the `test.browser.provider` property in your config:

```ts [vitest.config.js]
import { webdriverio } from '@vitest/browser/providers/webdriverio'
>>>>>>> 68f6adb27c17ea72b1178c151df73dc47e500cd5
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

Vitest opens a single page to run all tests in the same file. You can configure all the parameters that [`remote`](https://webdriver.io/docs/api/modules/#remoteoptions-modifier) function accepts:

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

<<<<<<< HEAD
::: warning
在 Vitest 3 之前，这些选项位于 `test.browser.providerOptions` 属性中：

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    browser: {
      providerOptions: {
        capabilities: {},
      },
    },
  },
})
```

`providerOptions` 已被弃用，推荐使用 `instances`。
:::

我们可以在 [WebdriverIO 文档](https://webdriver.io/docs/configuration/) 中找到大多数可用选项。请注意，Vitest 将忽略所有测试运行器选项，因为我们仅使用 `webdriverio` 的浏览器功能。
=======
You can find most available options in the [WebdriverIO documentation](https://webdriver.io/docs/configuration/). Note that Vitest will ignore all test runner options because we only use `webdriverio`'s browser capabilities.
>>>>>>> 68f6adb27c17ea72b1178c151df73dc47e500cd5

::: tip
最有用的选项位于 `capabilities` 对象上。WebdriverIO 允许嵌套功能，但 Vitest 将忽略这些选项，因为我们依赖于不同的机制来生成多个浏览器。

<<<<<<< HEAD
请注意，Vitest 将忽略 `capabilities.browserName`。请改用 [`test.browser.instances.name`](/guide/browser/config#browser-capabilities-name)。
=======
Note that Vitest will ignore `capabilities.browserName`. Use [`test.browser.instances.browser`](/guide/browser/config#browser-capabilities-name) instead.
>>>>>>> 68f6adb27c17ea72b1178c151df73dc47e500cd5
:::
