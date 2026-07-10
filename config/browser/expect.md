---
title: browser.expect | 配置
outline: deep
---

# browser.expect

- **类型:** `ExpectOptions`

## browser.expect.toMatchScreenshot

[`toMatchScreenshot` 断言](/api/browser/assertions.html#tomatchscreenshot) 的默认选项。这些配置将应用于所有截图断言。

::: tip 提示
为截图断言设置全局默认值有助于在测试套件中保持一致性，并减少单个测试中的重复。在需要特定测试用例时，仍可在断言级别覆盖这些默认值。
:::

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      expect: {
        toMatchScreenshot: {
          comparatorName: 'pixelmatch',
          comparatorOptions: {
            threshold: 0.2,
            allowedMismatchedPixels: 100,
          },
          resolveScreenshotPath: ({ arg, browserName, ext, testFileName }) =>
            `custom-screenshots/${testFileName}/${arg}-${browserName}${ext}`,
        },
      },
    },
  },
})
```

[`toMatchScreenshot` 断言中所有可用选项](/api/browser/assertions#options) 均可在此配置。此外还提供两个路径解析函数：`resolveScreenshotPath` 和 `resolveDiffPath`。
<!-- TODO: translation -->
## browser.expect.toMatchScreenshot.screenshotDirectory

- **Type:** `string | undefined`
- **Default:** `__screenshots__`

The directory name used for storing reference screenshots.

This value is passed as `screenshotDirectory` to [`browser.expect.toMatchScreenshot.resolveScreenshotPath`](#browserexpecttomatchscreenshotresolvescreenshotpath) and [`browser.expect.toMatchScreenshot.resolveDiffPath`](#browserexpecttomatchscreenshotresolvediffpath), and used in the default path resolution of `resolveScreenshotPath`.

## browser.expect.toMatchScreenshot.resolveScreenshotPath

- **类型:** `(data: PathResolveData) => string`
- **默认输出:** ``path.resolve(root, testFileDirectory, screenshotDirectory, testFileName, `${arg}-${browserName}-${platform}${ext}`)``

用于自定义参考截图存储路径的函数。该函数接收包含以下属性的对象：

- `arg: string`

  经过标准化处理的相对路径，**不含** 扩展名，相对于测试文件路径。

  该路径源自传递给 `toMatchScreenshot` 的参数；如果调用时未传参数，则使用自动生成的名称。

  ```ts
  test('calls `onClick`', () => {
    expect(locator).toMatchScreenshot()
    // arg = "calls-onclick-1"
  })

  expect(locator).toMatchScreenshot('foo/bar/baz.png')
  // arg = "foo/bar/baz"

  expect(locator).toMatchScreenshot('../foo/bar/baz.png')
  // arg = "foo/bar/baz"
  ```

- `ext: string`

  截图扩展名（需携带 . 符号）。

  可通过 `toMatchScreenshot` 的参数设置，如果使用不支持的扩展名则默认回退为 `'.png'`。

- `browserName: string`

  当前实例的浏览器名称。

- `platform: NodeJS.Platform`

  该值为 [`process.platform`](https://nodejs.org/docs/v22.16.0/api/process.html#processplatform).

- `screenshotDirectory: string`

  [`browser.screenshotDirectory`](/config/browser/screenshotdirectory) 配置项提供的值，如果未配置则使用默认值（`__screenshots__`）。

- `root: string`

  项目 [`root`](/config/root) 的绝对路径。

- `testFileDirectory: string`

  测试文件相对于项目 [`root`](/config/root) 的相对路径。

- `testFileName: string`

  测试文件的文件名。

- `testName: string`

  经过标准化处理的 [`test`](/api/test) 名称（包含父级 [`describe`](/api/describe) 信息）。

- `attachmentsDir: string`

  [`attachmentsDir`](/config/attachmentsdir) 配置项提供的值，如果未配置则使用其默认值。

- `project: TestProject` <Version type="experimental">4.1.6</Version> <Experimental />

  The [`TestProject`](/api/advanced/test-project) the test belongs to.

例如，以下示例按浏览器分组存储截图：

```ts
resolveScreenshotPath: ({ arg, browserName, ext, root, testFileName }) =>
  `${root}/screenshots/${browserName}/${testFileName}/${arg}${ext}`
```

## browser.expect.toMatchScreenshot.resolveDiffPath

- **类型:** `(data: PathResolveData) => string`
- **默认输出:** ``path.resolve(root, attachmentsDir, testFileDirectory, testFileName, `${arg}-${browserName}-${platform}${ext}`)``

用于自定义截图比对失败时差异图片存储位置的函数。接收与 [`resolveScreenshotPath`](#browser-expect-tomatchscreenshot-resolvescreenshotpath) 相同的数据对象。

例如，以下示例将差异图片存储在附件子目录中：

```ts
resolveDiffPath: ({ arg, attachmentsDir, browserName, ext, root, testFileName }) =>
  `${root}/${attachmentsDir}/screenshot-diffs/${testFileName}/${arg}-${browserName}${ext}`
```

## browser.expect.toMatchScreenshot.comparators

- **类型:** `Record<string, Comparator>`

注册自定义的截图比对算法，如 [SSIM](https://en.wikipedia.org/wiki/Structural_similarity_index_measure) 或其他感知相似度指标。

创建自定义比较器时，需在配置中注册。如果使用 TypeScript，需在 `ScreenshotComparatorRegistry` 接口中声明其选项。

```ts
import { defineConfig } from 'vitest/config'

// 1. 声明比较器的选项类型
declare module 'vitest/browser' {
  interface ScreenshotComparatorRegistry {
    myCustomComparator: {
      sensitivity?: number
      ignoreColors?: boolean
    }
  }
}

// 2. 实现比较器
export default defineConfig({
  test: {
    browser: {
      expect: {
        toMatchScreenshot: {
          comparators: {
            myCustomComparator: async (
              reference,
              actual,
              {
                createDiff, // 始终由 Vitest 提供
                sensitivity = 0.01,
                ignoreColors = false,
              }
            ) => {
              // 算法实现...
              return { pass, diff, message }
            },
          },
        },
      },
    },
  },
})
```

然后在测试中使用该比较器：

```ts
await expect(locator).toMatchScreenshot({
  comparatorName: 'myCustomComparator',
  comparatorOptions: {
    sensitivity: 0.08,
    ignoreColors: true,
  },
})
```

**比较器函数签名：**

```ts
type Comparator<Options> = (
  reference: {
    metadata: { height: number; width: number }
    data: TypedArray
  },
  actual: {
    metadata: { height: number; width: number }
    data: TypedArray
  },
  options: {
    createDiff: boolean
  } & Options
) => Promise<{
  pass: boolean
  diff: TypedArray | null
  message: string | null
}> | {
  pass: boolean
  diff: TypedArray | null
  message: string | null
}
```

`reference` 和 `actual` 图像会通过相应编解码器解码（当前仅支持 PNG）。`data` 属性是存储 RGBA 格式像素数据的扁平 `TypedArray`（`Buffer`、`Uint8Array` 或 `Uint8ClampedArray`）：

- **每像素 4 字节**：红、绿、蓝、alpha（每个通道值范围 `0` 至 `255`）
- **行优先顺序**：像素按从左到右、从上到下顺序排列
- **总长度**：`width × height × 4` 字节
- **Alpha 通道**：始终存在。无透明度的图像其 alpha 值固定为 `255`（完全不透明）

::: tip 性能注意事项
`createDiff` 选项表示是否需要生成差异图像。在 [稳定截图检测](/guide/browser/visual-regression-testing#how-visual-tests-work) 过程中，Vitest 会以 `createDiff: false` 调用比较器以避免不必要的计算。

**请遵守此参数以保持测试速度**。

::: warning 处理缺失参数
`toMatchScreenshot()` 中的 `options` 参数是可选的，因此用户可能不会提供所有比较器选项。务必使用默认值使它们成为可选的：

```ts
myCustomComparator: (
  reference,
  actual,
  { createDiff, threshold = 0.1, maxDiff = 100 },
) => {
  // 对比逻辑...
}
```
:::
