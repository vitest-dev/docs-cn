---
title: 测试环境 | 指南
---

# 测试环境 {#test-environment}

Vitest 提供 [`environment`](/config/#environment) 选项以在特定环境中运行代码。你可以使用 [`environmentOptions`](/config/#environmentoptions) 选项修改环境的行为方式。

默认情况下，你可以使用这些环境：

- `node` 为默认环境
- `jsdom` 通过提供 Browser API 模拟浏览器环境，使用 [`jsdom`](https://github.com/jsdom/jsdom) 包
- `happy-dom` 通过提供 Browser API 模拟浏览器环境，被认为比 jsdom 更快，但缺少一些 API，使用 [`happy-dom`](https://github.com/capricorn86/happy-dom) 包
- `edge-runtime` 模拟 Vercel 的 [edge-runtime](https://edge-runtime.vercel.app/)，使用 [`@edge-runtime/vm`](https://www.npmjs.com/package/@edge-runtime/vm) 包

::: info
当使用 `jsdom` 或 `happy-dom` 环境时，Vitest 在导入 [CSS](https://vitejs.dev/guide/features.html#css) 和 [资源文件](https://vitejs.dev/guide/features.html#static-assets) 时遵循与 Vite 相同的规则。如果在导入外部依赖时出现 `unknown extension .css` 错误，则需要通过将所有相关包添加到 [`server.deps.inline`](/config/#server-deps-inline) 中，手动内联整个导入链。例如，在以下导入链中：`源代码 -> package-1 -> package-2 -> package-3`，如果错误发生在 `package-3`，你需要将这三个包都添加到 `server.deps.inline` 中。

外部依赖中的CSS和资源文件的 `require` 调用会自动解析。
:::

::: warning
"环境" 仅在 Node.js 中运行测试时存在。

Vitest 并不将 `browser` 视作一种测试环境。如果你想让部分测试在 [浏览器模式](/guide/browser/) 中执行，可以通过创建一个 [测试项目](/guide/browser/#projects-config) 来实现。
:::

## 特定文件的环境 {#environments-for-specific-files}

如果配置中设置 `environment` 选项时，它将应用于项目中的所有测试文件。要获得更细粒度的控制，你可以使用控制注释为特定文件指定环境。控制注释是以 `@vitest-environment` 开头，后跟环境名称的注释：

```ts
// @vitest-environment jsdom

import { expect, test } from 'vitest'

test('test', () => {
  expect(typeof window).not.toBe('undefined')
})
```

## 自定义环境 {#custom-environment}

你可以创建自己的包来扩展 Vitest 环境。为此，请创建一个名为 `vitest-environment-${name}` 的包，或者指定一个有效的 JS/TS 文件路径。该包应该导出一个形状为 `Environment` 的对象。

```ts
import type { Environment } from 'vitest/environments'

export default <Environment>{
  name: 'custom',
  viteEnvironment: 'ssr',
  // optional - only if you support "experimental-vm" pool
  async setupVM() {
    const vm = await import('node:vm')
    const context = vm.createContext()
    return {
      getVmContext() {
        return context
      },
      teardown() {
        // called after all tests with this env have been run
      },
    }
  },
  setup() {
    // custom setup
    return {
      teardown() {
        // called after all tests with this env have been run
      },
    }
  },
}
```

::: warning
Vitest 要求环境对象显式提供 `viteEnvironment` 字段（若省略则取 Vitest 环境名）。该字段必须设为 `ssr`、`client` 或任意自定义 [Vite 环境](https://cn.vite.dev/guide/api-environment) 名称，用于指定处理测试文件的目标环境。
:::

你还可以通过 `vitest/environments` 访问默认的 Vitest 环境：

```ts
import { builtinEnvironments, populateGlobal } from 'vitest/environments'

console.log(builtinEnvironments) // { jsdom, happy-dom, node, edge-runtime }
```

Vitest 还提供了 `populateGlobal` 实用函数，可用于将属性从对象移动到全局命名空间：

```ts
interface PopulateOptions {
  // should non-class functions be bind to the global namespace
  bindFunctions?: boolean
}

interface PopulateResult {
  // a list of all keys that were copied, even if value doesn't exist on original object
  keys: Set<string>
  // a map of original object that might have been overridden with keys
  // you can return these values inside `teardown` function
  originals: Map<string | symbol, any>
}

export function populateGlobal(
  global: any,
  original: any,
  options: PopulateOptions
): PopulateResult
```
