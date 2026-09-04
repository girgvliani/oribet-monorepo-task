import type { PageRegistry } from './types'

const lobbyAllowed = [
  'auth-banner',
  'authorized-hero-banner',
  'authorized-banner-carousel',
  'category-banners',
  'recent-wins',
  'no-crypto-banner',
  'trending-games-swiper',
  'recommended-games-swiper',
  'lobby-swiper-sections',
  'sport-swiper',
  'provider-swiper',
  'bets-table',
  'description-banner',
]

export const pageRegistry: PageRegistry = {
  lobby: {
    pageId: 'lobby',
    label: 'Lobby',
    allowedModules: lobbyAllowed,
    defaultInstances: [
      { id: 'lobby-default-authorized-hero-banner', moduleId: 'authorized-hero-banner', visible: 'auth' },
      { id: 'lobby-default-auth-banner', moduleId: 'auth-banner', visible: 'unauth' },
      { id: 'lobby-default-category-banners', moduleId: 'category-banners', visible: 'unauth' },
      { id: 'lobby-default-recent-wins', moduleId: 'recent-wins' },
      { id: 'lobby-default-no-crypto-banner', moduleId: 'no-crypto-banner' },
      { id: 'lobby-default-lobby-swiper-sections', moduleId: 'lobby-swiper-sections' },
      { id: 'lobby-default-sport-swiper', moduleId: 'sport-swiper' },
      { id: 'lobby-default-provider-swiper', moduleId: 'provider-swiper' },
      { id: 'lobby-default-bets-table', moduleId: 'bets-table' },
      { id: 'lobby-default-description-banner', moduleId: 'description-banner' },
    ],
  },
}
