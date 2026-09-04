import { useEffect, useState } from 'react'
import { useNotificationUpdates } from '../../api/oribet.socket'
import { MarkAllAsRead } from '../../api/services/Notification.api'
import useFetchNotifications from './useFetchNotifications'

/**
 * Tracks whether there are unread notifications (for the bell dot) and exposes a
 * mark-all-read action. Mirrors the dot logic in `CenteredNavNotificationButton`
 * so multiple header bells can share it. `hasNew` turns true when any fetched
 * notification lacks `read_at` or a live socket push arrives; `markAllRead`
 * clears it via the REST endpoint.
 */
export const useNotificationUnread = () => {
  const socketNotification = useNotificationUpdates()
  const { data: fetched } = useFetchNotifications()
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    if (!fetched) return
    setHasNew(fetched.some(n => !n.read_at))
  }, [fetched])

  useEffect(() => {
    if (socketNotification) setHasNew(true)
  }, [socketNotification])

  const markAllRead = () => {
    if (!hasNew) return
    MarkAllAsRead()
      .then(() => setHasNew(false))
      .catch(() => {})
  }

  return { hasNew, markAllRead }
}

export default useNotificationUnread
