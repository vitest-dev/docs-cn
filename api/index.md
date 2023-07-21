---
outline: deep
---

# API 索引

下面的变量中使用了以下类型签名

```ts
type Awaitable<T> = T | PromiseLike<T>
type TestFunction = () => Awaitable<void>

interface TestOptions {
  /**
   * 如果测试执行时间过长，将会导致测试失败。
   */
  timeout?: number
  /**
   * 如果测试失败，将会重试指定次数。
   *
   * @default 0
   */
  retry?: number
  /**
   * 即使每次测试失败，也会多次重复相同的测试
   * 如果您有 "retry" 选项并且它失败了，它将在每个周期中使用每个重试
   * 用于调试随机失败的情况非常有用
   *
   * @default 0
   */
  repeats?: number
}
```

当一个测试函数返回一个 promise 时，Vitest 将等待直到它被解决以收集异步的期望值。 如果 promise 被拒绝，测试将失败。

::: tip 提示
在 Jest 中，`TestFunction` 也可以是 `(done: DoneCallback) => void` 类型。 如果使用此选项，则在调用 `done` 之前测试不会结束。 你可以使用 `async` 函数实现相同的目的，请参阅迁移指南中的[回调](../guide/migration#done-callback)部分。
:::

## test

- **类型:** `(name: string | Function, fn: TestFunction, timeout?: number | TestOptions) => void`
- **别名:** `it`

  `test` 定义了一组关于测试期望的方法。它接收测试名称和一个含有测试期望的函数。

  同时，可以提供一个超时时限（以毫秒为单位）用于指定等待多长时间后终止测试，默认为 5 秒。你也可以通过 [testTimeout](/config/#testtimeout) 选项进行全局配置。

  ```ts
  import { expect, test } from 'vitest'
  
  test('should work as expected', () => {
    expect(Math.sqrt(4)).toBe(2)
  })
  ```

### test.extend

- **类型:** `<T extends Record<string, any>>(fixtures: Fixtures<T>): TestAPI<ExtraContext & T>`
- **别名:** `it.extend`
- **版本:** Vitest 0.32.3

  使用 `test.extend` 来扩展带有自定义装置的测试上下文。这将返回一个新的 `test` 并且它也是可扩展的，因此你可以根据需要通过扩展它来组合更多装置或覆盖现有装置。有关详细信息，请参阅[扩展测试上下文](/guide/test-context.html#test-extend)。

  ```ts
  import { expect, test } from 'vitest'
  
  const todos = []
  const archive = []
  
  const myTest = test.extend({
    todos: async ({ task }, use) => {
      todos.push(1, 2, 3)
      await use(todos)
      todos.length = 0
    },
    archive,
  })
  
  myTest('add item', ({ todos }) => {
    expect(todos.length).toBe(3)
  
    todos.push(4)
    expect(todos.length).toBe(4)
  })
  ```

### test.skip

- **类型:** `(name: string | Function, fn: TestFunction, timeout?: number | TestOptions) => void`
- **别名:** `it.skip`

  如果你想跳过运行某些测试，但由于一些原因不想删除代码，你可以使用 `test.skip` 来避免运行它们。

  ```ts
  import { assert, test } from 'vitest'
  
  test.skip('skipped test', () => {
    // 跳过测试，没有错误
    assert.equal(Math.sqrt(4), 3)
  })
  ```

### test.skipIf

- **类型:** `(condition: any) => Test`
- **别名:** `it.skipIf`

  在某些情况下，你可能会在不同的环境中多次运行测试，并且某些测试可能基于特定环境下运行。只要条件成立，你就可以使用 `test.skipIf` 跳过测试，而不是用 `if` 包裹测试代码。

  ```ts
  import { assert, test } from 'vitest'
  
  const isDev = process.env.NODE_ENV === 'development'
  
  test.skipIf(isDev)('prod only test', () => {
    // 只在生产环境下进行测试
  })
  ```

::: warning
当 Vitest 作为 [类型检查器](/guide/testing-types) 时，你不能使用此语法。
:::

### test.runIf

- **类型:** `(condition: any) => Test`
- **别名:** `it.runIf`

[test.skipIf](#testskipif) 的相反面。

```ts
import { assert, test } from 'vitest'

const isDev = process.env.NODE_ENV === 'development'

test.runIf(isDev)('dev only test', () => {
  // 只在开发环境下进行测试
})
```

::: warning
当 Vitest 作为 [类型检查器](/guide/testing-types) 时，你不能使用此语法。
:::

### test.only

- **类型:** `(name: string | Function, fn: TestFunction, timeout?: number) => void`
- **别名:** `it.only`

  使用 `test.only` 只允许特定条件的测试套件。这在调试模式下是很有用的。

  同时，可以提供一个超时时限（以毫秒为单位）用于指定等待多长时间后终止测试，默认为 5 秒。你也可以通过 [testTimeout](/config/#testtimeout) 选项进行全局配置。

  ```ts
  import { assert, test } from 'vitest'
  
  test.only('test', () => {
    // 仅运行此测试（以及仅标记有的其他测试）
    assert.equal(Math.sqrt(4), 2)
  })
  ```

  有时候只运行一个特定文件中的 `only` 测试用例是很有用的，这可以忽略整个测试套件中的所有其他测试用例，避免污染输出。

  为了做到这一点，运行 `vitest` 命令并带上包含有问题的测试的特定文件。

  ```
  # vitest interesting.test.ts
  ```

### test.concurrent

- **类型:** `(name: string | Function, fn: TestFunction, timeout?: number) => void`
- **别名:** `it.concurrent`

  `test.concurrent` 将连续测试标记为并行运行。 它接收测试名称、带有要收集的测试的异步函数以及可选的超时时间（以毫秒为单位）。

  ```ts
  import { describe, test } from 'vitest'
  
  // 标有并发的两个测试将并发运行
  describe('suite', () => {
    test('serial test', async () => {
      /* ... */
    })
    test.concurrent('concurrent test 1', async () => {
      /* ... */
    })
    test.concurrent('concurrent test 2', async () => {
      /* ... */
    })
  })
  ```

  `test.skip`、`test.only` 和 `test.todo` 适用于并发测试。 以下所有组合均有效：

  ```ts
  test.concurrent(/* ... */)
  test.skip.concurrent(/* ... */) // or test.concurrent.skip(/* ... */)
  test.only.concurrent(/* ... */) // or test.concurrent.only(/* ... */)
  test.todo.concurrent(/* ... */) // or test.concurrent.todo(/* ... */)
  ```

  在异步并发测试中使用快照时，由于 JavaScript 的限制，你需要使用 [测试环境](/guide/test-context.md) 中的 `expect` 来确保检测到正确的测试。

  ```ts
  test.concurrent('test 1', async ({ expect }) => {
    expect(foo).toMatchSnapshot()
  })
  test.concurrent('test 2', async ({ expect }) => {
    expect(foo).toMatchSnapshot()
  })
  ```

::: warning
当 Vitest 作为 [类型检查器](/guide/testing-types) 时，你不能使用此语法。
:::

### test.todo

- **类型:** `(name: string | Function) => void`
- **别名:** `it.todo`

  使用 `test.todo` 来存根测试，以便稍后实现。 测试报告中将显示一个条目，以便告知你还有多少测试未实现。

  ```ts
  // 测试的报告中将显示一个记录
  test.todo('unimplemented test')
  ```

### test.fails

- **类型:** `(name: string | Function, fn: TestFunction, timeout?: number) => void`
- **别名:** `it.fails`

  使用 `test.fails` 来指示测试断言将显式失败。

  ```ts
  import { expect, test } from 'vitest'
  
  function myAsyncFunc() {
    return new Promise(resolve => resolve(1))
  }
  test.fails('fail test', async () => {
    await expect(myAsyncFunc()).rejects.toBe(1)
  })
  ```

::: warning
当 Vitest 作为 [类型检查器](/guide/testing-types) 时，你不能使用此语法。
:::

### test.each

- **类型:** `(cases: ReadonlyArray<T>, ...args: any[]) => void`
- **别名:** `it.each`

  当你需要使用不同的变量运行相同的测试时，请使用 `test.each`。
  你可以按照测试参数的顺序，在测试名称插入符合[printf 格式](https://nodejs.org/api/util.html#util_util_format_format_args)的参数。

  - `%s`: 字符串
  - `%d`: 数值
  - `%i`: 整数
  - `%f`: 小数
  - `%j`: json 格式
  - `%o`: 对象
  - `%#`: 对应的测试参数下标
  - `%%`: 单个百分比符号 ('%')

  ```ts
  test.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3],
  ])('add(%i, %i) -> %i', (a, b, expected) => {
    expect(a + b).toBe(expected)
  })

  // 它将返回如下内容
  // ✓ add(1, 1) -> 2
  // ✓ add(1, 2) -> 3
  // ✓ add(2, 1) -> 3
  ```

  如果你使用对象作为参数，你还可以使用 `$` 前缀访问对象属性：

  ```ts
  test.each([
    { a: 1, b: 1, expected: 2 },
    { a: 1, b: 2, expected: 3 },
    { a: 2, b: 1, expected: 3 },
  ])('add($a, $b) -> $expected', ({ a, b, expected }) => {
    expect(a + b).toBe(expected)
  })

  // this will return
  // ✓ add(1, 1) -> 2
  // ✓ add(1, 2) -> 3
  // ✓ add(2, 1) -> 3
  ```

  如果你使用对象作为参数，你还可以使用“.”访问对象属性：

  ```ts
  test.each`
    a             | b      | expected
    ${{ val: 1 }} | ${'b'} | ${'1b'}
    ${{ val: 2 }} | ${'b'} | ${'2b'}
    ${{ val: 3 }} | ${'b'} | ${'3b'}
  `('add($a.val, $b) -> $expected', ({ a, b, expected }) => {
    expect(a.val + b).toBe(expected)
  })

  // this will return
  // ✓ add(1, b) -> 1b
  // ✓ add(2, b) -> 2b
  // ✓ add(3, b) -> 3b
  ```

从 Vitest 0.25.3 开始，你可以使用模板字符串表。

- 第一行应该是列名，使用 `|` 分隔；
- 使用 `${value}` 语法作为模板文本表达式，为一个或多个后续数据行提供数据。

```ts
test.each`
  a             | b      | expected
  ${1}          | ${1}   | ${2}
  ${'a'}        | ${'b'} | ${'ab'}
  ${[]}         | ${'b'} | ${'b'}
  ${{}}         | ${'b'} | ${'[object Object]b'}
  ${{ asd: 1 }} | ${'b'} | ${'[object Object]b'}
`('returns $expected when $a is added $b', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})
```

如果你想访问 `TestContext`，请在单个测试中使用 `describe.each`。

::: tip
Vitest processes `$values` with chai `format` method. If the value is too truncated, you can increase [chaiConfig.truncateThreshold](/config/#chaiconfig-truncatethreshold) in your config file.
:::

::: warning
当使用 Vitest 作为 [type checker](/guide/testing-types) 时，不能使用此语法。
:::

## bench

- **类型:** `(name: string | Function, fn: BenchFunction, options?: BenchOptions) => void`

`bench` 定义了一个基准。 在 Vitest 术语中，基准是定义一系列操作的函数。 Vitest 多次运行此函数以显示不同的性能结果。

Vitest 在底层使用 [`tinybench`](https://github.com/tinylibs/tinybench) 库，继承其所有可用选项作为第三个参数。

```ts
import { bench } from 'vitest'

bench(
  'normal sorting',
  () => {
    const x = [1, 5, 4, 2, 3]
    x.sort((a, b) => {
      return a - b
    })
  },
  { time: 1000 }
)
```

```ts
export interface Options {
  /**
   * time needed for running a benchmark task (milliseconds)
   * @default 500
   */
  time?: number

  /**
   * number of times that a task should run if even the time option is finished
   * @default 10
   */
  iterations?: number

  /**
   * function to get the current timestamp in milliseconds
   */
  now?: () => number

  /**
   * An AbortSignal for aborting the benchmark
   */
  signal?: AbortSignal

  /**
   * warmup time (milliseconds)
   * @default 100ms
   */
  warmupTime?: number

  /**
   * warmup iterations
   * @default 5
   */
  warmupIterations?: number

  /**
   * setup function to run before each benchmark task (cycle)
   */
  setup?: Hook

  /**
   * teardown function to run after each benchmark task (cycle)
   */
  teardown?: Hook
}
```

### bench.skip

- **类型:** `(name: string | Function, fn: BenchFunction, options?: BenchOptions) => void`

你可以使用 `bench.skip` 语法跳过运行某些基准测试。

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

使用 `bench.only` 仅在指定测试套件中运行某些基准测试。这在调试时很有用。

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

使用 `bench.todo` 来存根基准测试，以便稍后实现。

```ts
import { bench } from 'vitest'

bench.todo('unimplemented test')
```

## describe

当你在文件的顶层使用 `test` 或 `bench` 时，它们会被收集为它的隐式套件的一部分。 使用 `describe` 你可以在当前上下文中定义一个新套件，作为一组相关的测试或基准以及其他嵌套套件。 测试套件可让你组织测试和基准测试，从而使报告更加清晰。

```ts
// basic.spec.ts
// organizing tests

import { describe, expect, test } from 'vitest'

const person = {
  isActive: true,
  age: 32,
}

describe('person', () => {
  test('person is defined', () => {
    expect(person).toBeDefined()
  })

  test('is active', () => {
    expect(person.isActive).toBeTruthy()
  })

  test('age limit', () => {
    expect(person.age).toBeLessThanOrEqual(32)
  })
})
```

```ts
// basic.bench.ts
// organizing benchmarks

import { bench, describe } from 'vitest'

describe('sort', () => {
  bench('normal', () => {
    const x = [1, 5, 4, 2, 3]
    x.sort((a, b) => {
      return a - b
    })
  })

  bench('reverse', () => {
    const x = [1, 5, 4, 2, 3]
    x.reverse().sort((a, b) => {
      return a - b
    })
  })
})
```

如果你需要有测试层次结构，你还可以嵌套描述块：

```ts
import { describe, expect, test } from 'vitest'

function numberToCurrency(value) {
  if (typeof value !== 'number')
    throw new Error('Value must be a number')

  return value
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

describe('numberToCurrency', () => {
  describe('given an invalid number', () => {
    test('composed of non-numbers to throw error', () => {
      expect(() => numberToCurrency('abc')).toThrowError()
    })
  })

  describe('given a valid number', () => {
    test('returns the correct currency format', () => {
      expect(numberToCurrency(10000)).toBe('10,000.00')
    })
  })
})
```

### describe.skip

- **类型:** `(name: string | Function, fn: TestFunction, options?: number | TestOptions) => void`

  在测试套件中使用 `describe.skip` 避免运行特定的描述块。

  ```ts
  import { assert, describe, test } from 'vitest'
  
  describe.skip('skipped suite', () => {
    test('sqrt', () => {
      // 跳过测试套件，不会有错误
      assert.equal(Math.sqrt(4), 3)
    })
  })
  ```

### describe.skipIf

- **类型:** `(condition: any) => void`

  在某些情况下，你可能会在不同的环境中多次运行套件，并且某些套件可能是特定于环境的。你可以使用 `describe.skipIf` 在条件为真时跳过套件，而不是用 `if` 包装套件。

  ```ts
  import { assert, test } from 'vitest'
  
  const isDev = process.env.NODE_ENV === 'development'
  
  describe.skipIf(isDev)('prod only test', () => {
    // this test only runs in production
  })
  ```

::: warning
当 Vitest 作为 [类型检查器](/guide/testing-types) 时，你不能使用此语法。
:::

### describe.only

- **类型:** `(name: string | Function, fn: TestFunction, options?: number | TestOptions) => void`

  使用 `describe.only` 仅运行指定的测试套件。

  ```ts
  // 仅运行此测试套件（以及仅标有的其他测试套件）
  describe.only('suite', () => {
    test('sqrt', () => {
      assert.equal(Math.sqrt(4), 3)
    })
  })
  
  describe('other suite', () => {
    // ... 测试套件将会被跳过
  })
  ```

  有时候只运行一个特定文件中的 `only` 测试用例是很有用的，这可以忽略整个测试套件中的所有其他测试用例，避免污染输出。

  为了做到这一点，运行 `vitest` 命令并带上包含有问题的测试的特定文件。

  ```
  # vitest interesting.test.ts
  ```

### describe.concurrent

- **类型:** `(name: string | Function, fn: TestFunction, options?: number | TestOptions) => void`

  使用 `describe.concurrent` 在测试套件中将每个测试标记为并发。

  ```ts
  // 该测试套件中的所有测试都将并行运行
  describe.concurrent('suite', () => {
    test('concurrent test 1', async () => {
      /* ... */
    })
    test('concurrent test 2', async () => {
      /* ... */
    })
    test.concurrent('concurrent test 3', async () => {
      /* ... */
    })
  })
  ```

  `.skip`，`.only` 和 `.todo` 可以与并发测试套件一起使用。以下所有组合均有效：

  ```ts
  describe.concurrent(/* ... */)
  describe.skip.concurrent(/* ... */) // or describe.concurrent.skip(/* ... */)
  describe.only.concurrent(/* ... */) // or describe.concurrent.only(/* ... */)
  describe.todo.concurrent(/* ... */) // or describe.concurrent.todo(/* ... */)
  ```

在异步并发测试中使用快照时，由于 JavaScript 的限制，你需要使用 [测试环境](/guide/test-context.md) 中的 `expect` 来确保检测到正确的测试。

```ts
describe.concurrent('suite', () => {
  test('concurrent test 1', async ({ expect }) => {
    expect(foo).toMatchSnapshot()
  })
  test('concurrent test 2', async ({ expect }) => {
    expect(foo).toMatchSnapshot()
  })
})
```

::: warning
当 Vitest 作为 [类型检查器](/guide/testing-types) 时，你不能使用此语法。
:::

### describe.sequential

- **类型:** `(name: string | Function, fn: TestFunction, options?: number | TestOptions) => void`

  测试套件中的 `describe.sequential` 将每个测试标记为连续的。如果你想在 `describe.concurrent` 中或使用 `--sequence.concurrent` 命令选项按顺序运行测试，这非常有用。

  ```ts
  describe.concurrent('suite', () => {
    test('concurrent test 1', async () => {
      /* ... */
    })
    test('concurrent test 2', async () => {
      /* ... */
    })
  
    describe.sequential('', () => {
      test('sequential test 1', async () => {
        /* ... */
      })
      test('sequential test 2', async () => {
        /* ... */
      })
    })
  })
  ```

### describe.shuffle

- **类型:** `(name: string | Function, fn: TestFunction, options?: number | TestOptions) => void`

  Vitest 提供了一种通过 CLI 标志 [`--sequence.shuffle`](/guide/cli) 或配置选项 [`sequence.shuffle`](/config/#sequence-shuffle) 来随机运行所有测试的方法，但是如果你只想让测试套件的一部分以随机顺序运行测试，可以使用此标志对其进行标记。

  ```ts
  describe.shuffle('suite', () => {
    test('random test 1', async () => {
      /* ... */
    })
    test('random test 2', async () => {
      /* ... */
    })
    test('random test 3', async () => {
      /* ... */
    })
  })
  // 执行顺序依赖于 sequence.seed 的配置选项(默认为 Date.now())
  ```

`.skip`，`.only` 和 `.todo` 可以与并发测试套件一起使用。以下所有组合均有效：

::: warning
当 Vitest 作为 [类型检查器](/guide/testing-types) 时，你不能使用此语法。
:::

### describe.todo

- **类型:** `(name: string | Function) => void`

  使用 `describe.todo` 将稍后实现的测试套件进行存档。测试报告中将显示一个记录，以便你知道还多少条未实现的测试。

  ```ts
  // 测试套件的报告中将显示一个记录
  describe.todo('unimplemented suite')
  ```

### describe.each

- **类型:** `(cases: ReadonlyArray<T>, ...args: any[]): (name: string | Function, fn: (...args: T[]) => void, options?: number | TestOptions) => void`

  如果你有多个测试依赖相同的数据，可以使用 `describe.each`。

  ```ts
  describe.each([
    { a: 1, b: 1, expected: 2 },
    { a: 1, b: 2, expected: 3 },
    { a: 2, b: 1, expected: 3 },
  ])('describe object add($a, $b)', ({ a, b, expected }) => {
    test(`returns ${expected}`, () => {
      expect(a + b).toBe(expected)
    })
  
    test(`returned value not be greater than ${expected}`, () => {
      expect(a + b).not.toBeGreaterThan(expected)
    })
  
    test(`returned value not be less than ${expected}`, () => {
      expect(a + b).not.toBeLessThan(expected)
    })
  })
  ```

  从 Vitest 0.25.3 开始，你可以使用模板字符串表。

  - 第一行应该是列名，使用 `|` 分隔；
  - 使用 `${value}` 语法作为模板文本表达式，为一个或多个后续数据行提供数据。

  ```ts
  describe.each`
    a             | b      | expected
    ${1}          | ${1}   | ${2}
    ${'a'}        | ${'b'} | ${'ab'}
    ${[]}         | ${'b'} | ${'b'}
    ${{}}         | ${'b'} | ${'[object Object]b'}
    ${{ asd: 1 }} | ${'b'} | ${'[object Object]b'}
  `('describe template string add($a, $b)', ({ a, b, expected }) => {
    test(`returns ${expected}`, () => {
      expect(a + b).toBe(expected)
    })
  })
  ```

::: warning
当使用 Vitest 作为 [type checker](/guide/testing-types) 时，不能使用此语法。
:::

## Setup and Teardown

这些功能允许我们连接到测试的生命周期，以避免重复设置和拆卸代码。 它们适用于当前上下文：如果它们在顶层使用，则适用于文件；如果它们在 `describe` 块内，则适用于当前测试套件。

### beforeEach

- **类型:** `beforeEach(fn: () => Awaitable<void>, timeout?: number)`

  注册一个回调,在当前上下文中的每个测试运行之前被调用。
  如果函数返回一个 `Promise`，`Vitest` 会等到 `Promise` 解决后再运行测试。

  或者，我们可以传递一个超时（以毫秒为单位），定义在终止之前等待多长时间。 默认值为 5 秒。

  ```ts
  import { beforeEach } from 'vitest'
  
  beforeEach(async () => {
    // 在每次测试运行之前清除模拟并添加一些测试数据
    await stopMocking()
    await addUser({ name: 'John' })
  })
  ```

  这里的 `beforeEach` 确保为每个测试都添加用户。

  从 Vitest v0.10.0 开始，`beforeEach` 还接受一个可选的清理功能（相当于 `afterEach`）。

  ```ts
  import { beforeEach } from 'vitest'
  
  beforeEach(async () => {
    // 在所有测试运行之前调用一次
    await prepareSomething()
  
    // 清理方法，在所有测试运行后调用一次
    return async () => {
      await resetSomething()
    }
  })
  ```

### afterEach

- **类型:** `afterEach(fn: () => Awaitable<void>, timeout?: number)`

  注册一个回调,在当前上下文中的每个测试运行之后被调用。
  如果函数返回一个 Promise ，Vitest 会等到 Promise 解决后再继续。

  或者，你可以设置超时（以毫秒为单位）以指定在终止前等待多长时间。 默认值为 5 秒。

  ```ts
  import { afterEach } from 'vitest'
  
  afterEach(async () => {
    await clearTestingData() // 每次测试运行后清除测试数据
  })
  ```

  这里的 `afterEach` 确保在每次测试运行后清除测试数据。

### beforeAll

- **类型:** `beforeAll(fn: () => Awaitable<void>, timeout?: number)`

  注册一个回调，在开始运行当前上下文中的所有测试之前被调用一次。
  如果函数返回一个 `Promise`，`Vitest` 会等到 `Promise` 解决后再运行测试。

  或者，你可以提供超时（以毫秒为单位）以指定在终止之前等待多长时间。 默认值为 5 秒。

  ```ts
  import { beforeAll } from 'vitest'
  
  beforeAll(async () => {
    await startMocking() // 在所有测试运行之前调用一次
  })
  ```

  这里的 `beforeAll` 确保在测试运行之前设置模拟数据。

  从 Vitest v0.10.0 开始，`beforeAll` 还可以接受一个可选的清理功能（相当于 `afterAll`）。

  ```ts
  import { beforeAll } from 'vitest'
  
  beforeAll(async () => {
    // 在所有测试运行之前调用一次
    await startMocking()
  
    // 清理函数，在所有测试运行后调用一次
    return async () => {
      await stopMocking()
    }
  })
  ```

### afterAll

- **类型:** `afterAll(fn: () => Awaitable<void>, timeout?: number)`

  注册一个回调，在当前上下文中运行所有测试后被调用一次。
  如果函数返回一个 Promise，Vitest 会等到 Promise 解决后再继续。

  或者，你可以提供超时（以毫秒为单位）以指定在终止之前等待多长时间。 默认值为 5 秒。

  ```ts
  import { afterAll } from 'vitest'
  
  afterAll(async () => {
    await stopMocking() // 在所有测试运行后调用此方法
  })
  ```

这里的 `afterAll` 确保在所有测试运行后调用 `stopMocking` 方法。
