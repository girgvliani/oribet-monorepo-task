/** Per-currency limits on a bonus (values may arrive as strings or numbers). */
export interface CashierBonusCurrencyConfig {
  amount: string | number
  max_bet: string | number
  min_bet: string | number
  min_deposit: string | number
}

/** Bonus entry from the cashier session (`available_bonuses` / `chosen_bonuses`). */
export interface CashierBonus {
  id: number
  /** Localized name — string or `{ en, ko, … }`. */
  name: string | Record<string, string>
  /** Localized description — may contain HTML. */
  desc?: string | Record<string, string>
  type?: string
  wagering_coefficient?: number
  is_percent?: boolean
  currency_config?: Record<string, CashierBonusCurrencyConfig>
  [key: string]: unknown
}

/** Deposit currency delivered inline on the session (`available_currencies`). */
export interface AvailableCurrency {
  code: string
  name: string
  group_name: string
  /** URL string for crypto; `{}` for fiat. */
  logo: string | Record<string, never>
  type: string
  network_code: string | null
  network_name: string | null
  deposit_active: boolean
  withdrawal_active?: boolean
  /** Memo/tag networks (TON, XRP) need a destination tag alongside the address. */
  requires_tag?: boolean
  min_deposit: number | null
  max_deposit?: number | null
}

/** `data` payload from `/cashier/init` and `/cashier/session/update`. */
export interface CashierSession {
  /** Payment session uuid — sent as `payment_session_id` on updates. */
  uuid: string
  type: string
  status: string
  wallet: {
    id: number
    currency: string
    is_crypto: boolean
    is_default: boolean
    balance: number
  }
  currency_wallet: string
  currency: string | null
  provider: string | null
  address?: string | null
  tag?: string | null
  /** Enabled providers for this wallet — drives which deposit methods show. */
  providers: string[]
  chosen_bonuses: CashierBonus[]
  available_bonuses: CashierBonus[]
  /** Empty until a provider is locked onto the session. */
  available_currencies?: AvailableCurrency[]
  /** Minimum deposit for the locked currency, in that deposit currency. */
  min_deposit_amount?: number | string | null
  expires_at: string
}
