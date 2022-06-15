# 覆盖率

Vitest 通过 [`c8`](https://github.com/bcoe/c8) 支持本机代码覆盖。 `c8` 是一个可选的对等依赖项，要使用覆盖功能，你需要先安装它：

```bash
npm i -D c8
```

然后你就可以通过在 CLI 中传递 `--coverage` 标志来获得覆盖率。

```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

要对其进行配置，需要在配置文件中设置 `test.coverage` 选项：

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```
