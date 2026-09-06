---
title: 并行和串行测试文件 | 技巧
---

# 并行和串行测试文件 {#parallel-and-sequential-test-files}

多数测试文件互不依赖，并行执行会更快。但有少数测试文件会共享独占资源，例如固定端口、可写的临时目录，或未按测试隔离的数据库。如果其他测试与它们并行运行，这些测试就容易出现不稳定的结果。

全局禁用并行会拖慢测试套件中的所有测试。可以将测试套件拆分为两个 [`projects`](/guide/projects)，一个并行运行，另一个串行运行。这样只有需要串行执行的文件会受到性能影响。

## 用法 {#pattern}

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'Parallel',
          exclude: ['**.sequential.test.ts'],
        },
      },
      {
        test: {
          name: 'Sequential',
          include: ['**.sequential.test.ts'],
          fileParallelism: false,
        },
      },
    ],
  },
})
```

在项目级别设置 [`fileParallelism: false`](/config/fileparallelism) 后，匹配的文件会依次运行，而测试套件中的其他文件仍可并行执行。该设置是 [`maxWorkers: 1`](/config/maxworkers) 的简写，两者作用相同。

## 在并行测试后运行串行测试 {#run-sequential-after-parallel}

默认情况下，项目之间会并行运行。因此，串行项目的第一个文件可能与仍持有相同资源的并行文件重叠。使用 [`sequence.groupOrder`](/config/sequence#sequence-grouporder) <Version>3.2.0</Version> 可以强制并行批次先运行完毕：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'Parallel',
          exclude: ['**.sequential.test.ts'],
          sequence: { groupOrder: 0 },
        },
      },
      {
        test: {
          name: 'Sequential',
          include: ['**.sequential.test.ts'],
          fileParallelism: false,
          sequence: { groupOrder: 1 },
        },
      },
    ],
  },
})
```

并行批次完成后，串行批次才会开始。总耗时大致等于并行批次的耗时加上串行测试的累计耗时。

## 文件级与测试级作用域 {#file-scope-vs-test-scope}

Vitest 中有两个用于控制“并行”的控制方式，请不要混淆：

| 范围     | 控制方式                                     | 控制内容                                 |
| -------- | -------------------------------------------- | ---------------------------------------- |
| 跨文件   | [`fileParallelism`](/config/fileparallelism) | 两个测试 _文件_ 是否在并行 worker 中运行 |
| 文件内部 | `describe.concurrent`/`test.concurrent`      | 同一文件中的测试是否并行运行             |

`fileParallelism: false` 不会让文件内的测试并行执行；默认情况下，文件内的测试会按顺序运行。同样，在 `describe` 或 `test` 上使用 `concurrent` 也不会影响测试文件的调度方式。

## 相关链接 {#see-also}

- [`fileParallelism`](/config/fileparallelism)
- [`maxWorkers`](/config/maxworkers)
- [`sequence.groupOrder`](/config/sequence#sequence-grouporder)
- [并行执行](/guide/parallelism)
- [测试项目](/guide/projects)
- [按文件配置隔离](/guide/recipes/disable-isolation)
