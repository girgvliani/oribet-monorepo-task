import { Tooltip } from '@oribet/ui'
import { SupportMenuList } from '@oribet/core/util/SidebarListHelper'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useTranslation } from 'react-i18next'
import { IOribetMenuItem } from '@oribet/core/types/common.type'
import SidebarMenuItem from './SidebarMenuItem'

const SupportMenuItems = ({
  isSidebarOpen,
  onMenuItemClick,
}: {
  isSidebarOpen: boolean
  onMenuItemClick: (value: IOribetMenuItem) => void
}) => {
  const { t } = useTranslation()

  return SupportMenuList.map((menuItem: IOribetMenuItem, index: number) => {
    const isSelected = menuItem.link === window.location.pathname
    const hasNewIcon = menuItem.link === AppRoutePath.MARKETPLACE() && isSidebarOpen
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
          onClick={() => onMenuItemClick(menuItem)}
          isSideBarOpened={isSidebarOpen}
          hasNewIcon={hasNewIcon}
          selected={isSelected}
        />
      </Tooltip>
    )
  })
}
export default SupportMenuItems
