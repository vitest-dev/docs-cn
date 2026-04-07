---
title: snapshotEnvironment | 配置
outline: deep
---

# snapshotEnvironment

- **类型:** `string`

自定义快照环境实现的路径。该选项适用于在不支持 Node.js API 的环境中运行测试的场景。该选项在浏览器运行器中无效。

该对象需符合 `SnapshotEnvironment` 接口规范，用于解析和读写快照文件：

```ts
export interface SnapshotEnvironment {
  getVersion: () => string
  getHeader: () => string
  resolvePath: (filepath: string) => Promise<string>
  resolveRawPath: (testPath: string, rawPath: string) => Promise<string>
  saveSnapshotFile: (filepath: string, snapshot: string) => Promise<void>
  readSnapshotFile: (filepath: string) => Promise<string | null>
  removeSnapshotFile: (filepath: string) => Promise<void>
}
```

如需仅覆盖部分 API，可从 `vitest/snapshot` 入口扩展默认的 `VitestSnapshotEnvironment`。

::: warning
此为底层选项，仅适用于无法访问默认 Node.js API 的高级场景。

如果你只需要配置快照功能，请使用 [`snapshotFormat`](/config/snapshotformat) 或 [`resolveSnapshotPath`](/config/resolvesnapshotpath) 选项。
:::
