# 扩展默认报告器 <Badge type="danger">advanced</Badge> {#extending-reporters}

::: warning
这是一个高级 API。如果我们只是想配置内置报告器，请阅读 [报告器](/guide/reporters) 指南。
:::

我们可以从 `vitest/node` 导入报告器并扩展它们来创建自定义报告器。

## 扩展内置报告器 {#extending-built-in-reporters}

一般来说，我们不需要从头开始创建报告器。`vitest` 附带了几个可以扩展的默认报告程序。

```ts
import { DefaultReporter } from 'vitest/node'

export default class MyDefaultReporter extends DefaultReporter {
  // 在此实现自定义功能
}
```

::: warning
请注意，导出的报告器接口尚未稳定，在次要版本更新中可能会调整其 API 结构。
:::

当然，你也可以从头开始创建自定义报告器，只需实现 [`Reporter`](/api/advanced/reporters) 接口即可：

这是自定义报告器的示例：

```ts [custom-reporter.js]
import type { Reporter } from 'vitest/node'

export default class CustomReporter implements Reporter {
  onTestModuleCollected(testModule) {
    console.log(testModule.moduleId, 'is finished')

    for (const test of testModule.children.allTests()) {
      console.log(test.name, test.result().state)
    }
  }
}
```

然后我们可以在 `vitest.config.ts` 文件中使用自定义报告器：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
import CustomReporter from './custom-reporter.js'

export default defineConfig({
  test: {
    reporters: [new CustomReporter()],
  },
})
```

## 报告任务 {#reported-tasks}

报告器接收的 [事件](/api/advanced/reporters) 包含 [测试用例](/api/advanced/test-case)、[测试套件](/api/advanced/test-suite) 和 [测试模块](/api/advanced/test-module) 任务：

```ts twoslash
import type { Reporter, TestModule } from 'vitest/node'

class MyReporter implements Reporter {
  onTestRunEnd(testModules: ReadonlyArray<TestModule>) {
    for (const testModule of testModules) {
      for (const task of testModule.children) {
        //                          ^?
        console.log('test run end', task.type, task.fullName)
      }
    }
  }
}
```

## 导出报告器 {#exported-reporters}

`vitest` 附带了一些 [内置报告器](/guide/reporters)，我们可以开箱即用。

### 内置报告器: {#built-in-reporters}

1. `DefaultReporter`
2. `DotReporter`
3. `JsonReporter`
4. `VerboseReporter`
5. `TapReporter`
6. `JUnitReporter`
7. `TapFlatReporter`
8. `HangingProcessReporter`
9. `TreeReporter`

### 接口报告器: {#interface-reporters}

1. `Reporter`
