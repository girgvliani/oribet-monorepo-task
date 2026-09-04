import type { ComponentType } from 'react'
import { IconCherry } from '@oribet/assets/icons/IconCherry'
import { IconGiftBox } from '@oribet/assets/icons/IconGiftBox'
import { IconInstantGame } from '@oribet/assets/icons/IconInstantGame'
import { IconLiveCasino } from '@oribet/assets/icons/IconLiveCasino'
import { IconTableGame } from '@oribet/assets/icons/IconTableGame'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import type { IReactIcon } from '@oribet/core/types/common.type'

export const CATEGORY_ICONS: Record<string, ComponentType<IReactIcon>> = {
  slot: IconCherry,
  live: IconLiveCasino,
  table: IconTableGame,
  'game-show': IconGiftBox,
  instant: IconInstantGame,
}

export const CATEGORY_ROUTES: Record<string, () => string> = {
  slot: AppRoutePath.GAMELIST,
  live: AppRoutePath.LIVECASINO,
  table: AppRoutePath.TABLE,
  'game-show': AppRoutePath.GAME_SHOWS,
  instant: AppRoutePath.INSTANT,
}

export const CATEGORY_ORDER = ['slot', 'live', 'table', 'game-show', 'instant']

/** Icon for a category slug — a known mapping, else undefined (render text only). */
export const getCategoryIcon = (slug: string): ComponentType<IReactIcon> | undefined =>
  CATEGORY_ICONS[slug]

/** Route for a category slug — its dedicated page if known, else the generic category page. */
export const getCategoryRoute = (slug: string): string => {
  const known = CATEGORY_ROUTES[slug]
  return known ? known() : AppRoutePath.CASINO_CATEGORY(slug)
}

/**
 * API categories ordered for display: the known ones first (CATEGORY_ORDER), then any
 * others in API order — so every category the API returns is surfaced (e.g. Lottery, Other).
 */
export const orderCategoriesForDisplay = <T extends { slug: string }>(categories: T[]): T[] => {
  const known = CATEGORY_ORDER.map(slug => categories.find(c => c.slug === slug)).filter(
    (c): c is T => Boolean(c)
  )
  const rest = categories.filter(c => !CATEGORY_ORDER.includes(c.slug))
  return [...known, ...rest]
}
