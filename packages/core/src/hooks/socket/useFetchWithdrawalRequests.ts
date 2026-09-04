import { useQuery } from '@tanstack/react-query'
import { getWithdrawalRequests } from '../../api/services/Account.api'
import { getLocalStorageValue } from '../../util/appUtil'

export interface IWithdrawalRequest {
  id: number
  address?: string | null
  tag?: string | null
  player_id?: number
  amount?: string | number | null
  net_amount?: string | number | null
  status?: string | null
  create_dt?: string | null
  update_dt?: string | null
  player_currency?: string | null
  provider?: string | null
  currency?: string | null
  payout_currency?: string | null
  returned_to_player?: boolean
}

export interface IWithdrawalRequestsResponse {
  player_id?: number
  withdrawRequests?: IWithdrawalRequest[]
  [key: string]: unknown
}

const useFetchWithdrawalRequests = () => {
  const token = getLocalStorageValue('token', '')

  return useQuery<IWithdrawalRequestsResponse>({
    queryKey: ['transactions', 'withdraw-requests'],
    queryFn: async () => {
      const response = await getWithdrawalRequests()
      return response.data
    },
    enabled: !!token,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  })
}

export default useFetchWithdrawalRequests
