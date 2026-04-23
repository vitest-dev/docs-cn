---
title: typecheck | 配置
outline: deep
---

# typecheck <Experimental /> {#typecheck}

用于配置 [类型检查](/guide/testing-types) 测试环境的选项。

## typecheck.enabled {#typecheck-enabled}

<<<<<<< HEAD
- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--typecheck`, `--typecheck.enabled`
=======
- **Type:** `boolean`
- **Default:** `false`
- **CLI:** `--typecheck`, `--typecheck.enabled`
>>>>>>> ec964f36ce7596a023a32b8265f6019c51b32926

在常规测试的同时启用类型检查。

## typecheck.only {#typecheck-only}

<<<<<<< HEAD
- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--typecheck.only`
=======
- **Type:** `boolean`
- **Default:** `false`
- **CLI:** `--typecheck.only`
>>>>>>> ec964f36ce7596a023a32b8265f6019c51b32926

仅运行类型检查测试，当类型检查启用时生效。在 CLI 中使用此选项会自动启用类型检查。

## typecheck.checker

<<<<<<< HEAD
- **类型:** `'tsc' | 'vue-tsc' | string`
- **默认值:** `tsc`
=======
- **Type:** `'tsc' | 'vue-tsc' | string`
- **Default:** `tsc`
>>>>>>> ec964f36ce7596a023a32b8265f6019c51b32926

用于类型检查的工具。Vitest 将根据所选类型启动特定参数的进程以便解析，检查器需实现与 `tsc` 相同的输出格式。

使用类型检查器前需安装对应依赖包：

- `tsc` 需要 `typescript` 包
- `vue-tsc` 需要 `vue-tsc` 包

你也可以传入自定义二进制文件的路径或命令名称，该命令需能生成与 `tsc --noEmit --pretty false` 相同的输出格式。

## typecheck.include

<<<<<<< HEAD
- **类型:** `string[]`
- **默认值:** `['**/*.{test,spec}-d.?(c|m)[jt]s?(x)']`

匹配包含测试文件的 glob 规则。

## typecheck.exclude

- **类型:** `string[]`
- **默认值:** `['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']`

匹配排除测试文件的 glob 规则。

## typecheck.allowJs

- **类型:** `boolean`
- **默认值:** `false`
=======
- **Type:** `string[]`
- **Default:** `['**/*.{test,spec}-d.?(c|m)[jt]s?(x)']`

Glob pattern for files that should be treated as test files.

## typecheck.exclude

- **Type:** `string[]`
- **Default:** `['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']`

Glob pattern for files that should not be treated as test files.

## typecheck.allowJs

- **Type:** `boolean`
- **Default:** `false`
>>>>>>> ec964f36ce7596a023a32b8265f6019c51b32926

检查有 `@ts-check` 注释的 JS 文件。 如果你在 tsconfig 中启用它，则不会覆盖它。

## typecheck.ignoreSourceErrors

<<<<<<< HEAD
- **类型:** `boolean`
- **默认值:** `false`
=======
- **Type:** `boolean`
- **Default:** `false`
>>>>>>> ec964f36ce7596a023a32b8265f6019c51b32926

如果 Vitest 在测试文件之外发现错误，则不失败。这不会显示非测试文件的错误。

默认情况下，如果 Vitest 发现源码错误，会导致测试套件运行失败。

## typecheck.tsconfig

<<<<<<< HEAD
- **类型:** `string`
- **默认值:** _尝试查找最近的 tsconfig.json_
=======
- **Type:** `string`
- **Default:** _tries to find closest tsconfig.json_
>>>>>>> ec964f36ce7596a023a32b8265f6019c51b32926

自定义 tsconfig 的路径，相对于项目根目录。

## typecheck.spawnTimeout

<<<<<<< HEAD
- **类型:** `number`
- **默认值:** `10_000`
=======
- **Type:** `number`
- **Default:** `10_000`
>>>>>>> ec964f36ce7596a023a32b8265f6019c51b32926

启动类型检查器所需的最短时间（毫秒）。
