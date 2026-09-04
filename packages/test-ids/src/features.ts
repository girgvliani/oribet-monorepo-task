/**
 * Feature catalog — the shared vocabulary between the per-app manifest
 * (`apps/<app>/config/site-features.ts`) and the id registry.
 *
 * A "feature" is the manifest unit: a toggleable piece of site functionality. Every
 * registry id belongs to exactly one feature, derived from its id by `featureForId`
 * (the id namespace already encodes the designation, so we don't tag each node).
 *
 * Only keys that currently have ≥1 registry id live here; new keys are added as
 * their phase lands (the generator's drift check enforces key↔id coverage).
 */

export const FEATURE_KEYS = [
  // auth
  'auth.login',
  'auth.register',
  'auth.google',
  'auth.forgotPassword',
  'auth.resetPassword',
  // navigation / shell
  'nav.header',
  'nav.accountMenu',
  'nav.sidebar',
  'nav.bottomMenu',
  'nav.languageSelect',
  'nav.geoBlock',
  'nav.footer',
  'nav.notifications',
  'nav.bonusMenu',
  // discovery
  'discovery.gameCard',
  'discovery.categoryCards',
  'discovery.search',
  'discovery.filters',
  'discovery.providers',
  'discovery.casinoSwitcher',
  'discovery.banners',
  'discovery.swipers',
  'discovery.liveFeed',
  // play
  'play.footer',
  'play.mobile',
  'play.demo',
  'play.modals',
  'play.bonusMode',
  // deposit + wallet
  'deposit.crypto',
  'deposit.fiat',
  'deposit.omno',
  'deposit.agentPay',
  'deposit.buyCrypto',
  'wallet.deposit',
  'wallet.balance',
  'wallet.switch',
  'wallet.bonus',
  // transactions
  'withdraw.crypto',
  'withdraw.fiat',
  'withdraw.agentPay',
  'transactions.filters',
  'transactions.history',
  // bonuses + promotions
  'bonuses.list',
  'bonuses.wheel',
  'bonuses.modals',
  'bonuses.marketplace',
  'bonuses.header',
  'promotions.list',
  'promotions.detail',
  // account + KYC
  'account.nav',
  'account.profile',
  'account.avatar',
  'kyc.level1',
  'kyc.documents',
  'account.security',
  'account.preferences',
  'account.email',
  'account.phone',
  // engagement + content + sports
  'engagement.tournaments',
  'engagement.leaderboards',
  'engagement.rank',
  'comms.notifications',
  'comms.chat',
  'content.policies',
  'content.blog',
  'misc.notFound',
  'sports.entry',
] as const

export type FeatureKey = (typeof FEATURE_KEYS)[number]

/** The hand-authored per-app manifest shape (exhaustive over FEATURE_KEYS). */
export type SiteFeatures = Record<FeatureKey, boolean>

const FEATURE_SET = new Set<string>(FEATURE_KEYS)

/**
 * Ordered (prefix/predicate → feature) rules. First match wins, so put the more
 * specific prefixes before the broader ones. Returns null for an unmapped id
 * (the generator treats that as drift).
 */
const RULES: { test: (id: string) => boolean; feature: FeatureKey }[] = [
  // auth — order matters (header.login before a hypothetical generic auth.header)
  { test: id => id.startsWith('auth.header.login'), feature: 'auth.login' },
  { test: id => id.startsWith('auth.header.register'), feature: 'auth.register' },
  { test: id => id.startsWith('auth.google.'), feature: 'auth.google' },
  // Currency-selection step belongs to the Google sign-up flow.
  { test: id => id.startsWith('auth.currency-selection.'), feature: 'auth.google' },
  { test: id => id.startsWith('auth.reset-modal.'), feature: 'auth.forgotPassword' },
  { test: id => id.startsWith('auth.reset-page.'), feature: 'auth.resetPassword' },
  // Phone-verification field + post-registration welcome modal are part of registration.
  { test: id => id.startsWith('auth.phone-verify.'), feature: 'auth.register' },
  { test: id => id.startsWith('auth.welcome.'), feature: 'auth.register' },
  { test: id => id.startsWith('auth.register.'), feature: 'auth.register' },
  // The register TAB is a registration surface, so it belongs to `auth.register` — grouping it
  // under `auth.login` meant an app that ships login without sign-up failed login coverage for
  // an id it is correct not to render.
  { test: id => id === 'auth.tab.register', feature: 'auth.register' },
  // modal chrome + remaining tabs + login fields default to the login surface
  {
    test: id =>
      id.startsWith('auth.login.') || id.startsWith('auth.modal.') || id.startsWith('auth.tab.'),
    feature: 'auth.login',
  },

  // navigation
  { test: id => id.startsWith('nav.account-menu.'), feature: 'nav.accountMenu' },
  { test: id => id.startsWith('nav.bottom-menu.'), feature: 'nav.bottomMenu' },
  { test: id => id === 'nav.language-select', feature: 'nav.languageSelect' },
  { test: id => id.startsWith('nav.sidebar.'), feature: 'nav.sidebar' },
  { test: id => id.startsWith('nav.country-restriction.'), feature: 'nav.geoBlock' },
  { test: id => id.startsWith('nav.footer.'), feature: 'nav.footer' },
  { test: id => id.startsWith('nav.notifications.'), feature: 'nav.notifications' },
  // The header bell is the notifications surface, not header chrome — same reasoning as
  // `auth.tab.register` above: an app that ships a header without notifications should not
  // fail header coverage for a bell it is correct not to render.
  { test: id => id === 'nav.header.notification', feature: 'nav.notifications' },
  { test: id => id.startsWith('nav.bonus-menu.'), feature: 'nav.bonusMenu' },
  { test: id => id.startsWith('nav.header.'), feature: 'nav.header' },

  // discovery
  { test: id => id.startsWith('discovery.game-card'), feature: 'discovery.gameCard' },
  { test: id => id === 'discovery.category-card', feature: 'discovery.categoryCards' },
  { test: id => id.startsWith('discovery.swiper.'), feature: 'discovery.swipers' },
  { test: id => id === 'discovery.sport-card', feature: 'discovery.swipers' },
  { test: id => id.startsWith('discovery.live-feed.'), feature: 'discovery.liveFeed' },
  {
    test: id =>
      id === 'discovery.search.provider-filter' ||
      id === 'discovery.search.sort-filter' ||
      id === 'discovery.search.show-hide-filter' ||
      id === 'discovery.search.provider-option' ||
      id === 'discovery.search.providers-open' ||
      id === 'discovery.search.confirm',
    feature: 'discovery.filters',
  },
  { test: id => id.startsWith('discovery.search.'), feature: 'discovery.search' },
  { test: id => id.startsWith('discovery.provider'), feature: 'discovery.providers' },
  {
    test: id => id === 'discovery.category-switcher-tab',
    feature: 'discovery.casinoSwitcher',
  },
  { test: id => id.startsWith('discovery.banner.'), feature: 'discovery.banners' },

  // play
  { test: id => id.startsWith('play.footer.'), feature: 'play.footer' },
  { test: id => id.startsWith('play.mobile.'), feature: 'play.mobile' },
  { test: id => id.startsWith('play.demo.'), feature: 'play.demo' },
  {
    test: id => id.startsWith('play.restricted.') || id.startsWith('play.freespin-fail.'),
    feature: 'play.modals',
  },
  { test: id => id.startsWith('play.bonus.'), feature: 'play.bonusMode' },

  // deposit + wallet
  { test: id => id === 'wallet.deposit-open', feature: 'wallet.deposit' },
  { test: id => id.startsWith('deposit.method.'), feature: 'wallet.deposit' },
  { test: id => id.startsWith('deposit.modal.'), feature: 'wallet.deposit' },
  { test: id => id.startsWith('deposit.crypto.'), feature: 'deposit.crypto' },
  { test: id => id.startsWith('deposit.fiat.'), feature: 'deposit.fiat' },
  { test: id => id.startsWith('deposit.omno.'), feature: 'deposit.omno' },
  { test: id => id.startsWith('deposit.agent-pay.'), feature: 'deposit.agentPay' },
  { test: id => id.startsWith('deposit.buy-crypto.'), feature: 'deposit.buyCrypto' },
  { test: id => id.startsWith('wallet.balance.'), feature: 'wallet.balance' },
  { test: id => id.startsWith('wallet.switch.'), feature: 'wallet.switch' },
  { test: id => id.startsWith('wallet.bonus.'), feature: 'wallet.bonus' },
  // Korea tabbed wallet modal (deposit/withdraw/transactions + bonus selector).
  {
    test: id =>
      id.startsWith('wallet.modal.') ||
      id.startsWith('wallet.tab') ||
      id.startsWith('wallet.deposit.') ||
      id.startsWith('wallet.withdraw.') ||
      id.startsWith('wallet.bonus-select.') ||
      id.startsWith('wallet.select.'),
    feature: 'wallet.deposit',
  },

  // transactions
  { test: id => id.startsWith('withdraw.crypto.'), feature: 'withdraw.crypto' },
  { test: id => id.startsWith('withdraw.fiat.'), feature: 'withdraw.fiat' },
  {
    test: id => id.startsWith('withdraw.agentpay.') || id.startsWith('withdraw.method.'),
    feature: 'withdraw.agentPay',
  },
  { test: id => id.startsWith('transactions.filters.'), feature: 'transactions.filters' },
  { test: id => id.startsWith('transactions.history.'), feature: 'transactions.history' },

  // bonuses + promotions
  { test: id => id.startsWith('bonuses.wheel.'), feature: 'bonuses.wheel' },
  { test: id => id.startsWith('bonuses.modal.'), feature: 'bonuses.modals' },
  { test: id => id.startsWith('bonuses.marketplace.'), feature: 'bonuses.marketplace' },
  { test: id => id.startsWith('bonuses.header.'), feature: 'bonuses.header' },
  { test: id => id.startsWith('bonuses.list.'), feature: 'bonuses.list' },
  { test: id => id.startsWith('promotions.detail.'), feature: 'promotions.detail' },
  { test: id => id.startsWith('promotions.list.'), feature: 'promotions.list' },

  // account + KYC
  { test: id => id.startsWith('account.nav.'), feature: 'account.nav' },
  { test: id => id.startsWith('account.profile.'), feature: 'account.profile' },
  { test: id => id.startsWith('account.avatar.'), feature: 'account.avatar' },
  { test: id => id.startsWith('kyc.level1.'), feature: 'kyc.level1' },
  { test: id => id.startsWith('kyc.documents.'), feature: 'kyc.documents' },
  { test: id => id.startsWith('account.security.'), feature: 'account.security' },
  { test: id => id.startsWith('account.preferences.'), feature: 'account.preferences' },
  { test: id => id.startsWith('account.email.'), feature: 'account.email' },
  { test: id => id.startsWith('account.phone.'), feature: 'account.phone' },

  // engagement + content + sports
  { test: id => id.startsWith('engagement.tournaments.'), feature: 'engagement.tournaments' },
  { test: id => id.startsWith('engagement.leaderboards.'), feature: 'engagement.leaderboards' },
  { test: id => id.startsWith('engagement.rank.'), feature: 'engagement.rank' },
  { test: id => id.startsWith('comms.notifications.'), feature: 'comms.notifications' },
  { test: id => id.startsWith('comms.chat.'), feature: 'comms.chat' },
  { test: id => id.startsWith('content.policies.'), feature: 'content.policies' },
  { test: id => id.startsWith('content.blog.'), feature: 'content.blog' },
  { test: id => id.startsWith('misc.not-found.'), feature: 'misc.notFound' },
  { test: id => id.startsWith('misc.error-boundary.'), feature: 'misc.notFound' },
  { test: id => id === 'sports.entry' || id.startsWith('sports.'), feature: 'sports.entry' },
]

/** Map a registry id to its feature key (or null if unmapped → drift). */
export function featureForId(id: string): FeatureKey | null {
  for (const rule of RULES) if (rule.test(id)) return rule.feature
  return null
}

export function isFeatureKey(key: string): key is FeatureKey {
  return FEATURE_SET.has(key)
}
