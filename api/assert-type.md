# assertType

::: warning
运行时，此函数不会执行任何操作。要 [「 启用类型检查 / enable typechecking 」](/guide/testing-types#run-typechecking)，不要忘了传递 `--typecheck`。
:::

- **类型:** `<T>(value: T): void`

你可以使用此函数作为 [`expectTypeOf`](/api/expect-typeof) 的替代方法，可以轻松地断言参数类型等于提供的泛型。

```ts
import { assertType } from 'vitest'

function concat(a: string, b: string): string
function concat(a: number, b: number): number
function concat(a: string | number, b: string | number): string | number

assertType<string>(concat('a', 'b'))
assertType<number>(concat(1, 2))
// @ts-expect-error wrong types
assertType(concat('a', 2))
```
