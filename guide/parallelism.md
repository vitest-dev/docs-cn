---
title: 并行性 | 指南
outline: deep
---

# 并行性 {#parallelism}

Vitest 有两个层级的并行机制：它可以同时运行多个 _测试文件_，也可以在单个文件内同时运行多个 _测试_。理解这两者之间的区别至关重要，因为它们的工作方式不同，权衡内容也不同。

## 文件级并行 {#file-parallelism}

默认情况下，Vitest 会在多个 worker 中并行运行测试文件。每个文件都拥有独立的隔离环境，因此不同文件中的测试不会相互干扰。

Vitest 创建 worker 的机制取决于配置的 [`pool`](/config/pool)：

- `forks`（默认值）和 `vmForks` 在单独的 [子进程](https://nodejs.org/api/child_process.html) 中运行每个文件
- `threads` 和 `vmThreads` 在单独的 [工作线程](https://nodejs.org/api/worker_threads.html) 中运行每个文件

你可以通过 [`maxWorkers`](/config/maxworkers) 选项控制同时运行的 worker 数量。更多的 worker 意味着可以并行运行更多文件，但也会占用更多内存和 CPU。具体的数量取决于你的机器性能和测试的负载情况。

对于大多数项目而言，文件级并行是影响测试套件速度的最主要因素。然而，在某些情况下，你可能需要禁用它：例如，当你的测试共享一个无法处理并发访问的外部资源（如数据库）时。你可以将 [`fileParallelism`](/config/fileparallelism) 设置为 `false` 来逐个顺序运行文件。

要了解更多关于性能优化的信息，请参阅 [性能指南](/guide/improving-performance)。

## 测试级并行 {#test-parallelism}

在单个文件内部，Vitest 默认按顺序运行测试。测试按照定义的顺序依次执行。这是最安全的默认设置，因为同一文件内的测试通常通过 `beforeEach` 等生命周期钩子共享初始化和状态。

如果文件中的测试是相互独立的，你可以选择使用 [`concurrent`](/api/test#test-concurrent) 修饰符来并发运行它们：

```ts
import { expect, test } from 'vitest'

test.concurrent('fetches user profile', async () => {
  const user = await fetchUser(1)
  expect(user.name).toBe('Alice')
})

test.concurrent('fetches user posts', async () => {
  const posts = await fetchPosts(1)
  expect(posts).toHaveLength(3)
})
```

当测试被标记为 `concurrent` 时，Vitest 会将它们分组，并使用 [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 运行它们。同时运行的测试数量受 [`maxConcurrency`](/config/maxconcurrency) 参数限制。

::: tip `concurrent` 何时真正有效？
Vitest 不会为并发测试创建额外的 worker，它们都会在所属文件的同一个 worker 中运行。这意味着，只有当测试会花时间 “等待”（例如等待网络请求、定时器、文件 I/O 等）时，`concurrent` 才能带来提速。纯同步测试不会因此受益，因为它们仍然会阻塞单个 JavaScript 线程：

```ts
// 尽管使用了 `concurrent`，这些测试仍会依次运行，
// 因为没有任何需要等待的内容
test.concurrent('the first test', () => {
  expect(1).toBe(1)
})

test.concurrent('the second test', () => {
  expect(2).toBe(2)
})
```

:::

你也可以将 `concurrent` 应用于整个测试套件：

```ts
import { describe, expect, test } from 'vitest'

describe.concurrent('user API', () => {
  test('fetches profile', async () => {
    const user = await fetchUser(1)
    expect(user.name).toBe('Alice')
  })

  test('fetches posts', async () => {
    const posts = await fetchPosts(1)
    expect(posts).toHaveLength(3)
  })
})
```

如果你希望项目中的 _所有_ 测试默认并发运行，可以在配置中将 [`sequence.concurrent`](/config/sequence#sequence-concurrent) 设置为 `true`。

你可以通过 `concurrent: false` 让单个测试或测试套件退出继承的并发设置：

```ts
test('uses a shared resource', { concurrent: false }, async () => {
  // ...
})

describe('shared resource suite', { concurrent: false }, () => {
  test('step 1', async () => { /* ... */ })
  test('step 2', async () => { /* ... */ })
})
```

### 并发测试中的钩子 {#hooks-with-concurrent-tests}

当测试并发运行时，生命周期钩子的行为会有所不同。`beforeAll` 和 `afterAll` 仍然会为整个组运行一次，但 `beforeEach` 和 `afterEach` 会为每个测试分别运行，而且由于测试本身会重叠执行，它们可能会在同一时间发生。

钩子的执行顺序由 [`sequence.hooks`](/config/sequence#sequence-hooks) 控制。当 `sequence.hooks` 设置为 `'parallel'` 时，钩子同样受 [`maxConcurrency`](/config/maxconcurrency) 限制。
