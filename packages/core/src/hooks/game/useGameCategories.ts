import { getGameCategories } from '../../api/services/Game.api'
import { useAppDispatch } from '../../redux/hooks'
import { changeGameCategories } from '../../redux/slices/gameSlice'
import { useQuery } from '@tanstack/react-query'

/**
 * Fetches game categories via React Query with automatic Redux sync.
 * Replaces the manual .then()/.catch() pattern in ApplicationContainer.
 */
const useGameCategories = () => {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['game-categories'],
    queryFn: async () => {
      const resp = await getGameCategories()
      if (resp.data.data) {
        dispatch(changeGameCategories(resp.data.data))
      }
      return resp.data.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export default useGameCategories
