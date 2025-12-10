---
title: 调试 | 指南
---

# 调试 {#debugging}

## 终端 {#terminal}

在非集成开发环境下，为了调试一个测试文件，你可以使用 [`ndb`](https://github.com/GoogleChromeLabs/ndb)。仅仅在你的代码的任何位置添加一个 `debugger` 语句，然后运行 `ndb`：

```sh
# 全局安装 ndb
npm install -g ndb

# 或者使用 yarn
yarn global add ndb

# 在启用 debugger 的情况下运行测试
ndb npm run test
```

:::tip
在调试测试时，你可能需要使用以下选项：

- [`--test-timeout=0`](/guide/cli#testtimeout) 以防止测试在断点处停止时超时
- [`--no-file-parallelism`](/guide/cli#fileparallelism) 以防止测试文件并行运行
:::

## VS Code

在 VSCode 中快速调试测试的方法是通过 `JavaScript Debug Terminal` 。打开一个新的 `JavaScript Debug Terminal` 并直接运行 `npm run test` 或 `vitest` 。*这适用于在 Node 中运行的任何代码，因此将适用于大多数 JS 测试框架*。

![image](https://user-images.githubusercontent.com/5594348/212169143-72bf39ce-f763-48f5-822a-0c8b2e6a8484.png)

你还可以添加专用启动配置以在 VSCode 中调试测试文件:

```json
{
  // 想了解更多的信息, 请访问：https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Current Test File",
      "autoAttachChildProcesses": true,
      "skipFiles": ["<node_internals>/**", "**/node_modules/**"],
      "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
      "args": ["run", "${relativeFile}"],
      "smartStep": true,
      "console": "integratedTerminal"
    }
  ]
}
```

然后在调试选项卡中确保选择 'Debug Current Test File'，然后你可以打开要调试的测试文件并按 F5 开始调试。

### 浏览器模式 {#browser-mode}

要调试 [Vitest 浏览器模式](/api/browser/index.md)，请在 CLI 中传递 `--inspect` 或 `--inspect-brk`，或在 Vitest 配置中定义它：

::: code-group
```bash [CLI]
vitest --inspect-brk --browser --no-file-parallelism
```
```ts [vitest.config.js]
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    inspectBrk: true,
    fileParallelism: false,
    browser: {
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    },
  },
})
```
:::

默认情况下，Vitest 将使用端口 `9229` 作为调试端口。您可以通过在 `--inspect-brk`中传递值来覆盖它：

```bash
vitest --inspect-brk=127.0.0.1:3000 --browser --no-file-parallelism
```

使用以下 [VSCode 复合配置](https://code.visualstudio.com/docs/editor/debugging#_compound-launch-configurations) 在浏览器中启动 Vitest 并附加调试器：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Run Vitest Browser",
      "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
      "console": "integratedTerminal",
      "args": ["--inspect-brk", "--browser", "--no-file-parallelism"]
    },
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach to Vitest Browser",
      "port": 9229
    }
  ],
  "compounds": [
    {
      "name": "Debug Vitest Browser",
      "configurations": ["Attach to Vitest Browser", "Run Vitest Browser"],
      "stopAll": true
    }
  ]
}
```

## IntelliJ IDEA

创建一个 [vitest](https://www.jetbrains.com/help/idea/vitest.html#createRunConfigVitest) 运行配置。使用以下配置在调试模式下运行所有测试：

| 配置参数                 | 设置值                              |
| ---------------------- | ---------------------------------- |
| Working directory      | `/path/to/your-project-root`       |

然后在调试模式下运行此配置。IDE 将在编辑器中设置的 JS/TS 断点处停止。

## Node 解释器, 例如 Chrome开发者工具 {#node-inspector-e-g-chrome-devtools}

Vitest 还支持在没有 IDE 的情况下调试测试。然而，这要求测试不是并行运行的。可以使用以下命令之一启动 Vitest。

```sh
# To run in a single worker
vitest --inspect-brk --no-file-parallelism

# 使用浏览器模式运行测试
vitest --inspect-brk --browser --no-file-parallelism
```

Once Vitest starts it will stop execution and wait for you to open developer tools that can connect to [Node.js inspector](https://nodejs.org/en/docs/guides/debugging-getting-started/). You can use Chrome DevTools for this by opening `chrome://inspect` on browser.

In watch mode you can keep the debugger open during test re-runs by using the `--isolate false` options.
