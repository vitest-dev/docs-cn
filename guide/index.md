---
title: 快速起步 | 指南
next:
  text: Writing Tests
  link: /guide/learn/writing-tests
---

# 快速起步 {#getting-started}

## 总览 {#overview}

Vitest（发音为 _"veetest"_） 是由 Vite 驱动的下一代测试框架。

你可以在 [为什么是 Vitest](/guide/why) 中了解有关该项目背后的基本原理的更多信息。

## 在线试用 Vitest {#trying-vitest-online}

你可以在 [StackBlitz](https://vitest.new) 上在线尝试 Vitest 。它直接在浏览器中运行 Vitest，它几乎与本地设置相同，但不需要在你的计算机上安装任何东西。

## 将 Vitest 安装到项目 {#adding-vitest-to-your-project}

<CourseLink href="https://vueschool.io/lessons/how-to-install-vitest?friend=vueuse">通过视频了解如何安装</CourseLink>

::: code-group

```bash [npm]
npm install -D vitest
```

```bash [yarn]
yarn add -D vitest
```

```bash [pnpm]
pnpm add -D vitest
```

```bash [bun]
bun add -D vitest
```

:::

:::tip 提示
Vitest 需要 Vite >=v6.0.0 和 Node >=v20.0.0
:::

如果在 `package.json` 中安装一份 `vitest` 的副本，可以使用上面列出的方法之一。然而，如果更倾向于直接运行 `vitest`，可以使用 `npx vitest`（`npx` 会随着 npm 和 Node.js 一起被安装）。

`npx` 是一个命令行工具，用于执行指定的命令。默认情况下，`npx` 会首先检查本地项目的二进制文件中是否存在该命令。如果在那里没有找到，`npx` 会在系统的 `$PATH` 中查找并执行该命令（如果找到的话）。如果两个位置都没有找到该命令，`npx` 会在执行之前将其安装在临时位置。
<!-- TODO: translation -->
Vitest and third party integrations can use `.vitest` directory to store generated artifacts. It's recommended to add this in your `.gitignore`.

``` sh [.gitignore]
# Vitest reports and artifacts
.vitest/
```

## 编写测试 {#writing-tests}

例如，我们将编写一个简单的测试来验证将两个数字相加的函数的输出。

``` js [sum.js]
export function sum(a, b) {
  return a + b
}
```

``` js [sum.test.js]
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

::: tip 提示
一般情况下，执行测试的文件名中必须包含 `.test.` 或 `.spec.`。
:::

接下来，为了执行测试，请将以下部分添加到你的 `package.json` 文件中：

```json [package.json]
{
  "scripts": {
    "test": "vitest"
  }
}
```

最后，运行 `npm run test`、`yarn test` 或 `pnpm test`，具体取决于你的包管理器，Vitest 将打印此消息：

```txt
✓ sum.test.js (1)
  ✓ adds 1 + 2 to equal 3

Test Files  1 passed (1)
     Tests  1 passed (1)
  Start at  02:15:44
  Duration  311ms
```

::: warning 警告
如果使用 Bun 作为软件包管理器，请确保使用 `bun run test` 命令而不是 `bun test` 命令，否则 Bun 将运行自己的测试运行程序。
:::

Your first test is passing! Continue to [Writing Tests](/guide/learn/writing-tests) to learn about organizing tests, reading test output, and the core testing patterns you'll use every day.

To run tests once without watching for file changes, use `vitest run`. You can also pass additional flags like `--reporter` or `--coverage`. For a full list of CLI options, run `npx vitest --help` or see the [CLI guide](/guide/cli).

## 配置 Vitest {#configuring-vitest}

Vitest reads your `vite.config.*` by default, so your existing Vite plugins and configuration work out-of-the-box. You can also create a dedicated `vitest.config.*` for test-specific settings. See the [Config Reference](/config/) for details.

## IDE 集成 {#ide-integrations}

我们还提供了官方的 Visual Studio Code 扩展，以增强你使用 Vitest 的测试体验。

[从 VS Code 插件市场进行安装](https://marketplace.visualstudio.com/items?itemName=vitest.explorer)

了解更多有关 [IDE 插件](/guide/ide) 的更多信息

## 示例 {#examples}

| 示例 | 源代码 | 演练场 |
|---|---|---|
| `basic` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/basic) | [在线演示](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/basic?initialPath=__vitest__/) |
| `fastify` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/fastify) | [在线演示](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/fastify?initialPath=__vitest__/) |
| `in-source-test` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/in-source-test) | [在线演示](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/in-source-test?initialPath=__vitest__/) |
| `lit` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/lit) | [在线演示](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/lit?initialPath=__vitest__/) |
| `vue` | [GitHub](https://github.com/vitest-tests/browser-examples/tree/main/examples/vue) | [在线演示](https://stackblitz.com/fork/github/vitest-tests/browser-examples/tree/main/examples/vue?initialPath=__vitest__/) |
| `marko` | [GitHub](https://github.com/vitest-tests/browser-examples/tree/main/examples/marko) | [在线演示](https://stackblitz.com/fork/github/vitest-tests/browser-examples/tree/main/examples/marko?initialPath=__vitest__/) |
| `preact` | [GitHub](https://github.com/vitest-tests/browser-examples/tree/main/examples/preact) | [在线演示](https://stackblitz.com/fork/github/vitest-tests/browser-examples/tree/main/examples/preact?initialPath=__vitest__/) |
| `qwik` | [GitHub](https://github.com/vitest-tests/browser-examples/tree/main/examples/qwik) | [在线演示](https://stackblitz.com/fork/github/vitest-tests/browser-examples/tree/main/examples/qwik?initialPath=__vitest__/) |
| `react` | [GitHub](https://github.com/vitest-tests/browser-examples/tree/main/examples/react) | [在线演示](https://stackblitz.com/fork/github/vitest-tests/browser-examples/tree/main/examples/react?initialPath=__vitest__/) |
| `solid` | [GitHub](https://github.com/vitest-tests/browser-examples/tree/main/examples/solid) | [在线演示](https://stackblitz.com/fork/github/vitest-tests/browser-examples/tree/main/examples/solid?initialPath=__vitest__/) |
| `svelte` | [GitHub](https://github.com/vitest-tests/browser-examples/tree/main/examples/svelte) | [在线演示](https://stackblitz.com/fork/github/vitest-tests/browser-examples/tree/main/examples/svelte?initialPath=__vitest__/) |
| `profiling` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/profiling) | 暂无 |
| `typecheck` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/typecheck) | [在线演示](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/typecheck?initialPath=__vitest__/) |
| `projects` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/projects) | [在线演示](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/projects?initialPath=__vitest__/) |

## 社区 {#community}

如果你有疑问或者需要帮助，可以到 [Discord](https://chat.vitest.dev) 和 [GitHub Discussions](https://github.com/vitest-dev/vitest/discussions) 社区来寻求帮助。
