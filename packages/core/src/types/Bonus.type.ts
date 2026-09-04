export interface IRakeBackOrCashBack {
  create_dt: string
  excluded_categories: any
  excluded_providers: any
  finish_at: string
  id: number
  is_claimed: boolean
  max: string
  min: string
  modify_uid: number
  name: string
  percent: string
  player_id: number
  rakeback_id: number
  slug: string
  started_at: string
  update_dt: string
  wagered_amount: string
  available?: boolean
  claimable_amount?: number
  isInActiveState?: boolean
}

export interface IBonusClaimStatus {
  success: boolean
  open: boolean
  claimedAmount?: string
  bonusType?: 'rakeback' | 'cashback'
}

export interface IBonusWheelWinPrize {
  id: number
  name: string
  image: string | null
  type: string
  amount: string
}

export interface IFreespinBonusGame {
  id: number
  bonus_id: number
  game_id: number
  provider_id: number
  is_all: boolean
  modify_uid: number
  create_dt: string
  update_dt: string
  game: {
    id: number
    game_id: string
    game_title: string
    slug: string
    parent_provider: string
    provider: string
    provider_id: number
    category_id: number
    is_active: boolean
    show: boolean
    image: string | null
    is_mobile: boolean
    is_desktop: boolean
    has_freespins: boolean
    has_demo: boolean
  }
}

export interface IFreespinBonus {
  id: number
  player_id: number
  bonus_id: number
  expire_at: string
  type: string
  amount: number
  init_amount: number
  wager_amount: number
  wagered_amount: number
  is_wagered: boolean
  is_transfered: boolean
  is_active: boolean
  take_on: string
  canceled_by_player: boolean
  max_bet: string
  min_bet: string
  split_claimed: number
  split_wagered: number
  split_number: number
  denomination: string | null
  create_dt: string
  update_dt: string
  currency: string
  wallet_id: number
  in_process: boolean
  freespin_type: string
  player_currency: string
  curr_fs_data: {
    amount: string
    BetLevel: string
  } | null
  parent_provider: string
  fs_wager_win: boolean
  bonus: {
    id: number
    name: string
    type: string
    is_percent: boolean
    wagering_coefficient: number | null
    expire_in: number
    is_active: boolean
    win_with_wager: boolean
    take_on: string
    split_number: number
    freespin_type: string
    parent_provider: string
    fs_wager_win: boolean
    bonus_games: IFreespinBonusGame[]
  }
}

export interface IWeeklySpinsResponse {
  data: {
    weekly_spins: number
  }
  success: boolean
}
