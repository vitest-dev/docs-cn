---
title: maxWorkers | 配置
outline: deep
---

# maxWorkers

- **类型:** `number | string`
- **默认值:**
  - 如果禁用 [`watch`](/config/watch)，并发数量为系统全部可用并发数量
  - 如果启用 [`watch`](/config/watch)，并发数量为系统全部可用并发数量的一半

定义测试工作线程的最大并发数。可接受数值或百分比字符串作为参数：

- 数值：最多启动指定数量的工作线程
- 百分比字符串（例如 "50%"）：基于机器剩余可用并发数量，折算指定百分比数量的工作线程

## 示例 {#example}

### 数值 {#number}

::: code-group

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    maxWorkers: 4,
  },
})
```

```bash [CLI]
vitest --maxWorkers=4
```

:::

### 百分比 {#percent}

::: code-group

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    maxWorkers: '50%',
  },
})
```

```bash [CLI]
vitest --maxWorkers=50%
```

:::

<<<<<<< HEAD
Vitest 通过 [`os.availableParallelism`](https://nodejs.org/api/os.html#osavailableparallelism) 接口获取系统可用的最大并发数量。
=======
Vitest uses [`os.availableParallelism`](https://nodejs.org/api/os.html#osavailableparallelism) to know the maximum amount of parallelism available.

## Browser Mode

In [Browser Mode](/guide/browser/), every browser instance (a [project](/guide/projects) with `browser.enabled`, or an entry in [`browser.instances`](/config/browser/instances)) is a worker, so at most `maxWorkers` instances run at the same time. When another instance needs a slot, an idle headless instance is closed and opens again on its next run. An instance that is not headless stays open for the whole session, so its window is not closed between runs. The same number is the budget of pages shared by the open instances: a single instance runs up to `maxWorkers` test files in parallel in its own pages, and several instances split the budget between them, with at least one page each.

An instance runs a single test file at a time when the browser is not headless, or when the provider does not support parallelism.
>>>>>>> 16d0d75a17a5accae385ee1cbc4151a5680caf21
