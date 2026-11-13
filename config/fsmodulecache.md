---
title: fsModuleCache | 配置
outline: deep
---

# fsModuleCache <Version>5.0.0</Version>

- **类型:** `boolean`
- **默认值:** `true`
- **命令行终端:** `--fsModuleCache`, `--fsModuleCache=false`

在 watch 模式下，Vitest 会将所有转换后的文件缓存在内存中，从而加快重新运行测试的速度。但测试运行结束后，这些缓存便会被丢弃。此选项默认会将转换后的模块持久化到文件系统中，以便在后续重新运行测试时复用，甚至可以在不同的 Vitest 进程之间共享。

工作区中的所有项目共用一个缓存目录。默认情况下，该目录位于工作区根目录的 `node_modules` 中，因此重新安装依赖项时，缓存也会随之失效。你可以通过 [`fsModuleCachePath`](/config/fsmodulecachepath) 更改缓存目录，也可以运行 [`vitest --clearCache`](/guide/cli#clearcache) 删除缓存。

::: warning 浏览器支持
目前，此选项对 [浏览器模式](/guide/browser/) 无效。
:::

如果要调试模块的缓存状态，可以设置 `DEBUG=vitest:cache:fs` 环境变量并运行 Vitest：

```shell
DEBUG=vitest:cache:fs vitest --fsModuleCache
```

::: tip
整个工作区的缓存统一存放在同一个目录中。如果要更改该目录，请参阅 [`fsModuleCachePath`](/config/fsmodulecachepath)。
:::

<!-- TODO: translation -->

## Manifest {#manifest}

After every test run, each project writes a `_manifest-<project>-<hash>.json` file into the cache directory, next to the cached modules. `<project>` is the [project name](/config/name), or the name of the project's root folder if the project has no name. The manifest is grouped by Vite environment. `modules` maps the URL of every cached module to the name of its cache file in that directory. `externalized` maps the URL of every [externalized](/config/server#server-deps-external) dependency to the file that Node imports without a transform:

```json [node_modules/.vitest-cache/_manifest-app-1a2b3c4d.json]
{
  "name": "",
  "root": "/projects/app",
  "modules": {
    "ssr": {
      "/src/math.test.ts": "3b1af86df9d029d4281e7ae6ef10059153a80e14",
      "/src/math.ts": "e8e20f586e230bde9b163dfc191f4440b241272a"
    }
  },
  "externalized": {
    "ssr": {
      "/node_modules/lodash-es/lodash.js": "/projects/app/node_modules/lodash-es/lodash.js"
    }
  }
}
```

The manifest keeps the entries from previous runs, so a run that imports only some files does not remove the others.

A cache file contains the code that Vitest runs, so you can edit it to debug a transform. Vitest runs the edited code until the module is transformed again: when the source file or the configuration changes, or when the cache is cleared with [`--clearCache`](/guide/cli#clearcache). Keep the `//# vitestCache=` comment at the end of the file, otherwise Vitest transforms the module again.

## 已知问题 {#known-issues}

Vitest 会根据文件内容、文件 ID、Vite 环境配置和覆盖率状态生成持久化的文件哈希。Vitest 会尽可能将已知的配置信息纳入计算，但这些信息仍不完整。目前，由于缺少统一的接口，Vitest 无法跟踪插件选项。

如果插件的转换结果依赖文件内容或公开配置之外的信息（例如读取其他文件或目录），缓存可能无法及时失效。为避免这种情况，可以定义 [缓存键生成器](/api/advanced/plugin#definecachekeygenerator)，将动态选项加入缓存键，或者禁止缓存相应模块：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'vitest-cache',
      configureVitest({ defineCacheKeyGenerator }) {
        defineCacheKeyGenerator(({ id, sourceCode }) => {
          // 不缓存包含此字符串的模块
          if (id.includes('do-not-cache')) {
            return false
          }

          // 根据动态变量的值缓存此文件
          if (sourceCode.includes('myDynamicVar')) {
            return process.env.DYNAMIC_VAR_VALUE
          }
        })
      }
    }
  ],
  test: {
    fsModuleCache: true,
  },
})
```

如果你是插件作者，建议在你的插件中定义一个 [缓存键生成器](/api/advanced/plugin#definecachekeygenerator)，因为该插件可能以不同配置项注册，且这些配置项会影响转换结果。

如果插件不应影响缓存键，可以将 `api.vitest.ignoreFsModuleCache` 设置为 `true`，使其不参与缓存键的计算：

```js [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'vitest-cache',
      api: {
        vitest: {
          ignoreFsModuleCache: true,
        },
      },
    },
  ],
  test: {
    fsModuleCache: true,
  },
})
```

注意，即使插件选择不参与模块缓存，仍然可以定义缓存键生成器。
