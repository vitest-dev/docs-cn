---
title: 迁移指南 | 指南
outline: deep
---

# 迁移指南 {#migration-guide}

## 迁移到 Vitest 4.0 {#vitest-4}

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

### `spyOn` and `fn` 支持构造函数 {#spyon-and-fn-support-constructors}

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

### Mock 的变更 {#changes-to-mocking}

Vitest 4 除新增构造函数支持外，还重构了 mock 的创建机制，一举修复多年累积的模块模拟顽疾；尤其在类与 spy 交互时，行为更易预测、不再烧脑。

- `vi.fn().getMockName()` 现默认返回 `vi.fn()`，而不再附带 `spy`。这一改动会使快照中的 mock 名称从 `[MockFunction spy]` 简化为 `[MockFunction]`；而 `vi.spyOn` 创建的 spy 仍沿用原始名称，便于调试。
- `vi.restoreAllMocks` 现已缩小作用范围：仅还原由 `vi.spyOn` 手动创建的 spy ，不再触及自动 mock ，亦不会重置其内部状态（对应配置项 [`restoreMocks`](/config/#restoremocks) 同步更新）。`.mockRestore` 仍按原行为重置实现并清空状态。
- 现对 mock 调用 `vi.spyOn` 时，返回的仍是原 mock，而非新建 spy。
- 自动 mock 的实例方法已正确隔离，但仍与原型共享底层状态；除非方法已自定义 mock 实现，否则修改原型实现会同步影响所有实例。此外，调用 `.mockReset` 不再破坏此继承关系。

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

- 环境变量：`VITE_NODE_DEPS_MODULE_DIRECTORIES` → `VITEST_MODULE_DIRECTORIES`
- 注入字段：`__vitest_executor` → `moduleRunner`（[`ModuleRunner`](https://vite.dev/guide/api-environment-runtimes.html#modulerunner) 实例）
- 移除内部入口 `vitest/execute`
- 自定义环境用 `viteEnvironment` 取代 `transformMode`；未指定时，Vitest 以环境名匹配 [`server.environments`](https://vite.dev/guide/api-environment-instances.html)
- 依赖列表剔除 `vite-node`
- `deps.optimizer.web` 重命名为 [`deps.optimizer.client`](/config/#deps-optimizer-client)，并支持自定义环境名

Vite 已提供外部化机制，但为降低破坏性，仍保留旧方案；[`server.deps`](/config/#server-deps) 可继续用于包的内联/外部化。

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

### 报告器更新 {#reporter-updates}

Reporter API `onCollected`，`onSpecsCollected`，`onPathsCollected`，`onTaskUpdate` 和 `onFinished` 被移除。参阅 [`Reporters API`](/advanced/api/reporters) 了解新的替代方案。新的 API 在 Vitest `v3.0.0` 中引入。

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

### 使用自定义元素打印阴影根的快照 {#snapshots-using-custom-elements-print-the-shadow-root}

在 Vitest 4.0 中，包含自定义元素的快照将打印阴影根内容。要恢复以前的行为，请将 [`printShadowRoot` option](/config/#snapshotformat) 设为`false`。

```js{15-22}
// before Vite 4.0
exports[`custom element with shadow root 1`] = `
"<body>
  <div>
    <custom-element />
  </div>
</body>"
`

// after Vite 4.0
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
- `browser.testerScripts` 配置项。请使用 [`browser.testerHtmlPath`](/guide/browser/config#browser-testerhtmlpath) 代替。
- `minWorkers` 配置项。只有 `maxWorkers` 会对测试运行方式产生影响，因此我们正在移除这个公共选项。
- Vitest 不再支持将测试选项作为第三个参数提供给 `test` 和 `describe`。请改用第二个参数。

```ts
test('example', () => { /* ... */ }, { retry: 2 }) // [!code --]
test('example', { retry: 2 }, () => { /* ... */ }) // [!code ++]
```

同时，所有弃用类型被一次性清理，彻底解决误引 `@types/node` 的问题（[#5481](https://github.com/vitest-dev/vitest/issues/5481)、[#6141](https://github.com/vitest-dev/vitest/issues/6141)）。

## 从 Jest 迁移 {#jest}

Vitest 的 API 设计兼容 Jest，旨在使从 Jest 迁移尽可能简单。尽管如此，你仍可能遇到以下差异：

### 默认是否启用全局变量 {#globals-as-a-default}

Jest 默认启用其 [globals API](https://jestjs.io/docs/api)。Vitest 默认不启用。你可以通过配置项 [globals](/config/#globals) 启用全局变量，或者修改代码直接从 `vitest` 模块导入所需 API。

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

与 Jest 不同，Vitest 仅在调用 `vi.mock()` 时加载 `<root>/__mocks__` 中的模块。如果你需要像 Jest 一样在每个测试中自动 mock，可以在 [`setupFiles`](/config/#setupfiles) 中调用 mock。

### 导入被 Mock 包的原始模块 {#importing-the-original-of-a-mocked-package}

如果只部分 mock 一个包，之前可能用 Jest 的 `requireActual`，Vitest 中应使用 `vi.importActual`：

```ts
const { cloneDeep } = jest.requireActual('lodash/cloneDeep') // [!code --]
const { cloneDeep } = await vi.importActual('lodash/cloneDeep') // [!code ++]
```

### 扩展 Mock 到外部库 {#extends-mocking-to-external-libraries}

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

### 环境变量 {#envs}

与 Jest 类似，Vitest 会将未设置时的 `NODE_ENV` 设为 `test`。Vitest 还有对应 `JEST_WORKER_ID` 的 `VITEST_POOL_ID`（小于等于 `maxThreads`），如果依赖此值，需重命名。Vitest 还暴露 `VITEST_WORKER_ID`，表示唯一的运行中 worker ID，受 `maxThreads` 不影响，随 worker 创建递增。

### 替换属性 {#replace-property}

如果想修改对象，Jest 使用 [replaceProperty API](https://jestjs.io/docs/jest-object#jestreplacepropertyobject-propertykey-value)，Vitest 可使用 [`vi.stubEnv`](/api/#vi-stubenv) 或 [`vi.spyOn`](/api/vi#vi-spyon) 达成相同效果。

### Done 回调 {#done-callback}

Vitest 不支持回调式测试声明。你可以改写为使用 `async`/`await` 函数，或使用 Promise 来模拟回调风格。

<!--@include: ./examples/promise-done.md-->

### Hooks {#hooks}

Vitest 中 `beforeAll`/`beforeEach` 钩子可返回 [清理函数](/api/#setup-and-teardown)。因此，如果钩子返回非 `undefined` 或 `null`，可能需改写：

```ts
beforeEach(() => setActivePinia(createTestingPinia())) // [!code --]
beforeEach(() => { setActivePinia(createTestingPinia()) }) // [!code ++]
```

在 Jest 中钩子是顺序执行的（一个接一个）。默认情况下，Vitest 在栈中运行钩子。要使用 Jest 的行为，请更新 [`sequence.hooks`](/config/#sequence-hooks) 选项：

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

这不是 Jest 特有的功能，但如果你之前在 vue-cli 预设中使用 Jest，你需要安装 [`jest-serializer-vue`](https://github.com/eddyerburgh/jest-serializer-vue) 包，并在 [`snapshotSerializers`](/config/#snapshotserializers) 中指定它：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    snapshotSerializers: ['jest-serializer-vue']
  }
})
```

否则快照中会出现大量转义的 `"` 字符。
