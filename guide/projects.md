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

Vitest 会将 `packages` 中的每个文件夹视为独立项目，即使其中没有配置文件。如果 glob 模式匹配到文件，它将验证文件名是否以 `vitest.config`/`vite.config` 开头，或匹配 `(vite|vitest).*.config.*` 模式，以确保它是 Vitest 配置文件。例如，以下配置文件是有效的：

- `vitest.config.ts`
- `vite.config.js`
- `vitest.unit.config.ts`
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
        // 添加 "extends: true" 继承根配置中的选项
        extends: true,
        test: {
          include: ['tests/**/*.{browser}.test.{ts,js}'],
          // 建议内联配置时定义项目名称
          name: 'happy-dom',
          environment: 'happy-dom',
        }
      },
      {
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

项目配置不会继承根配置文件中的选项。你可以创建共享配置文件，并在项目配置中手动合并：

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

另外，你可以使用 `extends` 选项继承根配置，所有选项都会被合并。

```ts [vitest.config.ts]
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    pool: 'threads',
    projects: [
      {
        // 继承此配置的选项，如 plugins 和 pool
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
        },
      },
      {
        // 不继承任何此配置的选项
        // 这是默认行为
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

::: danger 不支持的选项
部分配置选项不允许在项目配置中使用，主要包括：

- `coverage`：覆盖率统计针对整个进程
- `reporters`：只支持根级别的 reporters
- `resolveSnapshotPath`：只尊重根级别的快照路径解析器
- 其他不影响测试运行器的选项

所有不支持在项目配置中使用的配置选项，在 ["配置"](/config/) 指南中会用 <CRoot /> 标记。它们必须在根配置文件中定义一次。
:::
