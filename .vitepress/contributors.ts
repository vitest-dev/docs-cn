import contributorNames from './contributor-names.json'

export interface Contributor {
  name: string
  avatar: string
}

export interface SocialEntry {
  icon: string
  link: string
}

export interface CoreTeam {
  avatar: string
  name: string
  // required to download avatars from GitHub
  github: string
  twitter: string
  sponsor?: string
  title?: string
  org?: string
  desc?: string
  links?: SocialEntry[]
}

const contributorsAvatars: Record<string, string> = {}

const getAvatarUrl = (name: string) => import.meta.hot ? `https://github.com/${name}.png` : `/user-avatars/${name}.png`

export const contributors = (contributorNames as string[]).reduce((acc, name) => {
  contributorsAvatars[name] = getAvatarUrl(name)
  acc.push({ name, avatar: contributorsAvatars[name] })
  return acc
}, [] as Contributor[])

const createLinks = (tm: CoreTeam): CoreTeam => {
  tm.links = [
    { icon: 'github', link: `https://github.com/${tm.github}` },
    { icon: 'twitter', link: `https://twitter.com/${tm.twitter}` },
  ]
  return tm
}

const plainTeamMembers: CoreTeam[] = [
  {
    avatar: contributorsAvatars.antfu,
    name: 'Anthony Fu',
    github: 'antfu',
    twitter: 'antfu7',
    sponsor: 'https://github.com/sponsors/antfu',
    title: '狂热的开源者，在 NuxtLabs 工作',
    desc: 'Vite 和 Vue 的核心团队成员',
  },
  {
    avatar: contributorsAvatars['sheremet-va'],
    name: 'Vladimir',
    github: 'sheremet-va',
    twitter: 'sheremet_va',
    sponsor: 'https://github.com/sponsors/sheremet-va',
    title: '全栈开源开发者',
    desc: 'Vitest 的核心团队成员',
  },
  {
    avatar: contributorsAvatars['patak-dev'],
    name: 'Patak',
    github: 'patak-dev',
    twitter: 'patak_dev',
    sponsor: 'https://github.com/sponsors/patak-dev',
    title: '二当家，在 StackBlitz 工作',
    desc: 'Vite 和 Vue 的核心团队成员',
  },
  {
    avatar: contributorsAvatars.Aslemammad,
    name: 'Mohammad Bagher',
    github: 'Aslemammad',
    twitter: 'asleMammadam',
    title: '开源开发者',
    desc: 'Poimandres 和 Vike 的团队成员',
  },
  {
    avatar: contributorsAvatars.Demivan,
    name: 'Ivan Demchuk',
    github: 'Demivan',
    twitter: 'IvanDemchuk',
    title: '技术负责人，全栈开发人员',
    desc: 'fluent-vue 的作者',
  },
  {
    avatar: contributorsAvatars.userquin,
    name: 'Joaquín Sánchez',
    github: 'userquin',
    twitter: 'userquin',
    title: '全栈和安卓开发者',
    desc: 'Vite 的狂热追随者',
  },
  {
    avatar: contributorsAvatars.zxch3n,
    name: 'Zixuan Chen',
    github: 'zxch3n',
    twitter: 'zxch3n',
    title: '全栈开发人员',
    desc: '创建协作工具',
  },
]

const teamMembers = plainTeamMembers.map(tm => createLinks(tm))

export { teamMembers }
