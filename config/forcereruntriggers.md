---
title: forceRerunTriggers | 配置
outline: deep
---

# forceRerunTriggers <CRoot />

<<<<<<< HEAD
- **类型:** `string[]`
- **默认值:** `['**/package.json/**', '**/vitest.config.*/**', '**/vite.config.*/**']`
=======
- **Type:** `string[]`
- **Default:** `['**/package.json/**', '**/vitest.config.*/**', '**/vite.config.*/**']`
>>>>>>> ec964f36ce7596a023a32b8265f6019c51b32926

将触发整个测试套件重新运行的文件路径（glob 模式）。当与 `--changed` 参数配合使用时，如果在 git diff 中发现触发文件，就会运行整个测试套件。

因为 Vite 无法构建模块依赖图，所以适用于测试调用 CLI 命令的场景：

```ts
test('执行一个脚本', async () => {
  // 如果 `dist/index.js` 的内容发生变化，Vitest 无法重新运行此测试
  await execa('node', ['dist/index.js'])
})
```

::: tip
请确保你的文件没有被 [`server.watch.ignored`](https://cn.vitejs.dev/config/server-options.html#server-watch) 配置排除。
:::
