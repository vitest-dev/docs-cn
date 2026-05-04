---
title: reporters | 配置
---

# reporters <CRoot />

- **类型:**

```ts
interface UserConfig {
  reporters?: ConfigReporter | Array<ConfigReporter>
}

type ConfigReporter = string | Reporter | [string, object?]
```
<!-- TODO: translation -->
- **Default:** [`'default'`](/guide/reporters#default-reporter). See [Default Reporters](/guide/reporters#default-reporters) for environment-specific behavior.
- **CLI:**
  - `--reporter=tap` for a single reporter
  - `--reporter=verbose --reporter=github-actions` for multiple reporters

此选项定义在 Vitest 测试运行期间可用的单个报告器或报告器列表。

除了内置报告器，你也可以传入 [`Reporter` 接口](/api/advanced/reporters) 的自定义实现，或指向导出该接口默认导出的模块路径（例如：`'./path/to/reporter.ts'`, `'@scope/reporter'`）。

你可以通过提供一个元组来配置报告器：`[string, object]`，其中字符串是报告器名称，对象是报告器配置选项。

::: warning
注意 [coverage](/guide/coverage) 功能使用了不同的 [`coverage.reporter`](/config/coverage#reporter) 选项。
:::

## 内置报告器 {#built-in-reporters}

- [`default`](/guide/reporters#default-reporter)
- [`verbose`](/guide/reporters#verbose-reporter)
- [`tree`](/guide/reporters#tree-reporter)
- [`dot`](/guide/reporters#dot-reporter)
- [`junit`](/guide/reporters#junit-reporter)
- [`json`](/guide/reporters#json-reporter)
- [`html`](/guide/reporters#html-reporter)
- [`tap`](/guide/reporters#tap-reporter)
- [`tap-flat`](/guide/reporters#tap-flat-reporter)
- [`hanging-process`](/guide/reporters#hanging-process-reporter)
- [`github-actions`](/guide/reporters#github-actions-reporter)
- [`minimal`](/guide/reporters#minimal-reporter) (aliased as `agent`)
- [`blob`](/guide/reporters#blob-reporter)

## 示例 {#example}

::: code-group
```js [vitest.config.js]
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: [
      ...configDefaults.reporters,
      // 条件报告器
      ...(process.env.CI ? ['html'] : []),
      // 来自 npm 包的自定义报告器
      // 选项将以元组形式向下传递
      [
        'vitest-sonar-reporter',
        { outputFile: 'sonar-report.xml' }
      ],
    ]
  }
})
```
```bash [CLI]
vitest --reporter=github-actions --reporter=junit
```
:::
