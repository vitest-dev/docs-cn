---
outline: [2, 3]
---

# Node API

::: warning
Vitest 暴露了实验性的私有 API。由于可能不遵循语义化版本规范（SemVer），因此可能会出现不兼容的更改，请在使用 Vitest 时锁定版本。
:::

## 启动 Vitest

你可以使用 Vitest 的 Node API 开始运行 Vitest 测试：

```js
import { startVitest } from 'vitest/node'

const vitest = await startVitest('test')

await vitest?.close()
```

如果测试可以启动，则 `startVitest` 函数返回 `Vitest` 实例。 如果出现以下情况之一，则返回 `undefined`：

- Vitest 未找到 `vite` 包 (通常与 Vitest 一起安装)
- 如果启用了 `coverage`，并且运行模式为 "test"，但并未安装 "coverage" 包（`@vitest/coverage-v8` 或 `@vitest/coverage-istanbul`）
- 如果未安装环境包 (`jsdom`/`happy-dom`/`@edge-runtime/vm`)

如果在运行期间返回 `undefined` 或者测试失败, Vitest 会将 `process.exitCode` 设置为 `1`。

如果未启用监视模式，Vitest 将会调用 `close` 方法。

如果启用了监视模式并且终端支持 TTY, 则 Vitest 会注册控制台快捷键。

你可以将过滤器列表作为第二个参数传递下去。Vitest 将仅运行包含其文件路径中至少一个传递字符串的测试。

此外，你可以使用第三个参数传递 CLI 参数，这将覆盖任何测试配置选项。

或者，你可以将完整的 Vite 配置作为第四个参数传递进去，这将优先于任何其他用户定义的选项。

运行测试后，您可以从 `state.getFiles` API 获取结果：

```ts
const vitest = await startVitest('test')

console.log(vitest.state.getFiles()) // [{ type: 'file', ... }]
```

自 Vitest 2.1 起，建议使用["Reported Tasks" API](/advanced/reporters#reported-tasks) 和 `state.getFiles`。今后，Vitest 将直接返回这些对象：

```ts
const vitest = await startVitest('test')

const [fileTask] = vitest.state.getFiles()
const testFile = vitest.state.getReportedEntity(fileTask)
```

## 创建 Vitest

你可以使用 `createVitest` 函数创建自己的 Vitest 实例. 它返回与 `startVitest` 相同的 `Vitest` 实例, 但不会启动测试，也不会验证已安装的包。

```js
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test', {
  watch: false,
})
```

## parseCLI

你可以使用此方法来解析 CLI 参数。它接受字符串（其中参数由单个空格分隔）或与 Vitest CLI 使用的格式相同的 CLI 参数的字符串数组。它返回一个过滤器和`选项`，你可以稍后将其传递给 `createVitest` 或 `startVitest` 方法。

```ts
import { parseCLI } from 'vitest/node'

parseCLI('vitest ./files.ts --coverage --browser=chrome')
```

## Vitest

Vitest 实例需要当前的测试模式。它可以是以下之一：

- 运行运行时测试时为 `test`
- 运行基准测试时为 `benchmark`
- 运行类型测试时为 `typecheck`

### 模式

#### test

测试模式仅会调用 `test` 或 `it` 中的函数，并在遇到 `bench` 时抛出错误。此模式使用配置中的 `include` 和 `exclude` 选项查找测试文件。

#### benchmark

基准测试模式会调用 `bench` 函数，并在遇到 `test` 或 `it` 时抛出错误。此模式使用配置中的 `benchmark.include` 和 `benchmark.exclude` 选项查找基准测试文件。

#### typecheck

类型检查模式不会*运行*测试。它仅分析类型并提供摘要信息。此模式使用配置中的 `typecheck.include` 和 `typecheck.exclude` 选项查找要分析的文件。

### start

你可以使用 `start` 方法运行测试或者基准测试。你还可以传递一个字符串数组以筛选测试文件。

### `provide`

Vitest 提供了 `provide` 方法，它是 `vitest.getRootTestProject().provide` 的简写形式。通过这个方法，你可以将值从主线程传递到测试中。所有值在存储之前都会通过 `structuredClone` 进行检查，但值本身不会被克隆。

要在测试中接收值，需要从 `vitest` entrypont 导入 `inject` 方法：

```ts
import { inject } from 'vitest'
const port = inject('wsPort') // 3000
```

为了提高类型安全性，我们鼓励您增强 `ProvidedContext` 的类型：

```ts
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test', {
  watch: false,
})
vitest.provide('wsPort', 3000)

declare module 'vitest' {
  export interface ProvidedContext {
    wsPort: number
  }
}
```

::: warning
在技术上来说，`provide` 是 [`TestProject`](#testproject) 的一个方法，因此它受限于特定的项目。然而，所有项目都从核心项目继承了值，这使得 `vitest.provide` 成为了一种普遍的方式来向测试传递值。
:::

::: tip
该方法同样适用于[全局配置文件](/config/#globalsetup)，在无法使用公共API的情况下。

```js
export default function setup({ provide }) {
  provide('wsPort', 3000)
}
```
:::

## TestProject <Version>3.0.0</Version> {#testproject}

- **别名**: `WorkspaceProject` before 3.0.0

### name

这个 name 是由用户指定的唯一字符串，或由 Vitest 解释得出。如果用户未提供名称，Vitest 会尝试在项目根目录加载 `package.json` 文件，并从中获取 `name` 属性作为 name 。若项目中不存在 `package.json` 文件，则 Vitest 默认使用文件夹的名字。对于内联项目，Vitest 使用数字（转换为字符串）作为 name 。

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
```ts [vitest.workspace.js]
export default [
  './packages/server', // package.json 中包含 "@pkg/server"
  './utils', // 没有 package.json 文件
  {
    // 不要自定义名称
    test: {
      pool: 'threads',
    },
  },
  {
    // 自定义名称
    test: {
      name: 'custom',
    },
  },
]
```
:::

### vitest

`vitest` 是指全局的 [`vitest`](#vitest) 进程。

### serializedConfig

所有测试都会接收到的测试配置。Vitest 手动[序列化配置](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/config/serializeConfig.ts)，通过移除所有无法序列化的函数和属性来实现。由于这个值在测试和 Node 环境中都可用，因此它从主入口点导出。

```ts
import type { SerializedConfig } from 'vitest'

const config: SerializedConfig = vitest.projects[0].serializedConfig
```

### globalConfig

`vitest` 初始化时所使用的测试配置。如果这是根项目，`globalConfig` 和 `config` 将引用同一个对象。这个配置对于不能在项目级别设置的值非常有用，比如 `coverage` 或 `reporters`。

```ts
import type { ResolvedConfig } from 'vitest/node'

vitest.config === vitest.projects[0].globalConfig
```

### config

这是项目的解析后的测试配置。

### vite

这是项目的 `ViteDevServer`。每个项目都有自己的 Vite 服务器。

### browser

此值仅在测试运行于浏览器中时才会被设置。如果启用了 `browser`，但测试尚未运行，这将为 `undefined`。如果您需要检查项目是否支持浏览器测试，请使用 `project.isBrowserSupported()` 方法。

::: warning
这个浏览器API尚在实验阶段，并不遵循语义化（SemVer）版本控制。浏览器API将会独立于其他API进行标准化。
:::

### provide

这是一种在 [`config.provide`](/config/#provide) 字段之外向测试提供自定义值的方法。所有值在存储之前都会通过 [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) 进行验证，但 `providedContext` 中的值本身不会被克隆。

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

这些值可以动态提供。在测试中提供的值将在下一次运行时更新。

### getProvidedContext

这将返回上下文对象。每个项目也会继承由 `vitest.provide` 设置的全局上下文。

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
项目上下文的值总是会覆盖全局的值。
:::

### createSpecification

创建一个测试规范，该规范可用于 `vitest.runFiles`。规范将测试文件限定在特定的 `project` 和（可选的）`pool` 中。

```ts
import { resolve } from 'node:path/posix'
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test')
const project = vitest.projects[0]
const specification = project.createSpecification(
  resolve('./basic.test.ts'),
  'threads', // 可选覆盖
)
await vitest.runFiles([specification], true)
```

::: warning
`createSpecification` 需要一个绝对文件路径。但是它不会解析文件或检查文件系统上是否存在该文件。
:::

### isRootProject

检查当前项目是否为根项目。我们也可以尝试调用 `vitest.getRootTestProject()` 来获取根项目。

根项目通常不运行任何测试，并且不包含在 `vitest.projects` 中，除非我们明确地将根配置包含在它们的工作空间中。

根项目的主要目标是设置全局配置。实际上，`rootProject.config` 直接引用了 `rootProject.globalConfig` 和 `vitest.config`。

### globTestFiles

匹配所有测试文件。这个函数返回一个包含常规测试和类型检查测试的对象：

```ts
interface GlobReturn {
  /**
   * 测试符合筛选条件的文件。
   */
  testFiles: string[]
  /**
   * 与筛选器匹配的类型检查测试文件。除非 `typecheck.enabled` 为 `true`，否则将为空。 
   */
  typecheckTestFiles: string[]
}
```

::: tip
Vitest 使用 [fast-glob](https://www.npmjs.com/package/fast-glob) 来查找测试文件。`test.dir`、`test.root`、`root` 或 `process.cwd()` 定义了 `cwd` 选项。

这个方法会查看几个配置选项：

- `test.include`、`test.exclude` 用于查找常规测试文件；
- `test.includeSource`、`test.exclude` 用于查找源代码中的测试；
- `test.typecheck.include`、`test.typecheck.exclude` 用于查找类型检查测试。
:::

### matchesTestGlob

此方法用于检查文件是否为常规测试文件。它使用与 `globTestFiles` 相同的配置属性进行验证。

此方法还接受第二个参数，即源代码。这用于验证文件是否为源代码中的测试。如果我们需要多次为多个项目调用此方法，建议先读取文件一次，然后直接传递源代码。

```ts
import { resolve } from 'node:path/posix'
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test')
const project = vitest.projects[0]

project.matchesTestGlob(resolve('./basic.test.ts')) // true
project.matchesTestGlob(resolve('./basic.ts')) // false
project.matchesTestGlob(resolve('./basic.ts'), `
if (import.meta.vitest) {
  // ...
}
`) // 如果设置了 `includeSource` 则为 true
```

### close

关闭项目及其所有相关资源。此操作只能调用一次；关闭的承诺会被缓存，直到服务器重新启动。如果再次需要资源，请创建一个新项目。

具体来说，这个方法会关闭 Vite 服务器，停止类型检查服务，如果浏览器正在运行则关闭它，删除存放源代码的临时目录，并重置提供的上下文。
