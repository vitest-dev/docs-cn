# 配置 Vitest

## 配置

`vitest` 将读取你的项目根目录的 `vite.config.ts` 文件以匹配插件并设置为你的 Vite 应用程序。如果你想使用不同的配置进行测试，你可以：

- 创建 `vitest.config.ts`，优先级更高。
- 将 `--config` 选项传递给 CLI，例如 `vitest --config ./path/to/vitest.config.ts` 。
- 在 `defineConfig` 中使用 `process.env.VITEST` 或 `mode` 属性（默认值是 `test`）在 `vite.config.ts` 中有条件的应用不同的配置。

要配置 `vitest` 本身，请在你的 Vite 配置中添加 `test` 属性。如果你使用 `vite` 的 `defineConfig` 你还需要将 [三斜线指令](https://www.tslang.cn/docs/handbook/triple-slash-directives.html#-reference-types-) 写在配置文件的顶部。

使用 `vite` 的 `defineConfig` 可以参考下面的格式：

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ...
  },
})
```

使用 `vitest` 的 `defineConfig` 可以参考下面的格式：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ...
  },
})
```

如果有需要，你可以获取到 Vitest 的默认选项以扩展它们：

```ts
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'packages/template/*'],
  },
})
```

## 选项

### include

- **类型:** `string[]`
- **默认值:** `['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']`

匹配包含测试文件的 glob 规则

### exclude

- **类型:** `string[]`
- **默认值:** `['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']`

匹配排除测试文件的 glob 规则

### deps

- **类型:** `{ external?, inline? }`

对依赖关系进行内联或外联的处理

#### deps.external

- **类型:** `(string | RegExp)[]`
- **默认值:** `['**\/node_modules\/**']`

Externalize 意味着 Vite 会绕过包到原生 Node.js 中。Vite 的转换器和解析器不会应用外部依赖项，因此不会支持重新加载时的热更新。通常，`node_modules` 下的包是外部依赖。

#### deps.inline

- **类型:** `(string | RegExp)[]`
- **默认值:** `[]`

Vite 将会处理的内联模块。这有助于处理以 ESM 格式（Node 无法处理）发布 `.js` 的包。

#### deps.fallbackCJS

- **类型** `boolean`
- **默认值:** `false`

当一个依赖项是有效的 ESM 包时，将会尝试根据路径猜测 cjs 版本。

如果包在 ESM 和 CJS 模式下具有不同的逻辑，可能会导致一些错误的产生。

#### deps.interopDefault

- **类型:** `boolean`
- **默认值:** `true`

将 CJS 模块的默认值视为命名导出。

### globals

- **类型:** `boolean`
- **默认值:** `false`

默认情况下，`vitest` 不显式提供全局 API。如果你更倾向于使用类似 jest 中的全局 API，可以将 `--globals` 选项传递给 CLI 或在配置中添加 `globals: true`。

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
```

为了可以让全局 API 支持 Typescript，请将 `vitest/globals` 添加到 `tsconfig.json` 中的 `types` 选项中

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

如果你已经在项目中使用 [`unplugin-auto-import`](https://github.com/antfu/unplugin-vue-components)，你也可以直接用它来自动导入这些 API。

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vitest'],
      dts: true, // 生成 TypeScript 声明
    }),
  ],
})
```

### environment

- **类型:** `'node' | 'jsdom' | 'happy-dom'`
- **默认值:** `'node'`

用于测试的环境。

Vitest 中的默认测试环境是一个 Node.js 环境。如果你正在构建 Web 端应用程序，你可以使用 [`jsdom`](https://github.com/jsdom/jsdom) 或 [`happy-dom`](https://github.com/capricorn86/happy-dom) 这种类似浏览器(browser-like)的环境来替代 Node.js。

你可以通过在文件顶部添加包含 `@vitest-environment` 的文档块或注释，为某个测试文件中的所有测试指定环境：

文档块格式:

```js
/**
 * @vitest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

注释格式:

```js
// @vitest-environment happy-dom

test('use happy-dom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

为了与 Jest 兼容，还存在一个配置 `@jest-environment`：

```js
/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

### update

- **类型:** `boolean`
- **默认值:** `false`

是否更新快照文件

### watch

- **Type:** `boolean`
- **Default:** `true`

启动监听模式（将会在你的文件变动时自动运行相关测试）

### root

- **Type:** `string`

项目的根目录

### reporters

- **Type:** `Reporter | Reporter[]`
- **Default:** `'default'`

用于输出的自定义 reporters 。 Reporters 可以是 [一个 Reporter 实例](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/types/reporter.ts) 或选择内置的 reporters 字符串：

- `'default'` - 当他们经过测试套件
- `'verbose'` - 保持完整的任务树可见
- `'dot'` - 将每个任务显示为一个点
- `'junit'` - JUnit XML 报告器
- `'json'` - 给出一个简单的 JSON 总结
- 自定义报告的路径 (例如 `'./path/to/reporter.ts'`, `'@scope/reporter'`)

### outputFile

- **类型:** `string | Record<string, string>`

当指定 `--reporter=json` 或 `--reporter=junit` 时，将测试结果写入一个文件。

如果通过的是对象而不是字符串，你可以在使用多个报告器时定义单独的输出。

### threads

- **类型:** `boolean`
- **默认值:** `true`

通过使用 [tinypool](https://github.com/Aslemammad/tinypool)（[Piscina](https://github.com/piscinajs/piscina) 的轻量级分支）进行启用多线程。

### maxThreads

- **类型:** `number`
- **默认值:** 可用的 CPU 数量

最大线程数。

### minThreads

- **类型:** `number`
- **默认值:** 可用的 CPU 数量

最小线程数。

### testTimeout

- **类型:** `number`
- **默认值:** `5000`

测试的默认超时时间（以毫秒为单位）。

### hookTimeout

- **类型:** `number`
- **默认值:** `5000`

钩子(hook)的默认超时时间（以毫秒为单位）。

### silent

- **类型:** `boolean`
- **默认值:** `false`

静默模式。

### setupFiles

- **类型:** `string | string[]`

setup 文件的路径。它们将运行在每个测试文件之前。

你可以在内部使用 `process.env.VITEST_WORKER_ID` (类似整数的字符串）来区分线程（如果`threads: false`，那么这个值将永远会是`1`）

### globalSetup

- **类型:** `string | string[]`

全局的 setup 文件的路径，相对于项目根目录来说。

全局的 setup 文件可以导出命名函数 `setup` 和 `teardown` 或返回拆卸函数的 `default` 函数（[示例](https://github.com/vitest-dev/vitest/blob/main/test/global-setup/vitest.config.ts))。

::: info 提示
可以存在多个 globalSetup。setup 和 teardown 依次执行，而 teardown 则以相反的顺序执行。
:::

### watchIgnore

- **类型:** `(string | RegExp)[]`
- **默认值:** `['**\/node_modules\/**', '**\/dist/**']`

监听模式下，改动文件会重新触发测试。这里是配置忽略此规则的文件路径。

### isolate

- **类型:** `boolean`
- **默认值:** `true`

是否隔离每个测试文件的环境。

### coverage

- **类型:** `C8Options`
- **默认值:** `undefined`

测试覆盖率的配置选项

### open

- **类型:** `boolean`
- **默认值:** `false`

打开 Vitest UI (WIP: 赞助者计划可用)

### api

- **类型:** `boolean | number`
- **默认值:** `false`

提供 API 服务的端口。当设置为 true 时，默认端口为 55555。

### clearMocks

- **类型:** `boolean`
- **默认值:** `false`

是否在每次测试前对所有监听(Spy)调用 `.mockClear()`。

### mockReset

- **类型:** `boolean`
- **默认值:** `false`

是否在每次测试前对所有监听(Spy)调用 `.mockReset()`。

### restoreMocks

- **类型:** `boolean`
- **默认值:** `false`

是否在每次测试前对所有监听(Spy)调用 `.mockRestore()`。

### transformMode

- **类型:** `{ web?, ssr? }`

决定模块的转换方式。

#### transformMode.ssr

- **类型:** `RegExp[]`
- **默认值:** `[/\.([cm]?[jt]sx?|json)$/]`

对指定的文件使用 SSR 转换管道。<br>
Vite 插件在处理这些文件时会收到 `ssr: true` 标志。

#### transformMode&#46;web

- **类型:** `RegExp[]`
- **默认值:** 除了 `transformMode.ssr` 以外的所有文件

首先会进行正常的转换管道（针对浏览器），然后进行 SSR 重写以在 Node 中运行代码。<br>
Vite 插件在处理这些文件时会收到 `ssr: false` 标志。

当你使用 JSX 作为 React 以外的组件模型（例如 Vue JSX 或 SolidJS）时，你可能需要进行如下配置以使 `.tsx` / `.jsx` 转换为客户端组件：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
})
```

### snapshotFormat

- **类型:** `PrettyFormatOptions`

测试快照的格式选项。

### mode

- **类型:** `string`
- **默认值** `test`

重写 Vite 的模式

### changed

- **类型**: `boolean | string`
- **默认值**: false

这里仅针对更改的文件运行测试。如果未提供任何值，将针对未提交的更改（包括暂存和未暂存）运行测试。

要针对上次提交中所做的更改运行测试，可以使用 `--changed HEAD~1`。 你还可以传递提交哈希或分支名称。

### resolveSnapshotPath

- **类型**: `(testPath: string, snapExtension: string) => string`
- **默认值**: stores snapshot files in `__snapshots__` directory

覆盖快照的默认路径。 例如，要在测试文件旁边存储一下快照：

```ts
export default {
  test: {
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
  },
}
```

### logHeapUsage

- **类型**: `boolean`
- **默认值**: `false`

每次测试后显示堆的使用情况。用于调试内存是否泄漏。
