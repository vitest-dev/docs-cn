---
outline: deep
---

# 特性

<FeaturesList class="!gap-1 text-lg" />

## 一套配置可以运用在多种环境

与 Vite 的配置、转换器、解析器和插件通用，将会使用应用程序中的相同配置来运行测试。

了解更多信息 [Configuring Vitest](/guide/#configuring-vitest)

## 监听模式(watch mode)

```bash
$ vitest
```

当你修改源代码或测试文件时，Vitest 智能搜索模块依赖树并只重新运行相关测试，[just like how HMR works in Vite!](https://twitter.com/antfu7/status/1468233216939245579)

`vitest` **在开发环境下默认** 启动时使用 `监听模式`，在 CI 环境（当 `process.env.CI` 出现时）中以 `运行模式(run mode)` 启动。你可以使用 `vitest watch` 或 `vitest run` 明确指定所需的模式。

## 开箱即用的常见 Web 支持

开箱即用的 ES Module / TypeScript / JSX support / PostCSS

## 多线程

通过 [tinypool](https://github.com/Aslemammad/tinypool) 使用 Worker 线程尽可能多地并发运行（ [Piscina](https://github.com/piscinajs/piscina) 的轻量级分支），允许多个测试同时运行。Vitest 默认启动多线程，可以通过 CLI 中的 `--no-threads` 禁用。

Vitest 还隔离了每个测试文件的运行环境，因此一个文件中的运行环境改变不会影响其他文件。可以通过将 `--no-isolate` 传递给 CLI 来禁用隔离（以正确性换取运行性能）。

## 测试可过滤

Vitest 提供了许多缩小测试范围的方法，以便在开发过程中加快速度并集中精力。

了解更多信息 [筛选测试](./filtering.md)

## 同时运行多个测试

在连续测试中使用 `.concurrent` 将会并发运行它们。

```ts
import { describe, it } from 'vitest'
// The two tests marked with concurrent will be run in parallel
describe('suite', () => {
  it('serial test', async () => { /* ... */ })
  it.concurrent('concurrent test 1', async () => { /* ... */ })
  it.concurrent('concurrent test 2', async () => { /* ... */ })
})
```

如果在测试套件中使用 `.concurrent`，则其中的每个测试用例都将并发运行。

```ts
import { describe, it } from 'vitest'
// All tests within this suite will be run in parallel
describe.concurrent('suite', () => {
  it('concurrent test 1', async () => { /* ... */ })
  it('concurrent test 2', async () => { /* ... */ })
  it.concurrent('concurrent test 3', async () => { /* ... */ })
})
```

您还可以将 `.skip`、`.only` 和 `.todo` 用于并发测试套件和测试用例。了解更多信息 [API 参考](../api/#concurrent)

## 快照

兼容 [Jest 快照测试](https://jestjs.io/zh-Hans/docs/snapshot-testing) 功能。

```ts
import { expect, it } from 'vitest'
it('renders correctly', () => {
  const result = render()
  expect(result).toMatchSnapshot()
})
```

了解更多信息 [快照](/guide/snapshot)

## Chai 和 Jest 的 expect 语法兼容

内置 [Chai](https://www.chaijs.com/) 进行断言和与 [Jest expect](https://jestjs.io/docs/expect) 兼容的 APIs

注意，如果你正在使用添加匹配器的第三方库，将 `test.globals` 设置为 `true` 将提供更好的兼容性。

## 对象模拟(Mocking)

内置 [Tinyspy](https://github.com/Aslemammad/tinyspy) 用于在 `vi` 对象上使用 `jest` 兼容的 API 进行对象模拟。

```ts
import { expect, vi } from 'vitest'
const fn = vi.fn()
fn('hello', 1)
expect(vi.isMockFunction(fn)).toBe(true)
expect(fn.mock.calls[0]).toEqual(['hello', 1])
fn.mockImplementation(arg => arg)
fn('world', 2)
expect(fn.mock.results[1].value).toBe('world')
```

Vitest 支持 [happy-dom](https://github.com/capricorn86/happy-dom) 或 [jsdom](https://github.com/jsdom/jsdom) 来模拟 DOM 和浏览器 API。Vitest 并不内置它们，所以您可能需要安装：

```bash
$ npm i -D happy-dom
# or
$ npm i -D jsdom
```

然后，更改 `environment` 配置文件中的选项：

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'happy-dom', // or 'jsdom', 'node'
  },
})
```

了解更多信息 [对象模拟](/guide/mocking)

## 覆盖率

Vitest 通过 [c8](https://github.com/bcoe/c8) 来输出代码测试覆盖率。

```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

可以在配置文件中设置 `test.coverage` 选项来配置它：

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

## 源码内联测试

Vitest 还提供了一种方式，可以运行与你的代码实现放在一起的测试，类似 [Rust's module tests](https://doc.rust-lang.org/book/ch11-03-test-organization.html#the-tests-module-and-cfgtest).

这使得测试与实现共享相同的闭包，并且能够在不导出的情况下针对私有状态进行测试。同时，它也使开发更加接近反馈循环。

```ts
// src/index.ts
// the implementation
export function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0)
}
// in-source test suites
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(add()).toBe(0)
    expect(add(1)).toBe(1)
    expect(add(1, 2, 3)).toBe(6)
  })
}
```

了解更多信息 [源码内联测试](/guide/in-source)
