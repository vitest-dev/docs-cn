---
title: 迁移指南 | 指南
outline: deep
---

# 迁移指南 {#migration-guide}

[迁移至 Vitest 4.0](https://v4.vitest.dev/guide/migration) | [迁移至 Vitest 3.0](https://v3.vitest.dev/guide/migration)

## 迁移至 Vitest 5.0 {#vitest-5}

::: warning 进行中
Vitest 5.0 目前处于 beta 阶段。本章节跟踪已合并的重大变更，在稳定版发布前可能还会发生变化。
:::

::: warning Prerequisites
Vitest 5.0 requires Vite >= 6.4.0 and Node.js >= 22.12.0. Before proceeding with any other migration steps, ensure your environment meets these requirements. Running Vitest 5.0 on older versions of Vite or Node.js is not supported and may result in unexpected errors.
:::

### `clearMocks` is Enabled by Default

[`clearMocks`](/config/#clearmocks) now defaults to `true`. Vitest calls [`vi.clearAllMocks()`](/api/vi#vi-clearallmocks) before every test, resetting the `mock.calls`, `mock.instances`, `mock.contexts` and `mock.results` of every mock. Mock implementations are left intact, so this only affects the recorded history.

In practice this means a mock no longer carries calls from one test into the next:

```ts
import { expect, test, vi } from 'vitest'

const fn = vi.fn()

test('first', () => {
  fn()
  expect(fn).toHaveBeenCalledTimes(1)
})

test('second', () => {
  fn()
  // v4: the call from "first" was kept, so this was 2 // [!code --]
  expect(fn).toHaveBeenCalledTimes(2) // [!code --]
  // v5: history is cleared before each test, so only this test's call counts // [!code ++]
  expect(fn).toHaveBeenCalledTimes(1) // [!code ++]
})
```

Tests that record calls outside of the test body (for example in a setup file, at the top level of a module, or in a `beforeAll` hook) are the most affected, because that history is cleared before the test that asserts on it runs.

To keep the previous behavior, set `clearMocks` back to `false`:

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    clearMocks: false, // [!code ++]
  },
})
```

### `testNamePattern` Matches the `>`-Joined Full Name

[`testNamePattern`](/config/testnamepattern) (the `-t` CLI flag) now matches against the test's full name with the suite chain and test name joined by `' > '`, the same string shown in the reporter output. Previously the segments were joined with a single space, mirroring Jest.

This only affects patterns that span the boundary between a suite and a test (or between nested suites). Patterns that match within a single name segment, and patterns that use `.`/`.*` between segments, are unaffected.

```ts
describe('math', () => {
  test('adds', () => {})
})
```

```bash
vitest -t 'math adds' # [!code --]
vitest -t 'math > adds' # [!code ++]
```

To keep a pattern working regardless of the separator, match a single segment (`-t adds`) or use a wildcard between segments (`-t 'math.*adds'`).

### Inline Projects Inherit the Root Config by Default

The [`extends`](/guide/projects#configuration) option now defaults to `true`: every project defined as an inline configuration in [`test.projects`](/guide/projects) inherits all options from the root configuration, including Vite options like `plugins` or `resolve.alias`. The options are merged with the same rules that applied to an explicit `extends: true` in Vitest 4:

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        // v4: this project didn't apply the react plugin
        // v5: the plugin is inherited from the root config
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
        },
      },
    ],
  },
})
```

A few options are excluded because they are always scoped to a single project or to the whole test run:

- `name` and `projects` are never inherited.
- `globalSetup` is not inherited from the root config: the root-level `globalSetup` already runs once per test run, so inheriting it would run the same files again for every project. It is still inherited when extending a non-root config file.
- The project's own `tags` replace the inherited array instead of being merged with it.

Projects referenced as config files or directories are not affected; they still don't inherit any options from the root config.

Keep in mind that arrays are merged, not overridden. For example, if the root config defines `setupFiles`, the project's own `setupFiles` are appended to the inherited ones. If you need the previous behavior, set `extends: false` in the project configuration:

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./setup.global.ts'],
    projects: [
      {
        extends: false, // [!code ++]
        test: {
          name: 'unit',
          setupFiles: ['./setup.unit.ts'],
        },
      },
    ],
  },
})
```

### Referenced Config Files Can Define Their Own Projects

A config file referenced in [`test.projects`](/guide/projects) that declares `projects` itself is now treated like the root config: it doesn't run tests on its own, it only provides the [nested projects](/guide/projects#nested-projects) it declares. Their names are prefixed with the name of the declaring config, e.g. `app (unit)`.

In Vitest 4 the `projects` field of a referenced config was silently ignored and the config ran as a single project. Check that your project configs don't carry a `projects` field unknowingly. The most common way to do that is merging a config that defines it:

```ts [packages/app/vitest.config.ts]
import { defineProject, mergeConfig } from 'vitest/config'
import rootConfig from '../../vitest.config' // [!code --]
import sharedConfig from '../../vitest.shared' // [!code ++]

export default mergeConfig(
  // the root config defines `test.projects`, so merging it
  // would turn this project into a container for those projects
  rootConfig, // [!code --]
  sharedConfig, // [!code ++]
  defineProject({
    test: {
      environment: 'jsdom',
    },
  }),
)
```

Since the inherited `projects` paths resolve relative to the referenced config, this misconfiguration usually fails loudly at startup with `Projects definition references a non-existing file or a directory`, `No projects were found in "..."`, or a circular `projects` definition error.

Inline configurations continue to ignore the `projects` field at runtime, but it is now also excluded from their `ProjectConfig` type.

### Hoisted Mocking Calls Must Be at the Top Level

[`vi.mock`](/api/vi#vi-mock), [`vi.unmock`](/api/vi#vi-unmock), and [`vi.hoisted`](/api/vi#vi-hoisted) are hoisted to the top of the file and run before any surrounding code. Calling them inside a function, block, or `describe`/`test` callback previously only logged a warning. Vitest 5.0 now throws, because the call does not execute where it is written:

```ts
describe('calculator', () => {
  vi.mock('./calculator') // [!code --]
})

vi.mock('./calculator') // [!code ++]

describe('calculator', () => {
  // ...
})
```

The error reports every offending call and its location:

```
1 call in "calculator.test.ts" was defined outside of the module's top level scope:

- vi.mock("./calculator") at calculator.test.ts:2:3

Although it appears nested, it will be hoisted and executed before anything in this file. Move it to the top level to reflect its actual execution order.
```

The dynamic variants [`vi.doMock`](/api/vi#vi-domock) and [`vi.doUnmock`](/api/vi#vi-dounmock) are not hoisted and may still be called anywhere.

### Automocked Modules Stay Automocked in the Browser

In browser mode, mock metadata is serialized between Vitest and the test iframe. An automocked module (a [`vi.mock`](/api/vi#vi-mock) call with no factory) was incorrectly restored as a spy on the other side, so its exports kept calling the real implementation instead of the auto-generated stubs.

Automocks are now restored as automocks. If a browser test relied on the original implementation running through an automocked module, its exports now return `undefined` by default. Pass [`{ spy: true }`](/api/vi#vi-mock) to keep calling the real implementation while still tracking calls, or provide a factory with the behavior you need.

### Benchmarking API Rewrite

The benchmarking API has been rewritten. `bench` is no longer a top-level import from `vitest`; it is a [test-context fixture](/guide/test-context#bench) accessed from inside a regular `test()`. See the [Benchmarking guide](/guide/benchmarking) for the new API.

Removed, with replacements where applicable:

- **`bench(name, fn)` at module scope**: destructure `bench` from the test context instead.

```ts
// v4
import { bench } from 'vitest' // [!code --]

bench('sort', () => { // [!code --]
  [3, 1, 2].sort() // [!code --]
}) // [!code --]

// v5
import { test } from 'vitest' // [!code ++]

test('sort', async ({ bench }) => { // [!code ++]
  await bench('sort', () => { [3, 1, 2].sort() }).run() // [!code ++]
}) // [!code ++]
```

- **`bench.skip`, `bench.only`, `bench.todo`** are removed. Use the regular `test.skip`, `test.only`, `test.todo` on the surrounding `test()` instead.
- **`benchmark.reporters` / `benchmark.outputFile`** are removed. Benchmark output is now part of the default reporter and the `json` reporter; configure those at the top level via `test.reporters` instead.
- **`benchmark.compare` config and the `--compare` CLI flag** are removed. Pass [`writeResult`](/guide/benchmarking#storing-and-replaying-results) as a per-bench option to persist a result, and read it back with [`bench.from()`](/guide/benchmarking#bench-from) inside `bench.compare()`.
- **`benchmark.outputJson` config and the `--outputJson` CLI flag** are removed. Use `--reporter=json --outputFile=<path>` to capture benchmark results; the JSON reporter now includes a `benchmarks` field on each test case.
- **`Vitest` instance `mode` property** is now always `'test'`. The previous `'benchmark'` value is no longer used; benchmarks run inside a dedicated project of the same `Vitest` instance.

### Vitest UI Requires an Authenticated URL

Vitest UI now requires token authentication for the HTML page and API access. The `/__vitest__/` URL will show an error until the browser is authenticated. To authenticate, open the URL with a token printed by Vitest, as shown below. Once authenticated, the direct `/__vitest__/` URL will work correctly.

```bash
vitest --ui
# UI started at http://localhost:51204/__vitest__/?token=...
```

### Fake Timers Now Mock `Temporal`

Vitest now mocks the [`Temporal`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) API alongside `Date` when fake timers are enabled, following the [`@sinonjs/fake-timers` v15.4 update](https://github.com/sinonjs/fake-timers/blob/main/CHANGELOG.md#1540--2026-05-05). This only takes effect when `Temporal` is available on the global object — either natively (Node.js >= 26 by default, behind `--harmony-temporal` on older versions, and supporting browsers) or through a globally installed polyfill such as `import 'temporal-polyfill/global'`.

Previously `Temporal.Now` kept returning the real wall-clock time even when [`vi.useFakeTimers()`](/api/vi#vi-usefaketimers) was active. Now it follows the mocked clock:

```ts
vi.useFakeTimers({ now: 0 })

Temporal.Now.instant().epochMilliseconds // 0 (was the real time in v4)
```

`Temporal` is part of the default set of faked APIs, so it is controlled by [`fakeTimers.toFake`](/config/#faketimers-tofake) and [`fakeTimers.toNotFake`](/config/#faketimers-tonotfake). To keep `Temporal` native, add it to `toNotFake`:

```ts
vi.useFakeTimers({ toNotFake: ['Temporal'] })
```

### `setSystemTime` Now Mocks Temporal

Previously `vi.setSystemTime` mocked only `Date` without fake timers, but now it also mocks methods of `Temporal.Now`.

```ts
vi.setSystemTime(0)
Temporal.Now.instant().epochMilliseconds // 0 (was the real time in v4)
```

### `toThrow("")` Matches Any Error Message

[`toThrow`](/api/expect#tothrow) (and its alias `toThrowError`) treats a string argument as a substring of the error message. In Vitest 4 an empty string was special-cased to the `/^$/` pattern, so it matched only an error whose message was empty. It now behaves like any other substring, and an empty string is contained in every message:

```ts
expect(() => { throw new Error('boom') }).not.toThrow('') // [!code --]
expect(() => { throw new Error('boom') }).toThrow('') // [!code ++]
```

To assert that a thrown error has an empty message, match the pattern explicitly:

```ts
expect(() => { throw new Error('boom') }).not.toThrow(/^$/)
```

### Assertion Types Expose Return and Received Types

Assertion interfaces now use two type parameters: `R` is the matcher return type and `T` is the received value type. Synchronous assertions use `void`, while assertions accessed through `.resolves`, `.rejects`, [`expect.poll`](/api/expect#poll), or [`expect.element`](/api/browser/assertions) use `Promise<void>`.

If you declare custom matchers, augment the `Matchers<R, T>` interface. It adds the matcher to instance assertions, asymmetric matchers, and the type accepted by `expect.extend`:

```ts [vitest.d.ts]
import 'vitest'

interface CustomMatchers<R = unknown, T = unknown> {
  toBeFoo: () => R
  toEqualTyped: (expected: T) => R
}

declare module 'vitest' {
  interface Matchers<R, T> extends CustomMatchers<R, T> {}
}
```

This makes custom matcher return types reflect how the matcher is used:

```ts
const syncResult = expect('value').toEqualTyped('other') // void
const asyncResult = expect(Promise.resolve('value')).resolves.toEqualTyped('other') // Promise<void>
await asyncResult
```

Code that refers to assertion types directly must also provide the return type first:

```ts
Assertion<string> // [!code --]
Assertion<void, string> // [!code ++]
Assertion<Promise<void>, string> // asynchronous assertion
```

Vitest no longer reads custom matcher declarations from the global `jest.Matchers` interface. Libraries that support both Jest and Vitest should augment `jest.Matchers` and `vitest.Matchers` separately. This only affects TypeScript declarations; registering matchers with `expect.extend` works as before.

### `expect.poll` Fails When It Times Out

[`expect.poll`](/api/expect#poll) now rejects when its callback, or the polled assertion, does not settle within `timeout`. Previously a callback that resolved after the deadline, or an assertion that only passed on a late attempt, could still succeed. The callback now also receives an `AbortSignal` that aborts when the timeout elapses, so you can cancel in-flight work:

```ts
await expect.poll(async ({ signal }) => {
  const response = await fetch('/api/status', { signal })
  return response.status
}, { timeout: 1000 }).toBe(200)
```

A poll that legitimately needs more time should raise its `timeout`. Otherwise it fails with `expect.poll() function didn't resolve in time.` (or `expect.poll() assertion didn't resolve in time.`).

### Test Titles and Inspected Values Use `pretty-format`

Vitest now formats values with [`pretty-format`](https://www.npmjs.com/package/pretty-format) instead of `loupe` when it inspects them, including the values interpolated into [`test.each`](/api/test#test-each) and [`test.for`](/api/test#test-for) titles. The rendering of some values changes, so snapshots or assertions that capture inspected output may need updating.

Two changes are specific to generated test titles:

- A string value interpolated through a `$` placeholder is no longer wrapped in quotes:

```ts
test.for([{ id: 'a1' }])('case $id', ({ id }) => { /* ... */ })
// v4 title: case 'a1' // [!code --]
// v5 title: case a1   // [!code ++]
```

- The length limit for interpolated values is now controlled by the new [`taskTitleValueFormatTruncate`](/config/tasktitlevalueformattruncate) option (default `40`).

### Removed `test.sequential`, `describe.sequential`, and `sequential` Options
### 移除 `test.sequential`, `describe.sequential`, 和 `sequential` 选项 {##removed-test-sequential-describe-sequential-and-sequential-options}

Vitest 5.0 移除了已弃用的 `test.sequential`、`describe.sequential` 和 `sequential` 选项。当你需要让某个测试或测试套件不再沿用继承来的并发设置，或退出全局配置的并发时，请使用 `concurrent: false`。

```ts
test.sequential('example', async () => { /* ... */ }) // [!code --]
test('example', { concurrent: false }, async () => { /* ... */ }) // [!code ++]
```

```ts
describe.sequential('suite', () => { /* ... */ }) // [!code --]
describe('suite', { concurrent: false }, () => { /* ... */ }) // [!code ++]
```

The same replacement applies to option objects:

```ts
test('example', { sequential: true }, async () => { /* ... */ }) // [!code --]
test('example', { concurrent: false }, async () => { /* ... */ }) // [!code ++]
```

### 命令中的定位器被序列化为对象 {#locators-in-commands-are-serialized-as-objects}

转发到 [浏览器命令](/api/browser/commands) 的定位器现在被序列化为 `SerializedLocator` 对象，而不是裸的选择器字符串。该对象导出两个字段：

- `selector`：提供程序特定的选择器字符串（与 commands 先前接收的值相同）。
- `locator`：定位器的人类可读的（例如 `getByRole('button')`），用于错误消息和跟踪。

更新所有接收定位器的自定义命令，改为从新的对象中解构出 selector：

```ts
import type { SerializedLocator } from '@vitest/browser'
import type { BrowserCommandContext } from 'vitest/node'

export async function customClick(
  context: BrowserCommandContext,
  selector: string, // [!code --]
  { selector }: SerializedLocator, // [!code ++]
) {
  await context.page.locator(selector).click()
}
```
<!-- TODO: translation -->
### Locators are Strict by Default

Browser locators now match the text exactly by default, requiring a full, case-sensitive match. To keep the previous behaviour, you can set [`browser.locators.exact`](/config/browser/locators#browser-locators-exact) to `false`.

```ts
// With exact: true (default), this only matches the string "Hello, World" exactly.
// With exact: false, this matches "Hello, World!", "Say Hello, World", etc.
const locator = page.getByText('Hello, World', { exact: true })
await locator.click()
```

### `toHaveTextContent` Now Performs Strict Equality

The browser-mode [`toHaveTextContent`](/api/browser/assertions#tohavetextcontent) matcher now validates that an element's text content is exactly equal to the expected string instead of performing a partial, case-sensitive match. Regular expressions are no longer accepted. The previous behaviour, including `RegExp` support, has moved to the new [`toMatchTextContent`](/api/browser/assertions#tomatchtextcontent) matcher.

```ts
// Partial or regex matches:
await expect.element(banner).toHaveTextContent('Error') // [!code --]
await expect.element(banner).toHaveTextContent(/error/i) // [!code --]
await expect.element(banner).toMatchTextContent('Error') // [!code ++]
await expect.element(banner).toMatchTextContent(/error/i) // [!code ++]

// Exact matches stay on `toHaveTextContent`:
await expect.element(banner).toHaveTextContent('Error!')
```

### `render` Is Async in `vitest-browser-vue` and `vitest-browser-svelte`

The companion component-testing packages [`vitest-browser-vue`](https://npmx.dev/package/vitest-browser-vue) and [`vitest-browser-svelte`](https://npmx.dev/package/vitest-browser-svelte) now return a promise from `render`, so the call must be awaited before you query the rendered output:

```ts
import { render } from 'vitest-browser-vue'
import Component from './Component.vue'

test('renders', async () => {
  const screen = render(Component) // [!code --]
  const screen = await render(Component) // [!code ++]

  await expect.element(screen.getByRole('heading')).toBeVisible()
})
```

### Glob Coverage Thresholds No Longer Inherit `perFile`

`coverage.thresholds.perFile` previously applied to every threshold set, including files matched by glob-pattern thresholds. Glob patterns now control their own per-file checking and no longer inherit the top-level `perFile` — set `perFile` on each glob that needs it.

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        'perFile': true,

        'src/utils/**': {
          lines: 80,
          perFile: true, // [!code ++]
        },
      },
    },
  },
})
```

### Coverage `include` and `exclude` Match More Precisely

`coverage.include` and `coverage.exclude` were matched against absolute paths with picomatch's `contains` option, which matched many more files than intended. For example, a pattern could match a file because a parent directory in its absolute path happened to contain the same segment. Patterns are now matched against each file's path relative to the project root, without `contains`.

A pattern with no glob wildcard is treated as a directory and expanded to match everything inside it:

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    coverage: {
      include: ['src'], // matches src/**, not every path that contains "src"
    },
  },
})
```

Review your `include` and `exclude` patterns after upgrading and confirm the reported file set is what you expect. Files that were previously matched only by the looser behavior may no longer be included.

### Config Files Are Not Looked Up From Parent Directories

Vitest no longer searches parent directories for config files. If you previously relied on running `vitest` from a subdirectory while using a config file from a parent directory, pass the config explicitly and scope test discovery with `--dir`. For example,

```bash
$ cd subdir && vitest # [!code --]
$ cd subdir && vitest --config ../vitest.config.ts # [!code ++]
```

### DOM Environment Global Assignments Now Update the Underlying Window

Assignments to properties on `globalThis` or `window` in `jsdom` and `happy-dom` environments are now propagated to the underlying DOM implementation. Mutable properties such as `innerWidth` can affect APIs implemented by the DOM environment, for example `happy-dom`'s `matchMedia`.

### `populateGlobal` Returns Descriptors in `originals`

The `originals` map returned by [`populateGlobal`](/guide/environment#custom-environment) now holds [property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) instead of plain values. This avoids invoking native lazy getters (such as Node's `localStorage`) while capturing the original, and restores them faithfully on teardown.

If you restore them manually in a custom environment, use `Object.defineProperty` instead of an assignment:

```ts
originals.forEach((value, key) => (global[key] = value)) // [!code --]
originals.forEach((descriptor, key) => Object.defineProperty(global, key, descriptor)) // [!code ++]
```

### Browser Orchestrator URL Requires a Session

Vitest no longer serves the browser orchestrator UI from a bare `/__vitest_test__/` URL. Browser runner URLs are now session-bound and must include the `sessionId` generated by Vitest, for example `/__vitest_test__/?sessionId=...`.

If you manually opened the browser preview by copying the Vite server URL or visiting `/__vitest_test__/` directly, use the URL opened or printed by Vitest instead.

### Generated Reports and Artifacts Use the `.vitest` Directory

Vitest now uses a single `.vitest` directory at the project root as the shared artifact root, so one `.vitest` entry in `.gitignore` is enough. Defaults that moved this major:

- **Attachments** ([`attachmentsDir`](/config/attachmentsdir)): `.vitest-attachements/` → `.vitest/attachments/`
- **Blob reporter** and `--merge-reports`: `.vitest-reports/blob-*.json` → `.vitest/blob/blob-*.json`
- **HTML reporter** ([`html`](/guide/reporters#html-reporter)): `html/index.html` → `.vitest/index.html`, and its option changed from `outputFile` (a file) to `outputDir` (a directory)
- **JSON reporter** ([`json`](/guide/reporters#json-reporter)): stdout → `.vitest/json/output.json`
- **JUnit reporter** ([`junit`](/guide/reporters#junit-reporter)): stdout → `.vitest/junit/output.xml`

The `json` and `junit` reporters now write to a file by default instead of printing to stdout. If you previously relied on the report being printed to stdout (for example `vitest --reporter=json > out.json` or `vitest --reporter=json | jq`), either read the generated artifact file instead (for example `jq . .vitest/json/output.json`), or opt back into stdout with the reporter's `stdout` option (`reporters: [['json', { stdout: true }]]`). An explicit `outputFile` is still respected and unchanged.

### `toMatchScreenshot` Now Uses a Dedicated Screenshot Directory Config

Previously, reference screenshots for `toMatchScreenshot` did not correctly respect `browser.screenshotDirectory`. As a result, screenshots were saved in an unintended location when a custom directory was configured.

This has now been fixed by introducing a dedicated option: `browser.expect.toMatchScreenshot.screenshotDirectory`. Its default value is `__screenshots__`.

- If you did not set `browser.screenshotDirectory`, no changes are required.
- If you did set `browser.screenshotDirectory`, you must now explicitly configure the new option:

    ```ts [vitest.config.ts]
    export default defineConfig({
      test: {
        browser: {
          screenshotDirectory: 'my-screenshots',
          expect: { // [!code ++]
            toMatchScreenshot: { // [!code ++]
              screenshotDirectory: 'my-screenshots', // [!code ++]
            }, // [!code ++]
          }, // [!code ++]
        },
      },
    })
    ```

    Then either move existing reference screenshots to the new location or regenerate them.

### Worker and Concurrency Ids Are 1-based

Worker and pool identifiers now start at `1` instead of `0`. This changes the values of the `VITEST_POOL_ID` and `VITEST_WORKER_ID` environment variables, which now range from `1` to the worker count. Update any logic that derives a value from these ids, such as a per-worker database name or an array index.

For custom reporters, the [`TestModule`](/api/advanced/test-module#diagnostic) diagnostics now expose both ids: the existing `workerId` (now 1-based) and a new `concurrencyId`.

```ts
import type { Reporter, TestModule } from 'vitest/node'

class MyReporter implements Reporter {
  onTestModuleEnd(testModule: TestModule) {
    const { workerId, concurrencyId } = testModule.diagnostic()
  }
}
```

Node.js and browser tests run in separate pools and do not share these ids, so the same value can appear in both.

### Package Migration

The following packages are deprecated as of this release. They will no longer receive feature updates, but security fixes will continue to be backported:

- [`@vitest/runner`](https://npmx.dev/package/@vitest/runner)
- [`@vitest/ws-client`](https://npmx.dev/package/@vitest/ws-client)

The [`@vitest/browser-webdriverio`](https://npmx.dev/package/@vitest/browser-webdriverio) provider has been moved to the [vitest-community](https://github.com/vitest-community/vitest-webdriverio) organization. Going forward, WebdriverIO support is community-maintained and addressed on a per-issue basis. If you use it, update your dependency to the new package and report any issues in the new repository.

### Removed Deprecated Entrypoints

Several entry points were marked as deprecated in Vitest 4.1. This release removes them entirely.

- `vitest/coverage`: use `vitest/node` instead
- `vitest/reporters`: use `vitest/node` instead
- `vitest/environments`: use `vitest/runtime` instead
- `vitest/snapshot`: use `vitest/runtime` instead
- `vitest/runners`: use `TestRunner` from `vitest` instead
- `vitest/suite`: use static methods on `TestRunner` from vitest instead (for example, `TestRunner.getCurrentTest()`)
- `vitest/mocker` is removed completely, use `@vitest/mocker` package directly (this was published by accident at one point and never removed)
- `vitest/internal/module-runner` is removed

## 从 Jest 迁移 {#jest}

Vitest 的 API 设计兼容 Jest，旨在使从 Jest 迁移尽可能简单。尽管如此，你仍可能遇到以下差异：

### 默认是否启用全局变量 {#globals-as-a-default}

Jest 默认启用其 [globals API](https://jestjs.io/docs/api)。Vitest 默认不启用。你可以通过配置项 [globals](/config/globals) 启用全局变量，或者修改代码直接从 `vitest` 模块导入所需 API。

如果选择不启用全局变量，注意常用库如 [`testing-library`](https://testing-library.com/) 将不会自动执行 DOM 的 [清理](https://testing-library.com/docs/svelte-testing-library/api/#cleanup)。

### `mock.mockReset`

Jest 的 [`mockReset`](https://jestjs.io/docs/mock-function-api#mockfnmockreset) 会将 mock 实现替换为空函数，返回 `undefined`。

Vitest 的 [`mockReset`](/api/mock#mockreset) 会将 mock 实现重置为最初的实现。也就是说，使用 `vi.fn(impl)` 创建的 mock，`mockReset` 会将实现重置为 `impl`。

### `mock.mock` 是持久的 {#mock-mock-is-persistent}

Jest 调用 `.mockClear` 后会重建 mock 状态，只能以 getter 方式访问； Vitest 则保留持久引用，可直接复用。

```ts
const mock = vi.fn()
const state = mock.mock
mock.mockClear()

expect(state).toBe(mock.mock) // 在 Jest 中失败
```

### 模块 Mock {#module-mocks}

在 Jest 中，mock 模块时工厂函数返回值即为默认导出。在 Vitest 中，工厂函数需返回包含所有导出的对象。例如，以下 Jest 代码需要改写为：

```ts
jest.mock('./some-path', () => 'hello') // [!code --]
vi.mock('./some-path', () => ({ // [!code ++]
  default: 'hello', // [!code ++]
})) // [!code ++]
```

更多细节请参考 [`vi.mock` API](/api/vi#vi-mock)。

### 自动 Mock 行为 {#auto-mocking-behaviour}

与 Jest 不同，Vitest 仅在调用 `vi.mock()` 时加载 `<root>/__mocks__` 中的模块。如果你需要像 Jest 一样在每个测试中自动 mock，可以在 [`setupFiles`](/config/setupfiles) 中调用 mock。

### 导入被 Mock 包的原始模块 {#importing-the-original-of-a-mocked-package}

如果只部分 mock 一个包，之前可能用 Jest 的 `requireActual`，Vitest 中应使用 `vi.importActual`：

```ts
const { cloneDeep } = jest.requireActual('lodash/cloneDeep') // [!code --]
const { cloneDeep } = await vi.importActual('lodash/cloneDeep') // [!code ++]
```

### 扩展 Mock 到外部库 {#extends-mocking-to-external-libraries}

Jest 默认会扩展 mock 到使用相同模块的外部库。Vitest 需要显式告知要 mock 的第三方库，使其成为源码的一部分，方法是使用 [server.deps.inline](/config/server#inline)：

```
server.deps.inline: ["lib-name"]
```

### `expect.getState().currentTestName`

Vitest 的测试名使用 `>` 符号连接，方便区分测试与套件，而 Jest 使用空格 (` `)。

```diff
- `${describeTitle} ${testTitle}`
+ `${describeTitle} > ${testTitle}`
```

<<<<<<< HEAD
### 环境变量 {#envs}
=======
The same applies to [`testNamePattern`](/config/testnamepattern) (the `-t` flag): Vitest matches against the `>`-joined full name, while Jest matches the space-joined name. Update patterns that span a suite and a test accordingly, or match a single segment (`-t adds`) or use a wildcard between segments (`-t 'math.*adds'`).

```diff
- vitest -t 'math adds'
+ vitest -t 'math > adds'
```

### Envs
>>>>>>> 8bd62ec3a572c72608ac7f771f354094b979491d

与 Jest 一样，如果 `NODE_ENV` 在此之前未被设置，Vitest 会将其设为 `test`。Vitest 还提供了与 `JEST_WORKER_ID` 对应的 `VITEST_POOL_ID`（始终小于或等于 `maxWorkers`），如果你依赖该变量，别忘了重命名。Vitest 还暴露了 `VITEST_WORKER_ID`，它是运行中 worker 的唯一 ID 且该编号不受 `maxWorkers` 影响，每创建一个新 worker 就会递增。

### 替换属性 {#replace-property}

如果想修改对象，Jest 使用 [replaceProperty API](https://jestjs.io/docs/jest-object#jestreplacepropertyobject-propertykey-value)，Vitest 可使用 [`vi.stubEnv`](/api/vi#vi-stubenv) 或 [`vi.spyOn`](/api/vi#vi-spyon) 达成相同效果。

### Done 回调 {#done-callback}

Vitest 不支持回调式测试声明。你可以改写为使用 `async`/`await` 函数，或使用 Promise 来模拟回调风格。

<!--@include: ./examples/promise-done.md-->

### Hooks {#hooks}

Vitest 中 `beforeAll`/`beforeEach` 钩子可返回 [清理函数](/api/hooks#setup-and-teardown)。因此，如果钩子返回非 `undefined` 或 `null`，可能需改写：

```ts
beforeEach(() => setActivePinia(createTestingPinia())) // [!code --]
beforeEach(() => { setActivePinia(createTestingPinia()) }) // [!code ++]
```

在 Jest 中钩子是顺序执行的（一个接一个）。默认情况下，Vitest 在栈中运行钩子。要使用 Jest 的行为，请更新 [`sequence.hooks`](/config/sequence#sequence-hooks) 选项：

```ts
export default defineConfig({
  test: {
    sequence: { // [!code ++]
      hooks: 'list', // [!code ++]
    } // [!code ++]
  }
})
```

### 类型 {#types}

Vitest 没有 Jest 的 `jest` 命名空间，需直接从 `vitest` 导入类型：

```ts
let fn: jest.Mock<(name: string) => number> // [!code --]
import type { Mock } from 'vitest' // [!code ++]
let fn: Mock<(name: string) => number> // [!code ++]
```

### 定时器 {#timers}

Vitest 不支持 Jest 的遗留定时器。

### 超时 {#timeout}

如果使用了 `jest.setTimeout`，需迁移为 `vi.setConfig`：

```ts
jest.setTimeout(5_000) // [!code --]
vi.setConfig({ testTimeout: 5_000 }) // [!code ++]
```

### Vue 快照 {#vue-snapshots}

这不是 Jest 特有的功能，但如果你之前在 vue-cli 预设中使用 Jest，你需要安装 [`jest-serializer-vue`](https://github.com/eddyerburgh/jest-serializer-vue) 包，并在 [`snapshotSerializers`](/config/snapshotserializers) 中指定它：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    snapshotSerializers: ['jest-serializer-vue']
  }
})
```

否则快照中会出现大量转义的 `"` 字符。

### 自定义快照匹配器 <Experimental /> <Version>4.1.3</Version> {#custom-snapshot-matcher}

Jest 从 `jest-snapshot` 导入快照组合函数。在 Vitest 中，请改用 `vitest` 中的 `Snapshots`：

```ts
const { toMatchSnapshot } = require('jest-snapshot') // [!code --]
import { Snapshots } from 'vitest' // [!code ++]
const { toMatchSnapshot } = Snapshots // [!code ++]

expect.extend({
  toMatchTrimmedSnapshot(received: string, length: number) {
    return toMatchSnapshot.call(this, received.slice(0, length))
  },
})
```

对于内联快照，同样适用：

```ts
const { toMatchInlineSnapshot } = require('jest-snapshot') // [!code --]
import { Snapshots } from 'vitest' // [!code ++]
const { toMatchInlineSnapshot } = Snapshots // [!code ++]

expect.extend({
  toMatchTrimmedInlineSnapshot(received: string, inlineSnapshot?: string) {
    return toMatchInlineSnapshot.call(this, received.slice(0, 10), inlineSnapshot)
  },
})
```

完整指南请参阅 [自定义快照匹配器](/guide/snapshot#custom-snapshot-matchers)。

## 从 Mocha + Chai + Sinon 迁移 {#mocha-chai-sinon}

Vitest 对从 Mocha+Chai+Sinon 测试套件迁移提供了完善支持。虽然 Vitest 默认使用与 Jest 兼容的 API，但它同时也提供 Chai 风格的断言用于 spy/mock 测试，从而降低迁移成本。

### 测试结构 {#test-structure}

Mocha 与 Vitest 的测试结构相似，但存在一些差异：

```ts
// Mocha
describe('suite', () => {
  before(() => { /* 初始化 */ })
  after(() => { /* 清理 */ })
  beforeEach(() => { /* 初始化 */ })
  afterEach(() => { /* 清理 */ })

  it('test', () => {
    // 测试代码
  })
})

// Vitest - 相同的结构同样适用！
import { afterAll, afterEach, beforeAll, beforeEach, describe, it } from 'vitest'

describe('suite', () => {
  beforeAll(() => { /* 初始化 */ })
  afterAll(() => { /* 清理 */ })
  beforeEach(() => { /* 初始化 */ })
  afterEach(() => { /* 清理 */ })

  it('test', () => {
    // 测试代码
  })
})
```

### 断言 {#assertions}

Vitest 默认内置 Chai 断言，因此 Chai 断言无需任何修改即可使用：

```ts
// Mocha+Chai 与 Vitest 均适用
import { expect } from 'vitest' // 或在 Mocha 中导入 'chai'

expect(value).to.equal(42)
expect(value).to.be.true
expect(array).to.have.lengthOf(3)
expect(obj).to.have.property('key')
```

### Spy/Mock 断言 {#spy-mock-assertions}

Vitest 为 spy 和 mock 提供 **Chai 风格** 的断言，让你无需重写断言即可从 Sinon 迁移：

```ts
// 迁移前（Mocha + Chai + Sinon）
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const spy = sinon.spy(obj, 'method')
obj.method('arg1', 'arg2')

expect(spy).to.have.been.called
expect(spy).to.have.been.calledOnce
expect(spy).to.have.been.calledWith('arg1', 'arg2')

// 迁移后（Vitest）- 断言语法完全相同！
import { expect, vi } from 'vitest'

const spy = vi.spyOn(obj, 'method')
obj.method('arg1', 'arg2')

expect(spy).to.have.been.called
expect(spy).to.have.been.calledOnce
expect(spy).to.have.been.calledWith('arg1', 'arg2')
```

#### 完整的 Chai 风格断言支持 {#complete-chai-style-assertion-support}

Vitest supports all common sinon-chai assertions:

| Sinon-Chai                | Vitest                | 详情                         |
| ------------------------- | --------------------- | ---------------------------- |
| `spy.called`              | `called`              | Spy 至少被调用过一次         |
| `spy.calledOnce`          | `calledOnce`          | Spy 恰好被调用过一次         |
| `spy.calledTwice`         | `calledTwice`         | Spy 恰好被调用过两次         |
| `spy.calledThrice`        | `calledThrice`        | Spy 恰好被调用过三次         |
| `spy.callCount(n)`        | `callCount(n)`        | Spy 被调用过 n 次            |
| `spy.calledWith(...)`     | `calledWith(...)`     | Spy 以特定参数被调用         |
| `spy.calledOnceWith(...)` | `calledOnceWith(...)` | Spy 以特定参数恰好被调用一次 |
| `spy.returned(value)`     | `returned`            | Spy 返回了特定值             |

更多内容请参阅 [Chai 风格 Spy 断言](/api/expect#chai-style-spy-assertions) 文档中的完整列表。

### 创建 Spy 和 Mock {#creating-spies-and-mocks}

用 Vitest 的 `vi` 工具替换 Sinon 的 spy/stub/mock 创建方式：

```ts
// Sinon
const sinon = require('sinon')
const spy = sinon.spy()
const stub = sinon.stub(obj, 'method')
const mock = sinon.mock(obj)

// Vitest
import { vi } from 'vitest'
const spy = vi.fn()
const stub = vi.spyOn(obj, 'method')
// Vitest 没有 "mock" 的概念，请使用 spy 代替
```

### 存根返回值 {#stubbing-return-values}

```ts
// Sinon
stub.returns(42)
stub.onFirstCall().returns(1)
stub.onSecondCall().returns(2)

// Vitest
stub.mockReturnValue(42)
stub.mockReturnValueOnce(1)
stub.mockReturnValueOnce(2)
```

### 存根实现 {#stubbing-implementations}

```ts
// Sinon
stub.callsFake(arg => arg * 2)

// Vitest
stub.mockImplementation(arg => arg * 2)
```

### 恢复 Spy {#restoring-spies}

```ts
// Sinon
spy.restore()
sinon.restore() // 恢复全部

// Vitest
spy.mockRestore()
vi.restoreAllMocks() // 恢复全部
```

### 定时器 {#timers-1}

Sinon 和 Vitest 在内部都使用 `@sinonjs/fake-timers`：

```ts
// Sinon
const clock = sinon.useFakeTimers()
clock.tick(1000)
clock.restore()

// Vitest
import { vi } from 'vitest'
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
vi.useRealTimers()
```

### 主要差异 {#key-differences}

1. **全局变量**：Mocha 默认提供全局变量。在 Vitest 中，需要从 `vitest` 导入，或启用 [`globals`](/config/globals) 配置。
2. **断言风格**：可同时使用 Chai 风格（`expect(spy).to.have.been.called`）和 Jest 风格（`expect(spy).toHaveBeenCalled()`）。
3. **并发执行**：Vitest 默认并发运行测试，Mocha 则顺序执行。

更多内容请参阅：

- [Chai 风格 Spy 断言](/api/expect#chai-style-spy-assertions)
- [Mocking 指南](/guide/mocking)
- [Vi API](/api/vi)
