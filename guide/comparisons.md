---
title: 与其他测试框架对比 | 指南
---

# 与其他测试框架对比

## Jest

[Jest](https://jestjs.io/) 通过为大多数 JavaScript 项目提供开箱即用的支持、舒适的 API（`it` 和 `expect`）以及大多数设置所需的完整测试功能（快照、模拟和覆盖率），在测试框架领域占据了主导地位。我们感谢 Jest 团队和社区创建了一个令人愉悦的测试 API，并推动了许多现在成为 Web 生态系统标准的测试模式。

可以在 Vite 设置中使用 Jest。[@sodatea](https://twitter.com/haoqunjiang) 开发了 [vite-jest](https://github.com/sodatea/vite-jest#readme) ，旨在为 [Jest](https://jestjs.io/) 提供一流的 Vite 集成。[Jest 中最后的阻碍](https://github.com/sodatea/vite-jest/blob/main/packages/vite-jest/README.md#vite-jest)已经解决，因此这是你单元测试的有效选项。

然而，在 [Vite](https://vitejs.dev) 为最常见的 Web 工具（TypeScript、JSX、最流行的 UI 框架）提供支持的世界中，引入 Jest 代表了复杂性的重复。如果你的应用由 Vite 驱动，那么需要配置和维护两个不同的管道是不合理的。使用 Vitest，你可以将开发、构建和测试环境的配置定义为一个管道，共享相同的插件和 `vite.config.js` 文件。

即使你的库没有使用 Vite（例如，如果它是使用 esbuild 或 rollup 构建的），Vitest 也是一个有趣的选择，因为它可以让你更快地运行单元测试，并通过默认使用 Vite 的即时热模块重载（HMR）观察模式来提高 DX。 Vitest 提供了与大多数 Jest API 和生态系统库兼容性，因此在大多数项目中，它应该可以作为 Jest 的替代品直接使用。

## Cypress

[Cypress](https://www.cypress.io/) 是基于浏览器的测试工具，是 Vitest 的补充工具之一。如果你想使用 Cypress，建议将 Vitest 用于测试项目中非浏览器逻辑，将 Cypress 用于测试依赖浏览器的逻辑。

Cypress 是著名的端到端测试工具，他们[最新的组件测试运行器](https://on.cypress.io/component) 对测试 Vite 组件有很好的支持，是测试任何在浏览器中渲染的东西的理想选择。

基于浏览器运行测试的框架，例如 Cypress, WebdriverIO 和 Web Test Runner，会捕获到 Vitest 无法捕获的问题，因为他们都是使用真实的浏览器和 APIs。

Cypress 的测试更加专注于确定元素是否可见，是否可以访问和交互。Cypress 专门为 UI 开发和测试而构建，它的开发体验趋向于测试你的视觉组件，你会看到程序的组件和测试报告一起出现。测试完成后，组件将保持交互状态，你可以使用浏览器开发工具调试发生的任何故障。

相比之下，Vitest 专注于为非浏览器逻辑提供最佳的开发体验。像 Vitest 这样的基于 Node.js 的测试框架支持各种实现部分浏览器环境的第三方包，例如 `jsdom` ，他们实现的足够多，就可以让我们快速的对于任何引用浏览器 APIs 的代码进行单元测试。其代价是，这些浏览器环境在实现上有局限性。例如，[jsdom 缺少相当数量的特性](https://github.com/jsdom/jsdom/issues?q=is%3Aissue+is%3Aopen+sort%3Acomments-desc)，诸如 `window.navigation` 或者布局引擎（ `offsetTop` 等）。

最后，与 Web Test Runner 相比，Cypress 更像是一个 IDE 而不是测试框架，因为你还可以在浏览器中看到真实呈现的组件，以及它的测试结果和日志。

Cypress 还一直在 [尝试将 Vite 集成进他们自己的产品中](https://www.youtube.com/watch?v=7S5cbY8iYLk)：使用 [Vitesse](https://github.com/antfu/vitesse) 重新构建他们的应用的 UI，并使用 Vite 来测试驱动他们项目的开发。

我们认为 Cypress 不是对业务代码进行单元测试好选择，但使用 Cypress（用于端对端和组件测试）配合 Vitest（用于非浏览器逻辑的单元测试）将满足你应用的测试需求。

## WebdriverIO

[WebdriverIO](https://webdriver.io/) 类似于 Cypress，一个基于浏览器的替代测试运行器和 Vitest 的补充工具。它可以用作端到端测试工具以及测试 [web 组件](https://webdriver.io/docs/component-testing)。它甚至在底层使用了 Vitest 的组件，例如对于组件测试中的 [mocking and stubing](https://webdriver.io/docs/mocksandspies/)。

WebdriverIO 具有与 Cypress 相同的优点，允许你在真实浏览器中测试逻辑。然而，它使用实际的[ web 标准](https://w3c.github.io/webdriver/)进行自动化，在运行 Cypress 测试时克服了一些权衡和限制。此外，它还允许你在移动设备上运行测试，使你可以在更多环境中测试应用。

## Web Test Runner

[@web/test-runner](https://modern-web.dev/docs/test-runner/overview/)在无头浏览器中运行测试，提供与 web 应用程序相同的执行环境，而无需模仿浏览器 API 或 DOM。这也使得使用 devtools 在真实的浏览器中进行调试成为可能，尽管没有像 Cypress 测试那样显示用于逐步完成测试的 UI。

要在 Vite 项目中使用 @web/test-runner，请使用[@remcovaes/web-test-runn-Vite-plugin](https://github.com/remcovaes/web-test-runner-vite-plugin)。@web/testrunner 不包括断言或模拟对象库，所以由你来添加它们。

## uvu

[uvu](https://github.com/lukeed/uvu) 是一个适用于 Node.js 和浏览器的测试运行器。它在单个线程中运行测试，因此测试不是隔离的，可能会跨文件泄漏。然而，Vitest 使用工作线程来隔离测试并并行运行它们。对于转换你的代码，uvu 依赖 require 和 loader 钩子。Vitest 使用 [Vite](https://vitejs.dev)，因此文件使用 Vite 的插件系统进行转换。在我们拥有 Vite 提供支持最常见 Web 工具（ TypeScript 、JSX 、最流行的 UI 框架）的世界中，uvu 代表了复杂性重复。如果你的应用由 Vite 提供支持，则配置和维护两个不同管道是不可接受的。使用 Vitest，你可以将开发、构建和测试环境的配置定义为一个单一的流程，并共享相同的插件和 `vite.config.js`。 uvu 不提供智能监视模式以重新运行更改后的测试, 而 Vitest 则通过默认监视模式使用 Vite 实时热更新 (HMR) 功能带给你惊人开发体验。 uvu 是运行简单测试快速选项, 但对于更复杂的测试和项目, Vitest 可能更快、更可靠。
