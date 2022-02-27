# 快速开始

<DevelopmentWarning/>

## 概述

Vitest 是一个由 Vite 提供支持的极速单元测试框架。

您可以在 [为什么是 Vitest ？](./why)了解有关该项目背后的基本原理的更多信息。

## 线上构建

你可以通过 [StackBlitz](https://vitest.new) 在线使用 Vitest 。StackBlitz 直接在浏览器里运行 Vitest ，所以它和在本地设置几乎完全一致，但不需要在机器上安装任何依赖。

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

Vitest 的主要优势之一是它与 Vite 拥有的统一配置。 如果有配置文件，Vitest 将读取根目录下的 `vite.config.ts` 以匹配插件并设置为您的 Vite 应用程序。 例如，  Vite 的 [resolve.alias](https://cn.vitejs.dev/config/#resolve-alias) 和 [plugins](https://cn.vitejs.dev/guide/using-plugins.html) 的配置将会是开箱即用。如果想在测试期间产生不同的配置，可以使用下面的方法：

- 创建 `vitest.config.ts`，这将拥有最高的优先级别。
- 将 `--config` 传递给 CLI, 例如： `vitest --config ./path/to/vitest.config.ts`
- 使用 `process.env.VITEST` 有条件地在 `vite.config.ts` 中应用不同的配置。

要配置 `Vitest`，需要在 Vite 配置中添加 `test` 属性。 还需要在配置文件顶部使用[三斜杠指令](https://www.tslang.cn/docs/handbook/triple-slash-directives.html#-reference-types-)添加对 Vitest 类型的引用。

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ...
  },
})
```

具体参阅 [配置参考](../config/) 中的配置选项列表。

## 脚本配置

在安装了 Vitest 的项目中，您可以让 `vitest` 在 npm 脚本中使用二进制文件，或者直接使用`npx vitest`. 以下是脚手架 Vitest 项目中的默认 npm 脚本：

<!-- prettier-ignore -->
```json5
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

要在不监视文件更改的情况下运行一次测试，请使用 `vitest run`。
可以指定其他 CLI 选项，例如 `--port` 或 `--https`。
有关 CLI 选项的完整列表，在项目中运行 `npx vitest --help`。

### 命令

* `vitest watch`

  运行所有测试组件，但要注意更改并在更改时重新运行测试。在没有命令的情况下调用 `vitest` 。 在 CI 环境中，此命令将回退到 `vitest run`

* `vitest run`

  在没有浏览模式的情况下执行单次测试运行。

* `vitest dev`

  在开发模式下运行 Vitest 。

* `vitest related`

  仅运行涵盖了源文件列表的测试。适用于静态惰性导入，但不适用于动态导入。所有文件都应相对于根目录文件夹。

  与 [`lint-staged`](https://github.com/okonet/lint-staged) 或 CI 设置一起运行。

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
| `-w, --watch` | 浏览模式 |
| `-t, --testNamePattern <pattern>` | 运行名称与模式匹配的测试 |
| `--ui` | 启用 UI |
| `--open` | 如果启用，则自动打开 UI（默认值：true） |
| `--api [api]` | 服务 API，可用选项： `--api.port <port>`, `--api.host [host]` 和 `--api.strictPort` |
| `--threads` | 启用线程（默认值：true） |
| `--silent` | 测试的控制台输出 |
| `--reporter <name>` | 选择输出格式：`default`, `verbose`, `dot` 或 `json` |
| `--outputFile <filename>` | 设置 `--reporter=json` 选项时将结果输出到文件 |
| `--coverage` | 使用 c8 进行覆盖 |
| `--run` | 不要浏览 |
| `--global` | 全局注入 API |
| `--dom` | 用 happy-dom 模拟浏览器 api |
| `--environment <env>` | Runner环境（默认：node） |
| `--passWithNoTests` | 未找到测试时通过 |
| `--allowOnly` | 允许标记的测试和组件 `only`（默认值：CI 中为 false，否则为 true） |
| `-h, --help` | 显示可用的 CLI 选项 |

## 实例

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

然后在使用了 Vitest 的项目中运行 `pnpm link --global vitest` （或者用于 `vitest` 全局链接的包管理器）。

## 社区

如果您有问题或需要帮助，请通过 [Discord](https://chat.vitest.dev) 和 [GitHub Discussions](https://github.com/vitest-dev/vitest/discussions) 与社区联系。
