---
title: 使用 vi.when 进行条件模拟 | 技巧
---

# 使用 vi.when 进行条件模拟 {#conditional-mocking-with-vi-when}

::: tip 前置要求
本技巧假定你已经熟悉 Vitest 中的 [模拟](/guide/mocking)。
:::

当模拟函数需要根据接收到的参数返回不同的值时，[`mockReturnValue`](/api/mock#mockreturnvalue) 无法满足需求，因为它始终返回同一个值。标准的做法是结合 `switch` 或一系列 `if/else` 语句使用 [`mockImplementation`](/api/mock#mockimplementation)：

```ts
db.findById.mockImplementation((id) => {
  if (id === 1) {
    return Promise.resolve({ id: 1, name: 'Ella' })
  }

  if (id === 2) {
    return Promise.resolve({ id: 2, name: 'Gracie' })
  }

  return Promise.resolve(undefined)
})
```

这种方法虽然可行，但需要自行编写参数匹配逻辑，过程比较繁琐。使用 [`vi.when`](/api/vi#vi-when) <Version>5.0.0</Version> API 后，Vitest 可以替你处理这部分逻辑。

## 用法 {#pattern}

`vi.when` 接收一个 spy，让你可以为不同参数定义不同的行为。

调用 `.calledWith(...args)` 指定要匹配的参数，这会创建一个 _行为_。

然后调用 `then*` 方法附加一个 _动作_，用于决定匹配该行为后要执行的操作。

同一个 spy 可以串联多个行为：

```ts
import { test, vi } from 'vitest'
import { getUserById } from './user.ts'

test('returns user data', async () => {
  const db = { findById: vi.fn<FindById>() }

  vi.when(db.findById)
    .calledWith(1)
    .thenResolve({ id: 1, name: 'Ella' })
    .calledWith(2)
    .thenResolve({ id: 2, name: 'Gracie' })

  await expect(getUserById(db, 1)).resolves.toEqual({ name: 'Ella' })
  await expect(getUserById(db, 2)).resolves.toEqual({ name: 'Gracie' })
})
```

所有类型的模拟结果都可以使用同样的方式处理。下面列出了完整的动作及其对应写法：

| 动作 | 等价于
| 等效代码 |
| -------------------- | -------------------------- | ------------------------------- |
| `thenReturn(value)` | `mockReturnValue(value)` | `return value` |
| `thenThrow(error)` | `mockThrow(error)` | `throw error` |
| `thenResolve(value)` | `mockResolvedValue(value)` | `return Promise.resolve(value)` |
| `thenReject(error)` | `mockRejectedValue(error)` | `return Promise.reject(error)` |

## 动作堆叠 {#stacking-actions}

单个行为可以附加多个动作。当行为匹配时，动作会按照 **后进先出** 的顺序被 _消耗_：最近注册的动作最先执行。该动作消耗完后，Vitest 会回退到前一个动作。你可以使用 `times` 选项限制某个动作处理调用的次数，达到次数后再回退到下一个动作。不设置 `times` 限制的动作会一直生效。

由于动作会按注册顺序逆序处理，因此应先注册无限期动作，再注册有次数限制的动作，以便后者可以暂时覆盖前者。

```ts
import { test, vi } from 'vitest'
import { readConfig } from './config.ts'

test('retries after an initial failure', async () => {
  const fetchInstance = vi.fn<() => Promise<unknown>>()

  vi.when(fetchInstance)
    .calledWith('/data/config.json')
    .thenResolve(new Response('{ debug: true }'))
    // ↳ 无限回退
    .thenReject(new Error('network error'), { times: 1 })
    // ↳ 优先调用，仅生效一次

  await expect(readConfig(fetchInstance)).resolves.toEqual({ debug: true })

  expect(fetchInstance).toHaveBeenCalledTimes(2)
})
```

为了简化调用，Vitest 提供了与 `{ times: 1 }` 等价的 `then*Once` 简写形式：`thenReturnOnce`、`thenResolveOnce`、`thenThrowOnce` 和 `thenRejectOnce`。

## 非对称匹配器 {#asymmetric-matchers}

`calledWith` 支持 [非对称匹配器](/guide/learn/matchers#asymmetric-matchers)。适用于仅关心参数的结构或类型，而不要求精确的值时：

```ts
test('sends email to each recipient', () => {
  vi.when(sendEmail)
    .calledWith(expect.stringContaining('@'))
    .thenReturn({ ok: true, message: 'sent via external relay' })
})
```

与动作不同，行为会按照 **先进先出** 的顺序进行匹配。规则类似于一组 `if/else` 语句，Vitest 会采用第一个参数与实际调用相匹配的行为。因此，应先注册匹配范围较小的行为，再注册匹配范围更大的行为。

```ts
test('sends email to each recipient', () => {
  vi.when(sendEmail)
    .calledWith(expect.stringContaining('@internal.example.com'))
    .thenReturn({ ok: true, message: 'sent via internal relay' })
    .calledWith(expect.stringContaining('@'))
    .thenReturn({ ok: true, message: 'sent via external relay' })
})
```

::: warning 行为合并
注册新行为时，Vitest 会按注册顺序检查已有行为。如果新参数已经匹配某个已有行为，新的动作会合并到该行为中，而不会创建新行为。

使用范围较宽的非对称匹配器时尤其需要注意：

```ts
vi.when(getRole)
  .calledWith(expect.any(String))
  .thenReturn('user')
  .calledWith('admin@example.com')
  .thenReturnOnce('admin')
```

由于第二次注册会合并到已有行为中，`'admin'` 动作并不会只适用于 `'admin@example.com'`，而会成为整个 `expect.any(String)` 行为的下一个动作。最终效果等同于以下写法：

```ts
vi.when(getRole)
  .calledWith(expect.any(String))
  .thenReturn('user')
  .thenReturnOnce('admin')
```

因此，第一次传入任意字符串时都会返回 `'admin'`，后续调用则返回 `'user'`：

```ts
expect(getRole('user@example.com')).toBe('admin')
expect(getRole('user@example.com')).toBe('user')
```

:::

## 处理未匹配的调用 {#handling-unmatched-calls}

默认情况下，如果 spy 接收到的参数没有匹配任何已注册行为，就会回退到 spy 的原始实现。如果 spy 没有原始实现，则返回 `undefined`。

你可以通过以下三种方式改变这种行为：

1. [抛出一个错误](#onunmatched-throw);
2. [运行一个自定义函数](#onunmatched-fn);
3. [使用非对称匹配器作为兜底行为](#asymmetric-matcher-as-catch-all).

### `onUnmatched: 'throw'`

传入 `{ onUnmatched: 'throw' }`，即可在 spy 接收到未注册参数时抛出错误：

```ts
vi.when(db.findById, { onUnmatched: 'throw' })
  .calledWith(1)
  .thenResolve({ id: 1, name: 'Ella' })

await expect(db.findById(1)).resolves.toMatchObject({ name: 'Ella' })
await expect(db.findById(3)).rejects.toThrow(
  'vi.when: no behavior defined when called with [3]',
)
```

错误消息中会包含未匹配的参数。错误类型和消息均为固定值，无法自定义。

### `onUnmatched: fn`

传入一个函数即可使用自定义逻辑处理未匹配的调用，例如为共享 mock 在不同测试中提供不同的回退行为。

```ts
const db = { findById: vi.fn<FindById>() }

test('returns a placeholder for unknown ids', async () => {
  vi.when(
    db.findById,
    { onUnmatched: id => Promise.resolve({ id, name: `User ${id}` }) }
  )
    .calledWith(1)
    .thenResolve({ id: 1, name: 'Ella' })

  await expect(db.findById(1)).resolves.toMatchObject({ name: 'Ella' })
  await expect(db.findById(42)).resolves.toMatchObject({ name: 'User 42' })
})
```

该函数接收与 spy 相同的参数，其返回值会直接作为 spy 的结果。如果函数抛出错误或返回被 reject 的 Promise，错误会像其他动作产生的错误一样传递给调用方。

### 将非对称匹配器用作兜底 {#asymmetric-matcher-as-catch-all}

最后注册一个范围较宽的 `calledWith`，可以为不匹配前面具体行为的调用提供兜底。兜底行为可以返回指定值、resolve 或 reject Promise，也可以抛出带类型的错误。

```ts
vi.when(db.findById)
  .calledWith(1)
  .thenResolve({ id: 1, name: 'Ella' })
  .calledWith(2)
  .thenResolve({ id: 2, name: 'Gracie' })
  .calledWith(expect.any(Number))
  .thenReject(new Error('user not found'))
```

## 断言所有行为均已调用 {#asserting-that-all-behaviors-were-called}

要检查所有已注册行为是否都已匹配且其动作均已消耗，可以对 `vi.when` 返回的对象使用 [`toHaveBeenExhausted`](/api/expect#tohavebeenexhausted) 断言：

```ts
test('loads both users', async () => {
  const db = { findById: vi.fn<FindById>() }

  const w = vi.when(db.findById)
    .calledWith(1)
    .thenResolveOnce({ id: 1, name: 'Ella' })
    .calledWith(2)
    .thenResolveOnce({ id: 2, name: 'Gracie' })

  await loadDashboard(db)

  expect(w).toHaveBeenExhausted()
})
```

在这个示例中，如果 `loadDashboard` 只调用了 `findById(1)`，测试就会失败，并列出从未匹配的行为：

```
AssertionError: expected all behaviors to have been exhausted, but some remain:

  calledWith(2)
    ✗ thenReturn({ id: 2, name: 'Gracie' })  never called
```

::: warning 注意事项
不包含任何行为的 `vi.when` 链永远不会被视为已耗尽。同样，单独使用且未附加 `then*` 动作的 `.calledWith()` 也不会被视为已耗尽。这两种情况都会导致 `toHaveBeenExhausted` 断言失败。

无限期动作（未设置 `times` 限制）至少使用一次后即可通过耗尽检查。此后动作仍会继续响应调用，但断言会视为通过。
:::

## 使用 `using` 自动清理 {#automatic-cleanup-with-using}

`vi.when` 支持 [显式资源管理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Resource_management) 协议。

使用 `using` 声明行为链，可以将行为限制在当前代码块内，并在执行离开代码块时自动恢复 spy。

```ts
const spy = vi.fn(() => 'original')

test('with mocked behavior', () => {
  using w = vi.when(spy).calledWith('hello').thenReturn('mocked')
  expect(spy('hello')).toBe('mocked')
}) // ← 在此处恢复

test('without mocked behavior', () => {
  expect(spy('hello')).toBe('original')
})
```

## 相关链接 {#see-also}

- [`vi.when`](/api/vi#vi-when)
- [`toHaveBeenExhausted`](/api/expect#tohavebeenexhausted)
- [`vi.isWhenChain`](/api/vi#vi-iswhenchain)
- [使用 `using` 自动清理](/guide/recipes/explicit-resources)
