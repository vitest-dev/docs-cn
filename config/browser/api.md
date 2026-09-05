---
title: browser.api | 配置
outline: deep
---

# browser.api

- **类型:** `number | object`
- **默认值:** `63315`
- **命令行终端:** `--browser.api=63315`, `--browser.api.port=1234, --browser.api.host=example.com`

配置用于在浏览器中提供代码的 Vite 服务器选项。不影响 [`test.api`](/config/api) 配置。默认情况下，Vitest 会分配 `63315` 端口以避免与开发服务器冲突，从而实现两者并行运行。

## api.allowWrite <Version>4.1.0</Version> {#api-allowwrite}

- **类型:** `boolean`
- **默认值:** 未暴露公网时默认为 `true`，否则为 `false`

Vitest 通过接收来自浏览器的 WebSocket 连接来保存 [测试注解](/guide/test-annotations)、[测试产物](/api/advanced/artifacts) 和 [快照](/guide/snapshot)。这意味着任何能连接到该 API 的人都可在你机器的项目根目录（由 [`fs.allow`](https://cn.vite.dev/config/server-options#server-fs-allow) 配置）内执行任意代码。此选项也限制了可以间接写入文件的特权浏览器 API，例如通过 [`cdp()`](/api/browser/context#cdp) 进行的原始 Chrome DevTools 协议访问。

当浏览器服务器未暴露至互联网（主机为 `localhost`）时，默认值设为 `true` 不会构成安全隐患。若你修改了主机配置，Vitest 将默认将 `allowWrite` 设为 `false` 以防止潜在的恶意写入风险。

## api.allowExec <Version>4.1.0</Version> {#api-allowexec}

- **类型:** `boolean`
- **默认值:** 未暴露至公网时默认为 `true`，否则为 `false`

允许通过 [UI 模式](/guide/ui) 运行任意测试文件。此配置仅作用于界面交互元素（及其背后的服务端代码）的可执行权限。如果 UI 模式被禁用，则该配置不生效。此选项也限制了可以间接写入文件的特权浏览器 API，例如通过 [`cdp()`](/api/browser/context#cdp) 进行的原始 Chrome DevTools 协议访问。更多信息请参阅 [`api.allowExec`](/config/api#api-allowexec)。
