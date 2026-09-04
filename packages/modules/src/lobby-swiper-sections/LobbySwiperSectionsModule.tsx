import GameBlocksRows from '../game-blocks/GameBlocksRows'

interface LobbySwiperSectionsModuleProps {
  /** Vertical gap between block rows. Defaults to 24px. */
  gap?: number
}

/**
 * Lobby surface for game-blocks. Filters by `show_in_lobby`.
 */
const LobbySwiperSectionsModule = ({ gap = 24 }: LobbySwiperSectionsModuleProps) => (
  <GameBlocksRows surface="lobby" gap={gap} />
)

export default LobbySwiperSectionsModule
