---
title: browser.traceView | 配置
outline: deep
---

# browser.traceView <Version>5.0.0</Version>

<<<<<<< HEAD
- **类型:** `boolean | { enabled?: boolean; recordCanvas?: boolean; inlineImages?: boolean }`
- **命令行终端:** `--browser.traceView`
- **默认值:** `false`

启用浏览器测试的 trace-view（追踪视图）收集功能。Vitest 会捕获浏览器交互的 DOM 快照，当启用浏览器 UI 模式、UI 模式 或 HTML 报告器时，可在这些界面中无需外部工具直接展示。
=======
- **Type:** `boolean | 'off' | 'on' | 'failure-only' | { mode?: 'off' | 'on' | 'failure-only'; recordCanvas?: boolean; inlineImages?: boolean; ariaSnapshot?: boolean }`
- **CLI:** `--browser.traceView`
- **Default:** `'failure-only'`

Records the actions, assertions, and marks of browser tests with DOM snapshots, so you can replay them in the [trace viewer](/guide/browser/trace-view).

Set it to a [mode](#traceview-mode) such as `'failure-only'`, or use `true` and `false` as shorthands for `'on'` and `'off'`:
>>>>>>> cc54eaf52775a7aaede1f9affab7dec045c6c71b

```ts
export default defineConfig({
  test: {
    browser: {
      traceView: true,
    },
  },
})
```

<<<<<<< HEAD
使用对象形式可启用额外的快照保真度选项：
=======
To combine a mode with the options below, use an object:
>>>>>>> cc54eaf52775a7aaede1f9affab7dec045c6c71b

```ts
export default defineConfig({
  test: {
    browser: {
      traceView: {
        mode: 'on',
        inlineImages: true,
      },
    },
  },
})
```

<<<<<<< HEAD
| 选项           | 默认值  | 详情                                                                          |
| -------------- | ------- | ----------------------------------------------------------------------------- |
| `enabled`      | `false` | 启用 Vitest trace-view 收集产物。                                             |
| `inlineImages` | `false` | 将加载的 `<img>` 像素内联到快照中，实现更便捷的回放功能，适用于 HTML 报告器。 |
| `recordCanvas` | `false` | 在快照中捕获 canvas 像素。                                                    |
=======
## browser.traceView.mode <Version>5.1.0</Version> {#traceview-mode}
>>>>>>> cc54eaf52775a7aaede1f9affab7dec045c6c71b

- **Type:** `'off' | 'on' | 'failure-only'`
- **Default:** `'failure-only'`
- **CLI:** `--browser.traceView.mode <mode>`

<<<<<<< HEAD
- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--browser.traceView.enabled`

启用 Vitest 追踪视图构建产物收集。
=======
Sets which tests trace view records and what each trace keeps:

- `'failure-only'` records only failed tests. Each trace keeps every step and a snapshot of the page when the test failed.
- `'on'` records every test with a snapshot at each step, and Vitest UI shows the steps live as tests run.
- `'off'` records nothing.
>>>>>>> cc54eaf52775a7aaede1f9affab7dec045c6c71b

## browser.traceView.inlineImages {#traceview-inlineimages}

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--browser.traceView.inlineImages`

<<<<<<< HEAD
将加载的 `<img>` 像素内联到快照中，实现更便捷的回放功能，适用于 HTML 报告器。
=======
Inlines loaded `<img>` pixels into snapshots, so the HTML report renders them without loading the original URLs. See [What Snapshots Capture](/guide/browser/trace-view#what-snapshots-capture) for details.
>>>>>>> cc54eaf52775a7aaede1f9affab7dec045c6c71b

## browser.traceView.recordCanvas {#traceview-recordcanvas}

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--browser.traceView.recordCanvas`

<<<<<<< HEAD
在快照中捕获 canvas 像素。这会启用较弱的回放 iframe 沙盒，因为 rrweb 需要脚本重绘 canvas数据。

完整文档请参阅 [追踪视图](/guide/browser/trace-view)。
=======
Captures canvas pixels in snapshots. The trace viewer then allows scripts in its replay iframe for these traces. See the canvas replay sandbox warning in [What Snapshots Capture](/guide/browser/trace-view#what-snapshots-capture).

## browser.traceView.ariaSnapshot <Version>5.1.0</Version> {#traceview-ariasnapshot}

- **Type:** `boolean`
- **Default:** `true`
- **CLI:** `--browser.traceView.ariaSnapshot`

Captures the accessibility tree of the page alongside each snapshot, so you can switch the trace viewer's snapshot pane between **DOM** and **Aria** views. The Aria view uses the same format as [aria snapshots](/guide/browser/aria-snapshots).

## browser.traceView.enabled <Deprecated /> {#traceview-enabled}

- **Type:** `boolean`
- **CLI:** `--browser.traceView.enabled`

Use [`mode`](#traceview-mode) instead. `true` is the same as `mode: 'on'`, and `false` is the same as `mode: 'off'`. When both are set, `mode` wins.
>>>>>>> cc54eaf52775a7aaede1f9affab7dec045c6c71b
