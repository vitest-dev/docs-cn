import { defineConfig } from 'vitepress'
import { version } from '../package.json'

export default defineConfig({
  title: 'Vitest',
  description: '由 Vite 提供支持的极速单元测试框架',
  head: [
    ['meta', { property: 'og:title', content: 'Vitest' }],
    ['meta', { property: 'og:description', content: 'A blazing fast unit test framework powered by Vite' }],
    ['meta', { property: 'og:url', content: 'https://vitest.dev/' }],
    ['meta', { property: 'og:image', content: 'https://vitest.dev/og.png' }],
    ['meta', { name: 'twitter:title', content: 'Vitest' }],
    ['meta', { name: 'twitter:description', content: 'A blazing fast unit test framework powered by Vite' }],
    ['meta', { name: 'twitter:image', content: 'https://vitest.dev/og.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;400;600&display=swap', rel: 'stylesheet' }],
  ],
  themeConfig: {
    repo: 'xiaoxunyao/cn.vitest.dev',
    logo: '/logo.svg',
    docsDir:'zh-vitest-docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: '建议更改此页面',

    /* TODO

    algolia: {
      apiKey: '...',
      indexName: 'vitest',
      searchParameters: {
        facetFilters: ['tags:en']
      }
    },

    carbonAds: {
      carbon: '...',
      placement: 'vitest'
    },
    */

    nav: [
      { text: '指引', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '配置', link: '/config/' },
      // { text: 'Plugins', link: '/plugins/' },
      {
        text: `v${version}`,
        items: [
          {
            text: '版本发布 ',
            link: 'https://github.com/vitest-dev/vitest/releases',
          },
          {
            text: '社区指南 ',
            link: 'https://github.com/vitest-dev/vitest/blob/main/CONTRIBUTING.md',
          },
        ],

      },
      {
        text: 'Discord 聊天室',
        link: 'https://chat.vitest.dev'
      },
      {
        text: 'Twitter',
        link: 'https://twitter.com/vitest_dev'
      },
      {
        text: '语言',
        items: [
          {
            text: 'English',
            link: 'https://vitest.dev'
          },
          {
            text: '简体中文',
            link: '/'
          },
          /**{
            text: '日本語',
            link: 'https://ja.vitest.dev'
          } */
        ]
      }
    ],

    sidebar: {
      '/config/': 'auto',
      '/api/': 'auto',
      // '/plugins': 'auto',
      // catch-all fallback
      '/': [
        {
          text: '开始',
          children: [
            {
              text: '简介',
              link: '/guide/why',

            },
            {
              text: '快速开始',
              link: '/guide/'
            },
            {
              text: '特性',
              link: '/guide/features'
            },
            {
              text: '模拟',
              link: '/guide/mocking'
            },
            {
              text: '调试',
              link: '/guide/debugging'
            },
            /* TODO
            {
              text: 'Using Plugins',
              link: '/guide/using-plugins'
            },
            */
            {
              text: '比较',
              link: '/guide/comparisons'
            }
          ]
        },
        /* TODO
        {
          text: 'APIs',
          children: [
            {
              text: 'Plugin API',
              link: '/guide/api-plugin'
            },
            {
              text: 'Config Reference',
              link: '/config/'
            }
          ]
        },
        */
      ]
    }
  }
})
