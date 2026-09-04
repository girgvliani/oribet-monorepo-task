import { getUserInfo } from '@oribet/core/api/services/User.api'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { IWallet } from '@oribet/core/types/Wallet.type'

interface UserInfoResponse {
  data: {
    data: {
      balance: number
      default_wallet?: IWallet
      wallets?: IWallet[]
    }
  }
}

const useFetchUserInfo = (enabled = true): UseQueryResult<UserInfoResponse> => {
  return useQuery<UserInfoResponse>({
    queryKey: ['get-user-info'],
    queryFn: getUserInfo,
    gcTime: 300 * 1000,
    staleTime: 120 * 1000,
    enabled,
  })
}

export default useFetchUserInfo
