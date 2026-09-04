import { useEffect } from 'react'
import { socket } from '../../api/oribet.socket'
import { Defaults } from '../../util/defaults'

interface InvalidBonusBetPayload {
  bonus_id?: number
  min_bet?: string | number
  max_bet?: string | number
}

/**
 * Pops the invalid-bonus-bet modal when the socket reports an out-of-range bonus bet
 * (`invalidBonusBet`). Mount ONCE (in AppShell) so it applies app-wide.
 */
export const useInvalidBonusBetSocket = () => {
  useEffect(() => {
    const handler = (data: InvalidBonusBetPayload) => {
      Defaults.modals.invalidBonusBetModal?.open({ minBet: data?.min_bet, maxBet: data?.max_bet })
    }
    socket.on('invalidBonusBet', handler)
    return () => {
      socket.off('invalidBonusBet', handler)
    }
  }, [])
}

export default useInvalidBonusBetSocket
