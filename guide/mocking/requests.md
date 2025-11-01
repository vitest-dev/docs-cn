# 模拟请求 {#mocking-requests}

由于 Vitest 运行在 Node 环境中，模拟网络请求很棘手；Web API 不可用，所以我们需要一些能够模拟网络行为的工具。我们推荐使用 [Mock Service Worker](https://mswjs.io/) 来实现这一点。它允许你模拟 `http`、`WebSocket` 和 `GraphQL` 网络请求，并且与框架无关。

Mock Service Worker (MSW) 通过拦截你的测试发出的请求来工作，允许你在不更改任何应用程序代码的情况下使用它。在浏览器中，这使用 [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)。在 Node.js 和 Vitest 中，它使用 [`@mswjs/interceptors`](https://github.com/mswjs/interceptors) 库。要了解更多关于 MSW 的信息，请阅读他们的[介绍](https://mswjs.io/docs/)。

## 配置 {#configuration}

You can use it like below in your [setup file](/config/#setupfiles)

::: code-group

```js [HTTP Setup]
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

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

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
```

```js [GraphQL Setup]
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  // ...
]

const graphqlHandlers = [
  graphql.query('ListPosts', () => {
    return HttpResponse.json({
      data: { posts },
    })
  }),
]

const server = setupServer(...graphqlHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
```

```js [WebSocket Setup]
import { ws } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

const chat = ws.link('wss://chat.example.com')

const wsHandlers = [
  chat.addEventListener('connection', ({ client }) => {
    client.addEventListener('message', (event) => {
      console.log('Received message from client:', event.data)
      // Echo the received message back to the client
      client.send(`Server received: ${event.data}`)
    })
  }),
]

const server = setupServer(...wsHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
```
:::

> Configuring the server with `onUnhandledRequest: 'error'` ensures that an error is thrown whenever there is a request that does not have a corresponding request handler.

## 更多信息 {#more}
There is much more to MSW. You can access cookies and query parameters, define mock error responses, and much more! To see all you can do with MSW, read [their documentation](https://mswjs.io/docs).
