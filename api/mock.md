# Mock Functions

我们可以使用 `vi.fn` 方法创建一个 mock 函数来跟踪其执行情况。如果要跟踪已创建对象上的方法，可以使用 `vi.spyOn` 方法：

```js
import { vi } from 'vitest'

const fn = vi.fn()
fn('hello world')
fn.mock.calls[0] === ['hello world']

const market = {
  getApples: () => 100,
}

const getApplesSpy = vi.spyOn(market, 'getApples')
market.getApples()
getApplesSpy.mock.calls.length === 1
```

我们应该在 [`expect`](/api/expect) 上使用 mock 断言（例如 [`toHaveBeenCalled`](/api/expect#tohavebeencalled) ）来断言 mock 结果。在这里我们介绍了用于操作 mock 行为的可用属性和方法。

## getMockImplementation

- **类型:** `(...args: any) => any`

返回当前的模拟实现（如果有）。

如果使用 [`vi.fn`](/api/vi#vi-fn) 创建了 mock，它将把向下传递的方法视为 mock 实现。

如果使用 [`vi.spyOn`](/api/vi#vi-spyon) 创建了 mock，除非提供了自定义实现，否则将返回 `undefined` 。

## getMockName

- **类型:** `() => string`

用它来返回使用方法 `.mockName(name)` 给 mock 的名称。

## mockClear

- **类型:** `() => MockInstance`

清除每次调用的所有信息。调用该方法后，`.mock` 上的所有属性都将返回空状态。此方法不会重置实现。如果需要在不同断言之间清理 mock，该方法非常有用。

如果我们希望在每次测试前自动调用该方法，可以在配置中启用 [`clearMocks``](/config/#clearmocks)设置。

## mockName

- **类型:** `(name: string) => MockInstance`

设置内部 mock 名称。用于在断言失败时查看 mock 名称。

## mockImplementation

- **类型:** `(fn: Function) => MockInstance`

接受一个函数，该函数将用作 mock 的实现。

```ts
const mockFn = vi.fn().mockImplementation((apples: number) => apples + 1)
// or: vi.fn(apples => apples + 1);

const NelliesBucket = mockFn(0)
const BobsBucket = mockFn(1)

NelliesBucket === 1 // true
BobsBucket === 2 // true

mockFn.mock.calls[0][0] === 0 // true
mockFn.mock.calls[1][0] === 1 // true
```

## mockImplementationOnce

- **类型:** `(fn: Function) => MockInstance`

接受一个函数，该函数将在下一次调用时用作 mock 的实现。可以链式调用多个函数，从而产生不同的结果。

```ts
const myMockFn = vi
  .fn()
  .mockImplementationOnce(() => true)
  .mockImplementationOnce(() => false)

myMockFn() // true
myMockFn() // false
```

当模拟函数的实现耗尽时，它会调用 `vi.fn(() => defaultValue)` 或 `.mockImplementation(() => defaultValue)` 所设置的默认实现（如果它们被调用）：

```ts
const myMockFn = vi
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call')

// 'first call', 'second call', 'default', 'default'
console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
```

## withImplementation

- **类型:** `(fn: Function, callback: () => void) => MockInstance`
- **类型:** `(fn: Function, callback: () => Promise<unknown>) => Promise<MockInstance>`

在执行回调时，临时覆盖原始模拟实现。

```js
const myMockFn = vi.fn(() => 'original')

myMockFn.withImplementation(
  () => 'temp',
  () => {
    myMockFn() // 'temp'
  }
)

myMockFn() // 'original'
```

可与异步回调一起使用。该方法必须等待，之后才能使用原始实现。

```ts
test('async callback', () => {
  const myMockFn = vi.fn(() => 'original')

  // We await this call since the callback is async
  await myMockFn.withImplementation(
    () => 'temp',
    async () => {
      myMockFn() // 'temp'
    }
  )

  myMockFn() // 'original'
})
```

请注意，该方法优先于 [`mockImplementationOnce`](#mockimplementationonce)。

## mockRejectedValue

- **类型:** `(value: any) => MockInstance`

接受在调用 async 函数时将被拒绝的错误。

```ts
const asyncMock = vi.fn().mockRejectedValue(new Error('Async error'))

await asyncMock() // throws "Async error"
```

## mockRejectedValueOnce

- **类型:** `(value: any) => MockInstance`

接受一个将在下一次函数调用中被剔除的值。如果是链式调用，则每次连续调用都会剔除指定值。

```ts
const asyncMock = vi
  .fn()
  .mockResolvedValueOnce('first call')
  .mockRejectedValueOnce(new Error('Async error'))

await asyncMock() // first call
await asyncMock() // throws "Async error"
```

## mockReset

- **类型:** `() => MockInstance`

执行 `mockClear` 的功能，并使内部实现成为空函数（调用时返回 `undefined` ）。这也会重置所有 "once" 实现。当我们想将 mock 完全重置为默认状态时，这很有用。

如果我们希望在每次测试前自动调用该方法，可以启用配置中的 [`mockReset`](/config/#mockreset) 设置。

## mockRestore

- **类型:** `() => MockInstance`

执行与 `mockReset` 相同的功能，并将内部实现还原为原始函数。

请注意，从 `vi.fn()` 恢复 mock 会将实现设置为返回 `undefined` 的空函数。还原 `vi.fn(impl)` 会将实现还原为 `impl`。

如果希望在每次测试前自动调用此方法，可以启用配置中的 [`restoreMocks`](/config/#restoreMocks) 设置。

## mockResolvedValue

- **类型:** `(value: any) => MockInstance`

接受将在调用 async 函数时解析的值。

```ts
const asyncMock = vi.fn().mockResolvedValue(42)

await asyncMock() // 42
```

## mockResolvedValueOnce

- **类型:** `(value: any) => MockInstance`

接受一个将在下一次函数调用时解析的值。如果是链式调用，则每次连续调用都会解析指定的值。

```ts
const asyncMock = vi
  .fn()
  .mockResolvedValue('default')
  .mockResolvedValueOnce('first call')
  .mockResolvedValueOnce('second call')

await asyncMock() // first call
await asyncMock() // second call
await asyncMock() // default
await asyncMock() // default
```

## mockReturnThis

- **类型:** `() => MockInstance`

如果需要在不调用实际实现的情况下从方法中返回 `this` 上下文，请使用此参数。这是一个简写：

```ts
spy.mockImplementation(function () {
  return this
})
```

## mockReturnValue

- **类型:** `(value: any) => MockInstance`

接受一个值，该值将在调用 mock 函数时返回。

```ts
const mock = vi.fn()
mock.mockReturnValue(42)
mock() // 42
mock.mockReturnValue(43)
mock() // 43
```

## mockReturnValueOnce

- **类型:** `(value: any) => MockInstance`

接受将在下一次函数调用中返回的值。如果是链式调用，则每次连续调用都会返回指定值。

如果没有更多的 `mockReturnValueOnce` 值可使用，mock 将返回到预先定义的实现（如果有的话）。

```ts
const myMockFn = vi
  .fn()
  .mockReturnValue('default')
  .mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call')

// 'first call', 'second call', 'default', 'default'
console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
```

## mock.calls

这是一个数组，包含每次调用的所有参数。数组中的一项就是该调用的参数。

```js
const fn = vi.fn()

fn('arg1', 'arg2')
fn('arg3')

fn.mock.calls
=== [
  ['arg1', 'arg2'], // first call
  ['arg3'], // second call
]
```

## mock.lastCall

其中包含最后一次调用的参数。如果 mock 未被调用，将返回 `undefined`。

## mock.results

这是一个数组，包含函数 `returned` 的所有值。数组中的一项是一个具有 `type` 和 `value` 属性的对象。可用的类型有:

- `'return'` - 函数返回时没有抛出。
- `'throw'` - 函数抛出了一个值。


`value` 属性包含返回值或抛出的错误。如果函数返回一个 `Promise`，那么即使Promise rejected，`result` 也将始终为 `'return'`。

```js
const fn = vi
  .fn()
  .mockReturnValueOnce('result')
  .mockImplementationOnce(() => {
    throw new Error('thrown error')
  })

const result = fn() // returned 'result'

try {
  fn() // threw Error
}
catch {}

fn.mock.results
=== [
  // first result
  {
    type: 'return',
    value: 'result',
  },
  // last result
  {
    type: 'throw',
    value: Error,
  },
]
```

## mock.settledResults

包含函数中`resolved` 或 `rejected` 的所有值的数组。

如果函数从未`resolved` 或 `rejected` ，则此数组将为空。

```js
const fn = vi.fn().mockResolvedValueOnce('result')

const result = fn()

fn.mock.settledResults === []

await result

fn.mock.settledResults === [
  {
    type: 'fulfilled',
    value: 'result',
  },
]
```

## mock.invocationCallOrder

此属性返回 mock 函数的执行顺序。它是一个数字数组，由所有定义的 mock 共享。

```js
const fn1 = vi.fn()
const fn2 = vi.fn()

fn1()
fn2()
fn1()

fn1.mock.invocationCallOrder === [1, 3]
fn2.mock.invocationCallOrder === [2]
```

## mock.contexts

此属性是每次调用模拟函数时使用的 `this` 值的数组。

```js
const fn = vi.fn()
const context = {}

fn.apply(context)
fn.call(context)

fn.mock.contexts[0] === context
fn.mock.contexts[1] === context
```

## mock.instances

此属性是一个数组，其中包含使用 `new` 关键字调用模拟时创建的所有实例。请注意，这是函数的实际上下文（`this`），而不是返回值。

::: warning
如果使用 `new MyClass()` 对 mock 进行实例化，那么 `mock.instances` 将是一个只有一个值的数组：

```js
const MyClass = vi.fn()
const a = new MyClass()

MyClass.mock.instances[0] === a
```

如果从构造函数返回一个值，该值不会出现在 `instances` 数组中，而是会出现在 `results` 中：

```js
const Spy = vi.fn(() => ({ method: vi.fn() }))
const a = new Spy()

Spy.mock.instances[0] !== a
Spy.mock.results[0] === a
```

:::
