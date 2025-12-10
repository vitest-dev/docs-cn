---
title: 测试上下文 | 指南
outline: deep
---

# 测试上下文 {#test-context}

受 [Playwright Fixtures](https://playwright.dev/docs/test-fixtures) 的启发，Vitest 的测试上下文允许你定义可在测试中使用的工具(utils)、状态(states)和固定装置(fixtures)。

## 用法 {#usage}

第一个参数或每个测试回调是一个测试上下文。

```ts
import { it } from 'vitest'

it('should work', ({ task }) => {
  // 打印测试的名称
  console.log(task.name)
})
```

## 内置测试上下文 {#built-in-test-context}

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

添加一个[测试注解](/guide/test-annotations)，它将由你的[报告器](/config/#reporters)显示。

```ts
test('annotations API', async ({ annotate }) => {
  await annotate('https://github.com/vitest-dev/vitest/pull/7953', 'issues')
})
```

#### `signal` <Version>3.2.0</Version> {#signal}

一个由 Vitest 控制的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) ，在以下场景下会被触发中止：

- 测试用例超时
- 用户使用 Ctrl+C 手动终止了测试
- 代码中调用了 [`vitest.cancelCurrentRun`](/api/advanced/vitest#cancelcurrentrun) 方法
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

## 扩展测试上下文 {#extend-test-context}

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
#### 初始化固定装置 {#fixture-initialization}

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

// todos 不会运行
test('skip', () => {})
test('skip', ({ archive }) => {})

// todos 将会运行
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

#### 自动化装置 {#automatic-fixture}

Vitest 还支持 fixture 的元组语法，允许你传递每个 fixture 的选项。例如，你可以使用它来显式初始化固定装置，即使它没有在测试中使用。

```ts
import { test as base } from 'vitest'

const test = base.extend({
  fixture: [
    async ({}, use) => {
      // 这个函数将会运行
      setup()
      await use()
      teardown()
    },
    { auto: true }, // 标记为自动装置
  ],
})

test('works correctly')
```

#### 默认的装置 {#default-fixture}

从 Vitest 3 开始，你可以在不同的 [项目](/guide/projects) 中提供不同的值。要启用此功能，请在选项中传递 `{ injected: true }`。如果在 [项目配置](/config/#provide) 中未指定该键，则将使用默认值。

:::code-group
```ts [fixtures.test.ts]
import { test as base } from 'vitest'

const test = base.extend({
  url: [
    // 如果配置中未定义"url"，则为默认值
    '/default',
    // 将夹具标记为"注入"以允许覆盖
    { injected: true },
  ],
})

test('works correctly', ({ url }) => {
  // 在"project-new"中，url是"/default"
  // 在"project-full"中，url是"/full"
  // 在"project-empty"中，url是"/empty"
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

#### 将值限定到套件范围 <Version>3.1.0</Version> {#scoping-values-to-suite}

从 Vitest 3.1 开始，你可以使用 `test.scoped` API 来按套件及其子项覆盖上下文值：

```ts
import { test as baseTest, describe, expect } from 'vitest'

const test = baseTest.extend({
  dependency: 'default',
  dependant: ({ dependency }, use) => use({ dependency })
})

describe('use scoped values', () => {
  test.scoped({ dependency: 'new' })

  test('uses scoped value', ({ dependant }) => {
    // `dependant` 使用了新的被覆盖的值，该值是限定范围的
    // 到此套件中的所有测试
    expect(dependant).toEqual({ dependency: 'new' })
  })

  describe('keeps using scoped value', () => {
    test('uses scoped value', ({ dependant }) => {
      // 嵌套套件继承了该值
      expect(dependant).toEqual({ dependency: 'new' })
    })
  })
})

test('keep using the default values', ({ dependant }) => {
  // `dependency` 使用的是默认值
  // 在使用 `.scoped` 的套件外部的值
  expect(dependant).toEqual({ dependency: 'default' })
})
```

如果你有一个依赖于动态变量（如数据库连接）的上下文值，这个 API 特别有用：

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

#### 作用域上下文 <Version>3.2.0</Version> {#per-scope-context-3-2-0}

你可以定义每个文件或每个工作线程只初始化一次的上下文。它的初始化方式与带对象参数的常规夹具相同：

```ts
import { test as baseTest } from 'vitest'

export const test = baseTest.extend({
  perFile: [
    ({}, use) => use([]),
    { scope: 'file' },
  ],
  perWorker: [
    ({}, use) => use([]),
    { scope: 'worker' },
  ],
})
```

该值在任何测试第一次访问它时初始化，除非夹具选项设置了 `auto: true`， 在这种情况下，该值在任何测试运行之前就已初始化。

```ts
const test = baseTest.extend({
  perFile: [
    ({}, use) => use([]),
    {
      scope: 'file',
      // 在任何测试之前总是运行这个钩子
      auto: true
    },
  ],
})
```

`worker` 作用域将为每个工作线程运行一次夹具。运行的工作线程数量取决于各种因素。默认情况下，每个文件在单独的工作线程中运行，因此 `file` 和 `worker` 作用域的工作方式相同。

<!-- TODO: translation -->
However, if you disable [isolation](/config/#isolate), then the number of workers is limited by the [`maxWorkers`](/config/#maxworkers) configuration.

请注意，在 `vmThreads` 或 `vmForks` 中运行测试时，指定 `scope: 'worker'` 的工作方式与 `scope: 'file'` 相同。这个限制存在是因为每个测试文件都有自己的 VM 上下文，所以如果 Vitest 只初始化一次，一个上下文可能会泄漏到另一个上下文中，并创建许多引用不一致的问题（例如，同一个类的实例会引用不同的构造函数）。

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
请注意，Vitest 不支持在调用 `use` 函数时推断类型。在调用 `test.extend` 时，最好将整个上下文类型作为泛型类型传递：

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

当使用 `test.extend` 时，扩展的 `test` 对象提供了类型安全的 `beforeEach` 和 `afterEach` 钩子，这些钩子能够识别新的上下文：

```ts
const test = baseTest.extend<{
  todos: number[]
}>({
  todos: async ({}, use) => {
    await use([])
  },
})

// 与全局钩子不同，这些钩子能够识别扩展的上下文
test.beforeEach(({ todos }) => {
  todos.push(1)
})

test.afterEach(({ todos }) => {
  console.log(todos)
})
```
