---
title: exclude | 配置
---

# exclude

- **类型:** `string[]`
- **默认值:** `['**/node_modules/**', '**/.git/**']`
- **命令行终端:** `vitest --exclude "**/excluded-file" --exclude "*/other-files/*.js"`

匹配排除测试文件的 [glob 规则](https://superchupu.dev/tinyglobby/comparison)。该规则相对于 [`root`](/config/root) 进行解析（默认为 [`process.cwd()`](https://nodejs.org/api/process.html#processcwd)）。

Vitest 使用 [`tinyglobby`](https://npmx.dev/package/tinyglobby) 包来解析 glob 规则。

::: warning
该配置项不影响代码覆盖率。如需从覆盖率报告中排除特定文件，请使用 [`coverage.exclude`](/config/coverage#exclude)。

如果使用命令行参数，这是唯一一个不会被覆盖配置项。通过 `--exclude` 参数添加的所有 glob 规则都将追加到 `exclude` 中。
:::

## 示例 {#example}

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      './temp/**',
    ],
  },
})
```

::: tip
虽然使用命令行 `exclude` 配置项是累加的，但在配置中手动设置 `exclude` 会替换默认值。要扩展默认的 `exclude` 配置项，请使用 `vitest/config` 中的 `configDefaults`：

```js{6}
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      'packages/template/*',
      './temp/**',
    ],
  },
})
```
:::
