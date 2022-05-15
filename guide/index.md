# 快速开始

## 概述

Vitest 是一个由 Vite 提供支持的极速单元测试框架。

你可以在[为什么是 Vitest ？](./why)了解更多关于这个项目背后的基本原理。

## 线上构建

你可以通过 [StackBlitz](https://vitest.new) 在线使用 Vitest。StackBlitz 直接在浏览器里运行 Vitest ，所以它和在本地设置几乎完全一致，但不需要在机器上安装任何依赖。

## 将 Vitest 添加到项目中

```bash
// 使用 npm
$ npm install -D vitest

// 使用 yarn
$ yarn add -D vitest

// 使用 pnpm
$ pnpm add -D vitest
```

:::tip 提示
Vitest 需要 Vite >= v2.7.10 和 Node >= v14
:::

## 配置 Vitest

Vitest 的主要优势之一是它与 Vite 共用一套配置。如果存在配置文件，Vitest 将读取根目录下的 `vite.config.ts` 以匹配插件并设置为您的 Vite 应用程序。 例如，Vite 的 [resolve.alias](https://cn.vitejs.dev/config/#resolve-alias) 和 [plugins](https://cn.vitejs.dev/guide/using-plugins.html) 的配置将会是开箱即用。如果你想使用不同的配置进行测试，你可以：

- 创建 `vitest.config.ts`，优先级更高。
- 将 `--config` 选项传递给 CLI，例如 `vitest --config ./path/to/vitest.config.ts` 。
- 在 `defineConfig` 中使用 `process.env.VITEST` 或 `mode` 属性（默认值是 `test`）在 `vite.config.ts` 中有条件的应用不同的配置。

要配置 `vitest` 本身，请在你的 Vite 配置中添加 `test` 属性。如果你使用 `vite` 的 `defineConfig` 你还需要将 [三斜线指令](https://www.tslang.cn/docs/handbook/triple-slash-directives.html#-reference-types-) 写在配置文件的顶部。

使用 `vite` 的 `defineConfig` 可以参考下面的格式：

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ...
  },
})
```

使用 `vitest` 的 `defineConfig` 可以参考下面的格式：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ...
  },
})
```

具体参阅 [配置参考](../config/) 中的配置选项列表。

## 命令行

在安装了 Vitest 的项目中，你可以在 npm 脚本中运行 `vitest` 的二进制文件，或者直接运行 `npx vitest`。以下 Vitest  脚手架项目中的默认的 npm 脚本：

<!-- prettier-ignore -->
```json5
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

要在不监听文件更改的情况下只运行一次测试，请使用 `vitest run`。
你可以指定其他 CLI 选项，例如 `--port` 或 `--https`。
有关 CLI 选项的完整列表，在项目中运行 `npx vitest --help`。

### 命令

* `vitest watch`

  运行所有的测试套件，但要注意文件更改时会重新运行相关测试，直接调用 `vitest` 同样如此。在 CI 环境中，此命令将回退到 `vitest run`

* `vitest run`

  非监听模式下运行单次测试。

* `vitest dev`

  在开发模式下运行 Vitest 。

* `vitest related`

  仅运行涵盖了源文件列表的测试。适用于静态惰性导入，但不适用于动态导入。所有文件都应相对于根目录文件夹。

  适用于与 [`lint-staged`](https://github.com/okonet/lint-staged) 或 CI 设置一起运行。

  ```bash
  vitest related /src/index.ts /src/hello-world.js
  ```

### 选项

| 选项       |               |
| ------------- | ------------- |
| `-v, --version` | 显示版本号 |
| `-r, --root <path>` | 定义项目的根目录 |
| `-c, --config <path>` | 配置文件的路径 |
| `-u, --update` | 更新快照 |
| `-w, --watch` | 智能文件监听模式 |
| `-t, --testNamePattern <pattern>` | 运行文件名与模式匹配的测试 |
| `--ui` | 启用 UI |
| `--open` | 如果启用，则自动打开 UI（默认值：true） |
| `--api [api]` | 服务 API，可用选项： `--api.port <port>`, `--api.host [host]` 和 `--api.strictPort` |
| `--threads` | 启用多线程（默认值：true） |
| `--silent` | 运行测试时控制台静默输出 |
| `--isolate` | 隔离每个测试文件的运行环境（默认值是 `true`） |
| `--reporter <name>` | 选择输出格式：`default`、`verbose`、`dot`、`junit` 或 `json` |
| `--outputFile <filename/-s>` | 当指定了 `--reporter=json` 或 `--reporter=junit` 选项时，将测试结果写入文件 <br /> 通过 [cac's dot notation] 你还可以为多个报告器指定单独的输出 |
| `--coverage` | 使用 c8 输出代码测试覆盖率 |
| `--run` | 不使用监听模式 |
| `--mode` | 覆盖 Vite 的模式，默认值为 `test` |
| `--mode <name>` | 覆写 Vite 的模式（默认值是 `test`） |
| `--globals` | 全局注入 API |
| `--dom` | 用 happy-dom 模拟浏览器 api |
| `--environment <env>` | 运行测试的环境（默认值是 `node`） |
| `--passWithNoTests` | 未找到测试时通过 |
| `--allowOnly` | 只允许标记 `only` 的测试套件和测试样例 （默认值：在 CI 中为 false，其他地方为 true） |
| `-h, --help` | 显示可用的 CLI 选项 |

## IDE 插件

我们现在为 Vscode 提供官方扩展，以增强大家使用 Vitest 的测试体验。

[从 VScode 插件市场安装](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer)

具体参阅[IDE 插件](./ide.md)

## 示例

[@@include](../../examples/README.md)

## 使用 Vitest 的项目

- [unocss](https://github.com/antfu/unocss)
- [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)
- [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)
- [vitesse](https://github.com/antfu/vitesse)
- [vitesse-lite](https://github.com/antfu/vitesse-lite)
- [fluent-vue](https://github.com/demivan/fluent-vue)
- [vueuse](https://github.com/vueuse/vueuse)
- [milkdown](https://github.com/Saul-Mirone/milkdown)
- [gridjs-svelte](https://github.com/iamyuu/gridjs-svelte)
- [spring-easing](https://github.com/okikio/spring-easing)
- [bytemd](https://github.com/bytedance/bytemd)
- [faker](https://github.com/faker-js/faker)
- [million](https://github.com/aidenybai/million)
- [Vitamin](https://github.com/wtchnm/Vitamin)
- [neodrag](https://github.com/PuruVJ/neodrag)
- [svelte-multiselect](https://github.com/janosh/svelte-multiselect)
- [iconify](https://github.com/iconify/iconify)
- [tdesign-vue-next](https://github.com/Tencent/tdesign-vue-next)

## 使用未发布的版本

如果您等不及想要使用最新功能的 Vitest, 则需要将 [vitest](https://github.com/vitest-dev/vitest) 官方仓库下载到本地计算机上，然后自行构建和链接（需要使用 [pnpm](https://www.pnpm.cn/) ）：

```bash
git clone https://github.com/vitest-dev/vitest.git
cd vitest
pnpm install
cd packages/vitest
pnpm run build
pnpm link --global # 可以在此步骤中使用自己喜欢的包管理器
```

然后转到使用 Vitest 的项目中运行 `pnpm link --global vitest` （或者其他你用来全局链接 `vitest` 的包管理器）。

## 社区

如果你有问题或需要帮助，可以通过 [Discord](https://chat.vitest.dev) 和 [GitHub Discussions](https://github.com/vitest-dev/vitest/discussions) 与社区联系。

[cac's dot notation]: https://github.com/cacjs/cac#dot-nested-options
