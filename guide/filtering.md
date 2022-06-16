# 筛选测试

用于测试用例的筛选(filtering)、超时(timeouts)、并发(concurrent)。

## CLI

可以使用 CLI 按名称筛选测试文件：

```bash
$ vitest basic
```

将只执行包含 `basic` 的测试文件，例如：

```
basic.test.ts
basic-foo.test.ts
```

## 指定延时

您可以选择将超时阈值（以毫秒为单位）作为第三个参数传递给测试用例。默认值为 5 秒。

```ts
import { test } from 'vitest'
test('name', async() => { /* ... */ }, 1000)
```

Hooks 也可以接收超时阈值，默认值为 5 秒。

```ts
import { beforeAll } from 'vitest'
beforeAll(async() => { /* ... */ }, 1000)
```

## 跳过测试用例

使用 `.skip` 以避免运行某些套件或测试

```ts
import { assert, describe, it } from 'vitest'
describe.skip('skipped suite', () => {
  it('test', () => {
    // 已跳过此用例，无错误
    assert.equal(Math.sqrt(4), 3)
  })
})
describe('suite', () => {
  it.skip('skipped test', () => {
    // 已跳过此用例，无错误
    assert.equal(Math.sqrt(4), 3)
  })
})
```

## 选择要运行的测试用例

使用 `.only` 仅运行某些测试用例

```ts
import { assert, describe, it } from 'vitest'
// 仅运行此用例（以及标记为 Only 的其他用例）
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
    // 仅运行此用例（以及标记为 Only 的其他用例）
    assert.equal(Math.sqrt(4), 2)
  })
})
```

## 未实现的测试用例

使用 `.todo` 留存将要实施的测试用例的待办事项

```ts
import { describe, it } from 'vitest'
// 此用例的报告中将显示一个条目
describe.todo('unimplemented suite')
// 此测试的报告中将显示一个条目
describe('suite', () => {
  it.todo('unimplemented test')
})
```
