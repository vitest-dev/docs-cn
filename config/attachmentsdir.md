---
title: attachmentsDir | 配置
outline: deep
---

# attachmentsDir <CRoot />

- **类型:** `string`
- **默认值:** `'.vitest/attachments'`

指定通过 [`context.annotate`](/guide/test-context#annotate) 创建的文件附件的存储目录。

Vitest 会相对于根配置解析此路径。使用 [`projects`](/guide/projects) 时，所有项目共用同一个 `attachmentsDir`，无法为每个项目单独配置。
