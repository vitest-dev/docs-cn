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

<!-- TODO: translation -->

In Browser Mode Vitest saves [annotation attachments](/guide/test-annotations), [artifacts](/api/advanced/artifacts) and [snapshots](/guide/snapshot) by receiving a WebSocket connection from the browser. This allows anyone who can connect to the API write any arbitrary code on your machine within the root of your project (configured by [`fs.allow`](https://vite.dev/config/server-options#server-fs-allow)). This option also gates privileged browser APIs that can write files indirectly, such as raw Chrome DevTools Protocol access through [`cdp()`](/api/browser/context#cdp).

::: danger 安全警告
Vitest 默认不会将 API 暴露到互联网，仅在 `localhost` 上监听。但如果 `host` 被手动暴露到网络，任何连接到它的人都可以在你的机器上运行任意代码，除非将 `api.allowWrite` 和 `api.allowExec` 设置为`false`。

如果 host 设置为 `localhost` 或 `127.0.0.1` 以外的任何值，Vitest 会默认将 `api.allowWrite` 和 `api.allowExec` 设置为 `false`。这意味着任何写入操作（例如 在 UI 模式中修改代码）将不起作用。如果你了解安全风险，可以覆盖这些设置。
:::

## api.allowExec <Version>4.1.0</Version> {#api-allowexec}

- **类型:** `boolean`
- **默认值:** `true` 表示未暴露在公共网络中，`false` 则表示已暴露

允许通过 API 运行任何测试文件。 This applies to the interactive elements (and the server code behind them) in the [UI](/guide/ui) that can run the code. This option also gates privileged browser APIs that can execute code indirectly, such as raw Chrome DevTools Protocol access through [`cdp()`](/api/browser/context#cdp).
