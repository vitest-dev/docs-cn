---
title: disableConsoleIntercept | 配置
outline: deep
---

# disableConsoleIntercept

- **类型:** `boolean`
- **命令行终端:** `--disableConsoleIntercept`
- **默认值:** `false`

默认情况下，Vitest 会在测试期间自动拦截控制台日志，在拦截过程中添加测试文件和测试标题之类的上下文信息。

在 [浏览器测试](/guide/browser/) 必须启用这种拦截机制，才能将浏览器开发者工具中的日志转发到终端。

禁用控制台拦截适用于正常的同步终端日志记录的形式来调试代码的场景。
