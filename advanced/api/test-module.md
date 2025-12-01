# TestModule

`TestModule` 类表示项目中的单个模块。此类仅在主线程中可用。如果你正在处理运行时任务，请参阅 [“运行器 API”](/advanced/runner#tasks)。

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

## relativeModuleId

相对于项目的模块 ID。这与已弃用 API 中的 `task.name` 相同。

```ts
'project/example.test.ts' // ✅
'example.test.ts' // ✅
'project\\example.test.ts' // ❌
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

在模块执行或收集过程中附加到模块的自定义 [元数据](/advanced/metadata)。在测试运行期间，可以通过向 `task.meta` 对象分配属性来附加 meta：

```ts {5,10}
import { test } from 'vitest'

describe('the validation works correctly', (task) => {
  // 在收集阶段分配 "decorated"
  task.file.meta.decorated = false

  test('some test', ({ task }) => {
    // 在测试运行期间分配 "decorated"，它将可用
    // 仅在 onTestCaseReady 钩子中
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
   * 导入和初始化环境所需的时间。
   */
  readonly environmentSetupDuration: number
  /**
   * Vitest 设置测试运行环境（运行器、模拟等）所需的时间。
   */
  readonly prepareDuration: number
  /**
   * 导入测试模块所需的时间。
   * 这包括导入模块中的所有内容以及执行套件回调函数。
   */
  readonly collectDuration: number
  /**
   * 导入设置模块所需的时间。
   */
  readonly setupDuration: number
  /**
   * 模块中所有测试和钩子函数的累计持续时间。
   */
  readonly duration: number
  /**
   * 模块使用的内存量（以字节为单位）。
   * 此值仅在使用 `logHeapUsage` 标志执行测试时才可用。
   */
  readonly heap: number | undefined
  /**
   * Vitest处理的每个非外部化依赖项的导入时间。
   */
  readonly importDurations: Record<string, ImportDuration>
}

/** 导入和执行非外部化文件所花费的时间。 */
interface ImportDuration {
  /** 导入和执行文件本身所花费的时间，不包括该文件所依赖的所有非外部化导入。 */
  selfTime: number

  /** 导入和执行文件及其所有导入项所花费的时间。 */
  totalTime: number
}
```
