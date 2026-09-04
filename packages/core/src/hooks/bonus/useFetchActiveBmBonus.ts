import { getActiveBmBonus } from '../../api/services/BmBonus.api'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getLocalStorageValue } from '../../util/appUtil'
import { IPlayBonusMoney } from '../../types/BonusMode.type'

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
