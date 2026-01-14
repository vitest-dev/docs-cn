<script setup>
import Footer from '@components/oss/Footer.vue'
// import TrustedBy from '@components/oss/TrustedBy.vue'
import HeadingSection from '@components/oss/HeadingSection.vue'
import Sponsors from '@components/oss/Sponsors.vue'
import Spacer from '@components/shared/Spacer.vue'
import { sponsors } from '../sponsors'
import VitestFeatureGrid from './FeatureGrid.vue'
import Hero from './Hero.vue'
import Intro from './Intro.vue'
</script>

<template>
  <Hero />
  <!-- 'some-company' requires public/trusted-by/some-company.svg -->
  <!-- <TrustedBy :logos="['some-company']" /> -->
  <Intro />
  <HeadingSection heading="快速 · 轻量 · 深度集成" />
  <VitestFeatureGrid />
  <Sponsors
    heading="免费 & 开源"
    description="Vitest 是免费开源项目，这得益于出色的赞助商们鼎力支持。"
    sponsor-link="https://github.com/sponsors/vitest-dev"
    sponsor-link-text="成为赞助商"
    :sponsors="sponsors"
  />
  <Spacer />
  <Footer
    heading="开始使用 Vitest 进行测试"
    subheading="为现代 Web 应用提供超凡性能的测试加速方案"
    button-text="快速起步"
    button-link="/guide/"
  />
</template>
