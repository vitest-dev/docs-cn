---
title: pool | 配置
outline: deep
---

# pool

- **类型:** `'threads' | 'forks' | 'vmThreads' | 'vmForks'`
- **默认值:** `'forks'`
- **命令行终端:** `--pool=threads`

用于运行测试的线程池。

## threads

启用多线程模式。使用线程时，你无法调用进程相关 API 例如 `process.chdir()`。某些原生语言编写的库（如 `Prisma`、`bcrypt` 和 `canvas`）在多线程运行时会出现问题并导致存储器区段错误。此类情况下建议改用 `forks` 执行池。

## forks

类似于 `threads` 线程池，但使用 `child_process` 代替 `worker_threads`。测试与主进程之间的通信不如 `threads` 线程池快。在 `forks` 线程池中可以使用与进程相关的 API，如 `process.chdir()`。

## vmThreads

使用 [VM 上下文](https://nodejs.org/api/vm.html)（在沙箱环境中）在 `threads` 线程池中运行测试。

<<<<<<< HEAD
这使得测试运行速度更快，但 VM 模块在运行 [ESM 代码](https://github.com/nodejs/node/issues/37648) 时不稳定。你的测试可能会 [泄漏内存](https://github.com/nodejs/node/issues/33439)，为了解决这个问题，考虑手动设置 [`vmMemoryLimit`](/config/vmmemorylimit) 阈值。
=======
This makes tests run faster, but the VM module is unstable when running [ESM code](https://github.com/nodejs/node/issues/37648). Your tests will [leak memory](https://github.com/nodejs/node/issues/33439) - to battle that, workers are restarted when they exceed [`vmMemoryLimit`](/config/vmmemorylimit).

::: warning Worker recycling is expensive in `vmThreads`
Restarting a worker thread is not free: Node.js runs a full garbage collection over everything the worker accumulated before the thread can exit, and that work runs on a small pool of background threads shared by every worker in the process. When a large test suite hits [`vmMemoryLimit`](/config/vmmemorylimit) repeatedly, these teardowns pile up and also slow down the workers that are still running tests.

The `vmForks` pool recycles workers by letting the child process exit, and the operating system reclaims the memory. If your test suite is large enough to recycle workers, `vmForks` is usually noticeably faster than `vmThreads`, even though its communication with the main process is slower.
:::
>>>>>>> 8bd62ec3a572c72608ac7f771f354094b979491d

::: warning
在沙箱中运行代码有一些优势（测试速度更快），但也存在一些劣势。

- 原生模块（如 `fs`、`path` 等）内的全局变量与你的测试环境中存在的全局变量不同。因此，这些原生模块抛出的任何错误都会引用一个与你的代码中使用的 Error 构造函数不同的构造函数：

```ts
try {
  fs.writeFileSync('/does-not-exist')
}
catch (err) {
  console.log(err instanceof Error) // false
}
```

- 导入 ES 模块会导致其被永久缓存，当存在大量上下文（测试文件）时，将引发内存泄漏问题。Node.js 目前未提供清除该缓存的API接口。
- 在沙箱环境中访问全局变量 [耗时更长](https://github.com/nodejs/node/issues/31658)。

使用此选项时，需要注意这些问题。Vitest 团队无法解决上诉问题。
:::

## vmForks

<<<<<<< HEAD
类似于 `vmThreads` 线程池，但使用 `child_process` 代替 `worker_threads`。测试与主进程之间的通信不如 `vmThreads` 线程池快。在 `vmForks` 线程池中可以使用与进程相关的 API，如 `process.chdir()`。请注意，此线程池具有 `vmThreads` 中列出的相同缺陷。
=======
Similar as `vmThreads` pool but uses `child_process` instead of `worker_threads`. Communication between tests and the main process is not as fast as with `vmThreads` pool. Process related APIs such as `process.chdir()` are available in `vmForks` pool. Please be aware that this pool has the same pitfalls listed in `vmThreads`.

Unlike `vmThreads`, recycling a worker that exceeded [`vmMemoryLimit`](/config/vmmemorylimit) only requires the child process to exit, so it is much cheaper. On large test suites that recycle workers regularly, prefer `vmForks` over `vmThreads`.
>>>>>>> 8bd62ec3a572c72608ac7f771f354094b979491d
