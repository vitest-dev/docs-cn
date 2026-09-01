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
<!-- TODO: translation -->
Notice that this class defines its members in two different ways, and the difference matters for mocking:

- `greet` is a class field. The assignment runs during construction, so every instance gets its own copy of the function as its own property.
- `speak`, `isHungry`, and `feed` are prototype methods. They are created once and stored on `Dog.prototype`, an object that all instances share. An instance doesn't have a `speak` property of its own: when you call `dog.speak()`, JavaScript doesn't find `speak` on the instance and continues looking on `Dog.prototype`. Every instance finds the same function there, so `dog.speak === Dog.prototype.speak` is `true`.

We can re-create this class with `vi.fn` (or `vi.spyOn().mockImplementation()`). By defining every method as a class field, each instance gets its own separate mock, which allows checking calls on a single instance:

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
  isHungry = vi.fn(() => false)
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
<!-- TODO: translation -->
You don't have to redefine every method as a class field. Instances keep the prototype chain of the class you pass to `vi.fn`, so prototype methods stay available on instances, both during and after construction, and instances pass `instanceof` checks against that class:

```ts
class OriginalDog {
  constructor(name) {
    this.name = name
  }

  speak() {
    return 'bark!'
  }
}

const MockedDog = vi.fn(OriginalDog)
const dog = new MockedDog('Cooper')

dog.speak() // bark!
dog instanceof MockedDog // true
dog instanceof OriginalDog // true
```

Note that nothing is mocked in this example. Unlike the `speak = vi.fn()` field in the `Dog` example above, the instance doesn't receive its own mock function. `dog.speak` is found through the prototype chain and refers to the original class method (`dog.speak === MockedDog.prototype.speak`), so call assertions throw:

```ts
expect(dog.speak).toHaveBeenCalled()
// TypeError: [Function speak] is not a spy or a call to a spy!
```

Since every instance finds `speak` on the prototype, you can mock it for all of them at once by assigning a mock there:

```ts
MockedDog.prototype.speak = vi.fn(() => 'woof!')

const cooper = new MockedDog('Cooper')
const max = new MockedDog('Max')

cooper.speak() // woof!
max.speak() // woof!

// calls from both instances are recorded by the same mock
expect(MockedDog.prototype.speak).toHaveBeenCalledTimes(2)
// `mock.contexts` keeps the instance of every call
expect(vi.mocked(MockedDog.prototype.speak).mock.contexts).toEqual([cooper, max])
```

Assigning on `MockedDog.prototype` instead of `OriginalDog.prototype` keeps the original class untouched: the lookup order is `instance` → `MockedDog.prototype` → `OriginalDog.prototype`, so the assigned function shadows the original method. Because instances look the method up on every call rather than keeping a copy, the mock is visible to all of them, even those created before the assignment. The trade-off is that they also share a single call history, unlike class fields, which give every instance its own mock.

::: warning
The mock's `prototype` always follows the current implementation: it is re-pointed when you set a new implementation, when a queued `mockImplementationOnce` class is constructed, and when the mock is reset. If a single mock uses different class implementations, instances created by earlier implementations lose access to their prototype methods once a newer implementation takes over. Own properties assigned in the constructor or via class fields are not affected.
:::

If you want to mock the method of one instance only, use [`vi.spyOn`](/api/vi#vi-spyon). It defines the mock directly on that instance, shadowing the prototype method just for it:

```ts
const cooper = new MockedDog('Cooper')
const max = new MockedDog('Max')

vi.spyOn(cooper, 'speak').mockReturnValue('meow!')

cooper.speak() // meow!
max.speak() // bark!, still the original method

expect(cooper.speak).toHaveBeenCalledTimes(1)
```

When methods are defined as class fields, like in the mocked `Dog` class at the top of this page, every instance already has its own mock, so you can reassign the return value for a specific instance directly:

```ts
const dog = new Dog('Cooper')

// "vi.mocked" 是一个类型辅助工具，因为
// TypeScript 不知道 Dog 是一个被模拟的类，
// 它将任何函数包装在 Mock<T> 类型中
// 而不会验证该函数是否为模拟函数
vi.mocked(dog.speak).mockReturnValue('woof woof')

dog.speak() // woof woof
```

要模拟非函数属性，例如 `name`，我们可以使用 `vi.spyOn(dog, 'name', 'get')` 方法。这样就可以在模拟属性上使用对象监听断言：

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
