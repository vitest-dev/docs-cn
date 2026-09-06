---
title: browser.traceView | 配置
outline: deep
---

# browser.traceView <Badge type="warning" text="Experimental" /> <Version>5.0.0</Version>

- **类型:** `boolean | { enabled?: boolean; recordCanvas?: boolean; inlineImages?: boolean }`
- **命令行终端:** `--browser.traceView`
- **默认值:** `false`

启用浏览器测试的 trace-view（追踪视图）收集功能。Vitest 会捕获浏览器交互的 DOM 快照，当启用浏览器 UI 模式、UI 模式 或 HTML 报告器时，可在这些界面中无需外部工具直接展示。

```ts
export default defineConfig({
  test: {
    browser: {
      traceView: true,
    },
  },
})
```

使用对象形式可启用额外的快照保真度选项：

```ts
export default defineConfig({
  test: {
    browser: {
      traceView: {
        enabled: true,
        inlineImages: true,
        recordCanvas: true,
      },
    },
  },
})
```

| 选项 | 默认值 | 详情 |
| --- | --- | --- |
| `enabled` | `false` | 启用 Vitest trace-view 收集产物。 |
| `inlineImages` | `false` | 将加载的 `<img>` 像素内联到快照中，实现更便捷的回放功能，适用于 HTML 报告器。 |
| `recordCanvas` | `false` | 在快照中捕获 canvas 像素。 |

## browser.traceView.enabled {#traceview-enabled}

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--browser.traceView.enabled`

启用 Vitest 追踪视图构建产物收集。

## browser.traceView.inlineImages {#traceview-inlineimages}

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--browser.traceView.inlineImages`

将加载的 `<img>` 像素内联到快照中，实现更便捷的回放功能，适用于 HTML 报告器。

## browser.traceView.recordCanvas {#traceview-recordcanvas}

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--browser.traceView.recordCanvas`

在快照中捕获 canvas 像素。这会启用较弱的回放 iframe 沙盒，因为 rrweb 需要脚本重绘 canvas数据。

完整文档请参阅 [追踪视图](/guide/browser/trace-view)。
