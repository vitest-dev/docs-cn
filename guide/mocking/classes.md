# 模拟类 {#mocking-classes}

你可以通过一次 [`vi.fn`](/api/vi#fn) 调用来模拟整个类。

```ts
class Dog {
  name: string

  constructor(name: string) {
    this.name = name
  }

  static getType(): string {
    return 'animal'
  }

  greet = (): string => {
    return `Hi! My name is ${this.name}!`
  }

  speak(): string {
    return 'bark!'
  }

  isHungry() {}
  feed() {}
}
```

我们可以使用 `vi.fn`（或 `vi.spyOn().mockImplementation()`）来重新创建这个类：

```ts
const Dog = vi.fn(class {
  static getType = vi.fn(() => 'mocked animal')

  constructor(name) {
    this.name = name
  }

  greet = vi.fn(() => `Hi! My name is ${this.name}!`)
  speak = vi.fn(() => 'loud bark!')
  feed = vi.fn()
})
```

::: warning
如果构造函数返回一个非原始值，那么该值将成为 new 表达式的结果。在这种情况下，`[[Prototype]]` 可能无法正确绑定：

```ts
const CorrectDogClass = vi.fn(function (name) {
  this.name = name
})

const IncorrectDogClass = vi.fn(name => ({
  name
}))

const Marti = new CorrectDogClass('Marti')
const Newt = new IncorrectDogClass('Newt')

Marti instanceof CorrectDogClass // ✅ true
Newt instanceof IncorrectDogClass // ❌ false!
```

如果你正在模拟类，建议优先使用类语法而不是函数语法。
:::

::: tip 何时使用？
一般来说，如果类是从另一个模块重新导出的，你会在模块工厂内部重新创建这样的类：

```ts
import { Dog } from './dog.js'

vi.mock(import('./dog.js'), () => {
  const Dog = vi.fn(class {
    feed = vi.fn()
    // 模拟其他内容...
  })
  return { Dog }
})
```

这种方法也可以用于将类的实例传递给接受相同接口的函数：

```ts [src/feed.ts]
function feed(dog: Dog) {
  // ...
}
```
```ts [tests/dog.test.ts]
import { expect, test, vi } from 'vitest'
import { feed } from '../src/feed.js'

const Dog = vi.fn(class {
  feed = vi.fn()
})

test('can feed dogs', () => {
  const dogMax = new Dog('Max')

  feed(dogMax)

  expect(dogMax.feed).toHaveBeenCalled()
  expect(dogMax.isHungry()).toBe(false)
})
```
:::

现在，当我们创建 `Dog` 类的新实例时，它的 `speak` 方法（以及 `feed` 和 `greet` 方法）已经被模拟了：

```ts
const Cooper = new Dog('Cooper')
Cooper.speak() // loud bark!
Cooper.greet() // Hi! My name is Cooper!

// 你可以使用内置断言来检查调用的有效性
expect(Cooper.speak).toHaveBeenCalled()
expect(Cooper.greet).toHaveBeenCalled()

const Max = new Dog('Max')

// 如果你直接赋值方法，这些方法在实例之间不会共享
expect(Max.speak).not.toHaveBeenCalled()
expect(Max.greet).not.toHaveBeenCalled()
```

我们可以为特定实例重新分配返回值：

```ts
const dog = new Dog('Cooper')

// "vi.mocked" 是一个类型辅助工具，因为
// TypeScript 不知道 Dog 是一个被模拟的类，
// 它将任何函数包装在 Mock<T> 类型中
// 而不会验证该函数是否为模拟函数
vi.mocked(dog.speak).mockReturnValue('woof woof')

dog.speak() // woof woof
```

要模拟属性，我们可以使用 `vi.spyOn(dog, 'name', 'get')` 方法。这样就可以在模拟属性上使用间谍断言：

```ts
const dog = new Dog('Cooper')

const nameSpy = vi.spyOn(dog, 'name', 'get').mockReturnValue('Max')

expect(dog.name).toBe('Max')
expect(nameSpy).toHaveBeenCalledTimes(1)
```

::: tip
你也可以使用相同的方法来监视 getter 和 setter。
:::

::: danger
在 Vitest 4 中引入了使用 `vi.fn()` 模拟类的功能。在此之前，你必须直接使用 `function` 和 `prototype` 继承。参见 [v3 指南](https://v3.cn.vitest.dev/guide/mocking.html#classes)。
:::
