import type { IGameSchema } from './Game.type'

export interface IPrize {
  id: number
  name: string
  type: string
  amount: string
  value_sys: string
}

export interface IPlacePrize {
  id: number
  leaderboard_id: number
  place: number
  leaderboard_prize_id: number
  prize: IPrize
}

export interface IWinner {
  place: number
  player_id: number
  username: string
  wagered_amount: string
  prize: string
  prize_type: string
}

export interface ICurrentPlayerPosition {
  player_id: number
  username: string
  position: number
  wagered_amount: string
}

export interface ILeaderBoardInfo {
  id: number
  leaderboard_id: number
  name: string
  sub_name: string
  sub_sub_name: string
  post: string
  lang: string
  modify_uid: number
  create_dt: string
  update_dt: string
}

export interface ILeaderboard {
  id: number
  name?: string
  slug: string
  start_date: string
  end_date: string
  /** Minimum bet to qualify. */
  min?: string
  min_rank: number
  min_wager?: number
  prize_place: number
  /** Game/provider/category filters — null (no restriction) or a JSON id-list string. */
  excluded_categories?: string | number[] | null
  excluded_providers?: string | number[] | null
  excluded_games?: string | number[] | null
  included_games?: string | number[] | null
  /** Resolved game objects when `included_games` is set (the eligible games). */
  included_games_data?: IGameSchema[]
  is_active: number
  is_finished: number
  place_prizes?: IPlacePrize[]
  winners?: IWinner[]
  current_player_position?: ICurrentPlayerPosition
  leaderboardinfos?: ILeaderBoardInfo
  sub_name: string
  /** Banner image — plain URL or a per-language map (`{ en, ko, ... }`). */
  image: string | Record<string, string> | null
}
