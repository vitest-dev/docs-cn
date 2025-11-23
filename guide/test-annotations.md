---
title: 测试注释 | 指南
outline: deep
---

# 测试注释 {#test-annotations}

Vitest 支持通过 [`context.annotate`](/guide/test-context#annotate) API 为测试添加自定义消息和文件注释，这些测试注释将附加到测试用例上，并通过  [`onTestAnnotate`](/advanced/api/reporters#ontestannotate) 钩子传递给报告器。

```ts
test('hello world', async ({ annotate }) => {
  await annotate('this is my test')

  if (condition) {
    await annotate('this should\'ve errored', 'error')
  }

  const file = createTestSpecificFile()
  await annotate('creates a file', { body: file })
})
```

::: warning
`annotate` 函数返回一个 Promise，因此如果依赖它就需要使用 await。不过 Vitest 也会在测试完成前自动等待所有未 await 的测试注释。
:::

根据使用的报告器不同，这些测试注释的显示方式也会有所差异。

## 内置报告器 {#built-in-reporters}
### default

`默认报告器` 仅在测试失败时打印注解：

```
  ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

  FAIL  example.test.js > an example of a test with annotation
Error: thrown error
  ❯ example.test.js:11:21
      9 |    await annotate('annotation 1')
      10|    await annotate('annotation 2', 'warning')
      11|    throw new Error('thrown error')
        |          ^
      12|  })

  ❯ example.test.js:9:15 notice
    ↳ annotation 1
  ❯ example.test.js:10:15 warning
    ↳ annotation 2

  ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
```

### verbose

`verbose` 报告器是唯一会在测试未失败时报告测试注释的终端报告器。

```
✓ example.test.js > an example of a test with annotation

  ❯ example.test.js:9:15 notice
    ↳ annotation 1
  ❯ example.test.js:10:15 warning
    ↳ annotation 2

```

### html

HTML 报告器会以与 UI模式 相同的方式显示测试注释。您可以在调用那行看到测试注释。目前，如果测试文件中没有调用测试注释，您将无法在 UI模式 中看到它。我们计划支持一个单独的测试摘要视图，届时这些测试注释将会显示。

<img alt="Vitest UI" img-light src="/annotations-html-light.png">
<img alt="Vitest UI" img-dark src="/annotations-html-dark.png">

### junit

`junit` 报告器会将测试注释列在测试用例的 `properties` 标签内。JUnit 报告器会忽略所有附件，仅打印类型和消息。

```xml
<testcase classname="basic/example.test.js" name="an example of a test with annotation" time="0.14315">
    <properties>
        <property name="notice" value="the message of the annotation">
        </property>
    </properties>
</testcase>
```

### github-actions

`github-actions` 报告器默认会将 [通知消息](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#setting-a-notice-message) 为通知消息打印。 你可以通过第二个参数配置消息的 `type` 为 `notice`, `warning` or `error`。 如果不是这三种类型，Vitest 默认使用消息类型 (notice)。

<img alt="GitHub Actions" img-light src="/annotations-gha-light.png">
<img alt="GitHub Actions" img-dark src="/annotations-gha-dark.png">

### tap

`tap` 和 `tap-flat` 报告器会将注释作为诊断信息打印在新的一行上，并以 #符号开头。它们会忽略所有附件，仅打印类型和消息：

```
ok 1 - an example of a test with annotation # time=143.15ms
    # notice: the message of the annotation
```
