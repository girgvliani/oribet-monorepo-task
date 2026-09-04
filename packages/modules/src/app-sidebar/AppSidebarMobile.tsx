import { IconCherry } from '@oribet/assets/icons/IconCherry'
import { IconSportSoccer } from '@oribet/assets/icons/IconSportSoccer'
import { LanguageSelectBox } from '@oribet/modules/language-select'
import SidebarMenuItem from './sidebarMenu/SidebarMenuItem'
import { IconLobby } from '@oribet/assets/icons/IconLobby'
import { MobileContainer } from '@oribet/ui'
import { CasinoMenuList, SidebarSportItems } from '@oribet/core/util/SidebarListHelper'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { IOribetMenuItem } from '@oribet/core/types/common.type'
import { NAV_TEST_IDS } from '@oribet/test-ids'
import { fontSize } from '@oribet/ui'

interface SidebarProps {
  isSidebarOpen: boolean
  toggleSidebar: (value: boolean) => void
  isUserAuthenticated: boolean
}

const AppSidebarMobile: React.FC<SidebarProps> = ({
  isSidebarOpen,
  toggleSidebar,
  isUserAuthenticated,
}) => {
  const currentPath = window.location.pathname
  const navigate = useNavigate()
  const theme = useTheme()
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

    toggleSidebar(false)
  }

  return (
    <MobileContainer open={isSidebarOpen} setOpen={toggleSidebar}>
      <StyledRootContainer>
        {/* Lobby only — same reduction as the desktop sidebar. */}
        <ContentContainer>
          <MenuContainer>
            <SidebarMenuItem
              icon={<IconLobby />}
              label={t('oribetMenu.lobby')}
              dataKey="lobby"
              selected={window.location.pathname === AppRoutePath.HOME()}
              isSideBarOpened={true}
              onClick={() => {
                navigate(AppRoutePath.HOME())
                toggleSidebar(false)
              }}
            />
          </MenuContainer>
          <MenuContainer>
            <LanguageContainer>
              <LanguageSelectBox isSidebarOpen={true} />
            </LanguageContainer>
          </MenuContainer>
        </ContentContainer>
      </StyledRootContainer>
    </MobileContainer>
  )
}

export default AppSidebarMobile

// Navigation item components
export const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.lg};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface.borderSubtle};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    margin-right: 16px;
    width: 20px;
    height: 20px;
  }
`

export const NavItemActive = styled(NavItem)`
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: rgba(255, 255, 255, 0.05);
  border-left: 3px solid #e4304f;
  padding-left: 21px; /* 24px - 3px border */
`

export const Logo = styled.div`
  padding: 20px 24px;
  display: flex;
  align-items: center;

  img {
    height: 48px;
  }
`

export const BannerContainer = styled.div`
  padding: 0 16px;
  margin: 8px 0 16px;

  img {
    width: 100%;
    border-radius: 12px;
  }
`

export const CategoryContainer = styled.div`
  display: flex;
  padding: 0 16px;
  margin-bottom: 16px;

  > div {
    flex: 1;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.surface.hover};
    border-radius: 12px;
    padding: 12px;
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.surface.active};
    }

    svg {
      margin-right: 8px;
    }

    &:first-child {
      margin-right: 8px;
    }
  }
`

export const TokenDisplay = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;

  svg,
  img {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }

  span.value {
    margin-left: auto;
    color: ${({ theme }) => theme.colors.success};
  }
`

export const SectionDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.surface.borderSubtle};
  margin: 8px 0;
`

// For displaying bonus amounts, like the $1500 shown in the image
export const BonusText = styled.span`
  color: ${({ theme }) => theme.colors.success};
  margin-left: 8px;
`

// For VIP Club with gold color
export const VIPText = styled.span`
  color: ${({ theme }) => theme.colors.warning};
`

const StyledRootContainer = styled.div`
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: inherit;
  background-color: ${({ theme }) => theme.colors.bg.tertiary};
  overflow: auto;
  box-sizing: border-box;
  padding: 12px 8px;
  overflow-x: hidden;
`
const SectionButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`

const MenuContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 12px;
  gap: 4px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 4px;
`

const LanguageContainer = styled.div`
  max-height: 40px;
  width: 100%;
`

const ContentContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`
