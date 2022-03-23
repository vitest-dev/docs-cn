<p align="center">
<img src="https://user-images.githubusercontent.com/11247099/145112184-a9ff6727-661c-439d-9ada-963124a281f7.png" height="200">
</p>

<h1 align="center">
Vitest
</h1>
<p align="center">
由 Vite 提供支持的极速单元测试框架
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/vitest"><img src="https://img.shields.io/npm/v/vitest?color=a1b858&label="></a>
</p>
<h3 align="center">
<a href="https://chat.vitest.dev"><i>加入我们</i></a><i>将乐在其中！</i>
</h3>
<br>
<br>

> Vitest 需要 Vite >=v2.7.10 和 Node >=v14

浏览[入门指南](https://cn-vitest.netlify.app/guide/)或了解[我们为什么要构建新的测试框架](https://cn-vitest.netlify.app/guide/why.html)。

## 文档

浏览<a href="https://cn-vitest.netlify.app">中文文档</a> ｜ <a href="https://vitest.dev">英文文档</a>

<a href="https://cn-vitest.netlify.app/guide/#实例">实例</a> | <a href="https://cn-vitest.netlify.app/guide/#使用-vitest-的项目">使用 Vitest 的项目</a>

## 特点

- 可以使用 [Vite](https://cn.vitejs.dev) 的配置、转换器、解析器和插件。
- 使用您的应用程序中的相同设置来进行测试！
- 智能检测和即时浏览模式，像用于测试的 [HMR!](https://twitter.com/antfu7/status/1468233216939245579)
- 可以用于 Vue、React、Lit 等的组件测试
- 开箱即用的 TypeScript / JSX 支持
- 优先 ESM ， 顶级的 await
- 通过 [tinypool](https://github.com/tinylibs/tinypool) 使用 Worker 线程尽可能多地并发运行
- 测试套件和测试的过滤、超时、并发
- [Jest](https://jestjs.io/zh-Hans/docs/snapshot-testing) 快照测试
- [Chai](https://www.chaijs.com) 内置断言 + [Jest](https://jestjs.io/zh-Hans/docs/expect) 预期兼容的 API
- 内置用于模拟的 [Tinyspy](https://github.com/tinylibs/tinyspy)
- 用于 DOM 模拟的 [jsdom](https://github.com/jsdom/jsdom) 或 [happy-dom](https://github.com/capricorn86/happy-dom)
- 通过 [c8](https://github.com/bcoe/c8) 覆盖所有的代码

```ts
import { assert, describe, expect, it } from 'vitest'
describe('suite name', () => {
  it('foo', () => {
    expect(1 + 1).toEqual(2)
    expect(true).to.be.true
  })
  it('bar', () => {
    assert.equal(Math.sqrt(4), 2)
  })
  it('snapshot', () => {
    expect({ foo: 'bar' }).toMatchSnapshot()
  })
})
```

```bash
$ npx vitest
```

## 赞助商

### Anthony Fu 的赞助商

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

### Patak 的赞助商

<p align="center">
  <a href="https://patak.dev/sponsors.svg">
    <img src='https://patak.dev/sponsors.svg'/>
  </a>
</p>

## 感谢

- [Jest 团队和社区](https://jestjs.io/zh-Hans/) 用于创建愉快的测试 API
- [@lukeed](https://github.com/lukeed) 为我们在 [uvu](https://github.com/lukeed/uvu) 上的工作获得了很多启发。
- 使用 [@pi0](https://github.com/pi0) 用于 Vite 转换和捆绑服务器代码的想法和实现。
- [Vite 团队](https://github.com/vitejs/vite) 集思广益的想法。
- [@patak-dev](https://github.com/patak-dev) 创造了很棒的名字！

## License

[MIT](https://github.com/xiaoxunyao/cn.vitest.dev/blob/master/LICENSE) License © 2021-Present [Anthony Fu](https://github.com/antfu), [Matias Capeletto](https://github.com/patak-dev)
