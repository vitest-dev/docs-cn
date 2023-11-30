---
title: 模拟对象 | 指南
---

# 模拟对象

在编写测试时，你可能会因为时间问题，需要创建内部或外部服务的 “假” 版本，这通常被称为 **对象模拟** 操作。Vitest 通过 **vi** 提供了一些实用的函数用于解决这个问题。你可以使用 `import { vi } from 'vitest'` 或者 **全局配置** 进行访问它 (当 **启用** [全局配置](/config/#globals) 时)。

::: warning
不要忘记在每次测试运行前后清除或恢复模拟对象，以撤消运行测试时模拟对象状态的更改！有关更多信息，请参阅 [`mockReset`](/api/#mockreset) 文档。
:::

如果你想从头开始，请查看 [API 部分](/api/#vi) 的 vi 部分，或者继续跟着文档深入了解一下这个对象模拟的世界。

## 日期

有些时候，你可能需要控制日期来确保测试时的一致性。Vitest 使用了 [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers) 库来操作计时器以及系统日期。可以在 [此处](/api/vi#vi-setsystemtime) 找到有关特定 API 的更多详细信息。

### 示例

```js
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const businessHours = [9, 17]

function purchase() {
  const currentHour = new Date().getHours()
  const [open, close] = businessHours

  if (currentHour > open && currentHour < close)
    return { message: 'Success' }

  return { message: 'Error' }
}

describe('purchasing flow', () => {
  beforeEach(() => {
    // 告诉 vitest 我们使用模拟时间
    vi.useFakeTimers()
  })

  afterEach(() => {
    // 每次测试运行后恢复日期
    vi.useRealTimers()
  })

  it('allows purchases within business hours', () => {
    // 将时间设置在工作时间之内
    const date = new Date(2000, 1, 1, 13)
    vi.setSystemTime(date)

    // 访问 Date.now() 将生成上面设置的日期
    expect(purchase()).toEqual({ message: 'Success' })
  })

  it('disallows purchases outside of business hours', () => {
    // 将时间设置在工作时间之外
    const date = new Date(2000, 1, 1, 19)
    vi.setSystemTime(date)

    // 访问 Date.now() 将生成上面设置的日期
    expect(purchase()).toEqual({ message: 'Error' })
  })
})
```

## 函数

函数的模拟可以分为两个不同的类别：_对象监听(spying) & 对象模拟_。

有时你可能只需要验证是否调用了特定函数（以及可能传递了哪些参数）。在这种情况下，我们就需要使用一个对象监听，可以直接使用 `vi.spyOn()` ([在此处阅读更多信息](/api/vi#vi-spyon))。

然而，对象监听只能帮助你 **监听** 函数，他们无法改变这些函数的实现。如果我们需要创建一个函数的假（或模拟）版本，可以使用它 `vi.fn()` ([在此处阅读更多信息](/api/vi#vi-fn))。

我们使用 [Tinyspy](https://github.com/tinylibs/tinyspy) 作为模拟函数的基础，同时也有一套自己的封装来使其与 `Jest` 兼容。`vi.fn()` 和 `vi.spyOn()` 共享相同的方法，但是只有 `vi.fn()` 的返回结果是可调用的。

### 示例

```js
import { afterEach, describe, expect, it, vi } from 'vitest'

function getLatest(index = messages.items.length - 1) {
  return messages.items[index]
}

const messages = {
  items: [
    { message: 'Simple test message', from: 'Testman' },
    // ...
  ],
  getLatest, // 也可以是一个 `getter 或 setter 如果支持`
}

describe('reading messages', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should get the latest message with a spy', () => {
    const spy = vi.spyOn(messages, 'getLatest')
    expect(spy.getMockName()).toEqual('getLatest')

    expect(messages.getLatest()).toEqual(
      messages.items[messages.items.length - 1]
    )

    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockImplementationOnce(() => 'access-restricted')
    expect(messages.getLatest()).toEqual('access-restricted')

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('should get with a mock', () => {
    const mock = vi.fn().mockImplementation(getLatest)

    expect(mock()).toEqual(messages.items[messages.items.length - 1])
    expect(mock).toHaveBeenCalledTimes(1)

    mock.mockImplementationOnce(() => 'access-restricted')
    expect(mock()).toEqual('access-restricted')

    expect(mock).toHaveBeenCalledTimes(2)

    expect(mock()).toEqual(messages.items[messages.items.length - 1])
    expect(mock).toHaveBeenCalledTimes(3)
  })
})
```

### 了解更多

- [Jest's Mock Functions](https://jestjs.io/docs/mock-function-api)

## 全局(Globals)

你可以通过使用 [`vi.stubGlobal`](/api/vi#stubglobal) 来模拟 `jsdom` 或 `node` 中不存在的全局变量。它将把全局变量的值放入 `globalThis` 对象。

```ts
import { vi } from 'vitest'

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// 现在你可以通过 `IntersectionObserver` 或 `window.IntersectionObserver` 访问
```

## 模块

模拟模块监听在其他代码中调用的第三方库，允许你测试参数、输出甚至重新声明其实现。

### 自动模拟算法(Automocking algorithm)

参见 [`vi.mock()` API 部分](/api/vi#vi-mock) 以获得更深入详细 API 描述。

如果你的代码导入了模拟模块，并且没有任何与此模块相关联的 `__mocks__` 文件或 `factory`，Vitest 将通过调用模块并模拟每个导出来的模拟模块本身。

以下原则适用

- 所有的数组将被清空
- 所有的基础类型和集合将保持不变
- 所有的对象都将被深度克隆
- 类的所有实例及其原型都将被深度克隆

### Mocking Pitfalls

请注意，对在同一文件的其他方法中调用的方法的模拟调用是不可能的。例如，在此代码中：

```ts
export function foo() {
  return 'foo'
}

export function foobar() {
  return `${foo()}bar`
}
```

不可能从外部模拟 `foo` 方法，因为它是直接引用的。因此，此代码对 `foobar` 内部的 `foo` 调用没有影响（但会影响其他模块中的 `foo` 调用）：

```ts
import { vi } from 'vitest'
import * as mod from './foobar.js'

// this will only affect "foo" outside of the original module
vi.spyOn(mod, 'foo')
vi.mock('./foobar.js', async (importOriginal) => {
  return {
    ...(await importOriginal()),
    // this will only affect "foo" outside of the original module
    foo: () => 'mocked',
  }
})
```

你可以通过直接向 `foobar` 方法提供实现来确认这种行为：

```ts
// foobar.test.js
import * as mod from './foobar.js'

vi.spyOn(mod, 'foo')

// exported foo references mocked method
mod.foobar(mod.foo)
```

```ts
// foobar.js
export function foo() {
  return 'foo'
}

export function foobar(injectedFoo) {
  return injectedFoo !== foo // false
}
```

这就是预期行为。当以这种方式进行嘲讽时，这通常是坏代码的标志。考虑将代码重构为多个文件，或者使用[依赖项注入](https://en.wikipedia.org/wiki/dependency_injection)等技术来改进应用程序体系结构。

### 示例

```js
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Client } from 'pg'
import { failure, success } from './handlers.js'

// handlers
export function success(data) {}
export function failure(data) {}

// get todos
export async function getTodos(event, context) {
  const client = new Client({
    // ...clientOptions
  })

  await client.connect()

  try {
    const result = await client.query('SELECT * FROM todos;')

    client.end()

    return success({
      message: `${result.rowCount} item(s) returned`,
      data: result.rows,
      status: true,
    })
  }
  catch (e) {
    console.error(e.stack)

    client.end()

    return failure({ message: e, status: false })
  }
}

vi.mock('pg', () => {
  const Client = vi.fn()
  Client.prototype.connect = vi.fn()
  Client.prototype.query = vi.fn()
  Client.prototype.end = vi.fn()

  return { Client }
})

vi.mock('./handlers.js', () => {
  return {
    success: vi.fn(),
    failure: vi.fn(),
  }
})

describe('get a list of todo items', () => {
  let client

  beforeEach(() => {
    client = new Client()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return items successfully', async () => {
    client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })

    await getTodos()

    expect(client.connect).toBeCalledTimes(1)
    expect(client.query).toBeCalledWith('SELECT * FROM todos;')
    expect(client.end).toBeCalledTimes(1)

    expect(success).toBeCalledWith({
      message: '0 item(s) returned',
      data: [],
      status: true,
    })
  })

  it('should throw an error', async () => {
    const mError = new Error('Unable to retrieve rows')
    client.query.mockRejectedValueOnce(mError)

    await getTodos()

    expect(client.connect).toBeCalledTimes(1)
    expect(client.query).toBeCalledWith('SELECT * FROM todos;')
    expect(client.end).toBeCalledTimes(1)
    expect(failure).toBeCalledWith({ message: mError, status: false })
  })
})
```

## 请求

因为 Vitest 运行在 Node 环境中，所以模拟网络请求是一件非常棘手的事情；由于没有办法使用 Web API，因此我们需要一些可以为我们模拟网络行为的包。推荐使用 [Mock Service Worker](https://mswjs.io/) 来进行这个操作。它可以模拟 `REST` 和 `GraphQL` 网络请求，并且与框架无关。

Mock Service Worker (MSW) 通过拦截测试发出的请求进行工作，允许你在不更改任何应用程序代码的情况下使用它。在浏览器中，它使用 [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)。在 Node 中，对于 Vitest，它使用 [node-request-interceptor](https://mswjs.io/docs/api/setup-server#operation)。了解有关 MSW 的更多信息，可以去阅读他们的 [introduction](https://mswjs.io/docs/)。

### 配置

如下，你可以在你的 [配置文件](/config/#setupfiles) 中使用。

```js
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { HttpResponse, graphql, http } from 'msw'

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  // ...
]

export const restHandlers = [
  http.get('https://rest-endpoint.example/path/to/posts', () => {
    return HttpResponse.json(posts)
  }),
]

const graphqlHandlers = [
  graphql.query('https://graphql-endpoint.example/api/v1/posts', () => {
    return HttpResponse.json({
      data: { posts },
    })
  }),
]

const server = setupServer(...restHandlers, ...graphqlHandlers)

// 在所有测试之前启动服务器
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// 所有测试后关闭服务器
afterAll(() => server.close())

// 每次测试后重置处理程序 `对测试隔离很重要`
afterEach(() => server.resetHandlers())
```

> 使用 `onUnhandleRequest: 'error'` 配置服务器可以确保每当有没有相应请求处理程序的请求时都会引发错误。

### 示例

我们有一个使用 MSW 的完整工作示例：[React Testing with MSW](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib-msw)。

### 了解更多

MSW 能做的还有很多。你可以访问 cookie 和查询参数、定义模拟错误响应等等！要查看您可以使用 MSW 做什么，请阅读 [their documentation](https://mswjs.io/docs/recipes).

## 计时器

每当测试代码涉及到 `超时` 或者间隔时，并不是让我们的测试程序进行等待或者超时。我们也可以通过模拟对 `setTimeout` 和 `setInterval` 的调用来使用 "fake" 计时器来加速测试。

有关更深入的详细 API 描述，参阅 [`vi.usefaketimers` api 部分](/api/vi#vi-usefaketimers)。

### 示例

```js
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function executeAfterTwoHours(func) {
  setTimeout(func, 1000 * 60 * 60 * 2) // 2 hours
}

function executeEveryMinute(func) {
  setInterval(func, 1000 * 60) // 1 minute
}

const mock = vi.fn(() => console.log('executed'))

describe('delayed execution', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should execute the function', () => {
    executeAfterTwoHours(mock)
    vi.runAllTimers()
    expect(mock).toHaveBeenCalledTimes(1)
  })
  it('should not execute the function', () => {
    executeAfterTwoHours(mock)
    // advancing by 2ms won't trigger the func
    vi.advanceTimersByTime(2)
    expect(mock).not.toHaveBeenCalled()
  })
  it('should execute every minute', () => {
    executeEveryMinute(mock)
    vi.advanceTimersToNextTimer()
    expect(mock).toHaveBeenCalledTimes(1)
    vi.advanceTimersToNextTimer()
    expect(mock).toHaveBeenCalledTimes(2)
  })
})
```

## 备忘单

::: info 提示
下列示例中的 `vi` 是直接从 `vitest` 导入的。如果在你的 [config](/config/) 中将 `globals` 设置为 `true`，则可以全局使用它。
:::

我想…

- 监听一个 `method`

```ts
const instance = new SomeClass()
vi.spyOn(instance, 'method')
```

- 模拟导出变量

```js
// some-path.js
export const getter = 'variable'
```

```ts
// some-path.test.ts
import * as exports from './some-path.js'

vi.spyOn(exports, 'getter', 'get').mockReturnValue('mocked')
```

- 监听模块导出 setter/getter

```ts
import * as exports from 'some-path'
vi.spyOn(exports, 'getter', 'get')
vi.spyOn(exports, 'setter', 'set')
```

- 模拟模块导出 function
  `vi.mock` 的示例：

```ts
// ./some-path.js
export function method() {}
```

```ts
import { method } from './some-path.js'
vi.mock('./some-path.js', () => ({
  method: vi.fn(),
}))
```

::: warning
不要忘记将 `vi.mock` 调用提升到文件顶部。 **不要**将 `vi.mock` 调用放在 `beforeEach` 中，只有其中一个会实际模拟模块。
:::

`vi.spyOn` 的示例：

```ts
import * as exports from './some-path.js'
vi.spyOn(exports, 'method').mockImplementation(() => {})
```

- 模拟模块导出 class implementation

`vi.mock` and prototype 的示例:

```ts
// some-path.ts
export class SomeClass {}
```

```ts
import { SomeClass } from './some-path.js'

vi.mock('./some-path.js', () => {
  const SomeClass = vi.fn()
  SomeClass.prototype.someMethod = vi.fn()
  return { SomeClass }
})
// SomeClass.mock.instances will have SomeClass
```

`vi.mock` and return value 的示例:

```ts
import { SomeClass } from './some-path.js'

vi.mock('./some-path.js', () => {
  const SomeClass = vi.fn(() => ({
    someMethod: vi.fn(),
  }))
  return { SomeClass }
})
// SomeClass.mock.returns will have returned object
```

`vi.spyOn` 的示例:

```ts
import * as exports from './some-path.js'

vi.spyOn(exports, 'SomeClass').mockImplementation(() => {
  // whatever suites you from first two examples
})
```

- 监听一个函数是否返回了一个对象

使用 cache 的示例:

```ts
// some-path.ts
export function useObject() {
  return { method: () => true }
}
```

```ts
// useObject.js
import { useObject } from './some-path.js'

const obj = useObject()
obj.method()
```

```ts
// useObject.test.js
import { useObject } from './some-path.js'

vi.mock('./some-path.js', () => {
  let _cache
  const useObject = () => {
    if (!_cache) {
      _cache = {
        method: vi.fn(),
      }
    }
    // now every time that useObject() is called it will
    // return the same object reference
    return _cache
  }
  return { useObject }
})

const obj = useObject()
// obj.method was called inside some-path
expect(obj.method).toHaveBeenCalled()
```

- 模拟部分 module

```ts
import { mocked, original } from './some-path.js'

vi.mock('./some-path.js', async () => {
  const mod = await vi.importActual<typeof import('./some-path.js')>(
    './some-path.js'
  )
  return {
    ...mod,
    mocked: vi.fn(),
  }
})
original() // has original behaviour
mocked() // is a spy function
```

- 模拟当前日期

要模拟 `Date` 的时间，你可以使用 `vi.setSystemTime` 辅助函数。 该值将**不会**在不同的测试之间自动重置。

请注意，使用 `vi.useFakeTimers` 也会更改 `Date` 的时间。

```ts
const mockDate = new Date(2022, 0, 1)
vi.setSystemTime(mockDate)
const now = new Date()
expect(now.valueOf()).toBe(mockDate.valueOf())
// reset mocked time
vi.useRealTimers()
```

- 模拟全局变量

你可以通过为 `globalThis` 赋值或使用 [`vi.stubGlobal`](/api/vi#vi-stubglobal) 助手来设置全局变量。 使用 `vi.stubGlobal` 时，**不会**在不同的测试之间自动重置，除非你启用 [`unstubGlobals`](/config/#unstubglobals) 配置选项或调用 [`vi.unstubAllGlobals`](/api/vi#vi-unstuballglobals)。

```ts
vi.stubGlobal('__VERSION__', '1.0.0')
expect(__VERSION__).toBe('1.0.0')
```

- 模拟 `import.meta.env`

要更改环境变量，你只需为其分配一个新值即可。 该值将**不会**在不同的测试之间自动重置。

```ts
import { beforeEach, expect, it } from 'vitest'

// you can reset it in beforeEach hook manually
const originalViteEnv = import.meta.env.VITE_ENV

beforeEach(() => {
  import.meta.env.VITE_ENV = originalViteEnv
})

it('changes value', () => {
  import.meta.env.VITE_ENV = 'staging'
  expect(import.meta.env.VITE_ENV).toBe('staging')
})
```

如果你想自动重置值，可以使用启用了 [`unstubEnvs`](/config/#unstubEnvs) 配置选项的 `vi.stubEnv` 助手（或调用 [`vi.unstubAllEnvs`](/api/vi#vi-unstuballenvs) 在 `beforeEach` 钩子中手动执行）：

```ts
import { expect, it, vi } from 'vitest'

// before running tests "VITE_ENV" is "test"
import.meta.env.VITE_ENV === 'test'

it('changes value', () => {
  vi.stubEnv('VITE_ENV', 'staging')
  expect(import.meta.env.VITE_ENV).toBe('staging')
})

it('the value is restored before running an other test', () => {
  expect(import.meta.env.VITE_ENV).toBe('test')
})
```

```ts
// vitest.config.ts
export default {
  test: {
    unstubAllEnvs: true,
  },
}
```
