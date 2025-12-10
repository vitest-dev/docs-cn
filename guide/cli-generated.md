### root

- **CLI:** `-r, --root <path>`
- **Config:** [root](/config/root)

根路径

### config

- **命令行终端:** `-c, --config <path>`

配置文件的路径

### update

- **CLI:** `-u, --update`
- **Config:** [update](/config/update)

更新快照

### watch

- **CLI:** `-w, --watch`
- **Config:** [watch](/config/watch)

启用观察模式

### testNamePattern

- **CLI:** `-t, --testNamePattern <pattern>`
- **Config:** [testNamePattern](/config/testnamepattern)

使用符合指定 regexp 模式的运行测试

### dir

- **CLI:** `--dir <path>`
- **Config:** [dir](/config/dir)

扫描测试文件的基本目录

### ui

- **CLI:** `--ui`

启用 UI 模式

### open

- **CLI:** `--open`
- **Config:** [open](/config/open)

自动打开用户界面（默认值：`!process.env.CI`）

### api.port

- **命令行终端:** `--api.port [port]`

指定服务器端口。注意，如果端口已被使用，Vite 会自动尝试下一个可用端口，因此这可能不是服务器最终监听的实际端口。如果为 `true`，将设置为`51204`

### api.host

- **命令行终端:** `--api.host [host]`

指定服务器应该监听哪些 IP 地址。设为 `0.0.0.0` 或 `true` 则监听所有地址，包括局域网地址和公共地址

### api.strictPort

- **命令行终端:** `--api.strictPort`

设置为 true 时，如果端口已被使用，则退出，而不是自动尝试下一个可用端口

### silent

- **CLI:** `--silent [value]`
- **Config:** [silent](/config/silent)

测试的静默控制台输出。使用 `'passed-only'` 仅查看失败测试的日志

### hideSkippedTests

- **命令行终端:** `--hideSkippedTests`

隐藏跳过测试的日志

### reporters

- **CLI:** `--reporter <name>`
- **Config:** [reporters](/config/reporters)

指定报告器（default、blob、verbose、dot、json、tap、tap-flat、junit、tree、hanging-process、github-actions）

### outputFile

- **CLI:** `--outputFile <filename/-s>`
- **Config:** [outputFile](/config/outputfile)

如果还指定了支持报告程序，则将测试结果写入文件，使用 cac 的点符号表示多个报告程序的单个输出结果 (比如: `--outputFile.tap=./tap.txt`)

### coverage.provider

- **CLI:** `--coverage.provider <name>`
- **Config:** [coverage.provider](/config/coverage#coverage-provider)

选择覆盖范围采集工具，可用值为: "v8", "istanbul" and "custom"

### coverage.enabled

- **CLI:** `--coverage.enabled`
- **Config:** [coverage.enabled](/config/coverage#coverage-enabled)

启用覆盖范围收集。可使用 `--coverage` CLI 选项覆盖（默认值：`false`）

### coverage.include

- **CLI:** `--coverage.include <pattern>`
- **Config:** [coverage.include](/config/coverage#coverage-include)

作为通配符模式包含在覆盖率中的文件。在使用多个模式时可以指定多次。默认情况下，只包含被测试覆盖的文件

### coverage.exclude

- **CLI:** `--coverage.exclude <pattern>`
- **Config:** [coverage.exclude](/config/coverage#coverage-exclude)

覆盖范围中要排除的文件。使用多个扩展名时，可指定多次

### coverage.clean

- **CLI:** `--coverage.clean`
- **Config:** [coverage.clean](/config/coverage#coverage-clean)

运行测试前清除覆盖结果（默认值：true）

### coverage.cleanOnRerun

- **CLI:** `--coverage.cleanOnRerun`
- **Config:** [coverage.cleanOnRerun](/config/coverage#coverage-cleanonrerun)

重新运行监视时清理覆盖率报告（默认值：true）

### coverage.reportsDirectory

- **CLI:** `--coverage.reportsDirectory <path>`
- **Config:** [coverage.reportsDirectory](/config/coverage#coverage-reportsdirectory)

将覆盖率报告写入的目录（默认值： ./coverage）

### coverage.reporter

- **CLI:** `--coverage.reporter <name>`
- **Config:** [coverage.reporter](/config/coverage#coverage-reporter)

Coverage reporters to use. Visit [`coverage.reporter`](/config/#coverage-reporter) for more information (default: `["text", "html", "clover", "json"]`)

### coverage.reportOnFailure

- **CLI:** `--coverage.reportOnFailure`
- **Config:** [coverage.reportOnFailure](/config/coverage#coverage-reportonfailure)

即使测试失败也能生成覆盖率报告 (默认值: `false`)

### coverage.allowExternal

- **CLI:** `--coverage.allowExternal`
- **Config:** [coverage.allowExternal](/config/coverage#coverage-allowexternal)

收集项目根目录外文件的覆盖范围（默认值：`false`）

### coverage.skipFull

- **CLI:** `--coverage.skipFull`
- **Config:** [coverage.skipFull](/config/coverage#coverage-skipfull)

不显示语句、分支和函数覆盖率为 100% 的文件（默认值：`false`）

### coverage.thresholds.100

- **CLI:** `--coverage.thresholds.100`
- **Config:** [coverage.thresholds.100](/config/coverage#coverage-thresholds-100)

将所有覆盖率阈值设置为 100 的快捷方式（默认值：`false`）

### coverage.thresholds.perFile

- **CLI:** `--coverage.thresholds.perFile`
- **Config:** [coverage.thresholds.perFile](/config/coverage#coverage-thresholds-perfile)

检查每个文件的阈值。 `--coverage.thresholds.lines`, `--coverage.thresholds.functions`, `--coverage.thresholds.branches`, `--coverage.thresholds.statements` 为实际阈值（默认值：`false`）

### coverage.thresholds.autoUpdate

- **CLI:** `--coverage.thresholds.autoUpdate <boolean|function>`
- **Config:** [coverage.thresholds.autoUpdate](/config/coverage#coverage-thresholds-autoupdate)

更新阈值： 当前覆盖率高于配置的阈值时，将 "lines"、"functions"、"branches"和 "statements"更新到配置文件（默认值：`false`）

### coverage.thresholds.lines

- **命令行终端:** `--coverage.thresholds.lines <number>`

针对代码行的覆盖度阈值设定，请访问 [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) 了解更多信息。此选项不适用于自定义 providers

### coverage.thresholds.functions

- **命令行终端:** `--coverage.thresholds.functions <number>`

针对函数的覆盖度阈值设定，请访问 [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) 了解更多信息。 此选项不适用于自定义 providers

### coverage.thresholds.branches

- **命令行终端:** `--coverage.thresholds.branches <number>`

针对 branches 的覆盖度阈值设定，请访问 [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) 了解更多信息。 此选项不适用于自定义 providers

### coverage.thresholds.statements

- **命令行终端:** `--coverage.thresholds.statements <number>`

针对 statements 的覆盖度阈值设定，请访问 [istanbuljs](https://github.com/istanbuljs/nyc#coverage-thresholds) 了解更多信息。 此选项不适用于自定义 providers

### coverage.ignoreClassMethods

- **CLI:** `--coverage.ignoreClassMethods <name>`
- **Config:** [coverage.ignoreClassMethods](/config/coverage#coverage-ignoreclassmethods)

覆盖时要忽略的类方法名称数组。更多信息请访问 [istanbuljs](https://github.com/istanbuljs/nyc#ignoring-methods) 。该选项仅适用于 istanbul providers（默认值：`[]`）

### coverage.processingConcurrency

- **CLI:** `--coverage.processingConcurrency <number>`
- **Config:** [coverage.processingConcurrency](/config/coverage#coverage-processingconcurrency)

处理覆盖率结果时使用的并发限制。 （默认最小值介于 20 和 CPU 数量之间）

### coverage.customProviderModule

- **CLI:** `--coverage.customProviderModule <path>`
- **Config:** [coverage.customProviderModule](/config/coverage#coverage-customprovidermodule)

Specifies the module name or path for the custom coverage provider module. Visit [Custom Coverage Provider](/guide/coverage#custom-coverage-provider) for more information. This option is only available for custom providers

### coverage.watermarks.statements

- **命令行终端:** `--coverage.watermarks.statements <watermarks>`

语句覆盖率高/低阈值，格式： `<high>,<low>`

### coverage.watermarks.lines

- **命令行终端:** `--coverage.watermarks.lines <watermarks>`

行覆盖率高/低阈值，格式： `<high>,<low>`

### coverage.watermarks.branches

- **命令行终端:** `--coverage.watermarks.branches <watermarks>`

分支覆盖率高/低阈值，格式： `<high>,<low>`

### coverage.watermarks.functions

- **命令行终端:** `--coverage.watermarks.functions <watermarks>`

函数覆盖率高/低阈值，格式： `<high>,<low>`

### mode

- **CLI:** `--mode <name>`
- **Config:** [mode](/config/mode)

覆盖 Vite 模式 (默认值: `test` 或 `benchmark`)

### isolate

- **CLI:** `--isolate`
- **Config:** [isolate](/config/isolate)

隔离运行每个测试文件。要禁用隔离, 使用 `--no-isolate` (默认值: `true`)

### globals

- **CLI:** `--globals`
- **Config:** [globals](/config/globals)

全局注入

### dom

- **命令行终端:** `--dom`

使用 happy-dom 模拟浏览器 API

### browser.enabled

- **CLI:** `--browser.enabled`
- **Config:** [browser.enabled](/config/browser/enabled)

在浏览器中运行测试。 相当于 `--browser.enabled` (默认值: `false`)
<!-- TODO: translation -->
### browser.name

- **CLI:** `--browser.name <name>`

Run all tests in a specific browser. Some browsers are only available for specific providers (see `--browser.provider`).

### browser.headless

- **CLI:** `--browser.headless`
- **Config:** [browser.headless](/config/browser/headless)

在无头模式下运行浏览器（即不打开图形用户界面）。如果在 CI 中运行 Vitest，默认情况下将启用无头模式 (默认值: `process.env.CI`)

### browser.api.port

- **CLI:** `--browser.api.port [port]`
- **Config:** [browser.api.port](/config/browser/api#api-port)

指定服务器端口。注意，如果端口已被使用，Vite 会自动尝试下一个可用端口，因此这可能不是服务器最终监听的实际端口。如果为 `true`，将设置为 `63315`

### browser.api.host

- **CLI:** `--browser.api.host [host]`
- **Config:** [browser.api.host](/config/browser/api#api-host)

指定服务器应该监听哪些 IP 地址。设为 `0.0.0.0` 或 `true` 则监听所有地址，包括局域网地址和公共地址

### browser.api.strictPort

- **CLI:** `--browser.api.strictPort`
- **Config:** [browser.api.strictPort](/config/browser/api#api-strictport)

设置为 true 时，如果端口已被使用，则退出，而不是自动尝试下一个可用端口

### browser.isolate

- **CLI:** `--browser.isolate`
- **Config:** [browser.isolate](/config/browser/isolate)

隔离运行每个浏览器测试文件。要禁用隔离请使用 `--browser.isolate=false` (默认值: `true`)

### browser.ui

- **CLI:** `--browser.ui`
- **Config:** [browser.ui](/config/browser/ui)

运行测试时显示 Vitest UI (默认值: `!process.env.CI`)

### browser.fileParallelism

- **CLI:** `--browser.fileParallelism`

浏览器测试文件是否应并行运行。使用 `--browser.fileParallelism=false` 进行禁用 (默认值: `true`)

### browser.connectTimeout

- **CLI:** `--browser.connectTimeout <timeout>`
- **Config:** [browser.connectTimeout](/config/browser/connecttimeout)

如果连接浏览器时间超时，测试套件将失败 (默认值: `60_000`)

### browser.trackUnhandledErrors

- **CLI:** `--browser.trackUnhandledErrors`
- **Config:** [browser.trackUnhandledErrors](/config/browser/trackunhandlederrors)

控制 Vitest 是否捕获未捕获的异常以便报告（默认：`true`）

### browser.trace

- **CLI:** `--browser.trace <mode>`
- **Config:** [browser.trace](/config/browser/trace)

启用追踪视图模式。 可选项: "on", "off", "on-first-retry", "on-all-retries", "retain-on-failure"

### pool

- **CLI:** `--pool <pool>`
- **Config:** [pool](/config/pool)

如果未在浏览器中运行，则指定 pool (默认值: `threads`)

### execArgv

- **CLI:** `--execArgv <option>`
- **Config:** [execArgv](/config/execargv)

Pass additional arguments to `node` process when spawning `worker_threads` or `child_process`.

### vmMemoryLimit

- **CLI:** `--vmMemoryLimit <limit>`
- **Config:** [vmMemoryLimit](/config/vmmemorylimit)

Memory limit for VM pools. If you see memory leaks, try to tinker this value.

### fileParallelism

- **CLI:** `--fileParallelism`
- **Config:** [fileParallelism](/config/fileparallelism)

是否所有测试文件都应并行运行. 使用 `--no-file-parallelism` 去禁用 (默认值: `true`)

### maxWorkers

- **CLI:** `--maxWorkers <workers>`
- **Config:** [maxWorkers](/config/maxworkers)

同时并发执行测试任务的最大线程数或百分比

### environment

- **CLI:** `--environment <name>`
- **Config:** [environment](/config/environment)

如果不在浏览器中运行，则指定运行环境 (默认值: `node`)

### passWithNoTests

- **CLI:** `--passWithNoTests`
- **Config:** [passWithNoTests](/config/passwithnotests)

未发现测试时通过

### logHeapUsage

- **CLI:** `--logHeapUsage`
- **Config:** [logHeapUsage](/config/logheapusage)

在节点中运行时，显示每个测试的堆大小

### allowOnly

- **CLI:** `--allowOnly`
- **Config:** [allowOnly](/config/allowonly)

允许执行那些被标记为"only"的测试用例或测试套件 (默认值: `!process.env.CI`)

### dangerouslyIgnoreUnhandledErrors

- **CLI:** `--dangerouslyIgnoreUnhandledErrors`
- **Config:** [dangerouslyIgnoreUnhandledErrors](/config/dangerouslyignoreunhandlederrors)

忽略任何未处理的错误

### sequence.shuffle.files

- **CLI:** `--sequence.shuffle.files`
- **Config:** [sequence.shuffle.files](/config/sequence#sequence-shuffle-files)

以随机顺序运行文件。如果启用此选项，长时间运行的测试将不会提前开始。 (默认值: `false`)

### sequence.shuffle.tests

- **CLI:** `--sequence.shuffle.tests`
- **Config:** [sequence.shuffle.tests](/config/sequence#sequence-shuffle-tests)

以随机方式运行测试（默认值：`false`）

### sequence.concurrent

- **CLI:** `--sequence.concurrent`
- **Config:** [sequence.concurrent](/config/sequence#sequence-concurrent)

使测试并行运行（默认值：`false`）

### sequence.seed

- **CLI:** `--sequence.seed <seed>`
- **Config:** [sequence.seed](/config/sequence#sequence-seed)

设置随机化种子。如果 --sequence.shuffle（随机序列）是`false`，则此选项无效。 t 通过 ["Random Seed" page](https://en.wikipedia.org/wiki/Random_seed) 查看更多信息
<!-- TODO: translation -->
### sequence.hooks

- **CLI:** `--sequence.hooks <order>`
- **Config:** [sequence.hooks](/config/sequence#sequence-hooks)

Changes the order in which hooks are executed. Accepted values are: "stack", "list" and "parallel". Visit [`sequence.hooks`](/config/#sequence-hooks) for more information (default: `"parallel"`)

### sequence.setupFiles

- **CLI:** `--sequence.setupFiles <order>`
- **Config:** [sequence.setupFiles](/config/sequence#sequence-setupfiles)

更改设置文件的执行顺序。可接受的值有 "list" 和 "parallel"。如果设置为"list"，将按照定义的顺序运行设置文件。如果设置为 "parallel"，将并行运行设置文件（默认值：`"parallel"`）

### inspect

- **CLI:** `--inspect [[host:]port]`

启用 Node.js 检查器（默认值：`127.0.0.1:9229`）

### inspectBrk

- **CLI:** `--inspectBrk [[host:]port]`

启用 Node.js 检查器并在测试开始前中断

### testTimeout

- **CLI:** `--testTimeout <timeout>`
- **Config:** [testTimeout](/config/testtimeout)

测试的默认超时（毫秒）（默认值：`5000`）。使用 `0` 完全禁用超时

### hookTimeout

- **CLI:** `--hookTimeout <timeout>`
- **Config:** [hookTimeout](/config/hooktimeout)

默认钩子超时（以毫秒为单位）（默认值：`10000`）。使用 `0` 完全禁用超时

### bail

- **CLI:** `--bail <number>`
- **Config:** [bail](/config/bail)

当指定数量的测试失败时停止测试执行（默认值：`0`）

### retry

- **CLI:** `--retry <times>`
- **Config:** [retry](/config/retry)

如果测试失败，重试特定次数（默认值： `0`）

### diff.aAnnotation

- **CLI:** `--diff.aAnnotation <annotation>`
- **Config:** [diff.aAnnotation](/config/diff#diff-aannotation)

预期值的行注释 (默认值: `Expected`)

### diff.aIndicator

- **CLI:** `--diff.aIndicator <indicator>`
- **Config:** [diff.aIndicator](/config/diff#diff-aindicator)

预期值的行标识 (默认值: `-`)

### diff.bAnnotation

- **CLI:** `--diff.bAnnotation <annotation>`
- **Config:** [diff.bAnnotation](/config/diff#diff-bannotation)

实际值的行注释 (默认值: `Received`)

### diff.bIndicator

- **CLI:** `--diff.bIndicator <indicator>`
- **Config:** [diff.bIndicator](/config/diff#diff-bindicator)

实际值的行标识 (默认值: `+`)

### diff.commonIndicator

- **CLI:** `--diff.commonIndicator <indicator>`
- **Config:** [diff.commonIndicator](/config/diff#diff-commonindicator)

公共行标识 （默认值: ` `）

### diff.contextLines

- **CLI:** `--diff.contextLines <lines>`
- **Config:** [diff.contextLines](/config/diff#diff-contextlines)

每次变更显示上下文行数 （默认值: `5`）

### diff.emptyFirstOrLastLinePlaceholder

- **CLI:** `--diff.emptyFirstOrLastLinePlaceholder <placeholder>`
- **Config:** [diff.emptyFirstOrLastLinePlaceholder](/config/diff#diff-emptyfirstorlastlineplaceholder)

空首行或空末行的占位符 （默认值: `""`）

### diff.expand

- **CLI:** `--diff.expand`
- **Config:** [diff.expand](/config/diff#diff-expand)

展开所有公共行 （默认值: `true`）

### diff.includeChangeCounts

- **CLI:** `--diff.includeChangeCounts`
- **Config:** [diff.includeChangeCounts](/config/diff#diff-includechangecounts)

在 diff 的输出中输出比较计数 （默认值: `false`）

### diff.omitAnnotationLines

- **CLI:** `--diff.omitAnnotationLines`
- **Config:** [diff.omitAnnotationLines](/config/diff#diff-omitannotationlines)

省略输出中的注释行 (默认值: `false`)

### diff.printBasicPrototype

- **CLI:** `--diff.printBasicPrototype`
- **Config:** [diff.printBasicPrototype](/config/diff#diff-printbasicprototype)

打印基础的原型 `Object` 和 `Array` (默认值: `true`)

### diff.maxDepth

- **CLI:** `--diff.maxDepth <maxDepth>`
- **Config:** [diff.maxDepth](/config/diff#diff-maxdepth)

打印嵌套对象时，递归深度限制 (默认值: `20`)

### diff.truncateThreshold

- **CLI:** `--diff.truncateThreshold <threshold>`
- **Config:** [diff.truncateThreshold](/config/diff#diff-truncatethreshold)

显示成每次变更前后的行数 (默认值: `0`)

### diff.truncateAnnotation

- **CLI:** `--diff.truncateAnnotation <annotation>`
- **Config:** [diff.truncateAnnotation](/config/diff#diff-truncateannotation)

在 diff 结果末尾输出的注释（如果被截断） (默认值: `... Diff result is truncated`)

### exclude

- **CLI:** `--exclude <glob>`
- **Config:** [exclude](/config/exclude)

测试中排除的其他文件路径匹配模式

### expandSnapshotDiff

- **CLI:** `--expandSnapshotDiff`
- **Config:** [expandSnapshotDiff](/config/expandsnapshotdiff)

快照失败时显示完整差异

### disableConsoleIntercept

- **CLI:** `--disableConsoleIntercept`
- **Config:** [disableConsoleIntercept](/config/disableconsoleintercept)

禁用自动拦截控制台日志（默认值：`false`）

### typecheck.enabled

- **CLI:** `--typecheck.enabled`
- **Config:** [typecheck.enabled](/config/typecheck#typecheck-enabled)

在测试的同时启用类型检查（默认值：`false`）

### typecheck.only

- **CLI:** `--typecheck.only`
- **Config:** [typecheck.only](/config/typecheck#typecheck-only)

仅运行类型检查测试。这将自动启用类型检查（默认值：`false`）

### typecheck.checker

- **CLI:** `--typecheck.checker <name>`
- **Config:** [typecheck.checker](/config/typecheck#typecheck-checker)

指定要使用的类型检查器。可用值为 "tsc"和 "vue-tsc "以及一个可执行文件的路径（默认值：`tsc`）

### typecheck.allowJs

- **CLI:** `--typecheck.allowJs`
- **Config:** [typecheck.allowJs](/config/typecheck#typecheck-allowjs)

允许对 JavaScript 文件进行类型检查。默认值取自 tsconfig.json

### typecheck.ignoreSourceErrors

- **CLI:** `--typecheck.ignoreSourceErrors`
- **Config:** [typecheck.ignoreSourceErrors](/config/typecheck#typecheck-ignoresourceerrors)

忽略源文件中的类型错误

### typecheck.tsconfig

- **CLI:** `--typecheck.tsconfig <path>`
- **Config:** [typecheck.tsconfig](/config/typecheck#typecheck-tsconfig)

自定义 tsconfig 文件的路径

### typecheck.spawnTimeout

- **CLI:** `--typecheck.spawnTimeout <time>`
- **Config:** [typecheck.spawnTimeout](/config/typecheck#typecheck-spawntimeout)

类型检查器启动所需最短时间（以毫秒为单位）

### project

- **CLI:** `--project <name>`

如果我们正在使用 Vitest 的工作区功能，这是要运行的项目名称。这个参数可以重复以指定多个项目：`--project=1 --project=2`。我们还可以使用通配符来过滤项目，例如 `--project=packages*`，以及使用 `--project=!pattern` 来排除项目

### slowTestThreshold

- **CLI:** `--slowTestThreshold <threshold>`
- **Config:** [slowTestThreshold](/config/slowtestthreshold)

测试速度慢的阈值（以毫秒为单位）（默认值：`300`）

### teardownTimeout

- **CLI:** `--teardownTimeout <timeout>`
- **Config:** [teardownTimeout](/config/teardowntimeout)

拆卸函数的默认超时（以毫秒为单位）（默认值：`10000`）

### maxConcurrency

- **CLI:** `--maxConcurrency <number>`
- **Config:** [maxConcurrency](/config/maxconcurrency)

套件中并发测试的最大次数（默认值：`5`）

### expect.requireAssertions

- **CLI:** `--expect.requireAssertions`
- **Config:** [expect.requireAssertions](/config/expect#expect-requireassertions)

要求所有测试至少有一个断言

### expect.poll.interval

- **CLI:** `--expect.poll.interval <interval>`
- **Config:** [expect.poll.interval](/config/expect#expect-poll-interval)

断言的轮询间隔 `expect.poll()` (默认值: `50`)

### expect.poll.timeout

- **CLI:** `--expect.poll.timeout <timeout>`
- **Config:** [expect.poll.timeout](/config/expect#expect-poll-timeout)

断言的轮询超时（以毫秒为单位） `expect.poll()` (默认值: `1000`)

### printConsoleTrace

- **CLI:** `--printConsoleTrace`
- **Config:** [printConsoleTrace](/config/printconsoletrace)

始终打印控制台堆栈跟踪

### includeTaskLocation

- **CLI:** `--includeTaskLocation`
- **Config:** [includeTaskLocation](/config/includetasklocation)

在 `location` 属性中收集测试用例和测试套件的位置信息

### attachmentsDir

- **CLI:** `--attachmentsDir <dir>`
- **Config:** [attachmentsDir](/config/attachmentsdir)

`context.annotate` 方法所生成附件的存储目录 (默认值: `.vitest-attachments`)

### run

- **命令行终端:** `--run`

禁用 watch 模式

### color

- **命令行终端:** `--no-color`

删除控制台输出中的颜色

### clearScreen

- **命令行终端:** `--clearScreen`

watch 模式下重新运行测试时清除终端屏幕（默认值：`true`）

### configLoader

- **命令行终端:** `--configLoader <loader>`

使用 `bundle` 将配置打包到 esbuild 中，或使用 `runner`（实验性功能）进行动态处理。此功能仅适用于 Vite 6.1.0 及更高版本可使用 (默认值: `bundle`)

### standalone

- **命令行终端:** `--standalone`

Start Vitest without running tests. Tests will be running only on change. This option is ignored when CLI file filters are passed. (default: `false`)

### clearCache

- **CLI:** `--clearCache`

Delete all Vitest caches, including `experimental.fsModuleCache`, without running any tests. This will reduce the performance in the subsequent test run.

### experimental.fsModuleCache

- **CLI:** `--experimental.fsModuleCache`
- **Config:** [experimental.fsModuleCache](/config/experimental#experimental-fsmodulecache)

Enable caching of modules on the file system between reruns.
