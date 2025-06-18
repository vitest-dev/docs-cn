# TestModule

`TestModule` 类表示项目中的单个模块。此类仅在主线程中可用。如果你正在处理运行时任务，请参阅 [“Runner API”](/advanced/runner#tasks)。

`TestModule` 实例始终具有一个 `type` 属性，其值为 `module`。你可以使用它来区分不同的任务类型：

```ts
if (task.type === 'module') {
  task // TestModule
}
```

::: warning 扩展 Suite 的方法
`TestModule` 类继承了 [`TestSuite`](/advanced/api/test-suite) 的所有方法和属性。本指南将列出 `TestModule` 独有的方法和属性。
:::

## moduleId

这通常是一个绝对的 Unix 文件路径（即使在 Windows 上也是如此）。如果文件不在磁盘上，它可以是一个虚拟 ID。此值对应于 Vite 的 `ModuleGraph` ID。

```ts
'C:/Users/Documents/project/example.test.ts' // ✅
'/Users/mac/project/example.test.ts' // ✅
'C:\\Users\\Documents\\project\\example.test.ts' // ❌
```

## state

```ts
function state(): TestModuleState
```

与 [`testSuite.state()`](/advanced/api/test-suite#state) 的工作方式相同，但如果模块尚未执行，还可以返回 `queued`。

## meta <Version>3.1.0</Version> {#meta}

```ts
function meta(): TaskMeta
```

在模块执行或收集过程中附加到模块的自定义[元数据](/advanced/metadata)。在测试运行期间，可以通过向 `task.meta` 对象分配属性来附加 meta：

```ts {5,10}
import { test } from 'vitest'

describe('the validation works correctly', (task) => {
  // assign "decorated" during collection
  task.file.meta.decorated = false

  test('some test', ({ task }) => {
    // assign "decorated" during test run, it will be available
    // only in onTestCaseReady hook
    task.file.meta.decorated = false
  })
})
```

:::tip
如果元数据是在收集过程中附加的（在 `test` 函数之外），那么它将在自定义报告器中的['onTestModuleCollectd']（./reporters#onTestModuleCollected）挂钩中可用。
:::

## diagnostic

```ts
function diagnostic(): ModuleDiagnostic
```

关于模块的有用信息，例如持续时间、内存使用等。如果模块尚未执行，所有诊断值将返回 `0`。

```ts
interface ModuleDiagnostic {
  /**
   * The time it takes to import and initiate an environment.
   */
  readonly environmentSetupDuration: number
  /**
   * The time it takes Vitest to setup test harness (runner, mocks, etc.).
   */
  readonly prepareDuration: number
  /**
   * The time it takes to import the test module.
   * This includes importing everything in the module and executing suite callbacks.
   */
  readonly collectDuration: number
  /**
   * The time it takes to import the setup module.
   */
  readonly setupDuration: number
  /**
   * Accumulated duration of all tests and hooks in the module.
   */
  readonly duration: number
  /**
   * The amount of memory used by the module in bytes.
   * This value is only available if the test was executed with `logHeapUsage` flag.
   */
  readonly heap: number | undefined
  /**
   * The time spent importing every non-externalized dependency that Vitest has processed.
   */
  readonly importDurations: Record<string, ImportDuration>
}

/** The time spent importing & executing a non-externalized file. */
interface ImportDuration {
  /** The time spent importing & executing the file itself, not counting all non-externalized imports that the file does. */
  selfTime: number

  /** The time spent importing & executing the file and all its imports. */
  totalTime: number
}
```
