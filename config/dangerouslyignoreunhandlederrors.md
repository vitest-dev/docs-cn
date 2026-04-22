---
title: dangerouslyIgnoreUnhandledErrors | 配置
outline: deep
---

# dangerouslyIgnoreUnhandledErrors <CRoot />

<<<<<<< HEAD
- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:**
=======
- **Type:** `boolean`
- **Default:** `false`
- **CLI:**
>>>>>>> 1f86109e54689db534e518c85a6a73daa82d5bcf
  - `--dangerouslyIgnoreUnhandledErrors`
  - `--dangerouslyIgnoreUnhandledErrors=false`

如果将此选项设为 `true`，即使存在未处理错误，Vitest 也不会导致测试运行失败。注意：内置报告器仍会显示这些错误。

如需按条件过滤特定错误，请改用 [`onUnhandledError`](/config/onunhandlederror) 回调函数。

## 示例 {#example}

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    dangerouslyIgnoreUnhandledErrors: true,
  },
})
```
