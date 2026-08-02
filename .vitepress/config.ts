import { transformerNotationWordHighlight } from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { withPwa } from '@vite-pwa/vitepress'
import { extendConfig } from '@voidzero-dev/vitepress-theme/config'
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
      ['meta', { name: 'keywords', content: 'vitest, vite, test, coverage, snapshot, react, vue, preact, svelte, solid, lit, marko, ruby, cypress, puppeteer, jsdom, happy-dom, test-runner, jest, typescript, esm, node' }],
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
    ],
    lastUpdated: true,
    vite: {
      plugins: [
        groupIconVitePlugin({
          customIcon: {
            'CLI': 'vscode-icons:file-type-shell',
            '.spec.ts': 'vscode-icons:file-type-testts',
            '.test.ts': 'vscode-icons:file-type-testts',
            '.spec.js': 'vscode-icons:file-type-testjs',
            '.test.js': 'vscode-icons:file-type-testjs',
            'next': '',
          },
        }) as any,
      ],
      define: {
        __VITEST_VERSION__: JSON.stringify(version),
      },
    },
    markdown: {
      container: {
        tipLabel: '提示',
        warningLabel: '注意',
        dangerLabel: '警告',
        infoLabel: '说明',
        detailsLabel: '详情',
      },
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

      // banner: {
      //   id: 'viteplus-alpha',
      //   text: 'Vite+ Alpha 发布：开源、统一、下一代工具链。',
      //   url: 'https://voidzero.dev/posts/announcing-vite-plus-alpha?utm_source=vitest&utm_content=top_banner',
      // },

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
        copyright: `© ${new Date().getFullYear()} VoidZero Inc. 和 Vitest 贡献者。`,
        nav: [
          {
            title: 'Vitest',
            items: [
              { text: '指南', link: '/guide/' },
              { text: 'API', link: '/api/test' },
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
        { text: 'API', link: '/api/test', activeMatch: '^/api/' },
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
                {
                  text: 'Releases',
                  link: '/releases',
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
            text: '配置索引',
            collapsed: false,
            items: [
              {
                text: '配置 Vitest',
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
                text: 'tags',
                link: '/config/tags',
              },
              {
                text: 'strictTags',
                link: '/config/stricttags',
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
                text: 'repeats',
                link: '/config/repeats',
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
                text: 'changed',
                link: '/config/changed',
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
                text: 'browser.detailsPanelPosition',
                link: '/config/browser/detailspanelposition',
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
            text: '学习',
            collapsed: false,
            items: [
              {
                text: '编写测试用例',
                link: '/guide/learn/writing-tests',
                docFooterText: '编写测试用例 | 学习',
              },
              {
                text: '使用匹配器',
                link: '/guide/learn/matchers',
                docFooterText: '使用匹配器 | 学习',
              },
              {
                text: '测试异步代码',
                link: '/guide/learn/async',
                docFooterText: '测试异步代码 | 学习',
              },
              {
                text: '初始化与清理',
                link: '/guide/learn/setup-teardown',
                docFooterText: 'Setup and Teardown | 学习',
              },
              {
                text: '模拟函数',
                link: '/guide/learn/mock-functions',
                docFooterText: '模拟函数 | 学习',
              },
              {
                text: '快照测试',
                link: '/guide/learn/snapshots',
                docFooterText: '快照测试 | 学习',
              },
              {
                text: '测试实践',
                link: '/guide/learn/testing-in-practice',
                docFooterText: '测试实践 | 学习',
              },
              {
                text: '调试测试',
                link: '/guide/learn/debugging-tests',
                docFooterText: '调试测试 | 学习',
              },
              {
                text: '使用 AI 编写测试',
                link: '/guide/learn/writing-tests-with-ai',
                docFooterText: '使用 AI 编写测试 | 学习',
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
              {
                text: 'Playwright 追踪',
                link: '/guide/browser/playwright-traces',
                docFooterText: 'Playwright 追踪 | 浏览器模式',
              },
              {
                text: 'ARIA 快照',
                link: '/guide/browser/aria-snapshots',
                docFooterText: 'ARIA 快照 | 浏览器模式',
              },
            ],
          },
          // Authoring — how to express a test in code: constructing it,
          // asserting, mocking dependencies, attaching metadata. The page is
          // about *test content*, not the runner. Discriminator: "How do I
          // write X in a test?" If yes, it belongs here. Mocking sub-pages
          // live nested because they're a multi-page subtopic.
          {
            text: '编写测试',
            collapsed: false,
            items: [
              {
                text: '测试上下文',
                link: '/guide/test-context',
              },
              {
                text: '运行生命周期',
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
                    text: '日期',
                    link: '/guide/mocking/dates',
                  },
                  {
                    text: '函数',
                    link: '/guide/mocking/functions',
                  },
                  {
                    text: '全局对象',
                    link: '/guide/mocking/globals',
                  },
                  {
                    text: '模块',
                    link: '/guide/mocking/modules',
                  },
                  {
                    text: '文件系统',
                    link: '/guide/mocking/file-system',
                  },
                  {
                    text: '请求',
                    link: '/guide/mocking/requests',
                  },
                  {
                    text: '计时器',
                    link: '/guide/mocking/timers',
                  },
                  {
                    text: '类',
                    link: '/guide/mocking/classes',
                  },
                ],
              },
              {
                text: '测试标签',
                link: '/guide/test-tags',
              },
              {
                text: '测试注释',
                link: '/guide/test-annotations',
              },
              {
                text: '扩展匹配器',
                link: '/guide/extending-matchers',
              },
              {
                text: '类型测试',
                link: '/guide/testing-types',
              },
              {
                text: 'Benchmarking',
                link: '/guide/benchmarking',
              },
              {
                text: '内联测试',
                link: '/guide/in-source',
              },
            ],
          },
          // Workflow — how to invoke, select, and orchestrate test runs
          // across files/projects/processes. The page is about the *runner
          // and tooling around it*, not what's inside a test. Discriminator:
          // "How do I run / filter / parallelize / integrate Vitest?" If a
          // page is about the runtime environment of the tests themselves
          // (jsdom, node), it still belongs here — that's a workflow choice.
          {
            text: '工作流',
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
                text: '测试项目',
                link: '/guide/projects',
              },
              {
                text: '测试环境',
                link: '/guide/environment',
              },
              {
                text: '并行测试',
                link: '/guide/parallelism',
              },
              {
                text: '报告器',
                link: '/guide/reporters',
              },
              {
                text: 'UI 模式',
                link: '/guide/ui',
              },
              {
                text: 'IDE 插件',
                link: '/guide/ide',
              },
            ],
          },
          // Quality & Debugging — how to verify the test run is healthy and
          // diagnose it when it isn't. Coverage, perf, leak detection, error
          // triage, observability. Discriminator: "Is my suite good?" or
          // "Why did this fail / leak / slow down?" If a page primarily
          // measures or fixes the suite (rather than authoring or running
          // it), put it here.
          {
            text: '质量与调试',
            collapsed: false,
            items: [
              {
                text: '覆盖率',
                link: '/guide/coverage',
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
          // Recipes — end-to-end patterns that solve a concrete problem by
          // combining multiple features. Each entry is titled by the problem
          // ("Database Transaction per Test"), not the feature. Add a recipe
          // when a single feature page would over-explain, when the value
          // comes from composition, or when users would search by intent
          // rather than by API name.
          {
            text: '技巧',
            collapsed: false,
            items: [
              {
                text: '一个测试对应一个数据库事务',
                link: '/guide/recipes/db-transaction',
              },
              {
                text: '优雅地取消长时间运行的操作',
                link: '/guide/recipes/cancellable',
              },
              {
                text: '等待异步条件',
                link: '/guide/recipes/wait-for',
              },
              {
                text: '在测试中收窄类型',
                link: '/guide/recipes/type-narrowing',
              },
              {
                text: '自定义断言工具函数',
                link: '/guide/recipes/custom-assertions',
              },
              {
                text: '监视非直接导入的文件',
                link: '/guide/recipes/watch-templates',
              },
              {
                text: '扩展浏览器定位器',
                link: '/guide/recipes/browser-locators',
              },
              {
                text: 'Schema 驱动断言',
                link: '/guide/recipes/schema-matching',
              },
              {
                text: 'Auto-Cleanup with `using`',
                link: '/guide/recipes/explicit-resources',
              },
              {
                text: 'Conditional Mocking with `vi.when`',
                link: '/guide/recipes/conditional-mocking',
              },
              {
                text: 'Per-File Isolation Settings',
                link: '/guide/recipes/disable-isolation',
              },
              {
                text: 'Parallel and Sequential Test Files',
                link: '/guide/recipes/parallel-sequential',
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
          // Migration — one-time transitional content: cross-version
          // upgrades and porting from other test runners (Jest, Mocha).
          // Sits near the bottom because it's not daily-use and would push
          // active-use guides further from the user's first scroll.
          {
            text: '迁移',
            link: '/guide/migration',
            collapsed: false,
            items: [
              {
                text: '迁移至 Vitest 5.0',
                link: '/guide/migration#vitest-5',
              },
              {
                text: '从 Jest 迁移',
                link: '/guide/migration#jest',
              },
              {
                text: '从 Mocha + Chai + Sinon 迁移',
                link: '/guide/migration#mocha-chai-sinon',
              },
            ],
          },
          {
            items: [
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
            items: [
              {
                text: 'Test',
                link: '/api/test',
              },
              {
                text: 'Describe',
                link: '/api/describe',
              },
              {
                text: 'Hooks',
                link: '/api/hooks',
              },
            ],
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
                text: 'Render Function',
                collapsed: false,
                items: [
                  {
                    text: 'react',
                    link: '/api/browser/react',
                  },
                  {
                    text: 'vue',
                    link: '/api/browser/vue',
                  },
                  {
                    text: 'svelte',
                    link: '/api/browser/svelte',
                  },
                  // {
                  //   text: 'angular',
                  //   link: '/api/browser/angular',
                  // },
                ],
              },
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
