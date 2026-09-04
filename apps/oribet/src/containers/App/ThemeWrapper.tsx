import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import { ThemeContext, type ThemeContextValue } from '@oribet/theme-config'
import type { AppTheme } from '@oribet/ui'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { oribetTheme } from '../../styles/theme/themes/oribet'
import { dedprzTheme } from '../../styles/theme/themes/dedprz'
import { draculaTheme } from '../../styles/theme/themes/dracula'
import { draculaLightTheme } from '../../styles/theme/themes/draculaLight'
import { gruvboxTheme } from '../../styles/theme/themes/gruvbox'
import { gruvboxLightTheme } from '../../styles/theme/themes/gruvboxLight'
import { nordTheme } from '../../styles/theme/themes/nord'
import { nordLightTheme } from '../../styles/theme/themes/nordLight'

export const themes: Record<string, AppTheme> = {
  oribet: oribetTheme,
  dedprz: dedprzTheme,
  dracula: draculaTheme,
  draculaLight: draculaLightTheme,
  gruvbox: gruvboxTheme,
  gruvboxLight: gruvboxLightTheme,
  nord: nordTheme,
  nordLight: nordLightTheme,
}

const themeKeysList = Object.keys(themes)

const isDemoMode = import.meta.env.VITE_IS_DEMO === 'true'

/** Demo-only: each language reveals its paired theme on switch. */
export const LANGUAGE_THEME_MAP: Record<string, string> = {
  en: 'oribet',
  kr: 'dedprz',
  es: 'dedprz',
  pt: 'gruvbox',
  ru: 'dracula',
  de: 'nord',
  ar: 'draculaLight',
  tr: 'gruvboxLight',
}

/** Maps dark themes to their light counterpart (and vice versa) */
const darkToLight: Record<string, string> = {
  dracula: 'draculaLight',
  gruvbox: 'gruvboxLight',
  nord: 'nordLight',
}
const lightToDark: Record<string, string> = Object.fromEntries(
  Object.entries(darkToLight).map(([d, l]) => [l, d])
)

function getInitialThemeKey(): string {
  const stored = localStorage.getItem('selectedTheme')
  if (stored && themes[stored]) return stored

  // Auto-detect from OS preference on first visit
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: light)').matches
  ) {
    return 'nordLight'
  }
  return 'nord'
}

const buildEffectiveTheme = (base: AppTheme, overrides: Record<string, string>): AppTheme => {
  if (Object.keys(overrides).length === 0) return base
  const cloned = cloneDeep(base)
  for (const [path, value] of Object.entries(overrides)) {
    set(cloned, `colors.${path}`, value)
  }
  return cloned
}

const ThemeWrapper = ({ children }: { children: ReactNode }) => {
  const [currentThemeKey, setCurrentThemeKey] = useState<string>(getInitialThemeKey)
  const [themeOverrides, setThemeOverrides] = useState<Record<string, string>>({})
  const language = useAppSelector(state => state.user.language)
  const didMountRef = useRef(false)

  // Demo-only: on language change (after initial mount), swap theme to the language's mapped theme.
  useEffect(() => {
    if (!isDemoMode) return
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    const target = LANGUAGE_THEME_MAP[language]
    if (target && themes[target]) {
      setCurrentThemeKey(target)
      localStorage.setItem('selectedTheme', target)
      setThemeOverrides({})
    }
  }, [language])

  // React to OS color scheme changes: swap dark↔light variant of current theme
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setCurrentThemeKey(prev => {
        if (e.matches) {
          const dark = lightToDark[prev]
          if (dark) {
            localStorage.setItem('selectedTheme', dark)
            return dark
          }
        } else {
          const light = darkToLight[prev]
          if (light) {
            localStorage.setItem('selectedTheme', light)
            return light
          }
        }
        return prev
      })
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const baseTheme = themes[currentThemeKey] ?? nordTheme

  const effectiveTheme = useMemo(
    () => buildEffectiveTheme(baseTheme, themeOverrides),
    [baseTheme, themeOverrides]
  )

  const setThemeKey = useCallback((key: string) => {
    if (themes[key]) {
      setCurrentThemeKey(key)
      localStorage.setItem('selectedTheme', key)
      setThemeOverrides({})
    }
  }, [])

  const setThemeOverride = useCallback((path: string, value: string) => {
    setThemeOverrides(prev => ({ ...prev, [path]: value }))
  }, [])

  const importOverrides = useCallback((overrides: Record<string, string>) => {
    setThemeOverrides(overrides)
  }, [])

  const clearOverrides = useCallback(() => {
    setThemeOverrides({})
  }, [])

  const getEffectiveTheme = useCallback(() => effectiveTheme, [effectiveTheme])

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      currentThemeKey,
      setThemeKey,
      themeKeys: themeKeysList,
      themes,
      themeOverrides,
      setThemeOverride,
      importOverrides,
      clearOverrides,
      getEffectiveTheme,
    }),
    [
      currentThemeKey,
      setThemeKey,
      themeOverrides,
      setThemeOverride,
      importOverrides,
      clearOverrides,
      getEffectiveTheme,
    ]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={effectiveTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeWrapper
