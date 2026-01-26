---
outline: deep
---

# Vi

Vitest 通过 `vi` 工具函数提供实用功能。可以全局访问它（当启用 [globals 配置](/config/#globals) 时），也可以直接从 `vitest` 中导入：

```js
import { vi } from 'vitest'
```

## 模拟模块 {#mock-modules}

本节介绍在 [模拟模块](/guide/mocking#modules) 时可以使用的 API。请注意，Vitest 不支持模拟使用 `require()` 导入的模块。

### vi.mock

```ts
interface MockOptions {
  spy?: boolean
}

interface MockFactory<T> {
  (importOriginal: () => T): unknown
}

function mock(path: string, factory?: MockOptions | MockFactory<unknown>): void
function mock<T>(
  module: Promise<T>,
  factory?: MockOptions | MockFactory<T>
): void
```

用另一个模块替换提供的 `path` 中的所有导入模块。我们可以在路径内使用配置的 Vite 别名。对 `vi.mock` 的调用是悬挂式的，因此在何处调用并不重要。它总是在所有导入之前执行。如果需要在其作用域之外引用某些变量，可以在 [`vi.hoisted`](/api/vi#vi-hoisted)中定义它们，并在 `vi.mock` 中引用它们。

建议仅在测试文件中使用 `vi.mock` 或 `vi.hoisted`。若禁用 Vite 的 [module runner](/config/experimental#experimental-vitemodulerunner)，这些模拟声明将不会被提升。此设计作为性能优化手段，可避免预加载不必要的文件。

::: warning
`vi.mock` 仅对使用 `import` 关键字导入的模块有效。它对 `require` 无效。

为了提升 `vi.mock` ，Vitest 会静态分析文件。它会指出不能使用未直接从 `vitest` 软件包导入的 `vi` （例如，从某个实用程序文件导入）。使用 `vi.mock` 与从 `vitest` 导入的 `vi` 一起使用，或者启用 [`globals`](/config/#globals) 配置选项。

Vitest 不会模拟 [setup file](/config/setupfiles) 中导入的模块，因为这些模块在运行测试文件时已被缓存。我们可以在 [`vi.hoisted`](#vi-hoisted) 中调用 [`vi.resetModules()`](#vi-resetmodules) ，在运行测试文件前清除所有模块缓存。
:::

如果定义了 `factory` 函数，所有导入都将返回其结果。Vitest 只调用一次 factory，并缓存所有后续导入的结果，直到 [`vi.unmock`](#vi-unmock) 或 [`vi.doUnmock`](#vi-dounmock) 被调用。

我们还可以提供一个具有 `spy` 属性的对象，而不是工厂函数。如果 `spy` 为 `true`，则 Vitest 将照常自动模拟模块，但不会覆盖导出的实现。如果我们只想断言导出的方法已被另一种方法正确调用，这将非常有用。

```ts
import { calculator } from './src/calculator.ts'

vi.mock('./src/calculator.ts', { spy: true })

// 执行原始实现逻辑
// 但支持后续的断言行为
const result = calculator(1, 2)

expect(result).toBe(3)
expect(calculator).toHaveBeenCalledWith(1, 2)
expect(calculator).toHaveReturnedWith(3)
```

Vitest 还在 `vi.mock` 和 `vi.doMock` 方法中支持 module promise 而非字符串，以获得更好的集成开发环境支持。当文件被移动时，路径会被更新，`importOriginal` 也会自动继承类型。使用此签名还将强制工厂返回类型与原始模块兼容（但每次导出都是可选的）。

```ts
vi.mock(import('./path/to/module.js'), async (importOriginal) => {
  const mod = await importOriginal() // 自动推断类型
  return {
    ...mod,
    // 替换部分导出内容
    total: vi.fn(),
  }
})
```

在此钩子下，Vitest 仍然对字符串而不是模块对象进行操作。

如果你使用的 TypeScript 在 `tsconfig.json` 中配置了 `paths` 别名，编译器将无法正确解析导入类型。
为了使其正常工作，请确保将所有别名导入替换为相应的相对路径。
例如，使用 `import('./path/to/module.js')`，而不是 `import('@/module')`。

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
    // ...
  }
})
```

:::
如果要模拟的文件旁边有一个 `__mocks__` 文件夹，且没有提供工厂，Vitest 将尝试在 `__mocks__` 子文件夹中找到一个同名文件，并将其作为实际模块使用。如果模拟的是依赖关系，Vitest 会尝试在项目的 [root](/config/#root)（默认为 `process.cwd()` ）中找到 `__mocks__` 文件夹。我们可以通过 [`deps.moduleDirectories`](/config/#deps-moduledirectories) 配置选项告诉 Vitest 依赖项的位置。

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

如果在没有提供工厂或选项的测试文件中调用 `vi.mock` ，它会在 `__mocks__` 文件夹中找到一个文件作为模块使用：

```ts [increment.test.js]
// axios 是 `__mocks__/axios.js` 默认导出项
import axios from 'axios'

import { vi } from 'vitest'

// increment 是 `src/__mocks__/increment.js` 具名导出
import { increment } from '../increment.js'

vi.mock('axios')
vi.mock('../increment.js')

axios.get(`/apples/${increment(1)}`)
```

::: warning

请注意，如果不调用 `vi.mock` ，模块**不会**被自动模拟。要复制 Jest 的自动锁定行为，可以在 [`setupFiles`](/config/setupfiles) 中为每个所需的模块调用 `vi.mock` 。
:::

如果没有提供 `__mocks__` 文件夹或未提供工厂函数，Vitest 将导入原始模块并自动模拟其所有导出。有关应用的规则，请参阅[算法](/guide/mocking/modules#automocking-algorithm)。

### vi.doMock

```ts
function doMock(
  path: string,
  factory?: MockOptions | MockFactory<unknown>
): Disposable
function doMock<T>(
  module: Promise<T>,
  factory?: MockOptions | MockFactory<T>
): Disposable
```

与 [`vi.mock`](#vi-mock) 相同，但它不会被移动到文件顶部，因此我们可以引用全局文件作用域中的变量。模块的下一个 [动态导入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 将被模拟。

::: warning
这将不会模拟在调用此调用之前导入的模块。不要忘记，ESM 中的所有静态导入都是 [hoaded](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#hoisting)，因此在静态导入前调用此调用不会强制在导入前调用：

```ts
// 这将在 import 语句之后被调用

import { increment } from './increment.js'
vi.doMock('./increment.js')
```

:::

```ts [increment.js]
export function increment(number) {
  return number + 1
}
```

```ts [increment.test.js]
import { beforeEach, test } from 'vitest'
import { increment } from './increment.js'

// 模块尚未模拟，是因为 vi.doMock没有调用
increment(1) === 2

let mockedIncrement = 100

beforeEach(() => {
  // 你可以在工厂函数内部访问变量
  vi.doMock('./increment.js', () => ({ increment: () => ++mockedIncrement }))
})

test('importing the next module imports mocked one', async () => {
  // 原始模块并未模拟，是因为 vi.doMock 是在导入语句之后执行的
  expect(increment(1)).toBe(2)
  const { increment: mockedIncrement } = await import('./increment.js')
  // 新的动态导入，返回模拟模块
  expect(mockedIncrement(1)).toBe(101)
  expect(mockedIncrement(1)).toBe(102)
  expect(mockedIncrement(1)).toBe(103)
})
```

::: tip
In environments that support [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management), you can use `using` on the value returned from `vi.doMock()` to automatically call [`vi.doUnmock()`](#vi-dounmock) on the mocked module when the containing block is exited. This is especially useful when mocking a dynamically imported module for a single test case.

```ts
it('uses a mocked version of my-module', () => {
  using _mockDisposable = vi.doMock('my-module')

  const myModule = await import('my-module') // mocked

  // my-module is restored here
})

it('uses the normal version of my-module again', () => {
  const myModule = await import('my-module') // not mocked
})
```
:::

### vi.mocked

```ts
function mocked<T>(
  object: T,
  deep?: boolean
): MaybeMockedDeep<T>
function mocked<T>(
  object: T,
  options?: { partial?: boolean; deep?: boolean }
): MaybePartiallyMockedDeep<T>
```

TypeScript 的类型助手。只返回传入的对象。

当 `partial` 为 `true` 时，它将期望一个 `Partial<T>` 作为返回值。默认情况下，这只会让 TypeScript 认为第一层的值是模拟的。我们可以将 `{ deep: true }` 作为第二个参数传递给 TypeScript，告诉它整个对象都是模拟的（如果实际上是的话）。还可以传递 `{ partial: true, deep: true }` 来使嵌套对象也以递归方式进行部分模拟。

```ts [example.ts]
export function add(x: number, y: number): number {
  return x + y
}

export function fetchSomething(): Promise<Response> {
  return fetch('https://vitest.dev/')
}

export function getUser(): { name: string; address: { city: string; zip: string } } {
  return { name: 'John', address: { city: 'New York', zip: '10001' } }
}
```

```ts [example.test.ts]
import * as example from './example'

vi.mock('./example')

test('1 + 1 equals 10', async () => {
  vi.mocked(example.add).mockReturnValue(10)
  expect(example.add(1, 1)).toBe(10)
})

test('mock return value with only partially correct typing', async () => {
  vi.mocked(example.fetchSomething).mockResolvedValue(new Response('hello'))
  vi.mocked(example.fetchSomething, { partial: true }).mockResolvedValue({
    ok: false,
  })
  // vi.mocked(example.someFn).mockResolvedValue({ ok: false }) // 这是一个错误类型
})

test('mock return value with deep partial typing', async () => {
  vi.mocked(example.getUser, { partial: true, deep: true }).mockReturnValue({
    address: { city: 'Los Angeles' },
  })
  expect(example.getUser().address.city).toBe('Los Angeles')
})
```

### vi.importActual

```ts
function importActual<T>(path: string): Promise<T>
```

导入模块，绕过模块是否应被模拟的所有检查。如果我们想部分模拟模块，这一点很有用。

```ts
vi.mock('./example.js', async () => {
  const originalModule = await vi.importActual('./example.js')

  return { ...originalModule, get: vi.fn() }
})
```

### vi.importMock

```ts
function importMock<T>(path: string): Promise<MaybeMockedDeep<T>>
```

导入模块并模拟其所有属性（包括嵌套属性）。遵循与 [`vi.mock`](#vi-mock) 相同的规则。有关应用的规则，请参阅[算法](/guide/mocking/modules#automocking-algorithm)。

### vi.unmock

```ts
function unmock(path: string | Promise<Module>): void
```

从模拟注册表中删除模块。所有导入调用都将返回原始模块，即使该模块之前已被模拟。该调用会被移动到文件顶端，因此只会解除在 `setupFiles` 中定义的模块。

### vi.doUnmock

```ts
function doUnmock(path: string | Promise<Module>): void
```

与 [`vi.unmock`](#vi-unmock) 相同，但不会移动到文件顶端。下一次导入模块时，将导入原始模块而非 mock。这不会解除先前导入的模块。

```ts [increment.js]
export function increment(number) {
  return number + 1
}
```

```ts [increment.test.js]
import { increment } from './increment.js'

// increment 已被模拟, 因为 vi.mock 已导入声明提升
increment(1) === 100

// 此处存在函数提升，工厂函数会在第 1 行 import 之前被调用
vi.mock('./increment.js', () => ({ increment: () => 100 }))

// 所有调用均被模拟，并且 `increment` 始终返回100
increment(1) === 100
increment(30) === 100

// 此处不存在函数提升，因为其它导入操作返回未模拟的模块
vi.doUnmock('./increment.js')

// 此处仍会返回100，因 `vi.doUnmock` 不会重新评估模块
increment(1) === 100
increment(30) === 100

// 下一次导入时解除模拟，此时 `increment` 恢复为原始函数（返回 count + 1）
const { increment: unmockedIncrement } = await import('./increment.js')

unmockedIncrement(1) === 2
unmockedIncrement(30) === 31
```

### vi.resetModules

```ts
function resetModules(): Vitest
```

通过清除所有模块的缓存来重置模块注册表。这样就可以在重新导入模块时对模块进行重新评估。顶层导入无法重新评估。这可能有助于隔离测试之间存在本地状态冲突的模块。

```ts
import { vi } from 'vitest'

import { data } from './data.js' // 每次测试前不会重新评估

beforeEach(() => {
  vi.resetModules()
})

test('change state', async () => {
  const mod = await import('./some/path.js') // 将会重新评估
  mod.changeLocalState('new value')
  expect(mod.getLocalState()).toBe('new value')
})

test('module has old state', async () => {
  const mod = await import('./some/path.js') // 将会重新评估
  expect(mod.getLocalState()).toBe('old value')
})
```

::: warning
不会重置 mock 注册表。要清除 mock 注册表，请使用 [`vi.unmock`](#vi-unmock) 或 [`vi.doUnmock`](#vi-dounmock) 。
:::

### vi.dynamicImportSettled

```ts
function dynamicImportSettled(): Promise<void>
```

等待加载所有导入模块。如果有同步调用开始导入一个模块，而如果不这样做就无法等待，那么它就很有用。

```ts
import { expect, test } from 'vitest'

// 无法追踪导入操作，因未返回 Promise
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

## 模拟函数和对象

本节介绍如何使用 [method mock](/api/mock) 替换环境变量和全局变量。

### vi.fn

```ts
function fn(fn?: Procedure | Constructable): Mock
```

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

`vi.fn` 同样支持传入 class 作为参数：

```ts
const Cart = vi.fn(
  class {
    get = () => 0
  }
)

const cart = new Cart()
expect(Cart).toHaveBeenCalled()
```

### vi.mockObject <Version>3.2.0</Version>

```ts
function mockObject<T>(value: T, options?: MockOptions): MaybeMockedDeep<T>
```

它与 `vi.mock()` 模拟模块相同，深层模拟给定对象的属性和方法。详见 [自动模拟](/guide/mocking.html#automocking-algorithm)。

```ts
const original = {
  simple: () => 'value',
  nested: {
    method: () => 'real',
  },
  prop: 'foo',
}

const mocked = vi.mockObject(original)
expect(mocked.simple()).toBe(undefined)
expect(mocked.nested.method()).toBe(undefined)
expect(mocked.prop).toBe('foo')

mocked.simple.mockReturnValue('mocked')
mocked.nested.method.mockReturnValue('mocked nested')

expect(mocked.simple()).toBe('mocked')
expect(mocked.nested.method()).toBe('mocked nested')
```

就像 `vi.mock()` 一样，可以传递 `{ spy: true }` 作为第二个参数，以保持函数实现：

```ts
const spied = vi.mockObject(original, { spy: true })
expect(spied.simple()).toBe('value')
expect(spied.simple).toHaveBeenCalled()
expect(spied.simple.mock.results[0]).toEqual({
  type: 'return',
  value: 'value',
})
```

### vi.isMockFunction

```ts
function isMockFunction(fn: unknown): asserts fn is Mock
```

检查给定参数是否为 mock 函数。如果使用的是 TypeScript ，它还会缩小参数类型的范围。

### vi.clearAllMocks

```ts
function clearAllMocks(): Vitest
```

对所有 spies 调用 [`.mockClear()`](/api/mock#mockclear)。
这将清除模拟的历史记录，但不影响模拟的实现。

### vi.resetAllMocks

```ts
function resetAllMocks(): Vitest
```

对所有 spies 调用 [`.mockReset()`](/api/mock#mockreset)。
这将清除模拟的历史记录，并将每个模拟的实现重置为其原始状态。

### vi.restoreAllMocks

```ts
function restoreAllMocks(): Vitest
```

该方法会一次性恢复所有由 [`vi.spyOn`](#vi-spyon) 创建的 spy 的原始实现。

一旦完成还原，即可重新对其进行监视。

::: warning
该方法同样不会触及 [automocking](/guide/mocking/modules#mocking-a-module) 期间生成的任何 mock。

注意：与 [`mock.mockRestore`](/api/mock#mockrestore) 不同，`vi.restoreAllMocks` 既不会清空调用历史，也不会重置 mock 的实现。
:::

### vi.spyOn

```ts
function spyOn<T, K extends keyof T>(
  object: T,
  key: K,
  accessor?: 'get' | 'set'
): Mock<T[K]>
```

创建与 [`vi.fn()`](#vi-fn) 类似的对象的方法或 getter/setter 的监听(spy) 。它会返回一个 [mock 函数](/api/mock) 。

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

若被监视的方法为类定义，则 mock 实现必须使用 `function` 或 `class` 关键字。

```ts {12-14,16-20}
const cart = {
  Apples: class Apples {
    getApples() {
      return 42
    }
  },
}

const spy = vi
  .spyOn(cart, 'Apples')
  .mockImplementation(() => ({ getApples: () => 0 })) // [!code --]
  // 使用函数关键字
  .mockImplementation(function () {
    this.getApples = () => 0
  })
  // 使用自定义类
  .mockImplementation(
    class MockApples {
      getApples() {
        return 0
      }
    }
  )
```

如果传入箭头函数， mock 被调用时将抛出 [`<anonymous> is not a constructor` 错误](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Not_a_constructor)。

::: tip
若运行环境支持 [显式资源管理](https://github.com/tc39/proposal-explicit-resource-management) ，可将 `const` 替换为 `using`。离开当前块级作用域时，系统会自动对被 mock 的函数调用 `mockRestore`，特别适用于已打 spy 的方法。

```ts
it('calls console.log', () => {
  using spy = vi.spyOn(console, 'log').mockImplementation(() => {})
  debug('message')
  expect(spy).toHaveBeenCalled()
})
// console.log 在此处还原
```

:::

::: tip
在每个测试后，于 [`afterEach`](/api/hooks#aftereach) 中调用 [`vi.restoreAllMocks`](#vi-restoreallmocks) 或开启配置项 [`test.restoreMocks`](/config/#restoreMocks)，即可将所有方法还原为原始实现。此操作会恢复其 [对象描述符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)，除非重新对其进行 spy ，否则无法再次修改方法实现。

```ts
const cart = {
  getApples: () => 42,
}

const spy = vi.spyOn(cart, 'getApples').mockReturnValue(10)

console.log(cart.getApples()) // 10
vi.restoreAllMocks()
console.log(cart.getApples()) // 42
spy.mockReturnValue(10)
console.log(cart.getApples()) // 仍然为 42!
```

:::

::: tip
在 [浏览器模式](/guide/browser/) 下，无法监视导出的方法。相反，你可以通过调用 `vi.mock("./file-path.js", { spy: true })` 来监视每个导出方法。这将模拟每个导出方法，但保留其完整的实现，从而可以断言该方法是否被正确调用。

```ts
import { calculator } from './src/calculator.ts'

vi.mock('./src/calculator.ts', { spy: true })

calculator(1, 2)

expect(calculator).toHaveBeenCalledWith(1, 2)
expect(calculator).toHaveReturned(3)
```

虽然有可能在 `jsdom` 或其他 Node.js 环境中监视导出，但未来可能会发生变化。
:::

### vi.stubEnv {#vi-stubenv}

```ts
function stubEnv<T extends string>(
  name: T,
  value: T extends 'PROD' | 'DEV' | 'SSR' ? boolean : string | undefined
): Vitest
```

更改 `process.env` 和 `import.meta.env` 中环境变量的值。我们可以调用 `vi.unstubAllEnvs` 恢复其值。

```ts
import { vi } from 'vitest'

// `process.env.NODE_ENV` 和 `import.meta.env.NODE_ENV`
// 在调用 "vi.stubEnv" 之前是 "development"

vi.stubEnv('NODE_ENV', 'production')

process.env.NODE_ENV === 'production'
import.meta.env.NODE_ENV === 'production'

vi.stubEnv('NODE_ENV', undefined)

process.env.NODE_ENV === undefined
import.meta.env.NODE_ENV === undefined

// 不会改变其他env
import.meta.env.MODE === 'development'
```

:::tip
我们也可以通过简单赋值来更改值，但无法使用 `vi.unstubAllEnvs` 恢复以前的值：

```ts
import.meta.env.MODE = 'test'
```

:::

### vi.unstubAllEnvs {#vi-unstuballenvs}

```ts
function unstubAllEnvs(): Vitest
```

恢复通过 `vi.stubEnv` 更改的所有 `import.meta.env` 和 `process.env` 值。首次调用时，Vitest 会记住并保存原始值，直到再次调用 `unstubAllEnvs`。

```ts
import { vi } from 'vitest'

// `process.env.NODE_ENV` 和 `import.meta.env.NODE_ENV`
// 在调用 stubEnv 之前是 "development"

vi.stubEnv('NODE_ENV', 'production')

process.env.NODE_ENV === 'production'
import.meta.env.NODE_ENV === 'production'

vi.stubEnv('NODE_ENV', 'staging')

process.env.NODE_ENV === 'staging'
import.meta.env.NODE_ENV === 'staging'

vi.unstubAllEnvs()

// 还原到在第一次 “stubEnv” 调用之前存储的值
process.env.NODE_ENV === 'development'
import.meta.env.NODE_ENV === 'development'
```

### vi.stubGlobal

```ts
function stubGlobal(name: string | number | symbol, value: unknown): Vitest
```

更改全局变量的值。我们可以调用 `vi.unstubAllGlobals` 恢复其原始值。

```ts
import { vi } from 'vitest'

// 在调用 stubGlobal 之前 `innerWidth` 是 "0"

vi.stubGlobal('innerWidth', 100)

innerWidth === 100
globalThis.innerWidth === 100
// 如果你正在使用 jsdom 或 happy-dom
window.innerWidth === 100
```

:::tip
我们也可以通过简单地将其赋值给 `globalThis` 或 `window`（如果你正在使用 `jsdom` 或 `happy-dom` 环境）来更改该值，但无法使用 `vi.unstubAllGlobals` 恢复原始值：

```ts
globalThis.innerWidth = 100
// 如果你正在使用 jsdom 或 happy-dom
window.innerWidth = 100
```

:::

### vi.unstubAllGlobals {#vi-unstuballglobals}

```ts
function unstubAllGlobals(): Vitest
```

恢复 `globalThis` / `global`（和 `window` / `top` / `self` / `parent`，如果我们使用的是 `jsdom` 或 `happy-dom` 环境）上所有被 `vi.stubGlobal` 更改过的全局值。第一次调用时，Vitest 会记住并保存原始值，直到再次调用 `unstubAllGlobals`。

```ts
import { vi } from 'vitest'

const Mock = vi.fn()

// 在调用 "stubGlobal" 之前 IntersectionObserver 是 "undefined"

vi.stubGlobal('IntersectionObserver', Mock)

IntersectionObserver === Mock
global.IntersectionObserver === Mock
globalThis.IntersectionObserver === Mock
// 如果你正在使用 jsdom 或 happy-dom
window.IntersectionObserver === Mock

vi.unstubAllGlobals()

globalThis.IntersectionObserver === undefined
'IntersectionObserver' in globalThis === false
// 抛出 ReferenceError，因为变量未定义
IntersectionObserver === undefined
```

## Fake Timers

本节介绍如何使用 [fake timers](/guide/mocking/timers) 。

### vi.advanceTimersByTime

```ts
function advanceTimersByTime(ms: number): Vitest
```

该方法将调用每个启动的定时器，直到超过指定的毫秒数或队列为空（以先到者为准）。

```ts
let i = 0
setInterval(() => console.log(++i), 50)

vi.advanceTimersByTime(150)

// 输出: 1
// 输出: 2
// 输出: 3
```

### vi.advanceTimersByTimeAsync

```ts
function advanceTimersByTimeAsync(ms: number): Promise<Vitest>
```

该方法将调用每个已启动的定时器，直到超过指定的毫秒数或队列为空（以先到者为准）。这将包括异步设置的计时器。

```ts
let i = 0
setInterval(() => Promise.resolve().then(() => console.log(++i)), 50)

await vi.advanceTimersByTimeAsync(150)

// 输出: 1
// 输出: 2
// 输出: 3
```

### vi.advanceTimersToNextTimer

```ts
function advanceTimersToNextTimer(): Vitest
```

将调用下一个可用的定时器。在每次调用定时器之间进行断言非常有用。我们可以调用它来管理自己的定时器。

```ts
let i = 0
setInterval(() => console.log(++i), 50)

vi.advanceTimersToNextTimer() // 输出: 1
  .advanceTimersToNextTimer() // 输出: 2
  .advanceTimersToNextTimer() // 输出: 3
```

### vi.advanceTimersToNextTimerAsync

```ts
function advanceTimersToNextTimerAsync(): Promise<Vitest>
```

如果定时器是异步设置的，则会调用下一个可用的定时器并等待解决。在每次调用定时器之间进行断言非常有用。

```ts
let i = 0
setInterval(() => Promise.resolve().then(() => console.log(++i)), 50)

await vi.advanceTimersToNextTimerAsync() // log: 1
expect(console.log).toHaveBeenCalledWith(1)

await vi.advanceTimersToNextTimerAsync() // log: 2
await vi.advanceTimersToNextTimerAsync() // log: 3
```

### vi.advanceTimersToNextFrame

```ts
function advanceTimersToNextFrame(): Vitest
```

与 [`vi.advanceTimersByTime`](/api/vi#vi-advancetimersbytime) 类似，但会将计时器推进当前使用 `requestAnimationFrame` 安排的回调执行所需的毫秒数。

```ts
let frameRendered = false

requestAnimationFrame(() => {
  frameRendered = true
})

vi.advanceTimersToNextFrame()

expect(frameRendered).toBe(true)
```

### vi.getTimerCount

```ts
function getTimerCount(): number
```

获取等待计时器的数量。

### vi.clearAllTimers

```ts
function clearAllTimers(): void
```

立即取消所有已排程的计时器，使其不再执行。

### vi.getMockedSystemTime

```ts
function getMockedSystemTime(): Date | null
```

返回模拟的当前日期。如果没有模拟日期，该方法将返回 `null`。

### vi.getRealSystemTime

```ts
function getRealSystemTime(): number
```

使用 `vi.useFakeTimers` 时，会模拟 `Date.now` 调用。如果需要以毫秒为单位获取实时时间，可以调用此函数。

### vi.runAllTicks

```ts
function runAllTicks(): Vitest
```

调用由 `process.nextTick` 排在队列中的每个微任务。这也将运行所有自己安排的微任务。

### vi.runAllTimers

```ts
function runAllTimers(): Vitest
```

该方法将调用每个已经启动的定时器，直到定时器队列为空。这意味着在 `runAllTimers` 期间调用的每个定时器都会被触发。如果时间间隔为无限，则会在尝试 10000 次后触发（可使用 [`fakeTimers.loopLimit`](/config/#faketimers-looplimit) 进行配置）。

```ts
let i = 0
setTimeout(() => console.log(++i))
const interval = setInterval(() => {
  console.log(++i)
  if (i === 3) {
    clearInterval(interval)
  }
}, 50)

vi.runAllTimers()

// 输出: 1
// 输出: 2
// 输出: 3
```

### vi.runAllTimersAsync

```ts
function runAllTimersAsync(): Promise<Vitest>
```

该方法将异步调用每个已启动的定时器，直到定时器队列为空。这意味着在 `runAllTimersAsync` 期间调用的每个定时器都会被触发，即使是异步定时器。如果我们有一个无限的时间间隔、
会在尝试 10000 次后抛出（可使用 [`fakeTimers.loopLimit`](/config/#faketimers-looplimit) ）。

```ts
setTimeout(async () => {
  console.log(await Promise.resolve('result'))
}, 100)

await vi.runAllTimersAsync()

// 输出: result
```

### vi.runOnlyPendingTimers

```ts
function runOnlyPendingTimers(): Vitest
```

此方法将调用 [`vi.useFakeTimers`](#vii-usefaketimers) 调用后启动的所有计时器。它不会调用在调用期间启动的任何计时器。

```ts
let i = 0
setInterval(() => console.log(++i), 50)

vi.runOnlyPendingTimers()

// 输出: 1
```

### vi.runOnlyPendingTimersAsync

```ts
function runOnlyPendingTimersAsync(): Promise<Vitest>
```

此方法将异步调用 [`vi.useFakeTimers`](#vi-usefaketimers) 调用后启动的每个定时器，即使是异步定时器。它不会触发任何在调用期间启动的定时器。

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

// 输出: 2
// 输出: 3
// 输出: 3
// 输出: 1
```

### vi.setSystemTime

```ts
function setSystemTime(date: string | number | Date): Vitest
```

如果启用了伪计时器，此方法将模拟用户更改系统时钟（将影响与日期相关的 API，如 `hrtime` 、`performance.now` 或 `new Date()` ），但不会触发任何计时器。如果未启用假定时器，该方法将仅模拟 `Date.*` 调用。

适用于需要测试依赖当前日期的场景，例如代码中的 [Luxon](https://github.com/moment/luxon/) 库调用。

接受与 `Date` 相同的字符串和数字参数。

```ts
const date = new Date(1998, 11, 19)

vi.useFakeTimers()
vi.setSystemTime(date)

expect(Date.now()).toBe(date.valueOf())

vi.useRealTimers()
```

### vi.useFakeTimers

```ts
function useFakeTimers(config?: FakeTimerInstallOpts): Vitest
```

要启用模拟定时器，需要调用此方法。在调用 [`vi.useRealTimers()`](#vi-userealtimers) 之前，它将封装所有对定时器的进一步调用（如 `setTimeout` 、`setInterval` 、`clearTimeout` 、`clearInterval` 、`setImmediate` 、`clearImmediate` 和 `Date`）。

在 `node:child_process` 中使用 `--pool=forks` 运行 Vitest 时，不支持模拟 `nextTick` 。NodeJS 在 `node:child_process` 中内部使用了 `process.nextTick` ，当模拟它时会挂起。使用 `--pool=threads` 运行 Vitest 时支持模拟 `nextTick`。

内部实现基于 [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers) 。

::: tip
`vi.useFakeTimers()` 不再自动模拟 `process.nextTick` 。
仍然可以通过在 `toFake` 参数中指定选项来模拟： `vi.useFakeTimers({ toFake: ['nextTick', 'queueMicrotask'] })` 。
:::

### vi.setTimerTickMode <Version>4.1.0</Version> {#vi-settimertickmode}

- **Type:** `(mode: 'manual' | 'nextTimerAsync') => Vitest | (mode: 'interval', interval?: number) => Vitest`

Controls how fake timers are advanced.

- `manual`: The default behavior. Timers will only advance when you call one of `vi.advanceTimers...()` methods.
- `nextTimerAsync`: Timers will be advanced automatically to the next available timer after each macrotask.
- `interval`: Timers are advanced automatically by a specified interval.

When `mode` is `'interval'`, you can also provide an `interval` in milliseconds.

**Example:**

```ts
import { vi } from 'vitest'

vi.useFakeTimers()

// Manual mode (default)
vi.setTimerTickMode({ mode: 'manual' })

let i = 0
setInterval(() => console.log(++i), 50)

vi.advanceTimersByTime(150) // logs 1, 2, 3

// nextTimerAsync mode
vi.setTimerTickMode({ mode: 'nextTimerAsync' })

// Timers will advance automatically after each macrotask
await new Promise(resolve => setTimeout(resolve, 150)) // logs 4, 5, 6

// interval mode (default when 'fakeTimers.shouldAdvanceTime' is `true`)
vi.setTimerTickMode({ mode: 'interval', interval: 50 })

// Timers will advance automatically every 50ms
await new Promise(resolve => setTimeout(resolve, 150)) // logs 7, 8, 9
```

### vi.isFakeTimers {#vi-isfaketimers}

```ts
function isFakeTimers(): boolean
```

如果启用了模拟计时器，则返回 `true` 。

### vi.useRealTimers

```ts
function useRealTimers(): Vitest
```

当定时器用完后，我们可以调用此方法将模拟的计时器返回到其原始实现。之前调度的计时器都将被丢弃。

## 辅助函数{#miscellaneous}

Vitest 提供的一组有用的辅助函数。

### vi.waitFor {#vi-waitfor}

```ts
function waitFor<T>(
  callback: WaitForCallback<T>,
  options?: number | WaitForOptions
): Promise<T>
```

等待回调成功执行。如果回调抛出错误或返回拒绝的承诺，它将继续等待，直到成功或超时。

如果 `options` 设置为一个数字，其效果等同于设置 `{ timeout: options }`。

这在需要等待某些异步操作完成时非常有用，例如，在启动服务器并需要等待其启动时。

```ts
import { expect, test, vi } from 'vitest'
import { createServer } from './server.js'

test('Server started successfully', async () => {
  const server = createServer()

  await vi.waitFor(
    () => {
      if (!server.isReady) {
        throw new Error('Server not started')
      }

      console.log('Server started')
    },
    {
      timeout: 500, // 默认为 1000
      interval: 20, // 默认为 50
    }
  )
  expect(server.isReady).toBe(true)
})
```

它也适用于异步回调。

```ts
// @vitest-environment jsdom

import { expect, test, vi } from 'vitest'
import { getDOMElementAsync, populateDOMAsync } from './dom.js'

test('Element exists in a DOM', async () => {
  // 开始填充 DOM
  populateDOMAsync()

  const element = await vi.waitFor(
    async () => {
      // 尝试获取元素直到其存在
      const element = (await getDOMElementAsync()) as HTMLElement | null
      expect(element).toBeTruthy()
      expect(element.dataset.initialized).toBeTruthy()
      return element
    },
    {
      timeout: 500, // 默认为 1000
      interval: 20, // 默认为 50
    }
  )
  expect(element).toBeInstanceOf(HTMLElement)
})
```

一旦通过 `vi.useFakeTimers` 启用假计时器，`vi.waitFor` 将在每次轮询时自动调用 `vi.advanceTimersByTime(interval)` 推进时间。

### vi.waitUntil {#vi-waituntil}

```ts
function waitUntil<T>(
  callback: WaitUntilCallback<T>,
  options?: number | WaitUntilOptions
): Promise<T>
```

与 `vi.waitFor` 类似，但若回调抛出错误会立即中断并给出报错；若回调返回假值，则持续轮询直至返回真值。适用于“先等某物出现再行动”的场景。

下面的示例，我们可以使用 `vi.waitUntil` 等待元素出现在页面上，然后再对该元素进行操作。

```ts
import { expect, test, vi } from 'vitest'

test('Element render correctly', async () => {
  const element = await vi.waitUntil(() => document.querySelector('.element'), {
    timeout: 500, // 默认为 1000
    interval: 20, // 默认为 50
  })
  expect(element).toBeInstanceOf(HTMLElement)
})
```

如果使用了 `vi.useFakeTimers` , `vi.waitFor` 会在每次检查回调中自动调用 `vi.advanceTimersByTime(interval)` 。

### vi.hoisted {#vi-hoisted}

```ts
function hoisted<T>(factory: () => T): T
```

ES 模块中的所有静态 `import` 语句都被提升到文件顶部，因此在导入之前定义的任何代码都将在导入评估之后执行。

不过，在导入模块之前，调用一些副作用（如模拟日期）可能会很有用。

要绕过这一限制，可以像这样将静态导入重写为动态导入：

```diff
callFunctionWithSideEffect()
- import { value } from './some/module.js'
+ const { value } = await import('./some/module.js')
```

在运行 `vitest` 时，可以使用 `vi.hoisted` 方法自动完成此操作。在内部，Vitest 会将静态导入转换为动态导入，并保留实时绑定。

```diff
- callFunctionWithSideEffect()
import { value } from './some/module.js'
+ vi.hoisted(() => callFunctionWithSideEffect())
```

::: warning 导入不可用
在导入之前运行代码意味着你无法访问导入的变量，因为它们尚未定义：

```ts
import { value } from './some/module.js'

vi.hoisted(() => {
  value
}) // 抛出一个错误 // [!code warning]
```

此代码将产生错误：

```
Cannot access '__vi_import_0__' before initialization
```

如果你需要在 `vi.hoisted` 中访问另一个模块中的变量，请使用动态导入：

```ts
await vi.hoisted(async () => {
  const { value } = await import('./some/module.js')
})
```

然而，不建议在 `vi.hoisted` 中导入任何内容，因为导入已经被提升。如果你需要在测试运行之前执行某些操作，只需在导入的模块本身中执行即可。
:::

此方法返回工厂函数返回的值。如果你需要访问本地定义的变量，可以在你的 `vi.mock` 工厂中使用该值：

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

请注意，即使我们的环境不支持顶级等待，也可以异步调用此方法：

```ts
const json = await vi.hoisted(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  return response.json()
})
```

### vi.setConfig

```ts
function setConfig(config: RuntimeOptions): void
```

更新当前测试文件的配置。此方法只会影响当前测试文件的配置选项：

```ts
vi.setConfig({
  allowOnly: true,
  testTimeout: 10_000,
  hookTimeout: 10_000,
  clearMocks: true,
  restoreMocks: true,
  fakeTimers: {
    now: new Date(2021, 11, 19),
    // 支持完整对象
  },
  maxConcurrency: 10,
  sequence: {
    hooks: 'stack',
    // 仅支持 "sequence.hooks"
  },
})
```

### vi.resetConfig

```ts
function resetConfig(): void
```

如果之前调用过 [`vi.setConfig`](#vi-setconfig) ，则会将配置重置为原始状态。
