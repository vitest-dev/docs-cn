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
    vi.restoreAllMocks()
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
