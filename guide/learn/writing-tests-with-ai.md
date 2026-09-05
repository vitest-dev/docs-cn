---
title: 使用 AI 编写测试 | 指南
prev:
  text: 调试测试
  link: /guide/learn/debugging-tests
next:
  text: 什么是浏览器模式？
  link: /guide/browser/why
---

# 使用 AI 编写测试 {#writing-tests-with-ai}

AI 编码助手能帮助你更快地编写测试，但输出质量很大程度上取决于你的输入。模糊的提示词会产生模糊的测试。提供正确上下文的具体提示词才能生成真正值得保留的测试。

本章将介绍如何从 AI 工具生成优质的测试代码，以及在审查结果时需要关注哪些要点。

## 提供足够的上下文 {#providing-context}

你能做的最重要的一件事，就是给 AI 提供足够的上下文，让它理解自己正在测试什么。

首先从源码本身开始。AI 需要看到具体的实现，而不仅仅是函数功能的描述。提供完整文件，或者至少提供你想测试的函数，以及它相关的导入和类型定义。

共享同一项目中现有的测试文件。这有助于 AI 遵循你的约定：是使用 `test` 还是 `it`、如何组织 `describe` 块、是更偏好使用 `test.extend` 的 fixture，还是 `beforeEach`，以及如何命名测试。AI 工具擅长遵循约定，但它们需要有可遵循的约定。

提供你的 Vitest 配置，特别是如果你启用了 [`globals`](/config/globals)、设置了自定义 [`environment`](/config/environment) 或配置了 [`setupFiles`](/config/setupfiles)。没有这些上下文，AI 可能会生成不必要的导入、使用错误的测试环境，或者遗漏测试依赖的初始化。

如果被测试的代码有需要模拟的依赖项，也要共享这些文件（或至少它们的类型签名）。AI 无法为它从未见过的数据库客户端编写有效的模拟。

::: tip
如果你的项目有 `AGENTS.md` 或包含编码约定的类似文件，也提供进去。许多 AI 工具会自动识别这些文件并遵循其中定义的约定。
:::

## 编写优质提示词 {#writing-good-prompts}

具体的提示词比泛泛的提示词能生成更好的测试。比较以下两个示例：

**模糊提示词:**“为 `userService.js` 编写测试”

这很可能会生成很粗略的测试：每个函数一个成功路径测试，边缘情况覆盖最少，测试名称也很通用。

**优质提示词:**“为 `userService.js` 中的 `createUser` 函数编写测试。覆盖验证错误（缺失姓名、无效邮箱格式、重复邮箱）、成功创建路径，并验证密码在存储前是否经过哈希处理。”

这明确告诉 AI 要关注哪个函数、哪些场景重要、需要验证什么行为。输出结果会更全面、更有关联性。

### 编写优质提示词的技巧 {#tips-for-better-prompts}

- 明确要求边缘情况测试。“包含对空输入、边界值和错误处理的测试” 比让 AI 自行判断能产生更全面的覆盖。没有这个提示，大多数工具只会生成少量成功路径测试就停止。
- 提及你希望使用的特定 Vitest 功能。“使用 `toMatchInlineSnapshot` 处理错误信息” 或 “使用 `test.for` 处理不同的货币格式”，引导 AI 使用正确的工具，而不是让它退回到重复的复制粘贴测试。
- 如果测试异步代码，请明确说明。“该函数返回 Promise” 或 “这会调用外部 API” 有助于 AI 使用 `async`/`await` 和合适的匹配器，如 `.resolves` 和 `.rejects`。
- 告诉 AI _不要做_ 什么。“针对真实实现进行测试，不要模拟任何模块” 或 “不要使用快照测试”，可以避免你不想要的常见默认设置。AI 工具倾向于过度模拟，明确的约束可以防止这种情况。
- 描述你想要的测试结构。“使用 `describe` 块按方法分组测试” 或 “对数据库连接使用 `test.extend` fixture 而不是 `beforeEach`”，可以省去你事后重构的麻烦。
- 在要求添加测试时参考现有测试。“遵循 `auth.test.js` 中测试的相同风格” 比从头描述风格更有效。AI 会从示例中学习命名约定、断言形式和导入风格。
- 如果第一次结果不理想，请迭代优化。“这些测试过于关注实现细节。重写它们，只对返回值和抛出的错误进行断言” 是一个有效的后续提示。通过对话逐步完善通常比试图一次性写出完美提示词能产生更好的结果。

## 审查 AI 生成的测试 {#reviewing-ai-generated-tests}

AI 生成的测试乍一看可能很令人信服，但仍然存在问题。在提交之前，请检查以下内容。

### 测试是否真正断言了有意义的内容？ {#do-the-tests-actually-assert-something-meaningful}

注意那些调用函数但只检查它是否没有抛出异常的测试，或者断言模拟对象本身而不是行为的测试。这样的测试会给你虚假的信心：

```js
test('creates a user', () => {
  const user = createUser('Alice', 'alice@example.com')
  expect(user).toBeDefined() // 这对几乎所有情况都会通过
})
```

更好的做法是断言实际属性：

```js
test('creates a user with the correct fields', () => {
  const user = createUser('Alice', 'alice@example.com')
  expect(user).toMatchObject({
    name: 'Alice',
    email: 'alice@example.com',
  })
  expect(user.id).toBeTypeOf('string')
})
```

### 它们是在测试行为还是具体实现？ {#are-they-testing-behavior-or-implementation}

AI 倾向于过度模拟。如果你看到一个测试模拟了每个依赖项，然后断言特定的内部方法以特定顺序被调用，那是在测试实现细节。即使行为保持不变，这些测试在你每次重构时都会失败。

问问自己：如果有人改变了内部实现但函数仍然返回正确结果，这个测试会失败吗？如果答案是肯定的，那它可能过于耦合到实现细节了。关于这个区别的更多信息，请参阅 [测试实践](/guide/learn/testing-in-practice#what-to-test)。

### 测试真的能运行吗？ {#do-the-tests-actually-run}

在提交之前，一定要运行测试。AI 生成的测试可能存在导入错误、引用不存在的函数或 API 使用不当的问题。在聊天窗口中看起来正确的测试，在实际执行时可能立即失败：

```bash
vitest run src/userService.test.js
```

### 是否包含真正的边缘情况？ {#are-there-real-edge-cases}

AI 工具往往倾向于生成 “理想路径” 的测试，而跳过那些棘手的情况。在审查生成的测试后，问问自己：空输入会发生什么？输入 `null` 或 `undefined` 呢？网络请求失败怎么办？列表为空的情况呢？

如果这些场景没有被覆盖，请要求 AI 添加这些情况，或者自己手动编写。

## 迭代优化输出 {#iterating-on-the-output}

将 AI 生成的测试视为初稿，而非成品。一个良好的工作流程如下：

1. 使用具体的提示词和良好的上下文 **生成** 初版测试
2. 立即 **运行** 测试以发现错误
3. 针对上述问题 **审查** 每个测试
4. 如果整个部分需要改进，**提出修改建议**（“这些测试模拟过多，重写它们以测试与数据库模块的实际集成”）
5. 对于小修改进行 **手动编辑**，而不是为每个细节重新写提示词

随着时间的推移，当 AI 看到更多你的代码库和测试范例后，其输出质量会提高。在项目中早期，值得花时间为后续所有测试内容设定好约定。

## 常见陷阱 {#common-pitfalls}

### 错误的 API {#wrong-apis}

AI 生成的 Vitest 测试最常见的问题是使用了错误的 API。AI 模型基于大量 Jest 代码进行训练，因此有时会生成 `jest.fn()` 而不是 `vi.fn()`，或者 `jest.mock` 而不是 `vi.mock`。这些会立即失败。

导入相关问题：如果你的配置有 `globals: true`，AI 可能仍然会添加 `import { test, expect } from 'vitest'`（无害但没必要），或者反过来，在全局变量未启用时生成没有导入语句。如果你一直看到 Jest API，请引导 AI 查看 [Vitest API](/api/vi) 或将其包含在上下文中。

### 模拟清理 {#mock-cleanup}

AI 生成的测试经常使用 `vi.spyOn` 设置 spy 或使用 `vi.mock` 替换模块，但从不恢复它们。如果你的配置没有设置 [`restoreMocks: true`](/config/restoremocks)，这些模拟会在测试之间泄漏并导致难以理解的失败。最简单的修复方法是在全局启用该配置选项。

相关说明：AI 工具倾向于使用字符串路径（`vi.mock('./module.js')`）来模拟模块，而 `import()` 形式（`vi.mock(import('./module.js'))`）更受青睐，因为它提供类型安全和自动重构。请参阅 [模拟函数](/guide/learn/mock-functions#mocking-modules) 了解为什么这么重要。

### 冗长的测试名称 {#verbose-test-names}

AI 倾向于生成像 “当给定有效的正数和支持的货币代码时，应正确返回格式化的价格字符串” 这样的名称。当你有几十个测试时，这些名称很难快速浏览。描述行为的简短名称效果更好：“格式化美元价格”、“对负数金额抛出错误”、“无匹配项时返回空数组”。

### 监视 (Watch) 模式 {#watch-mode}

Vitest 默认在 watch 模式下运行，等待文件更改并交互式地重新运行测试。Vitest 尝试检测 CI 和非交互或 Agent 环境并自动禁用监视模式，但这种检测机制可能不够可靠。

当告诉智能体运行测试时，始终使用 `vitest run` 或 `vitest --no-watch` 以确保测试完成后进程退出。
