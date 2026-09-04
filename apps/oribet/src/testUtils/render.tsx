import type { ReactElement, ReactNode } from 'react'
import {
  render as rtlRender,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
  cleanup,
  type RenderOptions,
} from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { oribetTheme } from '@styles/theme/themes/oribet'

/**
 * Themed `render` for component tests.
 *
 * Every shared primitive reads `theme.colors.*` in its styled template, so rendering one
 * without a ThemeProvider throws "Cannot read properties of undefined (reading 'bg')". These
 * tests are CRA-era and called RTL's bare `render`, so they failed the moment the suite was
 * made to run at all. Import `render` from here instead of `@testing-library/react`.
 *
 * The RTL helpers are re-exported by name on purpose: an `export * from` alongside a local
 * `export const render` left the star export winning, so tests silently got the unthemed RTL
 * render and kept failing exactly as before.
 */
const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={oribetTheme}>{children}</ThemeProvider>
)

export const render = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  rtlRender(ui, { wrapper: Providers, ...options })

export { screen, fireEvent, waitFor, within, act, cleanup }
