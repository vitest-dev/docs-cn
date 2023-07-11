# Mock Functions

你可以使用 `vi.fn` 方法创建一个间谍函数（mock）来跟踪其执行。如果要跟踪已创建对象上的方法，可以使用 `vi.spyOn` 方法：

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

你应该在 [`expect`](/api/expect) 上使用间谍断言（例如，[`toHaveBeenCalled`](/api/expect#tohavebeencalled)）来断言间谍结果。此 API 参考描述了用于操纵间谍行为的可用属性和方法。

## getMockName

- **类型:** `() => string`

  使用它返回给 mock 的名称，方法为 `.mockName(name)`。

## mockClear

- **类型:** `() => MockInstance`

  清除每次调用的所有信息。调用它后 [`spy.mock.calls`](#mock-calls)，[`spy.mock.results`](#mock-results)将返回空数组。如果你需要清理不同断言之间的间谍，这是有用的。

  如果希望在每次测试之前自动调用此方法，可以在 config 中启用 [`clearMocks`](/config/#clearMocks)设置。

## mockName

- **类型:** `(name: string) => MockInstance`

  设置内部模拟名称。有助于查看哪个 mock 未通过断言。

## mockImplementation

- **类型:** `(fn: Function) => MockInstance`

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

## mockImplementationOnce

- **类型:** `(fn: Function) => MockInstance`

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

## withImplementation

- **类型:** `(fn: Function, callback: () => void) => MockInstance`
- **类型:** `(fn: Function, callback: () => Promise<unknown>) => Promise<MockInstance>`

  在执行回调时临时重写原始模拟实现。

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

## mockRejectedValue

- **类型:** `(value: any) => MockInstance`

  当调用异步函数时，接受一个将被拒绝的错误。

  ```ts
  const asyncMock = vi.fn().mockRejectedValue(new Error('Async error'))
  
  await asyncMock() // throws "Async error"
  ```

## mockRejectedValueOnce

- **类型:** `(value: any) => MockInstance`

  接受对模拟函数的一次调用将被拒绝的值。如果链接调用，则每次连续调用都将拒绝传递的值。

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

  执行 `mockClear` 的操作，并使内部实现成为空函数（调用时返回 `undefined`）。当你想要将模拟完全重置回其初始状态时，这非常有用。

  如果你希望在每次测试之前自动调用此方法，可以在配置中启用 [`mockReset`](/config/#mockReset) 设置。

## mockRestore

- **类型:** `() => MockInstance`

  执行 `mockReset` 的操作，并将内部实现还原为原始函数。

  请注意，从 `vi.fn()` 恢复 mock 会将实现设置为返回 `undefined` 的空函数。还原 `vi.fn(impl)` 将使实现还原为 `impl`。

  如果你希望在每次测试之前自动调用此方法，可以在配置中启用 [`restoreMocks`](/config/#restoreMocks) 设置。

## mockResolvedValue

- **类型:** `(value: any) => MockInstance`

  接受一个将在调用异步函数时解析的值。

  ```ts
  const asyncMock = vi.fn().mockResolvedValue(43)
  
  await asyncMock() // 43
  ```

## mockResolvedValueOnce

- **类型:** `(value: any) => MockInstance`

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

## mockReturnThis

- **类型:** `() => MockInstance`

  设置内部实现以返回 `this` 上下文。

## mockReturnValue

- **类型:** `(value: any) => MockInstance`

  接受一个当调用模拟函数时将返回的值。

  ```ts
  const mock = vi.fn()
  mock.mockReturnValue(42)
  mock() // 42
  mock.mockReturnValue(43)
  mock() // 43
  ```

## mockReturnValueOnce

- **类型:** `(value: any) => MockInstance`

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

## mock.calls

这是一个包含每个调用的所有参数的数组。数组的元素是该调用的参数。

```js
const fn = vi.fn()

fn('arg1', 'arg2')
fn('arg3', 'arg4')

fn.mock.calls
  === [
    ['arg1', 'arg2'], // first call
    ['arg3', 'arg4'], // second call
  ]
```

## mock.lastCall

这包含上次调用的参数。如果未调用 spy，将返回 `undefined`。

## mock.results

这是一个包含函数 `returned` 的所有值的数组。数组的元素是具有属性 `type` 和 `value` 的对象。可用类型包括：

- `'return'` - 未发生异常的函数。
- `'throw'` - 抛出一个值的函数。

<<<<<<< HEAD
`value` 属性包含返回的值或引发的错误。
=======
The `value` property contains the returned value or thrown error. If the function returned a promise, when it resolves the `value` property will become the value the promise resolved to.
>>>>>>> c6b841dda3e63ec525cc929dd70af783b38f6321

```js
const fn = vi.fn()

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

## mock.instances

这是一个数组，包含使用 `new` 关键字调用模拟时实例化的所有实例。注意，这是函数的实际上下文（`this`），而不是返回值。

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
<<<<<<< HEAD

=======
>>>>>>> c6b841dda3e63ec525cc929dd70af783b38f6321
:::
