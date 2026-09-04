import { useQuery } from '@tanstack/react-query'
import { isMobile } from 'react-device-detect'
import { getGames } from '../../api/services/Game.api'
import type { ILeaderboard } from '../../types/LeaderBoard.type'
import type { IGameSchema } from '../../types/Game.type'

/** Parse a backend id-list — `null`, an array, or a JSON string like `"[45]"` — to numbers. */
const parseIdList = (value: string | number[] | null | undefined): number[] => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(Number)
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(Number) : []
  } catch {
    return []
  }
}

/**
 * Eligible games for a tournament's games swiper.
 * - `included_games` set → the backend returns the concrete `included_games_data`; show those.
 * - `included_games` null → the tournament covers all games; fetch the game list and drop any
 *   excluded games / providers / categories.
 */
export const useTournamentGames = (leaderBoard?: ILeaderboard | null) => {
  const included = leaderBoard?.included_games_data ?? []
  const hasIncluded = included.length > 0

  const { data: allGames = [], isLoading } = useQuery<IGameSchema[]>({
    queryKey: ['tournament-games', 'all'],
    queryFn: async () => {
      const resp: any = await getGames({
        per_page: '30',
        device: isMobile ? 'mobile' : 'desktop',
        sort: 'popular',
        page: 1,
      })
      return resp?.data?.data?.games?.data ?? []
    },
    enabled: !!leaderBoard && !hasIncluded,
    staleTime: 60_000,
  })

  if (hasIncluded) return { games: included, loading: false, isAllGames: false }

  const exGames = new Set(parseIdList(leaderBoard?.excluded_games))
  const exProviders = new Set(parseIdList(leaderBoard?.excluded_providers))
  const exCategories = new Set(parseIdList(leaderBoard?.excluded_categories))
  const hasExcludes = exGames.size > 0 || exProviders.size > 0 || exCategories.size > 0

  const games = hasExcludes
    ? allGames.filter(
        g =>
          !exGames.has(g.id) &&
          !(g.provider_id != null && exProviders.has(g.provider_id)) &&
          !(g.category_id != null && exCategories.has(g.category_id))
      )
    : allGames

  return { games, loading: isLoading, isAllGames: true }
}

export default useTournamentGames
