---
title: detectAsyncLeaks | 配置
outline: deep
---

# detectAsyncLeaks

- **类型:** `boolean`
- **命令行终端:** `--detectAsyncLeaks`, `--detect-async-leaks`
- **默认值:** `false`

::: warning
启用此选项会显著降低测试运行速度。仅在调试或开发测试时使用。
:::

检测测试文件中泄漏的异步资源。
该功能使用 [`node:async_hooks`](https://nodejs.org/api/async_hooks.html) 来追踪异步资源的创建。如果资源未被清理，将在测试结束后记录相关日志。

例如，如果代码中存在 `setTimeout` 调用且其回调在测试结束后执行，将看到如下错误：

```sh
⎯⎯⎯⎯⎯⎯⎯⎯ Async Leaks 1 ⎯⎯⎯⎯⎯⎯⎯⎯

Timeout leaking in test/checkout-screen.test.tsx
 26|
 27|   useEffect(() => {
 28|     setTimeout(() => setWindowWidth(window.innerWidth), 150)
   |     ^
 29|   })
 30|
```

修复此问题，需确保正确清理定时器：

```js
useEffect(() => {
  setTimeout(setWindowWidth, 150, window.innerWidth) // [!code --]
  const timeout = setTimeout(setWindowWidth, 150, window.innerWidth) // [!code ++]

  return function cleanup() { // [!code ++]
    clearTimeout(timeout) // [!code ++]
  } // [!code ++]
})
```
