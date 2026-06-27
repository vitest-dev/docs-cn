---
title: 一个测试对应一个数据库事务 | 技巧
---

# 一个测试对应一个数据库事务 {#database-transaction-per-test}

涉及到真实数据库的集成测试需要从一个干净的状态开始。在每个测试前清空表数据很慢，因此常用的做法是将每个测试包装在一个事务中，并在测试完成时进行回滚。这样永远不会提交事务、也不需要每次都编写清理代码。

Vitest 通过 [`aroundEach`](/api/hooks#aroundeach) <Version>4.1.0</Version> 和 [scoped fixture](/guide/test-context#fixture-scopes) <Version>3.2.0</Version> 实现了这种形式。

## 示例 {#pattern}

```ts
import { test as baseTest } from 'vitest'
import { createTestDatabase } from './db.ts'

export const test = baseTest
  .extend('db', { scope: 'file' }, async ({}, { onCleanup }) => {
    const db = await createTestDatabase()
    onCleanup(() => db.close())
    return db
  })

test.aroundEach(async (runTest, { db }) => {
  await db.transaction(runTest)
})

test('insert user', async ({ db }) => {
  await db.insert({ name: 'Alice' })
  // 在测试结束时自动回滚
})
```

## 工作原理 {#how-it-works}

`db` fixture 通过 `scope: 'file'` 在每个文件级别创建一次，因此连接建立只发生一次，而不是在每个测试中重复进行，并且 `onCleanup` 会在文件测试执行完成时关闭连接。`aroundEach` 将每个测试包装在 `db.transaction(runTest)` 中，测试写入的所有内容在 `runTest`
解析时都会回滚。测试通过上下文使用相同的 `db` 实例，无需感知它正运行在事务中。

只要你的数据库驱动支持嵌套事务或保存点，这种形式就能正常工作，大多数现代数据库都满足这一条件。如果你想要在测试中传播租户或追踪 ID 等内容，也可以使用同一个 `aroundEach` 钩子来包装 [`AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage) 上下文，与事务一起使用。

## 一个工作进程一个连接 {#one-connection-per-worker}

如果测试套件有很多文件，在每个文件上建立新的数据库连接仍会增加开销。将 fixture 切换到 `scope: 'worker'` 并关闭隔离可以让多个文件在每个工作进程内共享一个连接：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    isolate: false,
  },
})
```

```ts
import { test as baseTest } from 'vitest'
import { createTestDatabase } from './db.ts'

export const test = baseTest
  .extend('db', { scope: 'worker' }, async ({}, { onCleanup }) => {
    const db = await createTestDatabase()
    onCleanup(() => db.close())
    return db
  })

test.aroundEach(async (runTest, { db }) => {
  await db.transaction(runTest)
})
```

默认情况下，每个测试文件在自己的工作进程中运行，因此 `scope: 'file'` 和 `scope: 'worker'` 行为相同。使用 `isolate: false` 时，Vitest 会在文件之间复用工作进程（数量上限由 [`maxWorkers`](/config/maxworkers) 限制），因此工作进程范围的 fixture 在每个工作进程中只创建一次，而不是在每个文件中都创建一次。对于 200 个文件、8 个工作进程的测试套件，只需 8 个连接，而非 200 个。

复用工作进程并不是零成本的优化。在禁用隔离后，文件在工作进程内共享模块实例，在修改模块顶层变量（计数器、缓存、猴子补丁（monkey-patched）的全局变量）的测试，可能会将状态泄漏到同一工作进程内后续运行的文件中。每次测试的回滚负责处理数据库中的数据隔离，但无法保护工作进程中的模块状态。在全局范围内关闭隔离之前，请参阅 [每个文件的隔离设置](/guide/recipes/disable-isolation) 技巧中的权衡。

[`vmThreads` 和 `vmForks`](/config/pool) 始终以隔离模式运行，无论 `isolate` 参数如何设置，在这些工作进程池中，工作进程范围的 fixture 会退化为每个文件创建一次的行为。

## 相关链接 {#see-also}

- [`aroundEach` 和 `aroundAll`](/api/hooks#aroundeach)
- [Fixture 作用域](/guide/test-context#fixture-scopes)
- [构建模式](/guide/test-context#builder-pattern)
