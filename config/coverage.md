---
title: coverage | 配置
outline: deep
---

# coverage <CRoot /> {#coverage}

你可以选择 [`v8`](/guide/coverage.html#v8-provider)、[`istanbul`](/guide/coverage.html#istanbul-provider) 或 [自定义代码覆盖率工具](/guide/coverage#custom-coverage-provider) 来进行代码覆盖率统计。

你可以通过点符号向 CLI 提供覆盖率选项：

```sh
npx vitest --coverage.enabled --coverage.provider=istanbul
```

::: warning
如果你使用点符号配置覆盖率选项，别忘了指定 `--coverage.enabled`。在这种情况下，不要只提供单个 `--coverage` 选项。
:::

## coverage.provider

- **类型:** `'v8' | 'istanbul' | 'custom'`
- **默认值:** `'v8'`
- **命令行终端:** `--coverage.provider=<provider>`

使用 `provider` 选择收集测试覆盖率的工具。

## coverage.enabled

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.enabled`, `--coverage.enabled=false`

是否启用收集测试覆盖率。可以使用 `--coverage` 覆盖 CLI 选项。

## coverage.include

- **类型:** `string[]`
- **默认值:** 在执行测试过程中所引入的文件
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.include=<pattern>`, `--coverage.include=<pattern1> --coverage.include=<pattern2>`

以 glob 模式指定需要统计覆盖率的文件列表。默认情况下，仅包含被测试覆盖的文件。

建议在匹配规则中传递文件扩展名。

更多示例请参阅 [在覆盖率报告中包含和排除文件](/guide/coverage.html#including-and-excluding-files-from-coverage-report)

## coverage.exclude

- **类型:** `string[]`
- **默认值:** : `[]`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.exclude=<path>`, `--coverage.exclude=<path1> --coverage.exclude=<path2>`

以 glob 模式指定从代码覆盖率中排除的文件列表。

更多示例请参阅 [在覆盖率报告中包含和排除文件](/guide/coverage.html#including-and-excluding-files-from-coverage-report)。

## coverage.clean

- **类型:** `boolean`
- **默认值:** `true`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.clean`, `--coverage.clean=false`

运行测试前清除代码覆盖率结果。

## coverage.cleanOnRerun

- **类型:** `boolean`
- **默认值:** `true`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.cleanOnRerun`, `--coverage.cleanOnRerun=false`

在 watch 模式重新运行时清除代码覆盖率报告。设为 `false` 可在 watch 模式下保留上一次运行的代码覆盖率结果。

## coverage.reportsDirectory

- **类型:** `string`
- **默认值:** `'./coverage'`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.reportsDirectory=<path>`

::: warning
如果启用了（默认值） `coverage.clean`，Vitest 会在运行测试前删除此目录。
:::

用于写入代码覆盖率报告的目录。

## coverage.reporter

- **类型:** `string | string[] | [string, {}][]`
- **默认值:** `['text', 'html', 'clover', 'json']`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.reporter=<reporter>`, `--coverage.reporter=<reporter1> --coverage.reporter=<reporter2>`

要使用的代码覆盖率报告器。所有报告器的详细列表请参阅 [istanbul 文档](https://istanbul.js.org/docs/advanced/alternative-reporters/)。关于报告器特定选项的详细信息请参阅 [`@types/istanbul-reports`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/276d95e4304b3670eaf6e8e5a7ea9e265a14e338/types/istanbul-reports/index.d.ts)。

报告器有三种不同的类型：

- 单个报告器：`{ reporter: 'html' }`
- 不带选项的多个报告器：`{ reporter: ['html', 'json'] }`
- 带有报告器选项的单个或多个报告器：
  <!-- eslint-skip -->
  ```ts
  {
    reporter: [
      ['lcov', { 'projectRoot': './src' }],
      ['json', { 'file': 'coverage.json' }],
      ['text']
    ]
  }
  ```

你也可以传递自定义代码覆盖率报告器。更多信息请参阅 [指南 | 自定义代码覆盖率报告器](/guide/coverage#custom-coverage-reporter)。

<!-- eslint-skip -->
```ts
  {
    reporter: [
       // 使用 NPM 包名指定报告器
      '@vitest/custom-coverage-reporter',
      ['@vitest/custom-coverage-reporter', { someOption: true }],

      // 使用本地路径指定报告器
      '/absolute/path/to/custom-reporter.cjs',
      ['/absolute/path/to/custom-reporter.cjs', { someOption: true }],
    ]
  }
```

你可以在 Vitest UI 模式中查看代码覆盖率报告。更多详情请参阅 [Vitest UI Coverage](/guide/coverage#vitest-ui)。
<!-- TODO: translation -->
::: tip AI coding agents
When Vitest detects it is running inside an AI coding agent, it automatically adds the `text-summary` reporter and sets `skipFull: true` on the `text` reporter to reduce output and minimize token usage.
:::

## coverage.reportOnFailure {#coverage-reportonfailure}

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.reportOnFailure`, `--coverage.reportOnFailure=false`

即使测试失败也生成代码覆盖率报告。

## coverage.allowExternal

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.allowExternal`, `--coverage.allowExternal=false`

收集 [项目根路径](/config/root) 以外文件的代码覆盖率。

## coverage.excludeAfterRemap

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.excludeAfterRemap`, `--coverage.excludeAfterRemap=false`

在覆盖率数据已重新映射回原始源代码后，再次应用排除规则。
适用于源文件经过转译且可能包含非源文件的 source map 的情况。

当发现某些文件即使匹配了 `coverage.exclude` 模式仍出现在报告中时，请使用此选项。

## coverage.skipFull

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.skipFull`, `--coverage.skipFull=false`

是否显示语句、分支和函数覆盖率达到 100% 的文件。

## coverage.thresholds

覆盖率阈值选项。

如果阈值设置为正数，将被解释为要求的最低代码覆盖率百分比。例如，将行阈值设置为 `90` 意味着必须覆盖 90% 的行。

如果阈值设置为负数，将被视为允许的最大未覆盖项目数。例如，将行阈值设置为 `-10` 意味着未覆盖的行数不得超过 10 行。

<!-- eslint-skip -->
```ts
{
  coverage: {
    thresholds: {
      // 要求函数覆盖率达到 90%
      functions: 90,

      // 要求未覆盖代码行数不超过 10 行
      lines: -10,
    }
  }
}
```

### coverage.thresholds.lines

- **类型:** `number`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.lines=<number>`

行数（lines）全局阈值。

### coverage.thresholds.functions

- **类型:** `number`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.functions=<number>`

函数（functions）全局阈值。

### coverage.thresholds.branches

- **类型:** `number`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.branches=<number>`

分支（branches）全局阈值。

### coverage.thresholds.statements

- **类型:** `number`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.statements=<number>`

语句（statements）全局阈值。

### coverage.thresholds.perFile

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.perFile`, `--coverage.thresholds.perFile=false`

按文件检查覆盖率阈值。

### coverage.thresholds.autoUpdate

- **类型:** `boolean | function`
- **默认值:** `false`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.autoUpdate=<boolean>`

当实际覆盖率超过配置阈值时，自动将 `lines`、`functions`、`branches` 和 `statements` 的阈值更新到配置文件中。
此选项适用于覆盖率提高时保持阈值不变。

你也可以通过传入函数自定义阈值更新值的格式：

<!-- eslint-skip -->
```ts
{
  coverage: {
    thresholds: {
      // 更新阈值为整数
      autoUpdate: (newThreshold) => Math.floor(newThreshold),

      // 95.85 -> 95
      functions: 95,
    }
  }
}
```

### coverage.thresholds.100

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.100`, `--coverage.thresholds.100=false`

将全局阈值设置为 100。
这是 `--coverage.thresholds.lines 100 --coverage.thresholds.functions 100 --coverage.thresholds.branches 100 --coverage.thresholds.statements 100` 的快捷方式。

### coverage.thresholds[glob-pattern]

- **类型:** `{ statements?: number functions?: number branches?: number lines?: number }`
- **默认值:** `undefined`
- **可用的测试提供者:** `'v8' | 'istanbul'`

设置与 glob 模式匹配的文件的阈值。

::: tip 注意
Vitest 会将所有文件（包括匹配 glob 模式的文件）计入全局覆盖率阈值计算。
此做法与 Jest 不同。
:::

<!-- eslint-skip -->
```ts
{
  coverage: {
    thresholds: {
      // 所有文件的阈值
      functions: 95,
      branches: 70,

      // 对匹配 glob 模式的文件设置独立阈值
      'src/utils/**.ts': {
        statements: 95,
        functions: 90,
        branches: 85,
        lines: 80,
      },

      // 匹配此模式的文件仅设置行覆盖率阈值
      // 不继承全局阈值
      '**/math.ts': {
        lines: 100,
      }
    }
  }
}
```

### coverage.thresholds[glob-pattern].100

- **类型:** `boolean`
- **默认值:** `false`
- **可用的测试提供者:** `'v8' | 'istanbul'`

为匹配 glob 模式的文件设置 100% 覆盖率阈值。

<!-- eslint-skip -->
```ts
{
  coverage: {
    thresholds: {
      // 所有文件的阈值
      functions: 95,
      branches: 70,

      // 全局模式匹配阈值
      'src/utils/**.ts': { 100: true },
      '**/math.ts': { 100: true }
    }
  }
}
```

## coverage.ignoreClassMethods

- **类型:** `string[]`
- **默认值:** `[]`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.ignoreClassMethods=<method>`

设置为要忽略覆盖率的类方法名称数组。
更多信息请参阅 [istanbul 文档](https://github.com/istanbuljs/nyc#ignoring-methods)。

## coverage.watermarks

- **类型:**
<!-- eslint-skip -->
```ts
{
  statements?: [number, number],
  functions?: [number, number],
  branches?: [number, number],
  lines?: [number, number]
}
```

- **默认值:**
<!-- eslint-skip -->
```ts
{
  statements: [50, 80],
  functions: [50, 80],
  branches: [50, 80],
  lines: [50, 80]
}
```

- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.watermarks.statements=50,80`, `--coverage.watermarks.branches=50,80`

语句、行、分支和函数的阈值标记。更多信息请参阅 [istanbul 文档](https://github.com/istanbuljs/nyc#high-and-low-watermarks)。

## coverage.processingConcurrency

- **类型:** `boolean`
- **默认值:** `Math.min(20, os.availableParallelism?.() ?? os.cpus().length)`
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.processingConcurrency=<number>`

处理代码覆盖率结果时使用的并发限制。
<!-- TODO: translation -->
## coverage.instrumenter <Version type="experimental">4.1.5</Version> {#coverage-instrumenter}

- **Type:** `(options: InstrumenterOptions) => CoverageInstrumenter`
- **Available for providers:** `'istanbul'`

Factory for a custom instrumenter to use in place of the default `istanbul-lib-instrument`. Vitest calls the factory once during initialization and reuses the returned instrumenter for every file. The rest of the Istanbul pipeline (collection, merging, reporting) is unchanged.

The factory receives an `InstrumenterOptions` object with Vitest's runtime coverage settings, and must return an object implementing the `CoverageInstrumenter` interface. Both types are exported from `vitest/node`.

<!-- eslint-skip -->
```ts
interface InstrumenterOptions {
  coverageVariable: string
  coverageGlobalScope: string
  coverageGlobalScopeFunc: boolean
  ignoreClassMethods: string[]
}

interface CoverageInstrumenter {
  instrumentSync: (code: string, filename: string, inputSourceMap?: any) => string
  lastSourceMap: () => any
  lastFileCoverage: () => any
}
```

<!-- eslint-skip -->
```ts
import { defineConfig } from 'vitest/config'
import { createInstrumenter } from '@vitest/some-custom-instrumenter'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      instrumenter: options => createInstrumenter(options),
    }
  }
})
```

## coverage.customProviderModule

- **类型:** `string`
- **可用的测试提供者:** `'custom'`
- **命令行终端:** `--coverage.customProviderModule=<path or module name>`

指定自定义代码覆盖率驱动模块的模块名或路径。更多信息请参阅 [指南 - 自定义覆盖率提供者](/guide/coverage#custom-coverage-provider)。

## coverage.htmlDir

- **类型:** `string`
- **默认值:** 从 `html`、`html-spa` 或 `lcov` 代码覆盖率报告器自动推断
- **命令行终端:** `--coverage.htmlDir=<path>`

要在 [UI 模式](/guide/ui) 和 [HTML 报告器](/guide/reporters.html#html-reporter) 中提供的 HTML 代码覆盖率输出目录。

使用内置代码覆盖率报告器生成 HTML 输出（`html`、`html-spa` 和`lcov`）时会自动配置此项。使用自定义代码覆盖率报告器时，使用此选项可覆盖为自定义代码覆盖率报告位置。

注意，设置此选项不会更改代码覆盖率 HTML 报告的生成位置。要更改目录，请配置 `coverage.reporter` 选项。

## coverage.changed

- **类型:** `boolean | string`
- **默认值:** `false` (inherits from `test.changed`)
- **可用的测试提供者:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.changed`, `--coverage.changed=<commit/branch>`

仅收集自指定提交或分支以来更改的文件的代码覆盖率。设置为 `true` 时，使用已暂存和未暂存的更改。
