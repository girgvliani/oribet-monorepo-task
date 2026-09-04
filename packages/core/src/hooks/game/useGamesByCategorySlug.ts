import { useQuery } from '@tanstack/react-query'
import { getGames } from '../../api/services/Game.api'
import { useAppSelector } from '../../redux/hooks'
import { useIsMobile } from '../useIsMobile'
import type { ICategory, IGameSchema } from '../../types/Game.type'

/**
 * Fetches the first page of games for a category identified by slug. Resolves the slug to
 * an id from `state.game.categories` (Redux). Returns `[]` while categories are loading or
 * the slug is unknown.
 */
export const useGamesByCategorySlug = (slug: string) => {
  const isMobile = useIsMobile()
  const categories = useAppSelector(state => state.game.categories)
  const category = categories?.find((c: ICategory) => c.slug === slug)
  const categoryId = category?.id

  const { data: games = [], isLoading } = useQuery<IGameSchema[]>({
    queryKey: ['games-by-category', slug, isMobile ? 'mobile' : 'desktop'],
    queryFn: async () => {
      const resp: any = await getGames({
        per_page: '28',
        device: isMobile ? 'mobile' : 'desktop',
        provider: '',
        search_name: '',
        page: 1,
        category: categoryId,
      })
      const data = resp?.data?.data?.games?.data
      return Array.isArray(data) ? data : []
    },
    enabled: !!categoryId,
    staleTime: 60_000,
  })

  return { games, loading: isLoading }
}
