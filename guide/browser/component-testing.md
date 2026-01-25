---
title: 组件测试 | 指南
outline: deep
---

# 组件测试 {#component-testing}

组件测试是一种专注于独立测试单个 UI 组件的测试策略。与测试整个用户流程的端到端测试不同，组件测试验证每个组件单独工作是否正确，使它们运行更快且更容易调试。

Vitest 为多个框架提供全面的组件测试支持，包括 Vue、React、Svelte、Lit、Preact、Qwik、Solid、Marko等。本指南涵盖了使用 Vitest 有效测试组件的特定模式、工具和最佳实践。

## 为什么进行组件测试？ {#why-component-testing}

组件测试位于单元测试和端到端测试之间，提供了几个优势：

- **更快的反馈** - 测试单个组件而无需加载整个应用程序
- **隔离测试** - 关注组件行为而无需外部依赖
- **更好的调试** - 更容易定位特定组件中的问题
- **全面的覆盖** - 更容易测试边缘情况和错误状态

## 组件测试的浏览器模式 {#browser-mode-for-component-testing}

Vitest 中的组件测试使用 **浏览器模式** 在真实浏览器环境中运行测试，支持使用 Playwright、WebdriverIO 或 preview 模式。这提供了最准确的测试环境，因为你的组件在真实浏览器中运行，具有实际的 DOM 实现、CSS 渲染和浏览器 API。

### 为什么使用浏览器模式？ {#why-browser-mode}

浏览器模式是组件测试的推荐方案，本质上它提供了最准确的测试环境。与 DOM 模拟库不同，浏览器模式能够捕捉到可能影响用户的实际问题。

::: tip
浏览器模式能够捕获 DOM 模拟库可能遗漏的问题，包括：

- CSS 布局和样式问题
- 真实浏览器 API 行为
- 精确的事件处理与传播机制
- 正确的焦点管理和无障碍功能特性
:::

### 本指南的目的 {#purpose-of-this-guide}

本指南专门介绍使用 Vitest 功能的 **组件测试模式和最佳实践**。虽然多数示例使用浏览器模式（因为这是推荐的方案），但重点在于组件专属的测试策略，而非浏览器配置细节。

有关详细的浏览器设置、配置选项和高级浏览器功能，请参阅 [浏览器模式](/guide/browser/)。

## 什么是好的组件测试 {#what-makes-a-good-component-test}

好的组件测试应聚焦于 **行为和用户体验**，而不是实现细节：

- **测试契约** - 组件如何接收输入（props）并产生输出（事件、渲染）
- **测试用户交互** - 点击操作、表单提交、键盘导航等交互
- **测试边缘情况** - 错误状态、加载状态、空状态等异常场景
- **避免测试内部实现** - 不测试状态变量、私有方法、CSS 类名等内部细节

### 组件测试层次结构 {#component-testing-hierarchy}

```
1. 核心用户路径       → 必测
2. 错误处理机制       → 验证异常场景
3. 边界情况          → 空数据、极限值测试
4. 可访问性          → 屏幕阅读器、键盘导航等兼容性测试
5. 性能表现          → 大数据量、动画渲染测试
```

## 组件测试策略 {#component-testing-strategies}

### 隔离策略 {#isolation-strategy}

通过模拟依赖项来隔离测试组件：

```tsx
// 对于 API 测试而言，我们推荐使用 MSW (Mock Service Worker)
// 详情参阅：https://vitest.dev/guide/mocking/requests
//
// vi.mock(import('../api/userService'), () => ({
//   fetchUser: vi.fn().mockResolvedValue({ name: 'John' })
// }))

// 模拟子组件，以专注测试父组件相关逻辑
vi.mock(import('../components/UserCard'), () => ({
  default: vi.fn(({ user }) => `<div>User: ${user.name}</div>`)
}))

test('UserProfile handles loading and data states', async () => {
  const { getByText } = render(<UserProfile userId="123" />)

  // 测试加载状态
  await expect.element(getByText('Loading...')).toBeInTheDocument()

  // 测试数据加载后的显示（expect.element 会自动重试）
  await expect.element(getByText('User: John')).toBeInTheDocument()
})
```

### 集成策略 {#integration-strategy}

测试组件协作和数据流：

```tsx
test('ProductList filters and displays products correctly', async () => {
  const mockProducts = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
    { id: 2, name: 'Book', category: 'Education', price: 29 }
  ]

  const { getByLabelText, getByText } = render(
    <ProductList products={mockProducts} />
  )

  // 初始状态应显示全部商品
  await expect.element(getByText('Laptop')).toBeInTheDocument()
  await expect.element(getByText('Book')).toBeInTheDocument()

  // 按分类进行筛选
  await userEvent.selectOptions(
    getByLabelText(/category/i),
    'Electronics'
  )

  // 应仅保留 Electronics
  await expect.element(getByText('Laptop')).toBeInTheDocument()
  await expect.element(queryByText('Book')).not.toBeInTheDocument()
})
```

## Testing Library 集成 {#testing-library-integration}

虽然 Vitest 为流行的框架提供了官方依赖包 ([`vitest-browser-vue`](https://www.npmjs.com/package/vitest-browser-vue)、[`vitest-browser-react`](https://www.npmjs.com/package/vitest-browser-react)、[`vitest-browser-svelte`](https://www.npmjs.com/package/vitest-browser-svelte))，但对于尚未官方支持的框架，你可以通过 [Testing Library](https://testing-library.com/) 进行继承。

### 何时使用 Testing Library {#when-to-use-testing-library}

- 你使用框架还没有官方的 Vitest 浏览器依赖包
- 你正在迁移使用 Testing Library 的现有测试
- 针对特定的测试场景更倾向于使用 Testing Library 的 API

### 集成模式 {#integration-pattern}

关键是使用 `page.elementLocator()` 来桥接 Testing Library 的 DOM 输出与 Vitest 的浏览器模式 API：

```jsx
// 适用于 Solid.js 组件
import { render } from '@testing-library/solid'
import { page } from 'vitest/browser'

test('Solid component handles user interaction', async () => {
  // 使用 Testing Library 渲染组件
  const { baseElement, getByRole } = render(() =>
    <Counter initialValue={0} />
  )

  // 桥接到 Vitest 浏览器模式进行交互和断言
  const screen = page.elementLocator(baseElement)

  // 使用 Vitest 的 page API 定位元素
  const incrementButton = screen.getByRole('button', { name: /increment/i })

  // 使用 Vitest 的断言机制
  await expect.element(screen.getByText('Count: 0')).toBeInTheDocument()

  // 通过 Vitest page API 触发用户交互
  await incrementButton.click()

  await expect.element(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

### 可用的 Testing Library 包 {#available-testing-library-packages}

与 Vitest 配合使用效果良好的流行 Testing Library 包：

- [`@testing-library/solid`](https://github.com/solidjs/solid-testing-library) - 用于Solid.js
- [`@marko/testing-library`](https://testing-library.com/docs/marko-testing-library/intro) - 用于Marko
- [`@testing-library/svelte`](https://testing-library.com/docs/svelte-testing-library/intro) - [`vitest-browser-svelte`](https://www.npmjs.com/package/vitest-browser-svelte) 的替代方案
- [`@testing-library/vue`](https://testing-library.com/docs/vue-testing-library/intro) - [`vitest-browser-vue`](https://www.npmjs.com/package/vitest-browser-vue) 的替代方案

::: tip 迁移路径
当你使用的框架后续获得 Vitest 官方支持时，可以通过替换 Testing Library 的 `render` 函数来逐步迁移，同时保持大部分测试逻辑不变。
:::

## 最佳实践 {#best-practices}

### 1. 在 CI / CD 中使用浏览器模式 {#_1-use-browser-mode-for-ci-cd}

确保测试在真实浏览器环境中运行以获得最准确的测试结果。浏览器模式提供准确的 CSS 渲染、真实的浏览器 API 以及正确的事件处理机制。

### 2. 测试用户交互 {#_2-test-user-interactions}

使用 Vitest 的 [交互性 API](/api/browser/interactivity) 模拟真实用户行为。正如使用我们的 [高级测试模式](#advanced-testing-patterns) 所示，使用 `page.getByRole()` 和 `userEvent` 方法：

```tsx
// 推荐：测试真实的用户交互行为
await page.getByRole('button', { name: /submit/i }).click()
await page.getByLabelText(/email/i).fill('user@example.com')

// 应避免：测试实现细节
// component.setState({ email: 'user@example.com' })
```

### 3. 测试可访问性 {#_3-test-accessibility}

通过测试键盘导航、焦点管理和 ARIA 属性，确保组件对所有用户可用。详情请参阅 [测试可访问性](#testing-accessibility) 示例：

```tsx
// 测试键盘导航功能
await userEvent.keyboard('{Tab}')
await expect.element(document.activeElement).toHaveFocus()

// 测试 ARIA 无障碍属性
await expect.element(modal).toHaveAttribute('aria-modal', 'true')
```

### 4. 模拟外部依赖 {#_4-mock-external-dependencies}

通过模拟 API 和外部服务，聚焦测试组件核心逻辑。这种方式能提升测试速度和可靠性。具体实现策略详情请参阅 [隔离策略](#isolation-strategy) 示例：

```tsx
// 对于 API 测试而言，我们推荐使用 MSW (Mock Service Worker)
// 详情参阅：https://vitest.dev/guide/mocking/requests
// 这种方式能提供更贴近实际的请求/响应模拟

// 如需模拟模块，使用 import() 语法
vi.mock(import('../components/UserCard'), () => ({
  default: vi.fn(() => <div>Mocked UserCard</div>)
}))
```

### 5. 使用有意义的测试描述 {#_5-use-meaningful-test-descriptions}

编写测试描述时应说明预期行为，而非实现细节：

```tsx
// 推荐：描述用户可见行为
test('shows error message when email format is invalid')
test('disables submit button while form is submitting')

// 应避免：聚焦实现细节的描述
test('calls validateEmail function')
test('sets isSubmitting state to true')
```

## 高级测试模式 {#advanced-testing-patterns}

### 测试组件状态管理 {#testing-component-state-management}

```tsx
// 测试有状态组件及其状态变更
test('ShoppingCart manages items correctly', async () => {
  const { getByText, getByTestId } = render(<ShoppingCart />)

  // 初始为空状态
  await expect.element(getByText('Your cart is empty')).toBeInTheDocument()

  // 添加商品
  await page.getByRole('button', { name: /add laptop/i }).click()

  // 验证状态变更
  await expect.element(getByText('1 item')).toBeInTheDocument()
  await expect.element(getByText('Laptop - $999')).toBeInTheDocument()

  // 测试数量更新
  await page.getByRole('button', { name: /increase quantity/i }).click()
  await expect.element(getByText('2 items')).toBeInTheDocument()
})
```

### 测试异步数据获取组件 {#testing-async-components-with-data-fetching}

```tsx
// 选项 1（推荐）：使用 MSW（Mock Service Worker）模拟 API
import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'

// 使用 MSW Worker 初始化 API 处理程序
const worker = setupWorker(
  http.get('/api/users/:id', ({ params }) => {
    // 模拟成功响应
    return HttpResponse.json({ id: params.id, name: 'John Doe', email: 'john@example.com' })
  })
)

// 在所有测试之前启动 worker
beforeAll(() => worker.start())
afterEach(() => worker.resetHandlers())
afterAll(() => worker.stop())

test('UserProfile handles loading, success, and error states', async () => {
  // 测试成功状态
  const { getByText } = render(<UserProfile userId="123" />)
  // expect.element 会自动重试直到找到元素
  await expect.element(getByText('John Doe')).toBeInTheDocument()
  await expect.element(getByText('john@example.com')).toBeInTheDocument()

  // 通过为此测试覆盖处理程序，来测试错误状态
  worker.use(
    http.get('/api/users/:id', () => {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 })
    })
  )

  const { getByText: getErrorText } = render(<UserProfile userId="999" />)
  await expect.element(getErrorText('Error: User not found')).toBeInTheDocument()
})
```

::: tip
更多内容请参阅 [在浏览器中使用 MSW](https://mswjs.io/docs/integrations/browser)。
:::

### 测试组件通信 {#testing-component-communication}

```tsx
// 测试父子组件交互
test('parent and child components communicate correctly', async () => {
  const mockOnSelectionChange = vi.fn()

  const { getByText } = render(
    <ProductCatalog onSelectionChange={mockOnSelectionChange}>
      <ProductFilter />
      <ProductGrid />
    </ProductCatalog>
  )

  // 与子组件交互
  await page.getByRole('checkbox', { name: /electronics/i }).click()

  // 验证父组件接收到通信
  expect(mockOnSelectionChange).toHaveBeenCalledWith({
    category: 'electronics',
    filters: ['electronics']
  })

  // 验证其他子组件更新（expect.element 会自动重试）
  await expect.element(getByText('Showing Electronics products')).toBeInTheDocument()
})
```

### 测试带验证的复杂表单 {#testing-complex-forms-with-validation}

```tsx
test('ContactForm handles complex validation scenarios', async () => {
  const mockSubmit = vi.fn()
  const { getByLabelText, getByText } = render(
    <ContactForm onSubmit={mockSubmit} />
  )

  const nameInput = page.getByLabelText(/full name/i)
  const emailInput = page.getByLabelText(/email/i)
  const messageInput = page.getByLabelText(/message/i)
  const submitButton = page.getByRole('button', { name: /send message/i })

  // 测试触发验证
  await submitButton.click()

  await expect.element(getByText('Name is required')).toBeInTheDocument()
  await expect.element(getByText('Email is required')).toBeInTheDocument()
  await expect.element(getByText('Message is required')).toBeInTheDocument()

  // 测试部分验证
  await nameInput.fill('John Doe')
  await submitButton.click()

  await expect.element(getByText('Name is required')).not.toBeInTheDocument()
  await expect.element(getByText('Email is required')).toBeInTheDocument()

  // 测试邮箱格式验证
  await emailInput.fill('invalid-email')
  await submitButton.click()

  await expect.element(getByText('Please enter a valid email')).toBeInTheDocument()

  // 测试提交成功
  await emailInput.fill('john@example.com')
  await messageInput.fill('Hello, this is a test message.')
  await submitButton.click()

  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, this is a test message.'
  })
})
```

### 测试错误边界 {#testing-error-boundaries}

```tsx
// 测试组件如何处理和从错误中恢复
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Component error!')
  }
  return <div>Component working fine</div>
}

test('ErrorBoundary catches and displays errors gracefully', async () => {
  const { getByText, rerender } = render(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ThrowError shouldThrow={false} />
    </ErrorBoundary>
  )

  // 初始正常状态
  await expect.element(getByText('Component working fine')).toBeInTheDocument()

  // 触发错误
  rerender(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  )

  // 错误边界应捕获错误
  await expect.element(getByText('Something went wrong')).toBeInTheDocument()
})
```

### 测试无障碍功能 {#testing-accessibility}

```tsx
test('Modal component is accessible', async () => {
  const { getByRole, getByLabelText } = render(
    <Modal isOpen={true} title="Settings">
      <SettingsForm />
    </Modal>
  )

  // 测试焦点管理 - 模态框打开时应自动获得焦点
  // 这对屏幕阅读器用户感知模态框打开至关重要
  const modal = getByRole('dialog')
  await expect.element(modal).toHaveFocus()

  // 测试 ARIA 属性 - 这些属性为屏幕阅读器提供语义信息
  await expect.element(modal).toHaveAttribute('aria-labelledby') // 关联标题元素
  await expect.element(modal).toHaveAttribute('aria-modal', 'true') // 表示模态框行为

  // 测试键盘导航 - ESC 键应关闭模态框
  // 这是 ARIA 编写规范的要求
  await userEvent.keyboard('{Escape}')
  // expect.element 会自动重试直到模态框消失
  await expect.element(modal).not.toBeInTheDocument()

  // 测试焦点锁定 - Tab 导航应在模态框内循环
  // 防止用户通过 Tab 键访问模态框后续内容
  const firstInput = getByLabelText(/username/i)
  const lastButton = getByRole('button', { name: /save/i })

  // 通过点击聚焦到首个输入框，然后测试 Tab 导航是否到达预期位置
  await firstInput.click()
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}') // Shift+Tab 应回退
  await expect.element(lastButton).toHaveFocus() // 应循环至最后一个元素
})
```

## 调试组件测试 {#debugging-component-tests}

### 1. 使用浏览器开发者工具 {#_1-use-browser-dev-tools}

浏览器模式会在真实浏览器中运行测试，让你能使用完整的开发者工具。当测试失败时，你可以：

- **在测试执行期间打开浏览器开发者工具**（按 F12 或右键点击 → 检查）
- **在测试代码或组件代码中设置断点**
- **检查 DOM** 查看实际渲染的输出
- **检查控制台报错** 排查 JavaScript 错误或警告
- **监控网络请求** 调试API 调用

如需调试可视化模式，可临时在浏览器配置中添加 `headless: false`。

### 2. 添加调试语句 {#_2-add-debug-statements}

使用策略性日志记录来理解测试失败：

```tsx
test('debug form validation', async () => {
  render(<ContactForm />)

  const submitButton = page.getByRole('button', { name: /submit/i })
  await submitButton.click()

  // 调试：使用不同查询检查元素是否存在
  const errorElement = page.getByText('Email is required')
  console.log('Error element found:', errorElement.length)

  await expect.element(errorElement).toBeInTheDocument()
})
```

### 3. 检查渲染输出 {#_3-inspect-rendered-output}

当组件未按预期渲染时，请系统性地调试它们：

**使用 Vitest 的浏览器 UI 模式：**
- 启用浏览器模式运行测试
- 打开终端中显示的浏览器 URL 以查看测试运行情况
- 可视化检查有助于识别 CSS 问题、布局问题或缺失元素

**测试元素查询：**
```tsx
// 调试元素查找失败原因
const button = page.getByRole('button', { name: /submit/i })
console.log('Button count:', button.length) // 应为 1

// 如果首次查询失败，尝试替代方案
if (button.length === 0) {
  console.log('All buttons:', page.getByRole('button').length)
  console.log('By test ID:', page.getByTestId('submit-btn').length)
}
```

### 4. 验证选择器 {#_4-verify-selectors}

选择器问题是测试失败的常见原因。请系统性地调试它们：

**检查可访问名称：**
```tsx
// 当 getByRole 失败时，检查 roles/names 可用性
const buttons = page.getByRole('button').all()
for (const button of buttons) {
  // 使用 element() 获取 DOM 元素并访问原生属性
  const element = button.element()
  const accessibleName = element.getAttribute('aria-label') || element.textContent
  console.log(`Button: "${accessibleName}"`)
}
```

**测试不同的查询策略：**
```tsx
// 使用.or 实现自动重试的多途径元素查找
const submitButton = page.getByRole('button', { name: /submit/i }) // 通过 accessible name 进行查询
  .or(page.getByTestId('submit-button')) // 通过 test ID 进行查询
  .or(page.getByText('Submit')) // 通过精确文本进行查询
// 注意：Vitest 没有 page.locator()，需使用特定 getBy* 方法
```

**常见的选择器调试模式：**
```tsx
test('debug element queries', async () => {
  render(<LoginForm />)

  // 检查元素是否可见且可用
  const emailInput = page.getByLabelText(/email/i)
  await expect.element(emailInput).toBeVisible() // 将显示元素可见性状态，若不可见则打印 DOM
})
```

### 5. 调试异步问题 {#_5-debugging-async-issues}

组件测试经常涉及时机问题：

```tsx
test('debug async component behavior', async () => {
  render(<AsyncUserProfile userId="123" />)

  // expect.element 会自动重试并显示有用的错误信息
  await expect.element(page.getByText('John Doe')).toBeInTheDocument()
})
```

## 从其他测试框架迁移 {#migration-from-other-testing-frameworks}

### 从 Jest + Testing Library 迁移 {#from-jest-testing-library}

大多数 Jest + Testing Library 测试只需少量更改即可工作：

```ts
// 之前 (Jest)
import { render, screen } from '@testing-library/react' // [!code --]

// 之后 (Vitest)
import { render } from 'vitest-browser-react' // [!code ++]
```

### 主要差异 {#key-differences}

- 使用 `await expect.element()` 替代 `expect()` 进行 DOM 断言
- 使用 `vitest/browser` 替代 `@testing-library/user-event` 进行用户交互
- 浏览器模式提供真实的浏览器环境实现精准测试

## 了解更多 {#learn-more}

- [浏览器模式文档](/guide/browser/)
- [交互性API](/api/browser/interactivity)
- [示例仓库](https://github.com/vitest-tests/browser-examples)
