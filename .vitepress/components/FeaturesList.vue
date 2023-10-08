<template>
  <ul
    class="features-list"
    dir="auto"
    flex="~ col gap2 md:gap-3"
  >
<<<<<<< HEAD
    <ListItem>与<a target="_blank" href="https://cn.vitejs.dev/"> Vite </a>通用的配置、转换器、解析器和插件。</ListItem>
    <ListItem>使用你的应用程序中的相同配置来进行测试！</ListItem>
    <ListItem><a href="https://twitter.com/antfu7/status/1468233216939245579" target="_blank">智能文件监听模式，就像是测试的 HMR！</a></ListItem>
    <ListItem>支持测试 Vue、React、Lit 等框架中的组件。</ListItem>
    <ListItem>开箱即用的 TypeScript / JSX 支持</ListItem>
    <ListItem>ESM 优先，支持模块顶级 await</ListItem>
    <ListItem>通过 <a href="https://github.com/tinylibs/tinypool" target="_blank">tinypool</a> 使用 Worker 线程尽可能多地并发运行</ListItem>
    <ListItem>使用 <a target="_blank" href="https://github.com/tinylibs/tinybench" rel="noopener noreferrer">Tinybench</a> 来支持基准测试</ListItem>
    <ListItem>套件和测试的过滤、超时、并发配置</ListItem>
    <ListItem>支持 <a href="/guide/workspace">Workspace</a></ListItem>
    <ListItem><a target="_blank" href="https://jestjs.io/zh-Hans/docs/snapshot-testing" rel="nofollow">Jest 的快照功能</a></ListItem>
    <ListItem>内置 <a target="_blank" href="https://www.chaijs.com/" rel="nofollow">Chai</a> 进行断言 + 与 <a href="https://jestjs.io/zh-Hans/docs/expect" rel="nofollow">Jest expect 语法</a>兼容的 API</ListItem>
    <ListItem>内置用于对象模拟(Mock)的 <a target="_blank" href="https://github.com/Aslemammad/tinyspy" rel="nofollow">Tinyspy</a></ListItem>
    <ListItem>使用 <a target="_blank" href="https://github.com/jsdom/jsdom">jsdom</a> 或 <a target="_blank" href="https://github.com/capricorn86/happy-dom">happy-dom</a> 用于 DOM 模拟</ListItem>
    <ListItem>通过 <a target="_blank" href="https://v8.dev/blog/javascript-code-coverage" rel="noopener noreferrer">v8</a> or <a target="_blank" href="https://istanbul.js.org/" rel="noopener noreferrer">istanbul</a>来输出代码测试覆盖率</ListItem>
    <ListItem>类似于 Rust 语言的 <a target="_blank" href="https://cn.vitest.dev/guide/in-source.html">源码内联测试</a></ListItem>
    <ListItem>通过 <a target="_blank" href="https://github.com/mmkal/expect-type" rel="noopener noreferrer">expect-type</a> 进行类型测试</ListItem>
=======
    <ListItem><a target="_blank" href="https://vitejs.dev" rel="noopener noreferrer">Vite</a>'s config, transformers, resolvers, and plugins.</ListItem>
    <ListItem>Use the same setup from your app to run the tests!</ListItem>
    <ListItem><a target="_blank" href="https://twitter.com/antfu7/status/1468233216939245579" rel="noopener noreferrer">Smart & instant watch mode, like HMR for tests!</a></ListItem>
    <ListItem>Component testing for Vue, React, Svelte, Lit, Marko and more</ListItem>
    <ListItem>Out-of-the-box TypeScript / JSX support</ListItem>
    <ListItem>ESM first, top level await</ListItem>
    <ListItem>Workers multi-threading via <a target="_blank" href="https://github.com/tinylibs/tinypool" rel="noopener noreferrer">Tinypool</a></ListItem>
    <ListItem>Benchmarking support with <a target="_blank" href="https://github.com/tinylibs/tinybench" rel="noopener noreferrer">Tinybench</a></ListItem>
    <ListItem>Filtering, timeouts, concurrent for suite and tests</ListItem>
    <ListItem><a href="/guide/workspace">Workspace</a> support</ListItem>
    <ListItem>
      <a href="/guide/snapshot">
        Jest-compatible Snapshot
      </a>
    </ListItem>
    <ListItem><a target="_blank" href="https://www.chaijs.com/" rel="noopener noreferrer">Chai</a> built-in for assertions + <a target="_blank" href="https://jestjs.io/docs/expect" rel="noopener noreferrer">Jest expect</a> compatible APIs</ListItem>
    <ListItem><a target="_blank" href="https://github.com/tinylibs/tinyspy" rel="noopener noreferrer">Tinyspy</a> built-in for mocking</ListItem>
    <ListItem><a target="_blank" href="https://github.com/capricorn86/happy-dom" rel="noopener noreferrer">happy-dom</a> or <a target="_blank" href="https://github.com/jsdom/jsdom" rel="noopener noreferrer">jsdom</a> for DOM mocking</ListItem>
    <ListItem>Code coverage via <a target="_blank" href="https://v8.dev/blog/javascript-code-coverage" rel="noopener noreferrer">v8</a> or <a target="_blank" href="https://istanbul.js.org/" rel="noopener noreferrer">istanbul</a></ListItem>
    <ListItem>Rust-like <a href="/guide/in-source">in-source testing</a></ListItem>
    <ListItem>Type Testing via <a target="_blank" href="https://github.com/mmkal/expect-type" rel="noopener noreferrer">expect-type</a></ListItem>
>>>>>>> fc96d113a2bbcb534bccee5334cca566bbadfd4d
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
