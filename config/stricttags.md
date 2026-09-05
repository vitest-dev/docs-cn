---
title: strictTags | 配置
outline: deep
---

# strictTags <Version>4.1.0</Version> {#stricttags}

- **类型:** `boolean`
- **默认值:** `true`
- **命令行终端:** `--strict-tags`, `--no-strict-tags`

如果测试使用了未在配置中定义的 [`tag`](/config/tags)，Vitest 是否应抛出错误，以避免因拼写错误导致意外的行为（应用错误的配置或因
`--tags-filter` 参数而跳过测试）。

注意，如果 `--tags-filter` 参数定义了配置中不存在的标签，Vitest 将会抛出错误。

例如，以下测试将因标签 `fortnend` 存在拼写错误（正确应为 `frontend`）而抛出错误：

::: code-group
```js [form.test.js]
test('renders a form', { tags: ['fortnend'] }, () => {
  // ...
})
```
```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    tags: [
      { name: 'frontend' },
    ],
  },
})
```
:::
