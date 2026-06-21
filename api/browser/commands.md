---
title: 命令 | 浏览器模式
outline: deep
---

# 命令

命令是一个函数，它调用服务器上的另一个函数并将结果传递回浏览器。Vitest 公开了几个可以在浏览器测试中使用的内置命令。

## 内置命令 {#built-in-commands}

### 文件处理 {#files-handling}

在浏览器测试中，可借助 `readFile`、`writeFile` 与 `removeFile` 三个 API 完成文件操作。自 Vitest 3.2 起，所有路径均以 [project](/guide/projects) 根目录为基准解析（根目录默认为 `process.cwd()`，可手动重写）；旧版本则以当前测试文件所在目录为基准。

默认情况下，Vitest 使用 `utf-8` 编码，但你可以使用选项覆盖它。

::: tip
出于安全原因，内置的文件命令遵循 Vite 的 [`server.fs`](https://vitejs.dev/config/server-options.html#server-fs-allow) 限制。

`writeFile` 和 `removeFile` 还需要通过 [`browser.api.allowWrite`](/config/browser/api) 和 [`api.allowWrite`](/config/api#api-allowwrite) 获得写入权限。
:::

```ts
import { server } from 'vitest/browser'

const { readFile, writeFile, removeFile } = server.commands

it('handles files', async () => {
  const file = './test.txt'

  await writeFile(file, 'hello world')
  const content = await readFile(file)

  expect(content).toBe('hello world')

  await removeFile(file)
})
```

## CDP Session

Vitest 通过 `vitest/browser` 中导出的 `cdp` 方法访问原始 Chrome DevTools 协议。它主要用于库作者在其基础上构建工具。

```ts
import { cdp } from 'vitest/browser'

const input = document.createElement('input')
document.body.appendChild(input)
input.focus()

await cdp().send('Input.dispatchKeyEvent', {
  type: 'keyDown',
  text: 'a',
})

expect(input).toHaveValue('a')
```

::: warning
CDP session 仅适用于 `playwright` provider，并且仅在使用 `chromium` 浏览器时有效。有关详细信息，请参阅 playwright 的 [`CDPSession`](https://playwright.dev/docs/api/class-cdpsession) 文档。

CDP 是一个特权调试 API。仅当通过 [`browser.api.allowWrite`](/config/browser/api#api-allowwrite)、[`browser.api.allowExec`](/config/browser/api#api-allowexec)、[`api.allowWrite`](/config/api#api-allowwrite) 和 [`api.allowExec`](/config/api#api-allowexec) 启用浏览器 API 写入和执行操作时，该 API 才可用。
:::

## 自定义命令 {#custom-commands}

我们也可以通过 [`browser.commands`](/config/browser/commands) 配置选项添加自己的命令。如果我们正在开发一个库，可以通过插件内的 `config` 钩子来提供它们：

```ts
import type { Plugin } from 'vitest/config'
import type { BrowserCommand } from 'vitest/node'

const myCustomCommand: BrowserCommand<[arg1: string, arg2: string]> = ({
  testPath,
  provider
}, arg1, arg2) => {
  if (provider.name === 'playwright') {
    console.log(testPath, arg1, arg2)
    return { someValue: true }
  }

  throw new Error(`provider ${provider.name} is not supported`)
}

export default function BrowserCommands(): Plugin {
  return {
    name: 'vitest:custom-commands',
    config() {
      return {
        test: {
          browser: {
            commands: {
              myCustomCommand,
            }
          }
        }
      }
    }
  }
}
```

然后，你可以通过从 `vitest/browser` 导入它，在测试中调用它：

```ts
import { commands } from 'vitest/browser'
import { expect, test } from 'vitest'

test('custom command works correctly', async () => {
  const result = await commands.myCustomCommand('test1', 'test2')
  expect(result).toEqual({ someValue: true })
})

// 如果你正在使用 TypeScript，你可以扩展类型声明：

declare module 'vitest/browser' {
  interface BrowserCommands {
    myCustomCommand: (arg1: string, arg2: string) => Promise<{
      someValue: true
    }>
  }
}
```

::: warning
如果自定义命令具有相同的名称，则它们将覆盖内置命令。
:::
<!-- TODO: translation -->
::: warning Security
Custom commands run in the Vitest Node process and are callable from browser test code through Vitest's browser RPC connection. They can access local files, environment variables, network services, databases, shell commands, and other Node APIs.

Vitest's built-in file commands validate paths against Vite's [`server.fs`](https://vite.dev/config/server-options#server-fs-allow) restrictions and separately check whether writes are allowed. Custom commands do not automatically inherit these protections. If a custom command accepts browser-provided input and uses it to read, write, delete, execute, or expose local resources, validate that input before using it.

For file reads or fixture loading, use `isFileLoadingAllowed` from `vitest/node` or an explicit allowlist. For writes and deletes, also require an explicit mutation policy, such as [`browser.api.allowWrite`](/config/browser/api#api-allowwrite), [`api.allowWrite`](/config/api#api-allowwrite), and a command-specific allowed directory. For commands that execute code, shell commands, or project scripts, also check [`browser.api.allowExec`](/config/browser/api#api-allowexec) and [`api.allowExec`](/config/api#api-allowexec).

For example, if you create your own file-writing command instead of using Vitest's built-in `writeFile`, apply the same checks:

```ts
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { normalizePath } from 'vite'
import { isFileLoadingAllowed } from 'vitest/node'
import type { BrowserCommand } from 'vitest/node'

function assertFileAccess(path: string, project: any) {
  if (
    !isFileLoadingAllowed(project.vite.config, path)
    && !isFileLoadingAllowed(project.vitest.vite.config, path)
  ) {
    throw new Error(`Access denied to "${path}".`)
  }
}

function assertWrite(project: any) {
  if (!project.config.browser.api.allowWrite || !project.vitest.config.api.allowWrite) {
    throw new Error('Writing files is disabled.')
  }
}

export const myWriteFileCommand: BrowserCommand<[path: string, content: string]> = async (
  { project },
  path,
  content,
) => {
  assertWrite(project)

  const file = resolve(project.config.root, path)
  assertFileAccess(normalizePath(file), project)

  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, content)
}
```

:::

### Recording trace markers

Custom commands can record [trace markers](/api/browser/context#mark) for the test that triggered them through `context.mark`. This is the server-side equivalent of `page.mark` and helps annotate the [trace view](/guide/browser/trace-view) with custom actions performed inside a command.

```ts
import type { BrowserCommand } from 'vitest/node'

export const uploadFixture: BrowserCommand<[name: string]> = async (
  context,
  name,
) => {
  await context.mark(`upload start: ${name}`, { kind: 'action' })
  // ... do server-side work
  await context.mark(`upload done: ${name}`, { kind: 'action' })
}
```

`context.mark` is a no-op when browser tracing is not enabled or no test is currently running in the session. Unlike `page.mark`, it does not accept a callback form.

### 自定义 `playwright` 命令  {#custom-playwright-commands}

Vitest 在命令上下文中公开了几个`playwright`特定属性。

- `page`引用包含测试 iframe 的完整页面。这是协调器 HTML，为避免出现问题，最好不要碰它。
- `frame` 是一个异步方法，用于解析测试器 [`Frame`](https://playwright.dev/docs/api/class-frame)。它的 API 与 `page` 类似，但不支持某些方法。如果你需要查询元素，应优先使用 `context.iframe` 代替，因为它更稳定、更快速。
- `iframe` 是一个 [`FrameLocator`](https://playwright.dev/docs/api/class-framelocator)，用于查询页面上的其他元素。
- `context` 是指唯一的[BrowserContext](https://playwright.dev/docs/api/class-browsercontext)。

```ts
import { BrowserCommand } from 'vitest/node'

export const myCommand: BrowserCommand<[string, number]> = async (
  ctx,
  arg1: string,
  arg2: number
) => {
  if (ctx.provider.name === 'playwright') {
    const element = await ctx.iframe.findByRole('alert')
    const screenshot = await element.screenshot()
    // 对截图进行一些操作。
    return difference
  }
}
```

### 自定义 `webdriverio` 命令 {#custom-webdriverio-commands}

Vitest 在上下文对象上公开了一些 `webdriverio` 特有属性。

- `browser` 是 `WebdriverIO.Browser` API.

Vitest 会在每条命令执行前自动调用 `browser.switchFrame`，将 `webdriver` 上下文切换至测试 iframe ，因此 `$` 与 `$$` 获取的是 iframe 内的元素，而非 orchestrator 中的元素；非 webdriver API 则仍作用于父级 frame。
