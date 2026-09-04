/**
 * Promotions test-id registry. oribet `promotions` (switcher tabs, cards, pagination,
 * promotions swiper) ↔ korea `korea-promotions` (category pills, cards, detail modal).
 * Swiper arrows reuse the shared DISCOVERY swiper ids; this file covers the promo-
 * specific list + detail controls. All runtime-conditional.
 */
import type { IdNode, TestIdRegistry } from './types'

export const PROMOTIONS_TEST_IDS = {
  list: {
    /** Category/switcher tab or pill. Collection — `<id>.<key>`. */
    tab: 'promotions.list.tab',
    /** Promotion card. Collection — `<id>.<key>`. */
    card: 'promotions.list.card',
    /** See-all / view-all. */
    viewAll: 'promotions.list.view-all',
    pagination: 'promotions.list.pagination',
  },
  detail: {
    /** Join / claim CTA. Collection — `<id>.<key>`. */
    join: 'promotions.detail.join',
    /** More-info / read-more. Collection — `<id>.<key>`. */
    moreInfo: 'promotions.detail.more-info',
    close: 'promotions.detail.close',
  },
} as const

const T = PROMOTIONS_TEST_IDS

export const PROMOTIONS_STRUCTURE: IdNode[] = [
  { id: T.list.tab, role: 'tab', label: 'Promotions: tab', collection: true, runtimeConditional: true },
  { id: T.list.card, role: 'link', label: 'Promotions: card', collection: true, runtimeConditional: true },
  { id: T.list.viewAll, role: 'link', label: 'Promotions: view all', runtimeConditional: true },
  { id: T.list.pagination, role: 'group', label: 'Promotions: pagination', runtimeConditional: true },
  { id: T.detail.join, role: 'button', label: 'Promotion: join', collection: true, runtimeConditional: true },
  {
    id: T.detail.moreInfo,
    role: 'button',
    label: 'Promotion: more info',
    collection: true,
    runtimeConditional: true,
  },
  { id: T.detail.close, role: 'button', label: 'Promotion: detail close', runtimeConditional: true },
]

export const PROMOTIONS_REGISTRY: TestIdRegistry = {
  feature: 'promotions',
  structure: PROMOTIONS_STRUCTURE,
}
