---
title: Migration Guide | Guide
---

# 迁移指南

## 从 Jest 迁移

Vitest 设计了与 Jest 兼容的 API ，方便你从 Jest 的迁移尽可能简单。尽管做出了这些努力，你仍然可能会遇到以下差异：

**全局变量作为默认值**

Jest 默认启用[全局 API](https://jestjs.io/zh-Hans/docs/api)。然而 Vitest 没有。你既可以通过 [`globals` 配置选项](/config/#globals)启用全局 API，也可以通过更新你的代码以便使用来自 `vitest` 模块的导入。

如果你决定禁用全局 API，请注意像 [`testing-library`](https://testing-library.com/) 这样的通用库不会自动运行 DOM [cleanup](https://testing-library.com/docs/svelte-testing-library/api/#cleanup)。

**模拟模块**

在 Jest 中模拟一个模块时，工厂参数的返回值是默认导出。在 Vitest 中，工厂参数必须返回一个明确定义了每个导出的对象。例如，下面的 `jest.mock` 必须更新如下：

```diff
- jest.mock('./some-path', () => 'hello')
+ vi.mock('./some-path', () => ({
+   default: 'hello',
+ })
```

有关更深入的详细描述，请参阅 [vi.mock api](/api/#vi-mock)。

**自动模拟行为**

区别于 Jest，在 `<root>/__mocks__` 中的模拟模块只有在 `vi.mock()` 被调用时才会加载。如果你需要它们像在 Jest 中一样，在每个测试中都被模拟，你可以在 [`setupFiles`](/config/#setupfiles) 中模拟它们。

**Jasmine API**

Jest 导出各种 [`jasmine`](https://jasmine.github.io/) 全局 API (例如 `jasmine.any()` )。任何此类实例都需要迁移成 [Vitest 的对应 API ](/api/)。

**测试环境**

如果之前没有设置，Vitest 会像 Jest 一样，把 `NODE_ENV` 设置为 `test`。 Vitest 也有一个 `JEST_WORKER_ID` 的对应项，是 `VITEST_WORKER_ID`，所以如果你依赖它，不要忘记重命名它。

**回调**

从 Vitest v0.10.0 开始，声明测试的回调样式被弃用。 你可以重写它们以使用 `async`/`await` 函数，或者使用 Promise 来模仿回调样式。

```diff
- it('should work', (done) => {
+ it('should work', () => new Promise(done => {
    // ...
    done()
- })
+ }))
```

**钩子**

`beforeAll`/`beforeEach` 钩子可能在 Vitest 的 [teardown 函数](/api/#setup-and-teardown)中返回。因此，如果它们返回的不是 `undefined` 或 `null`，你可能需要重写你的钩子声明：

```diff
- beforeEach(() => setActivePinia(createTestingPinia()))
+ beforeEach(() => { setActivePinia(createTestingPinia()) })
```

**类型**

Vitest 没有在 `Vi` 命名空间上导出很多类型，它的存在主要是为了与匹配器兼容，因此你可能需要直接从 `vitest` 导入类型，而不是依赖 `Vi` 命名空间：

```diff
- let fn: jest.Mock<string, [string]>
+ import type { Mock } from 'vitest'
+ let fn: Mock<[string], string>
```

此外，Vitest 将 `Args` 类型作为第一个参数，而不是 `Returns`，正如你在 diff 中看到的那样。

**定时器**

Vitest 不支持 jest 的传统计时器。

**Vue 快照**

如果你以前在 vue-cli preset 中使用 Jest，那么这不是一个 Jest 独有的新特性。你可能需要安装 [`jest-serializer-vue`](https://github.com/eddyerburgh/jest-serializer-vue) 包，然后在 [setupFiles](/config/#setupfiles) 中配置：

`vite.config.js`

```js
import { defineConfig } from 'vite'
export default defineConfig({
  test: {
    setupFiles: ['./tests/unit/setup.js']
  }
})
```

`tests/unit/setup.js`

```js
import vueSnapshotSerializer from 'jest-serializer-vue'
expect.addSnapshotSerializer(vueSnapshotSerializer)
```

否则你的快照将出现大量的 `"` 字符。
