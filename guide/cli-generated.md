### root

<<<<<<< HEAD
- **命令行终端:** `-r, --root <path>`
- **配置:** [root](/config/#root)
=======
- **CLI:** `-r, --root <path>`
- **Config:** [root](/config/root)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

根路径

### config

- **命令行终端:** `-c, --config <path>`

配置文件的路径

### update

<<<<<<< HEAD
- **命令行终端:** `-u, --update`
- **配置:** [update](/config/#update)
=======
- **CLI:** `-u, --update`
- **Config:** [update](/config/update)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

更新快照

### watch

<<<<<<< HEAD
- **命令行终端:** `-w, --watch`
- **配置:** [watch](/config/#watch)
=======
- **CLI:** `-w, --watch`
- **Config:** [watch](/config/watch)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

启用观察模式

### testNamePattern

<<<<<<< HEAD
- **命令行终端:** `-t, --testNamePattern <pattern>`
- **配置:** [testNamePattern](/config/#testnamepattern)
=======
- **CLI:** `-t, --testNamePattern <pattern>`
- **Config:** [testNamePattern](/config/testnamepattern)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

使用符合指定 regexp 模式的运行测试

### dir

<<<<<<< HEAD
- **命令行终端:** `--dir <path>`
- **配置:** [dir](/config/#dir)
=======
- **CLI:** `--dir <path>`
- **Config:** [dir](/config/dir)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

扫描测试文件的基本目录

### ui

<<<<<<< HEAD
- **命令行终端:** `--ui`
- **配置:** [ui](/config/#ui)
=======
- **CLI:** `--ui`
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

启用 UI 模式

### open

<<<<<<< HEAD
- **命令行终端:** `--open`
- **配置:** [open](/config/#open)
=======
- **CLI:** `--open`
- **Config:** [open](/config/open)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

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

<<<<<<< HEAD
- **命令行终端:** `--silent [value]`
- **配置:** [silent](/config/#silent)
=======
- **CLI:** `--silent [value]`
- **Config:** [silent](/config/silent)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

测试的静默控制台输出。使用 `'passed-only'` 仅查看失败测试的日志

### hideSkippedTests

- **命令行终端:** `--hideSkippedTests`

隐藏跳过测试的日志

### reporters

<<<<<<< HEAD
- **命令行终端:** `--reporter <name>`
- **配置:** [reporters](/config/#reporters)
=======
- **CLI:** `--reporter <name>`
- **Config:** [reporters](/config/reporters)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

指定报告器（default、blob、verbose、dot、json、tap、tap-flat、junit、tree、hanging-process、github-actions）

### outputFile

<<<<<<< HEAD
- **命令行终端:** `--outputFile <filename/-s>`
- **配置:** [outputFile](/config/#outputfile)
=======
- **CLI:** `--outputFile <filename/-s>`
- **Config:** [outputFile](/config/outputfile)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

如果还指定了支持报告程序，则将测试结果写入文件，使用 cac 的点符号表示多个报告程序的单个输出结果 (比如: `--outputFile.tap=./tap.txt`)

### coverage.provider

<<<<<<< HEAD
- **命令行终端:** `--coverage.provider <name>`
- **配置:** [coverage.provider](/config/#coverage-provider)
=======
- **CLI:** `--coverage.provider <name>`
- **Config:** [coverage.provider](/config/coverage#coverage-provider)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

选择覆盖范围采集工具，可用值为: "v8", "istanbul" and "custom"

### coverage.enabled

<<<<<<< HEAD
- **命令行终端:** `--coverage.enabled`
- **配置:** [coverage.enabled](/config/#coverage-enabled)
=======
- **CLI:** `--coverage.enabled`
- **Config:** [coverage.enabled](/config/coverage#coverage-enabled)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

启用覆盖范围收集。可使用 `--coverage` CLI 选项覆盖（默认值：`false`）

### coverage.include

<<<<<<< HEAD
- **命令行终端:** `--coverage.include <pattern>`
- **配置:** [coverage.include](/config/#coverage-include)
=======
- **CLI:** `--coverage.include <pattern>`
- **Config:** [coverage.include](/config/coverage#coverage-include)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

作为通配符模式包含在覆盖率中的文件。在使用多个模式时可以指定多次。默认情况下，只包含被测试覆盖的文件

### coverage.exclude

<<<<<<< HEAD
- **命令行终端:** `--coverage.exclude <pattern>`
- **配置:** [coverage.exclude](/config/#coverage-exclude)
=======
- **CLI:** `--coverage.exclude <pattern>`
- **Config:** [coverage.exclude](/config/coverage#coverage-exclude)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

覆盖范围中要排除的文件。使用多个扩展名时，可指定多次

### coverage.clean

<<<<<<< HEAD
- **命令行终端:** `--coverage.clean`
- **配置:** [coverage.clean](/config/#coverage-clean)
=======
- **CLI:** `--coverage.clean`
- **Config:** [coverage.clean](/config/coverage#coverage-clean)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

运行测试前清除覆盖结果（默认值：true）

### coverage.cleanOnRerun

<<<<<<< HEAD
- **命令行终端:** `--coverage.cleanOnRerun`
- **配置:** [coverage.cleanOnRerun](/config/#coverage-cleanonrerun)
=======
- **CLI:** `--coverage.cleanOnRerun`
- **Config:** [coverage.cleanOnRerun](/config/coverage#coverage-cleanonrerun)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

重新运行监视时清理覆盖率报告（默认值：true）

### coverage.reportsDirectory

<<<<<<< HEAD
- **命令行终端:** `--coverage.reportsDirectory <path>`
- **配置:** [coverage.reportsDirectory](/config/#coverage-reportsdirectory)
=======
- **CLI:** `--coverage.reportsDirectory <path>`
- **Config:** [coverage.reportsDirectory](/config/coverage#coverage-reportsdirectory)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

将覆盖率报告写入的目录（默认值： ./coverage）

### coverage.reporter

<<<<<<< HEAD
- **命令行终端:** `--coverage.reporter <name>`
- **配置:** [coverage.reporter](/config/#coverage-reporter)

使用的报告。更多信息请访问 [`coverage.reporter`](https://vitest.dev/config/#coverage-reporter)。(默认值: `["text", "html", "clover", "json"]`)

### coverage.reportOnFailure

- **命令行终端:** `--coverage.reportOnFailure`
- **配置:** [coverage.reportOnFailure](/config/#coverage-reportonfailure)
=======
- **CLI:** `--coverage.reporter <name>`
- **Config:** [coverage.reporter](/config/coverage#coverage-reporter)

Coverage reporters to use. Visit [`coverage.reporter`](/config/#coverage-reporter) for more information (default: `["text", "html", "clover", "json"]`)

### coverage.reportOnFailure

- **CLI:** `--coverage.reportOnFailure`
- **Config:** [coverage.reportOnFailure](/config/coverage#coverage-reportonfailure)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

即使测试失败也能生成覆盖率报告 (默认值: `false`)

### coverage.allowExternal

<<<<<<< HEAD
- **命令行终端:** `--coverage.allowExternal`
- **配置:** [coverage.allowExternal](/config/#coverage-allowexternal)
=======
- **CLI:** `--coverage.allowExternal`
- **Config:** [coverage.allowExternal](/config/coverage#coverage-allowexternal)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

收集项目根目录外文件的覆盖范围（默认值：`false`）

### coverage.skipFull

<<<<<<< HEAD
- **命令行终端:** `--coverage.skipFull`
- **配置:** [coverage.skipFull](/config/#coverage-skipfull)
=======
- **CLI:** `--coverage.skipFull`
- **Config:** [coverage.skipFull](/config/coverage#coverage-skipfull)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

不显示语句、分支和函数覆盖率为 100% 的文件（默认值：`false`）

### coverage.thresholds.100

<<<<<<< HEAD
- **命令行终端:** `--coverage.thresholds.100`
- **配置:** [coverage.thresholds.100](/config/#coverage-thresholds-100)
=======
- **CLI:** `--coverage.thresholds.100`
- **Config:** [coverage.thresholds.100](/config/coverage#coverage-thresholds-100)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

将所有覆盖率阈值设置为 100 的快捷方式（默认值：`false`）

### coverage.thresholds.perFile

<<<<<<< HEAD
- **命令行终端:** `--coverage.thresholds.perFile`
- **配置:** [coverage.thresholds.perFile](/config/#coverage-thresholds-perfile)
=======
- **CLI:** `--coverage.thresholds.perFile`
- **Config:** [coverage.thresholds.perFile](/config/coverage#coverage-thresholds-perfile)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

检查每个文件的阈值。 `--coverage.thresholds.lines`, `--coverage.thresholds.functions`, `--coverage.thresholds.branches`, `--coverage.thresholds.statements` 为实际阈值（默认值：`false`）

### coverage.thresholds.autoUpdate

<<<<<<< HEAD
- **命令行终端:** `--coverage.thresholds.autoUpdate <boolean|function>`
- **配置:** [coverage.thresholds.autoUpdate](/config/#coverage-thresholds-autoupdate)
=======
- **CLI:** `--coverage.thresholds.autoUpdate <boolean|function>`
- **Config:** [coverage.thresholds.autoUpdate](/config/coverage#coverage-thresholds-autoupdate)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

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

<<<<<<< HEAD
- **命令行终端:** `--coverage.ignoreClassMethods <name>`
- **配置:** [coverage.ignoreClassMethods](/config/#coverage-ignoreclassmethods)
=======
- **CLI:** `--coverage.ignoreClassMethods <name>`
- **Config:** [coverage.ignoreClassMethods](/config/coverage#coverage-ignoreclassmethods)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

覆盖时要忽略的类方法名称数组。更多信息请访问 [istanbuljs](https://github.com/istanbuljs/nyc#ignoring-methods) 。该选项仅适用于 istanbul providers（默认值：`[]`）

### coverage.processingConcurrency

<<<<<<< HEAD
- **命令行终端:** `--coverage.processingConcurrency <number>`
- **配置:** [coverage.processingConcurrency](/config/#coverage-processingconcurrency)
=======
- **CLI:** `--coverage.processingConcurrency <number>`
- **Config:** [coverage.processingConcurrency](/config/coverage#coverage-processingconcurrency)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

处理覆盖率结果时使用的并发限制。 （默认最小值介于 20 和 CPU 数量之间）

### coverage.customProviderModule

<<<<<<< HEAD
- **命令行终端:** `--coverage.customProviderModule <path>`
- **配置:** [coverage.customProviderModule](/config/#coverage-customprovidermodule)

指定自定义覆盖范围提供程序模块的模块名称或路径。 请访问 [自定义 providers 覆盖范围](/guide/coverage#custom-coverage-provider) 了解更多信息。 此选项仅适用于自定义 providers
=======
- **CLI:** `--coverage.customProviderModule <path>`
- **Config:** [coverage.customProviderModule](/config/coverage#coverage-customprovidermodule)

Specifies the module name or path for the custom coverage provider module. Visit [Custom Coverage Provider](/guide/coverage#custom-coverage-provider) for more information. This option is only available for custom providers
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

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

<<<<<<< HEAD
- **命令行终端:** `--mode <name>`
- **配置:** [mode](/config/#mode)
=======
- **CLI:** `--mode <name>`
- **Config:** [mode](/config/mode)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

覆盖 Vite 模式 (默认值: `test` 或 `benchmark`)

### isolate

<<<<<<< HEAD
- **命令行终端:** `--isolate`
- **配置:** [isolate](/config/#isolate)
=======
- **CLI:** `--isolate`
- **Config:** [isolate](/config/isolate)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

隔离运行每个测试文件。要禁用隔离, 使用 `--no-isolate` (默认值: `true`)

### globals

<<<<<<< HEAD
- **命令行终端:** `--globals`
- **配置:** [globals](/config/#globals)
=======
- **CLI:** `--globals`
- **Config:** [globals](/config/globals)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

全局注入

### dom

- **命令行终端:** `--dom`

使用 happy-dom 模拟浏览器 API

### browser.enabled

<<<<<<< HEAD
- **命令行终端:** `--browser.enabled`
- **配置:** [browser.enabled](/guide/browser/config#browser-enabled)
=======
- **CLI:** `--browser.enabled`
- **Config:** [browser.enabled](/config/browser/enabled)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

在浏览器中运行测试。 相当于 `--browser.enabled` (默认值: `false`)

### browser.name

<<<<<<< HEAD
- **命令行终端:** `--browser.name <name>`
- **配置:** [browser.name](/guide/browser/config#browser-name)

在特定浏览器中运行所有测试。某些浏览器仅适用于特定提供商（请参阅 `--browser.provider` ）。访问 [`browser.name`](https://vitest.dev/guide/browser/config/#browser-name) 了解更多信息

### browser.headless

- **命令行终端:** `--browser.headless`
- **配置:** [browser.headless](/guide/browser/config#browser-headless)
=======
- **CLI:** `--browser.name <name>`

Run all tests in a specific browser. Some browsers are only available for specific providers (see `--browser.provider`).

### browser.headless

- **CLI:** `--browser.headless`
- **Config:** [browser.headless](/config/browser/headless)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

在无头模式下运行浏览器（即不打开图形用户界面）。如果在 CI 中运行 Vitest，默认情况下将启用无头模式 (默认值: `process.env.CI`)

### browser.api.port

<<<<<<< HEAD
- **命令行终端:** `--browser.api.port [port]`
- **配置:** [browser.api.port](/guide/browser/config#browser-api-port)
=======
- **CLI:** `--browser.api.port [port]`
- **Config:** [browser.api.port](/config/browser/api#api-port)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

指定服务器端口。注意，如果端口已被使用，Vite 会自动尝试下一个可用端口，因此这可能不是服务器最终监听的实际端口。如果为 `true`，将设置为 `63315`

### browser.api.host

<<<<<<< HEAD
- **命令行终端:** `--browser.api.host [host]`
- **配置:** [browser.api.host](/guide/browser/config#browser-api-host)
=======
- **CLI:** `--browser.api.host [host]`
- **Config:** [browser.api.host](/config/browser/api#api-host)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

指定服务器应该监听哪些 IP 地址。设为 `0.0.0.0` 或 `true` 则监听所有地址，包括局域网地址和公共地址

### browser.api.strictPort

<<<<<<< HEAD
- **命令行终端:** `--browser.api.strictPort`
- **配置:** [browser.api.strictPort](/guide/browser/config#browser-api-strictport)
=======
- **CLI:** `--browser.api.strictPort`
- **Config:** [browser.api.strictPort](/config/browser/api#api-strictport)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

设置为 true 时，如果端口已被使用，则退出，而不是自动尝试下一个可用端口

<<<<<<< HEAD
### browser.provider

- **命令行终端:** `--browser.provider <name>`
- **配置:** [browser.provider](/guide/browser/config#browser-provider)

指定执行浏览器测试时所使用的提供程序。部分浏览器仅在特定的提供程序下可用。可选值有 "webdriverio"、"playwright"、"preview"，也可以填写自定义提供程序的路径。更多信息请查看 [`browser.provider`](https://vitest.dev/guide/browser/config.html#browser-provider)（默认值为 "preview"）

### browser.isolate

- **命令行终端:** `--browser.isolate`
- **配置:** [browser.isolate](/guide/browser/config#browser-isolate)
=======
### browser.isolate

- **CLI:** `--browser.isolate`
- **Config:** [browser.isolate](/config/browser/isolate)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

隔离运行每个浏览器测试文件。要禁用隔离请使用 `--browser.isolate=false` (默认值: `true`)

### browser.ui

<<<<<<< HEAD
- **命令行终端:** `--browser.ui`
- **配置:** [browser.ui](/guide/browser/config#browser-ui)
=======
- **CLI:** `--browser.ui`
- **Config:** [browser.ui](/config/browser/ui)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

运行测试时显示 Vitest UI (默认值: `!process.env.CI`)

### browser.fileParallelism

<<<<<<< HEAD
- **命令行终端:** `--browser.fileParallelism`
- **配置:** [browser.fileParallelism](/guide/browser/config#browser-fileparallelism)
=======
- **CLI:** `--browser.fileParallelism`
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

浏览器测试文件是否应并行运行。使用 `--browser.fileParallelism=false` 进行禁用 (默认值: `true`)

### browser.connectTimeout

<<<<<<< HEAD
- **命令行终端:** `--browser.connectTimeout <timeout>`
- **配置:** [browser.connectTimeout](/guide/browser/config#browser-connecttimeout)
=======
- **CLI:** `--browser.connectTimeout <timeout>`
- **Config:** [browser.connectTimeout](/config/browser/connecttimeout)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

如果连接浏览器时间超时，测试套件将失败 (默认值: `60_000`)

### browser.trackUnhandledErrors

<<<<<<< HEAD
- **命令行终端:** `--browser.trackUnhandledErrors`
- **配置:** [browser.trackUnhandledErrors](/guide/browser/config#browser-trackunhandlederrors)
=======
- **CLI:** `--browser.trackUnhandledErrors`
- **Config:** [browser.trackUnhandledErrors](/config/browser/trackunhandlederrors)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

控制 Vitest 是否捕获未捕获的异常以便报告（默认：`true`）

### browser.trace

<<<<<<< HEAD
- **命令行终端:** `--browser.trace <mode>`
- **配置:** [browser.trace](/guide/browser/config#browser-trace)
=======
- **CLI:** `--browser.trace <mode>`
- **Config:** [browser.trace](/config/browser/trace)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

启用追踪视图模式。 可选项: "on", "off", "on-first-retry", "on-all-retries", "retain-on-failure"

### pool

<<<<<<< HEAD
- **命令行终端:** `--pool <pool>`
- **配置:** [pool](/config/#pool)
=======
- **CLI:** `--pool <pool>`
- **Config:** [pool](/config/pool)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

如果未在浏览器中运行，则指定 pool (默认值: `threads`)

### execArgv

<<<<<<< HEAD
- **命令行终端:** `--poolOptions.threads.isolate`
- **配置:** [poolOptions.threads.isolate](/config/#pooloptions-threads-isolate)

在线程池中隔离测试 (默认值: `true`)
=======
- **CLI:** `--execArgv <option>`
- **Config:** [execArgv](/config/execargv)

Pass additional arguments to `node` process when spawning `worker_threads` or `child_process`.
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

### vmMemoryLimit

<<<<<<< HEAD
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
=======
- **CLI:** `--vmMemoryLimit <limit>`
- **Config:** [vmMemoryLimit](/config/vmmemorylimit)

Memory limit for VM pools. If you see memory leaks, try to tinker this value.

### fileParallelism

- **CLI:** `--fileParallelism`
- **Config:** [fileParallelism](/config/fileparallelism)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

是否所有测试文件都应并行运行. 使用 `--no-file-parallelism` 去禁用 (默认值: `true`)

### maxWorkers

<<<<<<< HEAD
- **命令行终端:** `--maxWorkers <workers>`
- **配置:** [maxWorkers](/config/#maxworkers)
=======
- **CLI:** `--maxWorkers <workers>`
- **Config:** [maxWorkers](/config/maxworkers)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

同时并发执行测试任务的最大线程数或百分比

### environment

<<<<<<< HEAD
- **命令行终端:** `--environment <name>`
- **配置:** [environment](/config/#environment)
=======
- **CLI:** `--environment <name>`
- **Config:** [environment](/config/environment)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

如果不在浏览器中运行，则指定运行环境 (默认值: `node`)

### passWithNoTests

<<<<<<< HEAD
- **命令行终端:** `--passWithNoTests`
- **配置:** [passWithNoTests](/config/#passwithnotests)
=======
- **CLI:** `--passWithNoTests`
- **Config:** [passWithNoTests](/config/passwithnotests)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

未发现测试时通过

### logHeapUsage

<<<<<<< HEAD
- **命令行终端:** `--logHeapUsage`
- **配置:** [logHeapUsage](/config/#logheapusage)
=======
- **CLI:** `--logHeapUsage`
- **Config:** [logHeapUsage](/config/logheapusage)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

在节点中运行时，显示每个测试的堆大小

### allowOnly

<<<<<<< HEAD
- **命令行终端:** `--allowOnly`
- **配置:** [allowOnly](/config/#allowonly)
=======
- **CLI:** `--allowOnly`
- **Config:** [allowOnly](/config/allowonly)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

允许执行那些被标记为"only"的测试用例或测试套件 (默认值: `!process.env.CI`)

### dangerouslyIgnoreUnhandledErrors

<<<<<<< HEAD
- **命令行终端:** `--dangerouslyIgnoreUnhandledErrors`
- **配置:** [dangerouslyIgnoreUnhandledErrors](/config/#dangerouslyignoreunhandlederrors)
=======
- **CLI:** `--dangerouslyIgnoreUnhandledErrors`
- **Config:** [dangerouslyIgnoreUnhandledErrors](/config/dangerouslyignoreunhandlederrors)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

忽略任何未处理的错误

### sequence.shuffle.files

<<<<<<< HEAD
- **命令行终端:** `--sequence.shuffle.files`
- **配置:** [sequence.shuffle.files](/config/#sequence-shuffle-files)
=======
- **CLI:** `--sequence.shuffle.files`
- **Config:** [sequence.shuffle.files](/config/sequence#sequence-shuffle-files)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

以随机顺序运行文件。如果启用此选项，长时间运行的测试将不会提前开始。 (默认值: `false`)

### sequence.shuffle.tests

<<<<<<< HEAD
- **命令行终端:** `--sequence.shuffle.tests`
- **配置:** [sequence.shuffle.tests](/config/#sequence-shuffle-tests)
=======
- **CLI:** `--sequence.shuffle.tests`
- **Config:** [sequence.shuffle.tests](/config/sequence#sequence-shuffle-tests)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

以随机方式运行测试（默认值：`false`）

### sequence.concurrent

<<<<<<< HEAD
- **命令行终端:** `--sequence.concurrent`
- **配置:** [sequence.concurrent](/config/#sequence-concurrent)
=======
- **CLI:** `--sequence.concurrent`
- **Config:** [sequence.concurrent](/config/sequence#sequence-concurrent)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

使测试并行运行（默认值：`false`）

### sequence.seed

<<<<<<< HEAD
- **命令行终端:** `--sequence.seed <seed>`
- **配置:** [sequence.seed](/config/#sequence-seed)
=======
- **CLI:** `--sequence.seed <seed>`
- **Config:** [sequence.seed](/config/sequence#sequence-seed)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

设置随机化种子。如果 --sequence.shuffle（随机序列）是`false`，则此选项无效。 t 通过 ["Random Seed" page](https://en.wikipedia.org/wiki/Random_seed) 查看更多信息

### sequence.hooks

<<<<<<< HEAD
- **命令行终端:** `--sequence.hooks <order>`
- **配置:** [sequence.hooks](/config/#sequence-hooks)

更改钩子的执行顺序。 可接受的值有: "stack", "list" and "parallel". 通过 [`sequence.hooks`](https://vitest.dev/config/#sequence-hooks) 查看更多信息 (默认值: `"parallel"`)

### sequence.setupFiles

- **命令行终端:** `--sequence.setupFiles <order>`
- **配置:** [sequence.setupFiles](/config/#sequence-setupfiles)
=======
- **CLI:** `--sequence.hooks <order>`
- **Config:** [sequence.hooks](/config/sequence#sequence-hooks)

Changes the order in which hooks are executed. Accepted values are: "stack", "list" and "parallel". Visit [`sequence.hooks`](/config/#sequence-hooks) for more information (default: `"parallel"`)

### sequence.setupFiles

- **CLI:** `--sequence.setupFiles <order>`
- **Config:** [sequence.setupFiles](/config/sequence#sequence-setupfiles)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

更改设置文件的执行顺序。可接受的值有 "list" 和 "parallel"。如果设置为"list"，将按照定义的顺序运行设置文件。如果设置为 "parallel"，将并行运行设置文件（默认值：`"parallel"`）

### inspect

<<<<<<< HEAD
- **命令行终端:** `--inspect [[host:]port]`
- **配置:** [inspect](/config/#inspect)
=======
- **CLI:** `--inspect [[host:]port]`
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

启用 Node.js 检查器（默认值：`127.0.0.1:9229`）

### inspectBrk

<<<<<<< HEAD
- **命令行终端:** `--inspectBrk [[host:]port]`
- **配置:** [inspectBrk](/config/#inspectbrk)
=======
- **CLI:** `--inspectBrk [[host:]port]`
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

启用 Node.js 检查器并在测试开始前中断

### testTimeout

<<<<<<< HEAD
- **命令行终端:** `--testTimeout <timeout>`
- **配置:** [testTimeout](/config/#testtimeout)
=======
- **CLI:** `--testTimeout <timeout>`
- **Config:** [testTimeout](/config/testtimeout)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

测试的默认超时（毫秒）（默认值：`5000`）。使用 `0` 完全禁用超时

### hookTimeout

<<<<<<< HEAD
- **命令行终端:** `--hookTimeout <timeout>`
- **配置:** [hookTimeout](/config/#hooktimeout)
=======
- **CLI:** `--hookTimeout <timeout>`
- **Config:** [hookTimeout](/config/hooktimeout)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

默认钩子超时（以毫秒为单位）（默认值：`10000`）。使用 `0` 完全禁用超时

### bail

<<<<<<< HEAD
- **命令行终端:** `--bail <number>`
- **配置:** [bail](/config/#bail)
=======
- **CLI:** `--bail <number>`
- **Config:** [bail](/config/bail)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

当指定数量的测试失败时停止测试执行（默认值：`0`）

### retry

<<<<<<< HEAD
- **命令行终端:** `--retry <times>`
- **配置:** [retry](/config/#retry)
=======
- **CLI:** `--retry <times>`
- **Config:** [retry](/config/retry)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

如果测试失败，重试特定次数（默认值： `0`）

### diff.aAnnotation

<<<<<<< HEAD
- **命令行终端:** `--diff.aAnnotation <annotation>`
- **配置:** [diff.aAnnotation](/config/#diff-aannotation)
=======
- **CLI:** `--diff.aAnnotation <annotation>`
- **Config:** [diff.aAnnotation](/config/diff#diff-aannotation)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

预期值的行注释 (默认值: `Expected`)

### diff.aIndicator

<<<<<<< HEAD
- **命令行终端:** `--diff.aIndicator <indicator>`
- **配置:** [diff.aIndicator](/config/#diff-aindicator)
=======
- **CLI:** `--diff.aIndicator <indicator>`
- **Config:** [diff.aIndicator](/config/diff#diff-aindicator)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

预期值的行标识 (默认值: `-`)

### diff.bAnnotation

<<<<<<< HEAD
- **命令行终端:** `--diff.bAnnotation <annotation>`
- **配置:** [diff.bAnnotation](/config/#diff-bannotation)
=======
- **CLI:** `--diff.bAnnotation <annotation>`
- **Config:** [diff.bAnnotation](/config/diff#diff-bannotation)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

实际值的行注释 (默认值: `Received`)

### diff.bIndicator

<<<<<<< HEAD
- **命令行终端:** `--diff.bIndicator <indicator>`
- **配置:** [diff.bIndicator](/config/#diff-bindicator)
=======
- **CLI:** `--diff.bIndicator <indicator>`
- **Config:** [diff.bIndicator](/config/diff#diff-bindicator)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

实际值的行标识 (默认值: `+`)

### diff.commonIndicator

<<<<<<< HEAD
- **命令行终端:** `--diff.commonIndicator <indicator>`
- **配置:** [diff.commonIndicator](/config/#diff-commonindicator)
=======
- **CLI:** `--diff.commonIndicator <indicator>`
- **Config:** [diff.commonIndicator](/config/diff#diff-commonindicator)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

公共行标识 （默认值: ` `）

### diff.contextLines

<<<<<<< HEAD
- **命令行终端:** `--diff.contextLines <lines>`
- **配置:** [diff.contextLines](/config/#diff-contextlines)
=======
- **CLI:** `--diff.contextLines <lines>`
- **Config:** [diff.contextLines](/config/diff#diff-contextlines)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

每次变更显示上下文行数 （默认值: `5`）

### diff.emptyFirstOrLastLinePlaceholder

<<<<<<< HEAD
- **命令行终端:** `--diff.emptyFirstOrLastLinePlaceholder <placeholder>`
- **配置:** [diff.emptyFirstOrLastLinePlaceholder](/config/#diff-emptyfirstorlastlineplaceholder)
=======
- **CLI:** `--diff.emptyFirstOrLastLinePlaceholder <placeholder>`
- **Config:** [diff.emptyFirstOrLastLinePlaceholder](/config/diff#diff-emptyfirstorlastlineplaceholder)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

空首行或空末行的占位符 （默认值: `""`）

### diff.expand

<<<<<<< HEAD
- **命令行终端:** `--diff.expand`
- **配置:** [diff.expand](/config/#diff-expand)
=======
- **CLI:** `--diff.expand`
- **Config:** [diff.expand](/config/diff#diff-expand)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

展开所有公共行 （默认值: `true`）

### diff.includeChangeCounts

<<<<<<< HEAD
- **命令行终端:** `--diff.includeChangeCounts`
- **配置:** [diff.includeChangeCounts](/config/#diff-includechangecounts)
=======
- **CLI:** `--diff.includeChangeCounts`
- **Config:** [diff.includeChangeCounts](/config/diff#diff-includechangecounts)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

在 diff 的输出中输出比较计数 （默认值: `false`）

### diff.omitAnnotationLines

<<<<<<< HEAD
- **命令行终端:** `--diff.omitAnnotationLines`
- **配置:** [diff.omitAnnotationLines](/config/#diff-omitannotationlines)
=======
- **CLI:** `--diff.omitAnnotationLines`
- **Config:** [diff.omitAnnotationLines](/config/diff#diff-omitannotationlines)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

省略输出中的注释行 (默认值: `false`)

### diff.printBasicPrototype

<<<<<<< HEAD
- **命令行终端:** `--diff.printBasicPrototype`
- **配置:** [diff.printBasicPrototype](/config/#diff-printbasicprototype)
=======
- **CLI:** `--diff.printBasicPrototype`
- **Config:** [diff.printBasicPrototype](/config/diff#diff-printbasicprototype)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

打印基础的原型 `Object` 和 `Array` (默认值: `true`)

### diff.maxDepth

<<<<<<< HEAD
- **命令行终端:** `--diff.maxDepth <maxDepth>`
- **配置:** [diff.maxDepth](/config/#diff-maxdepth)
=======
- **CLI:** `--diff.maxDepth <maxDepth>`
- **Config:** [diff.maxDepth](/config/diff#diff-maxdepth)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

打印嵌套对象时，递归深度限制 (默认值: `20`)

### diff.truncateThreshold

<<<<<<< HEAD
- **命令行终端:** `--diff.truncateThreshold <threshold>`
- **配置:** [diff.truncateThreshold](/config/#diff-truncatethreshold)
=======
- **CLI:** `--diff.truncateThreshold <threshold>`
- **Config:** [diff.truncateThreshold](/config/diff#diff-truncatethreshold)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

显示成每次变更前后的行数 (默认值: `0`)

### diff.truncateAnnotation

<<<<<<< HEAD
- **命令行终端:** `--diff.truncateAnnotation <annotation>`
- **配置:** [diff.truncateAnnotation](/config/#diff-truncateannotation)
=======
- **CLI:** `--diff.truncateAnnotation <annotation>`
- **Config:** [diff.truncateAnnotation](/config/diff#diff-truncateannotation)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

在 diff 结果末尾输出的注释（如果被截断） (默认值: `... Diff result is truncated`)

### exclude

<<<<<<< HEAD
- **命令行终端:** `--exclude <glob>`
- **配置:** [exclude](/config/#exclude)
=======
- **CLI:** `--exclude <glob>`
- **Config:** [exclude](/config/exclude)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

测试中排除的其他文件路径匹配模式

### expandSnapshotDiff

<<<<<<< HEAD
- **命令行终端:** `--expandSnapshotDiff`
- **配置:** [expandSnapshotDiff](/config/#expandsnapshotdiff)
=======
- **CLI:** `--expandSnapshotDiff`
- **Config:** [expandSnapshotDiff](/config/expandsnapshotdiff)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

快照失败时显示完整差异

### disableConsoleIntercept

<<<<<<< HEAD
- **命令行终端:** `--disableConsoleIntercept`
- **配置:** [disableConsoleIntercept](/config/#disableconsoleintercept)
=======
- **CLI:** `--disableConsoleIntercept`
- **Config:** [disableConsoleIntercept](/config/disableconsoleintercept)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

禁用自动拦截控制台日志（默认值：`false`）

### typecheck.enabled

<<<<<<< HEAD
- **命令行终端:** `--typecheck.enabled`
- **配置:** [typecheck.enabled](/config/#typecheck-enabled)
=======
- **CLI:** `--typecheck.enabled`
- **Config:** [typecheck.enabled](/config/typecheck#typecheck-enabled)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

在测试的同时启用类型检查（默认值：`false`）

### typecheck.only

<<<<<<< HEAD
- **命令行终端:** `--typecheck.only`
- **配置:** [typecheck.only](/config/#typecheck-only)
=======
- **CLI:** `--typecheck.only`
- **Config:** [typecheck.only](/config/typecheck#typecheck-only)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

仅运行类型检查测试。这将自动启用类型检查（默认值：`false`）

### typecheck.checker

<<<<<<< HEAD
- **命令行终端:** `--typecheck.checker <name>`
- **配置:** [typecheck.checker](/config/#typecheck-checker)
=======
- **CLI:** `--typecheck.checker <name>`
- **Config:** [typecheck.checker](/config/typecheck#typecheck-checker)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

指定要使用的类型检查器。可用值为 "tsc"和 "vue-tsc "以及一个可执行文件的路径（默认值：`tsc`）

### typecheck.allowJs

<<<<<<< HEAD
- **命令行终端:** `--typecheck.allowJs`
- **配置:** [typecheck.allowJs](/config/#typecheck-allowjs)
=======
- **CLI:** `--typecheck.allowJs`
- **Config:** [typecheck.allowJs](/config/typecheck#typecheck-allowjs)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

允许对 JavaScript 文件进行类型检查。默认值取自 tsconfig.json

### typecheck.ignoreSourceErrors

<<<<<<< HEAD
- **命令行终端:** `--typecheck.ignoreSourceErrors`
- **配置:** [typecheck.ignoreSourceErrors](/config/#typecheck-ignoresourceerrors)
=======
- **CLI:** `--typecheck.ignoreSourceErrors`
- **Config:** [typecheck.ignoreSourceErrors](/config/typecheck#typecheck-ignoresourceerrors)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

忽略源文件中的类型错误

### typecheck.tsconfig

<<<<<<< HEAD
- **命令行终端:** `--typecheck.tsconfig <path>`
- **配置:** [typecheck.tsconfig](/config/#typecheck-tsconfig)
=======
- **CLI:** `--typecheck.tsconfig <path>`
- **Config:** [typecheck.tsconfig](/config/typecheck#typecheck-tsconfig)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

自定义 tsconfig 文件的路径

### typecheck.spawnTimeout

<<<<<<< HEAD
- **命令行终端:** `--typecheck.spawnTimeout <time>`
- **配置:** [typecheck.spawnTimeout](/config/#typecheck-spawntimeout)
=======
- **CLI:** `--typecheck.spawnTimeout <time>`
- **Config:** [typecheck.spawnTimeout](/config/typecheck#typecheck-spawntimeout)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

类型检查器启动所需最短时间（以毫秒为单位）

### project

<<<<<<< HEAD
- **命令行终端:** `--project <name>`
- **配置:** [project](/config/#project)
=======
- **CLI:** `--project <name>`
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

如果我们正在使用 Vitest 的工作区功能，这是要运行的项目名称。这个参数可以重复以指定多个项目：`--project=1 --project=2`。我们还可以使用通配符来过滤项目，例如 `--project=packages*`，以及使用 `--project=!pattern` 来排除项目

### slowTestThreshold

<<<<<<< HEAD
- **命令行终端:** `--slowTestThreshold <threshold>`
- **配置:** [slowTestThreshold](/config/#slowtestthreshold)
=======
- **CLI:** `--slowTestThreshold <threshold>`
- **Config:** [slowTestThreshold](/config/slowtestthreshold)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

测试速度慢的阈值（以毫秒为单位）（默认值：`300`）

### teardownTimeout

<<<<<<< HEAD
- **命令行终端:** `--teardownTimeout <timeout>`
- **配置:** [teardownTimeout](/config/#teardowntimeout)
=======
- **CLI:** `--teardownTimeout <timeout>`
- **Config:** [teardownTimeout](/config/teardowntimeout)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

拆卸函数的默认超时（以毫秒为单位）（默认值：`10000`）

### maxConcurrency

<<<<<<< HEAD
- **命令行终端:** `--maxConcurrency <number>`
- **配置:** [maxConcurrency](/config/#maxconcurrency)
=======
- **CLI:** `--maxConcurrency <number>`
- **Config:** [maxConcurrency](/config/maxconcurrency)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

套件中并发测试的最大次数（默认值：`5`）

### expect.requireAssertions

<<<<<<< HEAD
- **命令行终端:** `--expect.requireAssertions`
- **配置:** [expect.requireAssertions](/config/#expect-requireassertions)
=======
- **CLI:** `--expect.requireAssertions`
- **Config:** [expect.requireAssertions](/config/expect#expect-requireassertions)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

要求所有测试至少有一个断言

### expect.poll.interval

<<<<<<< HEAD
- **命令行终端:** `--expect.poll.interval <interval>`
- **配置:** [expect.poll.interval](/config/#expect-poll-interval)
=======
- **CLI:** `--expect.poll.interval <interval>`
- **Config:** [expect.poll.interval](/config/expect#expect-poll-interval)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

断言的轮询间隔 `expect.poll()` (默认值: `50`)

### expect.poll.timeout

<<<<<<< HEAD
- **命令行终端:** `--expect.poll.timeout <timeout>`
- **配置:** [expect.poll.timeout](/config/#expect-poll-timeout)
=======
- **CLI:** `--expect.poll.timeout <timeout>`
- **Config:** [expect.poll.timeout](/config/expect#expect-poll-timeout)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

断言的轮询超时（以毫秒为单位） `expect.poll()` (默认值: `1000`)

### printConsoleTrace

<<<<<<< HEAD
- **命令行终端:** `--printConsoleTrace`
- **配置:** [printConsoleTrace](/config/#printconsoletrace)
=======
- **CLI:** `--printConsoleTrace`
- **Config:** [printConsoleTrace](/config/printconsoletrace)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

始终打印控制台堆栈跟踪

### includeTaskLocation

<<<<<<< HEAD
- **命令行终端:** `--includeTaskLocation`
- **配置:** [includeTaskLocation](/config/#includetasklocation)
=======
- **CLI:** `--includeTaskLocation`
- **Config:** [includeTaskLocation](/config/includetasklocation)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

在 `location` 属性中收集测试用例和测试套件的位置信息

### attachmentsDir

<<<<<<< HEAD
- **命令行终端:** `--attachmentsDir <dir>`
- **配置:** [attachmentsDir](/config/#attachmentsdir)
=======
- **CLI:** `--attachmentsDir <dir>`
- **Config:** [attachmentsDir](/config/attachmentsdir)
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b

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

<<<<<<< HEAD
启动 Vitest 但不运行测试。只有在文件发生变化时才会运行测试。当通过 CLI 传递了文件过滤器时，此选项将被忽略（默认值：`false`）
=======
Start Vitest without running tests. Tests will be running only on change. This option is ignored when CLI file filters are passed. (default: `false`)

### clearCache

- **CLI:** `--clearCache`

Delete all Vitest caches, including `experimental.fsModuleCache`, without running any tests. This will reduce the performance in the subsequent test run.

### experimental.fsModuleCache

- **CLI:** `--experimental.fsModuleCache`
- **Config:** [experimental.fsModuleCache](/config/experimental#experimental-fsmodulecache)

Enable caching of modules on the file system between reruns.
>>>>>>> 6a59445f92d4a3c4ade0126d8f3da58a35e43f0b
