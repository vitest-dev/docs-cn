---
title: 监视非直接导入的文件 | 技巧
---

# 监视非直接导入的文件 {#watching-non-imported-files}

在 Watch 模式下，Vitest 会跟踪导入依赖树：当你修改文件时，所有导入该文件的测试都会重新运行。这确实覆盖了大部分使用场景。但有些测试依赖的文件并未被直接 `import`，例如通过 `fs.readFile` 加载的邮件模板、运行时解析的 JSON fixture、通过构建步骤引入的 HTML 或 CSS，或测试会断言的生成产物。修改这些文件中的任何一个都会导致相关测试失败，而监听循环却无法感知。

[`watchTriggerPatterns`](/config/watchtriggerpatterns) <Version>3.2.0</Version> 可以让这些依赖关系显式化。你需要声明一个匹配文件路径的正则表达式，以及一
个回调函数，用于在匹配的文件变更时返回需要重新运行的测试。

## 示例 {#pattern}

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watchTriggerPatterns: [
      {
        pattern: /src\/templates\/(.*)\.(ts|html|txt)$/,
        testsToRun: (file, match) => {
          // 编辑 `src/templates/welcome.html` ⇒ 返回 `api/tests/mailers/welcome.test.ts`
          return `api/tests/mailers/${match[1]}.test.ts`
        },
      },
    ],
  },
})
```

`testsToRun` 返回一个或多个需要重新运行的测试文件路径（字符串或字符串数组），如果无需重新运行任何测试则返回 `undefined`。路径从工作区根目录解析，且不会被解析为 glob 模式。`match` 是 `RegExp.exec` 对变更文件执行的结果。

## 变体 {#variations}

多个形式可以共存。下面的第一种形式从变更文件的目录派生测试路径；第二种形式将单个共享 fixture 映射到固定的测试文件列表：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watchTriggerPatterns: [
      {
        pattern: /src\/(.*)\/schema\.json$/,
        testsToRun: (_file, match) => `src/${match[1]}/__tests__/index.test.ts`,
      },
      {
        pattern: /test\/shared-fixture\.json$/,
        testsToRun: () => [
          'test/integration/users.test.ts',
          'test/integration/billing.test.ts',
        ],
      },
    ],
  },
})
```

[`forceRerunTriggers`](/config/forcereruntriggers) 也能解决同样的问题，但每次匹配时重新运行所有测试。相比之下，`watchTriggerPatterns` 只重新运行你为特定形式指定的测试，保持监听循环高效。

## 相关链接 {#see-also}

- [`watchTriggerPatterns`](/config/watchtriggerpatterns)
- [`forceRerunTriggers`](/config/forcereruntriggers)
