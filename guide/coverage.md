---
title: 测试覆盖率 | 指南
---

# 测试覆盖率

Vitest 通过 [`v8`](https://v8.dev/blog/javascript-code-coverage) 支持原生代码覆盖率，通过 [`istanbul`](https://istanbul.js.org/) 支持检测代码覆盖率。

## 测试覆盖率提供者

`v8` 和 `istanbul` 的支持都是可选的。 默认情况下，启用 `v8`。

你可以通过将 `test.coverage.provider` 设置为 `v8` 或 `istanbul` 来选择覆盖工具：

```ts [vitest.config.ts]
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

::: code-group

```bash [v8]
npm i -D @vitest/coverage-v8
```

```bash [istanbul]
npm i -D @vitest/coverage-istanbul
```

:::

<<<<<<< HEAD
## 覆盖率配置
=======
## V8 Provider

::: info
The description of V8 coverage below is Vitest specific and does not apply to other test runners.
Since `v3.2.0` Vitest has used [AST based coverage remapping](/blog/vitest-3-2#coverage-v8-ast-aware-remapping) for V8 coverage, which produces identical coverage reports to Istanbul.

This allows users to have the speed of V8 coverage with accuracy of Istanbul coverage.
:::

By default Vitest uses `'v8'` coverage provider.
This provider requires Javascript runtime that's implemented on top of [V8 engine](https://v8.dev/), such as NodeJS, Deno or any Chromium based browsers such as Google Chrome.

Coverage collection is performed during runtime by instructing V8 using [`node:inspector`](https://nodejs.org/api/inspector.html) and [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) in browsers. User's source files can be executed as-is without any pre-instrumentation steps.

- ✅ Recommended option to use
- ✅ No pre-transpile step. Test files can be executed as-is.
- ✅ Faster execute times than Istanbul.
- ✅ Lower memory usage than Istanbul.
- ✅ Coverage report accuracy is as good as with Istanbul ([since Vitest `v3.2.0`](/blog/vitest-3-2#coverage-v8-ast-aware-remapping)).
- ⚠️ In some cases can be slower than Istanbul, e.g. when loading lots of different modules. V8 does not support limiting coverage collection to specific modules.
- ⚠️ There are some minor limitations set by V8 engine. See [`ast-v8-to-istanbul` | Limitations](https://github.com/AriPerkkio/ast-v8-to-istanbul?tab=readme-ov-file#limitations).
- ❌ Does not work on environments that don't use V8, such as Firefox or Bun. Or on environments that don't expose V8 coverage via profiler, such as Cloudflare Workers.

<div style="display: flex; flex-direction: column; align-items: center; padding: 2rem 0; max-width: 20rem;">
  <Box>Test file</Box>
  <ArrowDown />
  <Box>Enable V8 runtime coverage collection</Box>
  <ArrowDown />
  <Box>Run file</Box>
  <ArrowDown />
  <Box>Collect coverage results from V8</Box>
  <ArrowDown />
  <Box>Remap coverage results to source files</Box>
  <ArrowDown />
  <Box>Coverage report</Box>
</div>

## Istanbul provider

[Istanbul code coverage tooling](https://istanbul.js.org/) has existed since 2012 and is very well battle-tested.
This provider works on any Javascript runtime as coverage tracking is done by instrumenting user's source files.

In practice, instrumenting source files means adding additional Javascript in user's files:

```js
// Simplified example of branch and function coverage counters
const coverage = { // [!code ++]
  branches: { 1: [0, 0] }, // [!code ++]
  functions: { 1: 0 }, // [!code ++]
} // [!code ++]

export function getUsername(id) {
  // Function coverage increased when this is invoked  // [!code ++]
  coverage.functions['1']++ // [!code ++]

  if (id == null) {
    // Branch coverage increased when this is invoked  // [!code ++]
    coverage.branches['1'][0]++ // [!code ++]

    throw new Error('User ID is required')
  }
  // Implicit else coverage increased when if-statement condition not met  // [!code ++]
  coverage.branches['1'][1]++ // [!code ++]

  return database.getUser(id)
}

globalThis.__VITEST_COVERAGE__ ||= {} // [!code ++]
globalThis.__VITEST_COVERAGE__[filename] = coverage // [!code ++]
```

- ✅ Works on any Javascript runtime
- ✅ Widely used and battle-tested for over 13 years.
- ✅ In some cases faster than V8. Coverage instrumentation can be limited to specific files, as opposed to V8 where all modules are instrumented.
- ❌ Requires pre-instrumentation step
- ❌ Execution speed is slower than V8 due to instrumentation overhead
- ❌ Instrumentation increases file sizes
- ❌ Memory usage is higher than V8

<div style="display: flex; flex-direction: column; align-items: center; padding: 2rem 0; max-width: 20rem;">
  <Box>Test file</Box>
  <ArrowDown />
  <Box>Pre‑instrumentation with Babel</Box>
  <ArrowDown />
  <Box>Run file</Box>
  <ArrowDown />
  <Box>Collect coverage results from Javascript scope</Box>
  <ArrowDown />
  <Box>Remap coverage results to source files</Box>
  <ArrowDown />
  <Box>Coverage report</Box>
</div>

## Coverage Setup
>>>>>>> 5a7939506e3edd85f9c39e0bdfd9fbdf1c5ed017

:::tip
建议始终在配置文件中定义 [`coverage.include`](https://cn.vitest.dev/config/#coverage-include)。
这有助于 Vitest 减少 [`coverage.all`](https://cn.vitest.dev/config/#coverage-all) 选择的文件数量。
:::

要在启用的情况下进行测试，你可以在 CLI 中传递 `--coverage` 标志。
默认情况下, 将使用 `['text', 'html', 'clover', 'json']` 作为测试报告器。

```json [package.json]
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

要对其进行配置，需要在配置文件中设置 `test.coverage` 选项：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

## 自定义覆盖率的报告器

我们可以通过在 `test.coverage.reporter` 中传递软件包名称或绝对路径来使用自定义覆盖报告器：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: [
        // Specify reporter using name of the NPM package
        ['@vitest/custom-coverage-reporter', { someOption: true }],

        // Specify reporter using local path
        '/absolute/path/to/custom-reporter.cjs',
      ],
    },
  },
})
```

自定义报告器由 Istanbul 加载，必须与其报告器接口相匹配。查看 [built-in reporters' implementation](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib) 了解更多详情。

```js [custom-reporter.cjs]
const { ReportBase } = require('istanbul-lib-report')

module.exports = class CustomReporter extends ReportBase {
  constructor(opts) {
    super()

    // Options passed from configuration are available here
    this.file = opts.file
  }

  onStart(root, context) {
    this.contentWriter = context.writer.writeFile(this.file)
    this.contentWriter.println('Start of custom coverage report')
  }

  onEnd() {
    this.contentWriter.println('End of custom coverage report')
    this.contentWriter.close()
  }
}
```

## 自定义覆盖率的提供者

也可以通过将 `'custom'` 传递给 `test.coverage.provider` 来配置你的自定义覆盖率提供者：

```ts [vitest.config.ts]
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

```ts [my-custom-coverage-provider.ts]
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

运行覆盖率报告时，项目根目录下会生成一个名为 `coverage` 的文件夹。如果想把它移动到其他目录，可以在 `vitest.config.js` 文件中使用 `test.coverage.reportsDirectory` 属性。

```js [vitest.config.js]
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
- [`istanbul`](https://github.com/istanbuljs/nyc#parsing-hints-ignoring-lines)
- `v8` with [`experimentalAstAwareRemapping: true`](https://vitest.dev/config/#coverage-experimentalAstAwareRemapping) see [ast-v8-to-istanbul | Ignoring code](https://github.com/AriPerkkio/ast-v8-to-istanbul?tab=readme-ov-file#ignoring-code)

使用 TypeScript 时，源代码使用 `esbuild` 进行转译，这会从源代码中删除所有注释([esbuild#516](https://github.com/evanw/esbuild/issues/516))。
被视为[合法注释](https://esbuild.github.io/api/#legal-comments)的注释将被保留。

<<<<<<< HEAD
对于 `istanbul` 测试提供者，你可以在忽略提示中包含 `@preserve` 关键字。
请注意，这些忽略提示现在也可能包含在最终的产品构建中。
=======
You can include a `@preserve` keyword in the ignore hint.
Beware that these ignore hints may now be included in final production build as well.
>>>>>>> 5a7939506e3edd85f9c39e0bdfd9fbdf1c5ed017

```diff
-/* istanbul ignore if */
+/* istanbul ignore if -- @preserve */
if (condition) {

<<<<<<< HEAD
不幸的是，目前这在 `v8` 中不起作用。你通常可以在 TypeScript 使用 `v8 ignore` 注释：

<!-- eslint-skip -->

```ts
/* v8 ignore next 3 */
=======
-/* v8 ignore if */
+/* v8 ignore if -- @preserve */
>>>>>>> 5a7939506e3edd85f9c39e0bdfd9fbdf1c5ed017
if (condition) {
```

## 其他选项

要查看有关覆盖率的所有可配置选项，请参见 [覆盖率配置参考](https://cn.vitest.dev/config/#coverage)。

## Coverage Performance

If code coverage generation is slow on your project, see [Profiling Test Performance | Code coverage](/guide/profiling-test-performance.html#code-coverage).

## Vitest UI

我们可以在 [Vitest UI](/guide/ui) 中查看你的覆盖率报告。

Vitest UI 会在以下情况下启用覆盖率报告：

- 显式启用覆盖率报告：在配置文件中设置 `coverage.enabled=true` ，或运行 Vitest 时添加 `--coverage.enabled=true` 标志。
- 添加 HTML 报告器：将 `html` 添加到 `coverage.reporter` 列表中，我们还可以启用 `subdir` 选项，将覆盖率报告放在子目录中。

<img alt="html coverage activation in Vitest UI" img-light src="/vitest-ui-show-coverage-light.png">
<img alt="html coverage activation in Vitest UI" img-dark src="/vitest-ui-show-coverage-dark.png">

<img alt="html coverage in Vitest UI" img-light src="/ui-coverage-1-light.png">
<img alt="html coverage in Vitest UI" img-dark src="/ui-coverage-1-dark.png">
