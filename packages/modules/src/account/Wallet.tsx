import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { IconWallet } from '@oribet/assets/icons/IconWallet'
import { CustomPrimaryButton, CustomSecondaryButton, fontSize } from '@oribet/ui'
import { DEPOSIT_TEST_IDS, TRANSACTIONS_TEST_IDS } from '@oribet/test-ids'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Wallet = () => {
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const systemSettings = useAppSelector(state => state.settings.systemSettings)
  const hasCryptoWallet = systemSettings?.multi_currency?.has_crypto_wallet
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Root>
      <Header>
        <IconWallet size={20} />
        <span>{t('account.accountInfo')}</span>
      </Header>

      <Divider />

      <Body>
        <BalanceInfo>
          <div style={{ width: 24, height: 24 }} />
          <BalanceText>
            {getActiveCurrencySymbol()}
            {Number(playerInfo.player.balance).toFixed(2)}
          </BalanceText>
        </BalanceInfo>

        <Actions>
          <CustomPrimaryButton
            style={{ textTransform: 'uppercase' }}
            testId={`${DEPOSIT_TEST_IDS.open}.wallet-page`}
            onClick={() => navigate(AppRoutePath.DEPOSIT())}
          >
            {t('account.deposit')}
          </CustomPrimaryButton>

          <CustomSecondaryButton
            style={{ textTransform: 'uppercase' }}
            testId={TRANSACTIONS_TEST_IDS.withdraw.crypto.open}
            onClick={() => navigate(AppRoutePath.WITHDRAWCRYPTO())}
          >
            {t('account.withdrawCrypto')}
          </CustomSecondaryButton>

          {hasCryptoWallet && (
            <CustomSecondaryButton
              style={{ textTransform: 'uppercase' }}
              testId={`${DEPOSIT_TEST_IDS.open}.wallet-page-buy-crypto`}
              onClick={() => navigate(AppRoutePath.BUYCRYPTO())}
            >
              {t('account.buyCrypto')}
            </CustomSecondaryButton>
          )}
        </Actions>
      </Body>
    </Root>
  )
}

export default Wallet

const Root = styled.div`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.secondary};
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`

const Header = styled.div`
  margin: 16px 0;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  gap: 8px;

  & path {
    fill: ${({ theme }) => theme.colors.text.primary};
  }

  & span {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
    font-size: ${fontSize.lg};
    line-height: 24px;
  }
`

const Divider = styled.div`
  background: #ffffff0d;
  width: 100%;
  height: 1px;
`

const Body = styled.div`
  margin: 16px;
  background: ${({ theme }) => theme.colors.bg.primary};
  height: 72px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
`

const BalanceInfo = styled.div`
  display: flex;
  align-items: center;
`

const BalanceText = styled.span`
  font-size: ${fontSize['2xl']};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  line-height: 24px;
  margin-left: 8px;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`
