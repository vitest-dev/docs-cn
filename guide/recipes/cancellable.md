---
title: 可取消的测试资源 | 技巧
---

# 可取消的测试资源 {#cancellable-test-resources}

测试运行过程中可能占用一些资源，测试停止后这些资源不会随之释放。无论是 `fetch`、子进程、文件流还是轮询，它们都无法感知 Vitest 已取消测试，导致工作进程只能被动等待它们自行结束 Vitest 会在测试超时超过 `timeout` 限制、在 `--bail` 模式下另一个测试失败，或有人在终端按下 <kbd>Ctrl</kbd>+<kbd>C</kbd> 时取消测试。

测试上下文提供了 [`signal`](/guide/test-context#signal) <Version>3.2.0</Version>，它会在上述所有情况下触发。将它传递给任何接受 `AbortSignal` 的对象，当 Vitest 取消测试时对应的资源就会被释放。

## 用法 {#pattern}

```ts
import { test } from 'vitest'

test('stop request when test times out', async ({ signal }) => {
  await fetch('/heavy-resource', { signal })
}, 2000)
```

如果请求未在 2 秒内完成，`fetch` 会抛出 `AbortError`，而不会让测试挂起直到操作结束。

## 其他接受 `AbortSignal` 的 Web API {#other-web-apis-that-accept-an-abortsignal}

- [`fetch`](https://developer.mozilla.org/docs/Web/API/fetch)
- [`addEventListener`](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)，传递 `{ signal }` 会在中止时移除监听器
- [`ReadableStream.pipeTo`](https://developer.mozilla.org/docs/Web/API/ReadableStream/pipeTo)
- 像 Node.js API [`fs.readFile`](https://nodejs.org/api/fs.html#fspromisesreadfilepath-options), [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options)，和 [`setTimeout` 或 `setInterval`](https://nodejs.org/api/timers.html)，它们都接受 `{ signal }`
- 任何调用 `signal.throwIfAborted()` 或监听 `'abort'` 的代码

## 传递信号 {#forwarding-the-signal}

将测试的信号接入你自己的工具函数，使取消操作向下传递：

```ts
async function pollUntilReady(url: string, signal: AbortSignal) {
  while (!signal.aborted) {
    const res = await fetch(url, { signal })
    if (res.ok) {
      return
    }
    await new Promise(r => setTimeout(r, 200))
  }
  signal.throwIfAborted()
}

test('worker becomes ready', async ({ signal }) => {
  await pollUntilReady('http://localhost:4000/health', signal)
}, 5000)
```

## 相关链接 {#see-also}

- [测试上下文中的 `signal`](/guide/test-context#signal)
- [`bail`](/config/bail)
- [`testTimeout`](/config/testtimeout)
