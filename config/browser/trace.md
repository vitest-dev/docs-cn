---
title: browser.trace | 配置
outline: deep
---

# browser.trace

- **类型:** `'on' | 'off' | 'on-first-retry' | 'on-all-retries' | 'retain-on-failure' | object`
- **命令行终端:** `--browser.trace=on`, `--browser.trace=retain-on-failure`
- **默认值:** `'off'`

捕获浏览器测试运行的追踪记录。你可以通过 [Playwright Trace Viewer](https://trace.playwright.dev/) 预览追踪文件。

完整工作流程请参阅 [Playwright 追踪](/guide/browser/playwright-traces)。

该选项支持以下取值：

- `'on'` - 为所有测试捕获追踪记录（不推荐，因性能消耗较大）
- `'off'` - 不捕获追踪记录
- `'on-first-retry'` - 仅在首次重试测试时捕获追踪记录
- `'on-all-retries'` - 在每次测试重试时都捕获追踪记录
- `'retain-on-failure'` - 仅捕获失败测试的追踪记录，并自动删除通过测试的追踪文件
- `object` - 符合以下接口规范的对象：

```ts
interface TraceOptions {
  mode: 'on' | 'off' | 'on-first-retry' | 'on-all-retries' | 'retain-on-failure'
  /**
   * 所有追踪记录的存储目录。默认情况下，
   * Vitest 会将所有追踪记录保存在测试文件附近的 `__traces__` 文件夹中
   */
  tracesDir?: string
  /**
   * 是否在追踪过程中捕获屏幕截图。截图将用于构建时间轴预览
   * @default true
   */
  screenshots?: boolean
  /**
   * 如果启用此选项，追踪过程将：
   * - 捕获每个操作时 DOM 快照
   * - 记录网络活动
   * @default true
   */
  snapshots?: boolean
}
```

::: danger 警告
此选项仅支持使用 [**playwright**](/config/browser/playwright) 驱动。
:::
