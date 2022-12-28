---
title: Command Line Interface | Guide
---

# 命令行界面

## 命令

### `vitest`

在当前目录中启动 Vitest 将进入浏览模式，它运行在开发环境并且在 CI 中自动运行。

你可以通过添加参数作为过滤器来运行测试文件，比如：

```bash
vitest foobar
```

只运行包含 `foobar` 路径下的测试文件。

### `vitest run`

在没有浏览模式的情况下执行单次运行。

### `vitest watch`

运行所有测试套件，但要注意更改并在更改时重新运行测试。类似于在没有命令的情况下调用 `vitest`。在 CI 环境中，此命令将回退到 `vitest run`。

### `vitest dev`

`vitest watch` 的别名。

### `vitest related`

仅运行涵盖源文件列表的测试。 适用于静态惰性导入(例如, `import('./index.ts')` 或者 `import index from './index.ts`)，但不适用于动态导入(例如, `import(filepath)`)。 所有文件都应该相对于根文件夹。

与 [`lint-staged`](https://github.com/okonet/lint-staged) 或你的 CI 设置一起运行很有用。

```bash
vitest related /src/index.ts /src/hello-world.js
```

### `vitest clean cache`

清空缓存目录。

## 选项

| 选项                                 | 描述                                                                                                                                          |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `-v, --version`                      | 显示版本号                                                                                                                                    |
| `-r, --root <path>`                  | 定义项目根目录                                                                                                                                |
| `-c, --config <path>`                | 定义配置文件路径                                                                                                                              |
| `-u, --update`                       | 更新快照                                                                                                                                      |
| `-w, --watch`                        | 智能即时浏览模式                                                                                                                              |
| `-t, --testNamePattern <pattern>`    | 使用与模式匹配的全名运行测试                                                                                                                  |
| `--dir <path>`                       | 用于扫描测试文件的基本目录                                                                                                                    |
| `--ui`                               | 启用 UI                                                                                                                                       |
| `--open`                             | 如果启用，则自动打开 UI (default: `true`)                                                                                                     |
| `--api [api]`                        | 服务 API，可用选项：`--api.port <port>`、`--api.host [host]` 和 `--api.strictPort`                                                            |
| `--threads`                          | 启用线程 (default: `true`)                                                                                                                    |
| `--silent`                           | 测试的控制台输出                                                                                                                              |
| `--isolate`                          | 为每个测试文件隔离环境 (default: `true`)                                                                                                      |
| `--reporter <name>`                  | 选择报告器：`default`、`verbose`、`dot`、`junit`、`json` 或自定义报告器的路径                                                                 |
| `--outputDiffMaxSize <length>`       | 对象差异输出最大大小（default：10000）                                                                                                        |
| `--outputDiffMaxLines <lines>`       | 差异输出窗口中的最大行数 (default: 50)                                                                                                        |
| `--outputTruncateLength <length>`    | 使用 `<length>` 指定截断输出差异的字符行数                                                                                                    |
| `--outputDiffLines <lines>`          | 使用 `<lines>` 指定输出差线的数量                                                                                                             |
| `--outputFile <filename/-s>`         | 当还指定了 `--reporter=json` 或 `--reporter=junit` 选项时，将测试结果写入文件 <br /> 通过 [cac's dot notation] 可以为多个报告器指定单独的输出 |
| `--coverage`                         | 使用 c8 进行覆盖率输出                                                                                                                        |
| `--run`                              | 不使用浏览模式                                                                                                                                |
| `--mode`                             | 覆盖 Vite 模式 (default: `test`)                                                                                                              |
| `--mode <name>`                      | 覆盖 Vite 模式 (default: `test`)                                                                                                              |
| `--globals`                          | 注入全局 API                                                                                                                                  |
| `--dom`                              | 使用 happy-dom 模拟浏览器 API                                                                                                                 |
| `--browser`                          | 在浏览器中运行测试                                                                                                                            |
| `--environment <env>`                | 设置运行的环境 (default: `node`)                                                                                                              |
| `--passWithNoTests`                  | 未找到测试时通过                                                                                                                              |
| `--logHeapUsage`                     | 显示每个测试的堆大小                                                                                                                          |
| `--allowOnly`                        | 允许标记为 `only` 的测试和套件 (default: false in CI, true otherwise)                                                                         |
| `--dangerouslyIgnoreUnhandledErrors` | 忽略发生的任何未处理的错误                                                                                                                    |
| `--changed [since]`                  | 运行受更改文件影响的测试 (default: false)，更多内容请查看 [文档](#changed)                                                                    |
| `--shard <shard>`                    | 配置测试分片                                                                                                                                  |
| `--sequence`                         | 定义运行测试的顺序，使用 [cac's dot notation] 来指定选项（例如，使用 `--sequence.suffle` 以随机顺序运行测试）                                 |
| `--no-color`                         | 从控制台输出中禁用颜色                                                                                                                        |
| `--inspect`                          | 启用 Node.js 检查器                                                                                                                           |
| `--inspect-brk`                      | 使用 break 启用 Node.js 检查器                                                                                                                |
| `-h, --help`                         | 显示可用的 CLI 选项                                                                                                                           |
|                                      |

### 变更

- **类型**: `boolean | string`
- **默认值**: false

  再次运行有变更的测试文件。如果未发生变更，它将再次运行未提交的变更（包括分段和非分段）。

  在上次提交的变更模式下，再次运行测试，你可以使用 `--changed HEAD~1`。也可以使用提交哈希或者分支名称。

### 分片

假如找到匹配项，如果配置了 `forceRerunTriggers` 选项，那么它将运行整个测试套件。

- **类型**: `string`
- **默认值**: disabled

  要以 `<index>`/`<count>` 格式来执行的测试套件分片，其中

  - `count` 是一个正整数，它表示拆分测试分片的数量
  - `index` 是一个正整数, 它表示拆分测试分片的索引

  该命令将所有测试通过 `count` 来拆分，并仅运行恰好位于 `index` 部分的测试。比如，将你的测试套件拆分为三份，可以这样使用：

  ```sh
  vitest run --shard=1/3
  vitest run --shard=2/3
  vitest run --shard=3/3
  ```

:::warning 警告
你不能使用 `--watch` 选项 (在开发环境下默认启用)。
:::
