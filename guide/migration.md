# 迁移指南

<DevelopmentWarning/>

## 从 Jest 迁移

Vitest 设计了与 Jest 兼容的 API，以使从 Jest 的迁移尽可能简单。尽管做出了这些努力，我们仍然可能会遇到以下差异：

**全局变量作为默认值**

Jest 默认使用[全局 API](https://jestjs.io/zh-Hans/docs/api)。然而 Vitest 没有，我们可以通过配置[启用全局变量 `globals`](/config/#globals) 或更新您的代码以使用来自 `vitest` 模块的导入。

如果您决定禁用全局变量，请注意像这样的通用库 [`testing-library`](https://testing-library.com/) 不会运行 auto DOM [cleanup](https://testing-library.com/docs/svelte-testing-library/api/#cleanup)。

**自动模拟**

与 Jest 中 `<root>/__mocks__` 不同的是，除非 `vi.mock()` 被调用，否则不会加载其中的模拟模块。如果我们需要在每个测试中模拟它们，例如在 Jest [`setupFiles`](/config/#setupfiles)。

**Jasmine API**

Jest 导出各种 [`jasmine`](https://jasmine.github.io/) 全局变量（例如`jasmine.any()`）。任何此类实例都需要迁移到 [Vitest 对应对象](/api/)。

**测试环境**

就像 Jest 一样，Vitest 设置 `NODE_ENV` 进行测试，如果之前没有设置的话。 Vitest 也有一个 `JEST_WORKER_ID` 的对应项，称为 `VITEST_WORKER_ID`，所以如果你依赖它，不要忘记重命名它。
