import { useQuery } from '@tanstack/react-query'
import { getGameBlocks } from '../../api/services/Game.api'
import type { IGameBlock } from '../../types/Game.type'

/**
 * Fetches `/game-blocks` once (shared `['game-blocks']` queryKey — same cache as GameBlocksRows).
 * Returns the raw blocks; callers filter by `show_in_<surface>` / slug as needed.
 */
export const useGameBlocks = () => {
  const { data: blocks = [], isLoading } = useQuery<IGameBlock[]>({
    queryKey: ['game-blocks'],
    queryFn: async () => {
      const resp = await getGameBlocks()
      return resp.data?.data ?? []
    },
    staleTime: 60_000,
  })

  return { blocks, loading: isLoading }
}

/** Games from a block sorted by their `position` (ascending). */
export const sortBlockGamesByPosition = (block?: IGameBlock) =>
  [...(block?.games ?? [])].sort(
    (a, b) =>
      ((a as { position?: number }).position ?? 0) - ((b as { position?: number }).position ?? 0)
  )

export default useGameBlocks
