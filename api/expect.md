# expect

以下类型在下面的类型签名中被使用。

```ts
type Awaitable<T> = T | PromiseLike<T>
```

`expect` 用于创建断言。 在这种情况下， `assertions` 是可以调用来断言语句的函数。 Vitest 默认提供 `chai` 断言，并且还在 `chai` 之上构建了与  `Jest`  兼容的断言。

例如，此代码断言 `input`  值等于 `2`。 如果不是，assertions 将抛出错误，并且测试将失败。

```ts
import { expect } from 'vitest'

const input = Math.sqrt(4)

expect(input).to.equal(2) // chai API
expect(input).toBe(2) // jest API
```

从技术上讲，这个示例没有使用 [`test`](/api/#test) 函数，因此在控制台中你将看到 Nodejs 错误而不是 Vitest 输出。 要了解更多关于 `test` 的信息，请阅读[测试 API 参考](/api/)。

此外，`expect` 可以静态地使用来访问匹配器函数，稍后将会介绍。

::: warning
如果表达式没有类型错误，则 `expect` 对测试类型没有影响。 如果您想使用 Vitest 作为[类型检查器](/guide/testing-types)，请使用 [`expectTypeOf`](/api/expect-typeof) 或 [`assertType`](/api/assert-type) 。
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

它也可以与 `expect` 一起使用。 如果 `expect` 断言失败，测试将终止并显示所有错误。

```ts
import { expect, test } from 'vitest'

test('expect.soft test', () => {
  expect.soft(1 + 1).toBe(3) // mark the test as fail and continue
  expect(1 + 2).toBe(3) // failed and terminate the test, all previous errors will be output
  expect.soft(1 + 2).toBe(4) // do not run
})
```

::: warning
`expect.soft` 只能在 [`test`](/api/#test) 函数的内部使用。
:::

## not

使用 `not` 将否定该断言。 例如，此代码断言 `input` 值不等于 `2`。 如果相等，断言将抛出错误，测试将失败。

```ts
import { expect, test } from 'vitest'

const input = Math.sqrt(16)

expect(input).not.to.equal(2) // chai API
expect(input).not.toBe(2) // jest API
```

## toBe

- **类型:** `(value: any) => Awaitable<void>`

`toBe` 可用于断言基元是否相等或对象共享相同的引用。 它相当于调用 `expect(Object.is(3, 3)).toBe(true)` 。 如果对象不相同，但你想检查它们的结构是否相同，可以使用 [`toEqual`](#toequal)。

例如，下面的代码检查交易者是否有 13 个苹果。

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

尽量不要将 `toBe` 与浮点数一起使用。 由于 JavaScript 对它们进行四舍五入，因此 `0.1 + 0.2` 并不严格是 `0.3` 。 要可靠地断言浮点数，请使用 [`toBeCloseTo`](#tobecloseto) 断言。

## toBeCloseTo

- **类型:** `(value: number, numDigits?: number) => Awaitable<void>`

使用 `toBeCloseTo` 比较浮点数。可选的 `numDigits` 参数限制了小数点后要检查的位数。例如：

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

## toBeDefined

- **类型:** `() => Awaitable<void>`

`toBeDefined` 断言值不等于 `undefined`。有用的用例是检查函数是否有返回任何内容。

```ts
import { expect, test } from 'vitest'

function getApples() {
  return 3
}

test('function returned something', () => {
  expect(getApples()).toBeDefined()
})
```

## toBeUndefined

- **类型:** `() => Awaitable<void>`

与 `toBeDefined` 相反，`toBeUndefined` 断言值 _is_ 等于 `undefined`。有用的用例是检查函数是否没有返回任何东西。

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

## toBeTruthy

- **类型:** `() => Awaitable<void>`

`toBeTruthy`断言值在转换为布尔值时为true。如果你不关心值，只想知道它可以转换为`true`，这将非常有用。

例如，假设有以下代码，我们不关心 `stocks.getInfo` 的返回值 - 它可能是一个复杂对象、一个字符串或其他任何值。代码仍然可以正常工作。

```ts
import { Stocks } from './stocks.js'

const stocks = new Stocks()
stocks.sync('Bill')
if (stocks.getInfo('Bill'))
  stocks.sell('apples', 'Bill')
```

因此，如果要测试 `stocks.getInfo` 是否真实，可以这样写：

```ts
import { expect, test } from 'vitest'
import { Stocks } from './stocks.js'

const stocks = new Stocks()

test('if we know Bill stock, sell apples to him', () => {
  stocks.sync('Bill')
  expect(stocks.getInfo('Bill')).toBeTruthy()
})
```

除了 `false`、`null`、`undefined`、`NaN`、`0`、`-0`、`0n`、`""` 和 `document.all` 以外，JavaScript 中的一切都是真实的。

## toBeFalsy

- **类型:** `() => Awaitable<void>`

`toBeFalsy` 断言值在转换为布尔值时为false。如果你不关心值，只想知道它可以转换为`false`，这将非常有用。

例如，假设有以下代码，我们不关心 `stocks.stockFailed` 的返回值 - 它可能返回任何假值，但代码仍然可以正常工作。

```ts
import { Stocks } from './stocks.js'

const stocks = new Stocks()
stocks.sync('Bill')
if (!stocks.stockFailed('Bill'))
  stocks.sell('apples', 'Bill')
```

因此，如果要测试`stocks.stockFailed`是否是虚假的，可以这样写：

```ts
import { expect, test } from 'vitest'
import { Stocks } from './stocks.js'

const stocks = new Stocks()

test('if Bill stock hasn\'t failed, sell apples to him', () => {
  stocks.syncStocks('Bill')
  expect(stocks.stockFailed('Bill')).toBeFalsy()
})
```

除了 `false`、`null`、`undefined`、`NaN`、`0`、`-0`、`0n`、`""` 和 `document.all` 以外，JavaScript 中的一切都是真实的。

## toBeNull

- **类型:** `() => Awaitable<void>`

`toBeNull` 只是断言某些内容是否为 `null`。 `.toBe(null)` 的别名。

```ts
import { expect, test } from 'vitest'

function apples() {
  return null
}

test('we don\'t have apples', () => {
  expect(apples()).toBeNull()
})
```

## toBeNaN

- **类型:** `() => Awaitable<void>`

`toBeNaN` 简单地断言某些内容是否为 `NaN`。toBe(NaN)` 的别名。

```ts
import { expect, test } from 'vitest'

let i = 0

function getApplesCount() {
  i++
  return i > 1 ? Number.NaN : i
}

test('getApplesCount has some unusual side effects...', () => {
  expect(getApplesCount()).not.toBeNaN()
  expect(getApplesCount()).toBeNaN()
})
```

## toBeTypeOf

- **类型:** `(c: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined') => Awaitable<void>`

`toBeTypeOf` 断言实际值是否属于接收类型。

```ts
import { expect, test } from 'vitest'

const actual = 'stock'

test('stock is type of string', () => {
  expect(actual).toBeTypeOf('string')
})
```

## toBeInstanceOf

- **类型:** `(c: any) => Awaitable<void>`

`toBeInstanceOf` 断言实际值是否是接收类的实例。

```ts
import { expect, test } from 'vitest'
import { Stocks } from './stocks.js'

const stocks = new Stocks()

test('stocks are instance of Stocks', () => {
  expect(stocks).toBeInstanceOf(Stocks)
})
```

## toBeGreaterThan

- **类型:** `(n: number | bigint) => Awaitable<void>`

`toBeGreaterThan` 断言实际值是否大于接收值。如果数值相等，则测试失败。

```ts
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have more then 10 apples', () => {
  expect(getApples()).toBeGreaterThan(10)
})
```

## toBeGreaterThanOrEqual

- **类型:** `(n: number | bigint) => Awaitable<void>`

`toBeGreaterThanOrEqual` 断言实际值是否大于或等于接收值。

```ts
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have 11 apples or more', () => {
  expect(getApples()).toBeGreaterThanOrEqual(11)
})
```

## toBeLessThan

- **类型:** `(n: number | bigint) => Awaitable<void>`

`toBeLessThan` 断言实际值是否小于接收值。如果数值相等，则测试失败。

```ts
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have less then 20 apples', () => {
  expect(getApples()).toBeLessThan(20)
})
```

## toBeLessThanOrEqual

- **类型:** `(n: number | bigint) => Awaitable<void>`

`toBeLessThanOrEqual` 断言实际值小于接收值或等于接收值。

```ts
import { expect, test } from 'vitest'
import { getApples } from './stocks.js'

test('have 11 apples or less', () => {
  expect(getApples()).toBeLessThanOrEqual(11)
})
```

## toEqual

- **类型:** `(received: any) => Awaitable<void>`

`toEqual` 断言实际值是否等于接收到的值，或者如果它是一个对象，则是否具有相同的结构（递归比较它们）。我们可以通过以下示例看到 `toEqual` 与 [`toBe`](#tobe) 之间的区别：

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
不会对 `Error` 对象执行 _deep equality_ 。要测试是否抛出了错误，需要使用 [`toThrowError`](#tothrowerror)断言。
:::

## toStrictEqual

- **类型:** `(received: any) => Awaitable<void>`

`toStrictEqual` 断言实际值是否等于接收到的值，或者如果它是一个对象（递归地比较它们）并且具有相同的类型，则具有相同的结构。

与 [`.toEqual`](#toequal) 的区别：

- 检查具有 `undefined` 属性的键。 例如 使用 `.toStrictEqual` 时， `{a: undefined, b: 2}` 与 `{b: 2}` 不匹配。
- 检查数组稀疏性。 例如 使用 `.toStrictEqual` 时， `[, 1]` 与 `[undefined, 1]` 不匹配。
- 检查对象类型是否相等。 例如 具有字段 `a` 和 ` b` 的类实例不等于具有字段 `a` 和 ` b` 的文字对象。

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

## toContain

- **类型:** `(received: string) => Awaitable<void>`

`toContain` 断言实际值是否在数组中。`toContain` 还可以检查一个字符串是否是另一个字符串的子串。自 Vitest 1.0 起，如果我们需要在类似浏览器的环境中运行测试，此断言还可以检查类是否包含在 `classList` 中，或一个元素是否包含在另一个元素中。

```ts
import { expect, test } from 'vitest'
import { getAllFruits } from './stocks.js'

test('the fruit list contains orange', () => {
  expect(getAllFruits()).toContain('orange')

  const element = document.querySelector('#el')
  // element has a class
  expect(element.classList).toContain('flex')
  // element is inside another one
  expect(document.querySelector('#wrapper')).toContain(element)
})
```

## toContainEqual

- **类型:** `(received: any) => Awaitable<void>`

`toContainEqual` 断言数组中是否包含具有特定结构和值的项。
它在每个元素内部的工作方式类似于 [`toEqual`](#toequal)。

```ts
import { expect, test } from 'vitest'
import { getFruitStock } from './stocks.js'

test('apple available', () => {
  expect(getFruitStock()).toContainEqual({ fruit: 'apple', count: 5 })
})
```

## toHaveLength

- **类型:** `(received: number) => Awaitable<void>`

`toHaveLength` 断言对象是否具有 `.length` 属性，并且该属性设置为特定的数值。

```ts
import { expect, test } from 'vitest'

test('toHaveLength', () => {
  expect('abc').toHaveLength(3)
  expect([1, 2, 3]).toHaveLength(3)

  expect('').not.toHaveLength(3) // doesn't have .length of 3
  expect({ length: 3 }).toHaveLength(3)
})
```

## toHaveProperty

- **类型:** `(key: any, received?: any) => Awaitable<void>`

`toHaveProperty` 断言对象是否具有提供的引用 `key` 处的属性。

我们还可以提供一个可选的值参数，也称为深相等，就像 `toEqual` 匹配器一样，用于比较接收到的属性值。

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

## toMatch

- **类型:** `(received: string | regexp) => Awaitable<void>`

`toMatch` 断言字符串是否与正则表达式或字符串匹配。

```ts
import { expect, test } from 'vitest'

test('top fruits', () => {
  expect('top fruits include apple, orange and grape').toMatch(/apple/)
  expect('applefruits').toMatch('fruit') // toMatch also accepts a string
})
```

::: tip
如果错误消息中的值被截断得太厉害，可以在配置文件中增加 [chaiConfig.truncateThreshold](/config/#chaiconfig-truncatethreshold)。
:::

## toMatchObject

- **类型:** `(received: object | array) => Awaitable<void>`

`toMatchObject` 断言对象是否匹配另一个对象的部分属性。

我们还可以传递一个对象数组。如果想要检查两个数组在元素数量上是否匹配，这将非常有用，与`arrayContaining`不同，后者允许接收到的数组中有额外的元素。

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

## toThrowError

- **类型:** `(received: any) => Awaitable<void>`

- **别名:** `toThrow`

`toThrowError` 断言函数在被调用时是否会抛出错误。

我们可以提供一个可选参数来测试是否抛出了特定的错误：

- 正则表达式 (regular expression) ：错误消息与模式匹配
- 字符串 (string) ：错误消息包含子字符串

:::tip
必须将代码包装在一个函数中，否则错误将无法被捕获，测试将失败。
:::

例如，如果我们想要测试 `getFruitStock('pineapples')` 是否会抛出错误，我们可以这样写：

```ts
import { expect, test } from 'vitest'

function getFruitStock(type) {
  if (type === 'pineapples')
    throw new DiabetesError('Pineapples are not good for people with diabetes')

  // Do some other stuff
}

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

```js
function getAsyncFruitStock() {
  return Promise.reject(new Error('empty'))
}

test('throws on pineapples', async () => {
  await expect(() => getAsyncFruitStock()).rejects.toThrowError('empty')
})
```

:::

## toMatchSnapshot

- **类型:** `<T>(shape?: Partial<T> | string, message?: string) => void`

这样可以确保一个值与最近的快照匹配。

可以提供一个可选的 `hint` 字符串参数，它会附加到测试名称的末尾。尽管 Vitest 总是在快照名称的末尾附加一个数字，但简短的描述性提示可能比数字更有用，以区分单个 it 或 test 块中的多个快照。Vitest 会按名称在相应的 `.snap` 文件中对快照进行排序。

:::tip
当快照不匹配导致测试失败时，如果这种不匹配是预期的，我们可以按 `u` 键一次性更新快照。或者可以传递 `-u` 或 `--update` 命令行选项，使 Vitest 始终更新测试。
:::

```ts
import { expect, test } from 'vitest'

test('matches snapshot', () => {
  const data = { foo: new Set(['bar', 'snapshot']) }
  expect(data).toMatchSnapshot()
})
```

我们还可以提供一个对象的形状，如果我们只是测试对象的形状，而不需要它完全兼容：

```ts
import { expect, test } from 'vitest'

test('matches snapshot', () => {
  const data = { foo: new Set(['bar', 'snapshot']) }
  expect(data).toMatchSnapshot({ foo: expect.any(Set) })
})
```

## toMatchInlineSnapshot

- **类型:** `<T>(shape?: Partial<T> | string, snapshot?: string, message?: string) => void`

这样可以确保一个值与最近的快照匹配。

Vitest 将内联快照字符串参数添加并更新到测试文件中的匹配器（而不是外部的 `.snap` 文件）。

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

我们还可以提供一个对象的形状，如果您只是测试对象的形状，而不需要它完全兼容：

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

## toMatchFileSnapshot

- **类型:** `<T>(filepath: string, message?: string) => Promise<void>`
- **版本:** 需要 Vitest 0.30.0 以上

明确比较或更新快照与显式指定的文件内容（而不是 `.snap` 文件）。

```ts
import { expect, it } from 'vitest'

it('render basic', async () => {
  const result = renderHTML(h('div', { class: 'foo' }))
  await expect(result).toMatchFileSnapshot('./test/basic.output.html')
})
```

请注意，由于文件系统操作是异步的，您需要在 `toMatchFileSnapshot()` 中使用 `await`。

## toThrowErrorMatchingSnapshot

- **类型:** `(message?: string) => void`

与 [`toMatchSnapshot`](#tomatchsnapshot) 相同，但期望的值与 [`toThrowError`](#tothrowerror) 相同。

## toThrowErrorMatchingInlineSnapshot

- **类型:** `(snapshot?: string, message?: string) => void`

与 [`toMatchInlineSnapshot`](#tomatchinlinesnapshot) 相同，但期望的值与 [`toThrowError`](#tothrowerror) 相同。

## toHaveBeenCalled

- **类型:** `() => Awaitable<void>`

这个断言对于测试函数是否被调用很有用。需要将一个 spy 函数传递给 `expect`。

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

这个断言检查函数被调用的次数是否达到特定次数。需要将一个 spy 函数传递给 `expect`。

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

- **类型**: `(...args: any[]) => Awaitable<void>`

这个断言检查函数是否至少被传递了特定参数调用过一次。需要将一个 spy 函数传递给 `expect`。

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

- **类型**: `(...args: any[]) => Awaitable<void>`

这个断言检查函数在最后一次调用时是否使用了特定参数。需要将一个 spy 函数传递给 `expect`。

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

- **类型**: `(time: number, ...args: any[]) => Awaitable<void>`

这个断言检查函数在特定时间是否使用了特定参数进行调用。计数从 1 开始。因此，要检查第二个条目，我们应该写 `.toHaveBeenNthCalledWith(2, ...)`。

需要将一个 spy 函数传递给 `expect`。

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

- **类型**: `() => Awaitable<void>`

这个断言检查函数是否至少成功返回过一个值（即没有抛出错误）。需要将一个 spy 函数传递给 `expect`。

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

- **类型**: `(amount: number) => Awaitable<void>`

这个断言检查函数是否成功返回了确切次数的值（即没有抛出错误）。需要将一个 spy 函数传递给 `expect`。

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

- **类型**: `(returnValue: any) => Awaitable<void>`

我们可以调用此断言来检查函数是否至少成功返回过一个带有特定参数的值。需要将一个 spy 函数传递给 `expect`。

```ts
import { expect, test, vi } from 'vitest'

test('spy function returns a product', () => {
  const sell = vi.fn((product: string) => ({ product }))

  sell('apples')

  expect(sell).toHaveReturnedWith({ product: 'apples' })
})
```

## toHaveLastReturnedWith

- **类型**: `(returnValue: any) => Awaitable<void>`

我们可以调用此断言来检查函数是否在最后一次调用时成功返回了带有特定参数的值。需要将一个 spy 函数传递给 `expect`。

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

- **类型**: `(time: number, returnValue: any) => Awaitable<void>`

我们可以调用此断言来检查函数是否在特定调用时成功返回了带有特定参数的值。需要将一个 spy 函数传递给 `expect`。

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

- **类型:** `(predicate: (value: any) => boolean) => Awaitable<void>`

该断言检查一个值是否满足「某个谓词/certain predicate」。

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

`resolves` 旨在在断言异步代码时消除样板代码。使用它来从待定的 Promise 中解包值，并使用通常的断言来断言其值。如果 Promise 被拒绝，断言将失败。

它返回相同的 `Assertions` 对象，但所有匹配器现在都返回 `Promise`，因此我们需要使用 `await`。它也适用于 `chai` 断言。

例如，如果有一个函数，它发出 API 调用并返回一些数据，可以使用以下代码来断言其返回值：

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
如果断言没有被等待，那么将得到一个虚假的测试，它将每次都通过。为了确保断言实际上被调用，需要使用 [`expect.assertions(number)`](#expect-assertions)。
:::

## rejects

- **类型:** `Promisify<Assertions>`

`rejects` is intended to remove boilerplate when asserting asynchronous code. Use it to unwrap reason why the promise was rejected, and assert its value with usual assertions. If the promise successfully resolves, the assertion will fail.

It returns the same `Assertions` object, but all matchers now return `Promise`, so you would need to `await` it. Also works with `chai` assertions.

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
If the assertion is not awaited, then you will have a false-positive test that will pass every time. To make sure that assertions were actually called, you can use [`expect.assertions(number)`](#expect-assertions).
:::

## expect.assertions

- **Type:** `(count: number) => void`

After the test has passed or failed verify that a certain number of assertions was called during a test. A useful case would be to check if an asynchronous code was called.

For example, if we have a function that asynchronously calls two matchers, we can assert that they were actually called.

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
When using `assertions` with async concurrent tests, `expect` from the local [Test Context](/guide/test-context.md) must be used to ensure the right test is detected.
:::

## expect.hasAssertions

- **Type:** `() => void`

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
})
```

## expect.unreachable

- **Type:** `(message?: string) => never`

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

## expect.anything

- **Type:** `() => any`

This asymmetric matcher, when used with equality check, will always return `true`. Useful, if you just want to be sure that the property exist.

```ts
import { expect, test } from 'vitest'

test('object has "apples" key', () => {
  expect({ apples: 22 }).toEqual({ apples: expect.anything() })
})
```

## expect.any

- **Type:** `(constructor: unknown) => any`

This asymmetric matcher, when used with an equality check, will return `true` only if the value is an instance of a specified constructor. Useful, if you have a value that is generated each time, and you only want to know that it exists with a proper type.

```ts
import { expect, test } from 'vitest'
import { generateId } from './generators.js'

test('"id" is a number', () => {
  expect({ id: generateId() }).toEqual({ id: expect.any(Number) })
})
```

## expect.closeTo

- **Type:** `(expected: any, precision?: number) => any`
- **Version:** Since Vitest 1.0.0

`expect.closeTo` is useful when comparing floating point numbers in object properties or array item. If you need to compare a number, please use `.toBeCloseTo` instead.

The optional `numDigits` argument limits the number of digits to check **after** the decimal point. For the default value `2`, the test criterion is `Math.abs(expected - received) < 0.005 (that is, 10 ** -2 / 2)`.

For example, this test passes with a precision of 5 digits:

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

- **Type:** `<T>(expected: T[]) => any`

When used with an equality check, this asymmetric matcher will return `true` if the value is an array and contains specified items.

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

:::tip
You can use `expect.not` with this matcher to negate the expected value.
:::

## expect.objectContaining

- **Type:** `(expected: any) => any`

When used with an equality check, this asymmetric matcher will return `true` if the value has a similar shape.

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

:::tip
You can use `expect.not` with this matcher to negate the expected value.
:::

## expect.stringContaining

- **Type:** `(expected: any) => any`

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
  })
})
```

:::tip
You can use `expect.not` with this matcher to negate the expected value.
:::

## expect.stringMatching

- **Type:** `(expected: any) => any`

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
  })
})
```

:::tip
You can use `expect.not` with this matcher to negate the expected value.
:::

## expect.addSnapshotSerializer

- **Type:** `(plugin: PrettyFormatPlugin) => void`

This method adds custom serializers that are called when creating a snapshot. This is an advanced feature - if you want to know more, please read a [guide on custom serializers](/guide/snapshot#custom-serializer).

If you are adding custom serializers, you should call this method inside [`setupFiles`](/config/#setupfiles). This will affect every snapshot.

:::tip
If you previously used Vue CLI with Jest, you might want to install [jest-serializer-vue](https://www.npmjs.com/package/jest-serializer-vue). Otherwise, your snapshots will be wrapped in a string, which cases `"` to be escaped.
:::

## expect.extend

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

::: tip
If you want your matchers to appear in every test, you should call this method inside [`setupFiles`](/config/#setupFiles).
:::

This function is compatible with Jest's `expect.extend`, so any library that uses it to create custom matchers will work with Vitest.

If you are using TypeScript, since Vitest 0.31.0 you can extend default `Assertion` interface in an ambient declaration file (e.g: `vitest.d.ts`) with the code below:

```ts
interface CustomMatchers<R = unknown> {
  toBeFoo(): R
}

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
