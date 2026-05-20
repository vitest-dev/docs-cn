---
title: expect | 配置
outline: deep
---

# expect

- **类型:** `ExpectOptions`

## expect.requireAssertions

- **类型:** `boolean`
- **默认值:** `false`

与每次测试开始时调用 [`expect.hasAssertions()`](/api/expect#expect-hasassertions) 相同。这可确保不会意外通过任何测试。

::: tip
这仅适用于 Vitest 的 `expect`。如果我们使用 `assert` 或 `.should` 断言，它们将不计算在内，并且我们的测试将因缺少 expect 断言而失败。

我们可以通过调用 `vi.setConfig({ expect: { requireAssertions: false } })` 来更改此值。该配置将应用于每个后续 `expect` 调用，直到手动调用 `vi.resetConfig`。
:::

::: warning
当使用 `sequence.concurrent` 和将 `expect.requireAssertions` 设为 `true` 运行测试时，应当使用 [本地 expect](/guide/test-context.html#expect) 而非全局 expect。否则在 [某些情况下](https://github.com/vitest-dev/vitest/issues/8469) 出现误判为失败的情况。
:::

## expect.poll

[`expect.poll`](/api/expect#poll) 的全局配置选项。这些选项与我们可以传递给 `expect.poll(condition, options)` 的选项相同。

### expect.poll.interval

- **类型:** `number`
- **默认值:** `50`

轮询间隔（以毫秒为单位）。

### expect.poll.timeout

- **类型:** `number`
- **默认值:** `1000`

轮询超时时间（以毫秒为单位）。
