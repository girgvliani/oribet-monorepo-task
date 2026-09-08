import { IconClock } from '@oribet/assets/icons/IconClock'
import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { IconWithdraw } from '@oribet/assets/icons/IconWithdraw'
import { LogoAsofbet } from '@oribet/assets/logos/LogoAsofbet'
import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { formatMoney } from '@oribet/core/util/appUtil'
import { IWallet } from '@oribet/core/types/Wallet.type'
import { radii } from '@oribet/ui'
import { WALLET_TEST_IDS } from '@oribet/test-ids'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { WALLET_PALETTE as wp } from './palette'

interface RailProps {
  wallet?: IWallet
}

const Rail: FC<RailProps> = ({ wallet }) => {
  const { t } = useTranslation()

  const bonusBalance = Number(wallet?.bm_balance ?? 0)

  return (
    <Root>
      <LogoAsofbet width={70} height={20} />

      {wallet && (
        <BalanceCard>
          <BalanceLabel>{t('wallet.totalBalance')}</BalanceLabel>
          <BalanceAmount>
            {getActiveCurrencySymbol(wallet.currency)}
            {formatMoney(wallet.balance)}
          </BalanceAmount>
          {bonusBalance > 0 && (
            <BonusChip>{t('wallet.bonusChip', { amount: formatMoney(bonusBalance) })}</BonusChip>
          )}
        </BalanceCard>
      )}

      <Nav role="tablist">
        <NavItem
          role="tab"
          aria-selected
          $active
          data-testid={`${WALLET_TEST_IDS.tab.root}.deposit`}
        >
          <IconDeposit size={18} />
          <NavLabel $active>{t('account.deposit')}</NavLabel>
        </NavItem>
        <NavItem
          role="tab"
          aria-selected={false}
          $active={false}
          data-testid={`${WALLET_TEST_IDS.tab.root}.withdraw`}
        >
          <IconWithdraw size={18} />
          <NavLabel $active={false}>{t('account.withdraw')}</NavLabel>
        </NavItem>
        <NavItem
          role="tab"
          aria-selected={false}
          $active={false}
          data-testid={`${WALLET_TEST_IDS.tab.root}.transactions`}
        >
          <IconClock size={18} />
          <NavLabel $active={false}>{t('account.transactions')}</NavLabel>
        </NavItem>
      </Nav>

      <Spacer />
    </Root>
  )
}

export default Rail

const Root = styled.div`
  box-sizing: border-box;
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  background: ${wp.bgRail};
  border-right: 1px solid ${wp.borderRail};
  overflow: hidden;
`

const BalanceCard = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  background-image:
    linear-gradient(180deg, #03081080 0%, #030810e0 100%),
    linear-gradient(45deg, #ffffff1f 25%, transparent 25%, transparent 75%, #ffffff1f 75%),
    linear-gradient(45deg, #ffffff1f 25%, transparent 25%, transparent 75%, #ffffff1f 75%);
  background-size:
    auto,
    8px 8px,
    8px 8px;
  background-position:
    0 0,
    0 0,
    4px 4px;
  border: 1px solid ${wp.gold}40;
  border-radius: 14px;
  overflow: hidden;
`

const BalanceLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${wp.textPrimary}a6;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  white-space: nowrap;
`

const BalanceAmount = styled.span`
  font-size: 23px;
  font-weight: 800;
  color: ${wp.textPrimary};
  white-space: nowrap;
`

const BonusChip = styled.span`
  width: fit-content;
  padding: 4px 10px;
  background: #0308108c;
  border: 1px solid ${wp.gold}73;
  border-radius: ${radii.full};
  font-size: 11px;
  font-weight: 700;
  color: ${wp.gold};
  white-space: nowrap;
`

const Nav = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const NavItem = styled.div<{ $active: boolean }>`
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border-radius: 11px;
  background: ${({ $active }) => ($active ? wp.goldGradient : 'transparent')};
  color: ${({ $active }) => ($active ? wp.onGold : wp.textSecondary)};
`

const NavLabel = styled.span<{ $active: boolean }>`
  font-size: 14.5px;
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  color: ${({ $active }) => ($active ? wp.onGold : '#d1d5e1')};
  white-space: nowrap;
`

const Spacer = styled.div`
  flex: 1;
`
