---
title: diff | Config
outline: deep
---

# diff

- **类型:** `string`
- **命令行终端:** `--diff=<path>`

`DiffOptions` object or a path to a module which exports `DiffOptions`. Useful if you want to customize diff display.

For example, as a config object:

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

Or as a module:

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

- **类型:** `boolean`
- **默认值:** `true`
- **命令行终端:** `--diff.expand=false`

Expand all common lines.

## diff.truncateThreshold

- **类型:** `number`
- **默认值:** `0`
- **命令行终端:** `--diff.truncateThreshold=<path>`

The maximum length of diff result to be displayed. Diffs above this threshold will be truncated.
Truncation won't take effect with default value 0.

## diff.truncateAnnotation

- **类型:** `string`
- **默认值:** `'... Diff result is truncated'`
- **命令行终端:** `--diff.truncateAnnotation=<annotation>`

Annotation that is output at the end of diff result if it's truncated.

## diff.truncateAnnotationColor

- **类型:** `DiffOptionsColor = (arg: string) => string`
- **默认值:** `noColor = (string: string): string => string`

Color of truncate annotation, default is output with no color.

## diff.printBasicPrototype

- **类型:** `boolean`
- **默认值:** `false`

Print basic prototype `Object` and `Array` in diff output

## diff.maxDepth

- **类型:** `number`
- **默认值:** `20` (or `8` when comparing different types)

Limit the depth to recurse when printing nested objects
