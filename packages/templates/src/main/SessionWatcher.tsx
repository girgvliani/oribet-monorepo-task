import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { useLogout } from '@oribet/core/hooks/user/useLogout'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { SessionConfig, markActivity, isIdleExpired } from '@oribet/core/util/session'

// Activity signals that reset the inactivity clock.
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'mousemove', 'scroll', 'touchstart', 'wheel']
// Don't hammer localStorage on every mousemove — record activity at most this often.
const ACTIVITY_THROTTLE_MS = 5_000
// How often to re-check the idle clock.
const CHECK_INTERVAL_MS = 15_000

/**
 * ORI-462 inactivity watcher. Mount ONCE inside the app shell's Router + SnackbarProvider
 * (so it can navigate + toast). Active only when a user is authorized and the brand set
 * `inactivityTimeoutMinutes > 0` via `configureSession` (korea only today). Tracks a shared
 * `lastActivityAt` timestamp in localStorage so activity in ANY tab keeps the whole session
 * alive; logs out (toast + redirect) once the idle window elapses. Cross-tab aware: a logout
 * in one tab (auth localStorage cleared) logs the others out too.
 */
const SessionWatcher = (): null => {
  const isUserAuthorized = useAppSelector(state => state.user.isUserAuthorized)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const logout = useLogout()

  const lastWriteRef = useRef(0)
  const loggingOutRef = useRef(false)

  useEffect(() => {
    const enabled = SessionConfig.inactivityTimeoutMinutes > 0
    if (!enabled || !isUserAuthorized) return

    loggingOutRef.current = false

    const expire = async () => {
      if (loggingOutRef.current) return
      loggingOutRef.current = true
      enqueueSnackbar(t('session.expired'), { variant: 'warning' })
      await logout()
      navigate(AppRoutePath.HOME())
    }

    // Seed a fresh clock for this mount (login / reload / restored tab counts as activity).
    markActivity()
    lastWriteRef.current = Date.now()

    const onActivity = () => {
      const now = Date.now()
      if (now - lastWriteRef.current < ACTIVITY_THROTTLE_MS) return
      lastWriteRef.current = now
      markActivity()
    }
    ACTIVITY_EVENTS.forEach(evt => window.addEventListener(evt, onActivity, { passive: true }))

    const check = () => {
      if (isIdleExpired()) void expire()
    }
    const intervalId = window.setInterval(check, CHECK_INTERVAL_MS)

    // Re-check the moment the tab is focused again (interval may have been throttled while hidden).
    const onVisibility = () => {
      if (document.visibilityState === 'visible') check()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Cross-tab logout: another tab clearing the auth token fires a storage event here.
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) void expire()
    }
    window.addEventListener('storage', onStorage)

    return () => {
      ACTIVITY_EVENTS.forEach(evt => window.removeEventListener(evt, onActivity))
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('storage', onStorage)
    }
  }, [isUserAuthorized, enqueueSnackbar, t, logout, navigate])

  return null
}

export default SessionWatcher
