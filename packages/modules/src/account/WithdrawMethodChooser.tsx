import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { TRANSACTIONS_TEST_IDS } from '@oribet/test-ids'

interface WithdrawMethodChooserProps {
  showCrypto?: boolean
  showAgentPay?: boolean
  onSelectCrypto: () => void
  onSelectAgentPay: () => void
}

/**
 * Withdraw-method chooser — mirrors the deposit MethodChooser. Lets the user pick
 * between crypto withdrawal and AgentPay withdrawal.
 */
const WithdrawMethodChooser: FC<WithdrawMethodChooserProps> = ({
  showCrypto = true,
  showAgentPay = true,
  onSelectCrypto,
  onSelectAgentPay,
}) => {
  const { t } = useTranslation()

  return (
    <Root>
      <Title>{t('account.chooseWithdrawMethod', { defaultValue: 'Choose withdraw method' })}</Title>
      <ButtonRow>
        {showCrypto && (
          <MethodCard onClick={onSelectCrypto} data-testid={TRANSACTIONS_TEST_IDS.withdraw.method.crypto}>
            <MethodLabel>{t('account.withdrawCrypto', { defaultValue: 'Withdraw Crypto' })}</MethodLabel>
          </MethodCard>
        )}
        {showAgentPay && (
          <MethodCard onClick={onSelectAgentPay} data-testid={TRANSACTIONS_TEST_IDS.withdraw.method.agentpay}>
            <MethodLabel>{t('account.withdrawAgentPay', { defaultValue: 'AgentPay' })}</MethodLabel>
          </MethodCard>
        )}
      </ButtonRow>
    </Root>
  )
}

export default WithdrawMethodChooser

const Root = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Title = styled.h3`
  margin: 0;
  font-size: ${fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`

const MethodCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.accent.brand};
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
  }
`

const MethodLabel = styled.span`
  font-size: ${fontSize.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent.brand};
`
