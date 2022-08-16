---
title: Coverage | Guide
---

# 测试覆盖率

<<<<<<< HEAD
Vitest 通过 [`c8`](https://github.com/bcoe/c8) 支持本机代码覆盖率。`c8` 是一个 peer 依赖，要使用覆盖率功能，你首先需要安装它：
=======
Vitest supports Native code coverage via [`c8`](https://github.com/bcoe/c8) and instrumented code coverage via [`istanbul`](https://istanbul.js.org/).
>>>>>>> ac5537f406e90bbd3769bc9602ea19db2b98b7f6

## Coverage Providers

:::tip
Since Vitest v0.22.0
:::

Both `c8` and `istanbul` support are optional. By default, `c8` will be used.

You can select the coverage tool by setting `test.coverage.provider` to either `c8` or `istanbul`:

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

<<<<<<< HEAD
然后你就可以通过在 CLI 中传递 `--coverage` 标志来获得覆盖率。
=======
When you start the Vitest process, it will prompt you to install the corresponding support package automatically.

Or if you prefer to install them manually:

```bash
# For c8
npm i -D @vitest/coverage-c8

# For istanbul
npm i -D @vitest/coverage-istanbul
```

## Coverage Setup

To test with coverage enabled, you can pass the `--coverage` flag in CLI.
>>>>>>> ac5537f406e90bbd3769bc9602ea19db2b98b7f6

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

## Custom Coverage Provider

It's also possible to provide your custom coverage provider by passing an object to the `test.coverage.provider`:

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

Please refer to the type definition for more details.
