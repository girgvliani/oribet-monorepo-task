export type GameCardAspectRatio = '3:4' | '1:1' | '4:3'

export const GAME_CARD_ASPECT_RATIOS: Record<GameCardAspectRatio, string> = {
  '3:4': '3 / 4',
  '1:1': '1 / 1',
  '4:3': '4 / 3',
}

export const DEFAULT_GAME_CARD_ASPECT_RATIO: GameCardAspectRatio = '3:4'
