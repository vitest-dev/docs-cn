---
outline: deep
---

# 配置 Vitest {#configuring-vitest}

如果我们正在使用 Vite 并且拥有一个 `vite.config` 文件，Vitest 会读取它来匹配我们的 Vite 应用的插件和设置。如果我们想要为测试配置不同的设置，或者我们的并不特别依赖于 Vite，我们我们可以选择：

- 创建 `vitest.config.ts`，它将具有更高的优先级，并且会**覆盖** `vite.config.ts` 中的配置（Vitest 支持所有传统的 JS 和 TS 文件扩展名，但不支持 `json`） - 这意味着我们在 `vite.config` 中的所有选项将被**忽略**。
- 向 CLI 传递 `--config` 选项，例如 `vitest --config ./path/to/vitest.config.ts`。
- 使用 `process.env.VITEST` 或在 `defineConfig` 上的 `mode` 属性（如果没有用 `--mode` 覆盖，默认设置为 `test`/`benchmark`）来在 `vite.config.ts` 中有条件地应用不同的配置。请注意，像任何其他环境变量一样，`VITEST` 也会在测试中的 `import.meta.env` 上暴露出来。

要配置 Vitest 本身，请在我们的 Vite 配置中添加 `test` 属性。如果我们是从 `vite` 本身导入 `defineConfig`，我们还需要在配置文件顶部使用 [三斜杠指令](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-) 添加对 Vitest 类型引用。

如果你尚未使用 `vite` ，可以在配置文件中从 `vitest/config` 导入 `defineConfig`：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ... 在此指定选项。
  },
})
```
如果你已经有一个 `vite` 配置文件，可以通过 `/// <reference types="vitest/config" />` 来引入 `test` 类型声明：

```js [vite.config.js]
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ... 在此指定选项。
  },
})
```

你可以获取 Vitest 的默认配置，以便在需要时扩展它们：

```js [vitest.config.js]
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'packages/template/*'],
  },
})
```

当使用单独的 `vitest.config.js` 时，我们还可以根据需要从另一个配置文件扩展 Vite 的选项：

```js [vitest.config.js]
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    exclude: ['packages/template/*'],
  },
}))
```

如果我们的 Vite 配置定义为一个函数，我们可以像这样定义配置：

```js [vitest.config.js]
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(configEnv => mergeConfig(
  viteConfig(configEnv),
  defineConfig({
    test: {
      exclude: ['packages/template/*'],
    },
  })
))
```

由于 Vitest 使用 Vite 的配置，我们也可以使用 [Vite](https://vitejs.dev/config/) 中的任何配置选项。例如，使用 `define` 来定义全局变量，或者使用 `resolve.alias` 来定义别名——这些选项应该在顶级定义，而不是在 `test` 属性内部。

在 [项目](/guide/projects) 配置中不支持的配置选项旁边会显示 <CRoot /> 图标。这意味着它们只能在 Vitest 根配置文件中进行设置。
