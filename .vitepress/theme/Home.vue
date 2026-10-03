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
<<<<<<< HEAD
    heading="免费 & 开源"
    description="Vitest 是免费开源项目，这得益于出色的赞助商们鼎力支持。"
    sponsor-link="https://github.com/sponsors/vitest-dev"
    sponsor-link-text="成为赞助商"
=======
    description="Vitest is free and open source, made possible by wonderful sponsors."
    sponsor-link="https://github.com/sponsors/vitest-dev"
>>>>>>> 9090f1432b6c7b03dcae1dfd84f09caaf62fb933
    :sponsors="sponsors"
  />
  <Spacer />
  <Footer
<<<<<<< HEAD
    heading="开始使用 Vitest 进行测试"
    subheading="凭借专为现代 Web 而生的强劲性能，让测试效率全面跃升。"
    button-text="快速起步"
=======
    heading="Start testing with Vitest"
    subheading="Supercharge your tests with unparalleled performance made for the modern web"
    button-text="Get started"
>>>>>>> 9090f1432b6c7b03dcae1dfd84f09caaf62fb933
    button-link="/guide/"
  />
</template>
