---
title: disableConsoleIntercept | 配置
outline: deep
---

# disableConsoleIntercept

- **类型:** `boolean`
- **命令行终端:** `--disableConsoleIntercept`
- **默认值:** `false`

默认情况下，Vitest 会在测试期间自动拦截控制台日志，以便为测试文件、测试标题等添加额外格式。

该功能也是 UI 模式控制台日志预览的必要条件。

不过，当你想要使用正常的同步终端控制台日志来调试代码时，禁用这种拦截可能会有帮助。

::: warning
此选项对 [浏览器测试](/guide/browser/) 无效，因为 Vitest 会保留浏览器开发者工具中的原始日志记录。
:::
