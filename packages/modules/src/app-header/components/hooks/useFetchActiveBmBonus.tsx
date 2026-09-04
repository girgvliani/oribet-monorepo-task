import { getActiveBmBonus } from '@oribet/core/api/services/BmBonus.api'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getLocalStorageValue } from '@oribet/core/util/appUtil'
import { IPlayBonusMoney } from '@oribet/core/types/BonusMode.type'

interface ActiveBmBonusResponse {
  data: IPlayBonusMoney | null
  success: boolean
}

const useFetchActiveBmBonus = (shouldBeCalled?: boolean): UseQueryResult<ActiveBmBonusResponse> => {
  const token = getLocalStorageValue('token', '')

  return useQuery<ActiveBmBonusResponse>({
    queryKey: ['active-bm-bonus'],
    queryFn: getActiveBmBonus,
    gcTime: shouldBeCalled ? 0 : 100 * 1000,
    staleTime: shouldBeCalled ? 0 : 60 * 1000,
    enabled: !!token,
  })
}

export default useFetchActiveBmBonus
