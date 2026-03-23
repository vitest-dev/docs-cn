---
title: alias | 配置
outline: deep
---

# alias

- **类型:** `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

定义在测试运行时的自定义别名。这些别名将与 `resolve.alias` 中的配置合并使用。

::: warning
Vitest 使用 Vite SSR 基元来运行测试，这有 [一定的缺陷](https://cn.vitejs.dev/guide/ssr.html#ssr-externals)。

1. 别名只影响由 [inlined](/config/server#server-deps-inline) 模块直接用 `import` 关键字导入的模块（默认情况下所有源代码都是内联的）。
2. Vitest 不支持对 `require` 调用进行别名。
3. 如果我们要别名外部依赖（例如，`react` -> `preact`），我们可能需要别名实际的 `node_modules` 包，以使其适用于外部依赖。[Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) 和 [pnpm](https://pnpm.io/aliases/) 都支持通过 `npm:` 前缀进行别名。
:::
