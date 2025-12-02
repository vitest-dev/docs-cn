---
title: 扩展断言 | 指南
---

# 扩展断言 {#extending-matchers}

由于 Vitest 兼容 Chai 和 Jest，所以可以根据个人喜好使用 `chai.use` API 或者 `expect.extend`。

本文将以 `expect.extend` 为例探讨扩展断言。如果你对 Chai 的 API 更感兴趣，可以查看 [他们的指南](https://www.chaijs.com/guide/plugins/)。

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
从 Vitest 3.2 版本开始，你可以通过扩展 `Matchers` 接口，让 `expect.extend` 、`expect().*` 和 `expect.*` 方法同时具备类型安全的断言支持。而在此之前，你需要为这几种用法分别单独定义接口。
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
如果你实现了一个异步匹配器，记得在测试里对它的结果使用 `await` （例如：`await expect('foo').toBeFoo()` ），否则可能不会按预期执行：

```ts
expect.extend({
  async toBeAsyncAssertion() {
    // ...
  }
})

await expect().toBeAsyncAssertion()
```
:::

断言的第一个参数是接收值(即 `expect(received)` 中的 received )，其余参数将直接传给断言。

断言方法可以访问上下文 `this` 对象中的这些属性:

### `isNot`

如果断言是在 `not` 方法上调用的( `expect(received).not.toBeFoo()` )，则返回 true。

### `promise`

如果断言是在 `resolved/rejected` 中调用的，它的值将包含此断言的名称。否则，它将是一个空字符串。

### `equals`

这是一个工具函数，他可以帮助你比较两个值。如果是相同的则返回 true，反之返回 false。这个方法几乎在每个断言内部都有使用。默认情况下，它支持非对称的断言。

### `utils`

它包含了一系列工具函数，你可以使用它们来显示信息。

`this` 上下文也包含了当前测试的信息，你可以通过调用 `expect.getState()` 来获取它，其中最有用的属性是：

### `currentTestName`

当前测试的全称(包括 describe 块)。

### `testPath`

当前正在执行的测试文件路径。
