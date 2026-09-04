import { getRecommendedGames } from '@oribet/core/api/services/Game.api'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import type { IGameSchema } from '@oribet/core/types/Game.type'
import { IconStar } from '@oribet/assets/icons/IconStar'
import GameSwiper from '../game-swiper/GameSwiper'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'

const RecommendedGamesSwiperModule = () => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const theme = useTheme()
  const categories = useAppSelector(state => state.game.categories)
  const hasCategories = categories && categories.length > 0

  const { data: recommendedGames = [], isLoading } = useQuery<IGameSchema[]>({
    queryKey: ['recommended-games'],
    queryFn: async () => {
      const resp = await getRecommendedGames()
      return resp.data.data ?? []
    },
    enabled: hasCategories,
    staleTime: 60_000,
  })

  return (
    <GameSwiper
      swiperKey="recommended"
      title={t('games.recommendedGames')}
      icon={
        <IconStar
          size={isMobile ? 16 : 20}
          style={{ color: theme.colors.text.secondary }}
        />
      }
      seeAllLink={AppRoutePath.GAMELIST()}
      games={recommendedGames}
      loading={isLoading}
    />
  )
}

export default RecommendedGamesSwiperModule
