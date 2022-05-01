# 测试环境

受 [Playwright Fixtures](https://playwright.dev/docs/test-fixtures) 的启发，Vitest 的测试上下文允许你定义可在测试中使用的实用程序、状态和固定装置。

## 用法

第一个参数或每个测试回调是一个测试上下文。

```ts
import { it } from 'vitest'
it('should work', (ctx) => {
  // 打印测试名称
  console.log(ctx.meta.name)
})
```

## 内置测试上下文

#### `context.meta`

包含有关测试的元数据的只读对象。

#### `context.expect`

绑定到当前测试的 `expect` API。

## Extend Test Context

每个测试的上下文都不同。 你可以在 `beforeEach` 和 `afterEach` 挂钩中访问和扩展它们。

```ts
import { beforeEach, it } from 'vitest'
beforeEach(async (context) => {
  // 扩展上下文
  context.foo = 'bar'
})
it('should work', ({ foo }) => {
  console.log(foo) // 'bar'
})
```

### TypeScript

要为你的自定义上下文属性提供类型，你可以通过添加聚合类型 `TestContext`

```ts
declare module 'vitest' {
  export interface TestContext {
    foo?: string
  }
}
```
