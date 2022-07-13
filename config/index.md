---
outline: deep
---

# 配置 Vitest

## 配置

`vitest` 将读取你的项目根目录的 `vite.config.ts` 文件以匹配插件并设置为你的 Vite 应用程序。如果你想使用不同的配置进行测试，你可以：

- 创建 `vitest.config.ts`，优先级更高。
- 将 `--config` 选项传递给 CLI，例如 `vitest --config ./path/to/vitest.config.ts` 。
- 在 `defineConfig` 中使用 `process.env.VITEST` 或 `mode` 属性（默认值是 `test`）在 `vite.config.ts` 中有条件的应用不同的配置。

要配置 `vitest` 本身，请在你的 Vite 配置中添加 `test` 属性。如果你使用 `vite` 的 `defineConfig` 你还需要将 [三斜线指令](https://www.tslang.cn/docs/handbook/triple-slash-directives.html#-reference-types-) 写在配置文件的顶部。

使用 `vite` 的 `defineConfig` 可以参考下面的格式：

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ...
  },
})
```

使用 `vitest` 的 `defineConfig` 可以参考下面的格式：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ...
  },
})
```

如果有需要，你可以获取到 Vitest 的默认选项以扩展它们：

```ts
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'packages/template/*'],
  },
})
```

## 选项

:::tip 提醒
除了以下选项，你还可以使用 [Vite](https://vitejs.dev/config/) 中的任何配置选项。 例如，`define` 定义全局变量，或`resolve.alias` 定义别名。
:::

### include

- **类型:** `string[]`
- **默认值:** `['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']`

匹配包含测试文件的 glob 规则。

### exclude

- **Type:** `string[]`
- **Default:** `['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']`

匹配排除测试文件的 glob 规则。

### deps

- **类型:** `{ external?, inline? }`

对依赖关系进行内联或外联的处理

#### deps.external

- **类型:** `(string | RegExp)[]`
- **默认值:** `['**/node_modules/**', '**/dist/**']`

Externalize 意味着 Vite 会绕过包到原生 Node.js 中。Vite 的转换器和解析器不会应用外部依赖项，因此不会支持重新加载时的热更新。通常，`node_modules` 下的包是外部依赖。

#### deps.inline

- **类型:** `(string | RegExp)[] | true`
- **默认值:** `[]`

Vite 将会处理的内联模块。这有助于处理以 ESM 格式（Node 无法处理）发布 `.js` 的包。

如果为 `true`，则每个依赖项都将被内联。 在 [`ssr.noExternal`](https://vitejs.dev/guide/ssr.html#ssr-externals) 中指定的所有依赖项将默认内联。

#### deps.fallbackCJS

- **类型** `boolean`
- **默认值:** `false`

当一个依赖项是有效的 ESM 包时，将会尝试根据路径猜测 cjs 版本。

如果包在 ESM 和 CJS 模式下具有不同的逻辑，可能会导致一些错误的产生。

#### deps.interopDefault

- **类型:** `boolean`
- **默认值:** `true`

将 CJS 模块的默认值视为命名导出。

### globals

- **类型:** `boolean`
- **默认值:** `false`

默认情况下，`vitest` 不显式提供全局 API。如果你更倾向于使用类似 jest 中的全局 API，可以将 `--globals` 选项传递给 CLI 或在配置中添加 `globals: true`。

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
```

为了可以让全局 API 支持 Typescript，请将 `vitest/globals` 添加到 `tsconfig.json` 中的 `types` 选项中

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

如果你已经在项目中使用 [`unplugin-auto-import`](https://github.com/antfu/unplugin-vue-components)，你也可以直接用它来自动导入这些 API。

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vitest'],
      dts: true, // generate TypeScript declaration
    }),
  ],
})
```

### environment

- **类型:** `'node' | 'jsdom' | 'happy-dom' | 'edge-runtime'`
- **默认值:** `'node'`

Vitest 中的默认测试环境是一个 Node.js 环境。如果你正在构建 Web 端应用程序，你可以使用 [`jsdom`](https://github.com/jsdom/jsdom) 或 [`happy-dom`](https://github.com/capricorn86/happy-dom) 这种类似浏览器(browser-like)的环境来替代 Node.js。
如果你正在构建边缘计算函数，你可以使用 [`edge-runtime`](https://edge-runtime.vercel.app/packages/vm) 环境

你可以通过在文件顶部添加包含 `@vitest-environment` 的文档块或注释，为某个测试文件中的所有测试指定环境：

文档块格式:

```js
/**
 * @vitest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

注释格式:

```js
// @vitest-environment happy-dom

test('use happy-dom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

为了与 Jest 兼容，还存在一个配置 `@jest-environment`：

```js
/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

如果你使用 [`--no-threads`](#threads) 标志运行 Vitest，你的测试将按以下顺序运行：`node`、`jsdom`、`happy-dom`。 这意味着，具有相同环境的每个测试都组合在一起，但仍按顺序运行。

### update

- **类型:** `boolean`
- **默认值:** `false`

更新快照文件。这将更新所有更改的快照并删除过时的快照。

### watch

- **Type:** `boolean`
- **Default:** `true`

启动监听模式

### root

- **类型:** `string`

项目的根目录

### reporters

- **类型:** `Reporter | Reporter[]`
- **默认值:** `'default'`

用于输出的自定义 reporters 。 Reporters 可以是 [一个 Reporter 实例](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/types/reporter.ts) 或选择内置的 reporters 字符串：

  - `'default'` - 当他们经过测试套件
  - `'verbose'` - 保持完整的任务树可见
  - `'dot'` - 将每个任务显示为一个点
  - `'junit'` - JUnit XML 报告器
  - `'json'` - 给出一个简单的 JSON 总结
  - 自定义报告的路径 (例如 `'./path/to/reporter.ts'`, `'@scope/reporter'`)

### outputTruncateLength

- **类型:** `number`
- **默认值:** `80`

指定截断输出差异的字符行数，最多 80 个字符。 你可能希望对此进行调整，取决于你的终端窗口宽度。

### outputDiffLines

- **类型:** `number`
- **默认值:** `15`

指定输出差线的数量，最多 `15` 个。

### outputFile

- **类型:** `string | Record<string, string>`

当指定 `--reporter=json` 或 `--reporter=junit` 时，将测试结果写入一个文件。通过提供对象而不是字符串，你可以在使用多个报告器时定义单独的输出。

要通过 CLI 命令提供对象，请使用以下语法：`--outputFile.json=./path --outputFile.junit=./other-path`。

### threads

- **类型:** `boolean`
- **默认值:** `true`

通过使用 [tinypool](https://github.com/Aslemammad/tinypool)（[Piscina](https://github.com/piscinajs/piscina) 的轻量级分支）可以启用多线程。

:::warning 警告
此选项与 Jest 的 `--runInBand` 不同。 Vitest 使用工作线程不仅可以并行运行测试，还可以提供隔离。 通过禁用此选项，你的测试将按顺序运行，但在相同的全局上下文中，因此你必须自己提供隔离。

如果你依赖全局状态（前端框架通常这样做）或者你的代码依赖于为每个测试单独定义的环境，这可能会导致各种问题。 但是可以提高你的测试速度（最多快 3 倍），这不一定依赖于全局状态或可以轻松绕过它。
:::

### maxThreads

- **类型:** `number`
- **默认值:** 可用的 CPU 数量

允许的最大线程数。你也可以使用 `VITEST_MAX_THREADS` 环境变量。

### minThreads

- **类型:** `number`
- **默认值:** 可用的 CPU 数量

允许的最小线程数。你也可以使用 `VITEST_MIN_THREADS` 环境变量。

### testTimeout

- **类型:** `number`
- **默认值:** `5000`

测试的默认超时时间（以毫秒为单位）。

### hookTimeout

- **类型:** `number`
- **默认值:** `10000`

钩子(hook)的默认超时时间（以毫秒为单位）。

### silent

- **类型:** `boolean`
- **默认值:** `false`

静默模式下运行测试。

### setupFiles

- **Type:** `string | string[]`

Path to setup files. They will be run before each test file.

You can use `process.env.VITEST_POOL_ID` (integer-like string) inside to distinguish between threads (will always be `'1'`, if run with `threads: false`).

:::tip
Note, that if you are running [`--no-threads`](#threads), this setup file will be run in the same global scope multiple times. Meaning, that you are accessing the same global object before each test, so make sure you are not doing the same thing more than you need.
:::

For example, you may rely on a global variable:

```ts
import { config } from '@some-testing-lib'

if (!globalThis.defined) {
  config.plugins = [myCoolPlugin]
  computeHeavyThing()
  globalThis.defined = true
}

// hooks are reset before each suite
afterEach(() => {
  cleanup()
})

globalThis.resetBeforeEachTest = true
```

### globalSetup

- **Type:** `string | string[]`

Path to global setup files, relative to project root

A global setup file can either export named functions `setup` and `teardown` or a `default` function that returns a teardown function ([example](https://github.com/vitest-dev/vitest/blob/main/test/global-setup/vitest.config.ts)).

::: info
Multiple globalSetup files are possible. setup and teardown are executed sequentially with teardown in reverse order.
:::

::: warning
Beware that the global setup is run in a different global scope, so your tests don't have access to variables defined here.
:::


### watchExclude

- **Type:** `string[]`
- **Default:** `['**/node_modules/**', '**/dist/**']`

Glob pattern of file paths to be ignored from triggering watch rerun.

### forceRerunTriggers

- **Type**: `string[]`
- **Default:** `['**/package.json/**', '**/vitest.config.*/**', '**/vite.config.*/**']`

Glob pattern of file paths that will trigger the whole suite rerun. When paired with the `--changed` argument will run the whole test suite if the trigger is found in the git diff.

Useful if you are testing calling CLI commands, because Vite cannot construct a module graph:

```ts
test('execute a script', async () => {
  // Vitest cannot rerun this test, if content of `dist/index.js` changes
  await execa('node', ['dist/index.js'])
})
```

::: tip
Make sure that your files are not excluded by `watchExclude`.
:::

### isolate

- **Type:** `boolean`
- **Default:** `true`

Isolate environment for each test file. Does not work if you disable [`--threads`](#threads).

### coverage

- **Type:** `C8Options`
- **Default:** `undefined`

Coverage options passed to [C8](https://github.com/bcoe/c8).

### testNamePattern

- **Type** `string | RegExp`

Run tests with full names matching the pattern.
If you add `OnlyRunThis` to this property, tests not containing the word `OnlyRunThis` in the test name will be skipped.

```js
import { expect, test } from 'vitest'

// run
test('OnlyRunThis', () => {
  expect(true).toBe(true)
})

// skipped
test('doNotRun', () => {
  expect(true).toBe(true)
})
```

### open

- **Type:** `boolean`
- **Default:** `false`

Open Vitest UI (WIP)

### api

- **Type:** `boolean | number`
- **Default:** `false`

Listen to port and serve API. When set to true, the default port is 51204

### clearMocks

- **Type:** `boolean`
- **Default:** `false`

Will call [`.mockClear()`](/api/#mockclear) on all spies before each test. This will clear mock history, but not reset its implementation to the default one.

### mockReset

- **Type:** `boolean`
- **Default:** `false`

Will call [`.mockReset()`](/api/#mockreset) on all spies before each test. This will clear mock history and reset its implementation to an empty function (will return `undefined`).

### restoreMocks

- **Type:** `boolean`
- **Default:** `false`

Will call [`.mockRestore()`](/api/#mockrestore) on all spies before each test. This will clear mock history and reset its implementation to the original one.

### transformMode

- **Type:** `{ web?, ssr? }`

Determine the transform method of modules

#### transformMode.ssr

- **Type:** `RegExp[]`
- **Default:** `[/\.([cm]?[jt]sx?|json)$/]`

Use SSR transform pipeline for the specified files.<br>
Vite plugins will receive `ssr: true` flag when processing those files.

#### transformMode&#46;web

- **Type:** `RegExp[]`
- **Default:** *modules other than those specified in `transformMode.ssr`*

First do a normal transform pipeline (targeting browser), then do a SSR rewrite to run the code in Node.<br>
Vite plugins will receive `ssr: false` flag when processing those files.

When you use JSX as component models other than React (e.g. Vue JSX or SolidJS), you might want to config as following to make `.tsx` / `.jsx` transformed as client-side components:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
})
```

### snapshotFormat

- **Type:** `PrettyFormatOptions`

Format options for snapshot testing. These options are passed down to [`pretty-format`](https://www.npmjs.com/package/pretty-format).

### resolveSnapshotPath

- **Type**: `(testPath: string, snapExtension: string) => string`
- **Default**: stores snapshot files in `__snapshots__` directory

Overrides default snapshot path. For example, to store snapshots next to test files:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
  },
})
```

### allowOnly

- **Type**: `boolean`
- **Default**: `false`

Allow tests and suites that are marked as only.

### passWithNoTests

- **Type**: `boolean`
- **Default**: `false`

Vitest will not fail, if no tests will be found.

### logHeapUsage

- **Type**: `boolean`
- **Default**: `false`

Show heap usage after each test. Useful for debugging memory leaks.

### css

- **Type**: `boolean | { include?, exclude? }`

Configure if CSS should be processed. When excluded, CSS files will be replaced with empty strings to bypass the subsequent processing.

By default, processes only CSS Modules, because it affects runtime. JSDOM and Happy DOM don't fully support injecting CSS, so disabling this setting might help with performance.

#### css.include

- **Type**: `RegExp | RegExp[]`
- **Default**: `[/\.module\./]`

RegExp pattern for files that should return actual CSS and will be processed by Vite pipeline.

#### css.exclude

- **Type**: `RegExp | RegExp[]`
- **Default**: `[]`

RegExp pattern for files that will return an empty CSS file.

### maxConcurrency

- **Type**: `number`
- **Default**: `5`

A number of tests that are allowed to run at the same time marked with `test.concurrent`.

Test above this limit will be queued to run when available slot appears.

### cache

- **Type**: `false | { dir? }`

Options to configure Vitest cache policy. At the moment Vitest stores cache for test results to run the longer and failed tests first.

#### cache.dir

- **Type**: `string`
- **Default**: `node_modules/.vitest`

Path to cache directory.

### sequence

- **Type**: `{ sequencer?, shuffle?, seed? }`

Options for how tests should be sorted.

#### sequence.sequencer

- **Type**: `TestSequencerConstructor`
- **Default**: `BaseSequencer`

A custom class that defines methods for sharding and sorting. You can extend `BaseSequencer` from `vitest/node`, if you only need to redefine one of the `sort` and `shard` methods, but both should exist.

Sharding is happening before sorting, and only if `--shard` option is provided.

#### sequence.shuffle

- **Type**: `boolean`
- **Default**: `false`

If you want tests to run randomly, you can enable it with this option, or CLI argument [`--sequence.shuffle`](/guide/cli).

Vitest usually uses cache to sort tests, so long running tests start earlier - this makes tests run faster. If your tests will run in random order you will lose this performance improvement, but it may be useful to track tests that accidentally depend on another run previously.

#### sequence.seed

- **Type**: `number`
- **Default**: `Date.now()`

Sets the randomization seed, if tests are running in random order.
