import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { Spinner } from '@oribet/ui'

import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { IWallet } from '@oribet/core/types/Wallet.type'
import { fontSize } from '@oribet/ui'
import { DEPOSIT_TEST_IDS } from '@oribet/test-ids'

interface WalletSelectorProps {
  wallets: IWallet[]
  onSelect: (wallet: IWallet) => void
  isLoading: boolean
}

const WalletSelector: FC<WalletSelectorProps> = ({ wallets, onSelect, isLoading }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Root>
      <Title>{t('account.selectWallet')}</Title>
      <WalletList>
        {wallets.map(wallet => (
          <WalletCard
            key={wallet.id}
            $disabled={isLoading}
            onClick={() => !isLoading && onSelect(wallet)}
            data-testid={`${DEPOSIT_TEST_IDS.omno.walletOption}.${wallet.currency}`}
          >
            <CurrencyLabel>{wallet.currency}</CurrencyLabel>
            <Balance>
              {getActiveCurrencySymbol(wallet.currency)}
              {Number(wallet.balance).toFixed(2)}
            </Balance>
          </WalletCard>
        ))}
      </WalletList>
      {isLoading && (
        <LoadingOverlay>
          <Spinner color={theme.colors.accent.brand} />
        </LoadingOverlay>
      )}
    </Root>
  )
}

export default WalletSelector

const Root = styled.div`
  position: relative;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Title = styled.h3`
  margin: 0;
  font-size: ${fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const WalletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const WalletCard = styled.div<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  background: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  transition: background 0.2s;

  &:hover {
    background: ${({ $disabled, theme }) =>
      $disabled ? theme.colors.bg.primary : theme.colors.surface.hover};
  }
`

const CurrencyLabel = styled.span`
  font-size: ${fontSize.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Balance = styled.span`
  font-size: ${fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: auto;
`

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg.secondary}cc;
  border-radius: 8px;
`
