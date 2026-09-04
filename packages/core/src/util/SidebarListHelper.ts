import { IconAffiliate } from '@oribet/assets/icons/IconAffiliate'
import { IconBlog } from '@oribet/assets/icons/IconBlog'
import { IconCherry } from '@oribet/assets/icons/IconCherry'
import { IconFavorite } from '@oribet/assets/icons/IconFavorite'
import { IconInstantGame } from '@oribet/assets/icons/IconInstantGame'
import { IconLeaderBoard } from '@oribet/assets/icons/IconLeaderBoard'
import { IconLiveCasino } from '@oribet/assets/icons/IconLiveCasino'
import { IconLiveSupport } from '@oribet/assets/icons/IconLiveSupport'
import { IconLobby } from '@oribet/assets/icons/IconLobby'
import { IconMarketplace } from '@oribet/assets/icons/IconMarketplace'
import { IconPromotion } from '@oribet/assets/icons/IconPromotion'
import { IconProvablyFair } from '@oribet/assets/icons/IconProvablyFair'
import { IconProvider } from '@oribet/assets/icons/IconProvider'
import { IconRankSystem } from '@oribet/assets/icons/IconRankSystem'
import { IconRecent } from '@oribet/assets/icons/IconRecent'
import { IconSportBasketball } from '@oribet/assets/icons/IconSportBasketball'
import { IconSportIceHockey } from '@oribet/assets/icons/IconSportIceHockey'
import { IconSportLive } from '@oribet/assets/icons/IconSportLive'
import { IconSportSoccer } from '@oribet/assets/icons/IconSportSoccer'
import { IconSportTennis } from '@oribet/assets/icons/IconSportTennis'
import { IconTableGame } from '@oribet/assets/icons/IconTableGame'
import { AppRoutePath } from './appRoutePath'
import { IOribetMenuItem } from '../types/common.type'

export const CasinoMenuList: IOribetMenuItem[] = [
  {
    icon: IconLobby,
    link: AppRoutePath.CASINO(),
    text: 'oribetMenu.lobby',
  },
  {
    icon: IconFavorite,
    link: AppRoutePath.FAVORITE_LIST_PATE(),
    text: 'oribetMenu.favourites',
    needAuth: true,
  },
  {
    icon: IconRecent,
    link: AppRoutePath.LASTPLAYED(),
    text: 'oribetMenu.recent',
    needAuth: true,
  },
  {
    icon: IconCherry,
    link: AppRoutePath.GAMELIST(),
    text: 'oribetMenu.slots',
  },
  {
    icon: IconLiveCasino,
    link: AppRoutePath.LIVECASINO(),
    text: 'oribetMenu.liveCasino',
  },
  {
    icon: IconInstantGame,
    link: AppRoutePath.INSTANT(),
    text: 'oribetMenu.instantGames',
  },
  {
    icon: IconTableGame,
    link: AppRoutePath.TABLE(),
    text: 'oribetMenu.tableGames',
  },
  // {
  //   icon: TicketIcon,
  //   link: AppRoutePath.LOTERRY(),
  //   text: 'oribetMenu.lottery',
  // },
]

export const SportAndCasinoMenuLinks: string[] = [
  '/favourites',
  '/recent',
  '/slots',
  '/livecasino',
  '/providers',
  '/instant-games',
  '/table-games',
  '/game-shows',
  '/sports',
  '/sports-live',
  '/basketball',
  '/soccer',
  '/tennis',
  '/ice-hockey',
]

export const SportMenuList: string[] = []

export const SidebarListLevel2: IOribetMenuItem[] = [
  {
    icon: IconMarketplace,
    link: AppRoutePath.MARKETPLACE(),
    text: 'oribetMenu.marketplace',
  },
  {
    icon: IconPromotion,
    link: AppRoutePath.PROMOTION(),
    text: 'oribetMenu.promotions',
  },
  {
    icon: IconLeaderBoard,
    link: AppRoutePath.TOURNAMENTS(),
    text: 'oribetMenu.tournaments',
  },
  {
    icon: IconProvablyFair,
    link: AppRoutePath.INSTANT(),
    text: 'oribetMenu.probablyFair',
    hidden: true,
  },
  {
    icon: IconBlog,
    link: AppRoutePath.BLOG(),
    text: 'oribetMenu.blog',
  },
]

export const SupportMenuList: IOribetMenuItem[] = [
  {
    icon: IconProvider,
    link: AppRoutePath.PROVIDER_LIST_PAGE(),
    text: 'oribetMenu.providers',
  },
  {
    icon: IconAffiliate,
    link: 'https://www.oribetpartners.com/',
    text: 'oribetMenu.affiliate',
    isAffiliate: true,
  },
  {
    icon: IconRankSystem,
    link: AppRoutePath.RANKSYSTEM(),
    text: 'oribetMenu.rankSystem',
  },
  {
    icon: IconLiveSupport,
    link: '',
    isLiveSupport: true,
    text: 'oribetMenu.liveSupport',
  },
]

export const SidebarSportItems: IOribetMenuItem[] = [
  {
    icon: IconSportLive,
    link: AppRoutePath.SPORT_LIVE(),
    text: 'betBy.live',
  },
  {
    icon: IconSportSoccer,
    link: AppRoutePath.SPORT_FOOTBALL(),
    text: 'betBy.soccer',
  },
  {
    icon: IconSportBasketball,
    link: AppRoutePath.SPORT_BASKETBALL(),
    text: 'betBy.basketball',
  },
  {
    icon: IconSportTennis,
    link: AppRoutePath.SPORT_TENNIS(),
    text: 'betBy.tennis',
  },
  {
    icon: IconSportIceHockey,
    link: AppRoutePath.SPORT_ICE_HOCKEY(),
    text: 'betBy.iceHockey',
  },
]
