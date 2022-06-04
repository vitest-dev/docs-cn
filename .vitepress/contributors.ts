import contributorNames from './contributor-names.json'

export interface Contributor {
  name: string
  avatar: string
}

export interface CoreTeam {
  avatar: string
  name: string
  github: string
  twitter?: string
  sponsors?: boolean
  description: string
}

const contributorsAvatars: Record<string, string> = {}

const getAvatarUrl = (name: string) => import.meta.hot ? `https://github.com/${name}.png` : `/user-avatars/${name}.png`

export const contributors = (contributorNames as string[]).reduce((acc, name) => {
  contributorsAvatars[name] = getAvatarUrl(name)
  acc.push({ name, avatar: contributorsAvatars[name] })
  return acc
}, [] as Contributor[])

export const teamMembers: CoreTeam[] = [
  {
    avatar: contributorsAvatars.antfu,
    name: 'Anthony Fu',
    github: 'antfu',
    twitter: 'antfu7',
    sponsors: true,
    description: '狂热的开源者<br>Vite 和 Vue 的核心团队成员<br>在 NuxtLabs 工作',
  },
  {
    avatar: contributorsAvatars['patak-dev'],
    name: 'Patak',
    github: 'patak-dev',
    twitter: 'patak-dev',
    sponsors: true,
    description: '二当家<br>Vite 的核心团队成员<br>Vue 的团队成员',
  },
  {
    avatar: contributorsAvatars.Aslemammad,
    name: 'Mohammad Bagher',
    github: 'Aslemammad',
    twitter: 'asleMammadam',
    sponsors: false,
    description: '开源开发者<br>Poimandres 和 Vike 的团队成员',
  },
  {
    avatar: contributorsAvatars['sheremet-va'],
    name: 'Vladimir',
    github: 'sheremet-va',
    twitter: 'sheremet_va',
    sponsors: false,
    description: '全栈开源开发者',
  },
  {
    avatar: contributorsAvatars.Demivan,
    name: 'Ivan Demchuk',
    github: 'Demivan',
    twitter: 'IvanDemchuk',
    sponsors: false,
    description: '技术负责人，全栈开发人员<br>fluent-vue 的作者',
  },
  {
    avatar: contributorsAvatars.userquin,
    name: 'Joaquín Sánchez',
    github: 'userquin',
    twitter: 'userquin',
    sponsors: false,
    description: '全栈和安卓开发者<br> Vite 的狂热追随者',
  },
  {
    avatar: contributorsAvatars.zxch3n,
    name: 'Zixuan Chen',
    github: 'zxch3n',
    twitter: 'zxch3n',
    sponsors: false,
    description: '全栈开发人员<br>创建协作工具',
  },
]
