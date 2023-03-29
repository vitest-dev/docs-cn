---
title: Browser Mode | Guide
---

# 浏览器模式 (实验性)

此页面提供有关 Vitest API 中实验性浏览器模式功能的信息，该功能允许你在浏览器中本地运行测试，提供对窗口和文档等浏览器全局变量的访问。此功能目前正在开发中，API 未来可能会更改。

## 配置

要在 Vitest 配置中激活浏览器模式，你可以使用 `--browser` 标志或在你的 Vitest 配置文件中将 `browser.enabled` 字段设置为 `true`。这是使用浏览器字段的示例配置：

```ts
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome', // browser name is required
    },
  },
})
```

## 浏览器选项类型:

Vitest 中的浏览器选项取决于提供者。如果你传递 `--browser` 并且未在配置文件中指定其名称，Vitest 将失败。可用选项：

- `webdriverio` (默认) 支持以下浏览器:
  - `firefox`
  - `chrome`
  - `edge`
  - `safari`
- `playwright` 支持以下浏览器:
  - `firefox`
  - `webkit`
  - `chromium`

## 跨浏览器测试:

当你在浏览器选项中指定浏览器名称时，Vitest 将默认尝试使用 [WebdriverIO](https://webdriver.io/) 运行指定的浏览器，然后在那里运行测试。此功能使跨浏览器测试易于在 CI 等环境中使用和配置。如果不想使用 WebdriverIO，可以使用 `browser.provider` 选项配置自定义浏览器提供程序。

要使用 CLI 指定浏览器，请使用 `--browser` 标志后跟浏览器名称，如下所示：

```sh
npx vitest --browser=chrome
```

或者你可以使用点符号向 CLI 提供浏览器选项：

```sh
npx vitest --browser.name=chrome --browser.headless
```

::: tip NOTE
当使用带有 WebdriverIO 的 Safari 浏览器选项时，需要通过在你的设备上运行 `sudo safaridriver --enable` 来激活`safaridriver`。

此外，在运行测试时，Vitest 将尝试安装一些驱动程序用于兼容 `safaridriver`。
:::

## Headless

headless 模式是浏览器模式下可用的另一个选项。在 headless 模式下，浏览器在没有用户界面的情况下在后台运行，这对于运行自动化测试非常有用。Vitest 中的 headless 选项可以设置为布尔值以启用或禁用 headless 模式。

这是启用 headless 模式的示例配置：

```ts
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
    },
  },
})
```

你还可以在 CLI 中使用 `--browser.headless` 标志设置 headless 模式，如下所示：

```sh
npx vitest --browser.name=chrome --browser.headless
```

在这种情况下，Vitest 将使用 Chrome 浏览器以 headless 模式运行。

## 限制

### 线程阻塞对话框

使用 Vitest 浏览器时，需要注意的是像 `alert` 或 `confirm` 这样的线程阻塞对话框不能在本地使用。这是因为它们阻塞了网页，这意味着 Vitest 无法继续与该页面通信，导致执行挂起。

在这种情况下，Vitest 为这些 API 提供默认模拟和默认返回值。这确保如果用户不小心使用了同步弹出式 Web API，执行不会挂起。但是，仍然建议用户模拟这些 Web API 以获得更好的体验。在 [Mocking](/guide/mocking) 中阅读更多内容。
