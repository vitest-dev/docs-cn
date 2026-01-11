---
title: resolveSnapshotPath | Config
outline: deep
---

# resolveSnapshotPath <CRoot />

- **类型**: `(testPath: string, snapExtension: string, context: { config: SerializedConfig }) => string`
- **默认值**: 将快照文件存储在 `__snapshots__` 目录中

覆盖默认的快照路径。例如，将快照文件与测试文件存放在同一目录下：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
  },
})
```

你还可以使用 `context` 参数来访问项目的序列化配置。当你配置了多个 [项目](/guide/projects) 并希望根据项目名称将快照存储在不同位置时，这很有用：

```ts
import { basename, dirname, join } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    resolveSnapshotPath(testPath, snapExtension, context) {
      return join(
        dirname(testPath),
        '__snapshots__',
        context.config.name ?? 'default',
        basename(testPath) + snapExtension,
      )
    },
  },
})
```
