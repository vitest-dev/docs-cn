---
title: 模拟函数 | 指南
prev:
  text: 初始化与清理
  link: /guide/learn/setup-teardown
next:
  text: 快照测试
  link: /guide/learn/snapshots
---

# 模拟函数 {#mock-functions}

在编写测试时，经常需要用一个受控版本替换真实的函数或模块。这被称为 **模拟**。你可能出于多种原因需要这样做：也许真实函数会发起网络请求，从而拖慢测试速度，又或者你需要模拟一个难以用真实代码触发的错误。模拟函数让你能够控制依赖项返回什么、观察它如何被调用，并将被测代码与副作用隔离开。

Vitest 通过 [`vi`](/api/vi) 对象提供模拟工具函数。

## 创建 Mock 函数 {#creating-mock-functions}

创建模拟最简单的方法是使用 [`vi.fn()`](/api/vi#vi-fn)。这会得到一个默认什么都不做（仅返回 `undefined`）的函数，但它会追踪每一次调用：

```js
import { expect, test, vi } from 'vitest'

test('mock function basics', () => {
  const getApples = vi.fn()

  // 调用它
  getApples()

  // 检查它是否被调用过
  expect(getApples).toHaveBeenCalled()
  expect(getApples).toHaveBeenCalledTimes(1)

  // 默认情况下，模拟函数返回 undefined
  expect(getApples()).toBeUndefined()
})
```

## 模拟返回值 {#mock-return-values}

一个总是返回 `undefined` 的模拟函数本身用处不大。你通常需要控制它返回什么，以便测试代码对不同值的反应：

```js
import { expect, test, vi } from 'vitest'

test('mock return values', () => {
  const getApples = vi.fn()

  // 总是返回这个值
  getApples.mockReturnValue(10)
  expect(getApples()).toBe(10)

  // 仅返回此值一次，然后回退到默认值
  getApples.mockReturnValueOnce(20)
  expect(getApples()).toBe(20) // 20（一次性）
  expect(getApples()).toBe(10) // 回到默认值
})
```

如果你模拟的函数是异步的，请使用 [`mockResolvedValue`](/api/mock#mockresolvedvalue) 和 [`mockRejectedValue`](/api/mock#mockrejectedvalue) 来控制 Promise 的结果：

```js
test('mock async return values', async () => {
  const fetchUser = vi.fn()

  fetchUser.mockResolvedValue({ name: 'Alice' })
  const user = await fetchUser()
  expect(user.name).toBe('Alice')

  fetchUser.mockRejectedValue(new Error('Not found'))
  await expect(fetchUser()).rejects.toThrow('Not found')
})
```

## 模拟实现 {#mock-implementation}

有时你需要的不只是一个固定的返回值。你希望模拟函数能实际对其参数进行一些操作。[`mockImplementation`](/api/mock#mockimplementation) 允许你提供一个完整的替代函数：

```js
import { expect, test, vi } from 'vitest'

test('mock with custom implementation', () => {
  const add = vi.fn()
  add.mockImplementation((a, b) => a + b)

  expect(add(1, 2)).toBe(3)
  expect(add(10, 20)).toBe(30)
})
```

作为快捷方式，你可以直接将实现传递给 `vi.fn()`：

```js
const add = vi.fn((a, b) => a + b)
```

## 检查调用 {#inspecting-calls}

模拟函数最强大的功能之一是它们能记住每一次调用。你可以断言函数被调用了多少次、接收了什么参数以及返回了什么：

```js
import { expect, test, vi } from 'vitest'

test('inspecting mock calls', () => {
  const greet = vi.fn()

  greet('Alice')
  greet('Bob', 'Charlie')

  // 调用次数
  expect(greet).toHaveBeenCalledTimes(2)

  // 检查特定参数
  expect(greet).toHaveBeenCalledWith('Alice')
  expect(greet).toHaveBeenCalledWith('Bob', 'Charlie')

  // 按位置检查特定调用的参数
  expect(greet).toHaveBeenNthCalledWith(1, 'Alice')
  expect(greet).toHaveBeenLastCalledWith('Bob', 'Charlie')

  // 访问原始调用数据
  expect(greet.mock.calls).toEqual([
    ['Alice'],
    ['Bob', 'Charlie'],
  ])
})
```

`.mock` 属性让你能完全访问调用历史。除了 `.mock.calls`，你还可以检查 `.mock.results` 来查看模拟函数每次调用返回了什么或抛出了什么：

```js
const double = vi.fn(x => x * 2)

double(5)
double(10)

expect(double.mock.results).toEqual([
  { type: 'return', value: 10 },
  { type: 'return', value: 20 },
])
```

::: warning
`.mock.calls` 存储的是对参数的引用，而不是副本。如果你将一个对象传递给模拟函数，之后又修改了它，那么记录的调用将反映修改后的状态，而不是调用时的状态：

```js
const fn = vi.fn()
const obj = { count: 1 }

fn(obj)
obj.count = 2

// ❌ 这会失败！mock.calls[0][0].count 现在是 2，而不是 1
expect(fn).toHaveBeenCalledWith({ count: 1 })
```

如果你需要对原始值进行断言，可以使用 `mockImplementation` 在调用时捕获一个克隆：

```js
const calls = []
const fn = vi.fn((obj) => {
  calls.push(structuredClone(obj))
})

const obj = { count: 1 }
fn(obj)
obj.count = 2

expect(calls[0]).toEqual({ count: 1 }) // ✅ 通过
```

或者，你可以在修改发生之前进行断言。
:::

## 监听方法 {#spying-on-methods}

[`vi.spyOn`](/api/vi#vi-spyon) 与 `vi.fn()` 有一个重要区别。它不是创建一个全新的函数，而是包装对象上 _现有_ 的方法。默认情况下原始实现仍然有效，但你可以观察每次调用，并选择性地覆盖其行为：

```js
import { expect, test, vi } from 'vitest'

const calculator = {
  add(a, b) {
    return a + b
  },
}

test('spy on a method', () => {
  const spy = vi.spyOn(calculator, 'add')

  // 原始实现仍然工作
  expect(calculator.add(1, 2)).toBe(3)

  // 但我们可以观察调用
  expect(spy).toHaveBeenCalledWith(1, 2)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('spy can override implementation', () => {
  const spy = vi.spyOn(calculator, 'add')
  spy.mockReturnValue(42)

  expect(calculator.add(1, 2)).toBe(42)
})
```

适用于你想验证你的代码正确调用了某个方法，而不是完全替换该方法的行为。

## 重置模拟 {#resetting-mocks}

模拟函数随着测试运行会积累状态。它们会记住每次调用、每个返回值以及你设置的任何自定义实现。如果你不在测试之间重置它们，这种状态可能会泄漏并导致难以理解的失败。Vitest 提供了三个级别的清理函数：

- **[`mockClear()`](/api/mock#mockclear)** 清除记录的调用历史和返回值，但保留你设置的任何自定义实现
- **[`mockReset()`](/api/mock#mockreset)** 执行 `mockClear` 的所有操作，并且还会移除所有自定义实现，将模拟恢复到其默认状态
- **[`mockRestore()`](/api/mock#mockrestore)** 专门用于通过 `vi.spyOn` 创建的 spy。它会恢复对象的原始方法，有效地撤销 spy。对于 `vi.fn()` 创建的模拟，其行为与 `mockReset` 相同

在实践过程中，最简单的方法是在每个测试后自动恢复所有模拟：

```js
import { afterEach, expect, test, vi } from 'vitest'

const calculator = {
  add: (a, b) => a + b,
}

afterEach(() => {
  vi.restoreAllMocks()
})

test('spy is restored after the test', () => {
  const spy = vi.spyOn(calculator, 'add').mockReturnValue(42)
  expect(calculator.add(1, 2)).toBe(42)
  // afterEach 会将 calculator.add 恢复到原始实现
})
```

更好的做法是，你可以通过 [`restoreMocks`](/config/restoremocks) 选项全局配置此功能，这样你完全不需要 `afterEach`：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    restoreMocks: true,
  },
})
```

## 模拟模块 {#mocking-modules}

有时你需要替换 [整个模块](/guide/mocking/modules)，而不仅仅是单个函数。例如，一个你不想在测试期间运行的数据库客户端或日志记录器。[`vi.mock`](/api/vi#vi-mock) 允许你用模拟实现替换模块的导出：

```js
import { expect, test, vi } from 'vitest'
import { getUser } from './db.js'

vi.mock(import('./db.js'), () => ({
  getUser: vi.fn(),
}))

test('mock a module', () => {
  vi.mocked(getUser).mockReturnValue({ name: 'Alice' })

  const user = getUser(1)
  expect(user.name).toBe('Alice')
  expect(getUser).toHaveBeenCalledWith(1)
})
```

::: warning
[`vi.mock`](/api/vi#vi-mock) 调用会被提升到文件顶部。它们在所有导入之前运行。这意味着 mock 版本会在你的测试代码运行时就已经就位。
:::

::: warning
始终传递 `import('./db.js')` 而不是纯字符串 `'./db.js'`。当你使用 `import()` 时，TypeScript 可以推断模块的类型，因此工厂函数的返回值会进行类型检查，并且 `importOriginal` 会返回正确类型的模块。此外，如果你在 IDE 中重命名或移动文件，导入路径会自动更新。如果使用字符串，你将失去类型安全和自动重构能力。
:::

Vitest 为特定的模拟场景提供了全方面的指南：

- [模拟函数](/guide/mocking/functions)
- [模拟模块](/guide/mocking/modules)
- [模拟计时器](/guide/mocking/timers)
- [模拟日期](/guide/mocking/dates)
- [模拟全局对象](/guide/mocking/globals)
- [模拟请求](/guide/mocking/requests)
- [模拟文件系统](/guide/mocking/file-system)
- [模拟类](/guide/mocking/classes)
