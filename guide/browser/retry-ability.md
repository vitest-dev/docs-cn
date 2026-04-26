---
title: 重试机制 | 浏览器模式
---

# 重试机制 {#retry-ability}

浏览器中的测试由于其异步特性，可能会不一致地失败。因此，即使条件延迟（如超时、网络请求或动画），也必须有办法保证断言成功。为此，Vitest 通过 [`expect.poll`](/api/expect#poll)和 `expect.element` API 提供了可重试的断言：

```ts
import { screen } from '@testing-library/dom'
import { expect, test } from 'vitest'

test('error banner is rendered', async () => {
  triggerError()

  // @testing-library 提供具备内置重试能力的查询方法
  // 将持续尝试查找 banner 直到其渲染完成
  const banner = await screen.findByRole('alert', {
    name: /error/i,
  })

  // Vitest 提供具备内置重试能力的 `expect.element`
  // 将持续检查 `element.textContent` 直到其等于 "Error!"
  await expect.element(banner).toHaveTextContent('Error!')
})
```

::: tip
`expect.element` 是 `expect.poll(() => element)`的简写，工作方式完全相同。

`toHaveTextContent` 和所有其他 [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom)断言在没有内置重试机制的常规`expect`中仍然可用：

```ts
// 如果 .textContent 不是 `'Error!'` 将立即失败
expect(banner).toHaveTextContent('Error!')
```
:::
