---
title: Vitest UI | 指南
---

# UI 模式 {#vitest-ui}

Vitest 由 Vite 提供能力，在运行测试时有一个开发服务器。这允许 Vitest 提供一个漂亮的 UI 界面来查看并与测试交互。

Vitest 的 UI 界面是可选的，你可以通过以下安装：

```bash
npm i -D @vitest/ui
```

<img alt="Vitest UI" img-light src="/ui-1-light.png">
<img alt="Vitest UI" img-dark src="/ui-1-dark.png">

## 测试 UI 界面 {#live-ui}

测试 UI 界面与 Vitest 的开发服务器一同运行，需要启用 [watch 模式](/config/watch)（默认启用）。它会持续连接到正在运行的 Vitest 进程，在每次重新运行测试时，结果都会随之更新。你还可以直接在 UI 中重新运行选定的测试、更新失败的快照，以及编辑测试文件。

接下来，你可以通过传入 `--ui` 参数来启动测试的 UI 界面：

```bash
vitest --ui
```

最后，你可以访问 Vitest UI 界面，通过 <a href="http://localhost:51204/__vitest__/">`http://localhost:51204/__vitest__/`</a>

::: tip
Vitest UI 设有访问保护。如果直接访问上述 URL 时出现错误，请打开 Vitest 在终端中输出的带有令牌的 URL，例如 `http://localhost:51204/__vitest__/?token=...`。
:::

## HTML 报告器 {#html-reporter}

HTML 报告器会将测试结果写入静态版的 Vitest UI。你可以浏览各个结果视图，但报告是只读的，无法重新运行测试、更新快照或编辑测试文件。它适用于单次运行模式、CI 或自动化工作流中，你可以使用 HTML 报告保存测试结果，方便之后查看。

在命令行或 Vitest 配置中使用 `html` 报告器：

::: code-group
```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['html'],
  },
})
```

```bash [CLI]
vitest run --reporter=html
```
:::

::: tip 保留终端输出
配置 HTML 报告器后，它会替换默认的终端报告器。如果要保留终端的输出，请同时启用 [Vitest 的默认报告器](/guide/reporters#default-configuration)。

```ts [vitest.config.ts]
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['html', ...configDefaults.reporters],
  },
})
```
:::

### 本地预览 {#preview-locally}

默认情况下，报告入口文件会写入 `.vitest/index.html`。你可以通过 HTML 报告器的 `outputDir` 配置项变更测试产物的输出目录。

如需预览默认输出的报告，请使用 [vite preview](https://cn.vitejs.dev/guide/cli.html#vite-preview) 命令：

```sh
npx vite preview --outDir .vitest
```

可以在浏览器中打开 Vite 输出的 URL。无须启动预览服务器也可以使用 [VS Code 的集成浏览器 ](https://code.visualstudio.com/docs/debugtest/integrated-browser) 直接打开 `.vitest/index.html`。

### 单文件分享报告 {#share-as-a-single-file}

将 `singleFile` 设为 true，即可生成无需依赖其他文件的 HTML 报告：

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: [
      ['html', { singleFile: true }],
    ],
  },
})
```

启用 `singleFile` 后，Vitest 会将 UI 资源、元数据和测试附件内联到一个 `index.html` 文件中。这样，你就可以将报告作为单个测试产物分享、上传或下载，无须保留整个输出目录。

由于所需资源都都是内联的，你可以通过 `file://` 直接在浏览器中打开 `<outputDir>/index.html`，无须启动预览服务器。

::: warning
使用 `singleFile` 时，有两点需要注意：

- 所有内容都嵌入同一个文件，可能导致文件体积很大，打开缓慢、占用大量内存，或超出测试产物查看器和静态托管服务的文件大小限制。
- 覆盖率 HTML 报告不会内联，仍以独立文件保存。

如果测试套件包含大量附件或体积较大的附件，或者需要将覆盖率报告一并打包，建议使用默认的多文件报告。
:::

### 查看 CI 中的报告 {#view-reports-from-ci}

使用 GitHub Actions 等 CI 平台时，可以将报告的输出目录作为测试产物上传，方便后续查看：

```yaml
- uses: actions/upload-artifact@v7
  id: upload-report
  with:
    name: vitest-report
    path: .vitest/

- name: Link HTML report
  run: echo "::notice title=Vitest HTML report::$REPORT_URL"
  env:
    REPORT_URL: https://viewer.vitest.dev/?url=${{ steps.upload-report.outputs.artifact-url }}
```

上述配置会在工作流运行页面添加一条包含报告链接的通知。点击链接，即可通过 [Vitest Viewer](https://viewer.vitest.dev/) 直接在浏览器中查看报告。你也可以手动下载并解压测试产物，再按前面的方法在本地运行 `vite preview`。

使用 `singleFile: true` 时，你可以通过 [`archive: false` 选项](https://github.com/actions/upload-artifact#upload-an-individual-file-unzipped) 将报告作为单文件上传到 GitHub，点击测试产物链接查看报告：

```yaml
- uses: actions/upload-artifact@v7
  id: upload-report
  with:
    path: .vitest/index.html
    archive: false

- name: Link HTML report
  run: echo "::notice title=Vitest HTML report::$REPORT_URL"
  env:
    REPORT_URL: ${{ steps.upload-report.outputs.artifact-url }}
```

## 覆盖率 {#coverage}

Vitest UI 和 HTML 报告都支持显示覆盖率结果。配置和使用方法请参阅 [Vitest UI 覆盖率](/guide/coverage#vitest-ui)。

## 追踪视图 {#trace-view}

启用 [`browser.traceView`](/guide/browser/trace-view) 后，Vitest UI 可以回放已录制的浏览器交互。Vitest UI 会实时显示在测试运行时追踪记录，HTML 报告会保存这些记录供之后查看。

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

此视图分为上下两部分。顶部显示完整的模块 ID 和一些关于模块的诊断信息。如果启用了 [`fsModuleCache`](/config/fsmodulecache)，将会显示 "cached" 或 "not cached" 的徽章。在右侧你可以看到时间诊断信息：

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

如果某个模块的加载时间超过 [`danger` 阈值](/config/experimental#experimental-importdurations-thresholds)（默认：500ms），耗时将以红色显示。如果超过 [`warn` 阈值](/config/experimental#experimental-importdurations-thresholds)（默认：100ms），耗时将以橙色显示。

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

当存在至少一个文件加载时间超过 [`danger` 阈值](/config/experimental#experimental-importdurations-thresholds)（默认值：500 毫秒）时，“显示导入耗时分析” 图标将呈现红色；如果存在至少一个文件加载时间超过 [`warn` 阈值](/config/experimental#experimental-importdurations-thresholds)（默认值：100 毫秒），则图标显示为橙色。

你可以使用 [`experimental.importDurations.limit`](/config/experimental#experimental-importdurationslimit) 配置项控制显示的导入项数量上限。
