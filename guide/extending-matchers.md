# Extending Matchers
# 扩展匹配器


Since Vitest is compatible with both Chai and Jest, you can use either `chai.use` API or `expect.extend`, whichever you prefer.
由于Vitest兼容Chai和Jest，所以可以根据个人喜好使用`chai.use`或者`expect.extend`API。

This guide will explore extending matchers with `expect.extend`. If you are interested in Chai API, check [their guide](https://www.chaijs.com/guide/plugins/).

本文将以`expect.extend`为例探讨扩展匹配器。如果你对Chai的API更感兴趣，可以查看[此文](https://www.chaijs.com/guide/plugins/)

To extend default matchers, call `expect.extend` with an object containing your matchers.
为了扩展默认的匹配器，可以用对象包裹匹配器的形式调用`expect.extend`方法。

```ts
expect.extend({
  toBeFoo(received, expected) {
    const { isNot } = this
    return {
      // do not alter your "pass" based on isNot. Vitest does it for you
      // 请勿根据isNot参数更改你的"pass"值，Vitest为你做了这件事情
      pass: received === 'foo',
      message: () => `${received} is${isNot ? ' not' : ''} foo`,
    }
  },
})
```

The return value of a matcher should be compatible with the following interface:
匹配器的返回值应该兼容如下接口：
```ts
interface MatcherResult {
  pass: boolean
  message: () => string
  // If you pass these, they will automatically appear inside a diff,
  // 如果你传了这些参数，它们将自动出现在diff信息中
  // if the matcher will not pass, so you don't need to print diff yourself
  // 如果匹配器不通过，你不必自己输出diff
  actual?: unknown
  expected?: unknown
}
```

::: warning
If you create an asynchronous matcher, don't forget to `await` the result (`await expect('foo').toBeFoo()`) in the test itself.
如果你创建了一个异步匹配器，记得在测试结果前使用`await`(`await expect('foo').toBeFoo()`)
:::

The first argument inside a matchers function is received value (the one inside `expect(received)`). The rest are arguments passed directly to the matcher.
匹配器的第一个参数是接收值(即expect(received)中的值)，其余参数将直接传给匹配器。

Matcher function have access to `this` context with the following properties:
匹配器方法有可以访问上下文`this`对象

- `isNot`

  Returns true, if matcher was called on `not` (`expect(received).not.toBeFoo()`).
  如果匹配器是在`not`方法上调用的，则返回true。

- `promise`

  If matcher was called on `resolved/rejected`, this value will contain the name of modifier. Otherwise, it will be an empty string.
  如果匹配器是在`resolved/rejected`中调用的，它的值将包含此匹配器的名称。否则，它将是一个空字符串。

- `equals`

  This is utility function that allows you to compare two values. It will return `true` if values are equal, `false` otherwise. This function is used internally for almost every matcher.
  It supports objects with asymmetric matchers by default.
  这是一个工具函数，他可以帮助你比较两个值。如果是相同的则返回true，反之返回false。这个方法几乎在每个匹配器内部都有使用。

- `utils`

  This contains a set of utility functions that you can use to display messages.
  它包含了一系列工具函数，你可以使用它们来显示信息。

`this` context also contains information about the current test. You can also get it by calling `expect.getState()`. The most useful properties are:
`this`上下文也好汉了当前测试的信息，你可以通过调用`expect.getState()`来获取它，其中最有用的属性是：
- `currentTestName`

  Full name of the current test (including describe block).
  当前测试的全称(包括describe块)。

- `testPath`

  Path to the current test.
  当前测试的路径。
