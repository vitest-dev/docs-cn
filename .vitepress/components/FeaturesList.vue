<template>
  <ul class="features-list" dir="auto" flex="~ col gap2 md:gap-3">
    <ListItem>
      与
      <a target="_blank" href="https://vitejs.dev" rel="noopener noreferrer">Vite</a>
      通用的配置、转换器、解析器和插件。
    </ListItem>
    <ListItem>使用与你的应用相同的设置来运行测试！</ListItem>
    <ListItem>智能文件监听模式，就像是测试的 HMR！</ListItem>
    <ListItem>支持对 Vue、React、Svelte、Lit 等框架进行组件测试。</ListItem>
    <ListItem>开箱即用的 TypeScript / JSX 支持</ListItem>
    <ListItem>ESM 优先，支持模块顶级 await</ListItem>
    <ListItem>
      通过
      <a target="_blank" href="https://github.com/tinylibs/tinypool" rel="noopener noreferrer">Tinypool</a>
      使用 Worker 线程并行执行测试
    </ListItem>
    <ListItem>
      使用
      <a target="_blank" href="https://github.com/tinylibs/tinybench" rel="noopener noreferrer">Tinybench</a>
      支持基准测试
    </ListItem>
    <ListItem>支持套件和测试的过滤、超时、并发配置</ListItem>
    <ListItem>支持 <a href="/guide/projects">Projects</a> / <a href="/guide/workspace">Workspace</a></ListItem>
    <ListItem>
      <a href="/guide/snapshot">Jest 快照功能</a>
    </ListItem>
    <ListItem>
      内置
      <a target="_blank" href="https://www.chaijs.com/" rel="noopener noreferrer">Chai</a>
      进行断言，并兼容
      <a target="_blank" href="https://jestjs.io/zh-Hans/docs/expect" rel="noopener noreferrer">Jest expect</a> API
    </ListItem>
    <ListItem>
      内置
      <a target="_blank" href="https://github.com/Aslemammad/tinyspy" rel="noopener noreferrer">Tinyspy</a> 用于对象
      Mock
    </ListItem>
    <ListItem>
      使用
      <a target="_blank" href="https://github.com/jsdom/jsdom" rel="noopener noreferrer">jsdom</a> 或
      <a target="_blank" href="https://github.com/capricorn86/happy-dom" rel="noopener noreferrer">happy-dom</a>
      模拟 DOM
    </ListItem>
    <ListItem><a href="/guide/browser/" rel="noopener noreferrer">浏览器模式</a>：在浏览器中运行组件测试</ListItem>
    <ListItem>
      通过
      <a target="_blank" href="https://v8.dev/blog/javascript-code-coverage" rel="noopener noreferrer">v8</a>
      或
      <a target="_blank" href="https://istanbul.js.org/" rel="noopener noreferrer">istanbul</a> 输出代码覆盖率
    </ListItem>
    <ListItem>
      类似 Rust 的
      <a href="/guide/in-source" rel="noopener noreferrer">源码内联测试</a>
    </ListItem>
    <ListItem>
      使用
      <a target="_blank" href="https://github.com/mmkal/expect-type" rel="noopener noreferrer">expect-type</a>
      进行类型测试
    </ListItem>
    <ListItem>支持分片执行</ListItem>
    <ListItem>报告未捕获的错误</ListItem>
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
