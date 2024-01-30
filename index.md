---
layout: home
sidebar: false

title: Vitest
titleTemplate: 下一代测试框架

hero:
  name: Vitest
  text: 下一代测试框架
  tagline: 一个原生支持 Vite 的测试框架。非常快速！
  image:
    src: /logo-shadow.svg
    alt: Vitest
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/
    - theme: alt
      text: 特点
      link: /guide/features
    - theme: alt
      text: 为什么选择 Vitest ?
      link: /guide/why
    - theme: alt
      text: 查看源码
      link: https://github.com/vitest-dev/vitest

features:
  - title: 基于 Vite 驱动
    icon: <span class="i-logos:vitejs"></span>
    details: 可以重用 Vite 的配置和插件，使得应用和测试保持一致。但是使用 Vitest 并不需要使用 Vite！
  - title: 与 Jest 兼容
    icon: <span class="i-logos:jest"></span>
    details: 支持 Expect 断言、快照测试、覆盖率等功能，从 Jest 迁移过来非常简单。
  - title: 智能且即时的监视模式
    icon: ⚡
    details: 只重新运行相关的更改，就像测试的热模块重载一样！
  - title: ESM、TypeScript、JSX 支持
    icon: <span class="i-logos:typescript-icon"></span>
    details: 内置 ESM、TypeScript 和 JSX 支持，由 esbuild 提供动力。
---
