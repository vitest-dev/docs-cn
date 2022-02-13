# 模拟

在编写测试时，需要创建内部或外部服务的“假”版本只是时间问题,这通常被称为**模拟**操作。Vitest 提供了这个功能，可以使用 `vi` 来帮助我们使用这个功能。使用 `import { vi } from 'vitest'` 或者**全局配置**进行访问 (当**启用**[全局配置](/config/#global)时 )。

::: warning 警告
永远记得在每次测试运行之前或之后清除或恢复模拟，以撤消运行之间的模拟状态更改！有关更多信息，请参阅 [`mockReset`](/api/#mockreset) 文档。
:::

如果你想先深入了解, 可以先阅读 [API](/api/#vi) 的 vi 部分，或者可以跟着文档继续深入了解一下这个模拟的世界。

## 日期

有些时候，我们可能需要控制日期来确保测试时的一致性。 Vitest 使用了 [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers) 来操作计时器以及系统日期。可以在[这里](/api/#vi-setsystemtime)找到有关特定 API 的更多详细信息。

### 实例

```js
import { afterEach, describe, expect, it, vi } from 'vitest'

const businessHours = [9, 17]

const purchase = () => {
  const currentHour = new Date().getHours()
  const [open, close] = businessHours

  if (currentHour > open && currentHour < close) {
    return { message: 'Success' }
  }

  return { message: 'Error' }
};

describe('purchasing flow', () => {
  beforeEach(() => {
    // 告诉 vitest 我们使用模拟时间
    vi.useFakeTimers()
  });

  afterEach(() => {
    // 每次测试运行后恢复日期
    vi.useRealTimers()
  });

  it('allows purchases within business hours', () => {
    // 在营业时间内设定时间
    const date = new Date(2000, 1, 1, 13)
    vi.setSystemTime(date)

    // 访问 Date.now() 将导致上面设置的日期
    expect(purchase()).toEqual({ message: 'Success' })
  })

  it('disallows purchases outside of business hours', () => {
    // 设置营业时间以外的时间
    const date = new Date(2000, 1, 1, 19)
    vi.setSystemTime(date)

    // 访问 Date.now() 将导致上面设置的日期
    expect(purchase()).toEqual({ message: 'Error' })
  })
})
```

## 函数

模拟功能可以分为两个不同的类别：*间谍 和 模拟*.

大部分时间我们只需要验证是否调用了特定函数（以及可能传递了哪些参数）。在这种情况下，我们就需要使用一个间谍，可以直接使用 `vi.spyOn()` 来完成间谍的操作 ([在这里可以阅读更多的内容](/api/#vi-spyon)).

但是间谍只能帮助我们完成**监视功能**，他们没有办法去更改这些功能的实现。在我们确实需要创建一个我们可以使用的函数的假（或模拟）版本的情况下可以使用`vi.fin()` （[在这里可以阅读更多的内容](/api/#vi-fn)）

我们可以使用 [Tinyspy](https://github.com/Aslemammad/tinyspy) 作为模拟函数的基础，但我们也有一套自己的包装器来使其与 `Jest` 兼容。两者 `vi.fn()` 和 `vi.spyOn()` 共享相同的方法，但是只有 的返回结果 `vi.fn()` 是可调用的。

### 实例

```js
import { afterEach, describe, expect, it, vi } from 'vitest'

const getLatest = (index = messages.items.length - 1) => messages.items[index]

const messages = {
  items: [
    { message: 'Simple test message', from: 'Testman' },
    // ...
  ],
  getLatest, // 也可以是“getter 或 setter（如果支持）”

describe('reading messages', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should get the latest message with a spy', () => {
    const spy = vi.spyOn(messages, 'getLatest')
    expect(spy.getMockName()).toEqual('getLatest')

    expect(messages.getLatest()).toEqual(
      messages.items[messages.items.length - 1]
    );

    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockImplementationOnce(() => 'access-restricted')
    expect(messages.getLatest()).toEqual('access-restricted')

    expect(spy).toHaveBeenCalledTimes(2)
  });

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

- [Jest 的模拟函数](https://jestjs.io/zh-Hans/docs/mock-function-api)

## 模块

模拟模块中要使用第三方库，这些库也在其他代码中被调用，也可以帮助您测试参数、输出甚至声明他的实现。

有关这部分更详细的 API 描述，请参阅 [`vi.mock()` 的 API 部分](/api/#vi-fn)。

### 自动模拟算法

如果你的代码导入了模拟模块，但是没有使用 `__mocks__` 文件或 `factory` 模块，Vitest 将通过调用他并模拟导每一个导出的模块本身。

适用于以下这些原则：

* 所有的数组将被清空
* 所有的基础类型和集合将保持不变
* 所有的对象都将被深度克隆
* 类的所有实例及其原型都将被深度克隆

### 实例

```js
import { vi, beforeEach, afterEach, describe, it } from 'vitest';
import { Client } from 'pg';

// handlers
export function success(data) {}
export function failure(data) {}
// get todos
export const getTodos = async (event, context) => {
  const client = new Client({
    // ...clientOptions
  });

  await client.connect()

  try {
    const result = await client.query(`SELECT * FROM todos;`)

    client.end()

    return success({
      message: `${result.rowCount} item(s) returned`,
      data: result.rows,
      status: true,
    })
  } catch (e) {
    console.error(e.stack)

    client.end()

    return failure({ message: e, status: false })
  }
};

vi.mock('pg', () => {
  return {
    Client: vi.fn(() => ({
      connect: vi.fn(),
      query: vi.fn(),
      end: vi.fn(),
    })),
  };
});

vi.mock('./handler.js', () => {
  return {
    success: vi.fn(),
    failure: vi.fn(),
  };
});

describe('get a list of todo items', () => {
  let client;

  beforeEach(() => {
    client = new Client()
  });

  afterEach(() => {
    vi.clearAllMocks()
  });

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

因为 Vitest 运行在 Node 环境中，所以模拟网络请求是一件非常棘手的事情; 由于没有办法使用 WEB API，因此我们需要一些可以为我们模拟网络行为的包。推荐使用 [Mock Service Worker](https://mswjs.io/) 来进行这个操作。它可以同时模拟 `REST` 和 `GraphQL` 网络请求，并且跟所使用的框架没有任何联系。

Mock Service Worker (MSW) 通过拦截测试发出的请求进行工作，允许我们在不更改任何应用程序代码的情况下使用它。在浏览器中，会使用 [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)。在 Node 和 Vitest 中，会使用 [node-request-interceptor](https://mswjs.io/docs/api/setup-server#operation)。要了解有关 MSW 的更多信息，可以去阅读他们的[介绍](https://mswjs.io/docs/)。


### 配置

将以下内容添加到[测试配置文件](/config/#setupfiles)
```js
import { beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { graphql, rest } from 'msw'

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  ...
]

export const restHandlers = [
  rest.get('https://rest-endpoint.example/path/to/posts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(posts))
  }),
]

const graphqlHandlers = [
  graphql.query('https://graphql-endpoint.example/api/v1/posts', (req, res, ctx) => {
    return res(ctx.data(posts))
  }),
]

const server = setupServer(...restHandlers, ...graphqlHandlers)

// 在所有测试之前启动服务器
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// 所有测试后关闭服务器
afterAll(() => server.close())

// 每次测试后重置处理程序“对测试隔离很重要”
afterEach(() => server.resetHandlers())
```

> 配置服务 `onUnhandleRequest: 'error'` 只要产生了没有相应类型的请求处理，就会发生错误。

### 实例

我们有一个使用 MSW 的完整工作示例： [React Testing with MSW](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib-msw).

### 了解更多

MSW还有很多。您可以访问 cookie 和查询参数、定义模拟错误响应等等！要查看您可以使用 MSW 做什么，请阅读[他们的文档](https://mswjs.io/docs/recipes)。

## 时间

每当我们测试涉及到`超时`或者`间隔`的代码时，并不是让我们的测试程序进行等待或者超时。我们也可以通过模拟对 `setTimeout` 和 `setInterval` 的调用来使用“假”计时器来加速我们的测试。

有关更深入的详细 API 描述，请参[`vi.mock()` API 部分](/api/#vi-usefaketimer)。

### 实例

```js
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'

const executeAfterTwoHours = (func) => {
  setTimeout(func, 1000 * 60 * 60 * 2) // 2 hours
}

const executeEveryMinute = (func) => {
  setInterval(func, 1000 * 60); // 1 minute
}

const mock = vi.fn(() => console.log('executed'));

describe('delayed execution', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(()=> {
    vi.restoreAllMocks()
  })
  it('should execute the function', () => {
    executeAfterTwoHours(mock);
    vi.runAllTimers();
    expect(mock).toHaveBeenCalledTimes(1);
  })
  it('should not execute the function', () => {
    executeAfterTwoHours(mock);
    // advancing by 2ms won't trigger the func
    vi.advanceTimersByTime(2);
    expect(mock).not.toHaveBeenCalled();
  })
  it('should execute every minute', () => {
    executeEveryMinute(mock);
    vi.advanceTimersToNextTimer();
    vi.advanceTimersToNextTimer();
    expect(mock).toHaveBeenCalledTimes(1);
    vi.advanceTimersToNextTimer();
    expect(mock).toHaveBeenCalledTimes(2);
  })
})
```
