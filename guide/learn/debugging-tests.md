---
title: 调试失败的测试 | Guide
prev:
  text: 测试实践
  link: /guide/learn/testing-in-practice
next:
  text: 使用 AI 编写测试
  link: /guide/learn/writing-tests-with-ai
---

# 调试失败的测试 {#debugging-failing-tests}

本章介绍如何在 Vitest 中调查测试失败问题：阅读错误输出、隔离问题、识别常见原因以及使用相关调试工具。

## 阅读错误输出 {#reading-the-error}

当测试失败时，Vitest 会提供多个信息片段。让我们来看一个真实的失败案例并进行分析：

<<< ./snippets/debug-output-fail.ansi

这里信息很多，但每一部分都在传达有用的信息：

**标题** (`FAIL src/user.test.js > createUser > sets the default role`) 告诉你哪个文件、哪个 describe 块以及哪个测试失败了。这就是它在测试树中的完整路径。

**断言信息** (`expected { ... } to deeply equal { ... }`) 告诉你哪种检查失败了，并展示参与比较的两个值。

**差异对比** 会准确展示差异所在。以 <code class="diff-add">+</code> 开头的行是你实际得到的结果，以 <code class="diff-remove">-</code> 开头的行是你期望的结果。在这个例子中，role 是 <code class="diff-add">"viewer"</code>，但测试期望的是 <code class="diff-remove">"member"</code>。

**代码片段** 会显示出错的确切代码行以及附近几行内容，并用使用脱字符 (`^`) 指向失败的断言。在大多数终端和 IDE 中，你可以点击文件路径直接跳转到对应位置。

此时，问题是：是代码发生了变化（也许默认 role 被有意更新为 `"viewer"`），还是测试本身有误？检查 `createUser` 的源代码以找出答案。如果默认值是有意更改的，就更新测试。如果不是，那么你就发现了一个 bug。

## 隔离问题 {#isolating-the-problem}

当测试失败且原因不明显时，第一步是将其隔离。只运行那个特定的测试，而不运行测试套件的其他部分：

```bash
# 仅运行失败的测试文件
vitest src/user.test.js

# 仅运行匹配名称规则的测试
vitest -t "sets the default role"

# 结合两者以获得最大精度
vitest src/user.test.js -t "sets the default role"
```

你也可以给测试本身添加 [`.only`](/api/test#only)：

```js
test.only('sets the default role', () => {
  // 文件中只有这个测试会运行
})
```

如果你有很多失败的测试，先聚焦第一个失败测试，可以使用 [`--bail`](/config/bail) 在失败次数达到设定值后停止执行：

```bash
vitest --bail 1
```

如果测试单独运行时通过，但与其他测试一起运行时失败，那么你就遇到了测试隔离问题（下文会详细说明）。如果即使单独运行也失败，那么问题就出在测试本身或其测试的代码中。

## 测试失败的常见原因 {#common-causes-of-failures}

### 测试间的共享状态 {#shared-state-between-tests}

这是最常见也最令人头疼的问题之一。测试单独运行时通过，但整个测试套件运行时却失败。通常原因是其他测试修改了共享状态（全局变量、模块级缓存、数据库）且没有自行清理。

```js
// 这是个问题：`users` 在测试间共享
const users = []

test('adds a user', () => {
  users.push('Alice')
  expect(users).toEqual(['Alice'])
})

test('starts empty', () => {
  // 这个会失败，因为 'Alice' 还在数组中！
  expect(users).toEqual([])
})
```

解决方法是在每个测试前使用 [`beforeEach`](/api/hooks#beforeeach) 重置状态，或者更好的是使用 [`test.extend`](/guide/test-context#extend-test-context) 自动为每个测试创建新的状态：

```js
const test = baseTest.extend('users', () => [])

test('adds a user', ({ users }) => {
  users.push('Alice')
  expect(users).toEqual(['Alice'])
})

test('starts empty', ({ users }) => {
  // 通过：每个测试都有自己的数组
  expect(users).toEqual([])
})
```

### 异步问题 {#async-issues}

如果异步流程处理不当，涉及 Promise 的测试可能会间歇性失败，或以令人困惑的方式报错。最常见的错误是忘记 `await`：

```js
// 即使 fetchUser 被 reject，这个测试总是通过！
test('fetches user', () => {
  // 缺少 await：测试在 Promise 完成前就结束了
  expect(fetchUser(1)).resolves.toMatchObject({ name: 'Alice' })
})
```

Vitest 通常会在测试结束时警告你有未等待的断言。如果你看到这个警告，就加上缺失的 `await`：

```js
test('fetches user', async () => {
  await expect(fetchUser(1)).resolves.toMatchObject({ name: 'Alice' })
})
```

如果测试卡住并最终超时，通常意味着 Promise 永远不会 resolve。检查你测试的代码中是否有缺少的回调、未解决的条件或死锁。

### 过时的快照 {#stale-snapshots}

如果你在使用 [快照测试](/guide/learn/snapshots) 并且有意更改了代码的输出，现有的快照就会过时。测试会失败，并显示旧快照与新输出之间的差异。

这是预期中的结果。检查差异以确认更改是正确的，然后通过监视模式下按 `u` 键或运行 `vitest -u` 来更新快照。

### 错误的测试环境 {#wrong-test-environment}

如果你的代码访问了浏览器 API，如 `document` 或 `window`，并且看到类似 "document is not defined" 的错误，说明你的测试正在 Node.js 环境（默认环境）中运行。你可以通过 [`environment`](/config/environment) 配置选项切换到类浏览器环境，或者最好是使用 [浏览器模式](/guide/browser/) 在真实浏览器中运行测试。

### 未清理模拟 {#mocks-not-cleaned-up}

如果一个测试中的 mock 泄露到另一个测试中，你会得到意外的行为。例如，使用 vi.spyOn 覆盖了某个方法的返回值后，如果没有恢复，它就会持续影响下一个测试。

最简单的解决方法是在配置中启用自动模拟恢复：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    restoreMocks: true,
  },
})
```

这会在每个测试后对每个模拟调用 [`mockRestore()`](/api/mock#mockrestore)。更多详情请参阅 [模拟函数](/guide/learn/mock-functions#resetting-mocks)。

## 调试工具 {#debugging-tools}

### 控制台日志 {#console-logging}

在测试中添加 `console.log`，检查到完全没问题。这是查看数据、快速搞清楚发生了什么的最快办法：

```js
test('transforms data correctly', () => {
  const input = getData()
  console.log('input:', input)

  const result = transform(input)
  console.log('result:', result)

  expect(result).toMatchObject({ status: 'ok' })
})
```

Vitest 会在测试结果中内联显示控制台输出，因此你可以看到具体哪个测试产生了哪个日志。

### UI 模式 {#vitest-ui}

如果想以可视化方式总览整个测试套件，请使用 `--ui` 参数运行 Vitest：

```bash
vitest --ui
```

这会打开一个基于浏览器的仪表板，你可以在其中看到所有测试、它们的状态和输出。它还包括一个模块图，显示你的文件是如何连接的，这可以帮助你理解为什么一个文件的更改会导致另一个文件中的测试失败。更多详情请参阅 [UI 模式](/guide/ui)。

### VS Code 扩展 {#vs-code-extension}

[Vitest VS Code 扩展](https://cn.vitest.dev/vscode) 允许你直接从编辑器中运行和调试单个测试。你可以点击任何测试旁边的 “播放” 按钮，设置断点，并在 VS Code 调试器逐步跟踪代码执行过程。相比在终端和编辑器之间频繁切换，这种方式通常更高效。

### 详细输出 {#verbose-output}

如果默认输出显示的信息不够详细，请使用详细报告器：

```bash
vitest --reporter=verbose
```

这会单独显示每个测试（不仅仅是文件），这有助于发现哪些测试通过、哪些失败的规律。

### 附加调试器 {#attaching-a-debugger}

对于需要逐行执行代码的更复杂问题，你可以使用 `--inspect-brk` 参数运行 Vitest 并附加调试器。`--no-file-parallelism` 参数确保测试在主线程中运行，以便断点可靠工作：

```bash
vitest --inspect-brk --no-file-parallelism
```

然后从 VS Code、IntelliJ 或 Chrome DevTools (`chrome://inspect`) 附加调试器。每种编辑器的详细配置方式，请参阅 [调试](/guide/debugging)。

## 获取帮助 {#getting-help}

如果你遇到困难，以下资源可以提供帮助：

- [常见错误](/guide/common-errors) 页面涵盖了特定错误信息及其解决方案
- [GitHub Issues](https://github.com/vitest-dev/vitest/issues) 用于搜索已知 bug 和变通方案
- [Discord 社区](https://chat.vitest.dev) 可以获取其他 Vitest 用户和维护者的实时帮助

<style>
.vp-doc code.diff-add {
  color: var(--vp-c-green-2) !important;
}
.vp-doc code.diff-remove {
  color: var(--vp-c-red-2) !important;
}
</style>
