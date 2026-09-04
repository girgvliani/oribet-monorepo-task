import { getTransactions } from '../../api/services/Account.api'
import { useQuery } from '@tanstack/react-query'
import { getLocalStorageValue } from '../../util/appUtil'
import { ITransactionResponse } from '../../types/common.type'

const PER_PAGE = 6

const useFetchTransactions = (page: number, type?: string) => {
  const token = getLocalStorageValue('token', '')

  return useQuery<ITransactionResponse>({
    queryKey: ['transactions', page, type],
    queryFn: async () => {
      const params: { page: number; per_page: number; type?: string } = {
        page,
        per_page: PER_PAGE,
      }
      if (type) params.type = type
      const response = await getTransactions(params)
      return response.data.data ?? response.data
    },
    enabled: !!token,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  })
}

export default useFetchTransactions
