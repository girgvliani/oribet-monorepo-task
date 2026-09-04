import { createOrder, getChangellyCurrencies, getChangellyOffers } from '@oribet/core/api/services/Account.api'
import BuyCrypto from '../BuyCrypto'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IChangellyCurrency, IPaymentOffers } from '@oribet/core/types/common.type'
import { IWallet } from '@oribet/core/types/Wallet.type'

interface BuyCryptoContainerProps {
  hideHeader?: boolean
}

const getLimits = (currency: IChangellyCurrency | null) => {
  if (!currency) return { min: null, max: null }

  let globalMin: number | null = null
  let globalMax: number | null = null

  for (const provider of currency.providers) {
    const limits = provider.limits
    if (!limits || Array.isArray(limits)) continue

    const send = limits.send
    if (send && !Array.isArray(send)) {
      if (globalMin === null || send.min < globalMin) globalMin = send.min
      if (globalMax === null || send.max > globalMax) globalMax = send.max
    }
  }

  return { min: globalMin, max: globalMax }
}

const BuyCryptoContainer = ({ hideHeader }: BuyCryptoContainerProps) => {
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const allWallets: IWallet[] = playerInfo?.player?.wallets ?? []
  const cryptoWallets = useMemo(() => allWallets.filter(w => w.is_crypto), [allWallets])
  const [selectedWallet, setSelectedWallet] = useState<IWallet | null>(null)

  useEffect(() => {
    if (cryptoWallets.length === 1) {
      setSelectedWallet(cryptoWallets[0])
    }
  }, [cryptoWallets])

  const [currencies, setCurrencies] = useState<IChangellyCurrency[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<IChangellyCurrency | null>(null)
  const [loadingCurrencies, setLoadingCurrencies] = useState(false)
  const [amount, setAmount] = useState<number | null>(null)
  const [offers, setOffers] = useState<IPaymentOffers[] | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<IPaymentOffers | null>(null)
  const [loadingOffers, setLoadingOffers] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  useEffect(() => {
    setLoadingCurrencies(true)
    getChangellyCurrencies()
      .then((resp: any) => {
        const data: IChangellyCurrency[] = resp.data || []
        setCurrencies(data)
      })
      .catch(() => {})
      .finally(() => setLoadingCurrencies(false))
  }, [])

  const limits = useMemo(() => getLimits(selectedCurrency), [selectedCurrency])

  const handleCurrencyChange = useCallback((currency: IChangellyCurrency | null) => {
    setSelectedCurrency(currency)
    setAmount(null)
    setOffers(null)
    setSelectedOffer(null)
  }, [])

  const handleAmountChange = useCallback((value: number) => {
    setAmount(value)
    setSelectedOffer(null)
    setOffers(null)
  }, [])

  const handleGetOffers = useCallback(() => {
    if (!selectedCurrency || !amount || amount <= 0) return

    setLoadingOffers(true)
    getChangellyOffers({
      amountFrom: String(amount),
      currencyFrom: selectedCurrency.ticker,
    })
      .then((resp: any) => {
        const data = resp.data?.data || resp.data || []
        setOffers(data.filter((o: any) => !o.errorMessage))
      })
      .catch(() => {
        setOffers(null)
      })
      .finally(() => setLoadingOffers(false))
  }, [selectedCurrency, amount])

  const handleConfirm = useCallback(() => {
    if (!selectedOffer || !amount || !selectedCurrency) return

    setConfirmLoading(true)
    createOrder({
      providerCode: selectedOffer.providerCode,
      amountFrom: String(amount),
      currencyFrom: selectedCurrency.ticker,
    })
      .then((resp: any) => {
        const redirectUrl = resp.data?.data?.redirectUrl || resp.data?.redirectUrl
        if (redirectUrl) {
          window.open(redirectUrl, '_blank')
        } else {
          enqueueSnackbar(t('wallet.orderCreated'), { variant: 'success' })
        }
      })
      .catch(() => {
        enqueueSnackbar(t('wallet.orderFailed'), { variant: 'error' })
      })
      .finally(() => setConfirmLoading(false))
  }, [selectedOffer, amount, selectedCurrency, enqueueSnackbar, t])

  return (
    <BuyCrypto
      cryptoWallets={cryptoWallets}
      selectedWallet={selectedWallet}
      setSelectedWallet={setSelectedWallet}
      currencies={currencies}
      selectedCurrency={selectedCurrency}
      onCurrencyChange={handleCurrencyChange}
      loadingCurrencies={loadingCurrencies}
      amount={amount}
      setAmount={handleAmountChange}
      onGetOffers={handleGetOffers}
      loadingOffers={loadingOffers}
      offers={offers}
      selectedOffer={selectedOffer}
      setSelectedOffer={setSelectedOffer}
      onConfirm={handleConfirm}
      confirmLoading={confirmLoading}
      limits={limits}
      hideHeader={hideHeader}
    />
  )
}

export default BuyCryptoContainer
