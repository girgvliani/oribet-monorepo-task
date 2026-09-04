import { useEffect, useState } from 'react'
import { checkCancelBonusAmount } from '../../api/services/BmBonus.api'

/**
 * Extract the refund amount from the `/bonus/bm/check-cancel-amount` payload.
 * Response shape: `{ data: { amount }, success }` — the hook unwraps one `data`, so the
 * amount is at `data.amount`.
 */
export const getCancelRefundAmount = (data: any): number | string | null => {
  if (data == null) return null
  return data.amount ?? null
}

/**
 * Fetches the "how much you get back on cancel" preview for a bonus. Runs whenever `enabled`
 * becomes true (e.g. the cancel-confirmation modal opens). Returns the raw payload (`data`) plus a
 * `loading` flag; callers format the amount via `getCancelRefundAmount`.
 */
export const useCheckCancelBonusAmount = (playerBonusId?: number, enabled = false) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled || playerBonusId == null) {
      setData(null)
      return
    }
    let cancelled = false
    setLoading(true)
    checkCancelBonusAmount(playerBonusId)
      .then((res: any) => {
        if (!cancelled) setData(res?.data ?? res ?? null)
      })
      .catch(() => {
        if (!cancelled) setData(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [enabled, playerBonusId])

  return { data, loading }
}

export default useCheckCancelBonusAmount
