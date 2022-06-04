# 快照序列化

你可以添加自己的逻辑来修改快照的序列化方式。像 Jest 一样，Vitest 为内置的 JavaScript 类型、HTML 元素、ImmutableJS 和 React 元素提供了默认的序列化程序。

序列化模块示例：

```ts
expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` 是一个使用现有插件序列化一个值的函数。
    return `Pretty foo: ${printer(val.foo)}`
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, 'foo')
  },
})
```

添加如下所示的测试后：

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

我们使用的是 Jest 的 `pretty-format` 来序列化快照。你可以点击此处阅读更多相关内容：
[pretty-format](https://github.com/facebook/jest/blob/main/packages/pretty-format/README.md#serialize).
