import instance from '../axios'

export const changeWallet = (walletId: number) => {
  return instance.post('/players/wallet/change', { wallet_id: walletId })
}
