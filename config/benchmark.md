---
title: benchmark | 配置
outline: deep
---

# benchmark <Experimental /> {#benchmark}

- **类型:** `{ include?, exclude?, ... }`

运行 `vitest bench` 时使用的选项。

## benchmark.enabled

- **Type:** `boolean`
- **Default:** `false`

Enables the benchmark project. When set, Vitest creates a dedicated benchmark project alongside your regular test project, runs files matching [`benchmark.include`](#benchmark-include) in it, and exposes the [`bench` fixture](/guide/test-context#bench) to those files. Running `vitest bench` enables this automatically.

## benchmark.include

- **类型:** `string[]`
- **默认值:** `['**/*.{bench,benchmark}.?(c|m)[jt]s?(x)']`

匹配包含基准测试文件的 glob 规则。

## benchmark.exclude

- **类型:** `string[]`
- **默认值:** `['node_modules', 'dist', '.idea', '.git', '.cache']`

匹配排除基准测试文件的 glob 规则。

## benchmark.includeSource

- **类型:** `string[]`
- **默认值:** `[]`

匹配包含内联基准测试文件的 glob 规则。此选项类似于 [`includeSource`](/config/include-source)。

定义后，Vitest 将运行所有匹配的文件，其中包含 `import.meta.vitest`。

## benchmark.retainSamples

<<<<<<< HEAD
- **类型:** `Arrayable<BenchmarkBuiltinReporters | Reporter>`
- **默认值:** `'default'`

用于定义输出的自定义报告器。它可以包含一个或多个内置报告名称、报告实例和(或)自定义报告的路径。
=======
- **Type:** `boolean`
- **Default:** `false`

Include the `samples` array of per-iteration timings on every benchmark result. Disabled by default to reduce memory usage; enable when a custom reporter or API consumer needs the raw samples.
>>>>>>> 95a42b873eceba8fb4b8c4636c7cb7e121d17102


<<<<<<< HEAD
已弃用，建议使用 `benchmark.outputJson`。
=======
## benchmark.suppressExportGetterWarnings
>>>>>>> 95a42b873eceba8fb4b8c4636c7cb7e121d17102

- **Type:** `boolean`
- **Default:** `false`

<<<<<<< HEAD
- **类型:** `string | undefined`
- **默认值:** `undefined`

存储基准测试结果的文件路径，可用于稍后的 `--compare` 选项。

例如：

```sh
# 保存主分支的结果
git checkout main
vitest bench --outputJson main.json

# 切换到另一个分支并与主分支进行比较
git checkout feature
vitest bench --compare main.json
```

## benchmark.compare {#benchmark-compare}

- **类型:** `string | undefined`
- **默认值:** `undefined`

用于与当前运行结果进行比较的先前基准测试结果的文件路径。
=======
Suppress the warning printed when a benchmark accesses module export getters too many times. Vitest tracks getter access during benchmark runs because Vite's module runner wraps every export in a getter, and excessive access can dominate the measurement (see [Module Runner Overhead](/guide/benchmarking#module-runner-overhead)). Enable this when you've intentionally accepted the overhead, or when the warning is noisy for benchmarks where the getter cost is negligible.

>>>>>>> 95a42b873eceba8fb4b8c4636c7cb7e121d17102
