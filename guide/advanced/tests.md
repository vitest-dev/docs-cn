# 运行测试 <Badge type="danger">advanced</Badge> {#running-tests}

::: warning 注意
本指南介绍如何使用高级 API 通过 Node.js 脚本运行测试。如果您只想[运行测试](/guide/)，则可能不需要这个。它主要被库的作者使用。

破坏性变更可能不会遵循 SemVer，请在使用实验性 API 时固定 Vitest 的版本。
:::

Vitest 公开了两种启动 Vitest 的方法：

- `startVitest` 启动 Vitest，验证所需软件包是否已安装并立即运行测试
- `createVitest` 仅启动 Vitest，不运行任何测试

## `startVitest`

```ts
import { startVitest } from 'vitest/node'

const vitest = await startVitest(
  'test',
  [], // CLI 筛选
  {}, // 覆盖 test 配置
  {}, // 覆盖 Vite 配置
  {}, // 自定义 Vitest 选项
)
const testModules = vitest.state.getTestModules()
for (const testModule of testModules) {
  console.log(testModule.moduleId, testModule.ok() ? 'passed' : 'failed')
}
```

::: tip
[`TestModule`](/api/advanced/test-module), [`TestSuite`](/api/advanced/test-suite) 和 [`TestCase`](/api/advanced/test-case) API 从 Vitest 2.1 开始不再是实验性的，并且遵循 SemVer。
:::

## `createVitest`

创建一个 [Vitest](/api/advanced/vitest) 实例而不运行测试。

`createVitest` 方法不会验证是否已安装所需的软件包。此方法也不遵循 `config.standalone` 或 `config.mergeReports`。即使 `watch` 被禁用，Vitest 也不会自动关闭。

```ts
import { createVitest } from 'vitest/node'

const vitest = await createVitest(
  'test',
  {}, // 覆盖 test 配置
  {}, // 覆盖 Vite 配置
  {}, // 自定义 Vitest 选项
)

// 当调用 `vitest.cancelCurrentRun()` 时调用
vitest.onCancel(() => {})
// 当调用 `vitest.close()` 时调用
vitest.onClose(() => {})
// 当 Vitest 重新运行测试文件时调用
vitest.onTestsRerun((files) => {})

try {
  // 若测试失败，此操作会将 process.exitCode 设为 1
  // 并且不会自动终止进程
  await vitest.start(['my-filter'])
}
catch (err) {
  // 可能抛出以下错误：
  // "FilesNotFoundError" 未找到匹配文件
  // "GitNotFoundError" 使用 `--changed` 参数但未初始化 git 仓库
}
finally {
  await vitest.close()
}
```

如果我们打算保留 `Vitest` 实例，请确保至少调用 [`init`](/api/advanced/vitest#init) 。这将初始化报告器和覆盖率提供者，但不会运行任何测试。即使我们不打算使用 Vitest 观察器，但希望保持实例运行，也建议启用 `watch` 模式。Vitest 依赖此标志使其某些功能在连续过程中正常工作。

报告器初始化后，如果需要手动运行测试，可以使用 [`runTestSpecifications`](/api/advanced/vitest#runtestspecifications) 或 [`rerunTestSpecifications`](/api/advanced/vitest#reruntestspecifications) 来运行测试。

```ts
watcher.on('change', async (file) => {
  const specifications = vitest.getModuleSpecifications(file)
  if (specifications.length) {
    vitest.invalidateFile(file)
    // 若需避免触发 "reporter.onWatcher*" 钩子，可使用 runTestSpecifications 方法
    // 不应被调用
    await vitest.rerunTestSpecifications(specifications)
  }
})
```

::: warning
上述示例显示了禁用默认观察者行为时的潜在用例。默认情况下，如果文件发生变化，Vitest 会重新运行测试。

另外请注意，`getModuleSpecifications` 不会解析测试文件，除非这些文件已经通过 `globTestSpecifications` 处理过。如果文件刚刚创建，应使用 `project.matchesGlobPattern`：

```ts
watcher.on('add', async (file) => {
  const specifications = []
  for (const project of vitest.projects) {
    if (project.matchesGlobPattern(file)) {
      specifications.push(project.createSpecification(file))
    }
  }

  if (specifications.length) {
    await vitest.rerunTestSpecifications(specifications)
  }
})
```
:::

如果你需要禁用监视器，可以从 Vite 5.3 开始传递 `server.watch: null`，或者在 Vite 配置中传递 `server.watch: { ignored: ['*/*'] }`：

```ts
await createVitest(
  'test',
  {},
  {
    plugins: [
      {
        name: 'stop-watcher',
        async configureServer(server) {
          await server.watcher.close()
        }
      }
    ],
    server: {
      watch: null,
    },
  }
)
```
