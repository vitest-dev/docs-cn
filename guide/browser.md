---
title: 浏览器模式 | 指南
---

# 浏览器模式 <Badge type="warning">实验性</Badge> {#browser-mode}

此页面提供有关 Vitest API 中实验性浏览器模式功能的信息，该功能允许你在浏览器中本地运行测试，提供对窗口和文档等浏览器全局变量的访问。此功能目前正在开发中，API 未来可能会更改。


## 安装

默认情况下，浏览器模式不需要任何额外的 E2E 提供商就能在本地运行测试，因为它复用了你现有的浏览器。

::: code-group
```bash [npm]
npm install -D vitest @vitest/browser
```
```bash [yarn]
yarn add -D vitest @vitest/browser
```
```bash [pnpm]
pnpm add -D vitest @vitest/browser
```
```bash [bun]
bun add -D vitest @vitest/browser
```
:::

::: warning
不过，要在 CI 中运行测试，您需要安装 [`playwright`](https://npmjs.com/package/playwright) 或 [`webdriverio`](https://www.npmjs.com/package/webdriverio) 。我们还建议在本地测试时切换到这两个选项中的一个，而不是使用默认的 `preview` 提供程序，因为它依赖于模拟事件而不是使用 Chrome DevTools 协议。
:::

### 使用 Playwright

::: code-group
```bash [npm]
npm install -D vitest @vitest/browser playwright
```
```bash [yarn]
yarn add -D vitest @vitest/browser playwright
```
```bash [pnpm]
pnpm add -D vitest @vitest/browser playwright
```
```bash [bun]
bun add -D vitest @vitest/browser playwright
```
:::

### 使用 Webdriverio

::: code-group
```bash [npm]
npm install -D vitest @vitest/browser webdriverio
```
```bash [yarn]
yarn add -D vitest @vitest/browser webdriverio
```
```bash [pnpm]
pnpm add -D vitest @vitest/browser webdriverio
```
```bash [bun]
bun add -D vitest @vitest/browser webdriverio
```
:::

## 配置

要在 Vitest 配置中激活浏览器模式，可以使用 `--browser` 标志，或在 Vitest 配置文件中将 `browser.enabled` 字段设为 `true`。下面是一个使用浏览器字段的配置示例：

```ts
export default defineConfig({
  test: {
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      name: 'chrome', // browser name is required
    },
  }
})
```

## 浏览器选项类型

Vitest 中的浏览器选项取决于provider。如果在配置文件中传递 `--browser` 且未指定其名称，则 Vitest 将失败。可用选项：
- `webdriverio` 支持这些浏览器:
  - `firefox`
  - `chrome`
  - `edge`
  - `safari`
- `playwright` 支持这些浏览器:
  - `firefox`
  - `webkit`
  - `chromium`

## 浏览器兼容性

Vitest 使用 [Vite dev server](https://cn.vitejs.dev/guide/#browser-support) 来运行您的测试，因此我们只支持 [`esbuild.target`](https://cn.vitejs.dev/config/shared-options#esbuild)选项（默认为 `esnext`）中指定的功能。

默认情况下，Vite 的目标浏览器支持本地 [ES Modules](https://caniuse.com/es6-module)、本地 [ESM dynamic import](https://caniuse.com/es6-module-dynamic-import) 和 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)。此外，我们还利用 [`BroadcastChannel`](https://caniuse.com/?search=BroadcastChannel)在 iframe 之间进行通信：

- Chrome >=87
- Firefox >=78
- Safari >=15.4
- Edge >=88

## 动机

我们开发了 Vitest 浏览器模式功能，以帮助改进测试工作流程并实现更准确、可靠的测试结果。这个实验性的测试 API 增加了在本地浏览器环境中运行测试的功能。在本节中，我们将探讨这个功能背后的动机以及它对测试的好处。

### 不同的测试方式

有不同的方法来测试 JavaScript 代码。一些测试框架在 Node.js 中模拟浏览器环境，而其他框架则在真实浏览器中运行测试。在这种情况下，[jsdom](https://www.npmjs.com/package/jsdom) 是一个模拟浏览器环境的规范实现，可以与 Jest 或 Vitest 等测试运行器一起使用，而其他测试工具，如 [WebdriverIO](https://webdriver.io/) 或 [Cypress](https://www.cypress.io/) 则允许开发者在真实浏览器中测试他们的应用，或者在 [Playwright](https://playwright.dev/) 的情况下提供一个浏览器引擎。

### 模拟警告

在模拟环境（如 jsdom 或 happy-dom）中测试 JavaScript 程序简化了测试设置并提供了易于使用的 API，使它们适用于许多项目并增加了对测试结果的信心。然而，需要牢记的是，这些工具仅模拟浏览器环境而不是实际浏览器，这可能导致模拟环境和真实环境之间存在一些差异。因此，测试结果可能会出现误报或漏报。

为了在测试中获得最高的水平，测试在真实浏览器环境中进行非常重要。这就是为什么我们开发了 Vitest 的浏览器模式功能，允许开发者在浏览器中本地运行测试，并获得更准确、可靠的测试结果。通过浏览器级别的测试，开发者可以更加自信地确保他们的应用在真实场景中能够按照预期工作。

## 缺点

使用 Vitest 浏览器时，重要的是要考虑以下缺点：

### 早期发展

Vitest 的浏览器模式功能目前仍处于早期开发阶段，因此可能尚未完全优化，也可能存在一些未解决的错误或问题。为了获得更好的测试结果，我们建议用户使用独立的浏览器端测试运行程序（如 WebdriverIO、Cypress 或 Playwright）来增强他们的 Vitest 浏览器体验。

### 更长的初始化时间

Vitest 浏览器在初始化过程中需要启动提供程序和浏览器，这可能需要一些时间。与其他测试模式相比，这可能导致更长的初始化时间。


## 跨浏览器测试

当你在浏览器选项中指定浏览器名称时，Vitest 将默认尝试使用 [WebdriverIO](https://webdriver.io/) 运行指定的浏览器，然后在那里运行测试。此功能使跨浏览器测试易于在 CI 等环境中使用和配置。如果不想使用 WebdriverIO，可以使用 `browser.provider` 选项配置自定义浏览器提供程序。

要使用 CLI 指定浏览器，请使用 `--browser` 标志后跟浏览器名称，如下所示：

```sh
npx vitest --browser=chrome
```

或者你可以使用点符号向 CLI 提供浏览器选项：

```sh
npx vitest --browser.name=chrome --browser.headless
```

## Headless

headless 模式是浏览器模式下可用的另一个选项。在 headless 模式下，浏览器在没有用户界面的情况下在后台运行，这对于运行自动化测试非常有用。Vitest 中的 headless 选项可以设置为布尔值以启用或禁用 headless 模式。

这是启用 headless 模式的示例配置：

```ts
export default defineConfig({
  test: {
    browser: {
      provider: 'playwright',
      enabled: true,
      headless: true,
    },
  },
})
```

你还可以在 CLI 中使用 `--browser.headless` 标志设置 headless 模式，如下所示：

```sh
npx vitest --browser.name=chrome --browser.headless
```

在这种情况下，Vitest 将使用 Chrome 浏览器以 headless 模式运行。

::: warning
默认情况下Headless模式不可用。您需要使用 [`playwright`](https://npmjs.com/package/playwright) 或 [`webdriverio`](https://www.npmjs.com/package/webdriverio) 提供程序来启用此功能。
:::

## 上下文

Vitest 通过 `@vitest/browser/context` 入口点公开上下文模块。从 2.0 开始，它公开了一小部分实用程序，这些实用程序可能在测试中对你有用。

```ts
export const server: {
  /**
   * Platform the Vitest server is running on.
   * The same as calling `process.platform` on the server.
   */
  platform: Platform
  /**
   * Runtime version of the Vitest server.
   * The same as calling `process.version` on the server.
   */
  version: string
  /**
   * Name of the browser provider.
   */
  provider: string
  /**
   * Name of the current browser.
   */
  browser: string
  /**
   * Available commands for the browser.
   */
  commands: BrowserCommands
}

/**
 * 用户交互处理程序。由浏览器 provider（`playwright` 或 `webdriverio`）提供支持。
 * 如果与 `preview` 提供程序一起使用，则通过 `@testing-library/user-event`回退到模拟事件。
 * @experimental
 */
export const userEvent: {
  setup: () => UserEvent
  /**
   * Click on an element. Uses provider's API under the hood and supports all its options.
   * @see {@link https://playwright.dev/docs/api/class-locator#locator-click} Playwright API
   * @see {@link https://webdriver.io/docs/api/element/click/} WebdriverIO API
   * @see {@link https://testing-library.com/docs/user-event/convenience/#click} testing-library API
   */
  click: (element: Element, options?: UserEventClickOptions) => Promise<void>
  /**
   * Triggers a double click event on an element. Uses provider's API under the hood.
   * @see {@link https://playwright.dev/docs/api/class-locator#locator-dblclick} Playwright API
   * @see {@link https://webdriver.io/docs/api/element/doubleClick/} WebdriverIO API
   * @see {@link https://testing-library.com/docs/user-event/convenience/#dblClick} testing-library API
   */
  dblClick: (element: Element, options?: UserEventDoubleClickOptions) => Promise<void>
  /**
   * Choose one or more values from a select element. Uses provider's API under the hood.
   * If select doesn't have `multiple` attribute, only the first value will be selected.
   * @see {@link https://playwright.dev/docs/api/class-locator#locator-select-option} Playwright API
   * @see {@link https://webdriver.io/docs/api/element/doubleClick/} WebdriverIO API
   * @see {@link https://testing-library.com/docs/user-event/utility/#-selectoptions-deselectoptions} testing-library API
   */
  selectOptions: (
    element: Element,
    values: HTMLElement | HTMLElement[] | string | string[],
    options?: UserEventSelectOptions,
  ) => Promise<void>
  /**
   * Type text on the keyboard. If any input is focused, it will receive the text,
   * otherwise it will be typed on the document. Uses provider's API under the hood.
   * **Supports** [user-event `keyboard` syntax](https://testing-library.com/docs/user-event/keyboard) (e.g., `{Shift}`) even with `playwright` and `webdriverio` providers.
   * @example
   * await userEvent.keyboard('foo') // translates to: f, o, o
   * await userEvent.keyboard('{{a[[') // translates to: {, a, [
   * await userEvent.keyboard('{Shift}{f}{o}{o}') // translates to: Shift, f, o, o
   * @see {@link https://playwright.dev/docs/api/class-locator#locator-press} Playwright API
   * @see {@link https://webdriver.io/docs/api/browser/action#key-input-source} WebdriverIO API
   * @see {@link https://testing-library.com/docs/user-event/keyboard} testing-library API
   */
  keyboard: (text: string) => Promise<void>
  /**
   * Types text into an element. Uses provider's API under the hood.
   * **Supports** [user-event `keyboard` syntax](https://testing-library.com/docs/user-event/keyboard) (e.g., `{Shift}`) even with `playwright` and `webdriverio` providers.
   * @example
   * await userEvent.type(input, 'foo') // translates to: f, o, o
   * await userEvent.type(input, '{{a[[') // translates to: {, a, [
   * await userEvent.type(input, '{Shift}{f}{o}{o}') // translates to: Shift, f, o, o
   * @see {@link https://playwright.dev/docs/api/class-locator#locator-press} Playwright API
   * @see {@link https://webdriver.io/docs/api/browser/action#key-input-source} WebdriverIO API
   * @see {@link https://testing-library.com/docs/user-event/utility/#type} testing-library API
   */
  type: (element: Element, text: string, options?: UserEventTypeOptions) => Promise<void>
  /**
   * Removes all text from an element. Uses provider's API under the hood.
   * @see {@link https://playwright.dev/docs/api/class-locator#locator-clear} Playwright API
   * @see {@link https://webdriver.io/docs/api/element/clearValue} WebdriverIO API
   * @see {@link https://testing-library.com/docs/user-event/utility/#clear} testing-library API
   */
  clear: (element: Element) => Promise<void>
  /**
   * Sends a `Tab` key event. Uses provider's API under the hood.
   * @see {@link https://playwright.dev/docs/api/class-locator#locator-press} Playwright API
   * @see {@link https://webdriver.io/docs/api/element/keys} WebdriverIO API
   * @see {@link https://testing-library.com/docs/user-event/convenience/#tab} testing-library API
   */
  tab: (options?: UserEventTabOptions) => Promise<void>
  /**
   * Hovers over an element. Uses provider's API under the hood.
   * @see {@link https://playwright.dev/docs/api/class-locator#locator-hover} Playwright API
   * @see {@link https://webdriver.io/docs/api/element/moveTo/} WebdriverIO API
   * @see {@link https://testing-library.com/docs/user-event/convenience/#hover} testing-library API
   */
  hover: (element: Element, options?: UserEventHoverOptions) => Promise<void>
  /**
   * Moves cursor position to the body element. Uses provider's API under the hood.
   * By default, the cursor position is in the center (in webdriverio) or in some visible place (in playwright)
   * of the body element, so if the current element is already there, this will have no effect.
   * @see {@link https://playwright.dev/docs/api/class-locator#locator-hover} Playwright API
   * @see {@link https://webdriver.io/docs/api/element/moveTo/} WebdriverIO API
   * @see {@link https://testing-library.com/docs/user-event/convenience/#hover} testing-library API
   */
  unhover: (element: Element, options?: UserEventHoverOptions) => Promise<void>
  /**
   * Fills an input element with text. This will remove any existing text in the input before typing the new value.
   * Uses provider's API under the hood.
   * This API is faster than using `userEvent.type` or `userEvent.keyboard`, but it **doesn't support** [user-event `keyboard` syntax](https://testing-library.com/docs/user-event/keyboard) (e.g., `{Shift}`).
   * @example
   * await userEvent.fill(input, 'foo') // translates to: f, o, o
   * await userEvent.fill(input, '{{a[[') // translates to: {, {, a, [, [
   * await userEvent.fill(input, '{Shift}') // translates to: {, S, h, i, f, t, }
   * @see {@link https://playwright.dev/docs/api/class-locator#locator-fill} Playwright API
   * @see {@link https://webdriver.io/docs/api/element/setValue} WebdriverIO API
   * @see {@link https://testing-library.com/docs/user-event/utility/#type} testing-library API
   */
  fill: (element: Element, text: string, options?: UserEventFillOptions) => Promise<void>
  /**
   * Drags a source element on top of the target element. This API is not supported by "preview" provider.
   * @see {@link https://playwright.dev/docs/api/class-frame#frame-drag-and-drop} Playwright API
   * @see {@link https://webdriver.io/docs/api/element/dragAndDrop/} WebdriverIO API
   */
  dragAndDrop: (source: Element, target: Element, options?: UserEventDragAndDropOptions) => Promise<void>
}

/**
 * Available commands for the browser.
 * A shortcut to `server.commands`.
 */
export const commands: BrowserCommands

export const page: {
  /**
   * Serialized test config.
   */
  config: ResolvedConfig
  /**
   * Change the size of iframe's viewport.
   */
  viewport: (width: number | string, height: number | string) => Promise<void>
  /**
   * Make a screenshot of the test iframe or a specific element.
   * @returns Path to the screenshot file.
   */
  screenshot: (options?: ScreenshotOptions) => Promise<string>
}
```

## Interactivity API

Vitest 使用 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) 或 [webdriver](https://www.w3.org/TR/webdriver/) API 实现了 [`@testing-library/user-event`](https://testing-library.com/docs/user-event)应用程序接口的子集，而不是伪造事件，这使得浏览器行为更加可靠和一致。

几乎每个 `userEvent` 方法都继承了其provider选项。要在集成开发环境中查看所有可用选项，请在 `tsconfig.json` 文件中添加 `webdriver` 或 `playwright` 类型：

::: code-group
```json [playwright]
{
  "compilerOptions": {
    "types": [
      "@vitest/browser/providers/playwright"
    ]
  }
}
```
```json [webdriverio]
{
  "compilerOptions": {
    "types": [
      "@vitest/browser/providers/webdriverio"
    ]
  }
}
```
:::

### userEvent.click

- **Type:** `(element: Element, options?: UserEventClickOptions) => Promise<void>`

点击元素。继承 provider 的选项。有关此方法如何工作的详细说明，请参阅 provider 的文档。

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'

test('clicks on an element', () => {
  const logo = screen.getByRole('img', { name: /logo/ })

  await userEvent.click(logo)
})
```

References:

- [Playwright `locator.click` API](https://playwright.dev/docs/api/class-locator#locator-click)
- [WebdriverIO `element.click` API](https://webdriver.io/docs/api/element/click/)
- [testing-library `click` API](https://testing-library.com/docs/user-event/convenience/#click)

### userEvent.dblClick

- **Type:** `(element: Element, options?: UserEventDoubleClickOptions) => Promise<void>`

触发元素的双击事件

请参阅你的 provider 的文档以获取有关此方法如何工作的详细说明。

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'

test('triggers a double click on an element', () => {
  const logo = screen.getByRole('img', { name: /logo/ })

  await userEvent.dblClick(logo)
})
```

References:

- [Playwright `locator.dblclick` API](https://playwright.dev/docs/api/class-locator#locator-dblclick)
- [WebdriverIO `element.doubleClick` API](https://webdriver.io/docs/api/element/doubleClick/)
- [testing-library `dblClick` API](https://testing-library.com/docs/user-event/convenience/#dblClick)

### userEvent.fill

- **Type:** `(element: Element, text: string) => Promise<void>`

用文本填充 input/textarea/conteneditable。这将在输入新值之前移除输入框中的任何现有文本。

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'

test('update input', () => {
  const input = screen.getByRole('input')

  await userEvent.fill(input, 'foo') // input.value == foo
  await userEvent.fill(input, '{{a[[') // input.value == {{a[[
  await userEvent.fill(input, '{Shift}') // input.value == {Shift}
})
```

::: tip
该 API 比使用 [`userEvent.type`](#userevent-type) 或 [`userEvent.keyboard`](#userevent-keyboard) 更快，但**不支持** [user-event `keyboard` syntax](https://testing-library.com/docs/user-event/keyboard) （例如，`{Shift}{selectall}`）。

在不需要输入特殊字符的情况下，我们建议使用此 API 而不是 [`userEvent.type`](#userevent-type)。
:::

References:

- [Playwright `locator.fill` API](https://playwright.dev/docs/api/class-locator#locator-fill)
- [WebdriverIO `element.setValue` API](https://webdriver.io/docs/api/element/setValue)
- [testing-library `type` API](https://testing-library.com/docs/user-event/utility/#type)

### userEvent.keyboard

- **Type:** `(text: string) => Promise<void>`

通过 `userEvent.keyboard` 可以触发键盘输入。如果任何输入有焦点，它就会在该输入中键入字符。否则，它将触发当前焦点元素（如果没有焦点元素，则为 `document.body`）上的键盘事件。

此 API 支持 [user-event `keyboard` syntax](https://testing-library.com/docs/user-event/keyboard)。

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'

test('trigger keystrokes', () => {
  await userEvent.keyboard('foo') // translates to: f, o, o
  await userEvent.keyboard('{{a[[') // translates to: {, a, [
  await userEvent.keyboard('{Shift}{f}{o}{o}') // translates to: Shift, f, o, o
  await userEvent.keyboard('{a>5}') // press a without releasing it and trigger 5 keydown
  await userEvent.keyboard('{a>5/}') // press a for 5 keydown and then release it
})
```

References:

- [Playwright `locator.press` API](https://playwright.dev/docs/api/class-locator#locator-press)
- [WebdriverIO `action('key')` API](https://webdriver.io/docs/api/browser/action#key-input-source)
- [testing-library `type` API](https://testing-library.com/docs/user-event/utility/#type)

### userEvent.tab

- **Type:** `(options?: UserEventTabOptions) => Promise<void>`

发送一个 `Tab` 键事件。这是`userEvent.keyboard('{tab}')`的简写。

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom' // adds support for "toHaveFocus"

test('tab works', () => {
  const [input1, input2] = screen.getAllByRole('input')

  expect(input1).toHaveFocus()

  await userEvent.tab()

  expect(input2).toHaveFocus()

  await userEvent.tab({ shift: true })

  expect(input1).toHaveFocus()
})
```

References:

- [Playwright `locator.press` API](https://playwright.dev/docs/api/class-locator#locator-press)
- [WebdriverIO `action('key')` API](https://webdriver.io/docs/api/browser/action#key-input-source)
- [testing-library `tab` API](https://testing-library.com/docs/user-event/convenience/#tab)

### userEvent.type

- **Type:** `(element: Element, text: string, options?: UserEventTypeOptions) => Promise<void>`

::: warning
如果不依赖 [special characters](https://testing-library.com/docs/user-event/keyboard)（例如，`{shift}` 或 `{selectall}`），建议使用 [`userEvent.fill`](#userevent-fill)。
:::

`type` 方法在 [`keyboard`](https://testing-library.com/docs/user-event/keyboard) API 的基础上实现了 `@testing-library/user-event` 的 [`type`](https://testing-library.com/docs/user-event/utility/#type) 工具。

该函数允许您在 input/textarea/conteneditable 中键入字符。它支持 [user-event `keyboard` syntax](https://testing-library.com/docs/user-event/keyboard)。

如果只需按下字符而无需输入，请使用 [`userEvent.keyboard`](#userevent-keyboard) API。

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'

test('update input', () => {
  const input = screen.getByRole('input')

  await userEvent.type(input, 'foo') // input.value == foo
  await userEvent.type(input, '{{a[[') // input.value == foo{a[
  await userEvent.type(input, '{Shift}') // input.value == foo{a[
})
```

References:

- [Playwright `locator.press` API](https://playwright.dev/docs/api/class-locator#locator-press)
- [WebdriverIO `action('key')` API](https://webdriver.io/docs/api/browser/action#key-input-source)
- [testing-library `type` API](https://testing-library.com/docs/user-event/utility/#type)

### userEvent.clear

- **Type:** `(element: Element) => Promise<void>`

此方法会清除输入元素的内容。

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom' // adds support for "toHaveValue"

test('clears input', () => {
  const input = screen.getByRole('input')

  await userEvent.fill(input, 'foo')
  expect(input).toHaveValue('foo')

  await userEvent.clear(input)
  expect(input).toHaveValue('')
})
```

References:

- [Playwright `locator.clear` API](https://playwright.dev/docs/api/class-locator#locator-clear)
- [WebdriverIO `element.clearValue` API](https://webdriver.io/docs/api/element/clearValue)
- [testing-library `clear` API](https://testing-library.com/docs/user-event/utility/#clear)

### userEvent.selectOptions

- **Type:** `(element: Element, values: HTMLElement | HTMLElement[] | string | string[], options?: UserEventSelectOptions) => Promise<void>`

`userEvent.selectOptions`允许在 `<select>`元素中选择一个值。

::: warning
如果 select 元素没有 [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-multiple) 属性，Vitest 将只选择数组中的第一个元素。

与 `@testing-library` 不同，Vitest 目前不支持 [listbox](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role)，但我们计划在将来添加对它的支持。
:::

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom' // adds support for "toHaveValue"

test('clears input', () => {
  const select = screen.getByRole('select')

  await userEvent.selectOptions(select, 'Option 1')
  expect(select).toHaveValue('option-1')

  await userEvent.selectOptions(select, 'option-1')
  expect(select).toHaveValue('option-1')

  await userEvent.selectOptions(select, [
    screen.getByRole('option', { name: 'Option 1' }),
    screen.getByRole('option', { name: 'Option 2' }),
  ])
  expect(select).toHaveValue(['option-1', 'option-2'])
})
```

::: warning
`webdriverio` provider 不支持选择多个元素，因为它不提供选择多个元素的 API。
:::

References:

- [Playwright `locator.selectOption` API](https://playwright.dev/docs/api/class-locator#locator-select-option)
- [WebdriverIO `element.selectByIndex` API](https://webdriver.io/docs/api/element/selectByIndex)
- [testing-library `selectOptions` API](https://testing-library.com/docs/user-event/utility/#-selectoptions-deselectoptions)

### userEvent.hover

- **Type:** `(element: Element, options?: UserEventHoverOptions) => Promise<void>`

该方法将光标位置移动到所选元素上。有关此方法如何工作的详细说明，请参阅 provider 的文档。

::: warning
如果使用的是 `webdriverio` provider，光标默认会移动到元素的中心。

如果使用的是 `playwright` provider，光标会移动到元素的某个可见点。
:::

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'

test('hovers logo element', () => {
  const logo = screen.getByRole('img', { name: /logo/ })

  await userEvent.hover(logo)
})
```

References:

- [Playwright `locator.hover` API](https://playwright.dev/docs/api/class-locator#locator-hover)
- [WebdriverIO `element.moveTo` API](https://webdriver.io/docs/api/element/moveTo/)
- [testing-library `hover` API](https://testing-library.com/docs/user-event/convenience/#hover)

### userEvent.unhover

- **Type:** `(element: Element, options?: UserEventHoverOptions) => Promise<void>`

其作用与 [`userEvent.hover`](#userevent-hover) 相同，但会将光标移至 `document.body` 元素。

::: warning
默认情况下，光标位置位于主体元素的中心（在 `webdriverio` provider 中）或某个可见位置（在 `playwright` provider中），因此如果当前悬停的元素已经位于相同位置，本方法将不起作用。
:::

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'

test('unhover logo element', () => {
  const logo = screen.getByRole('img', { name: /logo/ })

  await userEvent.unhover(logo)
})
```

References:

- [Playwright `locator.hover` API](https://playwright.dev/docs/api/class-locator#locator-hover)
- [WebdriverIO `element.moveTo` API](https://webdriver.io/docs/api/element/moveTo/)
- [testing-library `hover` API](https://testing-library.com/docs/user-event/convenience/#hover)

### userEvent.dragAndDrop

- **Type:** `(source: Element, target: Element, options?: UserEventDragAndDropOptions) => Promise<void>`

将源元素拖到目标元素的顶部。不要忘记，源元素的`draggable`属性必须设置为 `true`。

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom' // adds support for "toHaveTextContent"

test('drag and drop works', async () => {
  const source = screen.getByRole('img', { name: /logo/ })
  const target = screen.getByTestId('logo-target')

  await userEvent.dragAndDrop(source, target)

  expect(target).toHaveTextContent('Logo is processed')
})
```

::: warning
 `preview` provider不支持此 API。
:::

References:

- [Playwright `frame.dragAndDrop` API](https://playwright.dev/docs/api/class-frame#frame-drag-and-drop)
- [WebdriverIO `element.dragAndDrop` API](https://webdriver.io/docs/api/element/dragAndDrop/)

## Commands

命令是一个函数，它调用服务器上的另一个函数并将结果传递回浏览器。Vitest 公开了几个可以在浏览器测试中使用的内置命令。

## 内置命令

### 文件处理

你可以使用 `readFile` 、`writeFile` 和 `removeFile` API 来处理浏览器测试中的文件。所有路径都是相对于测试文件解析的，即使它们是在位于另一个文件中的辅助函数中调用的。

默认情况下，Vitest 使用 `utf-8` 编码，但你可以使用选项覆盖它。

::: tip
此 API 遵循 [`server.fs`](https://vitejs.dev/config/server-options.html#server-fs-allow) 出于安全原因的限制。
:::

```ts
import { server } from '@vitest/browser/context'

const { readFile, writeFile, removeFile } = server.commands

it('handles files', async () => {
  const file = './test.txt'

  await writeFile(file, 'hello world')
  const content = await readFile(file)

  expect(content).toBe('hello world')

  await removeFile(file)
})
```

## Custom Commands

你也可以通过 [`browser.commands`](/config/#browser-commands) 配置选项添加自己的命令。如果你开发了一个库，你可以通过插件内的 `config` 钩子来提供它们：

```ts
import type { Plugin } from 'vitest/config'
import type { BrowserCommand } from 'vitest/node'

const myCustomCommand: BrowserCommand<[arg1: string, arg2: string]> = (
  { testPath, provider },
  arg1,
  arg2
) => {
  if (provider.name === 'playwright') {
    console.log(testPath, arg1, arg2)
    return { someValue: true }
  }

  throw new Error(`provider ${provider.name} is not supported`)
}

export default function BrowserCommands(): Plugin {
  return {
    name: 'vitest:custom-commands',
    config() {
      return {
        test: {
          browser: {
            commands: {
              myCustomCommand,
            },
          },
        },
      }
    },
  }
}
```

然后，你可以通过从 `@vitest/brower/context` 导入它，在测试中调用它：

```ts
import { commands } from '@vitest/browser/context'
import { expect, test } from 'vitest'

test('custom command works correctly', async () => {
  const result = await commands.myCustomCommand('test1', 'test2')
  expect(result).toEqual({ someValue: true })
})

// if you are using TypeScript, you can augment the module
declare module '@vitest/browser/context' {
  interface BrowserCommands {
    myCustomCommand: (
      arg1: string,
      arg2: string
    ) => Promise<{
      someValue: true
    }>
  }
}
```

::: warning
如果自定义命令具有相同的名称，则它们将覆盖内置命令。
:::

### 自定义命令 `playwright`

Vitest 在命令上下文中公开了几个`playwright`特定属性。

- `page`引用包含测试 iframe 的完整页面。这是协调器 HTML，为避免出现问题，最好不要碰它。
- `frame`是测试器 [iframe 实例](https://playwright.dev/docs/api/class-frame)。它的 API 与页面类似，但不支持某些方法。
- `context` 是指唯一的[BrowserContext](https://playwright.dev/docs/api/class-browsercontext)。

```ts
import { defineCommand } from '@vitest/browser'
export const myCommand = defineCommand(async (ctx, arg1, arg2) => {
  if (ctx.provider.name === 'playwright') {
    const element = await ctx.frame.findByRole('alert')
    const screenshot = await element.screenshot()
    // do something with the screenshot
    return difference
  }
})
```

::: tip
如果您使用的是 TypeScript，请不要忘记将 `@vitest/browser/providers/playwright` 添加到您的 `tsconfig` "compilerOptions.types" 字段，以便在配置中以及 `userEvent` 和 `page` 选项中获得自动完成功：

```json
{
  "compilerOptions": {
    "types": [
      "@vitest/browser/providers/playwright"
    ]
  }
}
```
:::

### 自定义命令 `webdriverio`

Vitest 在上下文对象上公开了一些 `webdriverio` 特有属性。

- `browser` 是 `WebdriverIO.Browser` API.

Vitest 通过在调用命令前调用 `browser.switchToFrame` 自动将 `webdriver` 上下文切换到测试 iframe，因此 `$` 和 `$` 方法将引用 iframe 内的元素，而不是 orchestrator 中的元素，但非 Webdriver API 仍将引用 parent frame 上下文。

::: tip
如果您使用的是 TypeScript，请不要忘记将 `@vitest/browser/providers/webdriverio` 添加到您的 `tsconfig` "compilerOptions.types" 字段，以获得自动完成功能：

```json
{
  "compilerOptions": {
    "types": [
      "@vitest/browser/providers/webdriverio"
    ]
  }
}
```
:::

## 限制

### 线程阻塞对话框

使用 Vitest 浏览器时，需要注意的是像 `alert` 或 `confirm` 这样的线程阻塞对话框不能在本地使用。这是因为它们阻塞了网页，这意味着 Vitest 无法继续与该页面通信，导致执行挂起。

在这种情况下，Vitest 为这些 API 提供默认模拟和默认返回值。这确保如果用户不小心使用了同步弹出式 Web API，执行不会挂起。但是，仍然建议用户模拟这些 Web API 以获得更好的体验。在 [Mocking](/guide/mocking) 中阅读更多内容。
