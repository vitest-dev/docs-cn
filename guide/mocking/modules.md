# 模拟模块（Mocking Modules）

## 模块的定义

在进行模块模拟之前，先要明确“模块”的含义。在 Vitest 中，模块指的是一个导出内容的文件。
通过 [插件](https://vite.dev/guide/api-plugin.html)，几乎任何文件都可以转换为 JavaScript 模块。

“模块对象”是一个命名空间对象，内部动态引用模块导出的标识符。
换句话说，它就是一个包含已导出方法与属性的对象。

例如，`example.js` 就是一个模块，它导出了 `method` 和 `variable`：

```js [example.js]
export function answer() {
  // ...
  return 42
}

export const variable = 'example'
```

这里的 `exampleObject` 指的就是一个模块对象：

```js [example.test.js]
import * as exampleObject from './example.js'
```

即便是通过具名导入（ named imports ）来引入 `example`, `exampleObject` 依然会存在。

```js [example.test.js]
import { answer, variable } from './example.js'
```

`exampleObject` 只能在 `example` 模块之外被引用，例如在测试代码中使用。

## 模拟模块 （ Mocking a Module ）

在讲解实现方式之前，先明确几个相关概念：

- **Mocked module （模拟模块）**：原模块被完全替换成另一个模块；
- **Spied module （监听模块）**：属于模拟模块的一种，但其导出方法依然保留原始实现，同时可跟踪调用情况；
- **Mocked export （模拟导出）**：模块中被替换的某个导出，其调用记录可被跟踪；
- **Spied export （监听导出）**：一种模拟导出形式，带有调用跟踪能力。

要完全替换一个模块，可以使用 [`vi.mock` API](/api/vi#vi-mock)。
在调用 `vi.mock` 时，通过传入一个工厂函数作为第二个参数，该函数返回的新模块将动态替代原模块。

```ts
import { vi } from 'vitest'

// The ./example.js module will be replaced with
// the result of a factory function, and the
// original ./example.js module will never be called
vi.mock(import('./example.js'), () => {
  return {
    answer() {
      // ...
      return 42
    },
    variable: 'mock',
  }
})
```

::: tip
请注意，你可以在 [setup 文件](/config/#setupfiles) 中调用 `vi.mock` ，
这样模块的模拟就会在所有测试文件中自动生效，无需在每个文件中重复声明。
:::

::: tip
注意这里使用了动态导入语法：`import('./example.ts')`。
Vitest 会在代码真正执行前将其移除，但这种写法可以让 TypeScript 正确验证导入路径的字符串，并在你的 IDE 或 CLI 中为 `importOriginal` 方法提供完整的类型提示和检查功能。
:::

如果我么的代码试图访问一个不在工厂函数返回对象中的方法， Vitest 会抛出错误，并附带清晰的提示信息。
需要注意，`answer` 在这里并未被 mock ，因此它的调用无法被追踪。
若要让它支持调用跟踪，应使用 `vi.fn()` 进行包装。

```ts
import { vi } from 'vitest'

vi.mock(import('./example.js'), () => {
  return {
    answer: vi.fn(),
    variable: 'mock',
  }
})
```

这个工厂方法会接收一个 `importOriginal` 函数，该函数用于执行原始模块代码，并返回对应的模块对象。

```ts
import { expect, vi } from 'vitest'
import { answer } from './example.js'

vi.mock(import('./example.js'), async (importOriginal) => {
  const originalModule = await importOriginal()
  return {
    answer: vi.fn(originalModule.answer),
    variable: 'mock',
  }
})

expect(answer()).toBe(42)

expect(answer).toHaveBeenCalled()
expect(answer).toHaveReturned(42)
```

::: warning
请注意，`importOriginal` 是异步函数，调用时需要使用 `await` 进行等待。
:::

在上例中，我们将原始的 `answer` 传递给 `vi.fn()`，这样既可以保留其原始实现的调用，又能对调用进行跟踪。

如果需要使用 `importOriginal`，可以考虑使用另一个 API —— `vi.spyOn` —— 来直接监听模块的某个导出方法。
这种方式无需替换整个模块，而是仅对目标方法进行监听。

要实现这一点，需要将模块以命名空间对象的形式导入。

```ts
import { expect, vi } from 'vitest'
import * as exampleObject from './example.js'

const spy = vi.spyOn(exampleObject, 'answer').mockReturnValue(0)

expect(exampleObject.answer()).toBe(0)
expect(exampleObject.answer).toHaveBeenCalled()
```

::: danger Browser Mode Support
这种方式在 [浏览器模式](/guide/browser/) 下无法使用，因为浏览器会依赖原生的 ESM 机制来加载模块，
而模块的命名空间对象是密封的（sealed），无法被重新配置。

为绕过这一限制，Vitest 在 `vi.mock('./example.js')` 中提供了 `{ spy: true }` 选项。
启用该选项后，Vitest 会自动为模块中的每个导出设置监听（spy），而不会用虚假的实现去替换它们。

```ts
import { vi } from 'vitest'
import * as exampleObject from './example.js'

vi.mock('./example.js', { spy: true })

vi.mocked(exampleObject.answer).mockReturnValue(0)
```
:::

::: warning
在使用 `vi.spyOn` 的文件中，只需将目标模块以命名空间对象的形式导入即可。
如果 `answer` 方法是在其他文件中通过具名导入的方式被引用并调用的，只要该调用发生在 `vi.spyOn` 执行之后，
Vitest 依然能够准确追踪它的调用记录。

```ts [source.js]
import { answer } from './example.js'

export function question() {
  if (answer() === 42) {
    return 'Ultimate Question of Life, the Universe, and Everything'
  }

  return 'Unknown Question'
}
```
:::

请注意，`vi.spyOn` 只能追踪在其监听启动之后发生的调用。
如果某个函数是在模块导入时（顶层执行）就被调用，或者在监听启动之前就已执行过，`vi.spyOn` 将无法记录这些调用。

若想在模块被导入前自动对其进行模拟，可以调用 `vi.mock` 并传入对应的模块路径：

```ts
import { vi } from 'vitest'

vi.mock(import('./example.js'))
```

如果文件 `./__mocks__/example.js` 存在， Vitest 会优先加载该文件来替代原模块。
若不存在该文件， Vitest 会加载原模块，并递归替换其中的所有内容，规则如下：

{#automocking-algorithm}

- 所有数组将被替换为空数组
- 所有原始类型保持不变
- 所有 getter 将返回 `undefined`
- 所有方法将返回 `undefined`
- 所有对象将被深度克隆
- 所有类的实例及其原型将被克隆

如需禁用该默认行为，可以在调用时将 `{ spy: true }` 作为第二个参数传入，例如：

```ts
import { vi } from 'vitest'

vi.mock(import('./example.js'), { spy: true })
```

在这种模式下，方法不会返回 `undefined`，而是会继续调用原始实现，但你依然能够记录并追踪这些方法的调用情况。

```ts
import { expect, vi } from 'vitest'
import { answer } from './example.js'

vi.mock(import('./example.js'), { spy: true })

// calls the original implementation
expect(answer()).toBe(42)
// vitest can still track the invocations
expect(answer).toHaveBeenCalled()
```

被模拟（ mocked ）的模块有一个很实用的特性——实例与其原型之间可以共享状态。
来看下面这个示例模块：

```ts [answer.js]
export class Answer {
  constructor(value) {
    this._value = value
  }

  value() {
    return this._value
  }
}
```

对该模块进行 mock 后，即便无法直接访问类的实例，也能记录并追踪 `.value()` 方法的每一次调用。

```ts [answer.test.js]
import { expect, test, vi } from 'vitest'
import { Answer } from './answer.js'

vi.mock(import('./answer.js'), { spy: true })

test('instance inherits the state', () => {
  // these invocations could be private inside another function
  // that you don't have access to in your test
  const answer1 = new Answer(42)
  const answer2 = new Answer(0)

  expect(answer1.value()).toBe(42)
  expect(answer1.value).toHaveBeenCalled()
  // note that different instances have their own states
  expect(answer2.value).not.toHaveBeenCalled()

  expect(answer2.value()).toBe(0)

  // but the prototype state accumulates all calls
  expect(Answer.prototype.value).toHaveBeenCalledTimes(2)
  expect(Answer.prototype.value).toHaveReturned(42)
  expect(Answer.prototype.value).toHaveReturned(0)
})
```

这种技巧在需要跟踪那些从未对外暴露的实例方法调用时尤其有用。

## 模拟不存在的模块

Vitest 支持对“虚拟模块”进行模拟（mock）。
这类模块并不存在于文件系统中，但代码中依然会导入它们。
这种情况常见于开发环境与生产环境不一致的场景，例如在单元测试中模拟 `vscode` API。

默认情况下，如果 Vitest 无法找到导入模块的源文件，它会在代码转换阶段报错。
为避免这种情况，需要在配置文件中进行声明。

你可以选择：

- 始终将该导入重定向到某个真实文件；
- 或仅告知 Vite 忽略它，再通过 `vi.mock` 工厂函数来定义模块的导出。

若要进行导入重定向，可以使用 [`test.alias`](/config/#alias) 配置选项：

```ts [vitest.config.ts]
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      vscode: resolve(import.meta.dirname, './mock/vscode.js'),
    },
  },
})
```

若要将某个模块标记为“始终可解析”，可以在插件的 `resolveId` 钩子中返回与传入值相同的字符串。

```ts [vitest.config.ts]
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'virtual-vscode',
      resolveId(id) {
        if (id === 'vscode') {
          return 'vscode'
        }
      }
    }
  ]
})
```

现在，你可以在测试中照常使用 `vi.mock` 来模拟该模块了。

```ts
import { vi } from 'vitest'

vi.mock(import('vscode'), () => {
  return {
    window: {
      createOutputChannel: vi.fn(),
    }
  }
})
```

## 工作原理

Vitest 会根据运行环境的不同，采用不同的模块模拟机制，但它们的共同点是都使用了插件转换器（ plugin transformer ）。

当 Vitest 发现某个文件中包含 `vi.mock` 调用时，会执行两步处理：
1. 将所有静态导入（ static import ）语句改写为动态导入（ dynamic import ）
2. 将 `vi.mock` 调用移动到文件顶部。

这样一来，Vitest 就能在模块被导入前完成 Mock 的注册，同时依然遵守 ESM 对“导入提升（ hoisted imports ）”的语法规则。

::: code-group
```ts [example.js]
import { answer } from './answer.js'

vi.mock(import('./answer.js'))

console.log(answer)
```
```ts [example.transformed.js]
vi.mock('./answer.js')

const __vitest_module_0__ = await __handle_mock__(
  () => import('./answer.js')
)
// to keep the live binding, we have to access
// the export on the module namespace
console.log(__vitest_module_0__.answer())
```
:::

`__handle_mock__` 这个包装器的唯一作用，是确保在模块导入开始之前就完成 Mock 的解析；
它不会对模块内容做任何修改。

Vitest 所使用的模块模拟插件，
可以在 [`@vitest/mocker` 包](https://github.com/vitest-dev/vitest/tree/main/packages/mocker) 中找到。

### JSDOM, happy-dom, Node

当你在模拟（ emulated ）环境中运行测试时， Vitest 会创建一个可执行 Vite 转译代码的 [module runner](https://vite.dev/guide/api-environment-runtimes.html#modulerunner)。

这个 module runner 的设计，使得 Vitest 能够在模块执行阶段进行拦截，并在已注册 mock 的情况下用它替换原模块。

换句话说， Vitest 会在一个“ 类 ESM ”环境中运行测试代码，但并不直接依赖原生 ESM 机制。
这使得测试运行器能够打破 ES Modules 的不可变性规则，让你可以在看似 ES Module 的模块上调用 `vi.spyOn`。

### 浏览器模式

在浏览器模式（ Browser Mode ）中，
Vitest 依赖原生 ESM ，这意味着无法像在 Node 环境中那样直接替换模块。

因此，当模块被 mock 时，
Vitest 会通过拦截网络请求来替换模块代码：
- 在 Playwright 环境下，使用 `page.route` 进行拦截；
- 在 `preview` 或 `webdriverio` 场景下，使用 Vite 插件 API 进行拦截。

拦截后，
Vitest 会返回经过转换的代码。

例如，当模块是自动 mock （ automocked ）时，
Vitest 会解析模块的静态导出，并生成一个占位模块（ placeholder module ）来替代原模块。

::: code-group
```ts [answer.js]
export function answer() {
  return 42
}
```
```ts [answer.transformed.js]
function answer() {
  return 42
}

const __private_module__ = {
  [Symbol.toStringTag]: 'Module',
  answer: vi.fn(answer),
}

export const answer = __private_module__.answer
```
:::

为了简洁，示例代码有所精简，但核心原理不变。

我们可以在模块中注入一个 `__private_module__` 变量，用于存放被 mock 的值：
- 如果用户在调用 `vi.mock` 时传入 `{ spy: true }`，则保留原始实现并传递它；
- 否则，就用一个简单的 `vi.fn()` 来创建 mock 函数。

当用户定义了自定义的 mock 工厂时，注入逻辑会更复杂，但仍然可以实现。
具体流程是：当浏览器请求被 mock 的文件时，
Vitest 会先在浏览器端解析工厂函数，并将对应的键（ keys ）传回服务器；
服务器再利用这些键生成一个占位模块（ placeholder module ）。

```ts
const resolvedFactoryKeys = await resolveBrowserFactory(url)
const mockedModule = `
const __private_module__ = getFactoryReturnValue(${url})
${resolvedFactoryKeys.map(key => `export const ${key} = __private_module__["${key}"]`).join('\n')}
`
```

该模块此时已经可以回传并在浏览器中加载。
在运行测试时，你可以通过浏览器的开发者工具（ DevTools ）来查看它的代码。

## 模块模拟的常见陷阱

需要注意的是，如果一个方法是在同一文件内由另一个方法调用的，那么它无法通过外部进行 mock。
例如，以下代码中就存在这种情况：

```ts [foobar.js]
export function foo() {
  return 'foo'
}

export function foobar() {
  return `${foo()}bar`
}
```

`foo` 方法在 `foobar` 函数内部是直接引用的，因此无法通过外部 mock 覆盖。
这意味着，该 mock 对 `foobar` 内部的 `foo` 调用不会产生任何作用，但会影响其他模块中对 `foo` 的调用。

```ts [foobar.test.ts]
import { vi } from 'vitest'
import * as mod from './foobar.js'

// this will only affect "foo" outside of the original module
vi.spyOn(mod, 'foo')
vi.mock(import('./foobar.js'), async (importOriginal) => {
  return {
    ...await importOriginal(),
    // this will only affect "foo" outside of the original module
    foo: () => 'mocked'
  }
})
```

你可以直接替换 `foobar` 方法的实现，从而验证这一行为。

```ts [foobar.test.js]
import * as mod from './foobar.js'

vi.spyOn(mod, 'foo')

// exported foo references mocked method
mod.foobar(mod.foo)
```

```ts [foobar.js]
export function foo() {
  return 'foo'
}

export function foobar(injectedFoo) {
  return injectedFoo === foo // false
}
```

这是预期的行为，我们不会为此提供变通方案。
建议将代码拆分为多个文件，或采用 [依赖注入](https://en.wikipedia.org/wiki/Dependency_injection) 等架构设计手段来优化。

我们认为，让应用程序具备良好的可测试性，并不是测试运行器的职责，而是应用架构设计应承担的责任。
