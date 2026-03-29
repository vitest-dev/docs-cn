---
title: snapshotFormat | Config
outline: deep
---

# snapshotFormat <CRoot />

- **类型:** `PrettyFormatOptions`

快照测试的格式化选项。这些选项会传递给我们分叉的 [`pretty-format`](https://npmx.dev/package/pretty-format) 库。除了 `pretty-format` 原有选项外，我们还支持 `printShadowRoot: boolean` 参数。

::: tip
请注意，该对象中的 `plugins` 字段将被忽略。

如需通过 pretty-format 插件扩展快照序列化器，请使用 [`expect.addSnapshotSerializer`](/api/expect#expect-addsnapshotserializer) API 或 [snapshotSerializers](/config/snapshotserializers) 配置项。
:::
