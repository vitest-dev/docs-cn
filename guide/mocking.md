---
title: 模拟对象 | 指南
outline: false
---

# 模拟对象 {#mocking}

在编写测试时，迟早会需要创建一个内部或外部服务的 "fake" 版本。这通常被称为**mocking**。Vitest 通过其 `vi` 辅助工具提供了实用函数来帮助您。我们可以从 `vitest` 中导入它，或者如果启用了 [`global` 配置](/config/#globals)，也可以全局访问它。

::: warning
不要忘记在每次测试运行前后清除或恢复模拟对象，以撤消运行测试时模拟对象状态的更改！有关更多信息，请参阅 [`mockReset`](/api/mock.html#mockreset) 文档。
:::

如果你不熟悉 `vi.fn`、`vi.mock` 或 `vi.spyOn` 方法，请先查看[API部分](/api/vi)。

Vitest has a comprehensive list of guides regarding mocking:

- [Mocking Classes](/guide/mocking/classes.md)
- [Mocking Dates](/guide/mocking/dates.md)
- [Mocking the File System](/guide/mocking/file-system.md)
- [Mocking Functions](/guide/mocking/functions.md)
- [Mocking Globals](/guide/mocking/globals.md)
- [Mocking Modules](/guide/mocking/modules.md)
- [Mocking Requests](/guide/mocking/requests.md)
- [Mocking Timers](/guide/mocking/timers.md)

为了更简单快捷地开始使用模拟，你可以查看下面的备忘单。

## 备忘单 {#cheat-sheet}

I want to…

### Mock exported variables
```js [example.js]
export const getter = 'variable'
```
```ts [example.test.ts]
import * as exports from './example.js'

vi.spyOn(exports, 'getter', 'get').mockReturnValue('mocked')
```

::: warning
此方法在浏览器模式中无法使用。如需替代方案，请查看 [限制部分](/guide/browser/#spying-on-module-exports)。
:::

### 对模块中导出的函数进行 mock。{#mock-an-exported-function}

```ts
import * as exports from 'some-path'
vi.spyOn(exports, 'getter', 'get')
vi.spyOn(exports, 'setter', 'set')
```

### 模拟模块导出函数 {#mock-an-exported-class-implementation}

1. `vi.mock` 的示例：

::: warning
不要忘记将 `vi.mock` 调用提升到文件顶部。它将始终在所有导入之前执行。
:::

```ts [example.js]
export function method() {}
```

```ts
import { method } from './example.js'

vi.mock('./example.js', () => ({
  method: vi.fn()
}))
```

2. `vi.spyOn` 的示例：

```ts
import * as exports from './example.js'

vi.spyOn(exports, 'method').mockImplementation(() => {})
```

::: warning
`vi.spyOn` 示例在浏览器模式中无法使用。如需替代方案，请查看 [限制部分](/guide/browser/#spying-on-module-exports)。
:::

### `vi.mock` 和 `.prototype` 的示例:

1. 一个使用假 class 的示例：
```ts [example.js]
export class SomeClass {}
```
```ts
import { SomeClass } from './example.js'

vi.mock(import('./example.js'), () => {
  const SomeClass = vi.fn(class FakeClass {
    someMethod = vi.fn()
  })
  return { SomeClass }
})
```

2. Example with `vi.spyOn`:

```ts
import * as mod from './example.js'

vi.spyOn(mod, 'SomeClass').mockImplementation(class FakeClass {
  someMethod = vi.fn()
})
```

::: warning
vi.spyOn 的示例无法在浏览器模式中正常使用。如需替代方案，请查看 [限制部分](/guide/browser/#spying-on-module-exports)。
:::

### 监听一个函数是否返回了一个对象 {#spy-on-an-object-returned-from-a-function}

1. 使用 cache 的示例:

```ts [example.js]
export function useObject() {
  return { method: () => true }
}
```

```ts [useObject.js]
import { useObject } from './example.js'

const obj = useObject()
obj.method()
```

```ts [useObject.test.js]
import { useObject } from './example.js'

vi.mock(import('./example.js'), () => {
  let _cache
  const useObject = () => {
    if (!_cache) {
      _cache = {
        method: vi.fn(),
      }
    }
    // 现在每次调用 useObject() 后，都会
    // 返回相同的对象引用
    return _cache
  }
  return { useObject }
})

const obj = useObject()
// obj.method 在 some-path 内调用
expect(obj.method).toHaveBeenCalled()
```

### 模拟部分 module {#mock-part-of-a-module}

```ts
import { mocked, original } from './some-path.js'

vi.mock(import('./some-path.js'), async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    mocked: vi.fn(),
  }
})
original() // 有原始的行为
mocked() // 是一个 spy 函数
```

::: warning
别忘了，这只是 [mocks _external_ access](#mocking-pitfalls)。在本例中，如果 `original` 在内部调用 `mocked`，它将始终调用模块中定义的函数，而不是 mock 工厂中的函数。
:::

### 模拟当前日期 {#mock-the-current-date}

要模拟 `Date` 的时间，你可以使用 `vi.setSystemTime` 辅助函数。 该值将**不会**在不同的测试之间自动重置。

请注意，使用 `vi.useFakeTimers` 也会更改 `Date` 的时间。

```ts
const mockDate = new Date(2022, 0, 1)
vi.setSystemTime(mockDate)
const now = new Date()
expect(now.valueOf()).toBe(mockDate.valueOf())
// 重置模拟的时间
vi.useRealTimers()
```

### 模拟全局变量 {#mock-a-global-variable}

你可以通过为 `globalThis` 赋值或使用 [`vi.stubGlobal`](/api/vi#vi-stubglobal) 助手来设置全局变量。 使用 `vi.stubGlobal` 时，**不会**在不同的测试之间自动重置，除非你启用 [`unstubGlobals`](/config/#unstubglobals) 配置选项或调用 [`vi.unstubAllGlobals`](/api/vi#vi-unstuballglobals)。

```ts
vi.stubGlobal('__VERSION__', '1.0.0')
expect(__VERSION__).toBe('1.0.0')
```

### 模拟 `import.meta.env` {#mock-import-meta-env}

1. 要更改环境变量，你只需为其分配一个新值即可。 该值将**不会**在不同的测试之间自动重置。

::: warning
环境变量值将在不同的测试之间**不会**自动重置。
:::

```ts
import { beforeEach, expect, it } from 'vitest'

// 你可以在 beforeEach 钩子里手动重置
const originalViteEnv = import.meta.env.VITE_ENV

beforeEach(() => {
  import.meta.env.VITE_ENV = originalViteEnv
})

it('changes value', () => {
  import.meta.env.VITE_ENV = 'staging'
  expect(import.meta.env.VITE_ENV).toBe('staging')
})
```

2. 如果你想自动重置值，可以使用启用了 [`unstubEnvs`](/config/#unstubEnvs) 配置选项的 `vi.stubEnv` 助手（或调用 [`vi.unstubAllEnvs`](/api/vi#vi-unstuballenvs) 在 `beforeEach` 钩子中手动执行）：

```ts
import { expect, it, vi } from 'vitest'

// 在运行测试之前， "VITE_ENV" 的值是 "test"
import.meta.env.VITE_ENV === 'test'

it('changes value', () => {
  vi.stubEnv('VITE_ENV', 'staging')
  expect(import.meta.env.VITE_ENV).toBe('staging')
})

it('the value is restored before running an other test', () => {
  expect(import.meta.env.VITE_ENV).toBe('test')
})
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    unstubEnvs: true,
  },
})
```
