---
title: Vitest UI | Guide
---

# Vitest UI

Vitest 由 Vite 提供能力，在运行测试时有一个开发服务器。这允许 Vitest 提供一个漂亮的 UI 界面来查看并与测试交互。Vitest 的 UI 界面是可选的，你可以通过以下安装：

```bash
npm i -D @vitest/ui
```

接下来，你可以通过传入 `--ui` 参数来启动测试的 UI 界面：

```bash
vitest --ui
```

最后，你可以访问 Vitest UI 界面，通过 <a href="http://localhost:51204/__vitest__/">`http://localhost:51204/__vitest__/`</a>

<img alt="Vitest UI" img-light src="https://user-images.githubusercontent.com/11247099/171992267-5cae2fa0-b927-400a-8eb1-da776974cb61.png">
<img alt="Vitest UI" img-dark src="https://user-images.githubusercontent.com/11247099/171992272-7c6057e2-80c3-4b17-a7b6-0ac28e5a5e0b.png">

<<<<<<< HEAD
自 Vitest 0.26.0 开始, UI 也可以用作测试报告器。 在 Vitest 配置中使用 `'html'` 报告器生成 HTML 输出并预览测试结果：
=======
Since Vitest 0.26.0, UI can also be used as a reporter. Use `'html'` reporter in your Vitest configuration to generate HTML output and preview the results of your tests:
>>>>>>> 23181e5d0461127cb387692db973a1a710865d0c

```ts
// vitest.config.ts

export default {
  test: {
    reporters: ["html"],
  },
};
```

::: warning
如果你仍想在终端中实时查看测试的运行情况，请不要忘记将 `default` 报告器添加到 `reporters` 选项：`['default', 'html']`。
:::

::: tip
要预览你的 HTML 报告，可以使用 [vite preview](https://vitejs.dev/guide/cli.html#vite-preview) 命令：

```sh
npx vite preview --base __vitest__ --outDir ./html
```

你可以使用 [`outputFile`](/config/#outputfile) 配置选项配置输出。你需要在那里指定 `.html` 路径。例如，`./html/index.html` 是默认值。
:::
