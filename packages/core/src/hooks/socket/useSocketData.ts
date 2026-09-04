import { socket } from '../../api/oribet.socket'
import { useSyncExternalStore } from 'react'

interface SocketSubscription<T> {
  data: T
  listeners: Set<() => void>
}

const subscriptions = new Map<string, SocketSubscription<any>>()

function getOrCreateSubscription<T>(
  event: string,
  initialValue: T,
  processData: (incoming: any, current: T) => T
): SocketSubscription<T> {
  if (subscriptions.has(event)) {
    return subscriptions.get(event)!
  }

  const sub: SocketSubscription<T> = {
    data: initialValue,
    listeners: new Set(),
  }

  subscriptions.set(event, sub)

  socket.on(event, (payload: any) => {
    sub.data = processData(payload, sub.data)
    sub.listeners.forEach(cb => cb())
  })

  return sub
}

export function setSocketData<T>(event: string, data: T): void {
  const sub = subscriptions.get(event)
  if (sub) {
    sub.data = data
    sub.listeners.forEach(cb => cb())
  }
}

export function useSocketData<T>(
  event: string,
  initialValue: T,
  processData: (incoming: any, current: T) => T
): T {
  const sub = getOrCreateSubscription(event, initialValue, processData)

  return useSyncExternalStore(
    onStoreChange => {
      sub.listeners.add(onStoreChange)
      return () => {
        sub.listeners.delete(onStoreChange)
      }
    },
    () => sub.data
  )
}
