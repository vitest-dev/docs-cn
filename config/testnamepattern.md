---
title: testNamePattern | Config
outline: deep
---

# testNamePattern <CRoot /> {#testnamepattern}

- **类型** `string | RegExp`
- **命令行终端** `-t <pattern>`, `--testNamePattern=<pattern>`, `--test-name-pattern=<pattern>`

使用与模式匹配的全名运行测试。 如果你将 `OnlyRunThis` 添加到此属性，将跳过测试名称中不包含单词 `OnlyRunThis` 的测试。

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
