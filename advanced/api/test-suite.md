# TestSuite

`TestSuite` 类表示一个单一的套件。此类仅在主线程中可用。如果你正在处理运行时任务，请参阅 [“Runner API”](/advanced/runner#tasks)。

`TestSuite` 实例始终具有一个 `type` 属性，其值为 `suite`。你可以使用它来区分不同的任务类型：

```ts
if (task.type === 'suite') {
  task // TestSuite
}
```

## project

这引用了测试所属的 [`TestProject`](/advanced/api/test-project)。

## module

这是对定义测试的 [`TestModule`](/advanced/api/test-module) 的直接引用。

## name

这是传递给 `describe` 函数的套件名称。

```ts
import { describe } from 'vitest'

// [!code word:'the validation logic']
describe('the validation logic', () => {
  // ...
})
```

## fullName

包括所有父级套件名称并用 `>` 符号分隔的套件名称。此套件的完整名称为 "the validation logic > validating cities"：

```ts
import { describe, test } from 'vitest'

// [!code word:'the validation logic']
// [!code word:'validating cities']
describe('the validation logic', () => {
  describe('validating cities', () => {
    // ...
  })
})
```

## id

这是套件的唯一标识符。此 ID 是确定性的，在多次运行中相同的套件将具有相同的 ID。ID 基于 [项目](/advanced/api/test-project) 名称、模块 ID 和套件顺序。

ID 的格式如下：

```
1223128da3_0_0_0
^^^^^^^^^^ the file hash
           ^ suite index
             ^ nested suite index
               ^ test index
```

::: tip
你可以使用 `vitest/node` 中的 `generateFileHash` 函数生成文件哈希，该函数自 Vitest 3 起可用：

```ts
import { generateFileHash } from 'vitest/node'

const hash = generateFileHash(
  '/file/path.js', // relative path
  undefined // the project name or `undefined` is not set
)
```

:::

::: danger
不要尝试解析 ID。它可能以减号开头，例如：`-1223128da3_0_0_0`。
:::

## location

套件在模块中定义的位置。仅当配置中启用了 [`includeTaskLocation`](/config/#includetasklocation) 时才会收集位置信息。请注意，如果使用了 `--reporter=html`、`--ui` 或 `--browser` 标志，此选项会自动启用。

此套件的位置将等于 `{ line: 3, column: 1 }`：

```ts:line-numbers {3}
import { describe } from 'vitest'

describe('the validation works correctly', () => {
  // ...
})
```

## parent

父级套件。如果套件是在 [模块](/advanced/api/test-module) 内直接调用的，则父级将是模块本身。

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

收集套件时使用的选项。

## children

这是当前套件内所有套件和测试的 [集合](/advanced/api/test-collection)。

```ts
for (const task of suite.children) {
  if (task.type === 'test') {
    console.log('test', task.fullName)
  }
  else {
    // task is TaskSuite
    console.log('suite', task.name)
  }
}
```

::: warning
请注意，`suite.children` 只会遍历第一层嵌套，不会深入嵌套层次。如果我们需要遍历所有测试或套件，请使用 [`children.allTests()`](/advanced/api/test-collection#alltests) 或 [`children.allSuites()`](/advanced/api/test-collection#allsuites)。如果我们需要遍历所有内容，请使用递归函数。

```ts
function visit(collection: TestCollection) {
  for (const task of collection) {
    if (task.type === 'suite') {
      // report a suite
      visit(task.children)
    }
    else {
      // report a test
    }
  }
}
```

:::

## ok

```ts
function ok(): boolean
```

检查套件中是否有任何失败的测试。如果套件在收集过程中失败，这也将返回 `false`。在这种情况下，请检查 [`errors()`](#errors) 以获取抛出的错误。

## state

```ts
function state(): TestSuiteState
```

检查套件的运行状态。可能的返回值包括：

- **pending**：此套件中的测试尚未完成运行。
- **failed**：此套件中有失败的测试或无法收集测试。如果 [`errors()`](#errors) 不为空，则表示套件未能收集测试。
- **passed**：此套件中的每个测试均已通过。
- **skipped**：此套件在收集过程中被跳过。

::: warning
请注意，[测试模块](/advanced/api/test-module) 也有一个 `state` 方法，返回相同的值，但如果模块尚未执行，它还可以返回一个额外的 `queued` 状态。
:::

## errors

```ts
function errors(): TestError[]
```

在收集过程中发生的、测试运行之外的错误，例如语法错误。

```ts {4}
import { describe } from 'vitest'

describe('collection failed', () => {
  throw new Error('a custom error')
})
```

::: warning
请注意，错误会被序列化为简单对象：`instanceof Error` 将始终返回 `false`。
:::

## meta <Version>3.1.0</Version> {#meta}

```ts
function meta(): TaskMeta
```

在执行或收集过程中附加到套件的自定义[元数据](/advanced/metadata)。在测试运行期间，可以通过向 `task.meta` 对象分配属性来附加 meta：

```ts {5,10}
import { test } from 'vitest'

describe('the validation works correctly', (task) => {
  // assign "decorated" during collection
  task.meta.decorated = false

  test('some test', ({ task }) => {
    // assign "decorated" during test run, it will be available
    // only in onTestCaseReady hook
    task.suite.meta.decorated = false
  })
})
```

:::tip
If metadata was attached during collection (outside of the `test` function), then it will be available in [`onTestModuleCollected`](./reporters#ontestmodulecollected) hook in the custom reporter.
:::

## meta <Version>3.1.0</Version> {#meta}

```ts
function meta(): TaskMeta
```

Custom [metadata](/advanced/metadata) that was attached to the suite during its execution or collection. The meta can be attached by assigning a property to the `task.meta` object during a test run:

```ts {5,10}
import { test } from 'vitest'

describe('the validation works correctly', (task) => {
  // assign "decorated" during collection
  task.meta.decorated = false

  test('some test', ({ task }) => {
    // assign "decorated" during test run, it will be available
    // only in onTestCaseReady hook
    task.suite.meta.decorated = false
  })
})
```

:::tip
If metadata was attached during collection (outside of the `test` function), then it will be available in [`onTestModuleCollected`](./reporters#ontestmodulecollected) hook in the custom reporter.
:::
