/**
 * Engagement + content + sports test-id registry (final feature area).
 *
 * Tournaments, leaderboards, rank system, the notification inbox, chat,
 * policies (oribet ↔ korea-policies), blog, the not-found page, and the
 * sportsbook (upgaming) entry. All runtime-conditional. Repeated rows/cards/
 * tabs are collections — `<id>.<key>`.
 */
import type { IdNode, TestIdRegistry } from './types'

export const ENGAGEMENT_TEST_IDS = {
  tournaments: {
    tab: 'engagement.tournaments.tab',
    card: 'engagement.tournaments.card',
    viewDetails: 'engagement.tournaments.view-details',
    /** "View Full Leaderboard" on the tournament detail. */
    viewFull: 'engagement.tournaments.view-full',
    /** Back to the tournaments list from the detail. */
    back: 'engagement.tournaments.back',
  },
  leaderboards: {
    infoBar: 'engagement.leaderboards.info-bar',
    infoClose: 'engagement.leaderboards.info-close',
    /** Player row. Collection — `<id>.<key>`. */
    player: 'engagement.leaderboards.player',
  },
  rank: {
    intro: 'engagement.rank.intro',
    prev: 'engagement.rank.prev',
    next: 'engagement.rank.next',
    /** Pagination dot/page. Collection — `<id>.<n>`. */
    page: 'engagement.rank.page',
    /** FAQ accordion row. Collection — `<id>.<key>`. */
    faq: 'engagement.rank.faq',
    /** Rank card. Collection — `<id>.<key>`. */
    card: 'engagement.rank.card',
  },
  notifications: {
    close: 'comms.notifications.close',
    /** Notification row. Collection — `<id>.<id>`. */
    item: 'comms.notifications.item',
    markAllRead: 'comms.notifications.mark-all-read',
  },
  chat: {
    input: 'comms.chat.input',
    send: 'comms.chat.send',
    emoji: 'comms.chat.emoji',
    giphy: 'comms.chat.giphy',
    giphySearch: 'comms.chat.giphy-search',
    /** Giphy result. Collection — `<id>.<key>`. */
    giphyItem: 'comms.chat.giphy-item',
    scrollDown: 'comms.chat.scroll-down',
    /** Header menu / action. Collection — `<id>.<key>`. */
    headerAction: 'comms.chat.header-action',
    /** Per-message action (mention/restore/…). Collection — `<id>.<key>`. */
    messageAction: 'comms.chat.message-action',
    loginCta: 'comms.chat.login-cta',
    registerCta: 'comms.chat.register-cta',
  },
  policies: {
    /** Sidebar policy link. Collection — `<id>.<key>`. */
    sidebarItem: 'content.policies.sidebar-item',
    select: 'content.policies.select',
    /** In-content link. Collection — `<id>.<key>`. */
    contentLink: 'content.policies.content-link',
  },
  blog: {
    tab: 'content.blog.tab',
    /** Blog post card. Collection — `<id>.<key>`. */
    card: 'content.blog.card',
    /** Generic blog button (read more / back). Collection — `<id>.<key>`. */
    button: 'content.blog.button',
    pagination: 'content.blog.pagination',
  },
  notFound: {
    home: 'misc.not-found.home',
  },
  errorBoundary: {
    retry: 'misc.error-boundary.retry',
  },
  sports: {
    entry: 'sports.entry',
  },
} as const

const T = ENGAGEMENT_TEST_IDS

const leaf = (id: string, role: IdNode['role'], label: string, collection = false): IdNode => ({
  id,
  role,
  label,
  collection: collection || undefined,
  runtimeConditional: true,
})

export const ENGAGEMENT_STRUCTURE: IdNode[] = [
  // Tournaments.
  leaf(T.tournaments.tab, 'tab', 'Tournaments: tab', true),
  leaf(T.tournaments.card, 'link', 'Tournaments: card', true),
  leaf(T.tournaments.viewDetails, 'button', 'Tournaments: view details', true),
  leaf(T.tournaments.viewFull, 'button', 'Tournaments: view full leaderboard'),
  leaf(T.tournaments.back, 'button', 'Tournaments: back to list'),

  // Leaderboards.
  leaf(T.leaderboards.infoBar, 'button', 'Leaderboards: info bar'),
  leaf(T.leaderboards.infoClose, 'button', 'Leaderboards: info close'),
  leaf(T.leaderboards.player, 'link', 'Leaderboards: player row', true),

  // Rank.
  leaf(T.rank.intro, 'button', 'Rank: intro CTA'),
  leaf(T.rank.prev, 'button', 'Rank: prev'),
  leaf(T.rank.next, 'button', 'Rank: next'),
  leaf(T.rank.page, 'button', 'Rank: page', true),
  leaf(T.rank.faq, 'button', 'Rank: FAQ row', true),
  leaf(T.rank.card, 'group', 'Rank: card', true),

  // Notifications.
  leaf(T.notifications.close, 'button', 'Notifications: close'),
  leaf(T.notifications.item, 'button', 'Notifications: row', true),
  leaf(T.notifications.markAllRead, 'button', 'Notifications: mark all read'),

  // Chat.
  leaf(T.chat.input, 'textbox', 'Chat: input'),
  leaf(T.chat.send, 'button', 'Chat: send'),
  leaf(T.chat.emoji, 'button', 'Chat: emoji'),
  leaf(T.chat.giphy, 'button', 'Chat: giphy'),
  leaf(T.chat.giphySearch, 'textbox', 'Chat: giphy search'),
  leaf(T.chat.giphyItem, 'button', 'Chat: giphy result', true),
  leaf(T.chat.scrollDown, 'button', 'Chat: scroll down'),
  leaf(T.chat.headerAction, 'button', 'Chat: header action', true),
  leaf(T.chat.messageAction, 'button', 'Chat: message action', true),
  leaf(T.chat.loginCta, 'button', 'Chat: login CTA'),
  leaf(T.chat.registerCta, 'button', 'Chat: register CTA'),

  // Policies.
  leaf(T.policies.sidebarItem, 'link', 'Policies: sidebar item', true),
  leaf(T.policies.select, 'combobox', 'Policies: select'),
  leaf(T.policies.contentLink, 'link', 'Policies: content link', true),

  // Blog.
  leaf(T.blog.tab, 'tab', 'Blog: tab', true),
  leaf(T.blog.card, 'link', 'Blog: card', true),
  leaf(T.blog.button, 'button', 'Blog: button', true),
  leaf(T.blog.pagination, 'group', 'Blog: pagination'),

  // Not found.
  leaf(T.notFound.home, 'button', 'Not found: home'),
  leaf(T.errorBoundary.retry, 'button', 'Error boundary: retry'),

  // Sports.
  leaf(T.sports.entry, 'group', 'Sportsbook entry'),
]

export const ENGAGEMENT_REGISTRY: TestIdRegistry = {
  feature: 'engagement',
  structure: ENGAGEMENT_STRUCTURE,
}
