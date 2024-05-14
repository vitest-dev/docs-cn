---
title: 命令行界面 | 指南
---

# 命令行界面

## 命令

### `vitest`

在当前目录中启动 Vitest。在开发环境会自动进入监听(`watch`)模式，在 CI 环境会自动进入运行(`run`)模式。

你可以通过添加参数作为过滤器来运行测试文件，比如：

```bash
vitest foobar
```

将仅运行路径中包含 `foobar` 的测试文件。 此过滤器仅检查包含，不支持正则表达式或 glob 模式（除非你的终端在 Vitest 接收过滤器之前对其进行处理）。

### `vitest run`

在没有监听模式的情况下执行单次运行。

### `vitest watch`

运行所有测试套件，监听变化并在变化时重新运行测试。与没有参数的情况下调用 `vitest` 一样。在 CI 环境中，此命令将回退到 `vitest run`。

### `vitest dev`

`vitest watch` 的别名。

### `vitest related`

仅运行涵盖源文件列表的测试。 适用于静态惰性导入(例如, `import('./index.ts')` 或者 `import index from './index.ts`)，但不适用于动态导入(例如, `import(filepath)`)。 所有文件都应该相对于根文件夹。

与 [`lint-staged`](https://github.com/okonet/lint-staged) 或你的 CI 设置一起运行很有用。

```bash
vitest related /src/index.ts /src/hello-world.js
```

::: tip
不要忘记 Vitest 默认情况下以启用的监视模式运行。如果你使用的是 `lint-staged` 之类的工具，你还应该传递 `--run` 选项，以便该命令可以正常退出。

```js
// .lintstagedrc.js
export default {
  '*.{js,ts}': 'vitest related --run',
}
```

:::

### `vitest bench`

仅运行 [基准](https://vitest.dev/guide/features.html#benchmarking-experimental) 测试，比较性能结果。

## 选项

<!--@include: ./cli-table.md-->

::: tip
Vitest 支持 CLI 参数的 both camel case 和 kebab case 。例如，`--passWithNoTests` 和 `--pass-with-no-tests` 都有效（`--no-color` 和 `--inspect-brk` 是例外）。

Vitest 还支持不同的指定值的方式：`--reporter dot` 和 `--reporter=dot` 都是有效的。

如果选项支持值数组，则需要多次传递选项：

```bash
vitest --reporter=dot --reporter=default
```

布尔值选项可以用 `no-` 前缀来否定。将值指定为 `false` 也有效：

```bash
vitest --no-api
vitest --api=false
```

:::

### changed

- **类型**: `boolean | string`
- **默认值**: false

  设置为 true 时，仅对已更改的文件运行测试。默认情况下，将考虑所有未提交的更改（包括已暂存和未暂存的文件）。

  要对最近一次提交中的更改运行测试，可以使用 `--changed HEAD~1`。还可以使用提交哈希（`commit hash`）或分支名称。

  如果与 `forceRerunTriggers` 配置选项配合使用，并找到与更改的文件匹配的内容，将运行整个测试套件。

  与代码覆盖一起使用时，报告将只包含与更改相关的文件。

  如果与 [`forceRerunTriggers`](/config/#forcereruntriggers)配置选项搭配使用，则在 `forceRerunTriggers` 列表中列出的文件至少有一个发生变化时，将运行整个测试套件。默认情况下，Vitest 配置文件和 `package.json` 的更改将始终重新运行整个套件。

### shard

- **类型**: `string`
- **默认值**: disabled

  测试套件分片，格式为 `<index>/<count>`，其中

  - `count` 是正整数，表示分割的部分数
  - `index` 是正整数，表示当前分片的索引

  该命令将将所有测试分成 `count` 个相等的部分，并只运行位于 `index` 部分的测试。例如，要将测试套件分成三个部分，请使用以下命令：

  ```sh
  vitest run --shard=1/3
  vitest run --shard=2/3
  vitest run --shard=3/3
  ```

:::warning 警告
无法在启用 `--watch`（默认情况下在开发中启用）时使用此选项。
:::
<<<<<<< HEAD
=======

::: tip
If `--reporter=blob` is used without an output file, the default path will include the current shard config to avoid collisions with other Vitest processes.
:::

### merge-reports

- **Type:** `boolean | string`

Merges every blob report located in the specified folder (`.vitest-reports` by default). You can use any reporters with this command (except [`blob`](/guide/reporters#blob-reporter)):

```sh
vitest --merge-reports --reporter=junit
```

[cac's dot notation]: https://github.com/cacjs/cac#dot-nested-options
>>>>>>> 2b032211e13521ef35634504a68d5340b2d10425
