<<<<<<< HEAD
# 追踪视图 {#trace-view}

Vitest 浏览器模式支持生成 Playwright 的 [追踪文件](https://playwright.dev/docs/trace-viewer#viewing-remote-traces)。要启用追踪功能，需要在 `test.browser` 配置中设置 [`trace`](/guide/browser/config#browser-trace) 选项。

::: warning
生成追踪文件仅在使用 [Playwright provider](/guide/browser/playwright) 时可用。
=======
# Trace View

Vitest Browser Mode supports generating Playwright's [trace files](https://playwright.dev/docs/trace-viewer#viewing-remote-traces). To enable tracing, you need to set the [`trace`](/config/browser/trace) option in the `test.browser` configuration.

::: warning
Generating trace files is only available when using the [Playwright provider](/config/browser/playwright).
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b
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

<<<<<<< HEAD
默认情况下，Vitest 会为每个测试生成一个追踪文件。你也可以通过设置 `trace` 为 `'on-first-retry'`、`'on-all-retries'` 或 `'retain-on-failure'` 来配置仅在测试失败时生成追踪。这些文件将保存在测试文件相邻的 `__traces__` 文件夹中。追踪文件的名称包括项目名称、测试名称、[`repeats` 次数和 `retry` 次数](/api/#test-api-reference)：

```
chromium-my-test-0-0.trace.zip
^^^^^^^^ 项目名称
         ^^^^^^ 测试名称
                ^ 重复次数
                  ^ 重试次数
```

要更改输出目录，可以在 `test.browser.trace` 配置中设置 `tracesDir` 选项。这样所有追踪文件将按测试文件分组存储在同一目录中。
=======
By default, Vitest will generate a trace file for each test. You can also configure it to only generate traces on test failures by setting `trace` to `'on-first-retry'`, `'on-all-retries'` or `'retain-on-failure'`. The files will be saved in `__traces__` folder next to your test files. The name of the trace includes the project name, the test name, the [`repeats` count and `retry` count](/api/#test-api-reference):

```
chromium-my-test-0-0.trace.zip
^^^^^^^^ project name
         ^^^^^^ test name
                ^ repeat count
                  ^ retry count
```

To change the output directory, you can set the `tracesDir` option in the `test.browser.trace` configuration. This way all traces will be stored in the same directory, grouped by the test file.
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      trace: {
        mode: 'on',
<<<<<<< HEAD
        // 路径相对于项目根目录
=======
        // the path is relative to the root of the project
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b
        tracesDir: './playwright-traces',
      },
    },
  },
})
```

<<<<<<< HEAD
追踪文件在报告器中作为 [注释](/guide/test-annotations) 形式呈现。例如，在 HTML 报告器中，你可以在测试详情页中找到追踪文件的链接。

## 预览 {#preview}

要打开追踪文件，可以使用 Playwright Trace Viewer。在终端中运行以下命令：
=======
The traces are available in reporters as [annotations](/guide/test-annotations). For example, in the HTML reporter, you can find the link to the trace file in the test details.

## Preview

To open the trace file, you can use the Playwright Trace Viewer. Run the following command in your terminal:
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

```bash
npx playwright show-trace "path-to-trace-file"
```

<<<<<<< HEAD
这将启动 Trace Viewer 并加载指定的追踪文件。

或者，你可以在浏览器中打开 https://trace.playwright.dev 并在那里上传追踪文件。

## 限制 {#limitations}

目前，Vitest 无法填充 Trace Viewer 中的 "Sources" 标签页。这意味着虽然你可以看到测试期间捕获的操作和截图，但无法直接在 Trace Viewer 中查看测试的源代码。你需要返回代码编辑器查看测试实现。
=======
This will start the Trace Viewer and load the specified trace file.

Alternatively, you can open the Trace Viewer in your browser at https://trace.playwright.dev and upload the trace file there.

## Limitations

At the moment, Vitest cannot populate the "Sources" tab in the Trace Viewer. This means that while you can see the actions and screenshots captured during the test, you won't be able to view the source code of your tests directly within the Trace Viewer. You will need to refer back to your code editor to see the test implementation.
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b
