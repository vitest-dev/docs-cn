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
<!-- TODO: translation -->
启用多线程模式。使用线程时，无法调用 `process.chdir()` 等进程相关 API。 Changing `process.env.TZ` [does not affect the time zone](/guide/common-errors#time-zone-does-not-change-in-worker-threads) in a worker thread.某些使用原生语言编写的库（如 `Prisma`、`bcrypt` 和 `canvas`）在多线程运行时会出现问题并导致存储器区段错误。此类情况下建议改用 `forks` 执行池。

## forks

类似于 `threads` 线程池，但使用 `child_process` 代替 `worker_threads`。测试与主进程之间的通信速度不如 `threads`，但可以使用 `process.chdir()` 等进程相关 API。

## vmThreads

在 `threads` 池中使用 [VM 上下文](https://nodejs.org/api/vm.html)，以沙箱方式运行测试。

这种方式可以加快测试速度，但 VM 模块在运行 [ESM 代码](https://github.com/nodejs/node/issues/37648) 时并不稳定。此外，测试还会出现 [内存泄漏](https://github.com/nodejs/node/issues/33439)。为限制内存占用，当工作线程使用的内存超过 [`vmMemoryLimit`](/config/vmmemorylimit) 时，Vitest 会将其重启。

::: warning 在 `vmThreads` 中回收工作线程的开销较高
重启工作线程会产生明显的开销。在线程退出之前，Node.js 会对该线程积累的所有内存执行一次完整的垃圾回收。这项工作由进程内所有工作线程共用的一小组后台线程执行。当大型测试套件反复触及 [`vmMemoryLimit`](/config/vmmemorylimit) 时，工作线程的销毁操作会不断累积，并拖慢仍在运行测试的其他工作线程。

`vmForks` 则通过结束子进程完成回收，内存由操作系统负责释放。如果测试套件规模较大，需要定期回收子进程，那么即使 `vmForks` 与主进程之间的通信速度较慢，其整体运行速度通常仍会明显快于 `vmThreads`。
:::

On Node.js 24.9 and later, `require()` of an ES module is supported inside vm pools, mirroring [Node's own `require(esm)`](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require). Calling `require()` on an ES module whose graph contains top-level `await` throws `ERR_REQUIRE_ASYNC_MODULE` - use `await import()` for those files.

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

- 导入 ES 模块会导致其被永久缓存，当存在大量上下文（测试文件）时，将引发内存泄漏问题。Node.js 目前未提供清除该缓存的 API 接口。
- 在沙箱环境中访问全局变量 [耗时更长](https://github.com/nodejs/node/issues/31658)。

使用此选项时，需要注意这些问题。Vitest 团队无法解决上诉问题。
:::

## vmForks

类似于 `vmThreads` 线程池，但使用 `child_process` 代替 `worker_threads`。测试与主进程之间的通信不如 `vmThreads` 线程池快。在 `vmForks` 线程池中可以使用与进程相关的 API，如 `process.chdir()`。请注意，此线程池具有 `vmThreads` 中列出的相同缺陷。

与 `vmThreads` 不同，当子进程的内存占用超过 [`vmMemoryLimit`](/config/vmmemorylimit) 时，`vmForks` 只需结束该进程即可完成回收，因此开销要低得多。对于需要定期回收子进程的大型测试套件，建议优先使用 `vmForks`。
