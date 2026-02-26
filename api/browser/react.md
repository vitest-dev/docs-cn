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
该库的灵感来至于 [`@testing-library/react`](https://github.com/testing-library/react-testing-library)。

如果你之前使用过 `@testing-library/react`，仍可继续延用。但 `vitest-browser-react` 包提供了浏览器模式下特有的优势，这些是 `@testing-library/react` 所不具备的：

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
请注意，与其他包不同，为了支持 [`Suspense`](https://react.dev/reference/react/Suspense) 功能，此处的 `render` 是异步方法。

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

这是渲染后的 React 元素所包含的 `div` DOM 节点（通过 `ReactDOM.render` 渲染生成）。这是一个常规 DOM 节点，因此理论上可以通过 `container.querySelector` 等方式检查子元素。

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

`container` 的 [定位器](/api/browser/locators)。适用于在组件范围内查找元素或传递给其他断言语句场景：

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

此方法是 `console.log(prettyDOM(baseElement))` 的简写形式，用于在控制台输出容器或指定元素的 DOM 内容。

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

返回已渲染组件的 `DocumentFragment`。适用于需要避免实时绑定并观察组件对事件的响应。

## cleanup

```ts
export function cleanup(): Promise<void>
```

移除所有通过 [`render`](#render) 方法渲染的组件。

## renderHook

```ts
export function renderHook<Props, Result>(
  renderCallback: (initialProps?: Props) => Result,
  options: RenderHookOptions<Props>,
): Promise<RenderHookResult<Result, Props>>
```

这是对 `render` 方法的封装，内置了自定义测试组件。该 API 源于一种流行的测试模式，主要适用于发布 hooks 库的开发者。我们建议优先使用 `render` 方法，因为自定义测试组件会导致被测逻辑隐藏在抽象层之后，而直接使用 `render` 能写出更可读、更健壮的测试代码。

```jsx
import { renderHook } from 'vitest-browser-react'

test('returns logged in user', async () => {
  const { result } = await renderHook(() => useLoggedInUser())
  expect(result.current).toEqual({ name: 'Alice' })
})
```

### 选项 {#options-1}

`renderHook` 接受与 [`render`](#render) 相同的配置项，并额外支持 `initialProps` 参数：

首次调用时声明传递给渲染回调函数的属性参数。若不带参数调用 `rerender` 则不会传递这些属性。

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
当 `renderHook` 与 `wrapper` 和 `initialProps` 选项结合使用时，要注意的是 `initialProps` 不会传递给 `wrapper` 组件。如果需要向 `wrapper` 组件传递属性参数，可采用以下方案解决：

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

`renderHook` 返回包含以下工具方法和属性的对象:

### Render Hook Result

#### result

保存渲染回调函数最近一次提交的返回值:

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

注意返回值存储在 `result.current` 中。可以将 result 视为最近保存的值 [ref](https://zh-hans.react.dev/learn/referencing-values-with-refs)。

#### rerender {#renderhooks-rerender}

使用新的 props 重新渲染之前渲染过的回调函数：

```jsx
import { renderHook } from 'vitest-browser-react'

const { rerender } = await renderHook(({ name = 'Alice' } = {}) => name)

// 使用不同 props 重新渲染同一个 hook
await rerender({ name: 'Bob' })
```

#### unmount {#renderhooks-unmount}

卸载测试钩子。

```jsx
import { renderHook } from 'vitest-browser-react'

const { unmount } = await renderHook(({ name = 'Alice' } = {}) => name)

await unmount()
```

## 扩展查询 {#extend-queries}

如果想扩展定位器的查询方法，详情参阅 [`“自定义定位器”`](/api/browser/locators#custom-locators)。例如，要为 `render` 扩展一个新的定位器，可使用 `locators.extend` API 进行定义：

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

## 配置 {#configuration}

可以通过 `vitest-browser-react/pure` 中的 `configure` 方法配置组件是否应在严格模式下渲染：

```js
import { configure } from 'vitest-browser-react/pure'

configure({
  // 默认禁用
  reactStrictMode: true,
})
```

## 相关链接 {#see-also}

- [React Testing Library 文档](https://testing-library.com/docs/react-testing-library/intro)
