import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { getQueuedBonuses } from '../../api/services/BmBonus.api'
import { useAppSelector } from '../../redux/hooks'
import { getLocalStorageValue } from '../../util/appUtil'
import type { IPlayBonusMoney } from '../../types/BonusMode.type'

/**
 * Queued (locked) bonus-money bonuses for the current wallet — the bonuses waiting behind the
 * active one. Keyed by wallet so a wallet switch refetches. Used by the bonus-play cards
 * (queue list + locked-amount breakdown + total balance) and `useTotalBonusBalance`.
 *
 * `/bonus/bm/queued_bonuses` requires auth, and `useTotalBonusBalance` is mounted in the always-
 * present header (e.g. Korea's mobile header renders for guests too), so gate the request on the
 * token — otherwise a logged-out user hammers the endpoint with 401s.
 */
const useFetchQueuedBonuses = (): UseQueryResult<IPlayBonusMoney[]> => {
  const token = getLocalStorageValue('token', '')
  const walletId = useAppSelector(state => state.user.playerInfo?.player?.default_wallet?.id)
  return useQuery<IPlayBonusMoney[]>({
    queryKey: ['bonuses-page', 'queued', walletId],
    queryFn: async () => {
      const resp: any = await getQueuedBonuses()
      return resp?.data ?? []
    },
    enabled: !!token,
  })
}

export default useFetchQueuedBonuses
