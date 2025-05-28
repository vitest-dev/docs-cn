# 多种设置

自 Vitest 3 起，你可以使用新的 [`browser.instances`](/guide/browser/config#browser-instances) 选项来指定多个不同的浏览器设置。

<<<<<<< HEAD
使用 `browser.instances` 而不是 [workspace](/guide/workspace) 的主要优势是改进了缓存。每个项目都将使用相同的 Vite 服务器，这意味着文件转换和 [依赖项预捆绑](https://vite.dev/guide/dep-pre-bundling.html) 只需进行一次。
=======
The main advantage of using the `browser.instances` over the [test projects](/guide/projects) is improved caching. Every project will use the same Vite server meaning the file transform and [dependency pre-bundling](https://vite.dev/guide/dep-pre-bundling.html) has to happen only once.
>>>>>>> d49323b204753320f9bab505a20de9681aaba6b8

## 多个浏览器

你可以使用 `browser.instances` 字段来为不同的浏览器指定选项。例如，如果你想在不同的浏览器中运行相同的测试，最小配置将如下所示：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' },
      ],
    },
  },
})
```

## 不同的设置

你还可以独立于浏览器指定不同的配置选项（尽管，实例也可以有 `browser` 字段）：

::: code-group
```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [
        {
          browser: 'chromium',
          name: 'chromium-1',
          setupFiles: ['./ratio-setup.ts'],
          provide: {
            ratio: 1,
          }
        },
        {
          browser: 'chromium',
          name: 'chromium-2',
          provide: {
            ratio: 2,
          }
        },
      ],
    },
  },
})
```
```ts [example.test.ts]
import { expect, inject, test } from 'vitest'
import { globalSetupModifier } from './example.js'

test('ratio works', () => {
  expect(inject('ratio') * globalSetupModifier).toBe(14)
})
```
:::

在这个例子中，Vitest 将在 `chromium` 浏览器中运行所有测试，但仅在第一个配置中执行 `'./ratio-setup.ts'` 文件，并根据 [`provide` 字段](/config/#provide) 注入不同的 `ratio` 值。

::: warning
请注意，如果你使用相同的浏览器名称，则需要定义自定义的 `name` 值，因为否则 Vitest 会将 `browser` 作为项目名称。
:::

## 过滤

你可以使用 [`--project` 标志](/guide/cli#project) 来过滤要运行的项目。如果未手动分配项目名称，Vitest 会自动将浏览器名称作为项目名称。如果根配置已经有一个名称，Vitest 会将它们合并：`custom` -> `custom (browser)`。

```shell
$ vitest --project=chromium
```

::: code-group
```ts{6,8} [default]
export default defineConfig({
  test: {
    browser: {
      instances: [
        // name: chromium
        { browser: 'chromium' },
        // name: custom
        { browser: 'firefox', name: 'custom' },
      ]
    }
  }
})
```
```ts{3,7,9} [custom]
export default defineConfig({
  test: {
    name: 'custom',
    browser: {
      instances: [
        // name: custom (chromium)
        { browser: 'chromium' },
        // name: manual
        { browser: 'firefox', name: 'manual' },
      ]
    }
  }
})
```
:::

::: warning
Vitest 无法运行多个将 `headless` 模式设置为 `false`（默认行为）的实例。在开发过程中，你可以在终端中选择要运行的项目：

```shell
? Found multiple projects that run browser tests in headed mode: "chromium", "firefox".
Vitest cannot run multiple headed browsers at the same time. Select a single project
to run or cancel and run tests with "headless: true" option. Note that you can also
start tests with --browser=name or --project=name flag. › - Use arrow-keys. Return to submit.
❯   chromium
    firefox
```

如果我们在 CI 中有多个非 headless 项目（即在配置中手动设置了 `headless: false` 并且未在 CI 环境中覆盖），Vitest 将运行失败并且不会启动任何测试。

这一限制不影响在无头模式下运行测试的能力。只要实例没有设置 `headless: false`，你仍然可以并行运行所有实例。
:::
