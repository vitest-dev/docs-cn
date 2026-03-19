---
title: coverage | Config
outline: deep
---
<!-- TODO: translation -->
# coverage <CRoot /> {#coverage}

You can use [`v8`](/guide/coverage.html#v8-provider), [`istanbul`](/guide/coverage.html#istanbul-provider) or [a custom coverage solution](/guide/coverage#custom-coverage-provider) for coverage collection.

You can provide coverage options to CLI with dot notation:

```sh
npx vitest --coverage.enabled --coverage.provider=istanbul
```

::: warning
If you are using coverage options with dot notation, don't forget to specify `--coverage.enabled`. Do not provide a single `--coverage` option in that case.
:::

## coverage.provider

- **类型:** `'v8' | 'istanbul' | 'custom'`
- **默认值:** `'v8'`
- **命令行终端:** `--coverage.provider=<provider>`

Use `provider` to select the tool for coverage collection.

## coverage.enabled

- **类型:** `boolean`
- **默认值:** `false`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.enabled`, `--coverage.enabled=false`

Enables coverage collection. Can be overridden using `--coverage` CLI option.

## coverage.include

- **类型:** `string[]`
- **默认值:** Files that were imported during test run
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.include=<pattern>`, `--coverage.include=<pattern1> --coverage.include=<pattern2>`

List of files included in coverage as glob patterns. By default only files covered by tests are included.

It is recommended to pass file extensions in the pattern.

See [Including and excluding files from coverage report](/guide/coverage.html#including-and-excluding-files-from-coverage-report) for examples.

## coverage.exclude

- **类型:** `string[]`
- **默认值:** : `[]`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.exclude=<path>`, `--coverage.exclude=<path1> --coverage.exclude=<path2>`

List of files excluded from coverage as glob patterns.

See [Including and excluding files from coverage report](/guide/coverage.html#including-and-excluding-files-from-coverage-report) for examples.

## coverage.clean

- **类型:** `boolean`
- **默认值:** `true`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.clean`, `--coverage.clean=false`

Clean coverage results before running tests

## coverage.cleanOnRerun

- **类型:** `boolean`
- **默认值:** `true`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.cleanOnRerun`, `--coverage.cleanOnRerun=false`

Clean coverage report on watch rerun. Set to `false` to preserve coverage results from previous run in watch mode.

## coverage.reportsDirectory

- **类型:** `string`
- **默认值:** `'./coverage'`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.reportsDirectory=<path>`

::: warning
Vitest will delete this directory before running tests if `coverage.clean` is enabled (default value).
:::

Directory to write coverage report to.

## coverage.reporter

- **类型:** `string | string[] | [string, {}][]`
- **默认值:** `['text', 'html', 'clover', 'json']`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.reporter=<reporter>`, `--coverage.reporter=<reporter1> --coverage.reporter=<reporter2>`

Coverage reporters to use. See [istanbul documentation](https://istanbul.js.org/docs/advanced/alternative-reporters/) for detailed list of all reporters. See [`@types/istanbul-reports`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/276d95e4304b3670eaf6e8e5a7ea9e265a14e338/types/istanbul-reports/index.d.ts) for details about reporter specific options.

The reporter has three different types:

- A single reporter: `{ reporter: 'html' }`
- Multiple reporters without options: `{ reporter: ['html', 'json'] }`
- A single or multiple reporters with reporter options:
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

You can also pass custom coverage reporters. See [Guide - Custom Coverage Reporter](/guide/coverage#custom-coverage-reporter) for more information.

<!-- eslint-skip -->
```ts
  {
    reporter: [
      // Specify reporter using name of the NPM package
      '@vitest/custom-coverage-reporter',
      ['@vitest/custom-coverage-reporter', { someOption: true }],

      // Specify reporter using local path
      '/absolute/path/to/custom-reporter.cjs',
      ['/absolute/path/to/custom-reporter.cjs', { someOption: true }],
    ]
  }
```

You can check your coverage report in Vitest UI: check [Vitest UI Coverage](/guide/coverage#vitest-ui) for more details.

## coverage.reportOnFailure {#coverage-reportonfailure}

- **类型:** `boolean`
- **默认值:** `false`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.reportOnFailure`, `--coverage.reportOnFailure=false`

Generate coverage report even when tests fail.

## coverage.allowExternal

- **类型:** `boolean`
- **默认值:** `false`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.allowExternal`, `--coverage.allowExternal=false`

Collect coverage of files outside the [project `root`](/config/root).

## coverage.excludeAfterRemap

- **类型:** `boolean`
- **默认值:** `false`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.excludeAfterRemap`, `--coverage.excludeAfterRemap=false`

Apply exclusions again after coverage has been remapped to original sources.
This is useful when your source files are transpiled and may contain source maps of non-source files.

Use this option when you are seeing files that show up in report even if they match your `coverage.exclude` patterns.

## coverage.skipFull

- **类型:** `boolean`
- **默认值:** `false`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.skipFull`, `--coverage.skipFull=false`

Do not show files with 100% statement, branch, and function coverage.

## coverage.thresholds

Options for coverage thresholds.

If a threshold is set to a positive number, it will be interpreted as the minimum percentage of coverage required. For example, setting the lines threshold to `90` means that 90% of lines must be covered.

If a threshold is set to a negative number, it will be treated as the maximum number of uncovered items allowed. For example, setting the lines threshold to `-10` means that no more than 10 lines may be uncovered.

<!-- eslint-skip -->
```ts
{
  coverage: {
    thresholds: {
      // Requires 90% function coverage
      functions: 90,

      // Require that no more than 10 lines are uncovered
      lines: -10,
    }
  }
}
```

### coverage.thresholds.lines

- **类型:** `number`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.lines=<number>`

Global threshold for lines.

### coverage.thresholds.functions

- **类型:** `number`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.functions=<number>`

Global threshold for functions.

### coverage.thresholds.branches

- **类型:** `number`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.branches=<number>`

Global threshold for branches.

### coverage.thresholds.statements

- **类型:** `number`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.statements=<number>`

Global threshold for statements.

### coverage.thresholds.perFile

- **类型:** `boolean`
- **默认值:** `false`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.perFile`, `--coverage.thresholds.perFile=false`

Check thresholds per file.

### coverage.thresholds.autoUpdate

- **类型:** `boolean | function`
- **默认值:** `false`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.autoUpdate=<boolean>`

Update all threshold values `lines`, `functions`, `branches` and `statements` to configuration file when current coverage is better than the configured thresholds.
This option helps to maintain thresholds when coverage is improved.

You can also pass a function for formatting the updated threshold values:

<!-- eslint-skip -->
```ts
{
  coverage: {
    thresholds: {
      // Update thresholds without decimals
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
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.thresholds.100`, `--coverage.thresholds.100=false`

Sets global thresholds to 100.
Shortcut for `--coverage.thresholds.lines 100 --coverage.thresholds.functions 100 --coverage.thresholds.branches 100 --coverage.thresholds.statements 100`.

### coverage.thresholds[glob-pattern]

- **类型:** `{ statements?: number functions?: number branches?: number lines?: number }`
- **默认值:** `undefined`
- **Available for providers:** `'v8' | 'istanbul'`

Sets thresholds for files matching the glob pattern.

::: tip NOTE
Vitest counts all files, including those covered by glob-patterns, into the global coverage thresholds.
This is different from Jest behavior.
:::

<!-- eslint-skip -->
```ts
{
  coverage: {
    thresholds: {
      // Thresholds for all files
      functions: 95,
      branches: 70,

      // Thresholds for matching glob pattern
      'src/utils/**.ts': {
        statements: 95,
        functions: 90,
        branches: 85,
        lines: 80,
      },

      // Files matching this pattern will only have lines thresholds set.
      // Global thresholds are not inherited.
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
- **Available for providers:** `'v8' | 'istanbul'`

Sets thresholds to 100 for files matching the glob pattern.

<!-- eslint-skip -->
```ts
{
  coverage: {
    thresholds: {
      // Thresholds for all files
      functions: 95,
      branches: 70,

      // Thresholds for matching glob pattern
      'src/utils/**.ts': { 100: true },
      '**/math.ts': { 100: true }
    }
  }
}
```

## coverage.ignoreClassMethods

- **类型:** `string[]`
- **默认值:** `[]`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.ignoreClassMethods=<method>`

Set to array of class method names to ignore for coverage.
See [istanbul documentation](https://github.com/istanbuljs/nyc#ignoring-methods) for more information.

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

- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.watermarks.statements=50,80`, `--coverage.watermarks.branches=50,80`

Watermarks for statements, lines, branches and functions. See [istanbul documentation](https://github.com/istanbuljs/nyc#high-and-low-watermarks) for more information.

## coverage.processingConcurrency

- **类型:** `boolean`
- **默认值:** `Math.min(20, os.availableParallelism?.() ?? os.cpus().length)`
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.processingConcurrency=<number>`

Concurrency limit used when processing the coverage results.

## coverage.customProviderModule

- **类型:** `string`
- **Available for providers:** `'custom'`
- **命令行终端:** `--coverage.customProviderModule=<path or module name>`

Specifies the module name or path for the custom coverage provider module. See [Guide - Custom Coverage Provider](/guide/coverage#custom-coverage-provider) for more information.

## coverage.htmlDir

- **类型:** `string`
- **默认值:** Automatically inferred from `html`, `html-spa`, or `lcov` coverage reporters
- **命令行终端:** `--coverage.htmlDir=<path>`

Directory of HTML coverage output to be served in [Vitest UI](/guide/ui) and [HTML reporter](/guide/reporters.html#html-reporter).

This is automatically configured when using builtin coverage reporters that produce HTML output (`html`, `html-spa`, and `lcov`). Use this option to override with a custom coverage reporting location when using custom coverage reporters.

Note that setting this option does not change where coverage HTML report is generated. Configure the `coverage.reporter` option to change the directory instead.

## coverage.changed

- **类型:** `boolean | string`
- **默认值:** `false` (inherits from `test.changed`)
- **Available for providers:** `'v8' | 'istanbul'`
- **命令行终端:** `--coverage.changed`, `--coverage.changed=<commit/branch>`

Collect coverage only for files changed since a specified commit or branch. When set to `true`, it uses staged and unstaged changes.
