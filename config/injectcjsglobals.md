---
title: injectCjsGlobals | 配置
---

# injectCjsGlobals

- **类型:** `boolean`
- **默认值:** `true`
- **命令行终端:** `--no-inject-cjs-globals`, `--injectCjsGlobals=false`

Vitest 会向其处理的每个模块注入 CommonJS 模块变量（`module`、`exports`、`require`、`__filename` 和 `__dirname`）。

默认情况下，所有经 Vitest 转换的文件都可以访问这些变量，即使文件使用 ESM 语法编写也不例外。但这与真实运行环境中的模块行为并不一致：浏览器不支持 CommonJS 变量，Node.js 也不会在 ES 模块中提供这些变量。

如果要使用更严格且更接近目标运行时的模块环境，可以禁用此行为：

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    injectCjsGlobals: false,
  },
})
```

禁用此选项后，只有被识别为 CommonJS 的模块才能使用这些变量。对于 CommonJS 模块，这些变量属于模块作用域；如果缺少它们，模块将完全无法执行。Vitest 采用与 Node.js 相同的规则识别模块类型：

1. 文件扩展名：`.cjs` 和 `.cts` 文件始终被视为 CommonJS 模块，`.mjs` 和 `.mts` 文件始终被视为 ES 模块。
2. 距离文件最近的 `package.json` 中的 `type` 字段：`"module"` 表示 ES 模块，`"commonjs"` 表示 CommonJS。与 Node.js 一样，Vitest 找到第一个 `package.json` 后便会停止查找，并且不会跨越 `node_modules` 边界。所以，依赖项不会继承当前项目的 `type` 设置。
3. 文件中是否包含 ESM 语法：如果文件既没有静态 `import`/`export` 声明，也没有引用 `import.meta`，Vitest 就会将其视为 CommonJS 模块。注释和字符串中的语法不会影响识别结果。CommonJS 模块可以使用动态导入，因此动态导入不属于这里所指的 ESM 语法。仅导入类型的 TypeScript 语句会在转换时被移除，也不会影响识别结果。

Vitest 始终会进行语法检测，不会遵循用于修改模块类型解析方式的 Node.js 命令行选项。例如 `--no-experimental-detect-module`、`--input-type`（在 Node.js 中仅适用于字符串输入），以及已在 Node.js 23 中移除的 `--experimental-default-type`。

在 ES 模块中引用 CommonJS 变量时，Vitest 会与其他运行环境一样抛出 `ReferenceError`：

```
ReferenceError: __dirname is not defined

"__dirname" is a CommonJS variable that is not available in ES modules, and "injectCjsGlobals" is disabled. If this module is meant to be an ES module, use "import.meta.dirname" instead of "__dirname". If it is meant to be a CommonJS module, use the ".cjs" file extension, set "type": "commonjs" in the nearest package.json, or externalize it with "server.deps.external".
```

::: warning
此选项仅影响由 Vitest 处理的模块，不会影响外部化模块。外部化模块始终由原生运行时执行；如果外部化的是 CommonJS 模块，Node.js 会自动提供所需的 CommonJS 变量。

<<<<<<< HEAD
另外，即使启用了此选项，被内联的 CommonJS 模块也不会经过 Vite 插件处理。由于 `require` 调用会离开模块运行器，mock 等依赖模块运行器的功能无法作用于这类模块。
=======
Note that inlined CommonJS modules are not processed by Vite plugins even when this option is enabled: `require` calls always leave the module runner, so features like mocking do not apply to them. See [CommonJS source code is not fully supported](/guide/common-errors#commonjs-source-code-is-not-fully-supported) for configuration alternatives.
>>>>>>> a41164cabca74cb90d641ff5b118fa10f2190094
:::
