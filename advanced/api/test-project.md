---
title: TestProject
---

# TestProject <Version>3.0.0</Version> {#testproject}

<<<<<<< HEAD
- **别名**：在 3.0.0 之前称为 `WorkspaceProject`

::: warning
本指南描述了高级的 Node.js API。如果我们只是想创建一个工作区，请遵循 [Workspace](/guide/workspace) 指南。
=======
::: warning
This guide describes the advanced Node.js API. If you just want to define projects, follow the ["Test Projects"](/guide/projects) guide.
>>>>>>> 7eae51ccf951498de39ec8f8bc8ef2202e8cbe84
:::

## name

名称是由用户分配或由 Vitest 解释的唯一字符串。如果用户没有提供名称，Vitest 会尝试加载项目根目录中的 `package.json` 并从中获取 `name` 属性。如果没有 `package.json`，Vitest 默认使用文件夹的名称。内联项目使用数字作为名称（转换为字符串）。

::: code-group
```ts [node.js]
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test')
vitest.projects.map(p => p.name) === [
  '@pkg/server',
  'utils',
  '2',
  'custom'
]
```
<<<<<<< HEAD
```ts [vitest.workspace.js]
export default [
  './packages/server', // 有 package.json，名称为 "@pkg/server"
  './utils', // 没有 package.json 文件
  {
    // 没有自定义名称
    test: {
      pool: 'threads',
    },
  },
  {
    // 自定义了名称
    test: {
      name: 'custom',
    },
  },
]
=======
```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      './packages/server', // has package.json with "@pkg/server"
      './utils', // doesn't have a package.json file
      {
        // doesn't customize the name
        test: {
          pool: 'threads',
        },
      },
      {
        // customized the name
        test: {
          name: 'custom',
        },
      },
    ],
  },
})
>>>>>>> 7eae51ccf951498de39ec8f8bc8ef2202e8cbe84
```
:::

::: info
<<<<<<< HEAD
如果 [根项目](/advanced/api/vitest#getroottestproject) 不是用户工作区的一部分，则不会解析其 `name`。
=======
If the [root project](/advanced/api/vitest#getroottestproject) is not part of user projects, its `name` will not be resolved.
>>>>>>> 7eae51ccf951498de39ec8f8bc8ef2202e8cbe84
:::

## vitest

`vitest` 引用全局的 [`Vitest`](/advanced/api/vitest) 进程。

## serializedConfig

这是测试进程接收的配置。Vitest 通过手动 [序列化配置](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/config/serializeConfig.ts)，删除了所有无法序列化的函数和属性。由于此值在测试和节点中都可用，因此其类型从主入口点导出。

```ts
import type { SerializedConfig } from 'vitest'

const config: SerializedConfig = vitest.projects[0].serializedConfig
```

::: warning
`serializedConfig` 属性是一个 getter。每次访问时，Vitest 都会重新序列化配置，以防配置被更改。这也意味着它总是返回一个不同的引用：

```ts
project.serializedConfig === project.serializedConfig // ❌
```
:::

## globalConfig

[`Vitest`](/advanced/api/vitest) 初始化时的测试配置。如果这是 [根项目](/advanced/api/vitest#getroottestproject)，`globalConfig` 和 `config` 将引用同一个对象。此配置对于无法在项目级别设置的值非常有用，例如 `coverage` 或 `reporters`。

```ts
import type { ResolvedConfig } from 'vitest/node'

vitest.config === vitest.projects[0].globalConfig
```

## config

这是项目的已解析测试配置。

## vite

这是项目的 [`ViteDevServer`](https://vite.dev/guide/api-javascript#vitedevserver)。所有项目都有自己的 Vite 服务器。

## browser

只有在浏览器中运行测试时才会设置此值。如果启用了 `browser`，但测试尚未运行，则此值为 `undefined`。如果我们需要检查项目是否支持浏览器测试，请使用 `project.isBrowserEnabled()` 方法。

::: warning
浏览器 API 更加实验性，并且不遵循 SemVer。浏览器 API 将与其余 API 分开标准化。
:::

## provide

```ts
function provide<T extends keyof ProvidedContext & string>(
  key: T,
  value: ProvidedContext[T],
): void
```

除了 [`config.provide`](/config/#provide) 字段外，还提供了一种向测试提供自定义值的方法。所有值在存储之前都通过 [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) 进行验证，但 `providedContext` 上的值本身不会被克隆。

::: code-group
```ts [node.js]
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test')
const project = vitest.projects.find(p => p.name === 'custom')
project.provide('key', 'value')
await vitest.start()
```
```ts [test.spec.js]
import { inject } from 'vitest'
const value = inject('key')
```
:::

这些值可以动态提供。测试中提供的值将在下次运行时更新。

::: tip
此方法也可用于 [全局设置文件](/config/#globalsetup)，以便在无法使用公共 API 的情况下使用：

```js
export default function setup({ provide }) {
  provide('wsPort', 3000)
}
```
:::

## getProvidedContext

```ts
function getProvidedContext(): ProvidedContext
```

返回上下文对象。每个项目还继承由 `vitest.provide` 设置的全局上下文。

```ts
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test')
vitest.provide('global', true)
const project = vitest.projects.find(p => p.name === 'custom')
project.provide('key', 'value')

// { global: true, key: 'value' }
const context = project.getProvidedContext()
```

::: tip
项目上下文值将始终覆盖根项目的上下文。
:::

## createSpecification

```ts
function createSpecification(
  moduleId: string,
  locations?: number[],
): TestSpecification
```

创建一个 [测试规范](/advanced/api/test-specification)，可用于 [`vitest.runTestSpecifications`](/advanced/api/vitest#runtestspecifications)。规范将测试文件限定到特定的 `project` 和测试 `locations`（可选）。测试 [位置](/advanced/api/test-case#location) 是源代码中定义测试的代码行。如果提供了位置，Vitest 将仅运行在这些行上定义的测试。请注意，如果定义了 [`testNamePattern`](/config/#testnamepattern)，则它也将被应用。

```ts
import { resolve } from 'node:path/posix'
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test')
const project = vitest.projects[0]
const specification = project.createSpecification(
  resolve('./example.test.ts'),
  [20, 40], // 可选的测试行
)
await vitest.runTestSpecifications([specification])
```

::: warning
`createSpecification` 期望传入已解析的 [模块 ID](/advanced/api/test-specification#moduleid)。它不会自动解析文件或检查文件系统中是否存在该文件。

另请注意，`project.createSpecification` 总是返回一个新实例。
:::

## isRootProject

```ts
function isRootProject(): boolean
```

检查当前项目是否为根项目。我们也可以通过调用 [`vitest.getRootProject()`](#getrootproject) 获取根项目。

## globTestFiles

```ts
function globTestFiles(filters?: string[]): {
  /**
   * 匹配过滤器的测试文件。
   */
  testFiles: string[]
  /**
   * 匹配过滤器的类型检查测试文件。除非 `typecheck.enabled` 为 `true`，否则此值为空。
   */
  typecheckTestFiles: string[]
}
```

全局匹配所有测试文件。此函数返回一个包含常规测试和类型检查测试的对象。

此方法接受 `filters`。过滤器只能是文件路径的一部分，与 [`Vitest`](/advanced/api/vitest) 实例上的其他方法不同：

```js
project.globTestFiles(['foo']) // ✅
project.globTestFiles(['basic/foo.js:10']) // ❌
```

::: tip
Vitest 使用 [fast-glob](https://www.npmjs.com/package/fast-glob) 来查找测试文件。`test.dir`、`test.root`、`root` 或 `process.cwd()` 定义了 `cwd` 选项。

此方法查看多个配置选项：

- `test.include`、`test.exclude` 用于查找常规测试文件
- `test.includeSource`、`test.exclude` 用于查找源代码中的测试
- `test.typecheck.include`、`test.typecheck.exclude` 用于查找类型检查测试
:::

## matchesTestGlob

```ts
function matchesTestGlob(
  moduleId: string,
  source?: () => string
): boolean
```

此方法检查文件是否为常规测试文件。它使用与 `globTestFiles` 相同的配置属性进行验证。

此方法还接受第二个参数，即源代码。这用于验证文件是否为源代码中的测试。如果我们为多个项目多次调用此方法，建议读取文件一次并直接传递。如果文件不是测试文件，但匹配 `includeSource` 全局匹配，Vitest 将同步读取文件，除非提供了 `source`。

```ts
import { resolve } from 'node:path/posix'
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test')
const project = vitest.projects[0]

project.matchesTestGlob(resolve('./basic.test.ts')) // true
project.matchesTestGlob(resolve('./basic.ts')) // false
project.matchesTestGlob(resolve('./basic.ts'), () => `
if (import.meta.vitest) {
  // ...
}
`) // 如果设置了 `includeSource`，则为 true
```

## import

<!--@include: ./import-example.md-->

使用 Vite 模块运行器导入文件。文件将通过提供的项目配置由 Vite 转换，并在单独的上下文中执行。请注意，`moduleId` 将相对于 `config.root`。

::: danger
`project.import` 重用 Vite 的模块图，因此使用常规导入导入同一模块将返回不同的模块：

```ts
import * as staticExample from './example.js'
const dynamicExample = await project.import('./example.js')

dynamicExample !== staticExample // ✅
```
:::

::: info
<<<<<<< HEAD
在内部，Vitest 使用此方法导入全局设置、自定义覆盖率提供者、工作区文件和自定义报告器，这意味着只要它们属于同一个 Vite 服务器，它们就共享相同的模块图。
=======
Internally, Vitest uses this method to import global setups, custom coverage providers and custom reporters, meaning all of them share the same module graph as long as they belong to the same Vite server.
>>>>>>> 7eae51ccf951498de39ec8f8bc8ef2202e8cbe84
:::

## onTestsRerun

```ts
function onTestsRerun(cb: OnTestsRerunHandler): void
```

这是 [`project.vitest.onTestsRerun`](/advanced/api/vitest#ontestsrerun) 的简写。它接受一个回调，当测试被安排重新运行时（通常是由于文件更改）将等待该回调。

```ts
project.onTestsRerun((specs) => {
  console.log(specs)
})
```

## isBrowserEnabled

```ts
function isBrowserEnabled(): boolean
```

如果此项目在浏览器中运行测试，则返回 `true`。

## close

```ts
function close(): Promise<void>
```

关闭项目及其所有相关资源。此方法只能调用一次；关闭的 Promise 会被缓存，直到服务器重新启动。如果需要再次使用资源，请创建一个新项目。

具体来说，此方法关闭 Vite 服务器，停止类型检查器服务，关闭浏览器（如果正在运行），删除保存源代码的临时目录，并重置提供的上下文。
