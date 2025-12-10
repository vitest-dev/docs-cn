---
title: Component Testing | Guide
outline: deep
---

# 组件测试 {#component-testing}

组件测试是一种专注于独立测试单个UI组件的测试策略。与测试整个用户流程的端到端测试不同，组件测试验证每个组件单独工作是否正确，使它们运行更快且更容易调试。

Vitest为多个框架提供全面的组件测试支持，包括Vue、React、Svelte、Lit、Preact、Qwik、Solid、Marko等。本指南涵盖了使用Vitest有效测试组件的特定模式、工具和最佳实践。

## 为什么进行组件测试？ {#why-component-testing}

组件测试位于单元测试和端到端测试之间，提供了几个优势：

- **更快的反馈** - 测试单个组件而无需加载整个应用程序
- **隔离测试** - 关注组件行为而无需外部依赖
- **更好的调试** - 更容易定位特定组件中的问题
- **全面的覆盖** - 更容易测试边缘情况和错误状态

## 组件测试的浏览器模式 {#browser-mode-for-component-testing}

Vitest中的组件测试使用**浏览器模式**在真实浏览器环境中运行测试，支持使用Playwright、WebdriverIO或预览模式。这提供了最准确的测试环境，因为你的组件在真实浏览器中运行，具有实际的DOM实现、CSS渲染和浏览器API。

### 为什么使用浏览器模式？ {#why-browser-mode}

浏览器模式是组件测试的推荐方法，因为它提供了最准确的测试环境。与DOM模拟库不同，浏览器模式能够捕获影响用户的真实世界问题。

::: tip
浏览器模式能够捕获DOM模拟库可能遗漏的问题，包括：
- CSS布局和样式问题
- 真实浏览器API行为
- 准确的事件处理和传播
- 正确的焦点管理和无障碍功能特性

:::

### 本指南的目的 {#purpose-of-this-guide}

本指南专门介绍使用Vitest功能的**组件测试模式和最佳实践**。虽然许多示例使用浏览器模式（因为这是推荐的方法），但这里的重点是组件特定的测试策略，而不是浏览器配置细节。

有关详细的浏览器设置、配置选项和高级浏览器功能，请参阅[浏览器模式文档](/api/browser/)。

## 什么是好的组件测试 {#what-makes-a-good-component-test}

好的组件测试关注**行为和用户体验**，而不是实现细节：

- **测试契约** - 组件如何接收输入（props）并产生输出（事件、渲染）
- **测试用户交互** - 点击、表单提交、键盘导航
- **测试边缘情况** - 错误状态、加载状态、空状态
- **避免测试内部实现** - 状态变量、私有方法、CSS类

### 组件测试层次结构 {#component-testing-hierarchy}

```
1. Critical User Paths → Always test these
2. Error Handling      → Test failure scenarios
3. Edge Cases          → Empty data, extreme values
4. Accessibility       → Screen readers, keyboard nav
5. Performance         → Large datasets, animations
```

## 组件测试策略 {#component-testing-strategies}

### 隔离策略 {#isolation-strategy}

通过模拟依赖项来隔离测试组件：

```tsx
// For API requests, we recommend MSW (Mock Service Worker)
// See: https://vitest.dev/guide/mocking/requests
//
// vi.mock(import('../api/userService'), () => ({
//   fetchUser: vi.fn().mockResolvedValue({ name: 'John' })
// }))

// Mock child components to focus on parent logic
vi.mock(import('../components/UserCard'), () => ({
  default: vi.fn(({ user }) => `<div>User: ${user.name}</div>`)
}))

test('UserProfile handles loading and data states', async () => {
  const { getByText } = render(<UserProfile userId="123" />)

  // Test loading state
  await expect.element(getByText('Loading...')).toBeInTheDocument()

  // Test for data to load (expect.element auto-retries)
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

  // Initially shows all products
  await expect.element(getByText('Laptop')).toBeInTheDocument()
  await expect.element(getByText('Book')).toBeInTheDocument()

  // Filter by category
  await userEvent.selectOptions(
    getByLabelText(/category/i),
    'Electronics'
  )

  // Only electronics should remain
  await expect.element(getByText('Laptop')).toBeInTheDocument()
  await expect.element(queryByText('Book')).not.toBeInTheDocument()
})
```

## Testing Library 集成 {#testing-library-integration}

虽然Vitest为流行的框架提供了官方包([`vitest-browser-vue`](https://www.npmjs.com/package/vitest-browser-vue)、[`vitest-browser-react`](https://www.npmjs.com/package/vitest-browser-react)、[`vitest-browser-svelte`](https://www.npmjs.com/package/vitest-browser-svelte))，但你也可以为尚未得到官方支持的框架集成[Testing Library](https://testing-library.com/)。

### 何时使用 Testing Library {#when-to-use-testing-library}

- 你的框架还没有官方的Vitest浏览器包
- 你正在迁移使用Testing Library的现有测试
- 你更喜欢Testing Library的API来处理特定的测试场景

### 集成模式 {#integration-pattern}

关键是使用 `page.elementLocator()` 来桥接 Testing Library 的 DOM 输出与 Vitest 的浏览器模式 API：

```jsx
// For Solid.js components
import { render } from '@testing-library/solid'
import { page } from 'vitest/browser'

test('Solid component handles user interaction', async () => {
  // Use Testing Library to render the component
  const { baseElement, getByRole } = render(() =>
    <Counter initialValue={0} />
  )

  // Bridge to Vitest's browser mode for interactions and assertions
  const screen = page.elementLocator(baseElement)

  // Use Vitest's page queries for finding elements
  const incrementButton = screen.getByRole('button', { name: /increment/i })

  // Use Vitest's assertions and interactions
  await expect.element(screen.getByText('Count: 0')).toBeInTheDocument()

  // Trigger user interaction using Vitest's page API
  await incrementButton.click()

  await expect.element(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

### 可用的 Testing Library 包 {#available-testing-library-packages}

与Vitest配合使用效果良好的流行Testing Library包：

- [`@testing-library/solid`](https://github.com/solidjs/solid-testing-library) - 用于Solid.js
- [`@marko/testing-library`](https://testing-library.com/docs/marko-testing-library/intro) - 用于Marko
- [`@testing-library/svelte`](https://testing-library.com/docs/svelte-testing-library/intro) - [`vitest-browser-svelte`](https://www.npmjs.com/package/vitest-browser-svelte)的替代方案
- [`@testing-library/vue`](https://testing-library.com/docs/vue-testing-library/intro) - [`vitest-browser-vue`](https://www.npmjs.com/package/vitest-browser-vue)的替代方案

::: tip Migration Path
如果你的框架后来获得了官方的Vitest支持，你可以通过替换Testing Library的 `render` 函数来逐步迁移，同时保持大部分测试逻辑不变。
:::

## 最佳实践 {#best-practices}

### 1. 在CI/CD中使用浏览器模式 {#_1-use-browser-mode-for-ci-cd}
确保测试在真实浏览器环境中运行以获得最准确的测试结果。浏览器模式提供准确的CSS渲染、真实的浏览器API和正确的事件处理。

### 2. 测试用户交互 {#_2-test-user-interactions}
使用Vitest的[交互API](/api/browser/interactivity)模拟真实用户行为。使用`page.getByRole()`和`userEvent`方法，如我们的 [高级测试模式](#advanced-testing-patterns) 所示：

```tsx
// Good: Test actual user interactions
await page.getByRole('button', { name: /submit/i }).click()
await page.getByLabelText(/email/i).fill('user@example.com')

// Avoid: Testing implementation details
// component.setState({ email: 'user@example.com' })
```

### 3. 测试可访问性 {#_3-test-accessibility}
通过测试键盘导航、焦点管理和ARIA属性，确保组件对所有用户都能正常工作。请查看我们的[测试可访问性](#testing-accessibility)示例了解实用模式：

```tsx
// Test keyboard navigation
await userEvent.keyboard('{Tab}')
await expect.element(document.activeElement).toHaveFocus()

// Test ARIA attributes
await expect.element(modal).toHaveAttribute('aria-modal', 'true')
```

### 4. 模拟外部依赖 {#_4-mock-external-dependencies}
通过模拟API和外部服务，将测试重点放在组件逻辑上。这使得测试更快、更可靠。请查看我们的[隔离策略](#isolation-strategy)获取示例：

```tsx
// For API requests, we recommend using MSW (Mock Service Worker)
// See: https://vitest.dev/guide/mocking/requests
// This provides more realistic request/response mocking

// For module mocking, use the import() syntax
vi.mock(import('../components/UserCard'), () => ({
  default: vi.fn(() => <div>Mocked UserCard</div>)
}))
```

### 5. 使用有意义的测试描述 {#_5-use-meaningful-test-descriptions}
编写测试描述时，应解释预期行为，而不是实现细节：

```tsx
// Good: Describes user-facing behavior
test('shows error message when email format is invalid')
test('disables submit button while form is submitting')

// Avoid: Implementation-focused descriptions
test('calls validateEmail function')
test('sets isSubmitting state to true')
```

## 高级测试模式 {#advanced-testing-patterns}

### 测试组件状态管理 {#testing-component-state-management}

```tsx
// Testing stateful components and state transitions
test('ShoppingCart manages items correctly', async () => {
  const { getByText, getByTestId } = render(<ShoppingCart />)

  // Initially empty
  await expect.element(getByText('Your cart is empty')).toBeInTheDocument()

  // Add item
  await page.getByRole('button', { name: /add laptop/i }).click()

  // Verify state change
  await expect.element(getByText('1 item')).toBeInTheDocument()
  await expect.element(getByText('Laptop - $999')).toBeInTheDocument()

  // Test quantity updates
  await page.getByRole('button', { name: /increase quantity/i }).click()
  await expect.element(getByText('2 items')).toBeInTheDocument()
})
```

### 测试带有数据获取的异步组件 {#testing-async-components-with-data-fetching}
<!-- TODO: translation -->
```tsx
// Option 1: Recommended - Use MSW (Mock Service Worker) for API mocking
import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'

// Set up MSW worker with API handlers
const worker = setupWorker(
  http.get('/api/users/:id', ({ params }) => {
    // Describe the happy path
    return HttpResponse.json({ id: params.id, name: 'John Doe', email: 'john@example.com' })
  })
)

// Start the worker before all tests
beforeAll(() => worker.start())
afterEach(() => worker.resetHandlers())
afterAll(() => worker.stop())

test('UserProfile handles loading, success, and error states', async () => {
  // Test success state
  const { getByText } = render(<UserProfile userId="123" />)
  // expect.element auto-retries until elements are found
  await expect.element(getByText('John Doe')).toBeInTheDocument()
  await expect.element(getByText('john@example.com')).toBeInTheDocument()

  // Test error state by overriding the handler for this test
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
See more details on [using MSW in the browser](https://mswjs.io/docs/integrations/browser).
:::

### Testing Component Communication

```tsx
// Test parent-child component interaction
test('parent and child components communicate correctly', async () => {
  const mockOnSelectionChange = vi.fn()

  const { getByText } = render(
    <ProductCatalog onSelectionChange={mockOnSelectionChange}>
      <ProductFilter />
      <ProductGrid />
    </ProductCatalog>
  )

  // Interact with child component
  await page.getByRole('checkbox', { name: /electronics/i }).click()

  // Verify parent receives the communication
  expect(mockOnSelectionChange).toHaveBeenCalledWith({
    category: 'electronics',
    filters: ['electronics']
  })

  // Verify other child component updates (expect.element auto-retries)
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

  // Test validation triggers
  await submitButton.click()

  await expect.element(getByText('Name is required')).toBeInTheDocument()
  await expect.element(getByText('Email is required')).toBeInTheDocument()
  await expect.element(getByText('Message is required')).toBeInTheDocument()

  // Test partial validation
  await nameInput.fill('John Doe')
  await submitButton.click()

  await expect.element(getByText('Name is required')).not.toBeInTheDocument()
  await expect.element(getByText('Email is required')).toBeInTheDocument()

  // Test email format validation
  await emailInput.fill('invalid-email')
  await submitButton.click()

  await expect.element(getByText('Please enter a valid email')).toBeInTheDocument()

  // Test successful submission
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
// Test how components handle and recover from errors
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

  // Initially working
  await expect.element(getByText('Component working fine')).toBeInTheDocument()

  // Trigger error
  rerender(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  )

  // Error boundary should catch it
  await expect.element(getByText('Something went wrong')).toBeInTheDocument()
})
```

### 测试可访问性 {#testing-accessibility}

```tsx
test('Modal component is accessible', async () => {
  const { getByRole, getByLabelText } = render(
    <Modal isOpen={true} title="Settings">
      <SettingsForm />
    </Modal>
  )

  // Test focus management - modal should receive focus when opened
  // This is crucial for screen reader users to know a modal opened
  const modal = getByRole('dialog')
  await expect.element(modal).toHaveFocus()

  // Test ARIA attributes - these provide semantic information to screen readers
  await expect.element(modal).toHaveAttribute('aria-labelledby') // Links to title element
  await expect.element(modal).toHaveAttribute('aria-modal', 'true') // Indicates modal behavior

  // Test keyboard navigation - Escape key should close modal
  // This is required by ARIA authoring practices
  await userEvent.keyboard('{Escape}')
  // expect.element auto-retries until modal is removed
  await expect.element(modal).not.toBeInTheDocument()

  // Test focus trap - tab navigation should cycle within modal
  // This prevents users from tabbing to content behind the modal
  const firstInput = getByLabelText(/username/i)
  const lastButton = getByRole('button', { name: /save/i })

  // Use click to focus on the first input, then test tab navigation
  await firstInput.click()
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}') // Shift+Tab goes backwards
  await expect.element(lastButton).toHaveFocus() // Should wrap to last element
})
```

## 调试组件测试 {#debugging-component-tests}

### 1. 使用浏览器开发者工具 {#_1-use-browser-dev-tools}

浏览器模式在真实浏览器中运行测试，让你可以使用完整的开发者工具。当测试失败时，你可以：

- **在测试执行期间打开浏览器开发者工具**（按F12或右键点击→检查）
- **在测试代码或组件代码中设置断点**
- **检查DOM**以查看实际渲染的输出
- **检查控制台错误**以查找JavaScript错误或警告
- **监控网络请求**以调试API调用

对于有头模式调试，可以在浏览器配置中临时添加`headless: false`。

### 2. 添加调试语句 {#_2-add-debug-statements}

使用策略性日志记录来理解测试失败：

```tsx
test('debug form validation', async () => {
  render(<ContactForm />)

  const submitButton = page.getByRole('button', { name: /submit/i })
  await submitButton.click()

  // Debug: Check if element exists with different query
  const errorElement = page.getByText('Email is required')
  console.log('Error element found:', errorElement.length)

  await expect.element(errorElement).toBeInTheDocument()
})
```

### 3. 检查渲染输出 {#_3-inspect-rendered-output}

当组件未按预期渲染时，请系统性地进行调查：

**使用Vitest的浏览器UI：**
- 在启用浏览器模式的情况下运行测试
- 打开终端中显示的浏览器URL以查看测试运行情况
- 可视化检查有助于识别CSS问题、布局问题或缺失元素

**测试元素查询：**
```tsx
// Debug why elements can't be found
const button = page.getByRole('button', { name: /submit/i })
console.log('Button count:', button.length) // Should be 1

// Try alternative queries if the first one fails
if (button.length === 0) {
  console.log('All buttons:', page.getByRole('button').length)
  console.log('By test ID:', page.getByTestId('submit-btn').length)
}
```

### 4. 验证选择器 {#_4-verify-selectors}

选择器问题是测试失败的常见原因。请系统性地调试它们：

**检查可访问名称：**
```tsx
// If getByRole fails, check what roles/names are available
const buttons = page.getByRole('button').all()
for (const button of buttons) {
  // Use element() to get the DOM element and access native properties
  const element = button.element()
  const accessibleName = element.getAttribute('aria-label') || element.textContent
  console.log(`Button: "${accessibleName}"`)
}
```

**测试不同的查询策略：**
```tsx
// Multiple ways to find the same element using .or for auto-retrying
const submitButton = page.getByRole('button', { name: /submit/i }) // By accessible name
  .or(page.getByTestId('submit-button')) // By test ID
  .or(page.getByText('Submit')) // By exact text
// Note: Vitest doesn't have page.locator(), use specific getBy* methods instead
```

**常见的选择器调试模式：**
```tsx
test('debug element queries', async () => {
  render(<LoginForm />)

  // Check if element is visible and enabled
  const emailInput = page.getByLabelText(/email/i)
  await expect.element(emailInput).toBeVisible() // Will show if element is visible and print DOM if not
})
```

### 5. 调试异步问题 {#_5-debugging-async-issues}

组件测试经常涉及时机问题：

```tsx
test('debug async component behavior', async () => {
  render(<AsyncUserProfile userId="123" />)

  // expect.element will automatically retry and show helpful error messages
  await expect.element(page.getByText('John Doe')).toBeInTheDocument()
})
```

## 从其他测试框架迁移 {#migration-from-other-testing-frameworks}

### 从 Jest + Testing Library 迁移 {#from-jest-testing-library}

大多数 Jest + Testing Library 测试只需少量更改即可工作：

```ts
// Before (Jest)
import { render, screen } from '@testing-library/react' // [!code --]

// After (Vitest)
import { render } from 'vitest-browser-react' // [!code ++]
```

### 主要差异 {#key-differences}

- 使用 `await expect.element()` 而不是 `expect()` 进行 DOM 断言
- 使用 `vitest/browser` 进行用户交互而不是 `@testing-library/user-event`
- 浏览器模式提供真实的浏览器环境以进行准确的测试

## 了解更多 {#learn-more}

<<<<<<< HEAD
- [浏览器模式文档](/api/browser/)
- [断言API](/api/browser/assertions)
- [交互性API](/api/browser/interactivity)
- [示例仓库](https://github.com/vitest-tests/browser-examples)
=======
- [Browser Mode Documentation](/api/browser/)
- [Assertion API](/api/browser/assertions)
- [Interactivity API](/api/browser/interactivity)
- [Example Repository](https://github.com/vitest-tests/browser-examples)
>>>>>>> 63c27c40d2833c42ec624f3076c90acd960fe8f9
