# Mock Functions

<<<<<<< HEAD
你可以使用 `vi.fn` 方法创建一个间谍函数（mock）来跟踪其执行。如果要跟踪已创建对象上的方法，可以使用 `vi.spyOn` 方法：
=======
You can create a mock function to track its execution with `vi.fn` method. If you want to track a method on an already created object, you can use `vi.spyOn` method:
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

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

<<<<<<< HEAD
你应该在 [`expect`](/api/expect) 上使用间谍断言（例如，[`toHaveBeenCalled`](/api/expect#tohavebeencalled)）来断言间谍结果。此 API 参考描述了用于操纵间谍行为的可用属性和方法。
=======
You should use mock assertions (e.g., [`toHaveBeenCalled`](/api/expect#tohavebeencalled)) on [`expect`](/api/expect) to assert mock result. This API reference describes available properties and methods to manipulate mock behavior.

## getMockImplementation

- **Type:** `(...args: any) => any`

Returns current mock implementation if there is one.

If mock was created with [`vi.fn`](/api/vi#vi-fn), it will consider passed down method as a mock implementation.

If mock was created with [`vi.spyOn`](/api/vi#vi-spyon), it will return `undefined` unless a custom implementation was provided.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## getMockName

- **类型:** `() => string`

<<<<<<< HEAD
  使用它返回给 mock 的名称，方法为 `.mockName(name)`。
=======
Use it to return the name given to mock with method `.mockName(name)`.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockClear

- **类型:** `() => MockInstance`

<<<<<<< HEAD
  清除每次调用的所有信息。调用它后 [`spy.mock.calls`](#mock-calls)，[`spy.mock.results`](#mock-results)将返回空数组。如果你需要清理不同断言之间的间谍，这是有用的。

  如果希望在每次测试之前自动调用此方法，可以在 config 中启用 [`clearMocks`](/config/#clearMocks)设置。
=======
Clears all information about every call. After calling it, all properties on `.mock` will return empty state. This method does not reset implementations. It is useful if you need to clean up mock between different assertions.

If you want this method to be called before each test automatically, you can enable [`clearMocks`](/config/#clearmocks) setting in config.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockName

- **类型:** `(name: string) => MockInstance`

<<<<<<< HEAD
  设置内部模拟名称。有助于查看哪个 mock 未通过断言。
=======
Sets internal mock name. Useful to see the name of the mock if assertion fails.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockImplementation

- **类型:** `(fn: Function) => MockInstance`

<<<<<<< HEAD
  接受一个将用作模拟实现的函数。

  例如：

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
=======
Accepts a function that will be used as an implementation of the mock.

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
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockImplementationOnce

- **类型:** `(fn: Function) => MockInstance`

<<<<<<< HEAD
  接受一个函数，该函数将作为对被模拟函数的一次调用的模拟的实现。可以链式调用，以便多个函数产生不同的结果。

  ```ts
  const myMockFn = vi
    .fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => false)
  
  myMockFn() // true
  myMockFn() // false
  ```

  当模拟函数用完实现时，它将调用使用 `vi.fn(() => defaultValue)` 或者 `.mockImplementation(() => defaultValue)` 设置的默认实现（如果调用了它们）：

  ```ts
  const myMockFn = vi
    .fn(() => 'default')
    .mockImplementationOnce(() => 'first call')
    .mockImplementationOnce(() => 'second call')
  
  // 'first call', 'second call', 'default', 'default'
  console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
  ```
=======
Accepts a function that will be used as mock's implementation during the next call. Can be chained so that multiple function calls produce different results.

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
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## withImplementation

- **类型:** `(fn: Function, callback: () => void) => MockInstance`
- **类型:** `(fn: Function, callback: () => Promise<unknown>) => Promise<MockInstance>`

<<<<<<< HEAD
  在执行回调时临时重写原始模拟实现。
=======
Overrides the original mock implementation temporarily while the callback is being executed.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

```js
const myMockFn = vi.fn(() => 'original')

myMockFn.withImplementation(() => 'temp', () => {
  myMockFn() // 'temp'
})

myMockFn() // 'original'
```

Can be used with an asynchronous callback. The method has to be awaited to use the original implementation afterward.

```ts
test('async callback', () => {
  const myMockFn = vi.fn(() => 'original')
<<<<<<< HEAD
  
  myMockFn.withImplementation(
    () => 'temp',
    () => {
      myMockFn() // 'temp'
    }
  )
  
=======

  // We await this call since the callback is async
  await myMockFn.withImplementation(
    () => 'temp',
    async () => {
      myMockFn() // 'temp'
    },
  )

>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e
  myMockFn() // 'original'
})
```

<<<<<<< HEAD
  可以与异步回调一起使用。必须等待该方法之后才能使用原始实现。

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

  此外，它优先于 [`mockImplementationOnce`](https://cn.vitest.dev/api/mock.html#mockimplementationonce)。
=======
Note that this method takes precedence over the [`mockImplementationOnce`](https://vitest.dev/api/mock.html#mockimplementationonce).
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockRejectedValue

- **类型:** `(value: any) => MockInstance`

<<<<<<< HEAD
  当调用异步函数时，接受一个将被拒绝的错误。

  ```ts
  const asyncMock = vi.fn().mockRejectedValue(new Error('Async error'))
  
  await asyncMock() // throws "Async error"
  ```
=======
Accepts an error that will be rejected when async function is called.

```ts
const asyncMock = vi.fn().mockRejectedValue(new Error('Async error'))

await asyncMock() // throws "Async error"
```
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockRejectedValueOnce

- **类型:** `(value: any) => MockInstance`

<<<<<<< HEAD
  接受对模拟函数的一次调用将被拒绝的值。如果链接调用，则每次连续调用都将拒绝传递的值。

  ```ts
  const asyncMock = vi
    .fn()
    .mockResolvedValueOnce('first call')
    .mockRejectedValueOnce(new Error('Async error'))
  
  await asyncMock() // first call
  await asyncMock() // throws "Async error"
  ```
=======
Accepts a value that will be rejected during the next function call. If chained, every consecutive call will reject specified value.

```ts
const asyncMock = vi
  .fn()
  .mockResolvedValueOnce('first call')
  .mockRejectedValueOnce(new Error('Async error'))

await asyncMock() // first call
await asyncMock() // throws "Async error"
```
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockReset

- **类型:** `() => MockInstance`

<<<<<<< HEAD
  执行 `mockClear` 的操作，并使内部实现成为空函数（调用时返回 `undefined`）。当你想要将模拟完全重置回其初始状态时，这非常有用。

  如果你希望在每次测试之前自动调用此方法，可以在配置中启用 [`mockReset`](/config/#mockReset) 设置。
=======
Does what `mockClear` does and makes inner implementation an empty function (returning `undefined` when invoked). This also resets all "once" implementations. This is useful when you want to completely reset a mock to the default state.

If you want this method to be called before each test automatically, you can enable [`mockReset`](/config/#mockreset) setting in config.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockRestore

- **类型:** `() => MockInstance`

<<<<<<< HEAD
  执行 `mockReset` 的操作，并将内部实现还原为原始函数。

  请注意，从 `vi.fn()` 恢复 mock 会将实现设置为返回 `undefined` 的空函数。还原 `vi.fn(impl)` 将使实现还原为 `impl`。

  如果你希望在每次测试之前自动调用此方法，可以在配置中启用 [`restoreMocks`](/config/#restoreMocks) 设置。
=======
Does what `mockReset` does and restores inner implementation to the original function.

Note that restoring mock from `vi.fn()` will set implementation to an empty function that returns `undefined`. Restoring a `vi.fn(impl)` will restore implementation to `impl`.

If you want this method to be called before each test automatically, you can enable [`restoreMocks`](/config/#restoreMocks) setting in config.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockResolvedValue

- **类型:** `(value: any) => MockInstance`

<<<<<<< HEAD
  接受一个将在调用异步函数时解析的值。

  ```ts
  const asyncMock = vi.fn().mockResolvedValue(43)
  
  await asyncMock() // 43
  ```
=======
Accepts a value that will be resolved when async function is called.

```ts
const asyncMock = vi.fn().mockResolvedValue(42)

await asyncMock() // 42
```
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockResolvedValueOnce

- **类型:** `(value: any) => MockInstance`

<<<<<<< HEAD
  接受对模拟函数的一次调用将解析的值。如果链式调用，则每个连续调用都将解析传递的值。

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
=======
Accepts a value that will be resolved during the next function call. If chained, every consecutive call will resolve specified value.

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
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockReturnThis

- **类型:** `() => MockInstance`

<<<<<<< HEAD
  设置内部实现以返回 `this` 上下文。
=======
Use this if you need to return `this` context from the method without invoking actual implementation. This is a shorthand for:

```ts
spy.mockImplementation(function () {
  return this
})
```
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mockReturnValue

- **类型:** `(value: any) => MockInstance`

<<<<<<< HEAD
  接受一个当调用模拟函数时将返回的值。
=======
Accepts a value that will be returned whenever the mock function is called.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

```ts
const mock = vi.fn()
mock.mockReturnValue(42)
mock() // 42
mock.mockReturnValue(43)
mock() // 43
```

## mockReturnValueOnce

- **类型:** `(value: any) => MockInstance`

<<<<<<< HEAD
  接受对模拟函数的一次调用将返回的值。如果链式调用，则每个连续调用都将返回传递的值。如果没有更多的 `mockReturnValueOnce` 值可供使用，请调用由 `mockImplementation` 或其他 `mockReturn*` 方法指定的函数。

  ```ts
  const myMockFn = vi
    .fn()
    .mockReturnValue('default')
    .mockReturnValueOnce('first call')
    .mockReturnValueOnce('second call')
  
  // 'first call', 'second call', 'default', 'default'
  console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
  ```
=======
Accepts a value that will be returned during the next function call. If chained, every consecutive call will return the specified value.

When there are no more `mockReturnValueOnce` values to use, mock will fallback to preivously defined implementation if there is one.

```ts
const myMockFn = vi
  .fn()
  .mockReturnValue('default')
  .mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call')

// 'first call', 'second call', 'default', 'default'
console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
```
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## mock.calls

这是一个包含每个调用的所有参数的数组。数组的元素是该调用的参数。

```js
const fn = vi.fn()

fn('arg1', 'arg2')
fn('arg3')

<<<<<<< HEAD
fn.mock.calls
  === [
    ['arg1', 'arg2'], // first call
    ['arg3', 'arg4'], // second call
  ]
=======
fn.mock.calls === [
  ['arg1', 'arg2'], // first call
  ['arg3'], // second call
]
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e
```

## mock.lastCall

<<<<<<< HEAD
这包含上次调用的参数。如果未调用 spy，将返回 `undefined`。

## mock.results

这是一个包含函数 `returned` 的所有值的数组。数组的元素是具有属性 `type` 和 `value` 的对象。可用类型包括：
=======
This contains the arguments of the last call. If mock wasn't called, will return `undefined`.

## mock.results

This is an array containing all values that were `returned` from the function. One item of the array is an object with properties `type` and `value`. Available types are:
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

- `'return'` - 未发生异常的函数。
- `'throw'` - 抛出一个值的函数。

<<<<<<< HEAD
`value` 属性包含返回的值或引发的错误。如果函数返回了一个 promise ，当它解析时，`value` 属性将变成 promise 解析到的值。
=======
The `value` property contains the returned value or thrown error. If the function returned a promise, the `value` will be the _resolved_ value, not the actual `Promise`, unless it was never resolved.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

```js
const fn = vi.fn()
  .mockReturnValueOnce('result')
  .mockImplementationOnce(() => { throw new Error('thrown error') })

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

## mock.invocationCallOrder

The order of mock's execution. This returns an array of numbers that are shared between all defined mocks.

```js
const fn1 = vi.fn()
const fn2 = vi.fn()

fn1()
fn2()
fn1()

fn1.mock.invocationCallOrder === [1, 3]
fn2.mock.invocationCallOrder === [2]
```

## mock.instances

<<<<<<< HEAD
这是一个数组，包含使用 `new` 关键字调用模拟时实例化的所有实例。注意，这是函数的实际上下文（`this`），而不是返回值。
=======
This is an array containing all instances that were instantiated when mock was called with a `new` keyword. Note that this is an actual context (`this`) of the function, not a return value.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

::: warning
如果 mock 是用 `new MyClass()` 实例化的，那么 `mock.instances` 将是一个具有一个值的数组：

```js
const MyClass = vi.fn()
const a = new MyClass()

MyClass.mock.instances[0] === a
```

如果从构造函数返回值，它将不在 `instances` 数组中，而是在 `results` 中：

```js
const Spy = vi.fn(() => ({ method: vi.fn() }))
const a = new Spy()

Spy.mock.instances[0] !== a
Spy.mock.results[0] === a
```
