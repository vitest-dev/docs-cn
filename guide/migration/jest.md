---
title: 从 Jest 迁移 | 指南
outline: deep
---

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

<!-- TODO: translation -->

The same applies to [`testNamePattern`](/config/testnamepattern) (the `-t` flag): Vitest matches against the `>`-joined full name, while Jest matches the space-joined name. Update patterns that span a suite and a test accordingly, or match a single segment (`-t adds`) or use a wildcard between segments (`-t 'math.*adds'`).

```diff
- vitest -t 'math adds'
+ vitest -t 'math > adds'
```

### 环境变量 {#envs}

与 Jest 一样，如果 `NODE_ENV` 在此之前未被设置，Vitest 会将其设为 `test`。Vitest 还提供了与 `JEST_WORKER_ID` 对应的 `VITEST_POOL_ID`（始终小于或等于 `maxWorkers`），如果你依赖该变量，别忘了重命名。Vitest 还暴露了 `VITEST_WORKER_ID`，它是运行中 worker 的唯一 ID 且该编号不受 `maxWorkers` 影响，每创建一个新 worker 就会递增。

### 替换属性 {#replace-property}

如果想修改对象，Jest 使用 [replaceProperty API](https://jestjs.io/docs/jest-object#jestreplacepropertyobject-propertykey-value)，Vitest 可使用 [`vi.stubEnv`](/api/vi#vi-stubenv) 或 [`vi.spyOn`](/api/vi#vi-spyon) 达成相同效果。

### Done 回调 {#done-callback}

Vitest 不支持回调式测试声明。你可以改写为使用 `async`/`await` 函数，或使用 Promise 来模拟回调风格。

<!--@include: ../examples/promise-done.md-->

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
