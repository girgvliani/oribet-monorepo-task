/**
 * Discovery / browse test-id registry: how a player finds games before playing.
 * Game cards, search + filters, category & provider browse, and lobby banner CTAs.
 * Shared modules render identically in both apps; reachability decides presence.
 */
import type { IdNode, TestIdRegistry } from './types'

export const DISCOVERY_TEST_IDS = {
  /** A single game tile (everywhere games are listed). Collection — `<id>.<gameId>`. */
  gameCard: {
    root: 'discovery.game-card',
    play: 'discovery.game-card.play',
    favorite: 'discovery.game-card.favorite',
    /** Title shown below the tile (redesign). Collection — `<id>.<gameId>`. */
    title: 'discovery.game-card.title',
    /** Provider shown below the tile (redesign). Collection — `<id>.<gameId>`. */
    provider: 'discovery.game-card.provider',
  },
  /** Lobby category tile (Slots / Live / Table …). Collection — `<id>.<key>`. */
  categoryCard: 'discovery.category-card',
  /**
   * Carousel/swiper controls — shared by every game/provider/sport swiper and the
   * banner carousels. Each instance composes a `<id>.<swiperKey>` (section slug),
   * so the prev arrow of the Slots row differs from the prev arrow of Trending.
   */
  swiper: {
    prev: 'discovery.swiper.prev',
    next: 'discovery.swiper.next',
    seeAll: 'discovery.swiper.see-all',
    /** Section title text. Collection — `<id>.<swiperKey>`. */
    title: 'discovery.swiper.title',
    /** Section "All (N)" count text. Collection — `<id>.<swiperKey>`. */
    count: 'discovery.swiper.count',
  },
  /** Sport tile inside the sport swiper. Collection — `<id>.<key>`. */
  sportCard: 'discovery.sport-card',
  /** Search surfaces (lobby / casino / global). */
  search: {
    input: 'discovery.search.input',
    providerFilter: 'discovery.search.provider-filter',
    sortFilter: 'discovery.search.sort-filter',
    showHideFilter: 'discovery.search.show-hide-filter',
    clear: 'discovery.search.clear',
    close: 'discovery.search.close',
    loadMore: 'discovery.search.load-more',
    /** Opens the provider-filter modal (casino search). */
    providersOpen: 'discovery.search.providers-open',
    /** A provider checkbox/cell in the provider filter. Collection — `<id>.<providerId>`. */
    providerOption: 'discovery.search.provider-option',
    /** A selected-provider chip shown under the search bar. Collection — `<id>.<providerId>`. */
    providerChip: 'discovery.search.provider-chip',
    /** Apply/confirm provider filter (casino modal). */
    confirm: 'discovery.search.confirm',
  },
  /** Provider browse. */
  provider: {
    /** Provider tile (swiper + list page). Collection — `<id>.<key>`. */
    card: 'discovery.provider-card',
    search: 'discovery.provider-search',
  },
  /** Games-page / casino category switcher tab. Collection — `<id>.<key>`. */
  categorySwitcherTab: 'discovery.category-switcher-tab',
  /** Recent-bets / recent-wins / big-wins live feed. */
  liveFeed: {
    /** Clickable bet row (bets table). Collection — `<id>.<key>`. */
    betRow: 'discovery.live-feed.bet-row',
    /** Clickable win card (recent + big wins). Collection — `<id>.<key>`. */
    winCard: 'discovery.live-feed.win-card',
    /** Win card player name (redesign). Collection — `<id>.<key>`. */
    winPlayer: 'discovery.live-feed.win-player',
    /** Win card amount (redesign). Collection — `<id>.<key>`. */
    winAmount: 'discovery.live-feed.win-amount',
    /** Bets-table tab (casino / sports / high-rollers). Collection — `<id>.<key>`. */
    betTab: 'discovery.live-feed.bet-tab',
    /** Bets-table section title. */
    title: 'discovery.live-feed.title',
  },
  /** Lobby banner calls-to-action. */
  banner: {
    welcomeCta: 'discovery.banner.welcome-cta',
    crashCta: 'discovery.banner.crash-cta',
    noCryptoCta: 'discovery.banner.no-crypto-cta',
    authLogin: 'discovery.banner.auth-login',
    authRegister: 'discovery.banner.auth-register',
    /** Google sign-in on the auth banner. */
    googleAuth: 'discovery.banner.google-auth',
    /** Casino/Sport lobby category banner. Collection — `<id>.<key>`. */
    lobbyCard: 'discovery.banner.lobby-card',
    /** Promo carousel slide link. Collection — `<id>.<key>`. */
    carouselSlide: 'discovery.banner.carousel-slide',
    /** Hero banner slide link. Collection — `<id>.<key>`. */
    heroSlide: 'discovery.banner.hero-slide',
  },
} as const

const T = DISCOVERY_TEST_IDS

export const DISCOVERY_STRUCTURE: IdNode[] = [
  {
    id: T.gameCard.root,
    role: 'button',
    label: 'Game card',
    collection: true,
    children: [
      {
        id: T.gameCard.play,
        role: 'button',
        label: 'Game card: play',
        collection: true,
        runtimeConditional: true,
      },
      {
        id: T.gameCard.favorite,
        role: 'button',
        label: 'Game card: favorite',
        collection: true,
        runtimeConditional: true,
      },
      {
        id: T.gameCard.title,
        role: 'text',
        label: 'Game card: title (below tile)',
        collection: true,
        runtimeConditional: true,
      },
      {
        id: T.gameCard.provider,
        role: 'text',
        label: 'Game card: provider (below tile)',
        collection: true,
        runtimeConditional: true,
      },
    ],
  },
  { id: T.categoryCard, role: 'link', label: 'Lobby category tile', collection: true },

  // Swiper / carousel controls (shared across all game/provider/sport swipers).
  {
    id: T.swiper.prev,
    role: 'button',
    label: 'Swiper: previous',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.swiper.next,
    role: 'button',
    label: 'Swiper: next',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.swiper.seeAll,
    role: 'link',
    label: 'Swiper: see all',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.swiper.title,
    role: 'text',
    label: 'Swiper: section title',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.swiper.count,
    role: 'text',
    label: 'Swiper: section count',
    collection: true,
    runtimeConditional: true,
  },
  { id: T.sportCard, role: 'link', label: 'Sport tile', collection: true, runtimeConditional: true },

  // Search.
  { id: T.search.input, role: 'textbox', label: 'Search input' },
  {
    id: T.search.providerFilter,
    role: 'combobox',
    label: 'Provider filter',
    runtimeConditional: true,
  },
  { id: T.search.sortFilter, role: 'combobox', label: 'Sort-by filter', runtimeConditional: true },
  {
    id: T.search.showHideFilter,
    role: 'combobox',
    label: 'Show/hide blocked filter',
    runtimeConditional: true,
  },
  { id: T.search.clear, role: 'button', label: 'Clear search', runtimeConditional: true },
  { id: T.search.close, role: 'button', label: 'Close search', runtimeConditional: true },
  { id: T.search.loadMore, role: 'button', label: 'Load more', runtimeConditional: true },
  {
    id: T.search.providersOpen,
    role: 'button',
    label: 'Open provider filter',
    runtimeConditional: true,
  },
  {
    id: T.search.providerOption,
    role: 'checkbox',
    label: 'Provider filter option',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.search.providerChip,
    role: 'button',
    label: 'Selected provider chip (remove)',
    collection: true,
    runtimeConditional: true,
  },
  { id: T.search.confirm, role: 'button', label: 'Apply provider filter', runtimeConditional: true },

  // Provider browse.
  { id: T.provider.card, role: 'link', label: 'Provider tile', collection: true },
  { id: T.provider.search, role: 'textbox', label: 'Provider search', runtimeConditional: true },

  // Games-page / casino category switcher.
  {
    id: T.categorySwitcherTab,
    role: 'tab',
    label: 'Category switcher tab',
    collection: true,
    runtimeConditional: true,
  },

  // Live feed.
  {
    id: T.liveFeed.betRow,
    role: 'link',
    label: 'Bet row',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.liveFeed.winCard,
    role: 'link',
    label: 'Win card',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.liveFeed.winPlayer,
    role: 'text',
    label: 'Win card: player',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.liveFeed.winAmount,
    role: 'text',
    label: 'Win card: amount',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.liveFeed.betTab,
    role: 'tab',
    label: 'Bets-table tab',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.liveFeed.title,
    role: 'text',
    label: 'Bets-table section title',
    runtimeConditional: true,
  },

  // Banners.
  { id: T.banner.welcomeCta, role: 'button', label: 'Welcome bonus CTA', runtimeConditional: true },
  {
    id: T.banner.crashCta,
    role: 'button',
    label: 'Crash banner CTA',
    collection: true,
    runtimeConditional: true,
  },
  { id: T.banner.noCryptoCta, role: 'button', label: 'No-crypto CTA', runtimeConditional: true },
  { id: T.banner.authLogin, role: 'button', label: 'Auth banner login', runtimeConditional: true },
  {
    id: T.banner.authRegister,
    role: 'button',
    label: 'Auth banner register',
    runtimeConditional: true,
  },
  {
    id: T.banner.googleAuth,
    role: 'button',
    label: 'Auth banner Google sign-in',
    runtimeConditional: true,
  },
  {
    id: T.banner.lobbyCard,
    role: 'link',
    label: 'Lobby category banner',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.banner.carouselSlide,
    role: 'link',
    label: 'Promo carousel slide',
    collection: true,
    runtimeConditional: true,
  },
  {
    id: T.banner.heroSlide,
    role: 'link',
    label: 'Hero banner slide',
    collection: true,
    runtimeConditional: true,
  },
]

export const DISCOVERY_REGISTRY: TestIdRegistry = {
  feature: 'discovery',
  structure: DISCOVERY_STRUCTURE,
}
