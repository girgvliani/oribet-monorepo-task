import { IconClose } from '@oribet/assets/icons/IconClose'
import { IconGoogleAuth } from '@oribet/assets/icons/IconGoogleAuth'
import LoginContainer from './LoginContainer'
import { SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { fontSize } from '@oribet/ui'
import { AUTH_TEST_IDS } from '@oribet/test-ids'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { redirectToGoogleAuth } from '@oribet/core/util/googleAuth'

interface IAuthorizationContent {
  onClose: () => void
  isRegistrationOpen: boolean
  setIsOpenResetPasswordModal: (isOpen: boolean) => void
}

const AuthorizationContent = ({
  onClose,
  isRegistrationOpen,
  setIsOpenResetPasswordModal,
}: IAuthorizationContent) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const onGoogleAuth = (event: SyntheticEvent): void => {
    event.preventDefault()
    redirectToGoogleAuth()
  }

  return (
    <Root $isMobile={isMobile} id="authContent" data-testid={AUTH_TEST_IDS.modal.root}>
      {isMobile && (
        <MobileHeader>
          <TextGroup>
            <span className="title">{t('auth.welcomeTitle')}</span>
            <span className="desc">{t('auth.welcomeDescription')}</span>
          </TextGroup>
          <button
            className="close"
            data-testid={AUTH_TEST_IDS.modal.closeMobile}
            onClick={() => onClose()}
            aria-label="Close"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <IconClose style={{ color: theme.colors.text.primary }} />
          </button>
        </MobileHeader>
      )}
      <ContentWrapper $isMobile={isMobile}>
        {/* Login only — this build ships no sign-up, so the login/register tab pair is
            replaced by a heading. The `login` test id moves here so it still marks the
            active auth mode. */}
        <StyledTabContainer $isMobile={isMobile}>
          <TabButton $isSelected $isMobile={isMobile} data-testid={AUTH_TEST_IDS.tab.login} as="h2">
            {t('auth.login')}
          </TabButton>
        </StyledTabContainer>
        <TabPanelContainer $isMobile={isMobile}>
          <LoginContainer
            onClose={onClose}
            setIsOpenResetPasswordModal={setIsOpenResetPasswordModal}
          />
        </TabPanelContainer>
      </ContentWrapper>
      <ExternalSection $isMobile={isMobile}>
        <span className="directlyJoin">{t('auth.directlyJoinWith')}</span>
        <div className="authButtons">
          <button
            className="externalAuthBtn"
            data-testid={AUTH_TEST_IDS.google.button}
            onClick={onGoogleAuth}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            <IconGoogleAuth style={{ color: theme.colors.text.primary }} />{' '}
            <span>{t('auth.google')}</span>
          </button>
        </div>
      </ExternalSection>
    </Root>
  )
}

export default AuthorizationContent

const Root = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.bg.secondary};
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '24px')};
  padding-bottom: ${({ $isMobile }) => ($isMobile ? '80px' : '24px')};
  display: flex;
  flex-direction: column;
  overflow: auto;
`

const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 8px;

  .close {
    cursor: pointer;
    z-index: 2;
    width: 24px;
    height: 24px;
    background: ${({ theme }) => theme.colors.bg.primary};
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      color: ${({ theme }) => theme.colors.text.primary};
      width: 12px;
      height: 12px;
    }
  }
`

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 240px;

  .title {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${fontSize.lg};
    line-height: 20px;
    font-weight: 700;
  }

  .desc {
    color: ${({ theme }) => theme.colors.text.tertiary};
    font-size: ${fontSize.sm};
    line-height: 16px;
    font-weight: 600;
  }
`

const ContentWrapper = styled.div<{ $isMobile: boolean }>`
  height: ${({ $isMobile }) => ($isMobile ? 'fit-content' : '100%')};
  display: flex;
  flex-direction: column;
`

const StyledTabContainer = styled.div<{ $isMobile: boolean }>`
  border-radius: ${({ $isMobile }) => ($isMobile ? '8px' : '16px')};
  background: ${({ theme }) => theme.colors.bg.primary};
  display: flex;
  padding: 4px;
  gap: 4px;
  align-items: flex-start;
  width: ${({ $isMobile }) => ($isMobile ? '100%' : 'fit-content')};
  position: relative;
`

const TabButton = styled.button<{ $isSelected: boolean; $isMobile: boolean }>`
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.text.primary : theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? fontSize.sm : fontSize.lg)};
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0;
  text-align: center;
  min-height: 0;
  flex: ${({ $isMobile }) => ($isMobile ? '1' : 'none')};
  height: ${({ $isMobile }) => ($isMobile ? '30px' : '38px')};
  border: none;
  z-index: 2;
  position: relative;
  border-radius: ${({ $isMobile }) => ($isMobile ? '8px' : '12px')};
  display: flex;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-width: 104px;
  width: fit-content;
  background: transparent;
  cursor: pointer;
`

const TabIndicator = styled.div<{ $isLogin: boolean; $isMobile: boolean }>`
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: ${({ $isLogin }) => ($isLogin ? '4px' : '50%')};
  width: calc(50% - 6px);
  background: ${({ theme }) => theme.colors.surface.hover};
  border-radius: ${({ $isMobile }) => ($isMobile ? '8px' : '12px')};
  transition: left 0.3s ease;
`

const TabPanelContainer = styled.div<{ $isMobile: boolean }>`
  padding: 0;
  margin-top: ${({ $isMobile }) => ($isMobile ? '24px' : '32px')};
  height: ${({ $isMobile }) => ($isMobile ? 'fit-content' : '100%')};
`

const ExternalSection = styled.div<{ $isMobile: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding-bottom: ${({ $isMobile }) => ($isMobile ? '120px' : '0')};

  .directlyJoin {
    font-size: ${fontSize.sm};
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors.text.tertiary};
    text-transform: uppercase;
  }

  .authButtons {
    display: flex;
    gap: 8px;
    width: 100%;
  }

  .externalAuthBtn {
    cursor: pointer;
    background: ${({ theme }) => theme.colors.surface.hover};
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: background 0.3s;
    gap: 16px;

    &:hover {
      background: ${({ theme }) => theme.colors.bg.primary};
    }

    span {
      color: ${({ theme }) => theme.colors.text.primary};
      font-size: ${fontSize.base};
      line-height: 24px;
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`
