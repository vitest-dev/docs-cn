# 扩展断言(Matchers)

因为 Vitest 与 Chai 和 Jest 兼容，你可以使用 `chai.use` API 或 `expect.extend`，随你喜爱。

本指南将探讨 `expect.extend` 扩展断言。如果你对 Chai API 感兴趣，查看 [their guide](https://www.chaijs.com/guide/plugins/)。

要扩展默认断言，调用 `expect.extend` 并传入包含你的断言的对象。

```ts
expect.extend({
  toBeFoo(received, expected) {
    const { isNot } = this
    return {
      // 不要根据 isNot 更改你的 "pass"，Vitest 会帮你处理
      pass: received === 'foo',
      message: () => `${received} is${isNot ? ' not' : ''} foo`
    }
  }
})
```

匹配器的返回值应与以下接口兼容：

```ts
interface MatcherResult {
  pass: boolean
  message: () => string
  // 如果你通过这些，它们将自动出现在一个 diff 中，
  // 如果断言无法通过，那么你不需要自己打印 diff
  actual?: unknown
  expected?: unknown
}
```

::: warning
如果你创建了一个异步断言，在测试中不要忘记 `await` 结果（`await expect('foo').toBeFoo()`）。
:::

断言函数的第一个参数是公认的值（`expect(received)` 括号内的），其余的是直接传递给断言的参数。

断言函数可以访问 `this` 上下文的以下属性：

- `isNot`

  如果断言调用后为 `not`，则返回 true (`expect(received).not.toBeFoo()`).

- `promise`

  如果断言调用 `resolved/rejected`，参数要包含修改器名称(name of modifier)。否则，它将是一个空字符串。

- `equals`

  这是一个实用的功能，允许你比较两个值。如果值相等，返回 `true`，否则返回 `false`。几乎每个断言都在内部使用此函数。
  默认情况下，它支持非对称的断言。

- `utils`

  它包含一组实用程序函数，你可以用其显示消息。

`this` 上下文还包含有关当前测试的信息。你可以通过调用 `expect.getState()` 获取。信息中比较有用的有:

- `currentTestName`

  当前测试的全称（包括描述块(describe block)）。

- `testPath`

  当前测试的路径。
