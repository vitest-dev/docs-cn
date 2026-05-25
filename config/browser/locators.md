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

## browser.locators.exact

- **类型:** `boolean`
- **默认值:**  `true`

当设置为 `true` 时，[定位器](/api/browser/locators) 默认会执行精确文本匹配，要求完全且区分大小写的匹配。单个定位器调用可通过自身的 `exact` 选项覆盖此默认行为。

```ts
// 当 exact: true（默认值）时，仅精确匹配字符串 "Hello, World"
// 当 exact: false 时，会匹配 "Hello, World!"、"Say Hello, World" 等文本
const locator = page.getByText('Hello, World', { exact: true })
await locator.click()
```
<!-- TODO: translation -->
## browser.locators.errorFormat <Version>5.0.0</Version> {#browser-locators-errorformat}

- **Type:** `'html' | 'aria' | 'all'`
- **Default:** `'all'`

Controls what Vitest prints when a locator cannot find an element. Vitest prints information for the DOM subtree where the locator search ran, or `document.body` for page-level locators.

- `'html'` prints that DOM subtree as HTML using [`utils.prettyDOM`](/api/browser/context#prettydom).
- `'aria'` prints that DOM subtree as an [ARIA snapshot](/guide/browser/aria-snapshots), which focuses on accessible roles, names, and state.
- `'all'` prints the ARIA snapshot first, followed by the HTML output.

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      locators: {
        errorFormat: 'aria',
      },
    },
  },
})
```

For example, `all` displays a following error:

```html
VitestBrowserElementError: Cannot find element with locator: getByRole('button', { name: 'Save' })

ARIA tree:
- main:
  - heading "Settings" [level=1]
  - button "Cancel"

HTML:
<body>
  <main>
    <h1>
      Settings
    </h1>
    <button>
      Cancel
    </button>
  </main>
</body>
```
