---
title: 测试运行生命周期 | 指南
outline: deep
---

# 测试运行生命周期 {#test-run-lifecycle}

<<<<<<< HEAD
理解测试运行的生命周期，对于编写高效测试、调试问题以及优化测试套件至关重要。本指南说明 Vitest 中各个生命周期阶段的发生时机与执行顺序，从初始化到清理的全过程。
=======
::: tip
Looking for a practical introduction to `beforeEach`, `afterEach`, and other hooks? See the [Setup and Teardown](/guide/learn/setup-teardown) tutorial.
:::

Understanding the test run lifecycle is essential for writing effective tests, debugging issues, and optimizing your test suite. This guide explains when and in what order different lifecycle phases occur in Vitest, from initialization to teardown.
>>>>>>> a141f9d49fa021ae0f1d6962f9dbc8bce3bbdd16

## 概述 {#overview}

一次完整的 Vitest 测试运行通常经历以下几个主要阶段：

1. **初始化:** 加载配置并初始化项目
2. **全局初始化:** 在所有测试运行之前执行一次初始化
3. **创建 Worker:** 根据 [pool](/config/pool) 配置创建测试 Worker
4. **收集测试文件:** 发现并整理测试文件
5. **执行测试:** 运行测试及其钩子和断言
6. **报告:** 收集并输出测试结果
7. **全局清理:** 所有测试完成后执行最终清理

第 4–6 阶段针对每个测试文件各执行一次，因此在整个测试套件中会执行多次；如果你使用了多于 [1 个 worker](/config/maxworkers)，这些阶段还会在不同文件间并行执行。

## 详细生命周期阶段 {#detailed-lifecycle-phases}

### 1. 初始化阶段 {#_1-initialization-phase}

运行 `vitest` 时，框架首先加载配置并准备测试环境。

**发生了什么:**
- 解析 [命令行](/guide/cli) 参数
- 加载 [配置文件](/config/)
- 验证项目结构

如果配置文件或其导入的文件发生变更，此阶段可能会重新执行。

**作用域:** 主进程（在任何测试 Worker 创建之前）

### 2. 全局初始化阶段 {#_2-global-setup-phase}

如果你配置了 [`globalSetup`](/config/globalsetup) 文件，它们会在任何测试 Worker 创建之前执行一次。

**发生了什么:**
- 全局 setup 文件中的 `setup()` 函数（或导出的 `default` 函数）按顺序依次执行
- 多个全局 setup 文件按定义顺序执行

**作用域:** 主进程（与测试 Worker 相互独立）

**注意事项:**
- 全局初始化与测试在 **不同的全局作用域** 中运行
- 测试无法访问全局 setup 中定义的变量（请改用 [`provide`/`inject`](/config/provide)）
- 只有至少有一个测试排队时，全局 setup 才会执行

```ts [globalSetup.ts]
export function setup(project) {
  // 在所有测试前运行一次
  console.log('Global setup')

  // 与测试共享数据
  project.provide('apiUrl', 'http://localhost:3000')
}

export function teardown() {
  // 在所有测试后运行一次
  console.log('Global teardown')
}
```

### 3. Worker 创建阶段 {#_3-worker-creation-phase}

全局初始化完成后，Vitest 根据你的 [pool 配置](/config/pool) 创建测试 Worker。

**发生了什么:**
- 根据 `browser.enabled` 或 `pool` 配置（`threads`、`forks`、`vmThreads` 或 `vmForks`）创建 Worker
- 每个 Worker 拥有独立的隔离环境（除非禁用了 [隔离](/config/isolate)）
- 默认情况下，Worker 为了保证隔离性不会复用。只有在以下情况才会复用：
  - 禁用了 [隔离](/config/isolate)
  - 或 pool 为 `vmThreads`、`vmForks`，因为 [VM](https://nodejs.org/api/vm.html) 已提供足够的隔离环境

**作用域:** Worker 进程/线程

### 4. 测试文件初始化阶段 {#_4-test-file-setup-phase}

每个测试文件运行之前，会先执行 [setup 文件](/config/setupfiles)。

**发生了什么:**
- setup 文件与测试运行在同一进程中
- 默认情况下，setup 文件 **并行** 执行（可通过 [`sequence.setupFiles`](/config/sequence#sequence-setupfiles) 配置）
- setup 文件在 **每个测试文件** 之前执行
- 可在此处初始化任何全局 _状态_ 或配置

**作用域:** Worker 进程（与测试相同）

**注意事项:**
- 如果禁用了 [isolation](/config/isolate)，setup 文件仍会在每个测试文件之前重新执行以触发副作用，但导入的模块会被缓存
- 在 watch 模式下，编辑 setup 文件会触发所有测试重新运行

```ts [setupFile.ts]
import { afterEach } from 'vitest'

// 在每个测试文件之前执行
console.log('Setup file executing')

// 注册适用于所有测试的钩子
afterEach(() => {
  cleanup()
})
```

### 5. 测试收集与执行阶段 {#_5-test-collection-and-execution-phase}

这是测试实际运行的主要阶段。

#### 测试文件执行顺序 {#test-file-execution-order}

测试文件的执行顺序取决于你的配置：

- 在同一个 Worker 内，**默认串行执行**
- 不同 Worker 之间，文件会 **并行执行**，可通过 [`maxWorkers`](/config/maxworkers) 进行配置
- 可通过 [`sequence.shuffle`](/config/sequence#sequence-shuffle) 随机执行顺序，或通过 [`sequence.sequencer`](/config/sequence#sequence-sequencer) 精细控制执行顺序
- 耗时较长的测试通常会优先启动（基于缓存），除非启用了随机化

#### 每个测试文件内部 {#within-each-test-file}

执行顺序如下：

1. **文件级代码:** `describe` 块外的所有代码立即执行
2. **测试收集:** 处理 `describe` 块，导入测试文件时以副作用的形式注册测试
3. **[`aroundAll`](/api/hooks#aroundall) 钩子:** 包裹套件中的所有测试（须调用 `runSuite()`）
4. **[`beforeAll`](/api/hooks#beforeall) 钩子:** 在套件中任何测试运行之前执行一次
5. **对于每个测试:**：
 - [`aroundEach`](/api/hooks#aroundeach) 钩子包裹该测试（须调用 `runTest()`）
 - `beforeEach` 钩子执行（按定义顺序，或基于 [`sequence.hooks`](/config/sequence#sequence-hooks)）
 - 测试函数执行
 - `afterEach` 钩子执行（默认以 `sequence.hooks: 'stack'` 倒序执行）
 - [`onTestFinished`](/api/hooks#ontestfinished) 回调执行（始终倒序）
 - 如果测试失败：[`onTestFailed`](/api/hooks#ontestfailed) 回调执行
 - 注意：如果设置了 `repeats` 或 `retry`，上述所有步骤会再次执行
6. **[`afterAll`](/api/hooks#afterall) 钩子:** 套件中所有测试完成后执行一次

**执行流程示例:**

```ts
// 立即执行（收集阶段）
console.log('File loaded')

describe('User API', () => {
  // 立即执行（收集阶段）
  console.log('Suite defined')

  aroundAll(async (runSuite) => {
    // 包裹套件中的所有测试
    console.log('aroundAll before')
    await runSuite()
    console.log('aroundAll after')
  })

  beforeAll(() => {
    // 在套件所有测试前运行一次
    console.log('beforeAll')
  })

  aroundEach(async (runTest) => {
    // 包裹每个测试用例
    console.log('aroundEach before')
    await runTest()
    console.log('aroundEach after')
  })

  beforeEach(() => {
    // 每个测试用例前运行
    console.log('beforeEach')
  })

  test('creates user', () => {
    // 测试执行
    console.log('test 1')
  })

  test('updates user', () => {
    // 测试执行
    console.log('test 2')
  })

  afterEach(() => {
    // 每个测试用例后运行
    console.log('afterEach')
  })

  afterAll(() => {
    // 在套件所有测试后运行一次
    console.log('afterAll')
  })
})

// 输出顺序:
// File loaded
// Suite defined
// aroundAll before
//   beforeAll
//   aroundEach before
//     beforeEach
//       test 1
//     afterEach
//   aroundEach after
//   aroundEach before
//     beforeEach
//       test 2
//     afterEach
//   aroundEach after
//   afterAll
// aroundAll after
```

#### 嵌套套件 {#nested-suites}

使用嵌套 `describe` 块时，钩子遵循层级模式。`aroundAll` 和 `aroundEach` 钩子包裹各自的作用域，父级钩子包裹子级钩子：

```ts
describe('outer', () => {
  aroundAll(async (runSuite) => {
    console.log('outer aroundAll before')
    await runSuite()
    console.log('outer aroundAll after')
  })

  beforeAll(() => console.log('outer beforeAll'))

  aroundEach(async (runTest) => {
    console.log('outer aroundEach before')
    await runTest()
    console.log('outer aroundEach after')
  })

  beforeEach(() => console.log('outer beforeEach'))

  test('outer test', () => console.log('outer test'))

  describe('inner', () => {
    aroundAll(async (runSuite) => {
      console.log('inner aroundAll before')
      await runSuite()
      console.log('inner aroundAll after')
    })

    beforeAll(() => console.log('inner beforeAll'))

    aroundEach(async (runTest) => {
      console.log('inner aroundEach before')
      await runTest()
      console.log('inner aroundEach after')
    })

    beforeEach(() => console.log('inner beforeEach'))

    test('inner test', () => console.log('inner test'))

    afterEach(() => console.log('inner afterEach'))
    afterAll(() => console.log('inner afterAll'))
  })

  afterEach(() => console.log('outer afterEach'))
  afterAll(() => console.log('outer afterAll'))
})

// 输出顺序:
// outer aroundAll before
//   outer beforeAll
//   outer aroundEach before
//     outer beforeEach
//       outer test
//     outer afterEach
//   outer aroundEach after
//   inner aroundAll before
//     inner beforeAll
//     outer aroundEach before
//       inner aroundEach before
//         outer beforeEach
//           inner beforeEach
//             inner test
//           inner afterEach
//         outer afterEach
//       inner aroundEach after
//     outer aroundEach after
//     inner afterAll
//   inner aroundAll after
//   outer afterAll
// outer aroundAll after
```

#### 并发测试 {#concurrent-tests}

使用 `test.concurrent` 或 [`sequence.concurrent`](/config/sequence#sequence-concurrent) 时：

- 同一文件内的测试可并行运行
- 每个并发测试仍会各自执行 `beforeEach` 和 `afterEach` 钩子
- 并发快照须使用 [测试上下文](/guide/test-context)：`test.concurrent('name', async ({ expect }) => {})`

### 6. 报告阶段 {#_6-reporting-phase}

在整个测试运行过程中，报告器持续接收生命周期事件并展示结果。

**发生了什么:**
- 报告器随测试进度接收事件
- 收集并格式化测试结果
- 生成测试摘要
- 如已启用，生成覆盖率报告

报告器生命周期的详细信息，请参阅 [报告器](/api/advanced/reporters) 指南。

### 7. 全局清理阶段 {#_7-global-teardown-phase}

所有测试完成后，全局清理函数开始执行。

**发生了什么:**
- [`globalSetup`](/config/globalsetup) 文件中的 `teardown()` 函数执行
- 多个清理函数以初始化 **相反的顺序** 执行
- 在 watch 模式下，清理在进程退出前执行，而非在每次重新运行之间执行

**作用域:** 主进程

```ts [globalSetup.ts]
export function teardown() {
  // 清理全局资源
  console.log('Global teardown complete')
}
```

## 不同作用域中的生命周期 {#lifecycle-in-different-scopes}

理解代码在何处执行对于避免常见问题至关重要：

| 阶段 | 作用域 | 可访问测试上下文 | 执行次数 |
|-------|-------|----------------------|------|
| 配置文件 | 主进程 | ❌ 否 | 每次运行 Vitest 执行一次 |
| 全局初始化 | 主进程 | ❌ 否 (使用 `provide`/`inject`) | 每次运行 Vitest 执行一次 |
| Setup 文件 | Worker（与测试相同） | ✅ 是 | 运行每个测试文件之前执行一次 |
| 文件级代码 | Worker | ✅ 是 | 运行每个测试文件执行一次 |
| `aroundAll` | Worker | ✅ 是 | 运行每个套件执行一次（包裹所有测试） |
| `beforeAll` / `afterAll` | Worker | ✅ 是 | 运行每个套件执行一次 |
| `aroundEach` | Worker | ✅ 是 | 运行每个测试执行一次（包裹每个测试） |
| `beforeEach` / `afterEach` | Worker | ✅ 是 | 每个测试执行一次 |
| 测试函数 | Worker | ✅ 是 | 一次（重试/重复时更多）|
| 全局清理 | 主进程 | ❌ 否 | 每次运行 Vitest 执行一次 |

## Watch 模式下的生命周期 {#watch-mode-lifecycle}

在 watch 模式下，生命周期会重复执行，但有一些差异：

1. **首次运行:** 完整生命周期如上所述
2. **文件变更时:**
   - 启动新的 [测试运行器](/api/advanced/reporters#ontestrunstart)
   - 只有受影响的测试文件会重新运行
   - 受影响测试文件的 [setup 文件](/config/setupfiles) 会重新执行
  - [全局 setup](/config/globalsetup) 不会重新运行（如需在重新运行时执行特定逻辑，请使用 [`project.onTestsRerun`](/config/globalsetup#handling-test-reruns)）
3. **退出时:**
   - 执行全局清理
   - 进程终止

## 性能注意事项 {#performance-considerations}

理解生命周期有助于优化测试性能：

- **全局初始化:** 适用于昂贵的一次性操作（数据库初始化、服务器启动）
- **Setup 文件:** 在每个测试文件之前运行，如果测试文件较多，避免在此处执行耗时操作
- **`beforeAll`:** 对于不需要隔离的昂贵初始化，`beforeAll` 优于 `beforeEach`
- **禁用 [隔离](/config/isolate):** 可提升性能，但 setup 文件仍会在每个文件之前执行
- **[自定义运行池配置](/config/pool):** 影响并行化程度和可用的 API

更多性能优化技巧，请参阅 [性能优化](/guide/improving-performance) 指南。

## 相关文档 {#related-documentation}

- [全局初始化配置](/config/globalsetup)
- [setup 文件配置](/config/setupfiles)
- [测试排序配置项](/config/sequence)
- [隔离配置](/config/isolate)
- [自定义运行池配置](/config/pool)
- [扩展报告器](/guide/advanced/reporters)： 报告器生命周期事件
- [Test API](/api/hooks)： 钩子 API
