---
outline: deep
---

# Vi

Vitest 通过其 `vi` 辅助工具提供实用功能来帮助您。可以全局访问它（当启用 [globals 配置](/config/#globals) 时），也可以直接从 `vitest` 中导入：

```js
import { vi } from 'vitest'
```

## Mock Modules

本节介绍在 [模拟模块](/guide/mocking#modules) 时可以使用的 API。请注意，Vitest 不支持模拟使用 `require()` 导入的模块。

### vi.mock

- **类型**: `(path: string, factory?: (importOriginal: () => unknown) => unknown) => void`

用另一个模块替换提供的 `path` 中的所有导入模块。我们可以在路径内使用配置的 Vite 别名。对 `vi.mock` 的调用是悬挂式的，因此在何处调用并不重要。它总是在所有导入之前执行。如果需要在其作用域之外引用某些变量，可以在 [`vi.hoisted`](/api/vi#vi-hoisted)中定义它们，并在 `vi.mock` 中引用它们。

::: warning
`vi.mock` 仅对使用 `import` 关键字导入的模块有效。它对 `require` 无效。

为了提升 `vi.mock` ，Vitest 会静态分析文件。它会指出不能使用未直接从 `vitest` 软件包导入的 `vi` （例如，从某个实用程序文件导入）。使用 `vi.mock` 与从 `vitest` 导入的 `vi` 一起使用，或者启用 [`globals`](/config/#globals) 配置选项。

Vitest 不会模拟 [setup file](/config/#setupfiles) 中导入的模块，因为这些模块在运行测试文件时已被缓存。我们可以在 [`vi.hoisted`](#vi-hoisted) 中调用 [`vi.resetModules()`](#vi-resetmodules) ，在运行测试文件前清除所有模块缓存。
:::

::: warning
[浏览器模式](/guide/browser)目前不支持模拟模块。可以在这个 <a href="https://github.com/vitest-dev/vitest/issues/3046">issue</a> 中持续关注此功能。
:::

如果定义了 `factory`，所有导入都将返回其结果。Vitest 只调用一次 factory，并缓存所有后续导入的结果，直到 [`vi.unmock`](#vii-unmock) 或 [`vi.doUnmock`](#vii-dounmock) 被调用。

与 `jest` 不同，该 factory 可以是异步的，因此可以使用 [`vi.importActual`](#vi-importactual) 或作为第一个参数接收的助手来获取原始模块。

```js
// 使用 JavaScript 时

vi.mock('./path/to/module.js', async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    // 取代部分出口
    namedExport: vi.fn(),
  }
})
```

```ts
// 使用 TypeScript 时 

vi.mock('./path/to/module.js', async (importOriginal) => {
  const mod = await importOriginal<typeof import('./path/to/module.js')>()
  return {
    ...mod,
    // 取代部分出口
    namedExport: vi.fn(),
  }
})
```

::: warning
`vi.mock` 被提升（换句话说，_移动_）到**文件的顶部**。这意味着无论何时写入它（无论是在 `beforeEach` 还是 `test`），它都会在此之前被调用。

这也意味着不能在 factory 内部使用任何在 factory 外部定义的变量。

如果需要在 factory 内部使用变量，请尝试 [`vi.doMock`](#vi-domock) 。它以同样的方式工作，但不会被吊起。请注意，它只能模拟后续的导入。

如果在 `vi.mock` 之前声明了 `vi.hoisted` 方法，也可以引用该方法定义的变量：

```ts
import { namedExport } from './path/to/module.js'

const mocks = vi.hoisted(() => {
  return {
    namedExport: vi.fn(),
  }
})

vi.mock('./path/to/module.js', () => {
  return {
    namedExport: mocks.namedExport,
  }
})

vi.mocked(namedExport).mockReturnValue(100)

expect(namedExport()).toBe(100)
expect(namedExport).toBe(mocks.namedExport)
```

:::

::: warning
如果我们模拟的模块有默认导出，则需要在返回的工厂函数对象中提供一个 `default` 键。这是 ES 模块特有的注意事项；因此，由于 `jest` 使用 CommonJS 模块，`jest` 文档可能会有所不同。例如：

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
如果要模拟的文件旁边有一个 `__mocks__` 文件夹，且没有提供工厂，Vitest 将尝试在 `__mocks__` 子文件夹中找到一个同名文件，并将其作为实际模块使用。如果模拟的是依赖关系，Vitest 会尝试在项目的 [root](/config/#root)（默认为 `process.cwd()` ）中找到 `__mocks__` 文件夹。我们可以通过 [deps.moduleDirectories](/config/#deps-moduledirectories) 配置选项告诉 Vitest 依赖项的位置。

例如，我们有这样的文件结构：

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

如果在没有提供工厂的测试文件中调用 `vi.mock` ，它会在 `__mocks__` 文件夹中找到一个文件作为模块使用：

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
Beware that if you don't call `vi.mock`, modules **are not** mocked automatically. To replicate Jest's automocking behaviour, you can call `vi.mock` for each required module inside [`setupFiles`](/config/#setupfiles).

请注意，如果不调用 `vi.mock` ，模块**不会**被自动模拟。要复制 Jest 的自动锁定行为，可以在 [`setupFiles`](/config/#setupfiles) 中为每个所需的模块调用 `vi.mock` 。
:::

If there is no `__mocks__` folder or a factory provided, Vitest will import the original module and auto-mock all its exports. For the rules applied, see [algorithm](/guide/mocking#automocking-algorithm).

如果没有提供 `__mocks__` 文件夹或工厂，Vitest 将导入原始模块并自动模拟其所有输出。有关应用的规则，请参阅[模块](/guide/mocking#%E6%A8%A1%E5%9D%97)。

### vi.doMock

- **类型**: `(path: string, factory?: (importOriginal: () => unknown) => unknown) => void`

与 [`vi.mock`](#vi-mock) 相同，但它不会被移动到文件顶部，因此我们可以引用全局文件作用域中的变量。模块的下一个 [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 将被模拟。

::: warning
这将不会模拟在调用此调用之前导入的模块。不要忘记，ESM 中的所有静态导入都是 [hoaded](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#hoisting)，因此在静态导入前调用此调用不会强制在导入前调用：

```ts
// this will be called _after_ the import statement

import { increment } from './increment.js'; vi.doMock('./increment.js')
```

:::

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
  // new dynamic import returns mocked module
  expect(mockedIncrement(1)).toBe(101)
  expect(mockedIncrement(1)).toBe(102)
  expect(mockedIncrement(1)).toBe(103)
})
```

### vi.mocked

- **类型**: `<T>(obj: T, deep?: boolean) => MaybeMockedDeep<T>`
- **类型**: `<T>(obj: T, options?: { partial?: boolean; deep?: boolean }) => MaybePartiallyMockedDeep<T>`

TypeScript 的类型助手。只返回传入的对象。

当 `partial` 为 `true` 时，它将期望一个 `Partial<T>` 作为返回值。默认情况下，这只会让 TypeScript 认为第一层的值是模拟的。我们可以将 `{ deep: true }` 作为第二个参数传递给 TypeScript，告诉它整个对象都是模拟的（如果实际上是的话）。

```ts
import example from './example.js'

vi.mock('./example.js')

test('1 + 1 equals 10', async () => {
  vi.mocked(example.calc).mockReturnValue(10)
  expect(example.calc(1, '+', 1)).toBe(10)
})
```

### vi.importActual

- **类型**: `<T>(path: string) => Promise<T>`

导入模块，绕过模块是否应被模拟的所有检查。如果我们想部分模拟模块，这一点很有用。

```ts
vi.mock('./example.js', async () => {
  const axios = await vi.importActual('./example.js')

  return { ...axios, get: vi.fn() }
})
```

### vi.importMock

- **类型**: `<T>(path: string) => Promise<MaybeMockedDeep<T>>`

导入模块并模拟其所有属性（包括嵌套属性）。遵循与 [`vi.mock`](#vi-mock) 相同的规则。有关应用的规则，请参阅[模块](/guide/mocking#%E6%A8%A1%E5%9D%97)。

### vi.unmock

- **类型**: `(path: string) => void`

从模拟注册表中删除模块。所有导入调用都将返回原始模块，即使该模块之前已被模拟。该调用会被移动到文件顶端，因此只会解除在 `setupFiles` 中定义的模块。

### vi.doUnmock

- **类型**: `(path: string) => void`

与 [`vi.unmock`](#vi-unmock) 相同，但不会移动到文件顶端。下一次导入模块时，将导入原始模块而非 mock。这不会解除先前导入的模块。

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

### vi.resetModules

- **类型**: `() => Vitest`

通过清除所有模块的缓存来重置模块注册表。这样就可以在重新导入模块时对模块进行重新评估。顶层导入无法重新评估。这可能有助于隔离测试之间存在本地状态冲突的模块。

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
不会重置 mock 注册表。要清除 mock 注册表，请使用 [`vi.unmock`](#vi-unmock) 或 [`vi.doUnmock`](#vi-dounmock) 。
:::

### vi.dynamicImportSettled

等待加载所有导入模块。如果有同步调用开始导入一个模块，而如果不这样做就无法等待，那么它就很有用。

```ts
import { expect, test } from 'vitest'

// cannot track import because Promise is not returned
function renderComponent() {
  import('./component.js').then(({ render }) => {
    render()
  })
}

test('operations are resolved', async () => {
  renderComponent()
  await vi.dynamicImportSettled()
  expect(document.querySelector('.component')).not.toBeNull()
})
```

::: tip
如果在动态导入过程中又启动了另一个动态导入，则该方法将等待直到所有动态导入都解决为止。

该方法还将在导入解析后等待下一个 `setTimeout` 跟他挂钩，因此所有同步操作都应在解析时完成。
:::

## Mocking Functions and Objects

本节介绍如何使用 [method mock](/api/mock) 替换环境变量和全局变量。

### vi.fn

- **类型:** `(fn?: Function) => Mock`

创建函数的监视程序，但也可以不创建监视程序。每次调用函数时，它都会存储调用参数、返回值和实例。此外，我们还可以使用 [methods](/api/mock) 操纵它的行为。
如果没有给出函数，调用 mock 时将返回 `undefined`。

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

### vi.isMockFunction

- **类型:** `(fn: Function) => boolean`

检查给定参数是否为 mock 函数。如果使用的是 TypeScript ，它还会缩小参数类型的范围。

### vi.clearAllMocks

将对所有 监听(spies) 调用 [`.mockClear()`](/api/mock#mockclear)。这将清除 mock 历史记录，但不会将其重置为默认实现。

### vi.resetAllMocks

将对所有 监听(spies) 调用 [`.mockReset()`](/api/mock#mockreset)。这将清除 mock 历史记录，并将其重置为空函数（将返回 `undefined` ）。

### vi.restoreAllMocks

将对所有 监听(spies) 调用 [`.mockRestore()`](/api/mock#mockrestore)。这将清除 mock 的历史记录，并将其重置为原来的实现。

### vi.spyOn

- **类型:** `<T, K extends keyof T>(object: T, method: K, accessType?: 'get' | 'set') => MockInstance`

创建与 [`vi.fn()`](/#vi-fn) 类似的对象的方法或 getter/setter 的 监听(spy) 。它会返回一个 [mock 函数](/api/mock) 。

```ts
let apples = 0
const cart = {
  getApples: () => 42,
}

const spy = vi.spyOn(cart, 'getApples').mockImplementation(() => apples)
apples = 1

expect(cart.getApples()).toBe(1)

expect(spy).toHaveBeenCalled()
expect(spy).toHaveReturnedWith(1)
```

::: tip
你可以在 [`afterEach`](/api/#aftereach)（或启用 [`test.restoreMocks`](/config/#restoreMocks) ）中调用 [`vi.restoreAllMocks`](#vi-restoreallmocks) ，将所有方法还原为原始实现。这将还原原始的 [object descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) ，因此无法更改方法的实现：

```ts
const cart = {
  getApples: () => 42,
}

const spy = vi.spyOn(cart, 'getApples').mockReturnValue(10)

console.log(cart.getApples()) // 10
vi.restoreAllMocks()
console.log(cart.getApples()) // 42
spy.mockReturnValue(10)
console.log(cart.getApples()) // still 42!
```

:::

### vi.stubEnv

- **类型:** `(name: string, value: string) => Vitest`
- **版本:** Since Vitest 0.26.0

更改 `process.env` 和 `import.meta.env` 中环境变量的值。我们可以调用 `vi.unstubAllEnvs` 恢复其值。

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
我们也可以通过简单赋值来更改值，但无法使用 `vi.unstubAllEnvs` 恢复以前的值：

```ts
import.meta.env.MODE = 'test'
```

:::

### vi.unstubAllEnvs

- **Type:** `() => Vitest`
- **Version:** Since Vitest 0.26.0

Restores all `import.meta.env` and `process.env` values that were changed with `vi.stubEnv`. When it's called for the first time, Vitest remembers the original value and will store it, until `unstubAllEnvs` is called again.

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

### vi.stubGlobal

- **Type:** `(name: string | number | symbol, value: unknown) => Vitest`

Changes the value of global variable. You can restore its original value by calling `vi.unstubAllGlobals`.

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
You can also change the value by simply assigning it to `globalThis` or `window` (if you are using `jsdom` or `happy-dom` environment), but you won't be able to use `vi.unstubAllGlobals` to restore original value:

```ts
globalThis.innerWidth = 100
// if you are using jsdom or happy-dom
window.innerWidth = 100
```

:::

### vi.unstubAllGlobals

- **Type:** `() => Vitest`
- **Version:** Since Vitest 0.26.0

Restores all global values on `globalThis`/`global` (and `window`/`top`/`self`/`parent`, if you are using `jsdom` or `happy-dom` environment) that were changed with `vi.stubGlobal`. When it's called for the first time, Vitest remembers the original value and will store it, until `unstubAllGlobals` is called again.

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

## Fake Timers

This sections descibes how to work with [fake timers](/guide/mocking#timers).

### vi.advanceTimersByTime

- **Type:** `(ms: number) => Vitest`

This method will invoke every initiated timer until the specified number of milliseconds is passed or the queue is empty - whatever comes first.

```ts
let i = 0
setInterval(() => console.log(++i), 50)

vi.advanceTimersByTime(150)

// log: 1
// log: 2
// log: 3
```

### vi.advanceTimersByTimeAsync

- **Type:** `(ms: number) => Promise<Vitest>`

This method will invoke every initiated timer until the specified number of milliseconds is passed or the queue is empty - whatever comes first. This will include asynchronously set timers.

```ts
let i = 0
setInterval(() => Promise.resolve().then(() => console.log(++i)), 50)

await vi.advanceTimersByTimeAsync(150)

// log: 1
// log: 2
// log: 3
```

### vi.advanceTimersToNextTimer

- **Type:** `() => Vitest`

Will call next available timer. Useful to make assertions between each timer call. You can chain call it to manage timers by yourself.

```ts
let i = 0
setInterval(() => console.log(++i), 50)

vi.advanceTimersToNextTimer() // log: 1
  .advanceTimersToNextTimer() // log: 2
  .advanceTimersToNextTimer() // log: 3
```

### vi.advanceTimersToNextTimerAsync

- **Type:** `() => Promise<Vitest>`

Will call next available timer and wait until it's resolved if it was set asynchronously. Useful to make assertions between each timer call.

```ts
let i = 0
setInterval(() => Promise.resolve().then(() => console.log(++i)), 50)

await vi.advanceTimersToNextTimerAsync() // log: 1
expect(console.log).toHaveBeenCalledWith(1)

await vi.advanceTimersToNextTimerAsync() // log: 2
await vi.advanceTimersToNextTimerAsync() // log: 3
```

### vi.getTimerCount

- **Type:** `() => number`

Get the number of waiting timers.

### vi.clearAllTimers

Removes all timers that are scheduled to run. These timers will never run in the future.

### vi.getMockedSystemTime

- **Type**: `() => Date | null`

Returns mocked current date that was set using `setSystemTime`. If date is not mocked the method will return `null`.

### vi.getRealSystemTime

- **Type**: `() => number`

When using `vi.useFakeTimers`, `Date.now` calls are mocked. If you need to get real time in milliseconds, you can call this function.

### vi.runAllTicks

- **Type:** `() => Vitest`

Calls every microtask that was queued by `process.nextTick`. This will also run all microtasks scheduled by themselves.

### vi.runAllTimers

- **Type:** `() => Vitest`

This method will invoke every initiated timer until the timer queue is empty. It means that every timer called during `runAllTimers` will be fired. If you have an infinite interval, it will throw after 10 000 tries (can be configured with [`fakeTimers.loopLimit`](/config/#faketimers-looplimit)).

```ts
let i = 0
setTimeout(() => console.log(++i))
const interval = setInterval(() => {
  console.log(++i)
  if (i === 3)
    clearInterval(interval)
}, 50)

vi.runAllTimers()

// log: 1
// log: 2
// log: 3
```

### vi.runAllTimersAsync

- **Type:** `() => Promise<Vitest>`

This method will asynchronously invoke every initiated timer until the timer queue is empty. It means that every timer called during `runAllTimersAsync` will be fired even asynchronous timers. If you have an infinite interval,
it will throw after 10 000 tries (can be configured with [`fakeTimers.loopLimit`](/config/#faketimers-looplimit)).

```ts
setTimeout(async () => {
  console.log(await Promise.resolve('result'))
}, 100)

await vi.runAllTimersAsync()

// log: result
```

### vi.runOnlyPendingTimers

- **Type:** `() => Vitest`

This method will call every timer that was initiated after [`vi.useFakeTimers`](#vi-usefaketimers) call. It will not fire any timer that was initiated during its call.

```ts
let i = 0
setInterval(() => console.log(++i), 50)

vi.runOnlyPendingTimers()

// log: 1
```

### vi.runOnlyPendingTimersAsync

- **Type:** `() => Promise<Vitest>`

This method will asynchronously call every timer that was initiated after [`vi.useFakeTimers`](#vi-usefaketimers) call, even asynchronous ones. It will not fire any timer that was initiated during its call.

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

// log: 2
// log: 3
// log: 3
// log: 1
```

### vi.setSystemTime

- **Type**: `(date: string | number | Date) => void`

If fake timers are enabled, this method simulates a user changing the system clock (will affect date related API like `hrtime`, `performance.now` or `new Date()`) - however, it will not fire any timers. If fake timers are not enabled, this method will only mock `Date.*` calls.

Useful if you need to test anything that depends on the current date - for example [luxon](https://github.com/moment/luxon/) calls inside your code.

```ts
const date = new Date(1998, 11, 19)

vi.useFakeTimers()
vi.setSystemTime(date)

expect(Date.now()).toBe(date.valueOf())

vi.useRealTimers()
```

### vi.useFakeTimers

- **Type:** `() => Vitest`

To enable mocking timers, you need to call this method. It will wrap all further calls to timers (such as `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`, `nextTick`, `setImmediate`, `clearImmediate`, and `Date`), until [`vi.useRealTimers()`](#vi-userealtimers) is called.

Mocking `nextTick` is not supported when running Vitest inside `node:child_process` by using `--pool=forks`. NodeJS uses `process.nextTick` internally in `node:child_process` and hangs when it is mocked. Mocking `nextTick` is supported when running Vitest with `--pool=threads`.

The implementation is based internally on [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers).

::: tip
Since version `0.35.0` `vi.useFakeTimers()` no longer automatically mocks `process.nextTick`.
It can still be mocked by specyfing the option in `toFake` argument: `vi.useFakeTimers({ toFake: ['nextTick'] })`.
:::

### vi.isFakeTimers

- **Type:** `() => boolean`
- **Version:** Since Vitest 0.34.5

Returns `true` if fake timers are enabled.

### vi.useRealTimers

- **Type:** `() => Vitest`

When timers are run out, you may call this method to return mocked timers to its original implementations. All timers that were scheduled before will be discarded.

## Miscellaneous

A set of useful helper functions that Vitest provides.

### vi.waitFor

- **Type:** `<T>(callback: WaitForCallback<T>, options?: number | WaitForOptions) => Promise<T>`
- **Version**: Since Vitest 0.34.5

Wait for the callback to execute successfully. If the callback throws an error or returns a rejected promise it will continue to wait until it succeeds or times out.

This is very useful when you need to wait for some asynchronous action to complete, for example, when you start a server and need to wait for it to start.

```ts
import { expect, test, vi } from 'vitest'
import { createServer } from './server.js'

test('Server started successfully', async () => {
  const server = createServer()

  await vi.waitFor(
    () => {
      if (!server.isReady)
        throw new Error('Server not started')

      console.log('Server started')
    },
    {
      timeout: 500, // default is 1000
      interval: 20, // default is 50
    }
  )
  expect(server.isReady).toBe(true)
})
```

It also works for asynchronous callbacks

```ts
// @vitest-environment jsdom

import { expect, test, vi } from 'vitest'
import { getDOMElementAsync, populateDOMAsync } from './dom.js'

test('Element exists in a DOM', async () => {
  // start populating DOM
  populateDOMAsync()

  const element = await vi.waitFor(
    async () => {
      // try to get the element until it exists
      const element = (await getDOMElementAsync()) as HTMLElement | null
      expect(element).toBeTruthy()
      expect(element.dataset.initialized).toBeTruthy()
      return element
    },
    {
      timeout: 500, // default is 1000
      interval: 20, // default is 50
    }
  )
  expect(element).toBeInstanceOf(HTMLElement)
})
```

If `vi.useFakeTimers` is used, `vi.waitFor` automatically calls `vi.advanceTimersByTime(interval)` in every check callback.

### vi.waitUntil

- **Type:** `<T>(callback: WaitUntilCallback<T>, options?: number | WaitUntilOptions) => Promise<T>`
- **Version**: Since Vitest 0.34.5

This is similar to `vi.waitFor`, but if the callback throws any errors, execution is immediately interrupted and an error message is received. If the callback returns falsy value, the next check will continue until truthy value is returned. This is useful when you need to wait for something to exist before taking the next step.

Look at the example below. We can use `vi.waitUntil` to wait for the element to appear on the page, and then we can do something with the element.

```ts
import { expect, test, vi } from 'vitest'

test('Element render correctly', async () => {
  const element = await vi.waitUntil(() => document.querySelector('.element'), {
    timeout: 500, // default is 1000
    interval: 20, // default is 50
  })

  // do something with the element
  expect(element.querySelector('.element-child')).toBeTruthy()
})
```

### vi.hoisted

- **Type**: `<T>(factory: () => T) => T`
- **Version**: Since Vitest 0.31.0

All static `import` statements in ES modules are hoisted to the top of the file, so any code that is defined before the imports will actually be executed after imports are evaluated.

However, it can be useful to invoke some side effects like mocking dates before importing a module.

To bypass this limitation, you can rewrite static imports into dynamic ones like this:

```diff
callFunctionWithSideEffect()
- import { value } from './some/module.js'
+ const { value } = await import('./some/module.js')
```

When running `vitest`, you can do this automatically by using `vi.hoisted` method.

```diff
- callFunctionWithSideEffect()
import { value } from './some/module.js'
+ vi.hoisted(() => callFunctionWithSideEffect())
```

This method returns the value that was returned from the factory. You can use that value in your `vi.mock` factories if you need easy access to locally defined variables:

```ts
import { expect, vi } from 'vitest'
import { originalMethod } from './path/to/module.js'

const { mockedMethod } = vi.hoisted(() => {
  return { mockedMethod: vi.fn() }
})

vi.mock('./path/to/module.js', () => {
  return { originalMethod: mockedMethod }
})

mockedMethod.mockReturnValue(100)
expect(originalMethod()).toBe(100)
```

Note that this method can also be called asynchronously even if your environment doesn't support top-level await:

```ts
const promised = await vi.hoisted(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  return response.json()
})
```

### vi.setConfig

- **Type**: `RuntimeConfig`

Updates config for the current test file. This method supports only config options that will affect the current test file:

```ts
vi.setConfig({
  allowOnly: true,
  testTimeout: 10_000,
  hookTimeout: 10_000,
  clearMocks: true,
  restoreMocks: true,
  fakeTimers: {
    now: new Date(2021, 11, 19),
    // supports the whole object
  },
  maxConcurrency: 10,
  sequence: {
    hooks: 'stack',
    // supports only "sequence.hooks"
  },
})
```

### vi.resetConfig

- **Type**: `RuntimeConfig`

If [`vi.setConfig`](#vi-setconfig) was called before, this will reset config to the original state.
