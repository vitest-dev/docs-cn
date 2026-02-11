### root

- **命令行终端:** `-r, --root <path>`
- **配置:** [root](/config/root)

根路径

### config

- **命令行终端:** `-c, --config <path>`

配置文件的路径

### update

- **命令行终端:** `-u, --update [type]`
- **配置:** [update](/config/update)

更新快照（接受 boolean, "new" 或 "all"）

### watch

- **命令行终端:** `-w, --watch`
- **配置:** [watch](/config/watch)

启用观察模式

### testNamePattern

- **命令行终端:** `-t, --testNamePattern <pattern>`
- **配置:** [testNamePattern](/config/testnamepattern)

使用符合指定 regexp 模式的运行测试

### dir

- **命令行终端:** `--dir <path>`
- **配置:** [dir](/config/dir)

扫描测试文件的基本目录

### ui

- **命令行终端:** `--ui`

启用 UI 模式

### open

- **命令行终端:** `--open`
- **配置:** [open](/config/open)

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

### api.allowExec

- **命令行终端:** `--api.allowExec`
- **配置:** [api.allowExec](/config/api#api-allowexec)

允许 API 执行代码。（在非受信环境中启用此选项时需谨慎）

### api.allowWrite

- **命令行终端:** `--api.allowWrite`
- **配置:** [api.allowWrite](/config/api#api-allowwrite)

允许 API 编辑文件。（在非受信环境中启用此选项时需谨慎）

### silent

- **命令行终端:** `--silent [value]`
- **配置:** [silent](/config/silent)

测试的静默控制台输出。使用 `'passed-only'` 仅查看失败测试的日志

### hideSkippedTests

- **命令行终端:** `--hideSkippedTests`

隐藏跳过测试的日志

### reporters

- **命令行终端:** `--reporter <name>`
- **配置:** [reporters](/config/reporters)

指定报告器（default、blob、verbose、dot、json、tap、tap-flat、junit、tree、hanging-process、github-actions）

### outputFile

- **命令行终端:** `--outputFile <filename/-s>`
- **配置:** [outputFile](/config/outputfile)

如果还指定了支持报告程序，则将测试结果写入文件，使用 cac 的点符号表示多个报告程序的单个输出结果 (比如: `--outputFile.tap=./tap.txt`)

### coverage.provider

- **命令行终端:** `--coverage.provider <name>`
- **配置:** [coverage.provider](/config/coverage#coverage-provider)

选择覆盖范围采集工具，可用值为: "v8", "istanbul" and "custom"

### coverage.enabled

- **命令行终端:** `--coverage.enabled`
- **配置:** [coverage.enabled](/config/coverage#coverage-enabled)

启用覆盖范围收集。可使用 `--coverage` CLI 选项覆盖（默认值：`false`）

### coverage.include

- **命令行终端:** `--coverage.include <pattern>`
- **配置:** [coverage.include](/config/coverage#coverage-include)

作为通配符模式包含在覆盖率中的文件。在使用多个模式时可以指定多次。默认情况下，只包含被测试覆盖的文件

### coverage.exclude

- **命令行终端:** `--coverage.exclude <pattern>`
- **配置:** [coverage.exclude](/config/coverage#coverage-exclude)

覆盖范围中要排除的文件。使用多个扩展名时，可指定多次

### coverage.clean

- **命令行终端:** `--coverage.clean`
- **配置:** [coverage.clean](/config/coverage#coverage-clean)

运行测试前清除覆盖结果（默认值：true）

### coverage.cleanOnRerun

- **命令行终端:** `--coverage.cleanOnRerun`
- **配置:** [coverage.cleanOnRerun](/config/coverage#coverage-cleanonrerun)

重新运行监视时清理覆盖率报告（默认值：true）

### coverage.reportsDirectory

- **命令行终端:** `--coverage.reportsDirectory <path>`
- **配置:** [coverage.reportsDirectory](/config/coverage#coverage-reportsdirectory)

将覆盖率报告写入的目录（默认值： ./coverage）

### coverage.reporter

- **命令行终端:** `--coverage.reporter <name>`
- **配置:** [coverage.reporter](/config/coverage#coverage-reporter)

Coverage reporters to use. Visit [`coverage.reporter`](/config/coverage#coverage-reporter) for more information (default: `["text", "html", "clover", "json"]`)

### coverage.reportOnFailure

- **命令行终端:** `--coverage.reportOnFailure`
- **配置:** [coverage.reportOnFailure](/config/coverage#coverage-reportonfailure)

即使测试失败也能生成覆盖率报告 (默认值: `false`)

### coverage.allowExternal

- **命令行终端:** `--coverage.allowExternal`
- **配置:** [coverage.allowExternal](/config/coverage#coverage-allowexternal)

收集项目根目录外文件的覆盖范围（默认值：`false`）

### coverage.skipFull

- **命令行终端:** `--coverage.skipFull`
- **配置:** [coverage.skipFull](/config/coverage#coverage-skipfull)

不显示语句、分支和函数覆盖率为 100% 的文件（默认值：`false`）

### coverage.thresholds.100

- **命令行终端:** `--coverage.thresholds.100`
- **配置:** [coverage.thresholds.100](/config/coverage#coverage-thresholds-100)

将所有覆盖率阈值设置为 100 的快捷方式（默认值：`false`）

### coverage.thresholds.perFile

- **命令行终端:** `--coverage.thresholds.perFile`
- **配置:** [coverage.thresholds.perFile](/config/coverage#coverage-thresholds-perfile)

检查每个文件的阈值。 `--coverage.thresholds.lines`, `--coverage.thresholds.functions`, `--coverage.thresholds.branches`, `--coverage.thresholds.statements` 为实际阈值（默认值：`false`）

### coverage.thresholds.autoUpdate

- **命令行终端:** `--coverage.thresholds.autoUpdate <boolean|function>`
- **配置:** [coverage.thresholds.autoUpdate](/config/coverage#coverage-thresholds-autoupdate)

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

- **命令行终端:** `--coverage.ignoreClassMethods <name>`
- **配置:** [coverage.ignoreClassMethods](/config/coverage#coverage-ignoreclassmethods)

覆盖时要忽略的类方法名称数组。更多信息请访问 [istanbuljs](https://github.com/istanbuljs/nyc#ignoring-methods) 。该选项仅适用于 istanbul providers（默认值：`[]`）

### coverage.processingConcurrency

- **命令行终端:** `--coverage.processingConcurrency <number>`
- **配置:** [coverage.processingConcurrency](/config/coverage#coverage-processingconcurrency)

处理覆盖率结果时使用的并发限制。 （默认最小值介于 20 和 CPU 数量之间）

### coverage.customProviderModule

- **命令行终端:** `--coverage.customProviderModule <path>`
- **配置:** [coverage.customProviderModule](/config/coverage#coverage-customprovidermodule)

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

- **命令行终端:** `--mode <name>`
- **配置:** [mode](/config/mode)

覆盖 Vite 模式 (默认值: `test` 或 `benchmark`)

### isolate

- **命令行终端:** `--isolate`
- **配置:** [isolate](/config/isolate)

隔离运行每个测试文件。要禁用隔离, 使用 `--no-isolate` (默认值: `true`)

### globals

- **命令行终端:** `--globals`
- **配置:** [globals](/config/globals)

全局注入

### dom

- **命令行终端:** `--dom`

使用 happy-dom 模拟浏览器 API

### browser.enabled

- **命令行终端:** `--browser.enabled`
- **配置:** [browser.enabled](/config/browser/enabled)

在浏览器中运行测试。 相当于 `--browser.enabled` (默认值: `false`)

### browser.name

- **命令行终端:** `--browser.name <name>`

在指定浏览器中运行所有测试。某些浏览器仅适用于特定的 provider（详情请参见 `--browser.provider`）

### browser.headless

- **命令行终端:** `--browser.headless`
- **配置:** [browser.headless](/config/browser/headless)

在无头模式下运行浏览器（即不打开图形用户界面）。如果在 CI 中运行 Vitest，默认情况下将启用无头模式 (默认值: `process.env.CI`)

### browser.api.port

- **命令行终端:** `--browser.api.port [port]`
- **配置:** [browser.api.port](/config/browser/api#api-port)

指定服务器端口。注意，如果端口已被使用，Vite 会自动尝试下一个可用端口，因此这可能不是服务器最终监听的实际端口。如果为 `true`，将设置为 `63315`

### browser.api.host

- **命令行终端:** `--browser.api.host [host]`
- **配置:** [browser.api.host](/config/browser/api#api-host)

指定服务器应该监听哪些 IP 地址。设为 `0.0.0.0` 或 `true` 则监听所有地址，包括局域网地址和公共地址

### browser.api.strictPort

- **命令行终端:** `--browser.api.strictPort`
- **配置:** [browser.api.strictPort](/config/browser/api#api-strictport)

设置为 true 时，如果端口已被使用，则退出，而不是自动尝试下一个可用端口

### browser.api.allowExec

- **命令行终端:** `--browser.api.allowExec`
- **配置:** [browser.api.allowExec](/config/browser/api#api-allowexec)

允许 API 执行代码。（在非受信环境中启用此选项时需谨慎）

### browser.api.allowWrite

- **命令行终端:** `--browser.api.allowWrite`
- **配置:** [browser.api.allowWrite](/config/browser/api#api-allowwrite)

允许 API 编辑文件。（在非受信环境中启用此选项时需谨慎）

### browser.isolate

- **命令行终端:** `--browser.isolate`
- **配置:** [browser.isolate](/config/browser/isolate)

隔离运行每个浏览器测试文件。要禁用隔离请使用 `--browser.isolate=false` (默认值: `true`)

### browser.ui

- **命令行终端:** `--browser.ui`
- **配置:** [browser.ui](/config/browser/ui)

运行测试时显示 Vitest UI (默认值: `!process.env.CI`)

### browser.detailsPanelPosition

- **命令行终端:** `--browser.detailsPanelPosition <position>`
- **配置:** [browser.detailsPanelPosition](/config/browser/detailspanelposition)

浏览器模式下详情面板的默认位置。可选 `right`（水平分割）或 `bottom`（垂直分割）（默认值：`right`）

### browser.fileParallelism

- **命令行终端:** `--browser.fileParallelism`

浏览器测试文件是否应并行运行。使用 `--browser.fileParallelism=false` 进行禁用（默认值: `true`）

### browser.connectTimeout

- **命令行终端:** `--browser.connectTimeout <timeout>`
- **配置:** [browser.connectTimeout](/config/browser/connecttimeout)

如果连接浏览器时间超时，测试套件将失败 (默认值: `60_000`)

### browser.trackUnhandledErrors

- **命令行终端:** `--browser.trackUnhandledErrors`
- **配置:** [browser.trackUnhandledErrors](/config/browser/trackunhandlederrors)

控制 Vitest 是否捕获未捕获的异常以便报告（默认：`true`）

### browser.trace

- **命令行终端:** `--browser.trace <mode>`
- **配置:** [browser.trace](/config/browser/trace)

启用追踪视图模式。 可选项: "on", "off", "on-first-retry", "on-all-retries", "retain-on-failure"

### pool

- **命令行终端:** `--pool <pool>`
- **配置:** [pool](/config/pool)

如果未在浏览器中运行，则指定 pool (默认值: `threads`)

### execArgv

- **命令行终端:** `--execArgv <option>`
- **配置:** [execArgv](/config/execargv)

Pass additional arguments to `node` process when spawning `worker_threads` or `child_process`.

### vmMemoryLimit

- **命令行终端:** `--vmMemoryLimit <limit>`
- **配置:** [vmMemoryLimit](/config/vmmemorylimit)

Memory limit for VM pools. If you see memory leaks, try to tinker this value.

### fileParallelism

- **命令行终端:** `--fileParallelism`
- **配置:** [fileParallelism](/config/fileparallelism)

是否所有测试文件都应并行运行. 使用 `--no-file-parallelism` 去禁用 (默认值: `true`)

### maxWorkers

- **命令行终端:** `--maxWorkers <workers>`
- **配置:** [maxWorkers](/config/maxworkers)

同时并发执行测试任务的最大线程数或百分比

### environment

- **命令行终端:** `--environment <name>`
- **配置:** [environment](/config/environment)

如果不在浏览器中运行，则指定运行环境 (默认值: `node`)

### passWithNoTests

- **命令行终端:** `--passWithNoTests`
- **配置:** [passWithNoTests](/config/passwithnotests)

未发现测试时通过

### logHeapUsage

- **命令行终端:** `--logHeapUsage`
- **配置:** [logHeapUsage](/config/logheapusage)

在节点中运行时，显示每个测试的堆大小

### allowOnly

- **命令行终端:** `--allowOnly`
- **配置:** [allowOnly](/config/allowonly)

允许执行那些被标记为"only"的测试用例或测试套件 (默认值: `!process.env.CI`)

### dangerouslyIgnoreUnhandledErrors

- **命令行终端:** `--dangerouslyIgnoreUnhandledErrors`
- **配置:** [dangerouslyIgnoreUnhandledErrors](/config/dangerouslyignoreunhandlederrors)

忽略任何未处理的错误

### sequence.shuffle.files

- **命令行终端:** `--sequence.shuffle.files`
- **配置:** [sequence.shuffle.files](/config/sequence#sequence-shuffle-files)

以随机顺序运行文件。如果启用此选项，长时间运行的测试将不会提前开始。 (默认值: `false`)

### sequence.shuffle.tests

- **命令行终端:** `--sequence.shuffle.tests`
- **配置:** [sequence.shuffle.tests](/config/sequence#sequence-shuffle-tests)

以随机方式运行测试（默认值：`false`）

### sequence.concurrent

- **命令行终端:** `--sequence.concurrent`
- **配置:** [sequence.concurrent](/config/sequence#sequence-concurrent)

使测试并行运行（默认值：`false`）

### sequence.seed

- **命令行终端:** `--sequence.seed <seed>`
- **配置:** [sequence.seed](/config/sequence#sequence-seed)

设置随机化种子。如果 --sequence.shuffle（随机序列）是`false`，则此选项无效。 t 通过 ["Random Seed" page](https://en.wikipedia.org/wiki/Random_seed) 查看更多信息

### sequence.hooks

- **命令行终端:** `--sequence.hooks <order>`
- **配置:** [sequence.hooks](/config/sequence#sequence-hooks)

更改钩子函数的执行顺序。可接受的值有："stack"、"list" 和 "parallel"。详情请参阅 [`sequence.hooks`](/config/sequence#sequence-hooks)（默认值：`"parallel"`）

### sequence.setupFiles

- **命令行终端:** `--sequence.setupFiles <order>`
- **配置:** [sequence.setupFiles](/config/sequence#sequence-setupfiles)

更改设置文件的执行顺序。可接受的值有 "list" 和 "parallel"。如果设置为"list"，将按照定义的顺序运行设置文件。如果设置为 "parallel"，将并行运行设置文件（默认值：`"parallel"`）

### inspect

- **命令行终端:** `--inspect [[host:]port]`

启用 Node.js 检查器（默认值：`127.0.0.1:9229`）

### inspectBrk

- **命令行终端:** `--inspectBrk [[host:]port]`

启用 Node.js 检查器并在测试开始前中断

### testTimeout

- **命令行终端:** `--testTimeout <timeout>`
- **配置:** [testTimeout](/config/testtimeout)

测试的默认超时（毫秒）（默认值：`5000`）。使用 `0` 完全禁用超时

### hookTimeout

- **命令行终端:** `--hookTimeout <timeout>`
- **配置:** [hookTimeout](/config/hooktimeout)

默认钩子超时（以毫秒为单位）（默认值：`10000`）。使用 `0` 完全禁用超时

### bail

- **命令行终端:** `--bail <number>`
- **配置:** [bail](/config/bail)

当指定数量的测试失败时停止测试执行（默认值：`0`）

### retry.count

- **命令行终端:** `--retry.count <times>`
- **配置:** [retry.count](/config/retry#retry-count)

如果测试失败，重试特定次数（默认值： `0`）

### retry.delay

- **命令行终端:** `--retry.delay <ms>`
- **配置:** [retry.delay](/config/retry#retry-delay)

重试之间的延迟时间（单位：毫秒）（默认值：`0`）

### retry.condition

- **命令行终端:** `--retry.condition <pattern>`
- **配置:** [retry.condition](/config/retry#retry-condition)

触发重试操作的错误信息匹配正则表达式。仅当错误信息符合该模式时才会执行重试（默认值：所有错误都会触发重试）

### diff.aAnnotation

- **命令行终端:** `--diff.aAnnotation <annotation>`
- **配置:** [diff.aAnnotation](/config/diff#diff-aannotation)

预期值的行注释 (默认值: `Expected`)

### diff.aIndicator

- **命令行终端:** `--diff.aIndicator <indicator>`
- **配置:** [diff.aIndicator](/config/diff#diff-aindicator)

预期值的行标识 (默认值: `-`)

### diff.bAnnotation

- **命令行终端:** `--diff.bAnnotation <annotation>`
- **配置:** [diff.bAnnotation](/config/diff#diff-bannotation)

实际值的行注释 (默认值: `Received`)

### diff.bIndicator

- **命令行终端:** `--diff.bIndicator <indicator>`
- **配置:** [diff.bIndicator](/config/diff#diff-bindicator)

实际值的行标识 (默认值: `+`)

### diff.commonIndicator

- **命令行终端:** `--diff.commonIndicator <indicator>`
- **配置:** [diff.commonIndicator](/config/diff#diff-commonindicator)

公共行标识 （默认值: ` `）

### diff.contextLines

- **命令行终端:** `--diff.contextLines <lines>`
- **配置:** [diff.contextLines](/config/diff#diff-contextlines)

每次变更显示上下文行数 （默认值: `5`）

### diff.emptyFirstOrLastLinePlaceholder

- **命令行终端:** `--diff.emptyFirstOrLastLinePlaceholder <placeholder>`
- **配置:** [diff.emptyFirstOrLastLinePlaceholder](/config/diff#diff-emptyfirstorlastlineplaceholder)

空首行或空末行的占位符 （默认值: `""`）

### diff.expand

- **命令行终端:** `--diff.expand`
- **配置:** [diff.expand](/config/diff#diff-expand)

展开所有公共行 （默认值: `true`）

### diff.includeChangeCounts

- **命令行终端:** `--diff.includeChangeCounts`
- **配置:** [diff.includeChangeCounts](/config/diff#diff-includechangecounts)

在 diff 的输出中输出比较计数 （默认值: `false`）

### diff.omitAnnotationLines

- **命令行终端:** `--diff.omitAnnotationLines`
- **配置:** [diff.omitAnnotationLines](/config/diff#diff-omitannotationlines)

省略输出中的注释行 (默认值: `false`)

### diff.printBasicPrototype

- **命令行终端:** `--diff.printBasicPrototype`
- **配置:** [diff.printBasicPrototype](/config/diff#diff-printbasicprototype)

打印基础的原型 `Object` 和 `Array` (默认值: `true`)

### diff.maxDepth

- **命令行终端:** `--diff.maxDepth <maxDepth>`
- **配置:** [diff.maxDepth](/config/diff#diff-maxdepth)

打印嵌套对象时，递归深度限制 (默认值: `20`)

### diff.truncateThreshold

- **命令行终端:** `--diff.truncateThreshold <threshold>`
- **配置:** [diff.truncateThreshold](/config/diff#diff-truncatethreshold)

显示成每次变更前后的行数 (默认值: `0`)

### diff.truncateAnnotation

- **命令行终端:** `--diff.truncateAnnotation <annotation>`
- **配置:** [diff.truncateAnnotation](/config/diff#diff-truncateannotation)

在 diff 结果末尾输出的注释（如果被截断） (默认值: `... Diff result is truncated`)

### exclude

- **命令行终端:** `--exclude <glob>`
- **配置:** [exclude](/config/exclude)

测试中排除的其他文件路径匹配模式

### expandSnapshotDiff

- **命令行终端:** `--expandSnapshotDiff`
- **配置:** [expandSnapshotDiff](/config/expandsnapshotdiff)

快照失败时显示完整差异

### disableConsoleIntercept

- **命令行终端:** `--disableConsoleIntercept`
- **配置:** [disableConsoleIntercept](/config/disableconsoleintercept)

禁用自动拦截控制台日志（默认值：`false`）

### typecheck.enabled

- **命令行终端:** `--typecheck.enabled`
- **配置:** [typecheck.enabled](/config/typecheck#typecheck-enabled)

在测试的同时启用类型检查（默认值：`false`）

### typecheck.only

- **命令行终端:** `--typecheck.only`
- **配置:** [typecheck.only](/config/typecheck#typecheck-only)

仅运行类型检查测试。这将自动启用类型检查（默认值：`false`）

### typecheck.checker

- **命令行终端:** `--typecheck.checker <name>`
- **配置:** [typecheck.checker](/config/typecheck#typecheck-checker)

指定要使用的类型检查器。可用值为 "tsc"和 "vue-tsc "以及一个可执行文件的路径（默认值：`tsc`）

### typecheck.allowJs

- **命令行终端:** `--typecheck.allowJs`
- **配置:** [typecheck.allowJs](/config/typecheck#typecheck-allowjs)

允许对 JavaScript 文件进行类型检查。默认值取自 tsconfig.json

### typecheck.ignoreSourceErrors

- **命令行终端:** `--typecheck.ignoreSourceErrors`
- **配置:** [typecheck.ignoreSourceErrors](/config/typecheck#typecheck-ignoresourceerrors)

忽略源文件中的类型错误

### typecheck.tsconfig

- **命令行终端:** `--typecheck.tsconfig <path>`
- **配置:** [typecheck.tsconfig](/config/typecheck#typecheck-tsconfig)

自定义 tsconfig 文件的路径

### typecheck.spawnTimeout

- **命令行终端:** `--typecheck.spawnTimeout <time>`
- **配置:** [typecheck.spawnTimeout](/config/typecheck#typecheck-spawntimeout)

类型检查器启动所需最短时间（以毫秒为单位）

### project

- **命令行终端:** `--project <name>`

如果我们正在使用 Vitest 的工作区功能，这是要运行的项目名称。这个参数可以重复以指定多个项目：`--project=1 --project=2`。我们还可以使用通配符来过滤项目，例如 `--project=packages*`，以及使用 `--project=!pattern` 来排除项目

### slowTestThreshold

- **命令行终端:** `--slowTestThreshold <threshold>`
- **配置:** [slowTestThreshold](/config/slowtestthreshold)

测试速度慢的阈值（以毫秒为单位）（默认值：`300`）

### teardownTimeout

- **命令行终端:** `--teardownTimeout <timeout>`
- **配置:** [teardownTimeout](/config/teardowntimeout)

拆卸函数的默认超时（以毫秒为单位）（默认值：`10000`）

### maxConcurrency

- **命令行终端:** `--maxConcurrency <number>`
- **配置:** [maxConcurrency](/config/maxconcurrency)

套件中并发测试的最大次数（默认值：`5`）

### expect.requireAssertions

- **命令行终端:** `--expect.requireAssertions`
- **配置:** [expect.requireAssertions](/config/expect#expect-requireassertions)

要求所有测试至少有一个断言

### expect.poll.interval

- **命令行终端:** `--expect.poll.interval <interval>`
- **配置:** [expect.poll.interval](/config/expect#expect-poll-interval)

断言的轮询间隔 `expect.poll()` (默认值: `50`)

### expect.poll.timeout

- **命令行终端:** `--expect.poll.timeout <timeout>`
- **配置:** [expect.poll.timeout](/config/expect#expect-poll-timeout)

断言的轮询超时（以毫秒为单位） `expect.poll()` (默认值: `1000`)

### printConsoleTrace

- **命令行终端:** `--printConsoleTrace`
- **配置:** [printConsoleTrace](/config/printconsoletrace)

始终打印控制台堆栈跟踪

### includeTaskLocation

- **命令行终端:** `--includeTaskLocation`
- **配置:** [includeTaskLocation](/config/includetasklocation)

在 `location` 属性中收集测试用例和测试套件的位置信息

### attachmentsDir

- **命令行终端:** `--attachmentsDir <dir>`
- **配置:** [attachmentsDir](/config/attachmentsdir)

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

单独启动 Vitest，且不运行任何测试。仅在文件变更时才运行测试。如果通过命令行参数过滤文件，此选项将被忽略。（默认值：`false`）

### listTags

- **命令行终端:** `--listTags [type]`

列出所有可用标签，且不运行任何测试。使用 `--list-tags=json` 参数将会以 JSON 格式输出标签，如果没有标签则不会输出。

### clearCache

- **命令行终端:** `--clearCache`

删除所有 Vitest 缓存，包括 `experimental.fsModuleCache`，且不运行任何测试。此操作会降低后续测试运行的性能。

### tagsFilter

- **命令行终端:** `--tagsFilter <expression>`

仅运行带有指定标签的测试。可以使用逻辑运算符 `&&`（与）、`||`（或）和 `!`（非）创建复杂的表达式，详情请参见 [测试标签语法](/guide/test-tags#syntax)

### strictTags

- **命令行终端:** `--strictTags`
- **配置:** [strictTags](/config/stricttags)

如果测试包含未在配置中定义的标签，Vitest 是否应抛出错误。（默认值：`true`）

### experimental.fsModuleCache

- **命令行终端:** `--experimental.fsModuleCache`
- **配置:** [experimental.fsModuleCache](/config/experimental#experimental-fsmodulecache)

在重新运行之前，启用文件系统上的缓存。

### experimental.importDurations.print

- **命令行终端:** `--experimental.importDurations.print <boolean|on-warn>`
- **配置:** [experimental.importDurations.print](/config/experimental#experimental-importdurations-print)

控制何时将导入耗时分析输出到命令行终端。`true` 表示始终输出，`false` 表示永不输出，`on-warn` 表示仅在导入超过警告阈值时输出。（默认值：`false`）

### experimental.importDurations.limit

- **命令行终端:** `--experimental.importDurations.limit <number>`
- **配置:** [experimental.importDurations.limit](/config/experimental#experimental-importdurations-limit)

收集和显示的最大导入数量。（默认值：0，如果启用了 print 或 UI 模式，则为 10）

### experimental.importDurations.failOnDanger

- **命令行终端:** `--experimental.importDurations.failOnDanger`
- **配置:** [experimental.importDurations.failOnDanger](/config/experimental#experimental-importdurations-failondanger)

如果任何导入超过危险阈值，则测试运行失败。（默认值：`false`）

### experimental.importDurations.thresholds.warn

- **命令行终端:** `--experimental.importDurations.thresholds.warn <number>`
- **配置:** [experimental.importDurations.thresholds.warn](/config/experimental#experimental-importdurations-thresholds-warn)

警告阈值，超过此阈值的导入将以黄色 / 橙色显示。（默认值：100）

### experimental.importDurations.thresholds.danger

- **命令行终端:** `--experimental.importDurations.thresholds.danger <number>`
- **配置:** [experimental.importDurations.thresholds.danger](/config/experimental#experimental-importdurations-thresholds-danger)

危险阈值，超过此阈值的导入将以红色显示。（默认值：500）

### experimental.viteModuleRunner

- **命令行终端:** `--experimental.viteModuleRunner`
- **配置:** [experimental.viteModuleRunner](/config/experimental#experimental-vitemodulerunner)

控制 Vitest 是否使用 Vite 的模块运行器运行代码，或回退到原生 `import`。（默认值：`true`）

### experimental.nodeLoader

- **命令行终端:** `--experimental.nodeLoader`
- **配置:** [experimental.nodeLoader](/config/experimental#experimental-nodeloader)

控制 Vitest 是否使用 Node.js Loader API 处理内联代码或模拟文件。如果启用了 `viteModuleRunner`，则此选项将无效。禁用此选项可能提升性能。（默认值：`true`）
