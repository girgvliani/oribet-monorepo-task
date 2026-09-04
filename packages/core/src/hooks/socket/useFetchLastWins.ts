import { getLastWins } from '../../api/services/User.api'
import { useQuery } from '@tanstack/react-query'
import { IBetsTableItem } from '../../types/common.type'

const useFetchLastWins = () => {
  return useQuery<IBetsTableItem[]>({
    queryKey: ['last-wins'],
    queryFn: async () => {
      const response = await getLastWins()
      return response.data.data ?? response.data
    },
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  })
}

export default useFetchLastWins
