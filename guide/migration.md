---
title: 迁移指南 | 指南
outline: deep
---

# 迁移指南 {#migration-guide}
<!-- TODO: translation -->
[Migrating to Vitest 3.0](https://v3.vitest.dev/guide/migration) | [Migrating to Vitest 2.0](https://v2.vitest.dev/guide/migration)

## 迁移到 Vitest 4.0 {#vitest-4}

::: warning Prerequisites
Vitest 4.0 requires **Vite >= 6.0.0** and **Node.js >= 20.0.0**. Before proceeding
with any other migration steps, ensure your environment meets these requirements.
Running Vitest 4.0 on older versions of Vite or Node.js is not supported and may
result in unexpected errors.
:::

### V8 Code Coverage Major Changes {#v8-code-coverage-major-changes}

Vitest 的 V8 覆盖率提供器现在使用了更精准的结果映射逻辑，从 Vitest v3 升级后，你可能会看到覆盖率报告的内容有变化。

之前 Vitest 使用 [`v8-to-istanbul`](https://github.com/istanbuljs/v8-to-istanbul) 将 V8 覆盖率结果映射到源码文件，但这种方式不够准确，报告中常常会出现误报。现在我们开发了基于 AST 分析的新方法，使 V8 报告的准确度与 `@vitest/coverage-istanbul` 一致。

- 覆盖率忽略提示已更新，详见 [覆盖率 | 忽略代码](/guide/coverage.html#ignoring-code)。
- 已移除 `coverage.ignoreEmptyLines` 选项。没有可执行代码的行将不再出现在报告中。
- 已移除 `coverage.experimentalAstAwareRemapping` 选项。此功能现已默认启用，并成为唯一的映射方式。
- 现在 V8 提供器也支持 `coverage.ignoreClassMethods`。

### 移除 `coverage.all` 和 `coverage.extensions` 选项 {#removed-options-coverage-all-and-coverage-extensions}

在之前的版本中，Vitest 会默认把所有未覆盖的文件包含到报告中。这是因为 `coverage.all` 默认为 `true`，`coverage.include` 默认为 `**`。这样设计是因为测试工具无法准确判断用户源码所在位置。

然而，这导致 Vitest 覆盖率工具会处理很多意料之外的文件（例如压缩 JS 文件），造成报告生成速度很慢甚至卡死。在 Vitest v4 中，我们彻底移除了 `coverage.all`，并将默认行为改为**只在报告中包含被测试覆盖的文件**。

升级至 v4 版本时，建议先在配置文件中定义 `coverage.include`，再根据需要逐步添加简单的 `coverage.exclude` 匹配规则。

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

### 简化的 `exclude` 配置 {#simplified-exclude}

默认情况下，Vitest 现在仅排除 `node_modules` 和 `.git` 文件夹中的测试文件。这意味着 Vitest 不再排除以下内容：

- `dist` 和 `cypress` 文件夹
- `.idea`、`.cache`、`.output`、`.temp` 文件夹
- 配置文件，如 `rollup.config.js`、`prettier.config.js`、`ava.config.js` 等

如果需要限制测试文件所在的目录，建议使用 [`test.dir`](/config/dir) 选项，因为它的性能优于排除文件：

```ts
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    dir: './frontend/tests', // [!code ++]
  },
})
```

要恢复之前的行为，请手动指定旧的 `excludes`：

```ts
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      '**/dist/**', // [!code ++]
      '**/cypress/**', // [!code ++]
      '**/.{idea,git,cache,output,temp}/**', // [!code ++]
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*' // [!code ++]
    ],
  },
})
```

### `spyOn` 和 `fn` 支持构造函数  {#spyon-and-fn-support-constructors}

在之前的版本中，如果尝试使用 `vi.spyOn` 监视构造函数，可能会收到类似 `Constructor <name> requires 'new'` 的错误。自 Vitest 4 起，所有通过 `new` 关键字调用的模拟会构造实例，而不是调用 `mock.apply`。这意味着在这些情况下，模拟实现必须使用 `function` 或 `class` 关键字：

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

### Mock 的变更 {#changes-to-mocking}

除了新增对构造函数的支持等功能外，Vitest 4 还对模拟的创建方式进行了调整，以解决多年来我们收到的多个模块模拟问题。此版本试图减少模块监视的混淆，尤其是在处理类时。

- `vi.fn().getMockName()` 现在默认返回 `vi.fn()` 而非 `spy`。这可能会影响包含模拟的快照 —— 名称将从 `[MockFunction spy]` 改为 `[MockFunction]`。通过 `vi.spyOn` 创建的监视器默认仍会使用原始名称，以提供更好的调试体验。
- `vi.restoreAllMocks` 不再重置监视器的状态，仅恢复通过 `vi.spyOn` 手动创建的监视器，自动模拟不再受此函数影响（这也影响了配置选项 [`restoreMocks`](/config/restoremocks)）。需注意的是，`.mockRestore` 仍会重置模拟实现并清除状态。
- 对模拟调用 `vi.spyOn` 现在会返回相同的模拟。
- `mock.settledResults` 现在会在函数调用时立即填充一个 `'incomplete'` 结果。当 Promise 完成时，类型会根据结果更新。
- 自动模拟的实例方法现在已正确隔离，但仍与原型共享状态。除非实例方法有自己的自定义模拟实现，否则覆盖原型实现将始终影响实例方法。对模拟调用 `.mockReset` 也不再破坏这种继承关系。

```ts
import { AutoMockedClass } from './example.js'
const instance1 = new AutoMockedClass()
const instance2 = new AutoMockedClass()

instance1.method.mockReturnValue(42)

expect(instance1.method()).toBe(42)
expect(instance2.method()).toBe(undefined)

expect(AutoMockedClass.prototype.method).toHaveBeenCalledTimes(2)

instance1.method.mockReset()
AutoMockedClass.prototype.method.mockReturnValue(100)

expect(instance1.method()).toBe(100)
expect(instance2.method()).toBe(100)

expect(AutoMockedClass.prototype.method).toHaveBeenCalledTimes(4)
```
- 自动 mock 方法一经生成即不可还原，手动 `.mockRestore` 无效；`spy: true` 的自动 mock 模块行为保持不变。
- 自动 mock 的 getter 不再执行原始逻辑，默认返回 `undefined`；如需继续监听并改写，请使用 `vi.spyOn(object, name, 'get')`。
- 执行 `vi.fn(implementation).mockReset()` 后，`.getMockImplementation()` 现可正确返回原 mock 实现。
- `vi.fn().mock.invocationCallOrder` 现以 `1` 起始，与 Jest 保持一致。

### 带文件名过滤器的独立模式 {#standalone-mode-with-filename-filter}

为了提升用户体验，当 [`--standalone`](/guide/cli#standalone) 与文件名过滤器一起使用时，Vitest 现在会直接开始运行匹配到的文件。

```sh
# 在 Vitest v3 及以下版本中，该命令将忽略 "math.test.ts" 文件名过滤器。
# 在 Vitest v4 中，math.test.ts 将自动运行。
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
# 以独立模式启动 Vitest，启动时不运行任何文件
$ pnpm run test:dev

# 立即运行 math.test.ts
$ pnpm run test:dev math.test.ts
```
:::

### `vite-node` 替换为 [Module Runner](https://vite.dev/guide/api-environment-runtimes.html#modulerunner) {#replacing-vite-node-with-module-runner}

Module Runner 已取代 `vite-node`，直接内嵌于 Vite, Vitest 亦移除 SSR 封装，直接调用。主要变更如下：

- `VITE_NODE_DEPS_MODULE_DIRECTORIES` 环境变量已替换为 `VITEST_MODULE_DIRECTORIES`
- Vitest 不再向每个 [测试运行器](/api/advanced/runner) 注入 `__vitest_executor`，改为注入 `moduleRunner`，它是 [`ModuleRunner`](https://cn.vite.dev/guide/api-environment-runtimes.html#modulerunner) 的实例
- `vitest/execute` 入口点已移除，它始终仅供内部使用
- [自定义环境](/guide/environment) 不再需要提供 `transformMode` 属性，改为提供 `viteEnvironment`。若未提供，Vitest 将使用环境名称在服务端转换文件（更多内容请参阅 [`server.environments`](https://cn.vite.dev/guide/api-environment-instances.html)）
- `vite-node` 不再是 Vitest 的依赖项
- `deps.optimizer.web` 已重命名为 [`deps.optimizer.client`](/config/deps#deps-client)。在使用其他服务端环境时，你也可以使用任意自定义名称来应用优化器配置

Vite 已提供外部化机制，但为降低破坏性，仍保留旧方案；[`server.deps`](/config/server#deps) 可继续用于包的内联/外部化。

未使用上述高级功能者，升级无感知。

### `workspace` 替换为 `projects` {#workspace-is-replaced-with-projects}

在 Vitest 3.2 中，`workspace` 配置选项更名为 [`projects`](/guide/projects)。除了不能指定其他文件作为工作区的源文件（以前可以指定导出项目数组的文件）外，它们在功能上是相同的。迁移到 `projects` 非常简单，只需将代码从 `vitest.workspace.js` 移动到 `vitest.config.ts`：

::: code-group
```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    workspace: './vitest.workspace.js', // [!code --]
    projects: [ // [!code ++]
      './packages/*', // [!code ++]
      { // [!code ++]
        test: { // [!code ++]
          name: 'unit', // [!code ++]
        }, // [!code ++]
      }, // [!code ++]
    ] // [!code ++]
  }
})
```
```ts [vitest.workspace.js]
import { defineWorkspace } from 'vitest/config' // [!code --]

export default defineWorkspace([ // [!code --]
  './packages/*', // [!code --]
  { // [!code --]
    test: { // [!code --]
      name: 'unit', // [!code --]
    }, // [!code --]
  } // [!code --]
]) // [!code --]
```
:::

### 修改浏览器模式提供者 {#browser-provider-rework}

在 Vitest 4.0 中，浏览器提供者现在接受对象而非字符 (`'playwright'`, `'webdriverio'`)。 `preview` 不再是默认设置。这使得使用自定义选项变得更简单，而且不再需要添加 `/// <reference` 注释。

```ts
import { playwright } from '@vitest/browser-playwright' // [!code ++]

export default defineConfig({
  test: {
    browser: {
      provider: 'playwright', // [!code --]
      provider: playwright({ // [!code ++]
        launchOptions: { // [!code ++]
          slowMo: 100, // [!code ++]
        }, // [!code ++]
      }), // [!code ++]
      instances: [
        {
          browser: 'chromium',
          launch: { // [!code --]
            slowMo: 100, // [!code --]
          }, // [!code --]
        },
      ],
    },
  },
})
```

现在，`playwright` 工厂中的属性命名也与 [Playwright 文档](https://playwright.dev/docs/api/class-testoptions#test-options-launch-options) 一致，从而更容易查找。

有了这一变更，就不再需要 `@vitest/browser` 软件包了，您可以将其从依赖关系中移除。要支持上下文导入，应将 `@vitest/browser/context` 更新为 `vitest/browser`：

```ts
import { page } from '@vitest/browser/context' // [!code --]
import { page } from 'vitest/browser' // [!code ++]

test('example', async () => {
  await page.getByRole('button').click()
})
```

这些模块完全相同，因此只需进行简单的 “查找和替换” 即可。

如果使用 `@vitest/browser/utils` 模块，现在也可以从 `vitest/browser` 导入这些实用程序：

```ts
import { getElementError } from '@vitest/browser/utils' // [!code --]
import { utils } from 'vitest/browser' // [!code ++]
const { getElementError } = utils // [!code ++]
```

::: warning
在过渡期间，`@vitest/browser/context` 和 `@vitest/browser/utils` 都能在运行时工作，但它们将在未来的版本中移除。
:::

### Pool 重构 {#pool-rework}

Vitest 过去使用 [`tinypool`](https://github.com/tinylibs/tinypool) 来编排测试文件在 test runner worker 中的运行方式。Tinypool 负责在内部处理并行、隔离和 IPC 通信等复杂任务。然而我们发现 Tinypool 存在一些缺陷，拖慢了 Vitest 的开发进度。在 Vitest v4 中，我们彻底移除了 Tinypool，并在不引入新依赖的前提下重写了 pool 的工作机制。详细原因请参阅 [feat!: rewrite pools without tinypool #8705](https://github.com/vitest-dev/vitest/pull/8705)

新的 pool 架构使 Vitest 得以简化许多此前复杂的配置项：

- `maxThreads` 和 `maxForks` 现统一为 `maxWorkers`。
- 环境变量 `VITEST_MAX_THREADS` 和 `VITEST_MAX_FORKS` 现统一为 `VITEST_MAX_WORKERS`。
- `singleThread` 和 `singleFork` 现等价于 `maxWorkers: 1, isolate: false`。如果你的测试依赖测试间的模块重置，需添加 [setupFile](/config/setupfiles) 并在 [`beforeAll` 测试钩子](/api/hooks#beforeall) 中调用 [`vi.resetModules()`](/api/vi.html#vi-resetmodules)。
- `poolOptions` 已移除。原有的所有 `poolOptions` 配置项现均为顶层选项。虚拟运行池的 `memoryLimit` 已重命名为 `vmMemoryLimit`。
- `threads.useAtomics` 已移除。如果你有相关使用场景，欢迎提交新的功能请求。
- 自定义运行池接口已重写，详见 [自定义运行池](/guide/advanced/pool#custom-pool)。

```ts
export default defineConfig({
  test: {
    poolOptions: { // [!code --]
      forks: { // [!code --]
        execArgv: ['--expose-gc'], // [!code --]
        isolate: false, // [!code --]
        singleFork: true, // [!code --]
      }, // [!code --]
      vmThreads: { // [!code --]
        memoryLimit: '300Mb' // [!code --]
      }, // [!code --]
    }, // [!code --]
    execArgv: ['--expose-gc'], // [!code ++]
    isolate: false, // [!code ++]
    maxWorkers: 1, // [!code ++]
    vmMemoryLimit: '300Mb', // [!code ++]
  }
})
```

此前在使用 [测试项目](/guide/projects) 时，无法为单个项目单独指定某些 pool 相关配置项。新架构已解除了这一限制。

::: code-group
```ts [按项目隔离]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        // 非隔离的单元测试
        name: 'Unit tests',
        isolate: false,
        exclude: ['**.integration.test.ts'],
      },
      {
        // 隔离的集成测试
        name: 'Integration tests',
        include: ['**.integration.test.ts'],
      },
    ],
  },
})
```
```ts [并行与串行项目]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        name: 'Parallel',
        exclude: ['**.sequential.test.ts'],
      },
      {
        name: 'Sequential',
        include: ['**.sequential.test.ts'],
        fileParallelism: false,
      },
    ],
  },
})
```
```ts [按项目分配 Node CLI 选项]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        name: 'Production env',
        execArgv: ['--env-file=.env.prod']
      },
      {
        name: 'Staging env',
        execArgv: ['--env-file=.env.staging']
      },
    ],
  },
})
```
:::

更多示例请参阅 [测试技巧](/guide/recipes)。

### 报告器升级 {#reporter-updates}

Reporter API 中的 `onCollected`、`onSpecsCollected`、`onPathsCollected`、`onTaskUpdate` 和 `onFinished` 已被移除。新的替代方案请参阅 [`Reporters API`](/api/advanced/reporters)。新 API 于 Vitest `v3.0.0` 中引入。

移除了 `basic` 报告器，因为它等价于：

```ts
export default defineConfig({
  test: {
    reporters: [
      ['default', { summary: false }]
    ]
  }
})
```

现在，[`verbose`](/guide/reporters#verbose-reporter) 报告器会以平面列表的形式打印测试用例。要恢复以前的行为，请使用 `--reporter=tree`:

```ts
export default defineConfig({
  test: {
    reporters: ['verbose'], // [!code --]
    reporters: ['tree'], // [!code ++]
  }
})
```

### 使用自定义元素打印 Shadow Root 快照 {#snapshots-using-custom-elements-print-the-shadow-root}

在 Vitest 4.0 中，包含自定义元素的快照将打印阴影根内容。要恢复以前的行为，请将 [`printShadowRoot` option](/config/snapshotformat) 设为`false`。

```js{15-22}
// 自 Vitest 4.0 前
exports[`custom element with shadow root 1`] = `
"<body>
  <div>
    <custom-element />
  </div>
</body>"
`

// 自 Vitest 4.0 后
exports[`custom element with shadow root 1`] = `
"<body>
  <div>
    <custom-element>
      #shadow-root
        <span
          class="some-name"
          data-test-id="33"
          id="5"
        >
          hello
        </span>
    </custom-element>
  </div>
</body>"
`
```

### 移除弃用的 API {#deprecated-apis-are-removed}

Vitest 4.0 移除了以下废弃的配置项：

- `poolMatchGlobs` 配置项。请使用 [`projects`](/guide/projects) 代替。
- `environmentMatchGlobs` 配置项。请使用 [`projects`](/guide/projects) 代替。
- `deps.external`、`deps.inline`、`deps.fallbackCJS` 配置项。请改用 `server.deps.external`、`server.deps.inline` 或 `server.deps.fallbackCJS`。
- `browser.testerScripts` 配置项。请使用 [`browser.testerHtmlPath`](/config/browser/testerhtmlpath) 代替。
- `minWorkers` 配置项。只有 `maxWorkers` 会对测试运行方式产生影响，因此我们正在移除这个公共选项。
- Vitest 不再支持将测试选项作为第三个参数提供给 `test` 和 `describe`。请改用第二个参数。

```ts
test('example', () => { /* ... */ }, { retry: 2 }) // [!code --]
test('example', { retry: 2 }, () => { /* ... */ }) // [!code ++]
```

Note that providing a timeout number as the last argument is still supported:

```ts
test('example', () => { /* ... */ }, 1000) // ✅
```

This release also removes all deprecated types. This finally fixes an issue where Vitest accidentally pulled in `@types/node` (see [#5481](https://github.com/vitest-dev/vitest/issues/5481) and [#6141](https://github.com/vitest-dev/vitest/issues/6141)).

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

### 环境变量 {#envs}

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
<!-- TODO: translation -->
### Custom Snapshot Matchers <Badge type="warning">experimental</Badge> <Version>4.1.3</Version>

Jest imports snapshot composables from `jest-snapshot`. In Vitest, import from `vitest/runtime` instead:

```ts
const { toMatchSnapshot } = require('jest-snapshot') // [!code --]
import { toMatchSnapshot } from 'vitest/runtime' // [!code ++]

expect.extend({
  toMatchTrimmedSnapshot(received: string, length: number) {
    return toMatchSnapshot.call(this, received.slice(0, length))
  },
})
```

For inline snapshots, the same applies:

```ts
const { toMatchInlineSnapshot } = require('jest-snapshot') // [!code --]
import { toMatchInlineSnapshot } from 'vitest/runtime' // [!code ++]

expect.extend({
  toMatchTrimmedInlineSnapshot(received: string, inlineSnapshot?: string) {
    return toMatchInlineSnapshot.call(this, received.slice(0, 10), inlineSnapshot)
  },
})
```

See [Custom Snapshot Matchers](/guide/snapshot#custom-snapshot-matchers) for the full guide.

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

| Sinon-Chai | Vitest | 详情 |
|------------|--------|-------------|
| `spy.called` | `called` | Spy 至少被调用过一次 |
| `spy.calledOnce` | `calledOnce` |  Spy 恰好被调用过一次 |
| `spy.calledTwice` | `calledTwice` | Spy 恰好被调用过两次 |
| `spy.calledThrice` | `calledThrice` | Spy 恰好被调用过三次 |
| `spy.callCount(n)` | `callCount(n)` | Spy 被调用过 n 次 |
| `spy.calledWith(...)` | `calledWith(...)` | Spy 以特定参数被调用 |
| `spy.calledOnceWith(...)` | `calledOnceWith(...)` | Spy 以特定参数恰好被调用一次 |
| `spy.returned(value)` | `returned` | Spy 返回了特定值 |

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
