---
outline: deep
---

# vitest-browser-svelte

由社区提供的 [`vitest-browser-svelte`](https://www.npmjs.com/package/vitest-browser-svelte) 包可在 [浏览器模式](/guide/browser/) 中渲染 [Svelte](https://svelte.dev/) 组件。

```ts
import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import Component from './Component.svelte'

test('counter button increments the count', async () => {
  const screen = render(Component, {
    initialCount: 1,
  })

  await screen.getByRole('button', { name: 'Increment' }).click()

  await expect.element(screen.getByText('Count is 2')).toBeVisible()
})
```

::: warning
该库的灵感来至于 [`@testing-library/svelte`](https://github.com/testing-library/svelte-testing-library)。

如果你之前使用过 `@testing-library/svelte`，仍可以继续延用。但 `vitest-browser-svelte` 包提供了浏览器模式下特有的优势，这些是 `@testing-library/svelte` 所不具备的：

`vitest-browser-svelte` 返回的 API 能与内置的 [定位器](/api/browser/locators)、[用户事件](/api/browser/interactivity) 及 [断言](/api/browser/assertions) 更好的协作。例如：即使组件在断言间被重新渲染，Vitest 仍会自动重试元素查找，直至断言成功。
:::

该包提供两个入口点：`vitest-browser-svelte` 和 `vitest-browser-svelte/pure`。两者暴露完全相同的 API，但在下一个测试开始前 `pure` 不会添加移除组件处理程序。

## 渲染函数 {#render}

```ts
export function render<C extends Component>(
  Component: ComponentImport<C>,
  options?: ComponentOptions<C>,
  renderOptions?: SetupOptions
): RenderResult<C>
```

### 选项 {#options}

`render` 函数支持两种传参方式，一种是向 [`mount`](https://svelte.dev/docs/svelte/imperative-component-api#mount) 传入配置选项，另一种则是直接向组件传入属性：

```ts
const screen = render(Component, {
  props: { // [!code --]
    initialCount: 1, // [!code --]
  }, // [!code --]
  initialCount: 1, // [!code ++]
})
```

#### props

组件属性。

#### target

默认情况下，Vitest 会创建一个 `div` 并添加到 `document.body` 上，然后在该节点中渲染你的组件。如果提供自定义的 `HTMLElement` 容器，则不会自动添加，你需要在调用 `render` 前手动执行 `document.body.appendChild(container)`。

例如，当测试 `tbody` 元素时，它不能作为 `div` 的子元素。在这个例子中，你可以指定一个 `table` 作为渲染容器。

```ts
const table = document.createElement('table')

const screen = render(TableBody, {
  props,
  // ⚠️ 渲染前需手动将元素添加到 `body`
  target: document.body.appendChild(table),
})
```

#### baseElement

`baseElement` 可通过第三个参数传递。除非特殊情况，否则极少需要使用此选项。

如果指定了 `target` 参数，则默认以此为根元素，否则将默认使用 `document.body`。该元素既作为查询操作的根节点，也会在使用 `debug()` 时被输出展示。

### 渲染结果 {#render-result}

除文档记载的返回值外，`render` 函数还会返回相对于 [`baseElement`](#baseelement) 的所有可用 [定位器](/api/browser/locators)，包括 [自定义定位器](/api/browser/locators#custom-locators)。

```ts
const screen = render(TableBody, props)

await screen.getByRole('link', { name: 'Expand' }).click()
```

#### container

Svelte 组件将被渲染到 `container` 这个 DOM 容器中。这是一个常规 DOM 节点，因此理论上可以通过 `container.querySelector` 等方式检查子元素。

:::danger
如果你需通过 `container` 查询渲染元素，你应该重新考虑测试方法！[定位器](/api/browser/locators) 专为应对组件变更而设计，比直接查询容器更具稳定性。应避免使用 `container` 查询元素！
:::

#### component

已挂载的 Svelte 组件实例。如需访问组件方法和属性，可通过此实例进行操作。

```ts
const { component } = render(Counter, {
  initialCount: 0,
})

// 访问组件导出项
```

#### locator

`container` 的 [定位器](/api/browser/locators)。适用于在组件范围内查找元素或传递给其他断言语句场景：

```ts
import { render } from 'vitest-browser-svelte'

const { locator } = render(NumberDisplay, {
  number: 2,
})

await locator.getByRole('button').click()
await expect.element(locator).toHaveTextContent('Hello World')
```

#### debug

```ts
function debug(
  el?: HTMLElement | HTMLElement[] | Locator | Locator[],
): void
```

此方法是 `console.log(prettyDOM(baseElement))` 的简写形式，用于在控制台输出容器或指定元素的 DOM 内容。

#### rerender

```ts
function rerender(props: Partial<ComponentProps<T>>): void
```

更新组件属性并等待 Svelte 变更被应用。适用于测试组件属性变化的响应。

```ts
import { render } from 'vitest-browser-svelte'

const { rerender } = render(NumberDisplay, {
  number: 1,
})

// 使用新属性重新渲染同一个组件
await rerender({ number: 2 })
```

#### unmount

```ts
function unmount(): void
```

卸载并销毁 Svelte 组件。该特性适用于测试组件从页面移除时的行为（例如验证是否残留未清除的事件处理器，避免引发内存泄漏）。

```ts
import { render } from 'vitest-browser-svelte'

const { container, unmount } = render(Component)
unmount()
// 组件已被卸载，此时：container.innerHTML === ''
```

## cleanup

```ts
export function cleanup(): void
```

移除所有通过 [`render`](#render) 方法渲染的组件。

## 扩展查询 {#extend-queries}

如果想扩展定位器的查询方法，详情参阅 [`“自定义定位器”`](/api/browser/locators#custom-locators)。例如，要为 `render` 扩展一个新的定位器，可使用 `locators.extend` API 进行定义：

```ts {5-7,12}
import { locators } from 'vitest/browser'
import { render } from 'vitest-browser-svelte'

locators.extend({
  getByArticleTitle(title) {
    return `[data-title="${title}"]`
  },
})

const screen = render(Component)
await expect.element(
  screen.getByArticleTitle('Hello World')
).toBeVisible()
```

## 代码片段 {#snippets}

对于简单的代码片段，您可以使用包装组件和 “占位” 子元素进行测试。通过设置 `data-testid` 属性帮助测试插槽内容。

::: code-group
```ts [basic.test.js]
import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'

import SubjectTest from './basic-snippet.test.svelte'

test('basic snippet', async () => {
  const screen = render(SubjectTest)

  const heading = screen.getByRole('heading')
  const child = heading.getByTestId('child')

  await expect.element(child).toBeInTheDocument()
})
```
```svelte [basic-snippet.svelte]
<script>
  let { children } = $props()
</script>

<h1>
  {@render children?.()}
</h1>
```
```svelte [basic-snippet.test.svelte]
<script>
  import Subject from './basic-snippet.svelte'
</script>

<Subject>
  <span data-testid="child"></span>
</Subject>
```
:::

对于更复杂的代码片段（例如需要检查参数的情况），可以使用 Svelte 的 [`createRawSnippet`](https://svelte.dev/docs/svelte/svelte#createRawSnippet) API。

::: code-group
```js [complex-snippet.test.js]
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import { expect, test } from 'vitest'

import Subject from './complex-snippet.svelte'

test('renders greeting in message snippet', async () => {
  const screen = render(Subject, {
    name: 'Alice',
    message: createRawSnippet(greeting => ({
      render: () => `<span data-testid="message">${greeting()}</span>`,
    })),
  })

  const message = screen.getByTestId('message')

  await expect.element(message).toHaveTextContent('Hello, Alice!')
})
```
```svelte [complex-snippet.svelte]
<script>
  let { name, message } = $props()

  const greeting = $derived(`Hello, ${name}!`)
</script>

<p>
  {@render message?.(greeting)}
</p>
```
:::

## 相关链接 {#see-also}

- [Svelte Testing Library 文档](https://testing-library.com/docs/svelte-testing-library/intro)
- [Svelte Testing Library 示例](https://github.com/testing-library/svelte-testing-library/tree/main/examples)
