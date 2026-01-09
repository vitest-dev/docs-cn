---
title: 测试覆盖率 | 指南
---

# 测试覆盖率 {#coverage}

Vitest 通过 [`v8`](https://v8.dev/blog/javascript-code-coverage) 支持原生代码覆盖率，通过 [`istanbul`](https://istanbul.js.org/) 支持检测代码覆盖率。

## 测试覆盖率提供者 {#coverage-providers}

`v8` 和 `istanbul` 的支持都是可选的。 默认情况下，启用 `v8`。

你可以通过将 `test.coverage.provider` 设置为 `v8` 或 `istanbul` 来选择覆盖工具：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8' // or 'istanbul'
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

## V8 Provider {#v8-provider}

::: info
以下对 V8 覆盖率的说明仅适用于 Vitest，并不适用于其他测试工具。
从 `v3.2.0` 版本开始，Vitest 在 V8 覆盖率中采用了 [基于 AST 的重映射技术](/blog/vitest-3-2#coverage-v8-ast-aware-remapping) ，从而生成与 Istanbul 一致的覆盖率报告。

这让用户在享受 V8 覆盖率高速执行的同时，也能获得 Istanbul 覆盖率的高准确度。
:::

Vitest 默认采用 `v8` 作为覆盖率提供器。
此提供器依赖于基于 [V8 引擎](https://v8.dev/) 的 JavaScript 运行环境，比如 NodeJS、Deno，或者 Google Chrome 等 Chromium 内核的浏览器。

覆盖率收集是在程序运行时完成的，通过 [`node:inspector`](https://nodejs.org/api/inspector.html) 模块以及浏览器中的 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) 协议 与 V8 交互即可实现。这样，用户的源码可以直接被执行，而不需要事先进行插桩处理。

- ✅ 推荐使用该选项
- ✅ 不需要先做转译处理，测试文件可直接运行
- ✅ 执行速度比 Istanbul 更快
- ✅ 占用内存比 Istanbul 更少
- ✅ 覆盖率报告的精确度与 Istanbul 相当（自 [Vitest v3.2.0](/blog/vitest-3-2#coverage-v8-ast-aware-remapping) 起）
- ⚠️ 在某些场景下（如加载大量模块）可能比 Istanbul 慢，因为 V8 不支持只对特定模块收集覆盖率
- ⚠️ 存在 V8 引擎自身的一些小限制，详见 [`ast-v8-to-istanbul` 的限制说明](https://github.com/AriPerkkio/ast-v8-to-istanbul?tab=readme-ov-file#limitations)
- ❌ 不支持非 V8 环境，比如 Firefox、Bun；也不适用于不通过 profiler 提供 V8 覆盖率的环境，例如 Cloudflare Workers

<!-- TODO: translation -->
<script setup>
import ArrowDown from '../.vitepress/components/ArrowDown.vue'
import Box from '../.vitepress/components/Box.vue'
</script>

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

## Istanbul 覆盖率提供方案 {#istanbul-provider}

[Istanbul 代码覆盖率工具](https://istanbul.js.org/) 自 2012 年发布以来，已在各种场景中得到了充分验证。
这种覆盖率提供器能在任何 JavaScript 运行环境中使用，因为它是通过在用户源码中插入额外的代码来跟踪执行情况。

简单来说，插桩就是在你的源文件里加入一段额外的 JavaScript，用于记录代码的执行路径：

```js
// 分支和函数覆盖率计数器的简化示例
const coverage = { // [!code ++]
  branches: { 1: [0, 0] }, // [!code ++]
  functions: { 1: 0 }, // [!code ++]
} // [!code ++]

export function getUsername(id) {
  // 当这个函数被调用时，函数覆盖率会增加  // [!code ++]
  coverage.functions['1']++ // [!code ++]

  if (id == null) {
    // 当这个分支被调用时，分支覆盖率会增加  // [!code ++]
    coverage.branches['1'][0]++ // [!code ++]

    throw new Error('User ID is required')
  }
  // 当 if 语句条件不满足时，隐式的 else 覆盖率会增加  // [!code ++]
  coverage.branches['1'][1]++ // [!code ++]

  return database.getUser(id)
}

globalThis.__VITEST_COVERAGE__ ||= {} // [!code ++]
globalThis.__VITEST_COVERAGE__[filename] = coverage // [!code ++]
```

- ✅ 可以在任何 JavaScript 环境中使用
- ✅ 已被业界广泛采用并在 13 年中得到充分验证
- ✅ 某些情况下执行速度优于 V8，因为插桩可以只针对特定文件，而 V8 会对所有模块插桩
- ❌ 需要在执行前进行插桩处理
- ❌ 由于插桩带来的额外开销，执行速度普遍比 V8 慢
- ❌ 插桩会使文件体积变大
- ❌ 内存消耗比 V8 更高

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

## 覆盖率配置指南 {#coverage-setup}

::: tip
你可以在 [覆盖率配置参考](/config/#coverage) 中查看所有可用的覆盖率选项。
:::

如果想要在测试中开启覆盖率统计，可以在命令行里加上 `--coverage` 参数，或者在 `vitest.config.ts` 文件里将 `coverage.enabled` 设置为 `true` ：

::: code-group
```json [package.json]
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```
```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true
    },
  },
})
```
:::

## 在覆盖率报告中设置需要统计或忽略的文件 {#including-and-excluding-files-from-coverage-report}

你可以通过设置 [`coverage.include`](/config/#coverage-include) 和 [`coverage.exclude`](/config/#coverage-exclude) 来决定覆盖率报告中展示哪些文件。

Vitest 默认只统计测试中实际导入的文件。如果希望报告里也包含那些未被测试覆盖到的文件，需要在 [`coverage.include`](/config/#coverage-include) 中配置一个能匹配你源代码文件的模式：

::: code-group
```ts [vitest.config.ts] {6}
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.{ts,tsx}']
    },
  },
})
```
```sh [Covered Files]
├── src
│   ├── components
│   │   └── counter.tsx   # [!code ++]
│   ├── mock-data
│   │   ├── products.json # [!code error]
│   │   └── users.json    # [!code error]
│   └── utils
│       ├── formatters.ts # [!code ++]
│       ├── time.ts       # [!code ++]
│       └── users.ts      # [!code ++]
├── test
│   └── utils.test.ts     # [!code error]
│
├── package.json          # [!code error]
├── tsup.config.ts        # [!code error]
└── vitest.config.ts      # [!code error]
```
:::

如果你想从覆盖率中排除已经被 `coverage.include` 匹配到的部分文件，可以通过额外配置 [`coverage.exclude`](/config/#coverage-exclude) 来实现：

::: code-group
```ts [vitest.config.ts] {7}
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/utils/users.ts']
    },
  },
})
```
```sh [Covered Files]
├── src
│   ├── components
│   │   └── counter.tsx   # [!code ++]
│   ├── mock-data
│   │   ├── products.json # [!code error]
│   │   └── users.json    # [!code error]
│   └── utils
│       ├── formatters.ts # [!code ++]
│       ├── time.ts       # [!code ++]
│       └── users.ts      # [!code error]
├── test
│   └── utils.test.ts     # [!code error]
│
├── package.json          # [!code error]
├── tsup.config.ts        # [!code error]
└── vitest.config.ts      # [!code error]
```
:::

## 自定义覆盖率的报告器 {#custom-coverage-reporter}

我们可以通过在 `test.coverage.reporter` 中传递软件包名称或绝对路径来使用自定义覆盖报告器：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: [
        // 使用 NPM 包的名称指定报告器
        ['@vitest/custom-coverage-reporter', { someOption: true }],

        // 使用本地路径指定报告器
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

    // 从配置中传递的选项在这里可用
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

## 自定义覆盖率的提供者 {#custom-coverage-provider}

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

  // 实现 CoverageProviderModule 的其余部分...
}

class CustomCoverageProvider implements CoverageProvider {
  name = 'custom-coverage-provider'
  options!: ResolvedCoverageOptions

  initialize(ctx: Vitest) {
    this.options = ctx.config.coverage
  }

  // 实现 CoverageProvider 的其余部分...
}

export default CustomCoverageProviderModule
```

请参阅类型定义查看有关详细信息。

## 代码忽略 {#ignoring-code}

两个覆盖率提供商都有自己的方法来忽略覆盖率报告中的代码：

- [`v8`](https://github.com/AriPerkkio/ast-v8-to-istanbul?tab=readme-ov-file#ignoring-code)
- [`istanbul`](https://github.com/istanbuljs/nyc#parsing-hints-ignoring-lines)

使用 TypeScript 时，源代码使用 `esbuild` 进行转译，这会从源代码中删除所有注释([esbuild#516](https://github.com/evanw/esbuild/issues/516))。
被视为[合法注释](https://esbuild.github.io/api/#legal-comments)的注释将被保留。

你可以在忽略提示里加入 `@preserve` 关键字。
但要小心，这些忽略提示有可能会被打包进最终的生产环境构建中。

```diff
-/* istanbul ignore if */
+/* istanbul ignore if -- @preserve */
if (condition) {

-/* v8 ignore if */
+/* v8 ignore if -- @preserve */
if (condition) {
```

### 示例 {#examples}

::: code-group

```ts [if else]
/* v8 ignore if -- @preserve */
if (parameter) { // [!code error]
  console.log('Ignored') // [!code error]
} // [!code error]
else {
  console.log('Included')
}

/* v8 ignore else -- @preserve */
if (parameter) {
  console.log('Included')
}
else { // [!code error]
  console.log('Ignored') // [!code error]
} // [!code error]
```

```ts [next node]
/* v8 ignore next -- @preserve */
console.log('Ignored') // [!code error]
console.log('Included')

/* v8 ignore next -- @preserve */
function ignored() { // [!code error]
  console.log('all') // [!code error]
  // [!code error]
  console.log('lines') // [!code error]
  // [!code error]
  console.log('are') // [!code error]
  // [!code error]
  console.log('ignored') // [!code error]
} // [!code error]

/* v8 ignore next -- @preserve */
class Ignored { // [!code error]
  ignored() {} // [!code error]
  alsoIgnored() {} // [!code error]
} // [!code error]

/* v8 ignore next -- @preserve */
condition // [!code error]
  ? console.log('ignored') // [!code error]
  : console.log('also ignored') // [!code error]
```

```ts [try catch]
/* v8 ignore next -- @preserve */
try { // [!code error]
  console.log('Ignored') // [!code error]
} // [!code error]
catch (error) { // [!code error]
  console.log('Ignored') // [!code error]
} // [!code error]

try {
  console.log('Included')
}
catch (error) {
  /* v8 ignore next -- @preserve */
  console.log('Ignored') // [!code error]
  /* v8 ignore next -- @preserve */
  console.log('Ignored') // [!code error]
}

// 由于 esbuild 不支持，需要使用 rolldown-vite。
// 参阅 https://vite.dev/guide/rolldown.html#how-to-try-rolldown
try {
  console.log('Included')
}
catch (error) /* v8 ignore next */ { // [!code error]
  console.log('Ignored') // [!code error]
} // [!code error]
```

```ts [switch case]
switch (type) {
  case 1:
    return 'Included'

  /* v8 ignore next -- @preserve */
  case 2: // [!code error]
    return 'Ignored' // [!code error]

  case 3:
    return 'Included'

  /* v8 ignore next -- @preserve */
  default: // [!code error]
    return 'Ignored' // [!code error]
}
```

```ts [whole file]
/* v8 ignore file -- @preserve */
export function ignored() { // [!code error]
  return 'Whole file is ignored'// [!code error]
}// [!code error]
```
:::

## 覆盖率性能 {#coverage-performance}

如果你的项目中代码覆盖率生成较慢，请参阅 [性能测试分析 | 代码覆盖率](/guide/profiling-test-performance.html#code-coverage)。

## UI 模式 {#vitest-ui}

我们可以在 [UI 模式](/guide/ui) 中查看你的覆盖率报告。

UI 模式 会在以下情况下启用覆盖率报告：

- 显式启用覆盖率报告：在配置文件中设置 `coverage.enabled=true` ，或运行 Vitest 时添加 `--coverage.enabled=true` 标志。
- 添加 HTML 报告器：将 `html` 添加到 `coverage.reporter` 列表中，我们还可以启用 `subdir` 选项，将覆盖率报告放在子目录中。

<img alt="html coverage activation in Vitest UI" img-light src="/vitest-ui-show-coverage-light.png">
<img alt="html coverage activation in Vitest UI" img-dark src="/vitest-ui-show-coverage-dark.png">

<img alt="html coverage in Vitest UI" img-light src="/ui-coverage-1-light.png">
<img alt="html coverage in Vitest UI" img-dark src="/ui-coverage-1-dark.png">
