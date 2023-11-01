---
outline: deep
---

# Vi

<<<<<<< HEAD
Vitest 提供实用函数来帮助你使用其 `vi` 助手。你可以全局访问它（当 [globals configuration](/config/#globals) 是 **启用** 时），或者从 `vitest` 导入：
=======
Vitest provides utility functions to help you out through its `vi` helper. You can access it globally (when [globals configuration](/config/#globals) is enabled), or import it from `vitest` directly:
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

```js
import { vi } from 'vitest'
```

## Mock Modules

<<<<<<< HEAD
- **类型:** `(ms: number) => Vitest`

  就像 `runAllTimers` 一样工作，但会在经过几毫秒后结束。例如，这将记录 `1, 2, 3` 并且不会抛出：

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)
  
  vi.advanceTimersByTime(150)
  ```
=======
This section describes the API that you can use when [mocking a module](/guide/mocking#modules). Beware that Vitest doesn't support mocking modules imported using `require()`.

### vi.mock

- **Type**: `(path: string, factory?: (importOriginal: () => unknown) => unknown) => void`

Substitutes all imported modules from provided `path` with another module. You can use configured Vite aliases inside a path. The call to `vi.mock` is hoisted, so it doesn't matter where you call it. It will always be executed before all imports. If you need to reference some variables outside of its scope, you can define them inside [`vi.hoisted`](/api/vi#vi-hoisted) and reference them inside `vi.mock`.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

::: warning
`vi.mock` works only for modules that were imported with the `import` keyword. It doesn't work with `require`.

<<<<<<< HEAD
- **类型:** `(ms: number) => Promise<Vitest>`

  就像 `runAllTimersAsync` 一样工作，但会在经过几毫秒后结束。这将包括异步设置的计时器。例如，这将记录 `1, 2, 3` 并且不会抛出：

  ```ts
  let i = 0
  setInterval(() => Promise.resolve().then(() => console.log(++i)), 50)
  
  await vi.advanceTimersByTimeAsync(150)
  ```
=======
In order to hoist `vi.mock`, Vitest statically analyzes your files. It indicates that `vi` that was not directly imported from the `vitest` package (for example, from some utility file) cannot be used. Use `vi.mock` with `vi` imported from `vitest`, or enable [`globals`](/config/#globals) config option.

Vitest will not mock modules that were imported inside a [setup file](/config/#setupfiles) because they are cached by the time a test file is running. You can call [`vi.resetModules()`](#vi-resetmodules) inside [`vi.hoisted`](#vi-hoisted) to clear all module caches before running a test file.
:::

::: warning
The [browser mode](/guide/browser) does not presently support mocking modules. You can track this feature in the GitHub <a href="https://github.com/vitest-dev/vitest/issues/3046">issue</a>.
:::

If `factory` is defined, all imports will return its result. Vitest calls factory only once and caches results for all subsequent imports until [`vi.unmock`](#vi-unmock) or [`vi.doUnmock`](#vi-dounmock) is called.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

Unlike in `jest`, the factory can be asynchronous, so you can use [`vi.importActual`](#vi-importactual) or a helper, received as the first argument, inside to get the original module.

<<<<<<< HEAD
- **类型:** `() => Vitest`

  将调用下一个可用的计时器。在每次定时器调用之间进行断言很有用。你可以链式调用它来自己管理定时器。

  ```ts
  let i = 0
  setInterval(() => console.log(++i), 50)
  
  vi.advanceTimersToNextTimer() // log 1
    .advanceTimersToNextTimer() // log 2
    .advanceTimersToNextTimer() // log 3
  ```
=======
```js
// when using JavaScript

vi.mock('./path/to/module.js', async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    // replace some exports
    namedExport: vi.fn(),
  }
})
```

```ts
// when using TypeScript

vi.mock('./path/to/module.js', async (importOriginal) => {
  const mod = await importOriginal<typeof import('./path/to/module.js')>()
  return {
    ...mod,
    // replace some exports
    namedExport: vi.fn(),
  }
})
```
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

::: warning
`vi.mock` is hoisted (in other words, _moved_) to **top of the file**. It means that whenever you write it (be it inside `beforeEach` or `test`), it will actually be called before that.

<<<<<<< HEAD
- **类型:** `() => Promise<Vitest>`

  将调用下一个可用计时器，即使它是异步设置的。在每次定时器调用之间进行断言很有用。你可以链式调用它来自己管理定时器。

  ```ts
  let i = 0
  setInterval(() => Promise.resolve().then(() => console.log(++i)), 50)
  
  vi.advanceTimersToNextTimerAsync() // log 1
    .advanceTimersToNextTimerAsync() // log 2
    .advanceTimersToNextTimerAsync() // log 3
  ```
=======
This also means that you cannot use any variables inside the factory that are defined outside the factory.

If you need to use variables inside the factory, try [`vi.doMock`](#vi-domock). It works the same way but isn't hoisted. Beware that it only mocks subsequent imports.

You can also reference variables defined by `vi.hoisted` method if it was declared before `vi.mock`:

```ts
import { namedExport } from './path/to/module.js'
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

const mocks = vi.hoisted(() => {
  return {
    namedExport: vi.fn(),
  }
})

<<<<<<< HEAD
- **类型:** `() => number`

  获取等待计时器的数量。
=======
vi.mock('./path/to/module.js', () => {
  return {
    namedExport: mocks.namedExport,
  }
})

vi.mocked(namedExport).mockReturnValue(100)
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

expect(namedExport()).toBe(100)
expect(namedExport).toBe(mocks.namedExport)
```
:::

<<<<<<< HEAD
将对所有模拟调用 [`.mockClear()`](/api/mock.html#mockclear)。这将清除模拟历史记录，但不会将其实现重置为默认值。
=======
::: warning
If you are mocking a module with default export, you will need to provide a `default` key within the returned factory function object. This is an ES module-specific caveat; therefore, `jest` documentation may differ as `jest` uses CommonJS modules. For example,
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

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

<<<<<<< HEAD
删除计划运行的所有计时器。这些计时器将来永远不会运行。
=======
If there is a `__mocks__` folder alongside a file that you are mocking, and the factory is not provided, Vitest will try to find a file with the same name in the `__mocks__` subfolder and use it as an actual module. If you are mocking a dependency, Vitest will try to find a `__mocks__` folder in the [root](/config/#root) of the project (default is `process.cwd()`). You can tell Vitest where the dependencies are located through the [deps.moduleDirectories](/config/#deps-moduledirectories) config option.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

For example, you have this file structure:

<<<<<<< HEAD
等待所有导入加载。很有用，如果你有一个开始导入模块的同步调用，否则你只能等待。

## vi.fn

- **类型:** `(fn?: Function) => Mock`

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

## vi.hoisted

- **类型**: `<T>(factory: () => T) => T`
- **版本**: Since Vitest 0.31.0

  ES 模块中的所有静态 `import` 语句都被提升到文件顶部，因此在导入被评估之后定义的任何代码实际上都将在导入之后执行。

  然而，在导入模块之前调用一些副作用（例如模拟日期）可能是有用的。

  为了绕过这个限制，您可以将静态导入重写为动态导入，如下所示：

  ```diff
  callFunctionWithSideEffect()
  - import { value } from './some/module.ts'
  + const { value } = await import('./some/module.ts')
  ```

  在运行 `vitest` 时，您可以使用 `vi.hoisted` 方法自动执行此操作。

  ```diff
  - callFunctionWithSideEffect()
  import { value } from './some/module.ts'
  + vi.hoisted(() => callFunctionWithSideEffect())
  ```

  此方法返回从工厂返回的值。如果您需要轻松访问本地定义的变量，可以在 `vi.mock` 工厂中使用该值：

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

## vi.mock

- **类型**: `(path: string, factory?: () => unknown) => void`

  用另一个模块替换提供的 `path` 中的所有导入模块。你可以在路径中使用配置的 Vite 别名。对 `vi.mock` 的调用是提升的，因此你在哪里调用它并不重要。它将始终在所有导入之前执行。如果你需要引用其作用域外的某些变量，可以在 [`vi.hoisted`](/api/vi#vi-hoisted) 中定义它们，并在 `vi.mock` 中引用。

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

  如果您需要在工厂内部使用变量，请尝试 [`vi.doMock`](#vi-domock)。它的工作方式相同，但不会被提升。请注意，它只会模拟后续导入。

  如果在 `vi.mock` 之前声明了 `vi.hoisted` 方法，您还可以引用由其定义的变量：

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
=======
```
- __mocks__
  - axios.js
- src
  __mocks__
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e
    - increment.js
  - increment.js
- tests
  - increment.test.js
```

<<<<<<< HEAD
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
  请注意，如果您不调用 `vi.mock`，模块**不会**自动模拟。为了复制 Jest 的自动模拟行为，您可以在 [`setupFiles`](/config/#setupfiles) 中为每个所需的模块调用 `vi.mock`。
  :::

  如果没有提供 `__mocks__` 文件夹或工厂，Vitest 将导入原始模块并自动模拟其所有导出。有关应用的规则，请参阅 [algorithm](/guide/mocking#automocking-algorithm)。
=======
If you call `vi.mock` in a test file without a factory provided, it will find a file in the `__mocks__` folder to use as a module:

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
:::

If there is no `__mocks__` folder or a factory provided, Vitest will import the original module and auto-mock all its exports. For the rules applied, see [algorithm](/guide/mocking#automocking-algorithm).
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

### vi.doMock

<<<<<<< HEAD
- **类型**: `(path: string, factory?: () => unknown) => void`

  与 [`vi.mock`](#vi-mock) 相同，但它没有被提升到文件的顶部，因此你可以在全局文件范围内引用变量。下一个[dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)模块的将被模拟。这将不会模拟在调用之前导入的模块。
=======
- **Type**: `(path: string, factory?: (importOriginal: () => unknown) => unknown) => void`

The same as [`vi.mock`](#vi-mock), but it's not hoisted to the top of the file, so you can reference variables in the global file scope. The next [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) of the module will be mocked. 

::: warning
This will not mock modules that were imported before this was called. Don't forget that all static imports in ESM are always [hoisted](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#hoisting), so putting this before static import will not force it to be called before the import:

```ts
// this will be called _after_ the import statement

import { increment } from './increment.js' vi.doMock('./increment.js')
```
:::
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

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

<<<<<<< HEAD
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
=======
Type helper for TypeScript. Just returns the object that was passed.

When `partial` is `true` it will expect a `Partial<T>` as a return value. By default, this will only make TypeScript believe that the first level values are mocked. You can pass down `{ deep: true }` as a second argument to tell TypeScript that the whole object is mocked, if it actually is.

```ts
import example from './example.js'

vi.mock('./example.js')

test('1 + 1 equals 10', async () => {
  vi.mocked(example.calc).mockReturnValue(10)
  expect(example.calc(1, '+', 1)).toBe(10)
})
```

### vi.importActual
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

- **类型**: `<T>(path: string) => Promise<T>`

<<<<<<< HEAD
  导入模块，绕过所有检查是否应该被模拟。如果你想部分模拟模块，这可能很有用。

  ```ts
  vi.mock('./example.js', async () => {
    const axios = await vi.importActual('./example.js')
    return { ...axios, get: vi.fn() }
  })
  ```

## vi.importMock

- **类型**: `<T>(path: string) => Promise<MaybeMockedDeep<T>>`

  导入一个模块，并将其所有属性（包括嵌套属性）进行模拟。遵循与 [`vi.mock`](#vi-mock) 相同的规则。有关应用的规则，请参阅 [algorithm](/guide/mocking#automocking-algorithm)。

## vi.resetAllMocks

将在所有间谍上调用 [`.mockReset()`](/api/mock#mockreset)。这将清除模拟历史记录并将其实现重置为一个空函数（将返回 `undefined`）。

## vi.resetConfig

- **类型**: `RuntimeConfig`

  如果在此之前调用了 [`vi.setConfig`](#vi-setconfig)，这将将配置重置为原始状态。

## vi.resetModules

- **类型**: `() => Vitest`

通过清除所有模块的缓存来重置模块注册表。这样在重新导入时可以重新评估模块。顶级导入无法重新评估。这对于在测试之间隔离模块并解决本地状态冲突可能很有用。

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
  const cart = {
    getApples: () => 13,
  }
  
  const spy = vi.spyOn(cart, 'getApples').mockImplementation(() => apples)
  apples = 1
  
  expect(cart.getApples()).toBe(1)
  
  expect(spy).toHaveBeenCalled()
  expect(spy).toHaveReturnedWith(1)
  ```

## vi.stubGlobal

- **类型**: `(key: keyof globalThis & Window, value: any) => Vitest`

  为全局变量赋值。如果你正在使用 `jsdom` 或 `happy-dom`，还要将值放在 `window` 对象上。

  在 ["模拟全局变量"部分](/guide/mocking.html#globals) 中阅读更多内容。

## vi.unmock
=======
Imports module, bypassing all checks if it should be mocked. Can be useful if you want to mock module partially.

```ts
vi.mock('./example.js', async () => {
  const axios = await vi.importActual('./example.js')

  return { ...axios, get: vi.fn() }
})
```

### vi.importMock

- **Type**: `<T>(path: string) => Promise<MaybeMockedDeep<T>>`

Imports a module with all of its properties (including nested properties) mocked. Follows the same rules that [`vi.mock`](#vi-mock) does. For the rules applied, see [algorithm](/guide/mocking#automocking-algorithm).

### vi.unmock
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

- **类型**: `(path: string) => void`

<<<<<<< HEAD
  从模拟注册表中删除模块。所有对 import 的调用都将返回原始模块，即使它之前被模拟过。此调用被提升（移动）到文件的顶部，因此它只会取消模拟在 `setupFiles` 中定义的模块，例如。
=======
Removes module from the mocked registry. All calls to import will return the original module even if it was mocked before. This call is hoisted to the top of the file, so it will only unmock modules that were defined in `setupFiles`, for example.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

### vi.doUnmock

- **类型**: `(path: string) => void`

<<<<<<< HEAD
  与 [`vi.unmock`](#vi-unmock) 相同，但不会提升到文件顶部。模块的下一次导入将导入原始模块而不是模拟。这不会取消模拟以前导入的模块。
=======
The same as [`vi.unmock`](#vi-unmock), but is not hoisted to the top of the file. The next import of the module will import the original module instead of the mock. This will not unmock previously imported modules.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

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

- **Type**: `() => Vitest`

Resets modules registry by clearing the cache of all modules. This allows modules to be reevaluated when reimported. Top-level imports cannot be re-evaluated. Might be useful to isolate modules where local state conflicts between tests.

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
Does not reset mocks registry. To clear mocks registry, use [`vi.unmock`](#vi-unmock) or [`vi.doUnmock`](#vi-dounmock).
:::

### vi.dynamicImportSettled

Wait for all imports to load. Useful, if you have a synchronous call that starts importing a module that you cannot wait otherwise.

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
If during a dynamic import another dynamic import is initiated, this method will wait unti all of them are resolved.

This method will also wait for the next `setTimeout` tick after the import is resolved so all synchronous operations should be completed by the time it's resolved.
:::

## Mocking Functions and Objects

This section describes how to work with [method mocks](/api/mock) and replace environmental and global variables.

### vi.fn

- **Type:** `(fn?: Function) => Mock`

Creates a spy on a function, though can be initiated without one. Every time a function is invoked, it stores its call arguments, returns, and instances. Also, you can manipulate its behavior with [methods](/api/mock).
If no function is given, mock will return `undefined`, when invoked.

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

- **Type:** `(fn: Function) => boolean`

Checks that a given parameter is a mock function. If you are using TypeScript, it will also narrow down its type.

### vi.clearAllMocks

Will call [`.mockClear()`](/api/mock#mockclear) on all spies. This will clear mock history, but not reset its implementation to the default one.

### vi.resetAllMocks

Will call [`.mockReset()`](/api/mock#mockreset) on all spies. This will clear mock history and reset its implementation to an empty function (will return `undefined`).

### vi.restoreAllMocks

Will call [`.mockRestore()`](/api/mock#mockrestore) on all spies. This will clear mock history and reset its implementation to the original one.

### vi.spyOn

- **Type:** `<T, K extends keyof T>(object: T, method: K, accessType?: 'get' | 'set') => MockInstance`

Creates a spy on a method or getter/setter of an object simillar to [`vi.fn()`](/#vi-fn). It returns a [mock function](/api/mock).

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
You can call [`vi.restoreAllMocks`](#vi-restoreallmocks) inside [`afterEach`](/api/#aftereach) (or enable [`test.restoreMocks`](/config/#restoreMocks)) to restore all methods to their original implementations. This will restore the original [object descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty), so you won't be able to change method's implementation:

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

- **Type:** `(name: string, value: string) => Vitest`
- **Version:** Since Vitest 0.26.0

Changes the value of environmental variable on `process.env` and `import.meta.env`. You can restore its value by calling `vi.unstubAllEnvs`.

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
You can also change the value by simply assigning it, but you won't be able to use `vi.unstubAllEnvs` to restore previous value:

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

- **类型:** `() => Vitest`

<<<<<<< HEAD
  要启用模拟计时器，你需要调用此方法。它将包装所有对计时器的进一步调用（例如 `setTimeout`、`setInterval`、`clearTimeout`、`clearInterval`、`nextTick`、`setImmediate`、`clearImmediate` 和 `Date`），直到 [`vi. useRealTimers()`](#vi-userealtimers) 被调用。

  在使用`--pool=forks`在`node:child_process`中运行Vitest时，不支持对`nextTick`进行模拟。这是因为NodeJS在`node:child_process`中内部使用`process.nextTick`，当对其进行模拟时会导致程序挂起。然而，如果你使用`--pool=threads`来运行Vitest，则可以支持对`nextTick`进行模拟。

  该实现在内部基于 [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers)。

::: tip
由于版本 `0.35.0` `vi.useFakeTimers()` 不再自动模拟 `process.nextTik`。
它仍然可以通过在 `toFake` 参数中指定选项来模拟：`vi.useFakeTimers({ toFake: ['nextTick'] })`。
:::
=======
Will call next available timer. Useful to make assertions between each timer call. You can chain call it to manage timers by yourself.

```ts
let i = 0
setInterval(() => console.log(++i), 50)

vi.advanceTimersToNextTimer() // log: 1
  .advanceTimersToNextTimer() // log: 2
  .advanceTimersToNextTimer() // log: 3
```

### vi.advanceTimersToNextTimerAsync
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

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

- **类型:** `() => boolean`
- **版本:** 从 Vitest 0.34.5 开始支持

<<<<<<< HEAD
  如果启用了虚拟计时器，则返回 `true`。
=======
Returns `true` if fake timers are enabled.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

### vi.useRealTimers

- **类型:** `() => Vitest`

<<<<<<< HEAD
当计时器用完时，你可以调用此方法将模拟计时器返回到其原始实现。之前运行的所有计时器都不会恢复。
=======
When timers are run out, you may call this method to return mocked timers to its original implementations. All timers that were scheduled before will be discarded.
>>>>>>> 449e91a10caf45fec9786d40c3eaa7aa488ed69e

## Miscellaneous

A set of useful helper functions that Vitest provides.

### vi.waitFor

- **类型:** `<T>(callback: WaitForCallback<T>, options?: number | WaitForOptions) => Promise<T>`
- **版本**: Since Vitest 0.34.5

等待回调成功执行。如果回调抛出错误或返回一个被拒绝的 Promise，它将继续等待，直到成功或超时。

当您需要等待某些异步操作完成时，这非常有用，例如，当您启动服务器并需要等待它启动时。

```ts
import { test, vi } from 'vitest'

test('Server started successfully', async () => {
  let server = false

  setTimeout(() => {
    server = true
  }, 100)

  function checkServerStart() {
    if (!server)
      throw new Error('Server not started')

    console.log('Server started')
  }

  const res = await vi.waitFor(checkServerStart, {
    timeout: 500, // default is 1000
    interval: 20, // default is 50
  })
  expect(server).toBe(true)
})
```

它也适用于异步回调。

```ts
import { test, vi } from 'vitest'

test('Server started successfully', async () => {
  async function startServer() {
    return new Promise((resolve) => {
      setTimeout(() => {
        server = true
        resolve('Server started')
      }, 100)
    })
  }

  const server = await vi.waitFor(startServer, {
    timeout: 500, // default is 1000
    interval: 20, // default is 50
  })
  expect(server).toBe('Server started')
})
```

如果使用了 `vi.useFakeTimers`，`vi.waitFor` 会在每次检查回调中自动调用 `vi.advanceTimersByTime(interval)`。

### vi.waitUntil

- **类型:** `<T>(callback: WaitUntilCallback<T>, options?: number | WaitUntilOptions) => Promise<T>`
- **Version**: Since Vitest 0.34.5

这与 `vi.waitFor` 类似，但如果回调函数抛出任何错误，执行将立即中断并接收到错误消息。如果回调函数返回假值，下一个检查将继续进行，直到返回真值为止。当您需要在进行下一步之前等待某个元素存在时，这非常有用。

请看下面的示例。我们可以使用 `vi.waitUntil` 来等待页面上的元素出现，然后我们可以对该元素进行操作。

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
    hooks: 'stack'
    // supports only "sequence.hooks"
  }
})
```

### vi.resetConfig

- **Type**: `RuntimeConfig`

If [`vi.setConfig`](#vi-setconfig) was called before, this will reset config to the original state.
