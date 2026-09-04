import { Tooltip } from '@oribet/ui'
import { CasinoMenuList } from '@oribet/core/util/SidebarListHelper'
import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { getLocalizedString } from '@oribet/core/util/appUtil'
import { getGameBlocks } from '@oribet/core/api/services/Game.api'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { IOribetMenuItem } from '@oribet/core/types/common.type'
import type { ICategory, IGameBlock } from '@oribet/core/types/Game.type'
import styled from 'styled-components'
import SidebarMenuItem from './SidebarMenuItem'
import {
  getCategoryIcon,
  getCategoryRoute,
  orderCategoriesForDisplay,
} from '../../casino/categoryMaps'

/** CasinoMenuList links that are game categories — replaced by the live API category list. */
const CATEGORY_LINKS = [
  AppRoutePath.GAMELIST(),
  AppRoutePath.LIVECASINO(),
  AppRoutePath.INSTANT(),
  AppRoutePath.TABLE(),
  AppRoutePath.GAME_SHOWS(),
]

const CasinoMenuItems = ({
  isSidebarOpen,
  onMenuItemClick,
}: {
  isSidebarOpen: boolean
  onMenuItemClick: (value: IOribetMenuItem) => void
}) => {
  const { t } = useTranslation()
  const categories = useAppSelector(state => state.game.categories) as ICategory[]
  const { data: blocks = [] } = useQuery<IGameBlock[]>({
    queryKey: ['game-blocks'],
    queryFn: async () => {
      const resp = await getGameBlocks()
      return resp.data?.data ?? []
    },
    staleTime: 60_000,
  })

  const sidebarBlocks = [...blocks]
    .filter(b => b.show_in_sidebar)
    .sort((a, b) => a.position - b.position)

  // Keep the utility links (Lobby / Favourites / Recent …) but drop the hardcoded category
  // links — those are rendered from the live API category list below.
  const staticItems = CasinoMenuList.filter(item => !CATEGORY_LINKS.includes(item.link))
  const orderedCategories = orderCategoriesForDisplay(categories)

  return (
    <>
      {staticItems.map((menuItem: IOribetMenuItem, index: number) => {
        const isSelected = menuItem.link === window.location.pathname
        return (
          <Tooltip
            title={isSidebarOpen ? '' : t(menuItem.text)}
            key={`static-${index}`}
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
      })}
      {orderedCategories.map(category => {
        const link = getCategoryRoute(category.slug)
        const isSelected = link === window.location.pathname
        const label = getLocalizedString(category.title)
        const Icon = getCategoryIcon(category.slug)
        return (
          <Tooltip
            title={isSidebarOpen ? '' : label}
            key={`category-${category.slug}`}
            arrow={true}
            placement="right"
          >
            <SidebarMenuItem
              icon={
                Icon ? (
                  <Icon />
                ) : category.img ? (
                  <BlockLogo src={resolveImageUrl(category.img)} alt={label} />
                ) : (
                  <BlockLogoFallback />
                )
              }
              label={label}
              dataKey={category.slug}
              isSideBarOpened={isSidebarOpen}
              selected={isSelected}
              onClick={() => onMenuItemClick({ icon: () => null, link, text: label })}
            />
          </Tooltip>
        )
      })}
      {sidebarBlocks.map(block => {
        const link = AppRoutePath.BLOCK(block.slug)
        const isSelected = link === window.location.pathname
        const blockName = getLocalizedString(block.name)
        return (
          <Tooltip
            title={isSidebarOpen ? '' : blockName}
            key={`block-${block.id}`}
            arrow={true}
            placement="right"
          >
            <SidebarMenuItem
              icon={
                block.logo ? (
                  <BlockLogo src={resolveImageUrl(block.logo)} alt={blockName} />
                ) : (
                  <BlockLogoFallback />
                )
              }
              label={blockName}
              dataKey={block.slug}
              isSideBarOpened={isSidebarOpen}
              selected={isSelected}
              onClick={() =>
                onMenuItemClick({
                  icon: () => null,
                  link,
                  text: blockName,
                })
              }
            />
          </Tooltip>
        )
      })}
    </>
  )
}

export default CasinoMenuItems

const BlockLogo = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
`

const BlockLogoFallback = styled.div`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`
