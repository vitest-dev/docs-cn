---
title: 并行性 | Guide
outline: deep
---

# 并行性 {#parallelism}

<<<<<<< HEAD
## 文件级并行 {#file-parallelism}

默认情况下，Vitest 会并行运行 _测试文件_。根据指定的 `pool`，Vitest 会采用不同的并行化机制：

- `forks`（默认）和 `vmForks` 会在不同的 [child processes](https://nodejs.org/api/child_process.html) 中执行测试
- `threads` 和 `vmThreads` 则会在不同的 [worker threads](https://nodejs.org/api/worker_threads.html) 中运行

“子进程（child processes）” 和 “工作线程（worker threads）” 都统称为 “工作者（workers）”。你可以通过 [`maxWorkers`](/config/maxworkers) 选项配置运行的工作者数量。

如果项目包含大量测试文件，通常并行执行会大幅提升速度。但具体效果还要看项目本身、运行环境以及是否启用了 [隔离](/config/isolate)。若需要关闭文件级并行化，可以将 [`fileParallelism`](/config/fileparallelism) 设为 `false` 。更多性能优化技巧，请参考 [性能指南](/guide/improving-performance) 。
=======
Vitest has two levels of parallelism: it can run multiple *test files* at the same time, and within each file it can run multiple *tests* at the same time. Understanding the difference between the two is important because they work differently and have different trade-offs.

## File Parallelism

By default, Vitest runs test files in parallel across multiple workers. Each file gets its own isolated environment, so tests in different files can't interfere with each other.

The mechanism Vitest uses to create workers depends on the configured [`pool`](/config/pool):

- `forks` (the default) and `vmForks` run each file in a separate [child process](https://nodejs.org/api/child_process.html)
- `threads` and `vmThreads` run each file in a separate [worker thread](https://nodejs.org/api/worker_threads.html)

You can control how many workers run simultaneously with the [`maxWorkers`](/config/maxworkers) option. More workers means more files run in parallel, but also more memory and CPU usage. The right number depends on your machine and how heavy your tests are.

For most projects, file parallelism is the single biggest factor in test suite speed. However, there are cases where you might want to disable it — for example, if your tests share an external resource like a database that can't handle concurrent access. You can set [`fileParallelism`](/config/fileparallelism) to `false` to run files one at a time.

To learn more about tuning performance, see the [Performance Guide](/guide/improving-performance).
>>>>>>> 1df9a43d68d7337e9df5dc24c97c34d47b7b0676

## 测试级并行 {#test-parallelism}

<<<<<<< HEAD
与 _测试文件_ 不同， Vitest 在同一个文件中会顺序执行 _测试用例_ 。也就是说，同一个文件里的测试会按定义顺序一个接一个地执行。

Vitest 支持通过 [`concurrent`](/api/test#test-concurrent) 选项并行运行测试。当启用该选项时，Vitest 会将同一 _文件_ 中的并发测试分组（同时运行的测试数量取决于 [`maxConcurrency`](/config/maxconcurrency) 配置），并通过 [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 一起执行。

单个分组内钩子的执行顺序同样受 [`sequence.hooks`](/config/sequence#sequence-hooks) 控制。当设置 `sequence.hooks: 'parallel'` 时，执行受 [`maxConcurrency`](/config/maxconcurrency) 相同限制的约束。

Vitest 不会自动分析你的测试是否可以并行，也不会为了并发而额外创建工作者。这意味着，只有在测试中有大量异步操作时，使用并发才能提升性能。例如，以下示例即便指定了 concurrent ，也会顺序执行，因为它们是同步的：
=======
Within a single file, Vitest runs tests sequentially by default. Tests execute in the order they are defined, one after another. This is the safest default because tests within a file often share setup and state through lifecycle hooks like `beforeEach`.

If the tests in a file are independent, you can opt into running them concurrently with the [`concurrent`](/api/test#test-concurrent) modifier:
>>>>>>> 1df9a43d68d7337e9df5dc24c97c34d47b7b0676

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

When tests are marked as `concurrent`, Vitest groups them together and runs them with [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all). The number of tests running at once is bounded by the [`maxConcurrency`](/config/maxconcurrency) option.

::: tip When does `concurrent` actually help?
Vitest doesn't create extra workers for concurrent tests — they all run in the same worker as the file they belong to. This means `concurrent` only speeds things up when your tests spend time *waiting* (on network requests, timers, file I/O, etc.). Purely synchronous tests won't benefit because they still block the single JavaScript thread:

```ts
// These run one after another despite `concurrent`,
// because there is nothing to await
test.concurrent('the first test', () => {
  expect(1).toBe(1)
})

test.concurrent('the second test', () => {
  expect(2).toBe(2)
})
```
:::

<<<<<<< HEAD
如果希望所有测试用例都并发执行，可以将 [`sequence.concurrent`](/config/sequence#sequence-concurrent) 配置项设为 `true` 。
=======
You can also apply `concurrent` to an entire suite:

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

If you want *all* tests in your project to run concurrently by default, set [`sequence.concurrent`](/config/sequence#sequence-concurrent) to `true` in your config.

### Hooks with Concurrent Tests

When tests run concurrently, lifecycle hooks behave differently. `beforeAll` and `afterAll` still run once for the group, but `beforeEach` and `afterEach` run for each test — potentially at the same time, since the tests themselves overlap.

The hook execution order is controlled by [`sequence.hooks`](/config/sequence#sequence-hooks). With `sequence.hooks: 'parallel'`, hooks are also bounded by the [`maxConcurrency`](/config/maxconcurrency) limit.
>>>>>>> 1df9a43d68d7337e9df5dc24c97c34d47b7b0676
