---
title: Context API | 浏览器模式
---

# 上下文 {#context-api}

Vitest 通过 `vitest/browser` 入口点公开上下文模块。从 2.0 开始，它公开了一小部分实用程序，这些实用程序可能在测试中对你有用。

## `userEvent`

::: tip
`userEvent` API 的详细说明见 [Interactivity API](/api/browser/interactivity)。
:::

```ts
/**
 * 用于处理用户交互的处理器。支持由浏览器提供者（`playwright` 或 `webdriverio`）实现。
 * 如果与 `preview` 提供者一起使用，则回退到通过 `@testing-library/user-event` 模拟的事件。
 * @experimental
 */
export const userEvent: {
  setup: () => UserEvent
  cleanup: () => Promise<void>
  click: (element: Element, options?: UserEventClickOptions) => Promise<void>
  dblClick: (element: Element, options?: UserEventDoubleClickOptions) => Promise<void>
  tripleClick: (element: Element, options?: UserEventTripleClickOptions) => Promise<void>
  selectOptions: (
    element: Element,
    values: HTMLElement | HTMLElement[] | string | string[],
    options?: UserEventSelectOptions,
  ) => Promise<void>
  keyboard: (text: string) => Promise<void>
  type: (element: Element, text: string, options?: UserEventTypeOptions) => Promise<void>
  clear: (element: Element) => Promise<void>
  tab: (options?: UserEventTabOptions) => Promise<void>
  hover: (element: Element, options?: UserEventHoverOptions) => Promise<void>
  unhover: (element: Element, options?: UserEventHoverOptions) => Promise<void>
  fill: (element: Element, text: string, options?: UserEventFillOptions) => Promise<void>
  dragAndDrop: (source: Element, target: Element, options?: UserEventDragAndDropOptions) => Promise<void>
}
```

## `commands`

::: tip
Commands API 的详细说明见 [Commands API](/api/browser/commands)。
:::

```ts
/**
 * 可用的浏览器命令。
 * `server.commands` 的快捷方式。
 */
export const commands: BrowserCommands
```

## `page`

页面导出提供了与当前页面交互的实用程序。

::: warning
虽然它从 Playwright 的 `page` 中获取了一些实用程序，但它与 Playwright 的 `page` 并不是同一个对象。由于浏览器上下文是在浏览器中评估的，你的测试无法访问 Playwright 的 `page`，因为它是在服务器上运行的。
:::

使用 [Commands API](/api/browser/commands) 如果你需要访问 Playwright 的 `page` 对象。

```ts
export const page: {
  /**
   * 更改 iframe 视口的大小
   */
  viewport: (width: number, height: number) => Promise<void>
  /**
   * 对测试 iframe 或特定元素进行截图
   * @returns 截图文件的路径或路径和 base64 编码
   */
  screenshot: ((options: Omit<ScreenshotOptions, 'base64'> & { base64: true }) => Promise<{
    path: string
    base64: string
  }>) & ((options?: ScreenshotOptions) => Promise<string>)
  /**
   * 当启用浏览器追踪时，添加一个追踪标记
   */
  mark(name: string, options?: { stack?: string; kind?: BrowserTraceEntryKind }): Promise<void>
  /**
   * 当启用浏览器追踪时，将多个操作分组在一个追踪标记下
   */
  mark<T>(name: string, body: () => T | Promise<T>, options?: { stack?: string; kind?: BrowserTraceEntryKind }): Promise<T>
  /**
   * 使用自定义方法扩展默认的 `page` 对象
   */
  extend: (methods: Partial<BrowserPage>) => BrowserPage
  /**
   * 将一个 HTML 元素包装在 `Locator` 中。在查询元素时，搜索将始终返回此元素
   */
  elementLocator(element: Element): Locator
  /**
   * iframe 定位器。这是一个进入 iframe body 的文档定位器
   * 其工作原理与 `page` 对象类似
   * **Warning:** 目前，仅有 `playwright` 提供程序支持该功能
   */
  frameLocator(iframeElement: Locator): FrameLocator

  /**
   * Locator API。更多详细信息请参见其文档。
   */
  getByRole: (role: ARIARole | string, options?: LocatorByRoleOptions) => Locator
  getByLabelText: (text: string | RegExp, options?: LocatorOptions) => Locator
  getByTestId: (text: string | RegExp) => Locator
  getByAltText: (text: string | RegExp, options?: LocatorOptions) => Locator
  getByPlaceholder: (text: string | RegExp, options?: LocatorOptions) => Locator
  getByText: (text: string | RegExp, options?: LocatorOptions) => Locator
  getByTitle: (text: string | RegExp, options?: LocatorOptions) => Locator
}
```

::: tip
`getBy*` API 在 [Locators API](/api/browser/locators) 中有详细说明。
:::

::: warning WARNING <Version>3.2.0</Version>
请注意，如果 `save` 设置为 `false`，`screenshot` 将始终返回 base64 字符串。
在这种情况下，`path` 也会被忽略。
:::

### mark

```ts
function mark(name: string, options?: { stack?: string; kind?: BrowserTraceEntryKind }): Promise<void>
function mark<T>(
  name: string,
  body: () => T | Promise<T>,
  options?: { stack?: string; kind?: BrowserTraceEntryKind },
): Promise<T>
```

在追踪时间线为当前测试向添加一个命名标记。

传递 `options.stack` 以覆盖追踪元数据中的调用位置。适用于需要保留最终用户源代码位置的封装库。

传递 `options.kind` 以将你的标记分类为特定类型，例如 `'action'`。

如果你传递一个回调函数，Vitest 将使用此名称创建一个追踪组，运行回调，并自动关闭该组。

```ts
import { page } from 'vitest/browser'

await page.mark('before submit')
await page.getByRole('button', { name: 'Submit' }).click()
await page.mark('after submit')

await page.mark('submit flow', async () => {
  await page.getByRole('textbox', { name: 'Email' }).fill('john@example.com')
  await page.getByRole('button', { name: 'Submit' }).click()
}, { kind: 'action' })
```

::: tip
此方法仅在启用 [`browser.trace`](/config/browser/trace) 时生效。

在 [`BrowserCommandContext`](/api/browser/commands#recording-trace-markers) 上有一个服务器端的等效方法，因此 [自定义命令](/api/browser/commands#custom-commands) 可以记录触发它们的测试的标记。
:::

### frameLocator

```ts
function frameLocator(iframeElement: Locator): FrameLocator
```

`frameLocator` 方法返回一个 `FrameLocator` 实例，可用于查找 iframe 内的元素。

frame locator 类似于 `page`。它不指向 Iframe HTML 元素，而是指向 iframe 的文档。

```ts
const frame = page.frameLocator(
  page.getByTestId('iframe')
)

await frame.getByText('Hello World').click() // ✅
await frame.click() // ❌ 不可用
```

::: danger 重要
这与 Playwright 的行为不同。默认情况下，`frameLocator` 不支持在跨域 iframe 中使用 `expect.element()` 查询元素。交互式方法（例如 `.click()`）可以正常工作。

```ts
const frame = page.frameLocator(page.getByTestId('cross-origin-iframe'))
const button = frame.getByRole('button', { name: 'Submit' })

await button.click() // 交互式方法可以正常工作 ✅
await expect.element(button).toBeVisible() // 查询元素失败 ❌
```

如果你需要处理跨域 iframe，你需要在 [`launchOptions`](/config/browser/playwright.html#launchoptions) 中传递 `args: ["--disable-web-security"]`。或者创建一个自定义的 [浏览器命令](/api/browser/commands.html#custom-commands)，在服务器端访问可用的 iframe。
:::

::: danger 重要
目前，`frameLocator` 方法只有 `playwright` 支持。

交互方法（如 `click` 或 `fill`）在 iframe 内的元素上始终可用，但使用 `expect.element` 进行断言时要求 iframe 具有[同源策略](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)。
:::

## `cdp`

`cdp` 导出返回当前的 Chrome DevTools 协议会话。它主要用于库作者在其基础上构建工具。

::: warning
CDP 会话仅适用于 `playwright` provider，并且仅在使用 `chromium` 浏览器时有效。有关详细信息，请参阅 playwright 的 [`CDPSession`](https://playwright.dev/docs/api/class-cdpsession)文档。

CDP 是一种特权调试 API。仅当通过 [`api.allowWrite`](/config/api#api-allowwrite), and [`api.allowExec`](/config/api#api-allowexec) 启用浏览器 API 的写入及执行操作时，才可使用 CDP。
:::

```ts
export const cdp: () => CDPSession
```

## `server`

`server` 导出表示运行 Vitest 服务器的 Node.js 环境。它主要用于调试或根据环境限制测试。

```ts
export const server: {
  /**
   * Vitest 服务运行的平台。
   * 与在服务上调用 `process.platform` 相同。
   */
  platform: Platform
  /**
   * Vitest 服务的运行版本。
   * 与在服务上调用 `process.version` 相同。
   */
  version: string
  /**
   *  browser provider 的名字.
   */
  provider: string
  /**
   * 当前浏览器的名字。
   */
  browser: string
  /**
   * 浏览器的可用命令。
   */
  commands: BrowserCommands
  /**
   * 序列化测试配置。
   */
  config: SerializedConfig
}
```

<!-- TODO: translation -->

## `utils`

Utility functions useful for custom render libraries.

```ts
export const utils: {
  /**
   * This is similar to calling `page.elementLocator`, but it returns only
   * locator selectors.
   */
  getElementLocatorSelectors(element: Element): LocatorSelectors
  /**
   * Prints prettified HTML of an element.
   */
  debug(
    el?: Element | Locator | null | (Element | Locator)[],
    maxLength?: number,
    options?: PrettyDOMOptions,
  ): void
  /**
   * Returns prettified HTML of an element.
   */
  prettyDOM(
    dom?: Element | Locator | undefined | null,
    maxLength?: number,
    prettyFormatOptions?: PrettyDOMOptions,
  ): string
  /**
   * Configures default options of `prettyDOM` and `debug` functions.
   * This will also affect `vitest-browser-{framework}` package.
   */
  configurePrettyDOM(options: StringifyOptions): void
  /**
   * Creates "Cannot find element" error. Useful for custom locators.
   */
  getElementError(selector: string, container?: Element): Error
  /**
   * Utilities for generating and working with ARIA trees and templates.
   * @experimental
   */
  aria: {
    generateAriaTree(rootElement: Element): AriaNode
    renderAriaTree(root: AriaNode): string
    renderAriaTemplate(template: AriaTemplateNode): string
    parseAriaTemplate(text: string): AriaTemplateNode
    matchAriaTree(root: AriaNode, template: AriaTemplateNode): { pass: boolean; resolved: string }
  }
}
```

### configurePrettyDOM <Version>4.0.0</Version> {#configureprettydom}

The `configurePrettyDOM` function allows you to configure default options for the `prettyDOM` and `debug` functions. This is useful for customizing how HTML is formatted in test failure messages.

```ts
import { utils } from 'vitest/browser'

utils.configurePrettyDOM({
  maxDepth: 3,
  filterNode: 'script, style, [data-test-hide]'
})
```

#### Options

- **`maxDepth`** - Maximum depth to print nested elements (default: `Infinity`)
- **`maxLength`** - Maximum length of the output string (default: `7000`)
- **`filterNode`** - A CSS selector string or function to filter out nodes from the output. When a string is provided, elements matching the selector will be excluded. When a function is provided, it should return `false` to exclude a node.
- **`highlight`** - Enable syntax highlighting (default: `true`)
- And other options from [`@vitest/pretty-format`](https://npmx.dev/package/@vitest/pretty-format)

#### Filtering with CSS Selectors <Version>4.1.0</Version> {#filtering-with-css-selectors}

The `filterNode` option allows you to hide irrelevant markup (like scripts, styles, or hidden elements) from test failure messages, making it easier to identify the actual cause of failures.

```ts
import { utils } from 'vitest/browser'

// Filter out common noise elements
utils.configurePrettyDOM({
  filterNode: 'script, style, [data-test-hide]'
})

// Or use directly with prettyDOM
const html = utils.prettyDOM(element, undefined, {
  filterNode: 'script, style'
})
```

**Common Patterns:**

Filter out scripts and styles:
```ts
utils.configurePrettyDOM({ filterNode: 'script, style' })
```

Hide specific elements with data attributes:
```ts
utils.configurePrettyDOM({ filterNode: '[data-test-hide]' })
```

Hide nested content within an element:
```ts
// Hides all children of elements with data-test-hide-content
utils.configurePrettyDOM({ filterNode: '[data-test-hide-content] *' })
```

Combine multiple selectors:
```ts
utils.configurePrettyDOM({
  filterNode: 'script, style, [data-test-hide], svg'
})
```

::: tip
This feature is inspired by Testing Library's [`defaultIgnore`](https://testing-library.com/docs/dom-testing-library/api-configuration/#defaultignore) configuration.
:::

### aria <Version type="experimental">5.0.0</Version> {#aria}

The `aria` namespace exposes low-level utilities used by Vitest's ARIA snapshot matchers.

```ts
import { utils } from 'vitest/browser'

document.body.innerHTML = `
  <h1>Hello, World!</h1>
  <button aria-hidden="true">Hidden</button>
  <button>Visible</button>
`
const tree = utils.aria.generateAriaTree(document.body)
const yaml = utils.aria.renderAriaNode(tree)
console.log(yaml)
// - heading "Hello, World!" [level=1]
// - button "Visible""
```
