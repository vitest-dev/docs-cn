---
outline: deep
---

# API 参考

下面的变量中使用了以下类型签名

```ts
type Awaitable<T> = T | PromiseLike<T>
type TestFunction = () => Awaitable<void>
```

当一个测试函数返回一个 promise 时，Vitest 将等待直到它被解决以收集异步的期望值。 如果 promise 被拒绝，测试将失败。

::: tip
在 Jest 中，`TestFunction` 也可以是 `(done: DoneCallback) => void` 类型。 如果使用此选项，则在调用 `done` 之前测试不会结束。 你可以使用 `async` 函数实现相同的目的，请参阅迁移指南中的[回调](../guide/migration#done-callback)部分。
:::

## test

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`
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

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`
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

### test.concurrent

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`
- **别名:** `it.concurrent`

  `test.concurrent` 将连续测试标记为并行运行。 它接收测试名称、带有要收集的测试的异步函数以及可选的超时时间（以毫秒为单位）。

  ```ts
  import { describe, test } from 'vitest'

  // 标有并发的两个测试将并发运行
  describe('suite', () => {
    test('serial test', async () => { /* ... */ })
    test.concurrent('concurrent test 1', async () => { /* ... */ })
    test.concurrent('concurrent test 2', async () => { /* ... */ })
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

### test.each
- **类型:** `(cases: ReadonlyArray<T>) => void`
- **别名:** `it.each`

  当你需要使用不同的变量运行相同的测试时，请使用 `test.each`。
  你可以按照测试参数的顺序，在测试名称插入符合[printf格式](https://nodejs.org/api/util.html#util_util_format_format_args)的参数。

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

## describe

当你在文件的顶层使用 `test` 时，它们将作为隐式测试套件的一部分被收集。你可以使用 `describe` 在当前上下文中定义一个新的测试套件，将其看作一组相关测试或者有别于其它的嵌套测试套件。测试套件可让你组织你的测试用例，使报告更清晰。

  ```ts
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
  import { describe, expect, test } from 'vitest'

  const numberToCurrency = (value) => {
    if (typeof value !== 'number')
      throw new Error('Value must be a number')

    return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  describe('numberToCurrency', () => {
    describe('given an invalid number', () => {
      test('composed of non-numbers to throw error', () => {
        expect(() => numberToCurrency('abc')).toThrow()
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

- **类型:** `(name: string, fn: TestFunction) => void`

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

### describe.only

- **类型:** `(name: string, fn: TestFunction) => void`

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

### describe.concurrent

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`

  使用 `describe.concurrent` 在测试套件中将每个测试标记为并发。

  ```ts
  // 该测试套件中的所有测试都将并行运行
  describe.concurrent('suite', () => {
    test('concurrent test 1', async () => { /* ... */ })
    test('concurrent test 2', async () => { /* ... */ })
    test.concurrent('concurrent test 3', async () => { /* ... */ })
  })
  ```

  `.skip`，`.only` 和 `.todo` 可以与并发测试套件一起使用。以下所有组合均有效：

  ```ts
  describe.concurrent(/* ... */)
  describe.skip.concurrent(/* ... */) // or describe.concurrent.skip(/* ... */)
  describe.only.concurrent(/* ... */) // or describe.concurrent.only(/* ... */)
  describe.todo.concurrent(/* ... */) // or describe.concurrent.todo(/* ... */)
  ```

### describe.shuffle

- **类型:** `(name: string, fn: TestFunction, timeout?: number) => void`

  Vitest 提供了一种通过 CLI 标志 [`--sequence.shuffle`](/guide/cli) 或配置选项 [`sequence.shuffle`](/config/#sequence-shuffle) 来随机运行所有测试的方法，但是如果你只想让测试套件的一部分以随机顺序运行测试，可以使用此标志对其进行标记。

  ```ts
  describe.shuffle('suite', () => {
    test('random test 1', async () => { /* ... */ })
    test('random test 2', async () => { /* ... */ })
    test('random test 3', async () => { /* ... */ })
  })
  // 执行顺序依赖于 sequence.seed 的配置选项(默认为 Date.now())
  ```

`.skip`，`.only` 和 `.todo` 可以与并发测试套件一起使用。以下所有组合均有效：

### describe.todo

- **类型:** `(name: string) => void`

  使用 `describe.todo` 将稍后实现的测试套件进行存档。测试报告中将显示一个记录，以便你知道还多少条未实现的测试。

  ```ts
  // 测试套件的报告中将显示一个记录
  describe.todo('unimplemented suite')
  ```
### describe.each

- **Type:** `(cases: ReadonlyArray<T>): (name: string, fn: (...args: T[]) => void) => void`

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

  例如，下面的测试将会检查 stock 是否有13个苹果。

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

  test('if Bill stock hasnt failed, sell apples to him', () => {
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

  test('we dont have apples', () => {
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

- **Type:** `(received: any) => Awaitable<void>`

  `toEqual` asserts if actual value is equal to received one or has the same structure, if it is an object (compares them recursively). You can see the difference between `toEqual` and [`toBe`](#tobe) in this example:

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

  :::warning
  A _deep equality_ will not be performed for `Error` objects. To test if something was thrown, use [`toThrow`](#tothrow) assertion.
  :::

### toStrictEqual

- **Type:** `(received: any) => Awaitable<void>`

  `toStrictEqual` asserts if actual value is equal to received one or has the same structure, if it is an object (compares them recursively), and of the same type.

  Differences from [`.toEqual`](#toequal):

  -  Keys with `undefined` properties are checked. e.g. `{a: undefined, b: 2}` does not match `{b: 2}` when using `.toStrictEqual`.
  -  Array sparseness is checked. e.g. `[, 1]` does not match `[undefined, 1]` when using `.toStrictEqual`.
  -  Object types are checked to be equal. e.g. A class instance with fields `a` and` b` will not equal a literal object with fields `a` and `b`.

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

- **Type:** `(received: string) => Awaitable<void>`

  `toContain` asserts if actual value is in an array. `toContain` can also check whether a string is a substring of another string.

  ```ts
  import { expect, test } from 'vitest'
  import { getAllFruits } from './stock'

  test('the fruit list contains orange', () => {
    expect(getAllFruits()).toContain('orange')
  })
  ```

### toContainEqual

- **Type:** `(received: any) => Awaitable<void>`

  `toContainEqual` asserts if an item with a specific structure and values is contained in an array.
  It works like [`toEqual`](#toequal) inside for each element.

  ```ts
  import { expect, test } from 'vitest'
  import { getFruitStock } from './stock'

  test('apple available', () => {
    expect(getFruitStock()).toContainEqual({ fruit: 'apple', count: 5 })
  })
  ```

### toHaveLength

- **Type:** `(received: number) => Awaitable<void>`

  `toHaveLength` asserts if an object has a `.length` property and it is set to a certain numeric value.

  ```ts
  import { expect, test } from 'vitest'

  test('toHaveLength', () => {
    expect('abc').toHaveLength(3)
    expect([1, 2, 3]).toHaveLength(3)

    expect('').not.toHaveLength(3) // doesn't have .length of 3
    expect({ length: 3 }).toHaveLength(3)
  })
  ```

### toHaveProperty

- **Type:** `(key: any, received?: any) => Awaitable<void>`

  `toHaveProperty` asserts if a property at provided reference `key` exists for an object.

  You can provide an optional value argument also known as deep equality, like the `toEqual` matcher to compare the received property value.

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
    expect(invoice).toHaveProperty('isActive') // assert that the key exists
    expect(invoice).toHaveProperty('total_amount', 5000) // assert that the key exists and the value is equal

    expect(invoice).not.toHaveProperty('account') // assert that this key does not exist

    // Deep referencing using dot notation
    expect(invoice).toHaveProperty('customer.first_name')
    expect(invoice).toHaveProperty('customer.last_name', 'Doe')
    expect(invoice).not.toHaveProperty('customer.location', 'India')

    // Deep referencing using an array containing the key
    expect(invoice).toHaveProperty('items[0].type', 'apples')
    expect(invoice).toHaveProperty('items.0.type', 'apples') // dot notation also works

    // Wrap your key in an array to avoid the key from being parsed as a deep reference
    expect(invoice).toHaveProperty(['P.O'], '12345')
  })
  ```

### toMatch

- **Type:** `(received: string | regexp) => Awaitable<void>`

  `toMatch` asserts if a string matches a regular expression or a string.

  ```ts
  import { expect, test } from 'vitest'

  test('top fruits', () => {
    expect('top fruits include apple, orange and grape').toMatch(/apple/)
    expect('applefruits').toMatch('fruit') // toMatch also accepts a string
  })
  ```

### toMatchObject

- **Type:** `(received: object | array) => Awaitable<void>`

  `toMatchObject` asserts if an object matches a subset of the properties of an object.

  You can also pass an array of objects. This is useful if you want to check that two arrays match in their number of elements, as opposed to `arrayContaining`, which allows for extra elements in the received array.

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
    // Assert that an array of object matches
    expect([{ foo: 'bar' }, { baz: 1 }]).toMatchObject([
      { foo: 'bar' },
      { baz: 1 },
    ])
  })
  ```

### toThrowError

- **Type:** `(received: any) => Awaitable<void>`

  `toThrowError` asserts if a function throws an error when it is called.

  For example, if we want to test that `getFruitStock('pineapples')` throws, we could write:

  You can provide an optional argument to test that a specific error is thrown:

  - regular expression: error message matches the pattern
  - string: error message includes the substring

  :::tip
    You must wrap the code in a function, otherwise the error will not be caught, and the assertion will fail.
  :::

  ```ts
  import { expect, test } from 'vitest'

  function getFruitStock(type) {
    if (type === 'pineapples')
      throw new DiabetesError('Pineapples is not good for people with diabetes')

    // Do some other stuff
  }

  test('throws on pineapples', () => {
    // Test that the error message says "diabetes" somewhere: these are equivalent
    expect(() => getFruitStock('pineapples')).toThrowError(/diabetes/)
    expect(() => getFruitStock('pineapples')).toThrowError('diabetes')

    // Test the exact error message
    expect(() => getFruitStock('pineapples')).toThrowError(
      /^Pineapples is not good for people with diabetes$/,
    )
  })
  ```

### toMatchSnapshot

- **Type:** `<T>(shape?: Partial<T> | string, message?: string) => void`

  This ensures that a value matches the most recent snapshot.

  You can provide an optional `hint` string argument that is appended to the test name. Although Vitest always appends a number at the end of a snapshot name, short descriptive hints might be more useful than numbers to differentiate multiple snapshots in a single it or test block. Vitest sorts snapshots by name in the corresponding `.snap` file.

  :::tip
    When snapshot mismatch and causing the test failing, if the mismatch is expected, you can press `u` key to update the snapshot for once. Or you can pass `-u` or `--update` CLI options to make Vitest always update the tests.
  :::

  ```ts
  import { expect, test } from 'vitest'

  test('matches snapshot', () => {
    const data = { foo: new Set(['bar', 'snapshot']) }
    expect(data).toMatchSnapshot()
  })
  ```

  You can also provide a shape of an object, if you are testing just a shape of an object, and don't need it to be 100% compatible:

  ```ts
  import { expect, test } from 'vitest'

  test('matches snapshot', () => {
    const data = { foo: new Set(['bar', 'snapshot']) }
    expect(data).toMatchSnapshot({ foo: expect.any(Set) })
  })
  ```

### toMatchInlineSnapshot

- **Type:** `<T>(shape?: Partial<T> | string, snapshot?: string, message?: string) => void`

  This ensures that a value matches the most recent snapshot.

  Vitest adds and updates the inlineSnapshot string argument to the matcher in the test file (instead of an external `.snap` file).

  ```ts
  import { expect, test } from 'vitest'

  test('matches inline snapshot', () => {
    const data = { foo: new Set(['bar', 'snapshot']) }
    // Vitest will update following content when updating the snapshot
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

  You can also provide a shape of an object, if you are testing just a shape of an object, and don't need it to be 100% compatible:

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

- **Type:** `(message?: string) => void`

  The same as [`toMatchSnapshot`](#tomatchsnapshot), but expects the same value as [`toThrowError`](#tothrowerror).

  If the function throws an `Error`, the snapshot will be the error message. Otherwise, snapshot will be the value thrown by the function.

### toThrowErrorMatchingInlineSnapshot

- **Type:** `(snapshot?: string, message?: string) => void`

  The same as [`toMatchInlineSnapshot`](#tomatchinlinesnapshot), but expects the same value as [`toThrowError`](#tothrowerror).

  If the function throws an `Error`, the snapshot will be the error message. Otherwise, snapshot will be the value thrown by the function.

### toHaveBeenCalled

- **Type:** `() => Awaitable<void>`

  This assertion is useful for testing that a function has been called. Requires a spy function to be passed to `expect`.

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

 - **Type**: `(amount: number) => Awaitable<void>`

  This assertion checks if a function was called a certain amount of times. Requires a spy function to be passed to `expect`.

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

 - **Type**: `(...args: any[]) => Awaitable<void>`

  This assertion checks if a function was called at least once with certain parameters. Requires a spy function to be passed to `expect`.

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

 - **Type**: `(...args: any[]) => Awaitable<void>`

  This assertion checks if a function was called with certain parameters at it's last invocation. Requires a spy function to be passed to `expect`.

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

 - **Type**: `(time: number, ...args: any[]) => Awaitable<void>`

  This assertion checks if a function was called with certain parameters at the certain time. The count starts at 1. So, to check the second entry, you would write `.toHaveBeenNthCalledWith(2, ...)`.

  Requires a spy function to be passed to `expect`.

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

  - **Type**: `() => Awaitable<void>`

  This assertion checks if a function has successfully returned a value at least once (i.e., did not throw an error). Requires a spy function to be passed to `expect`.

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

  - **Type**: `(amount: number) => Awaitable<void>`

  This assertion checks if a function has successfully returned a value exact amount of times (i.e., did not throw an error). Requires a spy function to be passed to `expect`.

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

  - **Type**: `(returnValue: any) => Awaitable<void>`

  You can call this assertion to check if a function has successfully returned a value with certain parameters at least once. Requires a spy function to be passed to `expect`.

  ```ts
  import { expect, test, vi } from 'vitest'

  test('spy function returns a product', () => {
    const sell = vi.fn((product: string) => ({ product }))

    sell('apples')

    expect(sell).toHaveReturnedWith({ product: 'apples' })
  })
  ```

### toHaveLastReturnedWith

  - **Type**: `(returnValue: any) => Awaitable<void>`

  You can call this assertion to check if a function has successfully returned a value with certain parameters on it's last invoking. Requires a spy function to be passed to `expect`.

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

  - **Type**: `(time: number, returnValue: any) => Awaitable<void>`

  You can call this assertion to check if a function has successfully returned a value with certain parameters on a certain call. Requires a spy function to be passed to `expect`.

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

  - **Type:** `(predicate: (value: any) => boolean) => Awaitable<void>`

  This assertion checks if a value satisfies a certain predicate.

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

- **Type:** `Promisify<Assertions>`

  `resolves` is intended to remove boilerplate when asserting asynchronous code. Use it to unwrap value from the pending promise and assert its value with usual assertions. If the promise rejects, the assertion will fail.

  It returns the same `Assertions` object, but all matchers now return `Promise`, so you would need to `await` it. Also works with `chai` assertions.

  For example, if you have a function, that makes an API call and returns some data, you may use this code to assert its return value:

  ```ts
  import { expect, test } from 'vitest'

  async function buyApples() {
    return fetch('/buy/apples').then(r => r.json())
  }

  test('buyApples returns new stock id', async () => {
    // toEqual returns a promise now, so you HAVE to await it
    await expect(buyApples()).resolves.toEqual({ id: 1 }) // jest API
    await expect(buyApples()).resolves.to.equal({ id: 1 }) // chai API
  })
  ```

  :::warning
  If the assertion is not awaited, then you will have a false-positive test that will pass every time. To make sure that assertions are actually called, you may use [`expect.assertions(number)`](#expect-assertions).
  :::

### rejects

- **Type:** `Promisify<Assertions>`

  `rejects` is intended to remove boilerplate when asserting asynchronous code. Use it to unwrap reason why promise was rejected, and assert its value with usual assertions. If promise successfully resolves, the assertion will fail.

  It returns the same `Assertions` object, but all matchers are now return `Promise`, so you would need to `await` it. Also works with `chai` assertions.

  For example, if you have a function that fails when you call it, you may use this code to assert the reason:

  ```ts
  import { expect, test } from 'vitest'

  async function buyApples(id) {
    if (!id)
      throw new Error('no id')
  }

  test('buyApples throws an error when no id provided', async () => {
    // toThrow returns a promise now, so you HAVE to await it
    await expect(buyApples()).rejects.toThrow('no id')
  })
  ```

  :::warning
  If the assertion is not awaited, then you will have a false-positive test that will pass every time. To make sure that assertions are actually happened, you may use [`expect.assertions(number)`](#expect-assertions).
  :::

### expect.assertions

- **Type:** `(count: number) => void`

  After the test has passed or failed verifies that certain number of assertions was called during a test. Useful case would be to check if an asynchronous code was called.

  For example, if we have a function that asynchronously calls two matchers, we can assert that they were actually called.

  ```ts
  import { expect, test } from 'vitest'

  async function doAsync(...cbs) {
    await Promise.all(
      cbs.map((cb, index) => cb({ index })),
    )
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

- **Type:** `() => void`

  After the test has passed or failed verifies that at least one assertion was called during a test. Useful case would be to check if an asynchronous code was called.

  For example, if you have a code that calls a callback, we can make an assertion inside a callback, but the test will always pass, if we don't check if an assertion was called.

  ```ts
  import { expect, test } from 'vitest'
  import { db } from './db'

  const cbs = []

  function onSelect(cb) {
    cbs.push(cb)
  }

  // after selecting from db, we call all callbacks
  function select(id) {
    return db.select({ id }).then((data) => {
      return Promise.all(
        cbs.map(cb => cb(data)),
      )
    })
  }

  test('callback was called', async () => {
    expect.hasAssertions()
    onSelect((data) => {
      // should be called on select
      expect(data).toBeTruthy()
    })
    // if not awaited, test will fail
    // if you dont have expect.hasAssertions(), test will pass
    await select(3)
  })
  ```

<!-- asymmetric matchers -->

### expect.anything

- **Type:** `() => any`

  This asymmetric matcher, when used with equality check, will always return `true`. Useful, if you just want to be sure that the property exist.

  ```ts
  import { expect, test } from 'vitest'

  test('object has "apples" key', () => {
    expect({ apples: 22 }).toEqual({ apples: expect.anything() })
  })
  ```

### expect.any

- **Type:** `(constructor: unknown) => any`

  This asymmetric matcher, when used with equality check, will return `true` only if value is an instance of specified constructor. Useful, if you have a value that is generated each time, and you only want to know that it exist with a proper type.

  ```ts
  import { expect, test } from 'vitest'
  import { generateId } from './generators'

  test('"id" is a number', () => {
    expect({ id: generateId() }).toEqual({ id: expect.any(Number) })
  })
  ```

### expect.arrayContaining

- **Type:** `<T>(expected: T[]) => any`

  When used with equality check, this asymmetric matcher will return `true` if value is an array and contains specified items.

  ```ts
  import { expect, test } from 'vitest'

  test('basket includes fuji', () => {
    const basket = {
      varieties: [
        'Empire',
        'Fuji',
        'Gala',
      ],
      count: 3
    }
    expect(basket).toEqual({
      count: 3,
      varieties: expect.arrayContaining(['Fuji'])
    })
  })
  ```

  :::tip
  You can use `expect.not` with this matcher to negate the expected value.
  :::

### expect.objectContaining

- **Type:** `(expected: any) => any`

  When used with equality check, this asymmetric matcher will return `true` if value has a similar shape.

  ```ts
  import { expect, test } from 'vitest'

  test('basket has empire apples', () => {
    const basket = {
      varieties: [
        {
          name: 'Empire',
          count: 1,
        }
      ],
    }
    expect(basket).toEqual({
      varieties: [
        expect.objectContaining({ name: 'Empire' }),
      ]
    })
  })
  ```

  :::tip
  You can use `expect.not` with this matcher to negate the expected value.
  :::

### expect.stringContaining

- **Type:** `(expected: any) => any`

  When used with equality check, this asymmetric matcher will return `true` if value is a string and contains specified substring.

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

  :::tip
  You can use `expect.not` with this matcher to negate the expected value.
  :::

### expect.stringMatching

- **Type:** `(expected: any) => any`

  When used with equality check, this asymmetric matcher will return `true` if value is a string and contains specified substring or the string matches regular expression.

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

  :::tip
  You can use `expect.not` with this matcher to negate the expected value.
  :::

### expect.addSnapshotSerializer

- **Type:** `(plugin: PrettyFormatPlugin) => void`

  This method adds custom serializers that are called when creating a snapshot. This is advanced feature - if you want to know more, please read a [guide on custom serializers](/guide/snapshot#custom-serializer).

  If you are adding custom serializers, you should call this method inside [`setupFiles`](/config/#setupfiles). This will affect every snapshot.

  :::tip
  If you previously used Vue CLI with Jest, you might want to install [jest-serializer-vue](https://www.npmjs.com/package/jest-serializer-vue). Otherwise, your snapshots will be wrapped in a string, which cases `"` to be escaped.
  :::

### expect.extend

- **Type:** `(matchers: MatchersObject) => void`

  You can extend default matchers with your own. This function is used to extend the matchers object with custom matchers.

  When you define matchers that way, you also create asymmetric matchers that can be used like `expect.stringContaining`.

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

  > If you want your matchers to appear in every test, you should call this method inside [`setupFiles`](/config/#setupFiles).

  This function is compatible with Jest's `expect.extend`, so any library that uses it to create custom matchers will work with Vitest.

  If you are using TypeScript, you can extend default Matchers interface with the code bellow:

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

  > Note: augmenting jest.Matchers interface will also work.

  :::tip
  If you want to know more, checkout [guide on extending matchers](/guide/extending-matchers).
  :::

## Setup and Teardown

These functions allow you to hook into the life cycle of tests to avoid repeating setup and teardown code. They apply to the current context: the file if they are used at the top-level or the current suite if they are inside a `describe` block.

### beforeEach

- **Type:** `beforeEach(fn: () => Awaitable<void>, timeout?: number)`

  Register a callback to be called before each of the tests in the current context runs.
  If the function returns a promise, Vitest waits until the promise resolve before running the test.

  Optionally, you can pass a timeout (in milliseconds) defining how long to wait before terminating. The default is 5 seconds.

  ```ts
  import { beforeEach } from 'vitest'

  beforeEach(async () => {
    // Clear mocks and add some testing data after before each test run
    await stopMocking()
    await addUser({ name: 'John' })
  })
  ```

  Here, the `beforeEach` ensures that user is added for each test.

  Since Vitest v0.10.0, `beforeEach` also accepts an optional cleanup function (equivalent to `afterEach`).

  ```ts
  import { beforeEach } from 'vitest'

  beforeEach(async () => {
    // called once before each test run
    await prepareSomething()

    // clean up function, called once after each test run
    return async () => {
      await resetSomething()
    }
  })
  ```

### afterEach

- **Type:** `afterEach(fn: () => Awaitable<void>, timeout?: number)`

  Register a callback to be called after each one of the tests in the current context completes.
  If the function returns a promise, Vitest waits until the promise resolve before continuing.

  Optionally, you can a timeout (in milliseconds) for specifying how long to wait before terminating. The default is 5 seconds.

  ```ts
  import { afterEach } from 'vitest'

  afterEach(async () => {
    await clearTestingData() // clear testing data after each test run
  })
  ```
  Here, the `afterEach` ensures that testing data is cleared after each test runs.

### beforeAll

- **Type:** `beforeAll(fn: () => Awaitable<void>, timeout?: number)`

  Register a callback to be called once before starting to run all tests in the current context.
  If the function returns a promise, Vitest waits until the promise resolve before running tests.

  Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before terminating. The default is 5 seconds.

  ```ts
  import { beforeAll } from 'vitest'

  beforeAll(async () => {
    await startMocking() // called once before all tests run
  })
  ```

  Here the `beforeAll` ensures that the mock data is set up before tests run.

  Since Vitest v0.10.0, `beforeAll` also accepts an optional cleanup function (equivalent to `afterAll`).

  ```ts
  import { beforeAll } from 'vitest'

  beforeAll(async () => {
    // called once before all tests run
    await startMocking()
  
    // clean up function, called once after all tests run
    return async () => {
      await stopMocking()
    }
  })
  ```

### afterAll

- **Type:** `afterAll(fn: () => Awaitable<void>, timeout?: number)`

  Register a callback to be called once after all tests have run in the current context.
  If the function returns a promise, Vitest waits until the promise resolve before continuing.

  Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before terminating. The default is 5 seconds.

  ```ts
  import { afterAll } from 'vitest'

  afterAll(async () => {
    await stopMocking() // this method is called after all tests run
  })
  ```

  Here the `afterAll` ensures that `stopMocking` method is called after all tests run.

## Vi
Vitest provides utility functions to help you out through it's **vi** helper. You can `import { vi } from 'vitest'` or access it **globally** (when [globals configuration](/config/#globals) is **enabled**).

### vi.advanceTimersByTime

- **Type:** `(ms: number) => Vitest`

  Works just like `runAllTimers`, but will end after passed milliseconds. For example this will log `1, 2, 3` and will not throw:

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)

  vi.advanceTimersByTime(150)
  ```

### vi.advanceTimersToNextTimer

- **Type:** `() => Vitest`

  Will call next available timer. Useful to make assertions between each timer call. You can chain call it to manage timers by yourself.

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)

  vi.advanceTimersToNextTimer() // log 1
    .advanceTimersToNextTimer() // log 2
    .advanceTimersToNextTimer() // log 3
  ```

### vi.clearAllTimers

  Removes all timers that are scheduled to run. These timers will never run in the future.

### vi.dynamicImportSettled

  Wait for all imports to load. Useful, if you have a synchronous call that starts importing a module, that you cannot wait otherwise.

### vi.fn

- **Type:** `(fn: Function) => CallableMockInstance`

  Creates a spy on a function, though can be initiated without one. Every time a function is invoked, it stores its call arguments, returns and instances. Also, you can manipulate its behavior with [methods](#mockinstance-methods).
  If no function is given, mock will return `undefined`, when invoked.

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

- **Type**: `() => Date | null`

  Returns mocked current date that was set using `setSystemTime`. If date is not mocked, will return `null`.

### vi.getRealSystemTime

- **Type**: `() => number`

  When using `vi.useFakeTimers`, `Date.now` calls are mocked. If you need to get real time in milliseconds, you can call this function.

### vi.mock

- **Type**: `(path: string, factory?: () => unknown) => void`

  Makes all `imports` to passed module to be mocked. Inside a path you _can_ use configured Vite aliases.

  - If `factory` is defined, will return its result. Factory function can be asynchronous. You may call [`vi.importActual`](#vi-importactual) inside to get the original module. The call to `vi.mock` is hoisted to the top of the file, so you don't have access to variables declared in the global file scope!
  - If mocking a module with a default export, you'll need to provide a `default` key within the returned factory function object. This is an ES modules specific caveat, therefore `jest` documentation may differ as `jest` uses commonJS modules. *Example:*

  ```ts
  vi.mock('path', () => {
    return {
      default: { myDefaultKey: vi.fn() },
      namedExport: vi.fn(),
      // etc...
    }
  })
  ```

  - If `__mocks__` folder with file of the same name exist, all imports will return its exports. For example, `vi.mock('axios')` with `<root>/__mocks__/axios.ts` folder will return everything exported from `axios.ts`.
  - If there is no `__mocks__` folder or a file with the same name inside, will call original module and mock it. (For the rules applied, see [algorithm](/guide/mocking#automocking-algorithm).)

### vi.setSystemTime

- **Type**: `(date: string | number | Date) => void`

  Sets current date to the one that was passed. All `Date` calls will return this date.

  Useful if you need to test anything that depends on the current date - for example [luxon](https://github.com/moment/luxon/) calls inside your code.

  ```ts
  const date = new Date(1998, 11, 19)

  vi.useFakeTimers()
  vi.setSystemTime(date)

  expect(Date.now()).toBe(date.valueOf())

  vi.useRealTimers()
  ```

### vi.mocked

- **Type**: `<T>(obj: T, deep?: boolean) => MaybeMockedDeep<T>`

  Type helper for TypeScript. In reality just returns the object that was passed.

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

- **Type**: `<T>(path: string) => Promise<T>`

  Imports module, bypassing all checks if it should be mocked. Can be useful if you want to mock module partially.

  ```ts
  vi.mock('./example', async () => {
    const axios = await vi.importActual('./example')

    return { ...axios, get: vi.fn() }
  })
   ```

### vi.importMock

- **Type**: `<T>(path: string) => Promise<MaybeMockedDeep<T>>`

  Imports a module with all of its properties (including nested properties) mocked. Follows the same rules that [`vi.mock`](#vi-mock) follows. For the rules applied, see [algorithm](/guide/mocking#automocking-algorithm).

### vi.resetModules

- **Type**: `() => Vitest`

  Resets modules registry by clearing cache of all modules. Might be useful to isolate modules where local state conflicts between tests.

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

### vi.restoreCurrentDate

- **Type**: `() => void`

  Restores `Date` back to its native implementation.

### vi.runAllTicks

- **Type:** `() => Vitest`

  Calls every microtask. These are usually queued by `proccess.nextTick`. This will also run all microtasks scheduled by themselves.

### vi.runAllTimers

- **Type:** `() => Vitest`

  This method will invoke every initiated timer until the timers queue is empty. It means that every timer called during `runAllTimers` will be fired. If you have an infinite interval,
  it will throw after 10 000 tries. For example this will log `1, 2, 3`:

  ```ts
  let i = 0
  setTimeout(() => console.log(++i))
  const interval = setInterval(() => {
    console.log(++i)
    if (i === 2)
      clearInterval(interval)

  }, 50)

  vi.runAllTimers()
  ```

### vi.runOnlyPendingTimers

- **Type:** `() => Vitest`

  This method will call every timer that was initiated after `vi.useFakeTimers()` call. It will not fire any timer that was initiated during its call. For example this will only log `1`:

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)

  vi.runOnlyPendingTimers()
  ```

### vi.spyOn

- **Type:** `<T, K extends keyof T>(object: T, method: K, accessType?: 'get' | 'set') => MockInstance`

  Creates a spy on a method or getter/setter of an object.

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

- **Type**: `(key: keyof globalThis & Window, value: any) => Vitest`

  Puts a value on global variable. If you are using `jsdom` or `happy-dom`, also puts the value on `window` object.

  Read more in ["Mocking Globals" section](/guide/mocking.html#globals).

### vi.unmock

- **Type**: `(path: string) => void`

  Removes module from mocked registry. All subsequent calls to import will return original module even if it was mocked.

### vi.useFakeTimers

- **Type:** `() => Vitest`

  To enable mocking timers, you need to call this method. It will wrap all further calls to timers (such as `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`, `nextTick`, `setImmediate`, `clearImmediate`, and `Date`), until [`vi.useRealTimers()`](#vi-userealtimers) is called.

  The implementation is based internally on [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers).

### vi.useRealTimers

- **Type:** `() => Vitest`

  When timers are run out, you may call this method to return mocked timers to its original implementations. All timers that were run before will not be restored.

## MockInstance Methods

### getMockName

- **Type:** `() => string`

  Use it to return the name given to mock with method `.mockName(name)`.

### mockClear

- **Type:** `() => MockInstance`

  Clears all information about every call. After calling it, [`spy.mock.calls`](#mock-calls), [`spy.mock.results`](#mock-results) will return empty arrays. It is useful if you need to clean up spy between different assertions.

  If you want this method to be called before each test automatically, you can enable [`clearMocks`](/config/#clearmocks) setting in config.


### mockName

- **Type:** `(name: string) => MockInstance`

  Sets internal mock name. Useful to see what mock has failed the assertion.

### mockImplementation

- **Type:** `(fn: Function) => MockInstance`

  Accepts a function that will be used as an implementation of the mock.

  For example:

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

- **Type:** `(fn: Function) => MockInstance`

  Accepts a function that will be used as an implementation of the mock for one call to the mocked function. Can be chained so that multiple function calls produce different results.

  ```ts
  const myMockFn = vi
    .fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => false)

  myMockFn() // true
  myMockFn() // false
  ```

  When the mocked function runs out of implementations, it will invoke the default implementation that was set with `vi.fn(() => defaultValue)` or `.mockImplementation(() => defaultValue)` if they were called:

  ```ts
  const myMockFn = vi
    .fn(() => 'default')
    .mockImplementationOnce(() => 'first call')
    .mockImplementationOnce(() => 'second call')

  // 'first call', 'second call', 'default', 'default'
  console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
  ```

### mockRejectedValue

- **Type:** `(value: any) => MockInstance`

  Accepts an error that will be rejected, when async function will be called.

  ```ts
  test('async test', async () => {
    const asyncMock = vi.fn().mockRejectedValue(new Error('Async error'))

    await asyncMock() // throws "Async error"
  })
  ```

### mockRejectedValueOnce

- **Type:** `(value: any) => MockInstance`

  Accepts a value that will be rejected for one call to the mock function. If chained, every consecutive call will reject passed value.

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

- **Type:** `() => MockInstance`

  Does what `mockClear` does and makes inner implementation as an empty function (returning `undefined`, when invoked). This is useful when you want to completely reset a mock back to its initial state.

  If you want this method to be called before each test automatically, you can enable [`mockReset`](/config/#mockreset) setting in config.

### mockRestore

- **Type:** `() => MockInstance`

  Does what `mockReset` does and restores inner implementation to the original function.

  Note that restoring mock from `vi.fn()` will set implementation to an empty function that returns `undefined`. Restoring a `vi.fn(impl)` will restore implementation to `impl`.

  If you want this method to be called before each test automatically, you can enable [`restoreMocks`](/config/#restoreMocks) setting in config.

### mockResolvedValue

- **Type:** `(value: any) => MockInstance`

  Accepts a value that will be resolved, when async function will be called.

  ```ts
  test('async test', async () => {
    const asyncMock = vi.fn().mockResolvedValue(43)

    await asyncMock() // 43
  })
  ```

### mockResolvedValueOnce

- **Type:** `(value: any) => MockInstance`

  Accepts a value that will be resolved for one call to the mock function. If chained, every consecutive call will resolve passed value.

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

- **Type:** `() => MockInstance`

  Sets inner implementation to return `this` context.

### mockReturnValue

- **Type:** `(value: any) => MockInstance`

  Accepts a value that will be returned whenever the mock function is called.

  ```ts
  const mock = vi.fn()
  mock.mockReturnValue(42)
  mock() // 42
  mock.mockReturnValue(43)
  mock() // 43
  ```

### mockReturnValueOnce

- **Type:** `(value: any) => MockInstance`

  Accepts a value that will be returned for one call to the mock function. If chained, every consecutive call will return passed value. When there are no more `mockReturnValueOnce` values to use, calls a function specified by `mockImplementation` or other `mockReturn*` methods.

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

This is an array containing all arguments for each call. One item of the array is arguments of that call.

If a function was invoked twice with the following arguments `fn(arg1, arg2)`, `fn(arg3, arg4)` in that order, then `mock.calls` will be:

```js
[
  ['arg1', 'arg2'],
  ['arg3', 'arg4'],
]
```

### mock.lastCall

This contains the arguments of the last call. If spy wasn't called, will return `undefined`.

### mock.results

This is an array containing all values, that were `returned` from function. One item of the array is an object with properties `type` and `value`. Available types are:

- `'return'` - function returned without throwing.
- `'throw'` - function threw a value.

The `value` property contains returned value or thrown error.

If function returned `result`, then threw an error, then `mock.results` will be:

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

This is an array containing all instances that were instantiated when mock was called with a `new` keyword. Note, this is an actual context (`this`) of the function, not a return value.

For example, if mock was instantiated with `new MyClass()`, then `mock.instances` will be an array of one value:

```js
import { expect, vi } from 'vitest'

const MyClass = vi.fn()

const a = new MyClass()

expect(MyClass.mock.instances[0]).toBe(a)
```

If you return a value from constructor, it will not be in `instances` array, but instead on `results`:

```js
import { expect, vi } from 'vitest'

const Spy = vi.fn(() => ({ method: vi.fn() }))

const a = new Spy()

expect(Spy.mock.instances[0]).not.toBe(a)
expect(Spy.mock.results[0]).toBe(a)
```
