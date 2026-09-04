import { zIndex, media, Tooltip } from '@oribet/ui'
import { IconCherry } from '@oribet/assets/icons/IconCherry'
import { IconGiftBoxFilled } from '@oribet/assets/icons/IconGiftBoxFilled'
import { IconSportSoccer } from '@oribet/assets/icons/IconSportSoccer'
import { LogoMain } from '@oribet/assets/logos/LogoMain'
import { LanguageSelectBox } from '@oribet/modules/language-select'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { changeGlobalUserLoginModalOpen, changeSideBarOpen } from '@oribet/core/redux/slices/userSlice'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { CasinoMenuList, SidebarSportItems } from '@oribet/core/util/SidebarListHelper'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { ReactNode, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { IOribetMenuItem } from '@oribet/core/types/common.type'
import { NAV_TEST_IDS } from '@oribet/test-ids'
import SidebarDepositCard from './SidebarDepositCard'
import SidebarMenuItem from './sidebarMenu/SidebarMenuItem'
import { IconLobby } from '@oribet/assets/icons/IconLobby'

interface IAppSidebar {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
  customLogo?: string | ReactNode | undefined
}

const AppSidebar = ({ isSidebarOpen, setIsSidebarOpen, customLogo }: IAppSidebar) => {
  const isMobile = useIsMobile()
  const isUserAuthenticated = useAppSelector(state => !!state.user.isUserAuthorized)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const theme = useTheme()

  const currentPath = window.location.pathname

  const sideBarRef = useRef<any>(null)
  const location = useLocation()

  const onMenuItemClick = (menuItem: IOribetMenuItem) => {
    if (menuItem.isAffiliate) {
      window.open(menuItem.link, '_blank')
      return
    }

    if (menuItem.isLiveSupport && window.LiveChatWidget) {
      window.LiveChatWidget.call('maximize')
      return
    }

    if (menuItem.needAuth && !isUserAuthenticated) {
      return
    }

    navigate(menuItem.link)

    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  useEffect(() => {
    // Check for mobile screen size inside useEffect

    if (isSidebarOpen && sideBarRef && sideBarRef.current) {
      sideBarRef.current.scrollTop = 0
    }
    if (location.pathname.includes('sport')) {
      dispatch(changeSideBarOpen(isSidebarOpen))
    }
  }, [isSidebarOpen])

  return (
    <SidebarRoot $isSidebarOpen={isSidebarOpen}>
      <MobileHeader>
        {customLogo && typeof customLogo === 'string' ? (
          <img src={customLogo} alt="Logo" />
        ) : customLogo ? (
          customLogo
        ) : (
          <LogoMain width={62} height={16} style={{ color: theme.colors.text.primary }} />
        )}
      </MobileHeader>

      <MenuItemsContainer ref={sideBarRef}>
        {/*
          Lobby is the only page this build ships, so the sidebar carries one nav item
          instead of the casino/sport/bonus sections and their sub-menus. Language and the
          deposit card stay — deposit is the entry point the wallet task is built around.
        */}
        <MenuContainer $isSidebarOpen={isSidebarOpen}>
          <Tooltip title={isSidebarOpen ? '' : t('oribetMenu.lobby')} arrow placement="right">
            <SidebarMenuItem
              icon={<IconLobby />}
              label={t('oribetMenu.lobby')}
              dataKey="lobby"
              selected={currentPath === AppRoutePath.HOME()}
              isSideBarOpened={isSidebarOpen}
              onClick={() => navigate(AppRoutePath.HOME())}
            />
          </Tooltip>
        </MenuContainer>

        <MenuContainer $isSidebarOpen={isSidebarOpen}>
          <LanguageContainer>
            <LanguageSelectBox isSidebarOpen={isSidebarOpen} />
          </LanguageContainer>
        </MenuContainer>
        {isSidebarOpen && <SidebarDepositCard />}
      </MenuItemsContainer>
    </SidebarRoot>
  )
}

export default AppSidebar

const SectionButtonContainer = styled.div<{ $isSidebarOpen: boolean }>`
  display: flex;
  width: inherit;
  gap: 8px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 4px;
`

const SectionButtonRow = styled.div<{ $isSidebarOpen: boolean }>`
  display: flex;
  width: 100%;
  gap: 8px;
  flex-direction: ${({ $isSidebarOpen }) => ($isSidebarOpen ? 'row' : 'column')};
`

// Styled Components with media queries instead of isMobile props
const SidebarRoot = styled.div<{ $isSidebarOpen: boolean }>`
  background: ${({ theme }) => theme.colors.bg.sidebar};
  padding: 12px 8px;
  clip-path: inset(0px -10px 0px 0px);
  box-shadow: ${({ theme }) => theme.colors.shadow.sidebar};
  width: 56px;
  min-width: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '240px' : '56px')};
  height: 100%;
  transition:
    width 0.3s,
    min-width 0.3s;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  position: static;
  z-index: ${zIndex.fixed};
  top: 0;
  overflow: auto;

  ${media.sm} {
    display: none;
    position: absolute;
    padding-bottom: 61px;
  }
`

const MobileHeader = styled.div`
  padding: 16px;
  display: none;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 1px solid #ffffff0d;

  ${media.sm} {
    display: flex;
  }
`

const MenuItemsContainer = styled.div`
  width: 100%;
  min-width: 0px;
  min-height: 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  gap: 8px;
  height: 100%;
`

const MenuContainer = styled.div<{ $isSidebarOpen?: boolean }>`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 12px;
  gap: 4px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 4px;
  width: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '100%' : '40px')};
`

const LanguageContainer = styled.div`
  max-height: 40px;
  width: 100%;
`
