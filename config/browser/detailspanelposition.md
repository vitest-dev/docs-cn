---
title: browser.detailsPanelPosition | 配置
outline: deep
---

# browser.detailsPanelPosition

- **类型:** `'right' | 'bottom'`
- **默认值:** `'right'`
- **命令行终端:** `--browser.detailsPanelPosition=bottom`, `--browser.detailsPanelPosition=right`

控制运行浏览器测试时 UI 模式中详情面板的默认位置。

- `'right'` - 在右侧显示详情面板，采用浏览器视窗与详情面板的水平分割布局。
- `'bottom'` - 在底部显示详情面板，采用浏览器视窗与详情面板的垂直分割布局。

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      detailsPanelPosition: 'bottom', // 或 'right'
    },
  },
})
```

## 示例 {#example}

::: tabs
== bottom
<center>
  <img alt="Vitest UI with details at the bottom" img-light src="/ui/light-ui-details-bottom.png">
  <img alt="Vitest UI with details at the bottom" img-dark src="/ui/dark-ui-details-bottom.png">
</center>
== right
<center>
  <img alt="Vitest UI with details at the right side" img-light src="/ui/light-ui-details-right.png">
  <img alt="Vitest UI with details at the right side" img-dark src="/ui/dark-ui-details-right.png">
</center>
:::
