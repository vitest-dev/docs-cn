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

与 [`forceRerunTriggers`](/config/forcereruntriggers) 配置项配合使用时，只要列表中的任一文件发生变更，Vitest 就会运行整个测试套件。默认情况下，只要 Vitest 配置文件或 `package.json` 发生变更，也会重新运行整个测试套件。
