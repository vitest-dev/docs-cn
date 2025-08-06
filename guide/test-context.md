---
title: 测试上下文 | 指南
outline: deep
---

# 测试上下文

受 [Playwright Fixtures](https://playwright.dev/docs/test-fixtures) 的启发，Vitest 的测试上下文允许你定义可在测试中使用的工具(utils)、状态(states)和固定装置(fixtures)。

## 用法

第一个参数或每个测试回调是一个测试上下文。

```ts
import { it } from 'vitest'

it('should work', ({ task }) => {
  // prints name of the test
  console.log(task.name)
})
```

## 内置测试上下文

#### `task`

包含关于测试的元数据的只读对象。

#### `expect`

绑定到当前测试的 `expect` API:

```ts
import { it } from 'vitest'

it('math is easy', ({ expect }) => {
  expect(2 + 2).toBe(4)
})
```

此 API 对于同时运行快照测试非常有用，因为全局 Expect 无法跟踪它们:

```ts
import { it } from 'vitest'

it.concurrent('math is easy', ({ expect }) => {
  expect(2 + 2).toMatchInlineSnapshot()
})

it.concurrent('math is hard', ({ expect }) => {
  expect(2 * 2).toMatchInlineSnapshot()
})
```

#### `skip`

```ts
function skip(note?: string): never
function skip(condition: boolean, note?: string): void
```

跳过后续测试执行并将测试标记为已跳过：

```ts
import { expect, it } from 'vitest'

it('math is hard', ({ skip }) => {
  skip()
  expect(2 + 2).toBe(5)
})
```

从 Vitest 3.1 版本开始，你可以通过传入一个布尔值参数来按条件跳过某个测试：

```ts
it('math is hard', ({ skip, mind }) => {
  skip(mind === 'foggy')
  expect(2 + 2).toBe(5)
})
```

#### `annotate` <Version>3.2.0</Version> {#annotate}

```ts
function annotate(
  message: string,
  attachment?: TestAttachment,
): Promise<TestAnnotation>

function annotate(
  message: string,
  type?: string,
  attachment?: TestAttachment,
): Promise<TestAnnotation>
```

添加一个 [测试标注](/guide/test-annotations) ，该标注会在 [报告器](/config/#reporter) 输出中展示。

```ts
test('annotations API', async ({ annotate }) => {
  await annotate('https://github.com/vitest-dev/vitest/pull/7953', 'issues')
})
```

#### `signal` <Version>3.2.0</Version> {#signal}

一个由 Vitest 控制的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) ，在以下场景下会被触发中止：

- 测试用例超时
- 用户使用 Ctrl+C 手动终止了测试
- 代码中调用了 [`vitest.cancelCurrentRun`](/advanced/api/vitest#cancelcurrentrun) 方法
- 当并行测试中的其他用例失败，并且启用了 [`bail`](/config/#bail) 参数时

```ts
it('stop request when test times out', async ({ signal }) => {
  await fetch('/resource', { signal })
}, 2000)
```

#### `onTestFailed`

[`onTestFailed`](/api/#ontestfailed) 与当前测试用例绑定。当你并发执行多个测试并希望只对某个具体测试进行特殊处理时，这个 API 会非常有用。

#### `onTestFinished`

[`onTestFinished`](/api/#ontestfailed) 与当前测试用例绑定。当你并发执行多个测试并希望只对某个特定测试进行特殊处理时，这个 API 会非常有帮助。

## 扩展测试上下文

Vitest 提供了两种不同的方式来帮助你扩展测试上下文。

### `test.extend`

与 [Playwright](https://playwright.dev/docs/api/class-test#test-extend) 一样，你可以使用此方法通过自定义装置定义你自己的 `test` API，并在任何地方重复使用它。

比如说，我们先创建一个包含 `todos` 和 `archive` 两个夹具的 `test` 收集器。

```ts [my-test.ts]
import { test as baseTest } from 'vitest'

const todos = []
const archive = []

export const test = baseTest.extend({
  todos: async ({}, use) => {
    // 在每次测试函数运行之前设置固定装置
    todos.push(1, 2, 3)

    // 使用固定装置的值
    await use(todos)

    // 在每次测试函数运行之后清除固定装置
    todos.length = 0
  },
  archive,
})
```

然后我们就可以导入使用了。

```ts [my-test.test.ts]
import { expect } from 'vitest'
import { test } from './my-test.js'

test('add items to todos', ({ todos }) => {
  expect(todos.length).toBe(3)

  todos.push(4)
  expect(todos.length).toBe(4)
})

test('move items from todos to archive', ({ todos, archive }) => {
  expect(todos.length).toBe(3)
  expect(archive.length).toBe(0)

  archive.push(todos.pop())
  expect(todos.length).toBe(2)
  expect(archive.length).toBe(1)
})
```

我们还可以通过对 `test` 进行扩展来新增夹具或覆盖已有的夹具配置。

```ts
import { test as todosTest } from './my-test.js'

export const test = todosTest.extend({
  settings: {
    // ...
  },
})
```

#### 固定装置初始化

Vitest 运行器将智能地初始化你的固定装置并根据使用情况将它们注入到测试上下文中。

```ts
import { test as baseTest } from 'vitest'

const test = baseTest.extend<{
  todos: number[]
  archive: number[]
}>({
  todos: async ({ task }, use) => {
    await use([1, 2, 3])
  },
  archive: []
})

// todos will not run
test('skip', () => {})
test('skip', ({ archive }) => {})

// todos will run
test('run', ({ todos }) => {})
```

::: warning
在固定装置中使用 `test.extend()` 时，需要始终使用对象解构模式 `{ todos }` 来访问固定装置函数和测试函数中的上下文。

```ts
test('context must be destructured', (context) => { // [!code --]
  expect(context.todos.length).toBe(2)
})

test('context must be destructured', ({ todos }) => { // [!code ++]
  expect(todos.length).toBe(2)
})
```

:::

#### 自动化装置

Vitest 还支持 fixture 的元组语法，允许你传递每个 fixture 的选项。例如，你可以使用它来显式初始化固定装置，即使它没有在测试中使用。

```ts
import { test as base } from 'vitest'

const test = base.extend({
  fixture: [
    async ({}, use) => {
      // this function will run
      setup()
      await use()
      teardown()
    },
    { auto: true }, // Mark as an automatic fixture
  ],
})

test('works correctly')
```

#### Default fixture

Since Vitest 3, you can provide different values in different [projects](/guide/projects). To enable this feature, pass down `{ injected: true }` to the options. If the key is not specified in the [project configuration](/config/#provide), then the default value will be used.

:::code-group
```ts [fixtures.test.ts]
import { test as base } from 'vitest'

const test = base.extend({
  url: [
    // default value if "url" is not defined in the config
    '/default',
    // mark the fixture as "injected" to allow the override
    { injected: true },
  ],
})

test('works correctly', ({ url }) => {
  // url is "/default" in "project-new"
  // url is "/full" in "project-full"
  // url is "/empty" in "project-empty"
})
```
```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'project-new',
        },
      },
      {
        test: {
          name: 'project-full',
          provide: {
            url: '/full',
          },
        },
      },
      {
        test: {
          name: 'project-empty',
          provide: {
            url: '/empty',
          },
        },
      },
    ],
  },
})
```
:::

#### Scoping Values to Suite <Version>3.1.0</Version> {#scoping-values-to-suite}

Since Vitest 3.1, you can override context values per suite and its children by using the `test.scoped` API:

```ts
import { test as baseTest, describe, expect } from 'vitest'

const test = baseTest.extend({
  dependency: 'default',
  dependant: ({ dependency }, use) => use({ dependency })
})

describe('use scoped values', () => {
  test.scoped({ dependency: 'new' })

  test('uses scoped value', ({ dependant }) => {
    // `dependant` uses the new overridden value that is scoped
    // to all tests in this suite
    expect(dependant).toEqual({ dependency: 'new' })
  })

  describe('keeps using scoped value', () => {
    test('uses scoped value', ({ dependant }) => {
      // nested suite inherited the value
      expect(dependant).toEqual({ dependency: 'new' })
    })
  })
})

test('keep using the default values', ({ dependant }) => {
  // the `dependency` is using the default
  // value outside of the suite with .scoped
  expect(dependant).toEqual({ dependency: 'default' })
})
```

This API is particularly useful if you have a context value that relies on a dynamic variable like a database connection:

```ts
const test = baseTest.extend<{
  db: Database
  schema: string
}>({
  db: async ({ schema }, use) => {
    const db = await createDb({ schema })
    await use(db)
    await cleanup(db)
  },
  schema: '',
})

describe('one type of schema', () => {
  test.scoped({ schema: 'schema-1' })

  // ... tests
})

describe('another type of schema', () => {
  test.scoped({ schema: 'schema-2' })

  // ... tests
})
```

#### Per-Scope Context <Version>3.2.0</Version>

You can define context that will be initiated once per file or a worker. It is initiated the same way as a regular fixture with an objects parameter:

```ts
import { test as baseTest } from 'vitest'

export const test = baseTest.extend({
  perFile: [
    ({}, { use }) => use([]),
    { scope: 'file' },
  ],
  perWorker: [
    ({}, { use }) => use([]),
    { scope: 'worker' },
  ],
})
```

The value is initialised the first time any test has accessed it, unless the fixture options have `auto: true` - in this case the value is initialised before any test has run.

```ts
const test = baseTest.extend({
  perFile: [
    ({}, { use }) => use([]),
    {
      scope: 'file',
      // always run this hook before any test
      auto: true
    },
  ],
})
```

The `worker` scope will run the fixture once per worker. The number of running workers depends on various factors. By default, every file runs in a separate worker, so `file` and `worker` scopes work the same way.

However, if you disable [isolation](/config/#isolate), then the number of workers is limited by the [`maxWorkers`](/config/#maxworkers) or [`poolOptions`](/config/#pooloptions) configuration.

Note that specifying `scope: 'worker'` when running tests in `vmThreads` or `vmForks` will work the same way as `scope: 'file'`. This limitation exists because every test file has its own VM context, so if Vitest were to initiate it once, one context could leak to another and create many reference inconsistencies (instances of the same class would reference different constructors, for example).

#### TypeScript

要为所有自定义上下文提供固定装置类型，你可以将固定装置类型作为泛型(generic)传递。

```ts
interface MyFixtures {
  todos: number[]
  archive: number[]
}

const test = baseTest.extend<MyFixtures>({
  todos: [],
  archive: [],
})

test('types are defined correctly', ({ todos, archive }) => {
  expectTypeOf(todos).toEqualTypeOf<number[]>()
  expectTypeOf(archive).toEqualTypeOf<number[]>()
})
```

::: info Type Inferring
Note that Vitest doesn't support infering the types when the `use` function is called. It is always preferable to pass down the whole context type as the generic type when `test.extend` is called:

```ts
import { test as baseTest } from 'vitest'

const test = baseTest.extend<{
  todos: number[]
  schema: string
}>({
  todos: ({ schema }, use) => use([]),
  schema: 'test'
})

test('types are correct', ({
  todos, // number[]
  schema, // string
}) => {
  // ...
})
```
:::

### `beforeEach` and `afterEach`

::: danger Deprecated
这种扩展上下文的方法已不再推荐使用，并且在你使用 `test.extend` 扩展 `test` 时，它将无法生效。
:::

每个测试用例都有独立的上下文，你可以在 `beforeEach` 和 `afterEach` 钩子里对其进行访问或扩展。

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

#### TypeScript

如果你想为自定义的上下文属性提供类型支持，可以通过扩展 `TestContext` 类型来实现：

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
  // 上下文的类型是 'TestContext & LocalTestContext'
  context.foo = 'bar'
})

it<LocalTestContext>('should work', ({ foo }) => {
  // foo 的类型是 'string'
  console.log(foo) // 'bar'
})
```
