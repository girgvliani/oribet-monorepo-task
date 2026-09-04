import { useMediaQuery } from './useMediaQuery'

/**
 * CSS-based mobile detection. Prefer this over `isMobile` from react-device-detect
 * for consistent behavior and SSR compatibility.
 *
 * Uses 768px breakpoint (matches `breakpoints.md` from @oribet/ui tokens).
 */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
