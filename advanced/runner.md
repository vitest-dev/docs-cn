# 测试运行器

::: warning 注意
这是高级 API。如果你只需要运行测试，你可能不需要这个。它主要被库的作者使用。
:::

你可以在你的配置文件中使用 runner 选项指定你的测试运行器的路径。这个文件应该有一个默认的导出，其中包含一个实现这些方法的类：

```ts
export interface VitestRunner {
  /**
   * 这是在实际收集和运行测试之前被调用的第一件事情。
   */
  onBeforeCollect?(paths: string[]): unknown
  /**
   * 这是在收集测试后、"onBeforeRun" 之前被调用的。
   */
  onCollected?(files: File[]): unknown
  /**
   * 这是在运行单个测试之前被调用的，此时还没有测试结果。
   */
  onBeforeRunTest?(test: Test): unknown
  /**
   * 这是在实际运行测试函数之前被调用的。
   * 此时已经有了带有 "state" 和 "startTime" 属性的 "result" 对象。
   */
  onBeforeTryTest?(test: Test, retryCount: number): unknown
  /**
   * 这是在结果和状态都被设置之后被调用的。
   */
  onAfterRunTest?(test: Test): unknown
  /**
   * 这是在运行测试函数后立即被调用的。此时还没有新的状态。
   * 如果测试函数抛出异常，将不会调用此方法。
   */
  onAfterTryTest?(test: Test, retryCount: number): unknown

  /**
   * 这是在运行单个测试套件之前被调用的，此时还没有测试结果。
   */
  onBeforeRunSuite?(suite: Suite): unknown
  /**
   * 这是在运行单个测试套件之后被调用的，此时已经有了状态和测试结果。
   */
  onAfterRunSuite?(suite: Suite): unknown

  /**
   * 如果定义了这个方法，它将会替代 Vitest 常规的测试套件分割和处理方式。
   * 但 "before" 和 "after" 钩子函数仍然会被执行。
   */
  runSuite?(suite: Suite): Promise<void>
  /**
   * 如果定义了这个方法，它将会替代 Vitest 常规的测试处理方式。
   * 如果你有自定义的测试函数，这个方法就很有用。
   * 但 "before" 和 "after" 钩子函数仍然会被执行。
   */
  runTest?(test: Test): Promise<void>

  /**
   * 当一个任务被更新时被调用。与报告器中的 "onTaskUpdate" 方法相同。
   * 但该方法在同一个线程中运行，与测试运行在同一个线程中。
   */
  onTaskUpdate?(task: [string, TaskResult | undefined][]): Promise<void>

  /**
   * 这是在运行收集的所有测试之前被调用的。
   */
  onBeforeRun?(files: File[]): unknown
  /**
   * 这是在运行收集的所有测试后立即被调用的。
   */
  onAfterRun?(files: File[]): unknown
  /**
   * 当为一个测试定义新的上下文时被调用。如果你想要向上下文添加自定义属性，这个方法很有用。
   * 如果你只想使用运行器定义自定义上下文，请考虑在 "setupFiles" 中使用 "beforeAll"。
   */
  extendTestContext?(context: TestContext): TestContext
  /**
   * 当导入某些文件时被调用。在收集测试和导入设置文件时都可能会被调用。.
   */
  importFile(filepath: string, source: VitestRunnerImportSource): unknown
  /**
   * 公开可用的配置.
   */
  config: VitestRunnerConfig
}
```

当初始化这个类时，Vitest会传递Vitest配置，你应该将它作为一个 `config` 属性暴露出来。

::: warning 注意
Vitest 还将 `ViteNodeRunner` 实例注入为 `__vitest_executor `属性。你可以在 `importFile` 方法中使用它来处理文件（这是 `TestRunner` 和  `BenchmarkRunner` 的默认行为）。

`ViteNodeRunner` 暴露了 `executeId` 方法，用于在适用于 Vite 的环境中导入测试文件。这意味着它将在运行时解析导入并转换文件内容，以便 Node 能够理解它。
:::

::: tip 提示
快照支持和其他功能是依赖于测试运行器的。如果你想保留这些功能，可以从 `vitest/runners` 导入 `VitestTestRunner` 并将你的测试运行器继承该类。它还暴露了 `BenchmarkNodeRunner`，如果你想扩展基准测试功能的话也可以继承它。
:::

## 你的任务函数。

你可以通过扩展 `Vitest` 的任务系统来添加你自己的任务。一个任务是一个对象，是套件的一部分。它会自动通过 `suite.custom` 方法添加到当前套件中：

```js
// ./utils/custom.js
import { getCurrentSuite, setFn } from 'vitest/suite'

export { describe, beforeAll, afterAll } from 'vitest'

// this function will be called, when Vitest collects tasks
export const myCustomTask = function (name, fn) {
  const task = getCurrentSuite().custom(name)
  task.meta = {
    customPropertyToDifferentiateTask: true
  }
  setFn(task, fn || (() => {}))
}
```

```js
// ./garden/tasks.test.js
import { afterAll, beforeAll, describe, myCustomTask } from '../utils/custom.js'
import { gardener } from './gardener.js'

describe('take care of the garden', () => {
  beforeAll(() => {
    gardener.putWorkingClothes()
  })

  myCustomTask('weed the grass', () => {
    gardener.weedTheGrass()
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

::: warning 注意
如果你没有定义自定义运行器，也没有定义 `runTest` 方法，Vitest 将会尝试自动获取任务。如果你没有使用 `setFn` 添加一个函数，这个过程会失败。
:::

::: tip 提示
自定义任务系统支持钩子和上下文。如果你想支持属性链式调用（如 `only`、`skip` 和你自己的定制属性），你可以从 `vitest/suite` 导入 `createChainable` 并用它包装你的函数。如果你决定这样做，你需要将 `custom` 作为 `custom.call(this)` 来调用。
:::
