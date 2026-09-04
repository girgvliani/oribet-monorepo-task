/**
 * Navigation / app-shell test-id registry.
 *
 * Covers the persistent chrome a player uses to move around: the header action
 * cluster and the account/user menu. oribet renders this via
 * `AppHeader`/`AppHeaderAuthorizedContent`/`AppHeaderAccountInfoMenu`; oribet-korea
 * renders the equivalent via `CenteredNavHeader`/`CenteredNavUserMenu`. The same
 * ids are wired into both (dual-tagging).
 *
 * NOTE: the balance pill + deposit trigger live in the wallet surfaces
 * (DepositView/MultiWalletView/CenteredNavBalancePill) and are tagged in the
 * `deposit` feature, not here.
 */
import type { IdNode, TestIdRegistry } from './types'

export const NAV_TEST_IDS = {
  header: {
    /** Brand logo → home. */
    logo: 'nav.header.logo',
    /** Hamburger / sidebar toggle. */
    menuToggle: 'nav.header.menu-toggle',
    /** Opens global game search (oribet header). */
    search: 'nav.header.search',
    /** Opens the notifications panel. */
    notification: 'nav.header.notification',
    /** Opens the in-app chat (oribet desktop). */
    chat: 'nav.header.chat',
    /** Opens the bonus panel/page. */
    bonus: 'nav.header.bonus',
    /** Primary nav links (sports/casino/promotions/…). Collection — `<id>.<key>`. */
    navItem: 'nav.header.nav-item',
    /** Avatar / account-menu trigger. */
    accountTrigger: 'nav.header.account-trigger',
  },
  /** Items inside the account/user popover menu (union across both apps). */
  accountMenu: {
    wallet: 'nav.account-menu.wallet',
    depositFiat: 'nav.account-menu.deposit-fiat',
    depositCrypto: 'nav.account-menu.deposit-crypto',
    buyCrypto: 'nav.account-menu.buy-crypto',
    withdraw: 'nav.account-menu.withdraw',
    transactions: 'nav.account-menu.transactions',
    settings: 'nav.account-menu.settings',
    security: 'nav.account-menu.security',
    preferences: 'nav.account-menu.preferences',
    deposit: 'nav.account-menu.deposit',
    changePassword: 'nav.account-menu.change-password',
    gifts: 'nav.account-menu.gifts',
    verification: 'nav.account-menu.verification',
    notifications: 'nav.account-menu.notifications',
    logout: 'nav.account-menu.logout',
    logoutConfirm: 'nav.account-menu.logout-confirm',
    logoutCancel: 'nav.account-menu.logout-cancel',
  },
  /** Mobile bottom tab bar. */
  bottomMenu: {
    /** Tab. Collection — `<id>.<key>` = lobby/casino/sports/wallet/account/… */
    tab: 'nav.bottom-menu.tab',
  },
  /** Language switcher (header + sidebar). */
  languageSelect: 'nav.language-select',
  /** Left sidebar (oribet only). */
  sidebar: {
    /** Casino / Sport / Bonus section button. Collection — `<id>.<type>`. */
    section: 'nav.sidebar.section',
    /** Sidebar nav link (casino/sport/general/support lists). Collection — `<id>.<key>`. */
    menuItem: 'nav.sidebar.menu-item',
    depositCard: 'nav.sidebar.deposit-card',
    /** Inline badge/pill on a sidebar row (Live / count / Hot / % / countdown). Collection — `<id>.<key>`. */
    badge: 'nav.sidebar.badge',
  },
  /** Geo / VPN block screen. */
  countryRestriction: {
    root: 'nav.country-restriction.root',
    support: 'nav.country-restriction.support',
  },
  /** Footer links. */
  footer: {
    /** About/policy/support link. Collection — `<id>.<key>`. */
    aboutLink: 'nav.footer.about-link',
    /** Social media link. Collection — `<id>.<key>`. */
    socialLink: 'nav.footer.social-link',
    /** Responsible-gaming badge (lock / 18+ / shield). Collection — `<id>.<key>`. */
    responsibleBadge: 'nav.footer.responsible-badge',
  },
  /** Header notification dropdown. */
  notifications: {
    viewAll: 'nav.notifications.view-all',
    /** Notification row. Collection — `<id>.<notificationId>`. */
    item: 'nav.notifications.item',
  },
  /** Header gifts/bonus dropdown (Korea). */
  bonusMenu: {
    /** Bonus-tab row. Collection — `<id>.<tab>`. */
    item: 'nav.bonus-menu.item',
  },
} as const

const T = NAV_TEST_IDS

export const NAVIGATION_STRUCTURE: IdNode[] = [
  { id: T.header.logo, role: 'link', label: 'Header: brand logo (home)' },
  {
    id: T.header.menuToggle,
    role: 'button',
    label: 'Header: sidebar toggle',
    runtimeConditional: true,
  },
  {
    id: T.header.search,
    role: 'button',
    label: 'Header: open search',
    runtimeConditional: true,
  },
  { id: T.header.notification, role: 'button', label: 'Header: notifications' },
  {
    id: T.header.chat,
    role: 'button',
    label: 'Header: chat (desktop)',
    runtimeConditional: true,
  },
  { id: T.header.bonus, role: 'button', label: 'Header: bonus', runtimeConditional: true },
  {
    id: T.header.navItem,
    role: 'link',
    label: 'Header: primary nav link',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.header.accountTrigger,
    role: 'button',
    label: 'Header: account-menu trigger',
    children: [
      // oribet account menu
      { id: T.accountMenu.wallet, role: 'link', label: 'Menu: wallet', runtimeConditional: true },
      {
        id: T.accountMenu.depositFiat,
        role: 'button',
        label: 'Menu: deposit fiat',
        runtimeConditional: true,
      },
      {
        id: T.accountMenu.depositCrypto,
        role: 'link',
        label: 'Menu: deposit crypto',
        runtimeConditional: true,
      },
      {
        id: T.accountMenu.buyCrypto,
        role: 'link',
        label: 'Menu: buy crypto',
        runtimeConditional: true,
      },
      {
        id: T.accountMenu.withdraw,
        role: 'link',
        label: 'Menu: withdraw',
        runtimeConditional: true,
      },
      {
        id: T.accountMenu.transactions,
        role: 'link',
        label: 'Menu: transactions',
        runtimeConditional: true,
      },
      {
        id: T.accountMenu.settings,
        role: 'link',
        label: 'Menu: settings',
        runtimeConditional: true,
      },
      { id: T.accountMenu.security, role: 'link', label: 'Menu: security', runtimeConditional: true },
      {
        id: T.accountMenu.preferences,
        role: 'link',
        label: 'Menu: preferences',
        runtimeConditional: true,
      },
      // korea user menu
      { id: T.accountMenu.deposit, role: 'link', label: 'Menu: deposit', runtimeConditional: true },
      {
        id: T.accountMenu.changePassword,
        role: 'link',
        label: 'Menu: change password',
        runtimeConditional: true,
      },
      { id: T.accountMenu.gifts, role: 'link', label: 'Menu: gifts', runtimeConditional: true },
      {
        id: T.accountMenu.verification,
        role: 'link',
        label: 'Menu: verification',
        runtimeConditional: true,
      },
      {
        id: T.accountMenu.notifications,
        role: 'link',
        label: 'Menu: notifications',
        runtimeConditional: true,
      },
      { id: T.accountMenu.logout, role: 'button', label: 'Menu: logout' },
      {
        id: T.accountMenu.logoutConfirm,
        role: 'button',
        label: 'Logout confirm',
        runtimeConditional: true,
      },
      {
        id: T.accountMenu.logoutCancel,
        role: 'button',
        label: 'Logout cancel',
        runtimeConditional: true,
      },
    ],
  },

  // Mobile bottom nav.
  {
    id: T.bottomMenu.tab,
    role: 'tab',
    label: 'Bottom menu tab',
    collection: true,
    runtimeConditional: true,
  },

  // Language switcher.
  { id: T.languageSelect, role: 'combobox', label: 'Language switcher' },

  // Sidebar (oribet only).
  {
    id: T.sidebar.section,
    role: 'button',
    label: 'Sidebar section (casino/sport/bonus)',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.sidebar.menuItem,
    role: 'link',
    label: 'Sidebar nav link',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.sidebar.depositCard,
    role: 'button',
    label: 'Sidebar deposit CTA',
    runtimeConditional: true,
  },
  {
    id: T.sidebar.badge,
    role: 'text',
    label: 'Sidebar row badge/pill',
    collection: true,
    runtimeConditional: true,
  },

  // Geo/VPN block screen.
  {
    id: T.countryRestriction.root,
    role: 'dialog',
    label: 'Country-restriction screen',
    runtimeConditional: true,
    children: [
      { id: T.countryRestriction.support, role: 'button', label: 'Telegram support' },
    ],
  },

  // Footer.
  { id: T.footer.aboutLink, role: 'link', label: 'Footer about/policy link', collection: true },
  {
    id: T.footer.socialLink,
    role: 'link',
    label: 'Footer social link',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.footer.responsibleBadge,
    role: 'image',
    label: 'Footer responsible-gaming badge',
    collection: true,
    runtimeConditional: true,
  },

  // Header notification dropdown.
  {
    id: T.notifications.viewAll,
    role: 'button',
    label: 'Notifications: view all',
    runtimeConditional: true,
  },
  {
    id: T.notifications.item,
    role: 'button',
    label: 'Notification row',
    collection: true,
    runtimeConditional: true,
  },

  // Header gifts/bonus dropdown (Korea).
  {
    id: T.bonusMenu.item,
    role: 'button',
    label: 'Bonus-menu row',
    collection: true,
    runtimeConditional: true,
  },
]

export const NAVIGATION_REGISTRY: TestIdRegistry = {
  feature: 'navigation',
  structure: NAVIGATION_STRUCTURE,
}
