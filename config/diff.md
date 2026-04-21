---
title: diff | 配置
outline: deep
---

# diff

- **类型:** `string`
- **命令行终端:** `--diff=<path>`

`DiffOptions` 对象或导出 `DiffOptions` 的模块路径。适用于想要自定义差异显示的场景。

Vitest 差异渲染底层使用 [`@vitest/pretty-format`](https://npmx.dev/package/@vitest/pretty-format)，其中部分 `DiffOptions` 会透传给 pretty-format 配置，其余参数则直接影响差异渲染行为。

例如，作为配置对象：

```ts
import { defineConfig } from 'vitest/config'
import c from 'picocolors'

export default defineConfig({
  test: {
    diff: {
      aIndicator: c.bold('--'),
      bIndicator: c.bold('++'),
      omitAnnotationLines: true,
    },
  },
})
```

或者作为模块：

:::code-group
```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    diff: './vitest.diff.ts',
  },
})
```

```ts [vitest.diff.ts]
import type { DiffOptions } from 'vitest'
import c from 'picocolors'

export default {
  aIndicator: c.bold('--'),
  bIndicator: c.bold('++'),
  omitAnnotationLines: true,
} satisfies DiffOptions
```
:::

## diff.expand

<<<<<<< HEAD
- **类型:** `boolean`
- **默认值:** `true`
- **命令行终端:** `--diff.expand=false`
=======
- **Type:** `boolean`
- **Default:** `true`
- **CLI:** `--diff.expand=false`
>>>>>>> 30df941749c0ffd4dfc4cc5c8691c9770e007b83

展开所有公共行。

## diff.truncateThreshold

<<<<<<< HEAD
- **类型:** `number`
- **默认值:** `0`
- **命令行终端:** `--diff.truncateThreshold=<path>`
=======
- **Type:** `number`
- **Default:** `0`
- **CLI:** `--diff.truncateThreshold=<path>`
>>>>>>> 30df941749c0ffd4dfc4cc5c8691c9770e007b83

差异结果的最大显示长度。超过此阈值的差异将被截断。默认值 0 表示不截断。

## diff.truncateAnnotation

<<<<<<< HEAD
- **类型:** `string`
- **默认值:** `'... Diff result is truncated'`
- **命令行终端:** `--diff.truncateAnnotation=<annotation>`
=======
- **Type:** `string`
- **Default:** `'... Diff result is truncated'`
- **CLI:** `--diff.truncateAnnotation=<annotation>`
>>>>>>> 30df941749c0ffd4dfc4cc5c8691c9770e007b83

如果差异结果被截断，在末尾输出的注释。

## diff.truncateAnnotationColor

<<<<<<< HEAD
- **类型:** `DiffOptionsColor = (arg: string) => string`
- **默认值:** `noColor = (string: string): string => string`
=======
- **Type:** `DiffOptionsColor = (arg: string) => string`
- **Default:** `noColor = (string: string): string => string`
>>>>>>> 30df941749c0ffd4dfc4cc5c8691c9770e007b83

截断注释的颜色，默认无颜色输出。

## diff.printBasicPrototype

<<<<<<< HEAD
- **类型:** `boolean`
- **默认值:** `false`

在差异输出中打印基本原型 `Object` 和 `Array`。

## diff.maxDepth

- **类型:** `number`
- **默认值:** `20` (或比较不同类型时为 `8`)

打印嵌套对象时递归的最大深度。
=======
- **Type:** `boolean`
- **Default:** `false`

Print basic prototype `Object` and `Array` in diff output.

## diff.maxDepth

- **Type:** `number`
- **Default:** `20` (or `8` when comparing different types)

Limit the depth to recurse when printing nested objects.
>>>>>>> 30df941749c0ffd4dfc4cc5c8691c9770e007b83
