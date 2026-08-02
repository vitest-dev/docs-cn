---
title: projects | 配置
outline: deep
---

# projects

- **类型:** `TestProjectConfiguration[]`
- **默认值:** `[]`

一个由多个 [项目](/guide/projects) 组成的数组。

<!-- TODO: translation -->
A config file that declares `projects` doesn't run tests itself, it only provides the projects that do. This also applies to project config files: a referenced config that declares `projects` becomes a container for [nested projects](/guide/projects#nested-projects). The option is not supported inside an inline project configuration.
