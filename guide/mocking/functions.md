# 模拟函数 {#mocking-functions}

模拟函数可以分为两个不同的类别：监视(spying)和模拟(mocking)。

如果你需要观察对象上方法的行为，你可以使用 [`vi.spyOn()`](/api/vi#vi-spyon) 来创建一个间谍，用于跟踪对该方法的调用。

如果你需要传递自定义函数实现作为参数或创建新的模拟实体，你可以使用 [`vi.fn()`](/api/vi#vi-fn) 来创建一个模拟函数。

`vi.spyOn` 和 `vi.fn` 都共享相同的方法。

## 示例 {#example}

```js
import { afterEach, describe, expect, it, vi } from 'vitest'

const messages = {
  items: [
    { message: 'Simple test message', from: 'Testman' },
    // ...
  ],
  addItem(item) {
    messages.items.push(item)
    messages.callbacks.forEach(callback => callback(item))
  },
  onItem(callback) {
    messages.callbacks.push(callback)
  },
  getLatest, // can also be a `getter or setter if supported`
}

function getLatest(index = messages.items.length - 1) {
  return messages.items[index]
}

it('should get the latest message with a spy', () => {
  const spy = vi.spyOn(messages, 'getLatest')
  expect(spy.getMockName()).toEqual('getLatest')

  expect(messages.getLatest()).toEqual(
    messages.items[messages.items.length - 1],
  )

  expect(spy).toHaveBeenCalledTimes(1)

  spy.mockImplementationOnce(() => 'access-restricted')
  expect(messages.getLatest()).toEqual('access-restricted')

  expect(spy).toHaveBeenCalledTimes(2)
})

it('passing down the mock', () => {
  const callback = vi.fn()
  messages.onItem(callback)

  messages.addItem({ message: 'Another test message', from: 'Testman' })
  expect(callback).toHaveBeenCalledWith({
    message: 'Another test message',
    from: 'Testman',
  })
})
```
