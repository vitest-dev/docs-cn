---
title: typecheck | 配置
outline: deep
---

# typecheck <Experimental /> {#typecheck}

Options for configuring [typechecking](/guide/testing-types) test environment.

## typecheck.enabled {#typecheck-enabled}

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--typecheck`, `--typecheck.enabled`

Enable typechecking alongside your regular tests.

## typecheck.only {#typecheck-only}

- **类型:** `boolean`
- **默认值:** `false`
- **命令行终端:** `--typecheck.only`

Run only typecheck tests, when typechecking is enabled. When using CLI, this option will automatically enable typechecking.

## typecheck.checker

- **类型:** `'tsc' | 'vue-tsc' | string`
- **默认值:** `tsc`

What tools to use for type checking. Vitest will spawn a process with certain parameters for easier parsing, depending on the type. Checker should implement the same output format as `tsc`.

You need to have a package installed to use typechecker:

- `tsc` requires `typescript` package
- `vue-tsc` requires `vue-tsc` package

You can also pass down a path to custom binary or command name that produces the same output as `tsc --noEmit --pretty false`.

## typecheck.include

- **类型:** `string[]`
- **默认值:** `['**/*.{test,spec}-d.?(c|m)[jt]s?(x)']`

Glob pattern for files that should be treated as test files

## typecheck.exclude

- **类型:** `string[]`
- **默认值:** `['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']`

Glob pattern for files that should not be treated as test files

## typecheck.allowJs

- **类型:** `boolean`
- **默认值:** `false`

Check JS files that have `@ts-check` comment. If you have it enabled in tsconfig, this will not overwrite it.

## typecheck.ignoreSourceErrors

- **类型:** `boolean`
- **默认值:** `false`

Do not fail, if Vitest found errors outside the test files. This will not show you non-test errors at all.

By default, if Vitest finds source error, it will fail test suite.

## typecheck.tsconfig

- **类型:** `string`
- **默认值:** _tries to find closest tsconfig.json_

Path to custom tsconfig, relative to the project root.

## typecheck.spawnTimeout

- **类型:** `number`
- **默认值:** `10_000`

Minimum time in milliseconds it takes to spawn the typechecker.
