---
title: server | 配置
outline: deep
---

# server <Deprecated />

在 Vitest 4 之前，此选项用于定义 `vite-node` 服务器的配置。

当前该选项允许你配置模块内联和外置机制，以及模块运行器的调试配置。

::: warning
这些选项应仅作为最后手段使用：通过外置自动内联的依赖项来提升性能，或通过内联无效的外部依赖项来修复问题。

通常，Vitest 应自动完成这些操作。
:::

## server.deps

### server.deps.external

- **类型:** `(string | RegExp)[]`
- **默认值:** [`moduleDirectories`](/config/deps#moduledirectories) 目录内的文件

指定不应由 Vite 转换而应直接由引擎处理的模块。这些模块通过原生动态 `import` 导入，会跳过转换和解析阶段。

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    server: {
      deps: {
        external: ['react'],
      },
    },
  },
})
```

外置模块及其依赖不存在于模块依赖树中，变更时不会触发测试重启。

通常，`node_modules` 下的包会被外置化。

::: tip
如果提供字符串参数，系统会先通过添加 `/node_modules/` 或其他 [`moduleDirectories`](/config/deps#moduledirectories) 路径段进行标准化处理（例如 `'react'` 会被转换为 `/node_modules/react/`），随后将生成的字符串与完整文件路径进行匹配。例如，位于 `packages/some-name` 的 `@company/some-name` 包应指定为 `some-name`，且需将 `packages` 包含在 `deps.moduleDirectories` 配置中。

如果提供 `RegExp` 正则表达式参数，则会直接与完整文件路径进行匹配。
:::

### server.deps.inline

- **类型:** `(string | RegExp)[] | true`
- **默认值:** 所有未被外置的模块

指定应由 Vite 进行转换和解析的模块。这些模块由 Vite 的 [模块运行器](https://cn.vite.dev/guide/api-environment-runtimes#modulerunner)执行。

通常情况下，源代码文件会被自动内联处理。

::: tip
如果提供字符串参数，系统会先通过添加 `/node_modules/` 或其他 [`moduleDirectories`](/config/deps#moduledirectories) 路径段进行标准化处理（例如 `'react'` 会被转换为 `/node_modules/react/`），随后将生成的字符串与完整文件路径进行匹配。例如，位于 `packages/some-name` 的 `@company/some-name` 包应指定为 `some-name`，且需将 `packages` 包含在 `deps.moduleDirectories` 配置中。

如果提供 `RegExp` 正则表达式参数，则会直接与完整文件路径进行匹配。
:::

### server.deps.fallbackCJS

- **类型:** `boolean`
- **默认值:** `false`

启用该选项时，Vitest 会通过检查常见的 CJS/UMD 文件名和目录模式（如 `.mjs`、`.umd.js`、`.cjs.js`、`umd/`、`cjs/`、`lib/` 等），尝试为 ESM 入口推测出对应的 CommonJS 构建版本。

Vitest 会尽力猜测 ESM 入口的 CommonJS 构建，但可能不适用于所有依赖。
