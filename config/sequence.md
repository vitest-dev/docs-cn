---
title: sequence | 配置
outline: deep
---

# sequence

- **类型:** `{ sequencer?, shuffle?, seed?, hooks?, setupFiles?, groupOrder }`

控制测试排序方式的选项。

你可以通过点符号在 CLI 中提供排序选项：

```sh
npx vitest --sequence.shuffle --sequence.seed=1000
```

## sequence.sequencer <CRoot />

- **类型:** `TestSequencerConstructor`
- **默认值:** `BaseSequencer`

自定义类，用于定义分片和排序方法。如果只需重定义 `sort` 或 `shard` 其中一种方法，可从 `vitest/node` 扩展 `BaseSequencer` 基类，但需确保两个方法同时存在。

分片操作会在排序之前执行，且仅在提供 `--shard` 选项时触发。

如果指定了 [`sequence.groupOrder`](#sequence-grouporder)，该排序器会针对每个测试组和测试池各调用一次。

## sequence.groupOrder

- **类型:** `number`
- **默认值:** `0`

控制在使用多个 [项目](/guide/projects) 环境时，当前项目的测试执行顺序。

- 使用相同组顺序编号的项目，会作为一组一起运行，各组按编号从低到高依次执行。
- 如果不设置此选项，所有项目并行运行。
- 如果多个项目使用相同的组顺序编号，它们将同时运行。

该设置仅影响项目间的执行顺序，不改变项目内部测试的排序。
如需控制测试隔离性或项目内测试顺序，请使用 [`isolate`](/config/isolate) 和 [`sequence.sequencer`](/config/sequence#sequence-sequencer) 配置项。

::: details 示例
举例来说：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'slow',
          sequence: {
            groupOrder: 0,
          },
        },
      },
      {
        test: {
          name: 'fast',
          sequence: {
            groupOrder: 0,
          },
        },
      },
      {
        test: {
          name: 'flaky',
          sequence: {
            groupOrder: 1,
          },
        },
      },
    ],
  },
})
```

这些项目中的测试将按以下顺序运行：

```
 0. slow  |
          |> 同时运行
 0. fast  |

 1. flaky |> 在 slow 和 fast 运行完后单独运行
```

:::

## sequence.shuffle

- **类型:** `boolean | { files?, tests? }`
- **默认值:** `false`
- **命令行终端:** `--sequence.shuffle`, `--sequence.shuffle=false`

如果希望测试文件和测试用例随机执行，可通过此选项或 CLI 参数 [`--sequence.shuffle`](/guide/cli) 启用。

Vitest 通常使用缓存对测试进行排序，使耗时较长的测试优先启动，从而加快测试运行速度。如果文件和测试以随机顺序运行，将失去这一性能提升，但这有助于发现意外依赖于之前测试运行的测试。

### sequence.shuffle.files <CRoot /> {#sequence-shuffle-files}

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--sequence.shuffle.files`, `--sequence.shuffle.files=false`

是否随机排列测试文件。请注意，启用此选项后，耗时较长的测试将无法优先开始执行。

由于所有 [项目](/guide/projects) 共享同一套文件排序，因此此选项只能由根配置决定。各个项目仍可通过 [`sequence.shuffle.tests`](#sequence-shuffle-tests) 随机排列自身的测试用例。

### sequence.shuffle.tests {#sequence-shuffle-tests}

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--sequence.shuffle.tests`, `--sequence.shuffle.tests=false`

是否随机排列测试用例。

## sequence.concurrent {#sequence-concurrent}

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--sequence.concurrent`, `--sequence.concurrent=false`

如果希望测试并行运行，可通过此选项或 CLI 参数 [`--sequence.concurrent`](/guide/cli) 启用。

::: warning
当同时启用 `sequence.concurrent` 并行测试和 `expect.requireAssertions` 断言检测时，应使用 [本地 expect 对象](/guide/test-context.html#expect) 而非全局对象，否则可能导致 [特定场景下的假阴性问题(#8469)](https://github.com/vitest-dev/vitest/issues/8469)。
:::

## sequence.seed <CRoot />

- **类型:** `number`
- **默认值:** `Date.now()`
- **命令行终端:** `--sequence.seed=1000`

设置随机种子，当测试以随机顺序运行时生效。

## sequence.hooks

- **类型:** `'stack' | 'list' | 'parallel'`
- **默认值:** `'stack'`
- **命令行终端:** `--sequence.hooks=<value>`

调整钩子函数的执行顺序：

- `stack`："after" 类钩子按定义顺序逆序执行，"before" 类钩子保持定义顺序执行
- `list`：所有钩子严格按定义顺序执行
- `parallel`：在单个组内并行运行钩子（父套件的钩子仍会在当前套件的钩子之前运行）。实际并发数受 [`maxConcurrency`](/config/maxconcurrency) 限制

::: tip
此选项不影响 [`onTestFinished`](/api/hooks#ontestfinished) 钩子，该钩子始终采用逆序调用。
:::

## sequence.setupFiles {#sequence-setupfiles}

- **类型:** `'list' | 'parallel'`
- **默认值:** `'parallel'`
- **命令行终端:** `--sequence.setupFiles=<value>`

调整配置文件的执行顺序：

- `list` 会按定义顺序运行初始化文件
- `parallel` 会并行运行初始化文件
