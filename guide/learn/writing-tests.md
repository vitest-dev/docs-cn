---
title: 编写测试用例 | 指南
prev:
  text: 快速起步
  link: /guide/
next:
  text: 使用匹配器
  link: /guide/learn/matchers
---

# 编写测试 {#writing-tests}

在 [入门指南](/guide/) 中，你安装了 Vitest 并运行了第一个测试。本章将深入探讨如何在 Vitest 中编写和组织测试。

## 你的第一个测试 {#your-first-test}

测试用于验证某段代码是否产生预期结果。在 Vitest 中，你使用 [`test`](/api/test) 函数来定义测试，使用 [`expect`](/api/expect) 来进行断言。每个测试都有一个名称（描述其检查内容的字符串）和一个包含一个或多个断言的函数。如果任何断言失败，则该测试失败。

```js
import { expect, test } from 'vitest'

test('Math.sqrt works for perfect squares', () => {
  expect(Math.sqrt(4)).toBe(2)
  expect(Math.sqrt(144)).toBe(12)
  expect(Math.sqrt(0)).toBe(0)
})
```

::: details 使用 `test` 还是 `it`？
你可能也会看到使用 [`it`](/api/test) 而非 `test` 编写的测试。它们的行为完全相同。`it` 只是一个别名，有些人更喜欢它，因为它在配合描述性名称时读起来更自然：

```js
import { expect, it } from 'vitest'

it('should compute square roots', () => {
  expect(Math.sqrt(4)).toBe(2)
})
```

两者的工作方式相同，使用你喜欢的那个。你可以在项目中自由混合使用它们。如果你想在代码库中强制执行一致的选择，[`consistent-test-it`](https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/consistent-test-it.md) ESLint 规则（在 [oxlint](https://oxc.rs/docs/guide/usage/linter/rules/jest/consistent-test-it.html) 中也可用）可以提供帮助。
:::

## 使用 `describe` 分组测试 {#grouping-tests-with-describe}

随着测试文件的增长，你会希望将相关的测试组织在一起。[`describe`](/api/describe) 创建一个测试套件，这是一个命名的测试组：

```js
import { describe, expect, test } from 'vitest'

describe('Math.sqrt', () => {
  test('returns the square root of perfect squares', () => {
    expect(Math.sqrt(4)).toBe(2)
    expect(Math.sqrt(9)).toBe(3)
  })

  test('returns NaN for negative numbers', () => {
    expect(Math.sqrt(-1)).toBeNaN()
  })

  test('returns 0 for 0', () => {
    expect(Math.sqrt(0)).toBe(0)
  })
})
```

你可以嵌套 `describe` 块以进一步组织，但请保持嵌套层次较浅。深层嵌套的测试更难阅读。对于简单模块，一个扁平的测试列表通常就足够了，`describe` 适用于当文件测试多个函数或方法且每个都需要自己的分组。

## 测试文件 {#test-files}

默认情况下，Vitest 会查找文件名中包含 `.test.` 或 `.spec.` 的任何文件，例如 `utils.test.js`、`app.spec.js` 或 `math.test.jsx`。它会在所有子目录中搜索，因此你将它们放在哪里并不重要。

确切的匹配规则是：

- `**/*.test.{ts,js,mjs,cjs,tsx,jsx}`
- `**/*.spec.{ts,js,mjs,cjs,tsx,jsx}`

组织测试文件没有单一的 “正确” 方法。有些团队喜欢将测试放在它们所测试的源代码旁边，而另一些团队则将它们保存在一个专用目录中。这两种方式 Vitest 都能找到：

```
src/
  utils.js
  utils.test.js       # 与源代码放在一起
  __tests__/
    utils.test.js     # 在测试目录中
```

如果默认匹配规则不适合你的项目，你可以使用 [`include`](/config/include) 和 [`exclude`](/config/exclude) 配置选项来自定义包含哪些文件。

## 测试 TypeScript {#testing-typescript}

由于 Vitest 构建于 Vite 之上，TypeScript 可以开箱即用。无需安装额外的编译器，无需配置 `ts-jest`，也无需为测试进行单独的构建步骤。只需将测试文件命名为 `.test.ts` 而不是 `.test.js`，然后开始编写：

```ts
import { expect, test } from 'vitest'

interface User {
  name: string
  age: number
}

function createUser(name: string, age: number): User {
  return { name, age }
}

test('creates a user with the correct fields', () => {
  const user = createUser('Alice', 30)

  expect(user).toEqual({ name: 'Alice', age: 30 })
  expect(user.name).toBe('Alice')
})
```

你可以像在代码库的其他部分一样，导入类型、使用泛型并编写类型化的测试工具。Vite 会即时转换 TypeScript，即使在大型项目中测试也能快速启动。

::: tip
Vitest 会转换 TypeScript 以供执行，但在测试运行期间 **不会** 对你的测试进行类型检查。你在终端中能够快速获得反馈，这是 Vite 为速度所做的权衡。当你需要完整的类型检查时，可以单独运行 `tsc` 或 `vitest typecheck`。更多详情请参阅 [测试类型](/guide/testing-types) 指南。
:::

## 阅读测试输出 {#reading-test-output}

当你运行 `vitest` 且只有一个测试文件匹配时，输出会以树状结构展开显示，显示 `describe` 分组、各个测试及其耗时：

<<< ./snippets/test-output-single.ansi

当多个测试文件运行时，Vitest 会将每个文件折叠为单行，以保持输出可控：

<<< ./snippets/test-output-multiple.ansi

当测试失败时，Vitest 会准确地告诉你问题出在哪里。你将看到期望值、实际值、突出显示差异的差异对比，以及包含失败断言的周围行代码片段。它还包括文件和行号，以便你可以直接跳转到源代码：

<<< ./snippets/test-output-fail.ansi

通过差异对比和代码片段，你通常就能看出问题出在哪里，而无需添加额外的 `console.log` 语句或自己打开文件。

## 跳过和聚焦测试 {#skipping-and-focusing-tests}

在开发过程中，你通常只想运行一部分测试。Vitest 为此提供了修饰符：

[`.only`](/api/test#only) 告诉 Vitest 只运行此测试（或套件），并跳过文件中的所有其他测试。适用于正在处理特定测试并且不想等待整个套件完成的场景：

```js
test.only('focus on this test', () => {
  // 文件中只运行此测试
})
```

[`.skip`](/api/test#skip) 则相反。它跳过一个测试而不删除它，适用于测试暂时损坏或你在处理其他事情时想要忽略它的场景：

```js
test.skip('not ready yet', () => {
  // 此测试被跳过
})
```

[`.todo`](/api/test#todo) 让你为尚未编写的测试标记一个占位符。Vitest 会在输出中列出它，这样你就不会忘记：

```js
test.todo('implement validation later')
```

这些修饰符非常适合开发过程中的快速本地更改。对于更永久的测试过滤方式（按文件名、行号或标签），请参阅 [测试过滤](/guide/filtering) 指南。

## 参数化测试 {#parameterized-tests}

当你有多个测试用例，仅输入和预期输出不同时，为每个用例编写单独的 `test` 会显得重复。[`test.for`](/api/test#test-for) 允许你将用例定义为数据，并为所有用例运行相同的测试逻辑：

```js
import { expect, test } from 'vitest'

test.for([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', ([a, b, expected]) => {
  expect(a + b).toBe(expected)
})
```

测试名称中的占位符 `%i`、`%s` 和 `%f` 会被每行中对应的值替换，因此输出会显示 `add(1, 1) -> 2`、`add(1, 2) -> 3` 等。

如果你的用例包含两个或三个以上的值，传递对象更具可读性。在名称中使用 `$property` 来插入字段：

```js
test.for([
  { a: 1, b: 1, expected: 2 },
  { a: 1, b: 2, expected: 3 },
  { a: 2, b: 1, expected: 3 },
])('add($a, $b) -> $expected', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})
```

测试函数的第二个参数是 [测试上下文](/guide/test-context)，它让你可以访问 fixtures、每个测试的 `expect` 和其他工具函数。[`test.concurrent`](/api/test#concurrent) 适用于并发测试，因为并发测试会并行运行，而全局的 `expect` 无法可靠地将快照与正确的测试关联起来。上下文作用域的 `expect` 正好解决了这个问题：

```js
test.concurrent.for([
  [1, 1],
  [1, 2],
  [2, 1],
])('add(%i, %i)', ([a, b], { expect }) => {
  expect(a + b).toMatchSnapshot()
})
```

[`describe.for`](/api/describe#describe-for) 的工作方式相同，但会为每组参数创建一个套件。适用于多个测试共享相同的参数化设置。

::: tip
Vitest 还提供了 [`test.each`](/api/test#each)，熟悉 Jest 的用户可能会认出它。它的工作方式类似，但会将数组参数展开传递，而不是作为单个值传递，并且不提供对测试上下文的访问。它主要为了与 Jest 兼容而存在。在新代码中，建议优先使用 `test.for`。
:::

## 使用全局导入 {#using-global-imports}

默认情况下，你需要在每个测试文件的顶部从 `vitest` 导入 `test`、`expect`、`describe` 和其他函数。如果你希望将它们作为全局变量使用而无需导入（类似于 Jest 的工作方式），可以在配置中启用 [`globals`](/config/globals) 选项：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
```

启用此选项后，你可以在没有导入的情况下直接编写测试：

```js
test('no import needed', () => {
  expect(1 + 1).toBe(2)
})
```

::: tip
如果你使用 TypeScript，请在 `tsconfig.json` 的 `compilerOptions` 中添加 `"types": ["vitest/globals"]` 以获得正确的类型支持。
:::

## 运行测试 {#running-tests}

Vitest 默认使用 [子进程](/config/pool) **并行** 运行所有测试文件。每个测试文件都在其独立的上下文中运行，因此你的测试文件不会彼此共享状态。这可以防止不同文件中的测试意外相互干扰。

同一个文件内的测试默认按顺序运行。由于同一文件中的测试往往共享初始化代码，这种按顺序执行通常是合理的。如果你的测试是真正独立的，你可以选择使用 [`test.concurrent`](/api/test#concurrent) 并发运行它们以加快速度。有关控制测试执行的更多详情，请参阅 [并行性](/guide/parallelism) 指南。
