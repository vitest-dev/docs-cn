---
outline: deep
---

# Test

- **别名:** `it`

```ts
function test(
  name: string | Function,
  body?: () => unknown,
  timeout?: number
): void
function test(
  name: string | Function,
  options: TestOptions,
  body?: () => unknown,
): void
```

`test` 或 `it` 定义一组相关的断言。它接收测试名称和一个包含断言逻辑的函数。

你可以选择性地配置超时时间（以毫秒为单位），用于指定终止前的最长等待时间，也可以提供一组 [额外选项](#test-options)。默认超时时间为 5 秒，可通过 [`testTimeout`](/config/testtimeout) 进行全局配置。

```ts
import { expect, test } from 'vitest'

test('should work as expected', () => {
  expect(Math.sqrt(4)).toBe(2)
})
```

::: warning
如果第一个参数为函数，`name` 属性将作为测试的名称。函数本身并不会被调用。

如果尚未编写测试体，请将当前测试标记为 `todo`。
:::

当测试函数返回 promise 时，运行器将等待其 resolved 后在收集异步断言。如果 Promise 被拒绝，那么测试将会失败。

::: tip
在 Jest 中，`TestFunction` 也可以是 `(done: DoneCallback) => void` 类型。如果使用该形式，测试须在 `done` 被调用后才会结束。你可以改用 `async` 函数来实现相同的效果，更多内容请参阅 [迁移指南中 Done 回调章节](/guide/migration#done-callback)。
:::

## Test Options

你可以通过链式调用函数属性来配置布尔选项：

```ts
import { test } from 'vitest'

test.skip('skipped test', () => {
  // 当前存在逻辑错误
})

test.concurrent.skip('skipped concurrent test', () => {
  // 当前存在逻辑错误
})
```

也可以在第二个参数中传入一个对象：

```ts
import { test } from 'vitest'

test('skipped test', { skip: true }, () => {
  // 当前存在逻辑错误
})

test('skipped concurrent test', { skip: true, concurrent: true }, () => {
  // 当前存在逻辑错误
})
```

两种方式完全等价，使用哪种纯粹是风格偏好。

### timeout

- **类型:** `number`
- **默认值:** `5_000` (configured by [`testTimeout`](/config/testtimeout))

测试超时时间，以毫秒为单位。

::: warning
注意，如果你将超时时间作为最后一个参数传入，则不能再使用 options 对象：

```ts
import { test } from 'vitest'

// ✅ 有效
test.skip('heavy test', () => {
  // ...
}, 10_000)

// ❌ 无效
test('heavy test', { skip: true }, () => {
  // ...
}, 10_000)
```

不过，你可以在对象内部传入超时时间参数：

```ts
import { test } from 'vitest'

// ✅ 有效
test('heavy test', { skip: true, timeout: 10_000 }, () => {
  // ...
})
```
:::

### retry

- **默认值:** `0` (configured by [`retry`](/config/retry))
- **类型:**

```ts
type Retry = number | {
  /**
   * 测试失败时的重试次数
   * @default 0
   */
  count?: number
  /**
   * 两次重试之间的延迟时间（毫秒）
   * @default 0
   */
  delay?: number
  /**
   * 根据错误确定是否需要重试错误的条件
   * - 如果是正则表达式，则将其与错误消息进行匹配
   * - 如果是函数，会传入 TestError 对象作为参数；返回 true 则触发重试
   *
   * 警告：函数只能在测试文件中使用，不能在 vitest.config.ts 配置文件中使用，
   * 因为配置文件在传递给工作线程时会被序列化
   *
   * @default undefined （默认对所有错误都进行重试）
   */
  condition?: RegExp | ((error: TestError) => boolean)
}
```

测试的重试配置。如果传入数字，表示重试次数；如果传入对象，则支持更精细的重试控制。

警告，对象配置方式自 Vitest 4.1 起才可使用。

### repeats

- **类型:** `number`
- **默认值:** `0`

设置测试重复运行的次数。如果设为 `0`（默认值），测试只运行一次。

这适用于调试偶发性失败的测试。

### tags <Version>4.1.0</Version> {#tags}

- **类型:** `string[]`
- **默认值:** `[]`

 用户自定义 [标签](/guide/test-tags)。如果标签未在 [配置文件](/config/tags) 中声明，测试将在启动前失败，除非手动禁用 [`strictTags`](/config/stricttags)。

```ts
import { it } from 'vitest'

it('user returns data from db', { tags: ['db', 'flaky'] }, () => {
  // ...
})
```

### meta <Version>4.1.0</Version> {#meta}

- **类型:** `TaskMeta`

在报告器中附加可用的自定义 [元数据](/api/advanced/metadata)。

::: warning
Vitest 会合并从 suite 或 tags 继承的顶层属性，但不会对嵌套对象进行深度合并。

```ts
import { describe, test } from 'vitest'

describe(
  'nested meta',
  {
    meta: {
      nested: { object: true, array: false },
    },
  },
  () => {
    test(
      'overrides part of meta',
      {
        meta: {
          nested: { object: false }
        },
      },
      ({ task }) => {
        // task.meta === { nested: { object: false } }
<<<<<<< HEAD
        // 注意 array 丢失了，因为 "nested" 对象被整体覆盖
=======
        // notice array got lost because "nested" object was overridden
>>>>>>> b72fc6b467384d82f530164b077760e0919f8532
      }
    )
  }
)
```

建议尽可能使用非嵌套的 meta
:::

### concurrent

- **类型:** `boolean`
- **默认值:** `false` (configured by [`sequence.concurrent`](/config/sequence#sequence-concurrent))
- **别名:** [`test.concurrent`](#test-concurrent)

是否与测试套件中其他并发测试并行运行。

### sequential

- **类型:** `boolean`
- **默认值:** `true`
- **别名:** [`test.sequential`](#test-sequential)

是否按顺序运行测试。如果同时指定了 `concurrent` 和 `sequential`，`concurrent` 优先生效。

### skip

- **类型:** `boolean`
- **默认值:** `false`
- **别名:** [`test.skip`](#test-skip)

是否跳过该测试。

### only

- **类型:** `boolean`
- **默认值:** `false`
- **别名:** [`test.only`](#test-only)

是否为测试套件中唯一运行的测试。

### todo

- **类型:** `boolean`
- **默认值:** `false`
- **别名:** [`test.todo`](#test-todo)

是否跳过该测试，并标记上 todo。

### fails

- **类型:** `boolean`
- **默认值:** `false`
- **别名:** [`test.fails`](#test-fails)

该测试是否预期失败。如果确实失败，测试将通过，否则测试将失败。

## test.extend

- **别名:** `it.extend`

使用 `test.extend` 通过自定义 fixture 扩展测试上下文。它会返回一个新的 `test`，与此同时它也是可扩展，因此你可以按需组合更多 fixture 或覆盖已有 fixture。更多内容请参阅 [扩展测试上下文](/guide/test-context#extend-test-context)。

```ts
import { test as baseTest, expect } from 'vitest'

export const test = baseTest
  // 简单值，类型推断为 { port: number; host: string }
  .extend('config', { port: 3000, host: 'localhost' })
  // 函数式 fixture，类型根据返回值进行推断
  .extend('server', async ({ config }) => {
    // TypeScript 已知类型 { port: number; host: string }
    return `http://${config.host}:${config.port}`
  })

test('server uses correct port', ({ config, server }) => {
  // TypeScript 已知类型：
  // - config 为 { port: number; host: string }
  // - server 为 string
  expect(server).toBe('http://localhost:3000')
  expect(config.port).toBe(3000)
})
```

## test.override <Version>4.1.0</Version> {#test-override}

使用 `test.override` 覆盖当前测试套件及其嵌套测试套件中所有测试的 fixture 值。须在 `describe` 块的顶层调用。更多内容请参阅 [覆盖 Fixture 值](/guide/test-context.html#overriding-fixture-values)。

```ts
import { test as baseTest, describe, expect } from 'vitest'

const test = baseTest
  .extend('dependency', 'default')
  .extend('dependant', ({ dependency }) => dependency)

describe('use scoped values', () => {
  test.override({ dependency: 'new' })

  test('uses scoped value', ({ dependant }) => {
    // `dependant` 使用覆盖后的新值
    // 该值将作用于此套件内的所有测试
    expect(dependant).toEqual({ dependency: 'new' })
  })
})
```

## test.scoped <Version>3.1.0</Version> <Deprecated /> {#test-scoped}

- **别名:** `it.scoped`

::: danger 弃用
`test.scoped` is deprecated in favor of [`test.override`](#test-override) and will be removed in a future major version.
`test.scoped` 已弃用，建议使用 [`test.override`](#test-override)，将在未来的主版本中移除。
:::

[`test.override`](#test-override) 的别名。

## test.skip

- **别名:** `it.skip`

如果你想跳过某些测试，但又不想删代码，可以使用 `test.skip` 来跳过这些测试。

```ts
import { assert, test } from 'vitest'

test.skip('skipped test', () => {
  // 测试被跳过，不报错
  assert.equal(Math.sqrt(4), 3)
})
```

你也可以在测试 [上下文](/guide/test-context) 中动态调用 `skip` 来跳过测试：

```ts
import { assert, test } from 'vitest'

test('skipped test', (context) => {
  context.skip()
  // 测试被跳过，不报错
  assert.equal(Math.sqrt(4), 3)
})
```

If the condition is unknown, you can provide it to the `skip` method as the first arguments:

```ts
import { assert, test } from 'vitest'

test('skipped test', (context) => {
  context.skip(Math.random() < 0.5, 'optional message')
  // 测试被跳过，不报错
  assert.equal(Math.sqrt(4), 3)
})
```

## test.skipIf

- **别名:** `it.skipIf`

在某些情况下，可能会需要在不同的环境下多次运行测试，而且某些测试可能是特定于环境的。我们这时候可以通过使用 与其使用 `if`，不如使用 `test.skipIf` 在条件为真时跳过测试。

```ts
import { assert, test } from 'vitest'

const isDev = process.env.NODE_ENV === 'development'

test.skipIf(isDev)('prod only test', () => {
  // 此测试仅在生产环境中运行
})
```

## test.runIf

- **别名:** `it.runIf`

于 [test.skipIf](#test-skipif) 相反。

```ts
import { assert, test } from 'vitest'

const isDev = process.env.NODE_ENV === 'development'

test.runIf(isDev)('dev only test', () => {
  // 此测试仅在开发环境中运行
})
```

## test.only

- **别名:** `it.only`

使用 `test.only` 可以只运行指定测试套件中的某些测试。适用于调试场景。

```ts
import { assert, test } from 'vitest'

test.only('test', () => {
  // 只有此测试（以及其他标有 only 的测试）会被运行
  assert.equal(Math.sqrt(4), 2)
})
```

适用于只运行某个文件中的测试，而忽略整个测试套件中其他会干扰输出的测试的场景。

为此，可以在运行 `vitest` 时指定包含相关测试的文件：

```shell
vitest interesting.test.ts
```

::: warning
Vitest 会检测当前是否在 CI 环境中运行，如果有任何测试带有 `only` 标志，将会抛出错误。你可以通过 [`allowOnly`](/config/allowonly) 选项来配置此行为。
:::

## test.concurrent

- **别名:** `it.concurrent`

`test.concurrent` 标记并行运行的连续测试。它接收测试名称、包含要收集的测试的异步函数以及可选的超时（以毫秒为单位）。

```ts
import { describe, test } from 'vitest'

// 标记为 `concurrent` 的两个测试将并行运行。
describe('suite', () => {
  test('serial test', async () => { /* ... */ })
  test.concurrent('concurrent test 1', async () => { /* ... */ })
  test.concurrent('concurrent test 2', async () => { /* ... */ })
})
```

`test.skip`, `test.only`, 和 `test.todo` 适用于并发测试。以下所有组合均有效：

```ts
test.concurrent(/* ... */)
test.skip.concurrent(/* ... */) // 或 test.concurrent.skip(/* ... */)
test.only.concurrent(/* ... */) // 或 test.concurrent.only(/* ... */)
test.todo.concurrent(/* ... */) // 或 test.concurrent.todo(/* ... */)
```

在运行并发测试时，快照和断言须使用来自本地 [测试上下文](/guide/test-context.md) 的 `expect`，以确保能正确关联到对应的测试。

```ts
test.concurrent('test 1', async ({ expect }) => {
  expect(foo).toMatchSnapshot()
})
test.concurrent('test 2', async ({ expect }) => {
  expect(foo).toMatchSnapshot()
})
```

注意，如果测试是同步的，Vitest 仍会按顺序运行它们。

## test.sequential

- **别名:** `it.sequential`

`test.sequential` 将测试标记为顺序执行。适用于在 `describe.concurrent` 或 `--sequence.concurrent` 命令选项下按顺序运行测试的场景。
```ts
import { describe, test } from 'vitest'

// 配置项 { sequence: { concurrent: true } } 开启时
test('concurrent test 1', async () => { /* ... */ })
test('concurrent test 2', async () => { /* ... */ })

test.sequential('sequential test 1', async () => { /* ... */ })
test.sequential('sequential test 2', async () => { /* ... */ })

// 在并发测试套件内
describe.concurrent('suite', () => {
  test('concurrent test 1', async () => { /* ... */ })
  test('concurrent test 2', async () => { /* ... */ })

  test.sequential('sequential test 1', async () => { /* ... */ })
  test.sequential('sequential test 2', async () => { /* ... */ })
})
```

## test.todo

- **别名:** `it.todo`

如果你想留存待实现的测试，可以使用 `test.todo`。报告中会显示这些测试的条目，便于了解还有多少测试尚待实现。

```ts
// 报告中会显示此测试的条目
test.todo('unimplemented test', () => {
  // 未实现函数体...
})
```

::: tip
如果测试没有函数体，Vitest 会自动将其标记为 `todo`。
:::

## test.fails

- **别名:** `it.fails`

使用 `test.fails` 可以明确标记某个断言预期会失败。

```ts
import { expect, test } from 'vitest'

test.fails('repro #1234', () => {
  expect(add(1, 2)).toBe(4)
})
```

适用于追踪库的行为随版本迭代发生的差异。举例来说，当时间有限且无法立即修复某个问题时，可以先定义一个失败的测试。自 Vitest 4.1 起，标有 `fails` 的测试会被记录在测试摘要中。

## test.each

- **别名:** `it.each`

::: tip
`test.each` 是为兼容 Jest 而提供的，Vitest 还提供了 [`test.for`](#test-for)，额外支持集成  [`TestContext`](/guide/test-context)。
:::

当需要以不同变量运行相同测试时，使用 `test.each`。你可以在测试名称中按测试函数参数顺序，使用 [printf 格式化](https://nodejs.org/api/util.html#util_util_format_format_args) 注入参数。

- `%s`：字符串
- `%d`：数字
- `%i`：整数
- `%f`：浮点数
- `%j`：JSON
- `%o`：对象
- `%#`：测试用例从 0 开始的索引
- `%$`：测试用例从 1 开始的索引
- `%%`：百分号字面量（`%`）

```ts
import { expect, test } from 'vitest'

test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', (a, b, expected) => {
  expect(a + b).toBe(expected)
})

// 这将返回
// ✓ add(1, 1) -> 2
// ✓ add(1, 2) -> 3
// ✓ add(2, 1) -> 3
```

也可以使用 `$` 前缀访问对象属性和数组元素：

```ts
test.each([
  { a: 1, b: 1, expected: 2 },
  { a: 1, b: 2, expected: 3 },
  { a: 2, b: 1, expected: 3 },
])('add($a, $b) -> $expected', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})

// 这将返回
// ✓ add(1, 1) -> 2
// ✓ add(1, 2) -> 3
// ✓ add(2, 1) -> 3

test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add($0, $1) -> $2', (a, b, expected) => {
  expect(a + b).toBe(expected)
})

// 这将返回
// ✓ add(1, 1) -> 2
// ✓ add(1, 2) -> 3
// ✓ add(2, 1) -> 3
```

如果使用对象作为参数，也可以用 `.` 访问对象的属性：

```ts
test.each`
a               | b      | expected
${{ val: 1 }}   | ${'b'} | ${'1b'}
${{ val: 2 }}   | ${'b'} | ${'2b'}
${{ val: 3 }}   | ${'b'} | ${'3b'}
`('add($a.val, $b) -> $expected', ({ a, b, expected }) => {
  expect(a.val + b).toBe(expected)
})

// this will return
// ✓ add(1, b) -> 1b
// ✓ add(2, b) -> 2b
// ✓ add(3, b) -> 3b
```

* 第一行应为列名，以 `|` 分隔；
* 之后的一行或多行数据以模板字面量表达式的形式提供，语法为 `${value}`。

```ts
import { expect, test } from 'vitest'

test.each`
  a               | b      | expected
  ${1}            | ${1}   | ${2}
  ${'a'}          | ${'b'} | ${'ab'}
  ${[]}           | ${'b'} | ${'b'}
  ${{}}           | ${'b'} | ${'[object Object]b'}
  ${{ asd: 1 }}   | ${'b'} | ${'[object Object]b'}
`('returns $expected when $a is added $b', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})
```

::: tip
Vitest 使用 Chai 的 `format` 方法处理 `$values`。如果值被截断，可在配置文件中调大 [chaiConfig.truncateThreshold](/config/chaiconfig#chaiconfig-truncatethreshold)。
:::

## test.for

- **别名:** `it.for`

`test.each` 的替代方案，同时提供 [`TestContext`](/guide/test-context)。

它和 `test.each` 的主要区别在于：当你需要传递数组参数时，二者的写法和处理方式不同。而对于非数组参数（包括模板字符串的用法），`test.for` 和 `test.each` 的使用方法是一致的。

```ts
// `each` 会展开数组
test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', (a, b, expected) => { // [!code --]
  expect(a + b).toBe(expected)
})

// `for` 不会展开数组（请留意参数外层需要使用方括号）。
test.for([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', ([a, b, expected]) => { // [!code ++]
  expect(a + b).toBe(expected)
})
```

第二个参数是 TestContext ，你可以用它来执行并发快照等操作，例如：

```ts
test.concurrent.for([
  [1, 1],
  [1, 2],
  [2, 1],
])('add(%i, %i)', ([a, b], { expect }) => {
  expect(a + b).toMatchSnapshot()
})
```

## test.describe <Version>4.1.0</Version> {#test-describe}

 挂载在 test.extend 实例上的 `describe`。更多内容请参阅 [describe](/api/describe)。

## test.suite <Version>4.1.0</Version> {#test-suite}

`suite` 的别名。更多内容请参阅 [describe](/api/describe)。

## test.beforeEach

挂载在 test.extend 实例上的 `beforeEach` 钩子，继承 [`test.extend`](#test-extend) 的类型。更多内容请参阅 [beforeEach](/api/hooks#beforeeach)。

## test.afterEach

挂载在 test.extend 实例上的 `afterEach` 钩子，继承 [`test.extend`](#test-extend) 的类型。更多内容请参阅 [afterEach](/api/hooks#aftereach)。

## test.beforeAll

挂载在 test.extend 实例上的 `beforeAll` 钩子，继承 [`test.extend`](#test-extend) 的类型。更多内容请参阅 [beforeAll](/api/hooks#beforeall)。

## test.afterAll

挂载在 test.extend 实例上的 `afterAll` 钩子，继承 [`test.extend`](#test-extend) 的类型。更多内容请参阅 [afterAll](/api/hooks#afterall)。

## test.aroundEach <Version>4.1.0</Version> {#test-aroundeach}

挂载在 test.extend 实例上的 `aroundEach` 钩子，继承 [`test.extend`](#test-extend) 的类型。更多内容请参阅 [aroundEach](/api/hooks#aroundeach)。

## test.aroundAll <Version>4.1.0</Version> {#test-aroundall}

挂载在 test.extend 实例上的 `aroundAll` 钩子，继承 [`test.extend`](#test-extend) 的类型。更多内容请参阅 [aroundAll](/api/hooks#aroundall)。

## bench <Experimental /> {#bench}

- **类型:** `(name: string | Function, fn: BenchFunction, options?: BenchOptions) => void`

::: danger
基准测试是实验性功能，不遵循 SemVer。
:::

`bench` 用于定义基准测试。在 Vitest 中，基准测试是一个定义了一系列操作的函数，Vitest 会多次运行该函数以展示不同的性能指标。

 Vitest 底层使用 [`tinybench`](https://github.com/tinylibs/tinybench) 库，所有选项均可作为第三个参数传入。

```ts
import { bench } from 'vitest'

bench('normal sorting', () => {
  const x = [1, 5, 4, 2, 3]
  x.sort((a, b) => {
    return a - b
  })
}, { time: 1000 })
```

```ts
export interface Options {
  /**
   * 运行基准任务所需时间（毫秒）
   * @default 500
   */
  time?: number

  /**
   * 如果连时间选项都已完成，任务应运行的次数
   * @default 10
   */
  iterations?: number

  /**
   * 函数以毫秒为单位获取当前时间戳
   */
  now?: () => number

  /**
   * 用于中止基准测试的中止信号
   */
  signal?: AbortSignal

  /**
   * 任务失败时抛出（如果为 true，事件将不起作用）
   */
  throws?: boolean

  /**
   * 预热时间（毫秒）
   * @default 100ms
   */
  warmupTime?: number

  /**
   * 热身迭代
   * @default 5
   */
  warmupIterations?: number

  /**
   * 在每个基准任务（周期）之前运行的设置函数
   */
  setup?: Hook

  /**
   * 在每个基准任务（周期）之后运行的拆机函数
   */
  teardown?: Hook
}
```
测试用例运行后，输出结构信息如下：

```
  name                      hz     min     max    mean     p75     p99    p995    p999     rme  samples
· normal sorting  6,526,368.12  0.0001  0.3638  0.0002  0.0002  0.0002  0.0002  0.0004  ±1.41%   652638
```
```ts
export interface TaskResult {
  /*
   * 运行任务时发生的最后一次错误
   */
  error?: unknown

  /**
   * 以毫秒为单位的基准任务运行时间（周期）。
   */
  totalTime: number

  /**
   * 样本中的最小值
   */
  min: number
  /**
   * 样本中的最大值
   */
  max: number

  /**
   * 每秒的操作次数
   */
  hz: number

  /**
   * 每个操作需要多长时间（毫秒）
   */
  period: number

  /**
   * 每个任务的任务样本迭代时间（毫秒）
   */
  samples: number[]

  /**
   * 样本平均数/平均值（总体平均数的估计值）
   */
  mean: number

  /**
   * 样本方差（总体方差的估计值）
   */
  variance: number

  /**
   * 样本标准差（总体标准差的估计值）
   */
  sd: number

  /**
   * 平均值的标准误差（又称样本平均值的抽样分布标准差）
   */
  sem: number

  /**
   * 自由度
   */
  df: number

  /**
   * 样本临界值
   */
  critical: number

  /**
   * 误差率
   */
  moe: number

  /**
   * 相对误差
   */
  rme: number

  /**
   * 中位绝对偏差
   */
  mad: number

  /**
   * P50/中位百分位数
   */
  p50: number

  /**
   * p75 百分位数
   */
  p75: number

  /**
   * p99 百分位数
   */
  p99: number

  /**
   * p995 百分位数
   */
  p995: number

  /**
   * p999 百分位数
   */
  p999: number
}
```

### bench.skip

- **类型:** `(name: string | Function, fn: BenchFunction, options?: BenchOptions) => void`

使用 `bench.skip` 跳过某些基准测试的运行。

```ts
import { bench } from 'vitest'

bench.skip('normal sorting', () => {
  const x = [1, 5, 4, 2, 3]
  x.sort((a, b) => {
    return a - b
  })
})
```

### bench.only

- **类型:** `(name: string | Function, fn: BenchFunction, options?: BenchOptions) => void`

使用 `bench.only` 在指定套件中只运行某些基准测试。适用于调试场景。

```ts
import { bench } from 'vitest'

bench.only('normal sorting', () => {
  const x = [1, 5, 4, 2, 3]
  x.sort((a, b) => {
    return a - b
  })
})
```

### bench.todo

- **类型:** `(name: string | Function) => void`

使用 `bench.todo` 为待实现的基准测试占位。

```ts
import { bench } from 'vitest'

bench.todo('unimplemented test')
```
