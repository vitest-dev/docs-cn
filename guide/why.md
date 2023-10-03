---
title: Why Vitest | Guide
---

# 为什么是 Vitest

:::tip 提示
该文档假设你是熟悉 Vite 的。开始阅读之前建议先浏览 [为什么选 Vite](https://cn.vitejs.dev/guide/why.html) 和 [下一代前端工具 ViteJS](https://www.bilibili.com/video/BV1kh411Q7WN) ，在视频中 [尤雨溪](https://github.com/yyx990803) 做了一个示范来解释 Vite 的主要概念。
:::

## Vite 原生测试运行器的必要性

Vite 天然支持常见的 Web 模式，同时支持 glob 导入和 SSR 等功能，而且它拥有许多插件和集成框架，从而慢慢形成一个活跃的生态社区。它的开发和构建模式是其成功的关键。对于文档构建框架，Vite 提供了一些基于 SSG 的替代方案。但是 Vite 的单元测试形式还不是十分清晰，而对于目前一些现有方案，比如 [Jest](https://jestjs.io/zh-Hans/) 而言，它们会在不同的上下文环境中被创建的。并且 Jest 和 Vite 之间有很多重复的部分，让用户不得不创建两个不同的配置文件。

<<<<<<< HEAD
如果使用 Vite 开发服务器在测试期间来转换你的文件，此时我们可以只创建一个简单运行程序，它无需处理复杂的源代码转换，而只专注于在测试期间能够提供最佳的开发体验。并且该测试运行程序可以使用你的 App 的配置文件 (通过 `vite.config.js`)，在开发、构建和测试期间共享一个通用的转换容器。同时可以通过相同的插件 API 进行扩展，让你和你的工具与 Vite 形成完美的集成。 一个从一开始就考虑到使用 Vite 构建的工具，利用了它对开发体验的提升，比如它的即时热模块重载 (HMR)。 这就是 Vitest，一个由 Vite 提供支持的极速单元测试框架。
=======
Using Vite dev server to transform your files during testing, enables the creation of a simple runner that doesn't need to deal with the complexity of transforming source files and can solely focus on providing the best DX during testing. A test runner that uses the same configuration of your App (through `vite.config.js`), sharing a common transformation pipeline during dev, build, and test time. That is extensible with the same plugin API that lets you and the maintainers of your tools provide first-class integration with Vite. A tool that is built with Vite in mind from the start, taking advantage of its improvements in DX, like its instant Hot Module Reload (HMR). This is Vitest, a next generation testing framework powered by Vite.
>>>>>>> fcd073bb02a53fa45ccf8a5a754fdfdb7dab63b3

由于 Jest 的大规模使用，Vitest 提供了与之兼容的API，允许大家在大多数项目中将其作为备选使用。同时还包括了单元测试时最常见的功能（模拟，快照以及覆盖率）。Vitest 非常注重性能，尽可能多地使用 Worker 线程进行并发运行。并且在一些端口的测试运行速度提高了一个数量级别。监听模式默认启用，与 Vite 推动开发者优先体验的理念保持一致。 即使在开发体验上进行了改进，Vitest 通过仔细挑选其依赖项（或直接内联所需的部分）来保持轻量级。

**Vitest 旨在将自己定位为 Vite 项目的首选测试框架，即使对于不使用 Vite 的项目也是一个可靠的替代方案。**

继续阅读 [快速起步](./index)

## Vitest 与 X 有何不同？

你可以查看 [比较](./comparisons) 部分，了解有关 Vitest 与其他类似工具有何不同的更多详细信息。
