<template>
  <ul
    class="features-list"
    dir="auto"
    flex="~ col gap2 md:gap-3"
  >
    <ListItem>使用 <a target="_blank" href="https://vitejs.dev" rel="noopener noreferrer">Vite</a> 的配置、转换器、解析器和插件</ListItem>
    <ListItem>使用与应用程序相同的设置来运行测试！</ListItem>
    <ListItem>智能即时监听模式，如同测试的热模块替换！</ListItem>
    <ListItem>支持 Vue、React、Svelte、Lit、Marko 等组件测试</ListItem>
    <ListItem>开箱即用的 TypeScript / JSX 支持</ListItem>
    <ListItem>ESM 优先，支持顶级 await</ListItem>
    <ListItem>通过 <a target="_blank" href="https://github.com/tinylibs/tinypool" rel="noopener noreferrer">Tinypool</a> 实现 Worker 多线程</ListItem>
    <ListItem>使用 <a target="_blank" href="https://github.com/tinylibs/tinybench" rel="noopener noreferrer">Tinybench</a> 进行基准测试</ListItem>
    <ListItem>支持测试套件和测试的过滤、超时、并发</ListItem>
    <ListItem>支持<a href="/guide/projects">多项目</a></ListItem>
    <ListItem>内置 <a target="_blank" href="https://www.chaijs.com/" rel="noopener noreferrer">Chai</a> 断言库 + 兼容 <a target="_blank" href="https://jestjs.io/docs/expect" rel="noopener noreferrer">Jest expect</a> API</ListItem>
    <ListItem>内置 <a target="_blank" href="https://github.com/tinylibs/tinyspy" rel="noopener noreferrer">Tinyspy</a> 用于模拟</ListItem>
    <ListItem>使用 <a target="_blank" href="https://github.com/capricorn86/happy-dom" rel="noopener noreferrer">happy-dom</a> 或 <a target="_blank" href="https://github.com/jsdom/jsdom" rel="noopener noreferrer">jsdom</a> 进行 DOM 模拟</ListItem>
    <ListItem><a href="https://vitest.dev/guide/browser/" rel="noopener noreferrer">浏览器模式</a>用于在浏览器中运行组件测试</ListItem>
    <ListItem>通过 <a target="_blank" href="https://v8.dev/blog/javascript-code-coverage" rel="noopener noreferrer">v8</a> 或 <a target="_blank" href="https://istanbul.js.org/" rel="noopener noreferrer">istanbul</a> 进行代码覆盖率检测</ListItem>
    <ListItem>类似 Rust 的<a href="/guide/in-source">源码内测试</a></ListItem>
    <ListItem>通过 <a target="_blank" href="https://github.com/mmkal/expect-type" rel="noopener noreferrer">expect-type</a> 进行类型测试</ListItem>
    <ListItem>分片支持</ListItem>
    <ListItem>未捕获错误报告</ListItem>
  </ul>
</template>

<style>
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
