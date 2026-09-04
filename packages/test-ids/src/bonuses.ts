/**
 * Bonuses test-id registry: the bonus economy across both apps.
 *
 * Surfaces: the bonuses page (oribet `bonuses-page` ↔ korea `korea-bonuses`),
 * the bonus wheel, the shared `bonus-modals` family, the marketplace, and the
 * header bonus cluster (containers / counters / cashback / rakeback / promo code /
 * wheel / welcome / grab). Almost everything is runtime-conditional (auth + API
 * driven). Repeated cards/actions are collections — `<id>.<key>`.
 */
import type { IdNode, TestIdRegistry } from './types'

export const BONUSES_TEST_IDS = {
  /** Bonuses page (oribet bonuses-page + korea-bonuses panes). */
  list: {
    /** Top tab (general/deposit/freespins/bonus-money/cashback-rakeback). Collection. */
    tab: 'bonuses.list.tab',
    /** Korea sub-tab. Collection. */
    subTab: 'bonuses.list.sub-tab',
    /** A bonus card container. Collection — `<id>.<bonusKey>`. */
    card: 'bonuses.list.card',
    /** Card CTA (claim/activate/cancel/buy/info). Collection — `<id>.<bonusKey>.<kind>`. */
    action: 'bonuses.list.action',
    promoInput: 'bonuses.list.promo-input',
    promoSubmit: 'bonuses.list.promo-submit',
    /** Freespin "play" launcher. Collection — `<id>.<key>`. */
    freespinPlay: 'bonuses.list.freespin-play',
    /** Freespin "eligible games" opener. Collection — `<id>.<key>`. */
    freespinGames: 'bonuses.list.freespin-games',
    exploreMore: 'bonuses.list.explore-more',
    telegram: 'bonuses.list.telegram',
  },
  /** Bonus wheel. */
  wheel: {
    banner: 'bonuses.wheel.banner',
    spin: 'bonuses.wheel.spin',
    spinLarge: 'bonuses.wheel.spin-large',
    continue: 'bonuses.wheel.continue',
    close: 'bonuses.wheel.close',
  },
  /** Shared bonus-modals family. */
  modal: {
    /** Shared modal close (ModalWrapper). */
    close: 'bonuses.modal.close',
    /** Modal action (confirm/cancel/ok). Collection — `<id>.<modal>.<kind>`. */
    action: 'bonuses.modal.action',
  },
  /** Marketplace. */
  marketplace: {
    /** Category tab. Collection. */
    tab: 'bonuses.marketplace.tab',
    /** Marketplace card. Collection — `<id>.<key>`. */
    card: 'bonuses.marketplace.card',
    /** Buy CTA. Collection — `<id>.<key>`. */
    buy: 'bonuses.marketplace.buy',
    /** Favourite toggle. Collection — `<id>.<key>`. */
    favorite: 'bonuses.marketplace.favorite',
  },
  /** Header bonus cluster. */
  header: {
    /** Bonus-counter trigger (opens the bonus panel). */
    trigger: 'bonuses.header.trigger',
    /** Bonus card in the header container. Collection — `<id>.<type>`. */
    card: 'bonuses.header.card',
    /** Header card CTA. Collection — `<id>.<type>.<kind>`. */
    action: 'bonuses.header.action',
    cashback: 'bonuses.header.cashback',
    rakeback: 'bonuses.header.rakeback',
    wheel: 'bonuses.header.wheel',
    promoInput: 'bonuses.header.promo-input',
    promoSubmit: 'bonuses.header.promo-submit',
    telegram: 'bonuses.header.telegram',
    grab: 'bonuses.header.grab',
    welcomeCta: 'bonuses.header.welcome-cta',
    claimNotification: 'bonuses.header.claim-notification',
    /** Sidebar spin/claim/wager bonus button. Collection — `<id>.<type>`. */
    sidebarBonus: 'bonuses.header.sidebar-bonus',
  },
} as const

const T = BONUSES_TEST_IDS

const leaf = (id: string, role: IdNode['role'], label: string, collection = false): IdNode => ({
  id,
  role,
  label,
  collection: collection || undefined,
  runtimeConditional: true,
})

export const BONUSES_STRUCTURE: IdNode[] = [
  // Bonuses page.
  leaf(T.list.tab, 'tab', 'Bonuses: tab', true),
  leaf(T.list.subTab, 'tab', 'Bonuses: sub-tab', true),
  leaf(T.list.card, 'group', 'Bonuses: card', true),
  leaf(T.list.action, 'button', 'Bonuses: card action', true),
  leaf(T.list.promoInput, 'textbox', 'Bonuses: promo code input'),
  leaf(T.list.promoSubmit, 'button', 'Bonuses: promo code submit'),
  leaf(T.list.freespinPlay, 'button', 'Bonuses: freespin play', true),
  leaf(T.list.freespinGames, 'button', 'Bonuses: freespin games', true),
  leaf(T.list.exploreMore, 'button', 'Bonuses: explore more'),
  leaf(T.list.telegram, 'link', 'Bonuses: telegram'),

  // Wheel.
  leaf(T.wheel.banner, 'button', 'Wheel: banner'),
  leaf(T.wheel.spin, 'button', 'Wheel: spin'),
  leaf(T.wheel.spinLarge, 'button', 'Wheel: spin (large)'),
  leaf(T.wheel.continue, 'button', 'Wheel: continue playing'),
  leaf(T.wheel.close, 'button', 'Wheel: close'),

  // Modals.
  leaf(T.modal.close, 'button', 'Bonus modal: close'),
  leaf(T.modal.action, 'button', 'Bonus modal: action', true),

  // Marketplace.
  leaf(T.marketplace.tab, 'tab', 'Marketplace: tab', true),
  leaf(T.marketplace.card, 'group', 'Marketplace: card', true),
  leaf(T.marketplace.buy, 'button', 'Marketplace: buy', true),
  leaf(T.marketplace.favorite, 'button', 'Marketplace: favourite', true),

  // Header cluster.
  leaf(T.header.trigger, 'button', 'Header: bonus trigger'),
  leaf(T.header.card, 'group', 'Header: bonus card', true),
  leaf(T.header.action, 'button', 'Header: bonus action', true),
  leaf(T.header.cashback, 'button', 'Header: cashback'),
  leaf(T.header.rakeback, 'button', 'Header: rakeback'),
  leaf(T.header.wheel, 'button', 'Header: wheel entry'),
  leaf(T.header.promoInput, 'textbox', 'Header: promo input'),
  leaf(T.header.promoSubmit, 'button', 'Header: promo submit'),
  leaf(T.header.telegram, 'link', 'Header: telegram'),
  leaf(T.header.grab, 'button', 'Header: grab bonus'),
  leaf(T.header.welcomeCta, 'button', 'Header: welcome CTA'),
  leaf(T.header.claimNotification, 'button', 'Header: claim notification'),
  leaf(T.header.sidebarBonus, 'button', 'Header: sidebar bonus', true),
]

export const BONUSES_REGISTRY: TestIdRegistry = {
  feature: 'bonuses',
  structure: BONUSES_STRUCTURE,
}
