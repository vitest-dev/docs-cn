# Mocks

<<<<<<< HEAD
我们可以使用 `vi.fn` 方法创建一个 mock 函数来跟踪其执行情况。如果要跟踪已创建对象上的方法，可以使用 `vi.spyOn` 方法：
=======
You can create a mock function or a class to track its execution with the `vi.fn` method. If you want to track a property on an already created object, you can use the `vi.spyOn` method:
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

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
我们应该在 [`expect`](/api/expect) 上使用 mock 断言（例如 [`toHaveBeenCalled`](/api/expect#tohavebeencalled) ）来断言 mock 结果。在这里我们介绍了用于操作 mock 行为的可用属性和方法。
=======
You should use mock assertions (e.g., [`toHaveBeenCalled`](/api/expect#tohavebeencalled)) on [`expect`](/api/expect) to assert mock results. This API reference describes available properties and methods to manipulate mock behavior.
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

::: tip
The custom function implementation in the types below is marked with a generic `<T>`.
:::

## getMockImplementation

```ts
function getMockImplementation(): T | undefined
```

<<<<<<< HEAD
返回当前的模拟实现（如果有）。
=======
Returns the current mock implementation if there is one.
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

如果 mock 对象是使用 [`vi.fn`](/api/vi#vi-fn) 创建的，它将使用提供的方法作为模拟实现。

如果 mock 对象是使用 [`vi.spyOn`](/api/vi#vi-spyon) 创建的，除非提供了自定义实现，否则它将返回 `undefined`。

## getMockName

```ts
function getMockName(): string
```

<<<<<<< HEAD
使用它来返回使用 `.mockName(name)` 方法分配给 mock 对象的名称。默认情况下，它将返回 `vi.fn()`。
=======
Use it to return the name assigned to the mock with the `.mockName(name)` method. By default, `vi.fn()` mocks will return `'vi.fn()'`, while spies created with `vi.spyOn` will keep the original name.
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

## mockClear

```ts
function mockClear(): Mock<T>
```

清除所有关于每次调用的信息。调用此方法后，`.mock` 上的所有属性将恢复到初始状态。这个方法不会重置实现。它适用于在不同断言之间清理 mock 对象。

```ts
const person = {
  greet: (name: string) => `Hello ${name}`,
}
const spy = vi.spyOn(person, 'greet').mockImplementation(() => 'mocked')
expect(person.greet('Alice')).toBe('mocked')
expect(spy.mock.calls).toEqual([['Alice']])

// clear call history but keep mock implementation
spy.mockClear()
expect(spy.mock.calls).toEqual([])
expect(person.greet('Bob')).toBe('mocked')
expect(spy.mock.calls).toEqual([['Bob']])
```

要在每个测试之前自动调用此方法，请在配置中启用 [`clearMocks`](/config/#clearmocks) 设置。

## mockName

```ts
function mockName(name: string): Mock<T>
```

设置内部 mock 名称。这在断言失败时识别 mock 对象非常有用。

## mockImplementation

```ts
function mockImplementation(fn: T): Mock<T>
```

接受一个函数，用作 mock 实现。TypeScript 要求参数和返回类型与原始函数相匹配。

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

```ts
function mockImplementationOnce(fn: T): Mock<T>
```

接受一个函数作为 mock 实现。TypeScript 要求该函数的参数和返回类型与原函数相匹配。这个方法可以被链式调用，以便对多次函数调用产生不同的结果。

```ts
const myMockFn = vi
  .fn()
  .mockImplementationOnce(() => true) // 1st call
  .mockImplementationOnce(() => false) // 2nd call

myMockFn() // 1st call: true
myMockFn() // 2nd call: false
```

当 mock 函数用完所有实现后，如果之前调用过 `vi.fn(() => defaultValue)` 或 `.mockImplementation(() => defaultValue)`，它将调用设置的默认实现：

```ts
const myMockFn = vi
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call')

// 'first call', 'second call', 'default', 'default'
console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn())
```

## withImplementation

```ts
function withImplementation(
  fn: T,
  cb: () => void
): Mock<T>
function withImplementation(
  fn: T,
  cb: () => Promise<void>
): Promise<Mock<T>>
```

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

```ts
function mockRejectedValue(value: unknown): Mock<T>
```

<<<<<<< HEAD
接受在调用 async 函数时将被拒绝的错误。
=======
Accepts an error that will be rejected when an async function is called.
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

```ts
const asyncMock = vi.fn().mockRejectedValue(new Error('Async error'))

await asyncMock() // throws Error<'Async error'>
```

## mockRejectedValueOnce

```ts
function mockRejectedValueOnce(value: unknown): Mock<T>
```

接受一个值，该值将在下一次函数调用时被拒绝。如果进行链式调用，每个连续的调用都将拒绝指定的值。

```ts
const asyncMock = vi
  .fn()
  .mockResolvedValueOnce('first call')
  .mockRejectedValueOnce(new Error('Async error'))

await asyncMock() // 'first call'
await asyncMock() // throws Error<'Async error'>
```

## mockReset

```ts
function mockReset(): Mock<T>
```

<<<<<<< HEAD
执行 [`mockClear`](#mockClear) 所做的事情，并将内部实现重置为原始函数。
这还会重置所有 "once" 实现。

请注意，从 `vi.fn()` 重置 mock 会将实现设置为返回 `undefined` 的空函数。
从 `vi.fn(impl)` 重置 mock 会将实现 restore 为 `impl`。
=======
Does what [`mockClear`](#mockClear) does and resets the mock implementation. This also resets all "once" implementations.

Note that resetting a mock from `vi.fn()` will set the implementation to an empty function that returns `undefined`.
Resetting a mock from `vi.fn(impl)` will reset the implementation to `impl`.
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

当我们想将模拟 restore 为其原始状态时，这很有用。

```ts
const person = {
  greet: (name: string) => `Hello ${name}`,
}
const spy = vi.spyOn(person, 'greet').mockImplementation(() => 'mocked')
expect(person.greet('Alice')).toBe('mocked')
expect(spy.mock.calls).toEqual([['Alice']])

// clear call history and reset implementation, but method is still spied
spy.mockReset()
expect(spy.mock.calls).toEqual([])
expect(person.greet).toBe(spy)
expect(person.greet('Bob')).toBe('Hello Bob')
expect(spy.mock.calls).toEqual([['Bob']])
```

要在每个测试之前自动调用此方法，可以在配置中启用 [`mockReset`](/config/#mockreset) 设置。

## mockRestore

```ts
function mockRestore(): Mock<T>
```

<<<<<<< HEAD
执行与 [`mockReset`](#mockReset) 相同的操作，并将内部实现恢复为原始对象。

需要注意一下，从 `vi.fn()` 恢复的模拟将把实现设置为返回 `undefined` 的空函数。
从 `vi.fn(impl)` 恢复的模拟将把实现恢复为 `impl` 。
=======
Does what [`mockReset`](#mockreset) does and restores the original descriptors of spied-on objects, if the mock was created with [`vi.spyOn`](/api/vi#vi-spyon).

`mockRestore` on a `vi.fn()` mock is identical to [`mockReset`](#mockreset).
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

```ts
const person = {
  greet: (name: string) => `Hello ${name}`,
}
const spy = vi.spyOn(person, 'greet').mockImplementation(() => 'mocked')
expect(person.greet('Alice')).toBe('mocked')
expect(spy.mock.calls).toEqual([['Alice']])

// clear call history and restore spied object method
spy.mockRestore()
expect(spy.mock.calls).toEqual([])
expect(person.greet).not.toBe(spy)
expect(person.greet('Bob')).toBe('Hello Bob')
expect(spy.mock.calls).toEqual([])
```

要在每个测试之前自动调用此方法，请在配置中启用 [`restoreMocks`](/config/#restoremocks) 设置。

## mockResolvedValue

```ts
function mockResolvedValue(value: Awaited<ReturnType<T>>): Mock<T>
```

接受一个值，该值将在调用异步函数时被解析。TypeScript 只接受与原始函数返回类型相匹配的值。

```ts
const asyncMock = vi.fn().mockResolvedValue(42)

await asyncMock() // 42
```

## mockResolvedValueOnce

```ts
function mockResolvedValueOnce(value: Awaited<ReturnType<T>>): Mock<T>
```

接受一个值，该值将在下一次函数调用时被解析。TypeScript 仅接受与原始函数返回类型相匹配的值。如果进行链式调用，每个连续的调用都将解析指定的值。

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

```ts
function mockReturnThis(): Mock<T>
```

如果我们需要返回方法中的 `this` 上下文而不调用实际实现，请使用此方法。这是以下写法的简写形式：

```ts
spy.mockImplementation(function () {
  return this
})
```

## mockReturnValue

```ts
function mockReturnValue(value: ReturnType<T>): Mock<T>
```

接受一个值，该值将在模拟函数每次被调用时返回。TypeScript 仅接受与原始函数返回类型一致的值。

```ts
const mock = vi.fn()
mock.mockReturnValue(42)
mock() // 42
mock.mockReturnValue(43)
mock() // 43
```

## mockReturnValueOnce

```ts
function mockReturnValueOnce(value: ReturnType<T>): Mock<T>
```

接受一个值，该值将在每次 mock 函数被调用时返回。TypeScript 仅接受与原始函数返回类型相匹配的值。

当 mock 函数用尽所有实现后，如果之前调用过 `vi.fn(() => defaultValue)` 或 `.mockImplementation(() => defaultValue)`，它将调用设置的默认实现：

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

```ts
const calls: Parameters<T>[]
```

这是一个数组，包含了每次调用的所有参数。数组中的每个项目都是那次调用的参数。

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

:::warning Objects are Stored by Reference
Note that Vitest always stores objects by reference in all properies of the `mock` state. This means that if the properties were changed by your code, then some assertions like [`.toHaveBeenCalledWith`](/api/expect#tohavebeencalledwith) will not pass:

```ts
const argument = {
  value: 0,
}
const fn = vi.fn()
fn(argument) // { value: 0 }

argument.value = 10

expect(fn).toHaveBeenCalledWith({ value: 0 }) // [!code --]

// The equality check is done against the original argument,
// but its property was changed between the call and assertion
expect(fn).toHaveBeenCalledWith({ value: 10 }) // [!code ++]
```

In this case you can clone the argument yourself:

```ts{6}
const calledArguments = []
const fn = vi.fn((arg) => {
  calledArguments.push(structuredClone(arg))
})

expect(calledArguments[0]).toEqual({ value: 0 })
```
:::

## mock.lastCall

```ts
const lastCall: Parameters<T> | undefined
```

<<<<<<< HEAD
这包含了最后一次调用的参数。如果 mock 没有被调用，它将返回 `undefined`。
=======
This contains the arguments of the last call. If the mock wasn't called, it will return `undefined`.
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

## mock.results

```ts
interface MockResultReturn<T> {
  type: 'return'
  /**
   * The value that was returned from the function.
   * If the function returned a Promise, then this will be a resolved value.
   */
  value: T
}

interface MockResultIncomplete {
  type: 'incomplete'
  value: undefined
}

interface MockResultThrow {
  type: 'throw'
  /**
   * An error that was thrown during function execution.
   */
  value: any
}

type MockResult<T>
  = | MockResultReturn<T>
    | MockResultThrow
    | MockResultIncomplete

const results: MockResult<ReturnType<T>>[]
```

这是一个数组，包含了从函数中返回的所有值。数组中的每个项目是一个包含属性 `type` 和 `value` 的对象。可用的类型包括：

<<<<<<< HEAD
- `'return'` - 函数返回时没有抛出。
- `'throw'` - 函数抛出了一个值。
=======
- `'return'` - function returned without throwing.
- `'throw'` - function threw a value.
- `'incomplete'` - the function did not finish running yet.
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

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

```ts
interface MockSettledResultIncomplete {
  type: 'incomplete'
  value: undefined
}

interface MockSettledResultFulfilled<T> {
  type: 'fulfilled'
  value: T
}

interface MockSettledResultRejected {
  type: 'rejected'
  value: any
}

export type MockSettledResult<T>
  = | MockSettledResultFulfilled<T>
    | MockSettledResultRejected
    | MockSettledResultIncomplete

const settledResults: MockSettledResult<Awaited<ReturnType<T>>>[]
```

<<<<<<< HEAD
包含函数中`resolved` 或 `rejected` 的所有值的数组。

如果函数从未`resolved` 或 `rejected` ，则此数组将为空。
=======
An array containing all values that were resolved or rejected by the function.

If the function returned non-promise values, the `value` will be kept as is, but the `type` will still says `fulfilled` or `rejected`.

Until the value is resolved or rejected, the `settledResult` type will be `incomplete`.
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

```js
const fn = vi.fn().mockResolvedValueOnce('result')

const result = fn()

fn.mock.settledResults === [
  {
    type: 'incomplete',
    value: undefined,
  },
]

await result

fn.mock.settledResults === [
  {
    type: 'fulfilled',
    value: 'result',
  },
]
```

## mock.invocationCallOrder

```ts
const invocationCallOrder: number[]
```

这个属性返回 mock 函数执行的顺序。它是一个数字数组，这些数字在所有定义的 mock 之间共享。

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

```ts
const contexts: ThisParameterType<T>[]
```

这个属性是一个数组，包含了在每次调用模拟函数时使用的 `this` 值。

```js
const fn = vi.fn()
const context = {}

fn.apply(context)
fn.call(context)

fn.mock.contexts[0] === context
fn.mock.contexts[1] === context
```

## mock.instances

```ts
const instances: ReturnType<T>[]
```

<<<<<<< HEAD
这个属性是一个数组，包含了使用 `new` 关键字调用模拟时创建的所有实例。请注意，这是函数的实际上下文（`this`），而不是返回值。

::: warning
如果使用 `new MyClass()` 对 mock 进行实例化，那么 `mock.instances` 将是一个只有一个值的数组：
=======
This property is an array containing all instances that were created when the mock was called with the `new` keyword. Note that this is the actual context (`this`) of the function, not a return value.

::: warning
If the mock was instantiated with `new MyClass()`, then `mock.instances` will be an array with one value:
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

```js
const MyClass = vi.fn()
const a = new MyClass()

MyClass.mock.instances[0] === a
```

<<<<<<< HEAD
如果从构造函数返回一个值，该值不会出现在 `instances` 数组中，而是会出现在 `results` 中：
=======
If you return a value from the constructor, it will not be in the `instances` array, but instead inside `results`:
>>>>>>> 003513b09d4163673b6d316c4a530d2d949de36e

```js
const Spy = vi.fn(() => ({ method: vi.fn() }))
const a = new Spy()

Spy.mock.instances[0] !== a
Spy.mock.results[0] === a
```

:::
