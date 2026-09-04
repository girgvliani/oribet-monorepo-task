import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { SignOut } from '../../api/services/Auth.api'
import { disconnectSocket } from '../../api/oribet.socket'
import { useAppDispatch } from '../../redux/hooks'
import {
  changeAccessToken,
  changeUserAuthorization,
  clearUserInfo,
} from '../../redux/slices/userSlice'
import { clearSession } from '../../util/session'

/**
 * Canonical logout (ORI-462). Best-effort server `SignOut`, then clears redux auth state,
 * the React Query cache, the socket, and ALL client session storage (auth localStorage keys
 * + the browser-close marker cookie + last-activity) via `clearSession`. Navigation is left
 * to the caller — this hook has no router dependency, so it's usable from the app shell too.
 * Flipping `changeUserAuthorization(false)` lets `useAppBootstrap` reconnect the socket as guest.
 */
export const useLogout = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useCallback(async () => {
    try {
      await SignOut()
    } catch {
      /* server failure must not block client-side cleanup */
    }
    dispatch(clearUserInfo())
    dispatch(changeUserAuthorization(false))
    dispatch(changeAccessToken({ expire_at: '', token: '' }))
    queryClient.clear()
    disconnectSocket()
    clearSession()
  }, [dispatch, queryClient])
}

export default useLogout
