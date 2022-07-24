---
title: Test Context | Guide
---

# 测试上下文

受 [Playwright Fixtures](https://playwright.dev/docs/test-fixtures) 的启发，Vitest 的测试上下文允许你定义可在测试中使用的工具(utils)、状态(states)和固定装置(fixtures)。

## 用法

<<<<<<< HEAD
第一个参数或每个测试回调是一个测试上下文。
=======
The first argument for each test callback is a test context.
>>>>>>> 975ec8dca5830d886aa6968a0854a831805baa06

```ts
import { it } from 'vitest'

it('should work', (ctx) => {
  // prints name of the test
  console.log(ctx.meta.name)
})
```

## 内置测试上下文

#### `context.meta`

包含关于测试的元数据的只读对象。

#### `context.expect`

<<<<<<< HEAD
绑定到当前测试的 `expect` API。
=======
The `expect` API bound to the current test.
>>>>>>> 975ec8dca5830d886aa6968a0854a831805baa06

## 扩展测试上下文

每个测试的上下文都不同。 你可以在 `beforeEach` 和 `afterEach` hooks 中访问和扩展它们。

```ts
import { beforeEach, it } from 'vitest'

beforeEach(async (context) => {
  // extend context
  context.foo = 'bar'
})

it('should work', ({ foo }) => {
  console.log(foo) // 'bar'
})
```

### TypeScript

<<<<<<< HEAD
你可以通过添加聚合(aggregate)类型 `TestContext`, 为你的自定义上下文属性提供类型。
=======
To provide types for your custom context properties, you can aggregate the `TestContext` type by adding
>>>>>>> 975ec8dca5830d886aa6968a0854a831805baa06

```ts
declare module 'vitest' {
  export interface TestContext {
    foo?: string
  }
}
```

