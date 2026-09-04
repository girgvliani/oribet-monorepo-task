import { useEffect } from 'react'
import { getReadyToClaimBonuses } from '../../api/services/BmBonus.api'
import { useAppDispatch } from '../../redux/hooks'
import { setBmBonusReadyToClaim } from '../../redux/slices/userSlice'
import { Defaults } from '../../util/defaults'

/**
 * On mount, checks for any ready-to-claim bonuses. If one exists, marks it in Redux and pops
 * the `bonusReadyToClaimModal`. Used by BonusPlay + the bonus-mode play page so users see
 * their pending claim the moment they arrive. Pass `enabled=false` to skip (e.g. on the
 * regular play page outside bonus mode).
 */
export const useReadyToClaimBonusesOnMount = (enabled: boolean = true) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!enabled) return
    getReadyToClaimBonuses()
      .then((resp: any) => {
        const bonuses = resp.data || []
        if (bonuses.length === 0) return
        const bonus = bonuses[0]
        dispatch(setBmBonusReadyToClaim({ bonus_id: bonus.id, wallet_id: 0 }))
        Defaults.modals.bonusReadyToClaimModal?.open({
          returnMode: true,
          claimAmount: bonus.claim_amount ?? bonus.amount,
          claimBonusId: bonus.id,
        })
      })
      .catch(() => {})
  }, [enabled])
}
