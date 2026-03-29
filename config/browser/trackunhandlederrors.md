---
title: browser.trackUnhandledErrors | 配置
outline: deep
---

# browser.trackUnhandledErrors

- **类型:** `boolean`
- **默认值:** `true`

Enables tracking uncaught errors and exceptions so they can be reported by Vitest.

If you need to hide certain errors, it is recommended to use [`onUnhandledError`](/config/onunhandlederror) option instead.

Disabling this will completely remove all Vitest error handlers, which can help debugging with the "Pause on exceptions" checkbox turned on.
