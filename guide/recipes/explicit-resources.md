---
title: 使用 `using` 自动清理 | 技巧
---

# 使用 `using` 自动清理 {#auto-cleanup-with-using}

测试中创建的 spy 和 mock 需要在测试结束后恢复，否则状态会泄漏到其他测试。常见做法是在测试套件层级使用 `afterEach(() => vi.restoreAllMocks())`，或者在每个测试中内联调用 [`onTestFinished(() => spy.mockRestore())`](/api/hooks#ontestfinished)。

如果运行时支持 [显式资源管理](https://github.com/tc39/proposal-explicit-resource-management)（Node.js 24 及以上版本，或在现代打包工具中使用 TypeScript 5.2 及以上版本），还可以采用更简洁的方式：使用 `using` 而不是 `const` 声明 spy。退出代码块时，spy 会自动恢复。

此方式适用于 [`vi.spyOn`](/api/vi#vi-spyon)、[`vi.fn`](/api/vi#vi-fn) 和 [`vi.doMock`](/api/vi#vi-domock)。<Version>3.2.0</Version>

## 用法 {#pattern}

```ts
import { expect, it, vi } from 'vitest'

function debug(message: string) {
  console.log(message)
}

it('calls console.log', () => {
  using spy = vi.spyOn(console, 'log').mockImplementation(() => {})
  debug('message')
  expect(spy).toHaveBeenCalled()
})

// console.log 会在这里恢复，无须使用 afterEach
```

同样的用法也适用于 `vi.doMock`。它会返回一个可释放对象，并在退出作用域时自动取消模块模拟：

```ts
import { expect, it, vi } from 'vitest'

it('uses the mocked module, then the real one', async () => {
  {
    using _mock = vi.doMock('./users', () => ({
      loadUser: () => ({ id: '1', name: 'Alice' }),
    }))
    const { loadUser } = await import('./users')
    expect(loadUser('alice').name).toBe('Alice')
  }

  // 从这里开始，./users 不再处于模拟状态
})
```

## 限定于任意代码块内 {#scoped-to-any-block}

`using` 采用块级作用域，因此可以只在测试的某一部分启用 spy。`afterEach` 和 `onTestFinished` 都无法实现这一点，因为它们只能在测试结束后运行：

```ts
import { expect, it, vi } from 'vitest'

it('only mocks fetch for the auth call', async () => {
  // 此处使用真实的 fetch
  await preloadConfig()

  {
    using fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{"ok":true}'))

    await login('alice', 'secret')
    expect(fetchSpy).toHaveBeenCalledOnce()
  }

  // 恢复使用真实的 fetch
  await reportSuccess()
})
```

如果只有少数调用需要恢复，也可以采用这种方式，避免在全局配置中启用 [`restoreMocks: true`](/config/restoremocks)。

## 兼容性 {#compatibility}

使用 `using` 需要环境支持 TC39 显式资源管理提案：

- TypeScript ≥ 5.2（`target` 需设为 `'es2022'` 或更高版本，并包含默认启用的 `disposable` 库）。
- Node.js ≥ 24（也可以使用 Node.js 22+ 也可以通过启用 `--harmony` 这类选项）。

如果当前环境尚不支持，可以使用 [`onTestFinished`](/api/hooks#ontestfinished) 实现效果最接近的整项测试清理。它允许在测试中直接注册清理逻辑，并且无论测试通过还是失败，都会在测试结束后执行：

```ts
import { expect, it, onTestFinished, vi } from 'vitest'

it('calls console.log', () => {
  const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
  onTestFinished(() => spy.mockRestore())

  debug('message')
  expect(spy).toHaveBeenCalled()
})
```

`onTestFinished` 无法像 `using` 一样在测试执行过程中清理 spy，因此只有显式资源管理能够实现上述块级作用域用法。

## 相关链接 {#see-also}

- [`vi.spyOn`](/api/vi#vi-spyon)
- [`vi.fn`](/api/vi#vi-fn)
- [`vi.doMock`](/api/vi#vi-domock)
- [`onTestFinished`](/api/hooks#ontestfinished)
- [`restoreMocks`](/config/restoremocks)
- [TC39 显式资源管理提案](https://github.com/tc39/proposal-explicit-resource-management)
