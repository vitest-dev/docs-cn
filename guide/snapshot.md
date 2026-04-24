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

Vitest stores a serialized representation of the received value. Snapshot rendering is powered by [`@vitest/pretty-format`](https://npmx.dev/package/@vitest/pretty-format). [`snapshotFormat`](/config/snapshotformat) allows configuring general snapshot formatting behavior in Vitest. For further customization, you can implement your own [custom serializers](#custom-serializer) or [custom snapshot matchers](#custom-snapshot-matchers).

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

它将与 `./test/basic.output.html` 的内容进行比较。并且可以用 `--update` 标志写回。

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
<!-- TODO: translation -->
## ARIA Snapshots <Badge type="warning">experimental</Badge> <Version>4.1.4</Version>

ARIA snapshots capture the accessibility tree of a DOM element and compare it against a stored template. Based on [Playwright's ARIA snapshots](https://playwright.dev/docs/aria-snapshots), they provide a semantic alternative to visual regression testing — asserting structure and meaning rather than pixels.

For example, given this HTML:

```html
<nav aria-label="Main">
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
```

You can assert its accessibility tree:

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

See the dedicated [ARIA Snapshots guide](/guide/browser/aria-snapshots) for syntax details, retry behavior in Browser Mode, and file vs. inline snapshot examples. See [`toMatchAriaSnapshot`](/api/expect#tomatcharisnapshot) and [`toMatchAriaInlineSnapshot`](/api/expect#tomatchariainlinesnapshot) for the full API reference.

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
    return val && Object.prototype.hasOwnProperty.call(val, 'foo')
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
} satisfies SnapshotSerializer
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
<!-- TODO: translation -->
## Custom Snapshot Matchers <Badge type="warning">experimental</Badge> <Version>4.1.3</Version> {#custom-snapshot-matchers}

You can build custom snapshot matchers using the composable functions exposed on `Snapshots` from `vitest`. These let you transform values before snapshotting while preserving full snapshot lifecycle support (creation, update, inline rewriting).

```ts
import { expect, test, Snapshots } from 'vitest'

const { toMatchFileSnapshot, toMatchInlineSnapshot, toMatchSnapshot } = Snapshots

expect.extend({
  toMatchTrimmedSnapshot(received: string) {
    return toMatchSnapshot.call(this, received.slice(0, 10))
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

The composables return `{ pass, message }` so you can further customize the error:

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
For inline snapshot matchers, the snapshot argument must be the last parameter (or second-to-last when using property matchers). Vitest rewrites the last string argument in the source code, so custom arguments before the snapshot work, but custom arguments after it are not supported.
:::

::: tip
File snapshot matchers must be `async` — `toMatchFileSnapshot` returns a `Promise`. Remember to `await` the result in the matcher and in your test.
:::

::: warning
When custom inline snapshot matcher is aynchronous, Vitest cannot automatically infer the call location for inline snapshot rewriting. You must capture the call site by setting the `'error'` flag on the chai assertion object:

```ts
import { expect, chai, Snapshots } from 'vitest'

const { toMatchInlineSnapshot } = Snapshots

expect.extend({
  async toMatchTransformedInlineSnapshot(received: string, inlineSnapshot?: string) {
    // capture call site synchronously at the top of matcher implementation
    chai.util.flag(this.assertion, 'error', new Error())
    const transformed = await transform(received)
    return toMatchInlineSnapshot.call(this, transformed, inlineSnapshot)
  },
})
```

:::

For TypeScript, extend the `Assertion` interface:

```ts
import 'vitest'

declare module 'vitest' {
  interface Assertion<T = any> {
    toMatchTrimmedSnapshot: (length: number) => T
    toMatchTrimmedInlineSnapshot: (inlineSnapshot?: string) => T
    toMatchTrimmedFileSnapshot: (file: string) => Promise<T>
  }
}
```

::: tip
See [Extending Matchers](/guide/extending-matchers) for more on `expect.extend` and custom matcher conventions.
:::
<!-- TODO: translation -->
## Custom Snapshot Domain <Badge type="warning">experimental</Badge> <Version>4.1.4</Version> {#custom-snapshot-domain}

Custom serializers control how values are _rendered_ into snapshot strings, but comparison is still string equality. A **domain snapshot adapter** goes further: it owns the entire comparison pipeline for a custom matcher, including how to capture a value, render it, parse a stored snapshot, and match them semantically.

### The adapter interface

A domain adapter implements four methods and is generic over two types — `Captured` (what the value actually is) and `Expected` (what the stored snapshot parses into):

```ts
import type { DomainMatchResult, DomainSnapshotAdapter } from '@vitest/snapshot'

const myAdapter: DomainSnapshotAdapter<Captured, Expected> = {
  name: 'my-domain',

  // Extract structured data from the received value
  capture(received: unknown): Captured { /* ... */ },

  // Render captured data as the snapshot string (what gets stored)
  render(captured: Captured): string { /* ... */ },

  // Parse a stored snapshot string into a structured expected value
  parseExpected(input: string): Expected { /* ... */ },

  // Compare captured vs expected, return pass/fail and resolved output
  match(captured: Captured, expected: Expected): DomainMatchResult { /* ... */ },
}
```

#### `DomainMatchResult`

The `match` method returns a `DomainMatchResult` with two optional string fields beyond `pass`:

- **`resolved`** — the captured value viewed through the template's lens. Where the template uses patterns (e.g. regexes) or omits details, the resolved string adopts those patterns. Where the template doesn't match, it uses literal captured values. This serves as both the actual side of diffs and the value written on `--update`. When omitted, falls back to `render(capture(received))`.

- **`expected`** — the stored template re-rendered as a string. Used as the expected side of diffs. When omitted, falls back to the raw snapshot string from the snap file or inline snapshot.

:::details Why are `Captured` and `Expected` separate types?

When a snapshot is first generated, `render(captured)` produces a plain string that gets stored. But once stored, the user can **hand-edit** it — replacing literals with regex patterns, relaxing assertions, or adding domain-specific query syntax. After editing, `parseExpected(input)` parses this modified string into a type that is _richer_ than what `capture` produces.

For example, in the [key-value adapter](#example-key-value-adapter) below, `Captured` values are always `string`, but `Expected` values can be `string | RegExp`:

```ts
type KVCaptured = Record<string, string>
type KVExpected = Record<string, string | RegExp>
```

This asymmetry is what makes `--update` work correctly: `match` returns a `resolved` string that updates changed literal parts while **preserving** the user's hand-edited patterns. If both sides were the same type, there would be no way to distinguish "what the value actually is" from "what the user chose to assert" — and every update would overwrite the user's patterns.

:::

### Build a matcher from the adapter

Register a custom matcher with `expect.extend(...)` and call the snapshot composables from `vitest`:

```ts [setup.ts]
import { expect, Snaphsots } from 'vitest'

expect.extend({
  toMatchMyDomainSnapshot(received: unknown) {
    return Snaphsots.toMatchDomainSnapshot.call(this, myAdapter, received)
  },
  toMatchMyDomainInlineSnapshot(received: unknown, inlineSnapshot?: string) {
    return Snaphsots.toMatchDomainInlineSnapshot.call(
      this,
      myAdapter,
      received,
      inlineSnapshot,
    )
  },
})
```

Then use your matcher in tests:

```ts
expect(value).toMatchMyDomainSnapshot()
expect(value).toMatchMyDomainInlineSnapshot(`key=value`)
```

### Example: key-value adapter

A minimal adapter that stores objects as `key=value` lines, with regex pattern and subset key match support ([full source](https://github.com/vitest-dev/vitest/blob/main/test/snapshots/test/fixtures/domain/basic.ts)):

```ts [kv-adapter.ts]
import type { DomainMatchResult, DomainSnapshotAdapter } from '@vitest/snapshot'

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

      // non-asserted keys are skipped (works as subset match)
      if (typeof expectedValue === 'undefined') {
        continue
      }

      // preserve matched pattern for normalized diff and partial update
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

#### 1. 快照文件中的注释标头不同 {#_1-comment-header-in-the-snapshot-file-is-different}

```diff
- // Jest Snapshot v1, https://goo.gl/fbAQLP
+ // Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html
```

这实际上不会影响功能，但在从 Jest 迁移时可能会影响提交差异。

#### 2. `printBasicPrototype` 默认为 `false` {#_2-printbasicprototype-is-default-to-false}

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

#### 3. 使用 V 形 `>` 而非冒号 `:` 作为自定义消息的分隔符 {#_3-chevron-is-used-as-a-separator-instead-of-colon-for-custom-messages}

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

#### 4. `toThrowErrorMatchingSnapshot` 和 `toThrowErrorMatchingInlineSnapshot` 的默认 `Error` 快照不同 {#_4-default-error-snapshot-is-different-for-tothrowerrormatchingsnapshot-and-tothrowerrormatchinginlinesnapshot}

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
