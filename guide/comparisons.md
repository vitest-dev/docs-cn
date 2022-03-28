# 跟其他的测试框架进行对比

## Jest

[Jest](https://jestjs.io/zh-Hans/) 为大多数的 JavaScript 项目提供了开箱即用的测试支持，有着舒适的 API (例如 `it` 和 `expect`) 以及大多数所需要的全套测试功能（例如快照，对象模拟，代码测试覆盖率）。我们十分感谢 Jest 团队和社区创建了完美的 API ，并推动了很多测试模式的发展，这些模式现在已经成为 Web 生态系统的标准。现在也可以在 Vite 中使用 Jest，[@蒋豪群](https://twitter.com/haoqunjiang)正在编写 [vite-jest](https://github.com/sodatea/vite-jest#readme)，准备提供一套完美跟 Vite 集成的 Jest，[Jest 中最后一个障碍](https://github.com/sodatea/vite-jest/blob/main/packages/vite-jest/README.md#vite-jest)已经解决，所以这将会你单元测试框架中的一个选择。然而，在我们将 [Vite](https://cn.vitejs.dev/) 作为常见的 Web 工具（TypeScript，JSX，流行的 UI 框架）所支持的工具里面，Jest 有着重复的复杂性。但是你的项目由 Vite 驱动，那么配置和维护两个不同的容器是一件极其不合理的操作。使用 Vitest，你就可以将开发，构建和测试环境的配置定义为单个容器，共享相同的插件和 `vite.config.js` 。即使项目并不是由 Vite 提供支持（例如，使用了 esbuild 或者 rollup 进行构建），Vitest 也将会是一个有趣的选择，因为它为你的单元测试提供更快的运行速度，并且由于使用 Vite 即时热模块重载（HMR）的默认监听模式，你的开发体验将会有飞跃的提升。Vitest 与大多数 Jest API 和生态系统库都有较好的兼容性，因此在大多数项目中，我们应该可以无缝的将 Jest 替换成 Vitest 。


## Cypress

[Cypress](https://www.cypress.io/) 是基于浏览器的测试工具，是 Vitest 的补充工具之一。如果你想使用 Cypress，建议将 Vitest 用于测试项目中非浏览器逻辑，将 Cypress 用于测试依赖浏览器的逻辑。

Cypress是著名的端到端测试工具，他们新的[组件测试器](https://on.cypress.io/component)对测试 Vite 组件有很好的支持，是测试任何在浏览器中渲染的东西的理想选择。

基于浏览器运行测试的框架，例如 Cypress 和 Web Test，会捕获到 Vitest 无法捕获的问题，因为他们都是使用真实的浏览器和 API 。

Cypress 的测试更加专注于确定元素是否可见，是否可以访问和交互。Cypress 专门为 UI 开发和测试而构建，它的开发体验趋向于测试你的视觉组件，你会看到程序的组件和测试报告一起出现。测试完成后，组件将保持交互状态，您可以使用浏览器开发工具调试发生的任何故障。

相比之下，Vitest 专注于为非浏览器逻辑提供最佳的开发体验。像 Vitest 这样的基于节点的测试框架支持各种实现部分浏览器环境的第三方包，例如 `jsdom`，他们实现的足够多，就可以让我们快速的对于任何引用浏览器 API 的代码进行单元测试。其代价是，这些浏览器环境在实现上有局限性。例如，[`jsdom` 缺少了一些功能](https://github.com/jsdom/jsdom/issues?q=is%3Aissue+is%3Aopen+sort%3Acomments-desc) ，诸如 `window.navigation` 或者布局引擎 (`offsetTop` 等)。

最后，与 Web Test Runner 相比，Cypress 更像是一个 IDE 而不是测试框架，因为您还可以在浏览器中看到真实呈现的组件，以及它的测试结果和日志。

Cypress 还一直在将 [Vite 集成到他们的产品](https://www.youtube.com/watch?v=7S5cbY8iYLk)中：使用 [Vitesse](https://github.com/antfu/vitesse) 重新构建他们的应用程序的 UI，并使用 Vite 来测试驱动他们项目的开发。

我们认为 Cypress 不是对业务代码进行单元测试好选择，但使用 Cypress（用于端对端和组件测试）配合 Vitest（用于非浏览器逻辑的单元测试）将满足你应用程序的测试需求。

## Web Test Runner

[@web/test-runner](https://modern-web.dev/docs/test-runner/overview/) 在无头浏览器中进行测试，提供与你的 Web 应用程序相同的运行环境，而不需要模拟浏览器的 API 和 DOM 。虽然没有像 Cypress 那样显示用于单步执行测试的 UI，但也使得我们可以使用 devtools 在浏览器中进行调试。@web/test-runner 有一个监听模式，但是不如 Vitest 智能，而且有时候不一定运行你想要的那个测试。要在 Vite 项目中使用 @web/test-runner，有一个[插件](https://github.com/material-svelte/vite-web-test-runner-plugin)，尽管某些功能（例如在测试中更改视口大小）还[不能正常的工作](https://github.com/material-svelte/vite-web-test-runner-plugin/issues/11)。同时 @web/test-runner 不包含断言或对象模拟库，因此要靠你自己来添加它们。

## uvu

[uvu](https://github.com/lukeed/uvu) 是用于 Node.js 和浏览器的测试框架。它在单线程中进行测试，所以测试没有被隔离，可以跨文件测试，而 Vitest 使用 Worker 线程来隔离测试并且并发运行它们。为了转换我们的代码，uvu 依赖于 require 和 loader 方法。但是 Vitest 使用 [Vite](https://cn.vitejs.dev)，因此文件可以使用 Vite 插件系统的全部功能进行代码的转换。在我们将 [Vite](https://cn.vitejs.dev/) 作为常见的 Web 工具（TypeScript，JSX，常见的 UI 框架）所支持的工具里面，uvu 有着重复的复杂性。但是如果项目由 Vite 提供支持，那么配置和维护两个不同的容器是一件极其不合理的操作。使用 Vitest，就可以将开发、构建和测试环境的配置定义为单个容器，共享插件和 `vite.config.js` 。uvu 不提供智能监听模式来重新运行已更改的测试，但 Vitest 为你提供了惊人开发体验，这都归功于默认的监听模式中使用了 Vite 的即时热重载模块（HMR）。uvu 是运行简单测试的快速选项，但对于更复杂的测试和项目，Vitest 可以更快、更可靠。
