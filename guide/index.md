# Getting Started

## Overview

Vitest is a blazing fast unit test framework powered by Vite.

You can learn more about the rationale behind the project in the [Why Vitest](./why) section.

## Trying Vitest Online

You can try Vitest online on [StackBlitz](https://vitest.new). It runs Vitest directly in the browser, and it is almost identical to the local setup but doesn't require installing anything on your machine.

## Adding Vitest to your Project

```bash
# with npm
npm install -D vitest
# or with yarn
yarn add -D vitest
# or with pnpm
pnpm add -D vitest
```

:::tip
Vitest requires Vite >=v2.7.10 and Node >=v14
:::

## Configuring Vitest

One of the main advantages of Vitest is its unified configuration with Vite. If present, `vitest` will read your root `vite.config.ts` to match with the plugins and setup as your Vite app. For example, your Vite [resolve.alias](https://vitejs.dev/config/#resolve-alias) and [plugins](https://vitejs.dev/guide/using-plugins.html) configuration will work out-of-the-box. If you want a different configuration during testing, you can:

- Create `vitest.config.ts`, which will have the higher priority
- Pass `--config` option to CLI, e.g. `vitest --config ./path/to/vitest.config.ts`
- Use `process.env.VITEST` or `mode` property on `defineConfig` (will be set to `test` if not overridden) to conditionally apply different configuration in `vite.config.ts`

To configure `vitest` itself, add `test` property in your Vite config. You'll also need to add a reference to Vitest types using a [triple slash command](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-) at the top of your config file, if you are importing `defineConfig` from `vite` itself.

```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    // ...
  },
})
```

See the list of config options in the [Config Reference](../config/)

## Command Line Interface

In a project where Vitest is installed, you can use the `vitest` binary in your npm scripts, or run it directly with `npx vitest`. Here are the default npm scripts in a scaffolded Vitest project:

<!-- prettier-ignore -->
```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

To run tests once without watching for file changes, use `vitest run`.
You can specify additional CLI options like `--port` or `--https`. For a full list of CLI options, run `npx vitest --help` in your project.

Learn more about the [Command Line Interface](./cli.md)

## IDE Integrations

We also provided a official extension for Visual Studio Code to enhance your testing experience with Vitest.

[Install from VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer)

Learn more about [IDE Integrations](./ide.md)

## Examples

| Example | Source | Playground |
|---|---|---|
| `basic` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/basic) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/basic?initialPath=__vitest__) |
| `graphql` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/graphql) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/graphql?initialPath=__vitest__) |
| `lit` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/lit) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/lit?initialPath=__vitest__) |
| `mocks` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/mocks) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/mocks?initialPath=__vitest__) |
| `nextjs` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/nextjs) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/nextjs?initialPath=__vitest__) |
| `puppeteer` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/puppeteer) | |
| `react-enzyme` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react-enzyme) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react-enzyme?initialPath=__vitest__) |
| `react-mui` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react-mui) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react-mui?initialPath=__vitest__) |
| `react-storybook` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react-storybook) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react-storybook?initialPath=__vitest__) |
| `react-testing-lib-msw` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib-msw) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react-testing-lib-msw?initialPath=__vitest__) |
| `react-testing-lib` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react-testing-lib?initialPath=__vitest__) |
| `react` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/react) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/react?initialPath=__vitest__) |
| `ruby` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/ruby) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/ruby?initialPath=__vitest__) |
| `solid` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/solid) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/solid?initialPath=__vitest__) |
| `svelte` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/svelte) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/svelte?initialPath=__vitest__) |
| `vitesse` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/vitesse) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/vitesse?initialPath=__vitest__) |
| `vue-jsx` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/vue-jsx) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/vue-jsx?initialPath=__vitest__) |
| `vue` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/vue) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/vue?initialPath=__vitest__) |
| `vue2` | [GitHub](https://github.com/vitest-dev/vitest/tree/main/examples/vue2) | [Play Online](https://stackblitz.com/fork/github/vitest-dev/vitest/tree/main/examples/vue2?initialPath=__vitest__) |

## Projects using Vitest

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
- [cz-git](https://github.com/Zhengqbbb/cz-git)

<!--
For contributors:
We no longer accept new entries to this list a this moment.
Thanks for choosing Vitest!
-->

## Using Unreleased Commits

If you can't wait for a new release to test the latest features, you will need to clone the [vitest repo](https://github.com/vitest-dev/vitest) to your local machine and then build and link it yourself ([pnpm](https://pnpm.io/) is required):

```bash
git clone https://github.com/vitest-dev/vitest.git
cd vitest
pnpm install
cd packages/vitest
pnpm run build
pnpm link --global # you can use your preferred package manager for this step
```

Then go to the project where you are using Vitest and run `pnpm link --global vitest` (or the package manager that you used to link `vitest` globally).

## Community

If you have questions or need help, reach out to the community at [Discord](https://chat.vitest.dev) and [GitHub Discussions](https://github.com/vitest-dev/vitest/discussions).

[cac's dot notation]: https://github.com/cacjs/cac#dot-nested-options
