export interface IWallet {
  id: number
  player_id: number
  currency: string
  balance: string
  bm_balance: string
  wager: string
  bm_wager: string
  is_active: boolean
  is_crypto: boolean
  is_default: boolean
  create_dt: string
  update_dt: string
}

export interface ISocketWallet {
  id: number
  balance: number
  bm_balance: number
  currency: string
  is_default: boolean
}

export interface IWalletBalanceUpdate {
  wallet: ISocketWallet
}

export interface IDefaultWalletChanged {
  wallets: ISocketWallet[]
}
