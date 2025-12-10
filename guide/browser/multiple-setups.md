# 多环境配置 {#multiple-setups}

你可以使用 [`browser.instances`](/config/browser/instances) 选项来指定多个不同的浏览器设置。

与 [测试项目](/guide/projects) 相比，使用 `browser.instances` 的最大好处在于缓存效率更高。所有项目会共享同一个 Vite 服务器，因此文件转换和 [依赖的预打包](https://vite.dev/guide/dep-pre-bundling.html) 只需进行一次即可。

## 多个浏览器 {#several-browsers}

你可以使用 `browser.instances` 字段来为不同的浏览器指定选项。例如，如果你想在不同的浏览器中运行相同的测试，最小配置将如下所示：

```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
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

## 不同的配置方案 {#different-setups}

你还可以独立于浏览器指定不同的配置选项（尽管，实例也可以有 `browser` 字段）：

::: code-group
```ts [vitest.config.ts]
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [
        {
          browser: 'chromium',
          name: 'chromium-1',
          setupFiles: ['./ratio-setup.ts'],
          provide: {
            ratio: 1,
          },
        },
        {
          browser: 'chromium',
          name: 'chromium-2',
          provide: {
            ratio: 2,
          },
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

## 过滤 {#filtering}

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
