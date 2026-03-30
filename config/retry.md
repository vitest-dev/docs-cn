---
title: retry | 配置
outline: deep
---

# retry

如果测试失败，重试指定次数。

- **类型:** `number | { count?: number, delay?: number, condition?: RegExp }`
- **默认值:** `0`
- **命令行终端:** `--retry <times>`, `--retry.count <times>`, `--retry.delay <ms>`, `--retry.condition <pattern>`

## 基础用法 {#basic-usage}

设置失败测试用例的重试次数。

```ts
export default defineConfig({
  test: {
    retry: 3,
  },
})
```

## 命令行用法 {#cli-usage}

你也可以通过命令行配置重试选项：

```bash
# 简单重试次数配置
vitest --retry 3

# 使用点符号配置高级选项
vitest --retry.count 3 --retry.delay 500 --retry.condition 'ECONNREFUSED|timeout'
```

## 高级选项 <Version>4.1.0</Version> {#advanced-options}

使用对象来配置重试行为：

```ts
export default defineConfig({
  test: {
    retry: {
      count: 3, // 重试次数
      delay: 1000, // 重试间隔时间（毫秒）
      condition: /ECONNREFUSED|timeout/i, // 触发重试的正则表达式错误匹配规则
    },
  },
})
```

### count

如果测试失败，重试的次数。默认值为 `0`。

```ts
export default defineConfig({
  test: {
    retry: {
      count: 2,
    },
  },
})
```

### delay

重试间隔时间（毫秒）。适用于需要与限频 API 交互或等待系统恢复的测试场景，默认值为 `0`。

```ts
export default defineConfig({
  test: {
    retry: {
      count: 3,
      delay: 500, // 每次重试间隔 500 毫秒
    },
  },
})
```

### condition

一个正则表达式模式或函数，用于根据错误判断是否应重试测试。

- 当使用 **正则表达式** 时，将对错误信息进行匹配测试
- 当使用 **函数** 时，该函数接收错误对象并返回布尔值

::: warning
如果将 `condition` 定义为函数，必须直接在测试文件中定义，而非配置文件中（配置项会被序列化供工作线程使用）。
:::

#### 正则表达式条件（在配置文件中）: {#regexp-condition-in-config-file}

```ts
export default defineConfig({
  test: {
    retry: {
      count: 2,
      condition: /ECONNREFUSED|ETIMEDOUT/i, // 在连接/超时错误时重试
    },
  },
})
```

#### 函数条件（在测试文件中）： {#function-condition-in-test-file}

```ts
import { describe, test } from 'vitest'

describe('tests with advanced retry condition', () => {
  test('with function condition', { retry: { count: 2, condition: error => error.message.includes('Network') } }, () => {
    // 测试代码
  })
})
```

## 测试文件覆盖 {#test-file-override}

你也可以在测试文件中为每个测试或测试套件定义重试选项：

```ts
import { describe, test } from 'vitest'

describe('flaky tests', {
  retry: {
    count: 2,
    delay: 100,
  },
}, () => {
  test('network request', () => {
    // 测试代码
  })
})

test('another test', {
  retry: {
    count: 3,
    condition: error => error.message.includes('timeout'),
  },
}, () => {
  // 测试代码
})
```
