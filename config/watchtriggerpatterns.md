---
title: watchTriggerPatterns | 配置
outline: deep
---

# watchTriggerPatterns <CRoot /> <Version>3.2.0</Version>

- **类型:** `WatcherTriggerPattern[]`

Vitest 基于由静态和动态 `import` 语句填充的模块依赖图来重新运行测试。但是，如果你从文件系统读取或从代理获取，Vitest 无法检测这些依赖关系。

要触发相关测试重新运行，你可以定义一个正则表达式模式和一个返回要运行的测试文件列表的函数。

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watchTriggerPatterns: [
      {
        pattern: /src\/(mailers|templates)\/(.*)\.(ts|html|txt)$/,
        testsToRun: (id, match) => {
          // 相对于根路径
          return `./api/tests/mailers/${match[2]}.test.ts`
        },
      },
    ],
  },
})
```

::: warning
返回的文件应该是绝对路径或相对于根目录的相对路径。注意这是一个全局选项，不能在 [project](/guide/projects) 配置中使用。
:::
