import {
  getNowPaymentsCurrencies,
  getNowPaymentsPayoutMinAmount,
  validateNowPaymentsPayoutAddress,
  getNowPaymentsPayoutFee,
  createNowPaymentsPayout,
} from '@oribet/core/api/services/Account.api'
import WithdrawCrypto from '../WithdrawCrypto'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { extractApiError } from '@oribet/core/util/extractApiError'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { INowPaymentsCurrency } from '@oribet/core/types/common.type'
import { IWallet } from '@oribet/core/types/Wallet.type'

type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid'

const WithdrawCryptoContainer = () => {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const allWallets: IWallet[] = playerInfo?.player?.wallets ?? []
  const cryptoWallets = useMemo(() => allWallets.filter(w => w.is_crypto), [allWallets])

  const [coins, setCoins] = useState<INowPaymentsCurrency[]>([])
  const [selectedCoin, setSelectedCoin] = useState<INowPaymentsCurrency | null>(null)
  const [selectedWallet, setSelectedWallet] = useState<IWallet | null>(null)
  const [coinsLoading, setCoinsLoading] = useState(false)

  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [extraId, setExtraId] = useState('')

  const [minAmount, setMinAmount] = useState<number | null>(null)
  const [minAmountLoading, setMinAmountLoading] = useState(false)

  const [validationState, setValidationState] = useState<ValidationState>('idle')
  const [validationError, setValidationError] = useState<string | null>(null)

  const [fee, setFee] = useState<{ currency: string; fee: number } | null>(null)
  const [feeLoading, setFeeLoading] = useState(false)
  const [feeError, setFeeError] = useState<string | null>(null)

  const [confirmLoading, setConfirmLoading] = useState(false)
  const [lastValidated, setLastValidated] = useState<{ address: string; amount: string } | null>(
    null
  )

  useEffect(() => {
    if (cryptoWallets.length === 1) {
      setSelectedWallet(cryptoWallets[0])
    }
  }, [cryptoWallets])

  useEffect(() => {
    setCoinsLoading(true)
    getNowPaymentsCurrencies()
      .then((resp: any) => {
        const data: INowPaymentsCurrency[] = resp.data || []
        setCoins(data.filter(c => c.available_for_payout))
      })
      .catch(() => {})
      .finally(() => setCoinsLoading(false))
  }, [])

  const resetAll = () => {
    setAddress('')
    setAmount('')
    setExtraId('')
    setMinAmount(null)
    setMinAmountLoading(false)
    setValidationState('idle')
    setValidationError(null)
    setFee(null)
    setFeeLoading(false)
    setFeeError(null)
    setLastValidated(null)
  }

  const handleCoinChange = (code: string) => {
    const found = coins.find(c => c.code === code)
    if (found) {
      setSelectedCoin(found)
      resetAll()

      setMinAmountLoading(true)
      getNowPaymentsPayoutMinAmount(found.code)
        .then((resp: any) => {
          if (resp.success && resp.data?.result != null) {
            setMinAmount(resp.data.result)
          }
        })
        .catch(() => {})
        .finally(() => setMinAmountLoading(false))
    }
  }

  const handleWalletChange = (value: string) => {
    const found = cryptoWallets.find(w => w.id === Number(value))
    if (found) setSelectedWallet(found)
  }

  const handleValidate = async () => {
    if (!selectedCoin || !address || !amount || Number(amount) <= 0) return

    setValidationState('validating')
    setValidationError(null)
    setFee(null)
    setFeeError(null)

    try {
      const resp = await validateNowPaymentsPayoutAddress({
        address,
        currency: selectedCoin.code,
        extra_id: extraId || null,
      })

      if (!resp.data?.valid) {
        setValidationState('invalid')
        setValidationError(t('withdrawCrypto.invalidAddress'))
        return
      }

      setValidationState('valid')
      setFeeLoading(true)

      try {
        const feeResp = await getNowPaymentsPayoutFee({
          currency: selectedCoin.code,
          amount: Number(amount),
        })

        if (feeResp.success && feeResp.data) {
          setFee(feeResp.data)
          setLastValidated({ address, amount })
        }
      } catch (feeErr) {
        setFeeError(t('withdrawCrypto.feeError'))
      } finally {
        setFeeLoading(false)
      }
    } catch (err) {
      setValidationState('idle')
      enqueueSnackbar(extractApiError(err), { variant: 'error' })
    }
  }

  const handleConfirm = async () => {
    if (!selectedCoin || !selectedWallet || !amount || !address) return

    setConfirmLoading(true)

    try {
      const resp = await createNowPaymentsPayout({
        currency: selectedCoin.code,
        amount: Number(amount),
        address,
        wallet_id: selectedWallet.id,
        extra_id: extraId || null,
      })

      if (resp.success) {
        enqueueSnackbar(t('withdrawCrypto.withdrawSuccess'), { variant: 'success' })
        navigate(`${AppRoutePath.TRANSACTIONS()}?tab=withdrawal`)
      } else {
        enqueueSnackbar(resp.data?.message || extractApiError(resp), { variant: 'error' })
      }
    } catch (err) {
      enqueueSnackbar(extractApiError(err), { variant: 'error' })
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <WithdrawCrypto
      coins={coins}
      selectedCoin={selectedCoin}
      onCoinChange={handleCoinChange}
      cryptoWallets={cryptoWallets}
      selectedWallet={selectedWallet}
      onWalletChange={handleWalletChange}
      coinsLoading={coinsLoading}
      address={address}
      setAddress={setAddress}
      amount={amount}
      setAmount={setAmount}
      extraId={extraId}
      setExtraId={setExtraId}
      minAmount={minAmount}
      minAmountLoading={minAmountLoading}
      validationState={validationState}
      validationError={validationError}
      fee={fee}
      feeLoading={feeLoading}
      feeError={feeError}
      confirmLoading={confirmLoading}
      lastValidated={lastValidated}
      onValidate={handleValidate}
      onConfirm={handleConfirm}
    />
  )
}

export default WithdrawCryptoContainer
