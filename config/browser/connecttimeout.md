---
title: browser.connectTimeout | 配置
outline: deep
---

# browser.connectTimeout

- **类型:** `number`
- **默认值:** `60_000`

连接超时时间（毫秒）。如果浏览器连接耗时超过此阈值，测试套件将判定为运行失败。

::: info
此超时设置针对浏览器与 Vitest 服务器建立 WebSocket 连接的耗时。正常情况下，不会触发此超时限制。
:::
