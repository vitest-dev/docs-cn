<script setup lang="ts">
import { VPTeamMembers, VPHomeSponsors } from 'vitepress/theme'
import { teamMembers } from '../contributors'
import { sponsors } from '../sponsors'
</script>

<template>
  <div class="content">
    <div class="content-container">
      <main class="main">
        <div class="vp-doc" flex flex-col items-center>
          <h2 id="meet-the-team" op50 font-normal p="t-10 b-2">
            认识一下团队
          </h2>
          <div w-full p-10>
            <VPTeamMembers size="small" :members="teamMembers" />
          </div>
<<<<<<< HEAD
          <h2 id="the-team" op50 font-normal pt-5 pb-2>
            贡献者
          </h2>
          <p text-lg max-w-200 text-center leading-7>
            <Contributors />
            <br>
            <a href="https://chat.vitest.dev" rel="noopener noreferrer">加入我们</a>将乐在其中！
          </p>

          <h2 id="sponsored-by" op50 font-normal pt-5 pb-2>
            赞助商
          </h2>
          <div grid="~ cols-1 lg:cols-2" w-full text-center mt-10>
            <div class="flex flex-col">
              <a text-lg h="32px" href="https://github.com/sponsors/antfu" rel="noopener noreferrer">Anthony's 的赞助商</a>
              <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg" target="_blank" rel="noopener noreferrer">
                <img
                  crossorigin="anonymous"
                  inline-block
                  width="768" height="1464"
                  class="resizable-img"
                  loading="lazy"
                  src="/sponsors/antfu.svg"
                  alt="Anthony Fu's sponsors"
                  decoding="async"
                >
              </a>
            </div>
            <div class="flex flex-col">
              <a text-lg h="32px" href="https://github.com/sponsors/sheremet-va" rel="noopener noreferrer">Vladimir's 的赞助商</a>
              <a href="https://cdn.jsdelivr.net/gh/sheremet-va/static/sponsors.svg" target="_blank" rel="noopener noreferrer">
                <img
                  crossorigin="anonymous"
                  inline-block
                  width="768" height="1464"
                  class="resizable-img"
                  loading="lazy"
                  src="/sponsors/sheremet-va.svg"
                  alt="Vladimir's sponsors"
                  decoding="async"
                >
              </a>
            </div>
            <div class="flex flex-col">
              <a text-lg h="32px" href="https://github.com/sponsors/patak-dev" rel="noopener noreferrer">Patak's 的赞助商</a>
              <a href="https://cdn.jsdelivr.net/gh/patak-dev/static/sponsors.svg" target="_blank" rel="noopener noreferrer">
                <img
                  crossorigin="anonymous"
                  inline-block
                  width="768" height="722"
                  class="resizable-img"
                  loading="lazy"
                  src="/sponsors/patak-dev.svg"
                  alt="Patak's sponsors"
                  decoding="async"
                >
              </a>
            </div>
          </div>
          <p class="text-center opacity-75">
            <a href="https://www.netlify.com" rel="noopener noreferrer">
              <img src="/netlify.svg" alt="Deploys by Netlify" width="114" height="151" decoding="async">
            </a>
          </p>
=======
>>>>>>> 2af12936f0e014e6b4e25d461ec09721565e8c8b
        </div>
        <VPHomeSponsors
          v-if="sponsors"
          message="Vitest is free and open source, made possible by wonderful sponsors."
          :data="sponsors"
        />
        <div class="action">
          <a
            class="sponsor"
            href="https://github.com/sponsors/vitest-dev"
            target="_blank"
            rel="noreferrer"
          >
            Sponsor Vitest
          </a>
        </div>
        <p flex flex-col items-center mt-10 class="text-center opacity-75">
          <a href="https://www.netlify.com" rel="noopener noreferrer">
            <img src="/netlify.svg" alt="Deploys by Netlify" width="114" height="151" decoding="async">
          </a>
        </p>
      </main>
    </div>
  </div>
</template>

<style scoped>
.action {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 4rem;
}

.sponsor {
  /* .VPButton */
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s;
  /* .VPButton.medium */
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
  /* .VPButton.sponsor */
  border-color: var(--vp-button-sponsor-border);
  color: var(--vp-button-sponsor-text);
  background-color: var(--vp-button-sponsor-bg);
}

.sponsor:hover {
  /* .VPButton.sponsor:hover */
  border-color: var(--vp-button-sponsor-hover-border);
  color: var(--vp-button-sponsor-hover-text);
  background-color: var(--vp-button-sponsor-hover-bg);
}
</style>
