import { createCashierSession, CreateCashierSessionParams } from '../../api/services/Omno.api'
import { useMutation } from '@tanstack/react-query'

const useCreateOmnoCashierSession = () => {
  return useMutation({
    mutationFn: (params: CreateCashierSessionParams) => createCashierSession(params),
  })
}

export default useCreateOmnoCashierSession
