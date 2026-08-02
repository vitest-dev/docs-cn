---
title: 测试快照 | 指南
---

# 测试快照 {#snapshot}

::: tip
想轻松上手快照测试？推荐从 [快照测试](/guide/learn/snapshots) 教程开始学习，该教程采用渐进式教学方式，特别适合初学者掌握核心概念。
:::

<CourseLink href="https://vueschool.io/lessons/snapshots-in-vitest?friend=vueuse">通过 Vue School 的视频学习快照</CourseLink>

当你希望确保函数的输出不会意外更改时，快照测试是一个非常有用的工具。

使用快照时，Vitest 将获取给定值的快照，将其比较时将参考存储在测试旁边的快照文件。如果两个快照不匹配，则测试将失败：要么更改是意外的，要么参考快照需要更新到测试结果的新版本。

## 使用快照 {#use-snapshots}

要将一个值快照，你可以使用 `expect()` 的 [`toMatchSnapshot()`](/api/expect#tomatchsnapshot) API:

```ts
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchSnapshot()
})
```

此测试在第一次运行时，Vitest 会创建一个快照文件，如下所示：

```js
// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports['toUpperCase 1'] = '"FOOBAR"'
```

快照文件应该与代码更改一起提交，并作为代码审查过程的一部分进行审查。在随后的测试运行中，Vitest 会将执行的输出与之前的快照进行比较。如果他们匹配，测试就会通过。如果它们不匹配，要么测试运行时在你的代码中发现了应该修复的错误，要么实现已经更改，需要更新快照。

## 内联快照 {#inline-snapshots}

Vitest 会存储接收值的序列化表示。快照渲染功能由 [`@vitest/pretty-format`](https://npmx.dev/package/@vitest/pretty-format) 提供支持。通过 [`snapshotFormat`](/config/snapshotformat) 可配置 Vitest 中的通用快照格式化行为。如需进一步定制，你可实现自己的 [自定义序列化器](#custom-serializer) 或 [自定义快照匹配器](#custom-snapshot-matchers)。

::: warning
在异步并发测试中使用快照时，由于 JavaScript 的限制，你需要使用 [测试环境](/guide/test-context) 中的 `expect` 来确保检测到正确的测试。
:::

同样，你可以使用 [`toMatchInlineSnapshot()`](/api/expect#tomatchinlinesnapshot) 将内联快照存储在测试文件中。

```ts
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchInlineSnapshot()
})
```

Vitest 不会创建快照文件，而是直接修改测试文件，将快照作为字符串更新到文件中：

```ts
import { expect, it } from 'vitest'

it('toUpperCase', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchInlineSnapshot('"FOOBAR"')
})
```

这允许你直接查看期望输出，而无需跨不同的文件跳转。

## 更新快照 {#updating-snapshots}

::: warning
在异步并发测试中使用快照时，由于 JavaScript 的限制，你需要使用 [测试环境](/guide/test-context) 中的 `expect` 来确保检测到正确的测试。
:::

当接收到的值与快照不匹配时，测试将失败，并显示它们之间的差异。当需要更改快照时，你可能希望从当前状态更新快照。

在监听(watch)模式下, 你可以在终端中键入 `u` 键直接更新失败的快照。

或者，你可以在 CLI 中使用 `--update` 或 `-u` 标记使 Vitest 进入快照更新模式。

```bash
vitest -u
```

### CI 环境行为 {#ci-behavior}

默认情况下，Vitest 在 CI 环境（`process.env.CI` 为真值时）不会写入快照文件，且任何快照不匹配、快照缺失或快照废弃的情况都会导致测试失败。更多信息请参阅 [`update`](/config/update) 参数说明。

**废弃快照** 指的是不再匹配任何现有测试的快照条目（或快照文件），这种情况通常发生在删除或重命名测试用例后。

## 文件快照 {#file-snapshots}

调用 `toMatchSnapshot()` 时，我们将所有快照存储在格式化的快照文件中。这意味着我们需要转义快照字符串中的一些字符（即双引号 `"` 和反引号 `` ` ``）。同时，你可能会丢失快照内容的语法突出显示（如果它们是某种语言）。

为了改善这种情况，我们引入 [`toMatchFileSnapshot()`](/api/expect#tomatchfilesnapshot) 以在文件中显式快照。这允许你为快照文件分配任何文件扩展名，并使它们更具可读性。

```ts
import { expect, it } from 'vitest'

it('render basic', async () => {
  const result = renderHTML(h('div', { class: 'foo' }))
  await expect(result).toMatchFileSnapshot('./test/basic.output.html')
})
```

它将与 `./test/basic.output.html` 的内容进行比较。并且可以用 `--update` 参数写回。

## 图像快照 {#visual-snapshots}

对于 UI 组件和页面的视觉回归测试，Vitest 通过 [浏览器模式](/guide/browser/) 提供了内置支持，使用 [`toMatchScreenshot()`](/api/browser/assertions#tomatchscreenshot) 断言：

```ts
import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

test('button looks correct', async () => {
  const button = page.getByRole('button')
  await expect(button).toMatchScreenshot('primary-button')
})
```

它会捕获屏幕截图并与参考图像进行比较，以检测意外的视觉变化。在 [视觉回归测试指南](/guide/browser/visual-regression-testing)中了解更多内容。

## ARIA 快照 <Experimental /> <Version>4.1.4</Version> {#aria-snapshots}

ARIA 快照会捕获 DOM 元素的无障碍访问树，并与存储的模板进行比对。基于 [Playwright 的 ARIA 快照](https://playwright.dev/docs/aria-snapshots) 实现，它提供了视觉回归测试之外的语义化替代方案，断言结构和含义而非像素。

例如，以下 HTML：

```html
<nav aria-label="Main">
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
```

你可以断言其无障碍访问树结构：

```ts
import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

test('navigation structure', async () => {
  await expect.element(page.getByRole('navigation')).toMatchAriaInlineSnapshot(`
    - navigation "Main":
      - link "Home":
        - /url: /
      - link "About":
        - /url: /about
  `)
})
```

语法细节、浏览器模式下的重试行为以及文件快照与内联快照的对比示例，请参阅专门的 [ARIA 快照指南](/guide/browser/aria-snapshots)。完整 API 请参阅 [`toMatchAriaSnapshot`](/api/expect#tomatcharisnapshot) 和 [`toMatchAriaInlineSnapshot`](/api/expect#tomatchariainlinesnapshot)。

## 自定义序列化器 {#custom-serializer}

你可以添加自己的逻辑来修改快照的序列化方式。像 Jest 一样，Vitest 默认有内置的 JavaScript 类型、HTML 元素、ImmutableJS 和 React 元素提供了默认的序列化程序。

可以使用 [`expect.addSnapshotSerializer`](/api/expect#expect-addsnapshotserializer) 添加自定义序列器。

```ts
expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` 是一个通过现有插件对值进行序列化的函数。
    return `Pretty foo: ${printer(
      val.foo,
      config,
      indentation,
      depth,
      refs
    )}`
  },
  test(val) {
    return val && Object.hasOwn(val, 'foo')
  },
})
```

我们还支持 [snapshotSerializers](/config/snapshotserializers) 选项，可以隐式添加自定义序列化器。

```ts [path/to/custom-serializer.ts]
import { SnapshotSerializer } from 'vitest'

export default {
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` 是一个使用现有插件序列化数值的函数。
    return `Pretty foo: ${printer(val.foo, config, indentation, depth, refs)}`
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, 'foo')
  },
} satisfies SnapshotSerializ:er
```

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    snapshotSerializers: ['path/to/custom-serializer.ts'],
  },
})
```

添加类似的测试后：

```ts
test('foo snapshot test', () => {
  const bar = {
    foo: {
      x: 1,
      y: 2,
    },
  }

  expect(bar).toMatchSnapshot()
})
```

你将获得以下快照：

```
Pretty foo: Object {
  "x": 1,
  "y": 2,
}
```

## 自定义快照匹配器 <Experimental /> <Version>4.1.3</Version> {#custom-snapshot-matchers}

可通过 `vitest` 提供的 `Snapshots` 组合式函数构建自定义快照匹配器。这些函数允许你在生成快照前对值进行转换，同时完整保留快照生命周期支持（创建、更新、内联重写）。

```ts
import { expect, test, Snapshots } from 'vitest'

const { toMatchFileSnapshot, toMatchInlineSnapshot, toMatchSnapshot } = Snapshots

expect.extend({
  toMatchTrimmedSnapshot(received: string, length: number) {
    return toMatchSnapshot.call(this, received.slice(0, length))
  },
  toMatchTrimmedInlineSnapshot(received: string, inlineSnapshot?: string) {
    return toMatchInlineSnapshot.call(this, received.slice(0, 10), inlineSnapshot)
  },
  async toMatchTrimmedFileSnapshot(received: string, file: string) {
    return toMatchFileSnapshot.call(this, received.slice(0, 10), file)
  },
})

test('file snapshot', () => {
  // create __snapshots__/demo.test.ts with
  // > exports[`file snapshot 1`] = `"extra long"`
  expect('extra long string oh my gerd').toMatchTrimmedSnapshot(10)
})

test('inline snapshot', () => {
  expect('super long string oh my gerd').toMatchTrimmedInlineSnapshot(`"super long"`)
})

test('raw file snapshot', async () => {
  // create raw-file.txt with:
  // > crazy long
  await expect('crazy long string oh my gerd').toMatchTrimmedFileSnapshot('./raw-file.txt')
})
```

这些组合式函数会返回 `{ pass, message }` 对象，方便你进一步自定义错误提示：

```ts
import { Snapshots } from 'vitest'

const { toMatchSnapshot } = Snapshots

expect.extend({
  toMatchTrimmedSnapshot(received: string, length: number) {
    const result = toMatchSnapshot.call(this, received.slice(0, length))
    return { ...result, message: () => `Trimmed snapshot failed: ${result.message()}` }
  },
})
```

::: warning
对于内联快照匹配器，快照参数必须是最后一个参数（使用属性匹配器时则为倒数第二个）。Vitest 会重写源代码中的最后一个字符串参数，因此快照前的自定义参数有效，但不支持快照后的自定义参数。
:::

::: tip
文件快照匹配器必须是 `async` 的 — `toMatchFileSnapshot` 会返回一个 `Promise`。请确保在匹配器和测试中都使用 `await` 处理返回结果。
:::

::: warning
当自定义内联快照匹配器为异步时，Vitest 无法自动推断内联快照重写的调用位置。你必须通过在 chai 断言对象上设置 `'error'` 参数来捕获调用点：

```ts
import { chai, expect, Snapshots } from 'vitest'

const { toMatchInlineSnapshot } = Snapshots

expect.extend({
  async toMatchTransformedInlineSnapshot(received: string, inlineSnapshot?: string) {
    // 在匹配器实现顶部同步捕获调用点
    chai.util.flag(this.assertion, 'error', new Error())
    const transformed = await transform(received)
    return toMatchInlineSnapshot.call(this, transformed, inlineSnapshot)
  },
})
```

:::

对于 TypeScript，需扩展 `Matchers<R, T>` 接口：

```ts
import 'vitest'

declare module 'vitest' {
  interface Matchers<R, T> {
    toMatchTrimmedSnapshot: (length: number) => R
    toMatchTrimmedInlineSnapshot: (inlineSnapshot?: string) => R
    toMatchTrimmedFileSnapshot: (file: string) => Promise<void>
  }
}
```

::: tip
更多关于 `expect.extend` 和自定义匹配器约定的内容，请参阅 [扩展匹配器](/guide/extending-matchers)。
:::

## 自定义领域快照 <Experimental /> <Version>4.1.4</Version> {#custom-snapshot-domain}

自定义序列化器控制值如何被 **渲染** 成快照字符串，但比较过程仍然基于字符串相等。**领域快照适配器** 则更进一步：它拥有自定义匹配器的整个比较流水线，包括如何捕获值、渲染值、解析存储的快照，以及如何对它们进行语义匹配。

### 适配器接口 {#the-adapter-interface}

领域适配器需实现四个方法和两个泛型 - `Captured`（值的实际类型）和 `Expected`（存储的快照解析后的类型）：

```ts
import type { DomainMatchResult, DomainSnapshotAdapter } from 'vitest'

const myAdapter: DomainSnapshotAdapter<Captured, Expected> = {
  name: 'my-domain',

  // 从接收值中提取结构化数据
  capture(received: unknown): Captured { /* ... */ },

  // 将捕获的数据渲染为快照字符串（即存储的内容）
  render(captured: Captured): string { /* ... */ },

  // 将存储的快照字符串解析为结构化的期望值
  parseExpected(input: string): Expected { /* ... */ },

  // 比较捕获值与期望值，返回通过 / 失败结果及解析后的输出
  match(captured: Captured, expected: Expected): DomainMatchResult { /* ... */ },
}
```

#### `DomainMatchResult`

`match` 方法返回一个 `DomainMatchResult`，除了 `pass` 之外还有两个可选的字符串字段：

- **`resolved`** — 通过模板视角观察到的捕获值。当模板使用匹配模式（例如正则表达式）或省略细节时，解析字符串会采用这些匹配模式。模板未匹配到的地方，则使用字面量的捕获值。这既用作差异对比的实际一侧，也是在执行 `--update` 时写入的值。如果省略，则回退到 `render(capture(received))`。

- **`expected`** — 将存储的模板重新渲染为字符串。用作差异对比的期望一侧。如果省略，则回退到快照文件或内联快照中的原始快照字符串。

:::details 为什么 `Captured` 和 `Expected` 是单独的类型？

首次生成快照时，`render(captured)` 会生成一个纯字符串并存储起来。但一旦存储后，用户可以 **手动编辑** 它。用正则表达式模式替换字面值、放宽断言或添加特定领域的查询语法。编辑后，`parseExpected(input)` 将这个修改后的字符串解析成一种比 `capture` 生成的类型 _更丰富_ 的类型。

例如，在下面的 [键值适配器](#example-key-value-adapter) 中，`Captured` 值始终是 `string`，但 `Expected` 值可以是 `string | RegExp`：

```ts
type KVCaptured = Record<string, string>
type KVExpected = Record<string, string | RegExp>
```

这种不对称性正是 `--update` 能正确工作的原因：`match` 返回一个 `resolved` 字符串，它在更新变化的字面部分的同时 **保留** 了用户手动编辑的模式。如果双方是同一类型，就无法区分 “值的实际内容” 和 “用户选择断言的内容”，每次更新都会覆盖用户的匹配模式。

:::

### 从适配器构建匹配器 {#build-a-matcher-from-the-adapte}

使用 `expect.extend(...)` 注册自定义匹配器，并从 `vitest` 调用快照组合函数：

```ts [setup.ts]
import { expect, Snapshots } from 'vitest'

declare module 'vitest' {
  interface Matchers<R, T> {
    toMatchMyDomainSnapshot: () => R
    toMatchMyDomainInlineSnapshot: (inlineSnapshot?: string) => R
  }
}

expect.extend({
  toMatchMyDomainSnapshot(received: unknown) {
    return Snapshots.toMatchDomainSnapshot.call(this, myAdapter, received)
  },
  toMatchMyDomainInlineSnapshot(received: unknown, inlineSnapshot?: string) {
    return Snapshots.toMatchDomainInlineSnapshot.call(
      this,
      myAdapter,
      received,
      inlineSnapshot,
    )
  },
})
```

然后在测试中使用你的匹配器：

```ts
expect(value).toMatchMyDomainSnapshot()
expect(value).toMatchMyDomainInlineSnapshot(`key=value`)
```

### 示例：键值适配器 {#example-key-value-adapter}

一个最小化的适配器，将对象存储为 `key=value` 行，支持正则表达式匹配和子集键匹配（[完整源码](https://github.com/vitest-dev/vitest/blob/main/test/snapshots/test/fixtures/domain/basic.ts)）：

```ts [kv-adapter.ts]
import type { DomainMatchResult, DomainSnapshotAdapter } from 'vitest'

type KVCaptured = Record<string, string>
type KVExpected = Record<string, string | RegExp>

function renderKV(obj: Record<string, unknown>) {
  return `\n${Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('\n')}\n`
}

export const kvAdapter: DomainSnapshotAdapter<KVCaptured, KVExpected> = {
  name: 'kv',

  capture(received: unknown): KVCaptured {
    if (received && typeof received === 'object') {
      return Object.fromEntries(
        Object.entries(received).map(([k, v]) => [k, String(v)]),
      )
    }
    throw new TypeError('kv adapter expects a plain object')
  },

  render(captured: KVCaptured): string {
    return renderKV(captured)
  },

  parseExpected(input: string): KVExpected {
    const entries = input.trim().split('\n').map((line) => {
      const eq = line.indexOf('=')
      const key = line.slice(0, eq)
      const raw = line.slice(eq + 1)
      const value = (raw.startsWith('/') && raw.endsWith('/') && raw.length > 1)
        ? new RegExp(raw.slice(1, -1))
        : raw
      return [key, value]
    })
    return Object.fromEntries(entries)
  },

  match(captured: KVCaptured, expected: KVExpected): DomainMatchResult {
    const resolvedLines: string[] = []
    let pass = true

    for (const [key, actualValue] of Object.entries(captured)) {
      const expectedValue = expected[key]

      // 未断言键会被跳过（实现子集匹配）
      if (typeof expectedValue === 'undefined') {
        continue
      }

      // 保留匹配模式用于标准化差异比较和局部更新
      if (expectedValue instanceof RegExp && expectedValue.test(actualValue)) {
        resolvedLines.push(`${key}=/${expectedValue.source}/`)
        continue
      }

      resolvedLines.push(`${key}=${actualValue}`)
      pass &&= actualValue === expectedValue
    }

    return {
      pass,
      message: pass ? undefined : 'KV entries do not match',
      resolved: `\n${resolvedLines.join('\n')}\n`,
      expected: `\n${renderKV(expected)}\n`,
    }
  },
}
```

```ts [setup.ts]
import { expect, Snapshots } from 'vitest'
import { kvAdapter } from './kv-adapter'

declare module 'vitest' {
  interface Matchers<R, T> {
    toMatchKvSnapshot: () => R
    toMatchKvInlineSnapshot: (inlineSnapshot?: string) => R
  }
}

expect.extend({
  toMatchKvSnapshot(received: unknown) {
    return Snapshots.toMatchDomainSnapshot.call(this, kvAdapter, received)
  },
  toMatchKvInlineSnapshot(received: unknown, inlineSnapshot?: string) {
    return Snapshots.toMatchDomainInlineSnapshot.call(this, kvAdapter, received, inlineSnapshot)
  },
})
```

```ts [example.test.ts]
import { expect, test } from 'vitest'

test('user data', () => {
  const user = { name: 'Alice', score: '42' }
  expect(user).toMatchKvSnapshot()
})

test('user data inline', () => {
  const user = { name: 'Alice', age: 100, score: '42' }
  expect(user).toMatchKvInlineSnapshot(`
    name=Alice
    score=/\\d+/
  `)
})
```

## 与 Jest 的区别 {#difference-from-jest}

Vitest 提供了与 [Jest](https://jestjs.io/docs/snapshot-testing) 几乎兼容的快照功能，除少数例外:

### 1. 快照文件中的注释标头不同 {#_1-comment-header-in-the-snapshot-file-is-different}

```diff
- // Jest Snapshot v1, https://goo.gl/fbAQLP
+ // Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html
```

这实际上不会影响功能，但在从 Jest 迁移时可能会影响提交差异。

### 2. `printBasicPrototype` 默认为 `false` {#_2-printbasicprototype-is-default-to-false}

Jest 和 Vitest的快照功能均基于 `pretty-format` 实现，但 Vitest 在 [`@vitest/pretty-format`](https://npmx.dev/package/@vitest/pretty-format) 基础上应用了自定义的快照默认配置。具体而言，Vitest将 `printBasicPrototype` 设为 `false` 以生成更简洁的快照输出，而 Jest 29.0.0 以下版本默认将该值设为 `true`。

```ts
import { expect, test } from 'vitest'

test('snapshot', () => {
  const bar = [
    {
      foo: 'bar',
    },
  ]

  // 在 Jest 中的输出格式
  expect(bar).toMatchInlineSnapshot(`
    Array [
      Object {
        "foo": "bar",
      },
    ]
  `)

  // 在 Vitest 中的输出格式
  expect(bar).toMatchInlineSnapshot(`
    [
      {
        "foo": "bar",
      },
    ]
  `)
})
```

我们相信这种预设有更好的可读性和开发体验。如果你仍然喜欢 Jest 的行为，可以通过以下方式更改配置：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    snapshotFormat: {
      printBasicPrototype: true,
    },
  },
})
```

### 3. 使用 V 形 `>` 而非冒号 `:` 作为自定义消息的分隔符 {#_3-chevron-is-used-as-a-separator-instead-of-colon-for-custom-messages}

当创建快照文件期间传递自定义消息时，Vitest 使用 V 形 `>` 作为分隔符而不是冒号 `:` 以提高自定义消息可读性。

对于以下示例测试代码：

```js
test('toThrowErrorMatchingSnapshot', () => {
  expect(() => {
    throw new Error('error')
  }).toThrowErrorMatchingSnapshot('hint')
})
```

在 Jest 中，快照将是：

```console
exports[`toThrowErrorMatchingSnapshot: hint 1`] = `"error"`;
```

在 Vitest 中，等效的快照将是：

```console
exports[`toThrowErrorMatchingSnapshot > hint 1`] = `[Error: error]`;
```

### 4. `toThrowErrorMatchingSnapshot` 和 `toThrowErrorMatchingInlineSnapshot` 的默认 `Error` 快照不同 {#_4-default-error-snapshot-is-different-for-tothrowerrormatchingsnapshot-and-tothrowerrormatchinginlinesnapshot}

```js
import { expect, test } from 'vitest'

test('snapshot', () => {
  // 在 Jest 和 Vitest 中
  expect(new Error('error')).toMatchInlineSnapshot(`[Error: error]`)

  // Jest 会对 `Error` 实例的 `Error.message` 生成快照
  // Vitest 则会输出与 toMatchInlineSnapshot 相同的值
  expect(() => {
    throw new Error('error')
  }).toThrowErrorMatchingInlineSnapshot(`"error"`) // [!code --]
}).toThrowErrorMatchingInlineSnapshot(`[Error: error]`) // [!code ++]
})
```
