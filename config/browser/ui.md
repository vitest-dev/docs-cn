---
title: browser.ui | 配置
outline: deep
---

# browser.ui

- **类型:** `boolean`
- **类型:** `!browser.headless && !isCI`
- **命令行终端:** `--browser.ui=false`

<!-- TODO: translation -->

Should the browser UI be injected into the page. By default, injects UI iframe during development. See [Headless Mode and UI](/guide/browser/#headless-mode-and-ui) for how this option relates to [`browser.headless`](/config/browser/headless) and the top-level [`--ui`](/guide/ui) flag.
