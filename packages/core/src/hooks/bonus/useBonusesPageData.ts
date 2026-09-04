import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  getQueuedBonuses,
  getReadyToClaimBonuses,
  claimBmBonusById,
} from '../../api/services/BmBonus.api'
import { getAllDepositBonuses, getFreespinBonuses } from '../../api/services/Bonus.api'
import { getUserInfo } from '../../api/services/User.api'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { changeUserInfo } from '../../redux/slices/userSlice'
import type { IPlayBonusMoney } from '../../types/BonusMode.type'
import type { IUserInfo } from '../../types/common.type'

interface DepositBonusesPayload {
  player_bonuses: any[]
  available_bonuses: any[]
}

/**
 * Coordinated fetch for the bonuses page. React Query keys per slice so any module that
 * needs only one of them gets a precise cache. Refreshes user info + invalidates
 * cashback/rakeback on mount (matches the legacy `<BonusesPage>` behavior). Also exposes
 * `claimBonus` which invalidates the right keys after a successful claim.
 */
export const useBonusesPageData = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const walletId = useAppSelector(state => state.user.playerInfo?.player?.default_wallet?.id)

  const { data: queuedBonuses = [] } = useQuery<IPlayBonusMoney[]>({
    queryKey: ['bonuses-page', 'queued', walletId],
    queryFn: async () => {
      const resp: any = await getQueuedBonuses()
      return resp.data || []
    },
  })

  const { data: claimableBonuses = [] } = useQuery<IPlayBonusMoney[]>({
    queryKey: ['bonuses-page', 'claimable', walletId],
    queryFn: async () => {
      const resp: any = await getReadyToClaimBonuses()
      return resp.data || []
    },
  })

  const { data: freespinBonuses = [] } = useQuery<any[]>({
    queryKey: ['bonuses-page', 'freespins'],
    queryFn: async () => {
      try {
        return await getFreespinBonuses()
      } catch {
        return []
      }
    },
  })

  const { data: depositPayload } = useQuery<DepositBonusesPayload>({
    queryKey: ['bonuses-page', 'deposit-bonuses'],
    queryFn: async () => {
      const resp: any = await getAllDepositBonuses()
      return {
        player_bonuses: resp?.data?.data?.player_bonuses ?? [],
        available_bonuses: resp?.data?.data?.available_bonuses ?? [],
      }
    },
  })

  const playerBonuses = depositPayload?.player_bonuses ?? []
  const availableDepositBonuses = depositPayload?.available_bonuses ?? []

  // On mount: refresh user info + invalidate rakeback/cashback caches (matches legacy)
  useEffect(() => {
    const token = localStorage.getItem('token')
    const tokenExpire = localStorage.getItem('token_expire_at')
    if (token) {
      getUserInfo()
        .then((resp: any) => {
          if (resp.data.data) {
            const data: IUserInfo = {
              access_Token: { token, expire_at: tokenExpire || '' },
              player: resp.data.data,
            }
            dispatch(changeUserInfo(data))
          }
        })
        .catch(() => {})
    }
    queryClient.invalidateQueries({ queryKey: ['cashback'] })
    queryClient.invalidateQueries({ queryKey: ['rakeback'] })
  }, [])

  const refetchDepositBonuses = () => {
    queryClient.invalidateQueries({ queryKey: ['bonuses-page', 'deposit-bonuses'] })
  }

  const claimBonus = async (bonusId: number) => {
    const res: any = await claimBmBonusById(bonusId)
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ['active-bm-bonus'] })
      queryClient.invalidateQueries({ queryKey: ['bonuses-page', 'claimable'] })
      queryClient.invalidateQueries({ queryKey: ['bonuses-page', 'queued'] })
    }
    return res
  }

  const onBonusClaimed = () => {
    queryClient.invalidateQueries({ queryKey: ['active-bm-bonus'] })
    queryClient.invalidateQueries({ queryKey: ['bonuses-page', 'claimable'] })
  }

  return {
    queuedBonuses,
    claimableBonuses,
    freespinBonuses,
    playerBonuses,
    availableDepositBonuses,
    refetchDepositBonuses,
    claimBonus,
    onBonusClaimed,
  }
}
