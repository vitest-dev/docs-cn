---
title: Assertion API | Browser Mode
---

# Assertion API

Vitest 默认提供了一组丰富的 DOM 断言，这些断言源自 [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom) 库，并增加了对定位器的支持以及内置的重试能力。

::: tip TypeScript Support
如果你正在使用 [TypeScript](/api/browser/#typescript) 或希望在 `expect` 中获得正确的类型提示，请确保在某个地方引用了 `vitest/browser`。如果你从未从该模块导入过，可以在 `tsconfig.json` 覆盖范围内的任何文件中添加一个 `reference` 注释：

```ts
/// <reference types="vitest/browser" />
```
:::

浏览器中的测试由于其异步特性，可能会不一致地失败。因此，即使条件延迟（如超时、网络请求或动画），也必须有办法保证断言成功。为此，Vitest 通过 [`expect.poll`](/api/expect#poll)和 `expect.element` API 提供了可重试的断言：

```ts
import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

test('error banner is rendered', async () => {
  triggerError()

  // 这会创建一个定位器，它将尝试查找元素
  // 当调用它的任何方法时。
  // 单独这行代码不会检查元素是否存在。
  const banner = page.getByRole('alert', {
    name: /error/i,
  })

  // Vitest 提供了带有内置重试能力的 `expect.element`。
  // 它会反复检查该元素是否存在于 DOM 中，并且
  // `element.textContent` 的内容等于 "Error!"
  // 直到所有条件都满足为止
  await expect.element(banner).toHaveTextContent('Error!')
})
```

我们建议在使用 `page.getBy*` 定位器时，始终使用 `expect.element`，以减少测试的不稳定性。注意，`expect.element` 接受第二个选项：

```ts
interface ExpectPollOptions {
  // 以毫秒为单位的断言重试间隔
  // 默认为 `"expect.poll.interval"` 配置选项
  interval?: number
  // 以毫秒为单位的断言重试时间
  // 默认为 `"expect.poll.timeout"` 配置选项
  timeout?: number
  // 断言失败时打印的消息
  message?: string
}
```

::: tip
`expect.element` 是 `expect.poll(() => element)`的简写，工作方式完全相同。

`toHaveTextContent` 以及其他所有断言在常规的 `expect` 中仍然可用，但没有内置的重试机制：

```ts
// 如果 .textContent 不是 `'Error!'`，则会立即失败。
expect(banner).toHaveTextContent('Error!')
```
:::

## toBeDisabled

```ts
function toBeDisabled(): Promise<void>
```

允许你检查某个元素从用户的角度来看是否被禁用。

如果该元素是一个表单控件，并且此元素上指定了 `disabled` 属性，或者该元素是带有 `disabled` 属性的表单元素的后代，则匹配。

请注意，只有原生控件元素（如 HTML 中的 `button`、`input`、`select`、`textarea`、`option`、`optgroup`）可以通过设置 "disabled" 属性来禁用。其他元素上的 "disabled" 属性会被忽略，除非它是自定义元素。

```html
<button
  data-testid="button"
  type="submit"
  disabled
>
  submit
</button>
```

```ts
await expect.element(getByTestId('button')).toBeDisabled() // ✅
await expect.element(getByTestId('button')).not.toBeDisabled() // ❌
```

## toBeEnabled

```ts
function toBeEnabled(): Promise<void>
```

允许你检查某个元素从用户的角度来看是否未被禁用。

其工作方式类似于 [`not.toBeDisabled()`](#tobedisabled)。使用此匹配器可以避免测试中的双重否定。

```html
<button
  data-testid="button"
  type="submit"
  disabled
>
  submit
</button>
```

```ts
await expect.element(getByTestId('button')).toBeEnabled() // ✅
await expect.element(getByTestId('button')).not.toBeEnabled() // ❌
```

## toBeEmptyDOMElement

```ts
function toBeEmptyDOMElement(): Promise<void>
```

这允许你断言某个元素对用户而言是否没有可见内容。它会忽略注释，但如果元素包含空白字符，则会断言失败。

```html
<span data-testid="not-empty"><span data-testid="empty"></span></span>
<span data-testid="with-whitespace"> </span>
<span data-testid="with-comment"><!-- comment --></span>
```

```ts
await expect.element(getByTestId('empty')).toBeEmptyDOMElement()
await expect.element(getByTestId('not-empty')).not.toBeEmptyDOMElement()
await expect.element(
  getByTestId('with-whitespace')
).not.toBeEmptyDOMElement()
```

## toBeInTheDocument

```ts
function toBeInTheDocument(): Promise<void>
```

断言某个元素是否存在于文档中。

```html
<svg data-testid="svg-element"></svg>
```

```ts
await expect.element(getByTestId('svg-element')).toBeInTheDocument()
await expect.element(getByTestId('does-not-exist')).not.toBeInTheDocument()
```

::: warning
这个匹配器不会查找已分离的元素。元素必须被添加到文档中才能被 `toBeInTheDocument` 找到。如果你希望在已分离的元素中进行搜索，请使用：[`toContainElement`](#tocontainelement)。
:::

## toBeInvalid

```ts
function toBeInvalid(): Promise<void>
```

这允许你检查某个元素是否当前无效。

一个元素如果具有一个没有值或值为 `"true"` 的 [`aria-invalid` 属性](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid)，或者 [`checkValidity()`](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation) 方法的结果为 `false`，则该元素被认为是无效的。

```html
<input data-testid="no-aria-invalid" />
<input data-testid="aria-invalid" aria-invalid />
<input data-testid="aria-invalid-value" aria-invalid="true" />
<input data-testid="aria-invalid-false" aria-invalid="false" />

<form data-testid="valid-form">
  <input />
</form>

<form data-testid="invalid-form">
  <input required />
</form>
```

```ts
await expect.element(getByTestId('no-aria-invalid')).not.toBeInvalid()
await expect.element(getByTestId('aria-invalid')).toBeInvalid()
await expect.element(getByTestId('aria-invalid-value')).toBeInvalid()
await expect.element(getByTestId('aria-invalid-false')).not.toBeInvalid()

await expect.element(getByTestId('valid-form')).not.toBeInvalid()
await expect.element(getByTestId('invalid-form')).toBeInvalid()
```

## toBeRequired

```ts
function toBeRequired(): Promise<void>
```

这允许你检查某个表单元素是否当前为必填项。

如果一个元素具有 `required` 或 `aria-required="true"` 属性，则该元素为必填项。

```html
<input data-testid="required-input" required />
<input data-testid="aria-required-input" aria-required="true" />
<input data-testid="conflicted-input" required aria-required="false" />
<input data-testid="aria-not-required-input" aria-required="false" />
<input data-testid="optional-input" />
<input data-testid="unsupported-type" type="image" required />
<select data-testid="select" required></select>
<textarea data-testid="textarea" required></textarea>
<div data-testid="supported-role" role="tree" required></div>
<div data-testid="supported-role-aria" role="tree" aria-required="true"></div>
```

```ts
await expect.element(getByTestId('required-input')).toBeRequired()
await expect.element(getByTestId('aria-required-input')).toBeRequired()
await expect.element(getByTestId('conflicted-input')).toBeRequired()
await expect.element(getByTestId('aria-not-required-input')).not.toBeRequired()
await expect.element(getByTestId('optional-input')).not.toBeRequired()
await expect.element(getByTestId('unsupported-type')).not.toBeRequired()
await expect.element(getByTestId('select')).toBeRequired()
await expect.element(getByTestId('textarea')).toBeRequired()
await expect.element(getByTestId('supported-role')).not.toBeRequired()
await expect.element(getByTestId('supported-role-aria')).toBeRequired()
```

## toBeValid

```ts
function toBeValid(): Promise<void>
```

这允许你检查某个元素的值是否当前有效。

如果一个元素没有 [`aria-invalid` 属性](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid)，或者该属性的值为 "false"，则该元素被视为有效。如果这是一个表单元素，则 [`checkValidity()`](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation) 的结果也必须为 `true`。

```html
<input data-testid="no-aria-invalid" />
<input data-testid="aria-invalid" aria-invalid />
<input data-testid="aria-invalid-value" aria-invalid="true" />
<input data-testid="aria-invalid-false" aria-invalid="false" />

<form data-testid="valid-form">
  <input />
</form>

<form data-testid="invalid-form">
  <input required />
</form>
```

```ts
await expect.element(getByTestId('no-aria-invalid')).toBeValid()
await expect.element(getByTestId('aria-invalid')).not.toBeValid()
await expect.element(getByTestId('aria-invalid-value')).not.toBeValid()
await expect.element(getByTestId('aria-invalid-false')).toBeValid()

await expect.element(getByTestId('valid-form')).toBeValid()
await expect.element(getByTestId('invalid-form')).not.toBeValid()
```

## toBeVisible

```ts
function toBeVisible(): Promise<void>
```

这允许你检查某个元素当前是否对用户可见。

当一个元素具有非空的边界框，并且其计算样式不是 `visibility:hidden` 时，该元素被视为可见。

请注意，根据这一定义：

- 尺寸为零的元素 **不** 被认为是可见的。
- 样式为 `display:none` 的元素 **不** 被认为是可见的。
- 样式为 `opacity:0` 的元素 **是** 被认为是可见的。

若要检查列表中至少有一个元素是可见的，请使用 `locator.first()`。

```ts
// 检测指定元素可见
await expect.element(page.getByText('Welcome')).toBeVisible()

// 检测列表中至少有一项可见
await expect.element(page.getByTestId('todo-item').first()).toBeVisible()

// 检测两个元素中至少有一个可见（可能同时可见）
await expect.element(
  page.getByRole('button', { name: 'Sign in' })
    .or(page.getByRole('button', { name: 'Sign up' }))
    .first()
).toBeVisible()
```

## toBeInViewport <Version>4.0.0</Version> {#tobeinviewport}

```ts
function toBeInViewport(options: { ratio?: number }): Promise<void>
```

允许你通过 [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 检查元素是否在当前视口中。

你可以通过参数 `ratio`，将视口中元素的最小比例设置为 `ratio`。`ratio` 的取值范围为 0~1。

该方法通过 IntersectionObserver API 检测元素是否位于当前视口内。
可通过 ratio 参数指定元素在视口中的最小可见比例（取值范围为 0~1）：
```ts
// 检测指定元素是否在视口中
await expect.element(page.getByText('Welcome')).toBeInViewport()

// 检测指定元素在视窗范围内至少 50% 可见
await expect.element(page.getByText('To')).toBeInViewport({ ratio: 0.5 })

// 检测指定元素在视窗范围内完全可见
await expect.element(page.getByText('Vitest')).toBeInViewport({ ratio: 1 })
```

## toContainElement

```ts
function toContainElement(element: HTMLElement | SVGElement | Locator | null): Promise<void>
```

这允许你断言一个元素是否包含另一个作为其后代的元素。

```html
<span data-testid="ancestor"><span data-testid="descendant"></span></span>
```

```ts
const ancestor = getByTestId('ancestor')
const descendant = getByTestId('descendant')
const nonExistantElement = getByTestId('does-not-exist')

await expect.element(ancestor).toContainElement(descendant)
await expect.element(descendant).not.toContainElement(ancestor)
await expect.element(ancestor).not.toContainElement(nonExistantElement)
```

## toContainHTML

```ts
function toContainHTML(htmlText: string): Promise<void>
```

断言一个表示 HTML 元素的字符串是否包含在另一个元素中。该字符串应包含有效的 HTML，而不是不完整的 HTML。

```html
<span data-testid="parent"><span data-testid="child"></span></span>
```

```ts
// These are valid usages
await expect.element(getByTestId('parent')).toContainHTML('<span data-testid="child"></span>')
await expect.element(getByTestId('parent')).toContainHTML('<span data-testid="child" />')
await expect.element(getByTestId('parent')).not.toContainHTML('<br />')

// These won't work
await expect.element(getByTestId('parent')).toContainHTML('data-testid="child"')
await expect.element(getByTestId('parent')).toContainHTML('data-testid')
await expect.element(getByTestId('parent')).toContainHTML('</span>')
```

::: warning
你可能不需要使用这个匹配器。我们鼓励从用户在浏览器中感知应用程序的角度进行测试。这就是为什么不建议针对特定的 DOM 结构进行测试。

在某些情况下，被测试的代码会渲染从外部来源获取的 HTML，而你希望验证该 HTML 代码是否按预期使用。

不应使用它来检查你控制的 DOM 结构。请改用 [`toContainElement`](#tocontainelement)。
:::

## toHaveAccessibleDescription

```ts
function toHaveAccessibleDescription(description?: string | RegExp): Promise<void>
```

这允许你断言一个元素具有预期的 [可访问描述](https://w3c.github.io/accname/)。

你可以传递预期的可访问描述的确切字符串，或者通过传递正则表达式来进行部分匹配，或者使用 [`expect.stringContaining`](/api/expect#expect-stringcontaining) 或 [`expect.stringMatching`](/api/expect#expect-stringmatching)。

```html
<a
  data-testid="link"
  href="/"
  aria-label="Home page"
  title="A link to start over"
  >Start</a
>
<a data-testid="extra-link" href="/about" aria-label="About page">About</a>
<img src="avatar.jpg" data-testid="avatar" alt="User profile pic" />
<img
  src="logo.jpg"
  data-testid="logo"
  alt="Company logo"
  aria-describedby="t1"
/>
<span id="t1" role="presentation">The logo of Our Company</span>
<img
  src="logo.jpg"
  data-testid="logo2"
  alt="Company logo"
  aria-description="The logo of Our Company"
/>
```

```ts
await expect.element(getByTestId('link')).toHaveAccessibleDescription()
await expect.element(getByTestId('link')).toHaveAccessibleDescription('A link to start over')
await expect.element(getByTestId('link')).not.toHaveAccessibleDescription('Home page')
await expect.element(getByTestId('extra-link')).not.toHaveAccessibleDescription()
await expect.element(getByTestId('avatar')).not.toHaveAccessibleDescription()
await expect.element(getByTestId('logo')).not.toHaveAccessibleDescription('Company logo')
await expect.element(getByTestId('logo')).toHaveAccessibleDescription(
  'The logo of Our Company',
)
await expect.element(getByTestId('logo2')).toHaveAccessibleDescription(
  'The logo of Our Company',
)
```

## toHaveAccessibleErrorMessage

```ts
function toHaveAccessibleErrorMessage(message?: string | RegExp): Promise<void>
```

这允许你断言一个元素具有预期的 [可访问错误消息](https://w3c.github.io/aria/#aria-errormessage)。

你可以传递预期的可访问错误消息的确切字符串。或者，你可以通过传递正则表达式或使用 [`expect.stringContaining`](/api/expect#expect-stringcontaining) 或 [`expect.stringMatching`](/api/expect#expect-stringmatching)来进行部分匹配。

```html
<input
  aria-label="Has Error"
  aria-invalid="true"
  aria-errormessage="error-message"
/>
<div id="error-message" role="alert">This field is invalid</div>

<input aria-label="No Error Attributes" />
<input
  aria-label="Not Invalid"
  aria-invalid="false"
  aria-errormessage="error-message"
/>
```

```ts
// 有效错误信息的输入项
await expect.element(getByRole('textbox', { name: 'Has Error' })).toHaveAccessibleErrorMessage()
await expect.element(getByRole('textbox', { name: 'Has Error' })).toHaveAccessibleErrorMessage(
  'This field is invalid',
)
await expect.element(getByRole('textbox', { name: 'Has Error' })).toHaveAccessibleErrorMessage(
  /invalid/i,
)
await expect.element(
  getByRole('textbox', { name: 'Has Error' }),
).not.toHaveAccessibleErrorMessage('This field is absolutely correct!')

// 没有效错误信息的输入项
await expect.element(
  getByRole('textbox', { name: 'No Error Attributes' }),
).not.toHaveAccessibleErrorMessage()

await expect.element(
  getByRole('textbox', { name: 'Not Invalid' }),
).not.toHaveAccessibleErrorMessage()
```

## toHaveAccessibleName

```ts
function toHaveAccessibleName(name?: string | RegExp): Promise<void>
```

这允许你断言一个元素具有预期的[可访问名称](https://w3c.github.io/accname/)。例如，它有助于断言表单元素和按钮是否被正确标记。

你可以传递预期的可访问名称的确切字符串，或者通过传递正则表达式进行部分匹配，也可以使用 [`expect.stringContaining`](/api/expect#expect-stringcontaining) 或 [`expect.stringMatching`](/api/expect#expect-stringmatching)。

```html
<img data-testid="img-alt" src="" alt="Test alt" />
<img data-testid="img-empty-alt" src="" alt="" />
<svg data-testid="svg-title"><title>Test title</title></svg>
<button data-testid="button-img-alt"><img src="" alt="Test" /></button>
<p><img data-testid="img-paragraph" src="" alt="" /> Test content</p>
<button data-testid="svg-button"><svg><title>Test</title></svg></p>
<div><svg data-testid="svg-without-title"></svg></div>
<input data-testid="input-title" title="test" />
```

```javascript
await expect.element(getByTestId('img-alt')).toHaveAccessibleName('Test alt')
await expect.element(getByTestId('img-empty-alt')).not.toHaveAccessibleName()
await expect.element(getByTestId('svg-title')).toHaveAccessibleName('Test title')
await expect.element(getByTestId('button-img-alt')).toHaveAccessibleName()
await expect.element(getByTestId('img-paragraph')).not.toHaveAccessibleName()
await expect.element(getByTestId('svg-button')).toHaveAccessibleName()
await expect.element(getByTestId('svg-without-title')).not.toHaveAccessibleName()
await expect.element(getByTestId('input-title')).toHaveAccessibleName()
```

## toHaveAttribute

```ts
function toHaveAttribute(attribute: string, value?: unknown): Promise<void>
```

这允许你检查给定的元素是否具有某个属性。你还可以选择性地验证该属性是否具有特定的预期值或使用 [`expect.stringContaining`](/api/expect#expect-stringcontaining) 或 [`expect.stringMatching`](/api/expect#expect-stringmatching)进行部分匹配。

```html
<button data-testid="ok-button" type="submit" disabled>ok</button>
```

```ts
const button = getByTestId('ok-button')

await expect.element(button).toHaveAttribute('disabled')
await expect.element(button).toHaveAttribute('type', 'submit')
await expect.element(button).not.toHaveAttribute('type', 'button')

await expect.element(button).toHaveAttribute(
  'type',
  expect.stringContaining('sub')
)
await expect.element(button).toHaveAttribute(
  'type',
  expect.not.stringContaining('but')
)
```

## toHaveClass

```ts
function toHaveClass(...classNames: string[], options?: { exact: boolean }): Promise<void>
function toHaveClass(...classNames: (string | RegExp)[]): Promise<void>
```

这允许你检查给定元素在其 `class` 属性中是否包含某些类。除非你断言该元素没有任何类，否则必须提供至少一个类。

类名列表可以包括字符串和正则表达式。正则表达式会与目标元素中的每个单独类进行匹配，而不是与其完整的 `class` 属性值整体匹配。

::: warning
请注意，当仅提供正则表达式时，不能使用 `exact: true` 选项。
:::

```html
<button data-testid="delete-button" class="btn extra btn-danger">
  Delete item
</button>
<button data-testid="no-classes">No Classes</button>
```

```ts
const deleteButton = getByTestId('delete-button')
const noClasses = getByTestId('no-classes')

await expect.element(deleteButton).toHaveClass('extra')
await expect.element(deleteButton).toHaveClass('btn-danger btn')
await expect.element(deleteButton).toHaveClass(/danger/, 'btn')
await expect.element(deleteButton).toHaveClass('btn-danger', 'btn')
await expect.element(deleteButton).not.toHaveClass('btn-link')
await expect.element(deleteButton).not.toHaveClass(/link/)

// ⚠️ 正则表达式仅匹配单个类名而非整个 classList
await expect.element(deleteButton).not.toHaveClass(/btn extra/)

// 精确匹配类集合（顺序无关）
await expect.element(deleteButton).toHaveClass('btn-danger extra btn', {
  exact: true
})
// 若存在多余类则断言失败
await expect.element(deleteButton).not.toHaveClass('btn-danger extra', {
  exact: true
})

await expect.element(noClasses).not.toHaveClass()
```

## toHaveFocus

```ts
function toHaveFocus(): Promise<void>
```

这允许你断言某个元素是否具有焦点。

```html
<div><input type="text" data-testid="element-to-focus" /></div>
```

```ts
const input = page.getByTestId('element-to-focus')
input.element().focus()
await expect.element(input).toHaveFocus()
input.element().blur()
await expect.element(input).not.toHaveFocus()
```

## toHaveFormValues

```ts
function toHaveFormValues(expectedValues: Record<string, unknown>): Promise<void>
```

这允许你检查表单或字段集中是否包含每个给定名称的表单控件，并且具有指定的值。

::: tip
需要强调的是，此匹配器只能在 [表单](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement) 或 [字段集](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFieldSetElement) 元素上调用。

这使得它可以利用 `form` 和 `fieldset` 中的 [`.elements`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements) 属性，可靠地获取它们内部的所有表单控件。

这也避免了用户提供包含多个 `form` 的容器的可能性，从而防止不相关的表单控件混杂在一起，甚至可能产生冲突。
:::

此匹配器抽象了根据表单控件类型获取其值的特殊性。例如，`<input>` 元素具有 `value` 属性，但 `<select>` 元素没有。以下是涵盖的所有情况列表：

- `<input type="number">` 元素以 **数字** 而非字符串的形式返回值。
- `<input type="checkbox">` 元素：
  - 如果只有一个具有指定 `name` 属性的复选框，则将其视为 **布尔值**，如果复选框被选中则返回 `true`，否则返回 `false`。
  - 如果有多个具有相同 `name` 属性的复选框，则将它们作为一个整体处理为一个表单控件，并以包含所有选中复选框值的 **数组** 形式返回值。
- `<input type="radio">` 元素按 `name` 属性分组，这样的组被视为一个表单控件。该控件返回一个与组内选中的单选按钮的 `value` 属性对应的 **字符串** 值。
- `<input type="text">` 元素以 **字符串** 形式返回值。这同样适用于具有其他可能 `type` 属性（未在上述规则中明确涵盖）的 `<input>` 元素（例如 `search`、`email`、`date`、`password`、`hidden` 等）。
- 没有 `multiple` 属性的 `<select>` 元素以 **字符串** 形式返回值，对应于选中 `<option>` 的 `value` 属性值；如果没有选中的选项，则返回 `undefined`。
- `<select multiple>` 元素以 **数组** 形式返回值，包含所有 [选中的选项](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/selectedOptions) 的值。
- `<textarea>` 元素以 **字符串** 形式返回值，该值对应于其节点内容。

上述规则使得从使用单个下拉菜单切换到一组单选按钮，或者从多选下拉菜单切换到一组复选框变得简单。此匹配器用于比较的最终表单值集合将保持一致。

```html
<form data-testid="login-form">
  <input type="text" name="username" value="jane.doe" />
  <input type="password" name="password" value="12345678" />
  <input type="checkbox" name="rememberMe" checked />
  <button type="submit">Sign in</button>
</form>
```

```ts
await expect.element(getByTestId('login-form')).toHaveFormValues({
  username: 'jane.doe',
  rememberMe: true,
})
```

## toHaveStyle

```ts
function toHaveStyle(css: string | Partial<CSSStyleDeclaration>): Promise<void>
```

此功能允许你检查某个元素是否应用了特定的 CSS 属性及其特定值。只有当元素应用了 **所有** 预期的属性时，才会匹配，而不仅仅是其中的一部分。

```html
<button
  data-testid="delete-button"
  style="display: none; background-color: red"
>
  Delete item
</button>
```

```ts
const button = getByTestId('delete-button')

await expect.element(button).toHaveStyle('display: none')
await expect.element(button).toHaveStyle({ display: 'none' })
await expect.element(button).toHaveStyle(`
  background-color: red;
  display: none;
`)
await expect.element(button).toHaveStyle({
  backgroundColor: 'red',
  display: 'none',
})
await expect.element(button).not.toHaveStyle(`
  background-color: blue;
  display: none;
`)
await expect.element(button).not.toHaveStyle({
  backgroundColor: 'blue',
  display: 'none',
})
```

这同样适用于通过类名应用到元素上的规则，这些规则在当前文档中激活的样式表里有定义。
通常的 CSS 优先级规则适用。

## toHaveTextContent

```ts
function toHaveTextContent(
  text: string | RegExp,
  options?: { normalizeWhitespace: boolean }
): Promise<void>
```

此功能允许你检查给定节点是否具有文本内容。它支持元素，同时也支持文本节点和片段。

当传递一个 `string` 类型的参数时，它会对节点内容进行部分区分大小写的匹配。

若要进行不区分大小写的匹配，可以使用带有 `/i` 修饰符的 `RegExp`。

如果你想匹配整段内容，可以使用 `RegExp` 来实现。

```html
<span data-testid="text-content">Text Content</span>
```

```ts
const element = getByTestId('text-content')

await expect.element(element).toHaveTextContent('Content')
// 匹配整段内容
await expect.element(element).toHaveTextContent(/^Text Content$/)
// 不区分大小写匹配
await expect.element(element).toHaveTextContent(/content$/i)
await expect.element(element).not.toHaveTextContent('content')
```

## toHaveValue

```ts
function toHaveValue(value: string | string[] | number | null): Promise<void>
```

这允许你检查给定的表单元素是否具有指定的值。
它接受 `<input>`、`<select>` 和 `<textarea>` 元素，但不包括 `<input type="checkbox">` 和 `<input type="radio">`，因为这些类型的元素只能通过 [`toBeChecked`](#tobechecked) 或 [`toHaveFormValues`](#tohaveformvalues) 进行有意义的匹配。

它还接受具有 `meter`、`progressbar`、`slider` 或 `spinbutton` 角色的元素，并检查它们的 `aria-valuenow` 属性（作为数字）。

对于所有其他表单元素，值的匹配使用与 [`toHaveFormValues`](#tohaveformvalues) 相同的算法。

```html
<input type="text" value="text" data-testid="input-text" />
<input type="number" value="5" data-testid="input-number" />
<input type="text" data-testid="input-empty" />
<select multiple data-testid="select-number">
  <option value="first">First Value</option>
  <option value="second" selected>Second Value</option>
  <option value="third" selected>Third Value</option>
</select>
```

```ts
const textInput = getByTestId('input-text')
const numberInput = getByTestId('input-number')
const emptyInput = getByTestId('input-empty')
const selectInput = getByTestId('select-number')

await expect.element(textInput).toHaveValue('text')
await expect.element(numberInput).toHaveValue(5)
await expect.element(emptyInput).not.toHaveValue()
await expect.element(selectInput).toHaveValue(['second', 'third'])
```

## toHaveDisplayValue

```typescript
function toHaveDisplayValue(
  value: string | RegExp | (string | RegExp)[]
): Promise<void>
```

这允许你检查给定的表单元素是否具有指定的显示值（即终端用户实际看到的值）。它接受 `<input>`、`<select>` 和 `<textarea>` 元素，但不包括 `<input type="checkbox">` 和 `<input type="radio">`，因为这些类型的元素只能通过 [`toBeChecked`](#tobechecked) 或 [`toHaveFormValues`](#tohaveformvalues) 进行有意义的匹配。

```html
<label for="input-example">First name</label>
<input type="text" id="input-example" value="Luca" />

<label for="textarea-example">Description</label>
<textarea id="textarea-example">An example description here.</textarea>

<label for="single-select-example">Fruit</label>
<select id="single-select-example">
  <option value="">Select a fruit...</option>
  <option value="banana">Banana</option>
  <option value="ananas">Ananas</option>
  <option value="avocado">Avocado</option>
</select>

<label for="multiple-select-example">Fruits</label>
<select id="multiple-select-example" multiple>
  <option value="">Select a fruit...</option>
  <option value="banana" selected>Banana</option>
  <option value="ananas">Ananas</option>
  <option value="avocado" selected>Avocado</option>
</select>
```

```ts
const input = page.getByLabelText('First name')
const textarea = page.getByLabelText('Description')
const selectSingle = page.getByLabelText('Fruit')
const selectMultiple = page.getByLabelText('Fruits')

await expect.element(input).toHaveDisplayValue('Luca')
await expect.element(input).toHaveDisplayValue(/Luc/)
await expect.element(textarea).toHaveDisplayValue('An example description here.')
await expect.element(textarea).toHaveDisplayValue(/example/)
await expect.element(selectSingle).toHaveDisplayValue('Select a fruit...')
await expect.element(selectSingle).toHaveDisplayValue(/Select/)
await expect.element(selectMultiple).toHaveDisplayValue([/Avocado/, 'Banana'])
```

## toBeChecked

```ts
function toBeChecked(): Promise<void>
```

这允许你检查给定的元素是否被选中。它接受类型为 `checkbox` 或 `radio` 的 `input` 元素，以及具有 `checkbox`、`radio` 或 `switch` 角色的元素，这些元素需要拥有值为 `"true"` 或 `"false"` 的有效 `aria-checked` 属性。

```html
<input type="checkbox" checked data-testid="input-checkbox-checked" />
<input type="checkbox" data-testid="input-checkbox-unchecked" />
<div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
<div
  role="checkbox"
  aria-checked="false"
  data-testid="aria-checkbox-unchecked"
/>

<input type="radio" checked value="foo" data-testid="input-radio-checked" />
<input type="radio" value="foo" data-testid="input-radio-unchecked" />
<div role="radio" aria-checked="true" data-testid="aria-radio-checked" />
<div role="radio" aria-checked="false" data-testid="aria-radio-unchecked" />
<div role="switch" aria-checked="true" data-testid="aria-switch-checked" />
<div role="switch" aria-checked="false" data-testid="aria-switch-unchecked" />
```

```ts
const inputCheckboxChecked = getByTestId('input-checkbox-checked')
const inputCheckboxUnchecked = getByTestId('input-checkbox-unchecked')
const ariaCheckboxChecked = getByTestId('aria-checkbox-checked')
const ariaCheckboxUnchecked = getByTestId('aria-checkbox-unchecked')
await expect.element(inputCheckboxChecked).toBeChecked()
await expect.element(inputCheckboxUnchecked).not.toBeChecked()
await expect.element(ariaCheckboxChecked).toBeChecked()
await expect.element(ariaCheckboxUnchecked).not.toBeChecked()

const inputRadioChecked = getByTestId('input-radio-checked')
const inputRadioUnchecked = getByTestId('input-radio-unchecked')
const ariaRadioChecked = getByTestId('aria-radio-checked')
const ariaRadioUnchecked = getByTestId('aria-radio-unchecked')
await expect.element(inputRadioChecked).toBeChecked()
await expect.element(inputRadioUnchecked).not.toBeChecked()
await expect.element(ariaRadioChecked).toBeChecked()
await expect.element(ariaRadioUnchecked).not.toBeChecked()

const ariaSwitchChecked = getByTestId('aria-switch-checked')
const ariaSwitchUnchecked = getByTestId('aria-switch-unchecked')
await expect.element(ariaSwitchChecked).toBeChecked()
await expect.element(ariaSwitchUnchecked).not.toBeChecked()
```

## toBePartiallyChecked

```typescript
function toBePartiallyChecked(): Promise<void>
```

这允许你检查给定的元素是否处于部分选中状态。它接受类型为 `checkbox` 的 `input` 元素，以及具有 `checkbox` 角色且 `aria-checked="mixed"` 的元素，或者类型为 `checkbox` 且 `indeterminate` 属性设置为 `true` 的 `input` 元素。

```html
<input type="checkbox" aria-checked="mixed" data-testid="aria-checkbox-mixed" />
<input type="checkbox" checked data-testid="input-checkbox-checked" />
<input type="checkbox" data-testid="input-checkbox-unchecked" />
<div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
<div
  role="checkbox"
  aria-checked="false"
  data-testid="aria-checkbox-unchecked"
/>
<input type="checkbox" data-testid="input-checkbox-indeterminate" />
```

```ts
const ariaCheckboxMixed = getByTestId('aria-checkbox-mixed')
const inputCheckboxChecked = getByTestId('input-checkbox-checked')
const inputCheckboxUnchecked = getByTestId('input-checkbox-unchecked')
const ariaCheckboxChecked = getByTestId('aria-checkbox-checked')
const ariaCheckboxUnchecked = getByTestId('aria-checkbox-unchecked')
const inputCheckboxIndeterminate = getByTestId('input-checkbox-indeterminate')

await expect.element(ariaCheckboxMixed).toBePartiallyChecked()
await expect.element(inputCheckboxChecked).not.toBePartiallyChecked()
await expect.element(inputCheckboxUnchecked).not.toBePartiallyChecked()
await expect.element(ariaCheckboxChecked).not.toBePartiallyChecked()
await expect.element(ariaCheckboxUnchecked).not.toBePartiallyChecked()

inputCheckboxIndeterminate.element().indeterminate = true
await expect.element(inputCheckboxIndeterminate).toBePartiallyChecked()
```

## toHaveRole

```ts
function toHaveRole(role: ARIARole): Promise<void>
```

这允许你断言某个元素具有预期的 [角色](https://www.w3.org/TR/html-aria/#docconformance)。

在你已经通过某种查询（而非角色本身）获取到某个元素，并希望对其可访问性进行更多断言时，这非常有用。

角色可以匹配显式角色（通过 `role` 属性），也可以通过 [隐式 ARIA 语义](https://www.w3.org/TR/html-aria/#docconformance) 匹配隐式角色。

```html
<button data-testid="button">Continue</button>
<div role="button" data-testid="button-explicit">Continue</button>
<button role="switch button" data-testid="button-explicit-multiple">Continue</button>
<a href="/about" data-testid="link">About</a>
<a data-testid="link-invalid">Invalid link<a/>
```

```ts
await expect.element(getByTestId('button')).toHaveRole('button')
await expect.element(getByTestId('button-explicit')).toHaveRole('button')
await expect.element(getByTestId('button-explicit-multiple')).toHaveRole('button')
await expect.element(getByTestId('button-explicit-multiple')).toHaveRole('switch')
await expect.element(getByTestId('link')).toHaveRole('link')
await expect.element(getByTestId('link-invalid')).not.toHaveRole('link')
await expect.element(getByTestId('link-invalid')).toHaveRole('generic')
```

::: warning
角色通过字符串相等性进行精确匹配，不会继承自 ARIA 角色层次结构。因此，查询像 `checkbox` 这样的超类角色时，不会包含具有子类角色（如 `switch`）的元素。

还需注意的是，与 `testing-library` 不同，Vitest 会忽略所有自定义角色，仅保留第一个有效的角色，这一行为遵循 Playwright 的规则。

```jsx
<div data-testid="switch" role="switch alert"></div>

await expect.element(getByTestId('switch')).toHaveRole('switch') // ✅
await expect.element(getByTestId('switch')).toHaveRole('alert') // ❌
```
:::

## toHaveSelection

```ts
function toHaveSelection(selection?: string): Promise<void>
```

这允许断言某个元素具有一个[文本选择](https://developer.mozilla.org/en-US/docs/Web/API/Selection)。

这在检查元素内是否选择了文本或部分文本时非常有用。该元素可以是文本类型的输入框、`textarea`，或者是任何包含文本的其他元素，例如段落、`span`、`div` 等。

::: warning
`expected selection` 仅限字符串形式，无法校验选区起止索引。
:::

```html
<div>
  <input type="text" value="text selected text" data-testid="text" />
  <textarea data-testid="textarea">text selected text</textarea>
  <p data-testid="prev">prev</p>
  <p data-testid="parent">
    text <span data-testid="child">selected</span> text
  </p>
  <p data-testid="next">next</p>
</div>
```

```ts
getByTestId('text').element().setSelectionRange(5, 13)
await expect.element(getByTestId('text')).toHaveSelection('selected')

getByTestId('textarea').element().setSelectionRange(0, 5)
await expect.element('textarea').toHaveSelection('text ')

const selection = document.getSelection()
const range = document.createRange()
selection.removeAllRanges()
selection.empty()
selection.addRange(range)

// 子元素的选择同样适用于父元素
range.selectNodeContents(getByTestId('child').element())
await expect.element(getByTestId('child')).toHaveSelection('selected')
await expect.element(getByTestId('parent')).toHaveSelection('selected')

// 选择范围包含：前序同级元素、父元素中子元素前的文本、以及子元素的部分内容
range.setStart(getByTestId('prev').element(), 0)
range.setEnd(getByTestId('child').element().childNodes[0], 3)
await expect.element(queryByTestId('prev')).toHaveSelection('prev')
await expect.element(queryByTestId('child')).toHaveSelection('sel')
await expect.element(queryByTestId('parent')).toHaveSelection('text sel')
await expect.element(queryByTestId('next')).not.toHaveSelection()

// 选择范围包含：子元素的部分内容、父元素中子元素后的文本、以及后续同级元素的部分内容
range.setStart(getByTestId('child').element().childNodes[0], 3)
range.setEnd(getByTestId('next').element().childNodes[0], 2)
await expect.element(queryByTestId('child')).toHaveSelection('ected')
await expect.element(queryByTestId('parent')).toHaveSelection('ected text')
await expect.element(queryByTestId('prev')).not.toHaveSelection()
await expect.element(queryByTestId('next')).toHaveSelection('ne')
```

<<<<<<< HEAD:guide/browser/assertions.md
## toMatchScreenshot <Badge type="warning">实验性</Badge> {#tomatchscreenshot}
=======
## toMatchScreenshot <Badge type="warning">experimental</Badge> {#tomatchscreenshot}
>>>>>>> 63c27c40d2833c42ec624f3076c90acd960fe8f9:api/browser/assertions.md

```ts
function toMatchScreenshot(
  options?: ScreenshotMatcherOptions,
): Promise<void>
function toMatchScreenshot(
  name?: string,
  options?: ScreenshotMatcherOptions,
): Promise<void>
```

::: tip
`toMatchScreenshot` 断言可在 [Vitest 配置](/config/browser/expect#tomatchscreenshot) 中全局设定。
:::

该断言通过将元素或整页的截图与预先保存的基准图像进行比对，实现视觉回归测试。

若差异超出设定阈值，测试即告失败。为便于定位变更，断言会自动生成：

- 测试过程中的实际截图
- 预期的基准截图
- 差异高亮的对比图（如技术可行）

::: warning 截图稳定性
该断言会不断重试截图，直到连续两次结果完全一致，从而削弱动画、加载状态或其他动态内容带来的抖动。可通过 `timeout` 选项设定最长等待时间。

但浏览器渲染易受多种变量影响：

- 浏览器及其版本差异
- 操作系统（Windows、macOS、Linux）
- 屏幕分辨率与像素密度
- GPU 驱动及硬件加速策略
- 字体渲染与系统字体差异

建议先阅读 [视觉回归测试指南](/api/browser/visual-regression-testing)，再落地实施。
:::

::: tip
若截图对比因**有意变更**而失败，可在监听模式下按 `u` 键，或运行测试时加上 `-u`/`--update` 标志，以更新基准图。
:::

```html
<button data-testid="button">Fancy Button</button>
```

```ts
// basic usage, auto-generates screenshot name
await expect.element(getByTestId('button')).toMatchScreenshot()

// with custom name
await expect.element(getByTestId('button')).toMatchScreenshot('fancy-button')

// with options
await expect.element(getByTestId('button')).toMatchScreenshot({
  comparatorName: 'pixelmatch',
  comparatorOptions: {
    allowedMismatchedPixelRatio: 0.01,
  },
})

// with both name and options
await expect.element(getByTestId('button')).toMatchScreenshot('fancy-button', {
  comparatorName: 'pixelmatch',
  comparatorOptions: {
    allowedMismatchedPixelRatio: 0.01,
  },
})
```

### Options

- `comparatorName: "pixelmatch" = "pixelmatch"`

  用于比较图像的算法/库名称。

  目前，仅支持 [“pixelmatch”](https://github.com/mapbox/pixelmatch)。

- `comparatorOptions: object`

  用于调整比较器行为的选项，可设置的属性取决于所选的比较算法。

  Vitest 已内置默认值，但可以覆盖。

  - [`"pixelmatch"` options](#pixelmatch-comparator-options)

  ::: warning
  **始终显式设置 `comparatorName`，以确保 `comparatorOptions` 的类型推断正确**。

  否则，TypeScript 无法识别哪些选项是有效的。

  ```ts
  // ❌ TypeScript can't infer the correct options
  await expect.element(button).toMatchScreenshot({
    comparatorOptions: {
      // might error when new comparators are added
      allowedMismatchedPixelRatio: 0.01,
    },
  })

  // ✅ TypeScript knows these are pixelmatch options
  await expect.element(button).toMatchScreenshot({
    comparatorName: 'pixelmatch',
    comparatorOptions: {
      allowedMismatchedPixelRatio: 0.01,
    },
  })
  ```
  :::

- `screenshotOptions: object`

  与 [`locator.screenshot()`](/api/browser/locators.html#screenshot) 支持的选项一致，但以下情况除外：

  - `'base64'`
  - `'path'`
  - `'save'`
  - `'type'`

- `timeout: number = 5_000`

  等待获取稳定截图的时间。

  设为 `0` 可禁用超时，但如果无法确定稳定截图，进程将不会结束。

#### `"pixelmatch"` comparator options

使用 `"pixelmatch"` 比较器时，以下选项可用：

- `allowedMismatchedPixelRatio: number | undefined = undefined`

  允许的捕获截图与参考图像之间不同的像素比例的最大值，范围为 `0` 到 `1`。

  例如，`allowedMismatchedPixelRatio: 0.02` 表示最多允许 2% 的像素不同，否则测试失败。

- `allowedMismatchedPixels: number | undefined = undefined`

  允许的捕获截图与参考图像之间不同的像素的最大数量。

  如果设置为 `undefined`，任何非零差异都将导致测试失败。

  例如，`allowedMismatchedPixels: 10` 表示最多允许 10 个像素不同，否则测试失败。

- `threshold: number = 0.1`

  两张图像中相同像素的可接受颜色差异范围，值越小越敏感。

  比较使用 [YIQ 色彩空间](https://en.wikipedia.org/wiki/YIQ)。

- `includeAA: boolean = false`

  如果为 `true`，则禁用抗锯齿像素的检测和忽略。

- `alpha: number = 0.1`

  差异图像中未改变像素的混合级别，范围为 `0`（白色）到 `1`（原始亮度）。

- `aaColor: [r: number, g: number, b: number] = [255, 255, 0]`

  差异图像中抗锯齿像素的颜色。

- `diffColor: [r: number, g: number, b: number] = [255, 0, 0]`

  差异图像中不同像素的颜色。

- `diffColorAlt: [r: number, g: number, b: number] | undefined = undefined`

  可选的替代颜色，用于区分深色和浅色背景下的差异，帮助区分添加和移除的内容。
  如果未设置，则所有差异均使用 `diffColor`。

- `diffMask: boolean = false`

  如果为 `true`，则仅以透明背景上的遮罩形式显示差异，而不是将其叠加在原始图像上。

  如果检测到抗锯齿像素，则不会显示。

::: warning
当 `allowedMismatchedPixels` 和 `allowedMismatchedPixelRatio` 同时设置时，将采用更严格的限制值。

例如，如果你允许 100 个像素差异或 2% 的比例差异，且图像总像素为 10,000，那么实际限制将是 100 个像素，而不是 200 个。
:::
