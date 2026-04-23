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

<<<<<<< HEAD
启用多线程。使用 threads 线程池时，你无法使用与进程相关的 API，如 `process.chdir()`。某些用原生语言编写的库（如`Prisma`、`bcrypt` 和 `canvas`）在多线程中运行时存在问题，容易导致段错误。在这些情况下，建议改用 `forks` 线程池。
=======
Enable multi-threading. When using threads you are unable to use process related APIs such as `process.chdir()`. Some libraries written in native languages, such as `Prisma`, `bcrypt` and `canvas`, have problems when running in multiple threads and run into segfaults. In these cases it is advised to use `forks` pool instead.
>>>>>>> ec964f36ce7596a023a32b8265f6019c51b32926

## forks

类似于 `threads` 线程池，但使用 `child_process` 代替 `worker_threads`。测试与主进程之间的通信不如 `threads` 线程池快。在 `forks` 线程池中可以使用与进程相关的 API，如 `process.chdir()`。

## vmThreads

使用 [VM 上下文](https://nodejs.org/api/vm.html)（在沙箱环境中）在 `threads` 线程池中运行测试。

这使得测试运行速度更快，但 VM 模块在运行 [ESM 代码](https://github.com/nodejs/node/issues/37648) 时不稳定。你的测试可能会 [泄漏内存](https://github.com/nodejs/node/issues/33439)，为了解决这个问题，考虑手动设置 [`vmMemoryLimit`](/config/vmmemorylimit) 阈值。

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

类似于 `vmThreads` 线程池，但使用 `child_process` 代替 `worker_threads`。测试与主进程之间的通信不如 `vmThreads` 线程池快。在 `vmForks` 线程池中可以使用与进程相关的 API，如 `process.chdir()`。请注意，此线程池具有 `vmThreads` 中列出的相同缺陷。
