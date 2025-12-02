# TestCase

`TestCase` 类表示单个测试。此类仅在主线程中可用。如果您正在处理运行时任务，请参阅 [“运行器 API”](/advanced/runner#tasks)。

`TestCase` 实例始终有一个值为 `test` 的 `type` 属性。您可以使用它来区分不同的任务类型：

```ts
if (task.type === 'test') {
  task // TestCase
}
```

## project

这引用了测试所属的 [`TestProject`](/advanced/api/test-project)。

## module

这是对定义测试的 [`TestModule`](/advanced/api/test-module) 的直接引用。

## name

这是传递给 `test` 函数的测试名称。

```ts
import { test } from 'vitest'

// [!code word:'the validation works correctly']
test('the validation works correctly', () => {
  // ...
})
```

## fullName

包括所有父套件并用 `>` 符号分隔的测试名称。此测试的完整名称为 "the validation logic > the validation works correctly"：

```ts
import { describe, test } from 'vitest'

// [!code word:'the validation works correctly']
// [!code word:'the validation logic']
describe('the validation logic', () => {
  test('the validation works correctly', () => {
    // ...
  })
})
```

## id

这是测试的唯一标识符。此 ID 是确定性的，在多次运行中相同的测试将具有相同的 ID。ID 基于 [project](/advanced/api/test-project) 名称、模块 ID 和测试顺序。

ID 的格式如下：

```
1223128da3_0_0
^^^^^^^^^^ the file hash
           ^ suite index
             ^ test index
```

::: tip
你可以使用 `vitest/node` 中的 `generateFileHash` 函数来生成文件哈希，该函数自 Vitest 3 起可用：

```ts
import { generateFileHash } from 'vitest/node'

const hash = generateFileHash(
  '/file/path.js', // 相对路径
  undefined // 未设置项目名称或 `undefined`
)
```

:::

::: danger
不要尝试解析 ID。它可能以连字符开头，例如：`-1223128da3_0_0_0`。
:::

## location

测试在模块中定义的位置。只有在配置中启用了 [`includeTaskLocation`](/config/#includetasklocation) 时才会收集位置信息。请注意，如果使用了 `--reporter=html`、`--ui` 或 `--browser` 参数，此选项会自动启用。

此测试的位置将等于 `{ line: 3, column: 1 }`：

```ts:line-numbers {3}
import { test } from 'vitest'

test('the validation works correctly', () => {
  // ...
})
```

## parent

父级 [suite](/advanced/api/test-suite)。如果测试是直接在 [模块](/advanced/api/test-module) 内调用的，则父级将是模块本身。

## options

```ts
interface TaskOptions {
  readonly each: boolean | undefined
  readonly fails: boolean | undefined
  readonly concurrent: boolean | undefined
  readonly shuffle: boolean | undefined
  readonly retry: number | undefined
  readonly repeats: number | undefined
  readonly mode: 'run' | 'only' | 'skip' | 'todo'
}
```

收集测试时使用的选项。

## ok

```ts
function ok(): boolean
```

检查测试是否未使套件失败。如果测试尚未完成或被跳过，它将返回 `true`。

## meta

```ts
function meta(): TaskMeta
```

在测试执行期间附加到测试上的自定义[元数据](/advanced/metadata)。我们可以在测试运行期间通过给 `ctx.task.meta` 对象分配属性来附加元数据。

```ts {3,6}
import { test } from 'vitest'

test('the validation works correctly', ({ task }) => {
  // ...

  task.meta.decorated = false
})
```

如果测试尚未完成运行，元数据将是一个空对象。

## result

```ts
function result(): TestResult
```

测试结果。如果测试尚未完成或刚刚开始收集，等于 `TestResultPending` ：

```ts
export interface TestResultPending {
  /**
   * 测试已收集，但尚未完成运行。
   */
  readonly state: 'pending'
  /**
   * 待定测试没有错误。
   */
  readonly errors: undefined
}
```

如果测试被跳过，返回值将是 `TestResultSkipped`：

```ts
interface TestResultSkipped {
  /**
   * 使用 `skip` 或 `todo` 标志跳过测试。
   * 你可以在 `options.mode` 选项中查看使用的是哪种模式。
   */
  readonly state: 'skipped'
  /**
   * 跳过的测试没有错误。
   */
  readonly errors: undefined
  /**
   * 传给 `ctx.skip(note)` 的自定义注释。
   */
  readonly note: string | undefined
}
```

::: tip
如果测试因为其他测试有 `only` 标志而被跳过，则 `options.mode` 将等于 `skip`。
:::

如果测试失败，返回值将是 `TestResultFailed`：

```ts
interface TestResultFailed {
  /**
   * 测试执行失败。
   */
  readonly state: 'failed'
  /**
   * 测试执行过程中出现的错误。
   */
  readonly errors: ReadonlyArray<TestError>
}
```

如果测试通过，返回值将是 `TestResultPassed`：

```ts
interface TestResultPassed {
  /**
   * 测试成功通过。
   */
  readonly state: 'passed'
  /**
   * 测试执行过程中出现的错误。
   */
  readonly errors: ReadonlyArray<TestError> | undefined
}
```

::: warning
请注意，状态为 `passed` 的测试仍可能附带有错误——如果 `retry` 至少触发了一次，这种情况就可能发生。
:::

## diagnostic

```ts
function diagnostic(): TestDiagnostic | undefined
```

有关测试的有用信息，例如持续时间、内存使用等：

```ts
interface TestDiagnostic {
  /**
   * 如果测试持续时间超过 `slowTestThreshold`。
   */
  readonly slow: boolean
  /**
   * 测试使用的内存量（字节）。
   * 只有使用 `logHeapUsage` 标志执行测试时，该值才可用。
   */
  readonly heap: number | undefined
  /**
   * 执行测试所需的时间（毫秒）。
   */
  readonly duration: number
  /**
   * 测试开始的时间（毫秒）。
   */
  readonly startTime: number
  /**
   * 测试重试的次数。
   */
  readonly retryCount: number
  /**
   * 重复测试的次数，由 `repeats` 选项设置。
   * 如果测试在重复过程中失败，且未配置 `retry`，则该值可以更小。
   */
  readonly repeatCount: number
  /**
   * 如果第二次重试时测试通过。
   */
  readonly flaky: boolean
}
```

::: info
如果测试尚未被安排运行，`diagnostic()` 将返回 `undefined`。
:::
