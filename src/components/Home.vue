<template>
  <div flex flex-col items-center>
    <div flex flex-col items-center p="t-10 md:t-20 b-10">
      <img src="/logo.svg" h="40 md:60">
      <h1 text-3em md:text-4em font-light>
        Vitest
      </h1>
      <p text="1.2em center" leading-7 op60 font-normal tracking-wide>
        由
        <a href="https://vitejs.dev" target="_blank" font="bold">Vite ⚡️</a>
        <br>提供支持的极速单元测试框架
      </p>
      <div
        text-center
        flex
        flex-col
        sm:flex-row
        flex-wrap
        items-center
        gap-4
        mt-5
        children:my0
      >
        <a class="btn bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 saturate-80" href="/guide/">
          <span class="i-carbon:page-last inline-block text-lg" />
          <span ma>快速开始</span>
        </a>
        <a class="btn bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 saturate-80" href="/guide/why">
          <span class="i-carbon:list-checked inline-block text-lg" />
          <span ma>了解更多</span>
        </a>
      </div>
    </div>

    <p text="1.4em center yellow-500" leading-7 font-normal tracking-wide>
      <span i-carbon-warning-alt inline-block align-mid /> Vitest 仍在开发中
    </p>
    <p
      text="1em center"
      leading-7
      op60
      font-normal
      tracking-wide
    >
      当前还不建议您替换现有的测试框架
      <br>如果您愿意帮助我们，可以在新项目中进行使用
    </p>

    <h3 op50 font-normal pt-10>
      特性
    </h3>
    <FeaturesList class="max-w-140 text-lg" />

    <h3 id="meet-the-team" op50 font-normal pt-5 pb-2>
      认识一下团队
    </h3>
    <div grid="~ sm:cols-2 gap-x-8 gap-y-20 items-center" p-10>
      <Avatar
        name="Anthony Fu"
        avatar="https://antfu.me/avatar.png"
        github="antfu"
        twitter="antfu7"
        :sponsors="true"
      >
        狂热的开源者<br>Vite 和 Vue 的核心团队成员<br>在 NuxtLabs 工作
      </Avatar>
      <Avatar
        name="Patak"
        avatar="https://patak.dev/images/patak.jpg"
        github="patak-dev"
        twitter="patak_dev"
        :sponsors="true"
      >
        二把手<br>Vite 的核心团队成员<br>Vue 的团队成员
      </Avatar>
      <Avatar
        name="Aslemammad"
        avatar="https://avatars.githubusercontent.com/u/37929992?v=4"
        github="Aslemammad"
        twitter="asleMammadam"
      >
        开源开发者<br>Poimandres 和 Vike 的团队成员
      </Avatar>
      <Avatar
        name="Vladimir"
        avatar="https://avatars.githubusercontent.com/u/16173870?v=4"
        github="sheremet-va"
        twitter="sheremet_va"
      >
        全栈开源开发者
      </Avatar>
      <Avatar
        name="Ivan Demchuk"
        avatar="https://avatars.githubusercontent.com/u/2339406?v=4"
        github="Demivan"
        twitter="IvanDemchuk"
      >
        技术负责人，全栈开发人员<br>fluent-vue 的作者
      </Avatar>
    </div>
    <h3 id="the-team" op50 font-normal pt-5 pb-2>
      贡献者
    </h3>
    <p op80 text-lg max-w-150 text-center leading-7>
      <Contributors />
      <br>
      <a href="https://chat.vitest.dev">加入我们</a>将乐在其中！
    </p>

    <h3 id="sponsored-by" op50 font-normal pt-5 pb-2>
      赞助商
    </h3>
    <div grid="~ cols-1 lg:cols-2" w-screen text-center mt-10>
      <div class="flex flex-col">
        <a text-lg href="https://github.com/sponsors/antfu">Anthony 的赞助商</a>
        <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg" target="_blank">
          <img src="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
        </a>
      </div>
      <div class="flex flex-col">
        <a text-lg href="https://github.com/sponsors/patak-dev">Patak 的赞助商</a>
        <a href="https://patak.dev/sponsors.svg" target="_blank">
          <img src="https://patak.dev/sponsors.svg">
        </a>
      </div>
    </div>

    <p class="text-center opacity-75">
      <a href="https://www.netlify.com">
        <img src="/netlify.svg" alt="Deploys by Netlify">
      </a>
    </p>
    <div mb-30 />
  </div>
</template>
