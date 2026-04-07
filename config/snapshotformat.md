---
title: snapshotFormat | 配置
outline: deep
---

# snapshotFormat <CRoot />

- **类型:** `Omit<PrettyFormatOptions, 'plugins' | 'compareKeys'> & { compareKeys?: null | undefined }`

快照测试的格式化选项。这些选项用于配置基于 [`@vitest/pretty-format`](https://npmx.dev/package/@vitest/pretty-format) 构建的快照专用格式化层。

关于 `PrettyFormatOptions` 的完整选项说明，请参阅 [`@vitest/pretty-format`](https://npmx.dev/package/@vitest/pretty-format)。本文档重点介绍 Vitest 快照特有的默认值和限制。

Vitest 快照在应用您的 `snapshotFormat` 覆盖前已预设以下默认值：

- `printBasicPrototype: false`
- `escapeString: false`
- `escapeRegex: true`
- `printFunctionName: false`

Vitest 还支持在 `snapshotFormat` 中使用如 `printShadowRoot` 和 `maxOutputLength` 等格式化选项：

`printShadowRoot` 控制是否在 DOM 快照中包含 shadow-root 内容。

`maxOutputLength` 是近似按深度划分的输出长度预算值，并非最终渲染字符串的硬性限制。

默认情况下，快照键名会使用格式化器的默认行为排序。设置 `compareKeys: null` 可禁用键名排序。`snapshotFormat` 不支持自定义比较函数。

::: tip
该对象中的 `plugins` 配置将被忽略。

如需通过 pretty-format 插件扩展快照序列化能力，请改用 [`expect.addSnapshotSerializer`](/api/expect#expect-addsnapshotserializer) 或 [`snapshotSerializers`](/config/snapshotserializers)。
:::
