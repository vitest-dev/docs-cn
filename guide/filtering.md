---
title: 测试筛选 | 指南
---

# 测试筛选 {#test-filtering}

随着测试套件不断增长，每次改动都运行全部测试会变得缓慢且干扰开发节奏。如果你只是在修复某个模块中的一个 bug，就没必要等待数百个无关测试全部跑完。测试过滤可以让你缩小执行范围，只运行当前正在处理的代码相关测试，从而更专注地开发。

Vitest 提供了多种过滤测试的方式：可以通过命令行、在测试文件内部，或使用标签来过滤。不同的方法适用于不同的场景。

::: tip 性能说明
像 `-t`、`--tags-filter`、`.only` 和 `.skip` 这样的过滤方式，都是按 _文件级_ 应用的。也就是说，Vitest 仍然需要运行每个测试文件，才能找出哪些测试符合条件。在大型项目中，即使最终真正执行的测试只有少数几个，这部分开销也会逐渐累积变大。

为了避免这种情况，建议在使用过滤条件时同时传入文件路径，这样 Vitest 就只会加载你关注的哪些文件：

```bash
vitest utils.test.ts -t "handles empty input"
```

另外，你也可以使用 [`--experimental.preParse`](/config/experimental#experimental-preparse) 参数。它会通过解析测试文件来发现测试名称，而不需要完整执行这些文件：

```bash
vitest --experimental.preParse -t "handles empty input"
```

:::

## 按文件名过滤 {#filtering-by-file-name}

在命令行参数中传入文件名的形式，是运行部分测试最简单的方式。Vitest 只会运行路径中包含该字符串的测试文件：

```bash
vitest basic
```

匹配路径中包含 `basic` 的任意测试文件：

```
basic.test.ts
basic-foo.test.ts
basic/foo.test.ts
```

适用于明确知道需要处理哪些文件，并希望跳过其他所有内容。

## 按测试名称过滤 {#filtering-by-test-name}

有时，你关心的那个测试会埋在一个包含许多其他测试的文件里。`-t`（或 `--testNamePattern`）选项会按测试名称而不是文件名进行过滤。它接受一个正则表达式，并会匹配完整的测试名称，其中也包括所有 `describe` 代码块的名称：

```bash
vitest -t "handles empty input"
```

你可以与文件过滤器结合使用，进一步缩小范围：

```bash
vitest utils -t "handles empty input"
```

这仅运行匹配 `utils` 的文件中名称匹配 `"handles empty input"` 的测试。

## 按行号过滤 {#filtering-by-line-number}

当你在编辑器里查看某个具体测试时，通常只想运行那 _一个测试_。你可以直接指定对应的行号：

```bash
vitest basic/foo.test.ts:10
```

Vitest 将运行包含第 10 行的测试。这需要完整的文件名（相对路径或绝对路径）：

```bash
vitest basic/foo.test.ts:10 # ✅
vitest ./basic/foo.test.ts:10 # ✅
vitest /users/project/basic/foo.test.ts:10 # ✅
vitest foo:10 # ❌ 部分名称无效
vitest ./basic/foo:10 # ❌ 缺少文件扩展名
```

要运行多个特定测试，用空格分隔它们：

```bash
vitest basic/foo.test.ts:10 basic/foo.test.ts:25 # ✅
vitest basic/foo.test.ts:10-25 # ❌ 不支持范围
```

## 按标签过滤 {#filtering-by-tags}

对于更大的项目，你可能希望对测试进行分类，并按类别运行它们。通过 [标签](/guide/test-tags)，可以让你为测试添加标记，然后通过命令行按这些标签进行过滤：

```ts
test('renders a form', { tags: ['frontend'] }, () => {
  // ...
})

test('calls an external API', { tags: ['backend'] }, () => {
  // ...
})
```

```bash
vitest --tags-filter=frontend
```

适合在 CI 流水线中使用，例如你可能希望在不同的任务中分别运行前端测试和后端测试，或者在快速检查时跳过耗时较长的集成测试。

## 使用 `.only` 聚焦特定测试 {#focusing-on-specific-tests-with--only}

当你调试失败的测试时，希望只运行该测试而无需每次都修改 CLI 参数。在测试用例或测试套件中添加 `.only` 会告诉 Vitest 跳过文件中的所有其他内容：

```ts
import { describe, expect, it } from 'vitest'

describe.only('suite', () => {
  it('test', () => {
    // 仅有这个会运行，因为测试套件被标记为 .only
    expect(Math.sqrt(4)).toBe(2)
  })
})

describe('another suite', () => {
  it('skipped test', () => {
    // 这个不会运行
    expect(Math.sqrt(4)).toBe(2)
  })

  it.only('focused test', () => {
    // 这个也会运行，因为它被标记为 .only
    expect(Math.sqrt(4)).toBe(2)
  })
})
```

你可以在 `describe` 块和单个测试上使用 `.only`。当文件中任何测试或测试套件被标记为 `.only` 时，该文件中所有未标记的测试都会被跳过。

::: warning
请记得在提交前移除 `.only`。默认情况下，在 CI 环境中（即设置了 `process.env.CI` 时）， Vitest 遇到 `.only` 会使整个测试运行失败，以防你在流水线中意外跳过测试。此行为由 [`allowOnly`](/config/allowonly) 选项控制。

为了更早地捕获 `.only`，[`no-focused-tests`](https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-focused-tests.md) ESLint 规则（在 [oxlint](https://oxc.rs/docs/guide/usage/linter/rules/jest/no-focused-tests.html) 中也可用）这样你在提交前就能在编辑器里发现它。
:::

## 使用 `.skip` 跳过测试 {#skipping-tests-with-skip}

`.skip` 与 `.only` 正好相反。使用它可以临时禁用某个测试或测试套件而无需删除它。被跳过的测试仍会显示在报告中，这样你就不会忘记它们：

```ts
import { describe, expect, it } from 'vitest'

describe.skip('skipped suite', () => {
  it('test', () => {
    // 整个测试套件都被跳过
    expect(Math.sqrt(4)).toBe(2)
  })
})

describe('suite', () => {
  it.skip('skipped test', () => {
    // 只有这个测试被跳过
    expect(Math.sqrt(4)).toBe(2)
  })
})
```

它让你可以保留测试作为提醒，同时不影响套件的其他部分运行，适用于测试不稳定或依赖于暂时不可用的外部服务。

## 使用 `.todo` 作为占位测试 {#placeholder-tests-with-todo}

在规划新功能时，你可能在编写实际实现之前，就知道需要哪些测试。`.todo` 用于将测试标记为已计划但尚未编写。它会作为提醒显示在报告中：

```ts
import { describe, it } from 'vitest'

describe.todo('unimplemented suite')

describe('suite', () => {
  it.todo('unimplemented test')
})
```

与 `.skip` 不同，`.todo` 测试没有测试体。它纯粹是为后续工作预留的占位符。
