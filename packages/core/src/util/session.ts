import Cookies from 'js-cookie'

/**
 * Per-client session policy (ORI-462). Build-time, set once per app in its `main.tsx`
 * via `configureSession(...)` — this is compile-time brand config, NOT env. It's read
 * from non-React code (bootstrap, the session watcher, consumeAdminToken), so it lives
 * as a module singleton mirroring `Defaults` rather than the React-context AppConfig.
 * Defaults are OFF, so brands that never call `configureSession` keep current behavior.
 */
export interface SessionConfigValue {
  /** Minutes of inactivity before auto-logout. `0` disables the inactivity watcher. */
  inactivityTimeoutMinutes: number
  /**
   * Log the user out when the browser is fully closed (but NOT on tab close), via a
   * no-expiry "session marker" cookie. `false` keeps the legacy localStorage-only auth.
   */
  browserCloseLogout: boolean
}

export const SessionConfig: SessionConfigValue = {
  inactivityTimeoutMinutes: 0,
  browserCloseLogout: false,
}

export const configureSession = (config: Partial<SessionConfigValue>): void => {
  Object.assign(SessionConfig, config)
}

/** Session-scoped cookie (no `expires`) — browsers drop it on full close, keep it on tab close. */
export const SESSION_MARKER_KEY = 'session_active'
/** Shared across tabs so activity in one tab keeps the whole session alive. */
export const LAST_ACTIVITY_KEY = 'lastActivityAt'
/** localStorage auth keys cleared on logout — single source of truth for the key set. */
export const SESSION_STORAGE_KEYS = ['token', 'isAuthorized', 'token_expire_at', 'userId', 'userInfo']

export const setSessionMarker = (): void => {
  // No `expires` ⇒ session cookie: lives for the browser session, cleared on browser close.
  Cookies.set(SESSION_MARKER_KEY, '1', { sameSite: 'lax', path: '/' })
}

export const clearSessionMarker = (): void => {
  Cookies.remove(SESSION_MARKER_KEY, { path: '/' })
}

export const hasSessionMarker = (): boolean => Boolean(Cookies.get(SESSION_MARKER_KEY))

export const markActivity = (): void => {
  try {
    window.localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
  } catch {
    /* ignore storage failures (private mode, quota) */
  }
}

export const getLastActivity = (): number => {
  const raw = window.localStorage.getItem(LAST_ACTIVITY_KEY)
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) ? parsed : 0
}

/** True when the inactivity window has elapsed since the last recorded activity. */
export const isIdleExpired = (): boolean => {
  const minutes = SessionConfig.inactivityTimeoutMinutes
  if (minutes <= 0) return false
  const last = getLastActivity()
  if (!last) return false
  return Date.now() - last >= minutes * 60_000
}

/** Clear all client session state: auth localStorage keys, last-activity, and the marker cookie. */
export const clearSession = (): void => {
  SESSION_STORAGE_KEYS.forEach(key => window.localStorage.removeItem(key))
  window.localStorage.removeItem(LAST_ACTIVITY_KEY)
  clearSessionMarker()
}
