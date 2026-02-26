---
outline: deep
---

# vitest-browser-vue

由社区提供的 [`vitest-browser-vue`](https://www.npmjs.com/package/vitest-browser-vue) 包可在 [浏览器模式](/guide/browser/) 中渲染 [Vue](https://cn.vuejs.org/) 组件。

```ts
import { render } from 'vitest-browser-vue'
import { expect, test } from 'vitest'
import Component from './Component.vue'

test('counter button increments the count', async () => {
  const screen = render(Component, {
    props: {
      initialCount: 1,
    }
  })

  await screen.getByRole('button', { name: 'Increment' }).click()

  await expect.element(screen.getByText('Count is 2')).toBeVisible()
})
```

::: warning
该库的灵感来至于 [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library)。

如果你之前使用过 `@testing-library/vue`，仍可以继续延用。但 `vitest-browser-vue` 包提供了浏览器模式下特有的优势，这些是 `@testing-library/vue` 所不具备的：

`vitest-browser-vue` 返回的 API 能与内置的 [定位器](/api/browser/locators)、[用户事件](/api/browser/interactivity) 及 [断言](/api/browser/assertions) 更好的协作。例如：即使组件在断言间被重新渲染，Vitest 仍会自动重试元素查找，直至断言成功。
:::

该包提供两个入口点：`vitest-browser-vue` 和 `vitest-browser-vue/pure`。两者暴露完全相同的 API，但在下一个测试开始前 `pure` 不会添加移除组件处理程序。

## 渲染函数 {#render}

```ts
export function render(
  component: Component,
  options?: ComponentRenderOptions,
): RenderResult
```

### 选项 {#options}

`render` 函数支持 `@vue/test-utils` 中 [`mount` 选项](https://test-utils.vuejs.org/api/#mount) 的全部参数（除 `attachTo` 外，需改用 `container`）。此外还额外支持 `container` 和 `baseElement` 参数。

#### container

默认情况下，Vitest 会创建一个 `div` 并添加到 `document.body` 上，然后在该节点中渲染你的组件。如果提供自定义的 `HTMLElement` 容器，则不会自动添加，你需要在调用 `render` 前手动执行 `document.body.appendChild(container)`。

例如，当测试 `tbody` 元素时，它不能作为 `div` 的子元素。在这个例子中，你可以指定一个 `table` 作为渲染容器。

```js
const table = document.createElement('table')

const { container } = render(TableBody, {
  props,
  // ⚠️ 渲染前需手动将元素添加到 `body`
  container: document.body.appendChild(table),
})
```

#### baseElement

如果指定了 `container` 参数，则默认以此为根元素，否则将默认使用 `document.body`。该元素既作为查询操作的根节点，也会在使用 `debug()` 时被输出展示。

### 渲染结果 {#render-result}

除文档记载的返回值外，`render` 函数还会返回相对于 [`baseElement`](#baseelement) 的所有可用 [定位器](/api/browser/locators)，包括 [自定义定位器](/api/browser/locators#custom-locators)。

```ts
const screen = render(TableBody, { props })

await screen.getByRole('link', { name: 'Expand' }).click()
```

#### container

Vue 组件将被渲染到 `container` 这个 DOM 容器中。这是一个常规 DOM 节点，因此理论上可以通过 `container.querySelector` 等方式检查子元素。

:::danger
如果你需通过 `container` 查询渲染元素，你应该重新考虑测试方法！[定位器](/api/browser/locators) 专为应对组件变更而设计，比直接查询容器更具稳定性。应避免使用 `container` 查询元素！
:::

#### baseElement

Vue 组件将被渲染到 `container` 这个 DOM 容器中。如果在调用 render 时没有通过 `baseElement` 选项指定容器，则默认使用 `document.body`。

适用于被测组件需要在容器 `div` 之外渲染内容，例如，对直接渲染到 body 的传送门组件进行快照测试。

:::tip
`render` 返回的查询方法会基于 `baseElement` 进行查找，因此即使不指定 `baseElement`，也能通过这些查询方法来测试你的传送门组件。
:::

#### locator

`container` 的 [定位器](/api/browser/locators)。适用于在组件范围内查找元素或传递给其他断言语句场景：

```js
import { render } from 'vitest-browser-vue'

const { locator } = render(NumberDisplay, {
  props: { number: 2 }
})

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
function rerender(props: Partial<Props>): void
```

其最佳实践是测试负责更新属性的组件本身，以确保属性更新逻辑正确，从而避免测试代码依赖于实现细节。如果需要在测试过程中更新已渲染组件的属性，当前函数可用于实现该需求。

```js
import { render } from 'vitest-browser-vue'

const { rerender } = render(NumberDisplay, { props: { number: 1 } })

// 使用新属性重新渲染同一个组件
rerender({ number: 2 })
```

#### unmount

```ts
function unmount(): void
```

此操作将会把已渲染的组件卸载。该特性适用于测试组件从页面移除时的行为（例如验证是否残留未清除的事件处理器，避免引发内存泄漏）。

#### emitted

```ts
function emitted<T = unknown>(): Record<string, T[]>
function emitted<T = unknown[]>(eventName: string): undefined | T[]
```

返回组件触发的事件。

::: warning
事件触发值是内部实现细节，不直接向用户公开。建议通过 [定位器](/api/browser/locators) 测试触发值如何改变显示内容，而非直接依赖此方法。
:::

## cleanup

```ts
export function cleanup(): void
```

移除所有通过 [`render`](#render) 方法渲染的组件。

## 扩展查询 {#extend-queries}

如果想扩展定位器的查询方法，详情参阅 [`“自定义定位器”`](/api/browser/locators#custom-locators)。例如，要为 `render` 扩展一个新的定位器，可使用 `locators.extend` API 进行定义：

```js {5-7,12}
import { locators } from 'vitest/browser'
import { render } from 'vitest-browser-vue'

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

## 配置 {#configuration}

像配置 [Vue Test Utils](https://test-utils.vuejs.org/api/#config) 一样， 通过将属性分配给导出的 `config` 选项 （在`vitest-browser-vue` 和 `vitest-borowser-vue/pure` 中都可用）：

```js
import { config } from 'vitest-browser-vue/pure'

config.global.stubs.CustomComponent = {
  template: '<div></div>',
}
```

## 相关链接 {#see-also}

- [Vue Testing Library 文档](https://testing-library.com/docs/vue-testing-library/intro)
