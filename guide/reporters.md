---
title: 报告器 | 指南
outline: deep
---

# 报告器

Vitest 提供了几种内置报告器，以不同格式显示测试输出，以及使用自定义报告器的能力。你可以使用 `--reporter` 命令行选项，或者在你的 `outputFile`[配置选项](https://vitest.dev/config/#reporters) 中加入 `reporters` 属性来选择不同的报告器。如果没有指定报告器，Vitest 将使用下文所述的默认报告器。

通过命令行使用报告器:

```bash
npx vitest --reporter=verbose
```

通过配置文件 [`vitest.config.ts`](/config/) 使用报告器:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['verbose'],
  },
})
```

某些报告器可以通过传递附加选项进行自定义。具体选项将在下面的章节中介绍。

```ts
export default defineConfig({
  test: {
    reporters: ['default', ['junit', { suiteName: 'UI tests' }]],
  },
})
```

## 报告器输出

默认情况下，Vitest 的报告器会将输出打印到终端。当使用 `json` 、`html` 或 `junit` 报告器时，你可以在 Vite 配置文件中或通过 CLI 加入 `outputFile` [配置选项](https://vitest.dev/config/#outputfile)，将测试输出写入文件。

:::code-group

```bash [CLI]
npx vitest --reporter=json --outputFile=./test-output.json
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: ['json'],
    outputFile: './test-output.json',
  },
})
```

:::

## 组合报告器

你可以同时使用多个报告器，并以不同格式打印测试结果。

例如:

```bash
npx vitest --reporter=json --reporter=default
```

```ts
export default defineConfig({
  test: {
    reporters: ['json', 'default'],
    outputFile: './test-output.json',
  },
})
```

上面的示例将同时把测试结果以默认样式打印到终端，和以 JSON 格式写入指定的输出文件。

使用多个报告器时，还可以指定多个输出文件，如下所示:

```ts
export default defineConfig({
  test: {
    reporters: ['junit', 'json', 'verbose'],
    outputFile: {
      junit: './junit-report.xml',
      json: './json-report.json',
    },
  },
})
```

这个示例将编写单独的 JSON 和 XML 报告，并将详细报告打印到终端。

## 内置报告器

### 默认报告器

默认情况下（即如果没有指定报告器），Vitest 会在底部显示运行测试的摘要及其状态。一旦测试套件通过，其状态将被报告在摘要的顶部。

我们可以通过配置报告器来禁用摘要：

:::code-group
```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: [
      ['default', { summary: false }]
    ]
  },
})
```
:::

项目中的测试输出示例:

```bash
 ✓ test/example-1.test.ts (5 tests | 1 skipped) 306ms
 ✓ test/example-2.test.ts (5 tests | 1 skipped) 307ms

 ❯ test/example-3.test.ts 3/5
 ❯ test/example-4.test.ts 1/5

 Test Files 2 passed (4)
      Tests 10 passed | 3 skipped (65)
   Start at 11:01:36
   Duration 2.00s
```

测试完成后的最终输出:

```bash
 ✓ test/example-1.test.ts (5 tests | 1 skipped) 306ms
 ✓ test/example-2.test.ts (5 tests | 1 skipped) 307ms
 ✓ test/example-3.test.ts (5 tests | 1 skipped) 307ms
 ✓ test/example-4.test.ts (5 tests | 1 skipped) 307ms

 Test Files  4 passed (4)
      Tests  16 passed | 4 skipped (20)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
```

If there is only one test file running, Vitest will output the full test tree of that file, simillar to the [`tree`](#tree-reporter) reporter. The default reporter will also print the test tree if there is at least one failed test in the file.

```bash
✓ __tests__/file1.test.ts (2) 725ms
   ✓ first test file (2) 725ms
     ✓ 2 + 2 should equal 4
     ✓ 4 - 2 should equal 2

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
```

### 详细报告器

详细报告器会在每个测试用例完成后打印出来。它不会单独报告套件或文件。如果启用了 `--includeTaskLocation`，它还会在输出中包含每个测试的位置。与 `default` 报告器类似，你可以通过配置报告器来禁用摘要。

除此之外，`verbose` 报告器会立即打印测试错误消息。完整的测试错误会在测试运行结束时报告。

这是唯一一个在测试未失败时报告[注解](/guide/test-annotations)的终端报告器。

:::code-group

```bash [CLI]
npx vitest --reporter=verbose
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: [
      ['verbose', { summary: false }]
    ]
  },
})
```

:::

Example output:

```bash
✓ __tests__/file1.test.ts > first test file > 2 + 2 should equal 4 1ms
✓ __tests__/file1.test.ts > first test file > 4 - 2 should equal 2 1ms
✓ __tests__/file2.test.ts > second test file > 1 + 1 should equal 2 1ms
✓ __tests__/file2.test.ts > second test file > 2 - 1 should equal 1 1ms

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
```

An example with `--includeTaskLocation`:

```bash
✓ __tests__/file1.test.ts:2:1 > first test file > 2 + 2 should equal 4 1ms
✓ __tests__/file1.test.ts:3:1 > first test file > 4 - 2 should equal 2 1ms
✓ __tests__/file2.test.ts:2:1 > second test file > 1 + 1 should equal 2 1ms
✓ __tests__/file2.test.ts:3:1 > second test file > 2 - 1 should equal 1 1ms

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
```

### 树状报告器

树状报告器与 `default` 报告器相同，但它还会在套件完成后显示每个单独的测试。与 `default` 报告器类似，你可以通过配置报告器来禁用摘要。

:::code-group
```bash [CLI]
npx vitest --reporter=tree
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: [
      ['tree', { summary: false }]
    ]
  },
})
```
:::

使用默认 `slowTestThreshold: 300` 的情况下，测试进行中的示例输出：

```bash
 ✓ __tests__/example-1.test.ts (2) 725ms
   ✓ first test file (2) 725ms
     ✓ 2 + 2 should equal 4
     ✓ 4 - 2 should equal 2

 ❯ test/example-2.test.ts 3/5
   ↳ should run longer than three seconds 1.57s
 ❯ test/example-3.test.ts 1/5

 Test Files 2 passed (4)
      Tests 10 passed | 3 skipped (65)
   Start at 11:01:36
   Duration 2.00s
```

测试套件通过后的终端最终输出示例:

```bash
✓ __tests__/file1.test.ts (2) 725ms
   ✓ first test file (2) 725ms
     ✓ 2 + 2 should equal 4
     ✓ 4 - 2 should equal 2
✓ __tests__/file2.test.ts (2) 746ms
  ✓ second test file (2) 746ms
    ✓ 1 + 1 should equal 2
    ✓ 2 - 1 should equal 1

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
```

### Dot 报告器

每当一个测试完成时，就会打印一个点，以最小化输出量，同时让你看到所有执行过的测试。只有当测试失败时才会显示详细信息，并在最后提供套件的汇总。

:::code-group

```bash [CLI]
npx vitest --reporter=dot
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: ['dot'],
  },
})
```

:::

测试套件通过后的终端最终输出示例:

```bash
....

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
```

### JUnit 报告器

以 JUnit XML 格式输出测试结果报告。既可打印到终端，也可使用 [`outputFile`](##报告器输出) 配置选项写入 XML 文件。

:::code-group

```bash [CLI]
npx vitest --reporter=junit
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: ['junit'],
  },
})
```

:::

JUnit XML 报告示例:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<testsuites name="vitest tests" tests="2" failures="1" errors="0" time="0.503">
    <testsuite name="__tests__/test-file-1.test.ts" timestamp="2023-10-19T17:41:58.580Z" hostname="My-Computer.local" tests="2" failures="1" errors="0" skipped="0" time="0.013">
        <testcase classname="__tests__/test-file-1.test.ts" name="first test file &gt; 2 + 2 should equal 4" time="0.01">
            <failure message="expected 5 to be 4 // Object.is equality" type="AssertionError">
AssertionError: expected 5 to be 4 // Object.is equality
 ❯ __tests__/test-file-1.test.ts:20:28
            </failure>
        </testcase>
        <testcase classname="__tests__/test-file-1.test.ts" name="first test file &gt; 4 - 2 should equal 2" time="0">
        </testcase>
    </testsuite>
</testsuites>
```

输出的 XML 包含嵌套的 `testsuites` 和 `testcase` 标签。这些也可以通过报告选项 `suiteName` 和 `classnameTemplate` 进行自定义。`classnameTemplate` 可以是一个模板字符串或者一个函数。

`classnameTemplate` 选项支持的占位符有：
- filename
- filepath

```ts
export default defineConfig({
  test: {
    reporters: [
      ['junit', { suiteName: 'custom suite name', classnameTemplate: 'filename:{filename} - filepath:{filepath}' }]
    ]
  },
})
```

输出的 XML 包含嵌套的 `testsuites` 和 `testcase` 标记。你可以使用环境变量 `VITEST_JUNIT_SUITE_NAME` 和 `VITEST_JUNIT_CLASSNAME` 分别配置它们的名称和类名属性。

### JSON 报告器

以与 Jest 的 `--json` 选项兼容的 JSON 格式生成测试结果报告。可以打印到终端，也可以使用 [`outputFile`](/config/#outputfile) 配置选项写入文件。

:::code-group

```bash [CLI]
npx vitest --reporter=json
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: ['json'],
  },
})
```

:::

JSON 报告示例:

```json
{
  "numTotalTestSuites": 4,
  "numPassedTestSuites": 2,
  "numFailedTestSuites": 1,
  "numPendingTestSuites": 1,
  "numTotalTests": 4,
  "numPassedTests": 1,
  "numFailedTests": 1,
  "numPendingTests": 1,
  "numTodoTests": 1,
  "startTime": 1697737019307,
  "success": false,
  "testResults": [
    {
      "assertionResults": [
        {
          "ancestorTitles": ["", "first test file"],
          "fullName": " first test file 2 + 2 should equal 4",
          "status": "failed",
          "title": "2 + 2 should equal 4",
          "duration": 9,
          "failureMessages": ["expected 5 to be 4 // Object.is equality"],
          "location": {
            "line": 20,
            "column": 28
          },
          "meta": {}
        }
      ],
      "startTime": 1697737019787,
      "endTime": 1697737019797,
      "status": "failed",
      "message": "",
      "name": "/root-directory/__tests__/test-file-1.test.ts"
    }
  ],
  "coverageMap": {}
}
```

::: info
自Vitest 3起，如果启用了代码覆盖率功能，JSON 报告器会在 `coverageMap` 中包含覆盖率信息。
:::

### HTML 报告器

生成 HTML 文件，通过交互式 [GUI](/guide/ui) 查看测试结果。文件生成后，Vitest 将保持本地开发服务器运行，并提供一个链接，以便在浏览器中查看报告。

可使用 [`outputFile`](##报告器输出) 配置选项指定输出文件。如果没有提供 `outputFile` 选项，则会创建一个新的 HTML 文件。

:::code-group

```bash [CLI]
npx vitest --reporter=html
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: ['html'],
  },
})
```

:::

::: tip
该报告器需要安装 [`@vitest/ui`](/guide/ui) 。
:::

### TAP 报告器

按照 [Test Anything Protocol](https://testanything.org/) (TAP)输出报告。

:::code-group

```bash [CLI]
npx vitest --reporter=tap
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: ['tap'],
  },
})
```

:::

TAP 报告示例:

```bash
TAP version 13
1..1
not ok 1 - __tests__/test-file-1.test.ts # time=14.00ms {
    1..1
    not ok 1 - first test file # time=13.00ms {
        1..2
        not ok 1 - 2 + 2 should equal 4 # time=11.00ms
            ---
            error:
                name: "AssertionError"
                message: "expected 5 to be 4 // Object.is equality"
            at: "/root-directory/__tests__/test-file-1.test.ts:20:28"
            actual: "5"
            expected: "4"
            ...
        ok 2 - 4 - 2 should equal 2 # time=1.00ms
    }
}
```

### TAP 扁平报告器

输出 TAP 扁平报告。与 `TAP Reporter` 一样，测试结果的格式遵循 TAP 标准，但测试套件的格式是扁平列表，而不是嵌套层次结构。

:::code-group

```bash [CLI]
npx vitest --reporter=tap-flat
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: ['tap-flat'],
  },
})
```

:::

TAP 扁平报告示例:

```bash
TAP version 13
1..2
not ok 1 - __tests__/test-file-1.test.ts > first test file > 2 + 2 should equal 4 # time=11.00ms
    ---
    error:
        name: "AssertionError"
        message: "expected 5 to be 4 // Object.is equality"
    at: "/root-directory/__tests__/test-file-1.test.ts:20:28"
    actual: "5"
    expected: "4"
    ...
ok 2 - __tests__/test-file-1.test.ts > first test file > 4 - 2 should equal 2 # time=0.00ms
```

### Hanging process 报告器

展示任何妨碍 Vitest 安全退出的 hanging processes ，`hanging-process` 报告器本身不显示测试结果，但可与其他报告器结合使用，以便在测试运行时监控进程。使用这个报告器可能会消耗大量资源，因此通常应保留用于在 Vitest 无法正常退出进程的情况下进行调试的目的。

:::code-group

```bash [CLI]
npx vitest --reporter=hanging-process
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: ['hanging-process'],
  },
})
```

:::

### GitHub Actions Reporter {#github-actions-reporter}

输出 [工作流命令](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message)
为测试失败提供注释。当 `process.env.GITHUB_ACTIONS === 'true'` 时，会自动启用 [`default`](#default-reporter)报告器。

<img alt="GitHub Actions" img-dark src="https://github.com/vitest-dev/vitest/assets/4232207/336cddc2-df6b-4b8a-8e72-4d00010e37f5">
<img alt="GitHub Actions" img-light src="https://github.com/vitest-dev/vitest/assets/4232207/ce8447c1-0eab-4fe1-abef-d0d322290dca">

当你使用自定义报告器时，如果想在 GitHub Actions 中显示结果，需要手动把 `github-actions` 添加到报告器列表中。

```ts
export default defineConfig({
  test: {
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
  },
})
```

你可以使用 `onWritePath` 选项自定义以 [GitHub 注解命令格式](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions) 打印的文件路径。这在容器化环境（如 Docker）中运行 Vitest 时非常有用，因为在这些环境中文件路径可能与 GitHub Actions 环境中的路径不匹配。

```ts
export default defineConfig({
  test: {
    reporters: process.env.GITHUB_ACTIONS
      ? [
          'default',
          ['github-actions', { onWritePath(path) {
            return path.replace(/^\/app\//, `${process.env.GITHUB_WORKSPACE}/`)
          } }],
        ]
      : ['default'],
  },
})
```

### Blob Reporter

将测试结果存储在计算机上，以便以后可以使用 [`--merge-reports`](/guide/cli#merge-reports) 命令进行合并。
默认情况下，将所有结果存储在 `.vitest-reports` 文件夹中，但可以用 `--outputFile` 或 `--outputFile.blob` 标志覆盖。

```bash
npx vitest --reporter=blob --outputFile=reports/blob-1.json
```

如果你在带有 [`--shard`](/guide/cli#shard) 标志的不同机器上运行 Vitest，我们建议你使用此报告程序。
使用 CI 管道末尾的 `--merge-reports` 命令，可以将所有 blob 报告合并到任何报告中：

```bash
npx vitest --merge-reports=reports --reporter=json --reporter=default
```

::: tip
Both `--reporter=blob` and `--merge-reports` do not work in watch mode.
:::

## 自定义报告器

你可以使用从 NPM 安装的第三方自定义报告器，方法是在 `reporter` 选项中指定它们的软件包名称:

:::code-group

```bash [CLI]
npx vitest --reporter=some-published-vitest-reporter
```

```ts [vitest.config.ts]
export default defineConfig({
  test: {
    reporters: ['some-published-vitest-reporter'],
  },
})
```

:::

此外，你还可以定义自己的[自定义报告器](/advanced/reporters)，并通过指定文件路径来使用它们:

```bash
npx vitest --reporter=./path/to/reporter.ts
```

自定义报告器应实现[报告器接口](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/types/reporter.ts)。
