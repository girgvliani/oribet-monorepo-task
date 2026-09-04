import React from 'react'
import styled from 'styled-components'
import { fontSize, fontWeight, lineHeight } from '../../tokens'

interface NewTabComponentInterface {
  tabValue: string
  tabList: string[]
  setTabValue: (tabValue: string) => void
  getLabel?: (tab: string) => string
  children?: React.ReactNode
  withSoon?: boolean
  inactiveTabs?: string[]
  renderSoonComponent?: () => React.ReactNode
  getTabTestId?: (tab: string) => string
}

function NewTabComponent({
  tabValue,
  setTabValue,
  tabList,
  getLabel,
  children,
  withSoon,
  inactiveTabs,
  renderSoonComponent,
  getTabTestId
}: NewTabComponentInterface) {
  const index = tabList.indexOf(tabValue)
  const tabWidthPercentage = 100 / tabList.length
  const position = index * tabWidthPercentage

  return (
    <>
      <TabContainer role="tablist">
        <RelativeDiv>
          {tabList.map((tab) => (
            <TabItem
              key={tab}
              $width={tabWidthPercentage}
              onClick={() => setTabValue(tab)}
              role="tab"
              aria-selected={tabValue === tab}
              data-testid={getTabTestId?.(tab)}
              tabIndex={tabValue === tab ? 0 : -1}
              onKeyDown={(e) => {
                const idx = tabList.indexOf(tab)
                if (e.key === 'ArrowRight') { e.preventDefault(); setTabValue(tabList[(idx + 1) % tabList.length]) }
                if (e.key === 'ArrowLeft') { e.preventDefault(); setTabValue(tabList[(idx - 1 + tabList.length) % tabList.length]) }
              }}
            >
              <TabTitle $selected={tabValue === tab}>{getLabel ? getLabel(tab) : tab}</TabTitle>
              {withSoon &&
                inactiveTabs?.includes(tab) &&
                renderSoonComponent?.()}
            </TabItem>
          ))}
          <AnimatedElement $position={position} $width={tabWidthPercentage} />
        </RelativeDiv>
      </TabContainer>

      {children}
    </>
  )
}

export default NewTabComponent

const TabContainer = styled.div`
  width: 100%;
  height: 36px;
  padding: 2px;
  border-radius: 10px;
  margin-top: 16px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.bg.tertiary};
`

const RelativeDiv = styled.div`
  gap: 2px;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TabItem = styled.div<{ $width: number }>`
  width: ${({ $width }) => `${$width}%`};
  display: flex;
  cursor: pointer;
  align-items: center;
  border-radius: 8px;
  justify-content: center;
`

const TabTitle = styled.span<{ $selected: boolean }>`
  font-size: ${fontSize.sm};
  line-height: ${lineHeight.normal};
  font-weight: ${fontWeight.bold};
  transition: color 0.2s ease-in-out;
  z-index: 2;
  text-transform: uppercase;
  color: ${({ $selected, theme }) => ($selected ? theme.colors.text.primary : theme.colors.text.tertiary)};
`

const AnimatedElement = styled.span<{
  $position: number
  $width: number
}>`
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
  position: absolute;
  left: 0;
  top: 0px;
  bottom: 0px;
  z-index: 1;
  border-top: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  width: ${({ $width }) => `${$width}%`};
  transform: ${({ $position, $width }) => `translateX(${($position / $width) * 100}%)`};
`
