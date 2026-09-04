// import OribetIcon from '@oribet/core/api/ui/svgIcons/NotificationIcons/OribetIcon'
import { IconOribetRounded } from '@oribet/assets/icons/IconOribetRounded'
import { IconChevronRight } from '@oribet/assets/icons/IconChevronRight'
import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { IconTransaction } from '@oribet/assets/icons/IconTransaction'
import { IconWithdraw } from '@oribet/assets/icons/IconWithdraw'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { SettingsKeys } from '@oribet/core/util/appUtil'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { DEPOSIT_TEST_IDS, TRANSACTIONS_TEST_IDS } from '@oribet/test-ids'

const WalletMobilePage = () => {
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const settings = useAppSelector(state => state.settings.generalSetting)
  const systemSettings = useAppSelector(state => state.settings.systemSettings)
  const hasCryptoWallet = systemSettings?.multi_currency?.has_crypto_wallet
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Root>
      <Header>
        <StyledOribetIcon size={24} />
        <Balance>{Number(playerInfo.player.balance).toFixed(2)}</Balance>
      </Header>
      <Body>
        {settings?.find(
          (item: any) => item.value === '1' && item.key === SettingsKeys.fiat_transaction_status
        ) && (
          <Item
            onClick={() => navigate(AppRoutePath.DEPOSITFIAT())}
            data-testid={`${DEPOSIT_TEST_IDS.open}.mobile-fiat`}
          >
            <ItemChild>
              <IconDeposit /> <span>{t('interkasa.depositFiat')}</span>
            </ItemChild>
            <IconChevronRight />
          </Item>
        )}

        {hasCryptoWallet && (
          <Item
            onClick={() => navigate(AppRoutePath.DEPOSIT())}
            data-testid={`${DEPOSIT_TEST_IDS.open}.mobile-crypto`}
          >
            <ItemChild>
              <IconDeposit /> <span>{t('account.depositCrypto')}</span>
            </ItemChild>
            <IconChevronRight />
          </Item>
        )}

        {hasCryptoWallet && (
          <Item
            onClick={() => navigate(AppRoutePath.WITHDRAWCRYPTO())}
            data-testid={TRANSACTIONS_TEST_IDS.withdraw.crypto.open}
          >
            <ItemChild>
              <IconWithdraw /> <span>{t('account.withdrawCrypto')}</span>
            </ItemChild>
            <IconChevronRight />
          </Item>
        )}

        <Item
          onClick={() => navigate(AppRoutePath.TRANSACTIONS())}
          data-testid={TRANSACTIONS_TEST_IDS.history.open}
        >
          <ItemChild>
            <IconTransaction /> <span>{t('account.transactions')}</span>
          </ItemChild>
          <IconChevronRight />
        </Item>
      </Body>
    </Root>
  )
}

export default WalletMobilePage

const Root = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg.primary};
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  gap: 16px;
`

const Header = styled.div`
  width: 100%;
  height: 56px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
`

const StyledOribetIcon = styled(IconOribetRounded)`
  & rect {
    fill: ${({ theme }) => theme.colors.surface.border};
  }
`

const Balance = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: ${fontSize.xl};
  line-height: 24px;
`

const Body = styled.div`
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
`

const Item = styled.div`
  padding: 12px 16px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
`

const ItemChild = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 24px;
`
