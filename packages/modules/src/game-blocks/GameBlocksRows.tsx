import { getGameBlocks } from '@oribet/core/api/services/Game.api'
import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { getLocalizedString } from '@oribet/core/util/appUtil'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import type { IGameBlock } from '@oribet/core/types/Game.type'
import GameSwiper from '../game-swiper/GameSwiper'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'

export type GameBlockSurface = 'lobby' | 'casino' | 'game'

interface GameBlocksRowsProps {
  surface: GameBlockSurface
  /** Vertical gap between block rows. Defaults to 24px. */
  gap?: number
  /** Block slugs to skip (e.g. blocks rendered separately elsewhere on the page). */
  excludeSlugs?: string[]
}

const surfaceFlag: Record<GameBlockSurface, keyof IGameBlock> = {
  lobby: 'show_in_lobby',
  casino: 'show_in_casino',
  game: 'show_in_game',
}

/**
 * Fetches `/game-blocks` once (shared queryKey across surfaces) and renders the
 * blocks whose `show_in_<surface>` flag is true, ordered by `position`. Each
 * block is a full-width GameSwiper row.
 */
const GameBlocksRows = ({ surface, gap = 24, excludeSlugs }: GameBlocksRowsProps) => {
  const { data: blocks = [], isLoading } = useQuery<IGameBlock[]>({
    queryKey: ['game-blocks'],
    queryFn: async () => {
      const resp = await getGameBlocks()
      return resp.data?.data ?? []
    },
    staleTime: 60_000,
  })

  const flag = surfaceFlag[surface]
  const excluded = new Set(excludeSlugs)
  const filtered = blocks.filter(b => b[flag] && !excluded.has(b.slug))
  if (!isLoading && filtered.length === 0) return null

  const sorted = [...filtered].sort((a, b) => a.position - b.position)

  return (
    <Stack $gap={gap}>
      {sorted.map(block => (
        <GameSwiper
          key={block.id}
          swiperKey={block.slug}
          title={getLocalizedString(block.name)}
          icon={
            block.logo ? (
              <BlockLogo src={resolveImageUrl(block.logo)} alt={getLocalizedString(block.name)} />
            ) : null
          }
          seeAllLink={AppRoutePath.BLOCK(block.slug)}
          games={[...block.games].sort(
            (a, b) =>
              ((a as { position?: number }).position ?? 0) -
              ((b as { position?: number }).position ?? 0)
          )}
          loading={isLoading}
        />
      ))}
    </Stack>
  )
}

export default GameBlocksRows

const Stack = styled.div<{ $gap: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => `${$gap}px`};
  width: 100%;
`

const BlockLogo = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`
