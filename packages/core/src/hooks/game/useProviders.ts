import { getProviders } from '../../api/services/Game.api'
import { useAppDispatch } from '../../redux/hooks'
import { changeProviders } from '../../redux/slices/gameSlice'
import { useQuery } from '@tanstack/react-query'

/**
 * Fetches game providers via React Query with automatic Redux sync.
 * Replaces the manual .then()/.catch() pattern in ApplicationContainer.
 */
const useProviders = () => {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const resp = await getProviders()
      if (resp.data.data) {
        dispatch(changeProviders(resp.data.data))
      }
      return resp.data.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export default useProviders
