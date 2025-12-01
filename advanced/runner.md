# 运行器 API {#runner-api}

::: warning 注意
这是高级 API。如果你只需要 [运行测试](/guide/)，你可能不需要这个。它主要被库的作者使用。
:::

你可以在你的配置文件中使用 `runner` 选项指定你的测试运行器的路径。这个文件应该有一个默认的导出，其中包含一个实现这些方法的类：

```ts
export interface VitestRunner {
  /**
   * 这是在实际收集和运行测试之前被调用的第一件事情。
   */
  onBeforeCollect?: (paths: string[]) => unknown
  /**
   * 这是在收集测试后、"onBeforeRun" 之前被调用的。
   */
  onCollected?: (files: File[]) => unknown

  /**
   * 当测试运行程序应该取消下一次测试运行时调用。
   * 运行程序应该监听此方法，并在“onBeforeRunSuite”和“onBeforeRunTest”中将测试和套件标记为跳过。
   */
  onCancel?: (reason: CancelReason) => unknown

  /**
   * 在运行单个测试之前调用。此时还没有“result”。
   */
  onBeforeRunTask?: (test: Test) => unknown
  /**
   * 这是在实际运行测试函数之前被调用的。
   * 此时已经有了带有 "state" 和 "startTime" 属性的 "result" 对象。
   */
  onBeforeTryTask?: (test: Test, options: { retry: number, repeats: number }) => unknown
  /**
   * 这是在结果和状态都被设置之后被调用的。
   */
  onAfterRunTask?: (test: Test) => unknown
  /**
   * 这是在运行测试函数后立即被调用的。此时还没有新的状态。
   * 如果测试函数抛出异常，将不会调用此方法。
   */
  onAfterTryTask?: (test: Test, options: { retry: number, repeats: number }) => unknown
  /**
   * 在重试结果确定后调用。与 `onAfterTryTask` 不同，此时测试已进入新的状态，
   * 并且所有的 `after` 钩子此时也已被执行。
   */
  onAfterRetryTask?: (test: Test, options: { retry: number, repeats: number }) => unknown

  /**
   * 这是在运行单个测试套件之前被调用的，此时还没有测试结果。
   */
  onBeforeRunSuite?: (suite: Suite) => unknown
  /**
   * 这是在运行单个测试套件之后被调用的，此时已经有了状态和测试结果。
   */
  onAfterRunSuite?: (suite: Suite) => unknown

  /**
   * 如果定义了这个方法，它将会替代 Vitest 常规的测试套件分割和处理方式。
   * 但 "before" 和 "after" 钩子函数仍然会被执行。
   */
  runSuite?: (suite: Suite) => Promise<void>
  /**
   * 如果定义了这个方法，它将会替代 Vitest 常规的测试处理方式。
   * 如果你有自定义的测试函数，这个方法就很有用。
   * 但 "before" 和 "after" 钩子函数仍然会被执行。
   */
  runTask?: (test: TaskPopulated) => Promise<void>

  /**
   * 当一个任务被更新时被调用。与报告器中的 "onTaskUpdate" 方法相同。
   * 但该方法在同一个线程中运行，与测试运行在同一个线程中。
   */
  onTaskUpdate?: (task: [string, TaskResult | undefined, TaskMeta | undefined][]) => Promise<void>

  /**
   * 这是在运行收集的所有测试之前被调用的。
   */
  onBeforeRunFiles?: (files: File[]) => unknown
  /**
   * 这是在运行收集的所有测试后立即被调用的。
   */
  onAfterRunFiles?: (files: File[]) => unknown
  /**
   * 当定义了测试的新上下文时调用。如果你想要向上下文中添加自定义属性，这将非常有用。
   * 如果你只是想通过运行器定义自定义上下文，建议在 `setupFiles` 中使用 `beforeAll`。
   */
  extendTaskContext?: (context: TestContext) => TestContext
  /**
   * 在导入某些文件时调用。可以在两种情况下调用：收集测试和导入设置文件。
   */
  importFile: (filepath: string, source: VitestRunnerImportSource) => unknown
  /**
   * 当运行器尝试获取值时调用的函数，此时 `test.extend` 是与 `{ injected: true }` 一起使用的。
   */
  injectValue?: (key: string) => unknown
  /**
   * 公开可用的配置。
   */
  config: VitestRunnerConfig
  /**
   * 当前池的名称。可能会影响服务器端如何推断堆栈跟踪。
   */
  pool?: string
}
```

在初始化此类时，Vitest 会传递 Vitest 配置，你应该将其作为 `config` 属性暴露出来：

```ts [runner.ts]
import type { RunnerTestFile } from 'vitest'
import type { VitestRunner, VitestRunnerConfig } from 'vitest/suite'
import { VitestTestRunner } from 'vitest/runners'

class CustomRunner extends VitestTestRunner implements VitestRunner {
  public config: VitestRunnerConfig

  constructor(config: VitestRunnerConfig) {
    this.config = config
  }

  onAfterRunFiles(files: RunnerTestFile[]) {
    console.log('finished running', files)
  }
}

export default CustomRunner
```

::: warning
Vitest 会自动把 `vite/module-runner` 提供的 `ModuleRunner` 实例赋给 `moduleRunner` 属性。在 `importFile` 方法中，你可以直接调用它来处理待加载的文件——这也是 `TestRunner` 和 `BenchmarkRunner` 的默认做法。

`ModuleRunner` 的核心是 `import` 方法：它会把测试文件先放在 Vite 的运行环境里跑一遍，动态解析所有 import 路径并即时编译文件，最终输出 Node 能够识别的代码。

```ts
export default class Runner {
  async importFile(filepath: string) {
    await this.moduleRunner.import(filepath)
  }
}
```
:::

::: warning
如果你没有自定义运行器或没有定义 `runTest` 方法，Vitest 将尝试自动检索任务。如果你没有使用 `setFn` 添加函数，这将会失败。
:::

::: tip
快照支持和其他功能是依赖于测试运行器的。如果你想保留这些功能，可以从 `vitest/runners` 导入 `VitestTestRunner` 并将你的测试运行器继承该类。如果你想扩展基准测试功能，它还提供了 `NodeBenchmarkRunner`。
:::

## Tasks {#tasks}

::: warning
“Runner Tasks API” 是实验性的，主要应在测试运行时使用。Vitest 还暴露了 [“Reported Tasks API”](/advanced/api/test-module)，在主线程中工作时（例如在报告器内部）应优先使用。

团队目前正在讨论未来是否应将“Runner Tasks”替换为“Reported Tasks”。
:::

套件和测试在内部被称为 `tasks`。Vitest 运行器在收集任何测试之前会启动一个 `File` 任务——这是 `Suite` 的超集，并带有几个附加属性。它作为 `file` 属性在每个任务（包括 `File`）上都可用。

```ts
interface File extends Suite {
  /**
   * 文件所属的池的名称。
   * @default 'forks'
   */
  pool?: string
  /**
   * 文件的 UNIX 格式路径。
   */
  filepath: string
  /**
   * 该文件所归属的测试项目的名称。
   */
  projectName: string | undefined
  /**
   * 收集文件中所有测试所花费的时间。
   * 这个时间还包括导入所有文件依赖。
   */
  collectDuration?: number
  /**
   * 导入设置文件所花费的时间。
   */
  setupDuration?: number
}
```

每个套件都有一个在收集阶段填充的 `tasks` 属性。从上到下遍历任务树时，这一属性非常有用。

```ts
interface Suite extends TaskBase {
  type: 'suite'
  /**
   * 文件任务。它是文件的 root 任务。
   */
  file: File
  /**
   * 套件中的一系列任务。
   */
  tasks: Task[]
}
```

每个任务都有一个引用其所在套件的 `suite` 属性。如果 `test` 或 `describe` 在顶级被初始化，它们将不会有 `suite` 属性（它 **不会** 等于 `file`！）。`File` 也永远不会有一个 `suite` 属性。从下往上遍历任务时，这一属性非常有用。

```ts
interface Test<ExtraContext = object> extends TaskBase {
  type: 'test'
  /**
   * 将传递给测试函数的测试上下文。
   */
  context: TestContext & ExtraContext
  /**
   * 文件任务。它是文件的根任务。
   */
  file: File
  /**
   * 是否使用 `context.skip()` 方法将此任务标记为跳过。
   */
  pending?: boolean
  /**
   * 任务失败时是否应视为成功。如果任务失败，它将被标记为通过。
   */
  fails?: boolean
  /**
   * 存储承诺（来自异步期望）以在完成测试前等待它们。
   */
  promises?: Promise<any>[]
}
```

每个任务都可以有一个 `result` 字段。只有当在套件回调或 `beforeAll`/`afterAll` 回调中抛出错误，阻止了测试的收集时，套件才会有这个字段。测试在它们的回调被调用后总是有这个字段——`state` 和 `errors` 字段根据结果的存在与否而存在。如果在 `beforeEach` 或 `afterEach` 回调中抛出了错误，抛出的错误将出现在 `task.result.errors` 中。

```ts
export interface TaskResult {
  /**
   * 任务的状态。在收集期间继承 `task.mode`。
   * 当任务完成时，其状态将变为 `pass` 或 `fail`。
   * - **pass**: 任务成功运行
   * - **fail**: 任务失败
   */
  state: TaskState
  /**
   * 在任务执行期间发生的错误。可能存在多个错误。
   * 如果 `expect.soft()` 多次失败。
   */
  errors?: TestError[]
  /**
   * 任务运行所花费的时间（以毫秒为单位）。
   */
  duration?: number
  /**
   * 任务开始运行的时间（以毫秒为单位）。
   */
  startTime?: number
  /**
   * 任务完成后堆的大小（以bytes为单位）。
   * 仅在设置了 `logHeapUsage` 选项且 `process.memoryUsage` 已定义时可用。
   */
  heap?: number
  /**
   * 与该任务相关的钩子状态。在报告期间非常有用。
   */
  hooks?: Partial<Record<'afterAll' | 'beforeAll' | 'beforeEach' | 'afterEach', TaskState>>
  /**
   * 任务重试的次数。只有在任务失败且设置了 `retry` 选项时才会进行重试。
   */
  retryCount?: number
  /**
   * 任务重复的次数。只有在设置了 `repeats` 选项时才会重复任务。此数字也包括 `retryCount`。
   */
  repeatCount?: number
}
```

## 你的任务函数 {#your-task-function}

Vitest 提供了 `createTaskCollector` 工具来创建您自己的 `test` 方法。它的行为与测试相同，但在收集期间会调用自定义方法。

任务是套件的一部分对象。它会通过 `suite.task` 方法自动添加到当前套件中：

```js [custom.js]
import { createTaskCollector, getCurrentSuite } from 'vitest/suite'

export { afterAll, beforeAll, describe } from 'vitest'

// 当 Vitest 收集任务时，将调用此函数
// createTaskCollector 只提供了所有的 "todo"/"each"/... 支持，你不必使用它
// 要支持自定义任务，你只需要调用 "getCurrentSuite().task()"
export const myCustomTask = createTaskCollector(function (name, fn, timeout) {
  getCurrentSuite().task(name, {
    ...this, // 正确跟踪 "todo"/"skip" 事项
    meta: {
      customPropertyToDifferentiateTask: true,
    },
    handler: fn,
    timeout,
  })
})
```

```js [tasks.test.js]
import {
  afterAll,
  beforeAll,
  describe,
  myCustomTask
} from './custom.js'
import { gardener } from './gardener.js'

describe('take care of the garden', () => {
  beforeAll(() => {
    gardener.putWorkingClothes()
  })

  myCustomTask('weed the grass', () => {
    gardener.weedTheGrass()
  })
  myCustomTask.todo('mow the lawn', () => {
    gardener.mowerTheLawn()
  })
  myCustomTask('water flowers', () => {
    gardener.waterFlowers()
  })

  afterAll(() => {
    gardener.goHome()
  })
})
```

```bash
vitest ./garden/tasks.test.js
```
