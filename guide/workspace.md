---
title: 工作空间 | 指南
---

# 工作空间

::: tip Sample Project

[GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/workspace) - [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/workspace?initialPath=__vitest__/)

:::

Vitest 通过工作空间配置文件提供了对 monorepos 的内置支持。你可以创建一个工作空间来定义项目的配置。

## 定义工作空间

<<<<<<< HEAD
一个工作区应该在其根目录下（如果你有配置文件，则与其位于同一文件夹中）有一个名为 `vitest.workspace` 或 `vitest.projects` 的文件。Vitest 支持 `ts`/`js`/`json` 扩展名的文件。

工作区配置文件应该有一个默认导出，其中包含一个文件列表或 glob 模式，引用你的项目。例如，如果你有一个名为 `packages` 的项目文件夹，你可以使用以下配置文件定义一个工作区：
=======
A workspace must include a `vitest.workspace` or `vitest.projects` file in its root directory (located in the same folder as your root configuration file, if applicable). Vitest supports `ts`, `js`, and `json` extensions for this file.

::: tip NAMING
Please note that this feature is named `workspace`, not `workspaces` (without an "s" at the end).
:::

Workspace configuration file must have a default export with a list of files or glob patterns referencing your projects. For example, if you have a folder named `packages` that contains your projects, you can define a workspace with this config file:
>>>>>>> e6594ecd13347c1f74a738bf7cc936a9e695f88d

:::code-group

```ts [vitest.workspace.ts]
export default ['packages/*']
```

:::

<<<<<<< HEAD
即使某个文件夹中没有配置文件，Vitest 也会将 `packages` 文件夹中的每个文件夹视为单独的项目。自 Vitest 2.1 起，如果此 glob 模式匹配到任何文件，即使文件名中没有 `vitest` 也会被视为 Vitest 配置文件。

::: warning
除非在此配置文件中指定，否则 Vitest 不会将根配置文件视为工作区项目（因此它不会运行在 `include` 中指定的测试）。
=======
Vitest will treat every folder in `packages` as a separate project even if it doesn't have a config file inside. Since Vitest 2.1, if this glob pattern matches any file it will be considered a Vitest config even if it doesn't have a `vitest` in its name.

::: warning
Vitest does not treat the root `vitest.config` file as a workspace project unless it is explicitly specified in the workspace configuration. Consequently, the root configuration will only influence global options such as `reporters` and `coverage`.
>>>>>>> e6594ecd13347c1f74a738bf7cc936a9e695f88d
:::

你还可以使用项目的配置文件引用项目：

:::code-group

```ts [vitest.workspace.ts]
export default ['packages/*/vitest.config.{e2e,unit}.ts']
```

:::

<<<<<<< HEAD
该模式仅包括具有包含 `e2e` 和 `unit` 的 `vitest.config` 文件的项目。这些关键字需要在文件扩展名之前出现。

你还可以使用内联配置定义项目。工作区文件支持同时使用这两种语法。
=======
This pattern will only include projects with a `vitest.config` file that contains `e2e` or `unit` before the extension.

You can also define projects using inline configuration. The workspace file supports both syntaxes simultaneously.
>>>>>>> e6594ecd13347c1f74a738bf7cc936a9e695f88d

:::code-group
```ts [vitest.workspace.ts]
import { defineWorkspace } from 'vitest/config'

// defineWorkspace 会提供一个很好的类型提示开发体验
export default defineWorkspace([
  // matches every folder and file inside the `packages` folder
  'packages/*',
  {
    // 添加 "extends" 将两个配置合并到一起
    extends: './vite.config.js',
    test: {
      include: ['tests/**/*.{browser}.test.{ts,js}'],
      // 在使用内联配置的时候，建议定义一个名称
      name: 'happy-dom',
      environment: 'happy-dom',
    },
  },
  {
    test: {
      include: ['tests/**/*.{node}.test.{ts,js}'],
      name: 'node',
      environment: 'node',
    },
  },
])
```

:::

::: warning
<<<<<<< HEAD
所有项目应该具有唯一的名称。否则，Vitest 会抛出错误。如果你没有在内联配置中提供名称，Vitest 将分配一个数字。如果你没有在使用 glob 语法定义的项目配置中提供名称，Vitest 将默认使用目录名称。
:::

如果你不依赖内联配置，你可以在根目录中创建一个小的 JSON 文件：
=======
All projects must have unique names; otherwise, Vitest will throw an error. If a name is not provided in the inline configuration, Vitest will assign a number. For project configurations defined with glob syntax, Vitest will default to using the "name" property in the nearest `package.json` file or the folder name if no such file exists.
:::

If you do not use inline configurations, you can create a small JSON file in your root directory:
>>>>>>> e6594ecd13347c1f74a738bf7cc936a9e695f88d

:::code-group

```json [vitest.workspace.json]
["packages/*"]
```

:::

<<<<<<< HEAD
工作区项目不支持所有配置属性。为了获得更好的类型安全性，请在项目配置文件中使用 `defineProject` 方法而不是 `defineConfig` 方法：
=======
Workspace projects do not support all configuration properties. For better type safety, use the `defineProject` method instead of `defineConfig` within project configuration files:
>>>>>>> e6594ecd13347c1f74a738bf7cc936a9e695f88d

:::code-group
```ts [packages/a/vitest.config.ts] twoslash
// @errors: 2769
import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    environment: 'jsdom',
    // "reporters" 在项目配置中是不支持的，
    // 所以会报错
    reporters: ['json'],
  },
})
```

:::

## 运行测试

要在工作区内运行测试，请在根目录 `package.json` 中定义一个脚本：

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

现在可以使用 CLI 运行测试了：

::: code-group

```bash [npm]
npm run test
```

```bash [yarn]
yarn test
```

```bash [pnpm]
pnpm run test
```

```bash [bun]
bun test
```

:::

如果只需在单个项目内运行测试，使用 `--project` CLI 选项：

::: code-group
```bash [npm]
npm run test --project e2e
```
```bash [yarn]
yarn test --project e2e
```
```bash [pnpm]
pnpm run test --project e2e
```
```bash [bun]
bun test --project e2e
```
:::

::: tip
CLI 选项 `--project` 可多次使用，以筛选出多个项目：

::: code-group
```bash [npm]
npm run test --project e2e --project unit
```
```bash [yarn]
yarn test --project e2e --project unit
```
```bash [pnpm]
pnpm run test --project e2e --project unit
```
```bash [bun]
bun test --project e2e --project unit
```
:::

## 配置

没有任何配置选项从根级别的配置文件继承。你可以创建一个共享的配置文件，并将其与项目配置文件合并：

::: code-group
```ts [packages/a/vitest.config.ts]
import { defineProject, mergeConfig } from 'vitest/config'
import configShared from '../vitest.shared.js'

export default mergeConfig(
  configShared,
  defineProject({
    test: {
      environment: 'jsdom',
    },
  })
)
```

:::

<<<<<<< HEAD
在 `defineWorkspace`级别，你也可以使用 `extends`选项来继承根级别配置。
=======
At the `defineWorkspace` level, you can use the `extends` option to inherit from your root-level configuration. All options will be merged.

>>>>>>> e6594ecd13347c1f74a738bf7cc936a9e695f88d
::: code-group
```ts [vitest.workspace.ts]
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'unit',
      include: ['**/*.unit.test.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'integration',
      include: ['**/*.integration.test.ts'],
    },
  },
])
```
:::

<<<<<<< HEAD
此外，某些配置选项不允许在项目配置中使用。其中最明显的是：
=======
Some of the configuration options are not allowed in a project config. Most notably:
>>>>>>> e6594ecd13347c1f74a738bf7cc936a9e695f88d

- `coverage`: 覆盖率是针对整个工作区进行的。
- `reporters`: 仅支持根级别的报告器。
- `resolveSnapshotPath`: 仅支持根级别的解析器。
- 所有其他不影响测试运行器的选项。

::: tip
<<<<<<< HEAD
所有不支持在项目配置中使用的配置选项，在 ["Config"](/config/) 页面上都有一个 <NonProjectOption /> 标记。
:::

## 覆盖率

工作区项目的覆盖范围开箱即用。
=======
All configuration options that are not supported inside a project configuration are marked with a <NonProjectOption /> sign in the ["Config"](/config/) guide.
:::
>>>>>>> e6594ecd13347c1f74a738bf7cc936a9e695f88d
