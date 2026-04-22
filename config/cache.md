---
title: cache | 配置
outline: deep
---

# cache <CRoot />

<<<<<<< HEAD
- **类型:** `false`
- **命令行终端:** `--no-cache`, `--cache=false`
=======
- **Type:** `false`
- **CLI:** `--no-cache`, `--cache=false`
>>>>>>> 1f86109e54689db534e518c85a6a73daa82d5bcf

使用此选项可禁用缓存功能。当前 Vitest 会缓存测试结果，以便优先运行耗时较长和失败的测试。

缓存目录由 Vite 的 [`cacheDir`](https://vitejs.dev/config/shared-options.html#cachedir) 选项控制：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  cacheDir: 'custom-folder/.vitest'
})
```

可通过 `process.env.VITEST` 将目录限制为仅 Vitest 使用：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  cacheDir: process.env.VITEST ? 'custom-folder/.vitest' : undefined
})
```
