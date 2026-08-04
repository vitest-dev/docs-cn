---
title: vmMemoryLimit | 配置
outline: deep
---

# vmMemoryLimit

<<<<<<< HEAD
- **类型:** `string | number`
- **默认值:** `1 / CPU 核心`
=======
- **Type:** `string | number`
- **Default:** `1 / maxWorkers`
>>>>>>> 8bd62ec3a572c72608ac7f771f354094b979491d

此选项仅影响 `vmForks` 和 `vmThreads` 线程池。

<<<<<<< HEAD
指定工作线程被回收之前的内存限制。该值在很大程度上取决于你的运行环境，因此最好手动指定它，而不是依赖默认值。
=======
Specifies the memory limit for workers before they are recycled.

By default, the total system memory is split evenly between workers. By increasing [`maxWorkers`](/config/maxworkers), workers have less memory available, so they're recycled more often.

This value heavily depends on your environment, so it's better to specify it manually instead of relying on the default. 

Recycling exists because VM contexts [leak memory](https://github.com/nodejs/node/issues/33439): a worker's memory usage grows with every test file it runs, so a worker cannot live forever. The limit is a trade-off:

- A low limit recycles workers frequently. In the `vmThreads` pool this is expensive, because destroying a worker thread runs a full garbage collection over the worker's memory and competes with running tests for the process' shared background threads. The `vmForks` pool recycles workers by letting the child process exit, which makes frequent recycling much cheaper there.
- A high limit lets workers accumulate memory. When the combined memory usage of all workers approaches what the machine can hold, every pool slows down.
>>>>>>> 8bd62ec3a572c72608ac7f771f354094b979491d

::: tip
该实现基于 Jest 的 [`workerIdleMemoryLimit`](https://jestjs.io/docs/configuration#workeridlememorylimit-numberstring)。

可以通过多种不同的方式指定限制，无论结果是什么，`Math.floor` 都用于将其转换为整数值：

- `<= 1` - 该值假定为系统内存的百分比。所以 0.5 将 worker 的内存限制设置为系统总内存的一半。
- `\> 1` - 假设是固定字节值。由于之前的规则，如果你想要 1 字节的值（我不知道为什么），你可以使用 1.1。
- 有单位时
  - `50%` - 如上，占系统总内存的百分比
  - `100KB`, `65MB`, 等 - 用单位表示固定的内存限制
    - `K` / `KB` - 千字节 (x1000)
    - `KiB` - 千字节 (x1024)
    - `M` / `MB`- 千字节
    - `MiB` - 兆字节
    - `G` / `GB` - 千兆字节
    - `GiB` - 千兆字节
:::

::: warning
基于百分比的内存限制 [在 Linux CircleCI 环境下无效](https://github.com/jestjs/jest/issues/11956#issuecomment-1212925677)，因该系统会误报内存总量。
:::
