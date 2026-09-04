import type { SiteFeatures } from '@oribet/test-ids'

/**
 * Hand-authored manifest of features the oribet app SHOULD ship. The id-map
 * generator gates the generated map against this: a feature marked `true` whose
 * registry ids are missing from the map fails the coverage check (catches a module
 * that shares functionality but wasn't wired with test-ids).
 *
 * ── This build is a lobby-only vertical slice ──────────────────────────────────
 * Every page except the lobby has been removed, along with its modules. Sign-in is
 * supported, sign-up is not. The header keeps the wallet pill + deposit and a
 * logout-only user menu; chat, notifications, search, the theme editor and the
 * bonuses dropdown are gone. Most keys below are therefore `false` — they are kept
 * (rather than deleted) because the manifest must stay exhaustive over `FeatureKey`,
 * and flipping one back on is how you'd re-introduce that surface.
 */
export const SITE_FEATURES: SiteFeatures = {
  // auth — login + google only; registration is not part of this build
  'auth.login': true,
  'auth.register': false,
  'auth.google': true,
  'auth.forgotPassword': true,
  'auth.resetPassword': false,
  // navigation / shell — sidebar is a single lobby entry
  'nav.header': true,
  'nav.accountMenu': true,
  'nav.sidebar': true,
  'nav.bottomMenu': true,
  'nav.languageSelect': true,
  'nav.geoBlock': true,
  'nav.footer': true,
  'nav.notifications': false,
  'nav.bonusMenu': false,
  // discovery — the lobby's own sections
  'discovery.gameCard': true,
  'discovery.categoryCards': false,
  'discovery.search': false,
  'discovery.filters': false,
  'discovery.providers': true,
  'discovery.casinoSwitcher': false,
  'discovery.banners': true,
  'discovery.swipers': true,
  'discovery.liveFeed': true,
  // play — no game page in this slice
  'play.footer': false,
  'play.mobile': false,
  'play.demo': false,
  'play.modals': false,
  'play.bonusMode': false,
  // deposit + wallet — the surface the wallet task is built on
  'deposit.crypto': true,
  'deposit.fiat': true,
  'deposit.omno': true,
  'deposit.agentPay': true,
  'deposit.buyCrypto': true,
  'wallet.deposit': true,
  'wallet.balance': true,
  'wallet.switch': true,
  'wallet.bonus': true,
  // transactions / withdraw — no account pages
  'withdraw.crypto': false,
  'withdraw.fiat': false,
  'withdraw.agentPay': false,
  'transactions.filters': false,
  'transactions.history': false,
  // bonuses + promotions — pages removed; only the shell's bonus modals remain
  'bonuses.list': false,
  'bonuses.wheel': false,
  'bonuses.modals': true,
  'bonuses.marketplace': false,
  'bonuses.header': false,
  'promotions.list': false,
  'promotions.detail': false,
  // account + KYC — no account pages
  'account.nav': false,
  'account.profile': true,
  'account.avatar': true,
  'kyc.level1': false,
  'kyc.documents': false,
  'account.security': false,
  'account.preferences': false,
  'account.email': false,
  'account.phone': false,
  // engagement + content + sports — all removed
  'engagement.tournaments': false,
  'engagement.leaderboards': false,
  'engagement.rank': false,
  'comms.notifications': false,
  'comms.chat': false,
  'content.policies': false,
  'content.blog': false,
  'misc.notFound': false,
  'sports.entry': false,
}
