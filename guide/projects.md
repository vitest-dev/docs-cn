---
<<<<<<< HEAD:guide/workspace.md
title: 工作空间 | 指南
---

# 工作空间
=======
title: Test Projects | Guide
---

# Test Projects
>>>>>>> d49323b204753320f9bab505a20de9681aaba6b8:guide/projects.md

::: tip Sample Project

[GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/projects) - [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/projects?initialPath=__vitest__/)

:::

<<<<<<< HEAD:guide/workspace.md
Vitest 提供了在单个 Vitest 进程中定义多个项目配置的方法。该功能对单核设置尤为有用，但也可用于运行不同配置的测试，如 `resolve.alias`、`plugins` 或 `test.browser` 等。

## 定义工作空间

从 Vitest 3 开始，你可以在根 [配置](/config/) 中定义工作区。在这种情况下，如果根目录下存在 `vitest.workspace` 文件，Vitest 将会忽略它。
=======
::: warning
This feature is also known as a `workspace`. The `workspace` is deprecated since 3.2 and replaced with the `projects` configuration. They are functionally the same.
:::

Vitest provides a way to define multiple project configurations within a single Vitest process. This feature is particularly useful for monorepo setups but can also be used to run tests with different configurations, such as `resolve.alias`, `plugins`, or `test.browser` and more.

## Defining Projects

You can define projects in your root [config](/config/):
>>>>>>> d49323b204753320f9bab505a20de9681aaba6b8:guide/projects.md

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*'],
  },
})
```

<<<<<<< HEAD:guide/workspace.md
如果你使用的是较早的版本，工作区必须在其根目录中包含 `vitest.workspace` 或 `vitest.projects` 文件（如果不存在，则位于根配置文件所在的文件夹或工作目录中）。请注意，`projects` 只是一个别名，并不会改变此功能的行为或语义。Vitest 支持该文件的 `ts`、`js` 和 `json` 扩展名。

::: tip NAMING
:::

工作区是一系列内联配置、文件或引用我们项目的全局模式的列表。例如，如果我们有一个名为 `packages` 的文件夹，其中包含了我们的项目，我们可以直接创建一个工作区文件，或者在根配置中定义一个数组：

:::code-group
```ts [vitest.config.ts <Version>3.0.0</Version>]
=======
Project configurations are inlined configs, files, or glob patterns referencing your projects. For example, if you have a folder named `packages` that contains your projects, you can define an array in your root Vitest config:

```ts [vitest.config.ts]
>>>>>>> d49323b204753320f9bab505a20de9681aaba6b8:guide/projects.md
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*'],
  },
})
```

<<<<<<< HEAD:guide/workspace.md
Vitest 会将 `packages` 中的每个文件夹视为一个独立的项目，即使它里面没有配置文件。如果这个全局模式匹配到任何文件，即使文件名中没有 `vitest`，也会被视作 Vitest 的配置文件。

::: warning
Vitest 不会将根目录下的 `vitest.config` 文件视为工作区项目，除非在工作区配置中明确指定。因此，根配置只会影响全局选项，例如 `reporters` 和 `coverage`。请注意，Vitest 将始终运行根配置文件中指定的某些插件钩子，例如 `apply`、`config`、`configResolved` 或 `configureServer`。Vitest 还使用相同的插件来执行全局设置、工作区文件和自定义覆盖率提供者。
=======
Vitest will treat every folder in `packages` as a separate project even if it doesn't have a config file inside. If this glob pattern matches _any file_, it will be considered a Vitest config even if it doesn't have a `vitest` in its name or has an obscure file extension.

::: warning
Vitest does not treat the root `vitest.config` file as a project unless it is explicitly specified in the configuration. Consequently, the root configuration will only influence global options such as `reporters` and `coverage`. Note that Vitest will always run certain plugin hooks, like `apply`, `config`, `configResolved` or `configureServer`, specified in the root config file. Vitest also uses the same plugins to execute global setups and custom coverage provider.
>>>>>>> d49323b204753320f9bab505a20de9681aaba6b8:guide/projects.md
:::

你还可以使用项目的配置文件引用项目：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.{e2e,unit}.ts'],
  },
})
```

该模式仅包括具有包含 `e2e` 或 `unit` 的 `vitest.config` 文件的项目。这些关键字需要在文件扩展名之前出现。

<<<<<<< HEAD:guide/workspace.md
你也可以使用内联配置来定义项目。工作区配置同时支持这两种语法。
=======
You can also define projects using inline configuration. The configuration supports both syntaxes simultaneously.
>>>>>>> d49323b204753320f9bab505a20de9681aaba6b8:guide/projects.md

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      // matches every folder and file inside the `packages` folder
      'packages/*',
      {
        // add "extends: true" to inherit the options from the root config
        extends: true,
        test: {
          include: ['tests/**/*.{browser}.test.{ts,js}'],
          // it is recommended to define a name when using inline configs
          name: 'happy-dom',
          environment: 'happy-dom',
        }
      },
      {
        test: {
          include: ['tests/**/*.{node}.test.{ts,js}'],
          // color of the name label can be changed
          name: { label: 'node', color: 'green' },
          environment: 'node',
        }
      }
    ]
  }
})
```

::: warning
所有项目都必须有唯一的名称，否则 Vitest 会出错。如果内联配置中没有提供名称，Vitest 将分配一个数字。对于使用 glob 语法定义的项目配置，Vitest 将默认使用最近的 `package.json` 文件中的 "name" 属性，如果不存在，则使用文件夹名称。
:::

<<<<<<< HEAD:guide/workspace.md
如果我们不使用内联配置，我们可以在根目录创建一个小的 JSON 文件，或者仅仅在根配置中指定它：

```json [vitest.workspace.json]
["packages/*"]
```

工作区项目不支持所有配置属性。为了提高类型安全性，请在项目配置文件中使用 `defineProject` 方法而不是 `defineConfig` 方法：
=======
Projects do not support all configuration properties. For better type safety, use the `defineProject` method instead of `defineConfig` within project configuration files:
>>>>>>> d49323b204753320f9bab505a20de9681aaba6b8:guide/projects.md

```ts twoslash [packages/a/vitest.config.ts]
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

## 运行测试

<<<<<<< HEAD:guide/workspace.md
要在工作区内运行测试，请在根目录 `package.json` 中定义一个脚本：
=======
To run tests, define a script in your root `package.json`:
>>>>>>> d49323b204753320f9bab505a20de9681aaba6b8:guide/projects.md

```json [package.json]
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
bun run test
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
bun run test --project e2e
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
bun run test --project e2e --project unit
```
:::

## 配置

<<<<<<< HEAD:guide/workspace.md
即使工作区是在根级配置文件中定义的，而不是在单独的 `vitest.workspace` 文件中定义的，也不会从根级配置文件中继承任何配置选项。我们可以创建一个共享配置文件，并手动将其与项目配置合并：
=======
None of the configuration options are inherited from the root-level config file. You can create a shared config file and merge it with the project config yourself:
>>>>>>> d49323b204753320f9bab505a20de9681aaba6b8:guide/projects.md

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

<<<<<<< HEAD:guide/workspace.md
此外，在 `defineWorkspace` 层级，我们可以使用 `extends` 选项来继承根级别的配置。所有选项将被合并。

::: code-group
```ts [vitest.config.ts <Version>3.0.0</Version>]
=======
Additionally, you can use the `extends` option to inherit from your root-level configuration. All options will be merged.

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
>>>>>>> d49323b204753320f9bab505a20de9681aaba6b8:guide/projects.md
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    pool: 'threads',
    projects: [
      {
        // will inherit options from this config like plugins and pool
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
        },
      },
      {
        // won't inherit any options from this config
        // this is the default behaviour
        extends: false,
        test: {
          name: 'integration',
          include: ['**/*.integration.test.ts'],
        },
      },
    ],
  },
})
```

::: danger Unsupported Options
某些配置选项不允许在项目配置中使用。其中最明显的是：

<<<<<<< HEAD:guide/workspace.md
- `coverage`: 覆盖率是针对整个工作区进行的。
- `reporters`: 仅支持根级别的报告器。
- `resolveSnapshotPath`: 仅支持根级别的解析器。
- 所有其他不影响测试运行器的选项。
=======
- `coverage`: coverage is done for the whole process
- `reporters`: only root-level reporters can be supported
- `resolveSnapshotPath`: only root-level resolver is respected
- all other options that don't affect test runners
>>>>>>> d49323b204753320f9bab505a20de9681aaba6b8:guide/projects.md

所有在项目配置中不支持的配置选项在 ["Config"](/config/) 指南中都会标记为 <NonProjectOption />。这些选项必须在根配置文件中定义一次。
:::
