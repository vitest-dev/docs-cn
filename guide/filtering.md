---
title: 测试筛选 | 指南
---

# 测试筛选 {#test-filtering}

筛选、超时和测试套件的并发。

## CLI {#cli}

你可以使用 CLI 按名称筛选测试文件：

```bash
$ vitest basic
```

将只执行包含 `basic` 的测试文件，例如：

```
basic.test.ts
basic-foo.test.ts
basic/foo.test.ts
```

你还可以使用 `-t, --testNamePattern <pattern>` 选项按全名过滤测试。当你想按文件内定义的名称而不是文件名本身进行过滤时，这将非常有用。

自 Vitest 3 起，也可以通过文件名和行号来指定测试：

```bash
$ vitest basic/foo.test.ts:10
```

::: warning
请注意，Vitest 需要完整的文件名才能使此功能正常工作。文件名可以是相对于当前工作目录的路径，也可以是绝对文件路径。

```bash
$ vitest basic/foo.js:10 # ✅
$ vitest ./basic/foo.js:10 # ✅
$ vitest /users/project/basic/foo.js:10 # ✅
$ vitest foo:10 # ❌
$ vitest ./basic/foo:10 # ❌
```

目前，Vitest 还不支持范围：

```bash
$ vitest basic/foo.test.ts:10, basic/foo.test.ts:25 # ✅
$ vitest basic/foo.test.ts:10-25 # ❌
```
:::

## 指定超时阈值 {#specifying-a-timeout}

你可以选择将超时阈值（以毫秒为单位）作为第三个参数传递给测试。默认值为 [5 秒](/config/#testtimeout)。

```ts
import { test } from 'vitest'

test('name', async () => {
  /* ... */
}, 1000)
```

Hooks 也可以接收超时阈值，默认值为 5 秒。

```ts
import { beforeAll } from 'vitest'

beforeAll(async () => {
  /* ... */
}, 1000)
```

## 跳过测试套件和测试 {#skipping-suites-and-tests}

使用 `.skip` 以避免运行某些测试套件或测试

```ts
import { assert, describe, it } from 'vitest'

describe.skip('skipped suite', () => {
  it('test', () => {
    // 已跳过此测试套件，无错误
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('suite', () => {
  it.skip('skipped test', () => {
    // 已跳过此测试，无错误
    assert.equal(Math.sqrt(4), 3)
  })
})
```

## 选择要运行的测试套件和测试 {#selecting-suites-and-tests-to-run}

使用 `.only` 仅运行某些测试套件或测试

```ts
import { assert, describe, it } from 'vitest'

// 仅运行此测试套件（以及标记为 Only 的其他测试套件）
describe.only('suite', () => {
  it('test', () => {
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('another suite', () => {
  it('skipped test', () => {
    // 已跳过测试，因为测试在 Only 模式下运行
    assert.equal(Math.sqrt(4), 3)
  })

  it.only('test', () => {
    // 仅运行此测试（以及标记为 Only 的其他测试）
    assert.equal(Math.sqrt(4), 2)
  })
})
```

运行 Vitest 时指定文件过滤器和行号：

```shell
vitest ./test/example.test.ts:5
```

```ts:line-numbers
import { assert, describe, it } from 'vitest'

describe('suite', () => {
  // 仅运行此测试
  it('test', () => {
    assert.equal(Math.sqrt(4), 3)
  })
})
```

## 未实现的测试套件和测试 {#unimplemented-suites-and-tests}

使用 `.todo` 留存将要实施的测试套件和测试的待办事项

```ts
import { describe, it } from 'vitest'

// 此测试套件的报告中将显示一个条目
describe.todo('unimplemented suite')

// 此测试的报告中将显示一个条目
describe('suite', () => {
  it.todo('unimplemented test')
})
```
