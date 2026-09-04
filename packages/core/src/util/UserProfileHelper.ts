import type { AppTheme } from '@oribet/ui'

export const getRanks = (theme: AppTheme) => [
  {
    name: 'Newcomer',
    background: `linear-gradient(180deg, ${theme.colors.surface.hover}33 0%, rgba(0, 0, 0, 0) 100%), ${theme.colors.bg.primary}`,
    img: 'newcomer.png',
    imgStyle: {
      width: '75.3px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#6B7280',
      boxShadow: `0px 2px 8px 0px ${theme.colors.text.tertiary}4D`,
    },
  },
  {
    name: 'Traveler',
    background: `linear-gradient(180deg, ${theme.colors.surface.hover}33 0%, rgba(0, 0, 0, 0) 100%), ${theme.colors.bg.primary}`,
    img: 'travelor.png',
    imgStyle: {
      width: '75.3px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#6B7280',
      boxShadow: `0px 2px 8px 0px ${theme.colors.text.tertiary}4D`,
    },
  },
  {
    name: 'Explorer',
    background: `linear-gradient(180deg, ${theme.colors.surface.hover}33 0%, rgba(0, 0, 0, 0) 100%), ${theme.colors.bg.primary}`,
    img: 'explorer.png',
    imgStyle: {
      width: '75.3px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#B67453',
      boxShadow: '0px 2px 8px 0px rgba(182, 116, 83, 0.30)',
    },
  },
  {
    name: 'Adventurer',
    background: `linear-gradient(180deg, rgba(147, 147, 147, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'adventurer.png',
    imgStyle: {
      width: '75.3px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#747474',
      boxShadow: '0px 2px 8px 0px rgba(116, 116, 116, 0.30)',
    },
  },
  {
    name: 'Expert',
    background: `linear-gradient(180deg, rgba(192, 139, 9, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'expert.png',
    imgStyle: {
      width: '75.3px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: theme.colors.accent.secondary,
      boxShadow: '0px 2px 8px 0px rgba(189, 135, 9, 0.30)',
    },
  },
  {
    name: 'Master',
    background: `linear-gradient(180deg, rgba(119, 9, 255, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'master.png',
    imgStyle: {
      width: '107.5px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#6A21AC',
      boxShadow: '0px 2px 8px 0px rgba(106, 33, 172, 0.30)',
    },
  },
  {
    name: 'Grandmaster',
    background: `linear-gradient(180deg, rgba(119, 9, 255, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'grandmaster.png',
    imgStyle: {
      width: '107.5px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#6A21AC',
      boxShadow: '0px 2px 8px 0px rgba(106, 33, 172, 0.30)',
    },
  },
  {
    name: 'Captain',
    background: `linear-gradient(180deg, rgba(119, 9, 255, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'capitan.png',
    imgStyle: {
      width: '107.5px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#6A21AC',
      boxShadow: '0px 2px 8px 0px rgba(106, 33, 172, 0.30)',
    },
  },
  {
    name: 'Admiral',
    background: `linear-gradient(180deg, rgba(32, 86, 236, 0.30) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'admiral.png',
    imgStyle: {
      width: '94.23px',
      height: '96px',
    },
    progressStyle: {
      background: theme.colors.accent.brand,
      boxShadow: '0px 2px 8px 0px rgba(37, 99, 235, 0.30)',
      height: '224px',
    },
  },
  {
    name: 'Space Whale',
    background: `linear-gradient(180deg, rgba(32, 86, 236, 0.30) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'spacewhale.png',
    imgStyle: {
      width: '94.23px',
      height: '96px',
    },
    height: '224px',
    progressStyle: {
      background: theme.colors.accent.brand,
      boxShadow: '0px 2px 8px 0px rgba(37, 99, 235, 0.30)',
    },
  },
  {
    name: 'Legend',
    background: `linear-gradient(180deg, rgba(32, 86, 236, 0.30) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'legend.png',
    imgStyle: {
      width: '94.23px',
      height: '96px',
    },
    height: '224px',
    progressStyle: {
      background: theme.colors.accent.brand,
      boxShadow: '0px 2px 8px 0px rgba(37, 99, 235, 0.30)',
    },
  },
  {
    name: 'Myth',
    background: `linear-gradient(180deg, rgba(32, 86, 236, 0.30) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'myth.png',
    imgStyle: {
      width: '94.23px',
      height: '96px',
    },
    height: '224px',
    progressStyle: {
      background: theme.colors.accent.brand,
      boxShadow: '0px 2px 8px 0px rgba(37, 99, 235, 0.30)',
    },
  },
]

export const getRanksSystem = (theme: AppTheme) => [
  {
    name: 'Newcomer',
    background: `linear-gradient(180deg, ${theme.colors.surface.hover}33 0%, rgba(0, 0, 0, 0) 100%), ${theme.colors.bg.primary}`,
    img: 'newcomer.png',
    imgStyle: {
      width: '75.3px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#6B7280',
      boxShadow: `0px 2px 8px 0px ${theme.colors.text.tertiary}4D`,
    },
    index: '00',
  },
  {
    name: 'Traveler',
    background: `linear-gradient(180deg, ${theme.colors.surface.hover}33 0%, rgba(0, 0, 0, 0) 100%), ${theme.colors.bg.primary}`,
    img: 'travelor.png',
    imgStyle: {
      width: '75.3px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#6B7280',
      boxShadow: `0px 2px 8px 0px ${theme.colors.text.tertiary}4D`,
    },
    index: '01',
  },
  {
    name: 'Explorer',
    background: `linear-gradient(180deg, rgba(164, 98, 69, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'explorer.png',
    imgStyle: {
      width: '75.3px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#B67453',
      boxShadow: '0px 2px 8px 0px rgba(182, 116, 83, 0.30)',
    },
    index: '02',
  },
  {
    name: 'Adventurer',
    background: `linear-gradient(180deg, rgba(147, 147, 147, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'adventurer.png',
    imgStyle: {
      width: '75.3px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#747474',
      boxShadow: '0px 2px 8px 0px rgba(116, 116, 116, 0.30)',
    },
    index: '03',
  },
  {
    name: 'Expert',
    background: `linear-gradient(180deg, rgba(192, 139, 9, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'expert.png',
    imgStyle: {
      width: '75.3px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: theme.colors.accent.secondary,
      boxShadow: '0px 2px 8px 0px rgba(189, 135, 9, 0.30)',
    },
    index: '04',
  },
  {
    name: 'Master',
    background: `linear-gradient(180deg, rgba(119, 9, 255, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'master.png',
    imgStyle: {
      width: '107.5px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#6A21AC',
      boxShadow: '0px 2px 8px 0px rgba(106, 33, 172, 0.30)',
    },
    index: '05',
  },
  {
    name: 'Grandmaster',
    background: `linear-gradient(180deg, rgba(119, 9, 255, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'grandmaster.png',
    imgStyle: {
      width: '107.5px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#6A21AC',
      boxShadow: '0px 2px 8px 0px rgba(106, 33, 172, 0.30)',
    },
    index: '06',
  },
  {
    name: 'Captain',
    background: `linear-gradient(180deg, rgba(119, 9, 255, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'capitan.png',
    imgStyle: {
      width: '107.5px',
      height: '80px',
    },
    height: '208px',
    progressStyle: {
      background: '#6A21AC',
      boxShadow: '0px 2px 8px 0px rgba(106, 33, 172, 0.30)',
    },
    index: '07',
  },
  {
    name: 'Admiral',
    background: `linear-gradient(180deg, rgba(32, 86, 236, 0.30) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'admiral.png',
    imgStyle: {
      width: '94.23px',
      height: '96px',
    },
    progressStyle: {
      background: theme.colors.accent.brand,
      boxShadow: '0px 2px 8px 0px rgba(37, 99, 235, 0.30)',
      height: '224px',
    },
    index: '08',
  },
  {
    name: 'Space Whale',
    background: `linear-gradient(180deg, rgba(32, 86, 236, 0.30) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'spacewhale.png',
    imgStyle: {
      width: '94.23px',
      height: '96px',
    },
    height: '224px',
    progressStyle: {
      background: theme.colors.accent.brand,
      boxShadow: '0px 2px 8px 0px rgba(37, 99, 235, 0.30)',
    },
    index: '09',
  },
  {
    name: 'Legend',
    background: `linear-gradient(180deg, rgba(32, 86, 236, 0.30) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'legend.png',
    imgStyle: {
      width: '94.23px',
      height: '96px',
    },
    height: '224px',
    progressStyle: {
      background: theme.colors.accent.brand,
      boxShadow: '0px 2px 8px 0px rgba(37, 99, 235, 0.30)',
    },
    index: '10',
  },
  {
    name: 'Myth',
    background: `linear-gradient(180deg, rgba(32, 86, 236, 0.30) 0%, rgba(0, 0, 0, 0.00) 100%), ${theme.colors.bg.primary}`,
    img: 'myth.png',
    imgStyle: {
      width: '94.23px',
      height: '96px',
    },
    height: '224px',
    progressStyle: {
      background: theme.colors.accent.brand,
      boxShadow: '0px 2px 8px 0px rgba(37, 99, 235, 0.30)',
    },
    index: '11',
  },
]

export interface IUserProfileInfo {
  open: boolean | undefined
  isCurrentUser: boolean
  id: number
  username: string
  totalWins: number
  totalBets: number
  avatar: string | null
  rank: {
    rank: string
    level: number
    progress: number
  }
}
