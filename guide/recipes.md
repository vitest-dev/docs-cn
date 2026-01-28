---
title: 技巧 | 指南
---

# 技巧 {#recipes}

## 对特定测试文件禁用隔离 {#disabling-isolation-for-specific-test-files-only}

为每个 `projects` 配置项设置 `isolate` 参数，禁用特定文件的隔离功能，从而加速测试运行速度。

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        // 禁用隔离的单元测试
        name: 'Unit tests',
        isolate: false,
        exclude: ['**.integration.test.ts'],
      },
      {
        // 集成隔离的测试
        name: 'Integration tests',
        include: ['**.integration.test.ts'],
      },
    ],
  },
})
```

## 并行与串行测试文件 {#parallel-and-sequential-test-files}

可以通过 `projects` 配置项，将测试文件划分为并行和串行两组：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        name: 'Parallel',
        exclude: ['**.sequential.test.ts'],
      },
      {
        name: 'Sequential',
        include: ['**.sequential.test.ts'],
        fileParallelism: false,
      },
    ],
  },
})
```
