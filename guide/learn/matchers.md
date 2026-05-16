---
title: 使用匹配器 | 指南
prev:
  text: 编写测试
  link: /guide/learn/writing-tests
next:
  text: 测试异步代码
  link: /guide/learn/async
---

# 使用匹配器 {#using-matchers}

Vitest 使用 `expect` 配合 “匹配器” 来断言值是否满足特定条件。本章介绍最常用的匹配器。完整列表请参阅 [Expect API](/api/expect)。

## 常见匹配器 {#common-matchers}

测试一个值时，最简单的方法是检查它是否精确相等。当你编写 `expect(2 + 2).toBe(4)` 时，[`toBe`](/api/expect#tobe) 匹配器使用 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 检查值是否完全等于 `4`。

```js
import { expect, test } from 'vitest'

test('two plus two is four', () => {
  expect(2 + 2).toBe(4)
})
```

这种方式适用于检查数字、字符串和布尔值等原始值。但在比较对象时，`toBe` 检查的是 **恒等性**（它们是否是内存中的同一个对象），而不是它们是否具有相同的结构。这时就需要用到 [`toEqual`](/api/expect#toequal)。它会递归地比较对象或数组的每个字段或元素，忽略对象恒等性：

```js
test('object assignment', () => {
  const data = { one: 1 }
  data.two = 2

  expect(data).toEqual({ one: 1, two: 2 })
})
```

下面这个例子更清楚地展示了两者之间的差异。两个内容相同的对象 `toEqual` 会通过，但 `toBe` 会失败：

```js
test('toBe vs toEqual', () => {
  const a = { name: 'Alice' }
  const b = { name: 'Alice' }

  // 它们在内存中是不同的对象
  expect(a).not.toBe(b)

  // 但结构相同
  expect(a).toEqual(b)
})
```

还有 [`toStrictEqual`](/api/expect#tostrictequal)，它在三个方面比 `toEqual` 更严格：检查 `undefined` 属性、区分稀疏数组和 `undefined` 值，以及验证对象是否具有相同的类型（不仅仅是相同的结构）：

```js
test('toEqual vs toStrictEqual', () => {
  // toEqual 忽略 undefined 属性
  expect({ a: 1 }).toEqual({ a: 1, b: undefined })

  // toStrictEqual 会捕获它们
  expect({ a: 1 }).not.toStrictEqual({ a: 1, b: undefined })

  // toEqual 不检查对象类型
  class User {
    constructor(name) {
      this.name = name
    }
  }
  expect(new User('Alice')).toEqual({ name: 'Alice' })
  expect(new User('Alice')).not.toStrictEqual({ name: 'Alice' })
})
```

::: tip
一个好的经验法则是：对原始值类型（数字、字符串、布尔值）使用 `toBe`，比较结构时使用 `toEqual`，当你还关心类型和显式的 `undefined` 值时使用 `toStrictEqual`。
:::

你可以在任何匹配器前插入 `.not` 来否定它。适用于验证某些 _不成立_ 情况：

```js
test('adding positive numbers is not zero', () => {
  expect(1 + 2).not.toBe(0)
})
```

## 真值 {#truthiness}

在测试中，有时你需要区分 `undefined`、`null` 和 `false`。其他时候你不关心确切的值，只想知道具体是真值还是假值。Vitest 为这两种情况提供了相应的匹配器：

- [`toBeNull`](/api/expect#tobenull) 仅匹配 `null`
- [`toBeUndefined`](/api/expect#tobeundefined) 仅匹配 `undefined`
- [`toBeDefined`](/api/expect#tobedefined) 是 `toBeUndefined` 的反义。任何非 `undefined` 的值都会通过
- [`toBeTruthy`](/api/expect#tobetruthy) 匹配任何 `if` 语句会视为 true 的值
- [`toBeFalsy`](/api/expect#tobefalsy) 匹配任何 `if` 语句会视为 false 的值

你应该选择最能精确描述你检查内容的匹配器。当你实际意思是 `toBeDefined` 时使用 `toBeTruthy` 可能会掩盖 bug，因为 `0` 和 `""` 都是已定义的但却是假值。

```js
test('null checks', () => {
  const n = null

  expect(n).toBeNull()
  expect(n).toBeDefined()
  expect(n).toBeFalsy()
  expect(n).not.toBeTruthy()
  expect(n).not.toBeUndefined()
})

test('zero', () => {
  const z = 0

  expect(z).toBeDefined() // 通过：0 已定义
  expect(z).toBeFalsy() // 通过：0 是假值
  expect(z).not.toBeNull() // 通过：0 不是 null
})
```

## 数字 {#numbers}

大多数数字比较都很直接。Vitest 提供了大于、小于和相等检查的匹配器：

```js
test('number comparisons', () => {
  const value = 2 + 2

  expect(value).toBeGreaterThan(3)
  expect(value).toBeGreaterThanOrEqual(3.5)
  expect(value).toBeLessThan(5)
  expect(value).toBeLessThanOrEqual(4.5)

  // 对于精确相等，toBe 和 toEqual 对数字的效果相同
  expect(value).toBe(4)
  expect(value).toEqual(4)
})
```

浮点数运算有一个常见的陷阱。在 JavaScript 中，`0.1 + 0.2` 并不完全等于 `0.3`（它是 `0.30000000000000004`）。这意味着 `toBe(0.3)` 检查会失败。请改用 [`toBeCloseTo`](/api/expect#tobecloseto)，它会在较小的舍入误差范围内比较数字：

```js
test('adding floating point numbers', () => {
  const value = 0.1 + 0.2

  // 由于浮点数舍入，这不会通过
  // expect(value).toBe(0.3)

  // 这个可以
  expect(value).toBeCloseTo(0.3)
})
```

## 字符串 {#strings}

你可以使用 [`toMatch`](/api/expect#tomatch) 根据正则表达式测试字符串。当你关心形式而非确切值时，这特别方便，例如检查错误消息是否包含某个单词，或者 URL 是否符合特定格式：

```js
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/)
})

test('version string matches semver format', () => {
  expect('vitest@1.0.0').toMatch(/vitest@\d+\.\d+\.\d+/)
})
```

## 数组和可迭代对象 {#arrays-and-iterables}

[`toContain`](/api/expect#tocontain) 检查数组（或任何可迭代对象，如 `Set`）是否包含特定项。它使用 `===` 进行比较，因此对原始类型效果很好：

```js
test('the shopping list has milk in it', () => {
  const shoppingList = ['milk', 'bread', 'eggs', 'butter']

  expect(shoppingList).toContain('milk')
  expect(new Set(shoppingList)).toContain('milk')
})
```

如果你需要检查数组是否包含具有特定结构的对象，请改用 [`toContainEqual`](/api/expect#tocontainequal)。它的工作原理类似于 `toEqual`，但用于数组中的单个元素。

## 对象 {#objects}

测试对象时，你通常只想检查几个重要的字段，而不是检查每个属性。[`toMatchObject`](/api/expect#tomatchobject) 正是为此而设计。它验证对象至少包含你指定的属性，并忽略任何额外的属性：

```js
test('user has expected fields', () => {
  const user = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    createdAt: '2024-01-01'
  }

  // 这里我们只关心 name 和 email
  expect(user).toMatchObject({
    name: 'Alice',
    email: 'alice@example.com',
  })
})
```

对于检查单个属性，特别是嵌套属性，[`toHaveProperty`](/api/expect#tohaveproperty) 更具可读性。你传递一个点分隔的路径，并可选择性地传递一个期望值：

```js
test('object has property', () => {
  const user = {
    name: 'Alice',
    address: { city: 'Paris', zip: '75001' }
  }

  expect(user).toHaveProperty('name')
  expect(user).toHaveProperty('name', 'Alice')
  expect(user).toHaveProperty('address.city', 'Paris')
  expect(user).toHaveProperty('address.zip')
})
```

## 非对称匹配器 {#asymmetric-matchers}

有时你不知道确切的值，但知道它的类型或结构。非对称匹配器让你可以描述值应该 _看起来应该是什么样_，而无需确定确切内容。它们可以在任何进行深度比较的匹配器内部工作，例如 `toEqual` 或 `toMatchObject`：

```js
test('user has the right shape', () => {
  const user = createUser('Alice')

  expect(user).toEqual({
    id: expect.any(Number),
    name: 'Alice',
    email: expect.stringContaining('@'),
    roles: expect.arrayContaining(['viewer']),
  })
})
```

最常用的非对称匹配器有：

- [`expect.any(Constructor)`](/api/expect#expect-any) 匹配使用给定构造函数创建的任何值（例如 `Number`、`String`、`Array`）
- [`expect.stringContaining(str)`](/api/expect#expect-stringcontaining) 匹配包含给定子字符串的字符串
- [`expect.stringMatching(regex)`](/api/expect#expect-stringmatching) 根据正则表达式匹配字符串
- [`expect.arrayContaining(arr)`](/api/expect#expect-arraycontaining) 匹配包含预期数组中所有项的数组（顺序无关紧要，允许额外项）
- [`expect.objectContaining(obj)`](/api/expect#expect-objectcontaining) 匹配至少包含指定属性的对象

## 异常 {#exceptions}

要验证函数是否抛出错误，请使用 [`toThrow`](/api/expect#tothrow)。你需要将调用包装在另一个函数中，以便 Vitest 可以捕获错误而不是让它导致测试崩溃：

```js
function compileCode(code) {
  if (code === '') {
    throw new Error('Cannot compile empty string')
  }
  return code
}

test('compiling an empty string throws', () => {
  // 检查它是否抛出异常
  expect(() => compileCode('')).toThrow()

  // 检查错误信息
  expect(() => compileCode('')).toThrow('Cannot compile empty string')

  // 使用正则表达式检查错误信息
  expect(() => compileCode('')).toThrow(/empty string/)
})
```

::: tip
包装函数 `() => compileCode('')` 很重要。如果你写成 `expect(compileCode('')).toThrow()`，错误会在 `expect` 有机会捕获它 _之前_ 就被抛出，测试将因未处理的错误而失败。
:::

## 软断言 {#soft-assertions}

通常，失败的断言会立即停止测试。这是适用大多数情况，但有时你想检查多个独立项并一次性看到所有失败，而不是逐个修复。

[`expect.soft`](/api/expect#soft) 正是为此而设计。它会记录失败，但让测试继续运行：

```js
test('check multiple fields', () => {
  const user = { name: 'Alice', age: 30, role: 'admin' }

  expect.soft(user.name).toBe('Alice')
  expect.soft(user.age).toBe(25) // 这个会失败，但执行会继续
  expect.soft(user.role).toBe('admin')
  // 测试报告将显示 age 不匹配
})
```

这对于验证 API 响应或复杂对象的结构特别有用，因为多个字段可能同时出错。
