// noinspection ES6PreferShortImport: IntelliJ IDE hint to avoid warning to use `~/contributors`, will fail on build if changed

/* Texts */
export const vitestName = 'Vitest'
export const vitestShortName = 'Vitest'
export const vitestDescription = '由 Vite 提供支持的极速单元测试框架'

/* CDN fonts and styles */
export const googleapis = 'https://fonts.googleapis.com'
export const gstatic = 'https://fonts.gstatic.com'
export const font = `${googleapis}/css2?family=Readex+Pro:wght@200;400;600&display=swap`

/* vitepress head */
export const ogUrl = 'https://vitest.dev/'
export const ogImage = `${ogUrl}og.png`

/* GitHub and social links */
export const github = 'https://github.com/vitest-dev/vitest'
export const releases = 'https://github.com/vitest-dev/vitest/releases'
export const contributing = 'https://github.com/vitest-dev/vitest/blob/main/CONTRIBUTING.md'
export const discord = 'https://chat.vitest.dev'
export const twitter = 'https://twitter.com/vitest_dev'

/* Avatar/Image/Sponsors servers */
export const preconnectLinks = [googleapis, gstatic]
export const preconnectHomeLinks = [googleapis, gstatic]

/* PWA runtime caching urlPattern regular expressions */
export const pwaFontsRegex = new RegExp(`^${googleapis}/.*`, 'i')
export const pwaFontStylesRegex = new RegExp(`^${gstatic}/.*`, 'i')
