---
title: tags | 配置
outline: deep
---

# tags <Version>4.1.0</Version> {#tags}

- **类型:** `TestTagDefinition[]`
- **默认值:** `[]`

定义测试项目中所有 [可用标签](/guide/test-tags)。默认情况下，如果测试定义的名称未在此列出，Vitest 将抛出错误，但可通过 [`strictTags`](/config/stricttags) 选项进行配置。

若使用 [`projects`](/config/projects) 配置，所有全局标签定义将自动继承至子项目。

使用 [`--tags-filter`](/guide/test-tags#syntax) 可按标签筛选测试用例，使用 [`--list-tags`](/guide/cli#listtags) 可打印 Vitest 工作区中的所有标签。

## name

- **类型:** `string`
- **必填:** `true`

标签名称。该名称将用于测试用例中 `tags` 选项的配置。

```ts
export default defineConfig({
  test: {
    tags: [
      { name: 'unit' },
      { name: 'e2e' },
    ],
  },
})
```

::: tip
如果你正在使用 TypeScript，可以通过在 `TestTags` 类型中添加一个包含字符串联合类型的属性，来约束可用的标签（确保该文件已纳入你的 `tsconfig` 中）：

```ts [vitest.shims.ts]
import 'vitest'

declare module 'vitest' {
  interface TestTags {
    tags:
      | 'frontend'
      | 'backend'
      | 'db'
      | 'flaky'
  }
}
```

:::

## 描述 {#description}

- **类型:** `string`

给标签添加通俗易懂描述。这将在 UI 模式中显示，以及在标签未找到时的错误信息里。

```ts
export default defineConfig({
  test: {
    tags: [
      {
        name: 'slow',
        description: 'Tests that take a long time to run.',
      },
    ],
  },
})
```

## 优先级 {#priority}

- **类型:** `number`
- **默认值:** `Infinity`

合并多个标签对应的配置选项时的优先级。数字越小优先级越高（例如，优先级 `1` 高于优先级 `3`）。

```ts
export default defineConfig({
  test: {
    tags: [
      {
        name: 'flaky',
        timeout: 30_000,
        priority: 1, // 高优先级
      },
      {
        name: 'db',
        timeout: 60_000,
        priority: 2, // 低优先级
      },
    ],
  },
})
```

当一个测试同时拥有两个标签时，`timeout` 将是 `30_000`，因为 `flaky` 的优先级更高。

## 测试选项 {#test-options}

标签可以定义 [测试选项](/api/test#test-options)，这些选项将应用于每个标记有该标签的测试。这些选项会与测试自身的选项合并，测试的选项优先级更高。

::: warning
[`retry.condition`](/api/test#retry) 只能是正则表达式，因为配置值需要被序列化。

标签也不能通过这些选项应用其他 [标签](/api/test#tags)。
:::

## 示例 {#example}

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    tags: [
      {
        name: 'unit',
        description: 'Unit tests.',
      },
      {
        name: 'e2e',
        description: 'End-to-end tests.',
        timeout: 60_000,
      },
      {
        name: 'flaky',
        description: 'Flaky tests that need retries.',
        retry: process.env.CI ? 3 : 0,
        priority: 1,
      },
      {
        name: 'slow',
        description: 'Slow tests.',
        timeout: 120_000,
      },
      {
        name: 'skip-ci',
        description: 'Tests to skip in CI.',
        skip: !!process.env.CI,
      },
    ],
  },
})
```
