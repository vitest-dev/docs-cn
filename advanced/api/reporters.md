# 报告器 {#reporters}

::: warning
这是一个高级 API。如果我们只想配置内置的报告器，请阅读 ["报告器"](/guide/reporters) 指南。
:::

Vitest 拥有自己的测试运行生命周期。这些生命周期通过报告器的方法来表示：

- [`onInit`](#oninit)
- [`onTestRunStart`](#ontestrunstart)
  - [`onTestModuleQueued`](#ontestmodulequeued)
  - [`onTestModuleCollected`](#ontestmodulecollected)
  - [`onTestModuleStart`](#ontestmodulestart)
    - [`onTestSuiteReady`](#ontestsuiteready)
      - [`onHookStart(beforeAll)`](#onhookstart)
      - [`onHookEnd(beforeAll)`](#onhookend)
        - [`onTestCaseReady`](#ontestcaseready)
          - [`onTestAnnotate`](#ontestannotate) <Version>3.2.0</Version>
          - [`onHookStart(beforeEach)`](#onhookstart)
          - [`onHookEnd(beforeEach)`](#onhookend)
          - [`onHookStart(afterEach)`](#onhookstart)
          - [`onHookEnd(afterEach)`](#onhookend)
        - [`onTestCaseResult`](#ontestcaseresult)
      - [`onHookStart(afterAll)`](#onhookstart)
      - [`onHookEnd(afterAll)`](#onhookend)
    - [`onTestSuiteResult`](#ontestsuiteresult)
  - [`onTestModuleEnd`](#ontestmoduleend)
  - [`onCoverage`](#oncoverage)
- [`onTestRunEnd`](#ontestrunend)

除非被跳过，否则单个模块中的测试和 reporters 将按顺序报告。所有跳过的测试将在 reporters /模块的末尾报告。

请注意，由于测试模块可以并行运行，Vitest 将并行报告它们。

本指南列出了所有支持的报告器方法。不过，别忘了，与其创建自己的 报告器 ，我们可以 [扩展现有的报告器](/advanced/reporters)：

```ts [custom-reporter.js]
import { BaseReporter } from 'vitest/reporters'

export default class CustomReporter extends BaseReporter {
  onTestRunEnd(testModules, errors) {
    console.log(testModule.length, 'tests finished running')
    super.onTestRunEnd(testModules, errors)
  }
}
```

## onInit

```ts
function onInit(vitest: Vitest): Awaitable<void>
```

当 [Vitest](/advanced/api/vitest) 初始化或启动时，但在测试被过滤之前，会调用此方法。

::: info
在内部，这个方法在 [`vitest.start`](/advanced/api/vitest#start)、[`vitest.init`](/advanced/api/vitest#init) 或 [`vitest.mergeReports`](/advanced/api/vitest#mergereports) 中调用。例如，如果我们使用 API，请确保根据我们的需要调用其中一个，然后再调用 [`vitest.runTestSpecifications`](/advanced/api/vitest#runtestspecifications)。内置的 CLI 将始终按正确的顺序运行方法。
:::

请注意，我们还可以通过 [`project`](/advanced/api/test-project) 属性从测试用例、套件和测试模块中访问 `vitest` 实例，但在此方法中存储对 `vitest` 的引用也可能有用。

::: details 示例
```ts
import type { Reporter, TestSpecification, Vitest } from 'vitest/node'

class MyReporter implements Reporter {
  private vitest!: Vitest

  onInit(vitest: Vitest) {
    this.vitest = vitest
  }

  onTestRunStart(specifications: TestSpecification[]) {
    console.log(
      specifications.length,
      'test files will run in',
      this.vitest.config.root,
    )
  }
}

export default new MyReporter()
```
:::

## onBrowserInit <Badge type="warning">实验性</Badge> {#onbrowserinit}

```ts
function onBrowserInit(project: TestProject): Awaitable<void>
```

当浏览器实例初始化时调用此方法。它接收为其初始化浏览器的项目的实例。调用此方法时，`project.browser` 将始终被定义。

## onTestRunStart

```ts
function onTestRunStart(
  specifications: TestSpecification[]
): Awaitable<void>
```

当新的测试运行开始时调用此方法。它接收计划运行的 [测试规范](/advanced/api/test-specification) 数组。此数组是只读的，仅用于信息目的。

如果 Vitest 没有找到任何要运行的测试文件，此事件将以空数组调用，然后 [`onTestRunEnd`](#ontestrunend) 将立即被调用。

::: details 示例
```ts
import type { Reporter, TestSpecification } from 'vitest/node'

class MyReporter implements Reporter {
  onTestRunStart(specifications: TestSpecification[]) {
    console.log(specifications.length, 'test files will run')
  }
}

export default new MyReporter()
```
:::

::: tip 弃用通知
此方法在 Vitest 3 中添加，取代了 `onPathsCollected` 和 `onSpecsCollected`，这两个方法现在已被弃用。
:::

## onTestRunEnd

```ts
function onTestRunEnd(
  testModules: ReadonlyArray<TestModule>,
  unhandledErrors: ReadonlyArray<SerializedError>,
  reason: TestRunEndReason
): Awaitable<void>
```

当所有测试完成运行并且覆盖率合并了所有报告（如果启用）时调用此方法。请注意，我们可以在 [`onCoverage`](#oncoverage) 钩子中获取覆盖率信息。

它接收一个只读的测试模块列表。我们可以通过 [`testModule.children`](/advanced/api/test-collection) 属性遍历它以报告状态和错误（如果有）。

第二个参数是 Vitest 无法归因于任何测试的未处理错误的只读列表。这些错误可能发生在测试运行之外，例如插件中的错误，或者在测试运行中作为未等待函数的副作用（例如，在测试完成后抛出错误的超时）。

第三个参数指示测试运行结束的原因：

- `passed`: 测试运行正常结束，没有错误
- `failed`: 测试运行至少有一个错误（由于收集期间的语法错误或测试执行期间的实际错误）
- `interrupted`: 测试被 [`vitest.cancelCurrentRun`](/advanced/api/vitest#cancelcurrentrun) 调用或在终端中按下 `Ctrl+C` 中断（请注意，在这种情况下仍然有可能导致测试失败）

如果 Vitest 没有找到任何要运行的测试文件，此事件将以空的模块和错误数组调用，状态将取决于 [`config.passWithNoTests`](/config/#passwithnotests) 的值。

::: details 示例
```ts
import type {
  Reporter,
  SerializedError,
  TestModule,
  TestRunEndReason,
  TestSpecification
} from 'vitest/node'

class MyReporter implements Reporter {
  onTestRunEnd(
    testModules: ReadonlyArray<TestModule>,
    unhandledErrors: ReadonlyArray<SerializedError>,
    reason: TestRunEndReason,
  ) {
    if (reason === 'passed') {
      testModules.forEach(module => console.log(module.moduleId, 'succeeded'))
    }
    else if (reason === 'failed') {
      // 注意，这将跳过套件中可能的错误
      // 我们可以从 testSuite.errors() 中获取它们
      for (const testCase of testModules.children.allTests()) {
        if (testCase.result().state === 'failed') {
          console.log(testCase.fullName, 'in', testCase.module.moduleId, 'failed')
          console.log(testCase.result().errors)
        }
      }
    }
    else {
      console.log('test run was interrupted, skipping report')
    }
  }
}

export default new MyReporter()
```
:::

::: tip 弃用通知
此方法在 Vitest 3 中添加，取代了 `onFinished`，后者现在已被弃用。
:::

## onCoverage

```ts
function onCoverage(coverage: unknown): Awaitable<void>
```

当覆盖率结果处理完毕后调用此钩子。覆盖率提供者的报告器在此钩子之后调用。`coverage` 的类型取决于 `coverage.provider`。对于 Vitest 的默认内置提供者，我们可以从 `istanbul-lib-coverage` 包中导入类型：

```ts
import type { CoverageMap } from 'istanbul-lib-coverage'

declare function onCoverage(coverage: CoverageMap): Awaitable<void>
```

如果 Vitest 没有执行任何覆盖率，则不会调用此钩子。

## onTestModuleQueued

```ts
function onTestModuleQueued(testModule: TestModule): Awaitable<void>
```

在 Vitest 导入设置文件和测试模块本身之前调用此方法。这意味着 `testModule` 还没有 [`children`](/advanced/api/test-suite#children)，但我们可以开始将其报告为下一个要运行的测试。

## onTestModuleCollected

```ts
function onTestModuleCollected(testModule: TestModule): Awaitable<void>
```

当文件中的所有测试都被收集时调用此方法，这意味着 [`testModule.children`](/advanced/api/test-suite#children) 集合已填充，但测试还没有任何结果。

## onTestModuleStart

```ts
function onTestModuleStart(testModule: TestModule): Awaitable<void>
```

在 [`onTestModuleCollected`](#ontestmodulecollected) 之后立即调用此方法，除非 Vitest 在收集模式下运行（[`vitest.collect()`](/advanced/api/vitest#collect) 或 CLI 中的 `vitest collect`），在这种情况下，根本不会调用它，因为没有要运行的测试。

## onTestModuleEnd

```ts
function onTestModuleEnd(testModule: TestModule): Awaitable<void>
```

当模块中的每个测试完成运行时调用此方法。这意味着 [`testModule.children`](/advanced/api/test-suite#children) 中的每个测试都将有一个不等于 `pending` 的 `test.result()`。

## onHookStart

```ts
function onHookStart(context: ReportedHookContext): Awaitable<void>
```

当以下任何钩子开始运行时调用此方法：

- `beforeAll`
- `afterAll`
- `beforeEach`
- `afterEach`

如果 `beforeAll` 或 `afterAll` 开始，`entity` 将是 [`TestSuite`](/advanced/api/test-suite) 或 [`TestModule`](/advanced/api/test-module)。

如果 `beforeEach` 或 `afterEach` 开始，`entity` 将始终是 [`TestCase`](/advanced/api/test-case)。

::: warning
如果钩子在测试运行期间没有运行，则不会调用 `onHookStart` 方法。
:::

## onHookEnd

```ts
function onHookEnd(context: ReportedHookContext): Awaitable<void>
```

当以下任何钩子完成运行时调用此方法：

- `beforeAll`
- `afterAll`
- `beforeEach`
- `afterEach`

如果 `beforeAll` 或 `afterAll` 完成，`entity` 将是 [`TestSuite`](/advanced/api/test-suite) 或 [`TestModule`](/advanced/api/test-module)。

如果 `beforeEach` 或 `afterEach` 完成，`entity` 将始终是 [`TestCase`](/advanced/api/test-case)。

::: warning
如果钩子在测试运行期间没有运行，则不会调用 `onHookEnd` 方法。
:::

## onTestSuiteReady

```ts
function onTestSuiteReady(testSuite: TestSuite): Awaitable<void>
```

在套件开始运行其测试之前调用此方法。如果套件被跳过，也会调用此方法。

如果文件没有任何套件，则不会调用此方法。考虑使用 `onTestModuleStart` 来覆盖此用例。

## onTestSuiteResult

```ts
function onTestSuiteResult(testSuite: TestSuite): Awaitable<void>
```

在套件完成运行测试后调用此方法。如果套件被跳过，也会调用此方法。

如果文件没有任何套件，则不会调用此方法。考虑使用 `onTestModuleEnd` 来覆盖此用例。

## onTestCaseReady

```ts
function onTestCaseReady(testCase: TestCase): Awaitable<void>
```

在测试开始运行或被跳过之前调用此方法。请注意，`beforeEach` 和 `afterEach` 钩子被视为测试的一部分，因为它们可能会影响结果。

::: warning
请注意，当调用 `onTestCaseReady` 时，[`testCase.result()`](/advanced/api/test-case#result) 可能已经具有 `passed` 或 `failed` 状态。如果测试运行得太快，并且 `onTestCaseReady` 和 `onTestCaseResult` 被安排在同一微任务中运行，则可能发生这种情况。
:::

## onTestCaseResult

```ts
function onTestCaseResult(testCase: TestCase): Awaitable<void>
```

当测试完成运行或刚刚被跳过时调用此方法。请注意，如果有 `afterEach` 钩子，这将在 `afterEach` 钩子完成后调用。

此时，[`testCase.result()`](/advanced/api/test-case#result) 已不再是挂起状态。

## onTestAnnotate <Version>3.2.0</Version> {#ontestannotate}

```ts
function onTestAnnotate(
  testCase: TestCase,
  annotation: TestAnnotation,
): Awaitable<void>
```

onTestAnnotate 是与 [`context.annotate`](/guide/test-context#annotate) 方法配套使用的钩子。当你在测试中调用 annotate 后， Vitest 会将注解内容序列化，并将其发送到主线程，从而让报告器可以处理这些附加信息。

如果在注解中指定了文件路径， Vitest 会将附件保存到一个独立的目录（该目录通过 [`attachmentsDir`](/config/#attachmentsdir) 配置），并自动更新 path 属性，使其指向存储后的文件位置。
