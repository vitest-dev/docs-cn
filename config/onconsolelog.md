---
title: onConsoleLog | 配置
outline: deep
---

# onConsoleLog <CRoot />

```ts
function onConsoleLog(
  log: string,
  type: 'stdout' | 'stderr',
  entity: TestModule | TestSuite | TestCase | undefined,
): boolean | void
```

用于自定义处理测试中调用的 `console` 方法。若返回 `false`，Vitest 将不会将该日志打印到控制台。Vitest 会忽略除 false 之外的其他假值。

此功能适用于过滤第三方库产生的日志。

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    onConsoleLog(log: string, type: 'stdout' | 'stderr'): boolean | void {
      return !(log === 'message from third party library' && type === 'stdout')
    },
  },
})
```
