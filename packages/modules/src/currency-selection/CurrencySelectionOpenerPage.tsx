import { useAppDispatch } from '@oribet/core/redux/hooks'
import {
  changeGlobalCurrencySelectionModalOpen,
  changeGlobalUserRegistrationAndLoginModalClose,
} from '@oribet/core/redux/slices/userSlice'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Route target for the Google currency-selection step (`/currency-selection`).
 * Mirrors `RegistrationModalOpenerPage`: renders nothing, closes any auth modal,
 * opens the global currency modal, then sends the user to the language-resolved home
 * so the modal shows over the lobby.
 *
 * Reached two ways: the register-tab Google button navigates here, and the backend
 * redirects here when an unregistered user starts Google login from the login tab.
 */
const CurrencySelectionOpenerPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(changeGlobalUserRegistrationAndLoginModalClose())
    dispatch(changeGlobalCurrencySelectionModalOpen(true))
    navigate(AppRoutePath.HOME())
  }, [])

  return <div />
}

export default CurrencySelectionOpenerPage
