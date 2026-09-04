import { Tooltip } from '@oribet/ui'
import { SidebarSportItems } from '@oribet/core/util/SidebarListHelper'
import { useTranslation } from 'react-i18next'
import { IOribetMenuItem } from '@oribet/core/types/common.type'
import SidebarMenuItem from './SidebarMenuItem'

const SportMenuItems = ({
  isSidebarOpen,
  onMenuItemClick,
}: {
  isSidebarOpen: boolean
  onMenuItemClick: (value: IOribetMenuItem) => void
}) => {
  const { t } = useTranslation()
  return SidebarSportItems.map((menuItem: IOribetMenuItem, index: number) => {
    const isSelected = menuItem.link === window.location.pathname
    return (
      <Tooltip
        title={isSidebarOpen ? '' : t(menuItem.text)}
        key={index}
        arrow={true}
        placement="right"
      >
        <SidebarMenuItem
          icon={<menuItem.icon />}
          label={t(menuItem.text)}
          dataKey={menuItem.text}
          isHidden={!!menuItem.hidden}
          isSideBarOpened={isSidebarOpen}
          selected={isSelected}
          onClick={() => onMenuItemClick(menuItem)}
        />
      </Tooltip>
    )
  })
}

export default SportMenuItems
