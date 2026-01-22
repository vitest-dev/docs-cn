# TestSpecification

`TestSpecification` 类描述了要作为测试运行的模块及其参数。

你只能通过在测试项目上调用 [`createSpecification`](/api/advanced/test-project#createspecification) 方法来创建规范：

```ts
const specification = project.createSpecification(
  resolve('./example.test.ts'),
  {
    testLines: [20, 40],
    testNamePattern: /hello world/,
    testIds: ['1223128da3_0_0_0', '1223128da3_0_0'],
    testTagsFilter: ['frontend and backend'],
  } // optional test filters
)
```

`createSpecification` 期望一个已解析的模块 ID。它不会自动解析文件或检查文件是否存在于文件系统中。

## taskId

[测试模块](/api/advanced/test-suite#id) 的标识符。

## project

这引用了测试模块所属的 [`TestProject`](/api/advanced/test-project)。

## moduleId

Vite 模块图中的模块 ID。通常，它是一个使用 POSIX 分隔符的绝对文件路径：

```ts
'C:/Users/Documents/project/example.test.ts' // ✅
'/Users/mac/project/example.test.ts' // ✅
'C:\\Users\\Documents\\project\\example.test.ts' // ❌
```

## testModule

与规范相关联的 [`TestModule`](/api/advanced/test-module) 实例。如果测试还未加入队列，则将是 `undefined`。

## pool <Badge type="warning">experimental</Badge> {#pool}

测试模块将运行的 [`pool`](/config/#pool)。

<!-- TODO: translation -->

::: danger
It's possible to have multiple pools in a single test project with [`typecheck.enabled`](/config/#typecheck-enabled). This means it's possible to have several specifications with the same `moduleId` but different `pool`. In later versions, the project will only support a single pool.
:::

## testLines

这是源代码中定义测试文件的行号数组。此字段仅在 `createSpecification` 方法接收数组时定义。

请注意，如果这些行中的至少一行没有测试，整个测试套件将会失败。以下是一个正确的 `testLines` 配置示例：

::: code-group
```ts [script.js]
const specification = project.createSpecification(
  resolve('./example.test.ts'),
  [3, 8, 9],
)
```
```ts:line-numbers{3,8,9} [example.test.js]
import { test, describe } from 'vitest'

test('verification works')

describe('a group of tests', () => { // [!code error]
  // ...

  test('nested test')
  test.skip('skipped test')
})
```
:::

## testNamePattern <Version>4.1.0</Version> {#testnamepattern}

A regexp that matches the name of the test in this module. This value will override the global [`testNamePattern`](/config/testnamepattern) option if it's set.

## testIds <Version>4.1.0</Version> {#testids}

The ids of tasks inside of this specification to run.

## testTagsFilter <Version>4.1.0</Version> {#testtagsfilter}

The [tags filter](/guide/test-tags#syntax) that a test must pass in order to be included in the run. Multiple filters are treated as `AND`.

## toJSON

```ts
function toJSON(): SerializedTestSpecification
```

`toJSON` 生成一个 JSON 友好的对象，可以被 [浏览器模式](/guide/browser/) 或 [UI 模式](/guide/ui) 消费。
