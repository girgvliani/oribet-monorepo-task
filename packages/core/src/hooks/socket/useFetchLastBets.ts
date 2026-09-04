import { getLastBets } from '../../api/services/User.api'
import { useQuery } from '@tanstack/react-query'
import { IBetsTableItem } from '../../types/common.type'

const useFetchLastBets = (isVisible: boolean) => {
  return useQuery<IBetsTableItem[]>({
    queryKey: ['last-bets'],
    queryFn: async () => {
      const response = await getLastBets()
      return response.data.data ?? response.data
    },
    // Only fetch/poll while the table is on screen — no fetch at all when hidden.
    enabled: isVisible,
    refetchInterval: isVisible ? 5000 : false,
  })
}

export default useFetchLastBets
