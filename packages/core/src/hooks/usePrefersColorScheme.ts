import { useMediaQuery } from './useMediaQuery'

/**
 * Detects the user's OS-level color scheme preference.
 * Returns 'dark' or 'light'.
 */
export const usePrefersColorScheme = (): 'dark' | 'light' => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  return prefersDark ? 'dark' : 'light'
}
