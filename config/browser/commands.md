---
title: browser.commands | 配置
outline: deep
---

# browser.commands

- **类型:** `Record<string, BrowserCommand>`
- **默认值:** `{ readFile, writeFile, ... }`

<<<<<<< HEAD
可在浏览器测试中通过 `vitest/browser` 导入 [自定义命令](/api/browser/commands)。
=======
Custom [commands](/api/browser/commands) that can be imported during browser tests from `vitest/browser`.

::: warning Security
Commands run in the Vitest Node process. If a command exposes filesystem, process, network, database, or shell access based on browser-provided input, validate and restrict that input inside the command. Built-in file commands apply Vite `server.fs` checks and write-access checks, but custom commands are responsible for their own protections.

See [Custom Commands security notes](/api/browser/commands#custom-commands).
:::
>>>>>>> 95a42b873eceba8fb4b8c4636c7cb7e121d17102
