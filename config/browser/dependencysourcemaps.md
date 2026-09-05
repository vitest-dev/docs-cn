---
title: browser.dependencySourcemaps | 配置
outline: deep
---

# browser.dependencySourcemaps

- **类型:** `boolean`
- **默认值:** `true`

在无头模式下运行测试时，向浏览器提供依赖项（即 `node_modules` 中的文件）的 source map。

浏览器开发者工具会使用这些 source map。设置 `dependencySourcemaps: false` 后，如果调试时暂停在依赖项代码中，开发者工具会显示浏览器实际运行的编译后代码，而不是依赖项的原始源代码。如果不需要以这种方式调试依赖项，可以禁用此选项来加快测试速度。禁用后，服务器无需生成并内联这些 source map，每个浏览器标签页需要下载的数据量也会减少数倍。

测试错误的报告结果不受此选项影响。如果错误由预打包的依赖项抛出，即使禁用了此选项，Vitest 仍会使用存储在磁盘上的 source map 映射堆栈帧。对于未经过预打包便直接提供的依赖项，例如 [链接的包](https://cn.vite.dev/guide/dep-pre-bundling#monorepos-and-linked-dependencies)，如果它们自身不包含 source map，堆栈帧会回退到所提供代码中的位置。该位置通常与原始文件一致。

在无头模式下运行测试时，Vitest 不会提供自身预构建模块的 source map，除非使用 [`--inspect`](/guide/cli#inspect)。这些模块的堆栈帧本来就会从堆栈跟踪中隐藏。项目自身源文件的 source map 则始终会提供给浏览器。

::: tip
如果工作区中的部分代码被解析为 `node_modules` 下的路径，例如启用了 `resolve.preserveSymlinks`，请配置 [`server.sourcemapIgnoreList`](https://cn.vite.dev/config/server-options#server-sourcemapignorelist)，确保即使禁用了此选项，浏览器仍能获取这些代码的 source map。
:::
