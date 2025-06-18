---
title: 扩展断言 | 指南
---

# 扩展断言(Matchers)

由于 Vitest 兼容 Chai 和 Jest，所以可以根据个人喜好使用 `chai.use` API 或者 `expect.extend`。

本文将以 `expect.extend` 为例探讨扩展断言。如果你对 Chai 的 API 更感兴趣，可以查看[它的指南](https://www.chaijs.com/guide/plugins/)。

为了扩展默认的断言，可以使用对象包裹断言的形式调用 `expect.extend` 方法。

```ts
expect.extend({
  toBeFoo(received, expected) {
    const { isNot } = this
    return {
      // 请勿根据 isNot 参数更改你的 "pass" 值，Vitest 为你做了这件事情
      pass: received === 'foo',
      message: () => `${received} is${isNot ? ' not' : ''} foo`,
    }
  },
})
```

如果你使用 TypeScript，你可以使用以下代码在环境声明文件（例如：`vitest.d.ts`）中扩展默认的 `Assertion` 接口：

::: code-group
```ts [<Version>3.2.0</Version>]
import 'vitest'

interface CustomMatchers<R = unknown> {
  toBeFoo: () => R
}

declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
```
```ts [<Version>3.0.0</Version>]
import 'vitest'

interface CustomMatchers<R = unknown> {
  toBeFoo: () => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
```
:::

::: tip
Since Vitest 3.2, you can extend the `Matchers` interface to have type-safe assertions in `expect.extend`, `expect().*`, and `expect.*` methods at the same time. Previously, you had to define separate interfaces for each of them.
:::

::: warning
不要忘记在 `tsconfig.json` 中包含声明文件。
:::

断言的返回值应该兼容如下接口：

```ts
interface ExpectationResult {
  pass: boolean
  message: () => string
  // 如果你传了这些参数，它们将自动出现在 diff 信息中，
  // 所以即便断言不通过，你也不必自己输出 diff
  actual?: unknown
  expected?: unknown
}
```

::: warning
<<<<<<< HEAD
如果你创建了一个异步断言，记得在测试代码的结果前使用 `await` 关键字(`await expect('foo').toBeFoo()`)
=======
If you create an asynchronous matcher, don't forget to `await` the result (`await expect('foo').toBeFoo()`) in the test itself::

```ts
expect.extend({
  async toBeAsyncAssertion() {
    // ...
  }
})

await expect().toBeAsyncAssertion()
```
>>>>>>> d01fd81957cbffe9b0f97ed21e77073a22660d0c
:::

断言的第一个参数是接收值(即 `expect(received)` 中的 received )，其余参数将直接传给断言。

<<<<<<< HEAD
断言方法可以访问上下文 `this` 对象中的这些属性:
=======
Matcher function has access to `this` context with the following properties:
>>>>>>> d01fd81957cbffe9b0f97ed21e77073a22660d0c

### `isNot`

<<<<<<< HEAD
  如果断言是在 `not` 方法上调用的( `expect(received).not.toBeFoo()` )，则返回 true。
=======
Returns true, if matcher was called on `not` (`expect(received).not.toBeFoo()`).
>>>>>>> d01fd81957cbffe9b0f97ed21e77073a22660d0c

### `promise`

<<<<<<< HEAD
  如果断言是在 `resolved/rejected` 中调用的，它的值将包含此断言的名称。否则，它将是一个空字符串。
=======
If matcher was called on `resolved/rejected`, this value will contain the name of modifier. Otherwise, it will be an empty string.
>>>>>>> d01fd81957cbffe9b0f97ed21e77073a22660d0c

### `equals`

<<<<<<< HEAD
  这是一个工具函数，他可以帮助你比较两个值。如果是相同的则返回 true，反之返回 false。这个方法几乎在每个断言内部都有使用。默认情况下，它支持非对称的断言。
=======
This is a utility function that allows you to compare two values. It will return `true` if values are equal, `false` otherwise. This function is used internally for almost every matcher. It supports objects with asymmetric matchers by default.
>>>>>>> d01fd81957cbffe9b0f97ed21e77073a22660d0c

### `utils`

<<<<<<< HEAD
  它包含了一系列工具函数，你可以使用它们来显示信息。
=======
This contains a set of utility functions that you can use to display messages.
>>>>>>> d01fd81957cbffe9b0f97ed21e77073a22660d0c

`this` 上下文也包含了当前测试的信息，你可以通过调用 `expect.getState()` 来获取它，其中最有用的属性是：

### `currentTestName`

<<<<<<< HEAD
  当前测试的全称(包括 describe 块)。
=======
Full name of the current test (including describe block).
>>>>>>> d01fd81957cbffe9b0f97ed21e77073a22660d0c

### `testPath`

<<<<<<< HEAD
  当前测试的路径。
=======
Path to the current test.
>>>>>>> d01fd81957cbffe9b0f97ed21e77073a22660d0c
