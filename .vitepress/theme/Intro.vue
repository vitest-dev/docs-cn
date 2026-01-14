<template>
  <div class="wrapper wrapper--ticks border-t py-14 lg:py-30 px-5 sm:px-10 lg:px-20">
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 lg:gap-8 text-left">
      <div class="flex flex-col gap-3 max-w-md">
        <div class="flex gap-3 items-center">
          <img src="@assets/icons/vitest-light.svg" alt="Vitest icon" class="size-5">
          <span class="text-grey text-xs font-medium font-mono uppercase tracking-wide">为什么是 Vitest？</span>
        </div>
        <h3 class="text-white max-w-xl text-balance">
          <span>Vite 原生</span>
          <span>测试框架</span>
        </h3>
        <a href="/guide/why" target="_blank" class="button w-fit mt-8 hidden lg:block">了解更多</a>
      </div>
      <div class="lg:max-w-lg">
        <p class="text-pretty mb-5">
          Vitest 旨在让
          <a href="https://vite.dev" target="_blank">
            <code class="mr-1 outline-none bg-nickel/50 text-vite">Vite</code>
          </a>
          应用测试变得轻而易举。Vitest 基于 Vite 构建，原生支持 Vite 配置，并复用相同的解析和转换。
        </p>
        <p class="text-pretty">
          即使不使用 Vite，也同样可以使用 Vitest。它兼容 Jest，也同样适用于后端代码。
        </p>
        <a href="/guide/why" target="_blank" class="button w-fit mt-8 block lg:hidden">了解更多</a>
      </div>
    </div>
  </div>
</template>
