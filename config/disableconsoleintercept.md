---
title: disableConsoleIntercept | 配置
outline: deep
---

# disableConsoleIntercept

- **类型:** `boolean`
- **命令行终端:** `--disableConsoleIntercept`
- **默认值:** `false`
<!-- TODO: translation -->
By default, Vitest intercepts console output during tests to add context such as the test file and test title.

In [browser mode](/guide/browser/), this interception is required to forward logs from the browser DevTools to the terminal. It is also required for console log previews in the Vitest UI.

Disabling console interception can be useful when you want to debug code with normal synchronous terminal logging.
