---
outline: deep
title: Vitest API
---

# Vitest

Vitest 实例需要当前的测试模式。它可以是以下之一：

- `test`：运行运行时测试时
- `benchmark`：运行基准测试时 <Badge type="warning">实验性</Badge>

::: details Vitest 3 中的新特性
Vitest 3 在稳定公共 API 方面迈出了一步。为了实现这一点，我们弃用并删除了 `Vitest` 类上的一些先前公开的方法。这些 API 已被私有化：

- `configOverride`（使用 [`setGlobalTestNamePattern`](#setglobaltestnamepattern) 或 [`enableSnapshotUpdate`](#enablesnapshotupdate)）
- `coverageProvider`
- `filenamePattern`
- `runningPromise`
- `closingPromise`
- `isCancelling`
- `coreWorkspaceProject`
- `resolvedProjects`
- `_browserLastPort`
- `_options`
- `reporters`
- `vitenode`
- `runner`
- `pool`
- `setServer`
- `_initBrowserServers`
- `rerunTask`
- `changeProjectName`
- `changeNamePattern`
- `changeFilenamePattern`
- `rerunFailed`
- `_createRootProject`（重命名为 `_ensureRootProject`，但仍为私有）
- `filterTestsBySource`（此方法已移至新的内部 `vitest.specifications` 实例）
- `runFiles`（使用 [`runTestSpecifications`](#runtestspecifications) 代替）
- `onAfterSetServer`

这些 API 已被弃用：
- `invalidates`
- `changedTests`（使用 [`onFilterWatchedSpecification`](#onfilterwatchedspecification) 代替）
- `server`（使用 [`vite`](#vite) 代替）
- `getProjectsByTestFile`（使用 [`getModuleSpecifications`](#getmodulespecifications) 代替）
- `getFileWorkspaceSpecs`（使用 [`getModuleSpecifications`](#getmodulespecifications) 代替）
- `getModuleProjects`（自行通过 [`this.projects`](#projects) 过滤）
- `updateLastChanged`（重命名为 [`invalidateFile`](#invalidatefile)）
- `globTestSpecs`（使用 [`globTestSpecifications`](#globtestspecifications) 代替）
- `globTestFiles`（使用 [`globTestSpecifications`](#globtestspecifications) 代替）
- `listFile`（使用 [`getRelevantTestSpecifications`](#getrelevanttestspecifications) 代替）
:::

## mode

### test

测试模式只会调用 `test` 或 `it` 中的函数，并在遇到 `bench` 时抛出错误。此模式使用配置中的 `include` 和 `exclude` 选项来查找测试文件。

### benchmark <Badge type="warning">实验性</Badge>

基准测试模式调用 `bench` 函数，并在遇到 `test` 或 `it` 时抛出错误。此模式使用配置中的 `benchmark.include` 和 `benchmark.exclude` 选项来查找基准测试文件。

## config

<<<<<<< HEAD
根（或全局）配置。如果启用了工作区功能，项目将引用此配置作为 `globalConfig`。
=======
The root (or global) config. If projects are defined, they will reference this as `globalConfig`.
>>>>>>> 45ff01e6b0f6d0da77d934ebda0f3a417a17e325

::: warning
这是 Vitest 配置，它不扩展 _Vite_ 配置。它仅包含从 `test` 属性解析的值。
:::

## vite

这是全局的 [`ViteDevServer`](https://vite.dev/guide/api-javascript#vitedevserver)。

## state <Badge type="warning">实验性</Badge>

::: warning
公共 `state` 是一个实验性 API（除了 `vitest.state.getReportedEntity`）。破坏性更改可能不遵循 SemVer，请在使用时固定 Vitest 的版本。
:::

全局状态存储有关当前测试的信息。默认情况下，它使用与 `@vitest/runner` 相同的 API，但我们建议通过调用 `@vitest/runner` API 上的 `state.getReportedEntity()` 来使用 [报告任务 API](/advanced/reporters#reported-tasks)：

```ts
const task = vitest.state.idMap.get(taskId) // 旧 API
const testCase = vitest.state.getReportedEntity(task) // 新 API
```

未来，旧 API 将不再公开。

## snapshot

全局快照管理器。Vitest 使用 `snapshot.add` 方法跟踪所有快照。

我们可以通过 `vitest.snapshot.summary` 属性获取快照的最新摘要。

## cache

缓存管理器，存储有关最新测试结果和测试文件状态的信息。在 Vitest 中，这仅由默认的排序器用于排序测试。

## projects

<<<<<<< HEAD
属于用户工作区的 [测试项目](/advanced/api/test-project) 数组。如果用户未指定自定义工作区，则工作区将仅包含一个 [根项目](#getrootproject)。

Vitest 将确保工作区中始终至少有一个项目。如果用户指定了不存在的 `--project` 名称，Vitest 将抛出错误。
=======
An array of [test projects](/advanced/api/test-project) that belong to user's projects. If the user did not specify a them, this array will only contain a [root project](#getrootproject).

Vitest will ensure that there is always at least one project in this array. If the user specifies a non-existent `--project` name, Vitest will throw an error before this array is defined.
>>>>>>> 45ff01e6b0f6d0da77d934ebda0f3a417a17e325

## getRootProject

```ts
function getRootProject(): TestProject
```

<<<<<<< HEAD
返回根测试项目。根项目通常不运行任何测试，并且除非用户明确在其工作区中包含根配置，或者根本没有定义工作区，否则不会包含在 `vitest.projects` 中。
=======
This returns the root test project. The root project generally doesn't run any tests and is not included in `vitest.projects` unless the user explicitly includes the root config in their configuration, or projects are not defined at all.
>>>>>>> 45ff01e6b0f6d0da77d934ebda0f3a417a17e325

根项目的主要目标是设置全局配置。实际上，`rootProject.config` 直接引用 `rootProject.globalConfig` 和 `vitest.config`：

```ts
rootProject.config === rootProject.globalConfig === rootProject.vitest.config
```

## provide

```ts
function provide<T extends keyof ProvidedContext & string>(
  key: T,
  value: ProvidedContext[T],
): void
```

Vitest 公开了 `provide` 方法，它是 `vitest.getRootProject().provide` 的简写。通过此方法，我们可以从主线程传递值到测试中。所有值在存储之前都通过 `structuredClone` 进行检查，但值本身不会被克隆。

为了接收测试中的值，我们需要从 `vitest` 入口点导入 `inject` 方法：

```ts
import { inject } from 'vitest'
const port = inject('wsPort') // 3000
```

为了更好的类型安全性，我们鼓励我们扩展 `ProvidedContext` 的类型：

```ts
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test', {
  watch: false,
})
vitest.provide('wsPort', 3000)

declare module 'vitest' {
  export interface ProvidedContext {
    wsPort: number
  }
}
```

::: warning
从技术上讲，`provide` 是 [`TestProject`](/advanced/api/test-project) 的一种方法，因此它仅限于特定项目。但是，所有项目都会从根项目继承值，这使得 `vitest.provide` 成为将值传递给测试的通用方法。
:::

## getProvidedContext

```ts
function getProvidedContext(): ProvidedContext
```

返回根上下文对象。这是 `vitest.getRootProject().getProvidedContext` 的简写。

## getProjectByName

```ts
function getProjectByName(name: string): TestProject
```

此方法通过名称返回项目。类似于调用 `vitest.projects.find` 。

::: warning
如果项目不存在，此方法将返回根项目 - 请确保再次检查返回的项目是否是我们要找的项目。

如果用户没有自定义名称，Vitest 将分配一个空字符串作为名称。
:::

## globTestSpecifications

```ts
function globTestSpecifications(
  filters?: string[],
): Promise<TestSpecification[]>
```

此方法通过收集所有项目中的每个测试来构造新的 [测试规范](/advanced/api/test-specification)，使用 [`project.globTestFiles`](/advanced/api/test-project#globtestfiles)。它接受字符串过滤器以匹配测试文件 - 这些过滤器与 [CLI 支持的过滤器](/guide/filtering#cli) 相同。

此方法自动缓存所有测试规范。当我们下次调用 [`getModuleSpecifications`](#getmodulespecifications) 时，它将返回相同的规范，除非在此之前调用了 [`clearSpecificationsCache`](#clearspecificationscache)。

::: warning
从 Vitest 3 开始，如果 `poolMatchGlob` 有多个池或启用了 `typecheck`，则可能有多个具有相同模块 ID（文件路径）的测试规范。这种可能性将在 Vitest 4 中移除。
:::

```ts
const specifications = await vitest.globTestSpecifications(['my-filter'])
// [TestSpecification{ moduleId: '/tests/my-filter.test.ts' }]
console.log(specifications)
```

## getRelevantTestSpecifications

```ts
function getRelevantTestSpecifications(
  filters?: string[]
): Promise<TestSpecification[]>
```

此方法通过调用 [`project.globTestFiles`](/advanced/api/test-project#globtestfiles) 解析每个测试规范。它接受字符串过滤器以匹配测试文件 - 这些过滤器与 [CLI 支持的过滤器](/guide/filtering#cli) 相同。如果指定了 `--changed` 标志，则列表将被过滤为仅包含已更改的文件。`getRelevantTestSpecifications` 不会运行任何测试文件。

::: warning
此方法可能很慢，因为它需要过滤 `--changed` 标志。如果我们只需要测试文件列表，请不要使用它。

- 如果我们需要获取已知测试文件的规范列表，请使用 [`getModuleSpecifications`](#getmodulespecifications) 代替。
- 如果我们需要获取所有可能的测试文件列表，请使用 [`globTestSpecifications`](#globtestspecifications)。
:::

## mergeReports

```ts
function mergeReports(directory?: string): Promise<TestRunResult>
```

合并指定目录中的多个运行的报告（如果未指定，则使用 `--merge-reports` 的值）。此值也可以在 `config.mergeReports` 上设置（默认情况下，它将读取 `.vitest-reports` 文件夹）。

请注意，`directory` 将始终相对于工作目录解析。

如果设置了 `config.mergeReports`，则此方法由 [`startVitest`](/advanced/guide/tests) 自动调用。

## collect

```ts
function collect(filters?: string[]): Promise<TestRunResult>
```

执行测试文件而不运行测试回调。`collect` 返回未处理的错误和 [测试模块](/advanced/api/test-module) 数组。它接受字符串过滤器以匹配测试文件 - 这些过滤器与 [CLI 支持的过滤器](/guide/filtering#cli) 相同。

此方法根据配置的 `include`、`exclude` 和 `includeSource` 值解析测试规范。有关更多信息，请参阅 [`project.globTestFiles`](/advanced/api/test-project#globtestfiles)。如果指定了 `--changed` 标志，则列表将被过滤为仅包含已更改的文件。

::: warning
请注意，Vitest 不使用静态分析来收集测试。Vitest 将像运行常规测试一样在隔离环境中运行每个测试文件。

这使得此方法非常慢，除非我们在收集测试之前禁用隔离。
:::

## start

```ts
function start(filters?: string[]): Promise<TestRunResult>
```

初始化报告器、覆盖率提供者并运行测试。此方法接受字符串过滤器以匹配测试文件 - 这些过滤器与 [CLI 支持的过滤器](/guide/filtering#cli) 相同。

::: warning
如果还调用了 [`vitest.init()`](#init)，则不应调用此方法。如果我们需要在 Vitest 初始化后运行测试，请使用 [`runTestSpecifications`](#runtestspecifications) 或 [`rerunTestSpecifications`](#reruntestspecifications)。
:::

如果未设置 `config.mergeReports` 和 `config.standalone`，则此方法由 [`startVitest`](/advanced/guide/tests) 自动调用。

## init

```ts
function init(): Promise<void>
```

初始化报告器和覆盖率提供者。此方法不运行任何测试。如果提供了 `--watch` 标志，Vitest 仍将运行更改的测试，即使未调用此方法。

在内部，仅当启用了 [`--standalone`](/guide/cli#standalone) 标志时才会调用此方法。

::: warning
如果还调用了 [`vitest.start()`](#start)，则不应调用此方法。
:::

如果设置了 `config.standalone`，则此方法由 [`startVitest`](/advanced/guide/tests) 自动调用。

## getModuleSpecifications

```ts
function getModuleSpecifications(moduleId: string): TestSpecification[]
```

返回与模块 ID 相关的测试规范列表。ID 应已解析为绝对文件路径。如果 ID 不匹配 `include` 或 `includeSource` 模式，则返回的数组将为空。

此方法可以根据 `moduleId` 和 `pool` 返回已缓存的规范。但请注意，[`project.createSpecification`](/advanced/api/test-project#createspecification) 总是返回一个新实例，并且不会自动缓存。但是，当调用 [`runTestSpecifications`](#runtestspecifications) 时，规范会自动缓存。

::: warning
从 Vitest 3 开始，此方法使用缓存来检查文件是否为测试文件。为确保缓存不为空，请至少调用一次 [`globTestSpecifications`](#globtestspecifications)。
:::

## clearSpecificationsCache

```ts
function clearSpecificationsCache(moduleId?: string): void
```

当调用 [`globTestSpecifications`](#globtestspecifications) 或 [`runTestSpecifications`](#runtestspecifications) 时，Vitest 会自动缓存每个文件的测试规范。此方法会根据第一个参数清除给定文件的缓存或整个缓存。

## runTestSpecifications

```ts
function runTestSpecifications(
  specifications: TestSpecification[],
  allTestsRun = false
): Promise<TestRunResult>
```

此方法根据接收到的 [规范](/advanced/api/test-specification) 运行每个测试。第二个参数 `allTestsRun` 由覆盖率提供者用于确定是否需要在根目录中检测每个文件的覆盖率（这仅在启用了覆盖率并且 `coverage.all` 设置为 `true` 时才重要）。

::: warning
此方法不会触发 `onWatcherRerun`、`onWatcherStart` 和 `onTestsRerun` 回调。如果我们基于文件更改重新运行测试，请考虑使用 [`rerunTestSpecifications`](#reruntestspecifications) 代替。
:::

## rerunTestSpecifications

```ts
function rerunTestSpecifications(
  specifications: TestSpecification[],
  allTestsRun = false
): Promise<TestRunResult>
```

此方法发出 `reporter.onWatcherRerun` 和 `onTestsRerun` 事件，然后使用 [`runTestSpecifications`](#runtestspecifications) 运行测试。如果主进程中没有错误，它将发出 `reporter.onWatcherStart` 事件。

## updateSnapshot

```ts
function updateSnapshot(files?: string[]): Promise<TestRunResult>
```

更新指定文件中的快照。如果未提供文件，它将更新具有失败测试和过时快照的文件。

## collectTests

```ts
function collectTests(
  specifications: TestSpecification[]
): Promise<TestRunResult>
```

执行测试文件而不运行测试回调。`collectTests` 返回未处理的错误和 [测试模块](/advanced/api/test-module) 数组。

此方法与 [`collect`](#collect) 完全相同，但我们需要自己提供测试规范。

::: warning
请注意，Vitest 不使用静态分析来收集测试。Vitest 将像运行常规测试一样在隔离环境中运行每个测试文件。

这使得此方法非常慢，除非我们在收集测试之前禁用隔离。
:::

## cancelCurrentRun

```ts
function cancelCurrentRun(reason: CancelReason): Promise<void>
```

此方法将优雅地取消所有正在进行的测试。它将等待已启动的测试完成运行，并且不会运行已计划运行但尚未启动的测试。

## setGlobalTestNamePattern

```ts
function setGlobalTestNamePattern(pattern: string | RegExp): void
```

此方法覆盖全局的 [测试名称模式](/config/#testnamepattern)。

::: warning
此方法不会开始运行任何测试。要使用更新后的模式运行测试，请调用 [`runTestSpecifications`](#runtestspecifications)。
:::

## resetGlobalTestNamePattern

```ts
function resetGlobalTestNamePattern(): void
```

此方法重置 [测试名称模式](/config/#testnamepattern)。这意味着 Vitest 现在不会跳过任何测试。

::: warning
此方法不会开始运行任何测试。要运行没有模式的测试，请调用 [`runTestSpecifications`](#runtestspecifications)。
:::

## enableSnapshotUpdate

```ts
function enableSnapshotUpdate(): void
```

启用允许在运行测试时更新快照的模式。在此方法调用后运行的每个测试都将更新快照。要禁用此模式，请调用 [`resetSnapshotUpdate`](#resetsnapshotupdate)。

::: warning
此方法不会开始运行任何测试。要更新快照，请使用 [`runTestSpecifications`](#runtestspecifications) 运行测试。
:::

## resetSnapshotUpdate

```ts
function resetSnapshotUpdate(): void
```

禁用允许在运行测试时更新快照的模式。此方法不会开始运行任何测试。

## invalidateFile

```ts
function invalidateFile(filepath: string): void
```

此方法使每个项目缓存中的文件失效。如果我们依赖自己的观察器，则此方法非常有用，因为 Vite 的缓存会持久保存在内存中。

::: danger
如果我们禁用 Vitest 的观察器但保持 Vitest 运行，则必须使用此方法手动清除缓存，因为无法禁用缓存。此方法还将使文件的导入者失效。
:::

## import

<!--@include: ./import-example.md-->

使用 Vite 模块运行器导入文件。文件将通过全局配置由 Vite 转换，并在单独的上下文中执行。请注意，`moduleId` 将相对于 `config.root`。

::: danger
`project.import` 重用 Vite 的模块图，因此使用常规导入导入同一模块将返回不同的模块：

```ts
import * as staticExample from './example.js'
const dynamicExample = await vitest.import('./example.js')

dynamicExample !== staticExample // ✅
```
:::

::: info
<<<<<<< HEAD
在内部，Vitest 使用此方法导入全局设置、自定义覆盖率提供者、工作区文件和自定义报告器，这意味着只要它们属于同一个 Vite 服务器，它们就共享相同的模块图。
=======
Internally, Vitest uses this method to import global setups, custom coverage providers, and custom reporters, meaning all of them share the same module graph as long as they belong to the same Vite server.
>>>>>>> 45ff01e6b0f6d0da77d934ebda0f3a417a17e325
:::

## close

```ts
function close(): Promise<void>
```

关闭所有项目及其相关资源。此方法只能调用一次；关闭的 Promise 会被缓存，直到服务器重新启动。

## exit

```ts
function exit(force = false): Promise<void>
```

关闭所有项目并退出进程。如果 `force` 设置为 `true`，则进程将在关闭项目后立即退出。

如果进程在 [`config.teardownTimeout`](/config/#teardowntimeout) 毫秒后仍然处于活动状态，此方法还将强制调用 `process.exit()`。

## shouldKeepServer

```ts
function shouldKeepServer(): boolean
```

如果测试完成后服务器应继续运行，则此方法将返回 `true`。这通常意味着启用了 `watch` 模式。

## onServerRestart

```ts
function onServerRestart(fn: OnServerRestartHandler): void
```

注册一个处理程序，当服务器由于配置更改而重新启动时调用。

## onCancel

```ts
function onCancel(fn: (reason: CancelReason) => Awaitable<void>): void
```

注册一个处理程序，当测试运行被 [`vitest.cancelCurrentRun`](#cancelcurrentrun) 取消时调用。

## onClose

```ts
function onClose(fn: () => Awaitable<void>): void
```

注册一个处理程序，当服务器关闭时调用。

## onTestsRerun

```ts
function onTestsRerun(fn: OnTestsRerunHandler): void
```

注册一个处理程序，当测试重新运行时调用。当手动调用 [`rerunTestSpecifications`](#reruntestspecifications) 或文件更改且内置观察器安排重新运行时，测试会重新运行。

## onFilterWatchedSpecification

```ts
function onFilterWatchedSpecification(
  fn: (specification: TestSpecification) => boolean
): void
```
注册一个处理程序，当文件更改时调用。此回调应返回 `true` 或 `false`，指示是否需要重新运行测试文件。

通过此方法，我们可以挂钩到默认的观察器逻辑，以延迟或丢弃用户当前不想跟踪的测试：

```ts
const continuesTests: string[] = []

myCustomWrapper.onContinuesRunEnabled(testItem =>
  continuesTests.push(item.fsPath)
)

vitest.onFilterWatchedSpecification(specification =>
  continuesTests.includes(specification.moduleId)
)
```

Vitest 可以根据 `pool` 或 `locations` 选项为同一文件创建不同的规范，因此不要依赖引用。Vitest 还可以从 [`vitest.getModuleSpecifications`](#getmodulespecifications) 返回缓存的规范 - 缓存基于 `moduleId` 和 `pool`。请注意，[`project.createSpecification`](/advanced/api/test-project#createspecification) 总是返回一个新实例。

## matchesProjectFilter <Version>3.1.0</Version> {#matchesprojectfilter}

```ts
function matchesProjectFilter(name: string): boolean
```

检查名称是否与当前 [项目过滤器](/guide/cli#project) 匹配。如果没有项目过滤器，则始终返回 `true` 。

无法通过编程方式更改 `--project` CLI 选项。
