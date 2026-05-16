---
title: 测试实操 | 指南
prev:
  text: 快照测试
  link: /guide/learn/snapshots
next:
  text: 调试测试
  link: /guide/learn/debugging-tests
---

# 测试实践 {#testing-in-practice}

前面的页面介绍了 Vitest API：断言、模拟、快照和测试生命周期钩子。本章重点介绍如何将这些工具应用于实际代码。涵盖如何确定测试内容、如何有效组织测试结构，以及如何在项目增长时有效组织测试文件。

## 那些需要测试 {#what-to-test}

当你开始为函数或模块编写测试时，首先要思考它的 **约定**：它向调用它的代码承诺了什么？约定由其输入（参数、配置）和输出（返回值、副作用、错误）定义。这些正是你的测试需要验证的内容。

以 `formatPrice` 函数为例：

```js [formatPrice.js]
export function formatPrice(amount, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}
```

这里的约定是：给定金额和货币代码，返回格式化的价格字符串。针对此函数的良好测试应涵盖：

```js [formatPrice.test.js]
import { expect, test } from 'vitest'
import { formatPrice } from './formatPrice.js'

test('formats USD prices', () => {
  expect(formatPrice(10, 'USD')).toBe('$10.00')
})

test('formats EUR prices', () => {
  expect(formatPrice(10, 'EUR')).toBe('€10.00')
})

test('handles zero', () => {
  expect(formatPrice(0, 'USD')).toBe('$0.00')
})

test('handles negative amounts', () => {
  expect(formatPrice(-5.5, 'USD')).toBe('-$5.50')
})

test('rounds to two decimal places', () => {
  expect(formatPrice(10.999, 'USD')).toBe('$11.00')
})
```

请注意这些测试 _不做什么_。它们不检查传递了哪些内部的 `Intl.NumberFormat` 选项，或者是否设置了中间变量。它们只检查输出。

::: tip
一个好的做法：如果有人重构了内部实现但输出保持不变，测试应该失败吗？如果会失败，那么你很可能是在测试实现细节而非行为。
:::

## 测试结构 {#structuring-a-test}

大多数测试遵循一个自然的三段式结构，有时被称为“准备、执行、断言”：

1. **初始化** 测试所需的数据
2. **调用** 要测试的函数或执行操作
3. **检查** 结果是否符合预期

```js
test('removes an item from the list', () => {
  // 初始化
  const list = new ShoppingList()
  list.add('milk')
  list.add('bread')

  // 调用
  list.remove('milk')

  // 检查
  expect(list.getItems()).toEqual(['bread'])
})
```

你不需要用注释标注每个部分。写过几个测试后，这种结构就会变得很自然。重要的是让每个测试专注于一个行为。

### 每个测试一个行为 {#one-behavior-per-test}

如果你发现自己在测试名中写 “和”（例如“格式化价格并处理错误并记录结果”），这表明你应该将其拆分为多个独立的测试。

### 描述性测试名 {#descriptive-names}

编写描述行为而非实现的测试名。“返回 USD 的格式化价格” 比 “使用正确选项调用 Intl.NumberFormat” 更好。当测试失败时，名称应该能告诉你哪里出了问题，而无需阅读测试体。

## 测试边界情况 {#testing-edge-cases}

覆盖主要行为后，考虑边界情况。在边界处会发生什么？哪些输入不常见但有效？出错时应该发生什么？

以下是一个 `parseAge` 函数的示例，它接收用户输入并返回一个数字：

```js [parseAge.js]
export function parseAge(input) {
  const age = Number(input)
  if (Number.isNaN(age) || age < 0 || age > 150) {
    throw new Error(`Invalid age: ${input}`)
  }
  return Math.floor(age)
}
```

主要流程是显而易见的，但边界情况才是真正隐藏错误的地方：

```js [parseAge.test.js]
import { expect, test } from 'vitest'
import { parseAge } from './parseAge.js'

test('parses a valid age', () => {
  expect(parseAge('25')).toBe(25)
})

test('rounds down decimal ages', () => {
  expect(parseAge('25.9')).toBe(25)
})

test('handles zero', () => {
  expect(parseAge('0')).toBe(0)
})

test('handles the upper boundary', () => {
  expect(parseAge('150')).toBe(150)
})

test('throws for negative numbers', () => {
  expect(() => parseAge('-1')).toThrow('Invalid age: -1')
})

test('throws for numbers above 150', () => {
  expect(() => parseAge('151')).toThrow('Invalid age: 151')
})

test('throws for non-numeric strings', () => {
  expect(() => parseAge('abc')).toThrow('Invalid age: abc')
})

test('throws for empty string', () => {
  expect(() => parseAge('')).toThrow('Invalid age: ')
})
```

你不需要测试所有可能的输入。重点关注边界值（0、150、151、-1）、错误路径，以及你的函数可能实际接收到的输入类型。

::: tip
如果不确定某个边界情况是否重要，可以问自己：真实用户或真实调用者会触发这种情况吗？如果会，就测试它。
:::

### 基于属性的测试 {#property-based-testing}

对于具有广泛有效输入范围的函数，手动选择边界情况只能做到一定程度。**基于属性的测试** 是一种技术，你描述任何输入都应该成立的 _属性_，测试框架会生成数百个随机输入来尝试找到破坏这些属性的情况。

例如，你可以说 “对于任何有效的年龄字符串，`parseAge` 都应返回一个非负整数”，然后让工具寻找反例。[fast-check](https://fast-check.dev/) 是一款流行的基于属性测试库，与 Vitest 集成良好。这是一项高级技术，但随着测试需求的增长，值得了解。

## 何时使用模拟 {#when-to-mock}

模拟是一个强大的工具，但很容易被过度使用。

### 慢速依赖项 {#slow-dependencies}

网络请求、文件系统操作和数据库调用可能使你的测试需要数秒而非毫秒完成。使用模拟替换它们以保持快速反馈循环。

特别是对于 HTTP 请求，考虑使用 [Mock Service Worker](https://mswjs.io/) 而不是直接模拟 fetch。有关设置说明，请参阅 [模拟请求](/guide/mocking/requests)。

### 非确定性值 {#non-deterministic-values}

如果你的代码依赖于当前日期、随机数或 UUID 生成器，模拟这些值以使测试可预测。Vitest 提供了 [`vi.useFakeTimers()`](/api/vi#vi-usefaketimers) 和 [`vi.setSystemTime()`](/api/vi#vi-setsystemtime) 用于在测试中控制时间。

### 不应模拟的内容 {#what-not-to-mock}

不要模拟你正在测试的对象。如果你正在测试 `UserService`，不要模拟 `UserService`。模拟它的 _依赖项_（数据库、邮件发送器）并让服务本身真实运行。

此外，当真实实现快速且可靠时，应优先使用真实实现。如果依赖项是简单的内存数据结构或纯函数，则没有理由模拟它。你的测试越接近真实使用场景，它们给你的底气就越足。

::: tip
仅当真实对象速度慢、不稳定或具有你无法在测试中控制的副作用时，才使用模拟。
:::

## 通过测试修复错误 {#fixing-bugs-with-tests}

当你发现一个 bug 时，很容易直接跳入代码并修复它。更好的方法是先编写一个能重现该 bug 的失败用例，然后修复代码并观察测试变为通过状态。

这样做有几个好处。测试证明了错误是真实存在的，而不仅仅是误解。它准确记录了哪里出了问题。并且它防止了同一错误以后再次出现，因为如果有人不小心重新引入了相同问题，测试会捕获它。

以下是实际操作的示例。假设用户报告 `parseAge` 在接收带有前导空格的字符串（如 `" 25"`）时崩溃。首先，编写一个重现问题的测试：

```js
test('handles leading spaces', () => {
  expect(parseAge(' 25')).toBe(25)
})
```

运行它并确认失败。现在你确切知道哪里出了问题，并有了明确的目标。修复实现：

```js
export function parseAge(input) {
  const age = Number(input.trim())
  // ...
}
```

再次运行测试。它通过了。bug 已修复，并且你有了一个回归测试，如果以后有人移除 `.trim()` 调用，它将捕获该 bug。

::: tip
如果你使用智能体来修复错误，请配置它们遵循相同原则：先用失败测试重现问题，然后修复代码。这可以防止智能体通过更改测试而非代码来 “修复” bug，并让你确信修复确实有效。
:::

## 组织测试文件 {#organizing-test-files}

没有唯一正确的组织测试方式，但某些形式比其他形式更具扩展性。

### 文件布局 {#file-layout}

最简单的起点是为每个源文件创建一个测试文件。对于每个 `utils.js`，旁边都有一个 `utils.test.js`。这使得查找任何给定代码的测试变得容易，并且大多数编辑器会在文件树中并排显示它们：

```
src/
  utils.js
  utils.test.js
  formatPrice.js
  formatPrice.test.js
```

有些团队更喜欢使用单独的 `__tests__` 或 `test` 目录。两种方法都有效。重要的是项目内的一致性。Vitest 的 [`include`](/config/include) 默认匹配这两种布局。

### 使用 `describe` 进行分组 {#grouping-with-describe}

当一个模块导出多个函数时，使用 `describe` 块来分组每个函数的测试。这使测试输出保持有序，并清楚表明失败测试属于哪个函数：

```js
describe('formatPrice', () => {
  test('formats USD prices', () => { /* ... */ })
  test('handles zero', () => { /* ... */ })
})

describe('parseAmount', () => {
  test('parses valid amounts', () => { /* ... */ })
  test('throws for invalid input', () => { /* ... */ })
})
```

避免嵌套 `describe` 块超过一或两层深度。深度嵌套的测试树难以阅读，通常意味着源模块一次做了太多事情。

### 拆分大文件 {#splitting-large-files}

随着项目增长，一些测试文件不可避免地会变得很长。如果一个测试文件超过几百行，考虑按主题或功能区域拆分它。例如，`userService.test.js` 可能变成 `userService.creation.test.js` 和 `userService.auth.test.js`。这也使得在开发过程中运行测试子集更快。

### 命名测试 {#naming-tests}

测试名称比你想象的更重要。当测试在 CI 中失败时，名称往往是有人阅读的第一件事。像 “正常工作” 或 “处理边界情况” 这样的名称无法告诉你哪里出了问题。

优先使用描述特定行为的名称：“空购物车返回 0”、“电子邮件格式无效时抛出错误”、“添加新项目时保留现有项目”。测试输出应该像模块功能的规范说明一样可读。

## 完整示例 {#a-worked-example}

让我们把所有内容整合起来。以下是一个小的 `TodoList` 模块：

```js [todoList.js]
let nextId = 1

export function createTodoList() {
  const items = []

  return {
    add(text) {
      if (!text.trim()) {
        throw new Error('Todo text cannot be empty')
      }
      const todo = { id: nextId++, text, completed: false }
      items.push(todo)
      return todo
    },

    remove(id) {
      const index = items.findIndex(item => item.id === id)
      if (index === -1) {
        throw new Error(`Todo with id ${id} not found`)
      }
      items.splice(index, 1)
    },

    toggle(id) {
      const todo = items.find(item => item.id === id)
      if (!todo) {
        throw new Error(`Todo with id ${id} not found`)
      }
      todo.completed = !todo.completed
    },

    getAll() {
      return items
    },

    getCompleted() {
      return items.filter(item => item.completed)
    },
  }
}
```

查看这段代码，我们可以识别出需要测试的行为：

- 添加项目（主要目的）
- 添加空项目（应该失败）
- 按 ID 移除项目
- 移除不存在的项目（应该失败）
- 切换完成状态
- 获取所有项目与已完成项目

以下是测试文件可能的样子：

```js [todoList.test.js]
import { describe, expect, test } from 'vitest'
import { createTodoList } from './todoList.js'

describe('add', () => {
  test('adds a new todo', () => {
    const list = createTodoList()
    const todo = list.add('Buy groceries')

    expect(todo.text).toBe('Buy groceries')
    expect(todo.completed).toBe(false)
    expect(list.getAll()).toHaveLength(1)
  })

  test('assigns unique IDs to each todo', () => {
    const list = createTodoList()
    const first = list.add('First')
    const second = list.add('Second')

    expect(first.id).not.toBe(second.id)
  })

  test('throws when text is empty', () => {
    const list = createTodoList()
    expect(() => list.add('')).toThrow('Todo text cannot be empty')
  })

  test('throws when text is only whitespace', () => {
    const list = createTodoList()
    expect(() => list.add('   ')).toThrow('Todo text cannot be empty')
  })
})

describe('remove', () => {
  test('removes a todo by ID', () => {
    const list = createTodoList()
    const todo = list.add('Buy groceries')

    list.remove(todo.id)

    expect(list.getAll()).toHaveLength(0)
  })

  test('keeps other items when removing one', () => {
    const list = createTodoList()
    const first = list.add('First')
    list.add('Second')

    list.remove(first.id)

    expect(list.getAll()).toHaveLength(1)
    expect(list.getAll()[0].text).toBe('Second')
  })

  test('throws when ID does not exist', () => {
    const list = createTodoList()
    expect(() => list.remove(999)).toThrow('Todo with id 999 not found')
  })
})

describe('toggle', () => {
  test('marks a todo as completed', () => {
    const list = createTodoList()
    const todo = list.add('Buy groceries')

    list.toggle(todo.id)

    expect(list.getAll()[0].completed).toBe(true)
  })

  test('toggles back to incomplete', () => {
    const list = createTodoList()
    const todo = list.add('Buy groceries')

    list.toggle(todo.id)
    list.toggle(todo.id)

    expect(list.getAll()[0].completed).toBe(false)
  })

  test('throws when ID does not exist', () => {
    const list = createTodoList()
    expect(() => list.toggle(999)).toThrow('Todo with id 999 not found')
  })
})

describe('getCompleted', () => {
  test('returns only completed todos', () => {
    const list = createTodoList()
    const buy = list.add('Buy groceries')
    list.add('Clean house')
    list.toggle(buy.id)

    const completed = list.getCompleted()

    expect(completed).toHaveLength(1)
    expect(completed[0].text).toBe('Buy groceries')
  })

  test('returns empty array when nothing is completed', () => {
    const list = createTodoList()
    list.add('Buy groceries')

    expect(list.getCompleted()).toHaveLength(0)
  })
})
```

每个 `describe` 块专注于一个方法。每个测试验证一个特定的行为。测试名称读起来就像模块功能的规范说明。如果其中任何一个测试失败，名称和断言会准确告诉你哪里出了问题。

::: tip
注意我们在每个测试中都创建一个新的 `createTodoList()`。这保持了测试的独立性，意味着它们可以按任意顺序运行而不会相互影响。如果你发现自己在每个测试中重复相同的设置，那可能是使用 [`beforeEach`](/api/hooks#beforeeach) 或 [`test.extend`](/guide/test-context#extend-test-context) fixture 的好时机。
:::

::: details `nextId` 怎么办？
模块顶部的 `nextId` 计数器在所有对 `createTodoList()` 的调用中共享，包括跨测试。这意味着 ID 不可预测：一个测试可能获得 ID 1 和 2，而另一个测试获得 3 和 4，具体取决于执行顺序。这在这里没问题，因为测试只检查 _相对_ 唯一性（`first.id !== second.id`），而不是特定的 ID 值。如果测试断言了 `expect(todo.id).toBe(1)`，那么根据之前运行了哪些测试，它可能会失败。当你有像这样的共享模块级状态时，请确保你的测试不依赖于其具体值。
:::

---

如果你正在构建 Web 应用程序，并希望在真实的浏览器环境中测试组件，请查看 [组件测试](/guide/browser/component-testing)，了解如何测试 React、Vue、Svelte 和其他 UI 框架。
