---
title: 按文件配置隔离 | 技巧
---

# 按文件配置隔离 {#per-file-isolation-settings}

默认情况下，每个测试文件都会在独立的模块图中运行，以避免一个文件的状态泄漏到另一个文件。不过，每个文件都进行隔离会增加初始化时间。对于确实需要隔离的集成测试，这种开销是值得的；而对于不共享可变状态的纯单元测试，则属于不必要的开销。

可以使用 [`projects`](/guide/projects) 为单元测试套件设置 [`isolate: false`](/config/isolate)，同时保持集成测试套件的隔离状态。

## 用法 {#pattern}

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          // 不隔离的单元测试
          name: 'Unit tests',
          isolate: false,
          exclude: ['**.integration.test.ts'],
        },
      },
      {
        test: {
          // 隔离的集成测试
          name: 'Integration tests',
          include: ['**.integration.test.ts'],
        },
      },
    ],
  },
})
```

## 需要隔离的情况 {#when-isolation-matters}

如果测试文件不存在以下情况，可以考虑关闭隔离：

- 修改模块级状态（计数器、缓存、顶层 `let` 绑定等）
- 调用 [`vi.stubGlobal`](/api/vi#vi-stubglobal) 或 [`vi.stubEnv`](/api/vi#vi-stubenv)
- 修改原型（`Date.prototype`、`Array.prototype` 等）
- 在 `process` 或其他长期存在的事件发送器上注册监听器
- 依赖新的模块实例来执行 `vi.mock` 工厂函数

如果存在上述任一情况，隔离机制就发挥着实际作用，应当保持启用。

## 验证是否安全 {#verifying-its-safe}

使用随机顺序连续运行两次测试套件，以便发现文件之间的状态污染：

```sh
vitest --shuffle --run --project='Unit tests'
vitest --shuffle --run --project='Unit tests'
```

如果两次运行的结果不同，说明测试依赖执行顺序。此时应修复相关测试，或为该文件保留隔离。

## 按执行池隔离 {#per-pool-isolation}

`isolate` 只对 [`threads`](/config/pool) 和 [`forks`](/config/pool) 执行池生效。无论该选项如何设置，`vmThreads` 和 `vmForks` 执行池始终以隔离模式运行，因为它们牺牲启动速度来换取更强的隔离保障。

## 相关链接 {#see-also}

- [`isolate`](/config/isolate)
- [测试项目](/guide/projects)
- [性能优化](/guide/improving-performance)
- [并行和串行测试文件](/guide/recipes/parallel-sequential)
