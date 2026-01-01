---
title: Locators | 浏览器模式
outline: [2, 3]
---

# 定位器 {#locators}

定位器是表示一个或多个元素的方式。每个定位器都由一个称为选择器的字符串定义。Vitest 通过提供方便的方法在后台生成这些选择器，从而抽象了选择器。

定位器 API 使用了 [Playwright 的定位器](https://playwright.dev/docs/api/class-locator) 的一个分支，称为 [Ivya](https://npmjs.com/ivya)。然而，Vitest 将此 API 提供给每个 [provider](/config/browser#browser-provider)。

::: tip
本页介绍了 API 的使用。为了更好地了解定位器及其用法，请阅读 [Playwright 的“定位器”文档](https://playwright.dev/docs/locators)。
:::

## getByRole

```ts
function getByRole(
  role: ARIARole | string,
  options?: LocatorByRoleOptions,
): Locator
```

通过元素的 [ARIA 角色](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)、[ARIA 属性](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) 和 [可访问名称](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name) 创建一种定位元素的方式。

::: tip
如果你只查询单个元素（例如使用 `getByText('The name')`），通常更好的做法是使用 `getByRole(expectedRole, { name: 'The name' })`。可访问名称查询并不会替代其他查询，例如 `*ByAltText` 或 `*ByTitle`。虽然可访问名称可以等于这些属性的值，但它并不能替代这些属性的功能。
:::

考虑以下 DOM 结构。

```html
<h3>Sign up</h3>
<label>
  Login
  <input type="text" />
</label>
<label>
  Password
  <input type="password" />
</label>
<br/>
<button>Submit</button>
```

你可以通过每个元素的隐式角色来定位它们：

```ts
await expect.element(
  page.getByRole('heading', { name: 'Sign up' })
).toBeVisible()

await page.getByRole('textbox', { name: 'Login' }).fill('admin')
await page.getByRole('textbox', { name: 'Password' }).fill('admin')

await page.getByRole('button', { name: /submit/i }).click()
```

::: warning
角色通过字符串相等性进行匹配，不会继承自 ARIA 角色层次结构。因此，查询像 `checkbox` 这样的超类角色时，不会包含具有子类角色（如 `switch`）的元素。

默认情况下，许多语义化的 HTML 元素都有一个角色；例如，`<input type="radio">` 具有 "radio" 角色。非语义化的 HTML 元素没有角色；没有添加语义的 `<div>` 和 `<span>` 返回 `null`。`role` 属性可以提供语义。

根据 ARIA 指南，**强烈不建议** 通过 `role` 或 `aria-*` 属性为已经具有隐式角色的内置元素提供角色。
:::

##### Options

- `exact: boolean`

  `name` 是否精确匹配：区分大小写且完全匹配字符串。默认情况下禁用此选项。如果 `name` 是正则表达式，则忽略此选项。请注意，精确匹配仍然会修剪空白字符。

  ```tsx
  <button>Hello World</button>

  page.getByRole('button', { name: 'hello world' }) // ✅
  page.getByRole('button', { name: 'hello world', exact: true }) // ❌
  page.getByRole('button', { name: 'Hello World', exact: true }) // ✅
  ```

- `checked: boolean`

  是否应包含已选中的元素（由 `aria-checked` 或 `<input type="checkbox"/>` 设置）。默认情况下，不会应用此过滤器。

  更多信息请参阅 [`aria-checked`](https://www.w3.org/TR/wai-aria-1.2/#aria-checked)。

  ```tsx
  <>
    <button role="checkbox" aria-checked="true" />
    <input type="checkbox" checked />
  </>

  page.getByRole('checkbox', { checked: true }) // ✅
  page.getByRole('checkbox', { checked: false }) // ❌
  ```

- `disabled: boolean`

  是否应包含已禁用的元素。默认情况下，不会应用此过滤器。请注意，与其他属性不同，`disable` 状态是可继承的。

  更多信息请参阅 [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled)。

  ```tsx
  <input type="text" disabled />

  page.getByRole('textbox', { disabled: true }) // ✅
  page.getByRole('textbox', { disabled: false }) // ❌
  ```

- `expanded: boolean`

  是否应包含展开的元素。默认情况下，不会应用此过滤器。

  更多信息请参阅 [`aria-expanded`](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded)。

  ```tsx
  <a aria-expanded="true" href="example.com">Link</a>

  page.getByRole('link', { expanded: true }) // ✅
  page.getByRole('link', { expanded: false }) // ❌
  ```

- `includeHidden: boolean`

  是否应查询那些通常从可访问性树中排除的元素。默认情况下，只有非隐藏元素会匹配角色选择器。更多信息请参阅 [可访问性树中的排除规则](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion)。

  请注意，角色 `none` 和 `presentation` 始终会被包含。

  ```tsx
  <button style="display: none" />

  page.getByRole('button') // ❌
  page.getByRole('button', { includeHidden: false }) // ❌
  page.getByRole('button', { includeHidden: true }) // ✅
  ```

- `level: number`

  一个数字属性，通常存在于 `heading`、`listitem`、`row`、`treeitem` 角色中，并且对于 `<h1>-<h6>` 元素有默认值。默认情况下，不会应用此过滤器。

  更多信息请参阅 [`aria-level`](https://www.w3.org/TR/wai-aria-1.2/#aria-level)。

  ```tsx
  <>
    <h1>Heading Level One</h1>
    <div role="heading" aria-level="1">Second Heading Level One</div>
  </>

  page.getByRole('heading', { level: 1 }) // ✅
  page.getByRole('heading', { level: 2 }) // ❌
  ```

- `name: string | RegExp`

  [可访问名称](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name)。默认情况下，匹配是不区分大小写的，并且会搜索子字符串。使用 `exact` 选项来控制此行为。

  ```tsx
  <button>Click Me!</button>

  page.getByRole('button', { name: 'Click Me!' }) // ✅
  page.getByRole('button', { name: 'click me!' }) // ✅
  page.getByRole('button', { name: 'Click Me?' }) // ❌
  ```

- `pressed: boolean`

  是否应包含被按下的元素。默认情况下，不会应用此过滤器。

  更多信息请参阅 [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.2/#aria-pressed)。

  ```tsx
  <button aria-pressed="true">👍</button>

  page.getByRole('button', { pressed: true }) // ✅
  page.getByRole('button', { pressed: false }) // ❌
  ```

- `selected: boolean`

  是否应包含被选中的元素。默认情况下，不会应用此过滤器。

  更多信息请参阅 [`aria-selected`](https://www.w3.org/TR/wai-aria-1.2/#aria-selected)。

  ```tsx
  <button role="tab" aria-selected="true">Vue</button>

  page.getByRole('button', { selected: true }) // ✅
  page.getByRole('button', { selected: false }) // ❌
  ```

##### 更多内容请参阅 {#see-also}

- [MDN 上的 ARIA 角色列表](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [w3.org 上的 ARIA 角色列表](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [testing-library's `ByRole`](https://testing-library.com/docs/queries/byrole/)

## getByAltText

```ts
function getByAltText(
  text: string | RegExp,
  options?: LocatorOptions,
): Locator
```

创建一个能够找到具有匹配 `alt` 属性的元素的定位器。与 testing-library 的实现不同，Vitest 会匹配任何具有匹配 `alt` 属性的元素。

```tsx
<img alt="Incredibles 2 Poster" src="/incredibles-2.png" />

page.getByAltText(/incredibles.*? poster/i) // ✅
page.getByAltText('non existing alt text') // ❌
```

#### Options

- `exact: boolean`

  `text` 是否精确匹配：区分大小写且完全匹配字符串。默认情况下禁用此选项。如果 `text` 是正则表达式，则忽略此选项。请注意，精确匹配仍然会修剪空白字符。

#### 更多内容请参阅 {#see-also-1}

- [testing-library's `ByAltText`](https://testing-library.com/docs/queries/byalttext/)

## getByLabelText

```ts
function getByLabelText(
  text: string | RegExp,
  options?: LocatorOptions,
): Locator
```

创建一个能够找到具有关联标签的元素的定位器。

下方示例中，`page.getByLabelText('Username')` 会一次性选中所有相关输入框。

```html
// for/htmlFor relationship between label and form element id
<label for="username-input">Username</label>
<input id="username-input" />

// The aria-labelledby attribute with form elements
<label id="username-label">Username</label>
<input aria-labelledby="username-label" />

// 包裹式标签
<label>Username <input /></label>

// 标签文本在另一个子元素中的包裹式标签
<label>
  <span>Username</span>
  <input />
</label>

// aria-label 属性
// 请注意，这不是用户在页面上能看到的标签，
// 因此输入框的用途必须对视觉用户来说是显而易见的。
<input aria-label="Username" />
```

#### Options

- `exact: boolean`

  `text` 是否精确匹配：区分大小写且完全匹配字符串。默认情况下禁用此选项。如果 `text` 是正则表达式，则忽略此选项。请注意，精确匹配仍然会修剪空白字符。

#### 更多内容请参阅 {#see-also-2}

- [testing-library's `ByLabelText`](https://testing-library.com/docs/queries/bylabeltext/)

## getByPlaceholder

```ts
function getByPlaceholder(
  text: string | RegExp,
  options?: LocatorOptions,
): Locator
```

创建一个能够找到具有指定 `placeholder` 属性的元素的定位器。Vitest 会匹配任何具有匹配 `placeholder` 属性的元素，而不仅仅是 `input` 元素。

```tsx
<input placeholder="Username" />

page.getByPlaceholder('Username') // ✅
page.getByPlaceholder('not found') // ❌
```

::: warning
通常情况下，使用 [`getByLabelText`](#getbylabeltext) 依赖标签比依赖占位符更好。
:::

#### Options

- `exact: boolean`

  `text` 是否精确匹配：区分大小写且完全匹配字符串。默认情况下禁用此选项。如果 `text` 是正则表达式，则忽略此选项。请注意，精确匹配仍然会修剪空白字符。

#### 更多内容请参阅 {#see-also-3}

- [testing-library's `ByPlaceholderText`](https://testing-library.com/docs/queries/byplaceholdertext/)

## getByText

```ts
function getByText(
  text: string | RegExp,
  options?: LocatorOptions,
): Locator
```

创建一个能够找到包含指定文本的元素的定位器。文本将与 TextNode 的 [`nodeValue`](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue) 或类型为 `button` 或 `reset` 的输入值进行匹配。通过文本匹配时总是会规范化空白字符，即使在精确匹配的情况下也是如此。例如，它会将多个空格转换为一个空格，将换行符转换为空格，并忽略前导和尾随的空白字符。

```tsx
<a href="/about">About ℹ️</a>

page.getByText(/about/i) // ✅
page.getByText('about', { exact: true }) // ❌
```

::: tip
此定位器适用于定位非交互式元素。如果你需要定位交互式元素，比如按钮或输入框，建议使用 [`getByRole`](#getbyrole)。
:::

#### Options

- `exact: boolean`

  `text` 是否精确匹配：区分大小写且完全匹配字符串。默认情况下禁用此选项。如果 `text` 是正则表达式，则忽略此选项。请注意，精确匹配仍然会修剪空白字符。

#### 更多内容请参阅 {#see-also-4}

- [testing-library's `ByText`](https://testing-library.com/docs/queries/bytext/)

## getByTitle

```ts
function getByTitle(
  text: string | RegExp,
  options?: LocatorOptions,
): Locator
```

创建一个能够找到具有指定 `title` 属性的元素的定位器。与 testing-library 的 `getByTitle` 不同，Vitest 无法在 SVG 中找到 `title` 元素。

```tsx
<span title="Delete" id="2"></span>

page.getByTitle('Delete') // ✅
page.getByTitle('Create') // ❌
```

#### Options

- `exact: boolean`

  `text` 是否精确匹配：区分大小写且完全匹配字符串。默认情况下禁用此选项。如果 `text` 是正则表达式，则忽略此选项。请注意，精确匹配仍然会修剪空白字符。

#### 更多内容请参阅 {#see-also-5}

- [testing-library's `ByTitle`](https://testing-library.com/docs/queries/bytitle/)

## getByTestId

```ts
function getByTestId(text: string | RegExp): Locator
```

创建一个能够找到与指定测试 ID 属性匹配的元素的定位器。你可以通过 [`browser.locators.testIdAttribute`](/config/browser/locators#testidattribute) 配置属性名称。

```tsx
<div data-testid="custom-element" />

page.getByTestId('custom-element') // ✅
page.getByTestId('non-existing-element') // ❌
```

::: warning
建议仅在其他定位器不适用于你的使用场景时才使用此方法。使用 `data-testid` 属性并不符合用户实际使用软件的方式，因此如果可能应避免使用。
:::

#### Options

- `exact: boolean`

  `text` 是否精确匹配：区分大小写和整个字符串。默认情况下禁用此选项。如果 `text` 是正则表达式，则忽略此选项。请注意，精确匹配仍然会修剪空格。

#### 更多内容请参阅 {#see-also-6}

- [testing-library's `ByTestId`](https://testing-library.com/docs/queries/bytestid/)

## nth

```ts
function nth(index: number): Locator
```

此方法返回一个新的定位器，仅匹配多元素查询结果中的特定索引。与 `elements()[n]` 不同，`nth` 定位器会重试，直到元素出现为止。

```html
<div aria-label="one"><input/><input/><input/></div>
<div aria-label="two"><input/></div>
```

```tsx
page.getByRole('textbox').nth(0) // ✅
page.getByRole('textbox').nth(4) // ❌
```

::: tip
在使用 `nth` 之前，你可能会发现使用链式定位器来缩小搜索范围会更有帮助。
有时没有比通过元素位置更好的区分方式；虽然这可能导致测试不稳定，但总比没有强。
:::

```tsx
page.getByLabel('two').getByRole('input') // ✅ better alternative to page.getByRole('textbox').nth(3)
page.getByLabel('one').getByRole('input') // ❌ too ambiguous
page.getByLabel('one').getByRole('input').nth(1) // ✅ pragmatic compromise
```

## first

```ts
function first(): Locator
```

此方法返回一个新的定位器，仅匹配多元素查询结果中的第一个索引。
它是 `nth(0)` 的语法糖。

```html
<input/> <input/> <input/>
```

```tsx
page.getByRole('textbox').first() // ✅
```

## last

```ts
function last(): Locator
```

此方法返回一个新的定位器，仅匹配多元素查询结果中的最后一个索引。
它是 `nth(-1)` 的语法糖。

```html
<input/> <input/> <input/>
```

```tsx
page.getByRole('textbox').last() // ✅
```

## and

```ts
function and(locator: Locator): Locator
```

此方法创建一个新定位器，需同时匹配父级和传入的定位器。以下示例用于查找具有特定标题的按钮：

```ts
page.getByRole('button').and(page.getByTitle('Subscribe'))
```

## or

```ts
function or(locator: Locator): Locator
```

此方法创建一个新定位器，只需匹配其中一个或同时匹配两个定位器。

::: warning
注意：若定位器匹配到多个元素，调用预期单个元素的方法可能会报错：

```tsx
<>
  <button>Click me</button>
  <a href="https://vitest.dev">Error happened!</a>
</>

page.getByRole('button')
  .or(page.getByRole('link'))
  .click() // ❌ 匹配到多个元素
```
:::

## filter

```ts
function filter(options: LocatorOptions): Locator
```

此方法会根据选项（例如按文本过滤）缩小定位器范围。可通过链式调用应用多个过滤器。

### has

- **类型：** `Locator`

此选项会限定选择器范围，仅匹配包含符合指定定位器元素的节点。例如对于以下 HTML 结构：

```html{1,3}
<article>
  <div>Vitest</div>
</article>
<article>
  <div>Rolldown</div>
</article>
```

我们可以限定定位器范围，仅查找内含 `Vitest` 文本的 `article` 元素：

```ts
page.getByRole('article').filter({ has: page.getByText('Vitest') }) // ✅
```

::: warning

传入的定位器（示例中的 `page.getByText('Vitest')`）必须相对于父级定位器（示例中的 `page.getByRole('article')`）。查询会从父级定位器开始，而非文档根节点。

这意味着不能传入在父级定位器范围之外查询元素的定位器：

```ts
page.getByText('Vitest').filter({ has: page.getByRole('article') }) // ❌
```

此示例会失败，因为 `article` 元素位于包含 `Vitest` 文本的元素之外。

:::

::: tip
此方法支持链式调用以进一步缩小元素定位范围：

```ts
page.getByRole('article')
  .filter({ has: page.getByRole('button', { name: 'delete row' }) })
  .filter({ has: page.getByText('Vitest') })
```
:::

### hasNot

- **类型：** `Locator`

此选项会限定选择器范围，仅匹配不包含指定定位器元素的节点。例如对于以下 HTML 结构：

```html{1,3}
<article>
  <div>Vitest</div>
</article>
<article>
  <div>Rolldown</div>
</article>
```

我们可以限定定位器范围，仅查找内部不含 `Rolldown` 文本的 `article` 元素：

```ts
page.getByRole('article')
  .filter({ hasNot: page.getByText('Rolldown') }) // ✅
page.getByRole('article')
  .filter({ hasNot: page.getByText('Vitest') }) // ❌
```

::: warning
注意：与 [`has`](#has) 选项相同，传入的定位器是针对父级元素而非文档根节点进行查询。
:::

### hasText

- **类型：** `string | RegExp`

此选项会限定选择器范围，仅匹配内部某处包含指定文本的元素。当传入 `string` 时，匹配不区分大小写且执行子字符串搜索。

```html{1,3}
<article>
  <div>Vitest</div>
</article>
<article>
  <div>Rolldown</div>
</article>
```

由于搜索不区分大小写，以下两个定位器将匹配到同一个元素：

```ts
page.getByRole('article').filter({ hasText: 'Vitest' }) // ✅
page.getByRole('article').filter({ hasText: 'Vite' }) // ✅
```

### hasNotText

- **类型：** `string | RegExp`

此选项会限定选择器范围，仅匹配内部不包含指定文本的元素。当传入 `string` 时，匹配不区分大小写且执行子字符串搜索。

## Methods

所有方法都是异步的，必须使用 `await`。自 Vitest 3 起，如果方法没有被 `await`，测试将会失败。

### click

```ts
function click(options?: UserEventClickOptions): Promise<void>
```

点击一个元素。你可以使用选项来设置光标位置。

```ts
import { page } from 'vitest/browser'

await page.getByRole('img', { name: 'Rose' }).click()
```

- [更多内容请参阅 `userEvent.click`](/api/browser/interactivity#userevent-click)

### dblClick

```ts
function dblClick(options?: UserEventDoubleClickOptions): Promise<void>
```

在元素上触发双击事件。你可以使用选项来设置光标位置。

```ts
import { page } from 'vitest/browser'

await page.getByRole('img', { name: 'Rose' }).dblClick()
```

- [更多内容请参阅 `userEvent.dblClick`](/api/browser/interactivity#userevent-dblclick)

### tripleClick

```ts
function tripleClick(options?: UserEventTripleClickOptions): Promise<void>
```

在元素上触发三连击事件。由于浏览器 API 中没有 `tripleclick`，此方法会连续触发三次点击事件。

```ts
import { page } from 'vitest/browser'

await page.getByRole('img', { name: 'Rose' }).tripleClick()
```

- [更多内容请参阅 `userEvent.tripleClick`](/api/browser/interactivity#userevent-tripleclick)

### clear

```ts
function clear(options?: UserEventClearOptions): Promise<void>
```

清除输入元素的内容。

```ts
import { page } from 'vitest/browser'

await page.getByRole('textbox', { name: 'Full Name' }).clear()
```

- [更多内容请参阅 `userEvent.clear`](/api/browser/interactivity#userevent-clear)

### hover

```ts
function hover(options?: UserEventHoverOptions): Promise<void>
```

将光标位置移动到选中的元素。

```ts
import { page } from 'vitest/browser'

await page.getByRole('img', { name: 'Rose' }).hover()
```

- [更多内容请参阅 `userEvent.hover`](/api/browser/interactivity#userevent-hover)

### unhover

```ts
function unhover(options?: UserEventHoverOptions): Promise<void>
```

这与 [`locator.hover`](#hover) 的工作方式相同，但将光标移动到 `document.body` 元素。

```ts
import { page } from 'vitest/browser'

await page.getByRole('img', { name: 'Rose' }).unhover()
```

- [更多内容请参阅 `userEvent.unhover`](/api/browser/interactivity#userevent-unhover)

### fill

```ts
function fill(text: string, options?: UserEventFillOptions): Promise<void>
```

为当前的 `input` 、`textarea` 或 `contenteditable` 元素赋值。

```ts
import { page } from 'vitest/browser'

await page.getByRole('input', { name: 'Full Name' }).fill('Mr. Bean')
```

- [更多内容请参阅 `userEvent.fill`](/api/browser/interactivity#userevent-fill)

### dropTo

```ts
function dropTo(
  target: Locator,
  options?: UserEventDragAndDropOptions,
): Promise<void>
```

将当前元素拖动到目标位置。

```ts
import { page } from 'vitest/browser'

const paris = page.getByText('Paris')
const france = page.getByText('France')

await paris.dropTo(france)
```

- [更多内容请参阅 `userEvent.dragAndDrop`](/api/browser/interactivity#userevent-draganddrop)

### selectOptions

```ts
function selectOptions(
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

从 `<select>` 元素中选择一个或多个值。

```ts
import { page } from 'vitest/browser'

const languages = page.getByRole('select', { name: 'Languages' })

await languages.selectOptions('EN')
await languages.selectOptions(['ES', 'FR'])
await languages.selectOptions([
  languages.getByRole('option', { name: 'Spanish' }),
  languages.getByRole('option', { name: 'French' }),
])
```

- [更多内容请参阅 `userEvent.selectOptions`](/api/browser/interactivity#userevent-selectoptions)

### screenshot

```ts
function screenshot(options: LocatorScreenshotOptions & { save: false }): Promise<string>
function screenshot(options: LocatorScreenshotOptions & { base64: true }): Promise<{
  path: string
  base64: string
}>
function screenshot(options?: LocatorScreenshotOptions & { base64?: false }): Promise<string>
```

创建与定位器选择器匹配的元素的屏幕截图。

你可以使用 `path` 选项指定屏幕截图的保存位置，该选项相对于当前测试文件。如果未设置 `path` 选项，Vitest 将默认使用 [`browser.screenshotDirectory`](/config/browser/screenshotdirectory)（默认为 `__screenshot__`），并结合文件名和测试名来确定屏幕截图的文件路径。

如果你还需要屏幕截图的内容，可以指定 `base64: true` 以返回屏幕截图的 base64 编码内容以及保存路径。

```ts
import { page } from 'vitest/browser'

const button = page.getByRole('button', { name: 'Click Me!' })

const path = await button.screenshot()

const { path, base64 } = await button.screenshot({
  path: './button-click-me.png',
  base64: true, // 同时返回 base64 字符串
})
// path - 屏幕截图的完整路径
// base64 - 屏幕截图的 base64 编码字符串
```

::: warning WARNING <Version>3.2.0</Version>
注意，当 `save` 设置为 `false` 时，`screenshot` 将始终返回 base64 字符串。在此情况下，路径参数也会被忽略。
:::

### query

```ts
function query(): Element | null
```

此方法返回与定位器选择器匹配的单个元素，如果没有找到元素则返回 `null`。

如果多个元素匹配该选择器，此方法将抛出错误。如果你需要所有匹配的 DOM 元素，可以使用 [`.elements()`](#elements)；如果你需要匹配选择器的定位器数组，可以使用 [`.all()`](#all)。

考虑以下 DOM 结构：

```html
<div>Hello <span>World</span></div>
<div>Hello</div>
```

这些定位器将不会抛出错误：

```ts
page.getByText('Hello World').query() // ✅ HTMLDivElement
page.getByText('Hello Germany').query() // ✅ null
page.getByText('World').query() // ✅ HTMLSpanElement
page.getByText('Hello', { exact: true }).query() // ✅ HTMLSpanElement
```

这些定位器将抛出错误：

```ts
// 返回多个元素
page.getByText('Hello').query() // ❌
page.getByText(/^Hello/).query() // ❌
```

### element

```ts
function element(): Element
```

此方法返回与定位器选择器匹配的单个元素。

如果 _没有元素_ 匹配该选择器，则会抛出错误。如果你只需要检查元素是否存在，可以考虑使用 [`.query()`](#query)。

如果 _多个元素_ 匹配该选择器，则会抛出错误。如果你需要所有匹配的 DOM 元素，可以使用 [`.elements()`](#elements)；如果你需要匹配选择器的定位器数组，可以使用 [`.all()`](#all)。

::: tip
此方法在需要将其传递给外部库时非常有用。当定位器与 `expect.element` 一起使用时，每次断言 [重试](/api/browser/assertions) 时都会自动调用此方法：

```ts
await expect.element(page.getByRole('button')).toBeDisabled()
```
:::

考虑以下 DOM 结构：

```html
<div>Hello <span>World</span></div>
<div>Hello Germany</div>
<div>Hello</div>
```

这些定位器将不会抛出错误：

```ts
page.getByText('Hello World').element() // ✅
page.getByText('Hello Germany').element() // ✅
page.getByText('World').element() // ✅
page.getByText('Hello', { exact: true }).element() // ✅
```

这些定位器将抛出错误：

```ts
// 返回多个元素
page.getByText('Hello').element() // ❌
page.getByText(/^Hello/).element() // ❌

// 不返回任意元素
page.getByText('Hello USA').element() // ❌
```

### elements

```ts
function elements(): Element[]
```

此方法返回与定位器选择器匹配的元素数组。

此函数不会抛出错误。如果没有元素匹配该选择器，此方法将返回一个空数组。

考虑以下 DOM 结构：

```html
<div>Hello <span>World</span></div>
<div>Hello</div>
```

这些定位器将始终成功：

```ts
page.getByText('Hello World').elements() // ✅ [HTMLElement]
page.getByText('World').elements() // ✅ [HTMLElement]
page.getByText('Hello', { exact: true }).elements() // ✅ [HTMLElement]
page.getByText('Hello').elements() // ✅ [HTMLElement, HTMLElement]
page.getByText('Hello USA').elements() // ✅ []
```

### all

```ts
function all(): Locator[]
```

此方法返回一个与选择器匹配的新定位器数组。

在内部，此方法调用 `.elements` 并使用 [`page.elementLocator`](/api/browser/context#page) 包装每个元素。

- [更多内容请参阅  `locator.elements()`](#elements)

## Properties

### selector

`selector` 是一个字符串，将由浏览器提供程序用于定位元素。Playwright 将使用 `playwright` 定位器语法，而 `preview` 和 `webdriverio` 将使用 CSS。

::: danger
你不应在测试代码中使用此字符串。`selector` 字符串仅应在使用 Commands API 时使用：

```ts [commands.ts]
import type { BrowserCommand } from 'vitest/node'

const test: BrowserCommand<string> = function test(context, selector) {
  // playwright
  await context.iframe.locator(selector).click()
  // webdriverio
  await context.browser.$(selector).click()
}
```

```ts [example.test.ts]
import { test } from 'vitest'
import { commands, page } from 'vitest/browser'

test('works correctly', async () => {
  await commands.test(page.getByText('Hello').selector) // ✅
  // vitest will automatically unwrap it to a string
  await commands.test(page.getByText('Hello')) // ✅
})
```
:::

### length

此属性返回当前定位器匹配的元素数量，等效于调用 `locator.elements().length`。

参考以下 DOM 结构：

```html
<button>Click Me!</button>
<button>Don't click me!</button>
```

该属性始终会执行成功：

```ts
page.getByRole('button').length // ✅ 2
page.getByRole('button', { title: 'Click Me!' }).length // ✅ 1
page.getByRole('alert').length // ✅ 0
```

## 自定义定位器 <Version>3.2.0</Version> <Badge type="danger">advanced</Badge> {#custom-locators}

您可以通过定义定位器工厂对象来扩展内置定位器 API。这些方法将作为 `page` 对象和所有已创建定位器的方法存在。

当内置定位器无法满足需求时（例如使用自定义 UI 框架时），这些定位器会非常有用。

定位器工厂需要返回一个选择器字符串或定位器本身

::: tip

选择器语法与 Playwright 定位器完全一致。建议阅读 [Playwright 指南](https://playwright.dev/docs/other-locators) 以更好地理解其工作原理。
:::

```ts
import { locators } from 'vitest/browser'

locators.extend({
  getByArticleTitle(title) {
    return `[data-title="${title}"]`
  },
  getByArticleCommentsCount(count) {
    return `.comments :text("${count} comments")`
  },
  async previewComments() {
    // 可通过 "this" 访问当前定位器
    // 注意：若方法在 `page` 上调用，`this` 将指向 `page` 而非定位器！
    // not the locator!
    if (this !== page) {
      await this.click()
    }
    // ...
  }
})

// 使用 TypeScript 时可扩展 LocatorSelectors 接口
// 以在 locators.extend、page.* 和 locator.* 方法中获得自动补全
declare module 'vitest/browser' {
  interface LocatorSelectors {
    // 若自定义方法返回字符串，将被转换为定位器
    // 若返回其他类型，则按原样返回
    getByArticleTitle(title: string): Locator
    getByArticleCommentsCount(count: number): Locator

    // Vitest 将返回 Promise 且不会尝试将其转换为定位器
    previewComments(this: Locator): Promise<void>
  }
}
```

如果该方法在全局的 `page` 对象上调用，选择器将作用于整个页面。在下面的例子中，`getByArticleTitle` 会找到所有具有 `data-title` 属性且值为 `title` 的元素。然而，如果该方法在定位器上调用，它将仅作用于该定位器的范围内。

```html
<article data-title="Hello, World!">
  Hello, World!
  <button id="comments">2 comments</button>
</article>

<article data-title="Hello, Vitest!">
  Hello, Vitest!
  <button id="comments">0 comments</button>
</article>
```

```ts
const articles = page.getByRole('article')
const worldArticle = page.getByArticleTitle('Hello, World!') // ✅
const commentsElement = worldArticle.getByArticleCommentsCount(2) // ✅
const wrongCommentsElement = worldArticle.getByArticleCommentsCount(0) // ❌
const wrongElement = page.getByArticleTitle('No Article!') // ❌

await commentsElement.previewComments() // ✅
await wrongCommentsElement.previewComments() // ❌
```
