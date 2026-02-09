---
outline: deep
---

# vitest-browser-react

由社区提供的 [`vitest-browser-react`](https://www.npmjs.com/package/vitest-browser-react) 包可在 [浏览器模式](/guide/browser/) 中渲染 [React](https://zh-hans.react.dev/) 组件。

```jsx
import { render } from 'vitest-browser-react'
import { expect, test } from 'vitest'
import Component from './Component.jsx'

test('counter button increments the count', async () => {
  const screen = await render(<Component count={1} />)

  await screen.getByRole('button', { name: 'Increment' }).click()

  await expect.element(screen.getByText('Count is 2')).toBeVisible()
})
```

::: warning
该库的灵感来至于 [`@testing-library/react`](https://github.com/testing-library/react-testing-library).

如果你之前使用过 `@testing-library/react`，仍可继续延用。但 `vitest-browser-react` 包提供了浏览器模式下特有的优势，这些是 `@testing-library/vue` 所不具备的：

`vitest-browser-react` 返回的 API 能与内置的 [定位器](/api/browser/locators)、[用户事件](/api/browser/interactivity) 及 [断言](/api/browser/assertions) 更好的协作。例如：即使组件在断言间被重新渲染，Vitest 仍会自动重试元素查找，直至断言成功。
:::

该包提供两个入口点：`vitest-browser-react` 和 `vitest-browser-react/pure`。两者暴露完全相同的 API（`pure` 也暴露 `configure`），但在下一个测试开始前 `pure` 不会添加移除组件处理程序。

## 渲染函数 {#render}

```ts
export function render(
  ui: React.ReactNode,
  options?: ComponentRenderOptions,
): Promise<RenderResult>
```

:::warning
请注意，与其他包不同，为了正确支持 [`Suspense`](https://react.dev/reference/react/Suspense) 功能，此处的 `render` 是异步方法。

```tsx
import { render } from 'vitest-browser-react'
const screen = render(<Component />) // [!code --]
const screen = await render(<Component />) // [!code ++]
```
:::

### 选项 {#options}

#### container

默认情况下，Vitest 会创建一个 `div` 并添加到 `document.body` 上，然后在该节点中渲染你的组件。如果提供自定义的 `HTMLElement` 容器，则不会自动添加，你需要在调用 `render` 前手动执行 `document.body.appendChild(container)`。

例如，当测试 `tbody` 元素时，它不能作为 `div` 的子元素。在这个例子中，你可以指定一个 `table` 作为渲染容器。

```jsx
const table = document.createElement('table')

const { container } = await render(<TableBody {...props} />, {
  // ⚠️ 渲染前需手动将元素添加到 `body`
  container: document.body.appendChild(table),
})
```

#### baseElement

如果指定了 `container` 参数，则默认以此为根元素，否则将默认使用 `document.body`。该元素既作为查询操作的根节点，也会在使用 `debug()` 时被输出展示。

#### wrapper

将 React 组件作为 `wrapper` 选项传入，该组件会包裹内部元素进行渲染。此功能特别适用于为通用数据提供者创建可复用的自定义渲染函数。例如：

```jsx
import React from 'react'
import { render } from 'vitest-browser-react'
import { ThemeProvider } from 'my-ui-lib'
import { TranslationProvider } from 'my-i18n-lib'

function AllTheProviders({ children }) {
  return (
    <ThemeProvider theme="light">
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </ThemeProvider>
  )
}

export function customRender(ui, options) {
  return render(ui, { wrapper: AllTheProviders, ...options })
}
```

### 渲染结果 {#render-result}

除文档记载的返回值外，`render` 函数还会返回相对于 [`baseElement`](#baseelement) 的所有可用 [定位器](/api/browser/locators)，包括 [自定义定位器](/api/browser/locators#custom-locators)。

```tsx
const screen = await render(<TableBody {...props} />)

await screen.getByRole('link', { name: 'Expand' }).click()
```

#### container

The containing `div` DOM node of your rendered React Element (rendered using `ReactDOM.render`). This is a regular DOM node, so you technically could call `container.querySelector` etc. to inspect the children.

:::danger
如果你需通过 `container` 查询渲染元素，你应该重新考虑测试方法！[定位器](/api/browser/locators) 专为应对组件变更而设计，比直接查询容器更具稳定性。应避免使用 `container` 查询元素！
:::

#### baseElement

React 元素将被渲染到 `container` 这个 DOM 容器中。如果在调用 render 时没有通过 `baseElement` 选项指定容器，则默认使用 `document.body`。

适用于被测组件需要在容器 `div` 之外渲染内容，例如，对直接渲染到 body 的传送门组件进行快照测试。

:::tip
`render` 返回的查询方法会基于 `baseElement` 进行查找，因此即使不指定 `baseElement`，也能通过这些查询方法来测试你的传送门组件。
:::

#### locator

`container` 的 [定位器](/api/browser/locators)。在组件范围内查找元素或传递给其他断言语句场景下特别有用：

```jsx
import { render } from 'vitest-browser-react'

const { locator } = await render(<NumberDisplay number={1} />)

await locator.getByRole('button').click()
await expect.element(locator).toHaveTextContent('Hello World')
```

#### debug

```ts
function debug(
  el?: HTMLElement | HTMLElement[] | Locator | Locator[],
  maxLength?: number,
  options?: PrettyDOMOptions,
): void
```

此方法是 `console.log(prettyDOM(baseElement))` 的快捷方式，用于在控制台输出容器或指定元素的 DOM 内容。

#### rerender

```ts
function rerender(ui: React.ReactNode): Promise<void>
```

其最佳实践是测试负责更新属性的组件本身，以确保属性更新逻辑正确，从而避免测试代码依赖于实现细节。如果需要在测试过程中更新已渲染组件的属性，当前函数可用于实现该需求。

```jsx
import { render } from 'vitest-browser-react'

const { rerender } = await render(<NumberDisplay number={1} />)

// 使用新属性重新渲染同一个组件
await rerender(<NumberDisplay number={2} />)
```

#### unmount

```ts
function unmount(): Promise<void>
```

此操作将会把已渲染的组件卸载。该特性适用于测试组件从页面移除时的行为（例如验证是否残留未清除的事件处理器，避免引发内存泄漏）。

```jsx
import { render } from 'vitest-browser-react'

const { container, unmount } = await render(<Login />)
await unmount()
// 组件已被卸载，此时：container.innerHTML === ''
```

#### asFragment

```ts
function asFragment(): DocumentFragment
```

Returns a `DocumentFragment` of your rendered component. This can be useful if you need to avoid live bindings and see how your component reacts to events.

## cleanup

```ts
export function cleanup(): Promise<void>
```

Remove all components rendered with [`render`](#render).

## renderHook

```ts
export function renderHook<Props, Result>(
  renderCallback: (initialProps?: Props) => Result,
  options: RenderHookOptions<Props>,
): Promise<RenderHookResult<Result, Props>>
```

This is a convenience wrapper around `render` with a custom test component. The API emerged from a popular testing pattern and is mostly interesting for libraries publishing hooks. You should prefer `render` since a custom test component results in more readable and robust tests since the thing you want to test is not hidden behind an abstraction.

```jsx
import { renderHook } from 'vitest-browser-react'

test('returns logged in user', async () => {
  const { result } = await renderHook(() => useLoggedInUser())
  expect(result.current).toEqual({ name: 'Alice' })
})
```

### Options

`renderHook` accepts the same options as [`render`](#render) with an addition to `initialProps`:

It declares the props that are passed to the render-callback when first invoked. These will not be passed if you call `rerender` without props.

```jsx
import { renderHook } from 'vitest-browser-react'

test('returns logged in user', async () => {
  const { result, rerender } = await renderHook((props = {}) => props, {
    initialProps: { name: 'Alice' },
  })
  expect(result.current).toEqual({ name: 'Alice' })
  await rerender()
  expect(result.current).toEqual({ name: undefined })
})
```

:::warning
When using `renderHook` in conjunction with the `wrapper` and `initialProps` options, the `initialProps` are not passed to the `wrapper` component. To provide props to the `wrapper` component, consider a solution like this:

```jsx
function createWrapper(Wrapper, props) {
  return function CreatedWrapper({ children }) {
    return <Wrapper {...props}>{children}</Wrapper>
  }
}

// ...

await renderHook(() => {}, {
  wrapper: createWrapper(Wrapper, { value: 'foo' }),
})
```
:::

`renderHook` returns a few useful methods and properties:

### Render Hook Result

#### result

Holds the value of the most recently committed return value of the render-callback:

```jsx
import { useState } from 'react'
import { renderHook } from 'vitest-browser-react'
import { expect } from 'vitest'

const { result } = await renderHook(() => {
  const [name, setName] = useState('')
  React.useEffect(() => {
    setName('Alice')
  }, [])

  return name
})

expect(result.current).toBe('Alice')
```

Note that the value is held in `result.current`. Think of result as a [ref](https://react.dev/learn/referencing-values-with-refs) for the most recently committed value.

#### rerender {#renderhooks-rerender}

Renders the previously rendered render-callback with the new props:

```jsx
import { renderHook } from 'vitest-browser-react'

const { rerender } = await renderHook(({ name = 'Alice' } = {}) => name)

// re-render the same hook with different props
await rerender({ name: 'Bob' })
```

#### unmount {#renderhooks-unmount}

Unmounts the test hook.

```jsx
import { renderHook } from 'vitest-browser-react'

const { unmount } = await renderHook(({ name = 'Alice' } = {}) => name)

await unmount()
```

## Extend Queries

To extend locator queries, see [`"Custom Locators"`](/api/browser/locators#custom-locators). For example, to make `render` return a new custom locator, define it using the `locators.extend` API:

```jsx {5-7,12}
import { locators } from 'vitest/browser'
import { render } from 'vitest-browser-react'

locators.extend({
  getByArticleTitle(title) {
    return `[data-title="${title}"]`
  },
})

const screen = await render(<Component />)
await expect.element(
  screen.getByArticleTitle('Hello World')
).toBeVisible()
```

## Configuration

You can configure if the component should be rendered in Strict Mode with configure method from `vitest-browser-react/pure`:

```js
import { configure } from 'vitest-browser-react/pure'

configure({
  // disabled by default
  reactStrictMode: true,
})
```

## See also

- [React Testing Library 文档](https://testing-library.com/docs/react-testing-library/intro)
