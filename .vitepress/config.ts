import { defineConfig } from 'vitepress'
import { version } from '../package.json'
import {
  contributing,
  discord,
  font,
  github,
  ogImage,
  ogUrl,
  releases,
  twitter,
  vitestDescription,
  vitestName,
} from './meta'
import { teamMembers } from './contributors'

export default defineConfig({
  lang: 'zh-cn',
  title: vitestName,
  description: vitestDescription,
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
    ['meta', { name: 'author', content: `${teamMembers.map(c => c.name).join(', ')} and ${vitestName} contributors` }],
    ['meta', { name: 'keywords', content: 'vitest, vite, test, coverage, snapshot, react, vue, preact, svelte, solid, lit, ruby, cypress, puppeteer, jsdom, happy-dom, test-runner, jest, typescript, esm, tinypool, tinyspy, c8, node' }],
    ['meta', { property: 'og:title', content: vitestName }],
    ['meta', { property: 'og:description', content: vitestDescription }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { name: 'twitter:title', content: vitestName }],
    ['meta', { name: 'twitter:description', content: vitestDescription }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { href: font, rel: 'stylesheet' }],
    ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
  ],
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      repo: 'vitest-dev/docs-cn',
      branch: 'main',
      text: '建议更改此页面',
    },

    algolia: {
      appId: 'ZTF29HGJ69',
      apiKey: '9c3ced6fed60d2670bb36ab7e8bed8bc',
      indexName: 'vitest',
      // searchParameters: {
      //   facetFilters: ['tags:en']
      // }
    },

    localeLinks: {
      text: '简体中文',
      items: [
        { text: 'English', link: 'https://vitest.dev' },
      ],
    },

    socialLinks: [
      { icon: 'twitter', link: twitter },
      { icon: 'discord', link: discord },
      { icon: 'github', link: github },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-PRESENT Anthony Fu, Matías Capeletto and Vitest contributors',
    },

    nav: [
      { text: '指引', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '配置', link: '/config/' },
      {
        text: `v${version}`,
        items: [
          {
            text: '版本发布',
            link: releases,
          },
          {
            text: '社区指南',
            link: contributing,
          },
        ],
      },
    ],

    sidebar: {
      // TODO: bring sidebar of apis and config back
      '/': [
        {
          text: '指引',
          items: [
            {
              text: '简介',
              link: '/guide/why',
            },
            {
              text: '快速开始',
              link: '/guide/',
            },
            {
              text: '特点',
              link: '/guide/features',
            },
            {
              text: 'CLI',
              link: '/guide/cli',
            },
            {
              text: 'Test Filtering',
              link: '/guide/filtering',
            },
            {
              text: '覆盖范围',
              link: '/guide/coverage',
            },
            {
              text: '快照序列化',
              link: '/guide/snapshot',
            },
            {
              text: '模拟对象',
              link: '/guide/mocking',
            },
            {
              text: 'Vitest UI',
              link: '/guide/ui',
            },
            {
              text: '源码内联测试',
              link: '/guide/in-source',
            },
            {
              text: '测试环境',
              link: '/guide/test-context',
            },
            {
              text: '扩展匹配器',
              link: '/guide/extending-matchers',
            },
            {
              text: 'IDE 插件',
              link: '/guide/ide',
            },
            {
              text: '调试',
              link: '/guide/debugging',
            },
            {
              text: '与其他测试框架对比',
              link: '/guide/comparisons',
            },
            {
              text: '迁移指南',
              link: '/guide/migration',
            },
          ],
        },
        {
          text: 'API',
          items: [
            {
              text: 'API 参考',
              link: '/api/',
            },
          ],
        },
        {
          text: 'Config',
          items: [
            {
              text: '配置 Vitest',
              link: '/config/',
            },
          ],
        },
      ],
    },
  },
})
