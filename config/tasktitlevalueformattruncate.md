---
title: taskTitleValueFormatTruncate | 配置
outline: deep
---

# taskTitleValueFormatTruncate <CRoot /> {#tasktitlevalueformattruncate}

- **类型:** `number`
- **默认值:** `40`

设置插入生成任务标题的格式化值的长度限制。

此设置会影响通过 `test.each` 和 `test.for` 等 API 插入的值，包括 `$value` 和 `%` 占位符格式化。

将其设置为 `0` 可禁用截断功能。
