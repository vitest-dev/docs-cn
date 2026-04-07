---
title: browser.instances | 配置
outline: deep
---

# browser.instances

- **类型:** `BrowserConfig`
- **默认值:** `[]`

定义多个浏览器配置。每个配置必须至少包含一个 `browser` 字段。

你可以指定大多数 [项目选项](/config/)（未标记<CRoot />图标的）以及部分 `browser` 选项，如 `browser.testerHtmlPath`。

::: warning
每个浏览器配置都会继承根配置的选项：

```ts{3,9} [vitest.config.ts]
export default defineConfig({
  test: {
    setupFile: ['./root-setup-file.js'],
    browser: {
      enabled: true,
      testerHtmlPath: './custom-path.html',
      instances: [
        {
          // 将同时包含 "root" 和 "browser" 两个全局初始化文件
          setupFile: ['./browser-setup-file.js'],
          // 隐式继承根配置的"testerHtmlPath" // [!code warning]
          // testerHtmlPath: './custom-path.html', // [!code warning]
        },
      ],
    },
  },
})
```

更多示例请参阅 [“多环境配置” 指南](/guide/browser/multiple-setups)。
:::

可用的 `browser` 选项列表：

- `browser` (浏览器名称)
- [`headless`](/config/browser/headless)
- [`locators`](/config/browser/locators)
- [`viewport`](/config/browser/viewport)
- [`testerHtmlPath`](/config/browser/testerhtmlpath)
- [`screenshotDirectory`](/config/browser/screenshotdirectory)
- [`screenshotFailures`](/config/browser/screenshotfailures)
- [`provider`](/config/browser/provider)

Vitest 在底层将这些实例转换为独立的 [测试项目](/api/advanced/test-project)，共享同一个 Vite 服务器以提升缓存性能。
