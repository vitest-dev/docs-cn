import type { DefaultTheme } from 'vitepress'
import contributorNames from './contributor-names.json'

export interface Contributor {
  name: string
  avatar: string
}

export interface CoreTeam extends DefaultTheme.TeamMember {
  // required to download avatars from GitHub
  github: string
  twitter?: string
  mastodon?: string
  discord?: string
  youtube?: string
}

const contributorsAvatars: Record<string, string> = {}

const getAvatarUrl = (name: string) => import.meta.hot ? `https://github.com/${name}.png` : `/user-avatars/${name}.png`

export const contributors = (contributorNames as string[]).reduce((acc, name) => {
  contributorsAvatars[name] = getAvatarUrl(name)
  acc.push({ name, avatar: contributorsAvatars[name] })
  return acc
}, [] as Contributor[])
const createLinks = (tm: CoreTeam): CoreTeam => {
  tm.links = [{ icon: 'github', link: `https://github.com/${tm.github}` }]
  if (tm.mastodon)
    tm.links.push({ icon: 'mastodon', link: tm.mastodon })

  if (tm.discord)
    tm.links.push({ icon: 'discord', link: tm.discord })

  if (tm.youtube)
    tm.links.push({ icon: 'youtube', link: `https://www.youtube.com/@${tm.youtube}` })

  if (tm.twitter)
    tm.links.push({ icon: 'twitter', link: `https://twitter.com/${tm.twitter}` })

  return tm
}

const plainTeamMembers: CoreTeam[] = [
  {
    avatar: contributorsAvatars.antfu,
    name: 'Anthony Fu',
    github: 'antfu',
    mastodon: 'https://elk.zone/m.webtoo.ls/@antfu',
    twitter: 'antfu7',
    discord: 'https://chat.antfu.me',
    youtube: 'antfu',
    sponsor: 'https://github.com/sponsors/antfu',
<<<<<<< HEAD
    title: '狂热的开源者，在 NuxtLabs 工作',
    desc: 'Vite 和 Vue 的核心团队成员',
=======
    title: 'A fanatical open sourceror, working',
    org: 'NuxtLabs',
    orgLink: 'https://nuxtlabs.com/',
    desc: 'Core team member of Vite & Vue',
>>>>>>> fe8053ef3ea2d56a427a78f6c88545082eaec635
  },
  {
    avatar: contributorsAvatars['sheremet-va'],
    name: 'Vladimir',
    github: 'sheremet-va',
    mastodon: 'https://elk.zone/m.webtoo.ls/@sheremet_va',
    twitter: 'sheremet_va',
    sponsor: 'https://github.com/sponsors/sheremet-va',
    title: '全栈开源开发者',
    desc: 'Vitest 的核心团队成员',
  },
  {
    avatar: contributorsAvatars['patak-dev'],
    name: 'Patak',
    github: 'patak-dev',
    mastodon: 'https://elk.zone/m.webtoo.ls/@patak',
    twitter: 'patak_dev',
    sponsor: 'https://github.com/sponsors/patak-dev',
<<<<<<< HEAD
    title: '二当家，在 StackBlitz 工作',
    desc: 'Vite 和 Vue 的核心团队成员',
=======
    title: 'A collaborative being, working',
    org: 'StackBlitz',
    orgLink: 'https://stackblitz.com/',
    desc: 'Core team member of Vite & Vue',
>>>>>>> fe8053ef3ea2d56a427a78f6c88545082eaec635
  },
  {
    avatar: contributorsAvatars.Aslemammad,
    name: 'Mohammad Bagher',
    github: 'Aslemammad',
    mastodon: 'https://elk.zone/m.webtoo.ls/@aslemammad',
    twitter: 'asleMammadam',
    title: '开源开发者',
    desc: 'Poimandres 和 Vike 的团队成员',
  },
  {
    avatar: contributorsAvatars.Demivan,
    name: 'Ivan Demchuk',
    github: 'Demivan',
<<<<<<< HEAD
    twitter: 'IvanDemchuk',
    title: '技术负责人，全栈开发人员',
    desc: 'fluent-vue 的作者',
=======
    mastodon: 'https://elk.zone/fosstodon.org/@demivan',
    title: 'A tech lead, fullstack developer',
    desc: 'Author of fluent-vue',
>>>>>>> fe8053ef3ea2d56a427a78f6c88545082eaec635
  },
  {
    avatar: contributorsAvatars.userquin,
    name: 'Joaquín Sánchez',
    github: 'userquin',
    mastodon: 'https://elk.zone/m.webtoo.ls/@userquin',
    twitter: 'userquin',
    title: '全栈和安卓开发者',
    desc: 'Vite 的狂热追随者',
  },
  {
    avatar: contributorsAvatars.zxch3n,
    name: 'Zixuan Chen',
    github: 'zxch3n',
    mastodon: 'https://elk.zone/hachyderm.io/@zx',
    twitter: 'zxch3n',
<<<<<<< HEAD
    title: '全栈开发人员',
    desc: '创建协作工具',
=======
    title: 'A fullstack developer',
    desc: 'Working on CRDTs & local-first software',
  },
  {
    avatar: contributorsAvatars.poyoho,
    name: 'Yoho Po',
    github: 'poyoho',
    twitter: '@yoho_po',
    title: 'It\'s no problem in my locall',
    desc: 'Core team member of Vite & Team member of Vitest',
  },
  {
    avatar: contributorsAvatars.AriPerkkio,
    name: 'Ari Perkkiö',
    github: 'AriPerkkio',
    title: 'A fullstack developer, working',
    desc: 'Team member of Vitest',
    org: 'Cloudamite',
    orgLink: 'https://cloudamite.com/',
>>>>>>> fe8053ef3ea2d56a427a78f6c88545082eaec635
  },
]

const teamMembers = plainTeamMembers.map(tm => createLinks(tm))

export { teamMembers }
