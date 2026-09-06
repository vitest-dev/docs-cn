---
title: ARIA 快照 | 指南
outline: deep
---

# ARIA 快照 <Experimental /> <Version>4.1.4</Version> {#aria-snapshots}

ARIA 快照可以让你测试页面的无障碍结构。你不是去断言原始 HTML 或视觉输出，而是去断言无障碍树，也就是屏幕阅读器和其他辅助技术所使用的那套结构。

给定以下 HTML：

```html
<nav aria-label="Main">
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
```

你可以断言其无障碍树：

```ts
await expect.element(page.getByRole('navigation')).toMatchAriaInlineSnapshot(`
  - navigation "Main":
    - link "Home":
      - /url: /
    - link "About":
      - /url: /about
`)
```

这可以捕获无障碍方面的回归问题，比如缺失的标签、错误的角色、错误的标题层级等等，而这些往往是 DOM 快照捕捉不到的。即使底层的 HTML 结构发生了变化，只要内容在语义上仍然一致，这个断言就不会失败。

对于更高级的场景，你还可以通过 `vitest/browser` 中的 `utils.aria` 生成并检查 ARIA 树。更多内容请参阅 [上下文 API](/api/browser/context#aria)。

## 快照工作流 {#snapshot-workflow}

ARIA 快照与其他快照断言使用相同的 Vitest 快照工作流。文件快照、内联快照、`--update`/`-u`、watch 模式更新以及 CI 快照行为都以相同的方式工作。

关于通用快照工作流、更新行为和审查指南，请参阅 [快照指南](/guide/snapshot)。

## 基础使用 {#basic-usage}

给定一个包含以下 HTML 的页面：

```html
<form aria-label="Log In">
  <input aria-label="Email" />
  <input aria-label="Password" type="password" />
  <button>Submit</button>
</form>
```

### 文件快照 {#file-snapshots}

使用 `toMatchAriaSnapshot()` 将快照存储在与测试文件同目录的 `.snap` 文件中：

```ts [basic.test.ts]
import { expect, test } from 'vitest'

test('login form', async () => {
  await expect.element(page.getByRole('form')).toMatchAriaSnapshot()
})
```

首次运行时，Vitest 会生成一条快照文件记录：

```js [__snapshots__/basic.test.ts.snap]
// Vitest 快照...

exports[`login form 1`] = `
- form "Log In":
  - textbox "Email"
  - textbox "Password"
  - button "Submit"
`
```

### 内联快照 {#inline-snapshots}

使用 `toMatchAriaInlineSnapshot()` 将快照直接存储在测试文件中：

```ts
import { expect, test } from 'vitest'

test('login form', async () => {
  await expect.element(page.getByRole('form')).toMatchAriaInlineSnapshot(`
    - form "Log In":
      - textbox "Email"
      - textbox "Password"
      - button "Submit"
  `)
})
```

## 浏览器模式的重试行为 {#browser-mode-retry-behavior}

在 [浏览器模式](/guide/browser/) 中，`expect.element()` 会轮询 DOM 并等待无障碍树 **稳定** 后再评估结果。每次轮询时，匹配器会重新查询元素并重新捕获无障碍树。当连续两次轮询产生相同输出时，快照即被视为稳定。

```ts
await expect.element(page.getByRole('form')).toMatchAriaInlineSnapshot(`
  - form "Log In":
    - textbox "Email"
    - textbox "Password"
    - button "Submit"
`)
```

首次运行或使用 `--update` 时，稳定结果会被写入作为新快照。

当已存在快照时，这个匹配器还会检查当前稳定下来的结果是否与快照一致。如果不一致，轮询就会重置并继续进行，从而给 DOM 留出时间到达期望状态。这可以处理诸如动画、异步渲染或延迟状态更新之类的情况：在这些场景中，树结构可能会先短暂稳定在某个中间状态，然后才最终稳定到目标状态。

## 保留手动编辑的模式 {#preserving-hand-edited-patterns}

当你手动编辑快照并使用正则模式时，这些匹配规则在 `--update` 后仍会保留。只有发生更改的字面量会被覆盖。这让你可以编写灵活的断言，在内容变化时不会失效。

### 示例 {#example}

**步骤 1.** 你的购物车页面渲染了以下 HTML：

```html
<h1>Your Cart</h1>
<ul aria-label="Cart Items">
  <li>Wireless Headphones — $79.99</li>
</ul>
<button>Checkout</button>
```

你首次使用 `--update` 运行测试。Vitest 生成了快照：

```yaml
- heading "Your Cart" [level=1]
- list "Cart Items":
    - listitem: Wireless Headphones — $79.99
- button "Checkout"
```

**步骤 2.** 商品名称和价格是可能变化的种子测试数据。你手动将这些行编辑为正则表达式模式，但将稳定的结构保留为字面量：

```yaml
- heading "Your Cart" [level=1]
- list "Cart Items":
    - listitem: /.+ — \$\d+\.\d+/
- button "Checkout"
```

**步骤 3.** 后来，开发者将按钮从 “Checkout” 重命名为 “Place Order”。运行 `--update` 会更新该字面量，但保留你的正则表达式模式：

```yaml
- heading "Your Cart" [level=1]
- list "Cart Items":
    - listitem: /.+ — \$\d+\.\d+/
- button "Place Order"   👈 New snapshot updated with new string
```

你在步骤 2 中编写的正则表达式模式被保留，因为它们仍然匹配实际内容。只有不匹配的字面量 “Checkout” 被更新为 “Place Order”。

## 快照格式 {#snapshot-format}

ARIA 快照使用类似 YAML 的语法。每行代表无障碍树中的一个节点。

:::info
ARIA 快照模板使用 **YAML 语法的子集**。仅支持无障碍树所需的功能：标量值、通过缩进实现的嵌套映射以及序列（`- item`）。不支持 YAML 的高级功能，如锚点、标签、流集合和多行标量。

捕获的文本在渲染到快照之前也会进行空白字符规范化。换行符、`<br>` 换行、制表符和重复的空白字符都会折叠为单个空格，因此多行 DOM 文本会以单行快照值的形式输出。
:::

树中的每个无障碍元素都表示为一个 YAML 节点：

```yaml
- role "name" [attribute=value]
```

- `role`：元素的 ARIA 角色，例如 `heading`、`list`、`listitem` 或 `button`
- `"name"`：[无障碍名称](https://w3c.github.io/accname/)，当存在时。带引号的字符串匹配精确值，`/patterns/` 匹配正则表达式
- `[attribute=value]`：无障碍性状态和属性，例如 `checked`、`disabled`、`expanded`、`level`、`pressed` 或 `selected`

这些值来自 ARIA 属性和浏览器的无障碍树，其中也包括从原生 HTML 元素推断出来的语义信息。

由于 ARIA 快照反映的是浏览器的无障碍树，因此那些被排除在无障碍树之外的内容，比如 `aria-hidden="true"` 或 `display: none` 的元素，不会出现在快照中。

### 角色与无障碍名称 {#roles-and-accessible-names}

例如：

```html
<button>Submit</button>
<h1>Welcome</h1>
<a href="/">Home</a>
<input aria-label="Email" />
```

```yaml
- button "Submit"
- heading "Welcome" [level=1]
- link "Home"
- textbox "Email"
```

角色通常来自元素的原生语义，但也可以通过 ARIA 定义。无障碍名称根据文本内容、关联标签、`aria-label`、`aria-labelledby` 及相关命名规则计算得出。

要更深入了解名称的计算方式，请参阅 [无障碍名称与描述计算](https://w3c.github.io/accname/)。

某些内容在快照中显示为文本节点而非基于角色的元素：

```html
<span>Hello world</span>
```

```yaml
- text: Hello world
```

文本值在经过空白字符规范化后，总是会被序列化到单独一行中。例如：

```html
<p>
Line 1
Line 2<br />Line 3
Line 4
</p>
```

```yaml
- paragraph: Line 1 Line 2 Line 3 Line 4
```

### 子元素 {#children}

子元素嵌套在其父元素下方显示：

```html
<ul>
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>
```

```yaml
- list:
    - listitem: First
    - listitem: Second
    - listitem: Third
```

如果父元素具有无障碍名称，快照会在嵌套子元素之前包含该名称：

```html
<nav aria-label="Main">
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
```

```yaml
- navigation "Main":
    - link "Home"
    - link "About"
```

如果一个元素仅包含单个文本元素且没有其他属性，则文本会以内联方式呈现：

```html
<p>Hello world</p>
```

```yaml
- paragraph: Hello world
```

### 属性 {#attributes}

ARIA 状态和属性显示在方括号中：

| HTML                                                                   | 快照                                      |
| ---------------------------------------------------------------------- | ----------------------------------------- |
| `<input type="checkbox" checked aria-label="Agree">`                   | `- checkbox "Agree" [checked]`            |
| `<input type="checkbox" aria-checked="mixed" aria-label="Select all">` | `- checkbox "Select all" [checked=mixed]` |
| `<button aria-disabled="true">Submit</button>`                         | `- button "Submit" [disabled]`            |
| `<button aria-expanded="true">Menu</button>`                           | `- button "Menu" [expanded]`              |
| `<h2>Title</h2>`                                                       | `- heading "Title" [level=2]`             |
| `<button aria-pressed="true">Bold</button>`                            | `- button "Bold" [pressed]`               |
| `<button aria-pressed="mixed">Bold</button>`                           | `- button "Bold" [pressed=mixed]`         |
| `<option selected>English</option>`                                    | `- option "English" [selected]`           |

属性只有在生效时才会显示。一个未被禁用的按钮不会带有 `[disabled]` 属性，也不会出现 `[disabled=false]` 这样的写法。

### 伪类 {#pseudo-attributes}

一些不属于 ARIA 但对测试有用的 DOM 属性会以 `/` 前缀形式暴露：

#### `/url:`

链接会包含它们的 URL：

```html
<a href="/">Home</a>
```

```yaml
- link "Home":
    - /url: /
```

#### `/placeholder:`

文本框也可以包含它们的占位文本：

```html
<input aria-label="Email" placeholder="user@example.com" />
```

```yaml
- textbox "Email":
    - /placeholder: user@example.com
```

:::tip `/placeholder:` 何时出现？

`/placeholder:` 伪类仅在占位符文本 **与无障碍名称不同时** 出现。当输入框有占位符但没有 `aria-label` 或关联的 `<label>` 时，浏览器会将占位符用作无障碍名称。在这种情况下，占位符信息已包含在名称中，不会重复出现。

- 当占位符是无障碍名称时：

```html
<input placeholder="Search" />
```

```yaml
- textbox "Search"
```

- 当占位符与无障碍名称不同时：

```html
<input placeholder="Search" aria-label="Search products" />
```

```yaml
- textbox "Search products":
    - /placeholder: Search
```

:::

## 匹配 {#matching}

### 正则表达式 {#regular-expressions}

使用正则表达式模式来灵活匹配名称：

```html
<h1>Welcome, Alice</h1>
<a href="https://example.com/profile/123">Profile</a>
```

```yaml
- heading /Welcome, .*/
- link "Profile":
    - /url: /https:\/\/example\.com\/.*/
```

正则表达式也适用于伪类：

```html
<input aria-label="Search" placeholder="Type to search..." />
```

```yaml
- textbox "Search":
    - /placeholder: /Type .*/
```

::: warning 正则表达式模式中的反斜杠转义
快照会以 JavaScript 字符串的形式存储：内联快照使用反引号包裹的模板字面量，文件快照则存放在 `.snap` 文件中。因此，当你手动编辑快照并加入正则表达式规则时，反斜杠需要写成 **双反斜杠**。

例如，如果你想用 `\d+` 来匹配一个或多个数字：

```ts
// ✅ 正确 - 双反斜杠
await expect.element(button).toMatchAriaInlineSnapshot(`
  - button: /item \\d+/
`)

// ❌ 错误 - 单反斜杠会被 JS 吃掉，正则表达式看到的是 "d+" 而不是 "\d+"
await expect.element(button).toMatchAriaInlineSnapshot(`
  - button: /item \d+/
`)
```

这适用于内联快照和 `.snap` 文件。当 Vitest **自动生成** 或 **更新** 快照时，转义会被自动处理；只有在你手动编辑正则模式时，才需要特别注意这一点。
:::

### 子元素匹配 {#child-matching}

`/children` 指令控制如何将节点的子元素与模板进行比较。有三种模式：

#### 部分匹配（默认） {#partial-matching-default}

默认情况下（无 `/children` 指令），模板使用 **包含** 语义，只要所有模板子元素以有序子序列的形式出现，实际树中的额外子元素是允许的。这与 `/children: contain` 相同。

```html
<main>
  <h1>Welcome</h1>
  <p>Some intro text</p>
  <button>Get Started</button>
</main>
```

```ts
// 通过 — 模板子元素是实际子元素的子集
await expect.element(page.getByRole('main')).toMatchAriaInlineSnapshot(`
  - main:
    - heading "Welcome" [level=1]
`)
```

这适用于编写更聚焦、更稳健的测试，不会因为添加了无关内容就导致测试失效。

#### 精确匹配（`/children: equal`） {#exact-matching-children-equal}

要求节点的直接子元素与模板完全匹配，相同数量、相同顺序。此层级不允许有额外子元素。

```html
<ul aria-label="Features">
  <li>Feature A</li>
  <li>Feature B</li>
  <li>Feature C</li>
</ul>
```

```ts
// 失败 — 列表有3个项目但模板只列出了2个
await expect.element(page.getByRole('list')).toMatchAriaInlineSnapshot(`
  - list "Features":
    - /children: equal
    - listitem: Feature A
    - listitem: Feature B
`)
```

```ts
// 通过 — 所有3个项目都已列出
await expect.element(page.getByRole('list')).toMatchAriaInlineSnapshot(`
  - list "Features":
    - /children: equal
    - listitem: Feature A
    - listitem: Feature B
    - listitem: Feature C
`)
```

严格匹配只会应用在放置 `/children` 的那一层。每个 `listitem` 的后代元素仍然使用默认的包含式匹配语义。

#### 深度精确匹配（`/children: deep-equal`） {#deep-exact-matching-children-deep-equal}

和 `equal` 类似，但这种严格匹配会递归应用到所有后代节点。每一层嵌套都必须完全一致：数量相同、顺序相同，并且在任何深度都不能有多余的节点。

```ts
await expect.element(page.getByRole('navigation')).toMatchAriaInlineSnapshot(`
  - navigation "Main":
    - /children: deep-equal
    - link "Home":
      - /url: /
    - link "About":
      - /url: /about
`)
```

使用 `deep-equal` 时，每个 `link` 的所有子元素也必须完全匹配。如果某个链接有一个模板中未列出的额外子节点，断言就会失败。

#### 对比 {#comparison}

| 模式         | 指令                             | 行为                                        |
| ------------ | -------------------------------- | ------------------------------------------- |
| 部分匹配     | _(默认)_ 或 `/children: contain` | 模板子元素是有序子序列,忽略实际额外的子元素 |
| 精确匹配     | `/children: equal`               | 直接子元素必须完全匹配；后代仍使用部分匹配  |
| 深度精确匹配 | `/children: deep-equal`          | 所有深度的子元素都必须完全匹配              |
