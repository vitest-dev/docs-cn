---
title: Vitest 3.0 发布了!
author:
  name: Vitest 团队
date: 2025-01-17
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vitest 3.0 发布了!
  - - meta
    - property: og:image
      content: https://cn.vitest.dev/og-vitest-3.jpg
  - - meta
    - property: og:url
      content: https://cn.vitest.dev/blog/vitest-3
  - - meta
    - property: og:description
      content: Vitest 3.0 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vitest 3.0 发布了!

_2025 年 1 月 17 日_

![Vitest 3 公告封面图](/og-vitest-3.jpg)

我们在半年前发布了 Vitest 2。我们见证了它被广泛采用，每周 npm 下载量从 480 万次增长到 770 万次。我们的生态系统也在快速发展。其中包括，Storybook 新的测试功能由我们的 VS Code 扩展和浏览器模式提供支持，以及 Matt Pocock 正在基于 Vitest 开发 Evalite，这是一个用于评估 AI 驱动应用的工具。

## 下一个 Vitest 主要版本来了

今天，我们激动地宣布 Vitest 3 的发布！这是一个重要的版本！

快速链接:

- [Docs](/)
- Translations: [简体中文](https://cn.vitest.dev/)
- [Migration Guide](/guide/migration)
- [GitHub Changelog](https://github.com/vitest-dev/vitest/releases/tag/v3.0.0)

如果你之前没有使用过 Vitest，我们建议你先阅读[入门指南](/guide/)和[特性指南](/guide/features)。

我们衷心感谢超过 [550 位 Vitest Core 的贡献者](https://github.com/vitest-dev/vitest/graphs/contributors)，以及 Vitest 集成、工具和翻译的维护者和贡献者，他们帮助我们开发了这个新的主要版本。我们鼓励你参与进来，帮助我们为整个生态系统改进 Vitest。请在我们的[贡献指南](https://github.com/vitest-dev/vitest/blob/main/CONTRIBUTING.md)中了解更多信息。

如果你要开始参与，我们建议你帮助[分类问题](https://github.com/vitest-dev/vitest/issues)、[审查 PR](https://github.com/vitest-dev/vitest/pulls)、基于开放的问题发送包含失败测试的 PR，并在 [Discussions](https://github.com/vitest-dev/vitest/discussions) 和 Vitest Land 的帮助论坛中[帮助其他人](https://discord.com/channels/917386801235247114/1057959614160851024)。如果你想与我们交流，请加入我们的 [Discord 社区](http://chat.vitest.dev/)，并在 [#contributing 频道](https://discord.com/channels/917386801235247114/1057959614160851024)上打个招呼。

要获取关于 Vitest 生态系统和 Vitest Core 的最新消息，请在 [Bluesky](https://bsky.app/profile/vitest.dev) 或  [Mastodon](https://webtoo.ls/@vitest) 上关注我们。

## 报告器（Reporter）更新

[@AriPerkkio](https://github.com/ariperkkio) 重写了 Vitest 报告测试运行的方式。你应该会看到更少的闪烁和更稳定的输出！

<div class="flex align-center justify-center">
  <video controls>
    <source src="/new-reporter.webm" type="video/webm">
  </video>
</div>

伴随此更改，我们还重新设计了公共报告器 API（reporters 字段），使[生命周期](/advanced/api/reporters)更容易理解。

你可以在 [#7069](https://github.com/vitest-dev/vitest/pull/7069) PR 中关注设计过程。为了逆向工程之前的 onTaskUpdate API 并实现这个新的优雅生命周期，我们经历了一番艰难的努力。

<div class="flex align-center justify-center">
  <img src="/on-task-update.gif" />
</div>

## 内联工作区（Inline Workspace）

值得高兴的是！你无需再为每个项目单独创建文件来定义 [workspace](/guide/projects) 了 —— 只要在 `vitest.config` 配置文件中通过 `workspace` 字段列出你的项目数组即可：

```jsx
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    workspace: ['packages/*'],
  },
})
```

## 多浏览器配置

Vitest 3 引入了一种更高效的方式来在不同的浏览器或设置中运行浏览器测试。你可以定义一个[实例数组](/guide/browser/multiple-setups)来在不同的设置中运行浏览器测试，而不是使用工作区：

```jsx
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      provider: 'playwright',
      instances: [
        {
          browser: 'chromium',
          launch: { devtools: true },
        },
        {
          browser: 'firefox',
          setupFiles: ['./setup.firefox.ts'],
          provide: {
            secret: 'my-secret',
          },
        },
      ],
    }
  }
})
```

实例相对于工作区的主要优势在于更好的缓存策略 - Vitest 只创建一个 Vite 服务器来服务文件，这些文件只会被处理一次，而与你测试的浏览器数量无关。

此版本还改进了浏览器模式特性的文档，并引入了针对 [Playwright](/guide/browser/playwright) 和 [WebdriverIO](/guide/browser/webdriverio) 的单独指南，希望能使配置更容易。

## 按位置过滤（Filtering by Location）

在 Vitest 3 中，你现在可以按行号过滤测试。

```
$ vitest basic/foo.js:10
$ vitest ./basic/foo.js:10
```

特别感谢 [@mzhubail](https://github.com/mzhubail) 实现了这个功能。

## 公共（Public） API

我们重新设计了从 `vitest/node` 可用的公共 API，并计划在下一个小版本中移除实验性标签。此版本还包含了涵盖所有公开方法的全新文档。

<img alt="Vitest API documentation" img-light src="/docs-api-light.png">
<img alt="Vitest API documentation" img-dark src="/docs-api-dark.png">

## 破坏性变更（Breaking changes）

Vitest 3 有一些小的破坏性变更，这些变更应该不会影响大多数用户，但我们建议在升级之前查看详细的[迁移指南](/guide/migration.html#vitest-3)。

完整的变更列表请见 [Vitest 3 更新日志](https://github.com/vitest-dev/vitest/releases/tag/v3.0.0)。

## 致谢

Vitest 3 是 [Vitest 团队](/team)和我们的贡献者无数小时努力的成果。我们感谢赞助 Vitest [Vladimir](https://github.com/sheremet-va) 和 [Hiroshi](https://github.com/hi-ogawa) 加入了 [VoidZero](https://voidzero.dev) 全职从事 Vite 和 Vitest [StackBlitz](https://stackblitz.com/) 聘请了 [Ari](https://github.com/ariperkkio) 来投入更多时间进行 Vitest 开发。特别感谢 [NuxtLabs](https://nuxtlabs.com)、[Zammad](https://zammad.com) 以及 [Vitest 在 GitHub Sponsors](https://github.com/sponsors/vitest-dev) 和 [Vitest's Open Collective](https://opencollective.com/vitest) 上的赞助者。
