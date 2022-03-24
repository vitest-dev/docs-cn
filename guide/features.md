# 特性

<FeaturesList class="!gap-1 text-lg" />

## 一套配置可以运用在多种环境

Vite 的配置、转换器、解析器和插件，将会使用应用程序中的相同设置来运行测试。

## 浏览模式

智能检测和即时浏览模式, [像用于测试的 HMR ！](https://twitter.com/antfu7/status/1468233216939245579)

```bash
$ vitest -w
```

Vitest 智能地搜索模块并仅仅只是重新运行相关测试（就像 HMR 在 Vite 中的工作方式一样！）。

`vitest`、`vitest dev` 和 `vitest watch` 是别名，默认情况下它们都以 watch 模式启动 vitest。它们还依赖于 `CI` 环境变量，如果它已定义，Vitest 将只运行一次测试，而不是像 `vitest run` 那样在浏览模式下运行。


## 与 UI 框架的平滑集成

平滑集成了 Vue、React、Lit 等框架的测试套件测试

## 开箱即用的常见 Web 支持

开箱即用的 TypeScript / JSX 支持 / PostCSS

## 优先 ESM

优先 ESM， 顶级的 await

## 线程

通过 [tinypool](https://github.com/Aslemammad/tinypool) 使用 Worker 线程尽可能多地并发运行 （ [Piscina](https://github.com/piscinajs/piscina) 的轻量级分支）， 允许测试同时运行。 线程默认启用 Vitest，并且可以通过 CLI 中的 `--no-threads` 禁用。

Vitest 还隔离了每个文件的环境，因此一个文件中的 env 改变不会影响其他文件。 可以通过将 `--no-isolate` 传递给 CLI 来禁用隔离（以正确性换取运行性能）。

## 过滤

测试套件和测试的过滤、超时、并发

### CLI

可以使用 CLI 按名称过滤测试文件：

```bash
$ vitest basic
```

只能执行包含 `basic` 的测试文件，例如

```
basic.test.ts
basic-foo.test.ts
```

### 指定超时

可以选择以毫秒为单位将超时作为第三个参数传递给测试。默认值为 5 秒。

```ts
import { test } from 'vitest'

test('name', async () => { ... }, 1000)
```

Hooks 也可以接收超时，默认值为 5 秒。

```ts
import { beforeAll } from 'vitest'

beforeAll(async () => { ... }, 1000)
```

### 省略测试套件和测试

使用 `.skip` 别名 `it` 来避免运行某些测试套件或测试。

```ts
import { describe, assert, it } from 'vitest';

describe.skip("skipped suite", () => {
  it("test", () => {
    // 测试套件已跳过，没有错误
    assert.equal(Math.sqrt(4), 3);
  });
});

describe("suite", () => {
  it.skip("skipped test", () => {
    // 测试跳过，没有错误
    assert.equal(Math.sqrt(4), 3);
  });
});
```

### 选择要运行的测试套件和测试

使用 `.only` 仅运行某些测试套件或测试。

```ts
import { describe, assert, it } from 'vitest'

// 仅运行此测试套件（以及仅标有的其他测试套件）
describe.only("suite", () => {
  it("test", () => {
    assert.equal(Math.sqrt(4), 3);
  });
});

describe("another suite", () => {
  it("skipped test", () => {
    // 测试已跳过，因为测试在 Only 模式下运行
    assert.equal(Math.sqrt(4), 3);
  });

  it.only("test", () => {
    // 仅运行此测试（以及仅标记有的其他测试）
    assert.equal(Math.sqrt(4), 2);
  });
});
```

### 未实现的测试套件和测试

使用 `.todo` 记录应该实现的测试套件和测试

```ts
import { describe, it } from 'vitest'

// 该测试套件的报告中将显示一个条目
describe.todo("unimplemented suite");

// 此测试的报告中将显示一个条目
describe("suite", () => {
  it.todo("unimplemented test");
});
```

## 同时运行测试

在连续测试中使用 `.concurrent` 将会并发运行它们。

```ts
import { describe, it } from 'vitest'

// 标有并发的两个测试将并发运行
describe("suite", () => {
  it("serial test", async () => { /* ... */ });
  it.concurrent("concurrent test 1", async () => { /* ... */ });
  it.concurrent("concurrent test 2", async () => { /* ... */ });
});
```

如果在测试套件中使用 `.concurrent`，则其中的每个测试都将并发运行。

```ts
import { describe, it } from 'vitest'

// 该测试套件中的所有测试都将并行运行
describe.concurrent("suite", () => {
  it("concurrent test 1", async () => { /* ... */ });
  it("concurrent test 2", async () => { /* ... */ });
  it.concurrent("concurrent test 3", async () => { /* ... */ });
});
```

您还可以将 `.skip`、`.only` 和 `.todo` 用于并发测试套件和测试。 在 [API 参考](../api/#concurrent) 中阅读更多信息。

## 快照

[Jest Snapshot](https://jestjs.io/zh-Hans/docs/snapshot-testing) 支持

## Chai 和 Jest 期望兼容性

[Chai](https://www.chaijs.com/) 内置断言和 [Jest expect](https://jestjs.io/docs/expect) 期望兼容的 API

注意，如果要使用添加匹配器的第三方库，将 `test.globals` 设置为 `true` 将提供更好的兼容性。

## 模拟

内置 [Tinyspy](https://github.com/Aslemammad/tinyspy) 用于在 `vi` 对象上使用 `jest` 兼容的 API 进行模拟。

```ts
import { vi, expect } from 'vitest'

const fn = vi.fn()

fn('hello', 1)

expect(vi.isMockFunction(fn)).toBe(true)
expect(fn.mock.calls[0]).toEqual(['hello', 1])

fn.mockImplementation((arg) => arg)

fn('world', 2)

expect(fn.mock.returns[1]).toBe('world')
```

Vitest 支持 [happy-dom](https://github.com/capricorn86/happy-dom) 或 [jsdom](https://github.com/jsdom/jsdom) 来模拟 DOM 和浏览器 API。它们不附带 Vitest ，您可能需要安装它们：

```bash
$ npm i -D happy-dom
# 或
$ npm i -D jsdom
```

之后，更改 `environment` 配置文件中的选项：

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom' // 或 'jsdom', 'node'
  }
})
```

## 覆盖率

Vitest 通过 [c8](https://github.com/bcoe/c8) 支持 Native 代码覆盖

```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

要配置它，请在配置文件中设置 `test.coverage` 选项：


```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
})
```
