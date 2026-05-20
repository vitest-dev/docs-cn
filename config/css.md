---
title: css | 配置
outline: deep
---

# css

- **类型:** `boolean | { include?, exclude?, modules? }`

配置是否应处理 CSS。当被排除时，CSS 文件将被替换为空字符串以绕过后续处理。CSS 模块将返回代理对象以不影响运行时。

::: warning
此选项不适用于 [浏览器测试](/guide/browser/)。
:::

## css.include

- **类型:** `RegExp | RegExp[]`
- **默认值:** `[]`

使用 RegExp 模式进行匹配，指定哪些 CSS 文件应返回实际内容并通过 Vite 处理。

:::tip
要处理所有 CSS 文件，请使用 `/.+/`。
:::

## css.exclude

- **类型:** `RegExp | RegExp[]`
- **默认值:** `[]`

使用 RegExp 模式指定哪些 CSS 文件应返回空内容。

## css.modules

- **类型:** `{ classNameStrategy? }`
- **默认值:** `{}`

### css.modules.classNameStrategy

- **类型:** `'stable' | 'scoped' | 'non-scoped'`
- **默认值:** `'stable'`

如果您决定处理 CSS 文件，可以配置 CSS modules 中的类名是否应限定作用域。您可以选择以下选项之一：

- `stable`: 类名将生成为 `_${name}_${hashedFilename}`，这意味着如果 CSS 内容发生变化，生成的类将保持不变，但如果文件名被修改或文件移动到另一个文件夹，则会更改。适用于使用快照功能。
- `scoped`: 类名将照常生成，如果你有 `css.modules.generateScopedName` 方法并且已启用 CSS 处理，则会尊重该方法。默认情况下，文件名将生成为 `_${name}_${hash}`，其中 hash 包含文件名和文件内容。
- `non-scoped`: 类名将不会被哈希。

::: warning
默认情况下，Vitest 导出一个代理，绕过 CSS 模块处理。如果您依赖类上的 CSS 属性，则必须使用 `include` 选项启用 CSS 处理。
:::
