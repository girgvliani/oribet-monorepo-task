import { ACCOUNT_TEST_IDS } from '@oribet/test-ids'
import { IconChevronLeft } from '@oribet/assets/icons/IconChevronLeft'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { ReactNode } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'

interface IWalletMobileWrapper {
  children: ReactNode
  title: string
}

const WalletMobileWrapper = ({ children, title }: IWalletMobileWrapper) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <Root>
      <Header $isMobile={isMobile}>
        <BackButton
          onClick={() => navigate(AppRoutePath.WALLET_MOBILE_PAGE())}
          data-testid={`${ACCOUNT_TEST_IDS.nav.back}.mobile-wrapper`}
        >
          <IconChevronLeft />
        </BackButton>
        <Title>{title}</Title>
      </Header>
      <Content $isMobile={isMobile}>{children}</Content>
    </Root>
  )
}

export default WalletMobileWrapper

const Root = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg.primary};
`

const Header = styled.div<{ $isMobile: boolean }>`
  z-index: 1;
  display: flex;
  box-sizing: border-box;
  padding: 16px 8px;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  background: ${({ theme }) => theme.colors.bg.primary};
  width: 100%;
  position: ${({ $isMobile }) => ($isMobile ? 'fixed' : 'static')};

  & svg {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`

const BackButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const Title = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.lg};
  font-weight: 600;
  line-height: 24px;
`

const Content = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.bg.primary};
  padding-top: 50px;
  height: ${({ $isMobile }) => ($isMobile ? '100%' : 'auto')};
`
