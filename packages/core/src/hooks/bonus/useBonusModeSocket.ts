import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { socket } from '../../api/oribet.socket'
import { useAppDispatch } from '../../redux/hooks'
import { setBmBonusReadyToClaim } from '../../redux/slices/userSlice'
import { Defaults } from '../../util/defaults'

/**
 * Bonus-mode wager socket subscriptions (mirrors the base app's `AppHeaderAuthorizedContent`), so
 * the wager progress + ready-to-claim flow stay live during play in apps whose header doesn't use
 * that component (oribet-korea, oribet-redesign). Call from an always-mounted authed component.
 *
 * - `bmBonusWagerUpdated` → refetch the active bm bonus so wager progress / `is_wagered` update live.
 * - `bmBonusReadyToClaim` → mark ready-to-claim, refresh active + queued bonuses (so the wallet's
 *   active/queue split re-computes immediately), and pop the claim modal when wagering completes.
 */
export const useBonusModeSocket = (enabled: boolean = true) => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) return

    const handleWagerUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['active-bm-bonus'] })
    }
    const handleReadyToClaim = (data: { bonus_id: number; wallet_id: number }) => {
      dispatch(setBmBonusReadyToClaim(data))
      queryClient.invalidateQueries({ queryKey: ['active-bm-bonus'] })
      queryClient.invalidateQueries({ queryKey: ['bonuses-page', 'queued'] })
      Defaults.modals.bonusReadyToClaimModal?.open()
    }

    socket.on('bmBonusWagerUpdated', handleWagerUpdated)
    socket.on('bmBonusReadyToClaim', handleReadyToClaim)
    return () => {
      socket.off('bmBonusWagerUpdated', handleWagerUpdated)
      socket.off('bmBonusReadyToClaim', handleReadyToClaim)
    }
  }, [enabled, dispatch, queryClient])
}

export default useBonusModeSocket
