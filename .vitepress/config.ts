import { transformerNotationWordHighlight } from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { withPwa } from '@vite-pwa/vitepress'
import { extendConfig } from '@voidzero-dev/vitepress-theme/config'
import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
  localIconLoader,
} from 'vitepress-plugin-group-icons'
import llmstxt from 'vitepress-plugin-llms'
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
  return withPwa(extendConfig(defineConfig({
    lang: 'en-US',
    title: vitestName,
    description: vitestDescription,
    srcExclude: [
      '**/guide/examples/*',
      '**/guide/cli-generated.md',
    ],
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
      ['meta', { name: 'theme-color', content: '#22FF84' }],
      ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
      ['link', { rel: 'icon', href: '/logo-without-border.svg', type: 'image/svg+xml' }],
      ['meta', { name: 'author', content: `${teamMembers.map(c => c.name).join(', ')} and ${vitestName} contributors` }],
      ['meta', { name: 'keywords', content: 'vitest, vite, test, coverage, snapshot, react, vue, preact, svelte, solid, lit, marko, ruby, cypress, puppeteer, jsdom, happy-dom, test-runner, jest, typescript, esm, tinyspy, node' }],
      ['meta', { property: 'og:title', content: vitestName }],
      ['meta', { property: 'og:description', content: vitestDescription }],
      ['meta', { property: 'og:url', content: ogUrl }],
      ['meta', { property: 'og:image', content: ogImage }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['link', { rel: 'preload', as: 'style', onload: 'this.onload=null;this.rel=\'stylesheet\'', href: font }],
      ['noscript', {}, `<link rel="stylesheet" crossorigin="anonymous" href="${font}" />`],
      ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vitest' }],
      ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
      ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
      ['script', { 'src': 'https://cdn.usefathom.com/script.js', 'data-site': 'BEAFAKYG', 'data-spa': 'auto', 'defer': '' }],
    ],
    lastUpdated: true,
    vite: {
      plugins: [
        groupIconVitePlugin({
          customIcon: {
            'CLI': 'vscode-icons:file-type-shell',
            'vitest.shims': localIconLoader(import.meta.url, '../public/logo-without-border.svg'),
            'vitest.config': localIconLoader(import.meta.url, '../public/logo-without-border.svg'),
            'vitest.workspace': localIconLoader(import.meta.url, '../public/logo-without-border.svg'),
            '.spec.ts': 'vscode-icons:file-type-testts',
            '.test.ts': 'vscode-icons:file-type-testts',
            '.spec.js': 'vscode-icons:file-type-testjs',
            '.test.js': 'vscode-icons:file-type-testjs',
            'marko': 'vscode-icons:file-type-marko',
            'qwik': 'logos:qwik-icon',
            'next': '',
            'vite.config': localIconLoader(import.meta.url, '../public/logo-without-border-vite.svg'),
          },
        }) as any,
        llmstxt(),
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
      codeTransformers: mode === 'development'
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
      variant: 'vitest',
      logo: '/logo.svg',
      lastUpdatedText: '最后更新',
      docFooter: {
        prev: '上一页',
        next: '下一页',
      },
      editLink: {
        pattern: 'https://github.com/vitest-dev/docs-cn/edit/dev/:path',
        text: '在 GitHub 上编辑此页面',
      },

      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '搜索',
            },
            modal: {
              resetButtonTitle: '清除查询条件',
              noResultsText: '无法找到相关结果',
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭',
              },
            },
          },
        },
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
        copyright: `© ${new Date().getFullYear()} VoidZero Inc. and Vitest contributors.`,
        nav: [
          {
            title: 'Vitest',
            items: [
              { text: '指南', link: '/guide/' },
              { text: 'API', link: '/api/' },
              { text: '配置', link: '/config/' },
            ],
          },
          {
            title: '资源',
            items: [
              { text: '团队', link: '/team' },
              { text: '博客', link: '/blog' },
              { text: '更新日志', link: releases },
            ],
          },
          {
            title: '版本',
            items: [
              { text: '未发布', link: 'https://main.vitest.dev/' },
              { text: 'Vitest v3 文档', link: 'https://v3.cn.vitest.dev/' },
              { text: 'Vitest v2 文档', link: 'https://v2.vitest.dev/' },
              { text: 'Vitest v1 文档', link: 'https://v1.vitest.dev/' },
              { text: 'Vitest v0 文档', link: 'https://v0.vitest.dev/' },
            ],
          },
          /* {
            title: 'Legal',
            items: [
              { text: 'Terms & Conditions', link: 'https://voidzero.dev/terms' },
              { text: 'Privacy Policy', link: 'https://voidzero.dev/privacy' },
              { text: 'Cookie Policy', link: 'https://voidzero.dev/cookies' },
            ],
          }, */
        ],
        social: [
          { icon: 'github', link: github },
          { icon: 'discord', link: discord },
          // { icon: 'mastodon', link: mastodon }, -- the link shows github
          { icon: 'bluesky', link: bluesky },
        ],
      },

      nav: [
        { text: '指南', link: '/guide/', activeMatch: '^/guide/' },
        { text: 'API', link: '/api/', activeMatch: '^/api/' },
        { text: '配置', link: '/config/', activeMatch: '^/config/' },
        {
          text: '博客',
          link: '/blog',
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
                {
                  text: '团队',
                  link: '/team',
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
                  text: 'v3.x',
                  link: 'https://v3.cn.vitest.dev/',
                },
                {
                  text: 'v2.x',
                  link: 'https://v2.vitest.dev/',
                },
                {
                  text: 'v1.x',
                  link: 'https://v1.vitest.dev/',
                },
                {
                  text: 'v0.x',
                  link: 'https://v0.vitest.dev/',
                },
              ],
            },
          ],
        },
      ],

      sidebar: {
        '/config': [
          {
            text: 'Config Reference',
            collapsed: false,
            items: [
              {
                text: '配置文件',
                link: '/config/',
              },
              {
                text: 'include',
                link: '/config/include',
              },
              {
                text: 'exclude',
                link: '/config/exclude',
              },
              {
                text: 'includeSource',
                link: '/config/include-source',
              },
              {
                text: 'name',
                link: '/config/name',
              },
              {
                text: 'server',
                link: '/config/server',
              },
              {
                text: 'deps',
                link: '/config/deps',
              },
              {
                text: 'runner',
                link: '/config/runner',
              },
              {
                text: 'benchmark',
                link: '/config/benchmark',
              },
              {
                text: 'alias',
                link: '/config/alias',
              },
              {
                text: 'globals',
                link: '/config/globals',
              },
              {
                text: 'environment',
                link: '/config/environment',
              },
              {
                text: 'environmentOptions',
                link: '/config/environmentoptions',
              },
              {
                text: 'watch',
                link: '/config/watch',
              },
              {
                text: 'watchTriggerPatterns',
                link: '/config/watchtriggerpatterns',
              },
              {
                text: 'root',
                link: '/config/root',
              },
              {
                text: 'dir',
                link: '/config/dir',
              },
              {
                text: 'reporters',
                link: '/config/reporters',
              },
              {
                text: 'outputFile',
                link: '/config/outputfile',
              },
              {
                text: 'pool',
                link: '/config/pool',
              },
              {
                text: 'execArgv',
                link: '/config/execargv',
              },
              {
                text: 'vmMemoryLimit',
                link: '/config/vmmemorylimit',
              },
              {
                text: 'fileParallelism',
                link: '/config/fileparallelism',
              },
              {
                text: 'maxWorkers',
                link: '/config/maxworkers',
              },
              {
                text: 'testTimeout',
                link: '/config/testtimeout',
              },
              {
                text: 'hookTimeout',
                link: '/config/hooktimeout',
              },
              {
                text: 'teardownTimeout',
                link: '/config/teardowntimeout',
              },
              {
                text: 'silent',
                link: '/config/silent',
              },
              {
                text: 'setupFiles',
                link: '/config/setupfiles',
              },
              {
                text: 'provide',
                link: '/config/provide',
              },
              {
                text: 'globalSetup',
                link: '/config/globalsetup',
              },
              {
                text: 'forceRerunTriggers',
                link: '/config/forcereruntriggers',
              },
              {
                text: 'coverage',
                link: '/config/coverage',
              },
              {
                text: 'testNamePattern',
                link: '/config/testnamepattern',
              },
              {
                text: 'ui',
                link: '/config/ui',
              },
              {
                text: 'open',
                link: '/config/open',
              },
              {
                text: 'api',
                link: '/config/api',
              },
              {
                text: 'clearMocks',
                link: '/config/clearmocks',
              },
              {
                text: 'mockReset',
                link: '/config/mockreset',
              },
              {
                text: 'restoreMocks',
                link: '/config/restoremocks',
              },
              {
                text: 'unstubEnvs',
                link: '/config/unstubenvs',
              },
              {
                text: 'unstubGlobals',
                link: '/config/unstubglobals',
              },
              {
                text: 'snapshotFormat',
                link: '/config/snapshotformat',
              },
              {
                text: 'snapshotSerializers',
                link: '/config/snapshotserializers',
              },
              {
                text: 'resolveSnapshotPath',
                link: '/config/resolvesnapshotpath',
              },
              {
                text: 'allowOnly',
                link: '/config/allowonly',
              },
              {
                text: 'passWithNoTests',
                link: '/config/passwithnotests',
              },
              {
                text: 'logHeapUsage',
                link: '/config/logheapusage',
              },
              {
                text: 'css',
                link: '/config/css',
              },
              {
                text: 'maxConcurrency',
                link: '/config/maxconcurrency',
              },
              {
                text: 'cache',
                link: '/config/cache',
              },
              {
                text: 'sequence',
                link: '/config/sequence',
              },
              {
                text: 'typecheck',
                link: '/config/typecheck',
              },
              {
                text: 'slowTestThreshold',
                link: '/config/slowtestthreshold',
              },
              {
                text: 'chaiConfig',
                link: '/config/chaiconfig',
              },
              {
                text: 'bail',
                link: '/config/bail',
              },
              {
                text: 'retry',
                link: '/config/retry',
              },
              {
                text: 'onConsoleLog',
                link: '/config/onconsolelog',
              },
              {
                text: 'onStackTrace',
                link: '/config/onstacktrace',
              },
              {
                text: 'onUnhandledError',
                link: '/config/onunhandlederror',
              },
              {
                text: 'dangerouslyIgnoreUnhandled...',
                link: '/config/dangerouslyignoreunhandlederrors',
              },
              {
                text: 'diff',
                link: '/config/diff',
              },
              {
                text: 'fakeTimers',
                link: '/config/faketimers',
              },
              {
                text: 'projects',
                link: '/config/projects',
              },
              {
                text: 'isolate',
                link: '/config/isolate',
              },
              {
                text: 'includeTaskLocation',
                link: '/config/includetasklocation',
              },
              {
                text: 'snapshotEnvironment',
                link: '/config/snapshotenvironment',
              },
              {
                text: 'env',
                link: '/config/env',
              },
              {
                text: 'expect',
                link: '/config/expect',
              },
              {
                text: 'printConsoleTrace',
                link: '/config/printconsoletrace',
              },
              {
                text: 'attachmentsDir',
                link: '/config/attachmentsdir',
              },
              {
                text: 'hideSkippedTests',
                link: '/config/hideskippedtests',
              },
              {
                text: 'mode',
                link: '/config/mode',
              },
              {
                text: 'expandSnapshotDiff',
                link: '/config/expandsnapshotdiff',
              },
              {
                text: 'disableConsoleIntercept',
                link: '/config/disableconsoleintercept',
              },
              {
                text: 'experimental',
                link: '/config/experimental',
              },
            ],
          },
          {
            text: 'Browser Mode',
            collapsed: false,
            items: [
              {
                text: 'Providers',
                collapsed: false,
                items: [
                  {
                    text: 'playwright',
                    link: '/config/browser/playwright',
                  },
                  {
                    text: 'webdriverio',
                    link: '/config/browser/webdriverio',
                  },
                  {
                    text: 'preview',
                    link: '/config/browser/preview',
                  },
                ],
              },
              // {
              //   text: 'Render Function',
              //   collapsed: true,
              //   items: [
              //     {
              //       text: 'react',
              //       link: '/config/browser/react',
              //     },
              //     {
              //       text: 'vue',
              //       link: '/config/browser/vue',
              //     },
              //     {
              //       text: 'svelte',
              //       link: '/config/browser/svelte',
              //     },
              //   ],
              // },
              {
                text: 'browser.enabled',
                link: '/config/browser/enabled',
              },
              {
                text: 'browser.instances',
                link: '/config/browser/instances',
              },
              {
                text: 'browser.headless',
                link: '/config/browser/headless',
              },
              {
                text: 'browser.isolate',
                link: '/config/browser/isolate',
              },
              {
                text: 'browser.testerHtmlPath',
                link: '/config/browser/testerhtmlpath',
              },
              {
                text: 'browser.api',
                link: '/config/browser/api',
              },
              {
                text: 'browser.provider',
                link: '/config/browser/provider',
              },
              {
                text: 'browser.ui',
                link: '/config/browser/ui',
              },
              {
                text: 'browser.viewport',
                link: '/config/browser/viewport',
              },
              {
                text: 'browser.locators',
                link: '/config/browser/locators',
              },
              {
                text: 'browser.screenshotDirectory',
                link: '/config/browser/screenshotdirectory',
              },
              {
                text: 'browser.screenshotFailures',
                link: '/config/browser/screenshotfailures',
              },
              {
                text: 'browser.orchestratorScripts',
                link: '/config/browser/orchestratorscripts',
              },
              {
                text: 'browser.commands',
                link: '/config/browser/commands',
              },
              {
                text: 'browser.connectTimeout',
                link: '/config/browser/connecttimeout',
              },
              {
                text: 'browser.trace',
                link: '/config/browser/trace',
              },
              {
                text: 'browser.trackUnhandledErrors',
                link: '/config/browser/trackunhandlederrors',
              },
              {
                text: 'browser.expect',
                link: '/config/browser/expect',
              },
            ],
          },
          // {
          //   text: '@vitest/plugin-eslint',
          //   collapsed: true,
          //   items: [
          //     {
          //       text: 'Lints',
          //       link: '/config/eslint',
          //     },
          //     // TODO: generate
          //     {
          //       text: 'consistent-test-filename',
          //       link: '/config/eslint/consistent-test-filename',
          //     },
          //     {
          //       text: 'consistent-test-it',
          //       link: '/config/eslint/consistent-test-it',
          //     },
          //   ],
          // },
          // {
          //   text: 'vscode',
          //   link: '/config/vscode',
          // },
        ],
        '/guide': [
          {
            text: '简介',
            collapsed: false,
            items: [
              {
                text: '为什么是 Vitest?',
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
            ],
          },
          {
            text: '浏览器模式',
            collapsed: false,
            items: [
              {
                text: '什么是浏览器模式？',
                link: '/guide/browser/why',
                docFooterText: '什么是浏览器模式？ | 浏览器模式',
              },
              {
                text: '快速起步',
                link: '/guide/browser/',
                docFooterText: '快速起步 | 浏览器模式',
              },
              {
                text: '多环境配置',
                link: '/guide/browser/multiple-setups',
                docFooterText: '多环境配置 | 浏览器模式',
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
                text: '追踪查看器',
                link: '/guide/browser/trace-view',
                docFooterText: '追踪查看器 | 浏览器模式',
              },
            ],
          },
          {
            text: '指南',
            collapsed: false,
            items: [
              {
                text: '命令行界面',
                link: '/guide/cli',
              },
              {
                text: '测试筛选',
                link: '/guide/filtering',
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
                text: 'Test Run Lifecycle',
                link: '/guide/lifecycle',
              },
              {
                text: '快照',
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
                text: '并行测试',
                link: '/guide/parallelism',
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
                text: '覆盖率',
                link: '/guide/coverage',
              },
              {
                text: '类型测试',
                link: '/guide/testing-types',
              },
              {
                text: 'UI 模式',
                link: '/guide/ui',
              },
              {
                text: '内联测试',
                link: '/guide/in-source',
              },
              {
                text: '测试注释',
                link: '/guide/test-annotations',
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
                    text: '迁移到 Vitest 4',
                    link: '/guide/migration#vitest-4',
                  },
                  {
                    text: '从 Jest 迁移',
                    link: '/guide/migration#jest',
                  },
                  {
                    text: 'Migrating from Mocha + Chai + Sinon',
                    link: '/guide/migration#mocha-chai-sinon',
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
              {
                text: 'OpenTelemetry',
                link: '/guide/open-telemetry',
              },
            ],
          },
          {
            text: '高级指南',
            collapsed: true,
            items: [
              {
                text: '快速开始',
                link: '/guide/advanced/',
              },
              {
                text: '运行测试 API',
                link: '/guide/advanced/tests',
              },
              {
                text: '扩展报告器',
                link: '/guide/advanced/reporters',
              },
              {
                text: '自定义运行池',
                link: '/guide/advanced/pool',
              },
            ],
          },
          {
            items: [
              {
                text: 'Recipes',
                link: '/guide/recipes',
              },
              {
                text: '测试框架比较',
                link: '/guide/comparisons',
              },
            ],
          },
        ],
        '/api': [
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
          {
            text: '浏览器模式',
            items: [
              {
                text: 'Context API',
                link: '/api/browser/context',
              },
              {
                text: 'Interactivity API',
                link: '/api/browser/interactivity',
              },
              {
                text: 'Locators',
                link: '/api/browser/locators',
              },
              {
                text: 'Assertions API',
                link: '/api/browser/assertions',
              },
              {
                text: 'Commands API',
                link: '/api/browser/commands',
              },
            ],
          },
          {
            text: '高级 API',
            collapsed: true,
            items: [
              {
                text: 'Vitest',
                link: '/api/advanced/vitest',
              },
              {
                text: 'TestProject',
                link: '/api/advanced/test-project',
              },
              {
                text: 'TestSpecification',
                link: '/api/advanced/test-specification',
              },
              {
                text: 'TestCase',
                link: '/api/advanced/test-case',
              },
              {
                text: 'TestSuite',
                link: '/api/advanced/test-suite',
              },
              {
                text: 'TestModule',
                link: '/api/advanced/test-module',
              },
              {
                text: 'TestCollection',
                link: '/api/advanced/test-collection',
              },
              {
                text: 'VitestPlugin',
                link: '/api/advanced/plugin',
              },
              {
                text: 'VitestRunner',
                link: '/api/advanced/runner',
              },
              {
                text: 'Reporter',
                link: '/api/advanced/reporters',
              },
              {
                text: 'TaskMeta',
                link: '/api/advanced/metadata',
              },
              {
                text: 'TestArtifact',
                link: '/api/advanced/artifacts',
              },
            ],
          },
          // {
          //   text: 'Text Runner',
          //   collapsed: false,
          //   items: [
          //     // TODO: generate
          //     {
          //       text: 'test',
          //       link: '/api/test',
          //     },
          //     {
          //       text: 'describe',
          //       link: '/api/describe',
          //     },
          //     {
          //       text: 'beforeEach',
          //       link: '/api/before-each',
          //     },
          //     {
          //       text: 'afterEach',
          //       link: '/api/after-each',
          //     },
          //   ],
          // },
          // {
          //   text: 'Assertion API',
          //   collapsed: false,
          //   items: [
          //     {
          //       text: 'expect',
          //       link: '/api/expect',
          //     },
          //     {
          //       text: 'assert',
          //       link: '/api/assert',
          //     },
          //     {
          //       text: 'expectTypeOf',
          //       link: '/api/expect-typeof',
          //     },
          //     {
          //       text: 'assertType',
          //       link: '/api/assert-type',
          //     },
          //   ],
          // },
          // {
          //   text: 'Vi Utility API',
          //   collapsed: false,
          //   items: [
          //     {
          //       text: 'Mock Modules',
          //       link: '/api/vi/mock-modiles',
          //     },
          //     {
          //       text: 'Mock Functions',
          //       link: '/api/vi/mock-functions',
          //     },
          //     {
          //       text: 'Mock Timers',
          //       link: '/api/vi/mock-timers',
          //     },
          //     {
          //       text: 'Miscellaneous',
          //       link: '/api/vi/miscellaneous',
          //     },
          //   ],
          // },
          // {
          //   text: 'Browser Mode',
          //   collapsed: false,
          //   items: [
          //     // TODO: generate
          //     {
          //       text: 'page',
          //       link: '/api/browser/page',
          //     },
          //     {
          //       text: 'locators',
          //       link: '/api/browser/locators',
          //     },
          //   ],
          // },
        ],
      },
    },
    pwa,
    transformHead,
  })))
}
