import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getLeaderBoardBySlug } from '../../api/services/LeaderBoards'
import { getUserLanguage } from '../../util/appUtil'
import { useAppSelector } from '../../redux/hooks'
import type { ILeaderboard, ILeaderBoardInfo } from '../../types/LeaderBoard.type'

interface LeaderboardData {
  leaderBoard: ILeaderboard | undefined
  headerInfo: ILeaderBoardInfo | undefined
}

/**
 * Fetches the leaderboard for the `:slug` route param. Re-runs when the user logs in/out
 * (the response includes auth-only fields like `current_player_position`). React Query
 * shares the cache across modules.
 */
export const useCurrentLeaderboard = () => {
  const { slug } = useParams<{ slug?: string }>()
  const isUserAuthenticated = useAppSelector(state => state.user.isUserAuthorized)

  const { data, isLoading: loading } = useQuery<LeaderboardData>({
    queryKey: ['leaderboard', slug, isUserAuthenticated],
    queryFn: async () => {
      const resp: any = await getLeaderBoardBySlug(slug as string)
      const leaderBoard = resp.data.data as ILeaderboard
      const userLangCode = getUserLanguage()
      const infos = (leaderBoard as unknown as { leaderboardinfos?: ILeaderBoardInfo[] })
        .leaderboardinfos
      const headerInfo = Array.isArray(infos)
        ? infos.find(item => item.lang === userLangCode)
        : (infos as ILeaderBoardInfo | undefined)
      return { leaderBoard, headerInfo }
    },
    enabled: !!slug,
  })

  return {
    leaderBoard: data?.leaderBoard,
    headerInfo: data?.headerInfo,
    loading,
  }
}
