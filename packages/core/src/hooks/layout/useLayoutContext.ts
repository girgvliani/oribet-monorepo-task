import { createContext, useContext } from 'react'

export interface LayoutOption {
  key: string
  label: string
}

export interface LayoutContextValue {
  currentLayoutKey: string
  setLayoutKey: (key: string) => void
  options: LayoutOption[]
}

/**
 * Holds the currently-selected page layout key and the metadata needed by UI surfaces
 * (e.g. the ThemeSwitcher's Layouts section) to render a switcher. The actual layout
 * components are not in this context — they live behind a separate registry in
 * `@oribet/templates/main` to avoid pulling React component types into core.
 */
export const LayoutContext = createContext<LayoutContextValue | null>(null)

/**
 * Read the current layout selection. Returns `null` when no `LayoutProvider` is mounted —
 * UI consumers (e.g. ThemeSwitcher) should treat that as "no layout switching available"
 * and skip rendering their switcher.
 */
export const useLayoutContext = (): LayoutContextValue | null => useContext(LayoutContext)
