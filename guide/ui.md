---
title: Vitest UI | 指南
---

# UI 模式 {#vitest-ui}

Vitest 由 Vite 提供能力，在运行测试时有一个开发服务器。这允许 Vitest 提供一个漂亮的 UI 界面来查看并与测试交互。Vitest 的 UI 界面是可选的，你可以通过以下安装：

```bash
npm i -D @vitest/ui
```

接下来，你可以通过传入 `--ui` 参数来启动测试的 UI 界面：

```bash
vitest --ui
```

最后，你可以访问 Vitest UI 界面，通过 <a href="http://localhost:51204/__vitest__/">`http://localhost:51204/__vitest__/`</a>

::: warning
UI 是交互式的，需要一个正在运行的 Vite 服务器，因此请确保在 `watch` 模式（默认模式）下运行 Vitest。或者，你可以通过在配置的 `reporters` 选项中指定 `html` 来生成一个与 Vitest UI 完全相同的静态 HTML 报告。
:::

<img alt="Vitest UI" img-light src="/ui-1-light.png">
<img alt="Vitest UI" img-dark src="/ui-1-dark.png">

UI 也可以用作测试报告器。 在 Vitest 配置中使用 `'html'` 报告器生成 HTML 输出并预览测试结果：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['html'],
  },
})
```

你可以在 Vitest UI 中查看覆盖率报告：查看 [覆盖率 | UI 模式](/guide/coverage#vitest-ui) 了解更多详情。

::: warning
如果你仍想在终端中实时查看测试的运行情况，请不要忘记将 `default` 报告器添加到 `reporters` 选项：`['default', 'html']`。
:::

::: tip
要预览你的 HTML 报告，可以使用 [vite preview](https://vitejs.dev/guide/cli.html#vite-preview) 命令：

```sh
npx vite preview --outDir ./html
```

你可以使用 [`outputFile`](/config/outputfile) 配置选项配置输出。你需要在那里指定 `.html` 路径。例如，`./html/index.html` 是默认值。
:::

## 模块图 {#module-graph}

模块图选项卡显示所选测试文件的模块图。

::: info
所有示例图片均使用 [Zammad](https://github.com/zammad/zammad) 代码库作为演示。
:::

<img alt="The module graph view" img-light src="/ui/light-module-graph.png">
<img alt="The module graph view" img-dark src="/ui/dark-module-graph.png">

如果模块数量超过 50 个时，模块图默认仅显示前两层结构以减少视觉干扰。你可以随时点击 "Show Full Graph" 图标来查看完整图表。

<center>
  <img alt="The 'Show Full Graph' button located close to the legend" img-light src="/ui/light-ui-show-graph.png">
  <img alt="The 'Show Full Graph' button located close to the legend" img-dark src="/ui/dark-ui-show-graph.png">
</center>

::: warning
注意：如果你的模块规模过大，节点位置可能需要一些时间才能稳定下来。
:::

你可以随时点击 "Reset" 来恢复入口模块图。右键点击或按住 <kbd>Shift</kbd> 键，可展开查看与改节点相关的所有模块。

默认情况下，Vitest 会隐藏 `node_modules` 中的模块。通常，这些模块会被外部化。可以取消勾选 "Hide node_modules" 来显示它们。

### 模块信息 {#module-info}

通过左键点击模块节点，你可以打开模块信息视图。

<img alt="The module info view for an inlined module" img-light src="/ui/light-module-info.png">
<img alt="The module info view for an inlined module" img-dark src="/ui/dark-module-info.png">

此视图分为上下两部分。顶部显示完整的模块 ID 和一些关于模块的诊断信息。如果启用了 [`experimental.fsModuleCache`](/config/experimental#experimental-fsmodulecache)，将会显示 "cached" 或 "not cached" 的徽章。在右侧你可以看到时间诊断信息：

- 自身时间：导入模块所花费的时间，不包括静态导入。
- 总耗时：导入模块所花费的时间，包括静态导入。请注意，这不包括当前模块的 `transform` 时间。
- 转换：转换模块所花费的时间。

若你是通过点击导入项打开此视图，你还会在顶部看到一个 "Back" 按钮，点击可返回上一个模块。

底部显示内容取决于模块类型。对于外部模块，你仅能看到该文件的源代码。此时无法继续遍历模块依赖图，也无法查看静态导入的耗时情况。

<img alt="The module info view for an external module" img-light src="/ui/light-module-info-external.png">
<img alt="The module info view for an external module" img-dark src="/ui/dark-module-info-external.png">

如果模块是内联的，你将看到另外三个窗口：

- 源代码：模块未更改的源代码
- 转换后：Vitest 使用 Vite 的 [ModuleRunner](https://cn.vite.dev/guide/api-environment-runtimes#modulerunner) 执行的转换后代码
- Source Map (v3)：源码映射关系

"Source" 窗口中的所有静态导入显示当前模块评估它们的总耗时。如果导入已在模块图中被评估过，它将显示 `0ms`，因为此时已被缓存。

<!-- TODO: translation reference history -->

If the module took longer than the [`danger` threshold](/config/experimental#experimental-importdurations-thresholds) (default: 500ms) to load, the time will be displayed in red. If the module took longer than the [`warn` threshold](/config/experimental#experimental-importdurations-thresholds) (default: 100ms), the time will be displayed in orange.

你可以点击导入源代码跳转到该模块并进一步遍历图表（注意下面的 `./support/assertions/index.ts`）。

<img alt="The module info view for an internal module" img-light src="/ui/light-module-info-traverse.png">
<img alt="The module info view for an internal module" img-dark src="/ui/dark-module-info-traverse.png">

::: warning
请注意，仅类型导入在运行时不执行，不显示总耗时。它们也无法打开。
:::

如果另一个插件在转换期间注入模块导入，这些导入将在模块开始处以灰色显示（例如，通过 `import.meta.glob` 注入的模块）。它们也显示总耗时并且可以进一步遍历。

<img alt="The module info view for an internal module" img-light src="/ui/light-module-info-shadow.png">
<img alt="The module info view for an internal module" img-dark src="/ui/dark-module-info-shadow.png">

::: tip
如果你正在基于 Vitest 开发自定义集成，可以使用 [`vitest.experimental_getSourceModuleDiagnostic`](/api/advanced/vitest#getsourcemodulediagnostic) 来检索此信息。
:::

### 导入耗时分析 {#import-breakdown}

::: tip 功能反馈
请将关于此功能反馈提交至 [GitHub Discussion](https://github.com/vitest-dev/vitest/discussions/9224)。
:::

模块依赖图标签还提供了导入耗时分析功能，默认显示加载耗时最长的前 10 个模块列表（按总耗时排序）。

<img alt="Import breakdown with a list of top 10 modules that take the longest time to load" img-light src="/ui/light-import-breakdown.png">
<img alt="Import breakdown with a list of top 10 modules that take the longest time to load" img-dark src="/ui/dark-import-breakdown.png">

你可以点击模块查看模块信息。如果模块是外部的，它将显示黄色（与模块图中的颜色相同）。

分析列表包含自用耗时、总耗时以及相对于加载整个测试文件所花费时间的百分比。

当存在至少一个文件加载时间超过 [`danger` 阈值](/config/experimental#experimental-importdurations-thresholds)（默认值：500 毫秒）时，“显示导入耗时分析” 图标将呈现红色；如果存在至少一个文件加载时间超过 [`warn`阈值](/config/experimental#experimental-importdurations-thresholds)（默认值：100 毫秒），则图标显示为橙色。

你可以使用 [`experimental.importDurations.limit`](/config/experimental#experimental-importdurationslimit) 配置项控制显示的导入项数量上限。
