import { type ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { ACCOUNT_TEST_IDS } from '@oribet/test-ids'
import { fontSize } from '@oribet/ui'
import { IconDeposit } from '@oribet/assets/icons/IconDeposit'
import { IconTransaction } from '@oribet/assets/icons/IconTransaction'
import { IconWallet } from '@oribet/assets/icons/IconWallet'
import { IconWithdraw } from '@oribet/assets/icons/IconWithdraw'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useAccountCapabilities } from '@oribet/core/hooks/account/useAccountCapabilities'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'

interface NavItem {
  type: string
  labelKey: string
  icon: ComponentType
  path: string
}

/**
 * Desktop sidebar listing every account section the user can reach. Items are feature-gated
 * by `useAccountCapabilities` (Interkasa fiat + crypto wallet). Active item highlighted by
 * the `:accountType` route param. Returns null on mobile.
 */
const AccountSidebarModule = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { accountType } = useParams<{ accountType?: string }>()
  const { hasCryptoWallet, hasFiatDeposit } = useAccountCapabilities()

  if (isMobile) return null

  const items: NavItem[] = [
    { type: 'wallet', labelKey: 'account.wallet', icon: IconWallet, path: AppRoutePath.WALLET() },
    ...(hasFiatDeposit
      ? [
          {
            type: 'deposit-fiat',
            labelKey: 'interkasa.depositFiat',
            icon: IconDeposit,
            path: AppRoutePath.DEPOSITFIAT(),
          },
        ]
      : []),
    ...(hasCryptoWallet
      ? [
          {
            type: 'deposit',
            labelKey: 'account.depositCrypto',
            icon: IconDeposit,
            path: AppRoutePath.DEPOSIT(),
          },
          {
            type: 'withdraw-crypto',
            labelKey: 'account.withdrawCrypto',
            icon: IconWithdraw,
            path: AppRoutePath.WITHDRAWCRYPTO(),
          },
          {
            type: 'buy-crypto',
            labelKey: 'account.buyCrypto',
            icon: IconDeposit,
            path: AppRoutePath.BUYCRYPTO(),
          },
        ]
      : []),
    {
      type: 'transactions',
      labelKey: 'account.transactions',
      icon: IconTransaction,
      path: AppRoutePath.TRANSACTIONS(),
    },
  ]

  return (
    <ListContainer>
      {items.map(item => {
        const isActive = accountType === item.type
        const Icon = item.icon
        return (
          <Item
            key={item.type}
            onClick={() => navigate(item.path)}
            style={{ background: isActive ? theme.colors.bg.primary : '' }}
            data-testid={`${ACCOUNT_TEST_IDS.nav.item}.${item.type}`}
          >
            <Icon />
            <ItemText style={{ color: isActive ? theme.colors.text.primary : '' }}>
              {t(item.labelKey)}
            </ItemText>
          </Item>
        )
      })}
    </ListContainer>
  )
}

export default AccountSidebarModule

const ListContainer = styled.div`
  display: flex;
  width: 272px;
  padding: 8px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.secondary};
  height: max-content;
  min-height: 0px;
  box-sizing: border-box;
`

const Item = styled.div`
  display: flex;
  padding: 8px;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  transition:
    background 0.3s ease-in-out,
    color 0.3s ease-in-out;
  color: ${({ theme }) => theme.colors.text.secondary};

  & span {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:hover span {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`

const ItemText = styled.span`
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 24px;
  transition: color 0.3s ease-in-out;
`
