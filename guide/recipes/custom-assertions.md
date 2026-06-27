---
title: 自定义断言工具函数 | 技巧
---

# 自定义断言工具函数 {#custom-assertion-helpers}

可复用的断言工具函数会让测试更易读，但代价是堆栈跟踪会变得不直观。当工具函数内的断言失败时，堆栈跟踪会指向工具函数内部的那一行，而不是调用它的测试。当同一个工具函数在多个测试中被使用时，仅凭堆栈跟踪无法识别是哪个具体位置调用失败。

[`vi.defineHelper`](/api/vi#vi-defineHelper) <Version>4.1.0</Version> 会包装一个函数，让 Vitest 在堆栈中移除工具函数的内部实现，并将错误指向调用点。

## 示例 {#pattern}

```ts
import { expect, test, vi } from 'vitest'

const assertPair = vi.defineHelper((a: unknown, b: unknown) => {
  expect(a).toEqual(b) // ❌ 失败不指向这里
})

test('example', () => {
  assertPair('left', 'right') // ✅ 失败指向这里
})
```

当 `assertPair` 失败时，差异对比和堆栈帧会显示调用它的测试行。和内置匹配器提供的行为一致。

## 组合多个期望 {#composing-multiple-expectations}

同一个包装器也适用于将多个断言打包的工具函数：

```ts
import { expect, test, vi } from 'vitest'

const expectValidUser = vi.defineHelper((user: unknown) => {
  expect(user).toHaveProperty('id')
  expect(user).toHaveProperty('email')
  expect(user.email).toMatch(/@/)
})

test('returns a valid user', async () => {
  const user = await fetchUser('alice')
  expectValidUser(user)
})
```

内部任意 `expect` 调用失败时，都会在测试中的 `expectValidUser(user)` 这一行上报。

只要可复用的检查包含多次 `expect` 调用，都可以使用 `defineHelper`，无论是像 `expectValidJWT` 这样的领域特定工具函数，还是任何原本要内联到每个测试中的 `expect` 调用块。

关于附加到 `expect.extend` 的不对称匹配器和自定义匹配器，请参阅 [扩展匹配器](/guide/extending-matchers)。

## 相关链接 {#see-also}

- [`vi.defineHelper`](/api/vi#vi-defineHelper)
- [扩展匹配器](/guide/extending-matchers)
