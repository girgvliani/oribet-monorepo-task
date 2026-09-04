import { createContext, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getLeaderBoards } from '../../api/services/LeaderBoards'
import { useAppSelector } from '../../redux/hooks'
import { getUserLanguage } from '../../util/appUtil'
import type { ILeaderboard, ILeaderBoardInfo } from '../../types/LeaderBoard.type'

export type TournamentStatus = 'Ongoing' | 'Upcoming' | 'Ended'

export const TOURNAMENTS_TABS: TournamentStatus[] = ['Ongoing', 'Upcoming', 'Ended']

export interface TournamentEntry {
  lb: ILeaderboard
  status: TournamentStatus
}

export interface TournamentsContextValue {
  tournaments: TournamentEntry[]
  loading: boolean
  selectedTab: TournamentStatus
  setSelectedTab: (tab: TournamentStatus) => void
}

export const TournamentsContext = createContext<TournamentsContextValue | null>(null)

const classify = (lb: ILeaderboard): TournamentStatus => {
  const now = Date.now()
  const start = new Date(lb.start_date).getTime()
  const end = new Date(lb.end_date).getTime()
  if (lb.is_finished === 1 || now > end) return 'Ended'
  if (now < start) return 'Upcoming'
  return 'Ongoing'
}

const sortFor = (tab: TournamentStatus, a: TournamentEntry, b: TournamentEntry) => {
  if (tab === 'Upcoming') {
    return new Date(a.lb.start_date).getTime() - new Date(b.lb.start_date).getTime()
  }
  return new Date(b.lb.end_date).getTime() - new Date(a.lb.end_date).getTime()
}

interface UseTournamentsStateArgs {
  selectedTab: TournamentStatus
}

/**
 * Fetches the leaderboard list, resolves each entry's `leaderboardinfos` to the user's
 * language, classifies + filters + sorts by the active tab. The list-of-leaderboards is
 * cached by React Query keyed on language; the filter happens client-side off the cache.
 */
export const useTournamentsList = ({ selectedTab }: UseTournamentsStateArgs) => {
  const language = useAppSelector(state => state.user.language)

  const { data: leaderBoards = [], isLoading: loading } = useQuery<ILeaderboard[]>({
    queryKey: ['tournaments', 'list', language],
    queryFn: async () => {
      const resp: any = await getLeaderBoards({ page: 1, per_page: 50 })
      const data: ILeaderboard[] = resp?.data?.data?.data ?? []
      const userLangCode = getUserLanguage()
      return data.map((item: ILeaderboard) => {
        const raw = item as unknown as { leaderboardinfos?: ILeaderBoardInfo[] | ILeaderBoardInfo }
        const infos = raw.leaderboardinfos
        const matched = Array.isArray(infos)
          ? infos.find(info => info.lang === userLangCode) || infos[0]
          : infos
        return { ...item, leaderboardinfos: matched } as ILeaderboard
      })
    },
  })

  const tournaments = useMemo<TournamentEntry[]>(() => {
    return leaderBoards
      .map(lb => ({ lb, status: classify(lb) }))
      .filter(({ status }) => status === selectedTab)
      .sort((a, b) => sortFor(selectedTab, a, b))
  }, [leaderBoards, selectedTab])

  return { tournaments, loading }
}

/**
 * Read tournaments page state from `TournamentsContext`. The Provider lives in the page
 * Container; modules call this hook and never instantiate the state directly.
 */
export const useTournaments = (): TournamentsContextValue => {
  const ctx = useContext(TournamentsContext)
  if (!ctx) throw new Error('useTournaments must be used inside TournamentsContext.Provider')
  return ctx
}
