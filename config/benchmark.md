---
title: benchmark | 配置
outline: deep
---

# benchmark <Experimental /> {#benchmark}

- **类型:** `{ include?, exclude?, ... }`

运行 `vitest bench` 时使用的选项。
<!-- TODO: translation -->
## benchmark.enabled

- **类型:** `boolean`
- **默认值:** `false`

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

- **类型:** `boolean`
- **默认值:** `false`

Include the `samples` array of per-iteration timings on every benchmark result. Disabled by default to reduce memory usage; enable when a custom reporter or API consumer needs the raw samples.

## benchmark.provider

- **类型:** `string`
- **默认值:** `undefined` (uses the built-in provider)

The benchmark provider that executes registered benchmarks and returns their results. Set this to a module path whose default export implements `BenchmarkProvider`. Relative paths are resolved from the project root.

See the [Custom Benchmark Provider](/guide/advanced/benchmark-provider) guide for setup instructions and the provider API.

## benchmark.suppressExportGetterWarnings

- **类型:** `boolean`
- **默认值:** `false`

Suppress the warning printed when a benchmark accesses module export getters too many times. Vitest tracks getter access during benchmark runs because Vite's module runner wraps every export in a getter, and excessive access can dominate the measurement (see [Module Runner Overhead](/guide/benchmarking#module-runner-overhead)). Enable this when you've intentionally accepted the overhead, or when the warning is noisy for benchmarks where the getter cost is negligible.
