---
title: api | 配置
outline: deep
---

# api

- **类型:** `boolean | number | object`
- **默认值:** `false`
- **命令行终端:** `--api`, `--api.port`, `--api.host`, `--api.strictPort`

监听端口并提供 API 服务，用于 [UI 模式](/guide/ui) 或 [浏览器服务](/guide/browser/)。设为 `true` 时，默认端口为 `51204`，如果在浏览器模式下运行，则为 `63315`。

## api.allowWrite <Version>4.1.0</Version> {#api-allowwrite}

- **类型:** `boolean`
- **默认值:** `true` 表示未暴露在公共网络中，`false` 则表示已暴露

Vitest 服务器可以通过 API 保存测试文件或快照文件。这意味着任何能连接到 API 的人都可以在你的机器上运行任意代码。

在浏览器模式下，Vitest 通过接收来自浏览器的 WebSocket 连接来保存 [注解附件](/guide/test-annotations)、[产物](/api/advanced/artifacts) 和 [快照](/guide/snapshot)。这使得任何能够连接到 API 的人都可以在你机器上的项目根目录（由 [`fs.allow`](https://cn.vite.dev/config/server-options#server-fs-allow) 配置）内写入任意代码。此选项还会限制可间接写入文件的特权浏览器 API，例如通过 [`cdp()`](/api/browser/context#cdp) 直接访问 Chrome DevTools Protocol。

::: danger 安全警告
Vitest 默认不会将 API 暴露到互联网，仅在 `localhost` 上监听。但如果 `host` 被手动暴露到网络，任何连接到它的人都可以在你的机器上运行任意代码，除非将 `api.allowWrite` 和 `api.allowExec` 设置为 `false`。

如果 host 设置为 `localhost` 或 `127.0.0.1` 以外的任何值，Vitest 会默认将 `api.allowWrite` 和 `api.allowExec` 设置为 `false`。这意味着任何写入操作（例如 在 UI 模式中修改代码）将不起作用。如果你了解安全风险，可以覆盖这些设置。
:::

## api.allowExec <Version>4.1.0</Version> {#api-allowexec}

<<<<<<< HEAD
- **类型:** `boolean`
- **默认值:** `true` 表示未暴露在公共网络中，`false` 则表示已暴露

允许通过 API 运行任何测试文件。适用于 [UI 模式](/guide/ui) 中能够运行代码的交互元素（以及其背后的服务端代码）。此选项还会限制可间接执行代码的特权浏览器 API，例如通过 [`cdp()`](/api/browser/context#cdp) 直接访问 Chrome DevTools Protocol。
=======
- **Type:** `boolean`
- **Default:** `true` if not exposed to the network, `false` otherwise

Allows running any test file via the UI. This applies to the interactive elements (and the server code behind them) in the [UI](/guide/ui) that can run the code. In Browser Mode, this option also gates indirect code execution, including evaluating external `.snap` files on the server and accessing raw Chrome DevTools Protocol through [`cdp()`](/api/browser/context#cdp).
>>>>>>> a41164cabca74cb90d641ff5b118fa10f2190094
