import type { Ref } from 'react'
import type { IWallet } from './Wallet.type'

export interface IAction {
  type: string
  payload: unknown
}

export interface IReactIcon {
  ref?: Ref<SVGSVGElement>
  size?: number
  width?: number | string
  height?: number
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
}

// TEMPORARY, REMOVE WHEN ICONS ARE REFACTORED
export interface ISvgIcon {
  size?: number
  className?: string
  pathClassName?: string
  ref?: Ref<SVGSVGElement>
  fill?: string
  color?: string
  width?: number
  height?: number
  style?: React.CSSProperties
}

export interface IOribetMenuItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>
  link: string
  text: string
  hidden?: boolean
  needAuth?: boolean
  isLiveSupport?: boolean
  isAffiliate?: boolean
}

export interface ILanguage {
  icon: React.FC | null
  label: string
  value: string
}

export interface IAuthorizationInfo {
  isLoginOpen: boolean
  isRegistrationOpen: boolean
}

export interface IErrorResponse {
  response: {
    data: {
      data: string
    }
  }
}

export interface ISuccessResponse<T = unknown> {
  data: {
    data: T
  }
}

export interface IUserInfo {
  access_Token: {
    expire_at: string
    token: string
  }
  player: {
    id: number
    username: string
    nickname: string | null
    first_name: string | null
    last_name: string | null
    gender: string | null
    land: string
    country: string | null
    register_country: string | null
    phone: string | null
    email: string
    address: string | null
    city: string | null
    postal_code: string | null
    birthday: Date | null
    password: string | null
    have_password: number
    real_balance: number
    balance: number
    total_bet: number
    total_win: number
    ggr: number
    total_deposit: number
    total_withdraw: number
    is_blocked: number
    is_added_inhouse: number
    email_verified: string | boolean
    email_verified_at: Date
    phone_verified: number
    address_verified: number
    had_first_deposit: number
    kyc_status: string
    kyc_reject_reason: string | null
    address_proof_status: string | null
    address_proof_reject_reason: string | null
    lang: string
    avatar: string | null
    wallet_address: string | null
    chat_blocked: number
    chat_blocked_till: number | null
    is_chat_admin: number
    last_login_dt: Date | null
    create_dt: Date
    update_dt: Date
    google_2fa_is_active: number
    google2fa_secret: string | null
    wager: number
    registration_ip: string | null
    last_login_ip: string | null
    remember_token: string | null
    deposit_count: number | string
    can_spin_after: string
    wheel_spins: number
    bonus_balance: string
    currency: string
    rank: {
      level: number
      progress: number
      rank: string
    }
    player_wagerable_fs_win: {
      id: number
      player_id: number
      amount: string
      player_currency: string
      modify_uid: number
      create_dt: string
      update_dt: string
    }
    default_wallet?: IWallet
    wallets?: IWallet[]
  }
}

export interface IWheelSpinsInfo {
  wheel_spins: number
  can_spin_after?: string
}

export interface IAccessToken {
  expire_at: string
  token: string
}

export interface ICurrency {
  name: string
  logo?: string
  networks_id: ICurrencyNetworksId[]
}

export interface ICurrencyNetworksId {
  coin_id: number
  coin_network_id: number
  min_amount: string
  min_amount_usd: string
}

export interface INowPaymentsCurrency {
  id: number
  code: string
  ticker: string
  name: string
  is_stable: boolean
  extra_id_exists: boolean
  logo_url: string
  available_for_payout: boolean
  available_for_payment: boolean
}

export interface INowPaymentsEstimate {
  estimated_amount: string
  currency_from: string
  currency_to: string
  min_amount: number
  fiat_equivalent: string | null
}

export interface INowPaymentsPayment {
  id: number
  url: string | null
  address: string
  qr_code: string
  payin_extra_id?: string | null
  tag?: string | null
}

export interface INetwork {
  create_dt: string
  id: number
  is_active: boolean
  modify_uid: number
  name: string
  slug: string
  update_dt: string
}

export interface IPaymentOffers {
  amountExpectedTo: string
  providerCode: string
}

export interface IChangellyCurrencyProvider {
  providerCode: string
  supportedFlows: string[]
  limits?:
    | {
        get?: { min: number; max: number } | []
        send?: { min: number; max: number } | []
      }
    | []
}

export interface IChangellyCurrency {
  type: string
  ticker: string
  name: string
  iconUrl: string
  iconColoredUrl: string
  precision: string
  providers: IChangellyCurrencyProvider[]
}

export type TransactionStatus =
  | 'init'
  | 'pending'
  | 'confirming'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'expired'
  | 'partially_paid'
  | 'partial_refunded'
  | 'chargebacked'

export interface ITransaction {
  id: number
  txid: string
  type: string
  address: string
  tag: string | null
  amount: number
  net_amount_wallet: number | null
  added_to_player: boolean
  provider: string
  currency: string
  currency_wallet: string
  /** Backend flag: the player may cancel this (still-pending) transaction. */
  cancelable?: boolean
  /** Backend transaction status; when absent, derive from `added_to_player`. */
  status?: TransactionStatus
  create_dt: string
  instructions_url?: string | null
}

export interface ITransactionMeta {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface ITransactionResponse {
  data: ITransaction[]
  meta: ITransactionMeta
}

/** Payload on event-carrying notifications (e.g. `transaction.instructions.received`). */
export interface INotificationPayload {
  provider?: string
  transaction_id?: number
  txid?: string
  instructions_url?: string
}

export interface INotification {
  id: number
  player_id: number | string
  group_id?: string
  type: string
  sid?: string | null
  text: string
  read_at?: string | null
  modify_uid?: number
  create_dt: string
  update_dt: string
  /** Backend event key (null for plain notifications). */
  event?: string | null
  /** Structured payload for event notifications (null when absent). */
  payload?: INotificationPayload | null
}

export interface IRankInfo {
  create_dt: string
  id: number
  max_level: number
  max_wager: number
  min_level: number
  min_wager: number
  name: string
  update_dt: string
}

export interface IBlog {
  category: string
  create_dt: string
  description: string
  id: number
  image: string
  is_active: boolean
  is_banner: boolean
  modify_uid: number
  post: string
  slug?: string
  title: string
  update_dt: string
  onSelectBlog?: () => void
}

export interface IBetsTableItem {
  bet: string
  category: string
  category_image: null
  create_dt: string
  game_id: string
  game_name: string
  slug?: string
  image?: string
  multiplier: number
  player_id: string
  player_name: string
  player_rank: {
    rank: string
    level: number
    progress: number
  }
  win: string
  currency: string
}

export interface ICountry {
  create_dt: string
  id: number
  is_active: number
  is_restricted: number
  iso: string
  modify_dt: string
  modify_uid: number
  name: string
  time_zone: string
  utc_offset: string
}

export interface IPersonalInfo {
  first_name: string
  last_name: string
  country: string
  gender: string
  birthday: string
  address: string
  city: string
  postal_code: string
}

export interface IBannerBlog {
  id: number
  title: string
  description: string
  lang: string
  image: string
  image_mob: string
  button_one_title: string | null
  button_one_url: string
  button_two_title: string | null
  button_two_url: string
  is_active: number
  type: string
  modify_uid: number
  create_dt: string
  update_dt: string
}

export interface IBonusWheel {
  id: number
  rank_group_id: number
  bonus_wheel_prize_id: number
  rank_group: {
    id: number
    name: string
  }
  bonus_wheel_prize: {
    id: number
    name: string
    image: string | null
    amount: string
  }
}

export interface IStaticPage {
  content: string
  create_dt: string
  id: number
  is_active: number
  lang: string
  modify_uid: number
  slug: string
  title: string
  update_dt: string
}
