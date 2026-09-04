import { useAppSelector } from '@oribet/core/redux/hooks'
import { selectIsUserAuthorized } from '@oribet/core/redux/selectors'
import type { AuthVisibility } from './types'

/**
 * Module-level helper for the `visible` prop. Returns false when the module
 * should short-circuit and render nothing.
 *
 * Usage in a module that supports auth-conditional rendering:
 *   const MyModule = ({ visible }: ModuleProps) => {
 *     if (!useShouldRender(visible)) return null
 *     return ...
 *   }
 */
export const useShouldRender = (visible: AuthVisibility = 'always'): boolean => {
  const isAuthed = !!useAppSelector(selectIsUserAuthorized)
  if (visible === 'auth') return isAuthed
  if (visible === 'unauth') return !isAuthed
  return true
}
