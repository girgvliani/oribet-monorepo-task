export interface IPlayBonusMoney {
  id: number
  player_id: string
  bonus_id: string
  expire_at: string
  type: 'play_bonus_money'
  amount: string
  init_amount: string
  wager_amount: string
  wagered_amount: string
  is_wagered: boolean
  is_transfered: boolean
  is_active: boolean
  take_on: string
  canceled_by_player: boolean
  max_bet: string
  min_bet: string
  exclude_games: string[] | null
  exclude_providers: string[] | null
  exclude_categories: string[] | null
  ip: string | null
  split_number: number
  split_wagered: number
  split_claimed: number
  max_amount?: string
  total_bet_id: string | null
  bet_id: string | null
  denomination: string | null
  modify_uid: string
  delete_dt: string | null
  create_dt: string
  update_dt: string
  promo_code: string | null
  activate_rule: string | null
  buy_bonus_amount: string
  can_claim: boolean
  wagering_coefficient?: string
  currency?: string
}
