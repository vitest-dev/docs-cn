---
title: Browser Mode | Guide
outline: deep
---
<!-- TODO: translation -->
# Browser Mode {#browser-mode}

This page provides information about the browser mode feature in the Vitest API, which allows you to run your tests in the browser natively, providing access to browser globals like window and document.

::: tip
如果你需要 `expect` 、`vi` ，或者像测试项目、类型测试等通用 API 的文档，请查看 [“快速起步” 指南](/guide/)。
:::

<img alt="Vitest UI" img-light src="/ui-browser-1-light.png">
<img alt="Vitest UI" img-dark src="/ui-browser-1-dark.png">

## 安装 {#installation}

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

### 手动安装 {#manual-installation}
<!-- TODO: translation -->
You can also install packages manually. Vitest always requires a provider to be defined. You can chose either [`preview`](/config/browser/preview), [`playwright`](/config/browser/playwright) or [`webdriverio`](/config/browser/webdriverio).

If you want to just preview how your tests look, you can use the `preview` provider:

::: code-group
```bash [npm]
npm install -D vitest @vitest/browser-preview
```
```bash [yarn]
yarn add -D vitest @vitest/browser-preview
```
```bash [pnpm]
pnpm add -D vitest @vitest/browser-preview
```
```bash [bun]
bun add -D vitest @vitest/browser-preview
```
:::

::: warning
不过，要在 CI 中运行测试，我们需要安装 [`playwright`](https://npmjs.com/package/playwright) 或 [`webdriverio`](https://www.npmjs.com/package/webdriverio) 。我们还建议在本地测试时切换到这两个选项中的一个，而不是使用默认的 `preview` 提供程序，因为它依赖于模拟事件而不是使用 Chrome DevTools 协议。

<!-- TODO: translation -->

If you don't already use one of these tools, we recommend starting with Playwright because it supports parallel execution, which makes your tests run faster.

::: tabs key:provider
== Playwright
[Playwright](https://npmjs.com/package/playwright) 是一个用于网络测试和自动化的框架。

::: code-group
```bash [npm]
npm install -D vitest @vitest/browser-playwright
```
```bash [yarn]
yarn add -D vitest @vitest/browser-playwright
```
```bash [pnpm]
pnpm add -D vitest @vitest/browser-playwright
```
```bash [bun]
bun add -D vitest @vitest/browser-playwright
```
== WebdriverIO

[WebdriverIO](https://www.npmjs.com/package/webdriverio) 允许我们使用 WebDriver 协议在本地运行测试。

::: code-group
```bash [npm]
npm install -D vitest @vitest/browser-webdriverio
```
```bash [yarn]
yarn add -D vitest @vitest/browser-webdriverio
```
```bash [pnpm]
pnpm add -D vitest @vitest/browser-webdriverio
```
```bash [bun]
bun add -D vitest @vitest/browser-webdriverio
```
:::

## 配置 {#configuration}

想要在 Vitest 中启用浏览器模式，只需在配置文件中将 `browser.enabled` 设置为 true。下面是一个使用 browser 配置的示例：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      // 至少需要一个实例
      instances: [
        { browser: 'chromium' },
      ],
    },
  }
})
```

::: info
Vitest 默认分配端口号 `63315` 以避免与开发服务器冲突，允许我们同时并行运行两者。我们可以通过 [`browser.api`](/config/#browser-api) 选项来更改这个端口号。
<!-- TODO: translation -->
The CLI does not prints the Vite server URL automatically. You can press "b" to print the URL when running in watch mode.
:::

如果之前未使用过 Vite，请确保已安装框架插件并在配置中指定。有些框架可能需要额外配置才能运行，请查看其 Vite 相关文档以确定。

::: code-group
```ts [react]
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
```
```ts [vue]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
```
```ts [svelte]
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [svelte()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
```
```ts [solid]
import solidPlugin from 'vite-plugin-solid'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
```
```ts [marko]
import marko from '@marko/vite'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [marko()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    }
  }
})
```
```ts [qwik]
import { qwikVite } from '@builder.io/qwik/optimizer'
import { playwright } from '@vitest/browser-playwright'

// 可选项，在 SSR 模式下运行测试
import { testSSR } from 'vitest-browser-qwik/ssr-plugin'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [testSSR(), qwikVite()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    },
  },
})
```
:::

如果你想让部分测试通过基于 Node 的运行器执行，可以在配置中使用 [`projects`](/guide/projects) 选项，并为不同的测试策略提供独立的配置：

{#projects-config}

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          // 基于文件命名约定的示例
          // 非强制要求
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
          // 基于文件命名约定的示例
          // 非强制要求
          include: [
            'tests/browser/**/*.{test,spec}.ts',
            'tests/**/*.browser.{test,spec}.ts',
          ],
          name: 'browser',
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
  },
})
```

## 浏览器选项类型 {#browser-option-types}

Vitest 中的浏览器选项取决于 provider。如果在配置文件中传递 `--browser` 且未指定其名称，则 Vitest 将失败。可用选项：
- `webdriverio` 支持这些浏览器:
  - `firefox`
  - `chrome`
  - `edge`
  - `safari`
- `playwright` 支持这些浏览器:
  - `firefox`
  - `webkit`
  - `chromium`

## 浏览器兼容性 {#browser-compatibility}

Vitest 使用 [Vite dev server](https://cn.vitejs.dev/guide/#browser-support) 来运行我们的测试，因此我们只支持 [`esbuild.target`](https://cn.vitejs.dev/config/shared-options#esbuild)选项（默认为 `esnext`）中指定的功能。

默认情况下，Vite 的目标浏览器支持原生 [ES Modules](https://caniuse.com/es6-module)、原生 [ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 和 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)。此外，我们还利用 [`BroadcastChannel`](https://caniuse.com/?search=BroadcastChannel)在 iframe 之间进行通信：

- Chrome >=87
- Firefox >=78
- Safari >=15.4
- Edge >=88

## 运行测试 {#running-tests}

要使用 CLI 指定浏览器，请使用 `--browser` 标志后跟浏览器名称，如下所示：

```sh
npx vitest --browser=chromium
```

或者你可以使用点符号向 CLI 提供浏览器选项：

```sh
npx vitest --browser.headless
```

::: warning
自 Vitest 3.2 起，如果你在配置文件中没有设置 browser 选项，却在命令行中使用了 `--browser` 参数， Vitest 会直接报错，因为它无法确定当前配置是为浏览器测试准备的还是用于 Node.js 测试。
:::

Vitest 默认会在开发模式下自动打开浏览器界面，测试会在页面中央的 iframe 中执行。你可以通过选择界面中的预设尺寸、在测试中调用 `page.viewport` 方法，或者在 [配置文件](/config/#browser-viewport) 中设置默认值来调整视口大小。

## 无头模式 {#headless}

无头模式是浏览器模式下可用的另一个选项。在无头模式下，浏览器在没有用户界面的情况下在后台运行，这对于运行自动化测试非常有用。Vitest 中的 headless 选项可以设置为布尔值以启用或禁用无头模式。

在使用无头模式时，Vitest 不会自动打开用户界面。如果我们希望继续使用用户界面，同时让测试以 无头模式运行，我们可以安装 [`@vitest/ui`](/guide/ui) 包，并在运行Vitest时传递 `--ui` 标志。

这是启用无头模式的示例配置：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
    },
  }
})
```

你还可以在 CLI 中使用 `--browser.headless` 标志设置无头模式，如下所示：

```sh
npx vitest --browser.headless
```

在这种情况下，Vitest 将使用 Chrome 浏览器以无头模式运行。

::: warning
默认情况下Headless模式不可用。我们需要使用 [`playwright`](https://npmjs.com/package/playwright) 或 [`webdriverio`](https://www.npmjs.com/package/webdriverio) 提供程序来启用此功能。
:::

## 示例 {#examples}

一般情况下，我们不需要任何依赖来使用浏览器模式：

```js [example.test.js]
import { expect, test } from 'vitest'
import { page } from 'vitest/browser'
import { render } from './my-render-function.js'

test('properly handles form inputs', async () => {
  render() // 挂载 DOM 元素

  // 断言初始状态。
  await expect.element(page.getByText('Hi, my name is Alice')).toBeInTheDocument()

  // 通过查询关联的标签获取输入的 DOM 节点。
  const usernameInput = page.getByLabelText(/username/i)

  // 将名称输入到输入框中。
  // 这已经验证了输入框中的值是正确的，无需手动检查其值。
  await usernameInput.fill('Bob')

  await expect.element(page.getByText('Hi, my name is Bob')).toBeInTheDocument()
})
```

但是，Vitest 提供了用于渲染几个流行框架的组件的依赖包：

- [`vitest-browser-vue`](https://github.com/vitest-dev/vitest-browser-vue) 渲染 [vue](https://vuejs.org) 组件
- [`vitest-browser-svelte`](https://github.com/vitest-dev/vitest-browser-svelte) 渲染 [svelte](https://svelte.dev) 组件
- [`vitest-browser-react`](https://github.com/vitest-dev/vitest-browser-react) 渲染 [react](https://react.dev) 组件

其他框架也有社区提供的软件包：

- [`vitest-browser-lit`](https://github.com/EskiMojo14/vitest-browser-lit) 渲染 [lit](https://lit.dev) 组件
- [`vitest-browser-preact`](https://github.com/JoviDeCroock/vitest-browser-preact) 渲染 [preact](https://preactjs.com) 组件
- [`vitest-browser-qwik`](https://github.com/kunai-consulting/vitest-browser-qwik) 渲染 [qwik](https://qwik.dev) 组件

如果你的框架没有被包含在内，请随时创建你自己的软件包——它是一个简单的封装，围绕着框架渲染器和 `page.elementLocator` API。我们会在本页面添加指向它的链接。请确保其名称以 `vitest-browser-` 开头。

除了渲染组件和定位元素外，你还需要进行断言。Vitest 基于 [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom) 库提供了一整套开箱即用的 DOM 断言。更多信息请参阅 [Assertions API](/api/browser/assertions)。

```ts
import { expect } from 'vitest'
import { page } from 'vitest/browser'
// 元素是正确渲染
await expect.element(page.getByText('Hello World')).toBeInTheDocument()
```

Vitest 暴露了一个 [上下文 API](/api/browser/context)，其中包含一组在测试中可能对你有用的实用程序。例如，如果你需要进行交互操作，比如点击元素或在输入框中输入文本，你可以使用来自 `vitest/browser` 的 `userEvent`。更多内容请参阅 [交互性 API](/api/browser/interactivity)。

```ts
import { page, userEvent } from 'vitest/browser'
await userEvent.fill(page.getByLabelText(/username/i), 'Alice')
// 或只用 locator.fill
await page.getByLabelText(/username/i).fill('Alice')
```

::: code-group
```ts [vue]
import { render } from 'vitest-browser-vue'
import Component from './Component.vue'

test('properly handles v-model', async () => {
  const screen = render(Component)

  // 断言初始状态。
  await expect.element(screen.getByText('Hi, my name is Alice')).toBeInTheDocument()

  // 通过查询关联的标签获取输入的 DOM 节点。
  const usernameInput = screen.getByLabelText(/username/i)

  // 将名称输入到输入框中。
  // 这已经验证了输入框中的值是正确的，无需手动检查其值。
  await usernameInput.fill('Bob')

  await expect.element(screen.getByText('Hi, my name is Bob')).toBeInTheDocument()
})
```
```ts [svelte]
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'

import Greeter from './greeter.svelte'

test('greeting appears on click', async () => {
  const screen = render(Greeter, { name: 'World' })

  const button = screen.getByRole('button')
  await button.click()
  const greeting = screen.getByText(/hello world/iu)

  await expect.element(greeting).toBeInTheDocument()
})
```
```tsx [react]
import { render } from 'vitest-browser-react'
import Fetch from './fetch'

test('loads and displays greeting', async () => {
  // 将一个 React 元素渲染到 DOM 中。
  const screen = render(<Fetch url="/greeting" />)

  await screen.getByText('Load Greeting').click()
  // 如果找不到元素，则等待一段时间后再抛出错误。
  const heading = screen.getByRole('heading')

  // 断言警告消息是正确的。
  await expect.element(heading).toHaveTextContent('hello there')
  await expect.element(screen.getByRole('button')).toBeDisabled()
})
```
```ts [lit]
import { html } from 'lit'
import { render } from 'vitest-browser-lit'
import './greeter-button'

test('greeting appears on click', async () => {
  const screen = render(html`<greeter-button name="World"></greeter-button>`)

  const button = screen.getByRole('button')
  await button.click()
  const greeting = screen.getByText(/hello world/iu)

  await expect.element(greeting).toBeInTheDocument()
})
```
```tsx [preact]
import Greeting from '.Greeting'
import { createElement } from 'preact'
import { render } from 'vitest-browser-preact'

test('greeting appears on click', async () => {
  const screen = render(<Greeting />)

  const button = screen.getByRole('button')
  await button.click()
  const greeting = screen.getByText(/hello world/iu)

  await expect.element(greeting).toBeInTheDocument()
})
```
```tsx [qwik]
import { render } from 'vitest-browser-qwik'
import Greeting from './greeting'

test('greeting appears on click', async () => {
  // renderSSR 和 renderHook 也是可用
  const screen = render(<Greeting />)

  const button = screen.getByRole('button')
  await button.click()
  const greeting = screen.getByText(/hello world/iu)

  await expect.element(greeting).toBeInTheDocument()
})
```
:::

Vitest 并不支持所有开箱即用的框架，但我们可以使用外部工具来运行这些框架的测试。我们还鼓励社区创建他们自己的 `vitest-browser` 封装程序，如果我们有这样的封装程序，请随时将其添加到上述示例中。

对于不支持的框架，我们建议使用 `testing-library` 软件包：

- [`@solidjs/testing-library`](https://testing-library.com/docs/solid-testing-library/intro) 渲染 [solid](https://www.solidjs.com) 组件
- [`@marko/testing-library`](https://testing-library.com/docs/marko-testing-library/intro) 渲染 [marko](https://markojs.com) 组件

我们还可以在 [`browser-examples`](https://github.com/vitest-tests/browser-examples) 中查看更多的案例。

::: warning
`testing-library` 提供了一个软件包 `@testing-library/user-event`。我们不建议直接使用它，因为它会模拟事件而非实际触发事件--相反，请使用从 `vitest/browser`导入的 [`userEvent`](/api/browser/interactivity)，它在引擎盖下使用 Chrome DevTools 协议或 Webdriver（取决于provider）。
:::

::: code-group
```tsx [solid]
// 基于 @testing-library/solid API
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
  const { baseElement } = render(() => <App />, { location: 'ids/1234' })
  const screen = page.elementLocator(baseElement)

  await expect.screen(screen.getByText('Id: 1234')).toBeInTheDocument()
})
```
```ts [marko]
// 基于 @testing-library/marko API
// https://testing-library.com/docs/marko-testing-library/api

import { render, screen } from '@marko/testing-library'
import Greeting from './greeting.marko'

test('renders a message', async () => {
  const { baseElement } = await render(Greeting, { name: 'Marko' })
  const screen = page.elementLocator(baseElement)
  await expect.element(screen.getByText(/Marko/)).toBeInTheDocument()
  expect(container.firstChild).toMatchInlineSnapshot(`
    <h1>Hello, Marko!</h1>
  `)
})
```
:::

## 限制 {#limitations}

### 线程阻塞对话框 {#thread-blocking-dialogs}

使用 Vitest 浏览器时，需要注意的是像 `alert` 或 `confirm` 这样的线程阻塞对话框不能在本地使用。这是因为它们阻塞了网页，这意味着 Vitest 无法继续与该页面通信，导致执行挂起。

在这类情况下，Vitest 会为相关 API 提供带有默认返回值的内置 mock，从而避免用户不小心使用同步弹窗等 Web API 时导致程序卡死。不过，仍然强烈建议用户自行对这些 Web API 进行 mock，以获得更稳定、可控的测试体验。更多内容可参考 [模拟](/guide/mocking) 章节。

### 对模块的导出内容进行监听（Spy） {#spying-on-module-exports}

在浏览器模式下，Vitest 依赖浏览器自身对 ESM 模块的原生支持来加载模块。此时，模块的命名空间对象是不可修改的，这与 Node.js 测试中 Vitest 能够对模块执行打补丁不同。因此，你不能对通过 import 导入的对象使用 `vi.spyOn` ：

```ts
import { vi } from 'vitest'
import * as module from './module.js'

vi.spyOn(module, 'method') // ❌ 抛出错误
```

为了解决这个限制，Vitest 在 `vi.mock('./module.js')` 中提供了 `{ spy: true }` 选项。启用后，它会自动对模块里所有的导出进行监听，而不会像普通 mock 那样将它们替换成假的实现。

```ts
import { vi } from 'vitest'
import * as module from './module.js'

vi.mock('./module.js', { spy: true })

vi.mocked(module.method).mockImplementation(() => {
  // ...
})
```

不过，如果你想模拟导出的 _变量_ ，唯一可行的方式是让模块额外导出一个能修改该变量内部值的方法：

::: code-group
```js [module.js]
export let MODE = 'test'
export function changeMode(newMode) {
  MODE = newMode
}
```
```js [module.test.ts]
import { expect } from 'vitest'
import { changeMode, MODE } from './module.js'

changeMode('production')
expect(MODE).toBe('production')
```
:::
