import { SessionConfig, setSessionMarker } from './session'

const TOKEN_PARAM = 'token'

/**
 * Admin impersonation: if the URL contains `?token=<jwt>`, hydrate it as the
 * active session and strip the param from the URL. Bootstrap will validate
 * via getUserInfo and clear state if the token is bad.
 */
export const consumeAdminToken = (): void => {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const token = url.searchParams.get(TOKEN_PARAM)
  if (!token) return

  const stalePerUserKeys = ['userInfo', 'userId', 'userEmail']
  stalePerUserKeys.forEach(key => window.localStorage.removeItem(key))

  window.localStorage.setItem('token', token)
  window.localStorage.setItem('isAuthorized', 'true')
  window.localStorage.setItem(
    'token_expire_at',
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  )
  // ORI-462: mark the browser session alive so bootstrap's browser-close gate doesn't
  // immediately log out an admin-impersonation link opened in a fresh browser.
  if (SessionConfig.browserCloseLogout) setSessionMarker()

  url.searchParams.delete(TOKEN_PARAM)
  window.history.replaceState({}, '', url.toString())
}
