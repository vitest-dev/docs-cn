---
title: Test Context | Guide
---

# 测试上下文

受 [Playwright Fixtures](https://playwright.dev/docs/test-fixtures) 的启发，Vitest 的测试上下文允许你定义可在测试中使用的工具(utils)、状态(states)和固定装置(fixtures)。

## 用法

第一个参数或每个测试回调是一个测试上下文。

```ts
import { it } from 'vitest'

it('should work', (ctx) => {
  // prints name of the test
  console.log(ctx.task.name)
})
```

## 内置测试上下文

#### `context.task`

包含关于测试的元数据的只读对象。

#### `context.expect`

绑定到当前测试的 `expect` API。

## 扩展测试上下文

Vitest 提供了两种不同的方式来帮助你扩展测试上下文。

### `test.extend`

<<<<<<< HEAD
与 [Playwright](https://playwright.dev/docs/api/class-test#test-extend) 一样，你可以使用此方法通过自定义装置定义你自己的 `test` API，并在任何地方重复使用它。
=======
::: warning
This API is available since Vitest 0.32.3.
:::

Like [Playwright](https://playwright.dev/docs/api/class-test#test-extend), you can use this method to define your own `test` API with custom fixtures and reuse it anywhere.
>>>>>>> 7eecb19a916567fca8b0e8238569c73d2e094437

例如，我们首先使用两个固定装置创建 `myTest`，`todos` 和 `archive`。

```ts
// my-test.ts
import { test } from 'vitest'

const todos = []
const archive = []

export const myTest = test.extend({
  todos: async (use) => {
    // setup the fixture before each test function
    todos.push(1, 2, 3)

    // use the fixture value
    await use(todos)

    // cleanup the fixture after each test function
    todos.length = 0
  },
  archive
})
```

然后我们就可以导入使用了。

```ts
import { expect } from 'vitest'
import { myTest } from './my-test.ts'

myTest('add items to todos', ({ todos }) => {
  expect(todos.length).toBe(3)

  todos.add(4)
  expect(todos.length).toBe(4)
})

myTest('move items from todos to archive', ({ todos, archive }) => {
  expect(todos.length).toBe(3)
  expect(archive.length).toBe(0)

  archive.push(todos.pop())
  expect(todos.length).toBe(2)
  expect(archive.length).toBe(1)
})
```

我们还可以通过扩展 `myTest` 添加更多的固定装置或覆盖现有的固定装置。

```ts
export const myTest2 = myTest.extend({
  settings: {
    // ...
  }
})
```

#### 固定装置初始化

Vitest 运行器将智能地初始化你的 fixtures 并根据使用情况将它们注入到测试上下文中。

```ts
import { test } from 'vitest'

async function todosFn(use) {
  await use([1, 2, 3])
}

const myTest = test.extend({
  todos: todosFn,
  archive: []
})

// todosFn will not run
myTest('', () => {}) // no fixture is available
myTets('', ({ archive }) => {}) // only archive is available

// todosFn will run
myTest('', ({ todos }) => {}) // only todos is available
myTest('', (context) => {}) // both are available
myTest('', ({ archive, ...rest }) => {}) // both are available
```

#### TypeScript

要为所有自定义上下文提供固定装置类型，你可以将固定装置类型作为泛型(generic)传递。

```ts
interface MyFixtures {
  todos: number[]
  archive: number[]
}

const myTest = test.extend<MyFixtures>({
  todos: [],
  archive: []
})

myTest('', (context) => {
  expectTypeOf(context.todos).toEqualTypeOf<number[]>()
  expectTypeOf(context.archive).toEqualTypeOf<number[]>()
})
```

### `beforeEach` and `afterEach`

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

#### TypeScript

你可以通过添加聚合(aggregate)类型 `TestContext`, 为你的自定义上下文属性提供类型支持。

```ts
declare module 'vitest' {
  export interface TestContext {
    foo?: string
  }
}
```

如果你只想为特定的 `beforeEach`、`afterEach`、`it` 或 `test` hooks 提供属性类型，则可以将类型作为泛型(generic)传递。

```ts
interface LocalTestContext {
  foo: string
}

beforeEach<LocalTestContext>(async (context) => {
  // typeof context is 'TestContext & LocalTestContext'
  context.foo = 'bar'
})

it<LocalTestContext>('should work', ({ foo }) => {
  // typeof foo is 'string'
  console.log(foo) // 'bar'
})
```
