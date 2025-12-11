# 配置预览

::: warning
<<<<<<< HEAD:guide/browser/preview.md
`preview` 提供程序的主要功能是在真实浏览器环境中显示测试。不过，它不支持高级浏览器自动化功能，如多个浏览器实例或无头模式。对于更复杂的场景，请考虑使用 [Playwright](/guide/browser/playwright) 或 [WebdriverIO](/guide/browser/webdriverio)。
=======
The `preview` provider's main functionality is to show tests in a real browser environment. However, it does not support advanced browser automation features like multiple browser instances or headless mode. For more complex scenarios, consider using [Playwright](/config/browser/playwright) or [WebdriverIO](/config/browser/webdriverio).
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b:config/browser/preview.md
:::

要让你的测试运行在真实浏览器中，需要安装 [`@vitest/browser-preview`](https://www.npmjs.com/package/@vitest/browser-preview) npm 软件包，并在配置的 `test.browser.provider` 属性中指定其 `preview` 导出：

```ts [vitest.config.js]
import { preview } from '@vitest/browser-preview'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      provider: preview(),
      instances: [{ browser: 'chromium' }]
    },
  },
})
```

这将使用默认浏览器打开一个新的浏览器窗口来运行测试。您可以通过设置 `instances` 数组中的 `browser` 属性来配置使用哪个浏览器。Vitest 会尝试自动打开浏览器，但在某些环境下可能无法正常工作。在这种情况下，您可以在所需的浏览器中手动打开所提供的 URL。

## 与其他 Providers 的差异

<<<<<<< HEAD:guide/browser/preview.md
与 [Playwright](/guide/browser/playwright) 或 [WebdriverIO](/guide/browser/webdriverio) 等其他 Providers 相比，预览服务存在一些限制：

- 它不支持无头模式; 浏览器窗口始终可见.
- 它不支持同一浏览器的多个实例; 每个实例必须使用不同的浏览器.
- 它不支持高级浏览器功能或选项; 你只能指定浏览器名称.
- 它不支持 CDP（Chrome DevTools 协议）命令或其他低层浏览器交互. 与 Playwright 或 WebdriverIO 不同, [`userEvent`](/guide/browser/interactivity-api) API 只是从 [`@testing-library/user-event`](https://www.npmjs.com/package/@testing-library/user-event) 重新导出, 没有与浏览器的特殊集成.
=======
The preview provider has some limitations compared to other providers like [Playwright](/config/browser/playwright) or [WebdriverIO](/config/browser/webdriverio):

- It does not support headless mode; the browser window will always be visible.
- It does not support multiple instances of the same browser; each instance must use a different browser.
- It does not support advanced browser capabilities or options; you can only specify the browser name.
- It does not support CDP (Chrome DevTools Protocol) commands or other low-level browser interactions. Unlike Playwright or WebdriverIO, the [`userEvent`](/api/browser/interactivity) API is just re-exported from [`@testing-library/user-event`](https://www.npmjs.com/package/@testing-library/user-event) and does not have any special integration with the browser.
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b:config/browser/preview.md
