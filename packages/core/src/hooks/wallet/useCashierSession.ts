import { useCallback, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { cashierInit, updateCashierSession } from '../../api/services/Account.api'
import { CashierSession } from '../../types/Cashier.type'

interface UpdateSessionParams {
  wallet_id?: number
  type?: string
  provider?: string
  currency?: string
  bonus_ids?: number[]
}

/**
 * Owns the single active cashier session (§6.7: one live session per player, every
 * response replaces it wholesale). `initSession` bootstraps a session for a wallet;
 * `updateSession` sends only the changed fields against the current session's uuid.
 */
const useCashierSession = () => {
  const [session, setSession] = useState<CashierSession | null>(null)

  const initMutation = useMutation({
    mutationFn: (walletId: number) => cashierInit({ wallet_id: walletId }),
    onSuccess: response => setSession(response.data?.data ?? null),
  })

  const updateMutation = useMutation({
    mutationFn: (params: UpdateSessionParams & { payment_session_id: string }) =>
      updateCashierSession(params),
    onSuccess: response => setSession(response.data?.data ?? null),
  })

  const initSession = useCallback(
    (walletId: number) => initMutation.mutateAsync(walletId),
    [initMutation]
  )

  const updateSession = useCallback(
    (params: UpdateSessionParams) => {
      if (!session) return Promise.reject(new Error('No active cashier session'))
      return updateMutation.mutateAsync({ payment_session_id: session.uuid, ...params })
    },
    [session, updateMutation]
  )

  return {
    session,
    isInitializing: initMutation.isPending,
    isUpdating: updateMutation.isPending,
    initSession,
    updateSession,
  }
}

export default useCashierSession
