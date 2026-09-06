---
title: ui | 配置
outline: deep
---

# ui <CRoot />

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--ui`, `--ui=false`

启用 [UI 模式](/guide/ui).

::: warning
此功能需要安装 [`@vitest/ui`](https://npmx.dev/package/@vitest/ui) 包。若尚未安装，Vitest 会在首次运行测试命令时自动安装。
:::

::: danger 安全警告
请确保你的 UI 模式的服务不暴露在公共网络中。自 Vitest 4.1 起，出于安全考虑，若将 [`api.host`](/config/api) 设置为非 `localhost` 地址，将自动禁用代码保存和测试运行按钮，使 UI 模式变为只读模式。
:::
