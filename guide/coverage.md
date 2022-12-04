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
      provider: 'istanbul' // or 'c8'
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

也可以通过将对象传递给 `test.coverage.provider` 来配置你的自定义覆盖率提供者：

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'
import CustomCoverageProvider from 'my-custom-coverage-provider'

export default defineConfig({
  test: {
    coverage: {
      provider: CustomCoverageProvider()
    },
  },
})
```

<<<<<<< HEAD
请参阅类型定义查看有关详细信息。
=======
Please refer to the type definition for more details.

## Changing the default coverage folder location

When running a coverage report, a `coverage` folder is created in the root directory of your project. If you want to move it to a different directory, use the `test.coverage.reportsDirectory` property in the `vite.config.js` file.

```js
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      reportsDirectory: './tests/unit/coverage'
    }
  }
})
```

## Ignoring code

Both coverage providers have their own ways how to ignore code from coverage reports.

- `c8`: https://github.com/bcoe/c8#ignoring-uncovered-lines-functions-and-blocks
- `ìstanbul` https://github.com/istanbuljs/nyc#parsing-hints-ignoring-lines

When using Typescript the source codes are transpiled using `esbuild`, which strips all comments from the source codes ([esbuild#516](https://github.com/evanw/esbuild/issues/516)).
Comments which are considered as [legal comments](https://esbuild.github.io/api/#legal-comments) are preserved.

For `istanbul` provider you can include a `@preserve` keyword in the ignore hint.
Beware that these ignore hints may now be included in final production build as well.

```diff
-/* istanbul ignore if */
+/* istanbul ignore if -- @preserve */
if (condition) {
```

Unfortunately this does not work for `c8` at the moment.
>>>>>>> 4a1f60ef793735ebeed6e3d020af2ff44777a9aa
