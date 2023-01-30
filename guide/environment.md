# 测试环境

Vitest 提供 [`environment`](/config/#environment) 选项以在特定环境中运行代码。你可以使用 [`environmentOptions`](/config/#environmentoptions) 选项修改环境的行为方式。

默认情况下，你可以使用这些环境：

- `node` 为默认环境
- `jsdom` 通过提供 Browser API 模拟浏览器环境，使用 [`jsdom`](https://github.com/jsdom/jsdom) 包
- `happy-dom` 通过提供 Browser API 模拟浏览器环境，被认为比 jsdom 更快，但缺少一些 API，使用 [`happy-dom`](https://github.com/capricorn86/happy-dom) 包
- `edge-runtime` 模拟 Vercel 的 [edge-runtime](https://edge-runtime.vercel.app/)，使用 [`@edge-runtime/vm`](https://www.npmjs.com/package/@edge-runtime/vm) 包

<<<<<<< HEAD
从 0.23.0 开始，你可以创建自己的包来扩展 Vitest 环境。 为此，请创建名为 `vitest-environment-${name}` 的包。 该包应导出一个具有 `Environment` 属性的对象：
=======
## Environments for specific files

When setting `environment` option in your config, it will apply to all the test files in your project. To have more fine-grained control, you can use control comments to specify environment for specific files. Control comments are comments that start with `@vitest-environment` and are followed by the environment name:

```ts
// @vitest-environment jsdom

import { test } from 'vitest'

test('test', () => {
  expect(typeof window).not.toBe('undefined')
})
```

Or you can also set [`environmentMatchGlobs`](https://vitest.dev/config/#environmentmatchglobs) option specifying the environment based on the glob patterns.

## Custom Environment

Starting from 0.23.0, you can create your own package to extend Vitest environment. To do so, create package with the name `vitest-environment-${name}`. That package should export an object with the shape of `Environment`:
>>>>>>> fe8053ef3ea2d56a427a78f6c88545082eaec635

```ts
import type { Environment } from 'vitest'

export default <Environment>{
  name: 'custom',
  setup() {
    // custom setup
    return {
      teardown() {
        // called after all tests with this env have been run
      }
    }
  }
}
```

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
  // a map of original object that might have been overriden with keys
  // you can return these values inside `teardown` function
  originals: Map<string | symbol, any>
}

export function populateGlobal(global: any, original: any, options: PopulateOptions): PopulateResult
```
