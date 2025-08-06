# 浏览器配置参考

我们可以通过更新 [配置文件](/config/) 中的 `test.browser` 字段来更改浏览器配置。一个简单的配置文件示例如下：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        {
          browser: 'chromium',
          setupFile: './chromium-setup.js',
        },
      ],
    },
  },
})
```

请参阅 ["配置参考"](/config/) 文章以获取不同的配置示例。

::: warning
此页面上列出的 _所有选项_ 都位于配置中的 `test` 属性内：

```ts [vitest.config.js]
export default defineConfig({
  test: {
    browser: {},
  },
})
```
:::

## browser.enabled

- **类型:** `boolean`
- **默认值:** `false`
- **CLI:** `--browser`, `--browser.enabled=false`

默认情况下在浏览器中运行所有测试。请注意，`--browser` 仅在我们至少有一个 [`browser.instances`](#browser-instances) 项时有效。

## browser.instances

- **类型:** `BrowserConfig`
- **默认值:** `[{ browser: name }]`

定义多个浏览器设置。每个配置必须至少有一个 `browser` 字段。配置支持我们的提供者配置：

- [配置 Playwright](/guide/browser/playwright)
- [配置 WebdriverIO](/guide/browser/webdriverio)

::: tip
为了在使用内置提供者时获得更好的类型安全性，我们应该在 [配置文件](/config/) 中引用以下类型之一（针对我们使用的提供者）：

```ts
/// <reference types="@vitest/browser/providers/playwright" />
/// <reference types="@vitest/browser/providers/webdriverio" />
```
:::

除此之外，我们还可以指定大多数 [项目选项](/config/)（未标记为 <NonProjectOption /> 图标的选项）和一些 `browser` 选项，例如 `browser.testerHtmlPath`。

::: warning
每个浏览器配置都从根配置继承选项：

```ts{3,9} [vitest.config.ts]
export default defineConfig({
  test: {
    setupFile: ['./root-setup-file.js'],
    browser: {
      enabled: true,
      testerHtmlPath: './custom-path.html',
      instances: [
        {
          // 将同时具有 "root" 和 "browser" 的设置文件
          setupFile: ['./browser-setup-file.js'],
          // 隐式具有根配置中的 "testerHtmlPath" // [!code warning]
          // testerHtmlPath: './custom-path.html', // [!code warning]
        },
      ],
    },
  },
})
```

在开发过程中，Vitest 仅支持一个 [非无头](#browser-headless) 配置。我们可以通过在配置中指定 `headless: false`，或提供 `--browser.headless=false` 标志，或使用 `--project=chromium` 标志过滤项目来限制有头项目。

有关更多示例，请参阅 ["多设置" 指南](/guide/browser/multiple-setups)。
:::

可用的 `browser` 选项列表：

- [`browser.headless`](#browser-headless)
- [`browser.locators`](#browser-locators)
- [`browser.viewport`](#browser-viewport)
- [`browser.testerHtmlPath`](#browser-testerhtmlpath)
- [`browser.screenshotDirectory`](#browser-screenshotdirectory)
- [`browser.screenshotFailures`](#browser-screenshotfailures)

默认情况下，Vitest 创建一个包含单个元素的数组，该元素使用 [`browser.name`](#browser-name) 字段作为 `browser`。请注意，此行为将在 Vitest 4 中移除。

在底层，Vitest 将这些实例转换为共享单个 Vite 服务器的单独 [测试项目](/advanced/api/test-project)，以获得更好的缓存性能。

## browser&#46;name <Badge type="danger">已弃用</Badge> {#browser-name}

- **类型:** `string`
- **CLI:** `--browser=safari`

::: danger DEPRECATED
此 API 已弃用，并将在 Vitest 4 中移除。请改用 [`browser.instances`](#browser-instances) 选项。
:::

在特定浏览器中运行所有测试。不同提供者中的可能选项：

- `webdriverio`: `firefox`, `chrome`, `edge`, `safari`
- `playwright`: `firefox`, `webkit`, `chromium`
- 自定义：任何将传递给提供者的字符串

## browser.headless

- **类型:** `boolean`
- **默认值:** `process.env.CI`
- **CLI:** `--browser.headless`, `--browser.headless=false`

在 `headless` 模式下运行浏览器。如果我们在 CI 中运行 Vitest，则默认启用此模式。

## browser.isolate

- **类型:** `boolean`
- **默认值:** `true`
- **CLI:** `--browser.isolate`, `--browser.isolate=false`

在单独的 iframe 中运行每个测试。

## browser.testerHtmlPath

- **类型:** `string`

HTML 入口点的路径。可以是相对于项目根目录的路径。此文件将通过 [`transformIndexHtml`](https://vite.dev/guide/api-plugin#transformindexhtml) 钩子进行处理。

## browser.api

- **类型:** `number | { port?, strictPort?, host? }`
- **默认值:** `63315`
- **CLI:** `--browser.api=63315`, `--browser.api.port=1234, --browser.api.host=example.com`

配置为浏览器提供代码的 Vite 服务器的选项。不影响 [`test.api`](#api) 选项。默认情况下，Vitest 分配端口 `63315` 以避免与开发服务器冲突，允许我们同时运行两者。

## browser.provider {#browser-provider}

- **类型:** `'webdriverio' | 'playwright' | 'preview' | string`
- **默认值:** `'preview'`
- **CLI:** `--browser.provider=playwright`

在运行浏览器测试时使用的提供者路径。Vitest 提供了三个提供者，分别是 `preview`（默认）、`webdriverio` 和 `playwright`。自定义提供者应使用 `default` 导出，并具有以下形状：

```ts
export interface BrowserProvider {
  name: string
  supportsParallelism: boolean
  getSupportedBrowsers: () => readonly string[]
  beforeCommand?: (command: string, args: unknown[]) => Awaitable<void>
  afterCommand?: (command: string, args: unknown[]) => Awaitable<void>
  getCommandsContext: (sessionId: string) => Record<string, unknown>
  openPage: (sessionId: string, url: string, beforeNavigate?: () => Promise<void>) => Promise<void>
  getCDPSession?: (sessionId: string) => Promise<CDPSession>
  close: () => Awaitable<void>
  initialize: (
    ctx: TestProject,
    options: BrowserProviderInitializationOptions
  ) => Awaitable<void>
}
```

::: danger ADVANCED API
自定义提供者 API 高度实验性，并且可能在补丁版本之间发生变化。如果你只需要在浏览器中运行测试，请改用 [`browser.instances`](#browser-instances) 选项。
:::

## browser.providerOptions <Badge type="danger">已弃用</Badge> {#browser-provideroptions}

- **类型:** `BrowserProviderOptions`

::: danger DEPRECATED
此 API 已弃用，并将在 Vitest 4 中移除。请改用 [`browser.instances`](#browser-instances) 选项。
:::

调用 `provider.initialize` 时传递给提供者的选项。

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      providerOptions: {
        launch: {
          devtools: true,
        },
      },
    },
  },
})
```

::: tip
为了在使用内置提供者时获得更好的类型安全性，我们应该在 [配置文件](/config/) 中引用以下类型之一（针对我们使用的提供者）：

```ts
/// <reference types="@vitest/browser/providers/playwright" />
/// <reference types="@vitest/browser/providers/webdriverio" />
```
:::

## browser.ui

- **类型:** `boolean`
- **默认值:** `!isCI`
- **CLI:** `--browser.ui=false`

是否应将 Vitest UI 注入页面。默认情况下，在开发期间注入 UI iframe。

## browser.viewport

- **类型:** `{ width, height }`
- **默认值:** `414x896`

默认 iframe 的视口。

## browser.locators

内置 [浏览器定位器](/guide/browser/locators) 的选项。

### browser.locators.testIdAttribute

- **类型:** `string`
- **默认值:** `data-testid`

用于通过 `getByTestId` 定位器查找元素的属性。

## browser.screenshotDirectory

- **类型:** `string`
- **默认值:** 测试文件目录中的 `__snapshots__`

相对于 `root` 的屏幕截图目录路径。

## browser.screenshotFailures

- **类型:** `boolean`
- **默认值:** `!browser.ui`

如果测试失败，Vitest 是否应截取屏幕截图。

## browser.orchestratorScripts

- **类型:** `BrowserScript[]`
- **默认值:** `[]`

在测试 iframe 初始化之前应注入到编排器 HTML 中的自定义脚本。此 HTML 文档仅设置 iframe，并不实际导入我们的代码。

脚本的 `src` 和 `content` 将由 Vite 插件处理。脚本应提供以下形状：

```ts
export interface BrowserScript {
  /**
   * 如果提供了 "content" 并且类型为 "module"，则这将是其标识符。
   *
   * 如果我们使用的是 TypeScript，可以在此处添加 `.ts` 扩展名。
   * @default `injected-${index}.js`
   */
  id?: string
  /**
   * 要注入的 JavaScript 内容。如果类型为 "module"，则此字符串由 Vite 插件处理。
   *
   * 我们可以使用 `id` 为 Vite 提供文件扩展名的提示。
   */
  content?: string
  /**
   * 脚本的路径。此值由 Vite 解析，因此它可以是节点模块或文件路径。
   */
  src?: string
  /**
   * 脚本是否应异步加载。
   */
  async?: boolean
  /**
   * 脚本类型。
   * @default 'module'
   */
  type?: string
}
```

## browser.testerScripts

- **类型:** `BrowserScript[]`
- **默认值:** `[]`

::: danger DEPRECATED
此 API 已弃用，并将在 Vitest 4 中移除。请改用 [`browser.testerHtmlPath`](#browser-testerhtmlpath) 字段。
:::

在测试环境初始化之前应注入到测试器 HTML 中的自定义脚本。这对于注入 Vitest 浏览器实现所需的 polyfill 非常有用。在几乎所有情况下，建议使用 [`setupFiles`](#setupfiles) 代替此选项。

脚本的 `src` 和 `content` 将由 Vite 插件处理。

## browser.commands

- **类型:** `Record<string, BrowserCommand>`
- **默认值:** `{ readFile, writeFile, ... }`

可以从 `@vitest/browser/commands` 导入的自定义 [命令](/guide/browser/commands)。

## browser.connectTimeout

- **类型:** `number`
- **默认值:** `60_000`

超时时间（以毫秒为单位）。如果连接到浏览器的时间超过此时间，测试套件将失败。

::: info
这是浏览器与 Vitest 服务器建立 WebSocket 连接所需的时间。在正常情况下，此超时不应被触发。
:::

## browser.trackUnhandledErrors

- **Type:** `boolean`
- **Default:** `true`

Enables tracking uncaught errors and exceptions so they can be reported by Vitest.

If you need to hide certain errors, it is recommended to use [`onUnhandledError`](/config/#onunhandlederror) option instead.

Disabling this will completely remove all Vitest error handlers, which can help debugging with the "Pause on exceptions" checkbox turned on.

## browser.expect

- **Type:** `ExpectOptions`

### browser.expect.toMatchScreenshot

Default options for the
[`toMatchScreenshot` assertion](/guide/browser/assertion-api.html#tomatchscreenshot).
These options will be applied to all screenshot assertions.

::: tip
Setting global defaults for screenshot assertions helps maintain consistency
across your test suite and reduces repetition in individual tests. You can still
override these defaults at the assertion level when needed for specific test cases.
:::

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      expect: {
        toMatchScreenshot: {
          comparatorName: 'pixelmatch',
          comparatorOptions: {
            threshold: 0.2,
            allowedMismatchedPixels: 100,
          },
          resolveScreenshotPath: ({ arg, browserName, ext, testFileName }) =>
            `custom-screenshots/${testFileName}/${arg}-${browserName}${ext}`,
        },
      },
    },
  },
})
```

[All options available in the `toMatchScreenshot` assertion](/guide/browser/assertion-api#options)
can be configured here. Additionally, two path resolution functions are
available: `resolveScreenshotPath` and `resolveDiffPath`.

#### browser.expect.toMatchScreenshot.resolveScreenshotPath

- **Type:** `(data: PathResolveData) => string`
- **Default output:** `` `${root}/${testFileDirectory}/${screenshotDirectory}/${testFileName}/${arg}-${browserName}-${platform}${ext}` ``

A function to customize where reference screenshots are stored. The function
receives an object with the following properties:

- `arg: string`

  Path **without** extension, sanitized and relative to the test file.

  This comes from the arguments passed to `toMatchScreenshot`; if called
  without arguments this will be the auto-generated name.

  ```ts
  test('calls `onClick`', () => {
    expect(locator).toMatchScreenshot()
    // arg = "calls-onclick-1"
  })

  expect(locator).toMatchScreenshot('foo/bar/baz.png')
  // arg = "foo/bar/baz"

  expect(locator).toMatchScreenshot('../foo/bar/baz.png')
  // arg = "foo/bar/baz"
  ```

- `ext: string`

  Screenshot extension, with leading dot.

  This can be set through the arguments passed to `toMatchScreenshot`, but
  the value will fall back to `'.png'` if an unsupported extension is used.

- `browserName: string`

  The instance's browser name.

- `platform: NodeJS.Platform`

  The value of
  [`process.platform`](https://nodejs.org/docs/v22.16.0/api/process.html#processplatform).

- `screenshotDirectory: string`

  The value provided to
  [`browser.screenshotDirectory`](/guide/browser/config#browser-screenshotdirectory),
  if none is provided, its default value.

- `root: string`

  Absolute path to the project's [`root`](/config/#root).

- `testFileDirectory: string`

  Path to the test file, relative to the project's [`root`](/config/#root).

- `testFileName: string`

  The test's filename.

- `testName: string`

  The [`test`](/api/#test)'s name, including parent
  [`describe`](/api/#describe), sanitized.

- `attachmentsDir: string`

  The value provided to [`attachmentsDir`](/config/#attachmentsdir), if none is
  provided, its default value.

For example, to group screenshots by browser:

```ts
resolveScreenshotPath: ({ arg, browserName, ext, root, testFileName }) =>
  `${root}/screenshots/${browserName}/${testFileName}/${arg}${ext}`
```

#### browser.expect.toMatchScreenshot.resolveDiffPath

- **Type:** `(data: PathResolveData) => string`
- **Default output:** `` `${root}/${attachmentsDir}/${testFileDirectory}/${testFileName}/${arg}-${browserName}-${platform}${ext}` ``

A function to customize where diff images are stored when screenshot comparisons
fail. Receives the same data object as
[`resolveScreenshotPath`](#browser-expect-tomatchscreenshot-resolvescreenshotpath).

For example, to store diffs in a subdirectory of attachments:

```ts
resolveDiffPath: ({ arg, attachmentsDir, browserName, ext, root, testFileName }) =>
  `${root}/${attachmentsDir}/screenshot-diffs/${testFileName}/${arg}-${browserName}${ext}`
```

::: tip
To have a better type safety when using built-in providers, you should reference
one of these types (for provider that you are using) in your
[config file](/config/):

```ts
/// <reference types="@vitest/browser/providers/playwright" />
/// <reference types="@vitest/browser/providers/webdriverio" />
```
:::
