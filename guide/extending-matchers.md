---
title: 扩展断言 | 指南
---

# 扩展断言 {#extending-matchers}

由于 Vitest 兼容 Chai 和 Jest，所以可以根据个人喜好使用 [`chai.use`](https://www.chaijs.com/guide/plugins/) API 或者 `expect.extend`。

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

如果你使用 TypeScript，你可以使用以下代码在环境声明文件（例如：`vitest.d.ts`）中扩展默认的 `Matchers` 接口：

```ts
import 'vitest'

declare module 'vitest' {
  interface Matchers<T = any> {
    toBeFoo: () => R
  }
}
```

::: tip
导入 `vitest` 会使 TypeScript 将其视为 ES 模块文件，若无此声明则类型检查将无法生效。
:::

扩展 `Matchers` 接口，让 `expect.extend`、`expect().*` 和 `expect.*` 方法同时具备类型安全的断言支持。

::: warning
不要忘记在 `tsconfig.json` 中包含声明文件。
:::

断言的返回值应该兼容如下接口：

```ts
interface MatcherResult {
  pass: boolean
  message: () => string
  // 如果你传了这些参数，它们将自动出现在 diff 信息中，
  // 所以即便断言不通过，你也不必自己输出 diff
  actual?: unknown
  expected?: unknown
}
```

::: warning
如果你实现了一个异步匹配器，记得在测试里对它的结果使用 `await`（例如：`await expect('foo').toBeFoo()`），否则可能不会按预期执行：

```ts
expect.extend({
  async toBeAsyncAssertion() {
    // ...
  }
})

await expect().toBeAsyncAssertion()
```

:::

断言的第一个参数是接收值(即 `expect(received)` 中的 received )，其余参数将直接传给断言。其余参数将直接传递给匹配器。自 4.1 起，Vitest 提供了多个类型供自定义匹配器使用：

```ts
import type {
  // 函数类型
  Matcher,
  // 返回值
  MatcherResult,
  // 通过 `this` 访问的状态
  MatcherState,
} from 'vitest'
import { expect } from 'vitest'

// 使用 "function" 关键字定义以访问 "this" 的简单匹配器
const customMatcher: Matcher = function (received) {
  // ...
}

// 带参数的匹配器
const customMatcher: Matcher<MatcherState, [arg1: unknown, arg2: unknown]> = function (received, arg1, arg2) {
  // ...
}

// 带自定义注解的匹配器
function customMatcher(this: MatcherState, received: unknown, arg1: unknown, arg2: unknown): MatcherResult {
  // ...
  return {
    pass: false,
    message: () => 'something went wrong!',
  }
}

expect.extend({ customMatcher })
```

::: tip
要构建自定义的 **快照匹配器**（`toMatchSnapshot()`/`toMatchInlineSnapshot()`/`toMatchFileSnapshot()` 的包装器），请使用从 `vitest` 导出的 `Snapshots`。请参阅 [自定义快照匹配器](/guide/snapshot#custom-snapshot-matchers)。
:::

断言方法可以访问上下文 `this` 对象中的这些属性:

## `isNot`

如果断言是在 `not` 方法上调用的(`expect(received).not.toBeFoo()`)，则返回 true。你无需手动处理该逻辑，Vitest 会自动反转 `pass` 的值。

## `promise`

如果断言是在 `resolved/rejected` 中调用的，它的值将包含此断言的名称。否则，它将是一个空字符串。

## `equals`

这是一个工具函数，他可以帮助你比较两个值。如果是相同的则返回 true，反之返回 false。这个方法几乎在每个断言内部都有使用。默认情况下，它支持非对称的断言。

## `utils`

它包含了一系列工具函数，你可以使用它们来显示信息。

`this` 上下文也包含了当前测试的信息，你可以通过调用 `expect.getState()` 来获取它，其中最有用的属性是：

## `currentTestName`

当前测试的全称(包括 describe 块)。

## `task` <Advanced /> <Version>4.1.0</Version> {#task}

包含对 [测试运行器任务](/api/advanced/runner#tasks) 的引用（如果可用）。

::: warning
当在并发测试中使用全局 `expect` 时，`this.task` 为 `undefined`。请改用 `context.expect` 以确保 `task` 在自定义匹配器中可用。
:::

## `testPath`

当前正在执行的测试文件路径。

## `environment`

当前 [`environment`](/config/environment) 的名称（例如 `jsdom`）。

## `soft`

断言是否以 [`soft`](/api/expect#soft) 方式调用。你无需手动处理该逻辑，Vitest 始终会捕获错误。

## `assertion` <Advanced /> <Version type="experimental">4.1.4</Version> {#assertion}

底层 [Chai 断言](https://www.chaijs.com/guide/plugins/) 对象。这是与 Chai 插件接收的同一个实例，使你能够访问 Chai 的参数系统和可链式方法。适用于需要与 Chai 内部交互的自定义匹配器。

::: tip
以上并非全部可用属性，仅列出最实用的部分。其他状态值由 Vitest 内部使用。
:::
