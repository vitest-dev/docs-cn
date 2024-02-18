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

function getAvatarUrl(name: string) {
  return import.meta.hot ? `https://github.com/${name}.png` : `/user-avatars/${name}.png`
}

export const contributors = (contributorNames).reduce<Contributor[]>((acc, name) => {
  contributorsAvatars[name] = getAvatarUrl(name)
  acc.push({ name, avatar: contributorsAvatars[name] })
  return acc
}, [])

function createLinks(tm: CoreTeam): CoreTeam {
  tm.links = [{ icon: 'github', link: `https://github.com/${tm.github}` }]
  if (tm.mastodon)
    tm.links.push({ icon: 'mastodon', link: tm.mastodon })

  if (tm.discord)
    tm.links.push({ icon: 'discord', link: tm.discord })

  if (tm.youtube) {
    tm.links.push({
      icon: 'youtube',
      link: `https://www.youtube.com/@${tm.youtube}`,
    })
  }

  if (tm.twitter)
    tm.links.push({ icon: 'x', link: `https://twitter.com/${tm.twitter}` })

  return tm
}

const plainTeamMembers: CoreTeam[] = [
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
    avatar: contributorsAvatars.antfu,
    name: 'Anthony Fu',
    github: 'antfu',
    mastodon: 'https://elk.zone/m.webtoo.ls/@antfu',
    twitter: 'antfu7',
    discord: 'https://chat.antfu.me',
    youtube: 'antfu',
    sponsor: 'https://github.com/sponsors/antfu',
    title: '狂热的开源者，工作于',
    org: 'NuxtLabs',
    orgLink: 'https://nuxtlabs.com/',
    desc: 'Vite 和 Vue 的核心团队成员',
  },
  {
    avatar: contributorsAvatars.AriPerkkio,
    name: 'Ari Perkkiö',
    github: 'AriPerkkio',
    mastodon: 'https://elk.zone/m.webtoo.ls/@AriPerkkio',
    twitter: 'ari_perkkio',
    sponsor: 'https://github.com/sponsors/AriPerkkio',
    title: '全栈开发者, 工作于',
    desc: 'Vitest 核心团队成员',
    org: 'Cloudamite',
    orgLink: 'https://cloudamite.com/',
  },
  {
    avatar: contributorsAvatars['patak-dev'],
    name: 'Patak',
    github: 'patak-dev',
    mastodon: 'https://elk.zone/m.webtoo.ls/@patak',
    twitter: 'patak_dev',
    sponsor: 'https://github.com/sponsors/patak-dev',
    title: '二当家，工作于',
    org: 'StackBlitz',
    orgLink: 'https://stackblitz.com/',
    desc: 'Vite 和 Vue 的核心团队成员',
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
    avatar: contributorsAvatars.Dunqing,
    name: 'Dunqing',
    github: 'Dunqing',
    twitter: '@Dunqingg',
    title: '热衷于开源贡献者',
    desc: 'Vitest 和 UnoCSS 团队成员',
  },
  {
    avatar: contributorsAvatars.zxch3n,
    name: 'Zixuan Chen',
    github: 'zxch3n',
    mastodon: 'https://elk.zone/hachyderm.io/@zx',
    twitter: 'zxch3n',
    title: '全栈开发者',
    desc: '开发 CRDT 和本地优先软件',
  },
]

const plainTeamEmeritiMembers: CoreTeam[] = [
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
    mastodon: 'https://elk.zone/fosstodon.org/@demivan',
    twitter: 'IvanDemchuk',
    title: '技术负责人，全栈开发者',
    desc: 'fluent-vue 的作者',
  },
  {
    avatar: contributorsAvatars.poyoho,
    name: 'Yoho Po',
    github: 'poyoho',
    twitter: '@yoho_po',
    title: '我写的代码在我电脑上绝对没问题',
    desc: 'Vite 核心团队成员 和 Vitest 团队成员',
  },
  {
    avatar: contributorsAvatars['hi-ogawa'],
    name: 'Hiroshi Ogawa',
    github: 'hi-ogawa',
    twitter: 'hiroshi_18181',
    title: '开源爱好者',
    desc: 'Vitest 团队成员',
  },
  {
    avatar: contributorsAvatars['hi-ogawa'],
    name: 'Hiroshi Ogawa',
    github: 'hi-ogawa',
    twitter: 'hiroshi_18181',
    title: 'Open source enthusiast',
    desc: 'Team member of Vitest',
  },
]

const teamMembers = plainTeamMembers.map(tm => createLinks(tm))
const teamEmeritiMembers = plainTeamEmeritiMembers.map(tm => createLinks(tm))

export { teamMembers, teamEmeritiMembers }
