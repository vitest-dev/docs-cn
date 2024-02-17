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

| 选项                                 |                                                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `-v, --version`                      | 显示版本号                                                                                                                                  |
| `-r, --root <path>`                  | 指定项目根目录                                                                                                                              |
| `-c, --config <path>`                | 指定配置文件路径                                                                                                                            |
| `-u, --update`                       | 更新快照                                                                                                                                    |
| `-w, --watch`                        | 智能即时浏览模式                                                                                                                            |
| `-t, --testNamePattern <pattern>`    | 使用与模式匹配的全名运行测试                                                                                                                |
| `--dir <path>`                       | 指定扫描测试文件的基本目录                                                                                                                  |
| `--ui`                               | 启用 UI                                                                                                                                     |
| `--open`                             | 如果启用，则自动打开 UI (默认值: `true`)                                                                                                    |
| `--api [api]`                        | 服务端 API，可用选项：`--api.port <port>`、`--api.host [host]` 和 `--api.strictPort`                                                        |
| `--pool <pool>`                      | 指定池（如果未在浏览器中运行） (默认值: `threads`)                                                                                          |
| `--poolOptions <options>`            | 指定池选项                                                                                                                                  |
| `--poolOptions.threads.isolate`      | 隔离线程池中的测试 (默认值: `true`)                                                                                                         |
| `--poolOptions.forks.isolate`        | 隔离分叉池中的测试 (默认值: `true`)                                                                                                         |
| `--fileParallelism`                  | 所有测试文件应该并行运行。使用--no parallelism 以禁用（默认值：true）                                                                       |
| `--maxWorkers`                       | 运行测试时设置的最大工作线程数 in                                                                                                           |
| `--minWorkers`                       | 运行测试时设置的最小工作线程数 in                                                                                                           |
| `--silent`                           | 控制台输出测试结果                                                                                                                          |
| `--reporter <name>`                  | 选择报告器：`default`、`verbose`、`dot`、`junit`、`json` 或自定义报告器的路径                                                               |
| `--outputFile <filename/-s>`         | 当指定了 `--reporter=json` 或 `--reporter=junit` 选项时，将测试结果写入文件 <br /> 通过 [cac's dot notation] 可以为多个报告器指定单独的输出 |
| `--coverage`                         | 启用输出覆盖率报告                                                                                                                          |
| `--run`                              | 不使用监听模式运行测试                                                                                                                      |
| `--isolate`                          | 独立地运行每个测试文件。要禁用隔离，请使用 `--no-isolate`(默认值: `true`)                                                                   |
| `--mode <name>`                      | 覆盖 Vite 模式 (默认值: `test`)                                                                                                             |
| `--workspace <path>`                 | 工作区配置文件的路径                                                                                                                        |
| `--globals`                          | 注入全局 API                                                                                                                                |
| `--dom`                              | 使用 happy-dom 模拟浏览器                                                                                                                   |
| `--browser [options]`                | 在 [浏览器模式](/guide/browser) 中运行测试 (默认值：`false`)                                                                                |
| `--environment <env>`                | 运行环境 (默认值: `node`)                                                                                                                   |
| `--passWithNoTests`                  | 未找到测试时通过                                                                                                                            |
| `--logHeapUsage`                     | 显示每个测试的堆大小 test                                                                                                                   |
| `--allowOnly`                        | 允许标记为 `only` 的测试和套件 (默认值: 在 CI 中 false, 否则为 true)                                                                        |
| `--dangerouslyIgnoreUnhandledErrors` | 忽略发生的任何未处理的错误                                                                                                                  |
| `--changed [since]`                  | 运行受更改文件影响的测试 (默认值: false)，更多内容请查看 [文档](#changed)                                                                   |
| `--shard <shard>`                    | 按照指定分片执行测试                                                                                                                        |
| `--sequence`                         | 定义运行测试的顺序，使用 [cac's dot notation] 来指定选项（例如，使用 `--sequence.suffle` 以随机顺序运行测试）                               |
| `--no-color`                         | 控制台输出中禁用颜色                                                                                                                        |
| `--inspect`                          | 启用 Node.js 检查器                                                                                                                         |
| `--inspect-brk`                      | 使用中断模式启用 Node.js 检查器                                                                                                             |
| `--bail <number>`                    | 当给定数量的测试失败时停止测试执行                                                                                                          |
| `--retry <times>`                    | 当测试失败时，指定重试的次数                                                                                                                |
| `--exclude <glob>`                   | 要从测试中排除的其他文件 globs                                                                                                              |
| `--expand-snapshot-diff`             | 快照失败时显示完整差异                                                                                                                      |
| `--disable-console-intercept` | 禁用自动拦截控制台日志（默认：`false` ） |
| `--typecheck [options]`              | 类型检查池的自定义选项。如果传递时没有选项，则启用类型检查                                                                                  |
| `--typecheck.enabled`                | 在测试的同时启用类型检查 (默认值: `false`)                                                                                                  |
| `--typecheck.only`                   | 仅运行类型检查测试。这会自动启用类型检查 (默认值: `false`)                                                                                  |
| `--project`                          | 如果使用 Vitest 工作区功能，则为要运行的项目名称。多个项目可重复此操作：`--project=1 --project=2`                                           |
| `-h, --help`                         | 显示可用的命令行选项                                                                                                                        |

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

<<<<<<< HEAD
  要对最近一次提交中的更改运行测试，可以使用 `--changed HEAD~1`。还可以使用提交哈希（`commit hash`）或分支名称。

  如果与 `forceRerunTriggers` 配置选项配合使用，并找到与更改的文件匹配的内容，将运行整个测试套件。
=======
  To run tests against changes made in the last commit, you can use `--changed HEAD~1`. You can also pass commit hash (e.g. `--changed 09a9920`) or branch name (e.g. `--changed origin/develop`).

  If paired with the [`forceRerunTriggers`](/config/#forcereruntriggers) config option it will run the whole test suite if at least one of the files listed in the `forceRerunTriggers` list changes. By default, changes to the Vitest config file and `package.json` will always rerun the whole suite.
>>>>>>> 90326b0b3cca1a912836c6186e7505d8a4b35618

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
