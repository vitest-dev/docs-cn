import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { version } from '../package.json'

import {
  contributing,
  discord,
  font,
  github,
  mastodon,
  ogImage,
  ogUrl,
  releases,
  twitter,
  vitestDescription,
  vitestName,
} from './meta'
import { pwa } from './scripts/pwa'
import { transformHead } from './scripts/transformHead'
import { teamMembers } from './contributors'

export default withPwa(
  defineConfig({
    lang: 'en-US',
    title: vitestName,
    description: vitestDescription,
    locales: {
      root: {
        label: '简体中文',
        lang: 'zh',
      },
      en: {
        label: 'English',
        lang: 'en',
        link: 'https://vitest.dev/',
      },
    },
    head: [
      ['meta', { name: 'theme-color', content: '#729b1a' }],
      ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
      ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
      ['meta', { name: 'author', content: `${teamMembers.map(c => c.name).join(', ')} and ${vitestName} contributors` }],
      ['meta', { name: 'keywords', content: 'vitest, vite, test, coverage, snapshot, react, vue, preact, svelte, solid, lit, ruby, cypress, puppeteer, jsdom, happy-dom, test-runner, jest, typescript, esm, tinypool, tinyspy, node' }],
      ['meta', { property: 'og:title', content: vitestName }],
      ['meta', { property: 'og:description', content: vitestDescription }],
      ['meta', { property: 'og:url', content: ogUrl }],
      ['meta', { property: 'og:image', content: ogImage }],
      ['meta', { name: 'twitter:title', content: vitestName }],
      ['meta', { name: 'twitter:description', content: vitestDescription }],
      ['meta', { name: 'twitter:image', content: ogImage }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['link', { rel: 'preload', as: 'style', onload: 'this.onload=null;this.rel=\'stylesheet\'', href: font }],
      ['noscript', {}, `<link rel="stylesheet" crossorigin="anonymous" href="${font}" />`],
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
        pattern: 'https://github.com/vitest-dev/docs-cn/tree/dev/:path',
        text: '为此页提供修改建议',
      },

      outline: {
        label: '本页目录',
      },

      search: {
        provider: 'local',
      },

      socialLinks: [
        { icon: 'mastodon', link: mastodon },
        { icon: 'twitter', link: twitter },
        { icon: 'discord', link: discord },
        { icon: 'github', link: github },
      ],

      docFooter: {
        prev: '上一篇',
        next: '下一篇',
      },

      lastUpdatedText: '最后更新时间',

      footer: {
        message: 'Released under the MIT License.',
        copyright:
          'Copyright © 2021-PRESENT Anthony Fu, Matías Capeletto and Vitest contributors',
      },

      nav: [
        { text: '指南', link: '/guide/', activeMatch: '^/guide/' },
        { text: 'API', link: '/api/', activeMatch: '^/api/' },
        { text: '配置', link: '/config/', activeMatch: '^/config/' },
        { text: '高级 API', link: '/advanced/api', activeMatch: '^/advanced/' },
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
        '/advanced': [
          {
            text: '高级 API',
            items: [
              {
                text: 'Node API',
                link: '/advanced/api',
              },
              {
                text: 'Runner API',
                link: '/advanced/runner',
              },
              {
                text: 'Task Metadata',
                link: '/advanced/metadata',
              },
              {
                text: 'Extending default reporters',
                link: '/advanced/reporters',
              },
            ],
          },
        ],
        '/': [
          {
            text: '指南',
            items: [
              {
                text: '简介',
                link: '/guide/why',
              },
              {
                text: '快速起步',
                link: '/guide/',
              },
              {
                text: '主要功能',
                link: '/guide/features',
              },
              {
                text: '工作空间',
                link: '/guide/workspace',
              },
              {
                text: '命令行界面',
                link: '/guide/cli',
              }, {
                text: '测试筛选',
                link: '/guide/filtering',
              },
              {
                text: '测试覆盖率',
                link: '/guide/coverage',
              },
              {
                text: '测试快照',
                link: '/guide/snapshot',
              },
              {
                text: '模拟对象',
                link: '/guide/mocking',
              },
              {
                text: '类型测试',
                link: '/guide/testing-types',
              },
              {
                text: 'Vitest UI',
                link: '/guide/ui',
              },
              {
                text: '浏览器模式',
                link: '/guide/browser',
              },
              {
                text: '源码内联测试',
                link: '/guide/in-source',
              },
              {
                text: '测试上下文',
                link: '/guide/test-context',
              },
              {
                text: '测试环境',
                link: '/guide/environment',
              },
              {
                text: '扩展断言',
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
              {
                text: '常见错误',
                link: '/guide/common-errors',
              },
            ],
          },
          {
            text: 'API',
            items: [
              {
                text: 'API 索引',
                link: '/api/',
              },
              {
                text: 'Mock Functions',
                link: '/api/mock',
              },
              {
                text: 'Vi Utility',
                link: '/api/vi',
              },
              {
                text: 'Expect',
                link: '/api/expect',
              },
              {
                text: 'ExpectTypeOf',
                link: '/api/expect-typeof',
              },
              {
                text: 'AssertType',
                link: '/api/assert-type',
              },
            ],
          },
          {
            text: '配置',
            items: [
              {
                text: '配置索引',
                link: '/config/',
              },
            ],
          },
        ],
      },
    },
    pwa,
    transformHead,
  }),
)
