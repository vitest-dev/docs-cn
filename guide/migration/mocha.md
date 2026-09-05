---
title: 从 Mocha + Chai + Sinon 迁移 | 指南
outline: deep
---

## 从 Mocha + Chai + Sinon 迁移 {#mocha-chai-sinon}

Vitest 对从 Mocha+Chai+Sinon 测试套件迁移提供了完善支持。虽然 Vitest 默认使用与 Jest 兼容的 API，但它同时也提供 Chai 风格的断言用于 spy/mock 测试，从而降低迁移成本。

### 测试结构 {#test-structure}

Mocha 与 Vitest 的测试结构相似，但存在一些差异：

```ts
// Mocha
describe('suite', () => {
  before(() => { /* 初始化 */ })
  after(() => { /* 清理 */ })
  beforeEach(() => { /* 初始化 */ })
  afterEach(() => { /* 清理 */ })

  it('test', () => {
    // 测试代码
  })
})

// Vitest - 相同的结构同样适用！
import { afterAll, afterEach, beforeAll, beforeEach, describe, it } from 'vitest'

describe('suite', () => {
  beforeAll(() => { /* 初始化 */ })
  afterAll(() => { /* 清理 */ })
  beforeEach(() => { /* 初始化 */ })
  afterEach(() => { /* 清理 */ })

  it('test', () => {
    // 测试代码
  })
})
```

### 断言 {#assertions}

Vitest 默认内置 Chai 断言，因此 Chai 断言无需任何修改即可使用：

```ts
// Mocha+Chai 与 Vitest 均适用
import { expect } from 'vitest' // 或在 Mocha 中导入 'chai'

expect(value).to.equal(42)
expect(value).to.be.true
expect(array).to.have.lengthOf(3)
expect(obj).to.have.property('key')
```

### Spy/Mock 断言 {#spy-mock-assertions}

Vitest 为 spy 和 mock 提供 **Chai 风格** 的断言，让你无需重写断言即可从 Sinon 迁移：

```ts
// 迁移前（Mocha + Chai + Sinon）
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const spy = sinon.spy(obj, 'method')
obj.method('arg1', 'arg2')

expect(spy).to.have.been.called
expect(spy).to.have.been.calledOnce
expect(spy).to.have.been.calledWith('arg1', 'arg2')

// 迁移后（Vitest）- 断言语法完全相同！
import { expect, vi } from 'vitest'

const spy = vi.spyOn(obj, 'method')
obj.method('arg1', 'arg2')

expect(spy).to.have.been.called
expect(spy).to.have.been.calledOnce
expect(spy).to.have.been.calledWith('arg1', 'arg2')
```

#### 完整的 Chai 风格断言支持 {#complete-chai-style-assertion-support}

Vitest supports all common sinon-chai assertions:

| Sinon-Chai                | Vitest                | 详情                         |
| ------------------------- | --------------------- | ---------------------------- |
| `spy.called`              | `called`              | Spy 至少被调用过一次         |
| `spy.calledOnce`          | `calledOnce`          | Spy 恰好被调用过一次         |
| `spy.calledTwice`         | `calledTwice`         | Spy 恰好被调用过两次         |
| `spy.calledThrice`        | `calledThrice`        | Spy 恰好被调用过三次         |
| `spy.callCount(n)`        | `callCount(n)`        | Spy 被调用过 n 次            |
| `spy.calledWith(...)`     | `calledWith(...)`     | Spy 以特定参数被调用         |
| `spy.calledOnceWith(...)` | `calledOnceWith(...)` | Spy 以特定参数恰好被调用一次 |
| `spy.returned(value)`     | `returned`            | Spy 返回了特定值             |

更多内容请参阅 [Chai 风格 Spy 断言](/api/expect#chai-style-spy-assertions) 文档中的完整列表。

### 创建 Spy 和 Mock {#creating-spies-and-mocks}

用 Vitest 的 `vi` 工具替换 Sinon 的 spy/stub/mock 创建方式：

```ts
// Sinon
const sinon = require('sinon')
const spy = sinon.spy()
const stub = sinon.stub(obj, 'method')
const mock = sinon.mock(obj)

// Vitest
import { vi } from 'vitest'
const spy = vi.fn()
const stub = vi.spyOn(obj, 'method')
// Vitest 没有 "mock" 的概念，请使用 spy 代替
```

### 存根返回值 {#stubbing-return-values}

```ts
// Sinon
stub.returns(42)
stub.onFirstCall().returns(1)
stub.onSecondCall().returns(2)

// Vitest
stub.mockReturnValue(42)
stub.mockReturnValueOnce(1)
stub.mockReturnValueOnce(2)
```

### 存根实现 {#stubbing-implementations}

```ts
// Sinon
stub.callsFake(arg => arg * 2)

// Vitest
stub.mockImplementation(arg => arg * 2)
```

### 恢复 Spy {#restoring-spies}

```ts
// Sinon
spy.restore()
sinon.restore() // 恢复全部

// Vitest
spy.mockRestore()
vi.restoreAllMocks() // 恢复全部
```

### 定时器 {#timers-1}

Sinon 和 Vitest 在内部都使用 `@sinonjs/fake-timers`：

```ts
// Sinon
const clock = sinon.useFakeTimers()
clock.tick(1000)
clock.restore()

// Vitest
import { vi } from 'vitest'
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
vi.useRealTimers()
```

### 主要差异 {#key-differences}

1. **全局变量**：Mocha 默认提供全局变量。在 Vitest 中，需要从 `vitest` 导入，或启用 [`globals`](/config/globals) 配置。
2. **断言风格**：可同时使用 Chai 风格（`expect(spy).to.have.been.called`）和 Jest 风格（`expect(spy).toHaveBeenCalled()`）。
3. **并发执行**：Vitest 默认并发运行测试，Mocha 则顺序执行。

更多内容请参阅：

- [Chai 风格 Spy 断言](/api/expect#chai-style-spy-assertions)
- [Mocking 指南](/guide/mocking)
- [Vi API](/api/vi)
