---
title: name | 配置
---

# name

- **类型:**

```ts
interface UserConfig {
  name?: string | { label: string; color?: LabelColor }
}
```

你可以为测试项目或 Vitest 进程分配一个自定义名称。该名称将显示在命令行页面（CLI）和 UI 模式中，同时也可以通过 Node.js API 中的 project.name [`project.name`](/api/advanced/test-project#name) 访问。

通过提供包含 `color` 属性的对象，可以改变命令行页面（CLI） 和 UI 模式使用的颜色。

## 颜色 {#colors}

最终显示的颜色取决于你的终端配色方案。在 UI 模式中，颜色与其对应的 CSS 值相同。

- black
- red
- green
- yellow
- blue
- magenta
- cyan
- white

## 示例 {#example}

::: code-group

```js [string]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'unit',
  },
})
```

```js [object]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: {
      label: 'unit',
      color: 'blue',
    },
  },
})
```

:::

当你有多个项目时，这个属性适用于在终端中区分它们：

```js{7,11} [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        name: 'unit',
        include: ['./test/*.unit.test.js'],
      },
      {
        name: 'e2e',
        include: ['./test/*.e2e.test.js'],
      },
    ],
  },
})
```

::: tip
Vitest 在未提供名称时会自动分配一个名称。分配顺序如下：

- 如果项目对应一个配置文件或目录，Vitest 会使用该项目 package.json 的 `name` 字段。
- 如果没有 `package.json`，Vitest 会降级到项目文件夹的名称。
- 如果项目在 `projects` 数组中直接定义为一个对象，Vitest 会为其分配一个数字名称，该数字对应该项目在数组中的位置（从 0 开始）。
  :::

::: warning
需注意，项目不能有相同的名称。Vitest 将在配置解析过程中抛出错误。
:::

你也可以为不同的浏览器 [实例](/config/browser/instances) 分配不同的名称：

```js{10,11} [vitest.config.js]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium', name: 'Chrome' },
        { browser: 'firefox', name: 'Firefox' },
      ],
    },
  },
})
```

::: tip
浏览器实例会继承其父项目的名称，并在括号中追加浏览器名称。例如，一个名为 `browser` 的项目，其 chromium 实例会显示为 ` browser (chromium)`。

如果父项目没有名称，或实例定义在根级别而非项目内部，实例名称会默认为浏览器值（例如 `chromium`）。要覆盖当前行为，可以在实例上显式地设置 `name` 属性。
:::
