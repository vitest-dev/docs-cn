---
title: 测试异步代码 | 指南
prev:
  text: 使用匹配器
  link: /guide/learn/matchers
next:
  text: 初始化与清理
  link: /guide/learn/setup-teardown
---

# 测试异步代码 {#testing-asynchronous-code}

JavaScript 代码经常以异步方式运行。无论是获取数据、读取文件还是等待定时器，Vitest 都需要知道它正在测试的代码何时完成，然后才能继续执行下一个测试。以下是你最常使用的形式。

## Async/Await

最直接的方法是让你的测试函数变为 `async`。Vitest 会自动等待返回的 Promise resolve，然后才认为测试完成。如果 Promise 被 reject，测试将失败，并显示拒绝原因。

```js
import { expect, test } from 'vitest'

function fetchUser(id) {
  return Promise.resolve({ id, name: 'Alice' })
}

test('fetches user by id', async () => {
  const user = await fetchUser(1)
  expect(user.name).toBe('Alice')
})
```

这是你绝大多数时候会使用的形式。它读起来就像同步代码一样，错误也会通过 `await` 自然地传播。

## Resolves 与 Rejects {#resolves-and-rejects}

有时你可能更愿意直接对 Promise 进行断言，而不是先将其通过 `await` 赋值给变量。[`.resolves`](/api/expect#resolves) 和 [`.rejects`](/api/expect#rejects) 工具函数让你能够做到这一点。它们会解开 Promise，然后将匹配器应用到 resolved 或 rejected 值上：

```js
test('resolves to Alice', async () => {
  await expect(fetchUser(1)).resolves.toMatchObject({ name: 'Alice' })
})

test('rejects with an error', async () => {
  await expect(fetchInvalidUser()).rejects.toThrow('User not found')
})
```

::: warning
不要忘记在 `expect` 前面加上 `await`。Vitest 会检测未等待的断言，并在测试结束时打印警告，但最好始终显式地添加 `await`。Vitest 还会在启动下一个测试之前，等待 `Promise.all` 中所有仍在进行的 Promise 完成，不过依赖这种行为会让测试更难理解。
:::

## 断言计数 {#assertion-counting}

对于异步代码，存在一个不易察觉的风险：回调函数或 `.then()` 链中的断言可能根本没有执行，而测试仍然会通过，因为没有断言失败。[`expect.hasAssertions()`](/api/expect#hasassertions) 正是用来防范这种情况的，它会检查该测试在执行期间是否至少运行过一条断言：

```js
test('callback is invoked', async () => {
  expect.hasAssertions()

  const data = await fetchData()
  data.items.forEach((item) => {
    expect(item.id).toBeDefined()
  })
  // 如果 data.items 为空，测试会失败而不是静默通过
})
```

当你知道应该运行的确切断言数量时，[`expect.assertions(n)`](/api/expect#assertions) 会更加精确：

```js
test('both callbacks are called', async () => {
  expect.assertions(2)

  await Promise.all([
    fetchUser(1).then(user => expect(user.name).toBe('Alice')),
    fetchUser(2).then(user => expect(user.name).toBe('Bob')),
  ])
})
```

在大多数情况下，使用直接断言的 `async`/`await` 已经足够清晰，无需额外进行断言计数。断言计数最适用于当断言位于回调函数、循环或条件分支中，而你希望确保它们确实已经执行。

::: tip
如果你希望项目中的每个测试都至少需要一个断言，可以在配置中启用 [`expect.requireAssertions`](/config/expect#expect-requireassertions)，而不是手动为每个测试添加 `expect.hasAssertions()`。
:::

## 回调函数 {#callbacks}

一些较旧的 API 使用回调函数而非 Promise。由于 Vitest 与 Promise 协同工作，最简单的方法是将回调函数包装在 `Promise` 中：

```js
function fetchData(callback) {
  setTimeout(callback, 100, 'peanut butter')
}

test('the data is peanut butter', async () => {
  const data = await new Promise((resolve) => {
    fetchData(resolve)
  })
  expect(data).toBe('peanut butter')
})
```

这种形式适用于任何基于回调的 API。将 `resolve` 作为成功回调传递进去，测试就会一直等待，直到该回调被调用。

::: tip
大多数现代 Node.js API（例如 `fs/promises` 和 `fetch`）原生支持 Promise，因此你可以直接使用 `async`/`await`。上述的回调包装形式主要适用于尚未采用 Promise 的旧版库。
:::

## 超时 {#timeouts}

默认情况下，每个测试有 5 秒的超时时间。如果某个测试耗时超过此限制（可能是因为 Promise 从未 resolve，或网络请求挂起），它将因超时错误而失败。这可以防止你的测试套件无限期地卡住。

你可以将 [自定义超时时间](/api/test#timeout) 作为 `test` 的第三个参数进行设置，这适用于确实需要更多时间的测试：

```js
test('long-running operation', async () => {
  await someSlowOperation()
}, 10_000) // 10 秒
```

如果你发现自己需要在许多测试中使用更长的超时时间，可以通过 [`testTimeout`](/config/testtimeout) 配置选项更改所有测试的默认值：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 10_000,
  },
})
```

## 未处理的 Rejection {#unhandled-rejections}

默认情况下，Vitest 会将未处理的 Promise reject 报告为测试运行中的错误。如果你的代码中某个 Promise 被 reject 且未被捕获，即使所有断言都通过，测试运行也会失败。这是有意为之的：未处理的 reject 通常表示存在真正的 bug，例如忘记的 `await` 或者一个 “发出后不管” 的 Promise 在静默中失败了。

```js
test('this causes an unhandled rejection error', () => {
  // 这个 Promise 会 reject 但从未被 await 或 catch
  Promise.reject(new Error('oops'))
})
```

要修复此问题，请确保对所有 Promise 使用 `await`，或捕获那些预期会发生的 reject：

```js
test('handle the rejection', async () => {
  // 要么等待 Promise
  await expect(Promise.reject(new Error('oops'))).rejects.toThrow('oops')

  // 如果不需要对其断言，可以显式 catch 它
  Promise.reject(new Error('expected')).catch(() => {})
})
```

如果你的代码有意产生未处理的 reject，可以使用 [`onUnhandledError`](/config/onunhandlederror) 过滤特定的错误，或者通过 [`dangerouslyIgnoreUnhandledErrors`](/config/dangerouslyignoreunhandlederrors) 完全禁用此检查。
