---
title: 浏览器模式 | 指南
---

# 浏览器模式 <Badge type="warning">实验性</Badge> {#browser-mode}

此页面提供有关 Vitest API 中实验性浏览器模式功能的信息，该功能允许你在浏览器中本地运行测试，提供对窗口和文档等浏览器全局变量的访问。此功能目前正在开发中，API 未来可能会更改。

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

## 配置

要在 Vitest 配置中激活浏览器模式，你可以使用 `--browser` 标志或在你的 Vitest 配置文件中将 `browser.enabled` 字段设置为 `true`。这是使用浏览器字段的示例配置：

```ts
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome', // browser name is required
    },
  },
})
```

## 浏览器选项类型

Vitest 中的浏览器选项取决于提供者。如果你传递 `--browser` 并且未在配置文件中指定其名称，Vitest 将失败。可用选项：

- `webdriverio` (默认) 支持以下浏览器:
  - `firefox`
  - `chrome`
  - `edge`
  - `safari`
- `playwright` 支持以下浏览器:
  - `firefox`
  - `webkit`
  - `chromium`

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

::: tip NOTE
当使用带有 WebdriverIO 的 Safari 浏览器选项时，需要通过在你的设备上运行 `sudo safaridriver --enable` 来激活`safaridriver`。

此外，在运行测试时，Vitest 将尝试安装一些驱动程序用于兼容 `safaridriver`。
:::

## Headless

headless 模式是浏览器模式下可用的另一个选项。在 headless 模式下，浏览器在没有用户界面的情况下在后台运行，这对于运行自动化测试非常有用。Vitest 中的 headless 选项可以设置为布尔值以启用或禁用 headless 模式。

这是启用 headless 模式的示例配置：

```ts
export default defineConfig({
  test: {
    browser: {
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

<<<<<<< HEAD
## 限制
=======
## Context <Version>2.0.0</Version> {#context}

Vitest exposes a context module via `@vitest/browser/context` entry point. As of 2.0, it exposes a small set of utilities that might be useful to you in tests.

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
   * Available commands for the browser.
   * @see {@link https://vitest.dev/guide/browser#commands}
   */
  commands: BrowserCommands
}

/**
 * Available commands for the browser.
 * A shortcut to `server.commands`.
 * @see {@link https://vitest.dev/guide/browser#commands}
 */
export const commands: BrowserCommands

export const page: {
  /**
   * Serialized test config.
   */
  config: ResolvedConfig
}
```

## Commands <Version>2.0.0</Version> {#commands}

Command is a function that invokes another function on the server and passes down the result back to the browser. Vitest exposes several built-in commands you can use in your browser tests.

## Built-in Commands

### Files Handling

You can use `readFile`, `writeFile` and `removeFile` API to handle files inside your browser tests. All paths are resolved relative to the test file even if they are called in a helper function located in another file.

By default, Vitest uses `utf-8` encoding but you can override it with options.

::: tip
This API follows [`server.fs`](https://vitejs.dev/config/server-options.html#server-fs-allow) limitations for security reasons.
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

### Keyboard Interactions

Vitest also implements Web Test Runner's [`sendKeys` API](https://modern-web.dev/docs/test-runner/commands/#send-keys). It accepts an object with a single property:

- `type` - types a sequence of characters, this API _is not_ affected by modifier keys, so having `Shift` won't make letters uppercase
- `press` - presses a single key, this API _is_ affected by modifier keys, so having `Shift` will make subsequent characters uppercase
- `up` - holds down a key (supported only with `playwright` provider)
- `down` - releases a key (supported only with `playwright` provider)

```ts
interface TypePayload { type: string }
interface PressPayload { press: string }
interface DownPayload { down: string }
interface UpPayload { up: string }

type SendKeysPayload = TypePayload | PressPayload | DownPayload | UpPayload

declare function sendKeys(payload: SendKeysPayload): Promise<void>
```

This is just a simple wrapper around providers APIs. Please refer to their respective documentations for details:

- [Playwright Keyboard API](https://playwright.dev/docs/api/class-keyboard)
- [Webdriver Keyboard API](https://webdriver.io/docs/api/browser/keys/)

## Custom Commands

You can also add your own commands via [`browser.commands`](/config/#browser-commands) config option. If you develop a library, you can provide them via a `config` hook inside a plugin:

```ts
import type { Plugin } from 'vitest/config'
import type { BrowserCommand } from 'vitest/node'

const myCustomCommand: BrowserCommand<[arg1: string, arg2: string]> = ({
  testPath,
  provider
}, arg1, arg2) => {
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
            }
          }
        }
      }
    }
  }
}
```

Then you can call it inside your test by importing it from `@vitest/browser/context`:

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
    myCustomCommand: (arg1: string, arg2: string) => Promise<{
      someValue: true
    }>
  }
}
```

::: warning
Custom functions will override built-in ones if they have the same name.
:::

## Limitations
>>>>>>> 2b032211e13521ef35634504a68d5340b2d10425

### 线程阻塞对话框

使用 Vitest 浏览器时，需要注意的是像 `alert` 或 `confirm` 这样的线程阻塞对话框不能在本地使用。这是因为它们阻塞了网页，这意味着 Vitest 无法继续与该页面通信，导致执行挂起。

在这种情况下，Vitest 为这些 API 提供默认模拟和默认返回值。这确保如果用户不小心使用了同步弹出式 Web API，执行不会挂起。但是，仍然建议用户模拟这些 Web API 以获得更好的体验。在 [Mocking](/guide/mocking) 中阅读更多内容。
