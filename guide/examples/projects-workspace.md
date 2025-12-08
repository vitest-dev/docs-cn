```ts
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    // "test.workspace" 现已更名为 "test.projects"
    workspace: [ // [!code --]
    projects: [ // [!code ++]
      { test: { name: "Unit" } },
      { test: { name: "Integration" } },
    ],
  },
});
```
