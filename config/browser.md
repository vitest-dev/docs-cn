---
title: 浏览器配置 | 配置
outline: deep
---

# 浏览器配置 {#browser-config-reference}

我们可以通过更新 [配置文件](/config/) 中的 `test.browser` 字段来更改浏览器配置。一个简单的配置文件示例如下：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
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

请参阅 [“配置文件”](/config/) 文章以获取不同的配置示例。

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
- **默认值:** `[]`

定义多个浏览器实例。每个配置必须至少有一个 `browser` 字段。

你可以指定大多数 [项目选项](/config/)（未标记 <CRoot /> 图标的）和一些 `browser` 配置项，如 `browser.testerHtmlPath`。

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

有关更多示例，请参阅 ["多设置" 指南](/guide/browser/multiple-setups)。
:::

可用的 `browser` 选项列表：

- [`browser.headless`](#browser-headless)
- [`browser.locators`](#browser-locators)
- [`browser.viewport`](#browser-viewport)
- [`browser.testerHtmlPath`](#browser-testerhtmlpath)
- [`browser.screenshotDirectory`](#browser-screenshotdirectory)
- [`browser.screenshotFailures`](#browser-screenshotfailures)
- [`browser.provider`](#browser-provider)

在底层，Vitest 将这些实例转换为共享单个 Vite 服务器的单独 [测试项目](/api/advanced/test-project)，以获得更好的缓存性能。

## browser.headless

- **类型:** `boolean`
- **默认值:** `process.env.CI`
- **CLI:** `--browser.headless`, `--browser.headless=false`

在 `headless` 模式下运行浏览器。如果我们在 CI 中运行 Vitest，则默认启用此模式。

## browser.isolate <Deprecated />

- **类型:** `boolean`
- **默认值:** 与 [`--isolate`](/config/#isolate) 相同
- **CLI:** `--browser.isolate`, `--browser.isolate=false`

在单独的 iframe 中运行每个测试。

::: danger 已弃用
此选项已弃用。请改用 [`isolate`](/config/#isolate)。
:::

## browser.testerHtmlPath

- **类型:** `string`

HTML 入口点的路径。可以是相对于项目根目录的路径。此文件将通过 [`transformIndexHtml`](https://vite.dev/guide/api-plugin#transformindexhtml) 钩子进行处理。

## browser.api

- **类型:** `number | { port?, strictPort?, host? }`
- **默认值:** `63315`
- **CLI:** `--browser.api=63315`, `--browser.api.port=1234, --browser.api.host=example.com`

配置为浏览器提供代码的 Vite 服务器的选项。不影响 [`test.api`](#api) 选项。默认情况下，Vitest 分配端口 `63315` 以避免与开发服务器冲突，允许我们同时运行两者。

## browser.provider {#browser-provider}

- **类型:** `BrowserProviderOption`
- **默认值:** `'preview'`
- **CLI:** `--browser.provider=playwright`

提供者工厂的返回值。你可以从 `@vitest/browser-<provider-name>` 导入工厂函数，或者创建自己的提供者：

```ts{8-10}
import { playwright } from '@vitest/browser-playwright'
import { webdriverio } from '@vitest/browser-webdriverio'
import { preview } from '@vitest/browser-preview'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      provider: webdriverio(),
      provider: preview(), // 默认
    },
  },
})
```

要配置提供者如何初始化浏览器，你可以将选项传递给工厂函数：

```ts{7-13,20-26}
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      // 所有实例之间共享提供者的选项
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
          // 仅为单个实例覆盖选项
          // 这不会将选项与父选项合并
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

### 自定义提供者 <Badge type="danger">高级</Badge> {#custom-provider-advanced}

::: danger 高级 API
自定义提供者 API 高度实验性，并且可能在补丁版本之间发生变化。如果你只需要在浏览器中运行测试，请改用 [`browser.instances`](#browser-instances) 选项。
:::

```ts
export interface BrowserProvider {
  name: string
  mocker?: BrowserModuleMocker
  readonly initScripts?: string[]
  /**
   * @experimental 选择进入文件并行化
   */
  supportsParallelism: boolean
  getCommandsContext: (sessionId: string) => Record<string, unknown>
  openPage: (sessionId: string, url: string) => Promise<void>
  getCDPSession?: (sessionId: string) => Promise<CDPSession>
  close: () => Awaitable<void>
}
```

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

内置 [浏览器定位器](/api/browser/locators) 的选项。

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

## browser.commands

- **类型:** `Record<string, BrowserCommand>`
- **默认值:** `{ readFile, writeFile, ... }`

可以在浏览器测试中从 `vitest/browser` 导入的自定义 [命令](/api/browser/commands)。

## browser.connectTimeout

- **类型:** `number`
- **默认值:** `60_000`

超时时间（以毫秒为单位）。如果连接到浏览器的时间超过此时间，测试套件将失败。

::: info
这是浏览器与 Vitest 服务器建立 WebSocket 连接所需的时间。在正常情况下，此超时不应被触发。
:::

## browser.trace

- **类型：** `'on' | 'off' | 'on-first-retry' | 'on-all-retries' | 'retain-on-failure' | object`
- **CLI:** `--browser.trace=on`, `--browser.trace=retain-on-failure`
- **默认:** `'off'`

捕获浏览器测试运行的跟踪。您可以使用 [Playwright 跟踪查看器](https://trace.playwright.dev/) 预览跟踪。

该选项支持以下值：

- `'on'` - 捕捉所有测试的跟踪。(不建议使用，因为性能较差）
- `'off'` - 不捕捉痕迹。
- `'on-first-retry'` - 仅在第一次重试测试时捕捉跟踪。
- `'on-all-retries'` - 在每次重试测试时捕捉跟踪。
- `'retain-on-failure'` - 只捕捉失败测试的跟踪。这会自动删除通过的测试跟踪。
- `object` - 一个具有以下样子的对象

```ts
interface TraceOptions {
  mode: 'on' | 'off' | 'on-first-retry' | 'on-all-retries' | 'retain-on-failure'
  /**
   * 存储所有痕迹的目录。默认情况下，Vitest
   * 将所有跟踪记录存储在靠近测试文件的 `__traces__` 文件夹中。
   */
  tracesDir?: string
  /**
   * 是否在跟踪过程中截图。截图用于建立时间线预览。
   * @default true
   */
  screenshots?: boolean
  /**
   * 如果该选项为真，跟踪将
   * - 捕捉每个操作的 DOM 快照
   * - 记录网络活动
   * @default true
   */
  snapshots?: boolean
}
```

::: danger WARNING
只有 [**playwright**](/config/browser/playwright) 提供者支持该选项。
:::

## browser.trackUnhandledErrors

- **类型：** `boolean`
- **Default:** `true`

启用对未捕获错误和异常的跟踪，以便 Vitest 报告。

如果需要隐藏某些错误，建议使用 [`onUnhandledError`](/config/#onunhandlederror) 选项。

禁用此功能将完全移除所有 Vitest 的错误处理机制，有助于在启用“暂停于异常”功能时进行调试。

## browser.expect

- **类型：** `ExpectOptions`

### browser.expect.toMatchScreenshot

[`toMatchScreenshot`](/api/browser/assertions.html#tomatchscreenshot) 断言的默认选项。
这些选项将应用于所有截图断言。

::: tip
为截图断言设置全局默认值，有助于在整个测试套件中保持一致性，并减少单个测试中的重复。如果需要，你仍可以在特定测试用例的断言级别覆盖这些默认值。
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

`toMatchScreenshot` 断言中可用的 [所有选项](/api/browser/assertions#options) 均可在此配置。此外，还提供了两个路径解析函数：`resolveScreenshotPath` 和 `resolveDiffPath`。

#### browser.expect.toMatchScreenshot.resolveScreenshotPath

- **类型：** `(data: PathResolveData) => string`
- **默认输出：** `` `${root}/${testFileDirectory}/${screenshotDirectory}/${testFileName}/${arg}-${browserName}-${platform}${ext}` ``

一个用于自定义参考截图存储位置的函数。该函数接收一个包含以下属性的对象：

- `arg: string`

  路径**不含**扩展名，已清理且相对于测试文件。
  这来自传递给 `toMatchScreenshot` 的参数；如果没有参数，将使用自动生成的名称。

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

  截图扩展名，带前导点。

  可以通过传递给 `toMatchScreenshot` 的参数设置，但如果使用了不支持的扩展名，值将回退为 `'.png'`。

- `browserName: string`

  实例的浏览器名称。

- `platform: NodeJS.Platform`

  [`process.platform`](https://nodejs.org/docs/v22.16.0/api/process.html#processplatform) 属性的值。

- `screenshotDirectory: string`

  如果未提供值，则为 [`browser.screenshotDirectory`](/config/browser/screenshotdirectory)。

- `root: string`

  项目根目录（[`root`](/config/#root)）的绝对路径。

- `testFileDirectory: string`

  测试文件的路径，相对于项目的根目录（[`root`](/config/#root)）。

- `testFileName: string`

  测试文件的文件名。

- `testName: string`

  [`test`](/api/#test) 的名称，包括父级 [`describe`](/api/#describe) ，已清理。

- `attachmentsDir: string`

如果未提供值，则为 [`attachmentsDir`](/config/#attachmentsdir) 提供的默认值。

例如，按浏览器分组截图：

```ts
resolveScreenshotPath: ({ arg, browserName, ext, root, testFileName }) =>
  `${root}/screenshots/${browserName}/${testFileName}/${arg}${ext}`
```

#### browser.expect.toMatchScreenshot.resolveDiffPath

- **类型：** `(data: PathResolveData) => string`
- **默认输出：** `` `${root}/${attachmentsDir}/${testFileDirectory}/${testFileName}/${arg}-${browserName}-${platform}${ext}` ``

一个用于自定义截图比较失败时差异图像存储位置的函数。它接收与 [`resolveScreenshotPath`](#browser-expect-tomatchscreenshot-resolvescreenshotpath) 相同的数据对象。

例如，将差异图像存储在附件的子目录中：

```ts
resolveDiffPath: ({ arg, attachmentsDir, browserName, ext, root, testFileName }) =>
  `${root}/${attachmentsDir}/screenshot-diffs/${testFileName}/${arg}-${browserName}${ext}`
```

#### browser.expect.toMatchScreenshot.comparators

- **类型:** `Record<string, Comparator>`

注册自定义屏幕截图比较算法，例如 [SSIM](https://en.wikipedia.org/wiki/Structural_similarity_index_measure) 或其他感知相似度指标。

要创建自定义比较器，你需要在配置文件中进行注册。如果使用 TypeScript，请将其选项声明在 `ScreenshotComparatorRegistry` 接口中。

```ts
import { defineConfig } from 'vitest/config'

// 1. 声明比较器的选项类型
declare module 'vitest/browser' {
  interface ScreenshotComparatorRegistry {
    myCustomComparator: {
      sensitivity?: number
      ignoreColors?: boolean
    }
  }
}

// 2. 实现比较器函数
export default defineConfig({
  test: {
    browser: {
      expect: {
        toMatchScreenshot: {
          comparators: {
            myCustomComparator: async (
              reference,
              actual,
              {
                createDiff, // 始终由 Vitest 提供
                sensitivity = 0.01,
                ignoreColors = false,
              }
            ) => {
              // 算法实现...
              return { pass, diff, message }
            },
          },
        },
      },
    },
  },
})
```

然后在测试中使用它：

```ts
await expect(locator).toMatchScreenshot({
  comparatorName: 'myCustomComparator',
  comparatorOptions: {
    sensitivity: 0.08,
    ignoreColors: true,
  },
})
```

**比较器函数签名：**

```ts
type Comparator<Options> = (
  reference: {
    metadata: { height: number; width: number }
    data: TypedArray
  },
  actual: {
    metadata: { height: number; width: number }
    data: TypedArray
  },
  options: {
    createDiff: boolean
  } & Options
) => Promise<{
  pass: boolean
  diff: TypedArray | null
  message: string | null
}> | {
  pass: boolean
  diff: TypedArray | null
  message: string | null
}
```

`reference` 和 `actual` 图像使用对应的编解码器（目前仅支持 PNG）进行解码。`data` 属性是一个扁平的 `TypedArray`（`Buffer`、`Uint8Array` 或 `Uint8ClampedArray`），包含 RGBA 格式的像素数据：

- **每像素 4 字节**：红色、绿色、蓝色、alpha 通道（每个从 `0` 到 `255`）
- **行主序**：像素按从左到右、从上到下的顺序存储
- **总长度**：`width × height × 4` 字节
- **Alpha 通道**：始终存在。没有透明度的图像的 alpha 值设置为 `255`（完全不透明）

::: tip 性能考虑
`createDiff` 选项指示是否需要差异图像。在 [稳定截图检测](/guide/browser/visual-regression-testing#how-visual-tests-work) 期间，Vitest 会调用比较器并设置 `createDiff: false` 以避免不必要的工作。

**尊重此标志以保持测试快速**。
:::

::: warning 处理缺失选项
`toMatchScreenshot()` 中的 `options` 参数是可选的，因此用户可能不会提供所有比较器选项。始终使用默认值使它们成为可选的：

```ts
myCustomComparator: (
  reference,
  actual,
  { createDiff, threshold = 0.1, maxDiff = 100 },
) => {
  // 比较逻辑...
}
```
:::
