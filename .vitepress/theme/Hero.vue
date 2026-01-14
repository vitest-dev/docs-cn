<template>
  <div class="wrapper wrapper--ticks grid md:grid-cols-2 w-full border-nickel divide-x">
    <div class="flex flex-col p-10 justify-center items-center md:items-start">
      <div class="flex flex-col gap-5 max-w-[30rem] text-center md:text-left items-center md:items-start">
        <a class="flex items-center gap-2" href="https://voidzero.dev" target="_blank">
          <span class="text-grey text-xs font-mono uppercase tracking-wide">By</span>
          <img src="@assets/logos/voidzero-light.svg" alt="VoidZero" class="h-2.5">
        </a>
        <h1 class="text-white text-pretty">
          下一代测试框架
        </h1>
        <p class="text-white/70 text-lg max-w-[25rem] text-pretty">
          一个原生支持 Vite 的测试框架。非常快速！
        </p>
        <div class="flex items-center gap-5 mt-8">
          <a href="/guide/" class="button button--primary inline-block w-fit">
            <span>快速开始</span>
          </a>
          <a href="https://github.com/vitest-dev/vitest" target="_blank" rel="noopener noreferrer" class="button inline-block w-fit">
            查看源码
          </a>
        </div>
      </div>
    </div>
    <div class="flex flex-col min-h-[22rem] sm:min-h-[30rem]">
      <div class="relative pl-6 sm:pl-16 h-full flex flex-col justify-center overflow-clip py-8 sm:py-16 hero-background">
        <img src="@assets/vitest/hero-terminal.png" alt="Vitest terminal" class="w-full h-full object-contain">
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-background {
  background-image: url('@assets/vitest/hero-background.jpg');
  background-size: cover;
  background-position: center;
}
</style>
