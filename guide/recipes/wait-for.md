---
title: 等待异步条件 | 技巧
---

# 等待异步条件 {#waiting-for-async-conditions}

测试中许多操作不会同步完成。服务器启动需要时间，DOM 元素在微任务结束后才渲染。使用 `setTimeout` 等待容易出现等待时间不稳定地偏短 ，或者设置过长的等待时间造成浪费，而手动轮询循环需要为每个测试编写大量代码。

Vitest 提供了工具函数代你进行轮询，按固定间隔重试，直到条件成立或超时。

## `expect.poll`：重试断言 {#expect-poll-retry-an-assertion}

当等待条件是一个断言时，使用 [`expect.poll`](/api/expect#poll)。Vitest 会按间隔重试整个表达式，直到匹配器通过。回调函数返回待断言的值，匹配器负责比较。

```ts
import { expect, test } from 'vitest'
import { createServer } from './server.ts'

test('server starts', async () => {
  const server = createServer()

  await expect.poll(() => server.isReady, {
    timeout: 500,
    interval: 20
  }).toBe(true)
})
```

失败信息是标准的 `expect` 差异，无需手动维护 `throw new Error('Server not started')`。适用于大多数 “等待 X 变为 Y” 的场景。

`expect.poll` 会让每个断言变为异步的，因此必须使用 `await` 调用。但某些匹配器与其不兼容：快照匹配器（轮询下总是成功）、`.resolves` 和 `.rejects`（条件已在等待中解析）以及 `toThrow`（匹配器看到值之前已被解析）。对于这些情况，改用 `vi.waitFor`。

## `vi.waitFor`：等待并捕获返回值 {#vi-waitfor-wait-and-capture-the-value}

[`vi.waitFor`](/api/vi#vi-waitfor) 适用于等待某个操作成功完成的场景。它在每个间隔运行回调函数；抛出错误会触发下一次尝试，首次未抛错的调用会完成等待，返回回调函数的结果。

```ts
import { expect, test, vi } from 'vitest'
import { connect, DB_URL } from './db.ts'

test('database is reachable', async () => {
  // `connect` 在数据库接受连接前会抛出 ECONNREFUSED
  const client = await vi.waitFor(() => connect(DB_URL), {
    timeout: 5000,
    interval: 100,
  })

  const rows = await client.query('SELECT 1 AS ok')
  expect(rows[0].ok).toBe(1)
})
```

驱动重试的是 `connect` 本身抛出的错误，而不是你在回调函数中编写的 `expect`。`expect.poll` 并不适合这种场景，因为它是为断言设计的，而 “重试直到此调用停止抛出错误并返回结果” 不是断言逻辑。

## `vi.waitUntil`：轮询到为真值，错误时快速失败 {#vi-waituntil-poll-until-truthy-fail-fast-on-errors}

[`vi.waitUntil`](/api/vi#vi-waituntil) 用于值查找的场景，其中任何抛出的错误应立即导致测试失败，而不是被重试跳过。每次间隔都会重新调用回调函数。返回真值时完成等待；返回假值则等待下一个间隔。抛出错误则立即使测试失败。

```ts
import { expect, test, vi } from 'vitest'
import { jobResults, startJob } from './worker.ts'

test('worker completes the job', async () => {
  startJob('build-42')

  const result = await vi.waitUntil(
    () => jobResults.get('build-42'),
    { timeout: 5000, interval: 100 },
  )

  expect(result.status).toBe('ok')
  expect(result.steps).toHaveLength(4)
})
```

`jobResults.get('build-42')` 返回 `JobResult | undefined`。`waitUntil` 轮询直到返回 true，将解析类型收窄为 `JobResult`，然后返回用于后续断言。如果取值操作本身因编写错误（如 import 中的拼写错误）抛出错误，`waitUntil` 会在首次尝试时抛出该错误，而不是跳过重试。

在浏览器模式下，DOM 查询优先使用 [`page.locator`](/api/browser/locators) 和 [`expect.element`](/api/browser/assertions) 而不是 `waitUntil`：定位器会自动重试并产生更丰富的失败信息。

## 选择合适的方法 {#picking-between-them}

|                | `expect.poll`      | `vi.waitFor`         | `vi.waitUntil`                 |
| -------------- | ------------------ | -------------------- | ------------------------------ |
| 适用于         | 等待条件一个是断言 | 操作在就绪前可能失败 | 返回值可能为 false，这是正常的 |
| 遇到错误时重试 | 是                 | 是                   | 否，立即失败                   |
| 返回结果       | 断言结果           | 回调函数的返回值     | 回调函数的返回值               |

这些方法都接受 `{ timeout, interval }` 选项，默认超时时间为 1000 毫秒，间隔为 50 毫秒。`vi.waitFor` 和 `vi.waitUntil` 还可以直接传入数字方式的简写，直接表示超时时间。

## 模拟定时器 {#fake-timers}

如果 [`vi.useFakeTimers`](/api/vi#vi-usefaketimers) 处于激活状态，`vi.waitFor` 会在重试之间自动调用 `vi.advanceTimersByTime(interval)`。这样可以在不引入真实时间的条件下下，使基于 `setTimeout` 的被测代码能够正常执行。

这可以使基于 `setTimeout` 的被测代码在不引入真实时间的情况下保持可达性。

## 相关链接 {#see-also}

- [`expect.poll`](/api/expect#poll)
- [`vi.waitFor`](/api/vi#vi-waitfor)
- [`vi.waitUntil`](/api/vi#vi-waituntil)
- [`vi.useFakeTimers`](/api/vi#vi-usefaketimers)
