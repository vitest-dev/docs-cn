---
title: 测试项目 | 指南
---

# 测试项目 {#test-projects}

::: tip 示例项目

[GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/projects) - [在线演示](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/projects?initialPath=__vitest__/)

:::

::: warning
此功能也称为 `workspace`。`workspace` 自 3.2 版本起已被废弃，并由 `projects` 配置取代。它们的功能是相同的。
:::

Vitest 提供了一种在单个 Vitest 进程中定义多个项目配置的方法。此功能特别适用于 monorepo 结构，也可以用于使用不同配置运行测试，例如 `resolve.alias`、`plugins`、`test.browser` 等。

## 定义项目 {#defining-projects}

你可以在根目录的 [配置文件](/config/) 中定义项目：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*'],
  },
})
```

项目配置可以是内联配置、文件或指向项目的 glob 模式。例如，如果你有一个名为 `packages` 的文件夹包含多个项目，可以在 Vitest 配置文件中定义一个数组：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*'],
  },
})
```

即使其中没有配置文件，Vitest 也会将 `packages` 目录下的每个文件夹视为独立项目。当项目入口解析为文件时（无论是通过 glob 模式还是直接文件路径），Vitest 会验证文件名是否符合以下规则之一：

- 以 `vitest.config` 或 `vite.config` 开头（例如 `vitest.config.unit.ts`）
- 匹配 `vitest.<name>.config.*` 或 `vite.<name>.config.*` 格式，其中 `<name>` 可包含字母、数字、`_` 和 `-`

例如，以下配置文件均有效：

- `vitest.config.ts`
- `vite.config.js`
- `vitest.unit.config.ts`
- `vitest.e2e-node.config.ts`
- `vite.e2e.config.js`
- `vitest.config.unit.js`
- `vite.config.e2e.js`

要排除文件夹和文件，你可以使用否定模式：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 包含 "packages" 所有子文件夹，并排除 "excluded" 文件夹
    projects: [
      'packages/*',
      '!packages/excluded'
    ],
  },
})
```

如果你有一个嵌套结构，其中某些文件夹需要成为项目，但其他文件夹有自己的子文件夹，你必须使用括号来避免匹配父文件夹：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

// 举例来说，像下面这样创建项目：
// packages/a
// packages/b
// packages/business/c
// packages/business/d
// 注意："packages/business" 并不是一个项目

export default defineConfig({
  test: {
    projects: [
      // 匹配 "packages" 目录下除 "business" 所有子文件夹
      'packages/!(business)',
      // 匹配 "packages/business" 下所有子文件夹
      'packages/business/*',
    ],
  },
})
```

::: warning
Vitest 不会将根目录的 `vitest.config` 文件视为项目，除非在配置中显式指定。因此，根配置只会影响全局选项，如 `reporters` 和 `coverage`。但 Vitest 总会执行根配置文件中指定的某些插件钩子，如 `apply`、`config`、`configResolved` 或 `configureServer`。Vitest 也会使用相同的插件执行全局设置和自定义覆盖提供者。
:::

你也可以用配置文件路径来引用项目：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.{e2e,unit}.ts'],
  },
})
```

此模式只会包含带有 `e2e` 或 `unit` 字样的 `vitest.config` 文件的项目。

你还可以使用内联配置定义项目。两种语法可以同时使用。

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      // 匹配 packages 文件夹下的所有文件和文件夹
      'packages/*',
      {
        // 默认情况下，内联项目会继承
        // 此配置文件中的选项
        test: {
          include: ['tests/**/*.{browser}.test.{ts,js}'],
          // 建议内联配置时定义项目名称
          name: 'happy-dom',
          environment: 'happy-dom',
        }
      },
      {
        // 添加 "extends: false" 可忽略
        // 此配置文件中定义的选项
        extends: false,
        test: {
          include: ['tests/**/*.{node}.test.{ts,js}'],
          // 名称标签颜色可自定义
          name: { label: 'node', color: 'green' },
          environment: 'node',
        }
      }
    ]
  }
})
```

::: warning
所有项目名称必须唯一，否则 Vitest 会报错。如果内联配置未提供名称，Vitest 会自动分配数字。对于使用 glob 语法定义的项目，Vitest 会默认使用最近的 `package.json` 文件中的 "name" 属性，若无则使用文件夹名称。
:::

项目配置不支持所有配置属性。为获得更好的类型安全，建议在项目配置文件中使用 `defineProject` 方法而非 `defineConfig`：

```ts twoslash [packages/a/vitest.config.ts]
// @errors: 2769
import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    environment: 'jsdom',
    // "reporters" 不支持在项目配置中使用，
    // 因此会报错
    reporters: ['json']
  }
})
```

## 运行测试 {#running-tests}

在根目录的 `package.json` 中定义脚本：

```json [package.json]
{
  "scripts": {
    "test": "vitest"
  }
}
```

然后使用包管理器运行测试：

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

如果只想运行某个单独项目中的测试，可以使用 `--project` CLI 选项：

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
CLI 选项 `--project` 可以多次使用，以筛选多个项目：

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

## 配置说明 {#configuration}

使用内联配置定义的项目会继承根配置中的所有选项。是否继承由 `extends` 选项控制。从 Vitest 5.0 开始，该选项默认启用：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    pool: 'threads',
    projects: [
      {
        // 继承此配置中的 plugins、pool 等选项
        // （默认值为 `extends: true`）
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
        },
      },
      {
        // 不继承此配置中的任何选项
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

如果要继承根配置以外的其他配置文件，还可以将该配置文件的路径传给 `extends`：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        extends: './vitest.shared.ts',
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
        },
      },
    ],
  },
})
```

继承的配置会与项目自身的配置合并。请注意，`setupFiles` 等数组选项会进行拼接，而不是被覆盖。以下选项会采用特殊的处理方式：

- `name` 和 `projects` 永远不会被继承。
- 不会从根配置继承 `globalSetup`。根配置中的 `globalSetup` 已经会在每次测试运行时执行一次，如果继续继承，每个项目都会再次运行相同的文件。不过，继承非根配置文件时，`globalSetup` 仍会被继承。
- 如果项目自身定义了 `tags`，该数组会直接替换继承的值，而不会与其合并。

如果通过 [高级 API](/guide/advanced/) 运行 Vitest，请参阅 [项目配置解析](/guide/advanced/#project-configuration-resolution)，了解通过编程方式传入的配置如何参与继承。

通过配置文件或目录引用的项目不会继承根配置中的任何选项。你可以创建一个共享配置文件，再自行将其与项目配置合并：

```ts [packages/a/vitest.config.ts]
import { defineProject, mergeConfig } from 'vitest/config'
import configShared from '../vitest.shared.js'

export default mergeConfig(
  configShared,
  defineProject({
    test: {
      environment: 'jsdom',
    }
  })
)
```

::: danger 不支持的选项
某些配置选项不允许在项目配置中使用。最值得注意的是：

项目配置中不能使用部分配置选项。在 [“配置”](/config/) 指南中，所有不支持项目配置的选项都会用 <CRoot /> 标记。这些选项只能在根配置文件中定义一次。
:::

## 嵌套项目 {#nested-projects}

通过配置文件（或包含配置文件的目录）引用的项目，也可以在自身配置中声明 `projects`。这类配置的行为与根配置相同：它本身不运行测试，只负责提供实际运行测试的项目。借助这种方式，可以直接引用已经定义了项目的工作区：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['./packages/app/vitest.config.ts'],
  },
})
```

```ts [packages/app/vitest.config.ts]
import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    name: 'app',
    projects: [
      {
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['**/*.e2e.test.ts'],
        },
      },
    ],
  },
})
```

嵌套项目的行为与根配置中定义的项目相同。内联配置会继承声明它们的配置（在本例中是 `app` 配置，而不是根配置），`extends` 中的路径也会相对于该配置进行解析。该配置自身的 `globalSetup` 也会被这些项目继承，这与其他 [非根配置](#configuration) 的行为一致。

嵌套项目的名称会加上声明它们的配置名称作为前缀。因此，上面的示例会创建 `app (unit)` 和 `app (e2e)` 两个项目。`--project` 也可以匹配此前缀：`--project app` 会运行 `app` 配置中的所有项目，而 `--project "app (unit)"` 只运行其中一个项目。

如果还要运行声明了 `projects` 的配置自身所包含的测试，需要在 `projects` 中引用该配置文件本身：

```ts [packages/app/vitest.config.ts]
import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    name: 'app',
    include: ['**/*.test.ts'],
    projects: [
      // "app" 项目会根据自身的 "include" 运行测试，并与 "app (unit)" 项目一同执行
      './vitest.config.ts',
      {
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
        },
      },
    ],
  },
})
```

请注意，只有配置文件可以定义嵌套项目，内联配置中不支持 `projects` 选项。
