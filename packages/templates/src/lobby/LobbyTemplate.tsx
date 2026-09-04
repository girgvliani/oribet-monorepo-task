import LobbyContainer from './LobbyContainer'
import { AuthBannerModule } from '@oribet/modules/auth-banner'
import { BetsTableModule } from '@oribet/modules/bets-table'
import { CategoryBannersModule } from '@oribet/modules/category-banners'
import { DescriptionBannerModule } from '@oribet/modules/description-banner'
import { LobbySwiperSectionsModule } from '@oribet/modules/lobby-swiper-sections'
import { NoCryptoBannerModule } from '@oribet/modules/no-crypto-banner'
import { ProviderSwiperModule } from '@oribet/modules/provider-swiper'
import { RecentWinsModule } from '@oribet/modules/recent-wins'
import { RecommendedGamesSwiperModule } from '@oribet/modules/recommended-games-swiper'
import { SportSwiperModule } from '@oribet/modules/sport-swiper'
import { TrendingGamesSwiperModule } from '@oribet/modules/trending-games-swiper'
import { useAppSelector } from '@oribet/core/redux/hooks'
import type { seoType } from '@oribet/core/types/seo.type'

interface LobbyTemplateProps {
  seo?: seoType
}

const LobbyTemplate = ({ seo }: LobbyTemplateProps) => {
  return (
    <LobbyContainer seo={seo}>
      <AuthBannerModule visible="unauth" />
      <CategoryBannersModule visible="unauth" />
      <RecentWinsModule />
      <NoCryptoBannerModule />
      <TrendingGamesSwiperModule />
      <RecommendedGamesSwiperModule />
      <LobbySwiperSectionsModule />
      <SportSwiperModule />
      <ProviderSwiperModule />
      <BetsTableModule />
      <DescriptionBannerModule />
    </LobbyContainer>
  )
}

export default LobbyTemplate
