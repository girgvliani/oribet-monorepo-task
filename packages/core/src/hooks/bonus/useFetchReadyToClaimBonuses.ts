import { getReadyToClaimBonuses } from '../../api/services/BmBonus.api'
import { useQuery } from '@tanstack/react-query'
import { getLocalStorageValue } from '../../util/appUtil'

const useFetchReadyToClaimBonuses = (enabled?: boolean) => {
  const token = getLocalStorageValue('token', '')

  return useQuery({
    queryKey: ['ready-to-claim-bonuses'],
    queryFn: getReadyToClaimBonuses,
    staleTime: 30 * 1000,
    enabled: !!token && enabled !== false,
  })
}

export default useFetchReadyToClaimBonuses
