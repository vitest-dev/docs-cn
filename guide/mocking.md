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

::: warning 警告
正在翻译中......
:::
<!--
## Modules

Mock modules observe third-party-libraries, that are invoked in some other code, allowing you to test arguments, output or even redeclare its implementation.

See the [`vi.mock()` api section](/api/#vi-fn) for a more in depth detailed API description.

### Automocking algorithm

If your code is importing mocked module, without any associated `__mocks__` file or `factory` for this module, Vitest will mock the module itself by invoking it and mocking every export.

The following principles apply
* All arrays will be emptied
* All primitives and collections will stay the same
* All objects will be deeply cloned
* All instances of classes and their prototypes will be deeply cloned

### Example

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

## Requests

Because Vitest runs in Node, mocking network requests is tricky; web APIs are not available, so we need something that will mimic network behavior for us. We recommend [Mock Service Worker](https://mswjs.io/) to accomplish this. It will let you mock both `REST` and `GraphQL` network requests, and is framework agnostic.

Mock Service Worker (MSW) works by intercepting the requests your tests make, allowing you to use it without changing any of your application code. In-browser, this uses the [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API). In Node.js, and for Vitest, it uses [node-request-interceptor](https://mswjs.io/docs/api/setup-server#operation). To learn more about MSW, read their [introduction](https://mswjs.io/docs/)


### Configuration

Add the following to your test [setup file](/config/#setupfiles)
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

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
```

> Configuring the server with `onUnhandleRequest: 'error'` ensures that an error is thrown whenever there is a request that does not have a corresponding request handler.

### Example

We have a full working example which uses MSW: [React Testing with MSW](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib-msw).

### More
There is much more to MSW. You can access cookies and query parameters, define mock error responses, and much more! To see all you can do with MSW, read [their documentation](https://mswjs.io/docs/recipes).

## Timers

Whenever we test code that involves `timeOut`s or intervals, instead of having our tests it wait out or time-out. We can speed up our tests by using "fake" timers by mocking calls to `setTimeout` and `setInterval`, too.

See the [`vi.mock()` api section](/api/#vi-usefaketimer) for a more in depth detailed API description.

### Example

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
 -->
