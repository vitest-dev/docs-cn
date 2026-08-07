---
title: testNamePattern | 配置
outline: deep
---

# testNamePattern <CRoot /> {#testnamepattern}

- **类型:** `string | RegExp`
- **命令行终端:** `-t <pattern>`, `--testNamePattern=<pattern>`, `--test-name-pattern=<pattern>`

运行名称完全匹配该模式的测试。如果在此属性中添加 `OnlyRunThis`，则测试中不包含 `OnlyRunThis` 关键字的用例将会被跳过。

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

The pattern is matched against the test's full name: the enclosing suite names and the test name joined with `' > '` (the same string shown in the reporter output). For example, the test below has the full name `math > adds`, so it is matched by `-t 'math > adds'` or `-t adds`:

```js
import { describe, expect, test } from 'vitest'

describe('math', () => {
  test('adds', () => {
    expect(1 + 1).toBe(2)
  })
})
```

::: warning
Before Vitest 5, the segments were joined with a single space (`math adds`) to mirror Jest. See the [migration guide](/guide/migration#vitest-5) for details.
:::
