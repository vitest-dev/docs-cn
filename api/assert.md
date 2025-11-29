# assert

Vitest 从 [`chai`](https://www.chaijs.com/api/assert/) 重新导出了 `assert` 方法，用于验证不变量。

## assert

- **类型:** `(expression: any, message?: string) => asserts expression`

断言给定的 `expression` 是 true，否则断言失败。

```ts
import { assert, test } from 'vitest'

test('assert', () => {
  assert('foo' !== 'bar', 'foo should not be equal to bar')
})
```

## fail

- **类型:**
  - `(message?: string) => never`
  - `<T>(actual: T, expected: T, message?: string, operator?: string) => never`

强制断言失败。

```ts
import { assert, test } from 'vitest'

test('assert.fail', () => {
  assert.fail('error message on failure')
  assert.fail('foo', 'bar', 'foo is not bar', '===')
})
```

## isOk

- **类型:** `<T>(value: T, message?: string) => asserts value`
- **Alias** `ok`

断言给定的 `value` 是 true 。

```ts
import { assert, test } from 'vitest'

test('assert.isOk', () => {
  assert.isOk('foo', 'every truthy is ok')
  assert.isOk(false, 'this will fail since false is not truthy')
})
```

## isNotOk

- **类型:** `<T>(value: T, message?: string) => void`
- **Alias** `notOk`

断言给定的 `value` 是 false 。

```ts
import { assert, test } from 'vitest'

test('assert.isNotOk', () => {
  assert.isNotOk('foo', 'this will fail, every truthy is not ok')
  assert.isNotOk(false, 'this will pass since false is falsy')
})
```

## equal

- **类型:** `<T>(actual: T, expected: T, message?: string) => void`

断言 `actual` 和 `expected` 非严格相等 (==)。

```ts
import { assert, test } from 'vitest'

test('assert.equal', () => {
  assert.equal(Math.sqrt(4), '2')
})
```

## notEqual

- **类型:** `<T>(actual: T, expected: T, message?: string) => void`

断言 `actual` 和 `expected` 非严格不等 (!=)。

```ts
import { assert, test } from 'vitest'

test('assert.equal', () => {
  assert.notEqual(Math.sqrt(4), 3)
})
```

## strictEqual

- **类型:** `<T>(actual: T, expected: T, message?: string) => void`

断言 `actual` 和 `expected` 严格相等 (===)。

```ts
import { assert, test } from 'vitest'

test('assert.strictEqual', () => {
  assert.strictEqual(Math.sqrt(4), 2)
})
```

## deepEqual

- **类型:** `<T>(actual: T, expected: T, message?: string) => void`

断言 `actual` 深度等于 `expected` 。

```ts
import { assert, test } from 'vitest'

test('assert.deepEqual', () => {
  assert.deepEqual({ color: 'green' }, { color: 'green' })
})
```

## notDeepEqual

- **类型:** `<T>(actual: T, expected: T, message?: string) => void`

断言 `actual` 不深度等于 `expected` 。

```ts
import { assert, test } from 'vitest'

test('assert.notDeepEqual', () => {
  assert.notDeepEqual({ color: 'green' }, { color: 'red' })
})
```

## isAbove

- **类型:** `(valueToCheck: number, valueToBeAbove: number, message?: string) => void`

断言 `valueToCheck` 严格大于 (>) `valueToBeAbove` 。

```ts
import { assert, test } from 'vitest'

test('assert.isAbove', () => {
  assert.isAbove(5, 2, '5 is strictly greater than 2')
})
```

## isAtLeast

- **类型:** `(valueToCheck: number, valueToBeAtLeast: number, message?: string) => void`

断言 `valueToCheck` 大于等于 (>=) `valueToBeAtLeast` 。

```ts
import { assert, test } from 'vitest'

test('assert.isAtLeast', () => {
  assert.isAtLeast(5, 2, '5 is greater or equal to 2')
  assert.isAtLeast(3, 3, '3 is greater or equal to 3')
})
```

## isBelow

- **类型:** `(valueToCheck: number, valueToBeBelow: number, message?: string) => void`

断言 `valueToCheck` 严格小于 (<) `valueToBeBelow` 。

```ts
import { assert, test } from 'vitest'

test('assert.isBelow', () => {
  assert.isBelow(3, 6, '3 is strictly less than 6')
})
```

## isAtMost

- **类型:** `(valueToCheck: number, valueToBeAtMost: number, message?: string) => void`

断言 `valueToCheck` 小于等于 (<=) `valueToBeAtMost` 。

```ts
import { assert, test } from 'vitest'

test('assert.isAtMost', () => {
  assert.isAtMost(3, 6, '3 is less than or equal to 6')
  assert.isAtMost(4, 4, '4 is less than or equal to 4')
})
```

## isTrue

- **类型:** `<T>(value: T, message?: string) => asserts value is true`

断言 `value` 是 true 。

```ts
import { assert, test } from 'vitest'

const testPassed = true

test('assert.isTrue', () => {
  assert.isTrue(testPassed)
})
```

## isNotTrue

- **类型:** `<T>(value: T, message?: string) => asserts value is Exclude<T, true>`

断言 `value` 不是 true 。

```ts
import { assert, test } from 'vitest'

const testPassed = 'ok'

test('assert.isNotTrue', () => {
  assert.isNotTrue(testPassed)
})
```

## isFalse

- **类型:** `<T>(value: T, message?: string) => asserts value is false`

断言 `value` 是 false 。

```ts
import { assert, test } from 'vitest'

const testPassed = false

test('assert.isFalse', () => {
  assert.isFalse(testPassed)
})
```

## isNotFalse

- **类型:** `<T>(value: T, message?: string) => asserts value is Exclude<T, false>`

断言 `value` 不是 false 。

```ts
import { assert, test } from 'vitest'

const testPassed = 'no'

test('assert.isNotFalse', () => {
  assert.isNotFalse(testPassed)
})
```

## isNull

- **类型:** `<T>(value: T, message?: string) => asserts value is null`

断言 `value` 是 null 。

```ts
import { assert, test } from 'vitest'

const error = null

test('assert.isNull', () => {
  assert.isNull(error, 'error is null')
})
```

## isNotNull

- **类型:** `<T>(value: T, message?: string) => asserts value is Exclude<T, null>`

断言 `value` 不是 null 。

```ts
import { assert, test } from 'vitest'

const error = { message: 'error was occurred' }

test('assert.isNotNull', () => {
  assert.isNotNull(error, 'error is not null but object')
})
```

## isNaN

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 是 NaN 。

```ts
import { assert, test } from 'vitest'

const calculation = 1 * 'vitest'

test('assert.isNaN', () => {
  assert.isNaN(calculation, '1 * "vitest" is NaN')
})
```

## isNotNaN

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 不是 NaN 。

```ts
import { assert, test } from 'vitest'

const calculation = 1 * 2

test('assert.isNotNaN', () => {
  assert.isNotNaN(calculation, '1 * 2 is Not NaN but 2')
})
```

## exists

- **类型:** `<T>(value: T, message?: string) => asserts value is NonNullable<T>`

断言 `value` 既不是 null 也不是 undefined 。

```ts
import { assert, test } from 'vitest'

const name = 'foo'

test('assert.exists', () => {
  assert.exists(name, 'foo is neither null nor undefined')
})
```

## notExists

- **类型:** `<T>(value: T, message?: string) => asserts value is null | undefined`

断言 `value` 是 null 或 undefined 。

```ts
import { assert, test } from 'vitest'

const foo = null
const bar = undefined

test('assert.notExists', () => {
  assert.notExists(foo, 'foo is null so not exist')
  assert.notExists(bar, 'bar is undefined so not exist')
})
```

## isUndefined

- **类型:** `<T>(value: T, message?: string) => asserts value is undefined`

断言 `value` 是 undefined 。

```ts
import { assert, test } from 'vitest'

const name = undefined

test('assert.isUndefined', () => {
  assert.isUndefined(name, 'name is undefined')
})
```

## isDefined

- **类型:** `<T>(value: T, message?: string) => asserts value is Exclude<T, undefined>`

断言 `value` 不是 undefined 。

```ts
import { assert, test } from 'vitest'

const name = 'foo'

test('assert.isDefined', () => {
  assert.isDefined(name, 'name is not undefined')
})
```

## isFunction

- **类型:** `<T>(value: T, message?: string) => void`
- **别名:** `isCallable`
  断言 `value` 是一个函数。

```ts
import { assert, test } from 'vitest'

function name() {
  return 'foo'
}

test('assert.isFunction', () => {
  assert.isFunction(name, 'name is function')
})
```

## isNotFunction

- **类型:** `<T>(value: T, message?: string) => void`
- **别名:** `isNotCallable`

断言 `value` 不是一个函数。

```ts
import { assert, test } from 'vitest'

const name = 'foo'

test('assert.isNotFunction', () => {
  assert.isNotFunction(name, 'name is not function but string')
})
```

## isObject

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 是一个类型为 Object 的对象 (由 Object.prototype.toString 确定)。 此断言不匹配子类对象。

```ts
import { assert, test } from 'vitest'

const someThing = { color: 'red', shape: 'circle' }

test('assert.isObject', () => {
  assert.isObject(someThing, 'someThing is object')
})
```

## isNotObject

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 不是一个类型为 Object 的对象 (如 Object.prototype.toString 确定)。 该断言不匹配子类对象。

```ts
import { assert, test } from 'vitest'

const someThing = 'redCircle'

test('assert.isNotObject', () => {
  assert.isNotObject(someThing, 'someThing is not object but string')
})
```

## isArray

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 是一个数组。

```ts
import { assert, test } from 'vitest'

const color = ['red', 'green', 'yellow']

test('assert.isArray', () => {
  assert.isArray(color, 'color is array')
})
```

## isNotArray

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 不是一个数组。

```ts
import { assert, test } from 'vitest'

const color = 'red'

test('assert.isNotArray', () => {
  assert.isNotArray(color, 'color is not array but string')
})
```

## isString

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 是一个字符串。

```ts
import { assert, test } from 'vitest'

const color = 'red'

test('assert.isString', () => {
  assert.isString(color, 'color is string')
})
```

## isNotString

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 不是一个字符串。

```ts
import { assert, test } from 'vitest'

const color = ['red', 'green', 'yellow']

test('assert.isNotString', () => {
  assert.isNotString(color, 'color is not string but array')
})
```

## isNumber

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 是一个数字。

```ts
import { assert, test } from 'vitest'

const colors = 3

test('assert.isNumber', () => {
  assert.isNumber(colors, 'colors is number')
})
```

## isNotNumber

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 不是一个数字。

```ts
import { assert, test } from 'vitest'

const colors = '3 colors'

test('assert.isNotNumber', () => {
  assert.isNotNumber(colors, 'colors is not number but strings')
})
```

## isFinite

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 是一个有限数字。(不是 NaN, Infinity)。

```ts
import { assert, test } from 'vitest'

const colors = 3

test('assert.isFinite', () => {
  assert.isFinite(colors, 'colors is number not NaN or Infinity')
})
```

## isBoolean

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 是一个布尔值。

```ts
import { assert, test } from 'vitest'

const isReady = true

test('assert.isBoolean', () => {
  assert.isBoolean(isReady, 'isReady is a boolean')
})
```

## isNotBoolean

- **类型:** `<T>(value: T, message?: string) => void`

断言 `value` 不是一个布尔值。

```ts
import { assert, test } from 'vitest'

const isReady = 'sure'

test('assert.isBoolean', () => {
  assert.isBoolean(isReady, 'isReady is not a boolean but string')
})
```

## typeOf

- **类型:** `<T>(value: T, name: string, message?: string) => void`

断言 `value` 的类型是 `name`， 由 Object.prototype.toString 确定。

```ts
import { assert, test } from 'vitest'

test('assert.typeOf', () => {
  assert.typeOf({ color: 'red' }, 'object', 'we have an object')
  assert.typeOf(['red', 'green'], 'array', 'we have an array')
  assert.typeOf('red', 'string', 'we have a string')
  assert.typeOf(/red/, 'regexp', 'we have a regular expression')
  assert.typeOf(null, 'null', 'we have a null')
  assert.typeOf(undefined, 'undefined', 'we have an undefined')
})
```

## notTypeOf

- **类型:** `<T>(value: T, name: string, message?: string) => void`

断言 `value` 的类型不是 `name`，由 Object.prototype.toString 确定。

```ts
import { assert, test } from 'vitest'

test('assert.notTypeOf', () => {
  assert.notTypeOf('red', 'number', '"red" is not a number')
})
```

## instanceOf

- **类型:** `<T>(value: T, constructor: Function, message?: string) => asserts value is T`

断言 `value` 是 `constructor` 的实例。

```ts
import { assert, test } from 'vitest'

function Person(name) {
  this.name = name
}
const foo = new Person('foo')

class Tea {
  constructor(name) {
    this.name = name
  }
}
const coffee = new Tea('coffee')

test('assert.instanceOf', () => {
  assert.instanceOf(foo, Person, 'foo is an instance of Person')
  assert.instanceOf(coffee, Tea, 'coffee is an instance of Tea')
})
```

## notInstanceOf

- **类型:** `<T>(value: T, constructor: Function, message?: string) => asserts value is Exclude<T, U>`

断言 `value` 不是 `constructor` 的实例。

```ts
import { assert, test } from 'vitest'

function Person(name) {
  this.name = name
}
const foo = new Person('foo')

class Tea {
  constructor(name) {
    this.name = name
  }
}
const coffee = new Tea('coffee')

test('assert.instanceOf', () => {
  assert.instanceOf(foo, Tea, 'foo is not an instance of Tea')
})
```

## include

- **类型:**
  - `(haystack: string, needle: string, message?: string) => void`
  - `<T>(haystack: readonly T[] | ReadonlySet<T> | ReadonlyMap<any, T>, needle: T, message?: string) => void`
  - `<T extends object>(haystack: WeakSet<T>, needle: T, message?: string) => void`
  - `<T>(haystack: T, needle: Partial<T>, message?: string) => void`

断言 `haystack` 包含 `needle` 。可以用来断言数组中是否包含一个值、字符串中是否包含一个子字符串、或者对象中是否包含一组属性。

```ts
import { assert, test } from 'vitest'

test('assert.include', () => {
  assert.include([1, 2, 3], 2, 'array contains value')
  assert.include('foobar', 'foo', 'string contains substring')
  assert.include(
    { foo: 'bar', hello: 'universe' },
    { foo: 'bar' },
    'object contains property'
  )
})
```

## notInclude

- **类型:**
  - `(haystack: string, needle: string, message?: string) => void`
  - `<T>(haystack: readonly T[] | ReadonlySet<T> | ReadonlyMap<any, T>, needle: T, message?: string) => void`
  - `<T extends object>(haystack: WeakSet<T>, needle: T, message?: string) => void`
  - `<T>(haystack: T, needle: Partial<T>, message?: string) => void`

断言 `haystack` 不包含 `needle` 。可以用来断言数组中是否不包含一个值、字符串中是否不包含一个子字符串、或者对象中是否不包含一组属性。

```ts
import { assert, test } from 'vitest'

test('assert.notInclude', () => {
  assert.notInclude([1, 2, 3], 4, 'array doesn\'t contain 4')
  assert.notInclude('foobar', 'baz', 'foobar doesn\'t contain baz')
  assert.notInclude({ foo: 'bar', hello: 'universe' }, { foo: 'baz' }, 'object doesn\'t contain property')
})
```

## deepInclude

- **类型:**
- `(haystack: string, needle: string, message?: string) => void`
- `<T>(haystack: readonly T[] | ReadonlySet<T> | ReadonlyMap<any, T>, needle: T, message?: string) => void`
- `<T>(haystack: T, needle: T extends WeakSet<any> ? never : Partial<T>, message?: string) => void`

断言 `haystack`  包含 `needle` 。可以用来断言数组中是否包含一个值或对象中是否包含一组属性。使用深度相等。

```ts
import { assert, test } from 'vitest'

const obj1 = { a: 1 }
const obj2 = { b: 2 }

test('assert.deepInclude', () => {
  assert.deepInclude([obj1, obj2], { a: 1 })
  assert.deepInclude({ foo: obj1, bar: obj2 }, { foo: { a: 1 } })
})
```

## notDeepInclude

- **类型:**
  - `(haystack: string, needle: string, message?: string) => void`
  - `<T>(haystack: readonly T[] | ReadonlySet<T> | ReadonlyMap<any, T>, needle: T, message?: string) => void`
  - `<T>(haystack: T, needle: T extends WeakSet<any> ? never : Partial<T>, message?: string) => void`

断言 `haystack` 不包含 `needle` 。可以用来断言数组中是否不包含一个值或对象中是否不包含一组属性。使用深度相等。

```ts
import { assert, test } from 'vitest'

const obj1 = { a: 1 }
const obj2 = { b: 2 }

test('assert.notDeepInclude', () => {
  assert.notDeepInclude([obj1, obj2], { a: 10 })
  assert.notDeepInclude({ foo: obj1, bar: obj2 }, { foo: { a: 10 } })
})
```

## nestedInclude

- **类型:** `(haystack: any, needle: any, message?: string) => void`

断言 `haystack` 包含 `needle` 。 可以用来断言对象中是否包含一组属性。允许使用点和括号表示法来引用嵌套属性。属性名中的 ‘[]’ 和 ‘.’ 可以使用双反斜杠转义。

```ts
import { assert, test } from 'vitest'

test('assert.nestedInclude', () => {
  assert.nestedInclude({ '.a': { b: 'x' } }, { '\\.a.[b]': 'x' })
  assert.nestedInclude({ a: { '[b]': 'x' } }, { 'a.\\[b\\]': 'x' })
})
```

## notNestedInclude

- **类型:** `(haystack: any, needle: any, message?: string) => void`

断言 `haystack` 不包含 `needle` 。可以用来断言对象中是否不包含一组属性。允许使用点和括号表示法来引用嵌套属性。属性名中的 ‘[]’ 和 ‘.’ 可以使用双反斜杠转义。

```ts
import { assert, test } from 'vitest'

test('assert.nestedInclude', () => {
  assert.notNestedInclude({ '.a': { b: 'x' } }, { '\\.a.b': 'y' })
  assert.notNestedInclude({ a: { '[b]': 'x' } }, { 'a.\\[b\\]': 'y' })
})
```

## deepNestedInclude

- **类型:** `(haystack: any, needle: any, message?: string) => void`

断言 `haystack` 包含 `needle` 。可以用来断言对象中是否包含一组属性，同时检查深度相等性。允许使用点和括号表示法来引用嵌套属性。属性名中的 ‘[]’ 和 ‘.’ 可以使用双反斜杠转义。

```ts
import { assert, test } from 'vitest'

test('assert.deepNestedInclude', () => {
  assert.deepNestedInclude({ a: { b: [{ x: 1 }] } }, { 'a.b[0]': { x: 1 } })
  assert.deepNestedInclude(
    { '.a': { '[b]': { x: 1 } } },
    { '\\.a.\\[b\\]': { x: 1 } }
  )
})
```

## notDeepNestedInclude

- **类型:** `(haystack: any, needle: any, message?: string) => void`

断言 `haystack` 不包含 `needle` 。可以用来断言对象中是否不包含一组属性，同时检查深度相等性。允许使用点和括号表示法来引用嵌套属性。属性名中的 ‘[]’ 和 ‘.’ 可以使用双反斜杠转义。

```ts
import { assert, test } from 'vitest'

test('assert.notDeepNestedInclude', () => {
  assert.notDeepNestedInclude({ a: { b: [{ x: 1 }] } }, { 'a.b[0]': { y: 1 } })
  assert.notDeepNestedInclude(
    { '.a': { '[b]': { x: 1 } } },
    { '\\.a.\\[b\\]': { y: 2 } }
  )
})
```

## ownInclude

- **类型:** `(haystack: any, needle: any, message?: string) => void`

断言 `haystack` 包含 `needle` 。可以用来断言对象中是否包含一组属性，同时忽略继承的属性。

```ts
import { assert, test } from 'vitest'

test('assert.ownInclude', () => {
  assert.ownInclude({ a: 1 }, { a: 1 })
})
```

## notOwnInclude

- **类型:** `(haystack: any, needle: any, message?: string) => void`

断言 `haystack` 包含 `needle` 。可以用来断言对象中是否不包含一组属性，同时忽略继承的属性

```ts
import { assert, test } from 'vitest'

const obj1 = {
  b: 2,
}

const obj2 = object.create(obj1)
obj2.a = 1

test('assert.notOwnInclude', () => {
  assert.notOwnInclude(obj2, { b: 2 })
})
```

## deepOwnInclude

- **类型:** `(haystack: any, needle: any, message?: string) => void`

断言 `haystack` 包含 `needle` 。可以用来断言对象中是否包含一组属性，同时忽略继承的属性并检查深度相等性。

```ts
import { assert, test } from 'vitest'

test('assert.deepOwnInclude', () => {
  assert.deepOwnInclude({ a: { b: 2 } }, { a: { b: 2 } })
})
```

## notDeepOwnInclude

- **类型:** `(haystack: any, needle: any, message?: string) => void`

断言 `haystack` 不包含 `needle` 。可以用来断言对象中是否不包含一组属性，同时忽略继承的属性并检查深度相等性。

```ts
import { assert, test } from 'vitest'

test('assert.notDeepOwnInclude', () => {
  assert.notDeepOwnInclude({ a: { b: 2 } }, { a: { c: 3 } })
})
```

## match

- **类型:** `(value: string, regexp: RegExp, message?: string) => void`

断言 `value` 匹配正则表达式 `regexp` 。

```ts
import { assert, test } from 'vitest'

test('assert.match', () => {
  assert.match('foobar', /^foo/, 'regexp matches')
})
```

## notMatch

- **类型:** `(value: string, regexp: RegExp, message?: string) => void`

断言 `value` 不匹配正则表达式 `regexp` 。

```ts
import { assert, test } from 'vitest'

test('assert.notMatch', () => {
  assert.notMatch('foobar', /^foo/, 'regexp does not match')
})
```

## property

- **类型:** `<T>(object: T, property: string, message?: string) => void`

断言 `object` 具有由 `property` 指定的直接或继承属性。

```ts
import { assert, test } from 'vitest'

test('assert.property', () => {
  assert.property({ tea: { green: 'matcha' } }, 'tea')
  assert.property({ tea: { green: 'matcha' } }, 'toString')
})
```

## notProperty

- **类型:** `<T>(object: T, property: string, message?: string) => void`

断言 `object` 没有由 `property` 指定的直接或继承属性。

```ts
import { assert, test } from 'vitest'

test('assert.notProperty', () => {
  assert.notProperty({ tea: { green: 'matcha' } }, 'coffee')
})
```

## propertyVal

- **类型:** `<T, V>(object: T, property: string, value: V, message?: string) => void`

断言 `object` 具有由 `property` 指定的直接或继承属性，其值为 `value` 。使用严格相等检查（===）。

```ts
import { assert, test } from 'vitest'

test('assert.notPropertyVal', () => {
  assert.propertyVal({ tea: 'is good' }, 'tea', 'is good')
})
```

## notPropertyVal

- **类型:** `<T, V>(object: T, property: string, value: V, message?: string) => void`

断言 `object` 没有由 `property` 指定的直接或继承属性，其值为 `value` 。使用严格相等检查（===）。

```ts
import { assert, test } from 'vitest'

test('assert.notPropertyVal', () => {
  assert.notPropertyVal({ tea: 'is good' }, 'tea', 'is bad')
  assert.notPropertyVal({ tea: 'is good' }, 'coffee', 'is good')
})
```

## deepPropertyVal

- **类型:** `<T, V>(object: T, property: string, value: V, message?: string) => void`

断言 `object` 具有由 `property` 指定的直接或继承属性，其值为 `value` 。使用深度相等检查。

```ts
import { assert, test } from 'vitest'

test('assert.deepPropertyVal', () => {
  assert.deepPropertyVal({ tea: { green: 'matcha' } }, 'tea', {
    green: 'matcha',
  })
})
```

## notDeepPropertyVal

- **类型:** `<T, V>(object: T, property: string, value: V, message?: string) => void`

断言 `object` 没有由 `property` 指定的直接或继承属性，其值为 `value` 。使用深度相等检查。

```ts
import { assert, test } from 'vitest'

test('assert.deepPropertyVal', () => {
  assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', {
    black: 'matcha',
  })
  assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', {
    green: 'oolong',
  })
  assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'coffee', {
    green: 'matcha',
  })
})
```

## nestedProperty

- **类型:** `<T>(object: T, property: string, message?: string) => void`

断言 `object` 具有由 `property` 指定的直接或继承属性，它可以是一个字符串，使用点和括号表示法来引用嵌套的引用。

```ts
import { assert, test } from 'vitest'

test('assert.deepPropertyVal', () => {
  assert.nestedProperty({ tea: { green: 'matcha' } }, 'tea.green')
})
```

## notNestedProperty

- **类型:** `<T>(object: T, property: string, message?: string) => void`

断言 `object` 没有由 `property` 指定的属性，它可以是一个字符串，使用点和括号表示法来引用嵌套的引用。该属性不能存在于对象上，也不能存在于其原型链中的任何地方。

```ts
import { assert, test } from 'vitest'

test('assert.deepPropertyVal', () => {
  assert.notNestedProperty({ tea: { green: 'matcha' } }, 'tea.oolong')
})
```

## nestedPropertyVal

- **类型:** `<T>(object: T, property: string, value: any, message?: string) => void`

断言 `object` 具有由 `property` 指定的属性，其值为 `value` 给出。 `property` 可以使用点和方括号表示法进行嵌套引用。使用严格相等检查 (===)。

```ts
import { assert, test } from 'vitest'

test('assert.nestedPropertyVal', () => {
  assert.nestedPropertyVal({ tea: { green: 'matcha' } }, 'tea.green', 'matcha')
})
```

## notNestedPropertyVal

- **类型:** `<T>(object: T, property: string, value: any, message?: string) => void`

断言 `object` 没有由 `property` 指定的属性，其值为 `value` 给出。 `property` 可以使用点和方括号表示法进行嵌套引用。使用严格相等检查 (===)。

```ts
import { assert, test } from 'vitest'

test('assert.notNestedPropertyVal', () => {
  assert.notNestedPropertyVal({ tea: { green: 'matcha' } }, 'tea.green', 'konacha')
  assert.notNestedPropertyVal({ tea: { green: 'matcha' } }, 'coffee.green', 'matcha')
})
```

## deepNestedPropertyVal

- **类型:** `<T>(object: T, property: string, value: any, message?: string) => void`

断言 `object` 具有由 `property` 指定的属性，其值为 `value` 给出。 `property` 可以使用点和方括号表示法进行嵌套引用。使用深度相等检查。

```ts
import { assert, test } from 'vitest'

test('assert.notNestedPropertyVal', () => {
  assert.notNestedPropertyVal({ tea: { green: 'matcha' } }, 'tea.green', 'konacha')
  assert.notNestedPropertyVal({ tea: { green: 'matcha' } }, 'coffee.green', 'matcha')
})
```

## notDeepNestedPropertyVal

- **类型:** `<T>(object: T, property: string, value: any, message?: string) => void`

断言 `object` 没有由 `property` 指定的属性，其值为 `value` 给出。 `property` 可以使用点和方括号表示法进行嵌套引用。使用深度相等检查。

```ts
import { assert, test } from 'vitest'

test('assert.notDeepNestedPropertyVal', () => {
  assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { oolong: 'yum' })
  assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { matcha: 'yuck' })
  assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.black', { matcha: 'yum' })
})
```

## lengthOf

- **类型:** `<T extends { readonly length?: number | undefined } | { readonly size?: number | undefined }>(object: T, length: number, message?: string) => void`

断言 `object` 具有预期的 `length` 或 `size` 值。

```ts
import { assert, test } from 'vitest'

test('assert.lengthOf', () => {
  assert.lengthOf([1, 2, 3], 3, 'array has length of 3')
  assert.lengthOf('foobar', 6, 'string has length of 6')
  assert.lengthOf(new Set([1, 2, 3]), 3, 'set has size of 3')
  assert.lengthOf(new Map([['a', 1], ['b', 2], ['c', 3]]), 3, 'map has size of 3')
})
```

## hasAnyKeys

- **类型:** `<T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void`

断言 `object` 至少拥有一个提供的 `keys` 。你也可以提供一个单独的对象而不是一个 `keys` 数组，它的键将被用作预期的键集。

```ts
import { assert, test } from 'vitest'

test('assert.hasAnyKeys', () => {
  assert.hasAnyKeys({ foo: 1, bar: 2, baz: 3 }, ['foo', 'iDontExist', 'baz'])
  assert.hasAnyKeys({ foo: 1, bar: 2, baz: 3 }, { foo: 30, iDontExist: 99, baz: 1337 })
  assert.hasAnyKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value'],]), [{ foo: 1 }, 'key'])
  assert.hasAnyKeys(new Set([{ foo: 'bar' }, 'anotherKey']), [{ foo: 'bar' }, 'anotherKey'])
})
```

## hasAllKeys

- **类型:** `<T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void`

断言 `object` 拥有且仅拥有所有提供的 `keys` 。你也可以提供一个单独的对象而不是一个 `keys` 数组，它的键将被用作预期的键集。

```ts
import { assert, test } from 'vitest'

test('assert.hasAllKeys', () => {
  assert.hasAllKeys({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar', 'baz'])
  assert.hasAllKeys({ foo: 1, bar: 2, baz: 3 }, { foo: 30, bar: 99, baz: 1337 })
  assert.hasAllKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value'],]), [{ foo: 1 }, 'key'])
  assert.hasAllKeys(new Set([{ foo: 'bar' }, 'anotherKey'], [{ foo: 'bar' }, 'anotherKey']))
})
```

## containsAllKeys

- **类型:** `<T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void`

断言 `object` 拥有所有提供的 `keys`，但可能还有更多未列出的键。你也可以提供一个单独的对象而不是一个 `keys` 数组，它的键将被用作预期的键集。

```ts
import { assert, test } from 'vitest'

test('assert.containsAllKeys', () => {
  assert.containsAllKeys({ foo: 1, bar: 2, baz: 3 }, ['foo', 'baz'])
  assert.containsAllKeys({ foo: 1, bar: 2, baz: 3 }, ['foo', 'bar', 'baz'])
  assert.containsAllKeys({ foo: 1, bar: 2, baz: 3 }, { foo: 30, baz: 1337 })
  assert.containsAllKeys({ foo: 1, bar: 2, baz: 3 }, { foo: 30, bar: 99, baz: 1337 })
  assert.containsAllKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value'],]), [{ foo: 1 }])
  assert.containsAllKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value'],]), [{ foo: 1 }, 'key'])
  assert.containsAllKeys(new Set([{ foo: 'bar' }, 'anotherKey'], [{ foo: 'bar' }]))
  assert.containsAllKeys(new Set([{ foo: 'bar' }, 'anotherKey'], [{ foo: 'bar' }, 'anotherKey']))
})
```

## doesNotHaveAnyKeys

- **类型:** `<T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void`

断言 `object` 不拥有任何提供的 `keys` 。你也可以提供一个单独的对象而不是一个 `keys` 数组，它的键将被用作预期的键集。

```ts
import { assert, test } from 'vitest'

test('assert.doesNotHaveAnyKeys', () => {
  assert.doesNotHaveAnyKeys({ foo: 1, bar: 2, baz: 3 }, ['one', 'two', 'example',])
  assert.doesNotHaveAnyKeys({ foo: 1, bar: 2, baz: 3 }, { one: 1, two: 2, example: 'foo' })
  assert.doesNotHaveAnyKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value'],]), [{ one: 'two' }, 'example'])
  assert.doesNotHaveAnyKeys(new Set([{ foo: 'bar' }, 'anotherKey'], [{ one: 'two' }, 'example']))
})
```

## doesNotHaveAllKeys

- **类型:** `<T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void`

断言 `object` 至少不拥有一个提供的 `keys` 。你也可以提供一个单独的对象而不是一个 `keys` 数组，它的键将被用作预期的键集。

```ts
import { assert, test } from 'vitest'

test('assert.hasAnyKeys', () => {
  assert.doesNotHaveAnyKeys({ foo: 1, bar: 2, baz: 3 }, ['one', 'two', 'example',])
  assert.doesNotHaveAnyKeys({ foo: 1, bar: 2, baz: 3 }, { one: 1, two: 2, example: 'foo' })
  assert.doesNotHaveAnyKeys(new Map([[{ foo: 1 }, 'bar'], ['key', 'value'],]), [{ one: 'two' }, 'example'])
  assert.doesNotHaveAnyKeys(new Set([{ foo: 'bar' }, 'anotherKey']), [{ one: 'two' }, 'example',])
})
```

## hasAnyDeepKeys

- **类型:** `<T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void`

断言 `object` 至少拥有一个提供的 `keys` 。由于 Set 和 Map 可以拥有对象作为键，你可以使用这个断言来进行深度比较。你也可以提供一个单独的对象而不是一个 keys 数组，它的键将被用作预期的键集。

```ts
import { assert, test } from 'vitest'

test('assert.hasAnyDeepKeys', () => {
  assert.hasAnyDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [1, 2],]), { one: 'one' })
  assert.hasAnyDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [1, 2],]), [{ one: 'one' }, { two: 'two' }])
  assert.hasAnyDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [{ two: 'two' }, 'valueTwo'],]), [{ one: 'one' }, { two: 'two' }])
  assert.hasAnyDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), { one: 'one', })
  assert.hasAnyDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ one: 'one' }, { three: 'three' },])
  assert.hasAnyDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ one: 'one' }, { two: 'two' },])
})
```

## hasAllDeepKeys

- **类型:** `<T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void`

断言 `object` 拥有且仅拥有所有提供的 `keys` 。由于 Set 和 Map 可以拥有对象作为键，你可以使用这个断言来进行深度比较。你也可以提供一个单独的对象而不是一个 keys 数组，它的键将被用作预期的键集。

```ts
import { assert, test } from 'vitest'

test('assert.hasAnyDeepKeys', () => {
  assert.hasAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne']]), { one: 'one', })
  assert.hasAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [{ two: 'two' }, 'valueTwo'],]), [{ one: 'one' }, { two: 'two' }])
  assert.hasAllDeepKeys(new Set([{ one: 'one' }]), { one: 'one' })
  assert.hasAllDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ one: 'one' }, { two: 'two' },])
})
```

## containsAllDeepKeys

- **类型:** `<T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void`

断言 `object` 包含所有提供的 `keys` 。由于 Set 和 Map 可以拥有对象作为键，你可以使用这个断言来进行深度比较。你也可以提供一个单独的对象而不是一个 `keys` 数组，它的键将被用作预期的键集。

```ts
import { assert, test } from 'vitest'

test('assert.containsAllDeepKeys', () => {
  assert.containsAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [1, 2],]), { one: 'one' })
  assert.containsAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [{ two: 'two' }, 'valueTwo'],]), [{ one: 'one' }, { two: 'two' }])
  assert.containsAllDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), { one: 'one', })
  assert.containsAllDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ one: 'one' }, { two: 'two' },])
})
```

## doesNotHaveAnyDeepKeys

- **类型:** `<T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void`

断言 `object` 不拥有任何提供的 `keys` 。由于 Set 和 Map 可以拥有对象作为键，你可以使用这个断言来进行深度比较。你也可以提供一个单独的对象而不是一个 `keys` 数组，它的键将被用作预期的键集。

```ts
import { assert, test } from 'vitest'

test('assert.doesNotHaveAnyDeepKeys', () => {
  assert.doesNotHaveAnyDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [1, 2],]), { thisDoesNot: 'exist' })
  assert.doesNotHaveAnyDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [{ two: 'two' }, 'valueTwo'],]), [{ twenty: 'twenty' }, { fifty: 'fifty' }])
  assert.doesNotHaveAnyDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), { twenty: 'twenty', })
  assert.doesNotHaveAnyDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ twenty: 'twenty' }, { fifty: 'fifty' },])
})
```

## doesNotHaveAllDeepKeys

- **类型:** `<T>(object: T, keys: Array<Object | string> | { [key: string]: any }, message?: string) => void`

断言 `object` 至少不拥有一个提供的 `keys` 。由于 Set 和 Map 可以拥有对象作为键，你可以使用这个断言来进行深度比较。你也可以提供一个单独的对象而不是一个 `keys` 数组，它的键将被用作预期的键集。

```ts
import { assert, test } from 'vitest'

test('assert.doesNotHaveAllDeepKeys', () => {
  assert.doesNotHaveAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [1, 2],]), { thisDoesNot: 'exist' })
  assert.doesNotHaveAllDeepKeys(new Map([[{ one: 'one' }, 'valueOne'], [{ two: 'two' }, 'valueTwo'],]), [{ twenty: 'twenty' }, { one: 'one' }])
  assert.doesNotHaveAllDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), { twenty: 'twenty', })
  assert.doesNotHaveAllDeepKeys(new Set([{ one: 'one' }, { two: 'two' }]), [{ one: 'one' }, { fifty: 'fifty' },])
})
```

## throws

- **类型:**
  - `(fn: () => void, errMsgMatcher?: RegExp | string, ignored?: any, message?: string) => void`
  - `(fn: () => void, errorLike?: ErrorConstructor | Error | null, errMsgMatcher?: RegExp | string | null, message?: string) => void`
- **别名:**
  - `throw`
  - `Throw`

如果 `errorLike` 是一个 Error 构造函数，则断言 `fn` 将抛出一个 errorLike 实例的错误。如果 `errorLike` 是一个 Error 实例，则断言抛出的错误与 `errorLike` 是同一个实例。如果提供了 `errMsgMatcher`，它还断言抛出的错误将具有与 `errMsgMatcher` 相匹配的消息。

```ts
import { assert, test } from 'vitest'

test('assert.throws', () => {
  assert.throws(fn, 'Error thrown must have this msg')
  assert.throws(fn, /Error thrown must have a msg that matches this/)
  assert.throws(fn, ReferenceError)
  assert.throws(fn, errorInstance)
  assert.throws(fn, ReferenceError, 'Error thrown must be a ReferenceError and have this msg')
  assert.throws(fn, errorInstance, 'Error thrown must be the same errorInstance and have this msg')
  assert.throws(fn, ReferenceError, /Error thrown must be a ReferenceError and match this/)
  assert.throws(fn, errorInstance, /Error thrown must be the same errorInstance and match this/)
})
```

## doesNotThrow

- **类型:** `(fn: () => void, errMsgMatcher?: RegExp | string, ignored?: any, message?: string) => void`
- **类型:** `(fn: () => void, errorLike?: ErrorConstructor | Error | null, errMsgMatcher?: RegExp | string | null, message?: string) => void`

如果 `errorLike` 是一个 Error 构造函数，则断言 `fn` 不会 抛出一个 errorLike 实例的错误。如果 `errorLike` 是一个 Error 实例，则断言抛出的错误不是与 errorLike 是同一个实例。如果提供了 `errMsgMatcher`，它还断言抛出的错误不会 具有与 `errMsgMatcher` 相匹配的消息。

```ts
import { assert, test } from 'vitest'

test('assert.doesNotThrow', () => {
  assert.doesNotThrow(fn, 'Any Error thrown must not have this message')
  assert.doesNotThrow(fn, /Any Error thrown must not match this/)
  assert.doesNotThrow(fn, Error)
  assert.doesNotThrow(fn, errorInstance)
  assert.doesNotThrow(fn, Error, 'Error must not have this message')
  assert.doesNotThrow(fn, errorInstance, 'Error must not have this message')
  assert.doesNotThrow(fn, Error, /Error must not match this/)
  assert.doesNotThrow(fn, errorInstance, /Error must not match this/)
})
```

## operator

- **类型:** `(val1: OperatorComparable, operator: Operator, val2: OperatorComparable, message?: string) => void`

使用 `operator` 比较 `val1` 和 `val2` 。

```ts
import { assert, test } from 'vitest'

test('assert.operator', () => {
  assert.operator(1, '<', 2, 'everything is ok')
})
```

## closeTo

- **类型:** `(actual: number, expected: number, delta: number, message?: string) => void`
- **别名:** `approximately`

断言 `actual` 等于 `expected`，误差范围控制在 +/- `delta` 内。

```ts
import { assert, test } from 'vitest'

test('assert.closeTo', () => {
  assert.closeTo(1.5, 1, 0.5, 'numbers are close')
})
```

## sameMembers

- **类型:** `<T>(set1: T[], set2: T[], message?: string) => void`

断言 `set1` 和 `set2` 具有相同的成员，但顺序可以不同。使用严格相等检查 (===)。

```ts
import { assert, test } from 'vitest'

test('assert.sameMembers', () => {
  assert.sameMembers([1, 2, 3], [2, 1, 3], 'same members')
})
```

## notSameMembers

- **类型:** `<T>(set1: T[], set2: T[], message?: string) => void`

断言 `set1` 和 `set2` 不具有相同的成员，但顺序可以不同。使用严格相等检查 (===)。

```ts
import { assert, test } from 'vitest'

test('assert.sameMembers', () => {
  assert.notSameMembers([1, 2, 3], [5, 1, 3], 'not same members')
})
```

## sameDeepMembers

- **类型:** `<T>(set1: T[], set2: T[], message?: string) => void`

断言 `set1` 和 `set2` 具有相同的成员，但顺序可以不同。使用深度相等检查。

```ts
import { assert, test } from 'vitest'

test('assert.sameDeepMembers', () => {
  assert.sameDeepMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { a: 1 }, { c: 3 }], 'same deep members')
})
```

## notSameDeepMembers

- **类型:** `<T>(set1: T[], set2: T[], message?: string) => void`

断言 `set1` 和 `set2` 不具有相同的成员，但顺序可以不同。使用深度相等检查。

```ts
import { assert, test } from 'vitest'

test('assert.sameDeepMembers', () => {
  assert.sameDeepMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { a: 1 }, { c: 3 }], 'same deep members')
})
```

## sameOrderedMembers

- **类型:** `<T>(set1: T[], set2: T[], message?: string) => void`

断言 `set1` 和 `set2` 具有相同的成员，并且顺序也相同。使用严格相等检查 (===)。

```ts
import { assert, test } from 'vitest'

test('assert.sameOrderedMembers', () => {
  assert.sameOrderedMembers([1, 2, 3], [1, 2, 3], 'same ordered members')
})
```

## notSameOrderedMembers

- **类型:** `<T>(set1: T[], set2: T[], message?: string) => void`

断言 `set1` 和 `set2` 的成员不相同或顺序不同。使用严格相等比较 (===)。

```ts
import { assert, test } from 'vitest'

test('assert.notSameOrderedMembers', () => {
  assert.notSameOrderedMembers([1, 2, 3], [2, 1, 3], 'not same ordered members')
})
```

## sameDeepOrderedMembers

- **类型:** `<T>(set1: T[], set2: T[], message?: string) => void`

断言 `set1` 和 `set2` 的成员相同且顺序相同。使用深度相等比较。

```ts
import { assert, test } from 'vitest'

test('assert.sameDeepOrderedMembers', () => {
  assert.sameDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ a: 1 }, { b: 2 }, { c: 3 }], 'same deep ordered members')
})
```

## notSameDeepOrderedMembers

- **类型:** `<T>(set1: T[], set2: T[], message?: string) => void`

断言 `set1` 和 `set2` 的成员不相同或顺序不同。使用深度相等比较。

```ts
import { assert, test } from 'vitest'

test('assert.notSameDeepOrderedMembers', () => {
  assert.notSameDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ a: 1 }, { b: 2 }, { z: 5 }], 'not same deep ordered members')
  assert.notSameDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { a: 1 }, { c: 3 }], 'not same deep ordered members')
})
```

## includeMembers

- **类型:** `<T>(superset: T[], subset: T[], message?: string) => void`

断言 `subset` 被包含在 `superset` 中，顺序可以不同。使用严格相等比较 (===)。忽略重复项。

```ts
import { assert, test } from 'vitest'

test('assert.includeMembers', () => {
  assert.includeMembers([1, 2, 3], [2, 1, 2], 'include members')
})
```

## notIncludeMembers

- **类型:** `<T>(superset: T[], subset: T[], message?: string) => void`

断言 `subset` 未被包含在 `superset` 中，顺序可以不同。使用严格相等比较 (===)。忽略重复项。

```ts
import { assert, test } from 'vitest'

test('assert.notIncludeMembers', () => {
  assert.notIncludeMembers([1, 2, 3], [5, 1], 'not include members')
})
```

## includeDeepMembers

- **类型:** `<T>(superset: T[], subset: T[], message?: string) => void`

断言 `subset` 被包含在 `superset` 中，顺序可以不同。使用深度相等比较。忽略重复项。

```ts
import { assert, test } from 'vitest'

test('assert.includeDeepMembers', () => {
  assert.includeDeepMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { a: 1 }, { b: 2 }], 'include deep members')
})
```

## notIncludeDeepMembers

- **类型:** `<T>(superset: T[], subset: T[], message?: string) => void`

断言 `subset` 未被包含在 `superset` 中，顺序可以不同。使用深度相等比较。忽略重复项。

```ts
import { assert, test } from 'vitest'

test('assert.notIncludeDeepMembers', () => {
  assert.notIncludeDeepMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { f: 5 }], 'not include deep members')
})
```

## includeOrderedMembers

- **类型:** `<T>(superset: T[], subset: T[], message?: string) => void`

断言 `subset` 被包含在 `superset` 中，顺序相同，从 `superset` 中的第一个元素开始。使用严格相等比较 (===)。

```ts
import { assert, test } from 'vitest'

test('assert.includeOrderedMembers', () => {
  assert.includeOrderedMembers([1, 2, 3], [1, 2], 'include ordered members')
})
```

## notIncludeOrderedMembers

- **类型:** `<T>(superset: T[], subset: T[], message?: string) => void`

断言 `subset` 未被包含在 `superset` 中，顺序相同，从 `superset` 中的第一个元素开始。使用严格相等比较 (===)。

```ts
import { assert, test } from 'vitest'

test('assert.notIncludeOrderedMembers', () => {
  assert.notIncludeOrderedMembers([1, 2, 3], [2, 1], 'not include ordered members')
  assert.notIncludeOrderedMembers([1, 2, 3], [2, 3], 'not include ordered members')
})
```

## includeDeepOrderedMembers

- **类型:** `<T>(superset: T[], subset: T[], message?: string) => void`

断言 `subset` 被包含在 `superset` 中，顺序相同，从 `superset` 中的第一个元素开始。使用深度相等比较。

```ts
import { assert, test } from 'vitest'

test('assert.includeDeepOrderedMembers', () => {
  assert.includeDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ a: 1 }, { b: 2 }], 'include deep ordered members')
})
```

## notIncludeDeepOrderedMembers

- **类型:** `<T>(superset: T[], subset: T[], message?: string) => void`

断言 `subset` 未被包含在 `superset` 中，顺序相同，从 `superset` 中的第一个元素开始。使用深度相等比较。

```ts
import { assert, test } from 'vitest'

test('assert.includeDeepOrderedMembers', () => {
  assert.notIncludeDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ a: 1 }, { f: 5 }], 'not include deep ordered members')
  assert.notIncludeDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { a: 1 }], 'not include deep ordered members')
  assert.notIncludeDeepOrderedMembers([{ a: 1 }, { b: 2 }, { c: 3 }], [{ b: 2 }, { c: 3 }], 'not include deep ordered members')
})
```

## oneOf

- **类型:** `<T>(inList: T, list: T[], message?: string) => void`

断言非对象、非数组值 `inList` 出现在扁平数组 list 中。

```ts
import { assert, test } from 'vitest'

test('assert.oneOf', () => {
  assert.oneOf(1, [2, 1], 'Not found in list')
})
```

## changes

- **类型:** `<T>(modifier: Function, object: T, property: string, message?: string) => void`

断言 `函数` 用于修改 `property` 所属 `object` 。

```ts
import { assert, test } from 'vitest'

test('assert.changes', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 22 };
  assert.changes(fn, obj, 'val')
})
```

## changesBy

- **类型:** `<T>(modifier: Function, object: T, property: string, change: number, message?: string) => void`

断言 `函数` 通过 `change` 修改 `property` 所属的 `object` 。

```ts
import { assert, test } from 'vitest'

test('assert.changesBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val += 2 };
  assert.changesBy(fn, obj, 'val', 2)
})
```

## doesNotChange

- **类型:** `<T>(modifier: Function, object: T, property: string, message?: string) => void`

断言 `函数` 不会通过 `change` 修改 `property` 或 `函数` 返回值的 `object` 。

```ts
import { assert, test } from 'vitest'

test('assert.doesNotChange', () => {
  const obj = { val: 10 }
  function fn() { obj.val += 2 };
  assert.doesNotChange(fn, obj, 'val', 2)
})
```

## changesButNotBy

- **类型:** `<T>(modifier: Function, object: T, property: string, change:number, message?: string) => void`

断言 `函数` 不会通过 `change` 修改 `property` 或 `函数` 返回值的所属对象。

```ts
import { assert, test } from 'vitest'

test('assert.changesButNotBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val += 10 };
  assert.changesButNotBy(fn, obj, 'val', 5)
})
```

## increases

- **类型:** `<T>(modifier: Function, object: T, property: string, message?: string) => void`

断言 `函数` 会增加数值类型对象属性。

```ts
import { assert, test } from 'vitest'

test('assert.increases', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 13 };
  assert.increases(fn, obj, 'val')
})
```

## increasesBy

- **类型:** `<T>(modifier: Function, object: T, property: string, change: number, message?: string) => void`

断言 `函数` 会通过 `change` 增加数值类型对象属性或 `函数` 返回值的数值。

```ts
import { assert, test } from 'vitest'

test('assert.increasesBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val += 10 };
  assert.increasesBy(fn, obj, 'val', 10)
})
```

## doesNotIncrease

- **类型:** `<T>(modifier: Function, object: T, property: string, message?: string) => void`

断言 `函数` 不会增加数值类型对象属性。

```ts
import { assert, test } from 'vitest'

test('assert.doesNotIncrease', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 8 }
  assert.doesNotIncrease(fn, obj, 'val')
})
```

## increasesButNotBy

- **类型:** `<T>(modifier: Function, object: T, property: string, change: number, message?: string) => void`

断言 `函数` 不会通过 `change` 增加数值类型对象属性或 `函数` 返回值的数值。

```ts
import { assert, test } from 'vitest'

test('assert.increasesButNotBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val += 15 };
  assert.increasesButNotBy(fn, obj, 'val', 10)
})
```

## decreases

- **类型:** `<T>(modifier: Function, object: T, property: string, message?: string) => void`

断言 `函数` 不会通过 `change` 增加数值类型对象属性或 `函数` 返回值的数值。

```ts
import { assert, test } from 'vitest'

test('assert.decreases', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 5 };
  assert.decreases(fn, obj, 'val')
})
```

## decreasesBy

- **类型:** `<T>(modifier: Function, object: T, property: string, change: number, message?: string) => void`

断言 `函数` 会通过 `change` 减少数值类型对象属性或 `函数` 返回值的数值。

```ts
import { assert, test } from 'vitest'

test('assert.decreasesBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val -= 5 };
  assert.decreasesBy(fn, obj, 'val', 5)
})
```

## doesNotDecrease

- **类型:** `<T>(modifier: Function, object: T, property: string, message?: string) => void`

断言 `函数` 不会减少数值类型对象属性。

```ts
import { assert, test } from 'vitest'

test('assert.doesNotDecrease', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 15 }
  assert.doesNotDecrease(fn, obj, 'val')
})
```

## doesNotDecreaseBy

- **类型:** `<T>(modifier: Function, object: T, property: string, change: number, message?: string) => void`

断言 `函数` 不会通过 `change` 减少数值类型对象属性或 `函数` 返回值的数值。

```ts
import { assert, test } from 'vitest'

test('assert.doesNotDecreaseBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 5 };
  assert.doesNotDecreaseBy(fn, obj, 'val', 1)
})
```

## decreasesButNotBy

- **类型:** `<T>(modifier: Function, object: T, property: string, change: number, message?: string) => void`

断言 `函数` 不会通过 change 减少数值类型对象属性或 `函数` 返回值的数值。

```ts
import { assert, test } from 'vitest'

test('assert.decreasesButNotBy', () => {
  const obj = { val: 10 }
  function fn() { obj.val = 5 };
  assert.decreasesButNotBy(fn, obj, 'val', 1)
})
```

## ifError

- **类型:** `<T>(object: T, message?: string) => void`

断言 `object` 是否为假值，如果它是真值则抛出错误。这是为了允许 chai 作为 Node 的 assert 类的一个直接替代品。

```ts
import { assert, test } from 'vitest'

test('assert.ifError', () => {
  const err = new Error('I am a custom error')
  assert.ifError(err) // 重新抛出错误！
})
```

## isExtensible

- **类型:** `<T>(object: T, message?: string) => void`
- **别名:** `extensible`

断言 `object` 是可扩展的（可以向其添加新的属性）。

```ts
import { assert, test } from 'vitest'

test('assert.isExtensible', () => {
  assert.isExtensible({})
})
```

## isNotExtensible

- **类型:** `<T>(object: T, message?: string) => void`
- **别名:** `notExtensible`

断言 `object` 是不可扩展的 （不能添加新属性）。

```ts
import { assert, test } from 'vitest'

test('assert.isNotExtensible', () => {
  const nonExtensibleObject = Object.preventExtensions({})
  const sealedObject = Object.seal({})
  const frozenObject = Object.freeze({})

  assert.isNotExtensible(nonExtensibleObject)
  assert.isNotExtensible(sealedObject)
  assert.isNotExtensible(frozenObject)
})
```

## isSealed

- **类型:** `<T>(object: T, message?: string) => void`
- **别名:** `sealed`

断言 `object` 是密封的（不能向其添加新的属性，也不能删除其现有属性）。

```ts
import { assert, test } from 'vitest'

test('assert.isSealed', () => {
  const sealedObject = Object.seal({})
  const frozenObject = Object.seal({})

  assert.isSealed(sealedObject)
  assert.isSealed(frozenObject)
})
```

## isNotSealed

- **类型:** `<T>(object: T, message?: string) => void`
- **别名:** `notSealed`

断言 `object` 未被密封（可以添加新属性，并且可以删除其现有属性）。

```ts
import { assert, test } from 'vitest'

test('assert.isNotSealed', () => {
  assert.isNotSealed({})
})
```

## isFrozen

- **类型:** `<T>(object: T, message?: string) => void`
- **别名:** `frozen`

断言 `object` 是冻结的（不能向其添加新的属性，也不能修改其现有属性）。

```ts
import { assert, test } from 'vitest'

test('assert.isFrozen', () => {
  const frozenObject = Object.freeze({})
  assert.frozen(frozenObject)
})
```

## isNotFrozen

- **类型:** `<T>(object: T, message?: string) => void`
- **别名:** `notFrozen`

断言 `object` 未被冻结（可以向其添加新属性，并且可以修改其现有属性）。

```ts
import { assert, test } from 'vitest'

test('assert.isNotFrozen', () => {
  assert.isNotFrozen({})
})
```

## isEmpty

- **类型:** `<T>(target: T, message?: string) => void`
- **别名:** `empty`

断言 `target` 不包含任何值。对于数组和字符串，它检查 length 属性。对于 Map 和 Set 实例，它检查 size 属性。对于非函数对象，它获取自身可枚举字符串键的数量。

```ts
import { assert, test } from 'vitest'

test('assert.isEmpty', () => {
  assert.isEmpty([])
  assert.isEmpty('')
  assert.isEmpty(new Map())
  assert.isEmpty({})
})
```

## isNotEmpty

- **类型:** `<T>(object: T, message?: string) => void`
- **别名:** `notEmpty`

断言 `target` 包含值。对于数组和字符串，它检查 length 属性。对于 Map 和 Set 实例，它检查 size 属性。对于非函数对象，它获取自身可枚举字符串键的数量。

```ts
import { assert, test } from 'vitest'

test('assert.isNotEmpty', () => {
  assert.isNotEmpty([1, 2])
  assert.isNotEmpty('34')
  assert.isNotEmpty(new Set([5, 6]))
  assert.isNotEmpty({ key: 7 })
})
```
