# 扩展默认报告器

你可以从 `vitest/reporters` 导入报告器并扩展它们以创建您的自定义报告器。

## 扩展内置报告器

一般来说，你不需要从头开始创建报告器。`vitest` 附带了几个可以扩展的默认报告程序。

```ts
import { DefaultReporter } from 'vitest/reporters'

export default class MyDefaultReporter extends DefaultReporter {
  // do something
}
```

当然，你可以从头开始创建报告器。只需扩展 `BaseReporter` 类并实现你需要的方法即可。

这是自定义报告器的示例：

```ts
// ./custom-reporter.js
import { BaseReporter } from 'vitest/reporters'

export default class CustomReporter extends BaseReporter {
  onCollected() {
    const files = this.ctx.state.getFiles(this.watchFilters)
    this.reportTestSummary(files)
  }
}
```

或者实现 `Reporter` 接口：

```ts
// ./custom-reporter.js
import { Reporter } from 'vitest/reporters'

export default class CustomReporter implements Reporter {
  onCollected() {
    // print something
  }
}
```

然后你可以在 `vitest.config.ts` 文件中使用自定义报告器：

```ts
import { defineConfig } from 'vitest/config'
import CustomReporter from './custom-reporter.js'

export default defineConfig({
  test: {
    reporters: [new CustomReporter()],
  },
})
```

## 导出报告器

`vitest` 附带了一些[内置报告器](/guide/reporters)，你可以开箱即用。

### 内置报告器:

1. `BasicReporter`
1. `DefaultReporter`
1. `DotReporter`
1. `JsonReporter`
1. `VerboseReporter`
1. `TapReporter`
1. `JUnitReporter`
1. `TapFlatReporter`
1. `HangingProcessReporter`

### 基础抽象报告器:

1. `BaseReporter`

### 接口报告器:

1. `Reporter`
