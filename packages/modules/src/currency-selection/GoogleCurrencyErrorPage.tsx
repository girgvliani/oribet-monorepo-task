import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@oribet/core/redux/hooks'
import {
  changeGlobalCurrencySelectionModalOpen,
  changeGlobalUserRegistrationAndLoginModalClose,
} from '@oribet/core/redux/slices/userSlice'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { GOOGLE_PLAYER_NEEDS_WALLET_ERROR } from '@oribet/core/util/googleAuth'

/**
 * Handles the Google social-auth ERROR callback (no access token in the path), e.g.
 * `/auth/social/google/?error_type=player_not_registered_need_wallet`. The backend
 * sends a brand-new player here when they have no wallet yet.
 *
 * Renders nothing: it opens the currency picker and bounces to the localized home so
 * the modal shows over the lobby. Confirming the picker re-hits Google with
 * `player_cur`. The success callback (`/auth/social/:type/:access_token`) is handled
 * separately by `GoogleAuthContainer`.
 */
const GoogleCurrencyErrorPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('error_type') === GOOGLE_PLAYER_NEEDS_WALLET_ERROR) {
      dispatch(changeGlobalUserRegistrationAndLoginModalClose())
      dispatch(changeGlobalCurrencySelectionModalOpen(true))
    }
    navigate(AppRoutePath.HOME(), { replace: true })
  }, [])

  return <div />
}

export default GoogleCurrencyErrorPage
