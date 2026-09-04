import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch } from '@oribet/core/redux/hooks'
import { changeGlobalCurrencySelectionModalOpen } from '@oribet/core/redux/slices/userSlice'
import { GOOGLE_PLAYER_NEEDS_WALLET_ERROR } from '@oribet/core/util/googleAuth'

/**
 * Drives the reactive half of the Google currency flow: when a Google callback comes
 * back with `?error_type=player_not_registered_need_wallet` (a brand-new player with no
 * wallet), this opens the currency-selection modal and strips the param so it doesn't
 * re-fire on refresh/back. Confirming the picker re-hits Google with `player_cur` set.
 *
 * Call once from each app shell/layout — it works regardless of which URL the backend
 * lands on, since the layout renders across all routes.
 */
export const useGoogleCurrencyPrompt = (): void => {
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('error_type') !== GOOGLE_PLAYER_NEEDS_WALLET_ERROR) return

    dispatch(changeGlobalCurrencySelectionModalOpen(true))

    params.delete('error_type')
    const search = params.toString()
    window.history.replaceState(
      window.history.state,
      '',
      location.pathname + (search ? `?${search}` : '') + location.hash
    )
  }, [location.search, location.pathname, location.hash, dispatch])
}
