---
title: 常见错误 | 指南
---

# 常见错误 {#common-errors}

## 不能找到模块 './relative-path' {#cannot-find-module-relative-path}

如果你收到一个 **module cannot be found** 的报错，则可能意味着几种不同情况：

1. 你拼错了路径。确保路径正确。
2. 你可能依赖于 `tsconfig.json` 中的 `baseUrl`。默认情况下，Vite 不考虑 `tsconfig.json`，因此如果你依赖此行为，你可能需要自己安装 [`vite-tsconfig-paths`](https://npmx.dev/package/vite-tsconfig-paths)。

```ts
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
})
```

或者重写你的路径，使它不是相对于 root。

```diff
- import helpers from 'src/helpers'
+ import helpers from '../src/helpers'
```

3. 确保你没有使用相对路径的 [别名](/config/alias)。Vite 将它们视为相对于导入所在的文件而不是根目录。

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@/': './src/', // [!code --]
      '@/': new URL('./src/', import.meta.url).pathname, // [!code ++]
    },
  },
})
```

## Worker 无法终止 {#failed-to-terminate-worker}

当 NodeJS 的 `fetch` 与 [`pool: 'threads'`](/config/pool#threads) 一起使用时，可能会出现此错误。详情请参阅 [#3077](https://github.com/vitest-dev/vitest/issues/3077)。

默认的 [`pool: 'forks'`](/config/pool#forks) 不存在此问题。如果你已显式设置 `pool: 'threads'`，切换回 `'forks'` 或使用 [`'vmForks'`](/config/pool#vmforks) 即可解决。

## 自定义包条件无法解析 {#custom-package-conditions-are-not-resolved}

如果你在 `package.json` 的 [exports](https://nodejs.org/api/packages.html#package-entry-points) 或 [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) 中使用了自定义条件，你可能会发现 Vitest 默认不遵循这些条件。

例如，如果你的 `package.json` 中包含以下内容：

```json
{
  "exports": {
    ".": {
      "custom": "./lib/custom.js",
      "import": "./lib/index.js"
    }
  },
  "imports": {
    "#internal": {
      "custom": "./src/internal.js",
      "default": "./lib/internal.js"
    }
  }
}
```

默认情况下，Vitest 仅使用 `import` 和 `default` 条件。要让 Vitest 遵循自定义条件，须在 Vitest 配置中配置 [`ssr.resolve.conditions`](https://cn.vite.dev/config/ssr-options#ssr-resolve-conditions)：

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  ssr: {
    resolve: {
      conditions: ['custom', 'import', 'default'],
    },
  },
})
```

::: tip 为什么是 `ssr.resolve.conditions` 而不是 `resolve.conditions`?
Vitest 遵循 Vite 的配置约定：
- [`resolve.conditions`](https://cn.vite.dev/config/shared-options#resolve-conditions) 适用于 Vite 的 `client` 环境，对应 Vitest 的浏览器模式、jsdom、happy-dom，以及使用 `viteEnvironment: 'client'` 的自定义环境。
- [`ssr.resolve.conditions`](https://cn.vite.dev/config/ssr-options#ssr-resolve-conditions) 适用于 Vite 的 `ssr` 环境，对应 Vitest 的 node 环境或使用 `viteEnvironment: 'ssr'` 的自定义环境。

由于 Vitest 默认使用 `node` 环境（该环境使用 `viteEnvironment: 'ssr'`），模块解析将使用 `ssr.resolve.conditions`。这同时适用于包导出（package exports）和子路径导入（subpath imports）。

你可以在 [`environment`](/config/environment) 中了解更多关于 Vite 环境和 Vitest 环境的内容。
:::

## 段错误与原生代码错误 {#segfaults-and-native-code-errors}

运行 [原生 NodeJS 模块](https://nodejs.org/api/addons.html) 在 `pool: 'threads'` 中，可能会遇到来自原生代码的神秘错误。

- `Segmentation fault (core dumped)`
- `thread '<unnamed>' panicked at 'assertion failed`
- `Abort trap: 6`
- `internal error: entered unreachable code`

在这些情况下，原生模块可能不是为多线程安全而构建的。在解决方案中，你可以切换到 `pool: 'forks'`，它在多个 `node:child_process` 而不是多个 `node:worker_threads` 中运行测试用例。

::: code-group

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'forks',
  },
})
```

```bash [CLI]
vitest --pool=forks
```

:::

## 未处理的 Promise 拒绝 {#unhandled-promise-rejection}

当 Promise 被拒绝，但在微任务队列清空前未附加 `.catch()` 处理程序或 `await` 时，会发生此错误。该行为源自 JavaScript 本身，并非 Vitest 特有。更多信息请参阅 [Node.js 文档](https://nodejs.org/api/process.html#event-unhandledrejection)。

一个常见原因是调用异步函数时未使用 `await`：

```ts
async function fetchUser(id) {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) {
    throw new Error(`User ${id} not found`) // [!code highlight]
  }
  return res.json()
}

test('fetches user', async () => {
  fetchUser(123) // [!code error]
})
```

由于未对 `fetchUser()` 使用 `await`，其拒绝状态没有处理程序，Vitest 会报告：

```
Unhandled Rejection: Error: User 123 not found
```

### 修复方法 {#fix}

使用 `await` 等待 promise，以便 Vitest 可以捕获错误：

```ts
test('fetches user', async () => {
  await fetchUser(123) // [!code ++]
})
```

如果你期望调用抛出错误，使用 [`expect().rejects`](/api/expect#rejects)：

```ts
test('rejects for missing user', async () => {
  await expect(fetchUser(123)).rejects.toThrow('User 123 not found')
})
```

## Package fails to load in Vitest but works in your app

Some packages work in an app build but fail in Vitest because they are only valid after a bundler has rewritten or resolved them. When Vitest externalizes a dependency, Node.js loads it directly, so Node's ESM and package rules apply. See Node.js documentation on [ECMAScript modules](https://nodejs.org/docs/latest/api/esm.html) and [packages](https://nodejs.org/docs/latest/api/packages.html) for the precise rules.

Common examples include packages that:

- ship ESM syntax in `.js` files without `"type": "module"`
- use extensionless relative imports in ESM files
- have incorrect `exports`, `imports`, `main`, or `module` entries
- mix CommonJS and ESM entry points in a way that only works after bundling
- import CSS or other non-JavaScript files that are expected to be handled by a bundler

You might see errors such as:

- `Cannot find module './relative-path' imported from ...`
- `Unexpected token 'export'`
- `Cannot use import statement outside a module`
- `Module ... seems to be an ES Module but shipped in a CommonJS package.`
- `Unknown file extension ".css"`

When possible, fix the package so Node.js can load it directly: add `"type": "module"` for ESM `.js` files, use `.mjs`, include explicit file extensions in ESM imports, and make sure `exports` points to files Node.js can load.

If you cannot fix the package itself, inline it so Vite handles it instead of passing it to Node.js as an external dependency. Inline the whole dependency chain that leads to the invalid package. If your source imports `wrapper-package`, and `wrapper-package` imports `broken-package`, inline both packages:

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: ['wrapper-package', 'broken-package'],
      },
    },
  },
})
```

You can also use Vite's [`ssr.resolve.noExternal`](https://vite.dev/config/ssr-options#ssr-resolve-noexternal) for the same purpose. Vitest merges `ssr.resolve.noExternal` into [`server.deps.inline`](/config/server#server-deps-inline), so this is useful when the dependency also needs to be bundled by Vite in SSR builds:

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  ssr: {
    resolve: {
      noExternal: ['wrapper-package', 'broken-package'],
    },
  },
})
```
