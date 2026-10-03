---
title: changed | 配置
outline: deep
---

### changed <CRoot />

- **类型:** `boolean | string`
- **默认值:** `false`
- **命令行终端:** `--changed`, `--changed=HEAD~1`

仅运行受文件变更影响的测试。未指定值时，Vitest 会根据尚未提交的变更（包括已暂存和未暂存的变更）筛选并运行测试。

要运行受最近一次提交影响的测试，可使用 `--changed HEAD~1`。也可以传入提交哈希（例如 `--changed 09a9920`）或分支名称（例如 `--changed origin/develop`）。

启用代码覆盖率时，报告中只会包含与这些变更相关的文件。

<<<<<<< HEAD
与 [`forceRerunTriggers`](/config/forcereruntriggers) 配置项配合使用时，只要列表中的任一文件发生变更，Vitest 就会运行整个测试套件。默认情况下，只要 Vitest 配置文件或 `package.json` 发生变更，也会重新运行整个测试套件。
=======
Changes to files that every test file in a project depends on rerun all tests of that project: [`setupFiles`](/config/setupfiles), [`globalSetup`](/config/globalsetup), a custom [`runner`](/config/runner) or [`environment`](/config/environment), [`snapshotSerializers`](/config/snapshotserializers), the `.env` files loaded from [`envDir`](https://vite.dev/config/shared-options#envdir), and the project's config file with everything it imports. Vitest also follows the environment set in a `@vitest-environment` comment, the `__mocks__` files used by `vi.mock` calls without a factory, and the snapshot file of each test. Files passed to `toMatchFileSnapshot` are not tracked.

If paired with the [`forceRerunTriggers`](/config/forcereruntriggers) config option it will run the whole test suite if at least one of the files listed in the `forceRerunTriggers` list changes. By default, changes to the Vitest config file and `package.json` will always rerun the whole suite.
>>>>>>> 9090f1432b6c7b03dcae1dfd84f09caaf62fb933
