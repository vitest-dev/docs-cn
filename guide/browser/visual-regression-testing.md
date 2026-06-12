---
title: 可视化回归测试
outline: [2, 3]
---

<<<<<<< HEAD
# 可视化回归测试 {#visual-regression-testing}

Vitest 原生支持可视化回归测试。它会自动截取 UI 组件或页面的截图，并与基准图像对比，以捕捉那些非预期的视觉变化。

与只验证功能逻辑的功能测试不同，可视化测试能发现样式异常、布局偏移和渲染错误——这些问题如果没有细致的人工检查，往往会被忽略。

## 为什么需要可视化回归测试？ {#why-visual-regression-testing}

视觉 bug 不会报错，但它们的外观已经改变。这正是可视化测试的意义所在：

- 按钮依然能提交表单，但颜色却变成了亮粉色
- 文本在桌面端显示正常，在移动端却被挤压变形
- 功能没问题，可两个容器已跑出视口
- 精心的 CSS 重构完成了，却破坏了某个无人测试的页面布局

可视化回归测试是 UI 的安全网，确保这些变化在进入生产环境之前就被自动发现并处理。

## 快速入门 {#getting-started}

::: warning 浏览器渲染差异
可视化回归测试对运行环境非常敏感，不同机器生成的截图可能存在差异，常见原因包括：

- 字体渲染差异（最常见，Windows、macOS、Linux 各不相同）
- GPU 驱动与硬件加速
- 是否使用无头模式
- 浏览器版本与设置
- 甚至偶发的系统差异...

因此，Vitest 会在截图文件名中添加浏览器和平台信息（如 `button-chromium-darwin.png`），避免不同环境的截图互相覆盖。

要获得稳定结果，应使用相同的测试环境。**推荐**采用云端服务（如 [Azure App Testing](https://azure.microsoft.com/en-us/products/playwright-testing)）或基于 [Docker containers](https://playwright.dev/docs/docker) 的环境。
:::

在 Vitest 中，可通过 [`toMatchScreenshot` assertion](/api/browser/assertions.html#tomatchscreenshot) 断言运行可视化回归测试：
=======
<script setup>
import MoonPhase from '../../.vitepress/components/MoonPhase.vue'
</script>

# Visual Regression Testing

Vitest can run visual regression tests out of the box. It captures screenshots of your UI components and pages, then compares them against reference images to detect unintended visual changes.

Unlike functional tests that verify behavior, visual tests catch styling issues, layout shifts, and rendering problems that might otherwise go unnoticed without thorough manual testing.

## Why visual regression testing?

Visual bugs don’t throw errors, they just look wrong. That’s where visual testing comes in.

- That button still submits the form... but why is it hot pink now?
- The text fits perfectly... until someone views it on mobile
- Everything works great... except those two containers are outside the viewport
- That careful CSS refactor works... but broke the layout on a page no one tests

Visual regression testing acts as a safety net for your UI, automatically catching these visual changes before they reach production.

## Example

Visual regression testing in Vitest can be done through the [`toMatchScreenshot` assertion](/api/browser/assertions#tomatchscreenshot):
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

```ts
import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

test('button renders in default state', async () => {
  // render your component

  // capture and compare screenshot
  await expect(page.getByRole('button')).toMatchScreenshot()
})
```

<<<<<<< HEAD
### 创建基准截图 {#creating-references}

首次运行可视化测试时， Vitest 会生成一张基准（ baseline ）截图，并提示如下错误信息使测试失败：
=======
## Getting started

### Environmental stability

Visual regression tests are **sensitive to environmental differences** because rendering is not perfectly deterministic across environments and depends on multiple factors:

- GPU, drivers, and hardware acceleration
- Operating System
- Font rendering pipelines
- Browser, browser versions, and settings
- Whether the browser is running headless or headed
- Screen scaling, color profiles, and display settings
- ...and occasionally what feels like the phase of the moon <MoonPhase />

In practice, even seemingly identical environments can occasionally produce subtle rendering differences. For this reason, **visual regression tests are most reliable when run in a standardized and tightly controlled environment**. This is also why [Docker containers](https://playwright.dev/docs/docker), [CI-only visual testing workflows, or cloud services](#visual-testing-for-teams) are strongly recommended.

### Not a replacement for behavior testing

When a visual test fails alongside behavior tests, it's harder to tell what's actually broken or why. Visual failures are also expected during intentional UI work, but a failing unit test usually is not. Keeping them separate means each suite can fail loudly for the right reasons.

It's worth calling out that **`toMatchScreenshot` is not a substitute for proper assertions**.

A test that renders a button and just takes a screenshot is just documenting the current state. There's no way to tell from a screenshot whether users can interact with the button. **Visual tests work best as a complementary layer on top of behavior tests, not a replacement for them**.

Put another way, **visual testing doesn't tell you why something renders the way it does**. It just tells you that something rendered a certain way, or a different way than it did last time.

For example, take a business requirement to sort recent purchases in a table by purchase date. If you're looking only at the visual regression tests, you might notice that the same items from the last test are in a different order. This could be because you just introduced the sorting or because the sorting is broken. Either way, you don't know why the order is different just by looking at the UI. Someone could dismiss the visual diff as noise because the table "looks the same", even though the ordering logic is now broken. Now you have a broken business requirement in production.

### Project structure

Separating your visual suite from other tests gives you cleaner failure signals and a more deliberate update workflow. The recommended setup uses [projects](/guide/projects) with a `[name].vrt.test.[ext]` naming convention to keep them distinct, and runs them in headless mode for consistency. As the browser instance might have a different default size, it also sets a specific viewport size.

```ts [vitest.config.ts]
import { defaultExclude, defineConfig } from 'vitest/config'

const vrtPattern = '**/*.vrt.test.[tj]s?(x)'

export default defineConfig({
  test: {
    // ...other configurations
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          exclude: [vrtPattern, ...defaultExclude],
        },
      },
      {
        extends: true,
        test: {
          name: 'vrt',
          browser: {
            headless: true,
            instances: [
              {
                browser: '[browser-name]',
                viewport: { width: 1280, height: 720 },
              },
            ],
          },
          include: [vrtPattern],
        },
      },
    ],
  },
})
```

With this configuration in place, add scripts to launch each project separately:

```json [package.json]
{
  "scripts": {
    "test:unit": "vitest --project unit",
    "test:visual": "vitest --project vrt"
  }
}
```

### Creating references

When you run a visual test for the first time, Vitest creates a reference (also called baseline) screenshot and fails the test with the following error message:
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

```
expect(element).toMatchScreenshot()

No existing reference screenshot found; a new one was created. Review it before running tests again.

Reference screenshot:
  tests/__screenshots__/button.vrt.test.ts/button-default-state-chromium-darwin.png
```

<<<<<<< HEAD
确认截图正确后再次运行测试，Vitest 会将后续结果与该基准图比较。

::: tip
基准截图存放在测试文件所在目录下的 `__screenshots__` 文件夹中，
**请务必提交到版本库**。
:::

### 截图组织方式 {#screenshot-organization}
=======
This is normal. Check that the screenshot looks right, then run the test again. Vitest will now compare future runs against this baseline.

::: tip
Reference screenshots live in `__screenshots__` folders next to your tests. **Commit them to your repository.**
:::

### Screenshot organization
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

Vitest 默认将截图按以下结构保存：

```
.
├── __screenshots__
│   └── test-file.vrt.test.ts
│       ├── test-name-chromium-darwin.png
│       ├── test-name-firefox-linux.png
│       └── test-name-webkit-win32.png
└── test-file.vrt.test.ts
```

<<<<<<< HEAD
文件名由三部分组成：
- **测试名**：来自 `toMatchScreenshot()` 的第一个参数，或自动根据测试用例名生成
- **浏览器名**：`chrome`、`chromium`、`firefox`、`webkit`
- **平台**：如 `aix`、`darwin`、`linux`、`win32` 等
=======
The naming convention includes:
- **Test name**: either the first argument of the `toMatchScreenshot()` call, or automatically generated from the test's name.
- **Browser name**: depends on the configured browser provider, for example `chrome`, `chromium`, `firefox` or `webkit`.
- **Platform**: `aix`, `darwin`, `freebsd`, `linux`, `openbsd`, `sunos`, or `win32`.
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

这种命名方式可避免不同环境生成的截图互相覆盖。

<<<<<<< HEAD
### 更新基准截图 {#updating-references}

当你有意修改 UI 时，需要更新基准截图：
=======
### Updating references

When you intentionally change your UI, you'll need to update the reference screenshots just as you would update snapshots:
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

```bash
$ vitest --project vrt --update
```

<<<<<<< HEAD
提交前务必核对更新后的截图，确保改动符合预期。

## 可视化测试的工作原理 {#how-visual-tests-work}

可视化回归测试需要稳定的截图进行比较。但页面不会立即稳定，图片加载、动画完成、字体渲染和布局稳定都需要时间。

Vitest 通过 “稳定截图检测” 机制自动处理这一问题：

1. Vitest 首先拍摄初始截图（或使用现有参考截图）作为基准
2. 再次拍摄截图并与基准比对
    - 如果截图一致，判定页面已稳定并继续测试
    - 如果存在差异，则将最新截图设为新基准并重复流程
3. 这会持续进行，直到达到稳定性或超时

此机制确保临时性视觉变化（如加载动画）不会引发误报。但对于持续动画元素，系统会因超时而终止，建议测试期间 [禁用动画](#disable-animations)。

当经过重试（一次或多次）获得稳定截图且存在参考截图时，Vitest 会使用 `createDiff: true` 参数执行最终比对。若结果不匹配，将生成差异图像。

在稳定性检测阶段，Vitest 调用比对器时使用 `createDiff: false` 参数，因此仅需判断截图是否匹配。这种优化使检测过程保持高效。

## 配置可视化测试 {#configuring-visual-tests}

### 全局配置 {#global-configuration}

可在 [Vitest 配置文件](/config/browser/expect#tomatchscreenshot) 中设定可视化回归测试的默认规则：
=======
Review updated screenshots before committing to make sure changes are intentional.

::: warning Stale screenshots
Note that **screenshots for deleted or renamed tests aren't removed automatically**. Clean up the `__screenshots__` folder manually when you remove or rename tests, otherwise stale references will accumulate over time.
:::

### Debugging failed tests

When a visual test fails, Vitest provides three images to help debug:

1. **Reference screenshot**: the expected baseline image
1. **Actual screenshot**: what was captured during the test
1. **Diff image**: highlights the differences; only generated when the screenshots have the same dimensions (behavior may vary with custom matchers)

You'll see something like this in the CLI output:

```
expect(element).toMatchScreenshot()

Screenshot does not match the stored reference.
245 pixels (ratio 0.03) differ.

Reference screenshot:
  tests/__screenshots__/button.vrt.test.ts/button-chromium-darwin.png

Actual screenshot:
  tests/.vitest/attachments/button.vrt.test.ts/button-chromium-darwin-actual.png

Diff image:
  tests/.vitest/attachments/button.vrt.test.ts/button-chromium-darwin-diff.png
```
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

While in UI mode, Vitest shows a tabbed diff view with an A/B slider as shown below.

<center>
  <img alt="Animated demo of the visual regression diff view, switching tabs and using the slider to reveal differences" img-light src="/visual-regression/diff-view-light.avif">
  <img alt="Animated demo of the visual regression diff view, switching tabs and using the slider to reveal differences" img-dark src="/visual-regression/diff-view-dark.avif">

  <sup>An example of the visual regression diff UI, showing the "Diff", "Reference", "Actual", and "Slider" tabs, and how the slider reveals unexpected visual changes in a component.</sup>
</center>

#### Understanding the diff image

- **Red pixels** are areas that differ between reference and actual
- **Yellow pixels** are anti-aliasing differences (when anti-alias is not ignored)
- **Transparent/original** are unchanged areas

:::tip
If the diff is mostly red, something's really wrong. If it's speckled with a few red pixels around text, you probably just need to bump your threshold.
:::

## Configuring the `toMatchScreenshot` assertion

It's possible to configure the `toMatchScreenshot` assertion either globally, by changing its default options, or on a per-test basis.

To change the defaults, you have to change the [Vitest config](/config/browser/expect#tomatchscreenshot):

```ts{6-16} [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      expect: {
        toMatchScreenshot: {
          comparatorName: 'pixelmatch',
          comparatorOptions: {
            // 0-1，表示允许的颜色差异阈值
            threshold: 0.2,
            // 允许 1% 的像素存在差异
            allowedMismatchedPixelRatio: 0.01,
          },
        },
      },
    },
  },
})
```

<<<<<<< HEAD
### 单测试配置 {#per-test-configuration}

若某个测试需要不同的比较标准，可在调用时覆盖全局设置：

```ts
await expect(element).toMatchScreenshot('button-hover', {
=======
For more fine-grained control, override global settings in specific tests by passing options directly to the assertion:

```ts{2-6}
await expect(element).toMatchScreenshot('button', {
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d
  comparatorName: 'pixelmatch',
  comparatorOptions: {
    // 对文字密集型元素采用更宽松的比对标准
    allowedMismatchedPixelRatio: 0.1,
  },
})
```

<<<<<<< HEAD
## 最佳实践 {#best-practices}

### 聚焦测试目标元素 {#test-specific-elements}

除非确实需要测试整个页面，否则应优先只对目标组件截图，这能显著减少因页面其他部分变化而造成的误报。
=======
## Third-party comparators

Vitest ships with `pixelmatch` as its built-in comparator. It's fast, compares images pixel-by-pixel, has no native dependencies, and handles the majority of cases well. Perceptual comparators aren't included by default because they bring heavier dependencies and there's no clear single "best one" to pick as different algorithms make different trade-offs, but the comparator API exists precisely to let you plug in whatever fits your needs. This decision may change as the ecosystem matures, though.

For use cases where pixel-level diffing produces excessive noise, a perceptual or structural similarity comparator may be a better fit. These compare images more like a human would, tolerating minor rendering differences while still detecting meaningful visual changes.

There are many algorithms, so these are a useful starting point:

- [`@blazediff/ssim`](https://blazediff.dev/docs/ssim), [SSIM (Structural Similarity Index)](https://en.wikipedia.org/wiki/Structural_similarity_index_measure) implementations for perceptual image quality assessment. It offers standard SSIM, MS-SSIM (Multi-Scale SSIM), and Hitchhiker’s SSIM for various use cases
- [`@blazediff/gmsd`](https://blazediff.dev/docs/gmsd), a single-threaded GMSD (Gradient Magnitude Similarity Deviation) metric for perceptual image quality assessment, good for CI environments

To use one, install and register it:

```ts{5-11,18-46} [vitest.config.ts]
import ssim from '@blazediff/ssim/ssim'
import type { SsimOptionsExtended } from '@blazediff/ssim/ssim'
import { defineConfig } from 'vitest/config'

declare module 'vitest/browser' {
  interface ScreenshotComparatorRegistry {
    'standard-ssim': SsimOptionsExtended & {
      threshold?: number
    }
  }
}

export default defineConfig({
  test: {
    browser: {
      expect: {
        toMatchScreenshot: {
          comparators: {
            // naive implementation, always check the library's docs
            'standard-ssim': (
              reference,
              actual,
              { createDiff, ...options }
            ) => {
              const diffBuffer = createDiff
                ? new Uint8Array(reference.data.length)
                : undefined

              const output = ssim(
                reference.data,
                actual.data,
                diffBuffer,
                reference.metadata.width,
                reference.metadata.height,
                options,
              )

              const pass = output >= (options.threshold ?? 0.95)

              return {
                pass,
                diff: diffBuffer ?? null,
                message: pass ? null : `SSIM score: ${output}.`,
              }
            },
          },
        },
      },
    },
  },
})
```

Once registered, the comparator can be referenced by name in your config or on a per-test basis:

:::code-group

```ts{8} [vitest.config.ts]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      expect: {
        toMatchScreenshot: {
          comparatorName: 'standard-ssim',
        },
      },
    },
  },
})
```

```ts{2} [button.vrt.test.tsx]
await expect(button).toMatchScreenshot('button', {
  comparatorName: 'standard-ssim',
})
```

:::

## Best practices

### Test specific elements

Unless you explicitly want to test the whole page, prefer capturing specific components to reduce false positives:
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

```ts
// ❌ 捕获整个页面；容易受到无关更改的影响
await expect(page).toMatchScreenshot()

<<<<<<< HEAD
// ✅ 仅捕获被测试的组件
await expect(page.getByTestId('product-card')).toMatchScreenshot()
```

### 处理动态内容 {#handle-dynamic-content}

测试中，如果页面包含诸如时间戳、用户信息或随机值等动态内容，往往会导致结果不一致而造成测试失败。
解决方法有两种：一是模拟这些动态数据的生成源；
二是在使用 Playwright 进行截图时，在 `screenshotOptions` 中启用
[`mask` 选项](https://playwright.dev/docs/api/class-page#page-screenshot-option-mask)，
将这些动态区域遮盖，从而确保测试结果的稳定性。
=======
// ✅ Captures only the component under test
await expect(
  page.getByRole('article', { name: 'Tote bag' })
).toMatchScreenshot()
```

### Handle dynamic content

Dynamic content like timestamps, user data, or random values will cause tests to fail. Either mock the underlying data sources or mask them using the [`mask` option](https://playwright.dev/docs/api/class-page#page-screenshot-option-mask) in `screenshotOptions` when using the Playwright provider.
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

```ts{8}
const profile = page.getByRole(
  'article',
  { name: 'Gracie\'s profile' },
)

await expect(profile).toMatchScreenshot({
  screenshotOptions: {
    mask: [profile.getByRole('status')],
  },
})
```

<<<<<<< HEAD
### 禁用所有动画 {#disable-animations}

动画效果往往会导致测试结果出现波动。为避免这种情况，
可以在测试执行过程中注入一段自定义的 CSS 样式代码，用于禁用所有动画，从而提升测试的稳定性。

```css
*, *::before, *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}
```

::: tip
在使用 Playwright 作为测试工具时，若执行断言操作，动画会被自动禁用。
具体而言，`screenshotOptions` 配置中的 `animations` 选项会默认设为 `"disabled"`，从而确保截图与测试结果的稳定一致。
:::

### 设置合理的阈值 {#set-appropriate-thresholds}

在视觉回归测试中，阈值调整是一项需要权衡的工作——它取决于页面内容、测试环境、
应用所能容忍的差异范围，且可能因具体测试而有所不同。

Vitest 并未为像素差异设定默认阈值，这需要由用户根据实际需求来决定。
官方建议使用 `allowedMismatchedPixelRatio`，让阈值按截图的整体尺寸比例计算，而非依赖固定像素数量。

当 `allowedMismatchedPixelRatio` 与 `allowedMismatchedPixels` 同时设置时，
Vitest 会优先采用二者中限制更严格的那一个，以确保测试结果的准确性与一致性。

### 保持统一的视口大小 {#set-consistent-viewport-sizes}

浏览器实例的默认窗口尺寸可能存在差异，这会影响视觉回归测试的稳定性。为避免由于尺寸不一致而产生的截图偏差，
建议在测试脚本或浏览器实例配置中显式指定一个固定的视口大小，从而确保测试结果的可重复性与一致性。
=======
### Disable animations

::: tip
When using the Playwright provider, animations are automatically disabled when using the built-in assertion: the `animations` option's value in `screenshotOptions` is set to `"disabled"` by default.

If you prefer to disable all animations to save some execution time, continue reading.
:::

Animations can cause flaky tests. Disable them during testing by injecting a custom CSS snippet using [`setupFiles`](/config/setupfiles) or directly in your tests:
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

```ts
const stylesheet = document.createElement('style')

stylesheet.textContent = /* css */`
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
`

document.head.appendChild(stylesheet)
```

Alternatively, you can declare the CSS in a custom HTML template by using [`browser.testerHtmlPath`](/config/browser/testerhtmlpath).

### Set appropriate thresholds

Tuning thresholds is tricky. It depends on the content, test environment, what's acceptable for your app, and might also change based on the test.

Vitest does not define a default tolerance for mismatched pixels. The appropriate value depends on your application and environment. The recommendation is to use `allowedMismatchedPixelRatio`, so that the threshold is computed on the size of the screenshot and not a fixed number.

When setting both `allowedMismatchedPixelRatio` and `allowedMismatchedPixels`, Vitest uses whichever limit is stricter.

### 使用 Git LFS 管理基准截图 {#use-git-lfs}

<<<<<<< HEAD
对于规模较大的视觉回归测试套件，建议将基准截图文件存储在
[Git LFS](https://github.com/git-lfs/git-lfs?tab=readme-ov-file) 中。
这样既能避免仓库体积膨胀，又能高效管理和传输这些大尺寸文件，提升团队协作效率。

## 调试失败的视觉测试 {#debugging-failed-tests}

当视觉回归测试未能通过时， Vitest 会生成三张关键截图，帮助你分析问题所在：

1. **参考截图（ Reference screenshot ）**：测试期望的基准图像
2. **实际截图（ Actual screenshot ）**：测试运行过程中截取的画面
3. **差异图（ Diff image ）**：用高亮标记出参考图与实际图的差异（有时可能不会生成）

在调试时，你会在输出中看到类似如下的文件列表或路径信息：

```
expect(element).toMatchScreenshot()

Screenshot does not match the stored reference.
245 pixels (ratio 0.03) differ.

Reference screenshot:
  tests/__screenshots__/button.test.ts/button-chromium-darwin.png

Actual screenshot:
  tests/.vitest/attachments/button.test.ts/button-chromium-darwin-actual.png

Diff image:
  tests/.vitest/attachments/button.test.ts/button-chromium-darwin-diff.png
```

### 如何解读差异图 {#understanding-the-diff-image}

- **红色像素**：表示参考截图与实际截图之间存在显著差异的区域
- **黄色像素**：由抗锯齿处理带来的细微差异（仅在未忽略抗锯齿时可见）
- **透明或原始图像部分**：表示两张截图在该区域完全一致

:::tip
如果差异图几乎被红色覆盖，说明测试结果与预期严重不符，需要重点排查。
若只是文字边缘零星出现少量红点，可能只是渲染细节差异，此时适当提高阈值即可解决。
:::

## 常见问题与解决方案 {#common-issues-and-solutions}

### 字体渲染引发的误报 {#false-positives-from-font-rendering}

由于不同操作系统在字体可用性与渲染方式上差异明显，视觉回归测试中可能会出现“误报”现象。为降低这种风险，可以考虑以下做法：
=======
Store reference screenshots in [Git LFS](https://github.com/git-lfs/git-lfs?tab=readme-ov-file) if you plan to have a large test suite.

## Common issues and solutions

### False positives from font rendering

Font availability and rendering varies significantly between systems. Some possible solutions might be to:
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

- 使用 Web 字体，并在测试执行前等待字体完全加载；

  ```ts
  // wait for fonts to load
  await document.fonts.ready

  // continue with your tests
  ```

- 对包含大量文字的区域适当提高像素差异的比较阈值，以减少因字体渲染细微差别导致的误报；

  ```ts{6-7}
  await expect(
    page.getByRole('article', { name: 'How to grow tomatoes' })
  ).toMatchScreenshot({
    comparatorName: 'pixelmatch',
    comparatorOptions: {
      // 10% of the pixels are allowed to change
      allowedMismatchedPixelRatio: 0.1,
    },
  })
  ```

<<<<<<< HEAD
- 使用云端服务或容器化测试环境，确保字体渲染效果在各次测试中保持一致，从而减少系统差异带来的影响；

### 测试不稳定或截图尺寸不一致 {#flaky-tests-or-different-screenshot-sizes}

如果测试结果出现随机通过或失败，或者在不同运行中生成的截图尺寸不一致，可以采取以下措施：

- 确保页面所有内容均已加载完成，包括加载指示器与动画；
- 明确设置固定的视口大小，例如：`await page.viewport(1920, 1080)`；
- 检查页面在视口临界尺寸下的响应式布局表现；
- 排查是否存在非预期的动画或过渡效果干扰截图结果；
- 对体积较大的截图适当延长测试的超时时间；
- 使用云端服务或容器化环境，确保字体渲染、浏览器配置等保持一致。

## 团队版视觉回归测试方案 {#visual-regression-testing-for-teams}

视觉回归测试对环境的稳定性要求极高，而本地开发机并不适合担当这一角色。

在团队协作中，常见的三种方案是：

1. **自托管运行器**：部署过程复杂，日常维护工作量大；
2. **GitHub Actions**：对开源项目免费，可与任何测试框架或服务集成；
3. **云服务**：如 [Microsoft Playwright Testing](https://azure.microsoft.com/en-us/products/playwright-testing)，专为解决视觉测试环境一致性问题而构建。

我们将重点介绍第 2 和第 3 种方案，因为它们能最快投入使用。

主要权衡点在于：

- **GitHub Actions**：视觉测试只能在持续集成（CI）环境中运行，开发者无法直接在本地执行；
- **Microsoft 云服务**：可在任意环境运行，但需额外付费，并且仅支持 Playwright。

:::: tabs key:vrt-for-teams
=== GitHub Actions

要点在于，将视觉回归测试与常规测试分离运行。
否则，你可能会因截图差异引发的失败日志而浪费数小时进行排查。

### 测试组织建议 {#organizing-your-tests}

首先，应将视觉回归测试与其他测试隔离管理。
建议单独建立一个 `visual` 文件夹（或根据项目结构选择更合适的目录名称）来存放这些测试用例，以便维护与执行。

```json [package.json]
{
  "scripts": {
    "test:unit": "vitest --exclude tests/visual/*.test.ts",
    "test:visual": "vitest tests/visual/*.test.ts"
  }
}
```

这样，开发者就能在本地运行 `npm run test:unit` ，而无需受到视觉回归测试的影响；
视觉测试则放在环境一致的持续集成（ CI ）平台中运行，以确保结果稳定可靠。

::: tip 抉择
不喜欢用 glob 匹配模式？那你也可以创建独立的 [测试项目](/guide/projects)，并通过以下方式来运行它们：

- `vitest --project unit`
- `vitest --project visual`
:::

### 持续集成（ CI ）环境配置 {#ci-setup}

在 CI 环境中运行视觉回归测试时，需要确保浏览器已正确安装。至于如何安装，则取决于你所使用的 CI 服务提供商及其运行环境。
=======
- [Consider a shared environment setup](#visual-testing-for-teams) for consistent font rendering.

### Flaky tests or different screenshot sizes

If tests pass and fail randomly, or if screenshots have different dimensions between runs:

- Wait for everything to load, including loading indicators
- Set explicit viewport sizes: `await page.viewport(1920, 1080)`
- Check for responsive behavior at viewport boundaries
- Check for unintended animations or transitions
- Increase test timeout for large screenshots
- [Consider a shared environment setup](#visual-testing-for-teams)

## Visual testing for teams

Even with a controlled local setup, references generated on one machine will often fail on another. This matters as soon as more than one person is running the suite.

Running the visual regression suite in a shared environment solves this problem. There are three ways to do this:

1. **Self-hosted runners** (e.g., Docker images), complex to set up and maintain
1. **Generate references in CI**, which requires some setup
1. **Cloud services**, like [Azure App Testing](https://azure.microsoft.com/en-us/products/app-testing/), built to solve this exact problem, but usually restricted to specific providers and browsers

Options 2 and 3 are the quickest to get running, so those are covered below.

:::: tabs key:shared-environment-vrt
=== GitHub Actions (CI)

GitHub runners don't have browsers preinstalled. Install them before running tests, using the steps for your provider:
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

::: tabs key:provider
== Playwright

<<<<<<< HEAD
[Playwright](https://npmx.dev/package/playwright) 能让浏览器安装与管理变得非常简单。
你只需固定所用的 Playwright 版本，并在运行测试之前加入以下命令或脚本：
=======
[Playwright](https://npmx.dev/package/playwright) makes this easy. Just pin your version and add this step before running tests:
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

```yaml [.github/workflows/ci.yml]
# ...the rest of the workflow
- name: Install Playwright Browsers
  run: npx --no playwright install --with-deps --only-shell
```

== WebdriverIO

<<<<<<< HEAD
[WebdriverIO](https://npmx.dev/package/webdriverio) 要求用户自行准备浏览器环境。不过，
[ @browser-actions ](https://github.com/browser-actions) 团队已经为此提供了方便的解决方案，
帮你轻松完成浏览器的安装与配置。
=======
[WebdriverIO](https://npmx.dev/package/webdriverio) installs browsers automatically if none can be found when a test run starts, but it's recommended to decouple the installation process. To help with this, the folks at [@browser-actions](https://github.com/browser-actions) have packaged scripts to install [Chrome](https://github.com/browser-actions/setup-chrome), [Edge](https://github.com/browser-actions/setup-edge), and [Firefox](https://github.com/browser-actions/setup-firefox) in convenient reusable actions:
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

```yaml [.github/workflows/ci.yml]
# ...the rest of the workflow
- uses: browser-actions/setup-chrome@v1
  with:
    chrome-version: 120
```

:::

<<<<<<< HEAD
最后，运行你的视觉回归测试：
=======
Then in your existing workflow run the visual tests:
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

```yaml [.github/workflows/ci.yml]
# ...the rest of the workflow
# ...browser setup
- name: Visual Regression Testing
  run: npm run test:visual
```

<<<<<<< HEAD
### 更新工作流程 {#the-update-workflow}

关键点来了——切勿在每一次 Pull Request 中都自动更新截图，
<small>*(那只会带来混乱)*</small>。更稳妥的方式，是建立一个手动触发的工作流程，
让开发者在有意更改 UI 时主动运行，从而更新基准截图。
=======
### The update workflow

Running `vitest --update` locally would generate screenshots on your machine, defeating the whole point of a controlled environment. Instead, you need a way to trigger the update in CI where the environment matches the one that runs the tests.

You don't want this to happen automatically on every PR <small>*(chaos!)*</small>. Instead, create a manually-triggered workflow that runs when there are intentional changes to the UI.
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

该工作流程具备以下特性：
- 仅在功能分支上运行，确保主分支安全不受影响；
- 自动将触发流程的开发者署名为共同作者；
- 阻止同一分支上的并发执行，避免冲突与资源浪费；
- 生成一份清晰美观的执行摘要，便于快速查看结果。
  - **当基准截图发生变动时**，系统会列出所有具体的变化项，方便开发者快速了解差异。

    <img alt="Action summary after updates" img-light src="/vrt-gha-summary-update-light.png">
    <img alt="Action summary after updates" img-dark src="/vrt-gha-summary-update-dark.png">

  - **当没有任何变化时**，系统同样会明确提示，让你一目了然。

    <img alt="Action summary after no updates" img-light src="/vrt-gha-summary-no-update-light.png">
    <img alt="Action summary after no updates" img-dark src="/vrt-gha-summary-no-update-dark.png">

::: tip
<<<<<<< HEAD
这只是实现的其中一种方式。
有些团队倾向于在 Pull Request 中添加特定评论（如 `/update-screenshots`）来触发更新，
也有团队通过添加标签来完成这一操作。
你可以根据自身的开发流程进行调整。

关键在于，必须建立一种可控的机制来更新基准截图，
以避免不必要的混乱和错误。
=======
This is just one approach. Some prefer PR comments (`/update-screenshots`), others use labels. Adjust it to fit your workflow.

The important part is having a controlled way to update reference screenshots.
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d
:::

```yaml [.github/workflows/update-screenshots.yml]
name: Update Visual Regression Screenshots

on:
  workflow_dispatch: # manual trigger only

env:
  AUTHOR_NAME: 'github-actions[bot]'
  AUTHOR_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com'
  COMMIT_MESSAGE: |
    test: update visual regression screenshots

    Co-authored-by: ${{ github.actor }} <${{ github.actor_id }}+${{ github.actor }}@users.noreply.github.com>

jobs:
  update-screenshots:
    runs-on: ubuntu-24.04

    # safety first: don't run on main
    if: github.ref_name != github.event.repository.default_branch

    # one at a time per branch
    concurrency:
      group: visual-regression-screenshots@${{ github.ref_name }}
      cancel-in-progress: true

    permissions:
      contents: write # needs to push changes

    steps:
      - name: Checkout selected branch
        uses: actions/checkout@v4
        with:
          ref: ${{ github.ref_name }}
          # use PAT if triggering other workflows
          # token: ${{ secrets.GITHUB_TOKEN }}

      - name: Configure Git
        run: |
          git config --global user.name "${{ env.AUTHOR_NAME }}"
          git config --global user.email "${{ env.AUTHOR_EMAIL }}"

      # your setup steps here (node, pnpm, whatever)
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx --no playwright install --with-deps --only-shell

      - name: Update Visual Regression Screenshots
        run: npm run test:visual --update

      # check what changed
      - name: Check for changes
        id: check_changes
        run: |
          CHANGED_FILES=$(git status --porcelain | awk '{print $2}')
          if [ "${CHANGED_FILES:+x}" ]; then
            echo "changes=true" >> $GITHUB_OUTPUT
            echo "Changes detected"

            # save the list for the summary
            echo "changed_files<<EOF" >> $GITHUB_OUTPUT
            echo "$CHANGED_FILES" >> $GITHUB_OUTPUT
            echo "EOF" >> $GITHUB_OUTPUT
            echo "changed_count=$(echo "$CHANGED_FILES" | wc -l)" >> $GITHUB_OUTPUT
          else
            echo "changes=false" >> $GITHUB_OUTPUT
            echo "No changes detected"
          fi

      # commit if there are changes
      - name: Commit changes
        if: steps.check_changes.outputs.changes == 'true'
        run: |
          git add -A
          git commit -m "${{ env.COMMIT_MESSAGE }}"

      - name: Push changes
        if: steps.check_changes.outputs.changes == 'true'
        run: git push origin ${{ github.ref_name }}

      # pretty summary for humans
      - name: Summary
        run: |
          if [[ "${{ steps.check_changes.outputs.changes }}" == "true" ]]; then
            echo "### 📸 Visual Regression Screenshots Updated" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "Successfully updated **${{ steps.check_changes.outputs.changed_count }}** screenshot(s) on \`${{ github.ref_name }}\`" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "#### Changed Files:" >> $GITHUB_STEP_SUMMARY
            echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
            echo "${{ steps.check_changes.outputs.changed_files }}" >> $GITHUB_STEP_SUMMARY
            echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "✅ The updated screenshots have been committed and pushed. Your visual regression baseline is now up to date!" >> $GITHUB_STEP_SUMMARY
          else
            echo "### ℹ️ No Screenshot Updates Required" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "The visual regression test command ran successfully but no screenshots needed updating." >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "All screenshots are already up to date! 🎉" >> $GITHUB_STEP_SUMMARY
          fi
```

=== Azure App Testing (Cloud service)

<<<<<<< HEAD
你的测试依旧在本地运行，只是将浏览器托管到云端执行。
这基于 Playwright 的远程浏览器功能，但所有云端基础设施均由 Microsoft 负责维护与管理。

在 CI 平台中，将所需的密钥添加到环境变量或机密配置中：
=======
With this method, your tests stay local but the browsers run in the cloud. This is built on top of Playwright's remote browser feature and Azure handles all the infrastructure.

Everyone uses the same cloud browsers, so references are consistent regardless of who runs them. Tests work locally, you pay only for what you use, and there's nothing to maintain.

### Configuration

To have Playwright connect to the browsers spawned within the service, you have to update the provider configuration.

```ts{14-28} [vitest.config.ts]
import { env } from 'node:process'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    // ...other configurations
    projects: [
      {
        extends: true,
        test: {
          name: 'vrt',
          browser: {
            provider: playwright({
              connectOptions: {
                wsEndpoint: `${env.PLAYWRIGHT_SERVICE_URL}?${new URLSearchParams({
                  'api-version': '2025-09-01',
                  'os': 'linux', // always use Linux for consistency
                  // helps identifying runs in the service's dashboard
                  'runName': `Vitest ${env.CI ? 'CI' : 'local'} run @${new Date().toISOString()}`,
                })}`,
                exposeNetwork: '<loopback>',
                headers: {
                  Authorization: `Bearer ${env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN}`,
                },
                timeout: 30_000,
              }
            }),
            headless: true,
            instances: [
              {
                browser: '[browser-name]',
                viewport: { width: 1280, height: 720 },
              },
            ],
          },
          include: [vrtPattern],
        },
      },
      // ...other projects
    ],
  },
})
```

To create a Playwright Workspace follow the [official guide](https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/quickstart-run-end-to-end-tests?tabs=playwrightcli&pivots=playwright-test-runner#create-a-workspace).

Once your workspace is created, configure Vitest to use it:

1. **Set the endpoint URL**: following the [official guide](https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/quickstart-run-end-to-end-tests?tabs=playwrightcli&pivots=playwright-test-runner#configure-the-browser-endpoint), retrieve the URL and set it as the `PLAYWRIGHT_SERVICE_URL` environment variable.
1. **Enable token authentication**: [enable access tokens](https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/how-to-manage-authentication?pivots=playwright-test-runner#enable-authentication-using-access-tokens) for your workspace, then [generate a token](https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/how-to-manage-access-tokens#generate-a-workspace-access-token) and set it as the `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` environment variable.

::: danger Keep that token secret!
Never commit `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` to your repository. Anyone with the token can rack up your bill. Use environment variables locally and secrets in CI.
:::

### Running tests

```bash
# Local development
npm run test:unit    # runs locally using your browsers
npm run test:visual  # uses cloud browsers

# Update screenshots
npm run test:visual -- --update
```

### CI setup

Add the secrets to your CI configuration:
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d

```yaml
env:
  PLAYWRIGHT_SERVICE_URL: ${{ vars.PLAYWRIGHT_SERVICE_URL }}
  PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
```

<<<<<<< HEAD
接下来，你只需像往常一样运行测试，其余的由服务全权负责处理。

::::

### 该选哪一个？ {#so-which-one}

两种方案都可行，关键在于团队最在意的痛点是什么。

如果你的团队已经深度依赖 GitHub 生态，那么 **GitHub Actions** 几乎是无可替代的选择——对开源项目免费、
支持任意浏览器服务商、并且可完全掌控执行流程。

缺点在于：当有人在本地生成的截图与 CI 环境的基准不一致时，就会出现那句熟悉的 “在我机器上没问题”。

如果团队需要在本地执行视觉回归测试，那么云服务或许更适合。
这种方式特别适合有设计师参与审核，或开发者希望在推送代码前发现并修复问题的团队，
能够跳过 “推送—等待—检查—修改—再推送” 的繁琐循环。

如果依然犹豫，不妨先从 GitHub Actions 开始；等到本地测试成为痛点时，再引入云服务也不迟。
=======
Then run your tests like normal. The service handles the browser infrastructure.

::::

### Picking the right option

All approaches work. The real question is what pain points matter most to you and your team.

If you're comfortable with containerization, a self-hosted Docker setup gives you a controlled environment without any external dependencies or costs. The downside is maintenance as you own the setup, the browser versions, and any breakage.

CI runs work with any browser provider and give you full control, but screenshots can only be generated in CI. If someone runs `vitest --update` locally and commits the result, those references will likely fail on the next CI run. This is preventable by guarding the command behind a CI environment check.

A cloud service makes sense if you want developers to be able to run and update visual tests locally without risking mismatched references. It becomes even more useful when designers are involved in reviewing changes, or when the push-wait-check-fix-push cycle becomes a real bottleneck.

Still on the fence? Start with the CI workflow. You can always move to a container or cloud service later if it becomes a pain point.

## Going deeper

### How Vitest ensures screenshot stability

Visual regression tests rely on screenshots remaining stable across runs. In practice, pages are not instantly stable: images load asynchronously, animations finish at different times, fonts render, and layouts settle. To mitigate this, Vitest uses a "Stable Screenshot Detection" strategy:

1. It takes an initial screenshot (or uses the reference screenshot if available) as baseline
1. It takes another screenshot and compares it with the baseline
    - If the screenshots match, the page is stable and testing continues
    - If they differ, Vitest uses the newest screenshot as the baseline and repeats
1. This continues until stability is achieved or the timeout is reached

This ensures that transient visual changes (like loading spinners or animations) don't cause false positives. If something never stops animating, though, you'll hit the timeout, so consider [disabling animations during testing](#disable-animations).

If a stable screenshot is captured after one or more retries and a reference screenshot exists, Vitest performs a final comparison with the reference using `createDiff: true`. This will generate a diff image if they don't match.

During stability detection, Vitest calls comparators with `createDiff: false` since it only needs to know if screenshots match. This keeps the detection process fast.
>>>>>>> 07905088c646d9edfd0b759bc8cf7e76040f157d
