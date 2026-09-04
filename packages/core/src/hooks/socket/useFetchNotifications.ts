import { getNotifications } from '../../api/services/Notification.api'
import { useQuery } from '@tanstack/react-query'
import { getLocalStorageValue } from '../../util/appUtil'
import { INotification } from '../../types/common.type'

const useFetchNotifications = () => {
  const token = getLocalStorageValue('token', '')

  return useQuery<INotification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await getNotifications()
      return response.data.data?.notifications ?? response.data.data ?? response.data
    },
    enabled: !!token,
    staleTime: 60 * 1000,
    gcTime: 120 * 1000,
  })
}

export default useFetchNotifications
