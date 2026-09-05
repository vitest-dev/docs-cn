---
title: browser.orchestratorScripts | 配置
outline: deep
---

# browser.orchestratorScripts

- **类型:** `BrowserScript[]`
- **默认值:** `[]`

在测试 iframe 初始化前，需注入到编排器 HTML 中的自定义脚本。该 HTML 文档仅用于设置 iframe 框架，并不实际导入你的代码。

脚本的 `src` 路径和 `content` 内容会经过 Vite 插件处理。脚本需符合以下接口规范：

```ts
export interface BrowserScript {
  /**
   * 当提供 "content" 且类型为 "module" 时，将作为其标识符
   *
   * 如果使用 TypeScript，可在此处添加 `.ts` 扩展名
   * @default `injected-${index}.js`
   */
  id?: string
  /**
   * 待注入的 JavaScript 内容。当类型为 "module" 时，该字符串会经过 Vite 插件处理
   *
   * 可通过 `id` 为 Vite 提供文件扩展名提示
   */
  content?: string
  /**
   *脚本路径。该值由 Vite 进行解析，因此可以是 node 模块或文件路径
   */
  src?: string
  /**
   * 是否异步加载脚本
   */
  async?: boolean
  /**
   * 脚本类型
   * @default 'module'
   */
  type?: string
}
```
