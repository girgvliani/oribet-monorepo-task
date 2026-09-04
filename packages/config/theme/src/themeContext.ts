import { createContext, useContext } from 'react'
import type { AppTheme } from '@oribet/ui'

export interface ThemeContextValue {
  currentThemeKey: string
  setThemeKey: (key: string) => void
  themeKeys: string[]
  themes: Record<string, AppTheme>
  themeOverrides: Record<string, string>
  setThemeOverride: (path: string, value: string) => void
  importOverrides: (overrides: Record<string, string>) => void
  clearOverrides: () => void
  getEffectiveTheme: () => AppTheme
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const useThemeContext = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be used within a ThemeContext.Provider')
  return ctx
}
