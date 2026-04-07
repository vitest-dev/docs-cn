---
title: deps | 配置
outline: deep
---

# deps

- **类型:** `{ optimizer?, ... }`

依赖项解析处理配置。

## deps.optimizer {#deps-optimizer}

- **类型:** `{ ssr?, client? }`
- **参考:** [依赖优化选项](https://cn.vitejs.dev/config/dep-optimization-options.html)

启用依赖优化。如果你有很多测试，这可能会提高它们的性能。

当 Vitest 检测到 `include` 列表中指定的外部库时，会通过 esbuild 将其打包为单一文件，并作为整个模块导入。此机制具有以下优势：

- 导入包含大量子依赖的包时开销较大，打包为单一文件可显著节省时间
- 导入 UI 库时开销较大，因其它们并非为 Node.js 环境设计
- 打包后的依赖包内部现在会遵循你的 `alias` 别名配置
- 测试代码的运行方式更接近浏览器环境的行为

需注意，只有 `deps.optimizer?.[mode].include` 选项中指定的包会被打包（某些插件会自动填充此选项，例如 Svelte）。你可以在 [Vite 文档](https://cn.vitejs.dev/config/dep-optimization-options.html) 中查阅更多可用选项（Vitest 不支持 `disable` 和 `noDiscovery` 选项）。默认情况下，Vitest 对 `jsdom` 和 `happy-dom` 环境使用 `optimizer.client`，对 `node` 和 `edge` 环境使用 `optimizer.ssr`。

此选项还会继承你的 `optimizeDeps` 配置（对于 Web 环境，Vitest 会扩展 `optimizeDeps`；对于 SSR 环境则会扩展 `ssr.optimizeDeps`）。如果在 `deps.optimizer` 中重定义 `include`/`exclude` 选项，运行测试时将会扩展你的 `optimizeDeps` 配置。若某选项同时出现在 `include` 和 `exclude` 列表中，Vitest 会自动将其从 `include` 中移除。


::: tip
你将无法通过编辑 `node_modules` 中的代码进行调试，因为这些代码实际位于 `cacheDir` 或 `test.cache.dir` 目录中。如需使用 `console.log` 语句进行调试，请直接修改对应文件，或通过 `deps.optimizer?.[mode].force` 选项强制重新打包。
:::

### deps.optimizer.{mode}.enabled

- **类型:** `boolean`
- **默认值:** `false`

启用依赖项优化。

## deps.client

- **类型:** `{ transformAssets?, ... }`

当环境设置为 `client` 时应用于外部文件的选项。默认情况下，`jsdom` 和 `happy-dom` 使用 `client` 环境，而 `node` 和 `edge` 环境则使用 `ssr`，因此这些选项不会影响这些环境内部的文件。

通常情况下 `node_modules` 中的文件会被外部化，但这些选项也会影响 [`server.deps.external`](/config/server#server-deps-external) 中指定的文件。

### deps.client.transformAssets

- **类型:** `boolean`
- **默认值:** `true`

是否让 Vitest 像 Vite 在浏览器中那样处理资源文件（.png、.svg、.jpg 等）并解析它们。

若未指定查询参数，该模块将默认导出资源文件的路径。

::: warning
目前，此选项仅适用于 [`vmThreads`](/config/pool#vmthreads) 和 [`vmForks`](/config/pool#vmforks) 池。
:::

### deps.client.transformCss

- **类型:** `boolean`
- **默认值:** `true`

是否让 Vitest 像 Vite 在浏览器中一样处理 CSS 文件（.css、.scss、.sass 等）并解析它们。

如果通过 [`css`](/config/css) 选项禁用了 CSS 文件，此选项仅会屏蔽 `ERR_UNKNOWN_FILE_EXTENSION` 错误。

::: warning
当前此选项仅适用于 [`vmThreads`](/config/pool#vmthreads) 和 [`vmForks`](/config/pool#vmforks) 池。
:::

### deps.client.transformGlobPattern

- **类型:** `RegExp | RegExp[]`
- **默认值:** `[]`

正则匹配应转换的外部文件。

默认情况下，`node_modules` 中的文件会被外部化且不进行转换，除非是 CSS 或静态资源且未禁用对应的选项。

::: warning
当前此选项仅适用于 [`vmThreads`](/config/pool#vmthreads) 和 [`vmForks`](/config/pool#vmforks) 池。
:::

## deps.interopDefault

- **类型:** `boolean`
- **默认值:** `true`

将 CJS 模块的默认值视为命名导出。某些依赖项仅捆绑 CJS 模块，不使用命名导出，Node.js 可以在使用 `import` 语法而不是 `require` 导入包时对其进行静态分析。使用命名导出在 Node 环境中导入此类依赖项时，你将看到以下错误：

```
import { read } from 'fs-jetpack';
         ^^^^
SyntaxError: Named export 'read' not found. The requested module 'fs-jetpack' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export.
```

Vitest 不进行静态分析，也无法在代码运行前报错，因此如果禁用此功能，你极有可能在运行测试时遇到以下错误：

```
TypeError: createAsyncThunk is not a function
TypeError: default is not a function
```

默认情况下，Vitest 会假定你正在使用打包工具绕过此问题，因此不会报错。但如果你的代码未经处理，可以手动禁用此行为。

## deps.moduleDirectories

- **类型:** `string[]`
- **默认值:** `['node_modules']`

配置一个视为模块目录的目录列表。此配置选项会影响 [`vi.mock`](/api/vi#vi-mock) 的行为：当未提供工厂并且你正在模拟的路径与 `moduleDirectories` 值之一匹配时，Vitest 将尝试 通过在项目的 [root](/config/root) 中查找 `__mocks__` 文件夹来解析 mock。

此选项还将影响在外部化依赖项时是否应将文件视为模块。默认情况下，Vitest 绕过 Vite 转换步骤导入带有原生 Node.js 的外部模块。

设置此选项将 _覆盖_ 默认值，如果你仍希望搜索 `node_modules` 包包括它连同任何其他选项：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    deps: {
      moduleDirectories: ['node_modules', path.resolve('../../packages')],
    }
  },
})
```
