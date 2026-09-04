import { CustomSecondaryButton } from '@oribet/ui'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { selectIsChatEnabled } from '@oribet/core/redux/selectors'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { media } from '@oribet/ui'
import styled, { useTheme } from 'styled-components'
import { AUTH_TEST_IDS, NAV_TEST_IDS } from '@oribet/test-ids'

interface IAppHeaderUnAuthorizedContent {
  openLogin: () => void
}

const AppHeaderUnAuthorizedContent = ({
  openLogin,
}: IAppHeaderUnAuthorizedContent) => {
  const isMobile = useIsMobile()
  const isChatEnabled = useAppSelector(selectIsChatEnabled)
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Root $isMobile={isMobile}>

      {/* Login is the only auth CTA — this build ships no sign-up. */}
      <CustomSecondaryButton
        style={{ textTransform: 'uppercase', marginRight: isMobile ? '0px' : '24px' }}
        onClick={() => openLogin()}
        testId={AUTH_TEST_IDS.header.loginButton}
      >
        {t('header.login')}
      </CustomSecondaryButton>

    </Root>
  )
}

export default AppHeaderUnAuthorizedContent

const Root = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: ${({ $isMobile }) => ($isMobile ? '0px' : '24px')};
`

const ChatButtonWrapper = styled.div`
  margin-right: 8px;
  flex-shrink: 0;
`

const ThemeButtonContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface.hover};
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
  margin-right: 8px;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.border};
  }

  &:active {
    background: ${({ theme }) => theme.colors.surface.border};
  }

  ${media.md} {
    width: 24px;
    height: 24px;
    background-color: transparent;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`
