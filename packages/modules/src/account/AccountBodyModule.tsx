import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useAccountCapabilities } from '@oribet/core/hooks/account/useAccountCapabilities'
import WalletMobileWrapper from './Mobile/WalletMobileWrapper'
import WalletContainer from './containers/WalletContainer'
import DepositContainer from './containers/DepositContainer'
import WithdrawCryptoContainer from './containers/WithdrawCryptoContainer'
import BuyCryptoContainer from './containers/BuyCryptoContainer'
import TransactionContainer from './containers/TransactionContainer'
import DepositFiatOmno from './DepositFiatOmno'

/**
 * Body slot for the account page. Picks one of six section containers based on
 * `:accountType`. Wraps each in `WalletMobileWrapper` on mobile (per-section header chrome
 * + back button); plain on desktop. Feature-gated sections render nothing when their
 * capability is off — the route still resolves but the body is empty (matches legacy).
 */
const AccountBodyModule = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { accountType } = useParams<{ accountType?: string }>()
  const { hasCryptoWallet, hasFiatDeposit } = useAccountCapabilities()

  const wrap = (title: string, content: ReactNode) =>
    isMobile ? <WalletMobileWrapper title={title}>{content}</WalletMobileWrapper> : content

  let content: ReactNode = null
  switch (accountType) {
    case 'wallet':
      // No mobile wrap in the legacy code for /wallet (has its own mobile page variant).
      content = isMobile ? null : <WalletContainer />
      break
    case 'deposit':
      if (hasCryptoWallet) content = wrap(t('account.depositCrypto'), <DepositContainer />)
      break
    case 'deposit-fiat':
      if (hasFiatDeposit) content = wrap(t('interkasa.depositFiat'), <DepositFiatOmno />)
      break
    case 'withdraw-crypto':
      if (hasCryptoWallet)
        content = wrap(t('account.withdrawCrypto'), <WithdrawCryptoContainer />)
      break
    case 'buy-crypto':
      if (hasCryptoWallet) content = wrap(t('account.buyCrypto'), <BuyCryptoContainer />)
      break
    case 'transactions':
      content = wrap(t('account.transactions'), <TransactionContainer />)
      break
  }

  return <FullSize $isMobile={isMobile}>{content}</FullSize>
}

export default AccountBodyModule

const FullSize = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`
