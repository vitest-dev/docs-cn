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

交互方法（如 `click` 或 `fill`）在 iframe 内的元素上始终可用，但使用 `expect.element` 进行断言时要求 iframe 具有 [同源策略](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)。
:::

## `cdp`

`cdp` 导出返回当前的 Chrome DevTools 协议会话。它主要用于库作者在其基础上构建工具。

::: warning
CDP 会话仅适用于 `playwright` provider，并且仅在使用 `chromium` 浏览器时有效。有关详细信息，请参阅 playwright 的 [`CDPSession`](https://playwright.dev/docs/api/class-cdpsession) 文档。

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

## `utils`

适用于自定义渲染库的工具函数。

```ts
export const utils: {
  /**
   * 类似于调用 `page.elementLocator`，但仅返回定位器选择器
   */
  getElementLocatorSelectors(element: Element): LocatorSelectors
  /**
   * 打印元素格式化后的 HTML
   */
  debug(
    el?: Element | Locator | null | (Element | Locator)[],
    maxLength?: number,
    options?: PrettyDOMOptions,
  ): void
  /**
   * 返回元素格式化后的 HTML
   */
  prettyDOM(
    dom?: Element | Locator | undefined | null,
    maxLength?: number,
    prettyFormatOptions?: PrettyDOMOptions,
  ): string
  /**
   * 配置 `prettyDOM` 和 `debug` 函数的默认选项
   * 这也会影响 `vitest-browser-{framework}` 包
   */
  configurePrettyDOM(options: StringifyOptions): void
  /**
   * 创建 “找不到元素” 错误。适用于自定义定位器
   */
  getElementError(selector: string, container?: Element): Error
  /**
   * 用于生成和处理 ARIA 树及模板的工具函数
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

`configurePrettyDOM` 函数允许你配置 `prettyDOM` 和 `debug` 函数的默认选项，适用于自定义测试失败信息中 HTML 的显示格式。

```ts
import { utils } from 'vitest/browser'

utils.configurePrettyDOM({
  maxDepth: 3,
  filterNode: 'script, style, [data-test-hide]'
})
```

#### Options

- **`maxDepth`**：打印嵌套元素的最大深度（默认值：`Infinity`）
- **`maxLength`**：输出字符串的最大长度（默认值：`7000`）
- **`filterNode`**：用于从输出中过滤节点的 CSS 选择器字符串或函数。如果提供字符串，则排除匹配该选择器的元素；如果提供函数，则返回 `false` 表示排除该节点。
- **`highlight`**：启用语法高亮（默认值：`true`）
- 以及 [`@vitest/pretty-format`](https://npmx.dev/package/@vitest/pretty-format) 中的其他选项

#### 使用 CSS 选择器过滤 <Version>4.1.0</Version> {#filtering-with-css-selectors}

`filterNode` 选项允许你在测试失败信息中隐藏无关的 HTML 内容（如脚本、样式或隐藏元素），以便更容易找到失败的实际原因。

```ts
import { utils } from 'vitest/browser'

// 过滤掉常见的干扰元素
utils.configurePrettyDOM({
  filterNode: 'script, style, [data-test-hide]'
})

// 也可以在调用 prettyDOM 时直接传入过滤选项
const html = utils.prettyDOM(element, undefined, {
  filterNode: 'script, style'
})
```

**常见用法：**

过滤掉脚本和样式：

```ts
utils.configurePrettyDOM({ filterNode: 'script, style' })
```

隐藏带有特定 data 属性的元素：

```ts
utils.configurePrettyDOM({ filterNode: '[data-test-hide]' })
```

隐藏元素内的嵌套内容：

```ts
// 隐藏带有 data-test-hide-content 属性的元素的所有子元素
utils.configurePrettyDOM({ filterNode: '[data-test-hide-content] *' })
```

组合多个选择器：

```ts
utils.configurePrettyDOM({
  filterNode: 'script, style, [data-test-hide], svg'
})
```

::: tip
此功能的灵感来自 Testing Library 的 [`defaultIgnore`](https://testing-library.com/docs/dom-testing-library/api-configuration/#defaultignore) 配置。
:::

### aria <Version type="experimental">5.0.0</Version> {#aria}

`aria` 命名空间提供了 Vitest 的 ARIA 快照匹配器所使用的底层工具函数。

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
