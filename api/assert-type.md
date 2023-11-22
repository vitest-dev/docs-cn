# assertType

<<<<<<< HEAD
  - **类型:** `<T>(value: T): void`

  你可以使用此函数作为 [`expectTypeOf`](/api/expect-typeof) 的替代方法，以轻松地断言参数类型等于提供的泛型。
=======
::: warning
During runtime this function doesn't do anything. To [enable typechecking](/guide/testing-types#run-typechecking), don't forget to pass down `--typecheck` flag.
:::

- **Type:** `<T>(value: T): void`
>>>>>>> 58b22ab4a7c3e7417aca19988cba5f23156b97c0

You can use this function as an alternative for [`expectTypeOf`](/api/expect-typeof) to easily assert that the argument type is equal to the generic provided.

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
