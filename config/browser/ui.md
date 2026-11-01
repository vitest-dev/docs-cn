---
title: browser.ui | 配置
outline: deep
---

# browser.ui

<<<<<<< HEAD
- **类型:** `boolean`
- **默认值:** `!isCI`
- **命令行终端:** `--browser.ui=false`

是否注入 UI 模式界面。默认情况下，在开发阶段会注入 UI iframe。
=======
- **Type:** `boolean`
- **Default:** `!browser.headless && !isCI`
- **CLI:** `--browser.ui=false`

Should the browser UI be injected into the page. By default, injects UI iframe during development. See [Headless Mode and UI](/guide/browser/#headless-mode-and-ui) for how this option relates to [`browser.headless`](/config/browser/headless) and the top-level [`--ui`](/guide/ui) flag.
>>>>>>> cc54eaf52775a7aaede1f9affab7dec045c6c71b
