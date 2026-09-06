# 模拟全局对象 {#mocking-globals}

你可以使用 [`vi.stubGlobal`](/api/vi#vi-stubglobal) 助手来模拟 `jsdom` 或 `node` 中不存在的全局变量。它会将全局变量的值放入 `globalThis` 对象中。

默认情况下，Vitest 不会重置这些全局变量，但你可以在配置中开启 [`unstubGlobals`](/config/unstubglobals) 选项，以便在每次测试后恢复原始值，或者手动调用 [`vi.unstubAllGlobals()`](/api/vi#vi-unstuballglobals)。

```ts
import { vi } from 'vitest'

const IntersectionObserverMock = vi.fn(class {
  disconnect = vi.fn()
  observe = vi.fn()
  takeRecords = vi.fn()
  unobserve = vi.fn()
})

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// 现在你可以通过 `IntersectionObserver` 或 `window.IntersectionObserver` 来访问它
```
