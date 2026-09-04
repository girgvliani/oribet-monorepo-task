import { getNowPaymentsCurrencies } from '@oribet/core/api/services/Account.api'
import Deposit from '../Deposit'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { useEffect, useMemo, useState } from 'react'
import { INowPaymentsCurrency } from '@oribet/core/types/common.type'
import { IWallet } from '@oribet/core/types/Wallet.type'

interface DepositContainerProps {
  hideHeader?: boolean
  onClose?: () => void
}

const DepositContainer = ({ hideHeader, onClose }: DepositContainerProps) => {
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const allWallets: IWallet[] = playerInfo?.player?.wallets ?? []
  const cryptoWallets = useMemo(() => allWallets.filter(w => w.is_crypto), [allWallets])

  const [coins, setCoins] = useState<INowPaymentsCurrency[]>([])
  const [selectedCoin, setSelectedCoin] = useState<INowPaymentsCurrency | null>(null)
  const [selectedWallet, setSelectedWallet] = useState<IWallet | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cryptoWallets.length === 1) {
      setSelectedWallet(cryptoWallets[0])
    }
  }, [cryptoWallets])

  useEffect(() => {
    setLoading(true)
    getNowPaymentsCurrencies()
      .then((resp: any) => {
        const data: INowPaymentsCurrency[] = resp.data || []
        setCoins(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Deposit
      coins={coins}
      selectedCoin={selectedCoin}
      setSelectedCoin={setSelectedCoin}
      cryptoWallets={cryptoWallets}
      selectedWallet={selectedWallet}
      setSelectedWallet={setSelectedWallet}
      loading={loading}
      hideHeader={hideHeader}
      onClose={onClose}
    />
  )
}

export default DepositContainer
