# 追踪视图 {#trace-view}

Vitest 浏览器模式支持生成 Playwright 的 [追踪文件](https://playwright.dev/docs/trace-viewer#viewing-remote-traces)。要启用追踪功能，需要在 `test.browser` 配置中设置 [`trace`](/config/browser/trace) 选项。

::: warning
生成追踪文件仅在使用 [Playwright provider](/config/browser/playwright) 时可用。
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

默认情况下，Vitest 会为每个测试生成一个追踪文件。你也可以通过设置 `trace` 为 `'on-first-retry'`、`'on-all-retries'` 或 `'retain-on-failure'` 来配置仅在测试失败时生成追踪。这些文件将保存在测试文件相邻的 `__traces__` 文件夹中。追踪文件的名称包括项目名称、测试名称、the [`repeats`](/api/test#repeats) 次数和 [`retry`](/api/test#retry) 次数：

```
chromium-my-test-0-0.trace.zip
^^^^^^^^ 项目名称
         ^^^^^^ 测试名称
                ^ 重复次数
                  ^ 重试次数
```

要更改输出目录，可以在 `test.browser.trace` 配置中设置 `tracesDir` 选项。这样所有追踪文件将按测试文件分组存储在同一目录中。

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      trace: {
        mode: 'on',
        // 路径相对于项目根目录
        tracesDir: './playwright-traces',
      },
    },
  },
})
```

追踪文件在报告器中作为 [注释](/guide/test-annotations) 形式呈现。例如，在 HTML 报告器中，你可以在测试详情页中找到追踪文件的链接。

## 预览 {#preview}

要打开追踪文件，可以使用 Playwright Trace Viewer。在终端中运行以下命令：

```bash
npx playwright show-trace "path-to-trace-file"
```

这将启动 Trace Viewer 并加载指定的追踪文件。

或者，你可以在浏览器中打开 https://trace.playwright.dev 并在那里上传追踪文件。

## 局限性 {#limitations}

目前，Vitest 无法填充 Trace Viewer 中的 "Sources" 标签页。这意味着虽然你可以看到测试期间捕获的操作和截图，但无法直接在 Trace Viewer 中查看测试的源代码。你需要返回代码编辑器查看测试实现。
