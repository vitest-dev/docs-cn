---
title: Browser Mode | Guide
outline: deep
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
<<<<<<< HEAD
不过，要在 CI 中运行测试，您需要安装 [`playwright`](https://npmjs.com/package/playwright) 或 [`webdriverio`](https://www.npmjs.com/package/webdriverio) 。我们还建议在本地测试时切换到这两个选项中的一个，而不是使用默认的 `preview` 提供程序，因为它依赖于模拟事件而不是使用 Chrome DevTools 协议。
=======
However, to run tests in CI you need to install either [`playwright`](https://npmjs.com/package/playwright) or [`webdriverio`](https://www.npmjs.com/package/webdriverio). We also recommend switching to either one of them for testing locally instead of using the default `preview` provider since it relies on simulating events instead of using Chrome DevTools Protocol.

If you don't already use one of these tools, we recommend starting with Playwright because it supports parallel execution, which makes your tests run faster. Additionally, the Chrome DevTools Protocol that Playwright uses is generally faster than WebDriver.
>>>>>>> 08b14f0dc894db4bc976a1424dfa8e27bade0217
:::

### 使用 Playwright

[Playwright](https://npmjs.com/package/playwright) is a framework for Web Testing and Automation.

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

### Using Webdriverio

[WebdriverIO](https://www.npmjs.com/package/webdriverio) allows you to run tests locally using the WebDriver protocol.

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
      name: 'chromium', // browser name is required
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
      name: 'chromium',
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
      name: 'chromium',
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
      name: 'chromium',
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
      name: 'chromium',
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

### 更长的初始化时间

Vitest 浏览器在初始化过程中需要启动提供程序和浏览器，这可能需要一些时间。与其他测试模式相比，这可能导致更长的初始化时间。

## 跨浏览器测试

在浏览器选项中指定浏览器名称时，Vitest 默认会尝试使用 `preview`运行指定的浏览器，然后在那里运行测试。如果不想使用 `preview`，可以使用`browser.provider`选项配置自定义浏览器提供程序。

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
  }
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

## 限制

### 线程阻塞对话框

使用 Vitest 浏览器时，需要注意的是像 `alert` 或 `confirm` 这样的线程阻塞对话框不能在本地使用。这是因为它们阻塞了网页，这意味着 Vitest 无法继续与该页面通信，导致执行挂起。

在这种情况下，Vitest 为这些 API 提供默认模拟和默认返回值。这确保如果用户不小心使用了同步弹出式 Web API，执行不会挂起。但是，仍然建议用户模拟这些 Web API 以获得更好的体验。在 [Mocking](/guide/mocking) 中阅读更多内容。
