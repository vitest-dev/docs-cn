---
outline: deep
---

# describe

- **别名:** `suite`

```ts
function describe(
  name: string | Function,
  body?: () => unknown,
  timeout?: number
): void
function describe(
  name: string | Function,
  options: SuiteOptions,
  body?: () => unknown,
): void
```

`describe` 用于将相关测试、基准测试分组为一个测试套件。测试套件是通过创建逻辑块来组织测试文件，使测试输出更易读，并支持通过 [生命周期钩子](/api/hooks) 实现共享的初始化/清理机制。

当在文件顶层使用 `test` 时，这些测试会被自动归集为该文件的隐式套件的一部分。使用 `describe` 可以在当前上下文中定义一个新的测试套件，该套件由一组相关的测试、基准测试或其他嵌套测试套件组成。

```ts [basic.spec.ts]
import { describe, expect, test } from 'vitest'

const person = {
  isActive: true,
  age: 32,
}

describe('person', () => {
  test('person is defined', () => {
    expect(person).toBeDefined()
  })

  test('is active', () => {
    expect(person.isActive).toBeTruthy()
  })

  test('age limit', () => {
    expect(person.age).toBeLessThanOrEqual(32)
  })
})
```

还可以通过嵌套的 `describe` 代码块来构建层级化的测试结构：

```ts
import { describe, expect, test } from 'vitest'

function numberToCurrency(value: number | string) {
  if (typeof value !== 'number') {
    throw new TypeError('Value must be a number')
  }

  return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

describe('numberToCurrency', () => {
  describe('given an invalid number', () => {
    test('composed of non-numbers to throw error', () => {
      expect(() => numberToCurrency('abc')).toThrow()
    })
  })

  describe('given a valid number', () => {
    test('returns the correct currency format', () => {
      expect(numberToCurrency(10000)).toBe('10,000.00')
    })
  })
})
```

## 测试参数 {#test-options}

可以通过 [测试参数](/api/test#test-options) 为套件内的所有测试（包括嵌套测试套件）统一配置参数。适用于为相关测试组设置超时、重试次数或其他配置参数。

```ts
import { describe, test } from 'vitest'

describe('slow tests', { timeout: 10_000 }, () => {
  test('test 1', () => { /* ... */ })
  test('test 2', () => { /* ... */ })

  // 嵌套的测试套件同样会继承父级测试套件的超时配置
  describe('nested', () => {
    test('test 3', () => { /* ... */ })
  })
})
```

### `shuffle`

- **类型:** `boolean`
- **默认值:** `false` (configured by [`sequence.shuffle`](/config/sequence#sequence-shuffle))
- **别名:** [`describe.shuffle`](#describe-shuffle)

以随机顺序执行测试套件内的测试。该配置选项会被嵌套测试套件继承。

```ts
import { describe, test } from 'vitest'

describe('randomized tests', { shuffle: true }, () => {
  test('test 1', () => { /* ... */ })
  test('test 2', () => { /* ... */ })
  test('test 3', () => { /* ... */ })
})
```

## describe.skip

- **别名:** `suite.skip`

在测试套件中使用 `describe.skip` 可跳过特定的测试套件执行。

```ts
import { assert, describe, test } from 'vitest'

describe.skip('skipped suite', () => {
  test('sqrt', () => {
    // 跳过该测试套件，不报错
    assert.equal(Math.sqrt(4), 3)
  })
})
```

## describe.skipIf

- **别名:** `suite.skipIf`

在某些情况下，可能会在不同的环境下多次运行套件，而某些套件可能仅适用于特定环境。可以使用 `describe.skipIf` 在条件为真值时自动跳过该套件的执行，而不是使用 `if` 语句包裹套件。

```ts
import { describe, test } from 'vitest'

const isDev = process.env.NODE_ENV === 'development'

describe.skipIf(isDev)('prod only test suite', () => {
  // 此测试套件仅在生产环境中运行
})
```

## describe.runIf

- **别名:** `suite.runIf`

与 [describe.skipIf](#describe-skipif) 相反。

```ts
import { assert, describe, test } from 'vitest'

const isDev = process.env.NODE_ENV === 'development'

describe.runIf(isDev)('dev only test suite', () => {
  // 此测试套件仅在开发环境中运行。
})
```

## describe.only

- **别名:** `suite.only`

使用 `describe.only` 仅运行某些测试套件

```ts
import { assert, describe, test } from 'vitest'

// 只有此测试套件（以及其他标记为 `only` 的测试套件）会被运行。
describe.only('suite', () => {
  test('sqrt', () => {
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('other suite', () => {
  // 将被跳过...
})
```

有时，只运行某个文件中的测试套件，这样可以忽略整个测试套件中其他干扰输出的测试项。

为了做到这一点，只需在运行 `vitest` 时指定包含目标测试用例的文件路径：

```shell
vitest interesting.test.ts
```

## describe.concurrent

- **别名:** `suite.concurrent`

测试套件中的 `describe.concurrent` 会将所有测试标记为并发测试。

```ts
import { describe, test } from 'vitest'

// 此测试套件中的所有测试套件和测试将并行运行。
describe.concurrent('suite', () => {
  test('concurrent test 1', async () => { /* ... */ })
  describe('concurrent suite 2', async () => {
    test('concurrent test inner 1', async () => { /* ... */ })
    test('concurrent test inner 2', async () => { /* ... */ })
  })
  test.concurrent('concurrent test 3', async () => { /* ... */ })
})
```

<<<<<<< HEAD
`.skip`、`.only` 和 `.todo` 适用于并发测试套件。以下所有组合都有效：
=======
Set `concurrent` to `false` to opt out of concurrency inherited from a parent suite or [`sequence.concurrent`](/config/sequence#sequence-concurrent):

```ts
describe.concurrent('suite', () => {
  test('concurrent test', async () => { /* ... */ })

  describe('sequential suite', { concurrent: false }, () => {
    test('sequential test 1', async () => { /* ... */ })
    test('sequential test 2', async () => { /* ... */ })
  })
})
```

`.skip`, `.only`, and `.todo` works with concurrent suites. All the following combinations are valid:
>>>>>>> facf19878b9f2907f12e998709b8f4d4c2da25cc

```ts
describe.concurrent(/* ... */)
describe.skip.concurrent(/* ... */) // 或 describe.concurrent.skip(/* ... */)
describe.only.concurrent(/* ... */) // 或 describe.concurrent.only(/* ... */)
describe.todo.concurrent(/* ... */) // 或 describe.concurrent.todo(/* ... */)
```

在运行并发测试时，快照和断言必须使用本地 [测试上下文](/guide/test-context) 中的  `expect`，以确保能正确识别对应的测试用例。

```ts
describe.concurrent('suite', () => {
  test('concurrent test 1', async ({ expect }) => {
    expect(foo).toMatchSnapshot()
  })
  test('concurrent test 2', async ({ expect }) => {
    expect(foo).toMatchSnapshot()
  })
})
```

<<<<<<< HEAD
## describe.sequential

- **别名:** `suite.sequential`

测试套件中的 `describe.sequential` 会将所有测试标记为顺序执行。该特性适用于需要在 `describe.concurrent` 并发测试套件中按顺序运行测试，或使用 `--sequence.concurrent` 命令行选项。

```ts
import { describe, test } from 'vitest'

describe.concurrent('suite', () => {
  test('concurrent test 1', async () => { /* ... */ })
  test('concurrent test 2', async () => { /* ... */ })

  describe.sequential('', () => {
    test('sequential test 1', async () => { /* ... */ })
    test('sequential test 2', async () => { /* ... */ })
  })
})
```

=======
>>>>>>> facf19878b9f2907f12e998709b8f4d4c2da25cc
## describe.shuffle

- **别名:** `suite.shuffle`

Vitest 通过 CLI 标志 [`--sequence.shuffle`](/guide/cli) 或配置选项 [`sequence.shuffle`](/config/sequence#sequence-shuffle)，提供了一种以随机顺序运行所有测试的方法。但如果只想让测试套件的一部分以随机顺序运行，可以用这个标志来标记它。

```ts
import { describe, test } from 'vitest'

// 或 `describe('suite', { shuffle: true }, ...)`
describe.shuffle('suite', () => {
  test('random test 1', async () => { /* ... */ })
  test('random test 2', async () => { /* ... */ })
  test('random test 3', async () => { /* ... */ })

  // `shuffle` 是继承的
  describe('still random', () => {
    test('random 4.1', async () => { /* ... */ })
    test('random 4.2', async () => { /* ... */ })
  })

  // 禁用内部的 shuffle
  describe('not random', { shuffle: false }, () => {
    test('in order 5.1', async () => { /* ... */ })
    test('in order 5.2', async () => { /* ... */ })
  })
})
// 顺序取决于配置中的 `sequence.seed` 选项（默认为 `Date.now()`）
```

`.skip`, `.only`, and `.todo` works with random suites.

## describe.todo

- **别名:** `suite.todo`

使用 `describe.todo` 来暂存待实现的测试套件。报告中会显示这些测试的条目，以便你了解还有多少测试需要实现。

```ts
// 此测试套件将在报告中显示一个条目
describe.todo('unimplemented suite')
```

## describe.each

- **别名:** `suite.each`

::: tip
虽然 `describe.each` 是为了兼容 Jest 提供的，
但 Vitest 也有 [`describe.for`](#describe-for)，它简化了参数类型并与 [`test.for`](/api/test#test-for) 保持一致。
:::

如果我们有多个依赖于相同数据的测试，请使用 `describe.each`。

```ts
import { describe, expect, test } from 'vitest'

describe.each([
  { a: 1, b: 1, expected: 2 },
  { a: 1, b: 2, expected: 3 },
  { a: 2, b: 1, expected: 3 },
])('describe object add($a, $b)', ({ a, b, expected }) => {
  test(`returns ${expected}`, () => {
    expect(a + b).toBe(expected)
  })

  test(`returned value not be greater than ${expected}`, () => {
    expect(a + b).not.toBeGreaterThan(expected)
  })

  test(`returned value not be less than ${expected}`, () => {
    expect(a + b).not.toBeLessThan(expected)
  })
})
```

* 第一行应为列名，用 `|` 分隔；
* 使用 `${value}` 语法，以模板字面表达式的形式提供后面一行或多行数据。

```ts
import { describe, expect, test } from 'vitest'

describe.each`
  a               | b      | expected
  ${1}            | ${1}   | ${2}
  ${'a'}          | ${'b'} | ${'ab'}
  ${[]}           | ${'b'} | ${'b'}
  ${{}}           | ${'b'} | ${'[object Object]b'}
  ${{ asd: 1 }}   | ${'b'} | ${'[object Object]b'}
`('describe template string add($a, $b)', ({ a, b, expected }) => {
  test(`returns ${expected}`, () => {
    expect(a + b).toBe(expected)
  })
})
```

## describe.for

- **别名:** `suite.for`

与 `describe.each` 的区别在于数组用例在参数中的提供方式。
其他非数组情况（包括模板字符串的使用）的工作方式完全相同。

```ts
// `each` 会展开数组用例
describe.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', (a, b, expected) => { // [!code --]
  test('test', () => {
    expect(a + b).toBe(expected)
  })
})

// `for` 不会展开数组用例
describe.for([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', ([a, b, expected]) => { // [!code ++]
  test('test', () => {
    expect(a + b).toBe(expected)
  })
})
```
