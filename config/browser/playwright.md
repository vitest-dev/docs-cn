# 配置 Playwright {#configuring-playwright}

要使用 playwright 运行测试，你需要安装 [`@vitest/browser-playwright`](https://npmx.dev/package/@vitest/browser-playwright) npm 包，并在配置中的 `test.browser.provider` 属性中指定其 `playwright` 导出：

```ts [vitest.config.js]
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    },
  },
})
```

你可以在顶层或实例内部调用 `playwright` 时配置 [`launchOptions`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch)、[`connectOptions`](https://playwright.dev/docs/api/class-browsertype#browser-type-connect) 和 [`contextOptions`](https://playwright.dev/docs/api/class-browser#browser-new-context)：

```ts{7-14,21-26} [vitest.config.js]
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      // 所有实例之间共享提供者选项
      provider: playwright({
        launchOptions: {
          slowMo: 50,
          channel: 'chrome-beta',
        },
        actionTimeout: 5_000,
      }),
      instances: [
        { browser: 'chromium' },
        {
          browser: 'firefox',
          // 仅为单个实例覆盖选项
          // 这不会将选项与父选项合并
          provider: playwright({
            launchOptions: {
              firefoxUserPrefs: {
                'browser.startup.homepage': 'https://example.com',
              },
            },
          })
        }
      ],
    },
  },
})
```

::: warning
与 Playwright 测试运行器不同，Vitest 打开一个_single_页面来运行同一文件中定义的所有测试。这意味着隔离仅限于单个测试文件，而不是每个测试。
:::

## launchOptions

这些选项直接传递给 `playwright[browser].launch` 命令。我们可以在 [Playwright 文档](https://playwright.dev/docs/api/class-browsertype#browser-type-launch) 中阅读有关该命令和可用参数的更多信息。

::: warning
Vitest 将忽略 `launch.headless` 选项。请改用 [`test.browser.headless`](/config/browser/headless)。

请注意，如果启用了 [`--inspect`](/guide/cli#inspect)，Vitest 会将调试标志推送到 `launch.args`。
:::

## connectOptions

这些选项直接传递给 `playwright[browser].connect` 命令。你可以在 [Playwright 文档](https://playwright.dev/docs/api/class-browsertype#browser-type-connect) 中了解更多关于该命令和可用参数的信息。
<!-- TODO: translation -->
Use `connectOptions.wsEndpoint` to connect to an existing Playwright server instead of launching browsers locally. This is useful for running browsers in Docker, in CI, or on a remote machine.

::: warning

Vitest forwards `launchOptions` to Playwright server via the `x-playwright-launch-options` header. This works only if the remote Playwright server supports this header, for example when using the `playwright run-server` CLI.

:::

::: details Example: Running a Playwright Server in Docker
To run browsers in a Docker container (see [Playwright Docker guide](https://playwright.dev/docs/docker#remote-connection)):

Start a Playwright server using Docker Compose:

```yaml [docker-compose.yml]
services:
  playwright:
    image: mcr.microsoft.com/playwright:v1.58.1-noble
    command: /bin/sh -c "npx -y playwright@1.58.1 run-server --port 6677 --host 0.0.0.0"
    init: true
    ipc: host
    user: pwuser
    ports:
      - '6677:6677'
```

```sh
docker compose up -d
```

Then configure Vitest to connect to it. The [`exposeNetwork`](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-option-expose-network) option lets the containerized browser reach Vitest's dev server on the host:

```ts [vitest.config.ts]
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      provider: playwright({
        connectOptions: {
          wsEndpoint: 'ws://127.0.0.1:6677/',
          exposeNetwork: '<loopback>',
        },
      }),
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' },
      ],
    },
  },
})
```
:::

## contextOptions

Vitest 通过调用 [`browser.newContext()`](https://playwright.dev/docs/api/class-browsercontext) 为每个测试文件创建一个新的上下文。你可以通过指定 [自定义参数](https://playwright.dev/docs/api/class-browser#browser-new-context) 来配置此行为。

::: tip
请注意，上下文是为每个 _测试文件_ 创建的，而不是像 Playwright 测试运行器那样为每个 _测试_ 创建。
:::

::: warning
如果我们的服务器通过 HTTPS 提供服务，Vitest 始终将 `ignoreHTTPSErrors` 设置为 `true`，并将 `serviceWorkers` 设置为 `'allow'`，以支持通过 [MSW](https://mswjs.io) 进行模块模拟。

建议使用 [`test.browser.viewport`](/config/browser/headless) 而不是在此处指定它，因为在无头模式下运行测试时会丢失该设置。
:::

## `actionTimeout`

- **默认:** 无超时

此值配置 Playwright 等待所有可访问性检查通过并 [操作](/api/browser/interactivity) 实际完成的默认超时时间。

我们还可以为每个操作配置操作超时：

```ts
import { page, userEvent } from 'vitest/browser'

await userEvent.click(page.getByRole('button'), {
  timeout: 1_000,
})
```

<!-- TODO: translation -->

## `persistentContext` <Version>4.1.0</Version> {#persistentcontext}

- **Type:** `boolean | string`
- **Default:** `false`

When enabled, Vitest uses Playwright's [persistent context](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context) instead of a regular browser context. This allows browser state (cookies, localStorage, DevTools settings, etc.) to persist between test runs.

::: warning
This option is ignored when running tests in parallel (e.g. when headless with [`fileParallelism`](/config/fileparallelism) enalbed) since persistent context cannot be shared across parallel sessions.
:::

- When set to `true`, the user data is stored in `./node_modules/.cache/vitest-playwright-user-data`
- When set to a string, the value is used as the path to the user data directory

```ts [vitest.config.js]
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      provider: playwright({
        persistentContext: true,
        // or specify a custom directory:
        // persistentContext: './my-browser-data',
      }),
      instances: [{ browser: 'chromium' }],
    },
  },
})
```
