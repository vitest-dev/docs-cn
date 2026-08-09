---
title: fsModuleCachePath | 配置
outline: deep
---

# fsModuleCachePath <Version>5.0.0</Version>

- **类型:** `string`
- **默认值:** `'node_modules/.vitest-cache'`（从工作区根目录解析）
- **命令行终端:** `--fsModuleCachePath=<path>`

存储 [`fsModuleCache`](/config/fsmodulecache) 的目录。

可为每个项目单独设置此选项；未覆盖此选项的项目会降级使用根项目的缓存目录。整个工作区始终共享同一份锁文件元数据，并用它判断缓存是否失效。

默认情况下，Vitest 将缓存存储在工作区根目录的 `node_modules` 中。根目录根据包管理器的锁文件确定（例如 `.package-lock.json`、`.yarn-state.yml`、`.pnpm/lock.yaml` 等）。由于缓存保存在 `node_modules` 中，重新安装依赖项时缓存也会随之失效。

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    fsModuleCache: true,
    fsModuleCachePath: 'node_modules/.vitest-cache',
  },
})
```
