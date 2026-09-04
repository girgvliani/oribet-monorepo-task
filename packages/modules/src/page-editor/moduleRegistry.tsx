import { AuthBannerModule } from '../auth-banner'
import { AuthorizedBannerCarouselModule } from '../authorized-banner-carousel'
import { AuthorizedHeroBannerModule } from '../authorized-hero-banner'
import { BetsTableModule } from '../bets-table'
import { CategoryBannersModule } from '../category-banners'
import { DescriptionBannerModule } from '../description-banner'
import { LobbySwiperSectionsModule } from '../lobby-swiper-sections'
import { NoCryptoBannerModule } from '../no-crypto-banner'
import { ProviderSwiperModule } from '../provider-swiper'
import { RecentWinsModule } from '../recent-wins'
import { RecommendedGamesSwiperModule } from '../recommended-games-swiper'
import { SportSwiperModule } from '../sport-swiper'
import { TrendingGamesSwiperModule } from '../trending-games-swiper'
import type { ModuleRegistry } from './types'

export const moduleRegistry: ModuleRegistry = {
  'auth-banner': {
    moduleId: 'auth-banner',
    label: 'Auth Banner',
    Component: AuthBannerModule,
    supports: { auth: true },
  },
  'authorized-hero-banner': {
    moduleId: 'authorized-hero-banner',
    label: 'Authorized Hero Banner',
    Component: AuthorizedHeroBannerModule,
    supports: { auth: true },
  },
  'authorized-banner-carousel': {
    moduleId: 'authorized-banner-carousel',
    label: 'Authorized Banner Carousel',
    Component: AuthorizedBannerCarouselModule,
    supports: { auth: true },
  },
  'category-banners': {
    moduleId: 'category-banners',
    label: 'Category Banners',
    Component: CategoryBannersModule,
    supports: { auth: true },
  },
  'recent-wins': {
    moduleId: 'recent-wins',
    label: 'Recent Wins',
    Component: RecentWinsModule,
  },
  'no-crypto-banner': {
    moduleId: 'no-crypto-banner',
    label: 'No Crypto Banner',
    Component: NoCryptoBannerModule,
  },
  'trending-games-swiper': {
    moduleId: 'trending-games-swiper',
    label: 'Trending Games Swiper',
    Component: TrendingGamesSwiperModule,
  },
  'recommended-games-swiper': {
    moduleId: 'recommended-games-swiper',
    label: 'Recommended Games Swiper',
    Component: RecommendedGamesSwiperModule,
  },
  'lobby-swiper-sections': {
    moduleId: 'lobby-swiper-sections',
    label: 'Lobby Swiper Sections',
    Component: LobbySwiperSectionsModule,
  },
  'sport-swiper': {
    moduleId: 'sport-swiper',
    label: 'Sport Swiper',
    Component: SportSwiperModule,
  },
  'provider-swiper': {
    moduleId: 'provider-swiper',
    label: 'Provider Swiper',
    Component: ProviderSwiperModule,
  },
  'bets-table': {
    moduleId: 'bets-table',
    label: 'Bets Table',
    Component: BetsTableModule,
  },
  'description-banner': {
    moduleId: 'description-banner',
    label: 'Description Banner',
    Component: DescriptionBannerModule,
  },
}
