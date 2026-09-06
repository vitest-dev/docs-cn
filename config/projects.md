---
title: projects | 配置
outline: deep
---

# projects

- **类型:** `TestProjectConfiguration[]`
- **默认值:** `[]`

一个由多个 [项目](/guide/projects) 组成的数组。

声明了 `projects` 的配置文件本身不会运行测试，只负责提供实际运行测试的项目。项目配置文件同样如此：如果被引用的配置文件声明了 `projects`，它将作为 [嵌套项目](/guide/projects#nested-projects) 的容器。内联项目配置不支持此选项。
