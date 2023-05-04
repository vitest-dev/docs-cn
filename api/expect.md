# expect

下面的类型在下面的类型签名中使用。

```ts
type Awaitable<T> = T | PromiseLike<T>
```

`expect` 用于创建断言。在这个上下文中，“断言”是可以调用的函数，用于断言一个语句。Vitest 默认提供 `chai` 断言，并且还提供了基于 `chai` 构建的 `Jest` 兼容断言。

例如，这段代码断言一个 `input` 值等于 `2`。如果不是，断言将抛出一个错误，测试将失败。

```ts
import { expect } from 'vitest'

const input = Math.sqrt(4)

expect(input).to.equal(2) // chai API
expect(input).toBe(2) // jest API
```

从技术上讲，这个例子没有使用 [`test`](/api/#test) 函数，因此在控制台中，你将看到 Nodejs 错误而不是 Vitest 输出。要了解有关 `test` 的更多信息，请阅读 [测试 API 参考](/api/)。

此外，`expect` 还可以静态地使用，以访问后面描述的匹配器函数等更多功能。

::: warning
如果表达式没有类型错误，`expect` 对测试类型没有影响。如果你想将 Vitest 用作 [类型检查器](/guide/testing-types)，请使用 [`expectTypeOf`](/api/expect-typeof) 或 [`assertType`](/api/assert-type)。
:::

## not

使用 `not` 将否定断言。例如，这段代码断言一个 `input` 值不等于 `2`。如果相等，断言将抛出一个错误，测试将失败。

```ts
import { expect, test } from 'vitest'

const input = Math.sqrt(16)

expect(input).not.to.equal(2) // chai API
expect(input).not.toBe(2) // jest API
```

## toBe

- **类型:** `(value: any) => Awaitable<void>`

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

## toBeCloseTo

- **类型:** `(value: number, numDigits?: number) => Awaitable<void>`

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

## toBeDefined

- **类型:** `() => Awaitable<void>`

  `toBeDefined` 断言该值不等于 `undefined`。一个有用的用例是检查函数是否 _返回_ 了任何值。

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

  与 `toBeDefined` 相反，`toBeUndefined` 断言该值 _等于_ `undefined`。一个有用的用例是检查函数是否没有 _返回_ 任何值。

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

  `toBeTruthy` 断言该值在转换为布尔值时为 true。如果你不关心该值，但只想知道它可以转换为 `true`，则此断言非常有用。

  例如，有了这段代码，你不关心 `stocks.getInfo` 的返回值 - 它可能是一个复杂的对象、一个字符串或其他任何东西。代码仍将正常工作。

  ```ts
  import { Stocks } from './stocks.js'
  const stocks = new Stocks()
  stocks.sync('Bill')
  if (stocks.getInfo('Bill'))
    stocks.sell('apples', 'Bill')
  ```

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

  在 JavaScript 中，除了 `false`、`0`、`''`、`null`、`undefined` 和 `NaN` 之外，所有值都是真值。

## toBeFalsy

- **类型:** `() => Awaitable<void>`

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

  在 JavaScript 中，除了 `false`、`0`、`''`、`null`、`undefined` 和 `NaN` 之外，所有值都是真值。

## toBeNull

- **类型:** `() => Awaitable<void>`

  `toBeNull` 简单地断言某个值是否为 `null`。是 `.toBe(null)` 的别名。

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

  `toBeNaN` 简单地断言某个值是否为 `NaN`。是 `.toBe(NaN)` 的别名。

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

## toBeTypeOf

- **类型:** `(c: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined') => Awaitable<void>`

  `toBeTypeOf` 断言实际值是否为接收到的类型。

  ```ts
  import { expect, test } from 'vitest'
  
  const actual = 'stock'
  
  test('stock is type of string', () => {
    expect(actual).toBeTypeOf('string')
  })
  ```

## toBeInstanceOf

- **类型:** `(c: any) => Awaitable<void>`

  `toBeInstanceOf` 断言实际值是否为接收到的类的实例。

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

  `toBeGreaterThan` 断言实际值是否大于接收到的值。相等的值将导致测试失败。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stocks.js'
  
  test('have more then 10 apples', () => {
    expect(getApples()).toBeGreaterThan(10)
  })
  ```

## toBeGreaterThanOrEqual

- **类型:** `(n: number | bigint) => Awaitable<void>`

  `toBeGreaterThanOrEqual` 断言实际值是否大于或等于接收到的值。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stocks.js'
  
  test('have 11 apples or more', () => {
    expect(getApples()).toBeGreaterThanOrEqual(11)
  })
  ```

## toBeLessThan

- **类型:** `(n: number | bigint) => Awaitable<void>`

  `toBeLessThan` 断言实际值是否小于接收到的值。相等的值将导致测试失败。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stocks.js'
  
  test('have less then 20 apples', () => {
    expect(getApples()).toBeLessThan(20)
  })
  ```

## toBeLessThanOrEqual

- **类型:** `(n: number | bigint) => Awaitable<void>`

  `toBeLessThanOrEqual` 断言实际值是否小于或等于接收到的值。

  ```ts
  import { expect, test } from 'vitest'
  import { getApples } from './stocks.js'
  
  test('have 11 apples or less', () => {
    expect(getApples()).toBeLessThanOrEqual(11)
  })
  ```

## toEqual

- **类型:** `(received: any) => Awaitable<void>`

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

## toStrictEqual

- **类型:** `(received: any) => Awaitable<void>`

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
  }

  test('structurally the same, but semantically different', () => {
    expect(new Stock('apples')).toEqual({ type: 'apples' })
    expect(new Stock('apples')).not.toStrictEqual({ type: 'apples' })
  })
  ```

## toContain

- **类型:** `(received: string) => Awaitable<void>`

  `toContain` 断言实际值是否在数组中。`toContain` 还可以检查一个字符串是否是另一个字符串的子字符串。

  ```ts
  import { expect, test } from 'vitest'
  import { getAllFruits } from './stocks.js'
  
  test('the fruit list contains orange', () => {
    expect(getAllFruits()).toContain('orange')
  })
  ```

## toContainEqual

- **类型:** `(received: any) => Awaitable<void>`

  `toContainEqual` 断言是否包含具有特定结构和值的项在数组中。它在每个元素内部像 [`toEqual`](#toequal) 一样工作。

  ```ts
  import { expect, test } from 'vitest'
  import { getFruitStock } from './stocks.js'
  
  test('apple available', () => {
    expect(getFruitStock()).toContainEqual({ fruit: 'apple', count: 5 })
  })
  ```

## toHaveLength

- **类型:** `(received: number) => Awaitable<void>`

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

## toHaveProperty

- **类型:** `(key: any, received?: any) => Awaitable<void>`

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
如果错误消息中的值被截断得太多，你可以在配置文件中增加 [chaiConfig.truncateThreshold](/config/#chaiconfig-truncatethreshold)。
:::

## toMatchObject

- **类型:** `(received: object | array) => Awaitable<void>`

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

## toThrowError

- **类型:** `(received: any) => Awaitable<void>`

- **别名:** `toThrow`

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

## toMatchInlineSnapshot

- **类型:** `<T>(shape?: Partial<T> | string, snapshot?: string, message?: string) => void`

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
    `
    )
  })
  ```

## toMatchFileSnapshot

- **类型:** `<T>(filepath: string, message?: string) => Promise<void>`
- **版本:** Since Vitest 0.30.0

  与指定的文件内容显式比较或更新快照（而不是 `.snap` 文件）。

  ```ts
  import { expect, it } from 'vitest'
  
  it('render basic', async () => {
    const result = renderHTML(h('div', { class: 'foo' }))
    await expect(result).toMatchFileSnapshot('./test/basic.output.html')
  })
  ```

  请注意，由于文件系统操作是异步的，你需要在 `toMatchFileSnapshot()` 中使用 `await`。

## toThrowErrorMatchingSnapshot

- **类型:** `(message?: string) => void`

  与 [`toMatchSnapshot`](#tomatchsnapshot) 相同，但期望与 [`toThrowError`](#tothrowerror) 相同的值。

  如果函数抛出 `Error`，则快照将是错误消息。否则，快照将是函数抛出的值。

## toThrowErrorMatchingInlineSnapshot

- **类型:** `(snapshot?: string, message?: string) => void`

  与 [`toMatchInlineSnapshot`](#tomatchinlinesnapshot) 相同，但期望与 [`toThrowError`](#tothrowerror) 相同的值。

  如果函数抛出 `Error`，则快照将是错误消息。否则，快照将是函数抛出的值。

## toHaveBeenCalled

- **类型:** `() => Awaitable<void>`

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

此断言检查函数是否至少被调用一次，并且使用了特定的参数。需要将 spy 函数传递给 `expect`。

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

此断言检查函数在最后一次调用时是否使用了特定的参数。需要将 spy 函数传递给 `expect`。

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

此断言检查函数在特定时间是否使用了特定的参数。计数从 1 开始。因此，要检查第二个条目，你可以编写 `.toHaveBeenNthCalledWith(2, ...)`。需要将 spy 函数传递给 `expect`。

需要将 spy 函数传递给 `expect`。

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

更好地了解你的问题。此断言检查函数是否至少成功返回了一次值（即未抛出错误）。需要将 spy 函数传递给 `expect`。

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

此断言检查函数是否成功返回了确切次数的值（即未抛出错误）。需要将 spy 函数传递给 `expect`。

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

你可以调用此断言来检查函数是否至少成功返回了一次具有特定参数的值。需要将 spy 函数传递给 `expect`。

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

你可以调用此断言来检查函数是否在最后一次调用时成功返回了具有特定参数的值。需要将 spy 函数传递给 `expect`。

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

你可以调用此断言来检查函数是否在特定调用时成功返回了具有特定参数的值。需要将 spy 函数传递给 `expect`。

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

此断言检查一个值是否满足特定的谓词。

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

  `resolves` 旨在在断言异步代码时消除样板代码。使用它来从挂起的 Promise 中解包值，并使用通常的断言来断言其值。如果 Promise 被拒绝，断言将失败。

  它返回相同的 `Assertions` 对象，但所有匹配器现在都返回 `Promise`，因此你需要 `await` 它。也适用于 `chai` 断言。

  例如，如果你有一个调用 API 并返回一些数据的函数，你可以使用此代码断言其返回值：

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
  如果未等待断言，则你将拥有一个虚假的测试，每次都会通过。为确保实际调用了断言，你可以使用 [`expect.assertions(number)`](#expect-assertions)。
  :::

## rejects

- **类型:** `Promisify<Assertions>`

  `rejects` 旨在在断言异步代码时消除样板代码。使用它来解包 Promise 被拒绝的原因，并使用通常的断言来断言其值。如果 Promise 成功解析，则断言将失败。

  它返回相同的 `Assertions` 对象，但所有匹配器现在都返回 `Promise`，因此你需要 `await` 它。也适用于 `chai` 断言。

  例如，如果你有一个在调用时失败的函数，你可以使用以下代码来断言原因：

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
  如果未等待断言，则你将拥有一个虚假的测试，每次都会通过。为确保实际调用了断言，你可以使用 [`expect.assertions(number)`](#expect-assertions)。
  :::

## expect.assertions

- **类型:** `(count: number) => void`

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

## expect.hasAssertions

- **类型:** `() => void`

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
  })
  ```

<!-- asymmetric matchers -->

## expect.anything

- **类型:** `() => any`

  这个不对称的匹配器，当与相等检查一起使用时，将始终返回 `true`。如果你只想确保属性存在，这将非常有用。

  ```ts
  import { expect, test } from 'vitest'
  
  test('object has "apples" key', () => {
    expect({ apples: 22 }).toEqual({ apples: expect.anything() })
  })
  ```

## expect.any

- **类型:** `(constructor: unknown) => any`

  这个不对称的匹配器，当与相等检查一起使用时，只有在值是指定构造函数的实例时才会返回 `true`。如果你有一个每次生成的值，并且你只想知道它是否具有适当的类型，这将非常有用。

  ```ts
  import { expect, test } from 'vitest'
  import { generateId } from './generators.js'
  
  test('"id" is a number', () => {
    expect({ id: generateId() }).toEqual({ id: expect.any(Number) })
  })
  ```

## expect.arrayContaining

- **类型:** `<T>(expected: T[]) => any`

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
  })
  ```

  :::tip
  你可以使用 `expect.not` 与此匹配器一起使用，以否定预期值。
  :::

## expect.objectContaining

- **类型:** `(expected: any) => any`

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
  })
  ```

  :::tip
  你可以使用 `expect.not` 与此匹配器一起使用，以否定预期值。
  :::

## expect.stringContaining

- **类型:** `(expected: any) => any`

  当与相等检查一起使用时，这个不对称的匹配器将在值是字符串并包含指定子字符串时返回 `true`。

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
  你可以使用 `expect.not` 与此匹配器一起使用，以否定预期值。
  :::

## expect.stringMatching

- **类型:** `(expected: any) => any`

  当与相等检查一起使用时，这个不对称的匹配器将在值是字符串并包含指定子字符串或字符串与正则表达式匹配时返回 `true`。

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
  你可以使用 `expect.not` 与此匹配器一起使用，以否定预期值。
  :::

## expect.addSnapshotSerializer

- **类型:** `(plugin: PrettyFormatPlugin) => void`

  此方法添加自定义序列化程序，当创建快照时调用这些序列化程序。这是一个高级功能 - 如果你想了解更多信息，请阅读有关自定义序列化程序的指南。

  如果你正在添加自定义序列化程序，应在 [`setupFiles`](/config/#setupfiles) 中调用此方法。这将影响到每个快照。

  :::tip
  如果你之前使用 Vue CLI 和 Jest，你可能想要安装 [jest-serializer-vue](https://www.npmjs.com/package/jest-serializer-vue)。否则，你的快照将被包装在一个字符串中，这会导致 `"` 被转义。
  :::

## expect.extend

- **类型:** `(matchers: MatchersObject) => void`

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
  })
  ```

  ::: tip
  如果你希望你的匹配器出现在每个测试中，你应该在 [`setupFiles`](/config/#setupFiles) 中调用此方法。
  :::

  此函数与 Jest 的 `expect.extend` 兼容，因此使用它创建自定义匹配器的任何库都可以与 Vitest 一起使用。

  如果你使用 TypeScript，自 Vitest 0.31.0 起，你可以使用以下代码在环境声明文件（例如：`vitest.d.ts`）中扩展默认的 `Assertion` 接口：

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
  不要忘记在你的 `tsconfig.json` 中包含环境声明文件。
  :::

  :::tip
  如果你想了解更多信息，请查看 [扩展断言](/guide/extending-matchers)。
  :::
