---
outline: deep
---

# 钩子 {#hooks}

这些函数允许你介入测试的生命周期，从而避免重复编写 setup 和 teardown 代码。它们作用于当前上下文：在顶层使用时作用于整个文件，在 `describe` 块内部使用时作用于当前测试套件。当 Vitest 作为 [类型检查器](/guide/testing-types) 运行时，这些钩子不会被调用。

测试钩子默认按栈顺序调用（"after" 钩子会逆序执行），但你可以通过 [`sequence.hooks`](/config/sequence#sequence-hooks) 选项进行配置。

## beforeEach

```ts
function beforeEach(
  body: (context: TestContext) => unknown,
  timeout?: number,
): void
```

注册一个回调函数，在当前测试套件中每个测试运行前调用。

如果该函数返回 Promise，Vitest 会等待 Promise 解决后再运行测试。

你可以选择传入超时时间（毫秒），用于指定终止前的最长等待时间。默认为 10 秒，可通过 [`hookTimeout`](/config/hooktimeout) 全局配置。

```ts
import { beforeEach } from 'vitest'

beforeEach(async () => {
  // 每次执行测试前，先重置所有 mock，然后准备好需要用到的测试数据
  await stopMocking()
  await addUser({ name: 'John' })
})
```

此处，`beforeEach` 确保每个测试都会添加用户。
<!-- TODO: translation -->
`beforeEach` can also return an optional cleanup function. It's similar to [`afterEach`](#aftereach). The only difference is that it's executed after all other `afterEach` hooks:

```ts
import { beforeEach } from 'vitest'

beforeEach(async () => {
  // 在每次测试运行前调用一次
  await prepareSomething()

  // 清理函数，在每次测试运行后调用一次，在 afterEach 钩子之后执行
  return async () => {
    await resetSomething()
  }
})
```

## afterEach

```ts
function afterEach(
  body: (context: TestContext) => unknown,
  timeout?: number,
): void
```

注册一个回调函数，在当前测试套件中每个测试完成后调用。
如果该函数返回 Promise，Vitest 会等待 Promise 解决后再继续。

你可以选择配置超时时间（单位毫秒），用于指定终止前的最长等待时间。默认为 10 秒，可通过 [`hookTimeout`](/config/hooktimeout) 全局配置。

```ts
import { afterEach } from 'vitest'

afterEach(async () => {
  await clearTestingData() // 在每次测试运行后清除测试数据
})
```

此处，`afterEach` 确保每次测试运行后清除测试数据。

::: tip
你也可以在测试执行期间使用 [`onTestFinished`](#ontestfinished)，在测试完成后清理状态。
:::

## beforeAll

```ts
function beforeAll(
  body: (context: ModuleContext) => unknown,
  timeout?: number,
): void
```

注册一个回调函数，在当前测试套件中所有测试开始运行前调用一次。
如果该函数返回 Promise，Vitest 会等待 Promise 解决后再运行测试。

你可以选择配置超时时间（单位毫秒），用于指定终止前的最长等待时间。默认为 10 秒，可通过 [`hookTimeout`](/config/hooktimeout) 全局配置。

```ts
import { beforeAll } from 'vitest'

beforeAll(async () => {
  await startMocking() // 在所有测试运行之前调用一次
})
```

 此处，`beforeAll` 确保在测试运行前完成模拟数据的初始化。

`beforeAll` 还可以返回一个可选的清理函数（等价于 [`afterAll`](#afterall)）。唯一区别在于该钩子会在所有其他 `afterAll` 钩子执行完毕后运行：

```ts
import { beforeAll } from 'vitest'

beforeAll(async () => {
  // 在所有测试运行之前调用一次
  await startMocking()

  // 清理函数，在所有测试运行结束后调用一次，在所有 afterAll 钩子之后执行
  return async () => {
    await stopMocking()
  }
})
```

## afterAll

```ts
function afterAll(
  body: (context: ModuleContext) => unknown,
  timeout?: number,
): void
```

注册一个回调函数，在当前测试套件中所有测试运行完毕后调用一次。
如果该函数返回 Promise，Vitest 会等待 Promise 解决后再继续。

你可以选择配置超时时间（毫秒），用于指定终止前的最长等待时间。默认为 10 秒，可通过 [`hookTimeout`](/config/hooktimeout) 全局配置。

```ts
import { afterAll } from 'vitest'

afterAll(async () => {
  await stopMocking() // 此方法在所有测试运行之后被调用
})
```

此处，`afterAll` 确保在所有测试运行后调用 `stopMocking` 方法。

## aroundEach

```ts
function aroundEach(
  body: (
    runTest: () => Promise<void>,
    context: TestContext,
  ) => Promise<void>,
  timeout?: number,
): void
```

注册一个回调函数，包裹当前测试套件中的每个测试。回调接收一个 `runTest` 函数，**必须** 调用它来运行测试。

`runTest()` 函数会依次执行 `beforeEach` 钩子、测试本身、测试中访问的 fixtures 以及 `afterEach` 钩子。在 `afterEach` 回调中访问的 fixtures 会在 `runTest()` 调用前初始化，并在 aroundEach 清理代码执行完毕后销毁，因此可以在 setup 和 teardown 阶段安全使用它们。

::: warning
**必须** 在回调中调用 `runTest()`。如果未调用 `runTest()`，测试将报错失败。
:::

你可以选择配置超时时间（单位毫秒），用于指定终止前的最长等待时间。该超时分别作用于 setup 阶段（`runTest()` 之前）和 teardown 阶段（`runTest()` 之后）。默认为 10 秒，可通过 [`hookTimeout`](/config/hooktimeout) 全局配置。

```ts
import { aroundEach, test } from 'vitest'

aroundEach(async (runTest) => {
  await db.transaction(runTest)
})

test('insert user', async () => {
  await db.insert({ name: 'Alice' })
  // 测试结束后事务自动回滚
})
```

::: tip 何时使用 `aroundEach`
当测试需要在某个 **上下文内部** 运行时，使用 `aroundEach`，例如：
- 将测试包裹在 [AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage) 上下文中
- 将测试包裹在追踪 span 中
- 数据库事务

如果只需要在测试前后执行代码，建议使用带清理返回函数的 [`beforeEach`](#beforeeach)。
```ts
beforeEach(async () => {
  await database.connect()
  return async () => {
    await database.disconnect()
  }
})
```
:::

### 多个钩子 {#multiple-hooks}

注册多个 `aroundEach` 钩子时，它们会相互嵌套。先注册的钩子是最外层的包裹：

```ts
aroundEach(async (runTest) => {
  console.log('outer before')
  await runTest()
  console.log('outer after')
})

aroundEach(async (runTest) => {
  console.log('inner before')
  await runTest()
  console.log('inner after')
})

// 输出顺序：
//  outer before
//    inner before
//      test
//    inner after
//  outer after
```

### 上下文与 Fixtures {#context-and-fixtures}

回调的第二个参数为测试上下文，因此可以在 `aroundEach` 中使用 fixtures：

```ts
import { aroundEach, test as base } from 'vitest'

const test = base.extend<{ db: Database; user: User }>({
  db: async ({}, use) => {
    // db 在 `aroundEach` 钩子之前创建
    const db = await createTestDatabase()
    await use(db)
    await db.close()
  },
  user: async ({ db }, use) => {
    // `user` 在事务内部运行
    // 因为它是在 `test` 内部访问的
    const user = await db.createUser()
    await use(user)
  },
})

// 注意：`aroundEach` 在 test 上也可用
// 以获得更好的 fixtures TypeScript 支持
test.aroundEach(async (runTest, { db }) => {
  await db.transaction(runTest)
})

test('insert user', async ({ db, user }) => {
  await db.insert(user)
})
```

## aroundAll

```ts
function aroundAll(
  body: (
    runSuite: () => Promise<void>,
    context: ModuleContext,
  ) => Promise<void>,
  timeout?: number,
): void
```

注册一个回调函数，包裹当前测试套件中的所有测试。回调接收一个 `runSuite` 函数，**必须** 调用它来运行测试套件。

`runSuite()` 函数会运行测试套件中的所有测试，包括 `beforeAll`/`afterAll`/`beforeEach`/`afterEach` `钩子、aroundEach` 钩子以及 fixtures。

::: warning
**必须** 在回调中调用 `runSuite()`。如果未调用 `runSuite()`，钩子将报错失败，测试套件中的所有测试都将被跳过。
:::

你可以选择配置超时时间（单位毫秒），用于指定终止前的最长等待时间。该超时分别作用于 setup 阶段（`runSuite()` 之前）和 teardown 阶段（`runSuite()` 之后）。默认为 10 秒，可通过 [`hookTimeout`](/config/hooktimeout) 全局配置。

```ts
import { aroundAll, test } from 'vitest'

aroundAll(async (runSuite) => {
  await tracer.trace('test-suite', runSuite)
})

test('test 1', () => {
  // 在追踪 span 内运行
})

test('test 2', () => {
  // 同样在同一个追踪 span 内运行
})
```

::: tip 何时使用 `aroundAll`
当整个测试套件需要在某个 **上下文内部** 运行时，使用 `aroundAll`，例如：
- 将整个测试套件包裹在 [AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage) 上下文中
- 将测试套件包裹在追踪 span 中
- 数据库事务

如果只需要在所有测试前后各执行一次代码，建议使用带清理返回函数的 [`beforeAll`](#beforeall)：
```ts
beforeAll(async () => {
  await server.start()
  return async () => {
    await server.stop()
  }
})
```
:::

### 多个钩子 {#multiple-hooks-1}

注册多个 `aroundAll` 钩子时，它们会相互嵌套。先注册的钩子是最外层的包裹：

```ts
aroundAll(async (runSuite) => {
  console.log('outer before')
  await runSuite()
  console.log('outer after')
})

aroundAll(async (runSuite) => {
  console.log('inner before')
  await runSuite()
  console.log('inner after')
})

// 输出顺序： outer before → inner before → tests → inner after → outer after
```

每个测试套件都有其独立的 `aroundAll` 钩子。父测试套件的 `aroundAll` 会包裹子测试套件的执行：

```ts
import { AsyncLocalStorage } from 'node:async_hooks'
import { aroundAll, describe, test } from 'vitest'

const context = new AsyncLocalStorage<{ suiteId: string }>()

aroundAll(async (runSuite) => {
  await context.run({ suiteId: 'root' }, runSuite)
})

test('root test', () => {
  // context.getStore() 返回 { suiteId: 'root' }
})

describe('nested', () => {
  aroundAll(async (runSuite) => {
    // 父测试套件的上下文在此可用
    await context.run({ suiteId: 'nested' }, runSuite)
  })

  test('nested test', () => {
    // context.getStore() 返回 { suiteId: 'nested' }
  })
})
```

## Test Hooks

Vitest 提供了一些可在 _测试执行期间_ 调用的钩子，用于在测试完成后清理状态。

::: warning
在测试体外调用这些钩子会报错。
:::

### onTestFinished {#ontestfinished}

该钩子在测试运行完毕后始终会被调用。它在 `afterEach` 钩子之后调用，因为 `afterEach` 可能影响测试结果。与  `beforeEach` 和 `afterEach` 一样，它接收一个 `TestContext` 对象。

```ts {1,5}
import { onTestFinished, test } from 'vitest'

test('performs a query', () => {
  const db = connectDb()
  onTestFinished(() => db.close())
  db.query('SELECT * FROM users')
})
```

::: warning
如果并发运行测试，应始终使用测试上下文中的 `onTestFinished` Vitest 不会在全局钩子中追踪并发测试：

```ts {3,5}
import { test } from 'vitest'

test.concurrent('performs a query', ({ onTestFinished }) => {
  const db = connectDb()
  onTestFinished(() => db.close())
  db.query('SELECT * FROM users')
})
```
:::

适用于该钩子封装可复用逻辑时：

```ts
// 可以放在单独的文件中
function getTestDb() {
  const db = connectMockedDb()
  onTestFinished(() => db.close())
  return db
}

test('performs a user query', async () => {
  const db = getTestDb()
  expect(
    await db.query('SELECT * from users').perform()
  ).toEqual([])
})

test('performs an organization query', async () => {
  const db = getTestDb()
  expect(
    await db.query('SELECT * from organizations').perform()
  ).toEqual([])
})
```

在每次测试后清理 spy 也是一个好习惯，以防它们泄漏到其他测试中。你可以通过全局启用 [`restoreMocks`](/config/restoremocks) 配置，或在 `onTestFinished` 中还原 spy（如果在测试最后还原，当某个断言失败时将不会执行还原——使用 `onTestFinished` 可确保代码始终运行）：

```ts
import { onTestFinished, test } from 'vitest'

test('performs a query', () => {
  const spy = vi.spyOn(db, 'query')
  onTestFinished(() => spy.mockClear())

  db.query('SELECT * FROM users')
  expect(spy).toHaveBeenCalled()
})
```

::: tip
该钩子始终按逆序调用，不受 [`sequence.hooks`](/config/sequence#sequence-hooks) 选项影响。
:::

### onTestFailed

该钩子仅在测试失败后调用。它在 `afterEach` 钩子之后调用，因为 `afterEach` 可能影响测试结果。与 `beforeEach` 和 `afterEach` 一样，它接收一个 `TestContext` 对象。适用于调试场景。

```ts {1,5-7}
import { onTestFailed, test } from 'vitest'

test('performs a query', () => {
  const db = connectDb()
  onTestFailed(({ task }) => {
    console.log(task.result.errors)
  })
  db.query('SELECT * FROM users')
})
```

::: warning
如果并发运行测试，应始终使用测试上下文中的 `onTestFailed`，因为 Vitest 不会在全局钩子中追踪并发测试：

```ts {3,5-7}
import { test } from 'vitest'

test.concurrent('performs a query', ({ onTestFailed }) => {
  const db = connectDb()
  onTestFailed(({ task }) => {
    console.log(task.result.errors)
  })
  db.query('SELECT * FROM users')
})
```
:::
