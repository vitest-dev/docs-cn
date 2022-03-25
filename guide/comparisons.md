# 跟其他的测试框架进行比较

## Jest

[Jest](https://jestjs.io/zh-Hans/) 为大多数的JavaScript项目提供了开箱即用的测试支持，有着舒适的 API (例如 `it` 和 `expect`) 以及完整的大多数设置所需要的测试功能（例如 快照，模拟，覆盖）。我们十分感谢 Jest 团队和社区创建了完美的 API ，并且推动了许多 Web 生态系统中标准的测试模式，现在也可以在 Vite 中使用 Jest。[@蒋豪群](https://twitter.com/haoqunjiang)正在编写 [vite-jest](https://github.com/sodatea/vite-jest#readme)，准备提供一套完美跟 Vite 集成的 Jest，[Jest](https://github.com/sodatea/vite-jest/blob/main/packages/vite-jest/README.md#vite-jest) 中最后一个阻止测试也已经完成，所以这将会是一个比较不错的单元测试框架。然而，在我们将 [Vite](https://cn.vitejs.dev/) 作为常见的 Web 工具（TypeScript，JSX，常见的 UI 框架）所支持的工具里面，Jest 有着重复的复杂性。但是如果项目由 Vite 提供支持，那么配置和维护两个不同的容器是一件极其不合理的操作。使用 Vitest ,就可以将开发，构建和测试环境的配置定义为单个容器，使用同一个插件和 `vite.config.js` 。即使项目并不是由 Vite 提供支持（例如，使用了 esbuild 或者 rollup 进行构建的），那么 Vitest 也将会是一个有趣的选择，因为他可以让我们更快的运行单元测试并且在 DX 中跳跃，这都归功于默认的浏览模式中使用了 Vite 的热重载模块（HMR）。Vitest 与大多数 Jest API 和生态系统库都有较好的兼容性，因此在大多数项目中，我们应该可以无缝的将 Jest 替换成 Vitest 。


## Cypress

[Cypress](https://www.cypress.io/) 是基于浏览器的测试工具，也是 Vitest 的工具之一。如果你想使用 Cypress ，建议将 Vitest 用于项目中业务的测试，将 Cypress 用于基于浏览器的测试。

Cypress 被称为端到端的测试工具，然而他们新的[组件测试器](https://on.cypress.io/component)对测试 Vite 组件有着很好的支持，并且是测试在浏览器中呈现的任何内容的理想选择。

这是基于浏览器的运行测试框架，例如 Cypress 和 Web Test ，将捕获到 Vitest 无法捕捉到的问题，因为他们都是使用真实的浏览器和浏览器的 API 。

Cypress 的测试驱动程序更加专注于确定元素是否可见，是否可以访问和交互。Cypress 专门为 UI 开发和测试而构建，用 DX 进行测试程序的视觉组件，我们会看到程序的组件和测试报告一起出现。测试完成后，组件将保持交互状态，您可以使用浏览器开发工具调试发生的任何故障。

相比之下，Vitest 专注于为业务逻辑提供最佳的 DX 体验。像 Vitest 这样的基于节点的测试框架支持各种方法实现的浏览器环境，例如 `jsdom` ，他们实现的足够多，就可以让我们快速的对于任何引用浏览器 API 的代码进行单元测试。只需要对这些浏览器环境中存在的限制进行权衡即可。例如，[`jsdom` 缺少了许多功能](https://github.com/jsdom/jsdom/issues?q=is%3Aissue+is%3Aopen+sort%3Acomments-desc) ，比如 `window.navigation` 或者布局模块 (`offsetTop` 等)。

最后，与 Web Test Runner 相比，Cypress 更像是一个 IDE 而不是测试框架，因为您还可以在浏览器中看到真实呈现的组件，以及它的测试结果和日志。

Cypress 还一直在将 [Vite 集成到他们的产品](https://www.youtube.com/watch?v=7S5cbY8iYLk)中：使用 [Vitesse](https://github.com/antfu/vitesse) 重新构建他们的应用程序的 UI，并使用 Vite 来进行他们项目的开发。


我们认为 Cypress 不是测试单元业务代码的好选择，但使用 Cypress（用于端对端和组件测试）配合 Vitest（用于单元测试）将满足我们应用程序的测试需求。

## Web Test Runner

[@web/test-runner](https://modern-web.dev/docs/test-runner/overview/) 在浏览器进行测试，会提供与我们的 Web 应用程序相同的执行环境，从而不需要模拟浏览器的 API 和 DOM 。这也会让我们可以使用 devtools 在浏览器中进行调试成为了现实。虽然没有现实用于执行单元测试的 UI ，就像 Cypress 测试中那样。但是由浏览模式，但是不如 Vitest 智能，可能不会总是重新运行我们想运行的测试。要将 @web/test-runner 和 Vite 项目一起使用，有一个[插件](https://github.com/material-svelte/vite-web-test-runner-plugin)，尽管某些功能（例如在测试中更改视口大小）还[不能正常的工作](https://github.com/material-svelte/vite-web-test-runner-plugin/issues/11)。同时@web/test-runner 不包含断言或模拟库，因此我们需要自行添加它们。

## uvu

[uvu](https://github.com/lukeed/uvu) 是 [Node.js](https://github.com/nodejs/node) 和浏览器的测试框架。它会在单一的进程中进行测试，因此这个测试并不是孤立的，是可以跨文件进行测试。然而，Vitest 使用工作线程来隔离测试并且并发运行它们。为了转换我们的代码，uvu 依赖于 require 和 loader 方法。但是，Vitest 使用 [Vite](https://cn.vitejs.dev)，因此文件可以使用 Vite 插件系统的全部功能进行代码的转换。在我们将 [Vite](https://cn.vitejs.dev/) 作为常见的 Web 工具（TypeScript，JSX，常见的 UI 框架）所支持的工具里面，uvu 有着重复的复杂性。但是如果项目由 Vite 提供支持，那么配置和维护两个不同的容器是一件极其不合理的操作。使用 Vitest ,就可以将开发，构建和测试环境的配置定义为单个容器，使用同一个插件和 `vite.config.js` 。uvu 不提供智能浏览模式来重新运行更改的测试，但是 Vitest 为我们提供了惊人的 DX ，这都归功于默认的浏览模式中使用了 Vite 的热重载模块（HMR）。uvu 是运行简单测试的快速选项，但对于更复杂的测试和项目，Vitest 可以更快、更可靠。
