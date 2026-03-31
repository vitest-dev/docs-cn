---
title: browser.locators | Config
outline: deep
---

# browser.locators

内置 [浏览器定位器](/api/browser/locators) 的选项。

## browser.locators.testIdAttribute

- **类型:** `string`
- **默认值:** `data-testid`

<<<<<<< HEAD
用于通过 `getByTestId` 定位器查找元素的属性。
=======
Attribute used to find elements with `getByTestId` locator.

## browser.locators.exact <Version type="experimental">4.1.3</Version> {#browser-locators-exact}

- **Type:** `boolean`
- **Default:** `false`

When set to `true`, [locators](/api/browser/locators) will match text exactly by default, requiring a full, case-sensitive match. Individual locator calls can override this default via their own `exact` option.

```ts
// With exact: false (default), this matches "Hello, World!", "Say Hello, World", etc.
// With exact: true, this only matches the string "Hello, World" exactly.
const locator = page.getByText('Hello, World', { exact: true })
await locator.click()
```
>>>>>>> ab4222a4c4bd8d175537000fb1b0f6b7334065c3
