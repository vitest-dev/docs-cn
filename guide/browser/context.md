---
title: Context API | Browser Mode
---

# 上下文 {#context-api}

Vitest 通过 `vitest/browser` 入口点公开上下文模块。从 2.0 开始，它公开了一小部分实用程序，这些实用程序可能在测试中对你有用。

## `userEvent`

::: tip
`userEvent` API 的详细说明见[Interactivity API](/guide/browser/interactivity-api)。
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
Commands API 的详细说明见 [Commands API](/guide/browser/commands)。
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
虽然它从 Playwright 的 `page` 中获取了一些实用程序，但它与 Playwright 的 `page` 并不是同一个对象。由于浏览器上下文是在浏览器中评估的，您的测试无法访问 Playwright 的 `page`，因为它是在服务器上运行的。
:::

使用 [Commands API](/guide/browser/commands) 如果您需要访问 Playwright 的 `page` 对象。
```ts
export const page: {
  /**
   * 更改 iframe 视口的大小。
   */
  viewport: (width: number, height: number) => Promise<void>
  /**
   * 对测试 iframe 或特定元素进行截图。
   * @returns 截图文件的路径或路径和 base64 编码。
   */
  screenshot: ((options: Omit<ScreenshotOptions, 'base64'> & { base64: true }) => Promise<{
    path: string
    base64: string
  }>) & ((options?: ScreenshotOptions) => Promise<string>)
  /**
   * 使用自定义方法扩展默认的 `page` 对象。
   */
  extend: (methods: Partial<BrowserPage>) => BrowserPage
  /**
   * 将一个 HTML 元素包装在 `Locator` 中。在查询元素时，搜索将始终返回此元素。
   */
  elementLocator(element: Element): Locator
  /**
   * iframe 定位器。这是一个进入 iframe body 的文档定位器
   * 其工作原理与 `page` 对象类似。
   * **Warning:** 目前，仅有 `playwright` 提供程序支持该功能。
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
`getBy*` API 在 [Locators API](/guide/browser/locators) 中有详细说明。
:::

::: warning WARNING <Version>3.2.0</Version>
请注意，如果 `save` 设置为 `false`，`screenshot` 将始终返回 base64 字符串。
在这种情况下，`path` 也会被忽略。
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

::: danger IMPORTANT
目前，`frameLocator` 方法仅支持 `playwright` 提供者。

交互方法（如 `click` 或 `fill`）在 iframe 内的元素上始终可用，但使用 `expect.element` 进行断言时要求 iframe 具有[同源策略](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)。
:::

## `cdp`

`cdp` 导出返回当前的 Chrome DevTools 协议会话。它主要用于库作者在其基础上构建工具。

::: warning
CDP 会话仅适用于 `playwright` provider，并且仅在使用 `chromium` 浏览器时有效。有关详细信息，请参阅 playwright 的 [`CDPSession`](https://playwright.dev/docs/api/class-cdpsession)文档。
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
