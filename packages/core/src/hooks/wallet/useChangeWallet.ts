import { changeWallet } from '../../api/services/Wallet.api'
import { useAppDispatch } from '../../redux/hooks'
import { changeDefaultWallet } from '../../redux/slices/userSlice'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const useChangeWallet = (onSuccess?: () => void) => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (walletId: number) => changeWallet(walletId),
    onSuccess: (response) => {
      const newWallet = response.data.data
      dispatch(changeDefaultWallet(newWallet))
      queryClient.invalidateQueries({ queryKey: ['get-user-info'] })
      queryClient.invalidateQueries({ queryKey: ['active-bm-bonus'] })
      onSuccess?.()
    },
  })
}

export default useChangeWallet
