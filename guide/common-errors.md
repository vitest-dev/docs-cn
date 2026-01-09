---
title: 常见错误 | 指南
---

# 常见错误 {#common-errors}

## Cannot find module './relative-path'

如果你收到一个 **module cannot be found** 的报错，则可能意味着几种不同情况：

- 1.你拼错了路径。确保路径正确。
- 2.你可能依赖于 `tsconfig.json` 中的 `baseUrl`。默认情况下，Vite 不考虑 `tsconfig.json`，因此如果你依赖此行为，你可能需要自己安装 [`vite-tsconfig-paths`](https://www.npmjs.com/package/vite-tsconfig-paths) 。

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

- 3. 确保你没有使用相对路径的 [别名](/config/#alias)。Vite 将它们视为相对于导入所在的文件而不是根目录。

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

## Failed to Terminate Worker

当 NodeJS 的 fetch 与默认的 [`pool: 'threads'`](/config/#threads) 一起使用时，可能会发生此错误。问题可以在 [issue#3077](https://github.com/vitest-dev/vitest/issues/3077) 上进行持续更新。

作为解决方法，我们可以切换到 [`pool: 'forks'`](/config/#forks) 或 [`pool: 'vmForks'`](/config/#vmforks)。

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

## Custom package conditions are not resolved

If you are using custom conditions in your `package.json` [exports](https://nodejs.org/api/packages.html#package-entry-points) or [subpath imports](https://nodejs.org/api/packages.html#subpath-imports), you may find that Vitest does not respect these conditions by default.

For example, if you have the following in your `package.json`:

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

By default, Vitest will only use the `import` and `default` conditions. To make Vitest respect custom conditions, you need to configure [`ssr.resolve.conditions`](https://vite.dev/config/ssr-options#ssr-resolve-conditions) in your Vitest config:

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

::: tip Why `ssr.resolve.conditions` and not `resolve.conditions`?
Vitest follows Vite's configuration convention:
- [`resolve.conditions`](https://vite.dev/config/shared-options#resolve-conditions) applies to Vite's `client` environment, which corresponds to Vitest's browser mode, jsdom, happy-dom, or custom environments with `viteEnvironment: 'client'`.
- [`ssr.resolve.conditions`](https://vite.dev/config/ssr-options#ssr-resolve-conditions) applies to Vite's `ssr` environment, which corresponds to Vitest's node environment or custom environments with `viteEnvironment: 'ssr'`.

Since Vitest defaults to the `node` environment (which uses `viteEnvironment: 'ssr'`), module resolution uses `ssr.resolve.conditions`. This applies to both package exports and subpath imports.

You can learn more about Vite environments and Vitest environments in [`environment`](/config/environment).
:::

## Segfaults and Native Code Errors

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
