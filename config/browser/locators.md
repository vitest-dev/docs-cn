---
title: browser.locators | 配置
outline: deep
---

# browser.locators

内置 [浏览器定位器](/api/browser/locators) 的选项。

## browser.locators.testIdAttribute

- **类型:** `string`
- **默认值:** `data-testid`

用于通过 `getByTestId` 定位器查找元素的属性。

## browser.locators.exact <Version type="experimental">4.1.3</Version> {#browser-locators-exact}

- **类型:** `boolean`
- **默认值:** `false`

当设置为 `true` 时，[定位器](/api/browser/locators) 默认会执行精确文本匹配，要求完全且区分大小写的匹配。单个定位器调用可通过自身的 `exact` 选项覆盖此默认行为。

```ts
// 当 exact: false（默认值）时，会匹配 "Hello, World!"、"Say Hello, World" 等文本
// 当 exact: true 时，仅精确匹配字符串 "Hello, World"
const locator = page.getByText('Hello, World', { exact: true })
await locator.click()
```
