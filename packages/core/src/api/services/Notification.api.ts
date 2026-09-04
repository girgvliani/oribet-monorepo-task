import instance from '../axios'

export const getNotifications = () => {
  return instance.get('/notifications')
}

export const MarkAllAsRead = () => {
  return instance.post('/notifications/read-all')
}
