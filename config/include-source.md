---
title: includeSource | 配置
---

# includeSource

- **类型:** `string[]`
- **默认值:** `[]`

匹配包含内联测试文件的 [glob 规则](https://superchupu.dev/tinyglobby/comparison)。该规则相对于 [`root`](/config/root) 进行解析（默认为 [`process.cwd()`](https://nodejs.org/api/process.html#processcwd)）。

当定义时，Vitest 将运行所有包含 `import.meta.vitest` 的匹配文件。

::: warning
Vitest 对源文件执行基于文本的包含的简单检查。如果文件即使在注释中包含 `import.meta.vitest`，它也会被匹配为源文件内联测试。
:::

Vitest 使用 [`tinyglobby`](https://npmx.dev/package/tinyglobby) 包来解析 glob。

## 示例 {#example}

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  },
})
```

然后你可以在源文件中编写测试：

```ts [src/index.ts]
export function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0)
}

// #region 内联测试套件
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(add()).toBe(0)
    expect(add(1)).toBe(1)
    expect(add(1, 2, 3)).toBe(6)
  })
}
// #endregion
```

在生产环境构建时，你需要将 `import.meta.vitest` 替换为 `undefined`，以便打包工具移除未使用的代码。

::: code-group
```js [vite.config.ts]
import { defineConfig } from 'vite'

export default defineConfig({
  define: { // [!code ++]
    'import.meta.vitest': 'undefined', // [!code ++]
  }, // [!code ++]
})
```
```js [rolldown.config.js]
import { defineConfig } from 'rolldown/config'

export default defineConfig({
  transform: {
    define: { // [!code ++]
      'import.meta.vitest': 'undefined', // [!code ++]
    }, // [!code ++]
  },
})
```
```js [rollup.config.js]
import replace from '@rollup/plugin-replace' // [!code ++]

export default {
  plugins: [
    replace({ // [!code ++]
      'import.meta.vitest': 'undefined', // [!code ++]
    }) // [!code ++]
  ],
  // 其他配置项
}
```
```js [build.config.js]
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  replace: { // [!code ++]
    'import.meta.vitest': 'undefined', // [!code ++]
  }, // [!code ++]
  // 其他配置项
})
```
```js [webpack.config.js]
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({ // [!code ++]
      'import.meta.vitest': 'undefined', // [!code ++]
    })// [!code ++]
  ],
}
```
:::

::: tip
为了让 `import.meta.vitest` 获得更好的 TypeScript 支持，请在 `tsconfig.json` 中添加 `vitest/importMeta`：

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vitest/importMeta"]
  }
}
```
:::
