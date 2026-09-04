import { calculateFee, withdraw } from '@oribet/core/api/services/Account.api'
import Withdraw from '../Withdraw'
import useWalletCurrencyNetwork from '@oribet/core/hooks/wallet/useWalletCurrencyNetwork'
import { extractApiError } from '@oribet/core/util/extractApiError'
import { debounce } from 'lodash'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'

const WithdrawContainer = () => {
  const { enqueueSnackbar } = useSnackbar()
  const {
    currencies,
    networks,
    selectedCurrency,
    selectedNetwork,
    setSelectedCurrency,
    setSelectedNetwork,
    getFilteredNetworks,
    getCoinId,
  } = useWalletCurrencyNetwork()

  const [address, setAddress] = useState<string | null>(null)
  const [amount, setAmount] = useState<string | null>('')
  const [feeLoading, setFeeLoading] = useState<boolean>(false)
  const [memo, setMemo] = useState<string | null>(null)
  const [fee, setFee] = useState<{
    total_withdraw_amount: string
    withdraw_amount: string
    fee: string
  } | null>(null)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const debouncedGetFeeResult = useCallback(
    debounce(() => {
      if (selectedCurrency && selectedNetwork && address && amount) {
        getFeeResult()
      } else {
        setFee(null)
      }
    }, 500),
    [selectedCurrency, selectedNetwork, address, amount]
  )

  useEffect(() => {
    debouncedGetFeeResult()

    return () => {
      debouncedGetFeeResult.cancel()
    }
  }, [selectedCurrency, selectedNetwork, amount])

  const getFeeResult = () => {
    if (selectedCurrency && selectedNetwork) {
      const id = getCoinId(selectedCurrency, selectedNetwork)

      if (id) {
        setFeeLoading(true)
        calculateFee({
          coin_id: id,
          amount: amount,
        })
          .then((reps: any) => {
            if (reps.data.data) {
              setFee({
                fee: reps.data.data.fee,
                withdraw_amount: reps.data.data.withdraw_amount,
                total_withdraw_amount: reps.data.data.total_withdraw_amount,
              })
            }
          })
          .catch((error: any) => {
            enqueueSnackbar(extractApiError(error), {
              variant: 'error',
            })
          })
          .finally(() => {
            setFeeLoading(false)
          })
      }
    }
  }

  const onConfirm = () => {
    setConfirmLoading(true)

    if (selectedCurrency && selectedNetwork) {
      const id = getCoinId(selectedCurrency, selectedNetwork)

      const result: any = {
        amount: Number(amount),
        address: address,
        coin_id: id,
      }

      if (memo) {
        result['tag'] = memo
      }

      withdraw(result)
        .then((resp: any) => {
          if (resp.data.data.message) {
            enqueueSnackbar(resp.data.data.message, {
              variant: 'success',
            })
            setAmount(null)
          }
        })
        .catch((error: any) => {
          enqueueSnackbar(extractApiError(error), {
            variant: 'error',
          })
        })
        .finally(() => {
          setConfirmLoading(false)
        })
    }
  }

  return (
    <Withdraw
      network={networks}
      selectedNetwork={selectedNetwork}
      currencies={currencies}
      selectedCurrency={selectedCurrency}
      getFilteredNetworks={getFilteredNetworks}
      setSelectedNetwork={setSelectedNetwork}
      setSelectedCurrency={setSelectedCurrency}
      address={address}
      setAddress={setAddress}
      amount={amount}
      setAmount={setAmount}
      fee={fee}
      feeLoading={feeLoading}
      memo={memo}
      setMemo={setMemo}
      confirmLoading={confirmLoading}
      onConfirm={onConfirm}
      getFeeResult={getFeeResult}
    />
  )
}

export default WithdrawContainer
