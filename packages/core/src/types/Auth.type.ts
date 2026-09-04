export interface ISignIn {
  email: string
  password: string
  fingerprint_request_id?: string
}

export interface ISignUp {
  email: string
  username: string
  password: string
  currency: string
  /** Optional display name (Korea sign-up). Defaults to username server-side when empty. */
  nickname?: string
  /** Verified phone in `+CC-number` format (Korea, when phone confirmation is required). */
  phone?: string
  /** 4-digit code from the phone verification step (sent alongside `phone`). */
  phone_confirm_code?: string
  affid?: string
  cxd?: string
  fingerprint_request_id?: string
}

export interface IMultiCurrencyResponse {
  multi_currency_status: boolean
  available_currencies: string[]
}

export interface IPassword {
  password: string
  password_confirmation: string
  token?: string | null
  email?: string | null
}
