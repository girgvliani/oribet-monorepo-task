import { Defaults } from './defaults'
import Cookies from 'js-cookie'

const lang = () => {
  return Cookies.get('language') || Defaults.defaultLanguage
}

export const AppRoutePath = {
  HOME: () => `/${lang()}`,
  ACCOUNT: () => `/${lang()}/account/:accountType`,
  WALLET: () => `/${lang()}/account/wallet`,
  DEPOSIT: () => `/${lang()}/account/deposit`,
  DEPOSITFIAT: () => `/${lang()}/account/deposit-fiat`,
  WITHDRAW: () => `/${lang()}/account/withdraw`,
  WITHDRAWCRYPTO: () => `/${lang()}/account/withdraw-crypto`,
  BUYCRYPTO: () => `/${lang()}/account/buy-crypto`,
  TRANSACTIONS: () => `/${lang()}/account/transactions`,
  GAMELIST: () => `/${lang()}/slots`,
  CASINO: () => `/${lang()}/casino`,
  LIVECASINO: () => `/${lang()}/livecasino`,
  INSTANT: () => `/${lang()}/instant-games`,
  TABLE: () => `/${lang()}/table-games`,
  /** Generic games-by-category page for any API category slug (Slot, Lottery, Other, …). */
  CASINO_CATEGORY: (slug?: string) => `/${lang()}/casino/category/${slug ?? ':slug'}`,
  BLOCK: (slug?: string) => `/${lang()}/blocks/${slug ?? ':slug'}`,
  GAMES: () => `/${lang()}/games/:slug`,
  BONUSGAMES: () => `/${lang()}/bonusgames/:slug`,
  GAMES_MOBILE_IFRAME: (fullScreen?: boolean) =>
    `/${lang()}/games/mobile/${fullScreen ? 'fullscreen' : ''}game`,
  BONUSGAMES_MOBILE_IFRAME: (fullScreen?: boolean) =>
    `/${lang()}/bonusgames/mobile/${fullScreen ? 'fullscreen' : ''}game`,
  SOCIAL_AUTH: (type?: string, access_token?: string) => `/auth/social/${type}/${access_token}`,
  // Social-auth callback WITHOUT a token — the backend lands here on the Google
  // "new player, no wallet" error (e.g. `/auth/social/google/?error_type=...`).
  SOCIAL_AUTH_CALLBACK: (type?: string) => `/auth/social/${type ?? ':type'}`,
  // Language-agnostic on purpose: the backend redirects here (Google currency step)
  // and the opener page resolves the language + sends the user to the localized home.
  CURRENCY_SELECTION: () => `/currency-selection`,
  POLICIES: () => `/${lang()}/policies/:policyType`,
  TERMS_AND_CONDITIONS: () => `/${lang()}/policies/terms-and-conditions`,
  LOGOUT: () => `/${lang()}/logout`,
  PROVIDER_LIST_PAGE: () => `/${lang()}/providers`,
  /** All games for a provider (via `?provider=<id>`), across every category. */
  PROVIDER_GAMES: () => `/${lang()}/providers/games`,
  FAVORITE_LIST_PATE: () => `/${lang()}/favourites`,
  SETTINGS: () => `/${lang()}/settings/:settingsType`,
  ACCOUNT_INFO: () => `/${lang()}/settings/account-info`,
  DASHBOARD: () => `/${lang()}/dashboard/:section`,
  DASHBOARD_SECTION: (section?: string) => `/${lang()}/dashboard/${section ?? ':section'}`,
  SECURITY: () => `/${lang()}/settings/security`,
  PREFERENCES: () => `/${lang()}/settings/preferences`,
  VERIFICATION: () => `/${lang()}/settings/verification`,
  GAME_SHOWS: () => `/${lang()}/game-shows`,
  EMAIL_VERIFY: () => `/${lang()}/verify-email`,
  BLOG: () => `/${lang()}/blog`,
  BLOGBYSLUG: () => `/${lang()}/blog/:slug`,
  LASTPLAYED: () => `/${lang()}/recent`,
  RESETPASSWORD: () => `/${lang()}/reset-password`,
  RANKSYSTEM: () => `/${lang()}/rank`,
  PROMOTION: () => `/${lang()}/promotion`,
  PROMOTIONITEM: () => `/${lang()}/promotion/:slug`,
  LEADERBOARDS: () => `/${lang()}/leaderBoards/:slug`,
  ACCOUNT_MOBILE_PAGE: () => `/${lang()}/account`,
  MENU_MOBILE_PAGE: () => `/${lang()}/menu-mobile`,
  BONUS_MOBILE_PAGE: () => `/${lang()}/bonus-mobile`,
  BONUS: () => `/${lang()}/bonus`,
  BONUSMODE: () => `/${lang()}/bonus-mode`,
  WALLET_MOBILE_PAGE: () => `/${lang()}/wallet`,
  SPORT: () => `/${lang()}/sports`,
  //Temporary pages for sports for ui
  SPORT_LIVE: () => `/${lang()}/sports-live`,
  SPORT_BASKETBALL: () => `/${lang()}/basketball`,
  SPORT_FOOTBALL: () => `/${lang()}/soccer`,
  SPORT_TENNIS: () => `/${lang()}/tennis`,
  SPORT_ICE_HOCKEY: () => `/${lang()}/ice-hockey`,

  REGISTRATION: () => `/${lang()}/registration-page`,
  MARKETPLACE: () => `/${lang()}/marketplace`,
  TOURNAMENTS: () => `/${lang()}/tournaments`,
  TOURNAMENTS_DETAIL: (slug?: string) => `/${lang()}/tournaments/${slug ?? ':slug'}`,
}

export const casinoTabUrls = [
  AppRoutePath.GAMELIST(),
  AppRoutePath.CASINO(),
  AppRoutePath.LIVECASINO(),
  AppRoutePath.INSTANT(),
  AppRoutePath.TABLE(),
  AppRoutePath.GAME_SHOWS(),
  `/${lang()}/blocks`,
]

export const getRoutesForLang = (newLang: string) => {
  if (newLang !== 'favicon.ico') {
    return Object.values(AppRoutePath).map(routeFunc => {
      const url = routeFunc()
      const updatedPath = url.replace(`/${lang()}`, `/${newLang}`)

      return updatedPath
    })
  }
}

export { lang }
