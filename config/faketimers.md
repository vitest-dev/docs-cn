---
title: fakeTimers | 配置
outline: deep
---

# fakeTimers

<<<<<<< HEAD
- **类型:** `FakeTimerInstallOpts`
=======
- **Type:** `FakeTimerConfig`
>>>>>>> 3a513123224c0041b8cda52ce1f47c912ce05789

当使用 [`vi.useFakeTimers()`](/api/vi#vi-usefaketimers) 时，Vitest 会将此选项传递给 [`@sinon/fake-timers`](https://npmx.dev/package/@sinonjs/fake-timers)。

## fakeTimers.now

- **类型:** `number | Date`
- **默认值:** `Date.now()`

使用指定的 Unix 时间戳安装假计时器。

## fakeTimers.toFake

- **类型:** `('setTimeout' | 'clearTimeout' | 'setImmediate' | 'clearImmediate' | 'setInterval' | 'clearInterval' | 'Date' | 'nextTick' | 'hrtime' | 'requestAnimationFrame' | 'cancelAnimationFrame' | 'requestIdleCallback' | 'cancelIdleCallback' | 'performance' | 'queueMicrotask')[]`
- **默认值:** 全局可用的所有方法，除了 `nextTick` 和 `queueMicrotask`

<<<<<<< HEAD
需要模拟的全局方法和 API 名称数组。

如果仅需模拟 `setTimeout()` 和 `nextTick()`，可将此属性指定为 `['setTimeout', 'nextTick']`。
=======
An array with names of global methods and APIs to fake. For example, to only mock `setTimeout()` and `nextTick()`, specify this property as `['setTimeout', 'nextTick']`.
>>>>>>> 3a513123224c0041b8cda52ce1f47c912ce05789

当使用 `--pool=forks` 在 `node:child_process` 中运行 Vitest 时，不支持模拟 `nextTick`。NodeJS 会在 `node:child_process` 内部使用 `process.nextTick`，模拟后会导致进程挂起。使用 `--pool=threads` 运行 Vitest 时支持模拟 `nextTick`。

## fakeTimers.toNotFake

- **Type:** `('setTimeout' | 'clearTimeout' | 'setImmediate' | 'clearImmediate' | 'setInterval' | 'clearInterval' | 'Date' | 'nextTick' | 'hrtime' | 'requestAnimationFrame' | 'cancelAnimationFrame' | 'requestIdleCallback' | 'cancelIdleCallback' | 'performance' | 'queueMicrotask')[]`
- **Default:** `[]`

An array with names of global methods and APIs to keep native. All other available timers will be mocked. For example, to keep `setInterval()` native and mock all other timers, specify this property as `['setInterval']`.

Mocking `nextTick` is not supported when running Vitest inside `node:child_process` by using `--pool=forks`. When running with `--pool=forks`, Vitest automatically adds `nextTick` to the `toNotFake` array.

::: warning
Using both `toFake` and `toNotFake` together is not supported.
:::

## fakeTimers.loopLimit

- **类型:** `number`
- **默认值:** `10_000`

调用 [`vi.runAllTimers()`](/api/vi#vi-runalltimers) 时将运行的最大计时器数量。

## fakeTimers.shouldAdvanceTime

- **类型:** `boolean`
- **默认值:** `false`

告诉 @sinonjs/fake-timers 根据真实系统时间的变化自动递增模拟时间（例如，真实系统时间变化 20ms 时，模拟时间也会递增 20ms）。

## fakeTimers.advanceTimeDelta

- **类型:** `number`
- **默认值:** `20`

仅在使用 `shouldAdvanceTime: true` 时相关。真实系统时间每变化 advanceTimeDelta 毫秒，模拟时间就会递增 advanceTimeDelta 毫秒。

## fakeTimers.shouldClearNativeTimers

- **类型:** `boolean`
- **默认值:** `true`

指示假计时器通过委托给它们各自的处理函数来清除 “原生”（即非假）计时器。如果禁用此功能，当伪计时器会话启动前已存在计时器时，可能导致意外行为。
