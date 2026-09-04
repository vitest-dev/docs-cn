---
title: testNamePattern | 配置
outline: deep
---

# testNamePattern <CRoot /> {#testnamepattern}

- **类型:** `string | RegExp`
- **命令行终端:** `-t <pattern>`, `--testNamePattern=<pattern>`, `--test-name-pattern=<pattern>`

仅运行名称与指定模式匹配的测试。例如，将此选项设为 `OnlyRunThis` 后，名称中不包含 `OnlyRunThis` 的测试都会被跳过。

```js
import { expect, test } from 'vitest'

// 运行
test('OnlyRunThis', () => {
  expect(true).toBe(true)
})

// 跳过
test('doNotRun', () => {
  expect(true).toBe(true)
})
```

该模式会与测试的完整名称进行匹配。完整名称由外层测试套件名称和测试名称通过 `' > '` 连接而成，与报告器输出中显示的名称相同。例如，以下测试的完整名称为 `math > adds`，因此使用 `-t 'math > adds'` 或 `-t adds` 都能匹配该测试：

```js
import { describe, expect, test } from 'vitest'

describe('math', () => {
  test('adds', () => {
    expect(1 + 1).toBe(2)
  })
})
```

::: warning
<<<<<<< HEAD
在 Vitest 5 之前，为了与 Jest 保持一致，名称中的各部分使用单个空格连接（`math adds`）。详情请参阅 [迁移指南](/guide/migration#vitest-5)。
=======
Before Vitest 5, the segments were joined with a single space (`math adds`) to mirror Jest. See the [migration guide](/guide/migration/#vitest-5) for details.
>>>>>>> 752f075b1e09281f59aa7f472cf1ecc2aee8439d
:::
