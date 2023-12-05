---
title: 迁移指南 | 指南
outline: deep
---

# 迁移指南

## 从 Vitest 0.34.6 迁移

<!-- introduction -->

### 最低要求

Vitest 1.0 需要 Vite 5.0 和 Node.js 18 或更高版本。

所有 `@vitest/*` 子软件包都需要 Vitest 1.0 版本。

### Snapshots 更新 [#3961](https://github.com/vitest-dev/vitest/pull/3961)

快照中的引号不再转义，即使字符串只有一行，所有快照也都使用回车引号 (`)。

1. 引号不再转义：

```diff
expect({ foo: 'bar' }).toMatchInlineSnapshot(`
  Object {
-    \\"foo\\": \\"bar\\",
+    "foo": "bar",
  }
`)
```

2. 单行快照现在使用"`"引号，而不是"'"：

```diff
- expect('some string').toMatchInlineSnapshot('"some string"')
+ expect('some string').toMatchInlineSnapshot(`"some string"`)
```

对 `@vitest/snapshot` 也有[修改](https://github.com/vitest-dev/vitest/pull/4076)。如果不直接使用它，则无需做任何更改。

- 我们不再需要扩展 `SnapshotClient` 以覆盖 `equalityCheck` 方法：只需在启动实例时将其作为 `isEqual` 传递即可。
- `client.setTest` 更名为 `client.startCurrentRun`
- `client.resetCurrent` 更名为 `client.finishCurrentRun` 。


### Pools 标准化 [#4172](https://github.com/vitest-dev/vitest/pull/4172)

We removed a lot of configuration options to make it easier to configure the runner to your needs. Please, have a look at migration examples if you rely on `--threads` or other related flags.

我们删除了大量配置选项，以便根据需要配置运行程序。如果你已经使用了 `--threads` 或其他相关标记，请查看迁移示例。

- `--threads` 现在是 `--pool=threads`
- `--no-threads` 现在是 `--pool=forks`
- `--single-thread` 现在是 `--poolOptions.threads.singleThread`
- `--experimental-vm-threads` 现在是 `--pool=vmThreads`
- `--experimental-vm-worker-memory-limit` 现在是 `--poolOptions.vmThreads.memoryLimit`
- `--isolate` 现在是 `--poolOptions.<pool-name>.isolate` 和 `browser.isolate`
- `test.maxThreads` 现在是 `test.poolOptions.<pool-name>.maxThreads`
- `test.minThreads` 现在是 `test.poolOptions.<pool-name>.minThreads`
- `test.useAtomics` 现在是 `test.poolOptions.<pool-name>.useAtomics`
- `test.poolMatchGlobs.child_process` 现在是 `test.poolMatchGlobs.forks`
- `test.poolMatchGlobs.experimentalVmThreads` 现在是 `test.poolMatchGlobs.vmThreads`

```diff
{
  scripts: {
-    "test": "vitest --no-threads"
     // For identical behaviour:
+    "test": "vitest --pool forks --poolOptions.forks.singleFork"
     // Or multi parallel forks:
+    "test": "vitest --pool forks"

  }
}
```

```diff
{
  scripts: {
-    "test": "vitest --experimental-vm-threads"
+    "test": "vitest --pool vmThreads"
  }
}
```

```diff
{
  scripts: {
-    "test": "vitest --isolate false"
+    "test": "vitest --poolOptions.threads.isolate false"
  }
}
```

```diff
{
  scripts: {
-    "test": "vitest --no-threads --isolate false"
+    "test": "vitest --pool forks --poolOptions.forks.isolate false"
  }
}
```

### Coverage 的变化 [#4265](https://github.com/vitest-dev/vitest/pull/4265), [#4442](https://github.com/vitest-dev/vitest/pull/4442)

选项 `coverage.all` 现在默认启用。这意味着，所有符合 `coverage.include` 模式的项目文件都将被处理，即使它们未被执行。

更改了覆盖阈值 API 的形状，现在它支持使用 glob 模式为特定文件指定阈值：

```diff
export default defineConfig({
  test: {
    coverage: {
-      perFile: true,
-      thresholdAutoUpdate: true,
-      100: true,
-      lines: 100,
-      functions: 100,
-      branches: 100,
-      statements: 100,
+      thresholds: {
+        perFile: true,
+        autoUpdate: true,
+        100: true,
+        lines: 100,
+        functions: 100,
+        branches: 100,
+        statements: 100,
+      }
    }
  }
})
```

### Mock 类型 [#4400](https://github.com/vitest-dev/vitest/pull/4400)

删除了一些类型，改用 Jest 风格的 "Mock "命名。

```diff
- import { EnhancedSpy, SpyInstance } from 'vitest'
+ import { MockInstance } from 'vitest'
```

::: warning
`SpyInstance` 已被弃用，取而代之的是  `MockInstance` ，并会在下一个主要版本中移除。
:::


### Timer mocks [#3925](https://github.com/vitest-dev/vitest/pull/3925)

`vi.useFakeTimers()` 不再自动模拟 [`process.nextTick`](https://nodejs.org/api/process.html#processnexttickcallback-args) 。
仍然可以通过使用 `vi.useFakeTimers({ toFake: ['nextTick'] })` 明确指定来模拟 `process.nextTick`。

但是，在使用 `--pool=forks` 时，无法模拟 `process.nextTick` 。如果需要模拟 `process.nextTick` ，请使用不同的 `--pool` 选项。

## 从 Jest 迁移

Vitest 设计了与 Jest 兼容的 API ，方便你从 Jest 的迁移尽可能简单。尽管做出了这些努力，你仍然可能会遇到以下差异：

### 全局变量作为默认值

Jest 默认启用[全局 API](https://jestjs.io/zh-Hans/docs/api)。然而 Vitest 没有。你既可以通过 [`globals` 配置选项](/config/#globals)启用全局 API，也可以通过更新你的代码以便使用来自 `vitest` 模块的导入。

如果你决定禁用全局 API，请注意像 [`testing-library`](https://testing-library.com/) 这样的通用库不会自动运行 DOM [cleanup](https://testing-library.com/docs/svelte-testing-library/api/#cleanup)。

### 模拟模块

在 Jest 中模拟一个模块时，工厂参数的返回值是默认导出。在 Vitest 中，工厂参数必须返回一个明确定义了每个导出的对象。例如，下面的 `jest.mock` 必须更新如下：

```ts
jest.mock('./some-path', () => 'hello') // [!code --]
vi.mock('./some-path', () => ({
  // [!code ++]
  default: 'hello', // [!code ++]
})) // [!code ++]
```

有关更深入的详细描述，请参阅 [`vi.mock` api section](/api/#vi-mock)。

### 自动模拟行为

区别于 Jest，在 `<root>/__mocks__` 中的模拟模块只有在 `vi.mock()` 被调用时才会加载。如果你需要它们像在 Jest 中一样，在每个测试中都被模拟，你可以在 [`setupFiles`](/config/#setupfiles) 中模拟它们。

### 导入模拟包的原始版本

如果你只需要模拟一个 package 的部分功能，你可能之前使用了 Jest 的 `requireActual` 函数。在 Vitest 中，你应该将这些调用替换为 `vi.importActual`。

```ts
const { cloneDeep } = jest.requireActual('lodash/cloneDeep') // [!code --]
const { cloneDeep } = await vi.importActual('lodash/cloneDeep') // [!code ++]
```

**Jasmine API**

Jest 导出各种 [`jasmine`](https://jasmine.github.io/) 全局 API (例如 `jasmine.any()` )。任何此类实例都需要迁移成 [Vitest 的对应 API ](/api/)。

### 测试环境

如果之前没有设置，Vitest 会像 Jest 一样，把 `NODE_ENV` 设置为 `test`。 Vitest 也有一个 `JEST_WORKER_ID` 的对应项，是 `VITEST_WORKER_ID`，所以如果你依赖它，不要忘记重命名它。

### 属性替换

如果你想修改测试环境，你会在 Jest 中使用 [replaceProperty API](https://jestjs.io/docs/jest-object#jestreplacepropertyobject-propertykey-value)，你可以使用 [vi.stubEnv](https://cn.vitest.dev/api/vi.html#vi-stubenv) 或者 [`vi.spyOn`](/api/vi#vi-spyon) 也可以在 Vitest 中执行此操作。

### 回调完成

从 Vitest v0.10.0 开始，声明测试的回调样式被弃用。 你可以重写它们以使用 `async`/`await` 函数，或者使用 Promise 来模仿回调样式。

```
it('should work', (done) => {  // [!code --]
it('should work', () => new Promise(done => { // [!code ++]
  // ...
  done()
}) // [!code --]
})) // [!code ++]
```

### 钩子

`beforeAll`/`beforeEach` 钩子可能在 Vitest 的 [teardown 函数](/api/#setup-and-teardown)中返回。因此，如果它们返回的不是 `undefined` 或 `null`，你可能需要重写你的钩子声明：

```ts
beforeEach(() => setActivePinia(createTestingPinia())) // [!code --]
beforeEach(() => {
  setActivePinia(createTestingPinia())
}) // [!code ++]
```

在 Jest 中，钩子是按顺序调用的（一个接一个）。默认情况下，Vitest 并行运行钩子。要使用 Jest 的行为，请更新 [`sequence.hooks`](/config/#sequence-hooks) 选项：

```ts
export default defineConfig({
  test: {
    sequence: {
      // [!code ++]
      hooks: 'list', // [!code ++]
    }, // [!code ++]
  },
})
```

### 类型

Vitest 没有等效于 `jest` 的命名空间，因此你需要直接从 `Vitest` 导入类型：

```ts
// [!code --]
import type { Mock } from 'vitest' let fn: jest.Mock<string, [string]> // [!code ++]
let fn: Mock<[string], string> // [!code ++]
```

此外，Vitest 将 `Args` 类型作为第一个参数，而不是 `Returns`，正如你在 diff 中看到的那样。

### 定时器

如果你之前在测试中使用了 jest.setTimeout ，那么你需要迁移到 Vitest 中的`vi.setConfig` :

```ts
jest.setTimeout(5_000) // [!code --]
vi.setConfig({ testTimeout: 5_000 }) // [!code ++]
```

### Vue 快照

如果你以前在 vue-cli preset 中使用 Jest，那么这不是一个 Jest 独有的新特性。你可能需要安装 [`jest-serializer-vue`](https://github.com/eddyerburgh/jest-serializer-vue) 包，然后在 [setupFiles](/config/#setupfiles) 中配置：

`vite.config.js`

```js
import { defineConfig } from 'vite'
export default defineConfig({
  test: {
    setupFiles: ['./tests/unit/setup.js'],
  },
})
```

`tests/unit/setup.js`

```js
import vueSnapshotSerializer from 'jest-serializer-vue'
expect.addSnapshotSerializer(vueSnapshotSerializer)
```

否则你的快照将出现大量的 `"` 字符。
