---
title: attachmentsDir | 配置
outline: deep
---

# attachmentsDir <CRoot />

- **类型:** `string`
- **默认值:** `'.vitest/attachments'`

Directory path for storing file attachments created by [`context.annotate`](/guide/test-context#annotate).

This option is resolved relative to the root Vitest config. When using [`projects`](/guide/projects), all projects share the same `attachmentsDir`; it cannot be configured per project.
