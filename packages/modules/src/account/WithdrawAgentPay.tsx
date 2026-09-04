import { CustomPrimaryButton, CustomSelect, fontSize } from '@oribet/ui'
import { withdrawAgentPay } from '@oribet/core/api/services/Omno.api'
import { extractApiError } from '@oribet/core/util/extractApiError'
import { IWallet } from '@oribet/core/types/Wallet.type'
import { enqueueSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { TRANSACTIONS_TEST_IDS } from '@oribet/test-ids'

interface WithdrawAgentPayProps {
  wallets: IWallet[]
  onSuccess?: () => void
}

/**
 * AgentPay withdrawal — pick a wallet, POST /transactions/withdraw with
 * `{ wallet_id, provider: 'agentpay' }`, then open the returned `redirect_url`
 * (same as other redirect-based payment flows).
 */
const WithdrawAgentPay: FC<WithdrawAgentPayProps> = ({ wallets, onSuccess }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const [walletId, setWalletId] = useState<number | ''>(wallets[0]?.id ?? '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (walletId === '' && wallets[0]) setWalletId(wallets[0].id)
  }, [wallets, walletId])

  const selectedWallet = wallets.find(w => w.id === walletId)
  const disabled = !selectedWallet || loading

  const handleSubmit = () => {
    if (!selectedWallet) return
    setLoading(true)
    withdrawAgentPay({ wallet_id: selectedWallet.id })
      .then(resp => {
        const body = resp?.data
        if (body?.success === false) {
          enqueueSnackbar(body?.data?.message || body?.message || t('common.error'), {
            variant: 'error',
          })
          return
        }
        const redirectUrl: string | undefined =
          body?.data?.redirect_url ?? body?.redirect_url ?? body?.data?.url ?? body?.url
        if (redirectUrl) {
          window.open(redirectUrl, '_blank')
          onSuccess?.()
          return
        }
        enqueueSnackbar(t('common.error'), { variant: 'error' })
      })
      .catch(err => enqueueSnackbar(extractApiError(err), { variant: 'error' }))
      .finally(() => setLoading(false))
  }

  return (
    <Root>
      <Field>
        <CustomSelect
          testId={TRANSACTIONS_TEST_IDS.withdraw.agentpay.wallet}
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

      <CustomPrimaryButton
        testId={TRANSACTIONS_TEST_IDS.withdraw.agentpay.submit}
        style={{ width: '100%' }}
        onClick={handleSubmit}
        disabled={disabled}
        loading={loading}
      >
        {t('account.withdraw', { defaultValue: 'Withdraw' })}
      </CustomPrimaryButton>
    </Root>
  )
}

export default WithdrawAgentPay

const Root = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Field = styled.div`
  font-size: ${fontSize.sm};
`
