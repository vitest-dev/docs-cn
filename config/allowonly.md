---
title: allowOnly | 配置
outline: deep
---

# allowOnly

<<<<<<< HEAD
- **类型:**: `boolean`
- **默认值:**: `!process.env.CI`
- **命令行终端:** `--allowOnly`, `--allowOnly=false`
=======
- **Type:** `boolean`
- **Default:** `!process.env.CI`
- **CLI:** `--allowOnly`, `--allowOnly=false`
>>>>>>> 1f86109e54689db534e518c85a6a73daa82d5bcf

默认情况下，Vitest 不允许在持续集成（CI）环境中运行带有 [`only`](/api/test#test-only) 标记的测试。相反，在本地开发环境中，Vitest 允许运行这些测试。

::: info
Vitest 使用 [`std-env`](https://npmx.dev/package/std-env) 包来检测环境。
:::

你可以通过显式设置 `allowOnly` 选项为 `true` 或 `false` 来自定义此行为。

::: code-group
```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    allowOnly: true,
  },
})
```
```bash [CLI]
vitest --allowOnly
```
:::

启用时，即使检测到带有 [`only`](/api/test#test-only) 标记的测试，Vitest 也不会导致测试套件失败，包括在 CI 环境中。

禁用时时，如果检测到带有 [`only`](/api/test#test-only) 标记的测试，Vitest 将导致测试套件失败，包括在本地开发环境中。
