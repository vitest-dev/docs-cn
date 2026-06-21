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

## browser.locators.errorFormat <Version>5.0.0</Version> {#browser-locators-errorformat}

- **类型:** `'html' | 'aria' | 'all'`
- **默认值:** `'all'`

控制当定位器找不到元素时 Vitest 打印的内容。Vitest 会打印定位器搜索所运行的 DOM 子树的信息，对于页面级定位器则打印 `document.body` 的信息。

- `'html'` 使用 [`utils.prettyDOM`](/api/browser/context#prettydom) 将该 DOM 子树以 HTML 格式打印。
- `'aria'` 将该 DOM 子树以 [ARIA 快照](/guide/browser/aria-snapshots) 格式打印，重点关注无障碍角色、名称和状态。
- `'all'` 先打印 ARIA 快照，然后是 HTML 输出。

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

例如，`all` 会显示如下错误：

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
