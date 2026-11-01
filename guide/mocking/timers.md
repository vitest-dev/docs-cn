# 模拟计时器 {#timers}

当我们测试涉及超时或间隔的代码时，我们可以使用"伪造"计时器来加速测试，而不是让测试等待超时。这些伪造计时器可以模拟对 `setTimeout` 和 `setInterval` 的调用。

有关更详细的 API 描述，请参见 [`vi.useFakeTimers` API 部分](/api/vi#vi-usefaketimers)。

## 示例 {#example}

```js
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function executeAfterTwoHours(func) {
  setTimeout(func, 1000 * 60 * 60 * 2) // 2 小时
}

function executeEveryMinute(func) {
  setInterval(func, 1000 * 60) // 1 分钟
}

const mock = vi.fn(() => console.log('executed'))

describe('delayed execution', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.clearAllMocks()
  })
  it('should execute the function', () => {
    executeAfterTwoHours(mock)
    vi.runAllTimers()
    expect(mock).toHaveBeenCalledTimes(1)
  })
  it('should not execute the function', () => {
    executeAfterTwoHours(mock)
    // 前进 2 毫秒不会触发该函数
    vi.advanceTimersByTime(2)
    expect(mock).not.toHaveBeenCalled()
  })
  it('should execute every minute', () => {
    executeEveryMinute(mock)
    vi.advanceTimersToNextTimer()
    expect(mock).toHaveBeenCalledTimes(1)
    vi.advanceTimersToNextTimer()
    expect(mock).toHaveBeenCalledTimes(2)
  })
})
```

## Automatic Advancing {#automatic-advancing}

Some Vitest APIs wait for a condition to be met. When fake timers are enabled, these APIs advance them while they run:

- [`vi.waitFor`](/api/vi#vi-waitfor) and [`vi.waitUntil`](/api/vi#vi-waituntil) advance timers by `interval` before every check.
- [`expect.poll`](/api/expect#poll) advances timers by `interval` after every failed attempt.
- In Browser Mode, [`expect.element`](/api/browser/assertions) advances timers while it retries, and [locator](/api/browser/locators#methods) and [`userEvent`](/api/browser/interactivity) methods that take an element advance them while they run, even when the element already exists. The amount depends on how long the action takes in real time, so it can vary between runs. Methods that don't take an element, such as `userEvent.keyboard` and `userEvent.tab`, don't advance timers.

## Tick Modes {#tick-modes}

By default, fake timers only move when you advance them or when one of the APIs above runs. [`vi.setTimerTickMode`](/api/vi#vi-settimertickmode) makes them advance on their own:

- `interval` advances fake time by a fixed step on a real-time interval, so it stays roughly in step with real time. It suits code where some state only lasts for a limited time.
- `nextTimerAsync` runs the next pending timer after each macrotask, so chained timers fire almost back to back. It suits code that eventually settles, but state that only lasts for a limited time can disappear before an assertion or action sees it.
