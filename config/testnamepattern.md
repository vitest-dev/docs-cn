---
title: testNamePattern | Config
outline: deep
---

# testNamePattern <CRoot /> {#testnamepattern}

- **类型** `string | RegExp`
- **命令行终端** `-t <pattern>`, `--testNamePattern=<pattern>`, `--test-name-pattern=<pattern>`

运行符合全名匹配的测试。如果在此属性中添加 `OnlyRunThis`，则测试中不包含 `OnlyRunThis` 关键字的用例将会被跳过。

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
