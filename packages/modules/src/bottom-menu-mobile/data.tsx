import { IconChat } from '@oribet/assets/icons/IconChat'
import { IconCherry } from '@oribet/assets/icons/IconCherry'
import { IconMarketplace } from '@oribet/assets/icons/IconMarketplace'
import { IconMenu } from '@oribet/assets/icons/IconMenu'
import { IconSportSoccer } from '@oribet/assets/icons/IconSportSoccer'
import { ReactElement } from 'react'

interface TabItem {
  tabValue: string
  label: string
}

const SELECTED_TAB_BORDER_COLOR = '#1D4ED8'
const TABBAR_BACKGROUND_COLOR = 'rgb(15 23 41)'

const TABS: TabItem[] = [
  {
    tabValue: 'menu',
    label: 'menu',
  },

  {
    tabValue: 'casino',
    label: 'casino',
  },
  {
    tabValue: 'sports',
    label: 'sport',
  },
  {
    tabValue: 'marketplace',
    label: 'marketplace',
  },
  {
    tabValue: 'chat',
    label: 'chat',
  },
]

const renderTabIcon = (
  tabValue: string,
  value: string,
  selectedColor: string,
  unselectedColor: string
): ReactElement => {
  const fill = value === tabValue ? selectedColor : unselectedColor
  const size = 16

  switch (tabValue) {
    case 'menu':
      return <IconMenu size={size} style={{ color: fill }} />
    case 'casino':
      return <IconCherry size={size} style={{ color: fill }} />
    case 'sports':
      return <IconSportSoccer style={{ color: fill }} />
    case 'chat':
      return <IconChat size={size} style={{ color: fill }} />
    case 'marketplace':
      return <IconMarketplace style={{ color: fill }} />

    default:
      return <div />
  }
}

export { renderTabIcon, SELECTED_TAB_BORDER_COLOR, TABBAR_BACKGROUND_COLOR, TABS }
