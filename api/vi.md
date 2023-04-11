# Vi

Vitest 提供实用函数来帮助你使用其 `vi` 助手。你可以全局访问它（当 [globals configuration](/config/#globals) 是 **启用** 时），或者从 `vitest` 导入：

```js
import { vi } from 'vitest'
```

## vi.advanceTimersByTime

- **类型:** `(ms: number) => Vitest`

  就像 `runAllTimers` 一样工作，但会在经过几毫秒后结束。例如，这将记录 `1, 2, 3` 并且不会抛出：

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)
  
  vi.advanceTimersByTime(150)
  ```

### vi.advanceTimersByTimeAsync

- **类型:** `(ms: number) => Promise<Vitest>`

  就像 `runAllTimersAsync` 一样工作，但会在经过几毫秒后结束。这将包括异步设置的计时器。例如，这将记录 `1, 2, 3` 并且不会抛出：

  ```ts
  let i = 0
  setInterval(() => Promise.resolve().then(() => console.log(++i)), 50)
  
  await vi.advanceTimersByTimeAsync(150)
  ```

## vi.advanceTimersToNextTimer

- **类型:** `() => Vitest`

  将调用下一个可用的计时器。在每次定时器调用之间进行断言很有用。你可以链式调用它来自己管理定时器。

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)
  
  vi.advanceTimersToNextTimer() // log 1
    .advanceTimersToNextTimer() // log 2
    .advanceTimersToNextTimer() // log 3
  ```

### vi.advanceTimersToNextTimerAsync

- **类型:** `() => Promise<Vitest>`

  将调用下一个可用计时器，即使它是异步设置的。在每次定时器调用之间进行断言很有用。你可以链式调用它来自己管理定时器。

  ```ts
  let i = 0
  setInterval(() => Promise.resolve().then(() => console.log(++i)), 50)
  
  vi.advanceTimersToNextTimerAsync() // log 1
    .advanceTimersToNextTimerAsync() // log 2
    .advanceTimersToNextTimerAsync() // log 3
  ```

## vi.getTimerCount

- **类型:** `() => number`

  获取等待计时器的数量。

## vi.clearAllMocks

将对所有模拟调用 [`.mockClear()`](/api/mock.html#mockclear)。这将清除模拟历史记录，但不会将其实现重置为默认值。

## vi.clearAllTimers

删除计划运行的所有计时器。这些计时器将来永远不会运行。

## vi.dynamicImportSettled

等待所有导入加载。很有用，如果你有一个开始导入模块的同步调用，否则你只能等待。

## vi.fn

- **类型:** `(fn?: Function) => CallableMockInstance`

  创建一个函数的模拟，尽管可以在没有一个的情况下启动。每次调用一个函数时，它都会存储它的调用参数、返回值和实例。此外，你可以使用 [methods](#mockinstance-methods) 操纵其行为。
  如果没有给出函数，mock 将在调用时返回 `undefined`。

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

## vi.getMockedSystemTime

- **类型**: `() => Date | null`

  返回使用 `setSystemTime` 设置的模拟当前日期。如果日期未被模拟，将返回 `null`。

## vi.getRealSystemTime

- **类型**: `() => number`

  使用 `vi.useFakeTimers` 时，`Date.now` 调用被模拟。如果需要获取毫秒级的实时时间，可以调用该函数。

## vi.mock

- **类型**: `(path: string, factory?: () => unknown) => void`

  用另一个模块替换提供的 `path` 中的所有导入模块。你可以在路径中使用配置的 Vite 别名。对 `vi.mock` 的调用被挂起，所以你在哪里调用它并不重要。它将始终在所有导入之前执行。

  ::: warning
  `vi.mock` 仅适用于使用 `import` 关键字导入的模块。它不适用于 `require`。

  Vitest 静态分析你的文件以提升 `vi.mock`。 这意味着你不能使用不是直接从 `vitest` 包（例如，从某些实用程序文件）导入的 `vi`。要解决此问题，请始终将 `vi.mock` 与从 `vitest` 导入的 `vi` 一起使用，或者启用 [`globals`](/config/#globals) 配置选项。
  :::

  ::: warning
  [浏览器模式](/guide/browser) 当前不支持模拟模块。你可以在 GitHub <a href="https://github.com/vitest-dev/vitest/issues/3046">问题</a>中跟踪此功能。
  :::

  如果定义了 `factory`，则所有导入都将返回其结果。Vitest 只调用一次工厂并缓存所有后续导入的结果，直到调用 [`vi.unmock`](#vi-unmock) 或 [`vi.doUnmock`](#vi-dounmock) 为止。

  与 `jest` 不同，工厂可以是异步的，因此你可以在内部使用 [`vi.importActual`](#vi-importactual) 或作为第一个参数接收的助手来获取原始模块。

  ```ts
  vi.mock('./path/to/module.js', async (importOriginal) => {
    const mod = await importOriginal()
    return {
      ...mod,
      // replace some exports
      namedExport: vi.fn(),
    }
  })
  ```

  ::: warning
  `vi.mock` 被提升（换句话说，_moved_）到**文件顶部**。 这意味着无论何时你编写它（无论是在 `beforeEach` 还是 `test` 中），它实际上都会在此之前被调用。

  这也意味着你不能在工厂内部使用在工厂外部定义的任何变量。

  如果你需要在工厂内部使用变量，请尝试 [`vi.doMock`](#vi-domock)。它的工作方式相同，但没有被吊起。请注意，它只会模拟后续导入。
  :::

  ::: warning
  如果你正在模拟具有默认导出的模块，则需要在返回的工厂函数对象中提供一个 `default` 键。这是一个特定于 ES 模块的警告，因此 `jest` 文档可能会有所不同，因为 `jest` 使用 CommonJS 模块。 例如，

  ```ts
  vi.mock('./path/to/module.js', () => {
    return {
      default: { myDefaultKey: vi.fn() },
      namedExport: vi.fn(),
      // etc...
    }
  })
  ```

  :::

  如果你正在模拟的文件旁边有一个 `__mocks__` 文件夹，并且没有提供工厂，Vitest 将尝试在 `__mocks__` 子文件夹中找到一个具有相同名称的文件，并将其用作实际模块。如果你正在模拟一个依赖项，Vitest 将尝试在项目的 [root](/config/#root) 中找到一个 `__mocks__` 文件夹（默认是 `process.cwd()`）。

  例如，你可以看到以下文件结构：

  ```
  - __mocks__
    - axios.js
  - src
    __mocks__
      - increment.js
    - increment.js
  - tests
    - increment.test.js
  ```

  如果您在未提供工厂的情况下在测试文件中调用 `vi.mock`，它将在 `__mocks__` 文件夹中找到一个文件以用作模块：

  ```ts
  // increment.test.js
  import { vi } from 'vitest'
  // axios is a default export from `__mocks__/axios.js`
  import axios from 'axios'
  // increment is a named export from `src/__mocks__/increment.js`
  import { increment } from '../increment.js'
  
  vi.mock('axios')
  vi.mock('../increment.js')
  
  axios.get(`/apples/${increment(1)}`)
  ```

  ::: warning
  请注意，如果你不调用 `vi.mock`，模块**不会**自动模拟。
  :::

  如果没有提供 `__mocks__` 文件夹或工厂，Vitest 将导入原始模块并自动模拟其所有导出。有关应用的规则，请参阅 [algorithm](/guide/mocking#automocking-algorithm)。

## vi.doMock

- **类型**: `(path: string, factory?: () => unknown) => void`

  与 [`vi.mock`](#vi-mock) 相同，但它不会提升到文件顶部，因此您可以在全局文件范围内引用变量。模块的下一次导入将被模拟。这不会模拟在调用之前导入的模块。

```ts
// ./increment.js
export function increment(number) {
  return number + 1
}
```

```ts
import { beforeEach, test } from 'vitest'
import { increment } from './increment.js'

// the module is not mocked, because vi.doMock is not called yet
increment(1) === 2

let mockedIncrement = 100

beforeEach(() => {
  // you can access variables inside a factory
  vi.doMock('./increment.js', () => ({ increment: () => ++mockedIncrement }))
})

test('importing the next module imports mocked one', async () => {
  // original import WAS NOT MOCKED, because vi.doMock is evaluated AFTER imports
  expect(increment(1)).toBe(2)
  const { increment: mockedIncrement } = await import('./increment.js')
  // new import returns mocked module
  expect(mockedIncrement(1)).toBe(101)
  expect(mockedIncrement(1)).toBe(102)
  expect(mockedIncrement(1)).toBe(103)
})
```

## vi.mocked

- **类型**: `<T>(obj: T, deep?: boolean) => MaybeMockedDeep<T>`
- **类型**: `<T>(obj: T, options?: { partial?: boolean; deep?: boolean }) => MaybePartiallyMockedDeep<T>`

  TypeScript 的类型助手。实际上只是返回传递的对象。

  当 `partial` 为 `true` 时，它将期望 `Partial<T>` 作为返回值。

  ```ts
  import example from './example.js'
  
  vi.mock('./example.js')
  
  test('1+1 equals 2', async () => {
    vi.mocked(example.calc).mockRestore()
  
    const res = example.calc(1, '+', 1)
  
    expect(res).toBe(2)
  })
  ```

## vi.importActual

- **类型**: `<T>(path: string) => Promise<T>`

  导入模块，绕过所有检查是否应该被模拟。如果你想部分模拟模块，这可能很有用。

  ```ts
  vi.mock('./example.js', async () => {
    const axios = await vi.importActual('./example.js')
    return { ...axios, get: vi.fn() }
  })
  ```

## vi.importMock

- **类型**: `<T>(path: string) => Promise<MaybeMockedDeep<T>>`

导入一个模块，其所有属性（包括嵌套属性）都被模拟。遵循 [`vi.mock`](#vi-mock) 遵循的相同规则。有关应用的规则，请参阅 [algorithm](/guide/mocking#automocking-algorithm)。

## vi.resetAllMocks

将对所有模拟调用 [`.mockReset()`](/api/mock.html#mockreset)。这将清除模拟历史并将其实现重置为空函数（将返回 `undefined`）。

## vi.resetConfig

- **类型**: `RuntimeConfig`

如果之前调用了 [`vi.setConfig`](#vi-setconfig)，这会将配置重置为原始状态。

## vi.resetModules

- **类型**: `() => Vitest`

通过清除所有模块的缓存来重置模块注册表。这允许在重新导入时重新评估模块。但是无法重新评估顶级导入。这可能有助于隔离测试之间本地状态冲突的模块。

```ts
import { vi } from 'vitest'
import { data } from './data.js' // Will not get reevaluated beforeEach test

beforeEach(() => {
  vi.resetModules()
})

test('change state', async () => {
  const mod = await import('./some/path.js') // Will get reevaluated
  mod.changeLocalState('new value')
  expect(mod.getLocalState()).toBe('new value')
})

test('module has old state', async () => {
  const mod = await import('./some/path.js') // Will get reevaluated
  expect(mod.getLocalState()).toBe('old value')
})
```

::: warning
不重置模拟注册表。要清除模拟注册表，请使用 [`vi.unmock`](#vi-unmock) 或 [`vi.doUnmock`](#vi-dounmock)。
:::

## vi.restoreAllMocks

将对所有模拟调用 [`.mockRestore()`](/api/mock.html#mockrestore)。这将清除模拟历史并将其实现重置为原始历史。

## vi.restoreCurrentDate

- **类型:** `() => void`

  将 `Date` 恢复为其本机实现。

## vi.stubEnv

- **类型:** `(name: string, value: string) => Vitest`
- **版本:** 从 Vitest 0.26.0 开始支持

  更改 `process.env` 和 `import.meta.env` 上的环境变量值。你可以通过调用 `vi.unstubAllEnvs` 恢复它的值。

```ts
import { vi } from 'vitest'

// `process.env.NODE_ENV` and `import.meta.env.NODE_ENV`
// are "development" before calling "vi.stubEnv"

vi.stubEnv('NODE_ENV', 'production')

process.env.NODE_ENV === 'production'
import.meta.env.NODE_ENV === 'production'
// doesn't change other envs
import.meta.env.MODE === 'development'
```

:::tip
你也可以通过简单地分配它来更改值，但是你将无法使用 `vi.unstubAllEnvs` 来恢复以前的值：

```ts
import.meta.env.MODE = 'test'
```

:::

:::warning
Vitest 将所有 `import.meta.env` 调用转换为 `process.env`，因此它们可以在运行时轻松更改。 Node.js 只支持字符串值作为 env 参数，而 Vite 支持几种内置的 env 作为布尔值（即 `SSR`、`DEV`、`PROD`）。 为了模仿 Vite，将 "truthy" 值设置为 env：`''` 而不是 `false`，`'1'` 而不是 `true`。

但请注意，在这种情况下，你不能使用 `import.meta.env.DEV === false`。使用 `!import.meta.env.DEV`。这也会影响简单的分配，而不仅仅是 `vi.stubEnv` 方法。
:::

## vi.unstubAllEnvs

- **类型:** `() => Vitest`
- **版本:** 从 Vitest 0.26.0 开始支持

  恢复使用 `vi.stubEnv` 更改的所有 `import.meta.env` and `process.env` 值。第一次调用时，Vitest 会记住原始值并存储它，直到再次调用 `unstubAllEnvs`。

```ts
import { vi } from 'vitest'

// `process.env.NODE_ENV` and `import.meta.env.NODE_ENV`
// are "development" before calling stubEnv

vi.stubEnv('NODE_ENV', 'production')

process.env.NODE_ENV === 'production'
import.meta.env.NODE_ENV === 'production'

vi.stubEnv('NODE_ENV', 'staging')

process.env.NODE_ENV === 'staging'
import.meta.env.NODE_ENV === 'staging'

vi.unstubAllEnvs()

// restores to the value that were stored before the first "stubEnv" call
process.env.NODE_ENV === 'development'
import.meta.env.NODE_ENV === 'development'
```

## vi.stubGlobal

- **类型:** `(name: string | number | symbol, value: unknown) => Vitest`

  改变全局变量的值。你可以通过调用 `vi.unstubAllGlobals` 恢复其原始值。

```ts
import { vi } from 'vitest'

// `innerWidth` is "0" before calling stubGlobal

vi.stubGlobal('innerWidth', 100)

innerWidth === 100
globalThis.innerWidth === 100
// if you are using jsdom or happy-dom
window.innerWidth === 100
```

:::tip
你也可以通过简单地将其分配给 `globalThis` 或 `window` 来更改值（如果你使用的是 `jsdom` 或 `happy-dom` 环境），但是你将无法使用 `vi.unstubAllGlobals` 来恢复原始值：

```ts
globalThis.innerWidth = 100
// if you are using jsdom or happy-dom
window.innerWidth = 100
```

:::

## vi.unstubAllGlobals

- **类型:** `() => Vitest`
- **版本:** 从 Vitest 0.26.0 开始支持

  恢复 `globalThis`/`global`（和 `window`/`top`/`self`/`parent`，如果你使用 `jsdom` 或 `happy-dom` 环境）的所有全局值被 ` vi.stubGlobal`。第一次调用时，Vitest 会记住原始值并存储它，直到再次调用 `unstubAllGlobals`。

```ts
import { vi } from 'vitest'

const Mock = vi.fn()

// IntersectionObserver is "undefined" before calling "stubGlobal"

vi.stubGlobal('IntersectionObserver', Mock)

IntersectionObserver === Mock
global.IntersectionObserver === Mock
globalThis.IntersectionObserver === Mock
// if you are using jsdom or happy-dom
window.IntersectionObserver === Mock

vi.unstubAllGlobals()

globalThis.IntersectionObserver === undefined
'IntersectionObserver' in globalThis === false
// throws ReferenceError, because it's not defined
IntersectionObserver === undefined
```

## vi.runAllTicks

- **类型:** `() => Vitest`

  调用由 `process.nextTick` 排队的每个微任务。这也将运行所有自己安排的微任务。

## vi.runAllTimers

- **类型:** `() => Vitest`

  此方法将调用每个启动的计时器，直到计时器队列为空。这意味着在 `runAllTimers` 期间调用的每个计时器都将被触发。如果你有无限间隔，它将在 10 000 次尝试后抛出。例如，这将记录 `1, 2, 3`：

  ```ts
  let i = 0
  setTimeout(() => console.log(++i))
  const interval = setInterval(() => {
    console.log(++i)
    if (i === 3)
      clearInterval(interval)
  }, 50)
  
  vi.runAllTimers()
  ```

### vi.runAllTimersAsync

- **类型:** `() => Promise<Vitest>`

  此方法将异步调用每个启动的计时器，直到计时器队列为空。这意味着在 `runAllTimersAsync` 期间调用的每个计时器都将被触发，即使是异步计时器也是如此。如果你有一个无限的间隔，它会在 10 000 次尝试后抛出。例如，这将记录 `result`：

  ```ts
  setTimeout(async () => {
    console.log(await Promise.resolve('result'))
  }, 100)
  
  await vi.runAllTimersAsync()
  ```

## vi.runOnlyPendingTimers

- **类型:** `() => Vitest`

  此方法将调用在调用 `vi.useFakeTimers()` 之后启动的每个计时器。它不会触发在其调用期间启动的任何计时器。例如，这只会记录 `1`：

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)
  
  vi.runOnlyPendingTimers()
  ```

### vi.runOnlyPendingTimersAsync

- **类型:** `() => Promise<Vitest>`

  此方法将异步调用在 `vi.useFakeTimers()` 调用之后启动的每个计时器，甚至是异步计时器。它不会触发在其调用期间启动的任何计时器。例如，这将记录 `2, 3, 3, 1`：

  ```ts
  setTimeout(() => {
    console.log(1)
  }, 100)
  setTimeout(() => {
    Promise.resolve().then(() => {
      console.log(2)
      setInterval(() => {
        console.log(3)
      }, 40)
    })
  }, 10)
  
  await vi.runOnlyPendingTimersAsync()
  ```

## vi.setSystemTime

- **类型**: `(date: string | number | Date) => void`

  将当前日期设置为过去的日期。 所有 `Date` 调用都将返回此日期。

  如果你需要测试任何依赖于当前日期的内容，这很有用 - 例如 [luxon](https://github.com/moment/luxon/) 在你的代码中调用。

  ```ts
  const date = new Date(1998, 11, 19)
  
  vi.useFakeTimers()
  vi.setSystemTime(date)
  
  expect(Date.now()).toBe(date.valueOf())
  
  vi.useRealTimers()
  ```

## vi.setConfig

- **类型**: `RuntimeConfig`

  更新当前测试文件的配置。在执行测试时，你只能作用于当前值。

## vi.spyOn

- **类型:** `<T, K extends keyof T>(object: T, method: K, accessType?: 'get' | 'set') => MockInstance`

  在对象的方法或 getter/setter 上创建一个模拟。

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

## vi.stubGlobal

- **类型**: `(key: keyof globalThis & Window, value: any) => Vitest`

  为全局变量赋值。如果你正在使用 `jsdom` 或 `happy-dom`，还要将值放在 `window` 对象上。

  在 ["模拟全局变量"部分](/guide/mocking.html#globals) 中阅读更多内容。

## vi.unmock

- **类型**: `(path: string) => void`

  从模拟注册表中删除模块。所有对 import 的调用都将返回原始模块，即使它之前被模拟过。此调用被提升（移动）到文件的顶部，因此它只会取消模拟在 `setupFiles` 中定义的模块，例如。

## vi.doUnmock

- **类型**: `(path: string) => void`

  与 [`vi.unmock`](#vi-unmock) 相同，但不会提升到文件顶部。模块的下一次导入将导入原始模块而不是模拟。这不会取消模拟以前导入的模块。

```ts
// ./increment.js
export function increment(number) {
  return number + 1
}
```

```ts
import { increment } from './increment.js'

// increment is already mocked, because vi.mock is hoisted
increment(1) === 100

// this is hoisted, and factory is called before the import on line 1
vi.mock('./increment.js', () => ({ increment: () => 100 }))

// all calls are mocked, and `increment` always returns 100
increment(1) === 100
increment(30) === 100

// this is not hoisted, so other import will return unmocked module
vi.doUnmock('./increment.js')

// this STILL returns 100, because `vi.doUnmock` doesn't reevaluate a module
increment(1) === 100
increment(30) === 100

// the next import is unmocked, now `increment` is the original function that returns count + 1
const { increment: unmockedIncrement } = await import('./increment.js')

unmockedIncrement(1) === 2
unmockedIncrement(30) === 31
```

## vi.useFakeTimers

- **类型:** `() => Vitest`

  要启用模拟计时器，你需要调用此方法。它将包装所有对计时器的进一步调用（例如 `setTimeout`、`setInterval`、`clearTimeout`、`clearInterval`、`nextTick`、`setImmediate`、`clearImmediate` 和 `Date`），直到 [`vi. useRealTimers()`](#vi-userealtimers) 被调用。

  该实现在内部基于 [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers)。

## vi.useRealTimers

- **类型:** `() => Vitest`

  当计时器用完时，你可以调用此方法将模拟计时器返回到其原始实现。之前运行的所有计时器都不会恢复。
