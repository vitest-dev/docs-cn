---
title: 快照测试 | 指南
prev:
  text: 模拟函数
  link: /guide/learn/mock-functions
next:
  text: 测试实操
  link: /guide/learn/testing-in-practice
---

# 快照测试 {#snapshot-testing}

快照测试会捕获一段代码的输出并将其保存到文件中。在后续运行时，将输出结果与已保存的快照进行比较。如果输出发生变化，测试就会失败。这种变化可能是 bug，也可能是快照需要更新。

这种方法在测试产生结构化输出的场景中适用于以下场景：例如返回复杂对象的函数、渲染 HTML 的组件，或是生成多行消息的错误格式化器。为每个字段或每行代码手动编写断言既繁琐又脆弱。相反，你可以一次性捕获整个输出，然后由 Vitest 来告诉你输出是否发生了变化。

## 你的第一个快照 {#your-first-snapshot}

要创建快照测试，只需将值传递给 [`toMatchSnapshot()`](/api/expect#tomatchsnapshot) 方法即可：

```js
import { expect, test } from 'vitest'

function generateGreeting(name) {
  return {
    message: `Hello, ${name}!`,
    timestamp: null,
    version: 2,
  }
}

test('generates a greeting', () => {
  expect(generateGreeting('Alice')).toMatchSnapshot()
})
```

首次运行此测试时，由于不存在可比较的现有快照，Vitest 会自动创建一个。它会将快照存储在与测试文件相邻的 `__snapshots__` 目录中：

```
__snapshots__/
  example.test.js.snap
```

如果打开该文件，你会看到该值的序列化表示：

```js
exports['generates a greeting 1'] = `
{
  "message": "Hello, Alice!",
  "timestamp": null,
  "version": 2,
}
`
```

从此以后，每次运行此测试时，Vitest 都会将 `generateGreeting('Alice')` 的输出序列化，并与存储的快照进行逐字符比较。如果输出发生变化（比如有人修改了消息格式或更新了版本号），测试就会失败，并清晰地显示变更的差异。

::: tip
请将快照文件提交到版本控制系统。它们作为预期输出的记录，应该像其他测试断言一样在代码审查中进行检查。
:::

## 内联快照 {#inline-snapshots}

外部快照文件虽然好用，但意味着你必须跳转到另一个文件才能查看预期输出的实际内容。对于较小的值，使用 [`toMatchInlineSnapshot()`](/api/expect#tomatchinlinesnapshot) 将快照直接保留在测试文件中通常更为方便。

首先，在没有任何参数的情况下编写断言：

```js
test('generates a greeting', () => {
  expect(generateGreeting('Alice')).toMatchInlineSnapshot()
})
```

当你运行测试时，Vitest 将 **自动填充** 快照作为字符串参数：

```js
test('generates a greeting', () => {
  expect(generateGreeting('Alice')).toMatchInlineSnapshot(`
    {
      "message": "Hello, Alice!",
      "timestamp": null,
      "version": 2,
    }
  `)
})
```

现在，预期输出就紧挨着生成它的代码。你可以阅读测试并立即理解 `generateGreeting` 应该返回什么。当输出发生变化时，Vitest 会原地更新字符串，因此你无需管理单独的快照文件。

内联快照非常适合小型、聚焦值。对于大型输出（如完整的 HTML 页面），外部快照或文件快照更为合适。

::: tip
与外部快照不同，内联快照不会创建单独的 `.snap` 文件。预期值直接作为 `toMatchInlineSnapshot()` 的参数存储在测试文件中，因此无需额外提交任何内容。
:::

## 更新快照 {#updating-snapshots}

当你故意更改代码的输出时，现有的快照将过时，测试也会失败。这是设计使然；这正是快照测试的全部意义所在。但一旦你确认新输出是正确的，就需要更新快照。

有几种方法可以做到这一点：

- **在 watch 模式下**：在终端中按 `u` 键更新所有失败的快照
- **通过命令行界面**：运行 `vitest -u` 或 `vitest --update` 来更新快照并退出
- **在 VS Code 中**：使用 [Vitest 插件](https://vitest.dev/vscode) 在测试面板上选择 “更新快照” 命令

```bash
vitest -u
```

对于内联快照，Vitest 会直接用新值直接修改你的测试文件。对于外部快照，它会重写 `.snap` 文件。

::: warning
更新快照时要小心。务必仔细检查差异，以确认更改是有意为之，而非缺陷。盲目按 `u` 键很容易意外接受一个错误的输出。
:::

## 文件快照 {#file-snapshots}

有时你测试的输出非常大，以至于即使是外部的 `.snap` 文件也显得笨拙，或者你希望在编辑器中以正确的语法高亮查看快照。[`toMatchFileSnapshot()`](/api/expect#tomatchfilesnapshot) 允许你将快照保存为任意扩展名的文件：

```js
test('renders the component', async () => {
  const html = renderComponent()
  await expect(html).toMatchFileSnapshot('./fixtures/component.html')
})
```

快照以普通的 `.html` 文件形式存储，你可以用浏览器打开、以语法高亮查看，或用标准工具进行差异对比。这对于 HTML、SVG、CSS、生成的代码或任何文件格式对可读性很重要的输出都非常有效。

## 何时使用快照 {#when-to-use-snapshots}

当你处理结构化、可序列化的输出，并且手动断言会非常痛苦时，快照测试就可以大放异彩。一些常见的用例包括：

- 返回具有许多嵌套字段的复杂配置对象的函数
- 由渲染函数或模板引擎生成的 HTML 或标记
- 包含格式化堆栈跟踪或上下文信息的错误消息
- 具有特定格式的 CLI 输出或日志消息
- JSON API 响应，你希望捕获所有意外的字段更改

另一方面，快照并不总是最佳工具。如果输出频繁变化（例如，包含时间戳或随机 ID），你花在更新快照上的时间将比它们为你节省的时间更多。如果你只关心一两个特定字段，像 [`toMatchObject`](/api/expect#tomatchobject) 或 [`toHaveProperty`](/api/expect#tohaveproperty) 这样的针对性断言，比捕获所有内容的快照更能清晰地表达你的意图。

一般的规则是：当你希望防止输出发生 **任何** 变化时，使用快照；当你只关心 **特定** 属性时，使用针对性断言。

## 处理动态值 {#handling-dynamic-values}

如果你的输出包含每次运行都会变化的值（如时间戳或 ID），你可以使用属性匹配器来固定结构，同时忽略易变字段。将一个包含非对称匹配器的对象作为第一个参数传递给 `toMatchSnapshot()` 或 `toMatchInlineSnapshot()`：

```js
test('user snapshot with dynamic fields', () => {
  const user = createUser('Alice')

  expect(user).toMatchSnapshot({
    id: expect.any(Number),
    createdAt: expect.any(Date),
  })
})
```

`id` 和 `createdAt` 字段将根据匹配器（任意数字、任意日期）进行检查，而不是与存储的值进行比较。其他字段则像往常一样进行快照对比。

## 错误快照 {#error-snapshots}

内联快照的一个常见用法是捕获错误消息。[`toThrowErrorMatchingInlineSnapshot`](/api/expect#tothrowerrormatchinginlinesnapshot) 将 `toThrow` 与 `toMatchInlineSnapshot` 结合，这样你就可以在不使用单独 `.snap` 文件的情况下对错误消息进行快照：

```js
test('throws on invalid input', () => {
  expect(() => parse('')).toThrowErrorMatchingInlineSnapshot(
    `[Error: Unexpected end of input at position 0]`
  )
})
```

这对于验证错误消息是否清晰且不会意外更改非常方便。与其他内联快照一样，Vitest 在首次运行时填充字符串，并在你按下 `u` 时更新它。

::: tip
关于自定义快照序列化器、快照匹配器和高级配置，请参阅 [快照](/guide/snapshot)。
:::
