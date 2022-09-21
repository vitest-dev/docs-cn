<template>
  <ul
    class="features-list"
    dir="auto"
    flex="~ col gap2 md:gap-3"
  >
    <ListItem>与<a target="_blank" href="https://cn.vitejs.dev/"> Vite </a>通用的配置、转换器、解析器和插件。</ListItem>
    <ListItem>使用你的应用程序中的相同配置来进行测试！</ListItem>
    <ListItem><a href="https://twitter.com/antfu7/status/1468233216939245579" target="_blank">智能文件监听模式，就像是测试的 HMR！</a></ListItem>
    <ListItem>支持测试 Vue、React、Lit 等框架中的组件。</ListItem>
    <ListItem>开箱即用的 TypeScript / JSX 支持</ListItem>
    <ListItem>ESM 优先，支持模块顶级 await</ListItem>
    <ListItem>通过 <a href="https://github.com/tinylibs/tinypool" target="_blank">tinypool</a> 使用 Worker 线程尽可能多地并发运行</ListItem>
    <ListItem>使用 <a target="_blank" href="https://github.com/tinylibs/tinybench" rel="noopener noreferrer">Tinybench</a> 来支持基准测试</ListItem>
    <ListItem>套件和测试的过滤、超时、并发配置</ListItem>
    <ListItem><a target="_blank" href="https://jestjs.io/zh-Hans/docs/snapshot-testing" rel="nofollow">Jest 的快照功能</a></ListItem>
    <ListItem>内置 <a target="_blank" href="https://www.chaijs.com/" rel="nofollow">Chai</a> 进行断言 + 与 <a href="https://jestjs.io/zh-Hans/docs/expect" rel="nofollow">Jest expect 语法</a>兼容的 API</ListItem>
    <ListItem>内置用于对象模拟(Mock)的 <a target="_blank" href="https://github.com/Aslemammad/tinyspy" rel="nofollow">Tinyspy</a></ListItem>
    <ListItem>使用 <a target="_blank" href="https://github.com/jsdom/jsdom">jsdom</a> 或 <a target="_blank" href="https://github.com/capricorn86/happy-dom">happy-dom</a> 用于 DOM 模拟</ListItem>
    <ListItem>通过 <a target="_blank" href="https://github.com/bcoe/c8">c8</a> 来输出代码测试覆盖率</ListItem>
    <ListItem>类似于 Rust 语言的 <a target="_blank" href="https://cn.vitest.dev/guide/in-source.html">源码内联测试</a></ListItem>
  </ul>
</template>

<style scoped>
.features-list li {
  list-style: none;
  display: flex;
  gap: 0.4rem;
  margin: 0;
}
.features-list {
  padding: 0;
}
</style>
