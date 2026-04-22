---
title: testNamePattern | 配置
outline: deep
---

# testNamePattern <CRoot /> {#testnamepattern}

<<<<<<< HEAD
- **类型:** `string | RegExp`
- **命令行终端:** `-t <pattern>`, `--testNamePattern=<pattern>`, `--test-name-pattern=<pattern>`
=======
- **Type:** `string | RegExp`
- **CLI:** `-t <pattern>`, `--testNamePattern=<pattern>`, `--test-name-pattern=<pattern>`
>>>>>>> 1f86109e54689db534e518c85a6a73daa82d5bcf

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
