---
title: Coverage | Guide
---

# 测试覆盖率

Vitest 通过 [`v8`](https://v8.dev/blog/javascript-code-coverage) 支持原生代码覆盖率，通过 [`istanbul`](https://istanbul.js.org/) 支持检测代码覆盖率。

## 测试覆盖率提供者

:::tip 提醒
从 Vitest v0.22.0 开始支持
:::

`v8` 和 `istanbul` 的支持都是可选的。 默认情况下，启用 `v8`。

你可以通过将 `test.coverage.provider` 设置为 `v8` 或 `istanbul` 来选择覆盖工具：

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul', // or 'v8'
    },
  },
})
```

当你启动 Vitest 进程时，它会提示你自动安装相应的支持包。

或者，如果你更喜欢手动安装它们：

```bash
# For v8
npm i -D @vitest/coverage-v8

# For istanbul
npm i -D @vitest/coverage-istanbul
```

## 覆盖率配置

要在启用的情况下进行测试，你可以在 CLI 中传递 `--coverage` 标志。
默认情况下, 将使用 `['text', 'html', 'clover', 'json']` 作为测试报告器。

```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

要对其进行配置，需要在配置文件中设置 `test.coverage` 选项：

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

## 自定义覆盖率提供者

也可以通过将 `'custom'` 传递给 `test.coverage.provider` 来配置你的自定义覆盖率提供者：

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'custom',
      customProviderModule: 'my-custom-coverage-provider',
    },
  },
})
```

自定义覆盖率提供者需要一个 `customProviderModule` 选项，它是一个模块名称或从中加载 `CoverageProviderModule` 的路径。 它必须将实现 `CoverageProviderModule` 的对象导出为默认导出：

```ts
// my-custom-coverage-provider.ts
import type {
  CoverageProvider,
  CoverageProviderModule,
  ResolvedCoverageOptions,
  Vitest,
} from 'vitest'

const CustomCoverageProviderModule: CoverageProviderModule = {
  getProvider(): CoverageProvider {
    return new CustomCoverageProvider()
  },

  // Implements rest of the CoverageProviderModule ...
}

class CustomCoverageProvider implements CoverageProvider {
  name = 'custom-coverage-provider'
  options!: ResolvedCoverageOptions

  initialize(ctx: Vitest) {
    this.options = ctx.config.coverage
  }

  // Implements rest of the CoverageProvider ...
}

export default CustomCoverageProviderModule
```

请参阅类型定义查看有关详细信息。

## 更改默认覆盖文件夹位置

运行覆盖率报告时，会在项目的根目录中创建一个 `coverage` 文件夹。 如果你想将它移动到不同的目录，请使用 `vite.config.js` 文件中的 `test.coverage.reportsDirectory` 属性。

```js
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      reportsDirectory: './tests/unit/coverage',
    },
  },
})
```

## 代码忽略

两个覆盖率提供商都有自己的方法来忽略覆盖率报告中的代码：

- [`v8`](https://github.com/istanbuljs/v8-to-istanbul#ignoring-uncovered-lines)
- [`ìstanbul`](https://github.com/istanbuljs/nyc#parsing-hints-ignoring-lines)

使用 Typescript 时，源代码使用 `esbuild` 进行转译，这会从源代码中删除所有注释([esbuild#516](https://github.com/evanw/esbuild/issues/516))。
被视为[合法注释](https://esbuild.github.io/api/#legal-comments)的注释将被保留。

对于 `istanbul` 测试提供者，你可以在忽略提示中包含 `@preserve` 关键字。
请注意，这些忽略提示现在也可能包含在最终的产品构建中。

```diff
-/* istanbul ignore if */
+/* istanbul ignore if -- @preserve */
if (condition) {
```

不幸的是，目前这在 `v8` 中不起作用。你通常可以在 Typescript 使用 `c8 ignore` 注释：

<!-- eslint-skip -->

```ts
/* c8 ignore next 3 */
if (condition) {
```

## 其他选项

要查看有关覆盖率的所有可配置选项，请参见 [覆盖率配置参考](https://cn.vitest.dev/config/#coverage)。

## Vitest UI

从 Vitest 0.31.0 开始，你可以在 [Vitest UI](./ui) 中查看你的覆盖率报告。

<<<<<<< HEAD
如果您配置了覆盖率报告器，请不要忘记将 `html` 报告器添加到列表中，Vitest UI 将仅在 html 报告器存在时启用 html 覆盖率报告。
=======
Vitest UI will enable coverage report when it is enabled explicitly and the html coverage reporter is present, otherwise it will not be available:
- enable `coverage.enabled=true` in your configuration or run Vitest with `--coverage.enabled=true` flag
- add `html` to the `coverage.reporters` list: you can also enable `subdir` option to put coverage report in a subdirectory
>>>>>>> 5a31e216fe49935323e24c3a7677a5fb2980caa8

<img alt="html coverage activation in Vitest UI" img-light src="/vitest-ui-show-coverage-light.png">
<img alt="html coverage activation in Vitest UI" img-dark src="/vitest-ui-show-coverage-dark.png">

<img alt="html coverage in Vitest UI" img-light src="/vitest-ui-coverage-light.png">
<img alt="html coverage in Vitest UI" img-dark src="/vitest-ui-coverage-dark.png">
