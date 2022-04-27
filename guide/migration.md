# 迁移指南

## 从 Jest 迁移

Vitest 设计了与 Jest 兼容的 API ，以使从 Jest 的迁移尽可能简单。尽管做出了这些努力，你仍然可能会遇到以下差异：

**全局变量作为默认值**

Jest 默认启用[全局 API](https://jestjs.io/zh-Hans/docs/api)。然而 Vitest 没有。你既可以通过 [`globals` 配置选项](/config/#globals)启用全局 API，也可以更新你的代码以使用来自 `vitest` 模块的导入。

如果你决定禁用全局 API，请注意像 [`testing-library`](https://testing-library.com/) 这样的通用库不会运行 auto DOM [cleanup](https://testing-library.com/docs/svelte-testing-library/api/#cleanup)。

**自动模拟**

区别于 Jest，在 `<root>/__mocks__` 中的模拟模块只有在 `vi.mock()` 被调用时才会加载。如果你需要它们像在 Jest 中一样，在每个测试中都被模拟，你可以在 [`setupFiles`](/config/#setupfiles) 中模拟它们。

**Jasmine API**

Jest 导出各种 [`jasmine`](https://jasmine.github.io/) 全局 API (例如 `jasmine.any()` )。任何此类实例都需要迁移成 [Vitest 的对应项](/api/)。

**测试环境**

如果之前没有设置，Vitest 会像 Jest 一样，把 `NODE_ENV` 设置为 `test`。 Vitest 也有一个 `JEST_WORKER_ID` 的对应项，是 `VITEST_WORKER_ID`，所以如果你依赖它，不要忘记重命名它。

**Done Callback**

From Vitest v0.10.0, the callback style of declaring tests is deprecated. You can rewrite them to use `async`/`await` functions, or use Promise to mimic the callback style.

```diff
- it('should work', (done) => {
+ it('should work', () => new Promise(done => {
    // ...
    done()
- })
+ }))
```
