import { CustomInput, CustomPrimaryButton, CustomSelect, fontSize } from '@oribet/ui'
import { depositAgentPay } from '@oribet/core/api/services/Omno.api'
import { extractApiError } from '@oribet/core/util/extractApiError'
import { IWallet } from '@oribet/core/types/Wallet.type'
import { enqueueSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'

interface AgentPayDepositProps {
  wallets: IWallet[]
  onSuccess: () => void
}

const AgentPayDeposit: FC<AgentPayDepositProps> = ({ wallets, onSuccess }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const [walletId, setWalletId] = useState<number | ''>(wallets[0]?.id ?? '')
  const [loading, setLoading] = useState(false)
  const [cashierUrl, setCashierUrl] = useState<string | null>(null)

  useEffect(() => {
    if (walletId === '' && wallets[0]) setWalletId(wallets[0].id)
  }, [wallets, walletId])

  const selectedWallet = wallets.find(w => w.id === walletId)
  const currency = selectedWallet?.currency ?? ''
  const disabled = !selectedWallet || loading

  const handleSubmit = () => {
    if (!selectedWallet) return
    setLoading(true)
    depositAgentPay({
      wallet_id: selectedWallet.id,
      currency: selectedWallet.currency,
      amount: 0,
    })
      .then(resp => {
        const body = resp?.data
        if (body?.success === false) {
          const message = body?.data?.message || body?.message || t('common.error')
          enqueueSnackbar(message, { variant: 'error' })
          return
        }
        const url: string | undefined = body?.data?.url ?? body?.url
        if (url) {
          setCashierUrl(url)
          return
        }
        enqueueSnackbar(t('account.depositSuccess', { defaultValue: 'Deposit submitted' }), {
          variant: 'success',
        })
        onSuccess()
      })
      .catch(err => {
        enqueueSnackbar(extractApiError(err), { variant: 'error' })
      })
      .finally(() => setLoading(false))
  }

  if (cashierUrl) {
    return (
      <CashierFrame
        src={cashierUrl}
        title="AgentPay Cashier"
        allow="payment *; clipboard-write *"
      />
    )
  }

  return (
    <Root>
      <Field>
        <CustomSelect
          testId={DEPOSIT_TEST_IDS.agentPay.wallet}
          label={t('account.selectWallet')}
          value={String(walletId)}
          onChange={event => setWalletId(Number(event.target.value))}
          data={wallets.map(wallet => ({
            value: String(wallet.id),
            renderer: () => (
              <span style={{ color: theme.colors.text.secondary }}>
                {wallet.currency} — {Number(wallet.balance).toFixed(2)}
              </span>
            ),
          }))}
        />
      </Field>

      <Field>
        <CustomInput
          testId={DEPOSIT_TEST_IDS.agentPay.currency}
          label={t('wallet.currency')}
          value={currency}
          onChange={() => {}}
          disabled
        />
      </Field>

      <CustomPrimaryButton
        testId={DEPOSIT_TEST_IDS.agentPay.submit}
        style={{ width: '100%' }}
        onClick={handleSubmit}
        disabled={disabled}
        loading={loading}
      >
        {t('account.deposit')}
      </CustomPrimaryButton>
    </Root>
  )
}

export default AgentPayDeposit

const Root = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Field = styled.div`
  font-size: ${fontSize.sm};
`

const CashierFrame = styled.iframe`
  width: 100%;
  flex: 1;
  min-height: 500px;
  border: none;
`
