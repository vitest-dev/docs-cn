# Mocks

用 `vi.fn` 即可创建 mock 函数或类，并全程记录其调用情况；若想监控已存在对象上的某个属性，则改用 `vi.spyOn`。

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

要验证 mock 的行为，请通过 [`expect`](/api/expect) 调用类似 [`toHaveBeenCalled`](/api/expect#tohavebeencalled) 的断言方法；以下 API 参考汇总了所有可用来操控 mock 的属性和方法。

::: tip
以下类型中的自定义函数实现使用泛型 `<T>` 进行标记。
:::

## getMockImplementation

```ts
function getMockImplementation(): T | undefined
```

若存在 mock 实现，则返回其当前版本；否则返回空值。

如果 mock 对象是使用 [`vi.fn`](/api/vi#vi-fn) 创建的，它将使用提供的方法作为模拟实现。

如果 mock 对象是使用 [`vi.spyOn`](/api/vi#vi-spyon) 创建的，除非提供了自定义实现，否则它将返回 `undefined`。

## getMockName

```ts
function getMockName(): string
```

此方法返回由 `.mockName(name)` 为 mock 指定的名称。`vi.fn()` 创建的替身默认返回 `'vi.fn()'`； `vi.spyOn` 生成的 spy 则沿用被监视方法的原始名称。

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

// 清空历史，但是保留模拟对象的实现
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
// 或：vi.fn(apples => apples + 1);

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
  .mockImplementationOnce(() => true) // 1st 调用
  .mockImplementationOnce(() => false) // 2nd 调用

myMockFn() // 1st 调用：true
myMockFn() // 2nd 调用：false
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

  // 由于回调是异步的，我们要等待这个调用
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

传入一个错误对象后，一旦 async 函数被调用，就会立即以该错误作为拒绝原因抛出。

```ts
const asyncMock = vi.fn().mockRejectedValue(new Error('Async error'))

await asyncMock() // 抛出 Error<'Async error'>
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
await asyncMock() // 抛出 Error<'Async error'>
```

## mockReset

```ts
function mockReset(): Mock<T>
```

该方法会先执行与 [`mockClear`](#mockClear) 相同的清理，再重置 mock 的实现，并一并清除所有一次性（once）设定。

注意：

- 若 mock 由 `vi.fn()` 创建，重置后其函数体将变为空实现，默认返回 `undefined`。

- 若由 `vi.fn(impl)` 创建，重置后实现会恢复为传入的 `impl`。

当我们想将模拟 restore 为其原始状态时，这很有用。

```ts
const person = {
  greet: (name: string) => `Hello ${name}`,
}
const spy = vi.spyOn(person, 'greet').mockImplementation(() => 'mocked')
expect(person.greet('Alice')).toBe('mocked')
expect(spy.mock.calls).toEqual([['Alice']])

// 清空历史和重置实现，但是方法依然是被监视
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

该方法先完成 [`mockReset`](#mockreset) 的全部工作；若 mock 通过 [`vi.spyOn`](/api/vi#vi-spyon) 创建，还会进一步恢复被监视对象的原始属性描述符。

对于由 `vi.fn()` 创建的 mock，`mockRestore` 的行为与 [`mockReset`](#mockreset) 完全一致。

```ts
const person = {
  greet: (name: string) => `Hello ${name}`,
}
const spy = vi.spyOn(person, 'greet').mockImplementation(() => 'mocked')
expect(person.greet('Alice')).toBe('mocked')
expect(spy.mock.calls).toEqual([['Alice']])

// 清空调用历史和恢复被监视对象方法
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

:::warning 对象按引用存储。
请注意，Vitest 在 `mock` 状态的所有属性中始终按引用保存对象。一旦你的代码修改了这些属性，诸如 [`.toHaveBeenCalledWith`](/api/expect#tohavebeencalledwith) 之类的断言便可能无法通过：

```ts
const argument = {
  value: 0,
}
const fn = vi.fn()
fn(argument) // { value: 0 }

argument.value = 10

expect(fn).toHaveBeenCalledWith({ value: 0 }) // [!code --]

// 相等性检查是针对原始参数进行的，
// 但是，该参数的属性在调用和断言之间发生了更改。
expect(fn).toHaveBeenCalledWith({ value: 10 }) // [!code ++]
```

此时，可先自行克隆该参数：

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

该属性保存最近一次调用时传入的全部参数；若 mock 尚未被调用，则返回 `undefined`。

## mock.results

```ts
interface MockResultReturn<T> {
  type: 'return'
  /**
   * 函数返回的值。
   * 如果函数返回的是一个 Promise，那么这将是一个已解析的值。
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
   * 函数执行过程中抛出的错误。
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

- `'return'`：函数已正常返回，未抛异常。
- `'throw'`：函数执行过程中抛出了异常。
- `'incomplete'`：函数尚未结束，仍在运行。

`value` 属性包含返回值或抛出的错误。如果函数返回一个 `Promise`，那么即使Promise rejected，`result` 也将始终为 `'return'`。

```js
const fn = vi
  .fn()
  .mockReturnValueOnce('result')
  .mockImplementationOnce(() => {
    throw new Error('thrown error')
  })

const result = fn() // 返回 'result'

try {
  fn() // 抛出错误
}
catch {}

fn.mock.results
=== [
  // 首个结果
  {
    type: 'return',
    value: 'result',
  },
  // 最后结果
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

该数组按顺序记录了函数每次被调用后最终兑现或拒绝的值。

若函数返回的是非 Promise ，实际值会原封不动地保留，但状态仍被标记为 `fulfilled` 或 `rejected`。

在结果出来前，对应的 `settledResult` 类型始终为 `incomplete`。

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

该数组按顺序保存了每次用 `new` 调用 mock 时生成的实例。请注意，这里存储的是函数运行时的实际 `this` 上下文，而非函数的返回值。

::: warning
若用 `new MyClass()` 实例化该 mock ，则 `mock.instances` 将是一个仅包含单个元素的数组：

```js
const MyClass = vi.fn()
const a = new MyClass()

MyClass.mock.instances[0] === a
```

若构造函数显式返回值，该值不会存入 `instances`，而会出现在 `results` 中：

```js
const Spy = vi.fn(() => ({ method: vi.fn() }))
const a = new Spy()

Spy.mock.instances[0] !== a
Spy.mock.results[0] === a
```

:::
