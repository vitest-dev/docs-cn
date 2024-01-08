---
title: 常见错误 | 指南
---

# 常见错误

## Cannot find module './relative-path'

如果你收到一个 **module cannot be found** 的报错，则可能意味着几种不同情况：

- 1.你拼错了路径。确保路径正确。
- 2.你可能依赖于 `tsconfig.json` 中的 `baseUrl`。默认情况下，Vite 不考虑 `tsconfig.json`，因此如果你依赖此行为，您可能需要自己安装 [`vite-tsconfig-paths`](https://www.npmjs.com/package/vite-tsconfig-paths) 。

```ts
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

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

## Cannot mock "./mocked-file.js" because it is already loaded

This error happens when `vi.mock` method is called on a module that was already loaded. Vitest throws this error because this call has no effect since cached modules are preferred.

Remember that `vi.mock` is always hoisted - it means that the module was loaded before the test file started executing - most likely in a setup file. To fix the error, remove the import or clear the cache at the end of a setup file - beware that setup file and your test file will reference different modules in that case.

```ts
// setupFile.js
import { vi } from 'vitest'
import { sideEffect } from './mocked-file.js'

sideEffect()

vi.resetModules()
```
