---
title: 与其他测试框架对比 | 指南
---

# 与其他测试框架对比

## Jest

[Jest](https://jestjs.io/) 在测试框架领域占据了主导地位，因为它为大多数 JavaScript 项目提供开箱即用的支持，具备舒适的 API（`it` 和 `expect`），且覆盖了大多数测试的需求（例如快照、模拟和覆盖率）。我们感谢 Jest 团队和社区创建了一个令人愉悦的测试 API，并引入了许多已成为 Web 生态系统标准的测试模式。

在 Vite 项目中使用 Jest 是可能的。[@sodatea](https://twitter.com/haoqunjiang) 开发了 [vite-jest](https://github.com/sodatea/vite-jest#readme) ，旨在为 [Jest](https://jestjs.io/) 提供一流的 Vite 集成。[Jest 中最后的阻碍](https://github.com/sodatea/vite-jest/blob/main/packages/vite-jest/README.md#vite-jest)已经解决。因此，在 Vite 项目的单元测试中，Jest 仍是一个可用选项。

然而，在 [Vite](https://vitejs.dev) 已为最常见的 Web 工具（TypeScript、JSX、最流行的 UI 框架）提供了支持的情况下，引入 Jest 会增添不必要的复杂性。如果你的应用由 Vite 驱动，那么配置和维护两个不同的管道是不合理的。如果使用 Vitest，你可以在同一个管道中进行开发、构建和测试环境的配置，它们共享相同的插件和 `vite.config.js` 文件。

即使你的库没有使用 Vite（而是例如 esbuild 或 rollup），Vitest 也是一个有趣的选择，因为它可以让你更快地运行单元测试，并通过 Vite 的模块热重载（HMR）观察模式来提高开发体验。 Vitest 提供了对大多数 Jest API 和生态系统库的兼容性，因此在大多数项目中，它应该可以直接替换 Jest 使用。

## Cypress

[Cypress](https://www.cypress.io/) 是基于浏览器的测试工具，这对 Vitest 形成了补充。如果你想使用 Cypress，建议将 Vitest 用于测试项目中不依赖于浏览器的部分，而将 Cypress 用于测试依赖浏览器的部分。

Cypress 作为端到端测试工具而广为人知，但他们[最新的组件测试运行器](https://on.cypress.io/component) 对 Vite 项目的组件测试提供了很好的支持，并且是测试任何依赖于浏览器逻辑的代码的理想选择。

基于浏览器的测试框架，例如 Cypress, WebdriverIO 和 Web Test Runner，能捕获到 Vitest 无法捕获的问题，因为他们使用了真实的浏览器和浏览器 API。

Cypress 的测试更加专注于确定元素是否可见，是否可以访问和交互。Cypress 专门为 UI 开发和测试而构建，它的开发体验围绕于可见的组件。项目组件和测试报告一起出现，测试完成后，组件将保持交互状态，你可以使用浏览器开发工具调试发生的任何故障。

相比之下，Vitest 专注于为非浏览器逻辑提供最佳的、快速的开发体验。像 Vitest 这样的基于 Node.js 的测试框架支持各种实现部分浏览器环境的第三方包，例如 `jsdom` 。一般而言，它们能提供一个可用度足够高的浏览器环境，从而我们可以快速地对引使用了浏览器 API 的代码进行单元测试。然而，这些浏览器环境在实现上仍有一些局限性。例如，[jsdom 缺少相当数量的特性](https://github.com/jsdom/jsdom/issues?q=is%3Aissue+is%3Aopen+sort%3Acomments-desc)，诸如 `window.navigation` 或者布局引擎（ `offsetTop` 等）。

最后，与 Web Test Runner 相比，Cypress 更像是一个 IDE 而不是测试框架，因为你不仅能在浏览器中看到测试结果和日志，还可以看到真实呈现的组件。

Cypress 还一直致力于 [将 Vite 集成进他们自己的产品中](https://www.youtube.com/watch?v=7S5cbY8iYLk)：使用 [Vitesse](https://github.com/antfu/vitesse) 重新构建他们的 UI，并使用 Vite 来测试驱动他们项目的开发。

我们认为 Cypress 不是一个对非浏览器逻辑进行单元测试的好选择，但 Cypress（用于端对端和组件测试）与 Vitest（用于非浏览器逻辑的单元测试）配合能更好地满足测试需求。

## WebdriverIO

[WebdriverIO](https://webdriver.io/) 类似于 Cypress，作为一个基于浏览器的测试运行器，对 Vitest 形成补充。它可以进行端到端测试以及 [组件测试](https://webdriver.io/docs/component-testing)。它甚至在底层使用了 Vitest 的组件，例如对于组件测试中的 [mocking and stubing](https://webdriver.io/docs/mocksandspies/)。

WebdriverIO 具有与 Cypress 相同的优点，允许你在真实的浏览器中测试逻辑。不过，它使用实际的 [web 标准](https://w3c.github.io/webdriver/) 进行自动化，这相比于 Cypress 克服了一些权衡和限制。此外，它还允许你在移动设备上运行测试，从而可以在更多环境中测试应用。

## Web Test Runner

[@web/test-runner](https://modern-web.dev/docs/test-runner/overview/)在无头浏览器中运行测试，提供与 web 应用程序相同的执行环境，而无需模仿浏览器 API 或 DOM。这也使得使用 devtools 在真实的浏览器中进行调试成为可能，尽管它没有像 Cypress 那样展示一个指示测试进度的 UI。

要在 Vite 项目中使用 @web/test-runner，请使用[@remcovaes/web-test-runner-Vite-plugin](https://github.com/remcovaes/web-test-runner-vite-plugin)。@web/testrunner 不包括断言或模拟对象库，所以你需要自行添加它们。

## uvu

[uvu](https://github.com/lukeed/uvu) 是一个适用于 Node.js 和浏览器的测试运行器。它在单个线程中运行测试，因此测试不是隔离的，可能会在不同测试间泄漏。然而，Vitest 使用 Worker Threads 来隔离测试环境、并行运行它们。

uvu 使用 require 和 loader 钩子 进行代码转译，而 Vitest 使用 [Vite](https://vitejs.dev)，因此代码会使用 Vite 的插件系统进行转换。在 Vite 已为最常见的 Web 工具（TypeScript、JSX、最流行的 UI 框架）提供了支持的情况下，引入 uvu 会增添不必要的复杂性。如果你的应用由 Vite 驱动，那么配置和维护两个不同的管道是不合理的。如果使用 Vitest，你可以在同一个管道中进行开发、构建和测试环境的配置，它们共享相同的插件和 `vite.config.js` 文件。

uvu 不提供观察模式以在文件更改后重新运行测试, 而 Vitest 通过 Vite 的模块热重载（HMR）观察模式提供了更好的开发体验。

uvu 是运行简单测试的快速选项, 但对于更复杂的测试和项目, Vitest 可能更快、更可靠。
