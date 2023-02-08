---
outline: deep
---

# API 索引

下面的变量中使用了以下类型签名

```ts
type Awaitable<T> = T | PromiseLike<T>
type TestFunction = () => Awaitable<void>

interface TestOptions {
  timeout?: number
  retry?: number
}
```

当一个测试函数返回一个 promise 时，Vitest 将等待直到它被解决以收集异步的期望值。 如果 promise 被拒绝，测试将失败。

::: tip 提示
在 Jest 中，`TestFunction` 也可以是 `(done: DoneCallback) => void` 类型。 如果使用此选项，则在调用 `done` 之前测试不会结束。 你可以使用 `async` 函数实现相同的目的，请参阅迁移指南中的[回调](../guide/migration#done-callback)部分。
:::

## test

- **类型:** `(name: string, fn: TestFunction, timeout?: number | TestOptions) => void`
- **别名:** `it`

  `test` 定义了一组关于测试期望的方法。它接收测试名称和一个含有测试期望的函数。

  同时，可以提供一个超时时限（以毫秒为单位）用于指定等待多长时间后终止测试，默认为 5 秒。你也可以通过 [testTimeout](/config/#testtimeout) 选项进行全局配置。

  ```ts
  import { expect, test } from 'vitest'
  
  test('should work as expected', () => {
    expect(Math.sqrt(4)).toBe(2)
  })
  ```

### test.skip

- **类型:** `(name: string, fn: TestFunction, timeout?: number | TestOptions) => void`
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
You cannot use this syntax, when using Vitest as [type checker](/guide/testing-types).
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
You cannot use this syntax, when using Vitest as [type checker](/guide/testing-types).
:::

### test.only

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`
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

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`
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
You cannot use this syntax, when using Vitest as [type checker](/guide/testing-types).
:::

### test.todo

- **类型:** `(name: string) => void`
- **别名:** `it.todo`

  使用 `test.todo` 来存根测试，以便稍后实现。 测试报告中将显示一个条目，以便告知你还有多少测试未实现。

  ```ts
  // 测试的报告中将显示一个记录
  test.todo('unimplemented test')
  ```

### test.fails

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`
- **别名:** `it.fails`

  使用 `test.fails` 来指示测试断言将显式失败。

  ```ts
  import { expect, test } from 'vitest'
  const myAsyncFunc = () => new Promise(resolve => resolve(1))
  test.fails('fail test', async () => {
    await expect(myAsyncFunc()).rejects.toBe(1)
  })
  ```

::: warning
You cannot use this syntax, when using Vitest as [type checker](/guide/testing-types).
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

::: warning
当使用 Vitest 作为 [type checker](/guide/testing-types) 时，不能使用此语法。
:::

## bench

- **类型:** `(name: string, fn: BenchFunction, options?: BenchOptions) => void`

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

- **类型:** `(name: string, fn: BenchFunction, options?: BenchOptions) => void`

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

- **类型:** `(name: string, fn: BenchFunction, options?: BenchOptions) => void`

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

- **类型:** `(name: string) => void`

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

如果你需要有测试层次结构，你还可以嵌套描述块：

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

如果你有测试或基准的层次结构，你还可以嵌套描述块：

```ts
import { describe, expect, test } from 'vitest'

const numberToCurrency = (value) => {
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

- **类型:** `(name: string, fn: TestFunction, options?: number | TestOptions) => void`

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

- **类型:** `(name: string, fn: TestFunction, options?: number | TestOptions) => void`

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

- **类型:** `(name: string, fn: TestFunction, options?: number | TestOptions) => void`

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

::: warning
当 Vitest 作为 [类型检查器](/guide/testing-types) 时，你不能使用此语法。
:::

### describe.shuffle

- **类型:** `(name: string, fn: TestFunction, options?: number | TestOptions) => void`

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

- **类型:** `(name: string) => void`

  使用 `describe.todo` 将稍后实现的测试套件进行存档。测试报告中将显示一个记录，以便你知道还多少条未实现的测试。

  ```ts
  // 测试套件的报告中将显示一个记录
  describe.todo('unimplemented suite')
  ```

### describe.each

- **类型:** `(cases: ReadonlyArray<T>, ...args: any[]): (name: string, fn: (...args: T[]) => void, options?: number | TestOptions) => void`

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

## expect

- **类型:** `ExpectStatic & (actual: any) => Assertions`

  `expect` 用来创建断言。在当前上下文中，可以使用 `assertions` 方法来断言一个语句。 Vitest 默认提供 `chai` 进行断言，同时基于 `chai` 实现兼容 `Jest` 的断言语句。

  例如，这里会断言 `input` 的值是否等于 `2` ，如果它们不相等，断言则会抛出错误，并且测试失败。

  ```ts
  import { expect } from 'vitest'
  
  const input = Math.sqrt(4)
  
  expect(input).to.equal(2) // chai API
  expect(input).toBe(2) // jest API
  ```

  从技术上来说，这里并没有使用 [`test`](#test) 方法，所以我们在控制台会看到 Nodejs 的报错，而不是 Vitest 的报错。想要了解更多关于 `test` 的信息，请参阅 [test 章节](#test)。

  此外，`expect` 可用于静态访问匹配器功能，这个后面会介绍。

::: warning
`expect` has no effect on testing types, if expression doesn't have a type error. If you want to use Vitest as [type checker](/guide/testing-types), use [`expectTypeOf`](#expecttypeof) or [`assertType`](#asserttype).
:::

### not

使用 `not` 将会否定断言。举例，此代码断言 `input` 的值不等于 `2`。如果它们相等，断言则会抛出错误，并且测试失败。

```ts
import { expect, test } from 'vitest'

const input = Math.sqrt(16)

expect(input).not.to.equal(2) // chai API
expect(input).not.toBe(2) // jest API
```

### toBe

- **类型:** `(value: any) => Awaitable<void>`

  `toBe` 可用于断言基础对象是否相等，或者对象是否共享相同的引用。它相当于调用了 `expect(Object.is(3, 3)).toBe(true)`。 如果对象不相同，但你想检查它们的结构是否相同，则可以使用 [`toEqual`](#toequal)。

  例如，下面的测试将会检查 stock 是否有 13 个苹果。

  ```ts
  import { expect, test } from 'vitest'
  
  const stock = {
    type: 'apples',
    count: 13,
  }
  
  test('stock has 13 apples', () => {
    expect(stock.type).toBe('apples')
    expect(stock.count).toBe(13)
  })
  
  test('stocks are the same', () => {
    const refStock = stock // 相同的引用
  
    expect(stock).toBe(refStock)
  })
  ```

  尽量不要将 `toBe` 与浮点数一起使用。由于 JavaScript 会对它们进行四舍五入，例如 `0.1 + 0.2` 的结果严格来说并不是 `0.3` 。如果需要可靠地断言浮点数，请使用 `toBeCloseTo` 进行断言。

### toBeCloseTo

- **类型:** `(value: number, numDigits?: number) => Awaitable<void>`

  使用 `toBeCloseTo` 进行浮点数的比较。可以选择使用 `numDigits` 参数限制小数点后的检查位数。例如：

  ```ts
  import { expect, test } from 'vitest'
  
  test.fails('decimals are not equal in javascript', () => {
    expect(0.2 + 0.1).toBe(0.3) // 0.2 + 0.1 is 0.30000000000000004
  })
  
  test('decimals are rounded to 5 after the point', () => {
    // 0.2 + 0.1 is 0.30000 | "000000000004" removed
    expect(0.2 + 0.1).toBeCloseTo(0.3, 5)
    // nothing from 0.30000000000000004 is removed
    expect(0.2 + 0.1).not.toBeCloseTo(0.3, 50)
  })
  ```

### toBeDefined

- **类型:** `() => Awaitable<void>`

  `toBeDefined` 断言检查值是否不等于 `undefined` 。在检查函数是否有返回值时非常有用。

  ```ts
  import { expect, test } from 'vitest'
  
  const getApples = () => 3
  
  test('function returned something', () => {
    expect(getApples()).toBeDefined()
  })
  ```

### toBeUndefined

- **类型:** `() => Awaitable<void>`

  与 `toBeDefined` 相反，`toBeUndefined` 断言检查值是否等于 `undefined` 。在检查函数是否没有返回任何内容时非常有用。

  ```ts
  import { expect, test } from 'vitest'
  
  function getApplesFromStock(stock) {
    if (stock === 'Bill')
      return 13
  }

  test('mary doesn\'t have a stock', () => {
    expect(getApplesFromStock('Mary')).toBeUndefined()
  })
  ```

### toBeTruthy

- **类型:** `() => Awaitable<void>`

  `toBeTruthy` 会将检查值转换为布尔值，断言该值是否为 `true` 。该方法在当你不关心检查值的内容，而只想知道它是否可以转换为 `true` 时很有用。

  例如下面这段代码，我们就不需要关心 `stocks.getInfo` 的返回值，可能是复杂的对象、字符串或者是其他内容，代码仍然可以运行。

  ```ts
  import { Stocks } from './stocks'
  const stocks = new Stocks()
  stocks.sync('Bill')
  if (stocks.getInfo('Bill'))
    stocks.sell('apples', 'Bill')
  ```

  所以如果我们想测试 `stocks.getInfo` 是否为 true，我们可以这样写：

  ```ts
  import { expect, test } from 'vitest'
  import { Stocks } from './stocks'
  const stocks = new Stocks()
  
  test('if we know Bill stock, sell apples to him', () => {
    stocks.sync('Bill')
    expect(stocks.getInfo('Bill')).toBeTruthy()
  })
  ```

  JavaScript 中除了 `false` ，`0` ，`''` ，`null` ，`undefined` 和 `NaN`，其他一切都是为真。

### toBeFalsy

- **类型:** `() => Awaitable<void>`

  `toBeFalsy` 会将检测值转换为布尔值，断言该值是否为 `false`。该方法在当你不关心该检查值的内容，但只想知道它是否可以转换为 `false` 时很有用。

  例如下面这段代码，我们就不需要关心 `stocks.stockFailed` 的返回值，可能是复杂的对象、字符串或者是其他内容，代码仍然可以运行。

  ```ts
  import { Stocks } from './stocks'
  const stocks = new Stocks()
  stocks.sync('Bill')
  if (!stocks.stockFailed('Bill'))
    stocks.sell('apples', 'Bill')
  ```

  所以如果我们想测试 `stocks.stockFailed` 是否为 false，我们可以这样写：

  ```ts
  import { expect, test } from 'vitest'
  import { Stocks } from './stocks'
  const stocks = new Stocks()
  
  test('if Bill stock hasn\'t failed, sell apples to him', () => {
    stocks.syncStocks('Bill')
    expect(stocks.stockFailed('Bill')).toBeFalsy()
  })
  ```

  JavaScript 中除了 `false` ，`0` ，`''` ，`null` ，`undefined` 和 `NaN`，其他一切都是为真。

### toBeNull

- **类型:** `() => Awaitable<void>`

  `toBeNull` 将简单地断言检查值是否为 `null`。 是 `.toBe(null)` 的别名。

  ```ts
  import { expect, test } from 'vitest'
  
  function apples() {
    return null
  }

  test('we don\'t have apples', () => {
    expect(apples()).toBeNull()
  })
  ```

### toBeNaN

- **类型:** `() => Awaitable<void>`

  `toBeNaN` 将简单地断言是否为 `NaN`，是 `.toBe(NaN)` 的别名。

  ```ts
  import { expect, test } from 'vitest'
  
  let i = 0
  
  function getApplesCount() {
    i++
    return i > 1 ? NaN : i
  }

  test('getApplesCount has some unusual side effects...', () => {
    expect(getApplesCount()).not.toBeNaN()
    expect(getApplesCount()).toBeNaN()
  })
  ```

### toBeTypeOf

- **类型:** `(c: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined') => Awaitable<void>`

  `toBeTypeOf` 用于断言检查值是否属于接收的类型。

  ```ts
  import { expect, test } from 'vitest'
  const actual = 'stock'
  
  test('stock is type of string', () => {
    expect(actual).toBeTypeOf('string')
  })
  ```

### toBeInstanceOf

- **类型:** `(c: any) => Awaitable<void>`

  `toBeInstanceOf` 用于断言检查值是否为接收的类的实例。

  ```ts
  import { expect, test } from 'vitest'
  import { Stocks } from './stocks'
  const stocks = new Stocks()
  
  test('stocks are instance of Stocks', () => {
    expect(stocks).toBeInstanceOf(Stocks)
  })
  ```

### toBeGreaterThan

- **类型:** `(n: number | bigint) => Awaitable<void>`

  `toBeGreaterThan` 用于断言检查值是否大于接收值，如果相等将无法通过测试。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stock'
  
  test('have more then 10 apples', () => {
    expect(getApples()).toBeGreaterThan(10)
  })
  ```

### toBeGreaterThanOrEqual

- **类型:** `(n: number | bigint) => Awaitable<void>`

  `toBeGreaterThanOrEqual` 用于断言检查值是否大于等于接收值。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stock'
  
  test('have 11 apples or more', () => {
    expect(getApples()).toBeGreaterThanOrEqual(11)
  })
  ```

### toBeLessThan

- **类型:** `(n: number | bigint) => Awaitable<void>`

  `toBeLessThan` 用于断言检查值是否小于接收值，如果相等将无法通过测试。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stock'
  
  test('have less then 20 apples', () => {
    expect(getApples()).toBeLessThan(20)
  })
  ```

### toBeLessThanOrEqual

- **类型:** `(n: number | bigint) => Awaitable<void>`

  `toBeLessThanOrEqual` 用于断言检查值是否小于等于接收值。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stock'
  
  test('have 11 apples or less', () => {
    expect(getApples()).toBeLessThanOrEqual(11)
  })
  ```

### toEqual

- **类型:** `(received: any) => Awaitable<void>`

  `toEqual` 断言检查值是否等于接收值，或者是同样的结构，如果是对象类型（将会使用递归的方法进行比较）。在本例中，你可以看到 `toEqual` 和 `toBe` 之间的区别：

  ```ts
  import { expect, test } from 'vitest'
  
  const stockBill = {
    type: 'apples',
    count: 13,
  }
  
  const stockMary = {
    type: 'apples',
    count: 13,
  }
  
  test('stocks have the same properties', () => {
    expect(stockBill).toEqual(stockMary)
  })
  
  test('stocks are not the same', () => {
    expect(stockBill).not.toBe(stockMary)
  })
  ```

  :::warning 警告
  该方法不会对 `Error` 对象执行深度相同比较。如果要测试是否抛出了某个错误，建议使用 [`toThrowError`](#tothrowerror) 断言。
  :::

### toStrictEqual

- **类型:** `(received: any) => Awaitable<void>`

  `toStrictEqual` 断言检查值是否等于接收值或者同样的结构，如果是对象类型（将会使用递归的方法进行比较），并且会比较它们是否是相同的类型。

  与 [`.toEqual`](#toequal) 之间的区别：

  - 检查属性值为 `undefined` 的键。例如使用 `.toStrictEqual` 时， `{a: undefined, b: 2}` 与 `{b: 2}` 不会匹配。
  - 检查数组的稀疏性。 例如使用 `.toStrictEqual` 时，`[, 1]` 与 `[undefined, 1]` 不会匹配。
  - 检查对象类型是否相等。例如具有字段 `a` 和 `b` 的实例对象不等于具有字段 `a` 和 `b` 的字面量对象。

  ```ts
  import { expect, test } from 'vitest'
  
  class Stock {
    constructor(type) {
      this.type = type
    }
  }

  test('structurally the same, but semantically different', () => {
    expect(new Stock('apples')).toEqual({ type: 'apples' })
    expect(new Stock('apples')).not.toStrictEqual({ type: 'apples' })
  })
  ```

### toContain

- **类型:** `(received: string) => Awaitable<void>`

  `toContain` 用于断言检查值是否在数组中。还可以检查一个字符串是否为另一个字符串的子串。

  ```ts
  import { expect, test } from 'vitest'
  import { getAllFruits } from './stock'
  
  test('the fruit list contains orange', () => {
    expect(getAllFruits()).toContain('orange')
  })
  ```

### toContainEqual

- **类型:** `(received: any) => Awaitable<void>`

  `toContainEqual` 用于断言在数组中是否包含具有特定结构和值的元素。它就像对每个元素进行 [`toEqual`](#toequal) 操作。

  ```ts
  import { expect, test } from 'vitest'
  import { getFruitStock } from './stock'
  
  test('apple available', () => {
    expect(getFruitStock()).toContainEqual({ fruit: 'apple', count: 5 })
  })
  ```

### toHaveLength

- **类型:** `(received: number) => Awaitable<void>`

  `toHaveLength` 用于断言一个对象是否具有 `.length` 属性，并且它被设置为某个数值。

  ```ts
  import { expect, test } from 'vitest'
  
  test('toHaveLength', () => {
    expect('abc').toHaveLength(3)
    expect([1, 2, 3]).toHaveLength(3)
  
    expect('').not.toHaveLength(3) // .length 的值并不是3
    expect({ length: 3 }).toHaveLength(3)
  })
  ```

### toHaveProperty

- **类型:** `(key: any, received?: any) => Awaitable<void>`

  `toHaveProperty` 用于断言对象上是否存在指定 `key` 的属性。

  同时该方法还提供了一个可选参数，用于进行深度对比，就像使用 `toEqual` 匹配器来比较接收到的属性值。

  ```ts
  import { expect, test } from 'vitest'
  
  const invoice = {
    'isActive': true,
    'P.O': '12345',
    'customer': {
      first_name: 'John',
      last_name: 'Doe',
      location: 'China',
    },
    'total_amount': 5000,
    'items': [
      {
        type: 'apples',
        quantity: 10,
      },
      {
        type: 'oranges',
        quantity: 5,
      },
    ],
  }
  
  test('John Doe Invoice', () => {
    expect(invoice).toHaveProperty('isActive') // 断言 key 存在
    expect(invoice).toHaveProperty('total_amount', 5000) // 断言 key 存在且值相等
  
    expect(invoice).not.toHaveProperty('account') // 断言 key 不存在
  
    // 使用 dot 进行深度引用
    expect(invoice).toHaveProperty('customer.first_name')
    expect(invoice).toHaveProperty('customer.last_name', 'Doe')
    expect(invoice).not.toHaveProperty('customer.location', 'India')
  
    // 使用包含 key 的数组进行深度引用
    expect(invoice).toHaveProperty('items[0].type', 'apples')
    expect(invoice).toHaveProperty('items.0.type', 'apples') // 使用 dot 也可以工作
  
    // 在数组中包装你的 key 来避免它作为深度引用
    expect(invoice).toHaveProperty(['P.O'], '12345')
  })
  ```

### toMatch

- **类型:** `(received: string | regexp) => Awaitable<void>`

  `toMatch` 用于断言字符串是否匹配指定的正则表达式或字符串。

  ```ts
  import { expect, test } from 'vitest'
  
  test('top fruits', () => {
    expect('top fruits include apple, orange and grape').toMatch(/apple/)
    expect('applefruits').toMatch('fruit') // toMatch 也可以是一个字符串
  })
  ```

### toMatchObject

- **类型:** `(received: object | array) => Awaitable<void>`

  `toMatchObject` 用于断言对象是否匹配指定的对象属性的子集。

  我们还可以传递对象数组。如果我们只想检查两个数组的元素数量是否匹配，该方法就会很有用，它不同于 `arrayContaining` ，它允许接收数组中的额外元素。

  ```ts
  import { expect, test } from 'vitest'
  
  const johnInvoice = {
    isActive: true,
    customer: {
      first_name: 'John',
      last_name: 'Doe',
      location: 'China',
    },
    total_amount: 5000,
    items: [
      {
        type: 'apples',
        quantity: 10,
      },
      {
        type: 'oranges',
        quantity: 5,
      },
    ],
  }
  
  const johnDetails = {
    customer: {
      first_name: 'John',
      last_name: 'Doe',
      location: 'China',
    },
  }
  
  test('invoice has john personal details', () => {
    expect(johnInvoice).toMatchObject(johnDetails)
  })
  
  test('the number of elements must match exactly', () => {
    // 断言对象数组是否匹配
    expect([{ foo: 'bar' }, { baz: 1 }]).toMatchObject([
      { foo: 'bar' },
      { baz: 1 },
    ])
  })
  ```

### toThrowError

- **类型:** `(received: any) => Awaitable<void>`
- **别名:** `toThrow`

  `toThrowError` 用于断言函数在调用时是否抛出错误。

  例如，如果我们想测试 `getFruitStock('pineapples')` 是否会抛出异常，我们可以这样写：

  你可以提供一个可选参数来测试是否引发了指定的错误：

  - 正则表达式：错误信息通过正则表达式匹配
  - 字符串：错误消息包含指定子串

  :::tip 提示
  你必须将代码包装在一个函数中，否则将无法捕获错误并且断言将会失败。
  :::

  ```ts
  import { expect, test } from 'vitest'
  
  function getFruitStock(type) {
    if (type === 'pineapples') {
      throw new DiabetesError(
        'Pineapples is not good for people with diabetes'
      )
    }

    // 可以做一些其他的事情
  }

  test('throws on pineapples', () => {
    // 测试错误消息是否在某处显示 "diabetes" ：这些是等效的
    expect(() => getFruitStock('pineapples')).toThrowError(/diabetes/)
    expect(() => getFruitStock('pineapples')).toThrowError('diabetes')
  
    // 测试确切的错误信息
    expect(() => getFruitStock('pineapples')).toThrowError(
      /^Pineapples is not good for people with diabetes$/
    )
  })
  ```

  :::tip
  要测试异步函数，请结合使用 [rejects](#rejects)。
  :::

### toMatchSnapshot

- **类型:** `<T>(shape?: Partial<T> | string, message?: string) => void`

  这可确保某个值匹配最近的快照。

  你可以提供附加到测试名称的可选 `hint` 字符串参数。 尽管 Vitest 总是在快照名称的末尾附加一个数字，但在区分单个 it 或测试块中的多个快照时，简短的描述性提示可能比数字更有用。 Vitest 在相应的 `.snap` 文件中按名称对快照进行排序。

  :::tip 提示
  当快照不匹配导致测试失败时，如果不匹配是预期的，你可以按 `u` 键更新一次快照。 或者可以通过 `-u` 或 `--update` CLI 选项使 Vitest 始终更新测试。
  :::

  ```ts
  import { expect, test } from 'vitest'
  
  test('matches snapshot', () => {
    const data = { foo: new Set(['bar', 'snapshot']) }
    expect(data).toMatchSnapshot()
  })
  ```

  如果你只是测试一个对象的结构，并且不需要它是 100% 兼容的，还可以提供一个对象的结构：

  ```ts
  import { expect, test } from 'vitest'
  
  test('matches snapshot', () => {
    const data = { foo: new Set(['bar', 'snapshot']) }
    expect(data).toMatchSnapshot({ foo: expect.any(Set) })
  })
  ```

### toMatchInlineSnapshot

- **类型:** `<T>(shape?: Partial<T> | string, snapshot?: string, message?: string) => void`

  这可确保某个值匹配最近的快照。

  Vitest 将 inlineSnapshot 字符串参数添加并更新到测试文件中的匹配器（而不是外部 `.snap` 文件）。

  ```ts
  import { expect, test } from 'vitest'
  
  test('matches inline snapshot', () => {
    const data = { foo: new Set(['bar', 'snapshot']) }
    // 当更新快照时，Vitest 将更新以下内容
    expect(data).toMatchInlineSnapshot(`
      {
        "foo": Set {
          "bar",
          "snapshot",
        },
      }
    `)
  })
  ```

  如果你只是测试一个对象的结构，并且不需要它是 100% 兼容的，还可以提供一个对象的结构：

  ```ts
  import { expect, test } from 'vitest'
  
  test('matches snapshot', () => {
    const data = { foo: new Set(['bar', 'snapshot']) }
    expect(data).toMatchInlineSnapshot(
      { foo: expect.any(Set) },
      `
      {
        "foo": Any<Set>,
      }
    `
    )
  })
  ```

### toThrowErrorMatchingSnapshot

- **类型:** `(message?: string) => void`

  与 [`toMatchSnapshot`](#toMatchSnapshot) 相同，但需要与 [`toThrowError`](#tothrowerror) 相同的值。

  如果函数抛出`Error`，则快照将是错误消息。 否则，快照将是函数抛出的值。

### toThrowErrorMatchingInlineSnapshot

- **类型:** `(snapshot?: string, message?: string) => void`

  与 [`toMatchInlineSnapshot`](#tomatchinlinesnapshot) 相同，但需要与 [`toThrowError`](#tothrowerror) 相同的值。

  如果函数抛出`Error`，则快照将是错误消息。 否则，快照将是函数抛出的值。

### toHaveBeenCalled

- **类型:** `() => Awaitable<void>`

  此断言可以测试一个函数是否被调用过。需要给 `expect` 传递一个监听函数。

  ```ts
  import { expect, test, vi } from 'vitest'
  
  const market = {
    buy(subject: string, amount: number) {
      // ...
    },
  }
  
  test('spy function', () => {
    const buySpy = vi.spyOn(market, 'buy')
  
    expect(buySpy).not.toHaveBeenCalled()
  
    market.buy('apples', 10)
  
    expect(buySpy).toHaveBeenCalled()
  })
  ```

### toHaveBeenCalledTimes

- **类型**: `(amount: number) => Awaitable<void>`

此断言将会检查一个函数是否被调用了一定的次数。需要给 `expect` 传递一个监听函数。

```ts
import { expect, test, vi } from 'vitest'

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
}

test('spy function called two times', () => {
  const buySpy = vi.spyOn(market, 'buy')

  market.buy('apples', 10)
  market.buy('apples', 20)

  expect(buySpy).toHaveBeenCalledTimes(2)
})
```

### toHaveBeenCalledWith

- **类型**: `(...args: any[]) => Awaitable<void>`

此断言将会检查一个函数是否被调用过，并且传入了指定的参数。需要给 `expect` 传递一个监听函数。

```ts
import { expect, test, vi } from 'vitest'

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
}

test('spy function', () => {
  const buySpy = vi.spyOn(market, 'buy')

  market.buy('apples', 10)
  market.buy('apples', 20)

  expect(buySpy).toHaveBeenCalledWith('apples', 10)
  expect(buySpy).toHaveBeenCalledWith('apples', 20)
})
```

### toHaveBeenLastCalledWith

- **类型**: `(...args: any[]) => Awaitable<void>`

此断言将会检查一个函数在最后一次被调用时，是否使用了某些参数。需要给 `expect` 传递一个监听函数。

```ts
import { expect, test, vi } from 'vitest'

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
}

test('spy function', () => {
  const buySpy = vi.spyOn(market, 'buy')

  market.buy('apples', 10)
  market.buy('apples', 20)

  expect(buySpy).not.toHaveBeenLastCalledWith('apples', 10)
  expect(buySpy).toHaveBeenLastCalledWith('apples', 20)
})
```

### toHaveBeenNthCalledWith

- **类型**: `(time: number, ...args: any[]) => Awaitable<void>`

此断言将会检查一个函数在第某次调用时是否使用了某些参数，从第 1 次开始。所以如果要检查第 2 次调用，你可以这样写 `.toHaveBeenNthCalledWith(2, ...)`。

需要给 `expect` 传递一个监听函数。

```ts
import { expect, test, vi } from 'vitest'

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
}

test('first call of spy function called with right params', () => {
  const buySpy = vi.spyOn(market, 'buy')

  market.buy('apples', 10)
  market.buy('apples', 20)

  expect(buySpy).toHaveBeenNthCalledWith(1, 'apples', 10)
})
```

### toHaveReturned

- **类型**: `() => Awaitable<void>`

此断言检查一个函数是否至少成功返回了一次值（即没有抛出错误）。需要给 `expect` 传递一个监听函数。

```ts
import { expect, test, vi } from 'vitest'

const getApplesPrice = (amount: number) => {
  const PRICE = 10
  return amount * PRICE
}

test('spy function returned a value', () => {
  const getPriceSpy = vi.fn(getApplesPrice)

  const price = getPriceSpy(10)

  expect(price).toBe(100)
  expect(getPriceSpy).toHaveReturned()
})
```

### toHaveReturnedTimes

- **类型**: `(amount: number) => Awaitable<void>`

此断言将会检查一个函数是否成功返回了确切的次数（即没有抛出错误）。需要给 `expect` 传递一个监听函数。

```ts
import { expect, test, vi } from 'vitest'

test('spy function returns a value two times', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')
  sell('bananas')

  expect(sell).toHaveReturnedTimes(2)
})
```

### toHaveReturnedWith

- **类型**: `(returnValue: any) => Awaitable<void>`

此断言将会检查一个函数是否至少一次成功返回了指定的值（即没有抛出错误）。需要给 `expect` 传递一个监听函数。

```ts
import { expect, test, vi } from 'vitest'

test('spy function returns a product', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')

  expect(sell).toHaveReturnedWith({ product: 'apples' })
})
```

### toHaveLastReturnedWith

- **类型**: `(returnValue: any) => Awaitable<void>`

此断言将会检查一个函数是否在最后一次被调用时返回了指定的值。需要给 `expect` 传递一个监听函数。

```ts
import { expect, test, vi } from 'vitest'

test('spy function returns bananas on a last call', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')
  sell('bananas')

  expect(sell).toHaveLastReturnedWith({ product: 'bananas' })
})
```

### toHaveNthReturnedWith

- **类型**: `(time: number, returnValue: any) => Awaitable<void>`

此断言将会检查一个函数是否第某次被调用时返回了指定的值。需要给 `expect` 传递一个监听函数。

```ts
import { expect, test, vi } from 'vitest'

test('spy function returns bananas on second call', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')
  sell('bananas')

  expect(sell).toHaveNthReturnedWith(2, { product: 'bananas' })
})
```

### toSatisfy

- **类型:** `(predicate: (value: any) => boolean) => Awaitable<void>`

此断言检查一个值是否满足某个谓词。

```ts
describe('toSatisfy()', () => {
  const isOdd = (value: number) => value % 2 !== 0

  it('pass with 0', () => {
    expect(1).toSatisfy(isOdd)
  })

  it('pass with negotiation', () => {
    expect(2).not.toSatisfy(isOdd)
  })
})
```

### resolves

- **类型:** `Promisify<Assertions>`

  `resolves` 可以在断言异步代码时有意地删除样板语法。使用它可以从待处理的 `Promise` 中去展开它的值，并使用通常的断言语句来断言它的值。如果 `Promise` 被拒绝，则断言将会失败。

  它返回相同的 `Assertions` 对象，但所有匹配器现在都是返回 `Promise`，因此你需要使用 `await` 去阻塞它。同样也适用于 `chai` 断言。

  例如，如果我们有一个函数，它调用 API 并返回一些数据，你可以使用下列代码来断言它的返回值：

  ```ts
  import { expect, test } from 'vitest'
  
  async function buyApples() {
    return fetch('/buy/apples').then(r => r.json())
  }

  test('buyApples returns new stock id', async () => {
    // toEqual 现在返回一个 Promise ，所以我们必须等待它
    await expect(buyApples()).resolves.toEqual({ id: 1 }) // jest API
    await expect(buyApples()).resolves.to.equal({ id: 1 }) // chai API
  })
  ```

  :::warning 警告
  如果没有等待断言，那么我们将有一个每次都会通过的误报测试。为了确保断言确实发生，我们可以使用 [`expect.assertions(number)`](#expect-assertions)。
  :::

### rejects

- **类型:** `Promisify<Assertions>`

  `rejects` 可以在断言异步代码时有意地删除样板语法。使用它可以来展开 `Promise` 被拒绝的原因，并使用通常的断言语句来断言它的值。如果 `Promise` 成功解决，则断言将失败。

  它返回相同的 `Assertions` 对象，但所有匹配器现在都返回 `Promise`，因此你需要使用 `await` 去阻塞它。同样也适用于 `chai` 断言。

  例如，如果我们有一个调用失败的函数，我们可以使用此代码来断言原因：

  ```ts
  import { expect, test } from 'vitest'
  
  async function buyApples(id) {
    if (!id)
      throw new Error('no id')
  }

  test('buyApples throws an error when no id provided', async () => {
    // toThrow 现在返回一个 Promise ，所以你必须等待它
    await expect(buyApples()).rejects.toThrow('no id')
  })
  ```

  :::warning 警告
  如果不等待断言，那么我们将有一个每次都会通过的误报测试。 为确保断言确实发生，我们可以使用 [`expect.assertions(number)`](#expect-assertions)。
  :::

### expect.assertions

- **类型:** `(count: number) => void`

  在测试通过或失败后，它将会验证在测试期间调用了多少次断言。它常用于检查异步代码是否被调用了。

  例如，如果我们有一个异步调用两个匹配器的函数，我们可以断言它们实际上是被调用的。

  ```ts
  import { expect, test } from 'vitest'
  
  async function doAsync(...cbs) {
    await Promise.all(cbs.map((cb, index) => cb({ index })))
  }

  test('all assertions are called', async () => {
    expect.assertions(2)
    function callback1(data) {
      expect(data).toBeTruthy()
    }
    function callback2(data) {
      expect(data).toBeTruthy()
    }

    await doAsync(callback1, callback2)
  })
  ```

### expect.hasAssertions

- **类型:** `() => void`

  在测试通过或失败后，它将会验证在测试期间是否至少调用了一个断言。它常用于检查是否调用了异步代码。

  例如，如果我们有一个调用回调的代码，我们可以在回调中进行断言，但如果我们不检查是否调用了断言，测试将始终通过。

  ```ts
  import { expect, test } from 'vitest'
  import { db } from './db'
  
  const cbs = []
  
  function onSelect(cb) {
    cbs.push(cb)
  }

  // 从 db 中选择后，我们调用所有的回调
  function select(id) {
    return db.select({ id }).then((data) => {
      return Promise.all(cbs.map(cb => cb(data)))
    })
  }

  test('callback was called', async () => {
    expect.hasAssertions()
    onSelect((data) => {
      // 在选择时调用
      expect(data).toBeTruthy()
    })
    // 如果不等待，测试将失败
    // 如果你没有 expect.hasAssertions()，测试将通过
    await select(3)
  })
  ```

<!-- asymmetric matchers -->

### expect.anything

- **类型:** `() => any`

  这种非对称匹配器在与相等检查一起使用时，将始终返回 `true`。 如果你只是想确保该属性存在时很有用。

  ```ts
  import { expect, test } from 'vitest'
  
  test('object has "apples" key', () => {
    expect({ apples: 22 }).toEqual({ apples: expect.anything() })
  })
  ```

### expect.any

- **类型:** `(constructor: unknown) => any`

  此非对称匹配器与相等检查一起使用时，仅当 value 是指定构造函数的实例时才会返回 `true` 。 如果你有一个每次都生成的值，并且只想知道它以正确的类型存在是很有用。

  ```ts
  import { expect, test } from 'vitest'
  import { generateId } from './generators'
  
  test('"id" is a number', () => {
    expect({ id: generateId() }).toEqual({ id: expect.any(Number) })
  })
  ```

### expect.arrayContaining

- **类型:** `<T>(expected: T[]) => any`

  当与相等检查一起使用时，如果 value 是一个数组并包含指定的选项，则此非对称匹配器将返回 `true`。

  ```ts
  import { expect, test } from 'vitest'
  
  test('basket includes fuji', () => {
    const basket = {
      varieties: ['Empire', 'Fuji', 'Gala'],
      count: 3,
    }
    expect(basket).toEqual({
      count: 3,
      varieties: expect.arrayContaining(['Fuji']),
    })
  })
  ```

  :::tip 提示
  你可以将 `expect.not` 与此匹配器一起使用来否定预期值。
  :::

### expect.objectContaining

- **类型:** `(expected: any) => any`

  当与相等检查一起使用时，如果 value 具有相似的结构，则此非对称匹配器将返回 `true`。

  ```ts
  import { expect, test } from 'vitest'
  
  test('basket has empire apples', () => {
    const basket = {
      varieties: [
        {
          name: 'Empire',
          count: 1,
        },
      ],
    }
    expect(basket).toEqual({
      varieties: [expect.objectContaining({ name: 'Empire' })],
    })
  })
  ```

  :::tip 提示
  你可以将 `expect.not` 与此匹配器一起使用来否定预期值。
  :::

### expect.stringContaining

- **类型:** `(expected: any) => any`

  当与相等检查一起使用时，如果 value 是字符串并且包含指定的子字符串，则此非对称匹配器将返回 `true`。

  ```ts
  import { expect, test } from 'vitest'
  
  test('variety has "Emp" in its name', () => {
    const variety = {
      name: 'Empire',
      count: 1,
    }
    expect(basket).toEqual({
      name: expect.stringContaining('Emp'),
      count: 1,
    })
  })
  ```

  :::tip 提示
  你可以将 `expect.not` 与此匹配器一起使用来否定预期值。
  :::

### expect.stringMatching

- **类型:** `(expected: any) => any`

  当与相等检查一起使用时，如果 value 是字符串并且包含指定的子字符串或字符串匹配正则表达式，则此非对称匹配器将返回 `true`。

  ```ts
  import { expect, test } from 'vitest'
  
  test('variety ends with "re"', () => {
    const variety = {
      name: 'Empire',
      count: 1,
    }
    expect(basket).toEqual({
      name: expect.stringMatching(/re$/),
      count: 1,
    })
  })
  ```

  :::tip 提示
  你可以将 `expect.not` 与此匹配器一起使用来否定预期值。
  :::

### expect.addSnapshotSerializer

- **类型:** `(plugin: PrettyFormatPlugin) => void`

  此方法在创建快照时添加调用的自定义序列化程序。 这是高级功能 - 如果你想了解更多信息，请阅读 [自定义序列化程序指南](/guide/snapshot#custom-serializer)。

  如果你要添加自定义序列化程序，则应在 [`setupFiles`](/config/#setupfiles) 中调用此方法。 它将影响每个快照。

  :::tip 提示
  如果你以前使用 Vue CLI 和 Jest，可能需要安装 [jest-serializer-vue](https://www.npmjs.com/package/jest-serializer-vue)。 否则，你的快照将被包裹在一个字符串中，这会导致 `"` 被转义。
  :::

### expect.extend

- **类型:** `(matchers: MatchersObject) => void`

  你可以使用自己的扩展默认匹配器。 此函数用于使用自定义匹配器扩展匹配器对象。

  当你以这种方式定义匹配器时，还创建了可以像 `expect.stringContaining` 一样使用的不对称匹配器。

  ```ts
  import { expect, test } from 'vitest'
  
  test('custom matchers', () => {
    expect.extend({
      toBeFoo: (received, expected) => {
        if (received !== 'foo') {
          return {
            message: () => `expected ${received} to be foo`,
            pass: false,
          }
        }
      },
    })
  
    expect('foo').toBeFoo()
    expect({ foo: 'foo' }).toEqual({ foo: expect.toBeFoo() })
  })
  ```

  > 如果你希望匹配器出现在每个测试中，应该在 [`setupFiles`](/config/#setupFiles) 中调用此方法。

  这个函数与 Jest 的 `expect.extend` 兼容，因此任何使用它来创建自定义匹配器的库都可以与 Vitest 一起使用。

  如果你使用的是 TypeScript，可以使用以下代码扩展默认的 Matchers 接口：

  ```ts
  interface CustomMatchers<R = unknown> {
    toBeFoo(): R
  }

  declare global {
    namespace Vi {
      interface Assertion extends CustomMatchers {}
      interface AsymmetricMatchersContaining extends CustomMatchers {}
    }
  }
  ```

  > 注意: 增加 jest.Matchers 接口也可以工作。

  :::tip 提示
  如果你想了解更多信息，请查看 [关于扩展匹配器的指南](/guide/extending-matchers)。
  :::

## expectTypeOf

- **Type:** `<T>(a: unknown) => ExpectTypeOf`

### not

- **Type:** `ExpectTypeOf`

You can negate all assertions, using `.not` property.

### toEqualTypeOf

- **Type:** `<T>(expected: T) => void`

This matcher will check, if types are fully equal to each other. This matcher will not fail, if two objects have different values, but the same type, but will fail, if object is missing a property.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf({ a: 1 }).toEqualTypeOf<{ a: number }>()
expectTypeOf({ a: 1 }).toEqualTypeOf({ a: 1 })
expectTypeOf({ a: 1 }).toEqualTypeOf({ a: 2 })
expectTypeOf({ a: 1, b: 1 }).not.toEqualTypeOf<{ a: number }>()
```

### toMatchTypeOf

- **Type:** `<T>(expected: T) => void`

This matcher checks if expect type extends provided type. It is different from `toEqual` and is more similar to expect's `toMatch`. With this matcher you can check, if an object "matches" a type.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf({ a: 1, b: 1 }).toMatchTypeOf({ a: 1 })
expectTypeOf<number>().toMatchTypeOf<string | number>()
expectTypeOf<string | number>().not.toMatchTypeOf<number>()
```

### extract

- **Type:** `ExpectTypeOf<ExtractedUnion>`

You can use `.extract` to narrow down types for further testing.

```ts
import { expectTypeOf } from 'vitest'

type ResponsiveProp<T> = T | T[] | { xs?: T; sm?: T; md?: T }
const getResponsiveProp = <T>(_props: T): ResponsiveProp<T> => ({})
interface CSSProperties {
  margin?: string
  padding?: string
}

const cssProperties: CSSProperties = { margin: '1px', padding: '2px' }

expectTypeOf(getResponsiveProp(cssProperties))
  .extract<{ xs?: any }>() // extracts the last type from a union
  .toEqualTypeOf<{
    xs?: CSSProperties
    sm?: CSSProperties
    md?: CSSProperties
  }>()

expectTypeOf(getResponsiveProp(cssProperties))
  .extract<unknown[]>() // extracts an array from a union
  .toEqualTypeOf<CSSProperties[]>()
```

::: warning
If no type is found in the union, `.extract` will return `never`.
:::

### exclude

- **Type:** `ExpectTypeOf<NonExcludedUnion>`

You can use `.exclude` to remove types from a union for further testing.

```ts
import { expectTypeOf } from 'vitest'

type ResponsiveProp<T> = T | T[] | { xs?: T; sm?: T; md?: T }
const getResponsiveProp = <T>(_props: T): ResponsiveProp<T> => ({})
interface CSSProperties {
  margin?: string
  padding?: string
}

const cssProperties: CSSProperties = { margin: '1px', padding: '2px' }

expectTypeOf(getResponsiveProp(cssProperties))
  .exclude<unknown[]>()
  .exclude<{ xs?: unknown }>() // or just .exclude<unknown[] | { xs?: unknown }>()
  .toEqualTypeOf<CSSProperties>()
```

::: warning
If no type is found in the union, `.exclude` will return `never`.
:::

### returns

- **Type:** `ExpectTypeOf<ReturnValue>`

You can use `.returns` to extract return value of a function type.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(() => {}).returns.toBeVoid()
expectTypeOf((a: number) => [a, a]).returns.toEqualTypeOf([1, 2])
```

::: warning
If used on a non-function type, it will return `never`, so you won't be able to chain it with other matchers.
:::

### parameters

- **Type:** `ExpectTypeOf<Parameters>`

You can extract function arguments with `.parameters` to perform assertions on its value. Parameters are returned as an array.

```ts
import { expectTypeOf } from 'vitest'

type NoParam = () => void
type HasParam = (s: string) => void

expectTypeOf<NoParam>().parameters.toEqualTypeOf<[]>()
expectTypeOf<HasParam>().parameters.toEqualTypeOf<[string]>()
```

::: warning
If used on a non-function type, it will return `never`, so you won't be able to chain it with other matchers.
:::

::: tip
You can also use [`.toBeCallableWith`](#tobecallablewith) matcher as a more expressive assertion.
:::

### parameter

- **Type:** `(nth: number) => ExpectTypeOf`

You can extract a certain function argument with `.parameter(number)` call to perform other assertions on it.

```ts
import { expectTypeOf } from 'vitest'

const foo = (a: number, b: string) => [a, b]

expectTypeOf(foo).parameter(0).toBeNumber()
expectTypeOf(foo).parameter(1).toBeString()
```

::: warning
If used on a non-function type, it will return `never`, so you won't be able to chain it with other matchers.
:::

### constructorParameters

- **Type:** `ExpectTypeOf<ConstructorParameters>`

You can extract constructor parameters as an array of values and perform assertions on them with this method.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(Date).constructorParameters.toEqualTypeOf<
  [] | [string | number | Date]
>()
```

::: warning
If used on a non-function type, it will return `never`, so you won't be able to chain it with other matchers.
:::

::: tip
You can also use [`.toBeConstructibleWith`](#tobeconstructiblewith) matcher as a more expressive assertion.
:::

### instance

- **Type:** `ExpectTypeOf<ConstructableInstance>`

This property gives access to matchers that can be performed on an instance of the provided class.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(Date).instance.toHaveProperty('toISOString')
```

::: warning
If used on a non-function type, it will return `never`, so you won't be able to chain it with other matchers.
:::

### items

- **Type:** `ExpectTypeOf<T>`

You can get array item type with `.items` to perform further assertions.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf([1, 2, 3]).items.toEqualTypeOf<number>()
expectTypeOf([1, 2, 3]).items.not.toEqualTypeOf<string>()
```

### resolves

- **Type:** `ExpectTypeOf<ResolvedPromise>`

This matcher extracts resolved value of a `Promise`, so you can perform other assertions on it.

```ts
import { expectTypeOf } from 'vitest'

const asyncFunc = async () => 123

expectTypeOf(asyncFunc).returns.resolves.toBeNumber()
expectTypeOf(Promise.resolve('string')).resolves.toBeString()
```

::: warning
If used on a non-promise type, it will return `never`, so you won't be able to chain it with other matchers.
:::

### guards

- **Type:** `ExpectTypeOf<Guard>`

This matcher extracts guard value (e.g., `v is number`), so you can perform assertions on it.

```ts
import { expectTypeOf } from 'vitest'

const isString = (v: any): v is string => typeof v === 'string'
expectTypeOf(isString).guards.toBeString()
```

::: warning
Returns `never`, if the value is not a guard function, so you won't be able to chain it with other matchers.
:::

### asserts

- **Type:** `ExpectTypeOf<Assert>`

This matcher extracts assert value (e.g., `assert v is number`), so you can perform assertions on it.

```ts
import { expectTypeOf } from 'vitest'

const assertNumber = (v: any): asserts v is number => {
  if (typeof v !== 'number')
    throw new TypeError('Nope !')
}

expectTypeOf(assertNumber).asserts.toBeNumber()
```

::: warning
Returns `never`, if the value is not an assert function, so you won't be able to chain it with other matchers.
:::

### toBeAny

- **Type:** `() => void`

With this matcher you can check, if provided type is `any` type. If the type is too specific, the test will fail.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf<any>().toBeAny()
expectTypeOf({} as any).toBeAny()
expectTypeOf('string').not.toBeAny()
```

### toBeUnknown

- **Type:** `() => void`

This matcher checks, if provided type is `unknown` type.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf().toBeUnknown()
expectTypeOf({} as unknown).toBeUnknown()
expectTypeOf('string').not.toBeUnknown()
```

### toBeNever

- **Type:** `() => void`

This matcher checks, if provided type is a `never` type.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf<never>().toBeNever()
expectTypeOf((): never => {}).returns.toBeNever()
```

### toBeFunction

- **Type:** `() => void`

This matcher checks, if provided type is a `functon`.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(42).not.toBeFunction()
expectTypeOf((): never => {}).toBeFunction()
```

### toBeObject

- **Type:** `() => void`

This matcher checks, if provided type is an `object`.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(42).not.toBeObject()
expectTypeOf({}).toBeObject()
```

### toBeArray

- **Type:** `() => void`

This matcher checks, if provided type is `Array<T>`.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(42).not.toBeArray()
expectTypeOf([]).toBeArray()
expectTypeOf([1, 2]).toBeArray()
expectTypeOf([{}, 42]).toBeArray()
```

### toBeString

- **Type:** `() => void`

This matcher checks, if provided type is a `string`.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(42).not.toBeString()
expectTypeOf('').toBeString()
expectTypeOf('a').toBeString()
```

### toBeBoolean

- **Type:** `() => void`

This matcher checks, if provided type is `boolean`.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(42).not.toBeBoolean()
expectTypeOf(true).toBeBoolean()
expectTypeOf<boolean>().toBeBoolean()
```

### toBeVoid

- **Type:** `() => void`

This matcher checks, if provided type is `void`.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(() => {}).returns.toBeVoid()
expectTypeOf<void>().toBeVoid()
```

### toBeSymbol

- **Type:** `() => void`

This matcher checks, if provided type is a `symbol`.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(Symbol(1)).toBeSymbol()
expectTypeOf<symbol>().toBeSymbol()
```

### toBeNull

- **Type:** `() => void`

This matcher checks, if provided type is `null`.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(null).toBeNull()
expectTypeOf<null>().toBeNull()
expectTypeOf(undefined).not.toBeNull()
```

### toBeUndefined

- **Type:** `() => void`

This matcher checks, if provided type is `undefined`.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(undefined).toBeUndefined()
expectTypeOf<undefined>().toBeUndefined()
expectTypeOf(null).not.toBeUndefined()
```

### toBeNullable

- **Type:** `() => void`

This matcher checks, if you can use `null` or `undefined` with provided type.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf<1 | undefined>().toBeNullable()
expectTypeOf<1 | null>().toBeNullable()
expectTypeOf<1 | undefined | null>().toBeNullable()
```

### toBeCallableWith

- **Type:** `() => void`

This matcher ensures you can call provided function with a set of parameters.

```ts
import { expectTypeOf } from 'vitest'

type NoParam = () => void
type HasParam = (s: string) => void

expectTypeOf<NoParam>().toBeCallableWith()
expectTypeOf<HasParam>().toBeCallableWith('some string')
```

::: warning
If used on a non-function type, it will return `never`, so you won't be able to chain it with other matchers.
:::

### toBeConstructibleWith

- **Type:** `() => void`

This matcher ensures you can create a new instance with a set of constructor parameters.

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf(Date).toBeConstructibleWith(new Date())
expectTypeOf(Date).toBeConstructibleWith('01-01-2000')
```

::: warning
If used on a non-function type, it will return `never`, so you won't be able to chain it with other matchers.
:::

### toHaveProperty

- **Type:** `<K extends keyof T>(property: K) => ExpectTypeOf<T[K>`

This matcher checks if a property exists on provided object. If it exists, it also returns the same set of matchers for the type of this property, so you can chain assertions one after another.

```ts
import { expectTypeOf } from 'vitest'

const obj = { a: 1, b: '' }

expectTypeOf(obj).toHaveProperty('a')
expectTypeOf(obj).not.toHaveProperty('c')

expectTypeOf(obj).toHaveProperty('a').toBeNumber()
expectTypeOf(obj).toHaveProperty('b').toBeString()
expectTypeOf(obj).toHaveProperty('a').not.toBeString()
```

## assertType

- **Type:** `<T>(value: T): void`

You can use this function as an alternative for `expectTypeOf` to easily assert that argument type is equal to provided generic.

```ts
import { assertType } from 'vitest'

function concat(a: string, b: string): string
function concat(a: number, b: number): number
function concat(a: string | number, b: string | number): string | number

assertType<string>(concat('a', 'b'))
assertType<number>(concat(1, 2))
// @ts-expect-error wrong types
assertType(concat('a', 2))
```

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

## Vi

Vitest 通过 **vi** 提供工具函数来帮助你。你可以 `import { vi } from 'vitest'` 或 **全局地** 访问它 (当 [globals configuration](/config/#globals) **启用** 时)。

### vi.advanceTimersByTime

- **类型:** `(ms: number) => Vitest`

  就像 `runAllTimers` 一样工作，但会在经过几毫秒后结束。例如，这将输出 `1, 2, 3` 并且不会抛出：

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)
  
  vi.advanceTimersByTime(150)
  ```

### vi.advanceTimersToNextTimer

- **类型:** `() => Vitest`

  调用下一个可调用的计时器。这在每个计时器调用间隔内进行断言很有用。你可以链式调用它来自己管理计时器。

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)
  
  vi.advanceTimersToNextTimer() // log 1
    .advanceTimersToNextTimer() // log 2
    .advanceTimersToNextTimer() // log 3
  ```

### vi.getTimerCount

- **类型:** `() => number`

  获取等待计时器的数量。

### vi.clearAllMocks

将在所有对象监听(spies)上调用 [`.mockClear()`](/api/#mockclear)。这将清除模拟对象(mock)历史，但不会将其实现重置为默认实现。

### vi.clearAllTimers

删除所有计划运行的计时器。这些计时器后续将不会运行。

### vi.dynamicImportSettled

等待加载所有导入。 如果你有一个开始导入模块的同步调用时很有用，否则你不能等待。

### vi.fn

- **类型:** `(fn?: Function) => CallableMockInstance`

  为函数创建一个监听，但也可以在没有监听的情况下启动。每次调用函数时，存储其调用参数、返回值和实例。此外，你可以使用 [methods](#mockinstance-methods) 操纵它的行为。
  如果没有给出函数，mock 将在调用时返回 `undefined`。

  ```ts
  const getApples = vi.fn(() => 0)
  
  getApples()
  
  expect(getApples).toHaveBeenCalled()
  expect(getApples).toHaveReturnedWith(0)
  
  getApples.mockReturnValueOnce(5)
  
  const res = getApples()
  expect(res).toBe(5)
  expect(getApples).toHaveNthReturnedWith(2, 5)
  ```

### vi.getMockedSystemTime

- **类型**: `() => Date | null`

  返回使用 `setSystemTime` 设置的模拟的当前日期。如果日期没有被模拟，将返回 `null`。

### vi.getRealSystemTime

- **类型**: `() => number`

  使用 `vi.useFakeTimers` 时，会模拟 `Date.now` 调用。如果需要获取毫秒级的实时时间，你可以调用这个函数。

### vi.mock

- **类型**: `(path: string, factory?: () => unknown) => void`

  用另一个模块替换提供的 `path` 中的所有导入模块。你可以在路径中使用配置的 Vite 别名。对 `vi.mock` 的调用被提升，所以你在哪里调用它并不重要。它将始终在所有导入之前执行。

  ::: warning
  `vi.mock` 仅适用于使用 `import` 关键字导入的模块。它不适用于 `require`。

  Vitest 静态分析你的文件来提升 `vi.mock`。 这意味着你不能使用不是直接从 vitest 包（例如，从某些实用程序文件）导入的 vi。要解决此问题，请始终将 `vi.mock` 与从 vitest 导入的 `vi` 一起使用，或启用 [`globals`](/config/#globals) 配置选项。
  :::

  如果定义了 `factory`，则所有导入都将返回其结果。Vitest 只调用一次工厂并缓存所有后续导入的结果，直到调用 [`vi.unmock`](#vi-unmock) 或 [`vi.doUnmock`](#vi-dounmock) 为止。

  与 `jest` 不同，工厂可以是异步的，因此你可以在内部使用 [`vi.importActual`](#vi-importactual) 或作为第一个参数接收的助手来获取原始模块。

  ```ts
  vi.mock('./path/to/module.js', async (importOriginal) => {
    const mod = await importOriginal()
    return {
      ...mod,
      // replace some exports
      namedExport: vi.fn(),
    }
  })
  ```

  ::: warning
  `vi.mock` 被提升（换句话说，_moved_）到**文件顶部**。 这意味着无论何时你编写它（无论是在 `beforeEach` 还是 `test` 中），它实际上都会在此之前被调用。

  这也意味着你不能在工厂内部使用在工厂外部定义的任何变量。

  如果你需要在工厂内部使用变量，请尝试 [`vi.doMock`](#vi-domock)。它的工作方式相同，但没有被提升。请注意，它只会模拟后续导入。
  :::

  ::: warning
  如果你正在模拟具有默认导出的模块，则需要在返回的工厂函数对象中提供一个 `default` 键。这是一个特定于 ES 模块的警告，因此 `jest` 文档可能会有所不同，因为 `jest` 使用 CommonJS 模块。例如，

  ```ts
  vi.mock('./path/to/module.js', () => {
    return {
      default: { myDefaultKey: vi.fn() },
      namedExport: vi.fn(),
      // etc...
    }
  })
  ```

  :::

  如果你正在模拟的文件同级有一个 `__mocks__` 文件夹，并且没有提供工厂，Vitest 将尝试在 `__mocks__` 子文件夹中找到一个具有相同名称的文件，并将其用作实际模块。 如果你正在模拟一个依赖项，Vitest 将尝试在项目的 [root](/config/#root) 中找到一个 `__mocks__` 文件夹（默认是 `process.cwd()`）。

  例如，你具有以下类似的文件结构：

  ```
  - __mocks__
    - axios.js
  - src
    __mocks__
      - increment.js
    - increment.js
  - tests
    - increment.test.js
  ```

  如果你在未提供工厂的情况下在测试文件中调用 `vi.mock`，它将在 `__mocks__` 文件夹中找到一个文件以用作模块：

  ```ts
  // increment.test.js
  import { vi } from 'vitest'
  // axios is a default export from `__mocks__/axios.js`
  import axios from 'axios'
  // increment is a named export from `src/__mocks__/increment.js`
  import { increment } from '../increment.js'
  
  vi.mock('axios')
  vi.mock('../increment.js')
  
  axios.get(`/apples/${increment(1)}`)
  ```

  ::: warning
  请注意，如果你不调用 `vi.mock`，模块**不会**自动模拟。
  :::

  如果没有提供 `__mocks__` 文件夹或工厂，Vitest 将导入原始模块并自动模拟其所有导出。有关应用的规则，请参阅 [自动模拟算法](/guide/mocking#自动模拟算法-automocking-algorithm)。

### vi.doMock

- **类型**: `(path: string, factory?: () => unknown) => void`

  与 [`vi.mock`](#vi-mock) 相同，但它不会提升到文件顶部，因此你可以在全局文件范围内引用变量。模块的下一次导入将被模拟。 这不会模拟在调用之前导入的模块。

```ts
// ./increment.js
export const increment = number => number + 1
```

```ts
import { beforeEach, test } from 'vitest'
import { increment } from './increment.js'

// the module is not mocked, because vi.doMock is not called yet
increment(1) === 2

let mockedIncrement = 100

beforeEach(() => {
  // simple doMock doesn't clear the previous cache, so we need to clear it manually here
  vi.doUnmock('./increment.js')
  // you can access variables inside a factory
  vi.doMock('./increment.js', () => ({ increment: () => mockedIncrement++ }))
})

test('importing the next module imports mocked one', () => {
  // original import WAS NOT MOCKED, because vi.doMock is evaluated AFTER imports
  expect(increment(1)).toBe(2)
  const { increment: mockedIncrement } = await import('./increment.js')
  // new import returns mocked module
<<<<<<<<< Temporary merge branch 1
  expect(mockedIncrement(1)).toBe(101)
  expect(mockedIncrement(1)).toBe(102)
  expect(mockedIncrement(1)).toBe(103)
})
=========
  expect(mockedIncrement(1)).toBe(101);
  expect(mockedIncrement(1)).toBe(102);
  expect(mockedIncrement(1)).toBe(103);
});
>>>>>>>>> Temporary merge branch 2
```

### vi.mocked

- **类型**: `<T>(obj: T, deep?: boolean) => MaybeMockedDeep<T>`
- **类型**: `<T>(obj: T, options?: { partial?: boolean; deep?: boolean }) => MaybePartiallyMockedDeep<T>`

  TypeScript 的类型助手。实际上只是返回传递的对象。

  当 `partial` 为 `true` 时，它会期望 `Partial<T>` 作为返回值。

  ```ts
  import example from './example'
  vi.mock('./example')
  
  test('1+1 equals 2', async () => {
    vi.mocked(example.calc).mockRestore()
  
    const res = example.calc(1, '+', 1)
  
    expect(res).toBe(2)
  })
  ```

### vi.importActual

- **类型**: `<T>(path: string) => Promise<T>`

  导入模块，如果它应该被模拟，则绕过所有检查。如果你想部分模拟模块，这可能会很有用。

  ```ts
  vi.mock('./example', async () => {
    const axios = await vi.importActual('./example')
  
    return { ...axios, get: vi.fn() }
  })
  ```

### vi.importMock

- **类型**: `<T>(path: string) => Promise<MaybeMockedDeep<T>>`

  导入一个被模拟的包含其所有属性 (包括嵌套属性) 的模块。遵循与 [`vi.mock`](#vi-mock) 相同的规则。有关应用的规则，请参阅 [自动模拟算法](/guide/mocking#自动模拟算法-automocking-algorithm)。

### vi.resetAllMocks

将在所有对象监听(spies)上调用 [`.mockReset()`](/api/#mockreset)。这将清除模拟对象历史并将其实现重置为空函数（将返回 `undefined`）。

### vi.resetConfig

- **类型**: `RuntimeConfig`

如果之前调用了 [`vi.setConfig`](/api/#vi-setconfig)，这会将配置重置为原始状态。

### vi.resetModules

- **类型**: `() => Vitest`

  通过清除所有模块的缓存来重置模块的注册表。在我们对隔离测试本地状态冲突的模块时很有用。

  ```ts
  import { vi } from 'vitest'
  
  beforeAll(() => {
    vi.resetModules()
  })
  
  test('change state', async () => {
    const mod = await import('./some/path')
    mod.changeLocalState('new value')
    expect(mod.getlocalState()).toBe('new value')
  })
  
  test('module has old state', async () => {
    const mod = await import('./some/path')
    expect(mod.getlocalState()).toBe('old value')
  })
  ```

::: warning
不重置模拟注册表。要清除模拟注册表，请使用 [`vi.unmock`](#vi-unmock) 或 [`vi.doUnmock`](#vi-dounmock)。
:::

### vi.restoreAllMocks

将在所有对象监听(spies)上调用 [`.mockRestore()`](/api/#mockrestore)。这将清除模拟对象历史并将其实现重置为原始实现。

### vi.restoreCurrentDate

- **类型**: `() => void`

  将 `Date` 恢复为系统时间。

### vi.stubEnv

- **类型:** `(name: string, value: string) => Vitest`
- **版本:** 从 Vitest 0.26.0 开始支持

  更改 `process.env` 和 `import.meta.env` 上的环境变量值。你可以通过调用 `vi.unstubAllEnvs` 恢复它的值。

```ts
import { vi } from 'vitest'

// `process.env.NODE_ENV` and `import.meta.env.NODE_ENV`
// are "development" before calling "vi.stubEnv"

vi.stubEnv('NODE_ENV', 'production')

process.env.NODE_ENV === 'production'
import.meta.env.NODE_ENV === 'production'
// doesn't change other envs
import.meta.env.MODE === 'development'
```

:::tip
你也可以通过简单地分配它来更改值，但是你将无法使用 `vi.unstubAllEnvs` 来恢复以前的值：

```ts
import.meta.env.MODE = 'test'
```

:::

:::warning
Vitest 将所有 `import.meta.env` 调用转换为 `process.env`，因此它们可以在运行时轻松更改。 Node.js 只支持字符串值作为 env 参数，而 Vite 支持几种内置的 env 作为布尔值（即 `SSR`、`DEV`、`PROD`）。为了模仿 Vite，将 "truthy" 值设置为 env：使用 `''` 来代替 `false`，使用 `'1'` 来代替 `true`。

但请注意，在这种情况下，你不能依赖 `import.meta.env.DEV === false`。使用 `!import.meta.env.DEV`。这也会影响简单的分配，而不仅仅是 `vi.stubEnv` 方法。
:::

### vi.unstubAllEnvs

- **类型:** `() => Vitest`
- **版本:** 从 Vitest 0.26.0 开始支持

  恢复使用 `vi.stubEnv` 更改的所有 `import.meta.env` 和 `process.env` 值。第一次调用时，Vitest 会记住原始值并存储它，直到再次调用 `unstubAllEnvs`。

```ts
import { vi } from 'vitest'

// `process.env.NODE_ENV` and `import.meta.env.NODE_ENV`
// are "development" before calling stubEnv

vi.stubEnv('NODE_ENV', 'production')

process.env.NODE_ENV === 'production'
import.meta.env.NODE_ENV === 'production'

vi.stubEnv('NODE_ENV', 'staging')

process.env.NODE_ENV === 'staging'
import.meta.env.NODE_ENV === 'staging'

vi.unstubAllEnvs()

// restores to the value that were stored before the first "stubEnv" call
process.env.NODE_ENV === 'development'
import.meta.env.NODE_ENV === 'development'
```

### vi.stubGlobal

- **类型:** `(name: string | number | symbol, value: uknown) => Vitest`

  改变全局变量的值。 你可以通过调用 `vi.unstubAllGlobals` 恢复其原始值。

```ts
import { vi } from 'vitest'

// `innerWidth` is "0" before callling stubGlobal

vi.stubGlobal('innerWidth', 100)

innerWidth === 100
globalThis.innerWidth === 100
// if you are using jsdom or happy-dom
window.innerWidth === 100
```

:::tip
你也可以通过简单地将其分配给 `globalThis` 或 `window` 来更改值（如果你使用的是 `jsdom` 或 `happy-dom` 环境），但是您将无法使用 `vi.unstubAllGlobals` 来恢复原始值：

```ts
globalThis.innerWidth = 100
// if you are using jsdom or happy-dom
window.innerWidth = 100
```

:::

### vi.unstubAllGlobals

- **类型:** `() => Vitest`
- **版本:** 从 Vitest 0.26.0 开始支持

  恢复 `globalThis`/`global`（和 `window`/`top`/`self`/`parent`，如果你使用 `jsdom` 或 `happy-dom` 环境）的所有全局值被 `vi.stubGlobal` 更改。第一次调用时，Vitest 会记住原始值并存储它，直到再次调用 `unstubAllGlobals`。

```ts
import { vi } from 'vitest'

const Mock = vi.fn()

// IntersectionObserver is "undefined" before calling "stubGlobal"

vi.stubGlobal('IntersectionObserver', Mock)

IntersectionObserver === Mock
global.IntersectionObserver === Mock
globalThis.IntersectionObserver === Mock
// if you are using jsdom or happy-dom
window.IntersectionObserver === Mock

vi.unstubAllGlobals()

globalThis.IntersectionObserver === undefined
'IntersectionObserver' in globalThis === false
// throws ReferenceError, because it's not defined
IntersectionObserver === undefined
```

### vi.runAllTicks

- **类型:** `() => Vitest`

  调用每个微任务。它们通常排列在 `proccess.nextTick` 中。它也将运行它们自己安排的所有微任务。

### vi.runAllTimers

- **类型:** `() => Vitest`

  此方法将调用每个被创建的计时器，直到计时器队列为空。这意味着在 `runAllTimers` 期间调用的每个计时器都将被触发。如果你有一个无限的区间，它会在 10000 次尝试后抛出。例如，这将输出 `1, 2, 3`：

  ```ts
  let i = 0
  setTimeout(() => console.log(++i))
  const interval = setInterval(() => {
    console.log(++i)
    if (i === 3)
      clearInterval(interval)
  }, 50)
  
  vi.runAllTimers()
  ```

### vi.runOnlyPendingTimers

- **类型:** `() => Vitest`

  此方法将调用在 `vi.useFakeTimers()` 调用之后创建的每个计时器。它不会触发在其调用期间创建的任何计时器。例如，这只会输出 `1`：

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)
  
  vi.runOnlyPendingTimers()
  ```

### vi.setSystemTime

- **类型**: `(date: string | number | Date) => void`

  将当前日期设置为一个过去的日期。所有 `Date` 调用都将返回此日期。

  有助于你测试依赖当前日期的任何内容 —— 例如，你代码中的 [luxon](https://github.com/moment/luxon/) 调用。

  ```ts
  const date = new Date(1998, 11, 19)
  
  vi.useFakeTimers()
  vi.setSystemTime(date)
  
  expect(Date.now()).toBe(date.valueOf())
  
  vi.useRealTimers()
  ```

### vi.setConfig

- **类型**: `RuntimeConfig`

更新当前测试文件的配置。在执行测试时，你只影响使用的值。

### vi.spyOn

- **类型:** `<T, K extends keyof T>(object: T, method: K, accessType?: 'get' | 'set') => MockInstance`

  在对象的方法或 getter/setter 上创建一个监听。

  ```ts
  let apples = 0
  const obj = {
    getApples: () => 13,
  }
  
  const spy = vi.spyOn(obj, 'getApples').mockImplementation(() => apples)
  apples = 1
  
  expect(obj.getApples()).toBe(1)
  
  expect(spy).toHaveBeenCalled()
  expect(spy).toHaveReturnedWith(1)
  ```

### vi.stubGlobal

- **类型**: `(key: keyof globalThis & Window, value: any) => Vitest`

  给全局变量赋值。 如果你使用 `jsdom` 或 `happy-dom`，也可以将值放在 `window` 对象上。

  请参考["全局 Mock" 部分](/guide/mocking.html#globals)查看更多。

### vi.unmock

- **类型**: `(path: string) => void`

  从模拟注册表中删除模块。所有对导入的调用都将返回原始模块，即使它之前被模拟过。此调用被提升（移动）到文件的顶部，因此它只会取消模拟在 `setupFiles` 中定义的模块，例如。

### vi.doUnmock

- **类型**: `(path: string) => void`

  与 [`vi.unmock`](#vi-unmock) 相同，但不会提升到文件顶部。模块的下一次导入将导入原始模块而不是模拟。这不会取消模拟以前导入的模块。

```ts
// ./increment.js
export const increment = number => number + 1
```

```ts
import { increment } from './increment.js'

// increment is already mocked, because vi.mock is hoisted
increment(1) === 100

// this is hoisted, and factory is called before the import on line 1
vi.mock('./increment.js', () => ({ increment: () => 100 }))

// all calls are mocked, and `increment` always returns 100
increment(1) === 100
increment(30) === 100

// this is not hoisted, so other import will return unmocked module
vi.doUnmock('./increment.js')

// this STILL returns 100, because `vi.doUnmock` doesn't reevaluate a module
increment(1) === 100
increment(30) === 100

// the next import is unmocked, now `increment` is the original function that returns count + 1
const { increment: unmockedIncrement } = await import('./increment.js')

unmockedIncrement(1) === 2
unmockedIncrement(30) === 31
```

### vi.useFakeTimers

- **类型:** `() => Vitest`

  要启用模拟计时器，你需要调用此方法。它将包装对计时器的所有进一步调用 (例如 `setTimeout`、`setInterval`、`clearTimeout`、`clearInterval`、`nextTick`、`setImmediate`、`clearImmediate` 和 `Date`)，直到 [`vi.useRealTimers()`](#vi-useRealTimers) 被调用。

  它的内部实现基于 [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers)。

### vi.useRealTimers

- **类型:** `() => Vitest`

  当计时器结束时，你可以调用此方法，将模拟计时器恢复其原始实现。之前运行的所有计时器将不会恢复。

## MockInstance Methods

### getMockName

- **类型:** `() => string`

  它返回使用 `.mockName(name)` 方法设置给模拟对象的名称。

### mockClear

- **类型:** `() => MockInstance`

  清除每一个对象模拟调用的所有信息。调用后，[`spy.mock.calls`](#mock-calls)、[`spy.mock.results`](#mock-results) 将返回空数组。 如果你需要清理不同断言之间的对象监听，这会很有用。

  如果你希望在每次测试之前自动调用此方法，你可以在配置中启用 [`clearMocks`](/config/#clearmocks) 设置。

### mockName

- **类型:** `(name: string) => MockInstance`

  设置内部模拟对象名称。有助于查看哪些模拟对象导致断言失败。

### mockImplementation

- **类型:** `(fn: Function) => MockInstance`

  接收一个用于模拟对象实现的函数。

  例如:

  ```ts
  const mockFn = vi.fn().mockImplementation(apples => apples + 1)
  // or: vi.fn(apples => apples + 1);
  
  const NelliesBucket = mockFn(0)
  const BobsBucket = mockFn(1)
  
  NelliesBucket === 1 // true
  BobsBucket === 2 // true
  
  mockFn.mock.calls[0][0] === 0 // true
  mockFn.mock.calls[1][0] === 1 // true
  ```

### mockImplementationOnce

- **类型:** `(fn: Function) => MockInstance`

  接收一个只会被对象模拟函数调用一次，用于模拟对象实现的函数。可以链式调用，以便多个函数调用产生不同的结果。

  ```ts
  const myMockFn = vi
    .fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => false)
  
  myMockFn() // true
  myMockFn() // false
  ```

  当对象模拟函数执行完毕，它将调用 `vi.fn(() => defaultValue)` 或 `.mockImplementation(() => defaultValue)` 设置的默认实现。如果它们被调用：

  ```ts
  const myMockFn = vi
    .fn(() => 'default')
    .mockImplementationOnce(() => 'first call')
    .mockImplementationOnce(() => 'second call')
  
  // 'first call', 'second call', 'default', 'default'
  console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
  ```

### mockRejectedValue

- **类型:** `(value: any) => MockInstance`

  当异步函数被调用时，接收一个将被拒绝 ( reject ) 的错误。

  ```ts
  test('async test', async () => {
    const asyncMock = vi.fn().mockRejectedValue(new Error('Async error'))
  
    await asyncMock() // throws "Async error"
  })
  ```

### mockRejectedValueOnce

- **类型:** `(value: any) => MockInstance`

  接收一个只会被对象模拟函数拒绝一次的值。如果链式调用，每个连续调用都将拒绝传入的值。

  ```ts
  test('async test', async () => {
    const asyncMock = vi
      .fn()
      .mockResolvedValueOnce('first call')
      .mockRejectedValueOnce(new Error('Async error'))
  
    await asyncMock() // first call
    await asyncMock() // throws "Async error"
  })
  ```

### mockReset

- **类型:** `() => MockInstance`

  执行 `mockClear` 同样的操作，并将内部实现设置为空函数 (调用时返回 `undefined` )。当你想要完全重置一个模拟对象为其初始状态时，这会很有用。

  如果你希望在每次测试之前自动调用此方法，你可以在配置中启用 [`mockReset`](/config/#mockreset) 设置。

### mockRestore

- **类型:** `() => MockInstance`

  执行 `mockReset` 同样的操作，并将内部实现恢复为初始的函数。

  请注意，从 `vi.fn()` 恢复模拟对象会将实现设置为返回 `undefined` 的空函数。恢复 `vi.fn(impl)` 会将实现恢复为 `impl`。

  如果你希望在每次测试之前自动调用此方法，我们可以在配置中启用 [`restoreMocks`](/config/#restoremocks) 设置。

### mockResolvedValue

- **类型:** `(value: any) => MockInstance`

  当异步函数被调用时，接收一个将被决议 ( resolve ) 的值。

  ```ts
  test('async test', async () => {
    const asyncMock = vi.fn().mockResolvedValue(43)
  
    await asyncMock() // 43
  })
  ```

### mockResolvedValueOnce

- **类型:** `(value: any) => MockInstance`

  接收一个只会被对象模拟函数决议一次的值。如果链式调用，每个连续调用都将决议传入的值。

  ```ts
  test('async test', async () => {
    const asyncMock = vi
      .fn()
      .mockResolvedValue('default')
      .mockResolvedValueOnce('first call')
      .mockResolvedValueOnce('second call')
  
    await asyncMock() // first call
    await asyncMock() // second call
    await asyncMock() // default
    await asyncMock() // default
  })
  ```

### mockReturnThis

- **类型:** `() => MockInstance`

  设置内部实现返回 `this` 上下文。

### mockReturnValue

- **类型:** `(value: any) => MockInstance`

  接收一个调用对象模拟函数时将返回的值。

  ```ts
  const mock = vi.fn()
  mock.mockReturnValue(42)
  mock() // 42
  mock.mockReturnValue(43)
  mock() // 43
  ```

### mockReturnValueOnce

- **类型:** `(value: any) => MockInstance`

  接收一个只会被对象模拟函数返回一次的值。如果链式调用，每个连续调用都会返回传入的值。当没有更多的 `mockReturnValueOnce` 值要使用时，调用由 `mockImplementation` 或其他 `mockReturn*` 方法指定的函数。

  ```ts
  const myMockFn = vi
    .fn()
    .mockReturnValue('default')
    .mockReturnValueOnce('first call')
    .mockReturnValueOnce('second call')
  
  // 'first call', 'second call', 'default', 'default'
  console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
  ```

## MockInstance Properties

### mock.calls

这是一个包含每个调用的所有参数的数组。数组的每一项都是该调用的参数。

如果一个函数被调用两次，并依次使用以下参数 `fn(arg1, arg2)`、`fn(arg3, arg4)`，那么 `mock.calls` 将是：

```js
[
  ['arg1', 'arg2'],
  ['arg3', 'arg4'],
]
```

### mock.lastCall

这包含最后一次调用的参数。 如果未调用 spy，将返回 `undefined`。

### mock.results

这是一个包含所有函数 `return` 的值的数组。该数组的一项是具有 `type` 和 `value` 属性的对象。可用类型有：

- `'return'` - function returned without throwing.
- `'throw'` - function threw a value.

  `value` 属性包含返回值或抛出的错误。

  如果函数返回 `result` ，然后抛出错误，那么 `mock.results` 将是：

```js
[
  {
    type: 'return',
    value: 'result',
  },
  {
    type: 'throw',
    value: Error,
  },
]
```

### mock.instances

这是一个数组，包含在使用 `new` 关键字调用 mock 时实例化的所有实例。 请注意，这是函数的实际上下文（`this`），而不是返回值。

例如，如果 mock 是用 `new MyClass()` 实例化的，那么 `mock.instances` 将是一个包含一个值的数组：

```js
import { expect, vi } from 'vitest'

const MyClass = vi.fn()

const a = new MyClass()

expect(MyClass.mock.instances[0]).toBe(a)
```

如果从构造函数返回一个值，它将不在 `instances` 数组中，而是在 `results` 中：

```js
import { expect, vi } from 'vitest'

const Spy = vi.fn(() => ({ method: vi.fn() }))

const a = new Spy()

expect(Spy.mock.instances[0]).not.toBe(a)
expect(Spy.mock.results[0]).toBe(a)
```
