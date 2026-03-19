---
title: include | 配置
---

# include

- **类型:** `string[]`
- **默认值:** `['**/*.{test,spec}.?(c|m)[jt]s?(x)']`
- **命令行终端:** `vitest [...include]`, `vitest **/*.test.js`

匹配包含测试文件的 [glob 规则](https://superchupu.dev/tinyglobby/comparison)。该规则相对于 [`root`](/config/root) 进行解析（默认为 [`process.cwd()`](https://nodejs.org/api/process.html#processcwd)）。

Vitest 使用 [`tinyglobby`](https://npmx.dev/package/tinyglobby) 包来解析 glob。

::: tip 注意
运行覆盖率测试时，Vitest 会自动将测试文件的 `include` 模式添加到覆盖率默认的 `exclude` 模式中。请参阅 [`coverage.exclude`](/config/coverage#exclude)。
:::

## 示例 {#example}

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      './test',
      './**/*.{test,spec}.tsx?',
    ],
  },
})
```

Vitest 默认提供了合理的值，通常情况下无需覆盖。`include` 典型使用场景是定义 [测试项目](/guide/projects)：

```js{8,12} [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['./test/unit/*.test.js'],
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['./test/e2e/*.test.js'],
        },
      },
    ],
  },
})
```

::: warning
此选项会覆盖 Vitest 的默认值。如果只想在默认值基础上扩展，请使用 `vitest/config` 中的 `configDefaults`：

```js{6}
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      ...configDefaults.include,
      './test',
      './**/*.{test,spec}.tsx?',
    ],
  },
})
```
:::
