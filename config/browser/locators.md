---
title: browser.locators | Config
outline: deep
---

# browser.locators

内置 [浏览器定位器](/api/browser/locators) 的选项。

## browser.locators.testIdAttribute

- **类型:** `string`
- **默认值:** `data-testid`

用于通过 `getByTestId` 定位器查找元素的属性。
<!-- TODO: translation -->
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
