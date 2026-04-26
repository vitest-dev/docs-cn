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
  } // 可选的测试过滤器
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

## pool

测试模块将运行的 [`pool`](/config/pool)。

::: danger
在启用 [`typecheck.enabled`](/config/typecheck#typecheck-enabled) 配置的情况下，单个测试项目中可能存在多个运行池。这意味着可能出现多个测试规范共享相同 `moduleId` 但使用不同 `pool` 的情况。请注意，后续版本将仅支持单一运行池模式。
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

用于匹配当前模块中测试名称的正则表达式。如果已设置，该值将覆盖全局 [`testNamePattern`](/config/testnamepattern) 配置。

## testIds <Version>4.1.0</Version> {#testids}

当前测试规范中需要运行的任务 ID 集合。

## testTagsFilter <Version>4.1.0</Version> {#testtagsfilter}

测试必须通过的 [标签过滤器](/guide/test-tags#syntax) 才能被纳入运行范围。多个过滤器将按 `AND` 逻辑处理。

## toJSON

```ts
function toJSON(): SerializedTestSpecification
```

`toJSON` 生成一个 JSON 友好的对象，可以被 [浏览器模式](/guide/browser/) 或 [UI 模式](/guide/ui) 消费。
