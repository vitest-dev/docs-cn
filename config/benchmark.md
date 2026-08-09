---
title: benchmark | 配置
outline: deep
---

# benchmark <Experimental /> {#benchmark}

- **类型:** `{ include?, exclude?, ... }`

运行 `vitest bench` 时生效的选项。

## benchmark.enabled

- **类型:** `boolean`
- **默认值:** `false`

启用独立的基准测试项目。启用后，Vitest 会在常规测试项目之外创建一个专门用于基准测试的项目。该项目会运行与 [`benchmark.include`](#benchmark-include) 匹配的文件，并向这些文件提供 [`bench` fixture](/guide/test-context#bench)。运行 `vitest bench` 时，此选项会自动启用。

## benchmark.include

- **类型:** `string[]`
- **默认值:** `['**/*.{bench,benchmark}.?(c|m)[jt]s?(x)']`

用于匹配基准测试文件的 glob 模式。

## benchmark.exclude

- **类型:** `string[]`
- **默认值:** `['node_modules', 'dist', '.idea', '.git', '.cache']`

用于排除基准测试文件的 glob 模式。

## benchmark.includeSource

- **类型:** `string[]`
- **默认值:** `[]`

用于匹配包含内联基准测试的源文件的 glob 模式。此选项与 [`includeSource`](/config/include-source) 类似。

配置此选项后，Vitest 会运行所有符合模式且包含 `import.meta.vitest` 的文件。

## benchmark.retainSamples

- **类型:** `boolean`
- **默认值:** `false`

启用后，每项基准测试的结果都会包含 `samples` 数组，用于记录每次迭代的耗时。此选项默认禁用，以减少内存占用。自定义报告器或 API 使用方需要原始采样数据时，可将其启用。

## benchmark.provider

- **类型:** `string`
- **默认值:** `undefined`（使用内置 provider）

指定负责执行已注册基准测试并返回结果的 provider。该选项应设置为模块路径，并且模块的默认导出必须实现 `BenchmarkProvider`。如果使用相对路径，Vitest 会从项目根目录开始解析。

有关配置方法和 provider API，请参阅 [自定义基准测试 provider](/guide/advanced/benchmark-provider) 指南。

## benchmark.suppressExportGetterWarnings

- **类型:** `boolean`
- **默认值:** `false`

禁止显示因基准测试频繁访问模块导出 getter 而产生的警告。Vite 的模块运行器会将每个导出包装为 getter，因此 Vitest 会在基准测试运行期间记录 getter 的访问次数。访问过于频繁时，这部分开销可能成为影响测量结果的主要因素（参阅 [模块运行器开销](/guide/benchmarking#module-runner-overhead)）。如果你已接受这项开销，或者 getter 的开销可以忽略不计但警告过于频繁造成了干扰，可启用此选项。
