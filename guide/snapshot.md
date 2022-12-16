---
title: Snapshot | Guide
---

# 测试快照

<<<<<<< HEAD
当你希望确保函数的输出不会意外更改时，快照测试是一个非常有用的工具。
=======
<CourseLink href="https://vueschool.io/lessons/snapshots-in-vitest?friend=vueuse">Learn Snapshot by video from Vue School</CourseLink>

Snapshot tests are a very useful tool whenever you want to make sure the output of your functions does not change unexpectedly.
>>>>>>> 2c0f05c349a400147e5dadbfb1c7fc932236567c

使用快照时，Vitest 将获取给定值的快照，将其比较时将参考存储在测试旁边的快照文件。如果两个快照不匹配，则测试将失败：要么更改是意外的，要么参考快照需要更新到测试结果的新版本。

## 使用快照

要将一个值快照，你可以使用 `expect()` 的 [`toMatchSnapshot()`](/api/#tomatchsnapshot) API:

```ts
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchSnapshot()
})
```

此测试在第一次运行时，Vitest 会创建一个快照文件，如下所示：

```js
// Vitest Snapshot v1

exports['toUpperCase 1'] = '"FOOBAR"'
```

快照文件应该与代码更改一起提交，并作为代码审查过程的一部分进行审查。在随后的测试运行中，Vitest 会将执行的输出与之前的快照进行比较。如果他们匹配，测试就会通过。如果它们不匹配，要么测试运行时在你的代码中发现了应该修复的错误，要么实现已经更改，需要更新快照。

## 内联快照

如同前文，你可以使用 [`toMatchInlineSnapshot()`](/api/#tomatchinlinesnapshot) 将内联快照存储在测试文件中。

```ts
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchInlineSnapshot()
})
```

Vitest 将修改测试文件目录，以将快照更新为字符串，而不是创建快照文件：

```ts
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchInlineSnapshot('"FOOBAR"')
})
```

这允许你直接查看期望输出，而无需跨不同的文件跳转。

## 更新快照

当接收到的值与快照不匹配时，测试将失败，并显示它们之间的差异。当需要更改快照时，你可能希望从当前状态更新快照。

在监听(watch)模式下, 你可以在终端中键入 `u` 键直接更新失败的快照。

或者，你可以在 CLI 中使用 `--update` 或 `-u` 标记使 Vitest 进入快照更新模式。

```bash
vitest -u
```

## 图像快照

快照图像也可以使用 [`jest-image-snapshot`](https://github.com/americanexpress/jest-image-snapshot)。

```bash
npm i -D jest-image-snapshot
```

```ts
test('image snapshot', () => {
  expect(readFileSync('./test/stubs/input-image.png'))
    .toMatchImageSnapshot()
})
```

你可以在 [`examples/image-snapshot`](https://github.com/vitest-dev/vitest/blob/main/examples/image-snapshot) 中学习更多案例。

## 自定义序列化程序

你可以添加自己的逻辑来修改快照的序列化方式。像 Jest 一样，Vitest 为内置的 JavaScript 类型、HTML 元素、ImmutableJS 和 React 元素提供了默认的序列化程序。

序列化模块示例：

```ts
expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` is a function that serializes a value using existing plugins.
    return `Pretty foo: ${printer(val.foo)}`
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, 'foo')
  },
})
```

如下所示的测试添加后：

```ts
test('foo snapshot test', () => {
  const bar = {
    foo: {
      x: 1,
      y: 2,
    },
  }

  expect(bar).toMatchSnapshot()
})
```

你将获得以下快照：

```
Pretty foo: Object {
  "x": 1,
  "y": 2,
}
```

我们使用的是 Jest 的 `pretty-format` 来序列化快照。你可以在这里阅读更多相关内容：[pretty-format](https://github.com/facebook/jest/blob/main/packages/pretty-format/README.md#serialize).

## 与 Jest 的区别

Vitest提供了与 [Jest](https://jestjs.io/docs/snapshot-testing) 几乎兼容的快照功能，除少数例外:

#### 1. 快照文件中的注释标头不同

```diff
- // Jest Snapshot v1
+ // Vitest Snapshot v1
```

这实际上不会影响功能，但在从 Jest 迁移时可能会影响提交差异。

#### 2. `printBasicPrototype` 默认为 `false`

Jest 和 Vitest 的快照都是由 [`pretty-format`](https://github.com/facebook/jest/blob/main/packages/pretty-format) 支持的。在 Vitest 中，我们将 `printBasicPrototype` 的默认值设置为 `false` 以提供更清晰的快照输出，Jest 实际上将其默认设置为 `true` 。

```ts
import { expect, test } from 'vitest'

test('snapshot', () => {
  const bar = [
    {
      foo: 'bar',
    },
  ]

  // in Jest
  expect(bar).toMatchInlineSnapshot(`
    Array [
      Object {
        "foo": "bar",
      },
    ]
  `)

  // in Vitest
  expect(bar).toMatchInlineSnapshot(`
    [
      {
        "foo": "bar",
      },
    ]
  `)
})
```

我们相信这种预设有更好的可读性和开发体验。如果你仍然喜欢 Jest 的行为，可以通过以下方式更改配置：

```ts
// vitest.config.js
export default defineConfig({
  test: {
    snapshotFormat: {
      printBasicPrototype: true
    }
  }
})
```
