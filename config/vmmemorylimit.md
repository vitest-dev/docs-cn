---
title: vmMemoryLimit | 配置
outline: deep
---

# vmMemoryLimit

- **类型:** `string | number`
- **默认值:** `1 / CPU 核心`

此选项仅影响 `vmForks` 和 `vmThreads` 线程池。

指定工作线程被回收之前的内存限制。该值在很大程度上取决于你的运行环境，因此最好手动指定它，而不是依赖默认值。

::: tip
该实现基于 Jest 的 [`workerIdleMemoryLimit`](https://jestjs.io/docs/configuration#workeridlememorylimit-numberstring)。

可以通过多种不同的方式指定限制，无论结果是什么，`Math.floor` 都用于将其转换为整数值：

- `<= 1` - 该值假定为系统内存的百分比。所以 0.5 将 worker 的内存限制设置为系统总内存的一半。
- `\> 1` - 假设是固定字节值。由于之前的规则，如果你想要 1 字节的值（我不知道为什么），你可以使用 1.1。
- 有单位时
  - `50%` - 如上，占系统总内存的百分比
  - `100KB`, `65MB`, 等 - 用单位表示固定的内存限制
    - `K`/`KB` - 千字节 (x1000)
    - `KiB` - 千字节 (x1024)
    - `M`/`MB` - 千字节
    - `MiB` - 兆字节
    - `G`/`GB` - 千兆字节
    - `GiB` - 千兆字节
      :::

::: warning
基于百分比的内存限制 [在 Linux CircleCI 环境下无效](https://github.com/jestjs/jest/issues/11956#issuecomment-1212925677)，因该系统会误报内存总量。
:::
