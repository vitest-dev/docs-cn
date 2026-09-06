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

Vitest 通过 [`os.availableParallelism`](https://nodejs.org/api/os.html#osavailableparallelism) 接口获取系统可用的最大并发数量。
