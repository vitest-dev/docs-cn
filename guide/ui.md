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
