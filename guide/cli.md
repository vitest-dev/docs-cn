# 命令行

## 命令

### `vitest watch`

  运行所有测试套件，但要注意更改并在更改时重新运行测试。 与在没有命令的情况下调用 `vitest` 相同。 在 CI 环境中，此命令将回退到 `vitest run`

### `vitest run`

  在没有浏览模式的情况下执行单次运行。

### `vitest dev`

  在开发模式下运行 vitest。

### `vitest related`

  仅运行涵盖源文件列表的测试。 适用于静态惰性导入，但不适用于动态导入。 所有文件都应相对于根文件夹。

  与 [`lint-staged`](https://github.com/okonet/lint-staged) 或你的 CI 设置一起运行很有用。

  ```bash
  vitest related /src/index.ts /src/hello-world.js
  ```

## 命令选项

| Options       |               |
| ------------- | ------------- |
| `-v, --version` | 显示版本号 |
| `-r, --root <path>` | 定义项目根目录 |
| `-c, --config <path>` | 配置文件的路径 |
| `-u, --update` | 更新快照 |
| `-w, --watch` | 智能即时浏览模式 |
| `-t, --testNamePattern <pattern>` | 使用与模式匹配的全名运行测试 |
| `--dir <path>`| 用于扫描测试文件的基本目录 |
| `--ui` | 启用UI |
| `--open` | 如果启用，则自动打开 UI (default: `true`) |
| `--api [api]` | 服务 API，可用选项：`--api.port <port>`、`--api.host [host]` 和 `--api.strictPort` |
| `--threads` | 启用线程 (default: `true`) |
| `--silent` | 测试的控制台输出 |
| `--isolate` | 为每个测试文件隔离环境 (default: `true`) |
| `--reporter <name>` | 选择报告器：`default`、`verbose`、`dot`、`junit`、`json` 或自定义报告器的路径 |
| `--outputFile <filename/-s>` | 当还指定了 `--reporter=json` 或 `--reporter=junit` 选项时，将测试结果写入文件 <br /> 通过 [cac's dot notation]你可以为多个报告器指定单独的输出 |
| `--coverage` | 使用 c8 进行覆盖 |
| `--run` | 不使用浏览模式 |
| `--mode` | 覆盖 Vite 模式 (default: `test`) |
| `--mode <name>` | 覆盖 Vite 模式 (default: `test`) |
| `--globals` | 注入全局 API |
| `--dom` | 用happy-dom模拟浏览器api |
| `--environment <env>` | 设置运行的环境 (default: `node`) |
| `--passWithNoTests` | 未找到测试时通过 |
| `--allowOnly` | 允许标记为 `only` 的测试和套件 (default: false in CI, true otherwise) |
| `--changed [since]` | 运行受更改文件影响的测试 (default: false)
| `-h, --help` | 显示可用的 CLI 选项 |
