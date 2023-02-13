---
title: Coverage | Guide
---

# 测试覆盖率

Vitest 通过 [`c8`](https://github.com/bcoe/c8) 支持本机代码覆盖率。同时也支持 [`istanbul`](https://istanbul.js.org/)。

## 覆盖率提供者

:::tip 提醒
从 Vitest v0.22.0 开始支持
:::

`c8` 和 `istanbul` 的支持都是可选的。 默认情况下，启用 `c8`。

你可以通过将 `test.coverage.provider` 设置为 `c8` 或 `istanbul` 来选择覆盖工具：

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul', // or 'c8'
    },
  },
})
```

当你启动 Vitest 进程时，它会提示你自动安装相应的支持包。

或者，如果你更喜欢手动安装它们：

```bash
# For c8
npm i -D @vitest/coverage-c8

# For istanbul
npm i -D @vitest/coverage-istanbul
```

## 覆盖率配置

要在启用的情况下进行测试，你可以在 CLI 中传递 `--coverage` 标志。

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

<<<<<<< HEAD
也可以通过将对象传递给 `test.coverage.provider` 来配置你的自定义覆盖率提供者：
=======
It's also possible to provide your custom coverage provider by passing `'custom'` in `test.coverage.provider`:
>>>>>>> 027cb3025019b36c0c413a60234cb68ec0b6fe6c

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
<<<<<<< HEAD
      provider: CustomCoverageProvider(),
=======
      provider: 'custom',
      customProviderModule: 'my-custom-coverage-provider'
>>>>>>> 027cb3025019b36c0c413a60234cb68ec0b6fe6c
    },
  },
})
```

<<<<<<< HEAD
请参阅类型定义查看有关详细信息。
=======
The custom providers require a `customProviderModule` option which is a module name or path where to load the `CoverageProviderModule` from. It must export an object that implements `CoverageProviderModule` as default export:

```ts
// my-custom-coverage-provider.ts
import type { CoverageProvider, CoverageProviderModule, ResolvedCoverageOptions, Vitest } from 'vitest'

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

Please refer to the type definition for more details.
>>>>>>> 027cb3025019b36c0c413a60234cb68ec0b6fe6c

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

## Ignoring code

两个覆盖率提供商都有自己的方法来忽略覆盖率报告中的代码：

- [`c8`](https://github.com/bcoe/c8#ignoring-uncovered-lines-functions-and-blocks)
- [`ìstanbul`](https://github.com/istanbuljs/nyc#parsing-hints-ignoring-lines)

使用 Typescript 时，源代码使用 `esbuild` 进行转译，这会从源代码中删除所有注释([esbuild#516](https://github.com/evanw/esbuild/issues/516))。
被视为[合法注释](https://esbuild.github.io/api/#legal-comments)的注释。

对于 `istanbul` 测试提供者，你可以在忽略提示中包含 `@preserve` 关键字。
请注意，这些忽略提示现在也可能包含在最终的产品构建中。

```diff
-/* istanbul ignore if */
+/* istanbul ignore if -- @preserve */
if (condition) {
```

<<<<<<< HEAD
不幸的是，目前这在 `c8` 中不起作用。
=======
For `c8` this does not cause any issues. You can use `c8 ignore` comments with Typescript as usual:

<!-- eslint-skip -->
```ts
/* c8 ignore next 3 */
if (condition) {
```
>>>>>>> b0400c7b9dbf7021658bb809c9f1399c75ec4e8b
