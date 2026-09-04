import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { BoxContainer, fontSize } from '@oribet/ui'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'

/**
 * Desktop-only "Wallet" title row. Returns null on mobile — the mobile sub-pages render
 * their own per-section headers via `WalletMobileWrapper`.
 */
const AccountHeader = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  if (isMobile) return null
  return (
    <Header>
      <BoxContainer>
        <HeaderText>{t('account.wallet')}</HeaderText>
      </BoxContainer>
    </Header>
  )
}

export default AccountHeader

const Header = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  background: ${({ theme }) => theme.colors.bg.secondary};
  box-shadow: ${({ theme }) => theme.colors.shadow.header};
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0px 20px;
`

const HeaderText = styled.span`
  font-size: ${fontSize['2xl']};
  font-weight: 600;
  line-height: 48px;
  color: ${({ theme }) => theme.colors.text.primary};
`
