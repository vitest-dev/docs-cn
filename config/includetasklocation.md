---
title: includeTaskLocation | 配置
outline: deep
---

# includeTaskLocation

- **类型:** `boolean`
- **默认值:** `false`

当 Vitest API 在 [报告器](/config/reporters) 中接收任务时，是否包含 `location` 属性。如果测试数量较多，此功能可能导致轻微性能下降。

`location` 属性包含对应原始文件中 `test` 或 `describe` 位置的 `column`（列）和 `line`（行）数值。

以下情况将自动启用此选项（除非显式禁用）：
- 运行 [UI 模式](/guide/ui)
- 使用 [浏览器模式](/guide/browser/) 且未启用 [无头模式](/guide/browser/#headless)
- 使用 [HTML 报告器](/guide/reporters#html-reporter)

::: tip
如果未编写依赖此属性的自定义代码，该选项不会产生实际影响。
:::
