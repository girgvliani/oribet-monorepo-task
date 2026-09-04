import { zIndex, media } from '@oribet/ui'
import { IconOpenSidebar } from '@oribet/assets/icons/IconOpenSidebar'
import { LogoMain } from '@oribet/assets/logos/LogoMain'
import { LogoMainMini } from '@oribet/assets/logos/LogoMainMini'
import AppHeaderAuthorizedContent from './AppHeaderAuthorizedContent'
import AppHeaderUnAuthorizedContent from './AppHeaderUnAuthorizedContent'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { changeGlobalDepositModal } from '@oribet/core/redux/slices/userSlice'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { NAV_TEST_IDS } from '@oribet/test-ids'
import { ReactNode, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { css, useTheme } from 'styled-components'

interface IAppHeader {
  children: ReactNode
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
  isChatOpen: boolean
  setIsChatOpen: (isOpen: boolean) => void
  isNotificationOpen: boolean
  setIsNotificationOpen: (isOpen: boolean) => void
  isThemeSwitcherOpen: boolean
  setIsThemeSwitcherOpen: (isOpen: boolean) => void
  openLogin: () => void
  customLogo?: string | ReactNode | undefined
  openRegistration: () => void
  setSelectedPageMobileVersion: (pageName: string) => void
}

const AppHeader = ({
  children,
  isSidebarOpen,
  setIsSidebarOpen,
  isChatOpen,
  setIsChatOpen,
  isNotificationOpen,
  setIsNotificationOpen,
  isThemeSwitcherOpen,
  setIsThemeSwitcherOpen,
  openLogin,
  customLogo,
  openRegistration,
  setSelectedPageMobileVersion,
}: IAppHeader) => {
  const isUserAuthenticated = useAppSelector(state => !!state.user.isUserAuthorized)
  const hideMainHeader = useAppSelector(state => state.user.hideMainHeader)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const changeGlobalDepositModalFn = (isOpen: boolean) => dispatch(changeGlobalDepositModal(isOpen))
  const navigate = useNavigate()
  const openSideBarButtonRef = useRef<HTMLDivElement | null>(null)

  const onClickSidebarOpenButton = (): void => {
    if (openSideBarButtonRef?.current) {
      openSideBarButtonRef.current.style.transform = isSidebarOpen ? 'scaleX(-1)' : 'scaleX(1)'
    }
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <RootContainer>
      {/* {process.env.REACT_APP_NAME === 'oribet' && (
        <GrabBonus
          setOpenWelcomeBonus={setOpenWelcomeBonus}
          openRegistration={openRegistration}
          isUserAuthenticated={isUserAuthenticated}
        />
      )} */}
      <HeaderContainer $hideMainHeader={hideMainHeader}>
        <LogoSectionContainer>
          <SidebarContainer $isSidebarOpen={isSidebarOpen}>
            <SidebarIconWrapper
              ref={openSideBarButtonRef}
              style={{
                opacity:
                  window.location.pathname === AppRoutePath.BONUSMODE() ||
                  window.location.pathname.includes('/bonusgames')
                    ? 0
                    : 1,
              }}
            >
              <SidebarIconWrapperChild
                $location={location.pathname}
                onClick={() => onClickSidebarOpenButton()}
                data-testid={NAV_TEST_IDS.header.menuToggle}
              >
                <IconOpenSidebar size={24} />
              </SidebarIconWrapperChild>
            </SidebarIconWrapper>

            <LogoContainer
              $isSidebarOpen={isSidebarOpen}
              data-testid={NAV_TEST_IDS.header.logo}
              onClick={() => {
                if (location.pathname === AppRoutePath.BONUSMODE()) {
                  return null
                } else if (location.pathname.includes('/bonusgames')) {
                  navigate(AppRoutePath.BONUSMODE())
                } else {
                  navigate(AppRoutePath.HOME())
                }
              }}
            >
              {customLogo && typeof customLogo === 'string' ? (
                <img src={customLogo} alt="Logo" />
              ) : customLogo ? (
                customLogo
              ) : (
                <LogoMain style={{ color: theme.colors.text.primary }} />
              )}
            </LogoContainer>
            {/* Empty Element to get perfect center alignment on Logo */}
            <SidebarEmptyIcon />
          </SidebarContainer>

          <MobileLogoContainer
            data-testid={NAV_TEST_IDS.header.logo}
            onClick={() => {
              if (location.pathname === AppRoutePath.BONUSMODE()) {
                return null
              } else if (location.pathname.includes('/bonusgames')) {
                navigate(AppRoutePath.BONUSMODE())
              } else {
                navigate(AppRoutePath.HOME())
              }

              setSelectedPageMobileVersion('lobby')
            }}
          >
            <LargeLogoWrapper>
              {customLogo && typeof customLogo === 'string' ? (
                <img src={customLogo} alt="Logo" />
              ) : customLogo ? (
                customLogo
              ) : (
                <LogoMain width={62} height={16} style={{ color: theme.colors.text.primary }} />
              )}
            </LargeLogoWrapper>
            <MiniLogoWrapper>
              <LogoMainMini style={{ color: theme.colors.text.primary }} />
            </MiniLogoWrapper>
          </MobileLogoContainer>
        </LogoSectionContainer>

        <HeaderRightSection>
          {isUserAuthenticated ? (
            <AppHeaderAuthorizedContent
              isChatOpen={isChatOpen}
              setIsChatOpen={setIsChatOpen}
              isNotificationOpen={isNotificationOpen}
              setIsNotificationOpen={setIsNotificationOpen}
              isThemeSwitcherOpen={isThemeSwitcherOpen}
              setIsThemeSwitcherOpen={setIsThemeSwitcherOpen}
              setIsOpenDepositModal={changeGlobalDepositModalFn}
            />
          ) : (
            <AppHeaderUnAuthorizedContent openLogin={openLogin} />
          )}
        </HeaderRightSection>
      </HeaderContainer>
      <BodyContainer>{children}</BodyContainer>
    </RootContainer>
  )
}

export default AppHeader

// Styled components
const RootContainer = styled.div`
  height: 100%;
  min-height: 0px;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  min-width: 0px;
`

const HeaderContainer = styled.div<{ $hideMainHeader?: boolean }>`
  position: relative;
  box-shadow: ${({ theme }) => theme.colors.shadow.header};
  background: ${({ theme }) => theme.colors.bg.header};
  justify-content: space-between;
  height: 64px;
  box-sizing: border-box;
  min-width: 0px;
  min-height: 64px;
  z-index: ${zIndex.fixed};
  display: ${({ $hideMainHeader }) => ($hideMainHeader ? 'none' : 'flex')};
  padding-right: 8px;

  @media (min-width: 600px) {
    padding: 0px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    width: 100%;
    background: ${({ theme }) => theme.colors.bg.secondary};
  }
`

const BodyContainer = styled.div`
  height: 100%;
  min-height: 0px;
  width: 100%;
`

const LogoSectionContainer = styled.div`
  display: flex;
  position: static;

  ${media.sm} {
    align-items: center;
    position: relative;
  }
`

const HeaderRightSection = styled.div`
  width: 100%;
  display: flex;
`

const SidebarContainer = styled.div<{ $isSidebarOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;
  width: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '240px' : '240px')};
  background-color: ${({ $isSidebarOpen, theme }) =>
    $isSidebarOpen
      ? location.pathname.includes('bonus-mode') || location.pathname.includes('bonusgames')
        ? theme.colors.bg.header
        : theme.colors.bg.sidebar
      : theme.colors.bg.header};

  ${media.sm} {
    display: none;
  }
`

const SidebarIconWrapper = styled.div`
  transform: scaleX(1);
  transition: transform 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.bg.sidebar};
  width: 56px;
  height: 64px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`

const SidebarIconWrapperChild = styled.div<{ $location: string }>`
  cursor: pointer;

  ${({ $location }) =>
    $location.includes('/bonus-mode') &&
    css`
      display: none;
    `}
`

const SidebarEmptyIcon = styled.div`
  width: 24px;
  margin: 0px 20px;
`

const LogoContainer = styled.div<{
  $isSidebarOpen: boolean
}>`
  display: flex;
  align-items: center;
  transition:
    padding 0.3s,
    width 0.3s;
  cursor: pointer;
  justify-content: center;
`

const MobileLogoContainer = styled.div`
  display: none;
  align-items: center;

  ${media.sm} {
    display: flex;
  }
`

// Styled components for the two logo variants
const LargeLogoWrapper = styled.div`
  @media (max-width: 480px) {
    display: none;
  }
`

const MiniLogoWrapper = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  height: 56px;
  width: 56px;
  border-right: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};

  @media (max-width: 480px) {
    display: flex;
  }
`
