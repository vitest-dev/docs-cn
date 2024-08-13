---
outline: deep
---

# 管理 Vitest 配置文件

如果你正在使用 Vite，并且有一个 `vite.config` 文件，Vitest 会读取它并以插件匹配，并将其设置为你的 Vite 应用程序。如果你想使用不同的配置进行测试，或者你的主应用程序不特别依赖 Vite，你可以：

- 创建 `vitest.config.ts`，它将具有更高的优先级，并**覆盖** `vite.config.ts` 中的配置（Vitest 支持所有传统的 JS 和 TS 扩展，但不支持 `json`）-这意味着 `vite.config` 中的所有选项都将被**忽略**
- 将 `--config` 选项传递给 CLI，例如 `vitest --config ./path/to/vitest.config.ts`
- 使用`process.env.VITEST` 或者 `defineConfig` 上的 `mode` 属性（如果未被`mode`覆盖，则将设置为`test`/`benchmark`），以有条件地应用 `vite.config.ts` 中的不同配置

要配置 `vitest` 本身，请在 Vite 配置中添加 `test` 属性。如果你要从 `vite` 本身导入`defineConfig`，你还需要使用[三斜杠命令](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-)添加对 Vitest 类型的引用。

使用 `vite` 中的 `defineConfig`，你应该如下配置：

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ... Specify options here.
  },
})
```

`<reference types="vitest" />`  将在 Vitest 3 中停止工作，但您可以在 Vitest 2.1 中开始迁移到 `vitest/config`：

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ... Specify options here.
  },
})
```

使用 `vitest/config` 中的 `defineConfig`，你应该如下配置：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ... Specify options here.
  },
})
```

如果需要，你可以检索 Vitest 的默认选项以展开它们：

```ts
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'packages/template/*'],
  },
})
```

当使用单独的 `vitest.config.js` 时，如果需要，你还可以从另一个配置文件扩展 Vite 的选项：

```ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: ['packages/template/*'],
    },
  })
)
```

如果你的 Vite 配置被定义为一个函数，可以这样定义配置：

```ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(configEnv =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        exclude: ['packages/template/*'],
      },
    })
  )
)
```
