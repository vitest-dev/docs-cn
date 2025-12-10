---
title: Vitest 3.2 发布了！
author:
  name: Vitest 团队
date: 2025-06-02
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vitest 3.2 发布了
  - - meta
    - property: og:image
      content: https://cn.vitest.dev/og-vitest-3-2.png
  - - meta
    - property: og:url
      content: https://cn.vitest.dev/blog/vitest-3-2
  - - meta
    - property: og:description
      content: Vitest 3.2 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vitest 3.2 发布了！

_2025 年 6 月 2 日_

![Vitest 3.2 公告封面图](/og-vitest-3-2.png)

Vitest 3.2 专注于改进浏览器模式和 TypeScript 支持。此版本还包含一些新的实用方法、配置选项，并弃用了 `workspace` 配置，转而推荐使用 `projects`。

## `workspace` 已弃用 {#workspace-is-deprecated}

为了简化配置，团队决定弃用单独的 `vitest.workspace` 文件，推荐仅在根配置中使用 `projects` 选项。这也简化了全局选项的配置方式（因为当你没有根配置时，不需要再猜测如何添加报告器）。

我们还决定弃用 `workspace` 这个名称，因为它与 PNPM 等工具通过该选项提供 monorepo 支持功能存在冲突。Vitest 不会为这些项目分配独立的 `工作目录（CWD）`，而是将其视为子 Vitest 实例。这也为我们提供了更多空间，以便在不破坏其他功能的情况下为 monorepo 提供更好的解决方案。

此选项将在未来的主版本中完全移除，由 `projects` 取代。在此之前，如果使用了 workspace 功能，Vitest 将打印警告。

<!--@include: ../guide/examples/projects-workspace.md-->

## 注释 API {#annotation-api}

新的 [注释 API](/guide/test-annotations) 允许你为任何测试添加自定义消息和附件。这些注释在 UI、HTML、junit、tap 和 GitHub Actions 报告器中可见。如果测试失败，Vitest 还会在 CLI 中打印相关注释。

<img src="/annotation-api-cute-puppy-example.png" />

## 作用域固定装置 {#scoped-fixtures}

`test.extend` 固定装置现在可以指定 `scope` 选项：`file` 或 `worker`。

```ts
const test = baseTest.extend({
  db: [
    async ({}, use) => {
      // ...setup
      await use(db)
      await db.close()
    },
    { scope: 'worker' },
  ],
})
```

`file` 固定装置类似于在文件顶层使用 `beforeAll` 和 `afterAll`，但如果没有任何测试使用该固定装置，它就不会被调用。

`worker` 固定装置在每个工作线程中仅初始化一次。但请注意，默认情况下 Vitest 为每个测试创建独立工作线程，因此需要禁用 [隔离模式](/config/#isolate) 才能生效。

## 自定义项目名称颜色 {#custom-project-name-colors}

使用 `projects` 时，你现在可以设置自定义 [颜色](/config/#name)：

::: details 配置示例
```ts{6-9,14-17}
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: {
            label: 'unit',
            color: 'red',
          },
        },
      },
      {
        test: {
          name: {
            label: 'browser',
            color: 'green',
          },
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
```
:::

<img src="/v3-2-custom-colors.png" />

## 自定义浏览器定位器 API {#custom-browser-locators-api}

当内置定位器无法满足应用需求时。与其降级使用 CSS 选择器，并牺牲 Vitest 定位器 API 提供的重试保护机制，不如推荐你使用 [`locators.extend` API](/guide/browser/locators#custom-locators) 扩展定位器。

```ts
import { locators } from '@vitest/browser/context'

locators.extend({
  getByCommentsCount(count: number) {
    return `.comments :text("${count} comments")`
  },
})
```

返回 Playwright [定位器字符串](https://playwright.dev/docs/other-locators)来构造新的定位器。请注意，从此方法返回的字符串将用作于父定位器范围内（如果有的话）。

现在你可以直接在 `page` 对象或任何其他定位器上调用 `getByCommentsCount`：

```ts
await expect.element(page.getByCommentsCount(1)).toBeVisible()
await expect.element(
  page.getByRole('article', { name: 'Hello World' })
    .getByCommentsCount(1)
).toBeVisible()
```

如果此方法返回字符串，返回值将被转换为定位器对象，因此你可以继续链式调用：

```ts
page.getByRole('article', { name: 'Hello World' })
  .getByCommentsCount(1)
  .getByText('comments')
```

此方法可以访问当前的定位器上下文（如果有的话，在 `page` 对象上调用时，则上下文指向 `page`），因此你可以在内部链式调用所有定位器方法：

```ts
import type { Locator } from '@vitest/browser/context'
import { locators } from '@vitest/browser/context'

locators.extend({
  getByCommentsCount(this: Locator, count: number) {
    return this.getByRole('comment')
      .and(this.getByText(`${count} comments`))
  },
})
```

通过访问上下文，你还可以调用定位器的常规方法来定义自定义用户事件：

```ts
import type { Locator } from '@vitest/browser/context'
import { locators, page } from '@vitest/browser/context'

locators.extend({
  clickAndFill(this: Locator, text: string) {
    await this.click()
    await this.fill(text)
  },
})

await page.getByRole('textbox').clickAndFill('Hello World')
```

请参阅 [`locators.extend` API](/guide/browser/locators#custom-locators) 获取更多信息。

## `vi.spyOn` 和 `vi.fn` 中的显式资源管理 {#explicit-resource-management-in-vi-spyon-and-vi-fn}

在支持 [显式资源管理](https://github.com/tc39/proposal-explicit-resource-management) 的环境中，你可以使用 `using` 代替 `const`，以便在包含块退出时自动对任何模拟函数调用 `mockRestore`。这对于监听方法特别有用：

```ts
it('calls console.log', () => {
  using spy = vi.spyOn(console, 'log').mockImplementation(() => {})
  debug('message')
  expect(spy).toHaveBeenCalled()
})

// console.log 在此处还原
```

## 测试 `signal` API {#test-signal-api}

Vitest 现在向测试主体提供一个 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 对象。你可以使用它来停止任何支持此 Web API 的资源。

当测试超时、其他测试失败且 [`--bail` 标志](/config/#bail) 设置为非零值，或者用户在终端中按下 Ctrl+C 时，信号会被中止。

例如，你可以在测试中断时停止 `fetch` 请求：

```ts
it('stop request when test times out', async ({ signal }) => {
  await fetch('/heavy-resource', { signal })
}, 2000)
```

## Coverage V8 AST 感知重映射 {#coverage-v8-ast-aware-remapping}

Vitest 现在使用由 Vitest 维护者之一 [AriPerkkio](https://github.com/AriPerkkio) 开发的 `ast-v8-to-istanbul` 包。这使 v8 覆盖率报告与 istanbul 保持一致，但性能更好！通过将 [`coverage.experimentalAstAwareRemapping`](/config/#coverage-experimentalastawareremapping) 设置为 `true` 来启用此功能。

我们计划在下一个主版本中将此作为默认重映射模式。旧的 `v8-to-istanbul` 将被完全移除。欢迎在 https://github.com/vitest-dev/vitest/issues/7928 参与讨论。

## `watchTriggerPatterns` 选项 {#watchtriggerpatterns-option}

当你编辑文件时，Vitest 会智能地仅重新运行导入该文件的测试。遗憾的是，Vitest 的静态分析只支持静态和动态 `import` 语句。如果你通过文件读取或启动单独的进程，Vitest 将忽略相关文件的更改。

使用 `watchTriggerPatterns` 选项，你可以配置根据更改的文件重新运行哪些测试。例如，如果想要在更改模板时始终重新运行 `mailers` 测试，可以添加一个触发模式：

```ts
export default defineConfig({
  test: {
    watchTriggerPatterns: [
      {
        pattern: /^src\/templates\/(.*)\.(ts|html|txt)$/,
        testsToRun: (file, match) => {
          return `api/tests/mailers/${match[2]}.test.ts`
        },
      },
    ],
  },
})
```

## 新的多用途 `Matchers` 类型 {#the-new-multi-purpose-matchers-type}

Vitest 现在有一个 `Matchers` 类型，你可以扩展它来在一个地方为所有自定义匹配器添加类型支持。此类型影响以下所有用例：

- `expect().to*`
- `expect.to*`
- `expect.extend({ to* })`

例如，要拥有一个类型安全的 `toBeFoo` 匹配器，你可以这样写：

```ts twoslash
import { expect } from 'vitest'

interface CustomMatchers<R = unknown> {
  toBeFoo: (arg: string) => R
}

declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}

expect.extend({
  toBeFoo(actual, arg) {
    //            ^?
    // 具体实现...
    return {
      pass: true,
      message: () => '',
    }
  }
})

expect('foo').toBeFoo('foo')
expect.toBeFoo('foo')
```

## `sequence.groupOrder`

新的 [`sequence.groupOrder`](/config/#grouporder) 选项控制在使用多个 [projects](/guide/projects) 时项目测试执行的顺序。

- 具有相同分组序号的测试项目将并行运行，各组按序号从低到高依次执行。
- 若未设置此选项，所有项目将默认并行执行。
- 当多个项目使用相同分组序号时，它们将同时执行。

::: details 示例
考虑这个例子：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'slow',
          sequence: {
            groupOrder: 0,
          },
        },
      },
      {
        test: {
          name: 'fast',
          sequence: {
            groupOrder: 0,
          },
        },
      },
      {
        test: {
          name: 'flaky',
          sequence: {
            groupOrder: 1,
          },
        },
      },
    ],
  },
})
```

这些项目中的测试将按以下顺序运行：

```
 0. slow  |
          |> 并行执行
 0. fast  |

 1. flaky |> 在 slow 和 fast 之后单独运行
```
:::

----

完整的更改列表请查看 [Vitest 3.2 更新日志](https://github.com/vitest-dev/vitest/releases/tag/v3.2.0)。
