import { AtomLiveBox } from '@oribet/assets/atoms/AtomLiveBox'
import { AtomNewBox } from '@oribet/assets/atoms/AtomNewBox'
import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { NAV_TEST_IDS } from '@oribet/test-ids'

interface IMenuItemProps {
  selected?: boolean
  isSideBarOpened?: boolean
  isHidden?: boolean
  icon: ReactNode
  label: string
  onClick?: () => void
  hasLiveIcon?: boolean
  hasNewIcon?: boolean
  testId?: string
  dataKey?: string
}

const SidebarMenuItem: FC<IMenuItemProps> = ({
  isHidden,
  isSideBarOpened,
  selected,
  icon,
  label,
  onClick,
  hasLiveIcon,
  hasNewIcon,
  testId = NAV_TEST_IDS.sidebar.menuItem,
  dataKey,
}) => {
  return (
    <StyledMenuItem
      $hidden={isHidden}
      $selected={selected}
      onClick={onClick}
      $isSideBarOpened={isSideBarOpened}
      data-testid={`${testId}.${dataKey ?? label}`}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {icon}
      <StyledLabelWrapper $isSideBarOpened={isSideBarOpened}>
        <StyledLabel>{label}</StyledLabel>

        {hasLiveIcon && <AtomLiveBox />}
        {hasNewIcon && (
          <StyledNewIconWrapper>
            <AtomNewBox />
          </StyledNewIconWrapper>
        )}
      </StyledLabelWrapper>
    </StyledMenuItem>
  )
}

export default React.memo(SidebarMenuItem)

const StyledMenuItem = styled.div<{
  $selected?: boolean
  $isSideBarOpened?: boolean
  $hidden?: boolean
}>`
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: ${({ $isSideBarOpened }) => ($isSideBarOpened ? 'flex-start' : 'center')};
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.bg.secondary : 'transparent'};
  padding: 8px;
  cursor: pointer;
  box-sizing: border-box;
  width: ${({ $isSideBarOpened }) => ($isSideBarOpened ? '100%' : '32px')};

  > svg:first-child {
    flex-shrink: 0;
    fill: ${({ $selected, theme }) =>
      $selected ? theme.colors.text.primary : theme.colors.text.tertiary};
    path {
      fill: ${({ $selected, theme }) =>
        $selected ? theme.colors.text.primary : theme.colors.text.tertiary};
    }
  }

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.text.primary};

      > svg:first-child {
        fill: ${({ theme }) => theme.colors.text.primary};
        path {
          fill: ${({ theme }) => theme.colors.text.primary};
        }
      }
    }
  }
`

const StyledLabelWrapper = styled.div<{ $isSideBarOpened?: boolean }>`
  display: ${({ $isSideBarOpened }) => ($isSideBarOpened ? 'flex' : 'none')};
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  max-width: ${({ $isSideBarOpened }) => ($isSideBarOpened ? '100%' : '0')};
  opacity: ${({ $isSideBarOpened }) => ($isSideBarOpened ? '1' : '0')};
  white-space: nowrap;
  margin-left: ${({ $isSideBarOpened }) => ($isSideBarOpened ? '12px' : '0')};
`

const StyledNewIconWrapper = styled.div`
  // margin-right: 10px;
`

const StyledLabel = styled.span`
  font-weight: 600;
  font-size: ${fontSize.base};
  line-height: 24px;
  letter-spacing: 0px;
  color: ${({ theme }) => theme.colors.text.primary};
`
