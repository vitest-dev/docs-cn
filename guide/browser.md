---
title: 浏览器模式 | 指南
---

# 浏览器模式 <Badge type="warning">实验性</Badge> {#browser-mode}

此页面提供有关 Vitest API 中实验性浏览器模式功能的信息，该功能允许你在浏览器中本地运行测试，提供对窗口和文档等浏览器全局变量的访问。此功能目前正在开发中，API 未来可能会更改。


## 安装

为方便设置，可使用 `vitest init browser` 命令安装所需的依赖项并创建浏览器配置。

::: code-group
```bash [npm]
npx vitest init browser
```
```bash [yarn]
yarn exec vitest init browser
```
```bash [pnpm]
pnpx vitest init browser
```
```bash [bun]
bunx vitest init browser
```
:::

### 手动安装

您也可以手动安装软件包。默认情况下，浏览器模式不需要任何额外的 E2E provider 就能在本地运行测试，因为它会复用你现有的浏览器。

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

如果之前未使用过 Vite，请确保已安装框架插件并在配置中指定。有些框架可能需要额外配置才能运行，请查看其 Vite 相关文档以确定。

::: code-group
```ts [vue]
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chrome',
    }
  }
})
```
```ts [svelte]
import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chrome',
    }
  }
})
```
```ts [solid]
import { defineConfig } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chrome',
    }
  }
})
```
```ts [marko]
import { defineConfig } from 'vitest/config'
import marko from '@marko/vite'

export default defineConfig({
  plugins: [marko()],
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chrome',
    }
  }
})
```
:::

::: tip
`react` 不需要插件就能工作，但 `preact` 需要 [extra configuration](https://preactjs.com/guide/v10/getting-started/#create-a-vite-powered-preact-app) 才能使用别名
:::

如果需要使用基于 Node 的运行程序运行某些测试，可以定义一个 [workspace](/guide/workspace) 文件，为不同的测试策略分别配置：

```ts
// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      // an example of file based convention,
      // you don't have to follow it
      include: [
        'tests/unit/**/*.{test,spec}.ts',
        'tests/**/*.unit.{test,spec}.ts',
      ],
      name: 'unit',
      environment: 'node',
    },
  },
  {
    test: {
      // an example of file based convention,
      // you don't have to follow it
      include: [
        'tests/browser/**/*.{test,spec}.ts',
        'tests/**/*.browser.{test,spec}.ts',
      ],
      name: 'browser',
      browser: {
        enabled: true,
        name: 'chrome',
      },
    },
  },
])
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


## Assertion API

Vitest 捆绑了 [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom)库，以提供各种开箱即用的 DOM 断言。有关详细文档，请阅读 `jest-dom` readme：

- [`toBeDisabled`](https://github.com/testing-library/jest-dom#toBeDisabled)
- [`toBeEnabled`](https://github.com/testing-library/jest-dom#toBeEnabled)
- [`toBeEmptyDOMElement`](https://github.com/testing-library/jest-dom#toBeEmptyDOMElement)
- [`toBeInTheDocument`](https://github.com/testing-library/jest-dom#toBeInTheDocument)
- [`toBeInvalid`](https://github.com/testing-library/jest-dom#toBeInvalid)
- [`toBeRequired`](https://github.com/testing-library/jest-dom#toBeRequired)
- [`toBeValid`](https://github.com/testing-library/jest-dom#toBeValid)
- [`toBeVisible`](https://github.com/testing-library/jest-dom#toBeVisible)
- [`toContainElement`](https://github.com/testing-library/jest-dom#toContainElement)
- [`toContainHTML`](https://github.com/testing-library/jest-dom#toContainHTML)
- [`toHaveAccessibleDescription`](https://github.com/testing-library/jest-dom#toHaveAccessibleDescription)
- [`toHaveAccessibleErrorMessage`](https://github.com/testing-library/jest-dom#toHaveAccessibleErrorMessage)
- [`toHaveAccessibleName`](https://github.com/testing-library/jest-dom#toHaveAccessibleName)
- [`toHaveAttribute`](https://github.com/testing-library/jest-dom#toHaveAttribute)
- [`toHaveClass`](https://github.com/testing-library/jest-dom#toHaveClass)
- [`toHaveFocus`](https://github.com/testing-library/jest-dom#toHaveFocus)
- [`toHaveFormValues`](https://github.com/testing-library/jest-dom#toHaveFormValues)
- [`toHaveStyle`](https://github.com/testing-library/jest-dom#toHaveStyle)
- [`toHaveTextContent`](https://github.com/testing-library/jest-dom#toHaveTextContent)
- [`toHaveValue`](https://github.com/testing-library/jest-dom#toHaveValue)
- [`toHaveDisplayValue`](https://github.com/testing-library/jest-dom#toHaveDisplayValue)
- [`toBeChecked`](https://github.com/testing-library/jest-dom#toBeChecked)
- [`toBePartiallyChecked`](https://github.com/testing-library/jest-dom#toBePartiallyChecked)
- [`toHaveRole`](https://github.com/testing-library/jest-dom#toHaveRole)
- [`toHaveErrorMessage`](https://github.com/testing-library/jest-dom#toHaveErrorMessage)

如果使用 TypeScript 或希望在 `expect` 中获得正确的类型提示，请确保根据使用的提供程序，在 `tsconfig` 中指定了 `@vitest/browser/providers/playwright` 或 `@vitest/browser/providers/webdriverio`。如果使用默认的 `preview` 提供程序，则可指定 `@vitest/browser/matchers` 代替。

::: code-group
```json [preview]
{
  "compilerOptions": {
    "types": [
      "@vitest/browser/matchers"
    ]
  }
}
```
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

## Retry-ability

浏览器中的测试由于其异步特性，可能会不一致地失败。因此，即使条件延迟（如超时、网络请求或动画），也必须有办法保证断言成功。为此，Vitest 通过 [`expect.poll`](/api/expect#poll)和 `expect.element` API 提供了可重试的断言：

```ts
import { expect, test } from 'vitest'
import { screen } from '@testing-library/dom'

test('error banner is rendered', async () => {
  triggerError()

  // @testing-library provides queries with built-in retry-ability
  // It will try to find the banner until it's rendered
  const banner = await screen.findByRole('alert', {
    name: /error/i,
  })

  // Vitest provides `expect.element` with built-in retry-ability
  // It will check `element.textContent` until it's equal to "Error!"
  await expect.element(banner).toHaveTextContent('Error!')
})
```

::: tip
`expect.element` 是 `expect.poll(() => element)`的简写，工作方式完全相同。

`toHaveTextContent` 和所有其他 [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom)断言在没有内置重试机制的常规`expect`中仍然可用：


```ts
// will fail immediately if .textContent is not `'Error!'`
expect(banner).toHaveTextContent('Error!')
```
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
  click: (element: Element, options?: UserEventClickOptions) => Promise<void>
  dblClick: (element: Element, options?: UserEventDoubleClickOptions) => Promise<void>
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

export const cdp: () => CDPSession
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

### userEvent.tripleClick

- **Type:** `(element: Element, options?: UserEventTripleClickOptions) => Promise<void>`

Triggers a triple click event on an element

Please refer to your provider's documentation for detailed explanation about how this method works.

```ts
import { userEvent } from '@vitest/browser/context'
import { screen } from '@testing-library/dom'

test('triggers a triple click on an element', async () => {
  const logo = screen.getByRole('img', { name: /logo/ })

  await userEvent.tripleClick(logo)
})
```

References:

- [Playwright `locator.click` API](https://playwright.dev/docs/api/class-locator#locator-click)
- [WebdriverIO `browser.action` API](https://webdriver.io/docs/api/browser/action/)
- [testing-library `tripleClick` API](https://testing-library.com/docs/user-event/convenience/#tripleClick)

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

test('tab works', async () => {
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

## CDP Session

Vitest 通过 `@vitest/browser/context` 中导出的 `cdp` 方法访问原始 Chrome Devtools 协议。它主要用于库作者在其基础上构建工具。

```ts
import { cdp } from '@vitest/browser/context'

const input = document.createElement('input')
document.body.appendChild(input)
input.focus()

await cdp().send('Input.dispatchKeyEvent', {
  type: 'keyDown',
  text: 'a',
})

expect(input).toHaveValue('a')
```

::: warning
CDP session仅适用于 `playwright` provider，并且仅在使用 `chromium` 浏览器时有效。有关详细信息，请参阅 playwright 的 [`CDPSession`](https://playwright.dev/docs/api/class-cdpsession)文档。
:::

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
- `frame` 是一个异步方法，用于解析测试器 [`Frame`](https://playwright.dev/docs/api/class-frame)。它的 API 与 `page` 类似，但不支持某些方法。如果您需要查询元素，应优先使用 `context.iframe` 代替，因为它更稳定、更快速。
- `iframe` 是一个 [`FrameLocator`](https://playwright.dev/docs/api/class-framelocator)，用于查询页面上的其他元素。
- `context` 是指唯一的[BrowserContext](https://playwright.dev/docs/api/class-browsercontext)。

```ts
import { defineCommand } from '@vitest/browser'
export const myCommand = defineCommand(async (ctx, arg1, arg2) => {
  if (ctx.provider.name === 'playwright') {
    const element = await ctx.iframe.findByRole('alert')
    const screenshot = await element.screenshot()
    // do something with the screenshot
    return difference
  }
})
```

::: tip
如果您使用的是 TypeScript，请不要忘记将 `@vitest/browser/providers/playwright` 添加到您的 `tsconfig` "compilerOptions.types" 字段，以便在配置中以及 `userEvent` 和 `page` 选项中获得自动完成功能：

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

## Examples

浏览器模式与框架无关，因此不提供任何渲染组件的方法。不过，你应该可以使用框架的测试工具包。

我们建议根据您的框架使用  `testing-library` packages：

- [`@testing-library/dom`](https://testing-library.com/docs/dom-testing-library/intro) if you don't use a framework
- [`@testing-library/vue`](https://testing-library.com/docs/vue-testing-library/intro) to render [vue](https://vuejs.org) components
- [`@testing-library/svelte`](https://testing-library.com/docs/svelte-testing-library/intro) to render [svelte](https://svelte.dev) components
- [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro) to render [react](https://react.dev) components
- [`@testing-library/preact`](https://testing-library.com/docs/preact-testing-library/intro) to render [preact](https://preactjs.com) components
- [`solid-testing-library`](https://testing-library.com/docs/solid-testing-library/intro) to render [solid](https://www.solidjs.com) components
- [`@marko/testing-library`](https://testing-library.com/docs/marko-testing-library/intro) to render [marko](https://markojs.com) components

::: warning
`testing-library` 提供了一个包`@testing-library/user-event`。我们不建议直接使用它，因为它会模拟事件而非实际触发事件--相反，请使用从 `@vitest/browser/context`导入的 [`userEvent`](#interactivity-api)，它使用 Chrome DevTools 协议或 Webdriver（取决于provider）。
:::

::: code-group
```ts [vue]
// based on @testing-library/vue example
// https://testing-library.com/docs/vue-testing-library/examples

import { userEvent } from '@vitest/browser/context'
import { render, screen } from '@testing-library/vue'
import Component from './Component.vue'

test('properly handles v-model', async () => {
  render(Component)

  // Asserts initial state.
  expect(screen.getByText('Hi, my name is Alice')).toBeInTheDocument()

  // Get the input DOM node by querying the associated label.
  const usernameInput = await screen.findByLabelText(/username/i)

  // Type the name into the input. This already validates that the input
  // is filled correctly, no need to check the value manually.
  await userEvent.fill(usernameInput, 'Bob')

  expect(screen.getByText('Hi, my name is Alice')).toBeInTheDocument()
})
```
```ts [svelte]
// based on @testing-library/svelte
// https://testing-library.com/docs/svelte-testing-library/example

import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@vitest/browser/context'
import { expect, test } from 'vitest'

import Greeter from './greeter.svelte'

test('greeting appears on click', async () => {
  const user = userEvent.setup()
  render(Greeter, { name: 'World' })

  const button = screen.getByRole('button')
  await user.click(button)
  const greeting = await screen.findByText(/hello world/iu)

  expect(greeting).toBeInTheDocument()
})
```
```tsx [react]
// based on @testing-library/react example
// https://testing-library.com/docs/react-testing-library/example-intro

import { userEvent } from '@vitest/browser/context'
import { render, screen } from '@testing-library/react'
import Fetch from './fetch'

test('loads and displays greeting', async () => {
  // Render a React element into the DOM
  render(<Fetch url="/greeting" />)

  await userEvent.click(screen.getByText('Load Greeting'))
  // wait before throwing an error if it cannot find an element
  const heading = await screen.findByRole('heading')

  // assert that the alert message is correct
  expect(heading).toHaveTextContent('hello there')
  expect(screen.getByRole('button')).toBeDisabled()
})
```
```tsx [preact]
// based on @testing-library/preact example
// https://testing-library.com/docs/preact-testing-library/example

import { h } from 'preact'
import { userEvent } from '@vitest/browser/context'
import { render } from '@testing-library/preact'

import HiddenMessage from '../hidden-message'

test('shows the children when the checkbox is checked', async () => {
  const testMessage = 'Test Message'

  const { queryByText, getByLabelText, getByText } = render(
    <HiddenMessage>{testMessage}</HiddenMessage>,
  )

  // query* functions will return the element or null if it cannot be found.
  // get* functions will return the element or throw an error if it cannot be found.
  expect(queryByText(testMessage)).not.toBeInTheDocument()

  // The queries can accept a regex to make your selectors more
  // resilient to content tweaks and changes.
  await userEvent.click(getByLabelText(/show/i))

  expect(getByText(testMessage)).toBeInTheDocument()
})
```
```tsx [solid]
// baed on @testing-library/solid API
// https://testing-library.com/docs/solid-testing-library/api

import { render } from '@testing-library/solid'

it('uses params', async () => {
  const App = () => (
    <>
      <Route
        path="/ids/:id"
        component={() => (
          <p>
            Id:
            {useParams()?.id}
          </p>
        )}
      />
      <Route path="/" component={() => <p>Start</p>} />
    </>
  )
  const { findByText } = render(() => <App />, { location: 'ids/1234' })
  expect(await findByText('Id: 1234')).toBeInTheDocument()
})
```
```ts [marko]
// baed on @testing-library/marko API
// https://testing-library.com/docs/marko-testing-library/api

import { render, screen } from '@marko/testing-library'
import Greeting from './greeting.marko'

test('renders a message', async () => {
  const { container } = await render(Greeting, { name: 'Marko' })
  expect(screen.getByText(/Marko/)).toBeInTheDocument()
  expect(container.firstChild).toMatchInlineSnapshot(`
    <h1>Hello, Marko!</h1>
  `)
})
```
:::

## 限制

### 线程阻塞对话框

使用 Vitest 浏览器时，需要注意的是像 `alert` 或 `confirm` 这样的线程阻塞对话框不能在本地使用。这是因为它们阻塞了网页，这意味着 Vitest 无法继续与该页面通信，导致执行挂起。

在这种情况下，Vitest 为这些 API 提供默认模拟和默认返回值。这确保如果用户不小心使用了同步弹出式 Web API，执行不会挂起。但是，仍然建议用户模拟这些 Web API 以获得更好的体验。在 [Mocking](/guide/mocking) 中阅读更多内容。
