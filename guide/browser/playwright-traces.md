# Playwright 追踪 {#playwright-traces}

Vitest 浏览器模式支持生成 Playwright 的 [追踪文件](https://playwright.dev/docs/trace-viewer#viewing-remote-traces)。要启用追踪，请在 `test.browser` 配置中设置 [`trace`](/config/browser/trace) 选项。

::: warning
生成追踪文件仅在 [Playwright provider](/config/browser/playwright) 下可用。
:::

::: code-group

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      trace: 'on',
    },
  },
})
```

```bash [CLI]
vitest --browser.trace=on
```

:::

默认情况下，Vitest 会为每个测试生成一个追踪文件。你也可以将 `trace` 设置为 `'on-first-retry'`、`'on-all-retries'` 或 `'retain-on-failure'`，使其仅在测试失败时生成追踪。追踪文件将保存在测试文件旁边的 `__traces__` 文件夹中。追踪文件的名称包含项目名称、测试名称、[`repeats`](/api/test#repeats) 计数和 [`retry`](/api/test#retry) 计数：

```
chromium-my-test-0-0.trace.zip
^^^^^^^^ project name
         ^^^^^^ test name
                ^ repeat count
                  ^ retry count
```

如果要更改输出目录，你可以在 `test.browser.trace` 配置中设置 `tracesDir` 参数。这样所有追踪文件将按测试文件分组，存储在同一个目录中，。

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      trace: {
        mode: 'on',
        // 路径相对于项目的根目录
        tracesDir: './playwright-traces',
      },
    },
  },
})
```

追踪文件在报告器中以 [注释](/guide/test-annotations) 形式提供。例如，在 HTML 报告器中，你可以在测试详情中找到指向追踪文件的链接。

## 追踪标记 {#trace-markers}

你也可以使用 `page.mark(name, callback)` 将多个操作分组在一个标记下：

你可以添加显式的命名标记，让追踪时间线更易于阅读：

```ts
import { page } from 'vitest/browser'

document.body.innerHTML = `
  <button type="button">Sign in</button>
`

await page.getByRole('button', { name: 'Sign in' }).mark('sign in button rendered')
```

`page.mark(name)` 和 `locator.mark(name)` 均可用。

你也可以使用 `page.mark(name, callback)` 将多个操作组合成同一个标记：

```ts
await page.mark('sign in flow', async () => {
  await page.getByRole('textbox', { name: 'Email' }).fill('john@example.com')
  await page.getByRole('textbox', { name: 'Password' }).fill('secret')
  await page.getByRole('button', { name: 'Sign in' }).click()
})
```

你还可以使用 [`vi.defineHelper()`](/api/vi#vi-defineHelper) 包装可复用的工具函数，以便追踪条目会指向工具函数的调用位置，而不是具体内部实现：

```ts
import { vi } from 'vitest'
import { page } from 'vitest/browser'

const myRender = vi.defineHelper(async (content: string) => {
  document.body.innerHTML = content
  await page.elementLocator(document.body).mark('render helper')
})

test('renders content', async () => {
  await myRender('<button>Hello</button>') // trace points to this line
})
```

## 预览 {#preview}

打开追踪文件，你可以使用 Playwright Trace Viewer。在终端中运行以下命令：

```bash
npx playwright show-trace "path-to-trace-file"
```

这将启动 Trace Viewer 并加载指定的追踪文件。

或者，你可以在浏览器中打开 https://trace.playwright.dev 并在此处上传追踪文件。

<img alt="Trace Viewer 显示追踪时间线和渲染的组件" img-light src="/trace-viewer-light.png">
<img alt="Trace Viewer 显示追踪时间线和渲染的组件" img-dark src="/trace-viewer-dark.png">

## 源码位置 {#source-location}

打开追踪后，你会注意到 Vitest 会将浏览器交互分组，并将它们链接回触发这些交互的测试代码确切行号。以下情况会自动发生：

- `expect.element(...)` 断言
- 交互式操作，如 `click`、`fill`、`type`、`hover`、`selectOptions`、`upload`、`dragAndDrop`、`tab`、`keyboard`、`wheel` 和截图

在底层，Playwright 仍然像往常一样记录其自己的底层操作事件。Vitest 用源码位置组包装它们，这样你可以直接从追踪时间线跳转到测试中的相关行。

对于未自动覆盖的内容，你可以使用 `page.mark()` 或 `locator.mark()` 添加自己的追踪组，详情请参阅上文 [追踪标记](#trace-markers)。
