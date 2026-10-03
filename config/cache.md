---
title: cache | 配置
outline: deep
---

# cache <CRoot />

<<<<<<< HEAD
- **类型:** `false`
- **命令行终端:** `--no-cache`, `--cache=false`

使用此选项可禁用缓存功能。当前 Vitest 会缓存测试结果，以便优先运行耗时较长和失败的测试。
=======
- **Type:** `boolean`
- **Default:** `true`
- **CLI:** `--cache`, `--no-cache`

Store the results of test runs on the file system. Vitest uses them to run failed and longer test files first.

For every test file, Vitest stores whether the file failed, how long it ran and when it ran last. A run that did not execute the whole file (for example, a run filtered with [`--testNamePattern`](/config/testnamepattern) or cancelled by [`bail`](/config/bail)) can mark the file as failed, but it cannot mark it as passed.

You can delete the cache by running [`vitest --clearCache`](/guide/cli#clearcache).
>>>>>>> 9090f1432b6c7b03dcae1dfd84f09caaf62fb933

缓存目录由 Vite 的 [`cacheDir`](https://cn.vitejs.dev/config/shared-options.html#cachedir) 选项控制：

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

::: warning
The deprecated `cache.dir` option has no effect anymore. Use `cacheDir` to change the cache directory.
:::
