---
title: 交互性 API | 浏览器模式
---

# 交互性 API

Vitest 使用 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) 或 [webdriver](https://www.w3.org/TR/webdriver/) 实现了 [`@testing-library/user-event`](https://testing-library.com/docs/user-event/intro) 库的子集 API，而不是伪造事件，这使得浏览器行为更加可靠和一致，符合用户与页面交互的方式。

```ts
import { userEvent } from 'vitest/browser'

await userEvent.click(document.querySelector('.button'))
```

几乎所有的 `userEvent` 方法都继承了其提供者的选项。

## userEvent.setup

```ts
function setup(): UserEvent
```

创建一个新的用户事件实例。如果需要保持键盘状态，以便正确按下和释放按钮，这将非常有用。

::: warning
与 `@testing-library/user-event` 不同，来自 `vitest/browser` 的默认 `userEvent` 实例只创建一次，而不是每次调用其方法时都创建一次！你可以从本代码段中看到其工作方式的不同之处：

```ts
import { userEvent as vitestUserEvent } from 'vitest/browser'
import { userEvent as originalUserEvent } from '@testing-library/user-event'
import { userEvent as vitestUserEvent } from '@vitest/browser/context'

await vitestUserEvent.keyboard('{Shift}') // 按住 shift 键不放
await vitestUserEvent.keyboard('{/Shift}') // 放开 shift 键不放

await originalUserEvent.keyboard('{Shift}') // 按住 shift 键不放
await originalUserEvent.keyboard('{/Shift}') // 没有放开 shift 键，因为状态不同
```

这种行为更有用，因为我们并没有模拟键盘，而是实际按下了 Shift 键，所以保留原来的行为会在字段中键入时造成意想不到的问题。
:::

## userEvent.click

```ts
function click(
  element: Element | Locator,
  options?: UserEventClickOptions,
): Promise<void>
```

点击元素。继承 provider 的选项。有关此方法如何工作的详细说明，请参阅 provider 的文档。

```ts
import { page, userEvent } from 'vitest/browser'

test('clicks on an element', async () => {
  const logo = page.getByRole('img', { name: /logo/ })

  await userEvent.click(logo)
  // 或者你可以直接从定位器上访问
  await logo.click()
})
```

相关链接：

- [Playwright `locator.click` API](https://playwright.dev/docs/api/class-locator#locator-click)
- [WebdriverIO `element.click` API](https://webdriver.io/docs/api/element/click/)
- [testing-library `click` API](https://testing-library.com/docs/user-event/convenience/#click)

## userEvent.dblClick

```ts
function dblClick(
  element: Element | Locator,
  options?: UserEventDoubleClickOptions,
): Promise<void>
```

触发元素的双击事件

请参阅你的 provider 的文档以获取有关此方法如何工作的详细说明。

```ts
import { page, userEvent } from 'vitest/browser'

test('triggers a double click on an element', async () => {
  const logo = page.getByRole('img', { name: /logo/ })

  await userEvent.dblClick(logo)
  // 或者你可以直接从定位器上访问
  await logo.dblClick()
})
```

相关链接：

- [Playwright `locator.dblclick` API](https://playwright.dev/docs/api/class-locator#locator-dblclick)
- [WebdriverIO `element.doubleClick` API](https://webdriver.io/docs/api/element/doubleClick/)
- [testing-library `dblClick` API](https://testing-library.com/docs/user-event/convenience/#dblClick)

## userEvent.tripleClick

```ts
function tripleClick(
  element: Element | Locator,
  options?: UserEventTripleClickOptions,
): Promise<void>
```

在元素上触发三连击事件。由于浏览器 API 中没有 `tripleclick`，此方法会连续触发三次点击事件，因此你必须检查 [点击事件的 detail 属性](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event#usage_notes) 来过滤事件：`evt.detail === 3`。

请参阅你的提供商文档以获取有关此方法工作原理的详细说明。

```ts
import { page, userEvent } from 'vitest/browser'

test('triggers a triple click on an element', async () => {
  const logo = page.getByRole('img', { name: /logo/ })
  let tripleClickFired = false
  logo.addEventListener('click', (evt) => {
    if (evt.detail === 3) {
      tripleClickFired = true
    }
  })

  await userEvent.tripleClick(logo)
  // 或者你可以直接从定位器上访问
  await logo.tripleClick()

  expect(tripleClickFired).toBe(true)
})
```

相关链接：

- [Playwright `locator.click` API](https://playwright.dev/docs/api/class-locator#locator-click)：通过 `click` 方法并设置 `clickCount: 3` 来实现。
- [WebdriverIO `browser.action` API](https://webdriver.io/docs/api/browser/action/)：通过动作 API 实现，包含 `move` 操作加上连续的三个 `down + up + pause` 事件。
- [testing-library `tripleClick` API](https://testing-library.com/docs/user-event/convenience/#tripleClick)：通过 `tripleClick` 方法实现。

## userEvent.fill

```ts
function fill(
  element: Element | Locator,
  text: string,
): Promise<void>
```

为 `input` `、textarea` 或 `contenteditable` 元素设置新的内容，并且在赋值前会先清空其中已有的文本。

```ts
import { page, userEvent } from 'vitest/browser'

test('update input', async () => {
  const input = page.getByRole('input')

  await userEvent.fill(input, 'foo') // input.value == foo
  await userEvent.fill(input, '{{a[[') // input.value == {{a[[
  await userEvent.fill(input, '{Shift}') // input.value == {Shift}

  // 或者你可以直接从定位器上访问
  await input.fill('foo') // input.value == foo
})
```

该方法聚焦元素、填充元素并在填充后触发一个 `input` 事件。您可以使用空字符串来清除字段。

::: tip
该 API 比使用 [`userEvent.type`](#userevent-type) 或 [`userEvent.keyboard`](#userevent-keyboard) 更快，但**不支持** [user-event `keyboard` syntax](https://testing-library.com/docs/user-event/keyboard) （例如，`{Shift}{selectall}`）。

在不需要输入特殊字符或对按键事件进行细粒度控制的情况下，我们建议使用此 API 而不是 [`userEvent.type`](#userevent-type)。
:::

相关链接：

- [Playwright `locator.fill` API](https://playwright.dev/docs/api/class-locator#locator-fill)
- [WebdriverIO `element.setValue` API](https://webdriver.io/docs/api/element/setValue)
- [testing-library `type` API](https://testing-library.com/docs/user-event/utility/#type)

## userEvent.keyboard

```ts
function keyboard(text: string): Promise<void>
```

通过 `userEvent.keyboard` 可以触发键盘输入。如果任何输入有焦点，它就会在该输入中键入字符。否则，它将触发当前焦点元素（如果没有焦点元素，则为 `document.body`）上的键盘事件。

此 API 支持 [user-event `keyboard` 语法](https://testing-library.com/docs/user-event/keyboard)。

```ts
import { userEvent } from 'vitest/browser'

test('trigger keystrokes', async () => {
  await userEvent.keyboard('foo') // 转化成：f, o, o
  await userEvent.keyboard('{{a[[') // 转化成：{, a, [
  await userEvent.keyboard('{Shift}{f}{o}{o}') // 转化成：Shift, f, o, o
  await userEvent.keyboard('{a>5}') // 按 a 不松开，触发 5 次按键
  await userEvent.keyboard('{a>5/}') // 按 a 键 5 次，然后松开
})
```

相关链接：

- [Playwright `Keyboard` API](https://playwright.dev/docs/api/class-keyboard)
- [WebdriverIO `action('key')` API](https://webdriver.io/docs/api/browser/action#key-input-source)
- [testing-library `type` API](https://testing-library.com/docs/user-event/utility/#type)

## userEvent.tab

```ts
function tab(options?: UserEventTabOptions): Promise<void>
```

发送一个 `Tab` 键事件。这是`userEvent.keyboard('{tab}')`的简写。

```ts
import { page, userEvent } from 'vitest/browser'

test('tab works', async () => {
  const [input1, input2] = page.getByRole('input').elements()

  expect(input1).toHaveFocus()

  await userEvent.tab()

  expect(input2).toHaveFocus()

  await userEvent.tab({ shift: true })

  expect(input1).toHaveFocus()
})
```

相关链接：

- [Playwright `Keyboard` API](https://playwright.dev/docs/api/class-keyboard)
- [WebdriverIO `action('key')` API](https://webdriver.io/docs/api/browser/action#key-input-source)
- [testing-library `tab` API](https://testing-library.com/docs/user-event/convenience/#tab)

## userEvent.type

```ts
function type(
  element: Element | Locator,
  text: string,
  options?: UserEventTypeOptions,
): Promise<void>
```

::: warning
如果不依赖 [special characters](https://testing-library.com/docs/user-event/keyboard)（例如，`{shift}` 或 `{selectall}`），建议使用 [`userEvent.fill`](#userevent-fill)。
:::

`type` 方法在 [`keyboard`](https://testing-library.com/docs/user-event/keyboard) API 的基础上实现了 `@testing-library/user-event` 的 [`type`](https://testing-library.com/docs/user-event/utility/#type) 工具。

你可以使用此函数向 `input` `、textarea` 或 `contenteditable` 元素中模拟键盘输入。[它兼容 user-event 提供的 keyboard 语法](https://testing-library.com/docs/user-event/keyboard)。

如果只需按下字符而无需输入，请使用 [`userEvent.keyboard`](#userevent-keyboard) API。

```ts
import { page, userEvent } from 'vitest/browser'

test('update input', async () => {
  const input = page.getByRole('input')

  await userEvent.type(input, 'foo') // input.value == foo
  await userEvent.type(input, '{{a[[') // input.value == foo{a[
  await userEvent.type(input, '{Shift}') // input.value == foo{a[
})
```

::: info
Vitest 没有像 `input.type` 那样在定位器上公开 `.type` 方法，因为它的存在只是为了与 `userEvent` 库兼容。请考虑使用 `.fill`，因为它更快。
:::

相关链接：

- [Playwright `locator.press` API](https://playwright.dev/docs/api/class-locator#locator-press)
- [WebdriverIO `action('key')` API](https://webdriver.io/docs/api/browser/action#key-input-source)
- [testing-library `type` API](https://testing-library.com/docs/user-event/utility/#type)

## userEvent.clear

```ts
function clear(element: Element | Locator, options?: UserEventClearOptions): Promise<void>
```

此方法会清除输入元素的内容。

```ts
import { page, userEvent } from 'vitest/browser'

test('clears input', async () => {
  const input = page.getByRole('input')

  await userEvent.fill(input, 'foo')
  expect(input).toHaveValue('foo')

  await userEvent.clear(input)
  // 或者你可以直接从定位器上访问
  await input.clear()

  expect(input).toHaveValue('')
})
```

相关链接：

- [Playwright `locator.clear` API](https://playwright.dev/docs/api/class-locator#locator-clear)
- [WebdriverIO `element.clearValue` API](https://webdriver.io/docs/api/element/clearValue)
- [testing-library `clear` API](https://testing-library.com/docs/user-event/utility/#clear)

## userEvent.selectOptions

```ts
function selectOptions(
  element: Element | Locator,
  values:
    | HTMLElement
    | HTMLElement[]
    | Locator
    | Locator[]
    | string
    | string[],
  options?: UserEventSelectOptions,
): Promise<void>
```

The `userEvent.selectOptions` allows selecting a value in a `<select>` element.

::: warning
如果 select 元素没有 [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-multiple) 属性，Vitest 将只选择数组中的第一个元素。

与 `@testing-library` 不同，Vitest 目前不支持 [listbox](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role)，但我们计划在将来添加对它的支持。
:::

```ts
import { page, userEvent } from 'vitest/browser'

test('clears input', async () => {
  const select = page.getByRole('select')

  await userEvent.selectOptions(select, 'Option 1')
  // 或者你可以直接从定位器上访问
  await select.selectOptions('Option 1')

  expect(select).toHaveValue('option-1')

  await userEvent.selectOptions(select, 'option-1')
  expect(select).toHaveValue('option-1')

  await userEvent.selectOptions(select, [
    page.getByRole('option', { name: 'Option 1' }),
    page.getByRole('option', { name: 'Option 2' }),
  ])
  expect(select).toHaveValue(['option-1', 'option-2'])
})
```

::: warning
`webdriverio` provider 不支持选择多个元素，因为它不提供选择多个元素的 API。
:::

相关链接：

- [Playwright `locator.selectOption` API](https://playwright.dev/docs/api/class-locator#locator-select-option)
- [WebdriverIO `element.selectByIndex` API](https://webdriver.io/docs/api/element/selectByIndex)
- [testing-library `selectOptions` API](https://testing-library.com/docs/user-event/utility/#-selectoptions-deselectoptions)

## userEvent.hover

```ts
function hover(
  element: Element | Locator,
  options?: UserEventHoverOptions,
): Promise<void>
```

该方法将光标位置移动到所选元素上。有关此方法如何工作的详细说明，请参阅 provider 的文档。

::: warning
如果使用的是 `webdriverio` provider，光标默认会移动到元素的中心。

如果使用的是 `playwright` provider，光标会移动到元素的某个可见点。
:::

```ts
import { page, userEvent } from 'vitest/browser'

test('hovers logo element', async () => {
  const logo = page.getByRole('img', { name: /logo/ })

  await userEvent.hover(logo)
  // 或者你可以直接从定位器上访问
  await logo.hover()
})
```

相关链接：

- [Playwright `locator.hover` API](https://playwright.dev/docs/api/class-locator#locator-hover)
- [WebdriverIO `element.moveTo` API](https://webdriver.io/docs/api/element/moveTo/)
- [testing-library `hover` API](https://testing-library.com/docs/user-event/convenience/#hover)

## userEvent.unhover

```ts
function unhover(
  element: Element | Locator,
  options?: UserEventHoverOptions,
): Promise<void>
```

其作用与 [`userEvent.hover`](#userevent-hover) 相同，但会将光标移至 `document.body` 元素。

::: warning
默认情况下，光标位置位于 body 元素的 "某个" 可见位置（在 `playwright` provider中）或中心位置（在 `webdriverio` provider中），因此如果当前悬停的元素已经位于相同位置，本方法将不起作用。
:::

```ts
import { page, userEvent } from 'vitest/browser'

test('unhover logo element', async () => {
  const logo = page.getByRole('img', { name: /logo/ })

  await userEvent.unhover(logo)
  // 或者你可以直接从定位器上访问
  await logo.unhover()
})
```

相关链接：

- [Playwright `locator.hover` API](https://playwright.dev/docs/api/class-locator#locator-hover)
- [WebdriverIO `element.moveTo` API](https://webdriver.io/docs/api/element/moveTo/)
- [testing-library `hover` API](https://testing-library.com/docs/user-event/convenience/#hover)

## userEvent.upload

```ts
function upload(
  element: Element | Locator,
  files: string[] | string | File[] | File,
  options?: UserEventUploadOptions,
): Promise<void>
```

更改文件输入元素，使其包含指定文件。

```ts
import { page, userEvent } from 'vitest/browser'

test('can upload a file', async () => {
  const input = page.getByRole('button', { name: /Upload files/ })

  const file = new File(['file'], 'file.png', { type: 'image/png' })

  await userEvent.upload(input, file)
  // 或者你可以直接从定位器上访问
  await input.upload(file)

  // 也可以使用相对于项目根目录的文件路径
  await userEvent.upload(input, './fixtures/file.png')
})
```

::: warning
`webdriverio` provider 仅在 `chrome` 和 `edge` 浏览器中支持该命令。目前也只支持字符串类型。
:::

相关链接：

- [Playwright `locator.setInputFiles` API](https://playwright.dev/docs/api/class-locator#locator-set-input-files)
- [WebdriverIO `browser.uploadFile` API](https://webdriver.io/docs/api/browser/uploadFile)
- [testing-library `upload` API](https://testing-library.com/docs/user-event/utility/#upload)

## userEvent.dragAndDrop

```ts
function dragAndDrop(
  source: Element | Locator,
  target: Element | Locator,
  options?: UserEventDragAndDropOptions,
): Promise<void>
```

将源元素拖到目标元素的顶部。不要忘记，源元素的`draggable`属性必须设置为 `true`。

```ts
import { page, userEvent } from 'vitest/browser'

test('drag and drop works', async () => {
  const source = page.getByRole('img', { name: /logo/ })
  const target = page.getByTestId('logo-target')

  await userEvent.dragAndDrop(source, target)
  // 或者你可以直接从定位器上访问
  await source.dropTo(target)

  await expect.element(target).toHaveTextContent('Logo is processed')
})
```

::: warning
 `preview` provider不支持此 API。
:::

相关链接：

- [Playwright `frame.dragAndDrop` API](https://playwright.dev/docs/api/class-frame#frame-drag-and-drop)
- [WebdriverIO `element.dragAndDrop` API](https://webdriver.io/docs/api/element/dragAndDrop/)

## userEvent.copy

```ts
function copy(): Promise<void>
```

将选中的文本复制到剪贴板。

```js
import { page, userEvent } from 'vitest/browser'

test('copy and paste', async () => {
  // 写入 'source'
  await userEvent.click(page.getByPlaceholder('source'))
  await userEvent.keyboard('hello')

  // 选择并复制 'source'
  await userEvent.dblClick(page.getByPlaceholder('source'))
  await userEvent.copy()

  // 粘贴到 'target'
  await userEvent.click(page.getByPlaceholder('target'))
  await userEvent.paste()

  await expect.element(page.getByPlaceholder('source')).toHaveTextContent('hello')
  await expect.element(page.getByPlaceholder('target')).toHaveTextContent('hello')
})
```

相关链接：

- [testing-library `copy` API](https://testing-library.com/docs/user-event/convenience/#copy)

## userEvent.cut

```ts
function cut(): Promise<void>
```

将选中的文本剪切到剪贴板。

```js
import { page, userEvent } from 'vitest/browser'

test('copy and paste', async () => {
  // 写入 'source'
  await userEvent.click(page.getByPlaceholder('source'))
  await userEvent.keyboard('hello')

  // 选择并剪切 'source'
  await userEvent.dblClick(page.getByPlaceholder('source'))
  await userEvent.cut()

  // 粘贴到 'target'
  await userEvent.click(page.getByPlaceholder('target'))
  await userEvent.paste()

  await expect.element(page.getByPlaceholder('source')).toHaveTextContent('')
  await expect.element(page.getByPlaceholder('target')).toHaveTextContent('hello')
})
```

相关链接：

- [testing-library `cut` API](https://testing-library.com/docs/user-event/clipboard#cut)

## userEvent.paste

```ts
function paste(): Promise<void>
```

将文本从剪贴板粘贴。请参阅 [`userEvent.copy`](#userevent-copy) 和 [`userEvent.cut`](#userevent-cut) 以获取使用示例。

相关链接：

- [testing-library `paste` API](https://testing-library.com/docs/user-event/clipboard#paste)
