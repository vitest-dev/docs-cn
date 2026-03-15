---
title: 并行性 | Guide
outline: deep
---

# 并行性 {#parallelism}

## 文件级并行 {#file-parallelism}

默认情况下，Vitest 会并行运行 _测试文件_。根据指定的 `pool`，Vitest 会采用不同的并行化机制：

- `forks`（默认）和 `vmForks` 会在不同的 [child processes](https://nodejs.org/api/child_process.html) 中执行测试
- `threads` 和 `vmThreads` 则会在不同的 [worker threads](https://nodejs.org/api/worker_threads.html) 中运行

“子进程（child processes）” 和 “工作线程（worker threads）” 都统称为 “工作者（workers）”。你可以通过 [`maxWorkers`](/config/maxworkers) 选项配置运行的工作者数量。

如果项目包含大量测试文件，通常并行执行会大幅提升速度。但具体效果还要看项目本身、运行环境以及是否启用了 [隔离](/config/isolate)。若需要关闭文件级并行化，可以将 [`fileParallelism`](/config/fileparallelism) 设为 `false` 。更多性能优化技巧，请参考 [性能指南](/guide/improving-performance) 。

## 测试级并行 {#test-parallelism}

与 _测试文件_ 不同， Vitest 在同一个文件中会顺序执行 _测试用例_ 。也就是说，同一个文件里的测试会按定义顺序一个接一个地执行。

Vitest 支持通过 [`concurrent`](/api/test#test-concurrent) 选项并行运行测试。当启用该选项时，Vitest 会将同一 _文件_ 中的并发测试分组（同时运行的测试数量取决于 [`maxConcurrency`](/config/maxconcurrency) 配置），并通过 [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 一起执行。

单个分组内钩子的执行顺序同样受 [`sequence.hooks`](/config/sequence#sequence-hooks) 控制。当设置 `sequence.hooks: 'parallel'` 时，执行受 [`maxConcurrency`](/config/maxconcurrency) 相同限制的约束。

Vitest 不会自动分析你的测试是否可以并行，也不会为了并发而额外创建工作者。这意味着，只有在测试中有大量异步操作时，使用并发才能提升性能。例如，以下示例即便指定了 concurrent ，也会顺序执行，因为它们是同步的：

```ts
test.concurrent('the first test', () => {
  expect(1).toBe(1)
})

test.concurrent('the second test', () => {
  expect(2).toBe(2)
})
```

如果希望所有测试用例都并发执行，可以将 [`sequence.concurrent`](/config/sequence#sequence-concurrent) 配置项设为 `true` 。
