import type { DefaultTheme } from 'vitepress'
import process from 'node:process'
import { transformerNotationWordHighlight } from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { withPwa } from '@vite-pwa/vitepress'
import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { version } from '../package.json'
import { teamMembers } from './contributors'
import {
  bluesky,
  contributing,
  discord,
  font,
  github,
  mastodon,
  ogImage,
  ogUrl,
  releases,
  vitestDescription,
  vitestName,
} from './meta'
import { pwa } from './scripts/pwa'
import { transformHead } from './scripts/transformHead'

export default ({ mode }: { mode: string }) => {
  return withPwa(
    defineConfig({
      lang: 'en-US',
      title: vitestName,
      description: vitestDescription,
      srcExclude: ['**/guide/examples/*', '**/guide/cli-generated.md'],
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh',
        },
        zh: {
          label: 'English',
          lang: 'en-US',
          link: 'https://vitest.dev/',
        },
      },
      head: [
        ['meta', { name: 'theme-color', content: '#729b1a' }],
        ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
        [
          'link',
          {
            rel: 'icon',
            href: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
        [
          'meta',
          {
            name: 'author',
            content: `${teamMembers
              .map(c => c.name)
              .join(', ')} and ${vitestName} contributors`,
          },
        ],
        [
          'meta',
          {
            name: 'keywords',
            content:
              'vitest, vite, test, coverage, snapshot, react, vue, preact, svelte, solid, lit, marko, ruby, cypress, puppeteer, jsdom, happy-dom, test-runner, jest, typescript, esm, tinypool, tinyspy, node',
          },
        ],
        ['meta', { property: 'og:title', content: vitestName }],
        ['meta', { property: 'og:description', content: vitestDescription }],
        ['meta', { property: 'og:url', content: ogUrl }],
        ['meta', { property: 'og:image', content: ogImage }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        [
          'link',
          {
            rel: 'preload',
            as: 'style',
            onload: 'this.onload=null;this.rel=\'stylesheet\'',
            href: font,
          },
        ],
        [
          'noscript',
          {},
          `<link rel="stylesheet" crossorigin="anonymous" href="${font}" />`,
        ],
        ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vitest' }],
        ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
        [
          'link',
          {
            rel: 'apple-touch-icon',
            href: '/apple-touch-icon.png',
            sizes: '180x180',
          },
        ],
      ],
      lastUpdated: true,
      vite: {
        plugins: [
          groupIconVitePlugin({
            customIcon: {
              'CLI': 'vscode-icons:file-type-shell',
              'vitest.shims': 'vscode-icons:file-type-vitest',
              'vitest.config': 'vscode-icons:file-type-vitest',
              'vitest.workspace': 'vscode-icons:file-type-vitest',
              '.spec.ts': 'vscode-icons:file-type-testts',
              '.test.ts': 'vscode-icons:file-type-testts',
              '.spec.js': 'vscode-icons:file-type-testjs',
              '.test.js': 'vscode-icons:file-type-testjs',
              'marko': 'vscode-icons:file-type-marko',
              'qwik': 'logos:qwik-icon',
              'next': '',
            },
          }) as any,
        ],
      },
      markdown: {
        config(md) {
          md.use(tabsMarkdownPlugin)
          md.use(groupIconMdPlugin)
        },
        theme: {
          light: 'github-light',
          dark: 'github-dark',
        },
        codeTransformers:
          mode === 'development'
            ? [transformerNotationWordHighlight()]
            : [
                transformerNotationWordHighlight(),
                transformerTwoslash({
                  processHoverInfo: (info) => {
                    if (info.includes(process.cwd())) {
                      return info.replace(new RegExp(process.cwd(), 'g'), '')
                    }
                    return info
                  },
                }),
              ],
        languages: ['js', 'jsx', 'ts', 'tsx'],
      },
      themeConfig: {
        logo: '/logo.svg',

        outline: {
          label: '页面导航',
        },

        editLink: {
          pattern: 'https://github.com/vitest-dev/docs-cn/edit/dev/:path',
          text: '在 GitHub 上编辑此页面',
        },

        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'full',
            timeStyle: 'medium',
          },
        },

        search: {
          provider: 'local',
        },

        docFooter: {
          prev: '上一页',
          next: '下一页',
        },

        carbonAds: {
          code: 'CW7DVKJE',
          placement: 'vitestdev',
        },

        socialLinks: [
          { icon: 'bluesky', link: bluesky },
          { icon: 'mastodon', link: mastodon },
          { icon: 'discord', link: discord },
          { icon: 'github', link: github },
        ],

        footer: {
          message: 'Released under the MIT License.',
          copyright:
            'Copyright © 2021-PRESENT VoidZero Inc. and Vitest contributors',
        },

        nav: [
          {
            text: '指南 & API',
            link: '/guide/',
            activeMatch: '^/(guide|api)/(?!browser)',
          },
          { text: '配置', link: '/config/', activeMatch: '^/config/' },
          {
            text: '浏览器模式',
            link: '/guide/browser',
            activeMatch: '^/guide/browser/',
          },
          {
            text: '相关链接',
            items: [
              {
                text: '高级 API',
                link: '/advanced/api/',
                activeMatch: '^/advanced/',
              },
              {
                items: [
                  {
                    text: '博客',
                    link: '/blog',
                  },
                  {
                    text: '团队',
                    link: '/team',
                  },
                ],
              },
            ],
          },
          {
            text: `v${version}`,
            items: [
              {
                items: [
                  {
                    text: `v${version}`,
                    link: `https://github.com/vitest-dev/vitest/releases/tag/v${version}`,
                  },
                  {
                    text: '更新日志',
                    link: releases,
                  },
                  {
                    text: '贡献指南',
                    link: contributing,
                  },
                ],
              },
              {
                items: [
                  {
                    text: '未发布',
                    link: 'https://main.vitest.dev/',
                  },
                  {
                    text: 'v0.x',
                    link: 'https://v0.vitest.dev/',
                  },
                  {
                    text: 'v1.x',
                    link: 'https://v1.vitest.dev/',
                  },
                  {
                    text: 'v2.x',
                    link: 'https://v2.vitest.dev/',
                  },
                ],
              },
            ],
          },
        ],

        sidebar: {
          '/guide/browser': [
            {
              text: '介绍',
              collapsed: false,
              items: [
                {
                  text: '什么是浏览器模式',
                  link: '/guide/browser/why',
                  docFooterText: '什么是浏览器模式 | 浏览器模式',
                },
                {
                  text: '快速起步',
                  link: '/guide/browser/',
                  docFooterText: '快速起步 | 浏览器模式',
                },
              ],
            },
            {
              text: '配置',
              collapsed: false,
              items: [
                {
                  text: '浏览器模式配置',
                  link: '/guide/browser/config',
                  docFooterText: '浏览器模式配置 | 浏览器模式',
                },
                {
                  text: '配置 Playwright',
                  link: '/guide/browser/playwright',
                  docFooterText: '配置 Playwright | 浏览器模式',
                },
                {
                  text: '配置 WebdriverIO',
                  link: '/guide/browser/webdriverio',
                  docFooterText: '配置 WebdriverIO | 浏览器模式',
                },
                {
                  text: 'Configuring Preview',
                  link: '/guide/browser/preview',
                  docFooterText: 'Configuring Preview | 浏览器模式',
                },
              ],
            },
            {
              text: 'API',
              collapsed: false,
              items: [
                {
                  text: 'Context API',
                  link: '/guide/browser/context',
                  docFooterText: 'Context API | 浏览器模式',
                },
                {
                  text: 'Interactivity API',
                  link: '/guide/browser/interactivity-api',
                  docFooterText: 'Interactivity API | 浏览器模式',
                },
                {
                  text: 'Locators',
                  link: '/guide/browser/locators',
                  docFooterText: 'Locators | 浏览器模式',
                },
                {
                  text: 'Assertion API',
                  link: '/guide/browser/assertion-api',
                  docFooterText: 'Assertion API | 浏览器模式',
                },
                {
                  text: 'Commands API',
                  link: '/guide/browser/commands',
                  docFooterText: 'Commands API | 浏览器模式',
                },
              ],
            },
            {
              text: '指南',
              collapsed: false,
              items: [
                {
                  text: '多种设置',
                  link: '/guide/browser/multiple-setups',
                  docFooterText: '多种设置 | 浏览器模式',
                },
                {
                  text: '组件测试',
                  link: '/guide/browser/component-testing',
                  docFooterText: '组件测试 | 浏览器模式',
                },
                {
                  text: '可视化回归测试',
                  link: '/guide/browser/visual-regression-testing',
                  docFooterText: '可视化回归测试 | 浏览器模式',
                },
                {
                  text: '跟踪查看器',
                  link: '/guide/browser/trace-view',
                  docFooterText: '跟踪查看器 | 浏览器模式',
                },
              ],
            },
            {
              items: [
                ...footer(),
                {
                  text: 'Node API',
                  link: '/advanced/api/',
                },
              ],
            },
          ],
          '/advanced': [
            {
              text: 'API',
              collapsed: false,
              items: [
                {
                  text: 'Node API',
                  items: [
                    {
                      text: '快速起步',
                      link: '/advanced/api/',
                    },
                    {
                      text: 'Vitest',
                      link: '/advanced/api/vitest',
                    },
                    {
                      text: 'TestProject',
                      link: '/advanced/api/test-project',
                    },
                    {
                      text: 'TestSpecification',
                      link: '/advanced/api/test-specification',
                    },
                  ],
                },
                {
                  text: 'Test Task API',
                  items: [
                    {
                      text: 'TestCase',
                      link: '/advanced/api/test-case',
                    },
                    {
                      text: 'TestSuite',
                      link: '/advanced/api/test-suite',
                    },
                    {
                      text: 'TestModule',
                      link: '/advanced/api/test-module',
                    },
                    {
                      text: 'TestCollection',
                      link: '/advanced/api/test-collection',
                    },
                  ],
                },
                {
                  text: '插件 API',
                  link: '/advanced/api/plugin',
                },
                {
                  text: '运行器 API',
                  link: '/advanced/runner',
                },
                {
                  text: '报告器 API',
                  link: '/advanced/api/reporters',
                },
                {
                  text: '任务元数据',
                  link: '/advanced/metadata',
                },
              ],
            },
            {
              text: '指南',
              collapsed: false,
              items: [
                {
                  text: '运行测试',
                  link: '/advanced/guide/tests',
                },
                {
                  text: '扩展报告器',
                  link: '/advanced/reporters',
                },
                {
                  text: '自定义运行池',
                  link: '/advanced/pool',
                },
              ],
            },
            {
              items: footer(),
            },
          ],
          '/team': [],
          '/blog': [],
          '/': [
            {
              text: '简介',
              collapsed: false,
              items: introduction(),
            },
            {
              text: 'API',
              collapsed: false,
              items: api(),
            },
            {
              text: '指南',
              collapsed: false,
              items: guide(),
            },
            {
              items: [
                {
                  text: '浏览器模式',
                  link: '/guide/browser',
                },
                {
                  text: 'Node API',
                  link: '/advanced/api',
                },
                {
                  text: '测试框架对比',
                  link: '/guide/comparisons',
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
}

function footer(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '配置索引',
      link: '/config/',
    },
    {
      text: 'Test API',
      link: '/api/',
    },
  ]
}

function introduction(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '为什么是vitest？',
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
      text: '配置索引',
      link: '/config/',
    },
  ]
}

function guide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '命令行界面',
      link: '/guide/cli',
    },
    {
      text: '测试筛选',
      link: '/guide/filtering',
    },
    {
      text: '测试项目',
      link: '/guide/projects',
    },
    {
      text: '报告器',
      link: '/guide/reporters',
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
      collapsed: true,
      items: [
        {
          text: '模拟日期',
          link: '/guide/mocking/dates',
        },
        {
          text: '模拟函数',
          link: '/guide/mocking/functions',
        },
        {
          text: '模拟全局对象',
          link: '/guide/mocking/globals',
        },
        {
          text: '模拟模块',
          link: '/guide/mocking/modules',
        },
        {
          text: '模拟文件系统',
          link: '/guide/mocking/file-system',
        },
        {
          text: '模拟请求',
          link: '/guide/mocking/requests',
        },
        {
          text: '模拟计时器',
          link: '/guide/mocking/timers',
        },
        {
          text: '模拟类',
          link: '/guide/mocking/classes',
        },
      ],
    },
    {
      text: '并行执行',
      link: '/guide/parallelism',
    },
    {
      text: '类型测试',
      link: '/guide/testing-types',
    },
    {
      text: 'UI模式',
      link: '/guide/ui',
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
      text: '常见错误',
      link: '/guide/common-errors',
    },
    {
      text: '迁移指南',
      link: '/guide/migration',
      collapsed: false,
      items: [
        {
          text: '迁移到 Vitest 4.0',
          link: '/guide/migration#vitest-4',
        },
        {
          text: '从 Jest 迁移',
          link: '/guide/migration#jest',
        },
      ],
    },
    {
      text: '性能',
      collapsed: false,
      items: [
        {
          text: '性能测试分析',
          link: '/guide/profiling-test-performance',
        },
        {
          text: '性能优化',
          link: '/guide/improving-performance',
        },
      ],
    },
  ]
}

function api(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Test API',
      link: '/api/',
    },
    {
      text: 'Mocks',
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
      text: 'Assert',
      link: '/api/assert',
    },
    {
      text: 'AssertType',
      link: '/api/assert-type',
    },
  ]
}
