# 模拟文件系统 {#mocking-the-file-system}

模拟文件系统可以确保测试不依赖于实际的文件系统，从而使测试更加可靠和可预测。这种隔离有助于避免之前测试产生的副作用。它允许测试错误条件和边缘情况，而这些情况在实际文件系统中可能难以或无法复制，例如权限问题、磁盘满场景或读写错误。

Vitest 没有开箱即用地提供任何文件系统模拟 API。你可以使用 `vi.mock` 手动模拟 `fs` 模块，但这很难维护。相反，我们推荐使用 [`memfs`](https://www.npmjs.com/package/memfs) 来为你完成这项工作。`memfs` 创建一个内存中的文件系统，它模拟文件系统操作而不触及实际磁盘。这种方法快速且安全，避免了对真实文件系统的任何潜在副作用。

## 示例 {#example}

为了自动将每个 `fs` 调用重定向到 `memfs`，你可以在项目的根目录下创建 `__mocks__/fs.cjs` 和 `__mocks__/fs/promises.cjs` 文件：

::: code-group
```ts [__mocks__/fs.cjs]
// 我们可以使用 `import`，但是那样的话
// 每个导出都需要明确定义

const { fs } = require('memfs')

module.exports = fs
```

```ts [__mocks__/fs/promises.cjs]
// 我们可以使用 `import`，但是那样的话
// 每个导出都需要明确定义

const { fs } = require('memfs')

module.exports = fs.promises
```
:::

```ts [read-hello-world.js]
import { readFileSync } from 'node:fs'

export function readHelloWorld(path) {
  return readFileSync(path, 'utf-8')
}
```

```ts [hello-world.test.js]
import { fs, vol } from 'memfs'
import { beforeEach, expect, it, vi } from 'vitest'
import { readHelloWorld } from './read-hello-world.js'

// 让 Vitest 使用 __mocks__ 文件夹中的 fs 模拟
// 若需始终模拟 fs，可在配置文件中设置
vi.mock('node:fs')
vi.mock('node:fs/promises')

beforeEach(() => {
  // 重置内存文件系统状态
  vol.reset()
})

it('should return correct text', () => {
  const path = '/hello-world.txt'
  fs.writeFileSync(path, 'hello world')

  const text = readHelloWorld(path)
  expect(text).toBe('hello world')
})

it('can return a value multiple times', () => {
  // 可使用 vol.fromJSON 定义多个文件
  vol.fromJSON(
    {
      './dir1/hw.txt': 'hello dir1',
      './dir2/hw.txt': 'hello dir2',
    },
    // 默认当前工作目录
    '/tmp',
  )

  expect(readHelloWorld('/tmp/dir1/hw.txt')).toBe('hello dir1')
  expect(readHelloWorld('/tmp/dir2/hw.txt')).toBe('hello dir2')
})
```
