---
title: Examples | Browser Mode
---

# 示例 {#examples}

浏览器模式与框架无关，因此不提供任何渲染组件的方法。不过，你应该可以使用框架的测试工具包。

我们建议根据你的框架使用 `testing-library` packages：

- [`@testing-library/dom`](https://testing-library.com/docs/dom-testing-library/intro) 如果你不使用框架
- [`@testing-library/vue`](https://testing-library.com/docs/vue-testing-library/intro) 渲染 [vue](https://vuejs.org) 组件
- [`@testing-library/svelte`](https://testing-library.com/docs/svelte-testing-library/intro) 渲染 [svelte](https://svelte.dev) 组件
- [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro) 渲染 [react](https://react.dev) 组件
- [`@testing-library/preact`](https://testing-library.com/docs/preact-testing-library/intro) 渲染 [preact](https://preactjs.com) 组件
- [`@solidjs/testing-library`](https://testing-library.com/docs/solid-testing-library/intro) 渲染 [solid](https://www.solidjs.com) 组件
- [`@marko/testing-library`](https://testing-library.com/docs/marko-testing-library/intro) 渲染 [marko](https://markojs.com) 组件

::: warning
`testing-library` 提供了一个包 `@testing-library/user-event`。我们不建议直接使用它，因为它会模拟事件而非实际触发事件——相反，请使用从 `@vitest/browser/context` 导入的 [`userEvent`](#interactivity-api)，它使用 Chrome DevTools 协议或 Webdriver（取决于 provider）。
:::

::: code-group
```ts [vue]
// 基于 @testing-library/vue 示例
// https://testing-library.com/docs/vue-testing-library/examples

import { render, screen } from '@testing-library/vue'
import { userEvent } from '@vitest/browser/context'
import Component from './Component.vue'

test('properly handles v-model', async () => {
  render(Component)

  // 断言初始状态。
  expect(screen.getByText('Hi, my name is Alice')).toBeInTheDocument()

  // 通过查询关联的标签获取输入的 DOM 节点。
  const usernameInput = await screen.findByLabelText(/username/i)

  // 将名称输入到输入框中。
  // 这已经验证了输入框中的值是正确的，无需手动检查其值。
  await userEvent.fill(usernameInput, 'Bob')

  expect(screen.getByText('Hi, my name is Alice')).toBeInTheDocument()
})
```
```ts [svelte]
// 基于 @testing-library/svelte 示例
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
// 基于 @testing-library/react 示例
// https://testing-library.com/docs/react-testing-library/example-intro

import { render, screen } from '@testing-library/react'
import { userEvent } from '@vitest/browser/context'
import Fetch from './fetch'

test('loads and displays greeting', async () => {
  // 将 React 元素渲染到 DOM 中
  render(<Fetch url="/greeting" />)

  await userEvent.click(screen.getByText('Load Greeting'))
  // 如果找不到元素，则等待一段时间后再抛出错误
  const heading = await screen.findByRole('heading')

  // 断言警告消息是正确的
  expect(heading).toHaveTextContent('hello there')
  expect(screen.getByRole('button')).toBeDisabled()
})
```
```tsx [preact]
// 基于 @testing-library/preact 示例
// https://testing-library.com/docs/preact-testing-library/example

import { render } from '@testing-library/preact'
import { userEvent } from '@vitest/browser/context'
import { h } from 'preact'

import HiddenMessage from '../hidden-message'

test('shows the children when the checkbox is checked', async () => {
  const testMessage = 'Test Message'

  const { queryByText, getByLabelText, getByText } = render(
    <HiddenMessage>{testMessage}</HiddenMessage>,
  )

  // query* 函数会返回元素，如果找不到则返回 null。
  // get* 函数会返回元素，如果找不到则抛出错误。
  expect(queryByText(testMessage)).not.toBeInTheDocument()

  // 查询可以接受正则表达式，使选择器更能
  // 适应内容的调整和变化。
  await userEvent.click(getByLabelText(/show/i))

  expect(getByText(testMessage)).toBeInTheDocument()
})
```
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
  const { findByText } = render(() => <App />, { location: 'ids/1234' })
  expect(await findByText('Id: 1234')).toBeInTheDocument()
})
```
```ts [marko]
// 基于 @testing-library/marko API
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
