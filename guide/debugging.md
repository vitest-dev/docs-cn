---
title: Debugging | Guide
---

# 调试

## Terminal

在非集成开发环境下，为了调试一个测试文件，你可以使用 [`ndb`](https://github.com/GoogleChromeLabs/ndb)。仅仅在你的代码的任何位置添加一个 `debugger` 语句，然后运行 `ndb`：

```sh
# 全局安装 ndb
npm install -g ndb

# 或者使用 yarn
yarn global add ndb

# 在启用 debugger 的情况下运行测试
ndb npm run test
```

## VSCode

要在 VSCode 中调试测试文件，请创建以下启动配置。

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

## IntelliJ IDEA

创建一个 'Node.js' 运行配置。使用以下配置在调试模式下运行所有测试：

Setting | Value
 --- | ---
Working directory | /path/to/your-project-root
JavaScript file | ./node_modules/vitest/vitest.mjs
Application parameters | run --threads false

然后在调试模式下运行此配置。IDE 将在编辑器中设置的 JS/TS 断点处停止。
