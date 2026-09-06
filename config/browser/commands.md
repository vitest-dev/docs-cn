---
title: browser.commands | 配置
outline: deep
---

# browser.commands

- **类型:** `Record<string, BrowserCommand>`
- **默认值:** `{ readFile, writeFile, ... }`

可在浏览器测试中通过 `vitest/browser` 导入 [自定义命令](/api/browser/commands)。

::: warning 安全性
命令在 Vitest 的 Node 进程中运行。如果一个命令基于浏览器提供的输入暴露了文件系统、进程、网络、数据库或 shell 访问权限，请在命令内部验证并限制该输入。内置的文件命令会应用 Vite 的 `server.fs` 检查和写入权限检查，但自定义命令需要自行负责其防护措施。

请参阅 [自定义命令安全性说明](/api/browser/commands#custom-commands)。
:::
