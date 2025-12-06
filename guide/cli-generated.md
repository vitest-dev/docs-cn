### root

- **命令行终端:** `-r, --root <path>`
- **配置:** [root](/config/#root)

根路径

### config

- **命令行终端:** `-c, --config <path>`

配置文件的路径

### update

- **命令行终端:** `-u, --update`
- **配置:** [update](/config/#update)

更新快照

### watch

- **命令行终端:** `-w, --watch`
- **配置:** [watch](/config/#watch)

启用观察模式

### testNamePattern

- **命令行终端:** `-t, --testNamePattern <pattern>`
- **配置:** [testNamePattern](/config/#testnamepattern)

使用符合指定 regexp 模式的运行测试

### dir

- **命令行终端:** `--dir <path>`
- **配置:** [dir](/config/#dir)

扫描测试文件的基本目录

### ui

- **命令行终端:** `--ui`
- **配置:** [ui](/config/#ui)

启用 UI 模式

### open

- **命令行终端:** `--open`
- **配置:** [open](/config/#open)

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

- **命令行终端:** `--silent [value]`
- **配置:** [silent](/config/#silent)

测试的静默控制台输出。使用 `'passed-only'` 仅查看失败测试的日志

### hideSkippedTests

- **命令行终端:** `--hideSkippedTests`

隐藏跳过测试的日志

### reporters

- **命令行终端:** `--reporter <name>`
- **配置:** [reporters](/config/#reporters)

指定报告器（default、blob、verbose、dot、json、tap、tap-flat、junit、tree、hanging-process、github-actions）

### outputFile

- **命令行终端:** `--outputFile <filename/-s>`
- **配置:** [outputFile](/config/#outputfile)

如果还指定了支持报告程序，则将测试结果写入文件，使用 cac 的点符号表示多个报告程序的单个输出结果 (比如: `--outputFile.tap=./tap.txt`)

### coverage.provider

- **命令行终端:** `--coverage.provider <name>`
- **配置:** [coverage.provider](/config/#coverage-provider)

选择覆盖范围采集工具，可用值为: "v8", "istanbul" and "custom"

### coverage.enabled

- **命令行终端:** `--coverage.enabled`
- **配置:** [coverage.enabled](/config/#coverage-enabled)

启用覆盖范围收集。可使用 `--coverage` CLI 选项覆盖（默认值：`false`）

### coverage.include

- **命令行终端:** `--coverage.include <pattern>`
- **配置:** [coverage.include](/config/#coverage-include)

作为通配符模式包含在覆盖率中的文件。在使用多个模式时可以指定多次。默认情况下，只包含被测试覆盖的文件

### coverage.exclude

- **命令行终端:** `--coverage.exclude <pattern>`
- **配置:** [coverage.exclude](/config/#coverage-exclude)

覆盖范围中要排除的文件。使用多个扩展名时，可指定多次

### coverage.clean

- **命令行终端:** `--coverage.clean`
- **配置:** [coverage.clean](/config/#coverage-clean)

运行测试前清除覆盖结果（默认值：true）

### coverage.cleanOnRerun

- **命令行终端:** `--coverage.cleanOnRerun`
- **配置:** [coverage.cleanOnRerun](/config/#coverage-cleanonrerun)

重新运行监视时清理覆盖率报告（默认值：true）

### coverage.reportsDirectory

- **命令行终端:** `--coverage.reportsDirectory <path>`
- **配置:** [coverage.reportsDirectory](/config/#coverage-reportsdirectory)

将覆盖率报告写入的目录（默认值： ./coverage）

### coverage.reporter

- **命令行终端:** `--coverage.reporter <name>`
- **配置:** [coverage.reporter](/config/#coverage-reporter)

使用的报告。更多信息请访问 [`coverage.reporter`](https://vitest.dev/config/#coverage-reporter)。(默认值: `["text", "html", "clover", "json"]`)

### coverage.reportOnFailure

- **命令行终端:** `--coverage.reportOnFailure`
- **配置:** [coverage.reportOnFailure](/config/#coverage-reportonfailure)

即使测试失败也能生成覆盖率报告 (默认值: `false`)

### coverage.allowExternal

- **命令行终端:** `--coverage.allowExternal`
- **配置:** [coverage.allowExternal](/config/#coverage-allowexternal)

收集项目根目录外文件的覆盖范围（默认值：`false`）

### coverage.skipFull

- **命令行终端:** `--coverage.skipFull`
- **配置:** [coverage.skipFull](/config/#coverage-skipfull)

不显示语句、分支和函数覆盖率为 100% 的文件（默认值：`false`）

### coverage.thresholds.100

- **命令行终端:** `--coverage.thresholds.100`
- **配置:** [coverage.thresholds.100](/config/#coverage-thresholds-100)

将所有覆盖率阈值设置为 100 的快捷方式（默认值：`false`）

### coverage.thresholds.perFile

- **命令行终端:** `--coverage.thresholds.perFile`
- **配置:** [coverage.thresholds.perFile](/config/#coverage-thresholds-perfile)

检查每个文件的阈值。 `--coverage.thresholds.lines`, `--coverage.thresholds.functions`, `--coverage.thresholds.branches`, `--coverage.thresholds.statements` 为实际阈值（默认值：`false`）

### coverage.thresholds.autoUpdate

- **命令行终端:** `--coverage.thresholds.autoUpdate <boolean|function>`
- **配置:** [coverage.thresholds.autoUpdate](/config/#coverage-thresholds-autoupdate)

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
- **配置:** [coverage.ignoreClassMethods](/config/#coverage-ignoreclassmethods)

覆盖时要忽略的类方法名称数组。更多信息请访问 [istanbuljs](https://github.com/istanbuljs/nyc#ignoring-methods) 。该选项仅适用于 istanbul providers（默认值：`[]`）

### coverage.processingConcurrency

- **命令行终端:** `--coverage.processingConcurrency <number>`
- **配置:** [coverage.processingConcurrency](/config/#coverage-processingconcurrency)

处理覆盖率结果时使用的并发限制。 （默认最小值介于 20 和 CPU 数量之间）

### coverage.customProviderModule

- **命令行终端:** `--coverage.customProviderModule <path>`
- **配置:** [coverage.customProviderModule](/config/#coverage-customprovidermodule)

指定自定义覆盖范围提供程序模块的模块名称或路径。 请访问 [自定义 providers 覆盖范围](/guide/coverage#custom-coverage-provider) 了解更多信息。 此选项仅适用于自定义 providers

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
- **配置:** [mode](/config/#mode)

覆盖 Vite 模式 (默认值: `test` 或 `benchmark`)

### isolate

- **命令行终端:** `--isolate`
- **配置:** [isolate](/config/#isolate)

隔离运行每个测试文件。要禁用隔离, 使用 `--no-isolate` (默认值: `true`)

### globals

- **命令行终端:** `--globals`
- **配置:** [globals](/config/#globals)

全局注入

### dom

- **命令行终端:** `--dom`

使用 happy-dom 模拟浏览器 API

### browser.enabled

- **命令行终端:** `--browser.enabled`
- **配置:** [browser.enabled](/guide/browser/config#browser-enabled)

在浏览器中运行测试。 相当于 `--browser.enabled` (默认值: `false`)

### browser.name

- **命令行终端:** `--browser.name <name>`
- **配置:** [browser.name](/guide/browser/config#browser-name)

在特定浏览器中运行所有测试。某些浏览器仅适用于特定提供商（请参阅 `--browser.provider` ）。访问 [`browser.name`](https://vitest.dev/guide/browser/config/#browser-name) 了解更多信息

### browser.headless

- **命令行终端:** `--browser.headless`
- **配置:** [browser.headless](/guide/browser/config#browser-headless)

在无头模式下运行浏览器（即不打开图形用户界面）。如果在 CI 中运行 Vitest，默认情况下将启用无头模式 (默认值: `process.env.CI`)

### browser.api.port

- **命令行终端:** `--browser.api.port [port]`
- **配置:** [browser.api.port](/guide/browser/config#browser-api-port)

指定服务器端口。注意，如果端口已被使用，Vite 会自动尝试下一个可用端口，因此这可能不是服务器最终监听的实际端口。如果为 `true`，将设置为 `63315`

### browser.api.host

- **命令行终端:** `--browser.api.host [host]`
- **配置:** [browser.api.host](/guide/browser/config#browser-api-host)

指定服务器应该监听哪些 IP 地址。设为 `0.0.0.0` 或 `true` 则监听所有地址，包括局域网地址和公共地址

### browser.api.strictPort

- **命令行终端:** `--browser.api.strictPort`
- **配置:** [browser.api.strictPort](/guide/browser/config#browser-api-strictport)

设置为 true 时，如果端口已被使用，则退出，而不是自动尝试下一个可用端口

### browser.provider

- **命令行终端:** `--browser.provider <name>`
- **配置:** [browser.provider](/guide/browser/config#browser-provider)

指定执行浏览器测试时所使用的提供程序。部分浏览器仅在特定的提供程序下可用。可选值有 "webdriverio"、"playwright"、"preview"，也可以填写自定义提供程序的路径。更多信息请查看 [`browser.provider`](https://vitest.dev/guide/browser/config.html#browser-provider)（默认值为 "preview"）

### browser.isolate

- **命令行终端:** `--browser.isolate`
- **配置:** [browser.isolate](/guide/browser/config#browser-isolate)

隔离运行每个浏览器测试文件。要禁用隔离请使用 `--browser.isolate=false` (默认值: `true`)

### browser.ui

- **命令行终端:** `--browser.ui`
- **配置:** [browser.ui](/guide/browser/config#browser-ui)

运行测试时显示 Vitest UI (默认值: `!process.env.CI`)

### browser.fileParallelism

- **命令行终端:** `--browser.fileParallelism`
- **配置:** [browser.fileParallelism](/guide/browser/config#browser-fileparallelism)

浏览器测试文件是否应并行运行。使用 `--browser.fileParallelism=false` 进行禁用 (默认值: `true`)

### browser.connectTimeout

- **命令行终端:** `--browser.connectTimeout <timeout>`
- **配置:** [browser.connectTimeout](/guide/browser/config#browser-connecttimeout)

如果连接浏览器时间超时，测试套件将失败 (默认值: `60_000`)

### browser.trackUnhandledErrors

- **命令行终端:** `--browser.trackUnhandledErrors`
- **配置:** [browser.trackUnhandledErrors](/guide/browser/config#browser-trackunhandlederrors)

控制 Vitest 是否捕获未捕获的异常以便报告（默认：`true`）

### browser.trace

- **命令行终端:** `--browser.trace <mode>`
- **配置:** [browser.trace](/guide/browser/config#browser-trace)

启用追踪视图模式。 可选项: "on", "off", "on-first-retry", "on-all-retries", "retain-on-failure"

### pool

- **命令行终端:** `--pool <pool>`
- **配置:** [pool](/config/#pool)

如果未在浏览器中运行，则指定 pool (默认值: `threads`)

### poolOptions.threads.isolate

- **命令行终端:** `--poolOptions.threads.isolate`
- **配置:** [poolOptions.threads.isolate](/config/#pooloptions-threads-isolate)

在线程池中隔离测试 (默认值: `true`)

### poolOptions.threads.singleThread

- **命令行终端:** `--poolOptions.threads.singleThread`
- **配置:** [poolOptions.threads.singleThread](/config/#pooloptions-threads-singlethread)

在单线程内运行测试 (默认值: `false`)

### poolOptions.threads.maxThreads

- **命令行终端:** `--poolOptions.threads.maxThreads <workers>`
- **配置:** [poolOptions.threads.maxThreads](/config/#pooloptions-threads-maxthreads)

运行测试的最大线程数或百分比

### poolOptions.threads.useAtomics

- **命令行终端:** `--poolOptions.threads.useAtomics`
- **配置:** [poolOptions.threads.useAtomics](/config/#pooloptions-threads-useatomics)

使用 Atomics 同步线程。这在某些情况下可以提高性能，但在较旧的 Node 版本中可能会导致 segfault。 (默认值: `false`)

### poolOptions.vmThreads.isolate

- **命令行终端:** `--poolOptions.vmThreads.isolate`
- **配置:** [poolOptions.vmThreads.isolate](/config/#pooloptions-vmthreads-isolate)

在线程池中隔离测试 (默认值: `true`)

### poolOptions.vmThreads.singleThread

- **命令行终端:** `--poolOptions.vmThreads.singleThread`
- **配置:** [poolOptions.vmThreads.singleThread](/config/#pooloptions-vmthreads-singlethread)

在单线程内运行测试（默认值：`false`）

### poolOptions.vmThreads.maxThreads

- **命令行终端:** `--poolOptions.vmThreads.maxThreads <workers>`
- **配置:** [poolOptions.vmThreads.maxThreads](/config/#pooloptions-vmthreads-maxthreads)

运行测试的最大线程数或百分比

### poolOptions.vmThreads.useAtomics

- **命令行终端:** `--poolOptions.vmThreads.useAtomics`
- **配置:** [poolOptions.vmThreads.useAtomics](/config/#pooloptions-vmthreads-useatomics)

使用 Atomics 同步线程。这在某些情况下可以提高性能，但在较旧的 Node 版本中可能会导致 segfault。 (默认值: `false`)

### poolOptions.vmThreads.memoryLimit

- **命令行终端:** `--poolOptions.vmThreads.memoryLimit <limit>`
- **配置:** [poolOptions.vmThreads.memoryLimit](/config/#pooloptions-vmthreads-memorylimit)

虚拟机线程池的内存限制。如果发现内存泄漏，请尝试调整该值

### poolOptions.forks.isolate

- **命令行终端:** `--poolOptions.forks.isolate`
- **配置:** [poolOptions.forks.isolate](/config/#pooloptions-forks-isolate)

在 forks pool 中隔离测试 (默认值: `true`)

### poolOptions.forks.singleFork

- **命令行终端:** `--poolOptions.forks.singleFork`
- **配置:** [poolOptions.forks.singleFork](/config/#pooloptions-forks-singlefork)

单个子进程内运行测试 (default: `false`)

### poolOptions.forks.maxForks

- **命令行终端:** `--poolOptions.forks.maxForks <workers>`
- **配置:** [poolOptions.forks.maxForks](/config/#pooloptions-forks-maxforks)

运行测试的最大进程数

### poolOptions.vmForks.isolate

- **命令行终端:** `--poolOptions.vmForks.isolate`
- **配置:** [poolOptions.vmForks.isolate](/config/#pooloptions-vmforks-isolate)

在 forks pool 中隔离测试 (default: `true`)

### poolOptions.vmForks.singleFork

- **命令行终端:** `--poolOptions.vmForks.singleFork`
- **配置:** [poolOptions.vmForks.singleFork](/config/#pooloptions-vmforks-singlefork)

在单个子进程内运行测试 (default: `false`)

### poolOptions.vmForks.maxForks

- **命令行终端:** `--poolOptions.vmForks.maxForks <workers>`
- **配置:** [poolOptions.vmForks.maxForks](/config/#pooloptions-vmforks-maxforks)

运行测试的最大进程数

### poolOptions.vmForks.memoryLimit

- **命令行终端:** `--poolOptions.vmForks.memoryLimit <limit>`
- **配置:** [poolOptions.vmForks.memoryLimit](/config/#pooloptions-vmforks-memorylimit)

VM forks pool 的内存限制。如果你观察到内存泄漏问题，可以尝试调整这个值

### fileParallelism

- **命令行终端:** `--fileParallelism`
- **配置:** [fileParallelism](/config/#fileparallelism)

是否所有测试文件都应并行运行. 使用 `--no-file-parallelism` 去禁用 (默认值: `true`)

### maxWorkers

- **命令行终端:** `--maxWorkers <workers>`
- **配置:** [maxWorkers](/config/#maxworkers)

同时并发执行测试任务的最大线程数或百分比

### environment

- **命令行终端:** `--environment <name>`
- **配置:** [environment](/config/#environment)

如果不在浏览器中运行，则指定运行环境 (默认值: `node`)

### passWithNoTests

- **命令行终端:** `--passWithNoTests`
- **配置:** [passWithNoTests](/config/#passwithnotests)

未发现测试时通过

### logHeapUsage

- **命令行终端:** `--logHeapUsage`
- **配置:** [logHeapUsage](/config/#logheapusage)

在节点中运行时，显示每个测试的堆大小

### allowOnly

- **命令行终端:** `--allowOnly`
- **配置:** [allowOnly](/config/#allowonly)

允许执行那些被标记为"only"的测试用例或测试套件 (默认值: `!process.env.CI`)

### dangerouslyIgnoreUnhandledErrors

- **命令行终端:** `--dangerouslyIgnoreUnhandledErrors`
- **配置:** [dangerouslyIgnoreUnhandledErrors](/config/#dangerouslyignoreunhandlederrors)

忽略任何未处理的错误

### sequence.shuffle.files

- **命令行终端:** `--sequence.shuffle.files`
- **配置:** [sequence.shuffle.files](/config/#sequence-shuffle-files)

以随机顺序运行文件。如果启用此选项，长时间运行的测试将不会提前开始。 (默认值: `false`)

### sequence.shuffle.tests

- **命令行终端:** `--sequence.shuffle.tests`
- **配置:** [sequence.shuffle.tests](/config/#sequence-shuffle-tests)

以随机方式运行测试（默认值：`false`）

### sequence.concurrent

- **命令行终端:** `--sequence.concurrent`
- **配置:** [sequence.concurrent](/config/#sequence-concurrent)

使测试并行运行（默认值：`false`）

### sequence.seed

- **命令行终端:** `--sequence.seed <seed>`
- **配置:** [sequence.seed](/config/#sequence-seed)

设置随机化种子。如果 --sequence.shuffle（随机序列）是`false`，则此选项无效。 t 通过 ["Random Seed" page](https://en.wikipedia.org/wiki/Random_seed) 查看更多信息

### sequence.hooks

- **命令行终端:** `--sequence.hooks <order>`
- **配置:** [sequence.hooks](/config/#sequence-hooks)

更改钩子的执行顺序。 可接受的值有: "stack", "list" and "parallel". 通过 [`sequence.hooks`](https://vitest.dev/config/#sequence-hooks) 查看更多信息 (默认值: `"parallel"`)

### sequence.setupFiles

- **命令行终端:** `--sequence.setupFiles <order>`
- **配置:** [sequence.setupFiles](/config/#sequence-setupfiles)

更改设置文件的执行顺序。可接受的值有 "list" 和 "parallel"。如果设置为"list"，将按照定义的顺序运行设置文件。如果设置为 "parallel"，将并行运行设置文件（默认值：`"parallel"`）

### inspect

- **命令行终端:** `--inspect [[host:]port]`
- **配置:** [inspect](/config/#inspect)

启用 Node.js 检查器（默认值：`127.0.0.1:9229`）

### inspectBrk

- **命令行终端:** `--inspectBrk [[host:]port]`
- **配置:** [inspectBrk](/config/#inspectbrk)

启用 Node.js 检查器并在测试开始前中断

### testTimeout

- **命令行终端:** `--testTimeout <timeout>`
- **配置:** [testTimeout](/config/#testtimeout)

测试的默认超时（毫秒）（默认值：`5000`）。使用 `0` 完全禁用超时

### hookTimeout

- **命令行终端:** `--hookTimeout <timeout>`
- **配置:** [hookTimeout](/config/#hooktimeout)

默认钩子超时（以毫秒为单位）（默认值：`10000`）。使用 `0` 完全禁用超时

### bail

- **命令行终端:** `--bail <number>`
- **配置:** [bail](/config/#bail)

当指定数量的测试失败时停止测试执行（默认值：`0`）

### retry

- **命令行终端:** `--retry <times>`
- **配置:** [retry](/config/#retry)

如果测试失败，重试特定次数（默认值： `0`）

### diff.aAnnotation

- **命令行终端:** `--diff.aAnnotation <annotation>`
- **配置:** [diff.aAnnotation](/config/#diff-aannotation)

预期值的行注释 (默认值: `Expected`)

### diff.aIndicator

- **命令行终端:** `--diff.aIndicator <indicator>`
- **配置:** [diff.aIndicator](/config/#diff-aindicator)

预期值的行标识 (默认值: `-`)

### diff.bAnnotation

- **命令行终端:** `--diff.bAnnotation <annotation>`
- **配置:** [diff.bAnnotation](/config/#diff-bannotation)

实际值的行注释 (默认值: `Received`)

### diff.bIndicator

- **命令行终端:** `--diff.bIndicator <indicator>`
- **配置:** [diff.bIndicator](/config/#diff-bindicator)

实际值的行标识 (默认值: `+`)

### diff.commonIndicator

- **命令行终端:** `--diff.commonIndicator <indicator>`
- **配置:** [diff.commonIndicator](/config/#diff-commonindicator)

公共行标识 （默认值: ` `）

### diff.contextLines

- **命令行终端:** `--diff.contextLines <lines>`
- **配置:** [diff.contextLines](/config/#diff-contextlines)

每次变更显示上下文行数 （默认值: `5`）

### diff.emptyFirstOrLastLinePlaceholder

- **命令行终端:** `--diff.emptyFirstOrLastLinePlaceholder <placeholder>`
- **配置:** [diff.emptyFirstOrLastLinePlaceholder](/config/#diff-emptyfirstorlastlineplaceholder)

空首行或空末行的占位符 （默认值: `""`）

### diff.expand

- **命令行终端:** `--diff.expand`
- **配置:** [diff.expand](/config/#diff-expand)

展开所有公共行 （默认值: `true`）

### diff.includeChangeCounts

- **命令行终端:** `--diff.includeChangeCounts`
- **配置:** [diff.includeChangeCounts](/config/#diff-includechangecounts)

在 diff 的输出中输出比较计数 （默认值: `false`）

### diff.omitAnnotationLines

- **命令行终端:** `--diff.omitAnnotationLines`
- **配置:** [diff.omitAnnotationLines](/config/#diff-omitannotationlines)

省略输出中的注释行 (默认值: `false`)

### diff.printBasicPrototype

- **命令行终端:** `--diff.printBasicPrototype`
- **配置:** [diff.printBasicPrototype](/config/#diff-printbasicprototype)

打印基础的原型 `Object` 和 `Array` (默认值: `true`)

### diff.maxDepth

- **命令行终端:** `--diff.maxDepth <maxDepth>`
- **配置:** [diff.maxDepth](/config/#diff-maxdepth)

打印嵌套对象时，递归深度限制 (默认值: `20`)

### diff.truncateThreshold

- **命令行终端:** `--diff.truncateThreshold <threshold>`
- **配置:** [diff.truncateThreshold](/config/#diff-truncatethreshold)

显示成每次变更前后的行数 (默认值: `0`)

### diff.truncateAnnotation

- **命令行终端:** `--diff.truncateAnnotation <annotation>`
- **配置:** [diff.truncateAnnotation](/config/#diff-truncateannotation)

在 diff 结果末尾输出的注释（如果被截断） (默认值: `... Diff result is truncated`)

### exclude

- **命令行终端:** `--exclude <glob>`
- **配置:** [exclude](/config/#exclude)

测试中排除的其他文件路径匹配模式

### expandSnapshotDiff

- **命令行终端:** `--expandSnapshotDiff`
- **配置:** [expandSnapshotDiff](/config/#expandsnapshotdiff)

快照失败时显示完整差异

### disableConsoleIntercept

- **命令行终端:** `--disableConsoleIntercept`
- **配置:** [disableConsoleIntercept](/config/#disableconsoleintercept)

禁用自动拦截控制台日志（默认值：`false`）

### typecheck.enabled

- **命令行终端:** `--typecheck.enabled`
- **配置:** [typecheck.enabled](/config/#typecheck-enabled)

在测试的同时启用类型检查（默认值：`false`）

### typecheck.only

- **命令行终端:** `--typecheck.only`
- **配置:** [typecheck.only](/config/#typecheck-only)

仅运行类型检查测试。这将自动启用类型检查（默认值：`false`）

### typecheck.checker

- **命令行终端:** `--typecheck.checker <name>`
- **配置:** [typecheck.checker](/config/#typecheck-checker)

指定要使用的类型检查器。可用值为 "tsc"和 "vue-tsc "以及一个可执行文件的路径（默认值：`tsc`）

### typecheck.allowJs

- **命令行终端:** `--typecheck.allowJs`
- **配置:** [typecheck.allowJs](/config/#typecheck-allowjs)

允许对 JavaScript 文件进行类型检查。默认值取自 tsconfig.json

### typecheck.ignoreSourceErrors

- **命令行终端:** `--typecheck.ignoreSourceErrors`
- **配置:** [typecheck.ignoreSourceErrors](/config/#typecheck-ignoresourceerrors)

忽略源文件中的类型错误

### typecheck.tsconfig

- **命令行终端:** `--typecheck.tsconfig <path>`
- **配置:** [typecheck.tsconfig](/config/#typecheck-tsconfig)

自定义 tsconfig 文件的路径

### typecheck.spawnTimeout

- **命令行终端:** `--typecheck.spawnTimeout <time>`
- **配置:** [typecheck.spawnTimeout](/config/#typecheck-spawntimeout)

类型检查器启动所需最短时间（以毫秒为单位）

### project

- **命令行终端:** `--project <name>`
- **配置:** [project](/config/#project)

如果我们正在使用 Vitest 的工作区功能，这是要运行的项目名称。这个参数可以重复以指定多个项目：`--project=1 --project=2`。我们还可以使用通配符来过滤项目，例如 `--project=packages*`，以及使用 `--project=!pattern` 来排除项目

### slowTestThreshold

- **命令行终端:** `--slowTestThreshold <threshold>`
- **配置:** [slowTestThreshold](/config/#slowtestthreshold)

测试速度慢的阈值（以毫秒为单位）（默认值：`300`）

### teardownTimeout

- **命令行终端:** `--teardownTimeout <timeout>`
- **配置:** [teardownTimeout](/config/#teardowntimeout)

拆卸函数的默认超时（以毫秒为单位）（默认值：`10000`）

### maxConcurrency

- **命令行终端:** `--maxConcurrency <number>`
- **配置:** [maxConcurrency](/config/#maxconcurrency)

套件中并发测试的最大次数（默认值：`5`）

### expect.requireAssertions

- **命令行终端:** `--expect.requireAssertions`
- **配置:** [expect.requireAssertions](/config/#expect-requireassertions)

要求所有测试至少有一个断言

### expect.poll.interval

- **命令行终端:** `--expect.poll.interval <interval>`
- **配置:** [expect.poll.interval](/config/#expect-poll-interval)

断言的轮询间隔 `expect.poll()` (默认值: `50`)

### expect.poll.timeout

- **命令行终端:** `--expect.poll.timeout <timeout>`
- **配置:** [expect.poll.timeout](/config/#expect-poll-timeout)

断言的轮询超时（以毫秒为单位） `expect.poll()` (默认值: `1000`)

### printConsoleTrace

- **命令行终端:** `--printConsoleTrace`
- **配置:** [printConsoleTrace](/config/#printconsoletrace)

始终打印控制台堆栈跟踪

### includeTaskLocation

- **命令行终端:** `--includeTaskLocation`
- **配置:** [includeTaskLocation](/config/#includetasklocation)

在 `location` 属性中收集测试用例和测试套件的位置信息

### attachmentsDir

- **命令行终端:** `--attachmentsDir <dir>`
- **配置:** [attachmentsDir](/config/#attachmentsdir)

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

启动 Vitest 但不运行测试。只有在文件发生变化时才会运行测试。当通过 CLI 传递了文件过滤器时，此选项将被忽略（默认值：`false`）
