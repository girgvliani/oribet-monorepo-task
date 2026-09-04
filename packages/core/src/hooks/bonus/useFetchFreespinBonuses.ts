import { getFreespinBonuses } from '../../api/services/Bonus.api'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getLocalStorageValue } from '../../util/appUtil'
import { IFreespinBonus } from '../../types/Bonus.type'

const useFetchFreespinBonuses = (): UseQueryResult<IFreespinBonus[]> => {
  const token = getLocalStorageValue('token', '')

  return useQuery<IFreespinBonus[]>({
    queryKey: ['freespin-bonuses'],
    queryFn: getFreespinBonuses,
    gcTime: 300 * 1000,
    staleTime: 300 * 1000,
    enabled: !!token,
  })
}

export default useFetchFreespinBonuses
