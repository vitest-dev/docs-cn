---
title: 扩展浏览器定位器 | 技巧
---

# 领域定位器 {#domain-locators}

内置的 [定位器](/api/browser/locators) 如 `getByRole` 和 `getByText` 覆盖了映射到无障碍属性的查询。当应用具有不符合 ARIA 的结构时，例如 “带有 N 条回复的评论” 或自定义表格组件中的行，它们就无能为力了。

备选方案是使用 `querySelector`。结果是普通查询而非定位器，虽然可以工作，因此你会失去自动重试和严格模式保护。

[`locators.extend`](/api/browser/locators#custom-locators) <Version>3.2.0</Version> 可以在继承定位器 API 特性的前提下，添加一个领域特定的定位器。该方法返回的值仍然是定位器，通过这样方式自定义方法继承了定位器的自动重试、严格模式保护和链式调用功能。你为这些方法命名的名称会成为团队测试词汇的一部分：`page.getByCard({ id: 'product-1' })` 读起来是领域语言而非 DOM，并且同一名称会在整个测试套件中保持一致。

## 返回 Playwright 字符串 {#returning-a-playwright-string}

最简单的形式返回一个 [Playwright 定位器字符串](https://playwright.dev/docs/other-locators)。Vitest 将返回的字符串视为调用该定位器方法的子查询：当在 `page` 上调用时，将会在整个页面中查找；当在父定位器上调用时，查找范围限定在该父定位器的子树内。

当新的查询无法使用内置定位器恰当表达时，可以使用这种形式，例如对于没有对应内置角色的组件使用 CSS-with-text 选择器，或者对于你无法控制的遗留组件使用 XPath。

```ts
import { locators } from 'vitest/browser'

locators.extend({
  getByCommentsCount(count: number) {
    return `.comments :text("${count} comments")`
  },
})
```

```ts
import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

test('article shows comment count', async () => {
  await expect.element(page.getByCommentsCount(1)).toBeVisible()
  await expect.element(
    page.getByRole('article', { name: 'Hello World' })
      .getByCommentsCount(1)
  ).toBeVisible()
})
```

## 组合现有定位器 {#composing-existing-locators}

当你返回的是定位器而不是字符串时，Vitest 会直接使用该定位器。在扩展方法内部，`this` 会绑定到调用该方法的定位器上（顶层调用时则绑定到 `page`），因此你可以链式组合现有定位器，或通过 `filter` 表达那些单个内置方法无法描述的元素关系。

下面示例使用 `filter({ has })` 将行定位器收窄到包含指定 name 按钮的那些行，把常见的匹配 “每行操作按钮” 封装成一个具名查询：

```ts
import { locators } from 'vitest/browser'
import type { Locator } from 'vitest/browser'

locators.extend({
  getRowWithAction(this: Locator, action: string) {
    return this.getByRole('row').filter({
      has: this.getByRole('button', { name: action }),
    })
  },
})
```

```ts
await page.getRowWithAction('Delete').first().click()
```

当这两种方式都能表达查询时，优先选择上述这种形式而不是原始字符串形式。内置定位器具备无障碍语义的查找、链式调用和过滤器机制。只有在无法通过内置定位器的组合覆盖查询时，再退回到原始字符串形式，如果选择了字符串形式则放弃内置定位器的优势。

## 自定义交互操作 {#custom-interactions}

执行交互操作且不返回定位器的方法同样可行。这与构建用户操作 DSL 使用相同机制，与查询方法一起定义，使测试词汇保持一致。

`locators.extend` 将 `this` 的类型标注为 `BrowserPage | Locator`，因为自定义方法可能调用任意一个。这对于查询工具函数来说没问题，因为 `getByRole` 和其他查询方法在两者上都存在。对于交互工具函数则不然：`page` 没有 `click` 或 `fill` 方法，因此调用 `page.clickAndFill('x')` 会在运行时报错。可以将 `this` 与 `page` 单例进行比较来防范这种情况，这样 TypeScript 能在抛出错误后将 `this` 类型收窄为 `Locator`：

```ts
import { locators, page } from 'vitest/browser'
import type { BrowserPage, Locator } from 'vitest/browser'

locators.extend({
  async clickAndFill(this: BrowserPage | Locator, text: string) {
    if (this === page) {
      throw new TypeError(
        'clickAndFill must be called on a locator, like page.getByRole(\'textbox\').clickAndFill(...)',
      )
    }
    await this.click()
    await this.fill(text)
  },
})

await page.getByRole('textbox').clickAndFill('Hello World')
```

这种交互方法不会组合成定位器。`page.getByRole('textbox').clickAndFill('Hello')` 可以正常工作的原因是 `getByRole` 返回的是定位器；`page.clickAndFill('Hello')` 则会触发类型保护。上述追溯形式仅适用于扩展操作工具函数，并不适用扩展查询工具函数。

## 扩展定位器类型 {#augmenting-locator-types}

`locators.extend` 属于运行时注册。TypeScript 在类型层面并不知道这些新增方法，除非你在一个共享的 `.d.ts` 声明文件显式扩展 [`LocatorSelectors`](/api/browser/locators) 接口。

```ts
import 'vitest/browser'

declare module 'vitest/browser' {
  interface LocatorSelectors {
    getByCommentsCount: (count: number) => Locator
    getRowWithAction: (action: string) => Locator
    clickAndFill: (text: string) => Promise<void>
  }
}
```

`LocatorSelectors` 是 `Locator` 和 `BrowserPage` 联合接口，所以你在这里声明的方法会同时出现在两者上。这也和 `locators.extend` 的运行时行为一致。正因如此，`clickAndFill` 这类交互工具方法才需要上面的保护：TypeScript 允许 `page.clickAndFill('x')` 通过类型检查，但运行时保护会在调用不存在的方法前先报错。

## 相关链接 {#see-also}

- [自定义定位器 API](/api/browser/locators#custom-locators)
- [内置定位器](/api/browser/locators)
- [Playwright “其他定位器”](https://playwright.dev/docs/other-locators)
