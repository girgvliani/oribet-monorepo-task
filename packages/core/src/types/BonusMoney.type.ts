export interface IBMCurrencyConfig {
  amount: string
  max_bet: string
  min_bet: string
  min_deposit: string
  buy_bonus_amount: string
}

export interface IBMBonusMoney {
  id: number
  name: string
  type: 'play_bonus_money' | 'free_spin'
  is_percent: boolean
  wagering_coefficient: string
  bm_max_claim_x: number
  expire_in: number
  is_active: boolean
  win_with_wager: boolean
  take_on: string
  desc: string
  exclude_games: string[] | null
  exclude_providers: string[] | null
  exclude_categories: string[] | null
  camping_expire_date: string | null
  camping_expire_days: number
  split_number: number
  total_bet_id: string | null
  bet_id: string | null
  denomination: string | null
  modify_uid: number
  delete_dt: string | null
  create_dt: string
  update_dt: string
  promo_code: string | null
  activate_rule: string
  bonus_games: any[]
  img: string
  currency_config: Record<string, IBMCurrencyConfig> | null
}

/** IBMBonusMoney with currency-specific values resolved to top level */
export interface IBMBonusMoneyResolved extends IBMBonusMoney {
  amount: string
  max_bet: string
  min_bet: string
  min_deposit: string
  buy_bonus_amount: string
}
