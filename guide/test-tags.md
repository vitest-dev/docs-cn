---
title: 测试标签 | 指南
outline: deep
---

# 测试标签 <Version>4.1.0</Version> {#test-tags}

允许你在测试用例上添加 [`标签`](/config/tags)，在必要时可以使用标签进行过滤测试，或覆盖测试配置。

## 为什么使用测试标签 {#why-tags}

测试标签适用于共享运行配置的测试套件中使用。例如为数据库查询设置更长的超时时间，或者在 CI 上为集成测试设置重试机制。手动在相关测试上重复设置配置既繁琐又容易出错，并且这些类测试和文件路径并不是一一对应的，因此按文件拆分也不是一个可行的方案。对于那些特别不稳定的测试，它们往往出现在真实有 bug 的地方，而不是集中在 `flaky` 文件里面。

测试标签可以捕获这种类别：定义包含了共享的选项，和标记了该测试标签的测试都会继承这些选项。这些标签名称还可以组合成表达式：`--tags-filter='db && !flaky'` 会运行那些标记为数据库测试但未被标记为不稳定的测试。[`TestRunner.matchesTags`](#checking-tags-filter-at-runtime) 可在运行时使用同样的标签表达式，适用于 `globalSetup` 中包含开销较大的操作，且在没有任何带标签的测试需要执行时，需要跳过这些操作的场景。

## 何时使用标签 {#when-to-reach-for-tags}

| 应用场景 | 使用 |
| --- | --- |
| 对 *一类* 测试设置超时/重试 | **标签** |
| 标记分散在许多文件中的横向分类（`flaky`、`slow`、`frontend`） | **标签** |
| 根据过滤条件有条件地运行开销大的设置 | **标签** + [`matchesTags`](#checking-tags-filter-at-runtime) |
| 通过测试名称匹配来运行子集 | [`-t` / `testNamePattern`](/config/testnamepattern) |
| 通过文件路径来运行子集 | `--include`/`--exclude` |
| 使用不同的 *运行器设置*（测试隔离、运行池、测试环境）运行不同的文件 | [测试项目](/guide/projects) |

可以将测试项目（project）与测试标签结合使用。例如在 `Sequential` 项目中筛选带有 `flaky` 标签的测试。

## 定义标签 {#defining-tags}

Vitest 并未提供任何的内置标签，在默认情况下，标签必须在配置文件中提前进行定义。如果在测试中使用了未在配置文件中定义的标签，测试运行器将会抛出错误。这一行为可以防止因标签名称拼写错误而导致的意外行为。当然你可以修改 [`strictTags`](/config/stricttags) 选项进行禁用。

在标签定义时至少必须包含 `name` 参数，与此同时你还可以定义其他配置参数如 `timeout` 或 `retry`，这些配置参数将应用于使用该标签的所有测试。完整的可用配置参数，参见 [`tags`](/config/tags)。

```ts [vitest.config.js]
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    tags: [
      {
        name: 'frontend',
        description: 'Tests written for frontend.',
      },
      {
        name: 'backend',
        description: 'Tests written for backend.',
      },
      {
        name: 'db',
        description: 'Tests for database queries.',
        timeout: 60_000,
      },
      {
        name: 'flaky',
        description: 'Flaky CI tests.',
        retry: process.env.CI ? 3 : 0,
        timeout: 30_000,
        priority: 1,
      },
    ],
  },
})
```

如果你正在使用 TypeScript，可以扩展 `TestTags` 类型添加一个包含字符串的联合类型来限定的标签可用范围，请确保该文件被包含在 `tsconfig` 中：

```ts [vitest.shims.ts]
import 'vitest'

declare module 'vitest' {
  interface TestTags {
    tags:
      | 'frontend'
      | 'backend'
      | 'db'
      | 'flaky'
  }
}
```

要查看所有可用的标签，可使用 [`--list-tags`](/guide/cli#listtags) 命令：

```shell
vitest --list-tags

frontend: Tests written for frontend.
backend: Tests written for backend.
db: Tests for database queries.
flaky: Flaky CI tests.
```

如果需要以 JSON 格式输出，传入 `--list-tags=json` 参数：

```json
{
  "tags": [
    {
      "name": "frontend",
      "description": "Tests written for frontend."
    },
    {
      "name": "backend",
      "description": "Tests written for backend."
    },
    {
      "name": "db",
      "description": "Tests for database queries.",
      "timeout": 60000
    },
    {
      "name": "flaky",
      "description": "Flaky CI tests.",
      "retry": 0,
      "timeout": 30000,
      "priority": 1
    }
  ],
  "projects": []
}
```

### 解决配置冲突 {#resolving-option-conflicts}

如果多个标签具有相同配置项且应用于同一个测试时，将按从上至下的顺序解析，或按优先级排序解析（数值越低，优先级越高）。未定义优先级的标签会先合并，随后被优先级更高的标签覆盖。

```ts
test('flaky database test', { tags: ['flaky', 'db'] })
// { timeout: 30_000, retry: 3 }
```

注意此时的 `timeout` 是 30 秒而不是 60 秒，因为 `flaky` 标签的优先级为 `1`，而定义了 60 秒超时的 `db` 标签未设置优先级。

如果在当前测试上直接定义，则测试配置项优先级最高：

```ts
test('flaky database test', { tags: ['flaky', 'db'], timeout: 120_000 })
// { timeout: 120_000, retry: 3 }
```

## 在测试中使用标签 {#using-tags-in-tests}

可以通过 `tags` 参数 为单个测试用例或整个测试套件添加标签

```ts
import { describe, test } from 'vitest'

test('renders homepage', { tags: ['frontend'] }, () => {
  // ...
})

describe('API endpoints', { tags: ['backend'] }, () => {
  test('returns user data', () => {
    // 此测试会继承父级测试套件的 "backend" 标签
  })

  test('validates input', { tags: ['validation'] }, () => {
    // 此测试同时拥有 "backend"（继承）和 "validation" 标签
  })
})
```

标签会从父级测试套件中继承下来，因此所有位于已标记 `describe` 代码块内的测试都会自动添加该标签。

还可以在文件顶部使用 JSDoc 的 `@module-tag` 为文件中的所有测试定义 `标签`：

```ts
/**
 * Auth tests
 * @module-tag admin/pages/dashboard
 * @module-tag acceptance
 */

test('dashboard renders items', () => {
  // ...
})
```

::: danger
JSDoc 注释中的 `@module-tag` 会作用于该文件内的所有测试，而不仅是紧跟注释其后的单个测试。

请看以下示例：

```js{3,10}
describe('forms', () => {
  /**
   * @module-tag frontend
   */
  test('renders a form', () => {
    // ...
  })

  /**
   * @module-tag db
   */
  test('db returns users', () => {
    // ...
  })
})
```

在上诉例子中，文件内的每个测试都会同时带有 `frontend` 和 `db` 标签。若需为单个测试添加标签，请改用配置参数形式：

```js{2,6}
describe('forms', () => {
  test('renders a form', { tags: 'frontend' }, () => {
    // ...
  })

  test('db returns users', { tags: 'db' }, () => {
    // ...
  })
})
```

:::

## 按标签筛选用例 {#filtering-tests-by-tag}

要仅运行带有指定标签的用例，可使用 [`--tags-filter`](/guide/cli#tagsfilter) 命令行参数：

```shell
vitest --tags-filter=frontend
vitest --tags-filter="frontend and backend"
```

如果使用 UI 模式，你可以在过滤器中使用标签表达式进行过滤，例如 `tag:` 加前缀

<img alt="The tags filter in Vitest UI" img-light src="/ui/light-ui-tags.png">
<img alt="The tags filter in Vitest UI" img-dark src="/ui/dark-ui-tags.png">

如果你使用编程式 API，可将 `tagsFilter` 参数传递给 [`startVitest`](/guide/advanced/#startvitest) 或 [`createVitest`](/guide/advanced/#createvitest)：

```ts
import { startVitest } from 'vitest/node'

await startVitest([], {
  tagsFilter: ['frontend and backend'],
})
```

也可创建包含自定义筛选器的 [test specification](/api/advanced/test-specification)：

```ts
const specification = vitest.getRootProject().createSpecification(
  '/path-to-file.js',
  {
    testTagsFilter: ['frontend and backend'],
  },
)
```

### 语法 {#syntax}

可通过多种方式组合标签。Vitest 支持以下关键字：

- `and` 或 `&&` 表示同时满足两个表达式
- `or` 或 `||` 表示至少满足一个表达式
- `not` 或 `!` 表示排除指定表达式
- `*` 表示匹配任意数量字符（0 个或多个）
- `()` 表示分组表达式并提升优先级

解析器将遵循标准 [运算符优先级](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence)：`not`/`!` 优先级最高，其次是 `and`/`&&`，最后是 `or`/`||`。使用括号将提升优先级。

::: warning 保留字
标签名称不能为 `and`, `or`, 或 `not`（不区分大小写），这些都是保留字。标签名称也不能包含特殊字符（`(`， `)`， `&`， `|`， `!`， `*`，空格），这些字符已经被表达式解析器占用。
:::

### 通配符 {#wildcards}

使用（`*`）可以匹配任意数量字符：

```shell
vitest --tags-filter="unit/*"
```

将会匹配到类似 `unit/components`， `unit/utils` 等标签。

### 排除标签 {#excluding-tags}

在标签前添加感叹号（`!`）或使用 “not” 关键字可排除指定标签的测试：

```shell
vitest --tags-filter="!slow and not flaky"
```

### 示例 {#examples}

以下是常见的筛选命令示例：

```shell
# 仅运行 unit 的测试
vitest --tags-filter="unit"

# 运行同时满足 frontend 和 fast 的测试
vitest --tags-filter="frontend and fast"

# 运行 unit 测试或 e2e 测试
vitest --tags-filter="unit or e2e"

# 运行除 slow 测试外的所有测试
vitest --tags-filter="!slow"

# 运行 frontend 且非不稳定的测试
vitest --tags-filter="frontend && !flaky"

# 运行匹配通配符模式的测试
vitest --tags-filter="api/*"

# 带括号的复杂表达式
vitest --tags-filter="(unit || e2e) && !slow"

# 运行数据库测试（PostgreSQL 或 MySQL）且非慢速的测试
vitest --tags-filter="db && (postgres || mysql) && !slow"
```

支持传递多个 `--tags-filter` 参数，它们会使用 AND 逻辑相组合：

```shell
# 运行（unit 或 e2e 测试）且非慢速的测试
vitest --tags-filter="unit || e2e" --tags-filter="!slow"
```

### 运行时检查标签过滤器 {#checking-tags-filter-at-runtime}

你可以使用 `TestRunner.matchesTags` 方法来检查当前标签过滤器是否匹配一组标签。该特性特别适用于按需执行高开销的初始化逻辑，当相关测试的标签被包含时才运行：

```ts
import { beforeAll, TestRunner } from 'vitest'

beforeAll(async () => {
  // 当使用 "vitest --tags-filter db" 时初始化数据库
  if (TestRunner.matchesTags(['db'])) {
    await seedDatabase()
  }
})
```

该方法接收一个标签数组作为参数，如果当前 `--tags-filter` 会包含带有这些标签的测试，则返回 `true`。如果未启用标签过滤器，则始终返回 `true`。

## 另请参阅 {#see-also}

- [按文件隔离](/guide/recipes/disable-isolation) 和 [并行与顺序测试文件](/guide/recipes/parallel-sequential) 都是通过测试项目参数按文件划分测试。对于需要使用不同运行器配置，而不是仅调整不同超时时间或重试次数的测试分类，适合使用测试项目参数。
- [测试过滤](/guide/filtering) 覆盖了 `-t`、`--include` 以及其他 CLI 过滤器。
- 参考 [`tags`](/config/tags) 和 [`strictTags`](/config/stricttags) 配置。
