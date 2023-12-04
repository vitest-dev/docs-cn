---
<<<<<<< HEAD
title: 迁移指南 | 指南
=======
title: Migration Guide | Guide
outline: deep
>>>>>>> 7fd5ce3a13bc12f3308d6dc2c074d3ed95c30715
---

# 迁移指南

<<<<<<< HEAD
## 从 Jest 迁移
=======
## Migrating from Vitest 0.34.6

<!-- introduction -->

### Minimum Requirements

Vitest 1.0 requires Vite 5.0 and Node.js 18 or higher.

All `@vitest/*` sub packages require Vitest version 1.0.

### Snapshots Update [#3961](https://github.com/vitest-dev/vitest/pull/3961)

Quotes in snapshots are no longer escaped, and all snapshots use backtick quotes (`) even if the string is just a single line.


1. Quotes are no longer escaped:

```diff
expect({ foo: 'bar' }).toMatchInlineSnapshot(`
  Object {
-    \\"foo\\": \\"bar\\",
+    "foo": "bar",
  }
`)
```

2. One-line snapshots now use "`" quotes instead of ':

```diff
- expect('some string').toMatchInlineSnapshot('"some string"')
+ expect('some string').toMatchInlineSnapshot(`"some string"`)
```

There were also [changes](https://github.com/vitest-dev/vitest/pull/4076) to `@vitest/snapshot` package. If you are not using it directly, you don't need to change anything.

- You no longer need to extend `SnapshotClient` just to override `equalityCheck` method: just pass it down as `isEqual` when initiating an instance
- `client.setTest` was renamed to `client.startCurrentRun`
- `client.resetCurrent` was renamed to `client.finishCurrentRun`


### Pools are Standardized [#4172](https://github.com/vitest-dev/vitest/pull/4172)

We removed a lot of configuration options to make it easier to configure the runner to your needs. Please, have a look at migration examples if you rely on `--threads` or other related flags.

- `--threads` is now `--pool=threads`
- `--no-threads` is now `--pool=forks`
- `--single-thread` is now `--poolOptions.threads.singleThread`
- `--experimental-vm-threads` is now `--pool=vmThreads`
- `--experimental-vm-worker-memory-limit` is now `--poolOptions.vmThreads.memoryLimit`
- `--isolate` is now `--poolOptions.<pool-name>.isolate` and `browser.isolate`
- `test.maxThreads` is now `test.poolOptions.<pool-name>.maxThreads`
- `test.minThreads` is now `test.poolOptions.<pool-name>.minThreads`
- `test.useAtomics` is now `test.poolOptions.<pool-name>.useAtomics`
- `test.poolMatchGlobs.child_process` is now `test.poolMatchGlobs.forks`
- `test.poolMatchGlobs.experimentalVmThreads` is now `test.poolMatchGlobs.vmThreads`

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

### Changes to Coverage [#4265](https://github.com/vitest-dev/vitest/pull/4265), [#4442](https://github.com/vitest-dev/vitest/pull/4442)

Option `coverage.all` is now enabled by default. This means that all project files matching `coverage.include` pattern will be processed even if they are not executed.

Coverage thresholds API's shape was changed, and it now supports specifying thresholds for specific files using glob patterns:

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

### Mock Types [#4400](https://github.com/vitest-dev/vitest/pull/4400)

A few types were removed in favor of Jest-style "Mock" naming.

```diff
- import { EnhancedSpy, SpyInstance } from 'vitest'
+ import { MockInstance } from 'vitest'
```

::: warning
`SpyInstance` is deprecated in favor of `MockInstance` and will be removed in the next major release.
:::


### Timer mocks [#3925](https://github.com/vitest-dev/vitest/pull/3925)

`vi.useFakeTimers()` no longer automatically mocks [`process.nextTick`](https://nodejs.org/api/process.html#processnexttickcallback-args).
It's still possible to mock `process.nextTick` by explicitly specifying it by using `vi.useFakeTimers({ toFake: ['nextTick'] })`.

However, mocking `process.nextTick` is not possible when using `--pool=forks`. Use a different `--pool` option if you need `process.nextTick` mocking.

## Migrating from Jest
>>>>>>> 7fd5ce3a13bc12f3308d6dc2c074d3ed95c30715

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
