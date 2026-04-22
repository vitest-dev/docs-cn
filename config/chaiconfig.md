---
title: chaiConfig | 配置
outline: deep
---

# chaiConfig

- **类型:** `{ includeStack?, showDiff?, truncateThreshold? }`
- **默认值:** `{ includeStack: false, showDiff: true, truncateThreshold: 40 }`

等同于 [Chai 配置](https://github.com/chaijs/chai/blob/4.x.x/lib/chai/config.js)。

## chaiConfig.includeStack

- **类型:** `boolean`
- **默认值:** `false`

控制断言错误信息中是否包含堆栈跟踪。默认值 false 将抑制错误信息中的堆栈跟踪显示。

## chaiConfig.showDiff

- **类型:** `boolean`
- **默认值:** `true`

控制是否在抛出的 AssertionError 中包含 `showDiff` 标志。设为 `false` 将始终禁用差异显示；设为 `true` 则当断言请求显示差异时才会启用。

## chaiConfig.truncateThreshold

- **类型:** `number`
- **默认值:** `40`

<<<<<<< HEAD
设置断言错误中实际值与期望值的长度阈值。当超过该阈值时（例如处理大型数据结构），值将被截断显示为类似 `[ Array(3) ]` 或 `{ Object (prop1, prop2) }` 的形式。若需完全禁用截断功能，请将该值设为 `0`。

此配置项会影响 `test.each` 标题及断言错误信息内部值的截断显示。
=======
Sets length threshold for actual and expected values in assertion error messages. If this threshold is exceeded, for example for large data structures, the value is replaced with something like `[ Array(3) ]` or `{ Object (prop1, prop2) }`. Set it to `0` if you want to disable truncating altogether.
>>>>>>> 1f86109e54689db534e518c85a6a73daa82d5bcf
