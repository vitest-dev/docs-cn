---
title: 在测试中收窄类型 | 技巧
---

# 在测试中收窄类型 {#type-narrowing-in-tests}

测试中会频繁遇到可能为 null 的值。`document.querySelector` 返回 `Element | null`，`Map.get(key)` 返回 `T | undefined`，类似为空的联合类型随处可见。测试代码中常见的变通方式包括：用 `as` 进行不安全的类型转换、每次访问时使用 `!` 进行非空断言，或使用在值缺失时抛出异常的运行时检查，如 `expect(x).toBeTruthy()`。这三种方式都会引入冗余代码，而运行时检查更会误导读者，因为它并未像看起来那样收窄类型。

[`expect.assert`](/api/expect#assert) <Version>4.0.0</Version> 会在运行时收窄 TypeScript 类型并抛出异常。同一个调用可以替代上述三种方式。

## 用法 {#pattern}

```ts
import { expect, test } from 'vitest'

test('reads stored user', () => {
  const cache = new Map<string, { id: string; name: string }>()
  cache.set('alice', { id: '1', name: 'Alice' })

  const user = cache.get('alice') // 类型为 `{ id, name } | undefined`
  expect.assert(user) // 若为 undefined 则抛出异常，并在下方收窄类型
  expect(user.name).toBe('Alice') // 无需 `!` 或 `as`，类型为 `{ id, name}`
})
```

同样的结构可以简化任何 “查找一个值，检查它是否存在，然后使用它” 的流程：

```ts
const job = queue.find(j => j.id === 'build-42') // Job | undefined
expect.assert(job)
job.cancel() // 已收窄为 Job
```

## 为什么 toBeTruthy 无法收窄类型 {#why-tobetruthy-doesn-t-narrow}

`expect(x).toBeTruthy()` 和 `expect(x).toBeDefined()` 值缺失时会在运行时抛出异常，因此测试会按预期失败。但它们不会收窄类型，因为 TypeScript 签名返回 `void`，而不是特殊的 `asserts` 形式。

`expect.assert` 拥有断言函数的类型，因此同一个调用能同时达到抛出异常和收窄类型的目的。

## 收窄非 null 类型 {#narrowing-beyond-null}

`expect.assert` 接受任意布尔表达式，并应用 TypeScript 在 `if` 分支中会使用的相同类型收窄逻辑。这包括 `typeof` 和 `instanceof` 检查：

```ts
expect.assert(typeof input === 'string')
input.toUpperCase() // input 是 `string` 类型

expect.assert(error instanceof MyError)
expect(error.code).toBe('E_FOO') // error 是 `MyError` 类型
```

对于常见的接口规范，chai 提供了 [`assert` API](/api/assert) 预置工具函数，可通过相同的 `expect.assert` 命名空间访问：

```ts
expect.assert.isDefined(maybeUser) // 收窄掉 `undefined`
expect.assert.isString(input) // 收窄为 string
expect.assert.instanceOf(error, MyError) // 收窄为 MyError
```

## 相关链接 {#see-also}

- [`expect.assert`](/api/expect#assert)
- [Chai `assert` API](/api/assert)
- [等待异步条件](/guide/recipes/wait-for)
