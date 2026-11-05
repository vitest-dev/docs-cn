---
title: ui | 配置
outline: deep
---

# ui <CRoot />

<<<<<<< HEAD
- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--ui`, `--ui=false`

启用 [UI 模式](/guide/ui).
=======
- **Type:** `boolean | object`
- **Default:** `false`
- **CLI:** `--ui`, `--ui=false`

Enable [Vitest UI](/guide/ui). Setting `ui: true` is the same as `ui: { enabled: true }`.
>>>>>>> eb948575f5ffa8346112d64ab6f6522ee538b4e9

::: warning
此功能需要安装 [`@vitest/ui`](https://npmx.dev/package/@vitest/ui) 包。若尚未安装，Vitest 会在首次运行测试命令时自动安装。
:::

::: danger 安全警告
请确保你的 UI 模式的服务不暴露在公共网络中。自 Vitest 4.1 起，出于安全考虑，若将 [`api.host`](/config/api) 设置为非 `localhost` 地址，将自动禁用代码保存和测试运行按钮，使 UI 模式变为只读模式。
:::

## ui.enabled <Version type="experimental">5.0.4</Version> {#ui-enabled}

- **Type:** `boolean`
- **Default:** `false`

Enable [Vitest UI](/guide/ui).

## ui.theme <Version type="experimental">5.0.4</Version> {#ui-theme}

- **Type:** `'auto' | 'light' | 'dark'`
- **Default:** `'auto'`

The color theme of Vitest UI and of the [Browser Mode UI](/config/browser/ui). With `'auto'`, the UI follows the system preference and remembers the theme you toggle in the UI. With `'light'` or `'dark'`, the UI opens with this theme on every page load, and the toggle changes it only until the page reloads.

This option does not enable Vitest UI, so you can set it together with [`browser.ui`](/config/browser/ui):

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    ui: {
      theme: 'dark',
    },
    browser: {
      enabled: true,
      instances: [
        { browser: 'chromium' },
      ],
    }
  },
})
```
