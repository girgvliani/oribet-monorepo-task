import { renderTabIcon, TABS } from './data'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { selectIsChatEnabled } from '@oribet/core/redux/selectors'
import { changeGlobalDepositModal, changeGlobalUserLoginModalOpen } from '@oribet/core/redux/slices/userSlice'
import { AppRoutePath, casinoTabUrls } from '@oribet/core/util/appRoutePath'
import { FC, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { fontSize } from '@oribet/ui'
import { NAV_TEST_IDS } from '@oribet/test-ids'
import styled, { useTheme } from 'styled-components'

interface BottomMenuMobileProps {
  isUserAuthenticated: boolean
  value: string
  setValue: (value: string) => void
  setIsSideBarOpen: (isOpen: boolean) => void
  isSideBarOpen: boolean
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const BottomMenuMobile: FC<BottomMenuMobileProps> = ({
  isUserAuthenticated,
  value,
  setValue,
  setIsSideBarOpen,
  isSideBarOpen,
}: BottomMenuMobileProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isChatEnabled = useAppSelector(selectIsChatEnabled)

  // Drop the community-chat tab when chat is disabled via `/settings`.
  const visibleTabs = TABS.filter(tab => tab.tabValue !== 'chat' || isChatEnabled)

  const sidebarRef = useRef<HTMLDivElement>(null)

  const walletRoutes = [
    AppRoutePath.DEPOSIT(),
    AppRoutePath.WITHDRAWCRYPTO(),
    AppRoutePath.DEPOSITFIAT(),
    AppRoutePath.TRANSACTIONS(),
  ]

  useEffect(() => {
    const path = location.pathname

    let tabValue = 'lobby'

    if (path === AppRoutePath.HOME()) {
      tabValue = 'lobby'
    } else if (walletRoutes.includes(path)) {
      tabValue = 'wallet'
    } else if (
      path.startsWith(AppRoutePath.ACCOUNT_MOBILE_PAGE()) ||
      path.startsWith(`/${localStorage.getItem('language')}/settings`)
    ) {
      tabValue = 'account'
    } else if (path.startsWith(AppRoutePath.WALLET_MOBILE_PAGE())) {
      tabValue = 'wallet'
    } else if (path.startsWith(AppRoutePath.SPORT())) {
      tabValue = 'sports'
    } else if (casinoTabUrls.some(url => path.startsWith(url))) {
      tabValue = 'casino'
    } else if (path === AppRoutePath.MARKETPLACE()) {
      tabValue = 'marketplace'
    }
    setValue(tabValue)
  }, [location.pathname])

  const handleChange = (newValue: string) => {
    if (!isUserAuthenticated && (newValue === 'wallet' || newValue === 'account')) {
      dispatch(changeGlobalUserLoginModalOpen(true))
      return
    }

    // If clicking on chat tab that's already active, re-trigger
    if (newValue === 'chat' && value === 'chat') {
      setIsSideBarOpen(false)
      setValue('')
      return
    }

    if (newValue !== 'menu' && isSideBarOpen) {
      setIsSideBarOpen(false)
    }
    setValue(newValue)
    const currentPath = location.pathname
    const isCasinoRoute = casinoTabUrls.some(url => currentPath.startsWith(url))
    const isWalletRoute = walletRoutes.includes(currentPath)

    const isCurrentTab =
      (newValue === 'account' &&
        currentPath.startsWith(AppRoutePath.ACCOUNT_MOBILE_PAGE()) &&
        !isWalletRoute) ||
      (newValue === 'wallet' &&
        (currentPath.startsWith(AppRoutePath.WALLET_MOBILE_PAGE()) || isWalletRoute)) ||
      (newValue === 'sports' && currentPath.startsWith(AppRoutePath.SPORT())) ||
      (newValue === 'casino' && isCasinoRoute) ||
      (newValue === 'marketplace' && currentPath === AppRoutePath.MARKETPLACE()) ||
      (newValue === 'lobby' && currentPath === AppRoutePath.HOME())
    dispatch(changeGlobalDepositModal(false))

    if (!isCurrentTab) {
      switch (newValue) {
        case 'account':
          navigate(AppRoutePath.ACCOUNT_MOBILE_PAGE())
          break
        case 'wallet':
          navigate(AppRoutePath.WALLET_MOBILE_PAGE())
          break
        case 'marketplace':
          navigate(AppRoutePath.MARKETPLACE())
          break
        case 'sports':
          navigate(AppRoutePath.SPORT())
          break
        case 'casino':
          navigate(AppRoutePath.CASINO())
          break
      }
    }
  }

  const handleMenuClick = (event: React.MouseEvent) => {
    if (value === 'chat') setValue('')
    event.preventDefault()
    event.stopPropagation()
    setIsSideBarOpen(!isSideBarOpen)
  }

  return (
    <MenuContainer ref={sidebarRef}>
      <TabsContainer>
        <TabsWrapper value={value}>
          {visibleTabs.map(({ tabValue, label }, index) => {
            const isMenuTab = tabValue === 'menu'
            const isSelected = tabValue === value && !isMenuTab

            return (
              <TabItem
                key={index}
                isSelected={isSelected}
                data-testid={`${NAV_TEST_IDS.bottomMenu.tab}.${tabValue}`}
                onClick={e => {
                  e.preventDefault()
                  if (isMenuTab) {
                    handleMenuClick(e)
                  } else {
                    handleChange(tabValue)
                  }
                }}
                aria-selected={isSelected}
                {...a11yProps(index)}
              >
                {isMenuTab && (
                  <BurgerMenuContainer>
                    <HamburgerIcon $isOpen={isSideBarOpen}>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </HamburgerIcon>
                  </BurgerMenuContainer>
                )}

                {!isMenuTab && (
                  <IconContainer>
                    {renderTabIcon(
                      tabValue,
                      value,
                      theme.colors.text.primary,
                      theme.colors.text.secondary
                    )}
                  </IconContainer>
                )}
                <MenuText>{t(label)}</MenuText>
              </TabItem>
            )
          })}
        </TabsWrapper>
      </TabsContainer>
    </MenuContainer>
  )
}

export default BottomMenuMobile

// Styled Components
const MenuContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.bg.tertiary};
`

const TabsContainer = styled.div`
  border-bottom: 1px solid;
  border-color: divider;
`

const TabsWrapper = styled.div<{ value: string }>`
  display: flex;
  position: relative;
  justify-content: space-between;
  height: 60px;
  position: relative;
  border-top: 1px solid ${({ theme }) => theme.colors.surface.hover};
`

const TabItem = styled.button<{ isSelected: boolean }>`
  flex: 1;
  min-width: 0px;
  min-height: 0px;
  justify-content: space-between;
  padding: 11px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.text.primary : theme.colors.text.secondary};
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

const IconContainer = styled.div`
  color: ${({ theme }) => theme.colors.text.tertiary};
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px !important;
`

const MenuText = styled.span`
  font-weight: 600;
  font-size: ${fontSize.xs};
  line-height: 12px;
  letter-spacing: 0px;
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: uppercase;
`

const BurgerMenuContainer = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const HamburgerIcon = styled.div<{ $isOpen: boolean }>`
  width: 12px;
  height: 8px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;

  span {
    display: block;
    position: absolute;
    height: 1px;
    width: 100%;
    background: currentColor;
    border-radius: 2px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;
  }

  span:nth-child(1) {
    top: 0px;
  }

  span:nth-child(2),
  span:nth-child(3) {
    top: 3px;
  }

  span:nth-child(4) {
    top: 6px;
  }

  ${({ $isOpen }) =>
    $isOpen &&
    `
    span:nth-child(1) {
      top: 3px;
      width: 0%;
      left: 50%;
    }
    span:nth-child(2) {
      transform: rotate(45deg);
    }
    span:nth-child(3) {
      transform: rotate(-45deg);
    }
    span:nth-child(4) {
      top: 3px;
      width: 0%;
      left: 50%;
    }
  `}
`
