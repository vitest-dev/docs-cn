---
title: browser.trackUnhandledErrors | 配置
outline: deep
---

# browser.trackUnhandledErrors

- **类型:** `boolean`
- **默认值:** `true`

启用未捕获错误和异常的追踪功能，以便 Vitest 能够报告这些错误。

如果需隐藏特定错误，建议改用 [`onUnhandledError`](/config/onunhandlederror) 配置项。

禁用此功能将完全移除所有 Vitest 错误处理器，有助于在调试选项开 “异常时暂停” 时进行问题排查。
