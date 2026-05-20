---
title: environment | 配置
---

# environment

- **类型:** `'node' | 'jsdom' | 'happy-dom' | 'edge-runtime' | string`
- **默认值:** `'node'`
- **命令行终端:** `--environment=<env>`

测试时将使用的运行环境。Vitest 中的默认测试环境是一个 Node.js 环境。
如果你正在构建 Web 端应用，可选用 [`jsdom`](https://github.com/jsdom/jsdom)
或 [`happy-dom`](https://github.com/capricorn86/happy-dom) 这种类似浏览器(browser-like)的环境来替代 Node.js。
如果你正在构建边缘计算函数，可选用 [`edge-runtime`](https://edge-runtime.vercel.app/packages/vm) 环境。

::: tip
你还可以使用 [浏览器模式](/guide/browser/) 在浏览器中运行集成或单元测试，而无需模拟环境。
:::

要为环境配置自定义选项，请使用 [`environmentOptions`](/config/environmentoptions)。

通过在文件顶部添加 `@vitest-environment` 文档注释或普通注释，你可以为该文件中的所有测试指定其他运行环境：

文档注释：

```js
/**
 * @vitest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

普通注释:

```js
// @vitest-environment happy-dom

test('use happy-dom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

为了与 Jest 兼容，还存在一个 `@jest-environment`：

```js
/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
```

你还可以定义自定义环境。使用非内置环境时，Vitest 会根据你提供的内容加载对应的文件或包：如果是文件路径则加载文件，如果是包名则加载 `vitest-environment-${name}` 的包

该包应导出一个具有 `Environment` 属性的对象：

```ts [environment.js]
import type { Environment } from 'vitest'

export default <Environment>{
  name: 'custom',
  viteEnvironment: 'ssr',
  setup() {
    // 自定义初始化
    return {
      teardown() {
        // 在所有使用此环境的测试运行完毕后调用
      }
    }
  }
}
```

::: tip
`viteEnvironment` 字段对应于 [Vite 环境 API](https://cn.vite.dev/guide/api-environment#environment-api)。默认情况下，Vite 公开 `client`（用于浏览器）和 `ssr`（用于服务器）环境。
:::

为了直接扩展使用 Vitest 还从 `vitest/environments` 包导出 `builtinEnvironments`。关于扩展测试环境的更多信息，请参阅 [测试环境](/guide/environment)。

::: tip
jsdom 测试环境会暴露一个等同于当前 [JSDOM](https://github.com/jsdom/jsdom) 实例的全局变量 `jsdom`。如果你想让 TypeScript 识别它，在使用此环境时可将 `vitest/jsdom` 添加到你的 `tsconfig.json` 中：

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vitest/jsdom"]
  }
}
```
:::
