---
title: alias | 配置
outline: deep
---

# alias

- **类型:** `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

在测试环境中定义自定义别名。这些别名将与 `resolve.alias` 中的配置合并使用。

::: warning
Vitest 基于 Vite 的 SSR 底层机制运行测试，可能存在 [潜在的缺陷](https://cn.vitejs.dev/guide/ssr.html#ssr-externals)。

1. 别名仅影响由 [内联模块](/config/server#server-deps-inline) 通过 `import` 关键字直接导入的模块 （默认情况下所有源代码均被内联）。
2. Vitest 不支持对 `require` 调用进行别名配置。
3. 如果我们要为外部依赖项设置别名（例如，`react` -> `preact`），建议直接对 `node_modules` 中的实际包进行别名配置，以确保该方案在外部化依赖场景下同样生效。[Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) 和 [pnpm](https://pnpm.io/aliases/) 均支持通过 `npm:` 前缀实现别名功能。
:::
