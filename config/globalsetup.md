---
title: globalSetup | 配置
outline: deep
---

# globalSetup

- **类型:** `string | string[]`

相对于 [项目根目录](/config/root) 的全局初始化文件路径。

全局初始化文件可以导出命名的 `setup` 和 `teardown` 函数，或者导出一个返回 `teardown` 函数的 `default` 函数：

::: code-group
```js [exports]
export function setup(project) {
  console.log('setup')
}

export function teardown() {
  console.log('teardown')
}
```
```js [default]
export default function setup(project) {
  console.log('setup')

  return function teardown() {
    console.log('teardown')
  }
}
```
:::

注意，`setup` 方法和 `default` 函数接收一个 [测试项目](/api/advanced/test-project) 作为第一个参数。全局初始化在创建测试工作线程之前调用，且仅当至少有一个测试排队时才会调用；清理在所有测试文件运行完成后调用。在 [watch 模式](/config/watch) 中，清理会在进程退出之前调用。如果你需要在测试重新运行前重新配置初始化，可以使用 [`onTestsRerun`](#handling-test-reruns) 钩子。

可以存在多个全局初始化文件。`setup` 和 `teardown` 会按顺序执行，清理则以相反顺序执行。

::: danger
注意，全局初始化在测试工作线程创建之前运行于不同的全局作用域，因此你的测试无法访问在此处定义的全局变量。但你可以通过 [`provide`](/config/provide) 方法将可序列化的数据传递给测试，并在测试中通过从 `vitest` 导入的 `inject` 读取：

:::code-group
```ts [example.test.ts]
import { inject } from 'vitest'

inject('wsPort') === 3000
```
```ts [globalSetup.ts]
import type { TestProject } from 'vitest/node'

export default function setup(project: TestProject) {
  project.provide('wsPort', 3000)
}

declare module 'vitest' {
  export interface ProvidedContext {
    wsPort: number
  }
}
```

如果你需要在与测试相同的线程中执行代码，请使用 [`setupFiles`](/config/setupfiles)，但请注意它会在每个测试文件之前运行。
:::

## 处理测试重新运行 {#handling-test-reruns}

你可以定义一个自定义回调函数，在 `Vitest` 重新运行测试时调用。测试运行器会等待它完成后再执行测试。注意，你不能解构 `project`，例如 `{ onTestsRerun }`，因为它依赖于上下文。

```ts [globalSetup.ts]
import type { TestProject } from 'vitest/node'

export default function setup(project: TestProject) {
  project.onTestsRerun(async () => {
    await restartDb()
  })
}
```
