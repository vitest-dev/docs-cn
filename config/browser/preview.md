# 配置预览

::: warning
`preview` 提供程序的主要功能是在真实浏览器环境中显示测试。不过，它不支持高级浏览器自动化功能，如多个浏览器实例或无头模式。对于更复杂的场景，请考虑使用 [Playwright](/config/browser/playwright) 或 [WebdriverIO](/config/browser/webdriverio)。
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

与 [Playwright](/config/browser/playwright) 或 [WebdriverIO](/config/browser/webdriverio) 等其他 Providers 相比，预览服务存在一些限制：

- 它不支持无头模式; 浏览器窗口始终可见.
- 它不支持同一浏览器的多个实例; 每个实例必须使用不同的浏览器.
- 它不支持高级浏览器功能或选项; 你只能指定浏览器名称.
- 它不支持 CDP（Chrome DevTools 协议）命令或其他低层浏览器交互. 与 Playwright 或 WebdriverIO 不同, [`userEvent`](/api/browser/interactivity) API 只是从 [`@testing-library/user-event`](https://www.npmjs.com/package/@testing-library/user-event) 重新导出, 没有与浏览器的特殊集成.
