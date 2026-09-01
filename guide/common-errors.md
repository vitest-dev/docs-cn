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

<<<<<<< HEAD
## 未处理的 Promise 拒绝 {#unhandled-promise-rejection}
=======
## Time Zone Does Not Change in Worker Threads

Setting `process.env.TZ` in a setup file or in a test, or setting `TZ` via [`env`](/config/env), has no effect on `Date` in `pool: 'threads'` and `pool: 'vmThreads'`. Node.js applies `TZ` only when the main thread sets it. A worker thread sees the new value on `process.env`, but keeps the time zone of the main process.

```ts
process.env.TZ = 'Asia/Tokyo'
new Date('2026-01-01T00:00:00Z').getHours() // 9 in forks, unchanged in threads
```

Set the time zone before workers start. Use the shell, the config file, or [`globalSetup`](/config/globalsetup); all of them run in the main process and work in every pool.

::: code-group
```bash [CLI]
TZ=Asia/Tokyo vitest
```
```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

process.env.TZ = 'Asia/Tokyo'

export default defineConfig({})
```
```ts [globalSetup.js]
export default function () {
  process.env.TZ = 'Asia/Tokyo'
}
```
:::

If tests need different time zones at runtime, use `pool: 'forks'` or `pool: 'vmForks'`, where each worker is a separate process, or pass the `timeZone` option to `Intl.DateTimeFormat` instead of changing `TZ`.

## Unhandled Promise Rejection
>>>>>>> a41164cabca74cb90d641ff5b118fa10f2190094

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

## Package 在 Vitest 中加载失败但在你的应用中正常工作 {#fails-to-load-in-vitest-but-works-in-your-app}

有些包在应用构建中可以正常工作，但在 Vitest 中会失败，因为它们只有在经过打包器重写或解析后才是有效的。当 Vitest 将某个依赖外部化时，Node.js 会直接加载它，因此 Node 的 ESM 和包规则适用。请参阅 Node.js 关于 [ECMAScript 模块](https://nodejs.org/docs/latest/api/esm.html) 和 [packages](https://nodejs.org/docs/latest/api/packages.html) 的文档以了解具体规则。

常见的例子包括以下类型的包：

- 在 `.js` 文件中提供 ESM 语法但没有 `"type": "module"`
- 在 ESM 文件中使用无扩展名的相对导入
- 具有错误的 `exports`、`imports`、`main` 或 `module` 配置项
- 以仅适用于打包后的方式混合 CommonJS 和 ESM 入口点
- 导入 CSS 或其他应由打包器处理的非 JavaScript 文件

你可能会看到如下错误：

- `Cannot find module './relative-path' imported from ...`
- `Unexpected token 'export'`
- `Cannot use import statement outside a module`
- `Module ... seems to be an ES Module but shipped in a CommonJS package.`
- `Unknown file extension ".css"`

如果可能，应修复该包，使 Node.js 可以直接加载它：为 ESM `.js` 文件添加 `"type": "module"`，使用 `.mjs`，在 ESM 导入中包含显式的文件扩展名，并确保 `exports` 指向 Node.js 可以加载的文件。

如果你无法修复包本身，请将其内联，以便让 Vite 处理它，而不是将其作为外部依赖传递给 Node.js。将通向该无效包的整个依赖链都内联进来。如果你的源码导入了 `wrapper-package`，而 `wrapper-package` 导入 `broken-package`，请内联这两个包：

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

你也可以使用 Vite 的 [`ssr.resolve.noExternal`](https://vite.dev/config/ssr-options#ssr-resolve-noexternal) 达到相同目的。适用于当依赖在 SSR 构建中也需要由 Vite 打包时，Vitest 将 `ssr.resolve.noExternal` 合并到 [`server.deps.inline`](/config/server#server-deps-inline) 中：

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

## CommonJS source code is not fully supported

Vitest is ESM-first. By default, source files run in Vite's [module runner](/config/experimental#experimental-vitemodulerunner), which provides CommonJS variables such as `require`, `module`, and `exports` for compatibility but does not reproduce Node.js CommonJS semantics completely.

Calls to `require()` always use Node.js directly and leave the module runner. As a result:

- Vite plugins, aliases, transforms, and module mocks do not apply to required files
- requiring TypeScript or other files that Node.js cannot execute is not supported
- importing and requiring the same file can evaluate it twice, which can break singleton state, object identity, or `instanceof` checks

If your project uses CommonJS and doesn't need Vite transforms, set [`experimental.viteModuleRunner`](/config/experimental#experimental-vitemodulerunner) to `false` so the whole module graph is loaded by the native runtime:

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    experimental: {
      viteModuleRunner: false,
    },
  },
})
```

If the application uses ESM source but imports a CommonJS package from the same monorepo, you can instead use [`server.deps.external`](/config/server#server-deps-external) to externalize the complete CommonJS package. This keeps its entry points and internal `require()` calls in the same native module cache. For example:

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    server: {
      deps: {
        external: [/\/packages\/legacy-cjs\//],
      },
    },
  },
})
```
