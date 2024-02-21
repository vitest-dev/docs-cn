# Node API

::: warning
Vitest 暴露了实验性的私有 API。由于可能不遵循语义化版本规范（SemVer），因此可能会出现不兼容的更改，请在使用 Vitest 时锁定版本。
:::

## 启动 Vitest

你可以使用 Vitest 的 Node API 开始运行 Vitest 测试：

```js
import { startVitest } from 'vitest/node'

const vitest = await startVitest('test')

await vitest?.close()
```

如果测试可以启动，则 `startVitest` 函数返回 `Vitest` 实例。 如果出现以下情况之一，则返回 `undefined`：

- Vitest 未找到 `vite` 包 (通常与 Vitest 一起安装)
- 如果启用了 `coverage`，并且运行模式为 "test"，但并未安装 "coverage" 包（`@vitest/coverage-v8` 或 `@vitest/coverage-istanbul`）
- 如果未安装环境包 (`jsdom`/`happy-dom`/`@edge-runtime/vm`)

如果在运行期间返回 `undefined` 或者测试失败, Vitest 会将 `process.exitCode` 设置为 `1`。

如果未启用监视模式，Vitest 将会调用 `close` 方法。

如果启用了监视模式并且终端支持 TTY, 则 Vitest 会注册控制台快捷键。

你可以将过滤器列表作为第二个参数传递下去。Vitest 将仅运行包含其文件路径中至少一个传递字符串的测试。

此外，你可以使用第三个参数传递 CLI 参数，这将覆盖任何测试配置选项。

或者，你可以将完整的 Vite 配置作为第四个参数传递进去，这将优先于任何其他用户定义的选项。

## 创建 Vitest

你可以使用 `createVitest` 函数创建自己的 Vitest 实例. 它返回与 `startVitest` 相同的 `Vitest` 实例, 但不会启动测试，也不会验证已安装的包。

```js
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test', {
  watch: false,
})
```

## parseCLI

你可以使用此方法来解析 CLI 参数。它接受字符串（其中参数由单个空格分隔）或与 Vitest CLI 使用的格式相同的 CLI 参数的字符串数组。它返回一个过滤器和`选项`，你可以稍后将其传递给 `createVitest` 或 `startVitest` 方法。

```ts
import { parseCLI } from 'vitest/node'

parseCLI('vitest ./files.ts --coverage --browser=chrome')
```

## Vitest

Vitest 实例需要当前的测试模式。它可以是以下之一：

- 运行运行时测试时为 `test`
- 运行基准测试时为 `benchmark`
- 运行类型测试时为 `typecheck`

### 模式

#### test

测试模式仅会调用 `test` 或 `it` 中的函数，并在遇到 `bench` 时抛出错误。此模式使用配置中的 `include` 和 `exclude` 选项查找测试文件。

#### benchmark

基准测试模式会调用 `bench` 函数，并在遇到 `test` 或 `it` 时抛出错误。此模式使用配置中的 `benchmark.include` 和 `benchmark.exclude` 选项查找基准测试文件。

#### typecheck

类型检查模式不会*运行*测试。它仅分析类型并提供摘要信息。此模式使用配置中的 `typecheck.include` 和 `typecheck.exclude` 选项查找要分析的文件。

### start

你可以使用 `start` 方法运行测试或者基准测试。你还可以传递一个字符串数组以筛选测试文件。
