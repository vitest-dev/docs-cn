---
title: 初始化与清理 | 指南
prev:
  text: 测试异步代码
  link: /guide/learn/async
next:
  text: 模拟函数
  link: /guide/learn/mock-functions
---

# 初始化与清理 {#setup-and-teardown}

在编写测试时，经常需要在测试运行前进行一些准备工作（例如初始化数据、连接数据库、启动服务器），并在测试结束后进行清理。为了避免在每个测试中重复这些代码，Vitest 提供了生命周期钩子，它们会在恰当的时机自动执行。

## 为每个测试重复初始化 {#repeating-setup-for-each-test}

最常用的钩子是 [`beforeEach`](/api/hooks#beforeeach) 和 [`afterEach`](/api/hooks#aftereach)。顾名思义，`beforeEach` 会在文件中的每个测试之前运行，而 `afterEach` 会在每个测试之后运行，即使测试失败也是如此。这使得它们非常适合确保每个测试都从一个已知的初始状态开始。

```js
import { afterEach, beforeEach, expect, test } from 'vitest'

let items

beforeEach(() => {
  items = ['apple', 'banana', 'cherry']
})

afterEach(() => {
  items = []
})

test('items starts with 3 fruits', () => {
  expect(items).toHaveLength(3)
})

test('can remove an item', () => {
  items.pop()
  expect(items).toHaveLength(2)
})

test('can add an item', () => {
  items.push('date')
  expect(items).toHaveLength(4)
<<<<<<< HEAD
  // afterEach 会为下一个测试重置项目，
  // 因此此处的修改不会影响到其他测试
})
```

如果没有这些钩子，第二个测试的 `push` 操作会影响其后的所有测试，这是导致测试不稳定的典型原因。这些钩子确保了每个测试都拥有干净的状态。
=======
  // beforeEach reset the array to 3 items before this test ran,
  // proving that mutations from the previous test do not leak.
})
```

Without these hooks, mutations like `pop` or `push` from earlier tests would affect subsequent ones, which is a classic source of flaky tests, while the hooks guarantee clean state for every test.
>>>>>>> 8430ac3c5895ab2beaa27433b4386989c69fc6ee

## 一次性初始化 {#one-time-setup}

有些初始化过于耗时，不适合为每个测试重复执行。如果你需要连接数据库、启动服务器或加载大型文件，在每个测试前都做这些操作会显著拖慢测试套件的速度。这正是 [`beforeAll`](/api/hooks#beforeall) 和 [`afterAll`](/api/hooks#afterall) 的用武之地。它们在整个文件运行期间只执行一次：

```js
import { afterAll, beforeAll, expect, test } from 'vitest'

let db

beforeAll(async () => {
  db = await connectToDatabase()
})

afterAll(async () => {
  await db.close()
})

test('can query users', async () => {
  const users = await db.query('SELECT * FROM users')
  expect(users.length).toBeGreaterThan(0)
})

test('can query products', async () => {
  const products = await db.query('SELECT * FROM products')
  expect(products.length).toBeGreaterThan(0)
})
```

数据库连接只创建一次，在所有测试间共享，并在文件运行结束时关闭。

## 使用 `describe` 进行作用域划分 {#scoping-with-describe}

在 `describe` 块内定义的钩子仅适用于该块内的测试。顶层的钩子则适用于文件中的每个测试。这让你可以为不同的测试组初始化不同的状态：

```js
import { beforeEach, describe, expect, test } from 'vitest'

describe('math operations', () => {
  let value

  beforeEach(() => {
    value = 0
  })

  test('can add', () => {
    value += 5
    expect(value).toBe(5)
  })

  test('can subtract', () => {
    value -= 3
    expect(value).toBe(-3) // value 被 beforeEach 重置为 0
  })
})

describe('string operations', () => {
  let text

  beforeEach(() => {
    text = 'hello'
  })

  test('can uppercase', () => {
    expect(text.toUpperCase()).toBe('HELLO')
  })
})
```

每个 `describe` 块都有其自己的 `beforeEach` 钩子，该钩子仅影响其内部的测试。字符串测试不知道也不关心 `value` 变量，反之亦然。

## 执行顺序 {#execution-order}

当你在多个层级上设置钩子时，了解它们的执行顺序会很有用。顶层钩子包裹着内层钩子，形成一种嵌套结构：

```js
import { afterAll, afterEach, beforeAll, beforeEach, describe, test } from 'vitest'

beforeAll(() => console.log('1 - beforeAll'))
afterAll(() => console.log('8 - afterAll'))
beforeEach(() => console.log('2 - beforeEach'))
afterEach(() => console.log('5 - afterEach'))

describe('suite', () => {
  beforeEach(() => console.log('3 - inner beforeEach'))
  afterEach(() => console.log('4 - inner afterEach'))

  test('first test', () => {
    console.log('  first test')
  })

  test('second test', () => {
    console.log('  second test')
  })
})
```

这会产生以下输出：

```
1 - beforeAll
2 - beforeEach
3 - inner beforeEach
  first test
4 - inner afterEach
5 - afterEach
2 - beforeEach
3 - inner beforeEach
  second test
4 - inner afterEach
5 - afterEach
8 - afterAll
```

注意这里的执行顺序：`beforeAll` 和 `afterAll` 在整个测试套件中只运行一次，而 `beforeEach` 和 `afterEach` 则为每个测试重复执行。在每个测试内部，外层的 `beforeEach` 首先运行（初始化最宽泛的上下文），然后内层的 `beforeEach` 运行（缩小上下文范围）。测试结束后，顺序则相反：内层的 `afterEach` 先清理较窄的上下文，然后外层的 `afterEach` 处理更宽泛的清理工作。

## 使用 `onTestFinished` 进行清理 {#cleanup-with-ontestfinished}

```js
import { expect, onTestFinished, test } from 'vitest'

test('creates a temporary file', () => {
  const file = createTempFile()
  onTestFinished(() => {
    deleteTempFile(file)
  })

  expect(file.exists()).toBe(true)
})
```

类似的模式也适用于 `beforeEach`。你可以返回一个清理函数，Vitest 会在每个测试后调用它。当初始化和清理操作紧密相关时，这种方式极其方便：

```js
import { beforeEach } from 'vitest'

beforeEach(() => {
  const server = startServer()
  return () => {
    server.close()
  }
})
```

## 使用 `test.extend` 的 Fixtures {#fixtures-with-test-extend}

上述示例使用 `let` 变量和 `beforeEach` 来初始化共享状态。这种方式可行，但存在一些缺点：变量声明与初始化是分离的，类型需要显式注解，并且容易忘记清理。

Vitest 通过 [`test.extend`](/guide/test-context#extend-test-context) 提供了一个更好的形式。你可以定义可复用的 **fixtures**，它们会自动为每个测试创建并在之后清理：

```js [my-test.js]
import { test as baseTest } from 'vitest'

export const test = baseTest
  .extend('db', async ({}, { onCleanup }) => {
    const db = await createDatabase()
    onCleanup(() => db.close())
    return db
  })
  .extend('user', async ({ db }) => {
    return await db.createUser({ name: 'Alice' })
  })
```

```js [my-test.test.js]
import { expect } from 'vitest'
import { test } from './my-test.js'

test('user is created', ({ db, user }) => {
  expect(user.name).toBe('Alice')
})
```

Fixtures 仅在测试实际使用它们时（通过从上下文中解构）才会初始化，并且它们可以相互依赖。对于大多数初始化和清理形式，这是 `beforeEach`/`afterEach` 的一个很好的替代方案。

有关 fixtures、作用域和覆盖的完整详细信息，请参阅 [测试上下文](/guide/test-context)。

## 初始化文件 {#setup-files}

如果你有一些初始化代码需要在项目中的每个测试文件运行前执行（例如 polyfills、全局配置或自定义匹配器），你可以将其放入一个初始化文件中，并通过 [`setupFiles`](/config/setupfiles) 配置选项指向它：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./test/setup.js'],
  },
})
```

```js [test/setup.js]
// 这会在每个测试文件之前运行
import { expect } from 'vitest'
import { customMatchers } from './custom-matchers.js'

expect.extend(customMatchers)
```

与每个文件运行一次的 `beforeAll` 不同，初始化文件在测试文件甚至开始收集之前，在一个独立的阶段运行。这使得它们非常适合扩展 `expect` API 或配置全局 polyfills 等操作。

::: tip
对于需要在包装上下文（例如数据库事务或跟踪范围）_内部_ 运行测试的高级场景，请参阅 [`aroundEach`](/api/hooks#aroundeach) 和 [`aroundAll`](/api/hooks#aroundall) 钩子。有关完整的生命周期图，请参阅 [测试运行生命周期](/guide/lifecycle)。
:::
