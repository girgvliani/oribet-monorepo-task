import { getTrendingGames } from '@oribet/core/api/services/Game.api'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import type { IGameSchema } from '@oribet/core/types/Game.type'
import { IconOribetFire } from '@oribet/assets/icons/IconOribetFire'
import GameSwiper from '../game-swiper/GameSwiper'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'

const TrendingGamesSwiperModule = () => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const theme = useTheme()
  const categories = useAppSelector(state => state.game.categories)
  const hasCategories = categories && categories.length > 0

  const { data: trendingGames = [], isLoading } = useQuery<IGameSchema[]>({
    queryKey: ['trending-games'],
    queryFn: async () => {
      const resp = await getTrendingGames()
      return resp.data.data ?? []
    },
    enabled: hasCategories,
    staleTime: 60_000,
  })

  return (
    <GameSwiper
      swiperKey="trending"
      title={t('games.trendingGames')}
      icon={
        <IconOribetFire
          size={isMobile ? 16 : 20}
          style={{ color: theme.colors.text.secondary }}
        />
      }
      seeAllLink={AppRoutePath.GAMELIST()}
      games={trendingGames}
      loading={isLoading}
    />
  )
}

export default TrendingGamesSwiperModule
