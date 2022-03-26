# 源码内测试

Vitest 也提供了一种在源码中运行测试以及实现的方法，类似于 [Rust's module tests](https://doc.rust-lang.org/book/ch11-03-test-organization.html#the-tests-module-and-cfgtest)。

这使得测试共享相同的闭包作为实现，并且能够在不用导出的情况下对私有状态进行测试。同时，它也为开发带来了更紧密的反馈环。

## 指引

首先，在 `if (import.meta.vitest)` 内写一些测试代码并放在文件的末尾，例如:

```ts
// src/index.ts

// 实现
export function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0);
}

// 源码内的测试套件
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('add', () => {
    expect(add()).toBe(0);
    expect(add(1)).toBe(1);
    expect(add(1, 2, 3)).toBe(6);
  });
}
```

更新 Vitest 配置文件内的 `includeSource` 以获取到 `src/` 下的文件

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  },
});
```

然后你就可以开始测试了!

```bash
$ npx vitest
```

## 生产环境构建

对于生产环境的构建，你需要设置配置文件内的 `define` 选项，让打包器清除无用的代码，例如，在 Vite 中

```diff
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
+ define: {
+   'import.meta.vitest': 'undefined',
+ },
  test: {
    includeSource: ['src/**/*.{js,ts}']
  },
})
```

### 其他的打包器

<details mt4>
<summary text-xl>unbuild</summary>

```diff
// build.config.ts
import { defineConfig } from 'unbuild'

export default defineConfig({
+ replace: {
+   'import.meta.vitest': 'undefined',
+ },
  // other options
})
```

了解更多: <a href="https://github.com/unjs/unbuild" target="_blank">unbuild</a>

</details>

<details my2>
<summary text-xl>rollup</summary>

```diff
// rollup.config.js
+ import replace from '@rollup/plugin-replace'

export default {
  plugins: [
+   replace({
+     'import.meta.vitest': 'undefined',
+   })
  ],
  // other options
}
```

了解更多: <a href="https://rollupjs.org/" target="_blank">rollup</a>

</details>

## TypeScript

要获得对 `import.meta.vitest` 的 TypeScript 的支持，添加 `vitest/importMeta` 到 `tsconfig.json`:

```diff
// tsconfig.json
{
  "compilerOptions": {
    "types": [
+     "vitest/importMeta"
    ]
  }
}
```

完整的示例请参考 [`test/import-meta`](https://github.com/vitest-dev/vitest/tree/main/test/import-meta)

## 说明

此功能可用于:

- 小范围的功能或utils工具的单元测试
- 原型设计
- 内联断言

对于更复杂的测试，比如组件测试或E2E测试，建议使用单独的测试文件取而代之
