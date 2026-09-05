---
title: Schema 驱动断言 | 技巧
---

# Schema 驱动断言 {#schema-driven-assertions}

如果项目已使用 [Zod](https://zod.dev)、[Valibot](https://valibot.dev) 或 [ArkType](https://arktype.io) 验证数据，那么这些 schema 已经定义了有效的数据结构。在测试中复用这些类型，比在 `toEqual` 和 `toMatchObject` 中重复检查数据结构更简单直接。

[`expect.schemaMatching`](/api/expect#expect-schemamatching) <Version>4.0.0</Version> 是一个非对称匹配器，接受任意 [Standard Schema v1](https://standardschema.dev) 对象，如果待检查的值通过验证则匹配成功。

## 用法 {#pattern}

```ts
import { expect, test } from 'vitest'
import { z } from 'zod'

test('email validation', () => {
  const user = { email: 'john@example.com' }

  expect(user).toEqual({
    email: expect.schemaMatching(z.string().email()),
  })
})
```

`expect.schemaMatching` 是一个非对称匹配器，因此可以像 `expect.any` 或 `expect.stringMatching` 一样，在任意相等性检查中组合使用：

- `toEqual`/`toStrictEqual`
- `toMatchObject`
- `toContainEqual`
- `toThrow`
- `toHaveBeenCalledWith`
- `toHaveReturnedWith`
- `toHaveBeenResolvedWith`

## 支持所有兼容 Standard Schema 的库 {#works-with-any-standard-schema-library}

```ts
import { expect, test } from 'vitest'
import { z } from 'zod'
import * as v from 'valibot'
import { type } from 'arktype'

const user = { email: 'john@example.com' }

// Zod
expect(user).toEqual({
  email: expect.schemaMatching(z.string().email()),
})

// Valibot
expect(user).toEqual({
  email: expect.schemaMatching(v.pipe(v.string(), v.email())),
})

// ArkType
expect(user).toEqual({
  email: expect.schemaMatching(type('string.email')),
})
```

## 验证调用参数 {#verifying-call-arguments}

常见的用法是，在不逐一列出所有字段的情况下，断言调用模拟对象时传入的数据能够通过 schema 验证：

```ts
import { expect, test, vi } from 'vitest'
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.date(),
})

test('persists a valid user', () => {
  const repo = { save: vi.fn() }
  registerUser(repo, { email: 'a@b.com' })

  expect(repo.save).toHaveBeenCalledWith(expect.schemaMatching(UserSchema))
})
```

当已有用于验证某个值的 schema，而测试原本需要手动列出它的每个属性时，可以使用 `schemaMatching`。它适用于断言 UUID 或时间戳等生成字段，因为只需验证格式是否正确，不必关心具体的值。

## 相关链接 {#see-also}

- [`expect.schemaMatching`](/api/expect#expect-schemamatching)
- [Standard Schema](https://standardschema.dev)
- [Asymmetric Matchers](/api/expect)
