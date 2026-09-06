---
title: 基准测试 | 指南
---

# 基准测试 {#benchmarking}

Vitest 支持使用 [测试上下文](/guide/test-context) 中的 `bench` fixture，在测试旁编写基准测试。内置基准测试实现基于 [Tinybench](https://github.com/tinylibs/tinybench) 构建，基准测试定义在常规 `test()` 中调用，因此可以使用 Vitest 测试运行器的全部能力：重试、生命周期钩子、筛选和断言。

## 定义基准测试 {#defining-a-benchmark}

使用 `bench` fixture 定义基准测试，调用 `.run()` 执行：

```ts
import { expect, test } from 'vitest'

test('parsing performance', async ({ bench }) => {
  const result = await bench('parse', () => {
    JSON.parse('{"key":"value"}')
  }).run()
})
```

`bench()` 函数只注册基准测试，并不会执行。调用 `.run()` 后才会运行基准测试并返回结果。测试完成后，Vitest 会打印 [对比表](#comparing-benchmarks) 的单行版本（每秒操作数、平均时间、百分位数等），因此即使只运行一个基准测试，输出形式也会与使用 `bench.compare()` 时一致。

::: warning
`bench` fixture 仅在匹配 [`benchmark.include`](/config/benchmark#benchmark-include) 的文件中可用（默认值：`**/*.{bench,benchmark}.?(c|m)[jt]s?(x)`）。在常规测试文件中使用 `{ bench }` 会抛出错误。

文件是否参与基准测试是由文件名决定，而不是由测试是否使用 `bench` fixture 决定。将 `parser.test.ts` 重命名为 `parser.bench.ts`（或调整 `benchmark.include`）后，它才会被移入基准测试项目。
:::

## 运行基准测试 {#running-benchmarks}

基准测试文件由 [`benchmark.include`](/config/benchmark#benchmark-include) 匹配（默认值：`**/*.{bench,benchmark}.?(c|m)[jt]s?(x)`），在独立的项目中运行并与常规测试隔离开。根据你是想跳过它们、与常规测试一起运行，还是单独运行，有三种方式可选。

### `vitest`（默认）{#vitest-default}

未设置 [`benchmark.enabled`](/config/benchmark#benchmark-enabled) 时，`vitest` 命令只运行常规测试，完全忽略基准测试文件。这是默认行为，也适合日常开发，因为基准测试速度较慢且结果有噪声，不应在每次保存时运行。

### 启用 `benchmark.enabled` 的 `vitest` {#vitest-with-benchmark-enabled}

在配置文件中设置 `benchmark.enabled: true`，可以让基准测试与常规测试一起运行：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    benchmark: {
      enabled: true,
    },
  },
})
```

使用此配置时，`vitest` 会先运行常规测试，再在独立隔离的组中运行基准测试（基准测试不会与测试重叠执行，从而避免给结果增加噪声）。适用于希望通过一条命令同时验证正确性和性能的 CI 场景。

### `vitest bench`

`bench` 子命令只运行基准测试，并跳过常规测试：

```bash
vitest bench
```

该命令会在本次运行中隐式启用 `benchmark.enabled`，因此无需在配置中设置。与 `vitest` 命令一样，它支持文件名筛选以及 `-t`/`--testNamePattern` 来缩小运行范围：

```bash
# 仅运行匹配文件名称为 "parser" 的基准测试
vitest bench parser

# 仅运行匹配测试名称为 "JSON" 的基准测试
vitest bench -t JSON
```

如需使用其他基准测试实现或执行策略，请参阅 [自定义基准测试实现](/guide/advanced/benchmark-provider) 指南。

## 比较基准测试 {#comparing-benchmarks}

使用 `bench.compare()` 比较多个基准测试：

```ts
import { expect, test } from 'vitest'

test('compare JSON libraries', async ({ bench }) => {
  const input = '{"key":"value","nested":{"a":1}}'

  const result = await bench.compare(
    bench('JSON.parse', () => {
      JSON.parse(input)
    }),
    bench('custom parser', () => {
      customParse(input)
    }),
  )
})
```

在比较基准测试时，Vitest 会使用交错迭代的方式运行它们，以减少环境偏差（CPU 降频、GC 压力等），并在测试完成后打印比较表：

<<< ./snippets/benchmark-table.ansi

### 选项 {#options}

可以将 [options](https://tinylibs.github.io/tinybench/interfaces/BenchOptions.html) 作为最后一个参数传给 `bench.compare()`：

```ts
test('compare with options', async ({ bench }) => {
  const result = await bench.compare(
    bench('lib1', () => { lib1() }),
    bench('lib2', () => { lib2() }),
    {
      iterations: 100,
      time: 1000,
    },
  )
})
```

也可以像 `test()` 接收的选项一样，将每个基准测试的 [options](https://tinylibs.github.io/tinybench/interfaces/FnOptions.html) 作为第二个参数传入：

```ts
test('benchmarks with setup', async ({ bench }) => {
  const result = await bench.compare(
    bench('with-cache', () => {
      readFromCache()
    }),
    bench(
      'without-cache',
      { beforeEach: () => clearCache() },
      () => { readFromDisk() },
    ),
  )
})
```

## 跨项目比较 {#comparing-across-projects}

当你的工作区定义了多个项目（例如，不同浏览器或运行时），在 bench 选项中传入 `perProject: true`，即可比较同一基准测试在各项目中的表现。Vitest 仍会在当前项目中内联打印结果，并在测试运行结束时将各项目结果汇总到一张比较表中。

```ts
import { test } from 'vitest'

test('simple example', async ({ bench }) => {
  await bench('1 + 1', { perProject: true }, () => {
    1 + 1
  }).run()
})
```

同一个测试文件会在每个项目（chromium、firefox、webkit 等）中运行，Vitest 汇总结果：

<<< ./snippets/benchmark-per-project.ansi

也可以在 `bench.compare()` 中将使用 `perProject` 的基准测试与普通基准测试混用：

```ts
test('compare implementations across browsers', async ({ bench }) => {
  await bench.compare(
    bench('JSON.parse', { perProject: true }, () => {
      JSON.parse('{"key":"value"}')
    }),
    bench('custom parser', () => {
      customParse('{"key":"value"}')
    }),
  )
})
```

在这个例子中，`custom parser` 会出现在各项目的常规内联比较表中，而 `JSON.parse` 还会被汇总到末尾的跨项目比较表中。

## 断言性能 {#asserting-performance}

使用 `toBeFasterThan()` 和 `toBeSlowerThan()` 匹配器断言不同基准测试之间的性能关系：

```ts
import { expect, test } from 'vitest'

test('lib1 is faster than lib2', async ({ bench }) => {
  const result = await bench.compare(
    bench('lib1', () => { lib1() }),
    bench('lib2', () => { lib2() }),
  )

  expect(result.get('lib1')).toBeFasterThan(result.get('lib2'))
})
```

`delta` 选项指定断言通过所需的最小相对性能差异，有助于避免基准测试噪声导致测试结果不稳定：

```ts
// lib1 必须至少比 lib2 快 10%
expect(result.get('lib1')).toBeFasterThan(result.get('lib2'), {
  delta: 0.1,
})

// lib2 必须至少比 lib1 慢 20%
expect(result.get('lib2')).toBeSlowerThan(result.get('lib1'), {
  delta: 0.2,
})
```

也可以使用标准匹配器断言绝对性能：

```ts
test('parsing is fast enough', async ({ bench }) => {
  const result = await bench('parse', () => {
    parse(largeInput)
  }).run()

  expect(result.throughput.mean).toBeGreaterThan(10_000)
})
```

## 重试 {#retries}

由于基准测试可能存在噪声，可以使用 `retry` 选项自动重试失败的基准测试：

```ts
test('performance comparison', { retry: 3 }, async ({ bench }) => {
  const result = await bench.compare(
    bench('lib1', () => { lib1() }),
    bench('lib2', () => { lib2() }),
  )

  expect(result.get('lib1')).toBeFasterThan(result.get('lib2'))
})
```

## 存储和重放结果 {#storing-and-replaying-results}

两个基本功能可以将基准测试结果持久化到磁盘，并在后续运行中与之比较：`writeResult` 选项用于保存结果，`bench.from()` 用于读取结果。

### `writeResult`

将 `writeResult` 作为单个基准测试的选项传入，即可在每次运行基准测试时将结果写入 JSON 文件。该路径会以项目根目录为基准进行解析：

```ts
test('parse', async ({ bench }) => {
  await bench(
    'parse',
    { writeResult: './benchmarks/parse.json' },
    () => parse(largeInput),
  ).run()
})
```

- 基准测试会一直运行。不会因命中缓存而跳过，也没有相应的 CLI 选项；每次成功运行都会覆盖该文件。
- 如果函数抛出异常，则不会写入文件。
- 将这些文件与代码一起提交，使审查者和 CI 使用相同的参考数据。

::: warning
如果提交这些文件，请注意基准测试结果在不同环境（开发者机器、CI 运行器、不同操作系统）之间可能有显著差异。应指定单一环境（通常是 CI）生成文件，并避免在本地重新生成。
:::

### `bench.from()`

`bench.from(name, source)` 只进行注册，不会执行函数。它读取之前保存的结果并将其传给 `bench.compare()`（调用 `.run()` 时则直接返回该结果）。

source 可以是路径（相对于项目根目录），也可以是返回结果数据的函数（包括 Promise）：

```ts
test('compare against the stored baseline', async ({ bench }) => {
  const result = await bench.compare(
    bench(
      'current',
      { writeResult: './benchmarks/parse.json' },
      () => parse(largeInput),
    ),
    bench.from('previous', './benchmarks/parse.json'),
    bench.from('remote', () => fetch('https://path/to/external/file.json').then(r => r.json())),
  )

  expect(result.get('current')).toBeFasterThan(result.get('previous'))
})
```

可以保留旧版本的历史产物，并将其与当前实现进行比较。由于 `bench.from()` 从不调用生成文件的函数，因此提交产物后可以删除原始基准测试代码：

```ts
test('compare parser versions', async ({ bench }) => {
  const input = '{"key":"value"}'

  await bench.compare(
    bench.from('v1', './benchmarks/parse.v1.json'),
    bench.from('v2', './benchmarks/parse.v2.json'),
    bench(
      'current',
      { writeResult: './benchmarks/parse.current.json' },
      () => customParser(input),
    ),
  )
})
```

要生成新的历史产物，请让新的 `bench()` 指向该版本的实现，将 `writeResult` 设置为带版本号的路径（`./benchmarks/parse.v3.json`），运行一次，然后将调用替换为 `bench.from('v3', './benchmarks/parse.v3.json')`。

要按需重新生成基线，可以通过环境变量控制是否写入，使同一个测试既能刷新产物，也能将结果与现有产物进行比较：

```ts
test('compare parser versions', async ({ bench }) => {
  if (import.meta.env.VITE_WRITE_BENCH) {
    const baseline = bench('baseline', { writeResult: './my-bench.json' }, () => fn())
    await baseline.run()
  }
  else {
    const baseline = bench.from('baseline', './my-bench.json')
    await bench.compare(bench('current', () => fn()), baseline)
  }
})
```

运行 `VITE_WRITE_BENCH=1 vitest bench` 刷新存储的结果，运行 `vitest bench` 将当前实现与之比较。

### 每个项目的产物 {#per-project-artifacts}

在多项目工作区中（不同浏览器、不同运行时），可以在路径中包含 `${projectName}`，让各项目共享一个基准测试文件模板。写入时，该占位符会替换为当前项目名称：

```ts
test('cross-project baseline', async ({ bench }) => {
  await bench(
    'parse',
    // eslint-disable-next-line no-template-curly-in-string
    { perProject: true, writeResult: './benchmarks/parse.${projectName}.json' },
    () => parse(largeInput),
  ).run()
})
```

在 `bench.from()` 中使用同一模板，以便每个项目读取各自的产物。

## 稳定性 {#stability}

基准测试本身就容易受到波动影响：CPU 负载、因过热导致的降频、GC 压力以及后台进程都会影响结果。Vitest 采取了几项措施尽量减少这些噪声：

- **独立 project**：根据 [`benchmark.include`](/config/benchmark#benchmark-include) 模式将基准测试文件分组到独立 project 中。`bench` fixture 只在匹配该模式的文件中提供，在常规测试文件中使用会抛出错误。
- **禁用并发**：基准测试文件中的测试始终按顺序运行。基准测试文件本身也逐个运行，从不并行执行，以防止彼此干扰。

要进一步提高稳定性：

- 使用 [`retry`](#retries) 选项自动重新运行不稳定的基准测试断言。
- 在 `toBeFasterThan`/`toBeSlowerThan` 中使用 [`delta`](#asserting-performance) 选项，允许可接受的差异。
- 避免与 CPU 密集型进程同时运行基准测试。
- 关闭会争用 CPU 时间的浏览器、IDE 和其他应用程序。

### 消除死代码 {#dead-code-elimination}

JavaScript 引擎可能会将没有可观察副作用的代码优化掉。如果基准测试函数未使用其结果，引擎可能会完全跳过计算，导致测得的速度虚高：

```ts
test('parsing', async ({ bench }) => {
  // 不推荐：引擎可能会消除这部分工作
  await bench('parse', () => {
    JSON.parse(input)
  }).run()

  // 推荐：使用计算结果
  await bench('parse', () => {
    const result = JSON.parse(input)
    doSomething(result)
  }).run()
})
```

这种优化在所有 JavaScript 引擎（V8、JavaScriptCore 和 SpiderMonkey）中都存在，但在 V8 的 TurboFan 编译阶段和 JavaScriptCore 的 FTL 编译阶段尤其激进。

### 模块运行器开销 {#module-runner-overhead}

默认情况下，Vitest 使用 Vite 模块运行器在 Node.js 中运行测试（由 [`experimental.viteModuleRunner`](/config/experimental#experimental-vitemodulerunner) 配置）。它会将所有模块导出转换为 getter，因此每次访问导入绑定都会经过类似 `__vite_ssr_module__.value` 的调用。在常规测试中，这种开销可以忽略不计；但在函数被调用数百万次的基准测试中，getter 调用本身可能占据测试时间的绝大部分。

如果检测到 getter 调用过多，Vitest 会打印警告（可通过 [`benchmark.suppressExportGetterWarnings`](/config/benchmark#benchmark-suppressexportgetterwarnings) 禁用）。对导入函数进行基准测试时，请注意这这个问题：

```ts
import { parse } from './parser.js'

const _parse = parse

test('parsing', async ({ bench }) => {
  // 不推荐：每次调用 `parse` 都会经过 getter
  await bench('parse', () => {
    parse(input)
  }).run()

  // 推荐：将引用存储到本地以绕过 getter
  await bench('parse', () => {
    _parse(input)
  }).run()
})
```

如果你是库作者，你所测试的库内部也存在同样的开销：源码中的每次跨模块调用都会经过相同的 getter 包装器。如果要测试自己的库，有两种方式可以消除该开销：

**测试预构建产物。** 通过包名导入库（包名会解析到构建产物），不要直接引用源码。构建文件已将内部导入合并为直接引用，因此 Vite 模块运行器处理的只是一个不含内部 getter 的单一模块：

```ts
// 不推荐：库内每次内部调用都会经过 getter
import { parse } from '../src/index.ts'

// 推荐：发布入口不含内部 getter
import { parse } from 'my-library'
```

如果要将自己的库与其他包比较，请为每个实现测试同类产物。对于工作区中的包，请确保包名解析到构建输出而不是源码，例如在 Vite 中将包标记为外部依赖，或从 `dist` 导入。

**为基准测试禁用模块运行器。** 如果基准测试不需要 Vite 转换、模拟或 Vitest 模块拦截，可以在基准测试 project 中禁用 [`experimental.viteModuleRunner`](/config/experimental#experimental-vitemodulerunner)，让 Node 直接运行原生 ESM。

这只影响 Node.js 模式。浏览器模式使用原生 ESM 导入，不存在此开销。

### 特定引擎注意事项 {#engine-specific-considerations}

#### V8 (Node.js, Chrome)

- **JIT 分层**：V8 会经过多个优化层（Sparkplug → Maglev → TurboFan）逐步编译函数。函数在预热阶段和稳定阶段的运行速度可能不同。Tinybench 会自动处理预热，但运行时间过短的基准测试可能无法进入最高优化层级。
- **反优化**：如果遇到意外的类型或对象类型，V8 可能在基准测试过程中从优化代码中 “退出”。请保持基准测试函数中的类型一致：

  ```ts
  test('process items', async ({ bench }) => {
    // 不推荐：混合类型会导致反优化
    await bench('process', () => {
      for (const item of items) {
        // 某些元素为 { name: string }，另一些为 { name: string, id: number }
        process(item)
      }
    }).run()

    // 推荐：保持对象类型一致
    await bench('process', () => {
      for (const item of items) {
        // 所有元素都具有相同类型 { name: string, id: number }
        process(item)
      }
    }).run()
  })
  ```

- **垃圾回收**：基准测试循环中的大量分配会增加 GC 噪声。如果测量的是计算过程，请在 `setup` 钩子中预先分配数据，而不是在被测函数内分配：

  ```ts
  test('sorting', async ({ bench }) => {
    const original = Array.from({ length: 10000 }).fill(Math.random())
    let data: number[]

    // 不推荐：每次迭代都分配新数组，GC 会增加噪声
    await bench('sort', () => {
      const data = Array.from({ length: 10000 }).fill(Math.random())
      data.sort()
    }).run()

    // 推荐：预先分配，并在 beforeEach 中复制
    await bench(
      'sort',
      () => { data.sort() },
      {
        beforeEach() {
          data = [...original]
        },
      },
    ).run()
  })
  ```

#### JavaScriptCore (Bun, Safari)

- **不同的优化阈值**：JSC 使用自己的 JIT 层（LLInt → Baseline → DFG → FTL），内联和优化启发式规则也不同。在 V8 上很快的基准测试，在 JSC 上的表现可能截然不同。
- **异步基准测试**：Bun 的事件循环实现与 Node.js 不同。如果基准测试涉及异步操作或计时器，结果可能无法直接跨运行时比较。

#### 浏览器 {#browser}

- **计时器分辨率**：浏览器可能出于安全原因降低 `performance.now()` 的精度（例如降低到 100μs，甚至 1ms）。这会使极快操作难以准确测量，因此请增加迭代次数进行补偿：

  ```ts
  test('fast operations', async ({ bench }) => {
    await bench.compare(
      bench('fast-op', () => { fastOp() }),
      bench('other-op', () => { otherOp() }),
      {
        // 增加迭代次数有助于克服较低的计时器分辨率
        iterations: 1000,
      },
    )
  })
  ```

- **浏览器差异**：V8（Chrome）、SpiderMonkey（Firefox）和 JSC（Safari）对不同模式的优化方式不同。在 Chrome 中表现更好的库，在 Firefox 中可能恰好相反。
