import { useMemo } from 'react'
import { useAppSelector } from '../../redux/hooks'
import useFetchQueuedBonuses from './useFetchQueuedBonuses'

export interface TotalBonusBalance {
  /** Active bm bonus balance — the socket-updated wallet bonus balance (`bonus_balance`). */
  active: number
  /** Total of all queued (locked) bonus amounts. */
  queue: number
  /** `active + queue`. */
  total: number
  isLoading: boolean
}

/**
 * Total bonus balance of the default wallet = active bm bonus + queued bonuses. Reusable in any
 * app (reads redux + core hooks only).
 *
 * `active` reads the redux wallet bonus balance (`player.bonus_balance`, falling back to the
 * default wallet's `bm_balance`). Every wallet socket event writes that value (balance /
 * walletBalanceUpdated / defaultWalletChanged), so the total recomputes live while betting in
 * bonus mode — it is NOT the cached `/bonus/bm/active` amount, which doesn't move on socket.
 * `queue` is the cached queued-bonus total (`useFetchQueuedBonuses`, invalidated on claim/cancel).
 *
 * Consumers pick what they need: `total` (active+queue), `queue` alone, or `active` alone.
 */
const useTotalBonusBalance = (): TotalBonusBalance => {
  const player = useAppSelector(state => state.user.playerInfo?.player)
  const active = Number(player?.default_wallet?.bm_balance ?? 0)

  const { data: queuedBonuses = [], isLoading: queueLoading } = useFetchQueuedBonuses()
  const queue = queuedBonuses.reduce((sum, b) => sum + Number(b.amount ?? 0), 0)

  return useMemo(
    () => ({ active, queue, total: active + queue, isLoading: queueLoading }),
    [active, queue, queueLoading]
  )
}

export default useTotalBonusBalance
