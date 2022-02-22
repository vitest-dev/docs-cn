import contributors from '../contributors.json'

export interface Contributor {
  name: string
  avatar: string
}

export interface CoreTeam {
  avatar: string
  name: string
  github: string
  twitter?: string
  sponsors: boolean
  description: string
}

// for antfu sponsors
const jsdelivr = 'cdn.jsdelivr.net'
// for patak sponsors
const patak = 'patak.dev'
const antfuSponsors = `https://${jsdelivr}/gh/antfu/static/sponsors.svg`
const patakSponsors = `https://${patak}/sponsors.svg`

const contributorsAvatars: Record<string, string> = {}

const contributorList = (contributors as string[]).reduce((acc, name) => {
  contributorsAvatars[name] = `https://github.com/${name}.png`
  acc.push({ name, avatar: contributorsAvatars[name] })
  return acc
}, [] as Contributor[])

const coreTeamMembers: CoreTeam[] = [
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
    description: '二把手<br>Vite 的核心团队成员<br>Vue 的团队成员',
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
]

export { coreTeamMembers, contributorList as contributors, jsdelivr, patak, antfuSponsors, patakSponsors }
