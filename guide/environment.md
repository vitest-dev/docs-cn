<<<<<<< HEAD
# 测试环境
=======
---
title: Test Environment | Guide
---

# Test Environment
>>>>>>> b9c1282b606be155425faa96a433eabab02b7167

Vitest 提供 [`environment`](/config/#environment) 选项以在特定环境中运行代码。你可以使用 [`environmentOptions`](/config/#environmentoptions) 选项修改环境的行为方式。

默认情况下，你可以使用这些环境：

- `node` 为默认环境
- `jsdom` 通过提供 Browser API 模拟浏览器环境，使用 [`jsdom`](https://github.com/jsdom/jsdom) 包
- `happy-dom` 通过提供 Browser API 模拟浏览器环境，被认为比 jsdom 更快，但缺少一些 API，使用 [`happy-dom`](https://github.com/capricorn86/happy-dom) 包
- `edge-runtime` 模拟 Vercel 的 [edge-runtime](https://edge-runtime.vercel.app/)，使用 [`@edge-runtime/vm`](https://www.npmjs.com/package/@edge-runtime/vm) 包

## Environments for Specific Files

如果配置中设置 `environment` 选项时，它将应用于项目中的所有测试文件。要获得更细粒度的控制，你可以使用控制注释为特定文件指定环境。控制注释是以 `@vitest-environment` 开头，后跟环境名称的注释：

```ts
// @vitest-environment jsdom

import { expect, test } from 'vitest'

test('test', () => {
  expect(typeof window).not.toBe('undefined')
})
```

或者你也可以设置 [`environmentMatchGlobs`](https://vitest.dev/config/#environmentmatchglobs) 选项，根据 glob 模式指定环境。

## Custom Environment

从 0.23.0 版本开始，您可以创建自己的包来扩展 Vitest 环境。为此，请创建一个名为 `vitest-environment-${name}` 的包，或者指定一个有效的 JS/TS 文件路径（自 0.34.0 版本起支持）。该包应该导出一个形状为 `Environment` 的对象。

```ts
import type { Environment } from 'vitest'

export default <Environment>{
  name: 'custom',
  transformMode: 'ssr',
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
从 0.34.0 开始，Vitest 需要指定环境对象上的 `transformMode` 选项。它应该等于 `ssr` 或 `web`。该值决定插件如何转换源代码。如果设置为 `ssr`，则插件挂钩在转换或解析文件时将收到 `ssr: true`。 否则，`ssr` 被设置为 `false`。
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
