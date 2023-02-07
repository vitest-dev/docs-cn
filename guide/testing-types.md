---
title: Testing Types | Guide
---

# 类型测试

Vitest 允许你使用 `expectTypeOf` 或 `assertType` 语法为你的类型编写测试。默认情况下，`*.test-d.ts` 文件中的所有测试都被视为类型测试，但你可以使用 [`typecheck.include`](/config/#typecheck-include) 配置选项更改它。

在这里，Vitest 调用 `tsc` 或 `vue-tsc`，具体取决于你的配置，并解析结果。如果发现任何类型错误，Vitest 还会在你的源代码中打印出类型错误。你可以使用 [`typecheck.ignoreSourceErrors`](/config/#typecheck-ignoresourceerrors) 配置选项禁用它。

请记住，Vitest 不运行或编译这些文件，它们仅由编译器静态分析，因此你不能使用任何动态语句。这意味着，你不能使用动态测试名称和 `test.each`、`test.runIf`、`test.skipIf`、`test.each`、`test.concurrent` API。但是你可以使用其他 API，例如 `test`、`describe`、`.only`、`.skip` 和 `.todo`。

使用 CLI 标志，如 `--allowOnly` 和 `-t` 也支持类型检查。

```ts
import { assertType, expectTypeOf } from 'vitest'
import { mount } from './mount.js'

test('my types work properly', () => {
  expectTypeOf(mount).toBeFunction()
  expectTypeOf(mount).parameter(0).toMatchTypeOf<{ name: string }>()

  // @ts-expect-error name is a string
  assertType(mount({ name: 42 }))
})
```

在测试文件中触发的任何类型错误都将被视为测试错误，因此你可以使用任何类型技巧来测试项目中的类型。

您可以在 [API 部分](/api/#expecttypeof) 中查看可能的匹配器列表。

## 读取错误

如果你使用的是 `expectTypeOf` API，可能会注意到难以阅读的错误或意外的错误：

```ts
expectTypeOf(1).toEqualTypeOf<string>()
//             ^^^^^^^^^^^^^^^^^^^^^^
// index-c3943160.d.ts(90, 20): Arguments for the rest parameter 'MISMATCH' were not provided.
```

这是由于 [`expect-type`](https://github.com/mmkal/expect-type) 处理类型错误的方式。

不幸的是，TypeScript 在不打补丁的情况下不提供类型元数据，因此我们目前无法提供有用的错误消息，但是有 <a href="https://github.com/microsoft/TypeScript/pull/40468" tatger=" _blank">在 TypeScript 项目中工作</a> 来解决这个问题。如果你想要更好的消息，请让 TypeScript 团队查看提到的 PR。

如果你发现很难使用 `expectTypeOf` API 并找出错误，你始终可以使用更简单的 `assertType` API：

```ts
const answer = 42

assertType<number>(answer)
// @ts-expect-error answer is not a string
assertType<string>(answer)
```

::: tip
使用 `@ts-expect-error` 语法时，你可能想确保没有输入错误。你可以通过在 [`test.include`](/config/#include) 配置选项中包含您的类型文件来做到这一点，因此 Vitest 实际上也会*运行*这些测试并因 `ReferenceError` 而失败。

这将通过，因为它预计会出现错误，但 “answer” 这个词有错别字，所以这是一个误报错误：

```ts
// @ts-expect-error answer is not a string
assertType<string>(answr) //
```

:::

## 运行 typechecking

在 `package.json` 文件 `scripts` 部分添加如下命令：

```json
{
  "scripts": {
    "typecheck": "vitest typecheck"
  }
}
```

现在你可以运行 typecheck:

```sh
# npm
npm run typecheck

# yarn
yarn typecheck

# pnpm
pnpm run typecheck
```

Vitest 使用 `tsc --noEmit` 或 `vue-tsc --noEmit`，具体取决于你的配置，因此可以从管道中删除这些脚本。
