import { zIndex, media } from '@oribet/ui'
import { forgotPassword } from '@oribet/core/api/services/Auth.api'
import { LogoMain } from '@oribet/assets/logos/LogoMain'
import { AppHeader } from '@oribet/modules/app-header'
import { AppSidebar } from '@oribet/modules/app-sidebar'
import { AppSidebarMobile } from '@oribet/modules/app-sidebar'
import { AuthorizationModal } from '@oribet/modules/authorization'
import { ResetPasswordModal } from '@oribet/modules/authorization'
import { CurrencySelectionModal, useGoogleCurrencyPrompt } from '@oribet/modules/currency-selection'
import { BoxContainer as Container } from '@oribet/ui'
import { CountryRestrictionModal } from '@oribet/modules/country-restriction'
import { MainFooter } from '@oribet/modules/main-footer'
import { BottomMenuMobile } from '@oribet/modules/bottom-menu-mobile'
import { UserProfileModal } from '@oribet/modules/user-profile'
import { DepositMethodModalShell } from '@oribet/modules/account'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import {
  changeGlobalCurrencySelectionModalOpen,
  changeGlobalUserRegistrationAndLoginModalClose,
  changeMainHeaderVisibility,
} from '@oribet/core/redux/slices/userSlice'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { scrollToTop } from '@oribet/core/util/appUtil'
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'
import { enqueueSnackbar } from 'notistack'
import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { IAuthorizationInfo } from '@oribet/core/types/common.type'

interface SocialIcon {
  icon: ReactElement
  link: string
  title: string
  isTwitter?: boolean
}

interface AboutUsItem {
  title: string
  url?: string | any
  isLiveSupport?: boolean
  isReactRoute?: boolean
}

interface IMainTemplate {
  children: ReactNode
  mainLoading: boolean
  aboutUsItems: AboutUsItem[]
  socialIcons: SocialIcon[]
  customLogo?: string | ReactNode | undefined
}

const MainTemplate = ({
  children,
  aboutUsItems,
  socialIcons,
  mainLoading,
  customLogo,
}: IMainTemplate) => {
  const theme = useTheme()
  const isCountryRestricted = useAppSelector(state => state.user.isCountryRestricted)
  const globalUserLoginModalOpen = useAppSelector(state => state.user.globalUserLoginModalOpen)
  const globalUserRegistrationModalOpen = useAppSelector(
    state => state.user.globalUserRegistrationModalOpen
  )
  const globalCurrencySelectionModalOpen = useAppSelector(
    state => state.user.globalCurrencySelectionModalOpen
  )
  useGoogleCurrencyPrompt()
  const isUserAuthenticated = useAppSelector(state => !!state.user.isUserAuthorized)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false)
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false)
  const [isThemeSwitcherOpen, setIsThemeSwitcherOpen] = useState<boolean>(false)
  const [authorizationInfo, setAuthorizationInfo] = useState<IAuthorizationInfo>({
    isLoginOpen: false,
    isRegistrationOpen: false,
  })

  const currentPath = window.location.pathname

  const oribetMainWrapperBodyRef = useRef<HTMLDivElement | null>(null)
  const [isOpenResetPasswordModal, setIsOpenResetPasswordModal] = useState<boolean>(false)
  const [selectedPageMobileVersion, setSelectedPageMobileVersion] = useState<string>(
    location.pathname === AppRoutePath.HOME() ? 'lobby' : location.pathname.split('/')[2]
  )
  const [openRestrictedCountryModal, setOpenRestrictedCountryModal] = useState<boolean>(false)

  // Set sidebar open by default for desktop
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    setIsSidebarOpen(!isMobile)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      const contentElement: any = oribetMainWrapperBodyRef.current

      if (!isMobile) {
        if (window.innerWidth < 950 && (isSidebarOpen || isChatOpen)) {
          if (contentElement) {
            contentElement.style.opacity = '0.2'
            contentElement.style.position = 'absolute'
            document.body.style.overflow = 'hidden'
            contentElement.style.paddingLeft = '64px'
          }
        } else {
          setTimeout(() => {
            contentElement.style.opacity = '1'
            document.body.style.overflow = 'auto'
            contentElement.style.position = 'static'
            contentElement.style.paddingLeft = '0px'
          }, 300)
        }
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isSidebarOpen, isChatOpen])

  useEffect(() => {
    // const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // if (isMobile && location) {
    //   changeMainHeaderVisibility(
    //     location.pathname.includes('wallet') ||
    //     location.pathname.includes('account') ||
    //     location.pathname.includes('settings')
    //   );
    // }

    scrollToTop()
  }, [location])

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    if (isMobile) {
      changeMobilePageHandler()
    }
  }, [selectedPageMobileVersion])

  useEffect(() => {
    if (isCountryRestricted) {
      setOpenRestrictedCountryModal(isCountryRestricted)
    }
  }, [isCountryRestricted])

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    if (isMobile && isChatOpen) {
      setIsChatOpen(true)
      setIsNotificationOpen(false)
    }
  }, [isChatOpen])

  const handleSetIsNotificationOpen = (open: boolean) => {
    setIsNotificationOpen(open)
    if (open) setIsThemeSwitcherOpen(false)
  }

  const handleSetIsThemeSwitcherOpen = (open: boolean) => {
    setIsThemeSwitcherOpen(open)
    if (open) setIsNotificationOpen(false)
  }

  const changeMobilePageHandler = () => {
    setIsChatOpen(false)
    setIsNotificationOpen(false)
    setIsThemeSwitcherOpen(false)
    setIsSidebarOpen(false)

    if (selectedPageMobileVersion === 'chat') {
      setIsChatOpen(!isChatOpen)
      setIsNotificationOpen(false)
      setIsSidebarOpen(false)
    }
  }

  const handleChatClose = () => {
    if (selectedPageMobileVersion === 'chat') {
      setIsChatOpen(false)
      setSelectedPageMobileVersion('')
    }
  }

  const openLogin = (): void => {
    setAuthorizationInfo({ ...authorizationInfo, isLoginOpen: true })
    const target = document.getElementById('authContent')
    disableBodyScroll(target!)
  }

  const openRegistration = (): void => {
    setAuthorizationInfo({ ...authorizationInfo, isRegistrationOpen: true })
  }

  const onCloseAuthorizationModal = (): void => {
    setAuthorizationInfo({
      isLoginOpen: false,
      isRegistrationOpen: false,
    })
    dispatch(changeGlobalUserRegistrationAndLoginModalClose(false))
    clearAllBodyScrollLocks()
  }

  const onResetPassword = (email: string) => {
    forgotPassword({ email })
      .then(resp => {
        if (resp.status === 200) {
          enqueueSnackbar(resp.data.data.message, { variant: 'success' })
        }
      })
      .catch((resp: any) => {
        if (resp.response.data?.data?.error) {
          enqueueSnackbar(resp.response.data.data.error, { variant: 'error' })
        }
      })
      .finally(() => {
        setIsOpenResetPasswordModal(false)
      })
  }

  // Save last visited path to local storage
  useEffect(() => {
    localStorage.setItem('lastVisitedPath', location.pathname + location.search)
  }, [location])

  const isMobile = window.matchMedia('(max-width: 768px)').matches

  const isMobileGamePage =
    location.pathname.includes('/games/mobile/') ||
    location.pathname.includes('/bonusgames/mobile/') ||
    location.pathname.includes('/bonusgames/') ||
    location.pathname.includes('marketplace') ||
    location.pathname.includes('/sports') ||
    location.pathname === `/${localStorage.getItem('language')}/bonus`

  const isFullscreen = location.pathname.includes('fullscreen')

  // CHECK FOR AFFILIATE PARAMS
  useEffect(() => {
    const url = new URL(window.location.href)
    const affid = url.searchParams.get('affid')
    const cxd = url.searchParams.get('cxd')
    if (affid || cxd) {
      const data = {
        date: new Date(),
        ...(affid && { affid }),
        ...(cxd && { cxd }),
      }
      localStorage.setItem('affiliate', JSON.stringify(data))
    }
  }, [])

  return (
    <MainContainer>
      {mainLoading && (
        <LoadingContainer>
          <ProgressIndicator />
          <LogoMain style={{ color: theme.colors.text.primary }} />
        </LoadingContainer>
      )}
      <RootContainer
        $pathName={location.pathname}
        style={{
          opacity: mainLoading ? 0 : 1,
        }}
      >
        {isFullscreen && children}
        {!isFullscreen && (
          <AppHeader
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            isNotificationOpen={isNotificationOpen}
            setIsNotificationOpen={handleSetIsNotificationOpen}
            isThemeSwitcherOpen={isThemeSwitcherOpen}
            setIsThemeSwitcherOpen={handleSetIsThemeSwitcherOpen}
            openLogin={openLogin}
            customLogo={customLogo}
            openRegistration={openRegistration}
            setSelectedPageMobileVersion={setSelectedPageMobileVersion}
          >
            <ContentContainer>
              {window.location.pathname !== AppRoutePath.BONUSMODE() &&
                !window.location.pathname.includes('/bonusgames') && (
                  <aside aria-label="Sidebar navigation">
                    <AppSidebar
                      customLogo={customLogo}
                      isSidebarOpen={isSidebarOpen}
                      setIsSidebarOpen={setIsSidebarOpen}
                    />
                  </aside>
                )}
              <BodyContainer as="main" ref={oribetMainWrapperBodyRef} id={'oribet-body'}>
                {children}
                {!isMobileGamePage && (
                  <FooterContainer
                    as="footer"
                    $hideOnMobile={
                      location.pathname.includes('wallet') ||
                      location.pathname.includes('account') ||
                      location.pathname.includes('settings') ||
                      location.pathname.includes('bonus-mode') ||
                      location.pathname.includes('marketplace')
                    }
                  >
                    {!currentPath.includes('sports') &&
                      currentPath !== AppRoutePath.BONUS_MOBILE_PAGE() && (
                        <Container>
                          <MainFooter
                            isMobile={isMobile}
                            customLogo={customLogo}
                            aboutUsItems={aboutUsItems}
                            socialIcons={socialIcons}
                          />
                        </Container>
                      )}
                  </FooterContainer>
                )}
              </BodyContainer>
            </ContentContainer>
          </AppHeader>
        )}
        {isMobile &&
          !location.pathname.includes('/bonusgames') &&
          !location.pathname.includes('/games') &&
          !location.pathname.includes('/bonus-mode') &&
          !location.pathname.includes('/sports') && (
            <>
              <MobileMenuContainer as="nav" aria-label="Mobile navigation">
                <BottomMenuMobile
                  isUserAuthenticated={isUserAuthenticated}
                  value={selectedPageMobileVersion}
                  setValue={setSelectedPageMobileVersion}
                  setIsSideBarOpen={setIsMobileSidebarOpen}
                  isSideBarOpen={isMobileSidebarOpen}
                />
              </MobileMenuContainer>
              <AppSidebarMobile
                isSidebarOpen={isMobileSidebarOpen}
                toggleSidebar={setIsMobileSidebarOpen}
                isUserAuthenticated={isUserAuthenticated}
              />
            </>
          )}
      </RootContainer>

      <AuthorizationModal
        open={
          authorizationInfo.isLoginOpen ||
          authorizationInfo.isRegistrationOpen ||
          globalUserLoginModalOpen ||
          globalUserRegistrationModalOpen
        }
        onClose={() => onCloseAuthorizationModal()}
        isRegistrationOpen={authorizationInfo.isRegistrationOpen || globalUserRegistrationModalOpen}
        setIsOpenResetPasswordModal={setIsOpenResetPasswordModal}
      />

      <CurrencySelectionModal
        open={globalCurrencySelectionModalOpen}
        onClose={() => dispatch(changeGlobalCurrencySelectionModalOpen(false))}
      />

      <CountryRestrictionModal open={openRestrictedCountryModal} />
      {/* <CountryRestrictionModal open={true} /> */}

      {/* Legacy "choose deposit method" modal — oribet/turkey only. redesign/korea use
          OribetWalletModal in their own layouts instead. */}
      <DepositMethodModalShell />

      <UserProfileModal />
      {isOpenResetPasswordModal && (
        <ResetPasswordModal
          setIsOpenResetPasswordModal={setIsOpenResetPasswordModal}
          isOpenResetPasswordModal={isOpenResetPasswordModal}
          onResetPassword={onResetPassword}
        />
      )}

    </MainContainer>
  )
}

export default MainTemplate

const MainContainer = styled.div`
  background: ${({ theme }) => theme.colors.bg.primary};
  height: 100%;
`

const RootContainer = styled.div<{ $pathName: string }>`
  background: black;
  width: 100%;
  height: 100%;
  display: flex;
  min-height: 0px;
  min-width: 0px;
  box-sizing: border-box;
  padding-bottom: 0px;
  user-select: none;
  transition: opacity 0.5s ease-in-out;
  flex-direction: row;

  ${media.md} {
    flex-direction: column;
    padding-bottom: ${props =>
      props.$pathName.includes('/bonusgames') ||
      props.$pathName.includes('/bonus-mode') ||
      props.$pathName.includes('/marketplace') ||
      props.$pathName.includes('/games') ||
      props.$pathName.includes('/sports')
        ? '0px'
        : '61px'};
  }
`

const ContentContainer = styled.div`
  display: flex;
  min-height: 0px;
  min-width: 0px;
  box-sizing: border-box;
  height: 100%;
`

const BodyContainer = styled.main`
  width: 100%;
  min-width: 0px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
`

const ChatNotificationContainer = styled.div<{ $isOpen: boolean }>`
  height: 100%;
  transition: min-width 0.2s ease-in-out;
  box-shadow: ${({ theme }) => theme.colors.shadow.header};
  min-width: ${props => (props.$isOpen ? '320px' : '0px')};
  overflow: hidden;
  position: relative;

  ${media.md} {
    position: fixed;
    z-index: 100;
    width: 100%;
    min-width: 0px;
  }
`

const ChatPanelContent = styled.div<{ $isOpen: boolean }>`
  display: flex;
  height: 100%;
  position: absolute;
  top: 0px;
  width: ${props => (props.$isOpen ? '100%' : '0px')};
  transition: width 0.2s ease-in-out;
  z-index: ${props => (props.$isOpen ? 2 : 0)};
  background: ${({ theme }) => theme.colors.bg.secondary};
`

const NotificationPanelContainer = styled.div<{ $isOpen: boolean }>`
  height: 100%;
  transition: min-width 0.2s ease-in-out;
  min-width: ${props => (props.$isOpen ? '320px' : '0px')};
  overflow: hidden;
  position: relative;
`

const NotificationContent = styled.div<{ $isOpen: boolean }>`
  display: flex;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 0;
  width: 320px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bg.secondary};
  box-shadow: ${({ theme }) => theme.colors.shadow.header};
  border-left: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  z-index: ${props => (props.$isOpen ? 2 : 0)};

  ${media.md} {
    right: unset;
    width: ${props => (props.$isOpen ? '100%' : '0px')};
    transition: width 0.2s ease-in-out;
  }
`

const SlidePanelContainer = styled.div<{ $isOpen: boolean }>`
  height: 100%;
  transition: min-width 0.2s ease-in-out;
  min-width: ${props => (props.$isOpen ? '320px' : '0px')};
  overflow: hidden;
  position: relative;
`

const SlidePanelContent = styled.div<{ $isOpen: boolean }>`
  display: flex;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 0;
  width: 320px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bg.secondary};
  box-shadow: ${({ theme }) => theme.colors.shadow.header};
  border-left: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};

  ${media.md} {
    right: unset;
    width: ${props => (props.$isOpen ? '100%' : '0px')};
    transition: width 0.2s ease-in-out;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  animation: pulse infinite 2s ease-in-out;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`

const ProgressIndicator = styled.div`
  background: ${({ theme }) => theme.colors.accent.brand};
  width: 0%;
  height: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  position: absolute;
  top: 0;
  left: 0;
  animation: progress 3s ease-in-out;

  @keyframes progress {
    0% {
      width: 0%;
    }
    30% {
      width: 30%;
    }
    50% {
      width: 50%;
    }
    100% {
      width: 100%;
    }
  }
`

const MobileMenuContainer = styled.nav`
  width: 100%;
  z-index: ${zIndex.dropdown};
  position: fixed;
  bottom: 0px;
`

const FooterContainer = styled.footer<{ $hideOnMobile?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg.footer};
  padding-top: ${props => (props.$hideOnMobile ? '0' : '52px')};
  display: ${props => (props.$hideOnMobile ? 'none' : 'block')};
`
