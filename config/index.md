# 配置 Vitest

## 配置

`vitest` 将读取我们项目根目录的 `vite.config.ts` 当它与插件匹配并设置为我们的 Vite 应用程序时。 如果我们想使用不同的配置进行测试，我们可以：

- 创建 `vitest.config.ts`，优先级是最高的。
- 将 `--config` 选项传递给 CLI，例如 `vitest --config ./path/to/vitest.config.ts` 。
- 使用 `process.env.VITEST` 有条件地在 `vite.config.ts` 中应用不同的配置。

要配置 `vitest` 本身，请在我们的 Vite 配置中添加 `test` 属性。 我们还需要使用 [三斜线指令](https://www.tslang.cn/docs/handbook/triple-slash-directives.html#-reference-types-) 在 配置文件的顶部。

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ...
  },
})
```

如果有需要，我们可以检索 Vitest 的默认选项以展开它们：

```ts
import { defineConfig, configDefaults } from 'vitest'

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

包含用于测试文件的 glob

### exclude

- **类型:** `string[]`
- **默认值:** `['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']`

排除测试文件的 glob

### deps

- **类型:** `{ external?, inline? }`

处理依赖内联或外化

#### deps.external

- **类型:** `(string | RegExp)[]`
- **默认值:** `['**\/node_modules\/**']`

Externalize 意味着 Vite 会绕过包到原生 Node.js 中。 Vite 的转换器和解析器不会应用外部依赖项，因此它们是不会支持重新加载时的 HMR。 通常，`node_modules` 下的包是外部化的。

#### deps.inline

- **类型:** `(string | RegExp)[]`
- **默认值:** `[]`

Vite 将处理内联模块。这会有助于处理以 ESM 格式（Node 无法处理）发布 `.js` 的包。

#### deps.fallbackCJS

- **类型** `boolean`
- **默认值:** `false`

当依赖项是有效的 ESM 包时，将会尝试根据路径猜测 cjs 版本。

如果包在 ESM 和 CJS 模式下具有不同的逻辑，这将会导致一些错误的产生。

#### deps.interopDefault

- **类型:** `boolean`
- **默认值:** `true`

将 CJS 模块的默认值视为命名导出。

### globals

- **类型:** `boolean`
- **默认值:** `false`

一般情况下，`vitest` 不为显式提供全局 API。 如果我们喜欢像 Jest 一样全局使用 API，可以用 `--globals` 选项传递给 CLI 或在配置中添加 `globals: true`。

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
  },
})
```

要让 TypeScript 使用全局 API，请将 `vitest/globals` 添加到 `tsconfig.json` 中的 `types` 文件中

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

如果我们已经在项目中使用 [`unplugin-auto-import`](https://github.com/antfu/unplugin-vue-components)，我们也可以直接使用它来自动导入这些 API。

```ts
// vite.config.ts
import { defineConfig } from 'vite'
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

这将用于测试的环境。 Vitest 中的默认环境
是一个 Node.js 环境。 如果我们正在构建 Web 应用程序，则可以使用
通过 [`jsdom`](https://github.com/jsdom/jsdom) 的类似浏览器的环境
或 [`happy-dom`](https://github.com/capricorn86/happy-dom) 进行代替。

通过在文件顶部添加 `@vitest-environment` 文档块或注释，
我们可以为该文件中的所有测试指定另一个环境：

Docblock 样式:

```js
/**
 * @vitest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

Comment 样式:

```js
// @vitest-environment happy-dom

test('use happy-dom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

为了与 Jest 兼容，还有一个 `@jest-environment`：

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

更新快照文件

### watch

- **Type:** `boolean`
- **Default:** `true`

启用浏览模式

### root

- **Type:** `string`

项目的根目录

### reporters

- **Type:** `Reporter | Reporter[]`
- **Default:** `'default'`

用于输出的自定义 reporters 。 Reporters 可以是 [一个 Reporter 实例](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/types/reporter.ts) 或用于选择内置的 reporters 字符串：
  - `'default'` - 当他们经过测试套件
  - `'verbose'` - 保持完整的任务树可见
  - `'dot'` -  将每个任务显示为一个点
  - `'junit'` - JUnit XML 报告器
  - `'json'` -  给出一个简单的 JSON 总结

### outputFile

- **类型:** `string`

当还指定了 `--reporter=json` 或 `--reporter=junit` 选项时，将测试结果写入文件。

### threads

- **类型:** `boolean`
- **默认值:** `true`

使用 [tinypool](https://github.com/Aslemammad/tinypool)（[Piscina](https://github.com/piscinajs/piscina) 的轻量级分支）进行启用多线程。

### maxThreads

- **类型:** `number`
- **默认值:** _available CPUs_

最大的线程数。

### minThreads

- **类型:** `number`
- **默认值:** _available CPUs_

最小的线程数。

### testTimeout

- **类型:** `number`
- **默认值:** `5000`

测试的默认超时时间（以毫秒为单位）。

### hookTimeout

- **类型:** `number`
- **默认值:** `5000`

挂钩的默认超时时间（以毫秒为单位）。

### silent

- **类型:** `boolean`
- **默认值:** `false`

Silent模式。

### setupFiles

- **类型:** `string | string[]`

setup files 的路径。

### globalSetup

- **类型:** `string | string[]`

全局设置文件的路径，相对于项目根目录。

全局设置文件可以导出命名函数 `setup` 和 `teardown` 或返回拆卸函数的 `default` 函数（[示例](https://github.com/vitest-dev/vitest/blob/main/test/global-setup/vitest.config.ts))。

::: info 提示
多个 globalSetup 文件是可能的。 setup 和 teardown 依次执行，而 teardown 则以相反的顺序执行。
:::


### watchIgnore

- **类型:** `(string | RegExp)[]`
- **默认值:** `['**\/node_modules\/**', '**\/dist/**']`

触发监视重新运行时要忽略的文件路径模式。

### isolate

- **类型:** `boolean`
- **默认值:** `true`

为每个测试文件隔离环境

### coverage

- **类型:** `C8Options`
- **默认值:** `undefined`

覆盖选项

### open

- **类型:** `boolean`
- **默认值:** `false`

打开 Vitest UI (WIP)

### api

- **类型:** `boolean | number`
- **默认值:** `false`

监听端口并提供 API。设置为 true 时，默认端口为 55555。

### clearMocks

- **类型:** `boolean`
- **默认值:** `false`

每次测试前都会对所有测试间谍调用 `.mockClear()`。

### mockReset

- **类型:** `boolean`
- **默认值:** `false`

每次测试前都会对所有测试间谍调用 `.mockReset()`。

### restoreMocks

- **类型:** `boolean`
- **默认值:** `false`

每次测试前都会对所有测试间谍调用 `.mockRestore()`。

### transformMode

- **类型:** `{ web?, ssr? }`

确定模块的变换方法。

#### transformMode.ssr

- **类型:** `RegExp[]`
- **默认值:** `[/\.([cm]?[jt]sx?|json)$/]`

对指定文件使用 SSR 转换管道。<br>
Vite 插件在处理这些文件时会收到 `ssr: true` 标志。

#### transformMode&#46;web

- **类型:** `RegExp[]`
- **默认值:** *选中指定的模块以外的模块`transformMode.ssr`*

首先进行正常的转换管道（针对浏览器），然后进行 SSR 重写以在 Node 中运行代码。<br>
Vite 插件在处理这些文件时会收到 `ssr: false` 标志。

当我们使用 JSX 作为 React 以外的组件模型（例如 Vue JSX 或 SolidJS）时，我们可能需要进行如下配置以使 `.tsx` / `.jsx` 转换为客户端组件：

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
})
```

### snapshotFormat

- **Type:** `PrettyFormatOptions`

快照测试的格式选项。
