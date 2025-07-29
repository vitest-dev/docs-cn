---
title: 迁移指南 | 指南
outline: deep
---

# 迁移指南

## 迁移到 Vitest 4.0 {#vitest-4}

### 移除 `reporters: 'basic'`

Basic 报告器已被移除，它等价于以下配置：

```ts
export default defineConfig({
  test: {
    reporters: [
      ['default', { summary: false }]
    ]
  }
})
```

### V8 代码覆盖率重大变更

Vitest 的 V8 覆盖率提供器现在使用了更精准的结果映射逻辑，从 Vitest v3 升级后，你可能会看到覆盖率报告的内容有变化。

之前 Vitest 使用 [`v8-to-istanbul`](https://github.com/istanbuljs/v8-to-istanbul) 将 V8 覆盖率结果映射到源码文件，但这种方式不够准确，报告中常常会出现误报。现在我们开发了基于 AST 分析的新方法，使 V8 报告的准确度与 `@vitest/coverage-istanbul` 一致。

- 覆盖率忽略提示已更新，详见 [覆盖率 | 忽略代码](/guide/coverage.html#ignoring-code)。
- 已移除 `coverage.ignoreEmptyLines` 选项。没有可执行代码的行将不再出现在报告中。
- 已移除 `coverage.experimentalAstAwareRemapping` 选项。此功能现已默认启用，并成为唯一的映射方式。
- 现在 V8 提供器也支持 `coverage.ignoreClassMethods`。

### 移除 `coverage.all` 和 `coverage.extensions` 选项

在之前的版本中，Vitest 会默认把所有未覆盖的文件包含到报告中。这是因为 `coverage.all` 默认为 `true`，`coverage.include` 默认为 `**`。这样设计是因为测试工具无法准确判断用户源码所在位置。

然而，这导致 Vitest 覆盖率工具会处理很多意料之外的文件（例如压缩 JS 文件），造成报告生成速度很慢甚至卡死。在 Vitest v4 中，我们彻底移除了 `coverage.all`，并将默认行为改为**只在报告中包含被测试覆盖的文件**。

在升级到 v4 后，推荐在配置中显式指定 `coverage.include`，并视需要配合使用 `coverage.exclude` 进行排除。

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    coverage: {
      // 包含匹配此模式的被覆盖和未覆盖文件：
      include: ['packages/**/src/**.{js,jsx,ts,tsx}'], // [!code ++]

      // 对上述 include 匹配到的文件应用排除规则：
      exclude: ['**/some-pattern/**'], // [!code ++]

      // 以下选项已移除
      all: true, // [!code --]
      extensions: ['js', 'ts'], // [!code --]
    }
  }
})
```

如果未定义 `coverage.include`，报告将只包含测试运行中被加载的文件：

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    coverage: {
      // 未设置 include，只包含运行时加载的文件
      include: undefined, // [!code ++]

      // 匹配此模式的已加载文件将被排除：
      exclude: ['**/some-pattern/**'], // [!code ++]
    }
  }
})
```

更多示例请参考：
- [覆盖率报告中的文件包含与排除](/guide/coverage.html#including-and-excluding-files-from-coverage-report)
- [性能分析 | 代码覆盖率](/guide/profiling-test-performance.html#code-coverage) 了解调试覆盖率生成的方法

### `spyOn` 支持构造函数

在之前版本中，如果你对构造函数使用 `vi.spyOn`，会收到类似 `Constructor <name> requires 'new'` 的错误。从 Vitest 4 开始，所有用 `new` 调用的 mock 都会正确创建实例，而不是调用 `mock.apply`。这意味着 mock 实现必须使用 `function` 或 `class` 关键字，例如：

```ts {12-14,16-20}
const cart = {
  Apples: class Apples {
    getApples() {
      return 42
    }
  }
}

const Spy = vi.spyOn(cart, 'Apples')
  .mockImplementation(() => ({ getApples: () => 0 })) // [!code --]
  // 使用 function 关键字
  .mockImplementation(function () {
    this.getApples = () => 0
  })
  // 使用自定义 class
  .mockImplementation(class MockApples {
    getApples() {
      return 0
    }
  })

const mock = new Spy()
```

请注意，如果此时使用箭头函数，调用 mock 时会报 [`<anonymous> is not a constructor` 错误](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Not_a_constructor)。

### 带文件名过滤器的独立模式

为了提升用户体验，当 [`--standalone`](/guide/cli#standalone) 与文件名过滤器一起使用时，Vitest 现在会直接开始运行匹配到的文件。

```sh
# In Vitest v3 and below this command would ignore "math.test.ts" filename filter.
# In Vitest v4 the math.test.ts will run automatically.
$ vitest --standalone math.test.ts
```

这允许用户为独立模式创建可复用的 `package.json`。

::: code-group
```json [package.json]
{
  "scripts": {
    "test:dev": "vitest --standalone"
  }
}
```
```bash [CLI]
# Start Vitest in standalone mode, without running any files on start
$ pnpm run test:dev

# Run math.test.ts immediately
$ pnpm run test:dev math.test.ts
```
:::

<<<<<<< HEAD
### 移除废弃的 API
=======
### Replacing `vite-node` with [Module Runner](https://vite.dev/guide/api-environment-runtimes.html#modulerunner)

Module Runner is a successor to `vite-node` implemented directly in Vite. Vitest now uses it directly instead of having a wrapper around Vite SSR handler. This means that certain features are no longer available:

- `VITE_NODE_DEPS_MODULE_DIRECTORIES` environment variable was replaced with `VITEST_MODULE_DIRECTORIES`
- Vitest no longer injects `__vitest_executor` into every [test runner](/advanced/runner). Instead, it injects `moduleRunner` which is an instance of [`ModuleRunner`](https://vite.dev/guide/api-environment-runtimes.html#modulerunner)
- `vitest/execute` entry point was removed. It was always meant to be internal
- [Custom environments](/guide/environment) no longer need to provide a `transformMode` property. Instead, provide `viteEnvironment`. If it is not provided, Vitest will use the environment name to transform files on the server (see [`server.environments`](https://vite.dev/guide/api-environment-instances.html))
- `vite-node` is no longer a dependency of Vitest
- `deps.optimizer.web` was renamed to [`deps.optimizer.client`](/config/#deps-optimizer-client). You can also use any custom names to apply optimizer configs when using other server environments

Vite has its own externalization mechanism, but we decided to keep using the old one to reduce the amount of breaking changes. You can keep using [`server.deps`](/config/#server-deps) to inline or externalize packages.

This update should not be noticeable unless you rely on advanced features mentioned above.

### Deprecated APIs are Removed
>>>>>>> 6e177f41d730f908b84847fb174596f38ae0b7ad

Vitest 4.0 移除了以下废弃的配置项：

<<<<<<< HEAD
- `poolMatchGlobs` 配置项，请使用 [`projects`](/guide/projects) 代替。
- `environmentMatchGlobs` 配置项，请使用 [`projects`](/guide/projects) 代替。
- `workspace` 配置项，请使用 [`projects`](/guide/projects) 代替。

此次发布还移除了所有废弃类型，这也解决了 Vitest 错误引入 `node` 类型的问题（详见 [#5481](https://github.com/vitest-dev/vitest/issues/5481) 和 [#6141](https://github.com/vitest-dev/vitest/issues/6141)）。
=======
- `poolMatchGlobs` config option. Use [`projects`](/guide/projects) instead.
- `environmentMatchGlobs` config option. Use [`projects`](/guide/projects) instead.
- `workspace` config option. Use [`projects`](/guide/projects) instead.
- `deps.external`, `deps.inline`, `deps.fallbackCJS` config options. Use `server.deps.external`, `server.deps.inline`, or `server.deps.fallbackCJS` instead.

This release also removes all deprecated types. This finally fixes an issue where Vitest accidentally pulled in `@types/node` (see [#5481](https://github.com/vitest-dev/vitest/issues/5481) and [#6141](https://github.com/vitest-dev/vitest/issues/6141)).
>>>>>>> 6e177f41d730f908b84847fb174596f38ae0b7ad

## 从 Jest 迁移 {#jest}

Vitest 的 API 设计兼容 Jest，旨在使从 Jest 迁移尽可能简单。尽管如此，你仍可能遇到以下差异：

### 默认是否启用全局变量

Jest 默认启用其 [globals API](https://jestjs.io/docs/api)。Vitest 默认不启用。你可以通过配置项 [globals](/config/#globals) 启用全局变量，或者修改代码直接从 `vitest` 模块导入所需 API。

如果选择不启用全局变量，注意常用库如 [`testing-library`](https://testing-library.com/) 将不会自动执行 DOM 的 [清理](https://testing-library.com/docs/svelte-testing-library/api/#cleanup)。

### `spy.mockReset`

Jest 的 [`mockReset`](https://jestjs.io/docs/mock-function-api#mockfnmockreset) 会将 mock 实现替换为空函数，返回 `undefined`。

Vitest 的 [`mockReset`](/api/mock#mockreset) 会将 mock 实现重置为最初的实现。也就是说，使用 `vi.fn(impl)` 创建的 mock，`mockReset` 会将实现重置为 `impl`。

### 模块 Mock

在 Jest 中，mock 模块时工厂函数返回值即为默认导出。在 Vitest 中，工厂函数需返回包含所有导出的对象。例如，以下 Jest 代码需要改写为：

```ts
jest.mock('./some-path', () => 'hello') // [!code --]
vi.mock('./some-path', () => ({ // [!code ++]
  default: 'hello', // [!code ++]
})) // [!code ++]
```

更多细节请参考 [`vi.mock` API](/api/vi#vi-mock)。

### 自动 Mock 行为

与 Jest 不同，Vitest 仅在调用 `vi.mock()` 时加载 `<root>/__mocks__` 中的模块。如果你需要像 Jest 一样在每个测试中自动 mock，可以在 [`setupFiles`](/config/#setupfiles) 中调用 mock。

### 导入被 Mock 包的原始模块

如果只部分 mock 一个包，之前可能用 Jest 的 `requireActual`，Vitest 中应使用 `vi.importActual`：

```ts
const { cloneDeep } = jest.requireActual('lodash/cloneDeep') // [!code --]
const { cloneDeep } = await vi.importActual('lodash/cloneDeep') // [!code ++]
```

### 扩展 Mock 到外部库

Jest 默认会扩展 mock 到使用相同模块的外部库。Vitest 需要显式告知要 mock 的第三方库，使其成为源码的一部分，方法是使用 [server.deps.inline](https://vitest.dev/config/#server-deps-inline)：

```
server.deps.inline: ["lib-name"]
```

### `expect.getState().currentTestName`

Vitest 的测试名使用 `>` 符号连接，方便区分测试与套件，而 Jest 使用空格 (` `)。

```diff
- `${describeTitle} ${testTitle}`
+ `${describeTitle} > ${testTitle}`
```

### 环境变量

与 Jest 类似，Vitest 会将未设置时的 `NODE_ENV` 设为 `test`。Vitest 还有对应 `JEST_WORKER_ID` 的 `VITEST_POOL_ID`（小于等于 `maxThreads`），如果依赖此值，需重命名。Vitest 还暴露 `VITEST_WORKER_ID`，表示唯一的运行中 worker ID，受 `maxThreads` 不影响，随 worker 创建递增。

### 替换属性

如果想修改对象，Jest 使用 [replaceProperty API](https://jestjs.io/docs/jest-object#jestreplacepropertyobject-propertykey-value)，Vitest 可使用 [`vi.stubEnv`](/api/#vi-stubenv) 或 [`vi.spyOn`](/api/vi#vi-spyon) 达成相同效果。

### Done 回调

从 Vitest v0.10.0 开始，回调式测试声明被弃用。你可以改写为使用 `async`/`await`，或用 Promise 模拟回调风格。

<!--@include: ./examples/promise-done.md-->

### Hooks

Vitest 中 `beforeAll`/`beforeEach` 钩子可返回 [清理函数](/api/#setup-and-teardown)。因此，如果钩子返回非 `undefined` 或 `null`，可能需改写：

```ts
beforeEach(() => setActivePinia(createTestingPinia())) // [!code --]
beforeEach(() => { setActivePinia(createTestingPinia()) }) // [!code ++]
```

Jest 中钩子顺序执行（逐个执行），Vitest 默认并行执行。若想使用 Jest 行为，可配置 [`sequence.hooks`](/config/#sequence-hooks)：

```ts
export default defineConfig({
  test: {
    sequence: { // [!code ++]
      hooks: 'list', // [!code ++]
    } // [!code ++]
  }
})
```

### 类型

Vitest 没有 Jest 的 `jest` 命名空间，需直接从 `vitest` 导入类型：

```ts
let fn: jest.Mock<(name: string) => number> // [!code --]
import type { Mock } from 'vitest' // [!code ++]
let fn: Mock<(name: string) => number> // [!code ++]
```

### 定时器

Vitest 不支持 Jest 的遗留定时器。

### 超时

如果使用了 `jest.setTimeout`，需迁移为 `vi.setConfig`：

```ts
jest.setTimeout(5_000) // [!code --]
vi.setConfig({ testTimeout: 5_000 }) // [!code ++]
```

### Vue 快照

这不是 Jest 特有功能，但如果之前使用 Jest 的 vue-cli preset，需要安装 [`jest-serializer-vue`](https://github.com/eddyerburgh/jest-serializer-vue) 包，并在 [setupFiles](/config/#setupfiles) 中使用：

:::code-group
```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    setupFiles: ['./tests/unit/setup.js']
  }
})
```
```js [tests/unit/setup.js]
import vueSnapshotSerializer from 'jest-serializer-vue'

expect.addSnapshotSerializer(vueSnapshotSerializer)
```
:::

否则快照中会出现大量转义的 `"` 字符。
