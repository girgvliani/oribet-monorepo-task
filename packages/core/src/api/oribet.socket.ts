import { getBaseSocketUrl, getChatSocketUrl } from './baseUrl'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { INotification } from '../types/common.type'

const isDev = import.meta.env.DEV
const log = (...args: any[]) =>
  isDev && console.log('%c[socket]', 'color: #00bcd4; font-weight: bold', ...args)

export const socket = io(getBaseSocketUrl() || 'https://ws.oribet.io', {
  withCredentials: true,
  autoConnect: false,
  // Cap reconnection attempts so a persistent failure doesn't retry forever.
  reconnection: true,
  reconnectionAttempts: 3,
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
})

// Chat socket: cap reconnection at 3 attempts — chat is optional and a persistent
// failure (e.g. CORS) must not retry forever and spam the console + network tab.
// autoConnect:false — the connection is opened only when `chat_is_enabled` (see
// connectChatSocket / useAppBootstrap), so a chat-disabled brand never opens it.
export const chatSocket = io(getChatSocketUrl(), {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 3,
})

let chatConnectErrorLogged = false
chatSocket.on('connect_error', err => {
  if (chatConnectErrorLogged) return
  chatConnectErrorLogged = true
  console.error('[chatSocket] connect_error:', err.message)
})

// After the 3rd failed attempt socket.io stops on its own; log once and don't retry.
chatSocket.io.on('reconnect_failed', () => {
  console.error('[chatSocket] giving up after 3 reconnection attempts')
})

if (isDev) {
  socket.on('connect', () => log('connected', socket.id))
  socket.on('disconnect', reason => log('disconnected', reason))
  socket.on('connect_error', err => log('connect_error', err.message))
  socket.io.on('reconnect_failed', () => log('reconnect_failed (gave up after 3 attempts)'))

  const _emit = socket.emit.bind(socket)
  socket.emit = (event: string, ...args: any[]) => {
    log('emit →', event, ...args)
    return _emit(event, ...args)
  }

  socket.onAny((event, ...args) => {
    log('recv ←', event, ...args)
  })
}

export const connectSocket = (token?: string) => {
  socket.io.opts.extraHeaders = {
    Authorization: token ? `Bearer ${token}` : '',
  }
  log('connectSocket()', token ? 'authenticated' : 'unauthenticated')
  if (socket.connected) {
    socket.disconnect().connect()
  } else {
    socket.connect()
  }
}

export const disconnectSocket = () => {
  log('disconnectSocket()')
  socket.disconnect()
}

/** Open the chat socket. No-op if already connected. Call only when chat is enabled. */
export const connectChatSocket = () => {
  if (!chatSocket.connected) {
    log('connectChatSocket()')
    chatSocket.connect()
  }
}

/** Close the chat socket. No-op if not connected. */
export const disconnectChatSocket = () => {
  if (chatSocket.connected) {
    log('disconnectChatSocket()')
    chatSocket.disconnect()
  }
}

export const useNotificationUpdates = () => {
  const [notification, setNotification] = useState<INotification | null>(null)

  const handleNotificationUpdate = (notification: INotification) => {
    setNotification(notification)
  }

  useEffect(() => {
    socket.on('notificationCreated', handleNotificationUpdate)
    return () => {
      socket.off('notificationCreated', handleNotificationUpdate)
    }
  }, [])

  return notification
}
