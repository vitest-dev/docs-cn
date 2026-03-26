---
title: globals | 配置
---

# globals

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--globals`, `--no-globals`, `--globals=false`

默认情况下，`vitest` 不显式提供全局 API。如果你更倾向于使用类似 jest 中的全局 API，可以通过 CLI 传递 `--globals` 选项，或在配置中添加 `globals: true`。

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
```

::: tip
注意，某些库（如 `@testing-library/react`）需要依赖全局 API 的存在才能执行自动清理操作
:::

为了可以让全局 API 支持 TypeScript，请将 `vitest/globals` 添加到 `tsconfig.json` 中的 `types` 选项中

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

如果你重新定义了 [`typeRoots`](https://www.typescriptlang.org/tsconfig/#typeRoots) 以在编译中包含额外的类型，你需要将 `node_modules` 添加回来，使得 `vitest/globals` 可被发现：

```json [tsconfig.json]
{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types", "./node_modules"],
    "types": ["vitest/globals"]
  }
}
```
