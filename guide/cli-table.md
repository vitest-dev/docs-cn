<<<<<<< HEAD
| 选项                                            |                                                                                                                                                                                                                                           |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-r, --root <path>`                             | 根路径                                                                                                                                                                                                                                    |
| `-c, --config <path>`                           | 配置文件的路径                                                                                                                                                                                                                            |
| `-u, --update`                                  | 更新快照                                                                                                                                                                                                                                  |
| `-w, --watch`                                   | 启用 watch 模式                                                                                                                                                                                                                           |
| `-t, --testNamePattern <pattern>`               | 使用符合指定 regexp 模式的全名运行测试                                                                                                                                                                                                    |
| `--dir <path>`                                  | 扫描测试文件的基本目录                                                                                                                                                                                                                    |
| `--ui`                                          | 启用用户界面                                                                                                                                                                                                                              |
| `--open`                                        | 自动打开用户界面 (默认: `!process.env.CI`)                                                                                                                                                                                                |
| `--api.port [port]`                             | 自动打开用户界面指定服务器端口。请注意，如果端口已被使用，Vite 会自动尝试下一个可用端口，因此这可能不是服务器最终监听的实际端口。如果为 "true"，将设置为 `51204`                                                                          |
| `--api.host [host]`                             | 指定服务器应该监听哪些 IP 地址。设为 `0.0.0.0` 或 `true` 则监听所有地址，包括局域网地址和公共地址                                                                                                                                         |
| `--api.strictPort`                              | 设置为 true 时，如果端口已被使用，则退出，而不是自动尝试下一个可用端口                                                                                                                                                                    |
| `--silent`                                      | 测试控制台输出                                                                                                                                                                                                                            |
| `--hideSkippedTests`                            | 隐藏跳过测试的日志                                                                                                                                                                                                                        |
| `--reporter <name>`                             | 指定报告                                                                                                                                                                                                                                  |
| `--outputFile <filename/-s>`                    | 如果还指定了支持报告程序，则将测试结果写入文件，使用 cac 的点符号表示多个报告程序的单个输出结果 (比如: --outputFile.tap=./tap.txt)                                                                                                        |
| `--coverage.all`                                | 是否在报告中包含所有文件，包括未测试的文件                                                                                                                                                                                                |
| `--coverage.provider <name>`                    | 选择覆盖范围采集工具，可用值为 "V8"、"istanbul"和 "custom"。                                                                                                                                                                              |
| `--coverage.enabled`                            | 启用覆盖范围收集。可使用 `--coverage` CLI 选项覆盖（默认值：`false`）。                                                                                                                                                                   |
| `--coverage.include <pattern>`                  | 作为 glob 模式包含在覆盖范围内的文件。使用多个模式时，可指定多次（默认值：`**`）。                                                                                                                                                        |
| `--coverage.exclude <pattern>`                  | 覆盖范围中要排除的文件。使用多个扩展名时，可指定多次（默认情况下： 访问 [`coverage.exclude`](https://vitest.dev/config/#coverage-exclude)                                                                                                 |
| `--coverage.extension <extension>`              | 包含在覆盖范围内的扩展名。使用多个扩展名时，可指定多次 (默认: `[".js", ".cjs", ".mjs", ".ts", ".mts", ".cts", ".tsx", ".jsx", ".vue", ".svelte"]`)                                                                                        |
| `--coverage.clean`                              | 运行测试前清除覆盖结果（默认值：true）                                                                                                                                                                                                    |
| `--coverage.cleanOnRerun`                       | 重新运行监视时清理覆盖率报告（默认值：true）                                                                                                                                                                                              |
| `--coverage.reportsDirectory <path>`            | 将覆盖率报告写入的目录（默认值： ./coverage）                                                                                                                                                                                             |
| `--coverage.reporter <name>`                    | 使用的报告。更多信息请访问 [`coverage.reporter`](https://vitest.dev/config/#coverage-reporter)。 (默认值: `["text", "html", "clover", "json"]`)                                                                                           |
| `--coverage.reportOnFailure`                    | 即使测试失败也能生成覆盖率报告 (默认值: `false`)                                                                                                                                                                                          |
| `--coverage.allowExternal`                      | 收集项目根目录外文件的覆盖范围（默认值：`false`）                                                                                                                                                                                         |
| `--coverage.skipFull`                           | 不显示语句、分支和函数覆盖率为 100% 的文件（默认值：`false`）                                                                                                                                                                             |
| `--coverage.thresholds.100`                     | 将所有覆盖率阈值设置为 100 的快捷方式（默认值：`false`）                                                                                                                                                                                  |
| `--coverage.thresholds.perFile`                 | 检查每个文件的阈值。 `--coverage.thresholds.lines`, `--coverage.thresholds.functions`, `--coverage.thresholds.branches`, `--coverage.thresholds.statements` 为实际阈值（默认值：`false`）                                                 |
| `--coverage.thresholds.autoUpdate`              | 更新阈值： 当当前覆盖率高于配置的阈值时，将 "lines"、"functions"、"branches"和 "statements"更新到配置文件（默认值：`false`）                                                                                                              |
| `--coverage.thresholds.lines <number>`          | 针对代码行的覆盖度阈值设定，请访问 [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) 了解更多信息。此选项不适用于自定义 providers                                                                                       |
| `--coverage.thresholds.functions <number>`      | 针对函数的覆盖度阈值设定，请访问 [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) 了解更多信息。 此选项不适用于自定义 providers                                                                                        |
| `--coverage.thresholds.branches <number>`       | 针对 branches 的覆盖度阈值设定，请访问 [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) 了解更多信息。 此选项不适用于自定义 providers                                                                                  |
| `--coverage.thresholds.statements <number>`     | 针对 statements 的覆盖度阈值设定，请访问 [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) 了解更多信息。 此选项不适用于自定义 providers                                                                                |
| `--coverage.ignoreClassMethods <name>`          | 覆盖时要忽略的类方法名称数组。更多信息请访问 [istanbuljs](https://github.com/istanbuljs/nyc#ignoring-methods) 。该选项仅适用于 istanbul providers（默认值：`[]`）。                                                                       |
| `--coverage.processingConcurrency <number>`     | 处理覆盖率结果时使用的并发限制。 （默认最小值介于 20 和 CPU 数量之间）                                                                                                                                                                    |
| `--coverage.customProviderModule <path>`        | 指定自定义覆盖范围提供程序模块的模块名称或路径。 请访问[自定义 providers 覆盖范围](https://vitest.dev/guide/coverage#custom-coverage-provider) 了解更多信息。 此选项仅适用于自定义 providers                                              |
| `--coverage.watermarks.statements <watermarks>` | High and low watermarks for statements in the format of `<high>,<low>`                                                                                                                                                                    |
| `--coverage.watermarks.lines <watermarks>`      | High and low watermarks for lines in the format of `<high>,<low>`                                                                                                                                                                         |
| `--coverage.watermarks.branches <watermarks>`   | High and low watermarks for branches in the format of `<high>,<low>`                                                                                                                                                                      |
| `--coverage.watermarks.functions <watermarks>`  | High and low watermarks for functions in the format of `<high>,<low>`                                                                                                                                                                     |
| `--mode <name>`                                 | 覆盖 Vite 模式 (默认值: `test` 或 `benchmark`)                                                                                                                                                                                            |
| `--workspace <path>`                            | 工作区配置文件的路径                                                                                                                                                                                                                      |
| `--isolate`                                     | 隔离运行每个测试文件。要禁用隔离, 使用 `--no-isolate` (默认值: `true`)                                                                                                                                                                    |
| `--globals`                                     | 全局注入                                                                                                                                                                                                                                  |
| `--dom`                                         | 使用 happy-dom 模拟浏览器 API                                                                                                                                                                                                             |
| `--browser.enabled`                             | 在浏览器中运行测试。 相当于 `--browser.enabled` (默认值: `false`)                                                                                                                                                                         |
| `--browser.name <name>`                         | 在特定浏览器中运行所有测试。某些浏览器只适用于特定的 providers (比如 `--browser.provider`). 通过 [`browser.name`](https://vitest.dev/config/#browser-name) 查看更多信息                                                                   |
| `--browser.headless`                            | 在无头模式下运行浏览器（即不打开图形用户界面）。如果在 CI 中运行 Vitest，默认情况下将启用无头模式 (默认值: `process.env.CI`)                                                                                                              |
| `--browser.api.port [port]`                     | 指定服务器端口。注意，如果端口已被使用，Vite 会自动尝试下一个可用端口，因此这可能不是服务器最终监听的实际端口。如果为 `true`，将设置为 `63315`                                                                                            |
| `--browser.api.host [host]`                     | 指定服务器应该监听哪些 IP 地址。设为 `0.0.0.0` 或 `true` 则监听所有地址，包括局域网地址和公共地址                                                                                                                                         |
| `--browser.api.strictPort`                      | 设置为 true 时，如果端口已被使用，则退出，而不是自动尝试下一个可用端口                                                                                                                                                                    |
| `--browser.provider <name>`                     | 用于运行浏览器测试的 Provider。某些浏览器只适用于特定的提供 Provider，可以是"webdriverio", "playwright", 或自定义 provider. 通过 [`browser.provider`](https://vitest.dev/config/#browser-provider) 查看更多信息 (默认值: `"webdriverio"`) |
| `--browser.isolate`                             | 隔离运行每个浏览器测试文件。要禁用隔离请使用 `--browser.isolate=false` (默认值: `true`)                                                                                                                                                   |
| `--browser.ui`                                  | 运行测试时显示 Vitest UI(默认值: `!process.env.CI`)                                                                                                                                                                                       |
| `--pool <pool>`                                 | 如果未在浏览器中运行，则指定 pool (默认值: `threads`)                                                                                                                                                                                     |
| `--poolOptions.threads.isolate`                 | 在线程池中隔离测试 (默认值: `true`)                                                                                                                                                                                                       |
| `--poolOptions.threads.singleThread`            | 在单线程内运行测试 (默认值: `false`)                                                                                                                                                                                                      |
| `--poolOptions.threads.minThreads <workers>`    | 运行测试的最小线程数                                                                                                                                                                                                                      |
| `--poolOptions.threads.useAtomics`              | 使用 Atomics 同步线程。这在某些情况下可以提高性能，但在较旧的 Node 版本中可能会导致 segfault。 (默认值: `false`)                                                                                                                          |
| `--poolOptions.vmThreads.isolate`               | 在线程池中隔离测试 (默认值: `true`)                                                                                                                                                                                                       |
| `--poolOptions.vmThreads.singleThread`          | 在单线程内运行测试（默认值：`false`）                                                                                                                                                                                                     |
| `--poolOptions.vmThreads.maxThreads <workers>`  | 运行测试的最大线程数                                                                                                                                                                                                                      |
| `--poolOptions.vmThreads.minThreads <workers>`  | 运行测试的最小线程数                                                                                                                                                                                                                      |
| `--poolOptions.vmThreads.useAtomics`            | 使用 Atomics 同步线程。这在某些情况下可以提高性能，但在较旧的 Node 版本中可能会导致 segfault。 (默认值: `false`)                                                                                                                          |
| `--poolOptions.vmThreads.memoryLimit <limit>`   | 虚拟机线程池的内存限制。如果发现内存泄漏，请尝试调整该值。                                                                                                                                                                                |
| `--poolOptions.forks.isolate`                   | 在 forks pool 中隔离测试 (默认值: `true`)                                                                                                                                                                                                 |
| `--poolOptions.forks.singleFork`                | 单个子进程内运行测试 (default: `false`)                                                                                                                                                                                                   |
| `--poolOptions.forks.maxForks <workers>`        | 运行测试的最大进程数                                                                                                                                                                                                                      |
| `--poolOptions.forks.minForks <workers>`        | 运行测试的最小进程数                                                                                                                                                                                                                      |
| `--poolOptions.vmForks.isolate`                 | 在 forks pool 中隔离测试 (default: `true`)                                                                                                                                                                                                |
| `--poolOptions.vmForks.singleFork`              | 在单个子进程内运行测试 (default: `false`)                                                                                                                                                                                                 |
| `--poolOptions.vmForks.maxForks <workers>`      | 运行测试的最大进程数                                                                                                                                                                                                                      |
| `--poolOptions.vmForks.minForks <workers>`      | 运行测试的最小进程数                                                                                                                                                                                                                      |
| `--poolOptions.vmForks.memoryLimit <limit>`     | VM forks pool 的内存限制。如果你观察到内存泄漏问题，可以尝试调整这个值。                                                                                                                                                                  |
| `--fileParallelism`                             | 是否所有测试文件都应并行运行. 使用 `--no-file-parallelism` 去禁用 (默认值: `true`)                                                                                                                                                        |
| `--maxWorkers <workers>`                        | 同时并发执行测试任务的最大线程数                                                                                                                                                                                                          |
| `--minWorkers <workers>`                        | 同时并发执行测试任务的最小线程数                                                                                                                                                                                                          |
| `--environment <name>`                          | 如果不在浏览器中运行，则指定运行环境 (默认值: `node`)                                                                                                                                                                                     |
| `--passWithNoTests`                             | 未发现测试时通过                                                                                                                                                                                                                          |
| `--logHeapUsage`                                | 在节点中运行时，显示每个测试的堆大小                                                                                                                                                                                                      |
| `--allowOnly`                                   | 允许执行那些被标记为"only"的测试用例或测试套件 (默认值: `!process.env.CI`)                                                                                                                                                                |
| `--dangerouslyIgnoreUnhandledErrors`            | 忽略任何未处理的错误                                                                                                                                                                                                                      |
| `--shard <shards>`                              | 测试套件分区的执行格式为 `<index>/<count>`                                                                                                                                                                                                |
| `--changed [since]`                             | 运行受更改文件影响的测试 (默认值: `false`)                                                                                                                                                                                                |
| `--sequence.shuffle.files`                      | 以随机顺序运行文件。如果启用此选项，长时间运行的测试将不会提前开始。 (默认值: `false`)                                                                                                                                                    |
| `--sequence.shuffle.tests`                      | 以随机方式运行测试（默认值：`false`）                                                                                                                                                                                                     |
| `--sequence.concurrent`                         | 使测试并行运行（默认值：`false`）                                                                                                                                                                                                         |
| `--sequence.seed <seed>`                        | 设置随机化种子。如果 --sequence.shuffle（随机序列）是`false`，则此选项无效。 t 通过 ["Random Seed" page](https://en.wikipedia.org/wiki/Random_seed) 查看更多信息                                                                          |
| `--sequence.hooks <order>`                      | 更改钩子的执行顺序。 可接受的值有: "stack", "list" and "parallel". 通过 [`sequence.hooks`](https://vitest.dev/config/#sequence-hooks) 查看更多信息 (默认值: `"parallel"`)                                                                 |
| `--sequence.setupFiles <order>`                 | 更改设置文件的执行顺序。可接受的值有 "list" 和 "parallel"。如果设置为"list"，将按照定义的顺序运行设置文件。如果设置为 "parallel"，将并行运行设置文件（默认值：`"parallel"`）。                                                            |
| `--inspect [[host:]port]`                       | 启用 Node.js 检查器（默认值：`127.0.0.1:9229`）                                                                                                                                                                                           |
| `--inspectBrk [[host:]port]`                    | 启用 Node.js 检查器并在测试开始前中断                                                                                                                                                                                                     |
| `--testTimeout <timeout>`                       | 测试的默认超时（毫秒）（默认值：`5000`）。                                                                                                                                                                                                |
| `--hookTimeout <timeout>`                       | 默认钩子超时（以毫秒为单位）（默认值：`10000`）                                                                                                                                                                                           |
| `--bail <number>`                               | 当指定数量的测试失败时停止测试执行（默认值：`0`）                                                                                                                                                                                         |
| `--retry <times>`                               | 如果测试失败，重试特定次数（默认值： `0`）。                                                                                                                                                                                              |
| `--diff <path>`                                 | 用于生成差异界面的差异配置的路径                                                                                                                                                                                                          |
| `--exclude <glob>`                              | 测试中排除的其他文件路径匹配模式                                                                                                                                                                                                          |
| `--expandSnapshotDiff`                          | 快照失败时显示完整差异                                                                                                                                                                                                                    |
| `--disableConsoleIntercept`                     | 禁用自动拦截控制台日志（默认值：`false`）                                                                                                                                                                                                 |
| `--typecheck.enabled`                           | 在测试的同时启用类型检查（默认值：`false`）                                                                                                                                                                                               |
| `--typecheck.only`                              | 仅运行类型检查测试。这将自动启用类型检查（默认值：`false`）                                                                                                                                                                               |
| `--typecheck.checker <name>`                    | 指定要使用的类型检查器。可用值为 "tcs"和 "vue-tsc "以及一个可执行文件的路径（默认值：`tsc`）                                                                                                                                              |
| `--typecheck.allowJs`                           | 允许对 JavaScript 文件进行类型检查。默认值取自 tsconfig.json                                                                                                                                                                              |
| `--typecheck.ignoreSourceErrors`                | 忽略源文件中的类型错误                                                                                                                                                                                                                    |
| `--typecheck.tsconfig <path>`                   | 自定义 tsconfig 文件的路径                                                                                                                                                                                                                |
| `--project <name>`                              | 如果使用 Vitest 工作区功能，则为要运行的项目名称。多个项目可重复此操作： `project=1--project=2`。也可以使用通配符过滤项目，如 `--project=packages*` 。                                                                                    |
| `--slowTestThreshold <threshold>`               | 测试速度慢的阈值（以毫秒为单位）（默认值：`300`）                                                                                                                                                                                         |
| `--teardownTimeout <timeout>`                   | 拆卸函数的默认超时（以毫秒为单位）（默认值：`10000`）                                                                                                                                                                                     |
| `--maxConcurrency <number>`                     | 套件中并发测试的最大次数（默认值：`5）                                                                                                                                                                                                    |
| `--expect.requireAssertions`                    | 要求所有测试至少有一个断言                                                                                                                                                                                                                |
| `--expect.poll.interval <interval>`             | 断言的轮询间隔 `expect.poll()` (默认值: `50`)                                                                                                                                                                                             |
| `--expect.poll.timeout <timeout>`               | 断言的轮询超时（以毫秒为单位） `expect.poll()` (默认值: `1000`)                                                                                                                                                                           |
| `--run`                                         | 禁用 watch 模式                                                                                                                                                                                                                           |
| `--no-color`                                    | 删除控制台输出中的颜色                                                                                                                                                                                                                    |
| `--clearScreen`                                 | 在 wathc 模式下重新运行测试时清除终端屏幕（默认值：`true`）。                                                                                                                                                                             |
| `--standalone`                                  | 启动 Vitest 而不运行测试。文件过滤器将被忽略，只有在发生变化时才会运行测试。(默认值:`false`)                                                                                                                                              |
| `--mergeReports [path]`                         | blob 报告目录的路径。如果使用此选项，Vitest 将不会运行任何测试，它将只报告以前记录的测试                                                                                                                                                  |
=======
| Options       |               |
| ------------- | ------------- |
| `-r, --root <path>` | Root path |
| `-c, --config <path>` | Path to config file |
| `-u, --update` | Update snapshot |
| `-w, --watch` | Enable watch mode |
| `-t, --testNamePattern <pattern>` | Run tests with full names matching the specified regexp pattern |
| `--dir <path>` | Base directory to scan for the test files |
| `--ui` | Enable UI |
| `--open` | Open UI automatically (default: `!process.env.CI`) |
| `--api.port [port]` | Specify server port. Note if the port is already being used, Vite will automatically try the next available port so this may not be the actual port the server ends up listening on. If true will be set to `51204` |
| `--api.host [host]` | Specify which IP addresses the server should listen on. Set this to `0.0.0.0` or `true` to listen on all addresses, including LAN and public addresses |
| `--api.strictPort` | Set to true to exit if port is already in use, instead of automatically trying the next available port |
| `--silent` | Silent console output from tests |
| `--hideSkippedTests` | Hide logs for skipped tests |
| `--reporter <name>` | Specify reporters |
| `--outputFile <filename/-s>` | Write test results to a file when supporter reporter is also specified, use cac's dot notation for individual outputs of multiple reporters (example: --outputFile.tap=./tap.txt) |
| `--coverage.all` | Whether to include all files, including the untested ones into report |
| `--coverage.provider <name>` | Select the tool for coverage collection, available values are: "v8", "istanbul" and "custom" |
| `--coverage.enabled` | Enables coverage collection. Can be overridden using the `--coverage` CLI option (default: `false`) |
| `--coverage.include <pattern>` | Files included in coverage as glob patterns. May be specified more than once when using multiple patterns (default: `**`) |
| `--coverage.exclude <pattern>` | Files to be excluded in coverage. May be specified more than once when using multiple extensions (default: Visit [`coverage.exclude`](https://vitest.dev/config/#coverage-exclude)) |
| `--coverage.extension <extension>` | Extension to be included in coverage. May be specified more than once when using multiple extensions (default: `[".js", ".cjs", ".mjs", ".ts", ".mts", ".cts", ".tsx", ".jsx", ".vue", ".svelte"]`) |
| `--coverage.clean` | Clean coverage results before running tests (default: true) |
| `--coverage.cleanOnRerun` | Clean coverage report on watch rerun (default: true) |
| `--coverage.reportsDirectory <path>` | Directory to write coverage report to (default: ./coverage) |
| `--coverage.reporter <name>` | Coverage reporters to use. Visit [`coverage.reporter`](https://vitest.dev/config/#coverage-reporter) for more information (default: `["text", "html", "clover", "json"]`) |
| `--coverage.reportOnFailure` | Generate coverage report even when tests fail (default: `false`) |
| `--coverage.allowExternal` | Collect coverage of files outside the project root (default: `false`) |
| `--coverage.skipFull` | Do not show files with 100% statement, branch, and function coverage (default: `false`) |
| `--coverage.thresholds.100` | Shortcut to set all coverage thresholds to 100 (default: `false`) |
| `--coverage.thresholds.perFile` | Check thresholds per file. See `--coverage.thresholds.lines`, `--coverage.thresholds.functions`, `--coverage.thresholds.branches` and `--coverage.thresholds.statements` for the actual thresholds (default: `false`) |
| `--coverage.thresholds.autoUpdate` | Update threshold values: "lines", "functions", "branches" and "statements" to configuration file when current coverage is above the configured thresholds (default: `false`) |
| `--coverage.thresholds.lines <number>` | Threshold for lines. Visit [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) for more information. This option is not available for custom providers |
| `--coverage.thresholds.functions <number>` | Threshold for functions. Visit [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) for more information. This option is not available for custom providers |
| `--coverage.thresholds.branches <number>` | Threshold for branches. Visit [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) for more information. This option is not available for custom providers |
| `--coverage.thresholds.statements <number>` | Threshold for statements. Visit [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) for more information. This option is not available for custom providers |
| `--coverage.ignoreClassMethods <name>` | Array of class method names to ignore for coverage. Visit [istanbuljs](https://github.com/istanbuljs/nyc#ignoring-methods) for more information. This option is only available for the istanbul providers (default: `[]`) |
| `--coverage.processingConcurrency <number>` | Concurrency limit used when processing the coverage results. (default min between 20 and the number of CPUs) |
| `--coverage.customProviderModule <path>` | Specifies the module name or path for the custom coverage provider module. Visit [Custom Coverage Provider](https://vitest.dev/guide/coverage#custom-coverage-provider) for more information. This option is only available for custom providers |
| `--coverage.watermarks.statements <watermarks>` | High and low watermarks for statements in the format of `<high>,<low>` |
| `--coverage.watermarks.lines <watermarks>` | High and low watermarks for lines in the format of `<high>,<low>` |
| `--coverage.watermarks.branches <watermarks>` | High and low watermarks for branches in the format of `<high>,<low>` |
| `--coverage.watermarks.functions <watermarks>` | High and low watermarks for functions in the format of `<high>,<low>` |
| `--mode <name>` | Override Vite mode (default: `test` or `benchmark`) |
| `--workspace <path>` | Path to a workspace configuration file |
| `--isolate` | Run every test file in isolation. To disable isolation, use `--no-isolate` (default: `true`) |
| `--globals` | Inject apis globally |
| `--dom` | Mock browser API with happy-dom |
| `--browser.enabled` | Run tests in the browser. Equivalent to `--browser.enabled` (default: `false`) |
| `--browser.name <name>` | Run all tests in a specific browser. Some browsers are only available for specific providers (see `--browser.provider`). Visit [`browser.name`](https://vitest.dev/config/#browser-name) for more information |
| `--browser.headless` | Run the browser in headless mode (i.e. without opening the GUI (Graphical User Interface)). If you are running Vitest in CI, it will be enabled by default (default: `process.env.CI`) |
| `--browser.api.port [port]` | Specify server port. Note if the port is already being used, Vite will automatically try the next available port so this may not be the actual port the server ends up listening on. If true will be set to `63315` |
| `--browser.api.host [host]` | Specify which IP addresses the server should listen on. Set this to `0.0.0.0` or `true` to listen on all addresses, including LAN and public addresses |
| `--browser.api.strictPort` | Set to true to exit if port is already in use, instead of automatically trying the next available port |
| `--browser.provider <name>` | Provider used to run browser tests. Some browsers are only available for specific providers. Can be "webdriverio", "playwright", or the path to a custom provider. Visit [`browser.provider`](https://vitest.dev/config/#browser-provider) for more information (default: `"webdriverio"`) |
| `--browser.providerOptions <options>` | Options that are passed down to a browser provider. Visit [`browser.providerOptions`](https://vitest.dev/config/#browser-provideroptions) for more information |
| `--browser.isolate` | Run every browser test file in isolation. To disable isolation, use `--browser.isolate=false` (default: `true`) |
| `--browser.ui` | Show Vitest UI when running tests (default: `!process.env.CI`) |
| `--pool <pool>` | Specify pool, if not running in the browser (default: `threads`) |
| `--poolOptions.threads.isolate` | Isolate tests in threads pool (default: `true`) |
| `--poolOptions.threads.singleThread` | Run tests inside a single thread (default: `false`) |
| `--poolOptions.threads.maxThreads <workers>` | Maximum number of threads to run tests in |
| `--poolOptions.threads.minThreads <workers>` | Minimum number of threads to run tests in |
| `--poolOptions.threads.useAtomics` | Use Atomics to synchronize threads. This can improve performance in some cases, but might cause segfault in older Node versions (default: `false`) |
| `--poolOptions.vmThreads.isolate` | Isolate tests in threads pool (default: `true`) |
| `--poolOptions.vmThreads.singleThread` | Run tests inside a single thread (default: `false`) |
| `--poolOptions.vmThreads.maxThreads <workers>` | Maximum number of threads to run tests in |
| `--poolOptions.vmThreads.minThreads <workers>` | Minimum number of threads to run tests in |
| `--poolOptions.vmThreads.useAtomics` | Use Atomics to synchronize threads. This can improve performance in some cases, but might cause segfault in older Node versions (default: `false`) |
| `--poolOptions.vmThreads.memoryLimit <limit>` | Memory limit for VM threads pool. If you see memory leaks, try to tinker this value. |
| `--poolOptions.forks.isolate` | Isolate tests in forks pool (default: `true`) |
| `--poolOptions.forks.singleFork` | Run tests inside a single child_process (default: `false`) |
| `--poolOptions.forks.maxForks <workers>` | Maximum number of processes to run tests in |
| `--poolOptions.forks.minForks <workers>` | Minimum number of processes to run tests in |
| `--poolOptions.vmForks.isolate` | Isolate tests in forks pool (default: `true`) |
| `--poolOptions.vmForks.singleFork` | Run tests inside a single child_process (default: `false`) |
| `--poolOptions.vmForks.maxForks <workers>` | Maximum number of processes to run tests in |
| `--poolOptions.vmForks.minForks <workers>` | Minimum number of processes to run tests in |
| `--poolOptions.vmForks.memoryLimit <limit>` | Memory limit for VM forks pool. If you see memory leaks, try to tinker this value. |
| `--fileParallelism` | Should all test files run in parallel. Use `--no-file-parallelism` to disable (default: `true`) |
| `--maxWorkers <workers>` | Maximum number of workers to run tests in |
| `--minWorkers <workers>` | Minimum number of workers to run tests in |
| `--environment <name>` | Specify runner environment, if not running in the browser (default: `node`) |
| `--passWithNoTests` | Pass when no tests are found |
| `--logHeapUsage` | Show the size of heap for each test when running in node |
| `--allowOnly` | Allow tests and suites that are marked as only (default: `!process.env.CI`) |
| `--dangerouslyIgnoreUnhandledErrors` | Ignore any unhandled errors that occur |
| `--shard <shards>` | Test suite shard to execute in a format of `<index>/<count>` |
| `--changed [since]` | Run tests that are affected by the changed files (default: `false`) |
| `--sequence.shuffle.files` | Run files in a random order. Long running tests will not start earlier if you enable this option. (default: `false`) |
| `--sequence.shuffle.tests` | Run tests in a random order (default: `false`) |
| `--sequence.concurrent` | Make tests run in parallel (default: `false`) |
| `--sequence.seed <seed>` | Set the randomization seed. This option will have no effect if --sequence.shuffle is falsy. Visit ["Random Seed" page](https://en.wikipedia.org/wiki/Random_seed) for more information |
| `--sequence.hooks <order>` | Changes the order in which hooks are executed. Accepted values are: "stack", "list" and "parallel". Visit [`sequence.hooks`](https://vitest.dev/config/#sequence-hooks) for more information (default: `"parallel"`) |
| `--sequence.setupFiles <order>` | Changes the order in which setup files are executed. Accepted values are: "list" and "parallel". If set to "list", will run setup files in the order they are defined. If set to "parallel", will run setup files in parallel (default: `"parallel"`) |
| `--inspect [[host:]port]` | Enable Node.js inspector (default: `127.0.0.1:9229`) |
| `--inspectBrk [[host:]port]` | Enable Node.js inspector and break before the test starts |
| `--testTimeout <timeout>` | Default timeout of a test in milliseconds (default: `5000`) |
| `--hookTimeout <timeout>` | Default hook timeout in milliseconds (default: `10000`) |
| `--bail <number>` | Stop test execution when given number of tests have failed (default: `0`) |
| `--retry <times>` | Retry the test specific number of times if it fails (default: `0`) |
| `--diff <path>` | Path to a diff config that will be used to generate diff interface |
| `--exclude <glob>` | Additional file globs to be excluded from test |
| `--expandSnapshotDiff` | Show full diff when snapshot fails |
| `--disableConsoleIntercept` | Disable automatic interception of console logging (default: `false`) |
| `--typecheck.enabled` | Enable typechecking alongside tests (default: `false`) |
| `--typecheck.only` | Run only typecheck tests. This automatically enables typecheck (default: `false`) |
| `--typecheck.checker <name>` | Specify the typechecker to use. Available values are: "tsc" and "vue-tsc" and a path to an executable (default: `"tsc"`) |
| `--typecheck.allowJs` | Allow JavaScript files to be typechecked. By default takes the value from tsconfig.json |
| `--typecheck.ignoreSourceErrors` | Ignore type errors from source files |
| `--typecheck.tsconfig <path>` | Path to a custom tsconfig file |
| `--project <name>` | The name of the project to run if you are using Vitest workspace feature. This can be repeated for multiple projects: `--project=1 --project=2`. You can also filter projects using wildcards like `--project=packages*` |
| `--slowTestThreshold <threshold>` | Threshold in milliseconds for a test to be considered slow (default: `300`) |
| `--teardownTimeout <timeout>` | Default timeout of a teardown function in milliseconds (default: `10000`) |
| `--maxConcurrency <number>` | Maximum number of concurrent tests in a suite (default: `5`) |
| `--expect.requireAssertions` | Require that all tests have at least one assertion |
| `--expect.poll.interval <interval>` | Poll interval in milliseconds for `expect.poll()` assertions (default: `50`) |
| `--expect.poll.timeout <timeout>` | Poll timeout in milliseconds for `expect.poll()` assertions (default: `1000`) |
| `--run` | Disable watch mode |
| `--no-color` | Removes colors from the console output |
| `--clearScreen` | Clear terminal screen when re-running tests during watch mode (default: `true`) |
| `--standalone` | Start Vitest without running tests. File filters will be ignored, tests will be running only on change (default: `false`) |
| `--mergeReports [path]` | Paths to blob reports directory. If this options is used, Vitest won't run any tests, it will only report previously recorded tests |
>>>>>>> 9c84cbbf2d2146bbe531b3eedee56fd34df65822
