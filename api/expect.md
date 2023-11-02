# expect

下面的类型在下面的类型签名中使用。

```ts
type Awaitable<T> = T | PromiseLike<T>
```

<<<<<<< HEAD
`expect` 用于创建断言。在这个上下文中，“断言”是可以调用的函数，用于断言一个语句。Vitest 默认提供 `chai` 断言，并且还提供了基于 `chai` 构建的 `Jest` 兼容断言。

例如，这段代码断言一个 `input` 值等于 `2`。如果不是，断言将抛出一个错误，测试将失败。
=======
`expect` is used to create assertions. In this context `assertions` are functions that can be called to assert a statement. Vitest provides `chai` assertions by default and also `Jest` compatible assertions build on top of `chai`.

For example, this code asserts that an `input` value is equal to `2`. If it's not, the assertion will throw an error, and the test will fail.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

```ts
import { expect } from 'vitest'

const input = Math.sqrt(4)

expect(input).to.equal(2) // chai API
expect(input).toBe(2) // jest API
```

<<<<<<< HEAD
从技术上讲，这个例子没有使用 [`test`](/api/#test) 函数，因此在控制台中，你将看到 Nodejs 错误而不是 Vitest 输出。要了解有关 `test` 的更多信息，请阅读 [测试 API 参考](/api/)。

此外，`expect` 还可以静态地使用，以访问后面描述的匹配器函数等更多功能。
=======
Technically this example doesn't use [`test`](/api/#test) function, so in the console you will see Nodejs error instead of Vitest output. To learn more about `test`, please read [Test API Reference](/api/).

Also, `expect` can be used statically to access matchers functions, described later, and more.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

::: warning
如果表达式没有类型错误，`expect` 对测试类型没有影响。如果你想将 Vitest 用作 [类型检查器](/guide/testing-types)，请使用 [`expectTypeOf`](/api/expect-typeof) 或 [`assertType`](/api/assert-type)。
:::

## soft

- **类型:** `ExpectStatic & (actual: any) => Assertions`

`expect.soft` 的功能与 `expect` 类似，但它不会在断言失败时终止测试执行，而是继续运行并将失败标记为测试失败。 测试过程中遇到的所有错误都会显示出来，直到测试完成。

```ts
import { expect, test } from 'vitest'

test('expect.soft test', () => {
  expect.soft(1 + 1).toBe(3) // mark the test as fail and continue
  expect.soft(1 + 2).toBe(4) // mark the test as fail and continue
})
// At the end of the test, the above errors will be output.
```

<<<<<<< HEAD
它也可以与 `expect` 一起使用。 如果 `expect` 断言失败，测试将终止并显示所有错误。
=======
It can also be used with `expect`. if `expect` assertion fails, the test will be terminated and all errors will be displayed.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

```ts
import { expect, test } from 'vitest'

test('expect.soft test', () => {
  expect.soft(1 + 1).toBe(3) // mark the test as fail and continue
  expect(1 + 2).toBe(3) // failed and terminate the test, all previous errors will be output
  expect.soft(1 + 2).toBe(4) // do not run
})
```

::: warning
`expect.soft` 只能在 [`test`](/api/#test) 函数内部使用。
:::

## not

<<<<<<< HEAD
使用 `not` 将否定断言。例如，这段代码断言一个 `input` 值不等于 `2`。如果相等，断言将抛出一个错误，测试将失败。
=======
Using `not` will negate the assertion. For example, this code asserts that an `input` value is not equal to `2`. If it's equal, the assertion will throw an error, and the test will fail.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

```ts
import { expect, test } from 'vitest'

const input = Math.sqrt(16)

expect(input).not.to.equal(2) // chai API
expect(input).not.toBe(2) // jest API
```

## toBe

- **类型:** `(value: any) => Awaitable<void>`

<<<<<<< HEAD
  `toBe` 可以用于断言原始类型是否相等，或者对象是否共享相同的引用。它相当于调用 `expect(Object.is(3, 3)).toBe(true)`。如果对象不同，但你想检查它们的结构是否相同，可以使用 [`toEqual`](#toequal)。

  例如，下面的代码检查交易员是否有 13 个苹果。

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
    const refStock = stock // same reference
  
    expect(stock).toBe(refStock)
  })
  ```

  请尽量不要使用 `toBe` 来比较浮点数。由于 JavaScript 对它们进行四舍五入，因此 `0.1 + 0.2` 并不严格等于 `0.3`。要可靠地断言浮点数，请使用 [`toBeCloseTo`](#tobecloseto) 断言。
=======
`toBe` can be used to assert if primitives are equal or that objects share the same reference. It is equivalent of calling `expect(Object.is(3, 3)).toBe(true)`. If the objects are not the same, but you want to check if their structures are identical, you can use [`toEqual`](#toequal).

For example, the code below checks if the trader has 13 apples.

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
  const refStock = stock // same reference

  expect(stock).toBe(refStock)
})
```

Try not to use `toBe` with floating-point numbers. Since JavaScript rounds them, `0.1 + 0.2` is not strictly `0.3`. To reliably assert floating-point numbers, use [`toBeCloseTo`](#tobecloseto) assertion.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toBeCloseTo

- **类型:** `(value: number, numDigits?: number) => Awaitable<void>`

<<<<<<< HEAD
  使用 `toBeCloseTo` 来比较浮点数。可选的 `numDigits` 参数限制在小数点后检查的数字位数。例如：

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
=======
Use `toBeCloseTo` to compare floating-point numbers. The optional `numDigits` argument limits the number of digits to check _after_ the decimal point. For example:

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
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toBeDefined

- **类型:** `() => Awaitable<void>`

<<<<<<< HEAD
  `toBeDefined` 断言该值不等于 `undefined`。一个有用的用例是检查函数是否 _返回_ 了任何值。

  ```ts
  import { expect, test } from 'vitest'
  
  function getApples() {
    return 3
  }
=======
`toBeDefined` asserts that the value is not equal to `undefined`. Useful use case would be to check if function _returned_ anything.

```ts
import { expect, test } from 'vitest'

function getApples() {
  return 3
}
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

test('function returned something', () => {
  expect(getApples()).toBeDefined()
})
```

## toBeUndefined

- **类型:** `() => Awaitable<void>`

<<<<<<< HEAD
  与 `toBeDefined` 相反，`toBeUndefined` 断言该值 _等于_ `undefined`。一个有用的用例是检查函数是否没有 _返回_ 任何值。

  ```ts
  import { expect, test } from 'vitest'
  
  function getApplesFromStock(stock) {
    if (stock === 'Bill')
      return 13
  }
=======
Opposite of `toBeDefined`, `toBeUndefined` asserts that the value _is_ equal to `undefined`. Useful use case would be to check if function hasn't _returned_ anything.

```ts
import { expect, test } from 'vitest'

function getApplesFromStock(stock) {
  if (stock === 'Bill')
    return 13
}
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

test('mary doesn\'t have a stock', () => {
  expect(getApplesFromStock('Mary')).toBeUndefined()
})
```

## toBeTruthy

- **类型:** `() => Awaitable<void>`

<<<<<<< HEAD
  `toBeTruthy` 断言该值在转换为布尔值时为 true。如果你不关心该值，但只想知道它可以转换为 `true`，则此断言非常有用。

  例如，有了这段代码，你不关心 `stocks.getInfo` 的返回值 - 它可能是一个复杂的对象、一个字符串或其他任何东西。代码仍将正常工作。

  ```ts
  import { Stocks } from './stocks.js'
  const stocks = new Stocks()
=======
`toBeTruthy` asserts that the value is true when converted to boolean. Useful if you don't care for the value, but just want to know it can be converted to `true`.

For example, having this code you don't care for the return value of `stocks.getInfo` - it maybe a complex object, a string, or anything else. The code will still work.

```ts
import { Stocks } from './stocks.js'

const stocks = new Stocks()
stocks.sync('Bill')
if (stocks.getInfo('Bill'))
  stocks.sell('apples', 'Bill')
```

So if you want to test that `stocks.getInfo` will be truthy, you could write:

```ts
import { expect, test } from 'vitest'
import { Stocks } from './stocks.js'

const stocks = new Stocks()

test('if we know Bill stock, sell apples to him', () => {
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47
  stocks.sync('Bill')
  expect(stocks.getInfo('Bill')).toBeTruthy()
})
```

<<<<<<< HEAD
  因此，如果你想测试 `stocks.getInfo` 是否为真值，你可以编写：

  ```ts
  import { expect, test } from 'vitest'
  import { Stocks } from './stocks.js'
  const stocks = new Stocks()
  
  test('if we know Bill stock, sell apples to him', () => {
    stocks.sync('Bill')
    expect(stocks.getInfo('Bill')).toBeTruthy()
  })
  ```

  在 JavaScript 中，除了 `false`、`null`、`undefined`、`NaN`、`0`、`-0`、`0n`、`""` 和 `document.all` 之外，所有值都是真值。
=======
Everything in JavaScript is truthy, except `false`, `null`, `undefined`, `NaN`, `0`, `-0`, `0n`, `""` and `document.all`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toBeFalsy

- **类型:** `() => Awaitable<void>`

<<<<<<< HEAD
  `toBeFalsy` 断言该值在转换为布尔值时为 false。如果你不关心该值，但只想知道它是否可以转换为 `false`，则此断言非常有用。

  例如，有了这段代码，你不关心 `stocks.stockFailed` 的返回值 - 它可能返回任何假值，但代码仍将正常工作。

  ```ts
  import { Stocks } from './stocks.js'
  
  const stocks = new Stocks()
  stocks.sync('Bill')
  if (!stocks.stockFailed('Bill'))
    stocks.sell('apples', 'Bill')
  ```

  因此，如果你想测试 `stocks.stockFailed` 是否为假值，你可以编写：

  ```ts
  import { expect, test } from 'vitest'
  import { Stocks } from './stocks.js'
  
  const stocks = new Stocks()
  
  test('if Bill stock hasn\'t failed, sell apples to him', () => {
    stocks.syncStocks('Bill')
    expect(stocks.stockFailed('Bill')).toBeFalsy()
  })
  ```

在 JavaScript 中，除了 `false`、`null`、`undefined`、`NaN`、`0`、`-0`、`0n`、`""` 和 `document.all` 之外，所有值都是真值。
=======
`toBeFalsy` asserts that the value is false when converted to boolean. Useful if you don't care for the value, but just want to know if it can be converted to `false`.

For example, having this code you don't care for the return value of `stocks.stockFailed` - it may return any falsy value, but the code will still work.

```ts
import { Stocks } from './stocks.js'

const stocks = new Stocks()
stocks.sync('Bill')
if (!stocks.stockFailed('Bill'))
  stocks.sell('apples', 'Bill')
```

So if you want to test that `stocks.stockFailed` will be falsy, you could write:

```ts
import { expect, test } from 'vitest'
import { Stocks } from './stocks.js'

const stocks = new Stocks()

test('if Bill stock hasn\'t failed, sell apples to him', () => {
  stocks.syncStocks('Bill')
  expect(stocks.stockFailed('Bill')).toBeFalsy()
})
```

Everything in JavaScript is truthy, except `false`, `null`, `undefined`, `NaN`, `0`, `-0`, `0n`, `""` and `document.all`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toBeNull

- **类型:** `() => Awaitable<void>`

<<<<<<< HEAD
  `toBeNull` 简单地断言某个值是否为 `null`。是 `.toBe(null)` 的别名。

  ```ts
  import { expect, test } from 'vitest'
  
  function apples() {
    return null
  }
=======
`toBeNull` simply asserts if something is `null`. Alias for `.toBe(null)`.

```ts
import { expect, test } from 'vitest'

function apples() {
  return null
}
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

test('we don\'t have apples', () => {
  expect(apples()).toBeNull()
})
```

## toBeNaN

- **类型:** `() => Awaitable<void>`

<<<<<<< HEAD
  `toBeNaN` 简单地断言某个值是否为 `NaN`。是 `.toBe(NaN)` 的别名。

  ```ts
  import { expect, test } from 'vitest'
  
  let i = 0
  
  function getApplesCount() {
    i++
    return i > 1 ? Number.NaN : i
  }
=======
`toBeNaN` simply asserts if something is `NaN`. Alias for `.toBe(NaN)`.

```ts
import { expect, test } from 'vitest'

let i = 0

function getApplesCount() {
  i++
  return i > 1 ? Number.NaN : i
}
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

test('getApplesCount has some unusual side effects...', () => {
  expect(getApplesCount()).not.toBeNaN()
  expect(getApplesCount()).toBeNaN()
})
```

## toBeTypeOf

- **类型:** `(c: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined') => Awaitable<void>`

<<<<<<< HEAD
  `toBeTypeOf` 断言实际值是否为接收到的类型。

  ```ts
  import { expect, test } from 'vitest'
  
  const actual = 'stock'
  
  test('stock is type of string', () => {
    expect(actual).toBeTypeOf('string')
  })
  ```
=======
`toBeTypeOf` asserts if an actual value is of type of received type.

```ts
import { expect, test } from 'vitest'

const actual = 'stock'

test('stock is type of string', () => {
  expect(actual).toBeTypeOf('string')
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toBeInstanceOf

- **类型:** `(c: any) => Awaitable<void>`

<<<<<<< HEAD
  `toBeInstanceOf` 断言实际值是否为接收到的类的实例。

  ```ts
  import { expect, test } from 'vitest'
  import { Stocks } from './stocks.js'
  
  const stocks = new Stocks()
  
  test('stocks are instance of Stocks', () => {
    expect(stocks).toBeInstanceOf(Stocks)
  })
  ```
=======
`toBeInstanceOf` asserts if an actual value is instance of received class.

```ts
import { expect, test } from 'vitest'
import { Stocks } from './stocks.js'

const stocks = new Stocks()

test('stocks are instance of Stocks', () => {
  expect(stocks).toBeInstanceOf(Stocks)
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toBeGreaterThan

- **类型:** `(n: number | bigint) => Awaitable<void>`

<<<<<<< HEAD
  `toBeGreaterThan` 断言实际值是否大于接收到的值。相等的值将导致测试失败。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stocks.js'
  
  test('have more then 10 apples', () => {
    expect(getApples()).toBeGreaterThan(10)
  })
  ```
=======
`toBeGreaterThan` asserts if actual value is greater than received one. Equal values will fail the test.

```ts
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have more then 10 apples', () => {
  expect(getApples()).toBeGreaterThan(10)
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toBeGreaterThanOrEqual

- **类型:** `(n: number | bigint) => Awaitable<void>`

<<<<<<< HEAD
  `toBeGreaterThanOrEqual` 断言实际值是否大于或等于接收到的值。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stocks.js'
  
  test('have 11 apples or more', () => {
    expect(getApples()).toBeGreaterThanOrEqual(11)
  })
  ```
=======
`toBeGreaterThanOrEqual` asserts if actual value is greater than received one or equal to it.

```ts
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have 11 apples or more', () => {
  expect(getApples()).toBeGreaterThanOrEqual(11)
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toBeLessThan

- **类型:** `(n: number | bigint) => Awaitable<void>`

<<<<<<< HEAD
  `toBeLessThan` 断言实际值是否小于接收到的值。相等的值将导致测试失败。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stocks.js'
  
  test('have less then 20 apples', () => {
    expect(getApples()).toBeLessThan(20)
  })
  ```
=======
`toBeLessThan` asserts if actual value is less than received one. Equal values will fail the test.

```ts
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have less then 20 apples', () => {
  expect(getApples()).toBeLessThan(20)
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toBeLessThanOrEqual

- **类型:** `(n: number | bigint) => Awaitable<void>`

<<<<<<< HEAD
  `toBeLessThanOrEqual` 断言实际值是否小于或等于接收到的值。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stocks.js'
  
  test('have 11 apples or less', () => {
    expect(getApples()).toBeLessThanOrEqual(11)
  })
  ```
=======
`toBeLessThanOrEqual` asserts if actual value is less than received one or equal to it.

```ts
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have 11 apples or less', () => {
  expect(getApples()).toBeLessThanOrEqual(11)
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toEqual

- **类型:** `(received: any) => Awaitable<void>`

<<<<<<< HEAD
  `toEqual` 断言实际值是否等于接收到的值或具有相同的结构（如果是对象，则递归比较它们）。你可以在此示例中看到 `toEqual` 和 [`toBe`](#tobe) 之间的区别：

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
  对于 `Error` 对象，不会执行 _深度相等性_。要测试是否抛出了某些内容，请使用 [`toThrowError`](#tothrowerror) 断言。
  :::
=======
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
A _deep equality_ will not be performed for `Error` objects. To test if something was thrown, use [`toThrowError`](#tothrowerror) assertion.
:::
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toStrictEqual

- **类型:** `(received: any) => Awaitable<void>`

<<<<<<< HEAD
  `toStrictEqual` 断言实际值是否等于接收到的值或具有相同的结构（如果是对象，则递归比较它们），并且类型相同。

  与 [`.toEqual`](#toequal) 的区别：

  - 检查具有 `undefined` 属性的键。例如，使用 `.toStrictEqual` 时，`{a: undefined, b: 2}` 不匹配 `{b: 2}`。
  - 检查数组的稀疏性。例如，使用 `.toStrictEqual` 时，`[, 1]` 不匹配 `[undefined, 1]`。
  - 检查对象类型是否相等。例如，具有字段 `a` 和 `b` 的类实例将不等于具有字段 `a` 和 `b` 的字面对象。

  ```ts
  import { expect, test } from 'vitest'
  
  class Stock {
    constructor(type) {
      this.type = type
    }
=======
`toStrictEqual` asserts if the actual value is equal to the received one or has the same structure if it is an object (compares them recursively), and of the same type.

Differences from [`.toEqual`](#toequal):

-  Keys with `undefined` properties are checked. e.g. `{a: undefined, b: 2}` does not match `{b: 2}` when using `.toStrictEqual`.
-  Array sparseness is checked. e.g. `[, 1]` does not match `[undefined, 1]` when using `.toStrictEqual`.
-  Object types are checked to be equal. e.g. A class instance with fields `a` and` b` will not equal a literal object with fields `a` and `b`.

```ts
import { expect, test } from 'vitest'

class Stock {
  constructor(type) {
    this.type = type
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47
  }
}

test('structurally the same, but semantically different', () => {
  expect(new Stock('apples')).toEqual({ type: 'apples' })
  expect(new Stock('apples')).not.toStrictEqual({ type: 'apples' })
})
```

## toContain

- **类型:** `(received: string) => Awaitable<void>`

<<<<<<< HEAD
  `toContain` 断言实际值是否在数组中。`toContain` 还可以检查一个字符串是否是另一个字符串的子字符串。

  ```ts
  import { expect, test } from 'vitest'
  import { getAllFruits } from './stocks.js'
  
  test('the fruit list contains orange', () => {
    expect(getAllFruits()).toContain('orange')
  })
  ```
=======
`toContain` asserts if the actual value is in an array. `toContain` can also check whether a string is a substring of another string.

```ts
import { expect, test } from 'vitest'
import { getAllFruits } from './stocks.js'

test('the fruit list contains orange', () => {
  expect(getAllFruits()).toContain('orange')
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toContainEqual

- **类型:** `(received: any) => Awaitable<void>`

<<<<<<< HEAD
  `toContainEqual` 断言是否包含具有特定结构和值的项在数组中。它在每个元素内部像 [`toEqual`](#toequal) 一样工作。

  ```ts
  import { expect, test } from 'vitest'
  import { getFruitStock } from './stocks.js'
  
  test('apple available', () => {
    expect(getFruitStock()).toContainEqual({ fruit: 'apple', count: 5 })
  })
  ```
=======
`toContainEqual` asserts if an item with a specific structure and values is contained in an array.
It works like [`toEqual`](#toequal) inside for each element.

```ts
import { expect, test } from 'vitest'
import { getFruitStock } from './stocks.js'

test('apple available', () => {
  expect(getFruitStock()).toContainEqual({ fruit: 'apple', count: 5 })
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toHaveLength

- **类型:** `(received: number) => Awaitable<void>`

<<<<<<< HEAD
  `toHaveLength` 断言对象是否具有 `.length` 属性，并且该属性设置为特定的数字值。

  ```ts
  import { expect, test } from 'vitest'
  
  test('toHaveLength', () => {
    expect('abc').toHaveLength(3)
    expect([1, 2, 3]).toHaveLength(3)
  
    expect('').not.toHaveLength(3) // doesn't have .length of 3
    expect({ length: 3 }).toHaveLength(3)
  })
  ```
=======
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
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toHaveProperty

- **类型:** `(key: any, received?: any) => Awaitable<void>`

<<<<<<< HEAD
  `toHaveProperty` 断言对象是否存在提供的引用 `key` 的属性。

  你可以提供一个可选的值参数，也称为深度相等性，例如 `toEqual` 匹配器，以比较接收到的属性值。

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
  
    // Deep referencing using an array containing the keyPath
    expect(invoice).toHaveProperty(['items', 0, 'type'], 'apples')
    expect(invoice).toHaveProperty(['items', '0', 'type'], 'apples') // string notation also works
  
    // Wrap your key in an array to avoid the key from being parsed as a deep reference
    expect(invoice).toHaveProperty(['P.O'], '12345')
  })
  ```
=======
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

  // Deep referencing using an array containing the keyPath
  expect(invoice).toHaveProperty(['items', 0, 'type'], 'apples')
  expect(invoice).toHaveProperty(['items', '0', 'type'], 'apples') // string notation also works

  // Wrap your key in an array to avoid the key from being parsed as a deep reference
  expect(invoice).toHaveProperty(['P.O'], '12345')
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toMatch

- **类型:** `(received: string | regexp) => Awaitable<void>`

<<<<<<< HEAD
  `toMatch` 断言字符串是否与正则表达式或字符串匹配。

  ```ts
  import { expect, test } from 'vitest'
  
  test('top fruits', () => {
    expect('top fruits include apple, orange and grape').toMatch(/apple/)
    expect('applefruits').toMatch('fruit') // toMatch also accepts a string
  })
  ```
=======
`toMatch` asserts if a string matches a regular expression or a string.

```ts
import { expect, test } from 'vitest'

test('top fruits', () => {
  expect('top fruits include apple, orange and grape').toMatch(/apple/)
  expect('applefruits').toMatch('fruit') // toMatch also accepts a string
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

::: tip
如果错误消息中的值被截断得太多，你可以在配置文件中增加 [chaiConfig.truncateThreshold](/config/#chaiconfig-truncatethreshold)。
:::

## toMatchObject

- **类型:** `(received: object | array) => Awaitable<void>`

<<<<<<< HEAD
  `toMatchObject` 断言对象是否与对象的一部分属性匹配。

  你还可以传递一个对象数组。如果你想检查两个数组在元素数量上是否匹配，这非常有用，与 `arrayContaining` 相反，它允许接收到的数组中有额外的元素。

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
=======
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
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toThrowError

- **类型:** `(received: any) => Awaitable<void>`

- **别名:** `toThrow`

<<<<<<< HEAD
  `toThrowError` 断言当调用函数时是否抛出错误。

  你可以提供一个可选参数来测试是否抛出了特定的错误：

  - 正则表达式：错误消息与模式匹配
  - 字符串：错误消息包含子字符串

  :::tip
  你必须将代码包装在一个函数中，否则错误将不会被捕获，测试将失败。
  :::

  例如，如果我们想测试 `getFruitStock('pineapples')` 是否会抛出错误，我们可以编写：

  ```ts
  import { expect, test } from 'vitest'
  
  function getFruitStock(type) {
    if (type === 'pineapples') {
      throw new DiabetesError(
        'Pineapples are not good for people with diabetes'
      )
    }
=======
`toThrowError` asserts if a function throws an error when it is called.

You can provide an optional argument to test that a specific error is thrown:

- regular expression: error message matches the pattern
- string: error message includes the substring

:::tip
You must wrap the code in a function, otherwise the error will not be caught, and test will fail.
:::

For example, if we want to test that `getFruitStock('pineapples')` throws, we could write:

```ts
import { expect, test } from 'vitest'

function getFruitStock(type) {
  if (type === 'pineapples')
    throw new DiabetesError('Pineapples are not good for people with diabetes')
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

  // Do some other stuff
}

<<<<<<< HEAD
  test('throws on pineapples', () => {
    // Test that the error message says "diabetes" somewhere: these are equivalent
    expect(() => getFruitStock('pineapples')).toThrowError(/diabetes/)
    expect(() => getFruitStock('pineapples')).toThrowError('diabetes')
  
    // Test the exact error message
    expect(() => getFruitStock('pineapples')).toThrowError(
      /^Pineapples are not good for people with diabetes$/
    )
  })
  ```

  :::tip
  要测试异步函数，请与 [rejects](#rejects) 结合使用。
=======
test('throws on pineapples', () => {
  // Test that the error message says "diabetes" somewhere: these are equivalent
  expect(() => getFruitStock('pineapples')).toThrowError(/diabetes/)
  expect(() => getFruitStock('pineapples')).toThrowError('diabetes')

  // Test the exact error message
  expect(() => getFruitStock('pineapples')).toThrowError(
    /^Pineapples are not good for people with diabetes$/,
  )
})
```

:::tip
To test async functions, use in combination with [rejects](#rejects).
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

```js
function getAsyncFruitStock() {
  return Promise.reject(new Error('empty'))
}

<<<<<<< HEAD
  test('throws on pineapples', async () => {
    await expect(() => getAsyncFruitStock()).rejects.toThrowError('empty')
  })
  ```

  :::
=======
test('throws on pineapples', async () => {
  await expect(() => getAsyncFruitStock()).rejects.toThrowError('empty')
})
```
:::
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toMatchSnapshot

- **类型:** `<T>(shape?: Partial<T> | string, message?: string) => void`

<<<<<<< HEAD
  这确保了一个值与最近的快照匹配。

  你可以提供一个可选的 `hint` 字符串参数，该参数附加到测试名称。尽管 Vitest 总是在快照名称的末尾附加一个数字，但短的描述性提示可能比数字更有用，以区分单个 it 或 test 块中的多个快照。Vitest 按名称对相应的 `.snap` 文件中的快照进行排序。

  :::tip
  当快照不匹配并导致测试失败时，如果预期不匹配，你可以按 `u` 键更新一次快照。或者，你可以传递 `-u` 或 `--update` CLI 选项，使 Vitest 始终更新测试。
  :::

  ```ts
  import { expect, test } from 'vitest'
  
  test('matches snapshot', () => {
    const data = { foo: new Set(['bar', 'snapshot']) }
    expect(data).toMatchSnapshot()
  })
  ```

  如果你只测试对象的形状，并且不需要它完全兼容，你还可以提供一个对象的形状：

  ```ts
  import { expect, test } from 'vitest'
  
  test('matches snapshot', () => {
    const data = { foo: new Set(['bar', 'snapshot']) }
    expect(data).toMatchSnapshot({ foo: expect.any(Set) })
  })
  ```
=======
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
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toMatchInlineSnapshot

- **类型:** `<T>(shape?: Partial<T> | string, snapshot?: string, message?: string) => void`

<<<<<<< HEAD
  这确保了一个值与最近的快照匹配。

  Vitest 将内联快照字符串参数添加到测试文件中的匹配器中（而不是外部的 `.snap` 文件），并更新它。

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

  如果你只测试对象的形状，并且不需要它 100% 兼容，你还可以提供一个对象的形状：

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
=======
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
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47
    `
    {
      "foo": Any<Set>,
    }
  `
  )
})
```

## toMatchFileSnapshot

- **类型:** `<T>(filepath: string, message?: string) => Promise<void>`
- **版本:** Since Vitest 0.30.0

<<<<<<< HEAD
  与指定的文件内容显式比较或更新快照（而不是 `.snap` 文件）。

  ```ts
  import { expect, it } from 'vitest'
  
  it('render basic', async () => {
    const result = renderHTML(h('div', { class: 'foo' }))
    await expect(result).toMatchFileSnapshot('./test/basic.output.html')
  })
  ```

  请注意，由于文件系统操作是异步的，你需要在 `toMatchFileSnapshot()` 中使用 `await`。
=======
Compare or update the snapshot with the content of a file explicitly specified (instead of the `.snap` file).

```ts
import { expect, it } from 'vitest'

it('render basic', async () => {
  const result = renderHTML(h('div', { class: 'foo' }))
  await expect(result).toMatchFileSnapshot('./test/basic.output.html')
})
```

Note that since file system operation is async, you need to use `await` with `toMatchFileSnapshot()`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toThrowErrorMatchingSnapshot

- **类型:** `(message?: string) => void`

<<<<<<< HEAD
  与 [`toMatchSnapshot`](#tomatchsnapshot) 相同，但期望与 [`toThrowError`](#tothrowerror) 相同的值。

  如果函数抛出 `Error`，则快照将是错误消息。否则，快照将是函数抛出的值。
=======
The same as [`toMatchSnapshot`](#tomatchsnapshot), but expects the same value as [`toThrowError`](#tothrowerror).
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toThrowErrorMatchingInlineSnapshot

- **类型:** `(snapshot?: string, message?: string) => void`

<<<<<<< HEAD
  与 [`toMatchInlineSnapshot`](#tomatchinlinesnapshot) 相同，但期望与 [`toThrowError`](#tothrowerror) 相同的值。

  如果函数抛出 `Error`，则快照将是错误消息。否则，快照将是函数抛出的值。
=======
The same as [`toMatchInlineSnapshot`](#tomatchinlinesnapshot), but expects the same value as [`toThrowError`](#tothrowerror).
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## toHaveBeenCalled

- **类型:** `() => Awaitable<void>`

<<<<<<< HEAD
  此断言用于测试函数是否已被调用。需要将 spy 函数传递给 `expect`。

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

## toHaveBeenCalledTimes

- **类型**: `(amount: number) => Awaitable<void>`

此断言检查函数是否被调用了特定次数。需要将 spy 函数传递给 `expect`。
=======
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

## toHaveBeenCalledTimes

- **Type**: `(amount: number) => Awaitable<void>`

This assertion checks if a function was called a certain amount of times. Requires a spy function to be passed to `expect`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

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

## toHaveBeenCalledWith

<<<<<<< HEAD
- **类型**: `(...args: any[]) => Awaitable<void>`

此断言检查函数是否至少被调用一次，并且使用了特定的参数。需要将 spy 函数传递给 `expect`。
=======
- **Type**: `(...args: any[]) => Awaitable<void>`

This assertion checks if a function was called at least once with certain parameters. Requires a spy function to be passed to `expect`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

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

## toHaveBeenLastCalledWith

<<<<<<< HEAD
- **类型**: `(...args: any[]) => Awaitable<void>`

此断言检查函数在最后一次调用时是否使用了特定的参数。需要将 spy 函数传递给 `expect`。
=======
- **Type**: `(...args: any[]) => Awaitable<void>`

This assertion checks if a function was called with certain parameters at it's last invocation. Requires a spy function to be passed to `expect`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

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

## toHaveBeenNthCalledWith

<<<<<<< HEAD
- **类型**: `(time: number, ...args: any[]) => Awaitable<void>`

此断言检查函数在特定时间是否使用了特定的参数。计数从 1 开始。因此，要检查第二个条目，你可以编写 `.toHaveBeenNthCalledWith(2, ...)`。需要将 spy 函数传递给 `expect`。

需要将 spy 函数传递给 `expect`。
=======
- **Type**: `(time: number, ...args: any[]) => Awaitable<void>`

This assertion checks if a function was called with certain parameters at the certain time. The count starts at 1. So, to check the second entry, you would write `.toHaveBeenNthCalledWith(2, ...)`.

Requires a spy function to be passed to `expect`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

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

## toHaveReturned

<<<<<<< HEAD
- **类型**: `() => Awaitable<void>`

更好地了解你的问题。此断言检查函数是否至少成功返回了一次值（即未抛出错误）。需要将 spy 函数传递给 `expect`。
=======
- **Type**: `() => Awaitable<void>`

This assertion checks if a function has successfully returned a value at least once (i.e., did not throw an error). Requires a spy function to be passed to `expect`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

```ts
import { expect, test, vi } from 'vitest'

function getApplesPrice(amount: number) {
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

## toHaveReturnedTimes

<<<<<<< HEAD
- **类型**: `(amount: number) => Awaitable<void>`

此断言检查函数是否成功返回了确切次数的值（即未抛出错误）。需要将 spy 函数传递给 `expect`。
=======
- **Type**: `(amount: number) => Awaitable<void>`

This assertion checks if a function has successfully returned a value exact amount of times (i.e., did not throw an error). Requires a spy function to be passed to `expect`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

```ts
import { expect, test, vi } from 'vitest'

test('spy function returns a value two times', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')
  sell('bananas')

  expect(sell).toHaveReturnedTimes(2)
})
```

## toHaveReturnedWith

<<<<<<< HEAD
- **类型**: `(returnValue: any) => Awaitable<void>`

你可以调用此断言来检查函数是否至少成功返回了一次具有特定参数的值。需要将 spy 函数传递给 `expect`。
=======
- **Type**: `(returnValue: any) => Awaitable<void>`

You can call this assertion to check if a function has successfully returned a value with certain parameters at least once. Requires a spy function to be passed to `expect`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

```ts
import { expect, test, vi } from 'vitest'

test('spy function returns a product', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')

  expect(sell).toHaveReturnedWith({ product: 'apples' })
})
```

## toHaveLastReturnedWith

<<<<<<< HEAD
- **类型**: `(returnValue: any) => Awaitable<void>`

你可以调用此断言来检查函数是否在最后一次调用时成功返回了具有特定参数的值。需要将 spy 函数传递给 `expect`。
=======
- **Type**: `(returnValue: any) => Awaitable<void>`

You can call this assertion to check if a function has successfully returned a value with certain parameters on it's last invoking. Requires a spy function to be passed to `expect`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

```ts
import { expect, test, vi } from 'vitest'

test('spy function returns bananas on a last call', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')
  sell('bananas')

  expect(sell).toHaveLastReturnedWith({ product: 'bananas' })
})
```

## toHaveNthReturnedWith

<<<<<<< HEAD
- **类型**: `(time: number, returnValue: any) => Awaitable<void>`

你可以调用此断言来检查函数是否在特定调用时成功返回了具有特定参数的值。需要将 spy 函数传递给 `expect`。
=======
- **Type**: `(time: number, returnValue: any) => Awaitable<void>`

You can call this assertion to check if a function has successfully returned a value with certain parameters on a certain call. Requires a spy function to be passed to `expect`.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

```ts
import { expect, test, vi } from 'vitest'

test('spy function returns bananas on second call', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')
  sell('bananas')

  expect(sell).toHaveNthReturnedWith(2, { product: 'bananas' })
})
```

## toSatisfy

<<<<<<< HEAD
- **类型:** `(predicate: (value: any) => boolean) => Awaitable<void>`

此断言检查一个值是否满足特定的谓词。
=======
- **Type:** `(predicate: (value: any) => boolean) => Awaitable<void>`

This assertion checks if a value satisfies a certain predicate.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

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

## resolves

- **类型:** `Promisify<Assertions>`

<<<<<<< HEAD
  `resolves` 旨在在断言异步代码时消除样板代码。使用它来从挂起的 Promise 中解包值，并使用通常的断言来断言其值。如果 Promise 被拒绝，断言将失败。

  它返回相同的 `Assertions` 对象，但所有匹配器现在都返回 `Promise`，因此你需要 `await` 它。也适用于 `chai` 断言。

  例如，如果你有一个调用 API 并返回一些数据的函数，你可以使用此代码断言其返回值：

  ```ts
  import { expect, test } from 'vitest'
  
  async function buyApples() {
    return fetch('/buy/apples').then(r => r.json())
  }
=======
`resolves` is intended to remove boilerplate when asserting asynchronous code. Use it to unwrap value from the pending promise and assert its value with usual assertions. If the promise rejects, the assertion will fail.

It returns the same `Assertions` object, but all matchers now return `Promise`, so you would need to `await` it. Also works with `chai` assertions.

For example, if you have a function, that makes an API call and returns some data, you may use this code to assert its return value:

```ts
import { expect, test } from 'vitest'

async function buyApples() {
  return fetch('/buy/apples').then(r => r.json())
}
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

test('buyApples returns new stock id', async () => {
  // toEqual returns a promise now, so you HAVE to await it
  await expect(buyApples()).resolves.toEqual({ id: 1 }) // jest API
  await expect(buyApples()).resolves.to.equal({ id: 1 }) // chai API
})
```

<<<<<<< HEAD
  :::warning
  如果未等待断言，则你将拥有一个虚假的测试，每次都会通过。为确保实际调用了断言，你可以使用 [`expect.assertions(number)`](#expect-assertions)。
  :::
=======
:::warning
If the assertion is not awaited, then you will have a false-positive test that will pass every time. To make sure that assertions are actually called, you may use [`expect.assertions(number)`](#expect-assertions).
:::
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## rejects

- **类型:** `Promisify<Assertions>`

<<<<<<< HEAD
  `rejects` 旨在在断言异步代码时消除样板代码。使用它来解包 Promise 被拒绝的原因，并使用通常的断言来断言其值。如果 Promise 成功解析，则断言将失败。

  它返回相同的 `Assertions` 对象，但所有匹配器现在都返回 `Promise`，因此你需要 `await` 它。也适用于 `chai` 断言。

  例如，如果你有一个在调用时失败的函数，你可以使用以下代码来断言原因：

  ```ts
  import { expect, test } from 'vitest'
  
  async function buyApples(id) {
    if (!id)
      throw new Error('no id')
  }
=======
`rejects` is intended to remove boilerplate when asserting asynchronous code. Use it to unwrap reason why the promise was rejected, and assert its value with usual assertions. If the promise successfully resolves, the assertion will fail.

It returns the same `Assertions` object, but all matchers now return `Promise`, so you would need to `await` it. Also works with `chai` assertions.

For example, if you have a function that fails when you call it, you may use this code to assert the reason:

```ts
import { expect, test } from 'vitest'

async function buyApples(id) {
  if (!id)
    throw new Error('no id')
}
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

test('buyApples throws an error when no id provided', async () => {
  // toThrow returns a promise now, so you HAVE to await it
  await expect(buyApples()).rejects.toThrow('no id')
})
```

<<<<<<< HEAD
  :::warning
  如果未等待断言，则你将拥有一个虚假的测试，每次都会通过。为确保实际调用了断言，你可以使用 [`expect.assertions(number)`](#expect-assertions)。
  :::
=======
:::warning
If the assertion is not awaited, then you will have a false-positive test that will pass every time. To make sure that assertions were actually called, you can use [`expect.assertions(number)`](#expect-assertions).
:::
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## expect.assertions

- **类型:** `(count: number) => void`

<<<<<<< HEAD
  在测试通过或失败后，验证测试期间调用了特定数量的断言。一个有用的情况是检查异步代码是否被调用。

  例如，如果我们有一个异步调用两个匹配器的函数，我们可以断言它们实际上被调用了。

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

  ::: warning
  在使用 `assertions` 进行异步并发测试时，必须使用来自本地 [测试上下文](/guide/test-context) 的 `expect` 来确保检测到正确的测试。
  :::
=======
After the test has passed or failed verify that a certain number of assertions was called during a test. A useful case would be to check if an asynchronous code was called.

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
::: warning
When using `assertions` with async concurrent tests, `expect` from the local [Test Context](/guide/test-context.md) must be used to ensure the right test is detected.
:::
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## expect.hasAssertions

- **类型:** `() => void`

<<<<<<< HEAD
  在测试通过或失败后，验证测试期间至少调用了一个断言。一个有用的情况是检查异步代码是否被调用。

  例如，如果你有一个调用回调函数的代码，我们可以在回调函数内部进行断言，但是如果我们不检查是否调用了断言，测试将始终通过。

  ```ts
  import { expect, test } from 'vitest'
  import { db } from './db.js'
  const cbs = []
  
  function onSelect(cb) {
    cbs.push(cb)
  }

  // after selecting from db, we call all callbacks
  function select(id) {
    return db.select({ id }).then((data) => {
      return Promise.all(cbs.map(cb => cb(data)))
    })
  }

  test('callback was called', async () => {
    expect.hasAssertions()
    onSelect((data) => {
      // should be called on select
      expect(data).toBeTruthy()
    })
    // if not awaited, test will fail
    // if you don't have expect.hasAssertions(), test will pass
    await select(3)
=======
After the test has passed or failed verify that at least one assertion was called during a test. A useful case would be to check if an asynchronous code was called.

For example, if you have a code that calls a callback, we can make an assertion inside a callback, but the test will always pass if we don't check if an assertion was called.

```ts
import { expect, test } from 'vitest'
import { db } from './db.js'

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
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47
  })
}

test('callback was called', async () => {
  expect.hasAssertions()
  onSelect((data) => {
    // should be called on select
    expect(data).toBeTruthy()
  })
  // if not awaited, test will fail
  // if you don't have expect.hasAssertions(), test will pass
  await select(3)
})
```

## expect.unreachable

- **类型:** `(message?: string) => never`

<<<<<<< HEAD
  此方法用于断言永远不应该到达一条线。

  例如，如果我们想测试 `build()` 由于接收目录没有 `src` 文件夹而抛出，并且还单独处理每个错误，我们可以这样做：

  ```ts
  import { expect, test } from 'vitest'
  
  async function build(dir) {
    if (dir.includes('no-src'))
      throw new Error(`${dir}/src does not exist`)
=======
This method is used to asserting that a line should never be reached.

For example, if we want to test that `build()` throws due to receiving directories having no `src` folder, and also handle each error separately, we could do this:

```ts
import { expect, test } from 'vitest'

async function build(dir) {
  if (dir.includes('no-src'))
    throw new Error(`${dir}/src does not exist`)
}

const errorDirs = [
  'no-src-folder',
  // ...
]

test.each(errorDirs)('build fails with "%s"', async (dir) => {
  try {
    await build(dir)
    expect.unreachable('Should not pass build')
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47
  }
  catch (err: any) {
    expect(err).toBeInstanceOf(Error)
    expect(err.stack).toContain('build')

<<<<<<< HEAD
  const errorDirs = [
    'no-src-folder',
    // ...
  ]
  
  test.each(errorDirs)('build fails with "%s"', async (dir) => {
    try {
      await build(dir)
      expect.unreachable('Should not pass build')
    }
    catch (err: any) {
      expect(err).toBeInstanceOf(Error)
      expect(err.stack).toContain('build')
  
      switch (dir) {
        case 'no-src-folder':
          expect(err.message).toBe(`${dir}/src does not exist`)
          break
        default:
          // to exhaust all error tests
          expect.unreachable('All error test must be handled')
          break
      }
    }
  })
  ```

<!-- asymmetric matchers -->
=======
    switch (dir) {
      case 'no-src-folder':
        expect(err.message).toBe(`${dir}/src does not exist`)
        break
      default:
        // to exhaust all error tests
        expect.unreachable('All error test must be handled')
        break
    }
  }
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## expect.anything

- **类型:** `() => any`

<<<<<<< HEAD
  这个不对称的匹配器，当与相等检查一起使用时，将始终返回 `true`。如果你只想确保属性存在，这将非常有用。

  ```ts
  import { expect, test } from 'vitest'
  
  test('object has "apples" key', () => {
    expect({ apples: 22 }).toEqual({ apples: expect.anything() })
  })
  ```
=======
This asymmetric matcher, when used with equality check, will always return `true`. Useful, if you just want to be sure that the property exist.

```ts
import { expect, test } from 'vitest'

test('object has "apples" key', () => {
  expect({ apples: 22 }).toEqual({ apples: expect.anything() })
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## expect.any

- **类型:** `(constructor: unknown) => any`

<<<<<<< HEAD
  这个不对称的匹配器，当与相等检查一起使用时，只有在值是指定构造函数的实例时才会返回 `true`。如果你有一个每次生成的值，并且你只想知道它是否具有适当的类型，这将非常有用。

  ```ts
  import { expect, test } from 'vitest'
  import { generateId } from './generators.js'
  
  test('"id" is a number', () => {
    expect({ id: generateId() }).toEqual({ id: expect.any(Number) })
  })
  ```
=======
This asymmetric matcher, when used with an equality check, will return `true` only if the value is an instance of a specified constructor. Useful, if you have a value that is generated each time, and you only want to know that it exists with a proper type.

```ts
import { expect, test } from 'vitest'
import { generateId } from './generators.js'

test('"id" is a number', () => {
  expect({ id: generateId() }).toEqual({ id: expect.any(Number) })
})
```
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## expect.closeTo

- **类型:** `(expected: any, precision?: number) => any`
- **版本:** Since Vitest 1.0.0

当比较对象属性或数组项中的浮点数时，`expect.closeTo`非常有用。但如果你需要比较一个数字，请使用`.toBeCloseTo`。

可选的`numDigits`参数用于限制小数点后要检查的位数。默认值为`2`，即测试条件为`Math.abs(expected - received) < 0.005`（即 10 的负 2 次方除以 2）。

例如，以下测试在精度为 5 位的情况下通过：

```js
test('compare float in object properties', () => {
  expect({
    title: '0.1 + 0.2',
    sum: 0.1 + 0.2,
  }).toEqual({
    title: '0.1 + 0.2',
    sum: expect.closeTo(0.3, 5),
  })
})
```

## expect.arrayContaining

- **类型:** `<T>(expected: T[]) => any`

<<<<<<< HEAD
  当与相等检查一起使用时，这个不对称的匹配器将在值是数组并包含指定项时返回 `true`。

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
=======
When used with an equality check, this asymmetric matcher will return `true` if the value is an array and contains specified items.

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
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47
  })
})
```

<<<<<<< HEAD
  :::tip
  你可以使用 `expect.not` 与此匹配器一起使用，以否定预期值。
  :::
=======
:::tip
You can use `expect.not` with this matcher to negate the expected value.
:::
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## expect.objectContaining

- **类型:** `(expected: any) => any`

<<<<<<< HEAD
  当与相等检查一起使用时，这个不对称的匹配器将在值具有类似形状时返回 `true`。

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
=======
When used with an equality check, this asymmetric matcher will return `true` if the value has a similar shape.

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
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47
  })
})
```

<<<<<<< HEAD
  :::tip
  你可以使用 `expect.not` 与此匹配器一起使用，以否定预期值。
  :::
=======
:::tip
You can use `expect.not` with this matcher to negate the expected value.
:::
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## expect.stringContaining

- **类型:** `(expected: any) => any`

<<<<<<< HEAD
  当与相等检查一起使用时，这个不对称的匹配器将在值是字符串并包含指定子字符串时返回 `true`。

  ```ts
  import { expect, test } from 'vitest'
  
  test('variety has "Emp" in its name', () => {
    const variety = {
      name: 'Empire',
      count: 1,
    }
    expect(variety).toEqual({
      name: expect.stringContaining('Emp'),
      count: 1,
    })
=======
When used with an equality check, this asymmetric matcher will return `true` if the value is a string and contains a specified substring.

```ts
import { expect, test } from 'vitest'

test('variety has "Emp" in its name', () => {
  const variety = {
    name: 'Empire',
    count: 1,
  }
  expect(variety).toEqual({
    name: expect.stringContaining('Emp'),
    count: 1,
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47
  })
})
```

<<<<<<< HEAD
  :::tip
  你可以使用 `expect.not` 与此匹配器一起使用，以否定预期值。
  :::
=======
:::tip
You can use `expect.not` with this matcher to negate the expected value.
:::
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## expect.stringMatching

- **类型:** `(expected: any) => any`

<<<<<<< HEAD
  当与相等检查一起使用时，这个不对称的匹配器将在值是字符串并包含指定子字符串或字符串与正则表达式匹配时返回 `true`。

  ```ts
  import { expect, test } from 'vitest'
  
  test('variety ends with "re"', () => {
    const variety = {
      name: 'Empire',
      count: 1,
    }
    expect(variety).toEqual({
      name: expect.stringMatching(/re$/),
      count: 1,
    })
=======
When used with an equality check, this asymmetric matcher will return `true` if the value is a string and contains a specified substring or if the string matches a regular expression.

```ts
import { expect, test } from 'vitest'

test('variety ends with "re"', () => {
  const variety = {
    name: 'Empire',
    count: 1,
  }
  expect(variety).toEqual({
    name: expect.stringMatching(/re$/),
    count: 1,
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47
  })
})
```

<<<<<<< HEAD
  :::tip
  你可以使用 `expect.not` 与此匹配器一起使用，以否定预期值。
  :::
=======
:::tip
You can use `expect.not` with this matcher to negate the expected value.
:::
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## expect.addSnapshotSerializer

- **类型:** `(plugin: PrettyFormatPlugin) => void`

<<<<<<< HEAD
  此方法添加自定义序列化程序，当创建快照时调用这些序列化程序。这是一个高级功能 - 如果你想了解更多信息，请阅读有关自定义序列化程序的指南。

  如果你正在添加自定义序列化程序，应在 [`setupFiles`](/config/#setupfiles) 中调用此方法。这将影响到每个快照。

  :::tip
  如果你之前使用 Vue CLI 和 Jest，你可能想要安装 [jest-serializer-vue](https://www.npmjs.com/package/jest-serializer-vue)。否则，你的快照将被包装在一个字符串中，这会导致 `"` 被转义。
  :::
=======
This method adds custom serializers that are called when creating a snapshot. This is an advanced feature - if you want to know more, please read a [guide on custom serializers](/guide/snapshot#custom-serializer).

If you are adding custom serializers, you should call this method inside [`setupFiles`](/config/#setupfiles). This will affect every snapshot.

:::tip
If you previously used Vue CLI with Jest, you might want to install [jest-serializer-vue](https://www.npmjs.com/package/jest-serializer-vue). Otherwise, your snapshots will be wrapped in a string, which cases `"` to be escaped.
:::
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

## expect.extend

- **类型:** `(matchers: MatchersObject) => void`

<<<<<<< HEAD
  你可以使用自己的默认匹配器来扩展默认匹配器。此函数用于使用自定义匹配器扩展匹配器对象。

  当你以这种方式定义匹配器时，你还创建了不对称的匹配器，可以像 `expect.stringContaining` 一样使用它们。

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
=======
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
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47
  })

<<<<<<< HEAD
  ::: tip
  如果你希望你的匹配器出现在每个测试中，你应该在 [`setupFiles`](/config/#setupFiles) 中调用此方法。
  :::

  此函数与 Jest 的 `expect.extend` 兼容，因此使用它创建自定义匹配器的任何库都可以与 Vitest 一起使用。

  如果你使用 TypeScript，自 Vitest 0.31.0 起，你可以使用以下代码在环境声明文件（例如：`vitest.d.ts`）中扩展默认的 `Assertion` 接口：
=======
  expect('foo').toBeFoo()
  expect({ foo: 'foo' }).toEqual({ foo: expect.toBeFoo() })
})
```

::: tip
If you want your matchers to appear in every test, you should call this method inside [`setupFiles`](/config/#setupFiles).
:::

This function is compatible with Jest's `expect.extend`, so any library that uses it to create custom matchers will work with Vitest.
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47

If you are using TypeScript, since Vitest 0.31.0 you can extend default `Assertion` interface in an ambient declaration file (e.g: `vitest.d.ts`) with the code below:

```ts
interface CustomMatchers<R = unknown> {
  toBeFoo(): R
}

<<<<<<< HEAD
  ::: warning
  不要忘记在你的 `tsconfig.json` 中包含环境声明文件。
  :::

  :::tip
  如果你想了解更多信息，请查看 [扩展断言](/guide/extending-matchers)。
  :::
=======
declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
```

::: warning
Don't forget to include the ambient declaration file in your `tsconfig.json`.
:::

:::tip
If you want to know more, checkout [guide on extending matchers](/guide/extending-matchers).
:::
>>>>>>> 4be1f32f7b1f40c6c8d7f479bcb751276ae29f47
